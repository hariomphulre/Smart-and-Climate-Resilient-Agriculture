import ee
import functions_framework
from datetime import datetime, timedelta
import pytz # For timezone awareness, if needed for complex date logic

# Initialize Earth Engine - Cloud Function's service account handles authentication
ee.Initialize()

# Define your GCS bucket name
GCS_BUCKET = 'earth-engine-climate-data' # <--- REPLACE WITH YOUR BUCKET NAME

@functions_framework.http
def process_geospatial_data(request):
    """
    HTTP Cloud Function that triggers GEE data processing and export.
    """
    try:
        print("GEE script initiated...")

        # --- Define Area of Interest (AOI) ---
        # OPTION A: Load AOI from GEE Asset (RECOMMENDED)
        # Replace 'users/your_username/pimpri_chinchwad_aoi' with your actual asset ID
        aoi_asset_id = 'users/hariomphulreworkspace/Climate-Change/aoi' # Adjust if not in specific project
        aoi = ee.FeatureCollection(aoi_asset_id).geometry()

        # OPTION B: Define AOI as a rectangle (LESS PRECISE, for quick testing)
        # aoi = ee.Geometry.Rectangle([73.7, 18.6, 73.9, 18.8])

        # --- Define Time Window ---
        # Get data for the last 30 days up to yesterday (to ensure full daily aggregates are available)
        yesterday_utc = datetime.utcnow() - timedelta(days=1)
        end_date = ee.Date(yesterday_utc.strftime('%Y-%m-%d'))
        start_date = end_date.advance(-30, 'day')

        print(f"Processing data for: {start_date.format('YYYY-MM-dd').getInfo()} to {end_date.format('YYYY-MM-dd').getInfo()}")

        # --- Helper function for Cloud Masking (Sentinel-2) ---
        def mask_s2_clouds(image):
            qa = image.select('QA60')
            # Bits 10 and 11 are clouds and cirrus, respectively.
            cloud_bit_mask = 1 << 10
            cirrus_bit_mask = 1 << 11
            # Both flags should be set to zero, indicating clear conditions.
            mask = qa.bitwiseAnd(cloud_bit_mask).eq(0).And(qa.bitwiseAnd(cirrus_bit_mask).eq(0))
            # Apply scaling factor to SR bands
            return image.updateMask(mask).divide(10000)

        # --- 1. Agriculture Data (Sentinel-2 NDVI) ---
        s2_collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED') \
            .filterBounds(aoi) \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) # Filter for less than 20% cloud

        s2_masked = s2_collection.map(mask_s2_clouds)

        def add_ndvi(image):
            ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
            return image.addBands(ndvi)

        s2_ndvi = s2_masked.map(add_ndvi)

        # Take a robust statistic like median for the composite
        median_ndvi = s2_ndvi.select('NDVI').median().clip(aoi)

        # Export Median NDVI Image
        ndvi_export_description = f'NDVI_Pimpri_Chinchwad_{end_date.format("YYYYMMDD").getInfo()}'
        task_ndvi = ee.batch.Export.image.toCloudStorage(
            image=median_ndvi,
            description=ndvi_export_description,
            bucket=GCS_BUCKET,
            fileNamePrefix='agriculture/NDVI/', # Organize exports into subfolders
            region=aoi.getInfo(),
            scale=10, # Sentinel-2 resolution
            maxPixels=1e10, # Increase if AOI is very large
            fileFormat='GeoTIFF',
            formatOptions={'cloudOptimized': True} # Export as COG for web-readiness
        )
        task_ndvi.start()
        print(f"Initiated NDVI export task: {ndvi_export_description}")

        # --- 2. Climate Data (ERA5-Land - Hourly for more detail) ---
        # For 2m Temperature (Mean over period)
        era5_land_temp = ee.ImageCollection('ECMWF/ERA5_LAND/HOURLY') \
            .filterBounds(aoi) \
            .filterDate(start_date, end_date) \
            .select('temperature_2m') \
            .mean() \
            .multiply(ee.Image(ee.Number(1))) \
            .clip(aoi)

        # For 10m Wind Speed (Calculated from U and V components, then averaged)
        era5_land_wind_u = ee.ImageCollection('ECMWF/ERA5_LAND/HOURLY') \
            .filterBounds(aoi) \
            .filterDate(start_date, end_date) \
            .select('u_component_of_wind_10m')

        era5_land_wind_v = ee.ImageCollection('ECMWF/ERA5_LAND/HOURLY') \
            .filterBounds(aoi) \
            .filterDate(start_date, end_date) \
            .select('v_component_of_wind_10m')

        # Calculate wind speed from U and V components for each image, then take mean
        def calculate_wind_speed(image):
            u = image.select('u_component_of_wind_10m')
            v = image.select('v_component_of_wind_10m')
            wind_speed = u.pow(2).add(v.pow(2)).sqrt().rename('wind_speed_10m')
            return image.addBands(wind_speed)

        # Map the function and then take the mean over the period
        mean_wind_speed = era5_land_wind_u.combine(era5_land_wind_v) \
            .map(calculate_wind_speed) \
            .select('wind_speed_10m') \
            .mean() \
            .clip(aoi)

        # For Soil Moisture (Volumetric soil water at 0-7cm, averaged)
        era5_land_soil_moisture = ee.ImageCollection('ECMWF/ERA5_LAND/HOURLY') \
            .filterBounds(aoi) \
            .filterDate(start_date, end_date) \
            .select('volumetric_soil_water_layer_1') \
            .mean() \
            .clip(aoi)

        # Export Climate Data as Zonal Statistics (CSV)
        scale_era5_land = 1000 # ERA5-Land resolution is ~9km, using 1000m for reduction

        # Temperature Stats
        temp_stats = era5_land_temp.reduceRegion(
            reducer=ee.Reducer.mean(), # Mean temperature over the AOI
            geometry=aoi,
            scale=scale_era5_land,
            crs='EPSG:4326',
            tileScale=16
        )
        temp_export_description = f'ERA5_Land_Temp_Pimpri_Chinchwad_{end_date.format("YYYYMMDD").getInfo()}'
        task_temp_stats = ee.batch.Export.table.toCloudStorage(
            collection=ee.FeatureCollection([ee.Feature(None, temp_stats)]),
            description=temp_export_description,
            bucket=GCS_BUCKET,
            fileNamePrefix='climate/ERA5_Land/',
            fileFormat='CSV'
        )
        task_temp_stats.start()
        print(f"Initiated ERA5-Land Temperature export task: {temp_export_description}")

        # Wind Speed Stats
        wind_speed_stats = mean_wind_speed.reduceRegion(
            reducer=ee.Reducer.mean(), # Mean wind speed over the AOI
            geometry=aoi,
            scale=scale_era5_land,
            crs='EPSG:4326',
            tileScale=16
        )
        wind_export_description = f'ERA5_Land_Wind_Speed_Pimpri_Chinchwad_{end_date.format("YYYYMMDD").getInfo()}'
        task_wind_stats = ee.batch.Export.table.toCloudStorage(
            collection=ee.FeatureCollection([ee.Feature(None, wind_speed_stats)]),
            description=wind_export_description,
            bucket=GCS_BUCKET,
            fileNamePrefix='climate/ERA5_Land/',
            fileFormat='CSV'
        )
        task_wind_stats.start()
        print(f"Initiated ERA5-Land Wind Speed export task: {wind_export_description}")

        # Soil Moisture Stats
        soil_moisture_stats = era5_land_soil_moisture.reduceRegion(
            reducer=ee.Reducer.mean(), # Mean soil moisture over the AOI
            geometry=aoi,
            scale=scale_era5_land,
            crs='EPSG:4326',
            tileScale=16
        )
        soil_moisture_export_description = f'ERA5_Land_Soil_Moisture_Pimpri_Chinchwad_{end_date.format("YYYYMMDD").getInfo()}'
        task_soil_moisture_stats = ee.batch.Export.table.toCloudStorage(
            collection=ee.FeatureCollection([ee.Feature(None, soil_moisture_stats)]),
            description=soil_moisture_export_description,
            bucket=GCS_BUCKET,
            fileNamePrefix='climate/ERA5_Land/',
            fileFormat='CSV'
        )
        task_soil_moisture_stats.start()
        print(f"Initiated ERA5-Land Soil Moisture export task: {soil_moisture_export_description}")

        # --- 3. More Rain Data (CHIRPS Daily) ---
        # Sum precipitation over the period
        chirps_precip = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY') \
            .filterBounds(aoi) \
            .filterDate(start_date, end_date) \
            .select('precipitation') \
            .sum() \
            .clip(aoi)

        # Export CHIRPS Precipitation as a CSV
        scale_chirps = 5566 # CHIRPS resolution is 0.05 degrees ~ 5.5km
        chirps_stats = chirps_precip.reduceRegion(
            reducer=ee.Reducer.sum(), # Total precipitation over the AOI
            geometry=aoi,
            scale=scale_chirps,
            crs='EPSG:4326',
            tileScale=16
        )
        chirps_export_description = f'CHIRPS_Precip_Pimpri_Chinchwad_{end_date.format("YYYYMMDD").getInfo()}'
        task_chirps_stats = ee.batch.Export.table.toCloudStorage(
            collection=ee.FeatureCollection([ee.Feature(None, chirps_stats)]),
            description=chirps_export_description,
            bucket=GCS_BUCKET,
            fileNamePrefix='climate/CHIRPS/',
            fileFormat='CSV'
        )
        task_chirps_stats.start()
        print(f"Initiated CHIRPS Precipitation export task: {chirps_export_description}")

        return 'GEE export tasks initiated successfully!', 200

    except ee.EEException as e:
        print(f"Earth Engine Error: {e}")
        return f"Earth Engine Error: {e}", 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return f"An unexpected error occurred: {e}", 500