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
GCS_FILE_NAME = 'Farm_BSI_TimeSeries_with_LatLon'
file_path = f'./{GCS_FILE_NAME}-00000-of-00001.csv'

# Define AOI
aoi = ee.Geometry.Rectangle([73.70, 18.65, 73.71, 18.66])

# --- Sentinel-2 Collection ---
s2 = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
      .filterBounds(aoi)
      .filterDate('2025-01-01', '2025-04-01')
      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
     )

# --- Compute BSI Function ---
def getBSI(image):
    # Convert to reflectance scale (0-1)
    img = image.select(['B2','B4','B8','B11']).toFloat().divide(10000)
    blue = img.select('B2')
    red = img.select('B4')
    nir = img.select('B8')
    swir = img.select('B11')
    
    # BSI = ((SWIR + Red) - (NIR + Blue)) / ((SWIR + Red) + (NIR + Blue))
    bsi = swir.add(red).subtract(nir.add(blue)).divide(swir.add(red).add(nir).add(blue)).rename('bsi')
    
    return bsi.copyProperties(image, ['system:time_start'])

# Map BSI computation
bsi_series = s2.map(getBSI)

# --- Create FeatureCollection ---
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
    bsi_value = ee.Number(mean_dict.get('bsi'))
    
    return ee.Feature(None, {
        'date': img.date().format('YYYY-MM-dd'),
        'bsi': bsi_value,
        'longitude': lon,
        'latitude': lat
    })

feature_collection = ee.FeatureCollection(bsi_series.map(create_feature))

# --- Export to GCS ---
print(f"\nStarting export to Google Cloud Storage bucket: '{GCS_BUCKET_NAME}'...")
task_gcs = ee.batch.Export.table.toCloudStorage(
    collection=feature_collection,
    description='Export_BSI_to_GCS',
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

    # Download from GCS
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
            print("❌ No CSV file found in the exported blobs.")
    except Exception as e:
        print(f"An error occurred during download: {e}")

else:
    print(f"Export task failed or was cancelled. Status: {status['state']}")
    exit()

# --- Data Visualization ---
try:
    df = pd.read_csv(file_path)
    df['date'] = pd.to_datetime(df['date'])
    df.dropna(subset=['bsi'], inplace=True)
    df.sort_values('date', inplace=True)

    # Plot BSI time-series
    plt.style.use('seaborn-v0_8-whitegrid')
    fig, ax = plt.subplots(figsize=(14,7))
    ax.plot(df['date'], df['bsi'], marker='o', linestyle='-', color='brown', label='Mean BSI')
    ax.set_title('Bare Soil Index (BSI) Time Series for Farm AOI', fontsize=16)
    ax.set_xlabel('Date', fontsize=12)
    ax.set_ylabel('bsi', fontsize=12)
    ax.set_ylim(-1, 1)
    ax.grid(True)
    ax.legend()
    fig.autofmt_xdate()
    plt.show()

except FileNotFoundError:
    print(f"Error: The file was not found at '{file_path}'")
except Exception as e:
    print(f"An error occurred during data visualization: {e}")
