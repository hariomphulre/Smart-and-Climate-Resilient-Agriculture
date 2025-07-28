# import ee
# import pandas as pd
# import datetime
# import schedule
# import time

# # --------------------------
# # Authenticate (first time only)
# # ee.Authenticate()
# ee.Initialize()

# # --------------------------
# # Define AOI (Bhopal) with buffer for better data
# aoi = ee.Geometry.Point([77.4126, 23.2599]).buffer(10000)  # 10 km radius

# # --------------------------
# # Function to fetch and save climate data
# def fetch_climate_data():
#     print("🔄 Fetching climate data...")

#     today = datetime.date.today()
#     start_date = str(today - datetime.timedelta(days=2))
#     end_date = str(today)

#     # Load datasets
#     era5 = ee.ImageCollection("ECMWF/ERA5/DAILY").filterDate(start_date, end_date).filterBounds(aoi)
#     chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY").filterDate(start_date, end_date).filterBounds(aoi)

#     # -- Extract ERA5
#     def extract_era5(img):
#         stats = img.reduceRegion(ee.Reducer.mean(), aoi, scale=1000)
#         return ee.Feature(None, {
#             'date': img.date().format('YYYY-MM-dd'),
#             'temp': stats.get('mean_2m_air_temperature'),
#             'humidity': stats.get('mean_2m_relative_humidity'),
#             'wind': stats.get('mean_10m_u_component_of_wind')
#         })

#     era5_features = era5.map(extract_era5).getInfo()
#     era5_data = [f['properties'] for f in era5_features.get('features', [])]

#     if not era5_data:
#         print("⚠️ No ERA5 data available.")
#         return

#     df_era5 = pd.DataFrame(era5_data)
#     if 'date' not in df_era5.columns:
#         print("⚠️ 'date' missing in ERA5 data.")
#         return

#     df_era5['date'] = pd.to_datetime(df_era5['date'])
#     df_era5['temp'] = df_era5['temp'].astype(float) - 273.15  # Kelvin to Celsius
#     df_era5['humidity'] = df_era5['humidity'].astype(float)
#     df_era5['wind'] = df_era5['wind'].astype(float)

#     # -- Extract CHIRPS
#     def extract_chirps(img):
#         stats = img.reduceRegion(ee.Reducer.mean(), aoi, scale=5000)
#         return ee.Feature(None, {
#             'date': img.date().format('YYYY-MM-dd'),
#             'rainfall': stats.get('precipitation')
#         })

#     chirps_features = chirps.map(extract_chirps).getInfo()
#     chirps_data = [f['properties'] for f in chirps_features.get('features', [])]

#     if not chirps_data:
#         print("⚠️ No CHIRPS data available.")
#         return

#     df_chirps = pd.DataFrame(chirps_data)
#     if 'date' not in df_chirps.columns:
#         print("⚠️ 'date' missing in CHIRPS data.")
#         return

#     df_chirps['date'] = pd.to_datetime(df_chirps['date'])
#     df_chirps['rainfall'] = df_chirps['rainfall'].astype(float)

#     # -- Merge and save
#     df = pd.merge(df_era5, df_chirps, on='date', how='outer').sort_values('date')
#     df.to_csv("climate_data.csv", index=False)
#     print("✅ Climate data updated and saved to climate_data.csv\n")

# # --------------------------
# # 🔁 Schedule to run every day at 06:00 AM
# # schedule.every().day.at("06:00").do(fetch_climate_data)
# # For testing: every 1 minute
# schedule.every(1).minutes.do(fetch_climate_data)

# print("⏳ Scheduler started...")

# while True:
#     schedule.run_pending()
#     time.sleep(5)



















# --- Required Libraries ---
# Make sure you have these installed:
# pip install earthengine-api pandas matplotlib seaborn schedule

import ee
import schedule
import time
import datetime
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# --- Initialization and Authentication ---
try:
    ee.Initialize()
except Exception as e:
    print("Earth Engine not initialized. Attempting authentication.")
    ee.Authenticate()
    ee.Initialize()

def add_derived_era5_variables(image):
    """
    Calculates derived variables (Temp in C, Humidity, Wind Speed)
    and adds them as bands to an ERA5 image. This is done server-side.
    """
    # Convert temperature from Kelvin to Celsius
    temp_c = image.select('mean_2m_air_temperature').subtract(273.15).rename('temperature_celsius')

    # Calculate Relative Humidity using the August-Roche-Magnus approximation
    rh = image.expression(
        '100 * (exp((17.625 * (Td - 273.15)) / (243.04 + (Td - 273.15))) / exp((17.625 * (T - 273.15)) / (243.04 + (T - 273.15))))', {
            'T': image.select('mean_2m_air_temperature'),
            'Td': image.select('mean_2m_dewpoint_temperature')
    }).rename('relative_humidity')

    # Calculate Wind Speed from u and v components (m/s)
    wind_speed = image.expression(
        'sqrt(u**2 + v**2)', {
        'u': image.select('u_component_of_wind_10m'),
        'v': image.select('v_component_of_wind_10m')
    }).rename('wind_speed_ms')

    # Add the new bands to the original image and return it
    return image.addBands([temp_c, rh, wind_speed])


def plot_climate_data(df):
    """
    Generates and displays plots for the climate data DataFrame.
    """
    if df.empty:
        print("DataFrame is empty, skipping plotting.")
        return

    print("📊 Generating plots...")
    sns.set_theme(style="whitegrid")
    
    # Create a figure with 3 rows and 2 columns of subplots
    fig, axes = plt.subplots(3, 2, figsize=(15, 12))
    fig.suptitle('Climate Data Time Series for Bhopal', fontsize=16)

    # Flatten the axes array for easy iteration
    ax = axes.flatten()

    # Temperature
    df['temperature_celsius'].plot(ax=ax[0], title='Mean Air Temperature', color='r')
    ax[0].set_ylabel('Temperature (°C)')

    # Relative Humidity
    df['relative_humidity'].plot(ax=ax[1], title='Relative Humidity', color='b')
    ax[1].set_ylabel('Humidity (%)')

    # Wind Speed
    df['wind_speed_ms'].plot(ax=ax[2], title='Wind Speed', color='g')
    ax[2].set_ylabel('Speed (m/s)')

    # Precipitation
    df['precipitation'].plot(ax=ax[3], title='Daily Precipitation (CHIRPS)', color='c')
    ax[3].set_ylabel('Precipitation (mm/day)')
    
    # Cloud Cover
    df['total_cloud_cover'].plot(ax=ax[4], title='Total Cloud Cover', color='grey')
    ax[4].set_ylabel('Cover Fraction (0-1)')

    # Snow Depth
    df['snow_depth_water_equivalent'].plot(ax=ax[5], title='Snow Depth (Water Equivalent)', color='purple')
    ax[5].set_ylabel('Depth (m)')

    # Improve layout
    for i in range(len(ax)):
        ax[i].set_xlabel('') # Remove individual x-axis labels
        ax[i].tick_params(axis='x', rotation=45)

    plt.tight_layout(rect=[0, 0.03, 1, 0.96])
    plt.show()


def fetch_and_plot_climate_data():
    """
    Fetches climate data for a point, processes it into a DataFrame,
    and generates plots.
    """
    print(f"\n🔄 [{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Fetching and processing climate data...")

    try:
        # ✅ 1. Define Area of Interest (Bhopal)
        aoi = ee.Geometry.Point([77.4126, 23.2599])

        # ✅ 2. Define Date Range (10–25 days ago)
        today_str = datetime.date.today().strftime('%Y-%m-%d')
        end_date = ee.Date(today_str).advance(-10, 'day')
        start_date = end_date.advance(-15, 'day')

        print(f"Date range: {start_date.format('YYYY-MM-dd').getInfo()} to {end_date.format('YYYY-MM-dd').getInfo()}")

        # ✅ 3. Select Bands and Prepare Image Collections
        era5_bands = [
            'mean_2m_air_temperature', 'mean_2m_dewpoint_temperature',
            'u_component_of_wind_10m', 'v_component_of_wind_10m',
            'total_cloud_cover', 'snow_depth_water_equivalent'
        ]
        chirps_band = 'precipitation'

        era5_collection = ee.ImageCollection("ECMWF/ERA5/DAILY") \
            .filterDate(start_date, end_date) \
            .filterBounds(aoi) \
            .select(era5_bands) \
            .map(add_derived_era5_variables)

        chirps_collection = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY") \
            .filterDate(start_date, end_date) \
            .filterBounds(aoi) \
            .select(chirps_band)
        
        # ✅ 4. Join the two collections for unified data extraction
        join_filter = ee.Filter.equals(leftField='system:time_start', rightField='system:time_start')
        save_best_join = ee.Join.saveFirst(matchKey='chirps_match')
        
        joined_collection = save_best_join.apply(era5_collection, chirps_collection, join_filter)
        
        # 💡 This function contains the fix.
        def transfer_chirps_data(feature):
            # The element from a join is a feature. Cast it to an Image to use image methods.
            image = ee.Image(feature) 
            # Get the matched CHIRPS image and handle nulls by creating a 0-value image
            chirps_image = ee.Image(image.get('chirps_match')).unmask(0) 
            return image.addBands(chirps_image)

        final_collection = ee.ImageCollection(joined_collection.map(transfer_chirps_data))

        # ✅ 5. Extract time-series data at the point of interest
        final_bands = [
            'temperature_celsius', 'relative_humidity', 'wind_speed_ms',
            'precipitation', 'total_cloud_cover', 'snow_depth_water_equivalent'
        ]
        
        timeseries_data = final_collection.getRegion(aoi, scale=250).getInfo()

        # ✅ 6. Convert results to a Pandas DataFrame
        if not timeseries_data or len(timeseries_data) < 2:
            print("⚠️ Notice: No data found for the specified range.")
            return

        header = timeseries_data[0]
        data = timeseries_data[1:]

        df = pd.DataFrame(data, columns=header)
        
        df['datetime'] = pd.to_datetime(df['time'], unit='ms')
        df = df.set_index('datetime')
        
        df = df[final_bands]
        df = df.ffill()

        print(f"✅ Success: Fetched data for {len(df)} days.")
        print("Sample Data:")
        print(df.head())
        
        # ✅ 7. Plot the data
        plot_climate_data(df)

    except ee.EEException as e:
        print(f"❌ An Earth Engine error occurred: {e}")
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")


# --- Scheduling ---
if __name__ == "__main__":
    print("⏳ Scheduler started. First run is immediate, then every 12 hours.")
    fetch_and_plot_climate_data()  # Run once immediately

    # Set up the recurring schedule
    schedule.every(12).hours.do(fetch_and_plot_climate_data)

    while True:
        schedule.run_pending()
        time.sleep(1)