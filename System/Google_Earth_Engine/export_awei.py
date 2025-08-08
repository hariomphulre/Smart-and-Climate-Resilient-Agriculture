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
GCS_FILE_NAME = 'Farm_AWEIsh_TimeSeries'
file_path = f'./{GCS_FILE_NAME}-00000-of-00001.csv' 

# Define Area of Interest (replace with your polygon or rectangle)
aoi = ee.Geometry.Polygon(
    [[[73.70, 18.65], [73.70, 18.66], [73.71, 18.66], [73.71, 18.65], [73.70, 18.65]]]
)

# 1. Filter Sentinel-2 Collection
s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(aoi) \
    .filterDate('2024-10-01', '2025-04-01') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

# 2. Define AWEIsh Calculation
def getAWEIsh(image):
    awei = image.expression(
        '4 * (GREEN - SWIR1) - (0.25 * NIR + 2.75 * SWIR2)', {
            'GREEN': image.select('B3'),
            'SWIR1': image.select('B11'),
            'NIR': image.select('B8'),
            'SWIR2': image.select('B12')
        }).rename('AWEIsh')
    return awei.copyProperties(image, ['system:time_start'])

# 3. Map over ImageCollection
awei_series = s2.map(getAWEIsh)

# 4. Convert to FeatureCollection with date + mean AWEIsh
def create_awei_feature(img):
    mean_dict = img.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=aoi,
        scale=10,
        maxPixels=1e9
    )
    awei_val = ee.Number(mean_dict.get('AWEIsh'))
    return ee.Feature(None, {
        'date': img.date().format('YYYY-MM-dd'),
        'awei': awei_val
    })

feature_collection = ee.FeatureCollection(awei_series.map(create_awei_feature))

# 5. Export to GCS
print(f"\nStarting export to GCS bucket: '{GCS_BUCKET_NAME}'...")
task_gcs = ee.batch.Export.table.toCloudStorage(
    collection=feature_collection,
    description='Export_AWEIsh_to_GCS',
    bucket=GCS_BUCKET_NAME,
    fileNamePrefix=GCS_FILE_NAME,
    fileFormat='CSV'
)
task_gcs.start()

print("Task started. Monitoring status...")
while task_gcs.active():
    print(f"Polling for task status... (Current: {task_gcs.status()['state']})")
    time.sleep(30)

status = task_gcs.status()
if status['state'] == 'COMPLETED':
    print("Export task completed successfully!")

    # Download file
    try:
        from google.cloud import storage
        storage_client = storage.Client()
        bucket = storage_client.bucket(GCS_BUCKET_NAME)

        blobs = list(bucket.list_blobs(prefix=GCS_FILE_NAME))
        for blob in blobs:
            if blob.name.endswith(".csv"):
                destination_file_name = f"./{os.path.basename(blob.name)}"
                blob.download_to_filename(destination_file_name)
                print(f"✅ File downloaded to: {os.path.abspath(destination_file_name)}")
                file_path = destination_file_name
                break
        else:
            print("❌ No CSV file found.")
    except Exception as e:
        print(f"Error downloading file: {e}")
else:
    print(f"Task failed: {status['state']} - {status.get('error_message', '')}")
    exit()

# 6. Plot AWEIsh Time Series
try:
    df = pd.read_csv(file_path)
    df['date'] = pd.to_datetime(df['date'])
    df.dropna(subset=['awei'], inplace=True)
    df.sort_values('date', inplace=True)

    plt.style.use('seaborn-v0_8-whitegrid')
    fig, ax = plt.subplots(figsize=(14, 7))

    ax.plot(df['date'], df['awei'], marker='o', linestyle='-', color='blue', label='Mean AWEIsh')
    ax.set_title('Mean AWEIsh Time Series (Oct 2024 - Apr 2025)', fontsize=16)
    ax.set_xlabel('Date', fontsize=12)
    ax.set_ylabel('AWEIsh', fontsize=12)
    ax.legend()
    ax.grid(True)

    fig.autofmt_xdate()
    plt.show()

except Exception as e:
    print(f"Plotting failed: {e}")
