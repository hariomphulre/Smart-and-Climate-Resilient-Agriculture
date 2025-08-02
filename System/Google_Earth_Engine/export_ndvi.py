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
GCS_FILE_NAME = 'Farm_NDVI_TimeSeries_with_LatLon_new'
file_path = f'./{GCS_FILE_NAME}-00000-of-00001.csv' 


aoi2 = ee.Geometry.Rectangle([73.70, 18.65, 73.71, 18.66])

# 1. Filter the Sentinel-2 Image Collection
s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
    .filterBounds(aoi2) \
    .filterDate('2025-01-01', '2025-04-01') \
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))

# 2. Define a function to calculate NDVI
def getNDVI(image):
    ndvi = image.normalizedDifference(['B8', 'B4']).rename('ndvi')
    return ndvi.copyProperties(image, ['system:time_start'])

# 3. Map the function over the collection
ndvi_series = s2.map(getNDVI)

def create_feature(img):
    mean_dict = img.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=aoi2,
        scale=10,
        maxPixels=1e9
    )
    
    # Get the centroid of the AOI
    centroid = aoi2.centroid().coordinates()
    lon = ee.Number(centroid.get(0))
    lat = ee.Number(centroid.get(1))
    
    ndvi_value = ee.Number(mean_dict.get('ndvi'))
    
    return ee.Feature(None, {
        'date': img.date().format('YYYY-MM-dd'),
        'ndvi': ndvi_value,
        'longitude': lon,
        'latitude': lat
    })

feature_collection = ee.FeatureCollection(ndvi_series.map(create_feature))

# --- Exporting the Data ---
print(f"\nStarting export to Google Cloud Storage bucket: '{GCS_BUCKET_NAME}'...")
task_gcs = ee.batch.Export.table.toCloudStorage(
    collection=feature_collection,
    description='Export_NDVI_to_GCS',
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
    
    # Automatically download the file from GCS to your local system
    # try:
    #     from google.cloud import storage
    #     storage_client = storage.Client()
    #     bucket = storage_client.bucket(GCS_BUCKET_NAME)
        
    #     blob_name_to_download = None
    #     for blob in bucket.list_blobs(prefix=GCS_FILE_NAME):
    #         if blob.name.endswith('.csv'):
    #             blob_name_to_download = blob.name
    #             break
        
    #     if blob_name_to_download:
    #         destination_file_name = f"./{os.path.basename(blob_name_to_download)}"
    #         blob_to_download = bucket.blob(blob_name_to_download)
    #         blob_to_download.download_to_filename(destination_file_name)
    #         print(f"File '{blob_name_to_download}' downloaded from GCS to '{destination_file_name}'.")
    #         file_path = destination_file_name # Update file_path for the next step
    #     else:
    #         print("Could not find the exported CSV file in the bucket.")
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
    exit() # Exit the script if the export failed

# --- Data Visualization ---
# try:
#     # Read the downloaded CSV file into a pandas DataFrame
#     df = pd.read_csv(file_path)

#     # Convert the 'date' column to a proper datetime object
#     df['date'] = pd.to_datetime(df['date'])

#     # Drop any rows that might have null NDVI values (if any images had no data)
#     df.dropna(subset=['ndvi'], inplace=True)

#     # Sort the DataFrame by date, which is crucial for a time-series plot
#     df.sort_values('date', inplace=True)

#     print("\nData loaded successfully:")
#     print(df)

#     # Plotting the Time Series
#     plt.style.use('seaborn-v0_8-whitegrid')
#     fig, ax = plt.subplots(figsize=(14, 7))

#     ax.plot(df['date'], df['ndvi'], marker='o', linestyle='-', color='green', label='Mean NDVI')

#     # Formatting the plot
#     ax.set_title('NDVI Time Series for Farm AOI (Oct 2024 - Apr 2025)', fontsize=16)
#     ax.set_xlabel('Date', fontsize=12)
#     ax.set_ylabel('NDVI (Normalized Difference Vegetation Index)', fontsize=12)
#     ax.set_ylim(0, 1)
#     ax.legend()
#     ax.grid(True)

#     fig.autofmt_xdate()

#     plt.show()

# except FileNotFoundError:
#     print(f"Error: The file was not found at '{file_path}'")
# except Exception as e:
#     print(f"An error occurred during data visualization: {e}")