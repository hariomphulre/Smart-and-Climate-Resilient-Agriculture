# export_ndsi.py
import ee
import time
import os
import pandas as pd
import matplotlib.pyplot as plt

# --- GEE Initialization ---
try:
    ee.Initialize(project='climate-resilient-agriculture',opt_url='https://earthengine-highvolume.googleapis.com')
    print("Google Earth Engine initialized successfully.")
except ee.EEException as e:
    print(f"Error initializing Earth Engine: {e}")
    print("Please make sure you have authenticated via 'earthengine authenticate'.")
    exit()

# --- Configuration ---
GCS_BUCKET_NAME = 'earth-engine-climate-data'
GCS_FILE_NAME = 'Farm_NDSI_TimeSeries_with_LatLon'
file_path = f'./{GCS_FILE_NAME}-00000-of-00001.csv'

# AOI (your farm rectangle)
aoi = ee.Geometry.Rectangle([73.70, 18.65, 73.71, 18.66])

# 1. Filter Sentinel-2 Collection
s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(aoi) \
    .filterDate('2025-01-01', '2025-04-01') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

# 2. Function to calculate Normalized Difference Soil Index (NDSI)
# NDSI = (SWIR - GREEN) / (SWIR + GREEN)
def getNDSI(image):
    green = image.select('B3')   # Green
    swir = image.select('B11')   # SWIR (shortwave infrared)
    ndsi = swir.subtract(green).divide(swir.add(green)).rename('ndsi')
    return ndsi.copyProperties(image, ['system:time_start'])

# 3. Map NDSI function
ndsi_series = s2.map(getNDSI)

def create_feature(img):
    mean_dict = img.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=aoi,
        scale=10,
        maxPixels=1e9
    )
    centroid = aoi.centroid().coordinates()
    lon = ee.Number(centroid.get(0))
    lat = ee.Number(centroid.get(1))
    ndsi_value = ee.Number(mean_dict.get('ndsi'))

    return ee.Feature(None, {
        'date': img.date().format('YYYY-MM-dd'),
        'ndsi': ndsi_value,
        'longitude': lon,
        'latitude': lat
    })

feature_collection = ee.FeatureCollection(ndsi_series.map(create_feature))

# 4. Export to GCS
print(f"\nStarting export to Google Cloud Storage bucket: '{GCS_BUCKET_NAME}'...")
task_gcs = ee.batch.Export.table.toCloudStorage(
    collection=feature_collection,
    description='Export_NDSI_to_GCS',
    bucket=GCS_BUCKET_NAME,
    fileNamePrefix=GCS_FILE_NAME,
    fileFormat='CSV'
)
task_gcs.start()

print("Task started. Monitoring status...")
while task_gcs.active():
    print(f"Polling for task status... (Current status: {task_gcs.status()['state']})")
    # time.sleep(3)

status = task_gcs.status()
if status['state'] == 'COMPLETED':
    print("Export completed!")
    try:
        from google.cloud import storage
        storage_client = storage.Client()
        bucket = storage_client.bucket(GCS_BUCKET_NAME)

        blobs = list(bucket.list_blobs(prefix=GCS_FILE_NAME))
        if not blobs:
            print(f"❌ No files found in bucket with prefix: {GCS_FILE_NAME}")
            exit()

        for blob in blobs:
            if blob.name.endswith(".csv"):
                destination_file_name = f"./{os.path.basename(blob.name)}"
                blob.download_to_filename(destination_file_name)
                print(f"✅ File downloaded to: {os.path.abspath(destination_file_name)}")
                file_path = destination_file_name
                break
        else:
            print("❌ No CSV file found.")

    except ImportError:
        print("\nPlease install the GCS client library:")
        print("pip install google-cloud-storage")
    except Exception as e:
        print(f"\nAn error occurred: {e}")

else:
    print(f"Export task failed. Status: {status['state']}")
    print(f"Error: {status.get('error_message', 'No message')}")
    exit()

# 5. Visualization
try:
    df = pd.read_csv(file_path)
    df['date'] = pd.to_datetime(df['date'])
    df.dropna(subset=['ndsi'], inplace=True)
    df.sort_values('date', inplace=True)

    print("\nData loaded:")
    print(df)

    plt.style.use('seaborn-v0_8-whitegrid')
    fig, ax = plt.subplots(figsize=(14, 7))
    ax.plot(df['date'], df['ndsi'], marker='o', linestyle='-', color='green', label='Mean NDSI')
    ax.set_title('Normalized Difference Soil Index (NDSI) Time Series for Farm AOI (Jan - Apr 2025)', fontsize=16)
    ax.set_xlabel('Date')
    ax.set_ylabel('NDSI')
    ax.legend()
    ax.grid(True)
    fig.autofmt_xdate()
    plt.show()

except FileNotFoundError:
    print(f"❌ File not found at '{file_path}'")
except Exception as e:
    print(f"An error occurred during visualization: {e}")
