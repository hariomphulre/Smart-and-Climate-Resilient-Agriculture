# export_smi.py
import ee
import time
import os
import pandas as pd
import matplotlib.pyplot as plt

# --- GEE Initialization ---
try:
    ee.Initialize(opt_url='https://earthengine-highvolume.googleapis.com')
    print("Google Earth Engine initialized successfully.")
except ee.EEException as e:
    print(f"Error initializing Earth Engine: {e}")
    print("Please make sure you have authenticated via 'earthengine authenticate'.")
    exit()

# --- Configuration ---
GCS_BUCKET_NAME = 'earth-engine-climate-data'
GCS_FILE_NAME = 'Farm_SMI_TimeSeries_with_LatLon'
file_path = f'./{GCS_FILE_NAME}-00000-of-00001.csv'

# AOI
aoi = ee.Geometry.Rectangle([73.70, 18.65, 73.71, 18.66])

# 1. Filter Sentinel-2 Collection
s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(aoi) \
    .filterDate('2025-01-01', '2025-04-01') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

# 2. Function to calculate Soil Moisture Index (SMI)
def getSMI(image):
    smi = image.normalizedDifference(['B8', 'B11']).rename('smi')
    return smi.copyProperties(image, ['system:time_start'])

# 3. Map SMI function
smi_series = s2.map(getSMI)

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
    smi_value = ee.Number(mean_dict.get('smi'))

    return ee.Feature(None, {
        'date': img.date().format('YYYY-MM-dd'),
        'smi': smi_value,
        'longitude': lon,
        'latitude': lat
    })

feature_collection = ee.FeatureCollection(smi_series.map(create_feature))

# 4. Export to GCS
print(f"\nStarting export to Google Cloud Storage bucket: '{GCS_BUCKET_NAME}'...")
task_gcs = ee.batch.Export.table.toCloudStorage(
    collection=feature_collection,
    description='Export_SMI_to_GCS',
    bucket=GCS_BUCKET_NAME,
    fileNamePrefix=GCS_FILE_NAME,
    fileFormat='CSV'
)
task_gcs.start()

print("Task started. Monitoring status...")
while task_gcs.active():
    print(f"Polling for task status... (Current status: {task_gcs.status()['state']})")
    time.sleep(30)

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
    df.dropna(subset=['smi'], inplace=True)
    df.sort_values('date', inplace=True)

    print("\nData loaded:")
    print(df)

    plt.style.use('seaborn-v0_8-whitegrid')
    fig, ax = plt.subplots(figsize=(14, 7))
    ax.plot(df['date'], df['smi'], marker='o', linestyle='-', color='purple', label='Mean Soil Moisture Index')
    ax.set_title('SMI (Soil Moisture Index) Time Series for Farm AOI (Jan - Apr 2025)', fontsize=16)
    ax.set_xlabel('Date')
    ax.set_ylabel('SMI')
    ax.set_ylim(-1, 1)
    ax.legend()
    ax.grid(True)
    fig.autofmt_xdate()
    plt.show()

except FileNotFoundError:
    print(f"❌ File not found at '{file_path}'")
except Exception as e:
    print(f"An error occurred during visualization: {e}")
