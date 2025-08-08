import ee
import time
import os
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

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
GCS_FILE_NAME = 'Farm_CRI1_TimeSeries_with_LatLon'
file_path = f'./{GCS_FILE_NAME}-00000-of-00001.csv'

# --- AOI ---
aoi = ee.Geometry.Rectangle([73.70, 18.65, 73.71, 18.66])

# --- Image Collection ---
s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(aoi) \
    .filterDate('2025-01-01', '2025-04-01') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

# --- CRI1 Calculation ---
# CRI1 ≈ (1 / B2) - (1 / B3)
def getCRI1(image):
    blue = image.select('B2').divide(10000)
    green = image.select('B3').divide(10000)
    
    cri1 = ee.Image(1).divide(blue).subtract(ee.Image(1).divide(green)).rename('cri1')
    return cri1.copyProperties(image, ['system:time_start'])


cri1_series = s2.map(getCRI1)

# --- Feature Collection with Lat/Lon ---
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
    cri1_value = ee.Number(mean_dict.get('cri1'))

    return ee.Feature(None, {
        'date': img.date().format('YYYY-MM-dd'),
        'cri1': cri1_value,
        'longitude': lon,
        'latitude': lat
    })

feature_collection = ee.FeatureCollection(cri1_series.map(create_feature))

# --- Export to GCS ---
print(f"\nStarting export to Google Cloud Storage bucket: '{GCS_BUCKET_NAME}'...")
task_gcs = ee.batch.Export.table.toCloudStorage(
    collection=feature_collection,
    description='Export_CRI1_to_GCS',
    bucket=GCS_BUCKET_NAME,
    fileNamePrefix=GCS_FILE_NAME,
    fileFormat='CSV'
)
task_gcs.start()

print("Task started. Monitoring status (this may take a few minutes)...")
while task_gcs.active():
    print(f"Polling for task status... (Current status: {task_gcs.status()['state']})")
    time.sleep(30)

status = task_gcs.status()
if status['state'] == 'COMPLETED':
    print("Export task completed successfully!")
    print(f"File saved in GCS Bucket '{GCS_BUCKET_NAME}' with prefix '{GCS_FILE_NAME}'.")

    try:
        from google.cloud import storage
        storage_client = storage.Client()
        bucket = storage_client.bucket(GCS_BUCKET_NAME)

        blobs = list(bucket.list_blobs(prefix=GCS_FILE_NAME))
        if not blobs:
            print(f"❌ No files found in bucket with prefix: {GCS_FILE_NAME}")
            exit()

        for blob in blobs:
            print(f"📂 Found blob: {blob.name}")
            if blob.name.endswith(".csv"):
                destination_file_name = f"./{os.path.basename(blob.name)}"
                blob.download_to_filename(destination_file_name)
                print(f"✅ File downloaded to: {os.path.abspath(destination_file_name)}")
                file_path = destination_file_name
                break
        else:
            print("❌ No CSV file found in the exported blobs.")

    except ImportError:
        print("\nTo automatically download the file, please install the GCS client library:")
        print("pip install google-cloud-storage")
    except Exception as e:
        print(f"\nAn error occurred during download: {e}")

else:
    print(f"Export task failed or was cancelled. Final status: {status['state']}")
    print(f"Error message: {status.get('error_message', 'No error message provided.')}")
    exit()

# --- Plotting the Time Series ---
try:
    df = pd.read_csv(file_path)
    df['date'] = pd.to_datetime(df['date'])
    df.dropna(subset=['cri1'], inplace=True)
    df.sort_values('date', inplace=True)

    print("\nData loaded successfully:")
    print(df)

    plt.style.use('seaborn-v0_8-whitegrid')
    fig, ax = plt.subplots(figsize=(14, 7))

    ax.plot(df['date'], df['cri1'], marker='o', linestyle='-', color='purple', label='Mean CRI1')
    ax.set_title('CRI1 Time Series for Farm AOI (Jan 2025 - Apr 2025)', fontsize=16)
    ax.set_xlabel('Date', fontsize=12)
    ax.set_ylabel('CRI1 (Carotenoid Reflectance Index)', fontsize=12)
    ax.legend()
    ax.grid(True)

    fig.autofmt_xdate()
    plt.show()

except FileNotFoundError:
    print(f"Error: The file was not found at '{file_path}'")
except Exception as e:
    print(f"An error occurred during data visualization: {e}")
