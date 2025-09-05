import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudSunRain,
  faCalendarAlt,
  faFilter,
  faDownload,
  faLocationDot,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { useAppContext } from '../../context/AppContext';
import { fetchWeatherData } from '../../services/climateService';

const WeatherAnalysis = ({ dateRange, onDateRangeChange, showDateRangePicker, setShowDateRangePicker }) => {
  const { selectedField, selectedLocation } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temperature: [],
    humidity: [],
    rainfall: []
  });
  
  useEffect(() => {
    loadWeatherData();
  }, [selectedField, selectedLocation]);
  
  const loadWeatherData = async () => {
    setLoading(true);
    try {
      const data = await fetchWeatherData(
        selectedField, 
        selectedLocation, 
        dateRange
      );
      setWeatherData(data);
    } catch (error) {
      console.error('Error loading weather data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const applyDateRange = () => {
    loadWeatherData();
  };
  
  // Generic chart options
  const getChartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        beginAtZero: false
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  });
  
  // Generate chart data for temperature
  const temperatureChartData = {
    labels: weatherData.temperature?.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherData.temperature?.map(item => item.value) || [],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.3,
        pointBackgroundColor: 'rgb(255, 99, 132)',
      }
    ]
  };
  
  // Generate chart data for rainfall
  const rainfallChartData = {
    labels: weatherData.rainfall?.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: weatherData.rainfall?.map(item => item.value) || [],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.3,
        pointBackgroundColor: 'rgb(54, 162, 235)',
      }
    ]
  };

  return (
    <div className="Analytics">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FontAwesomeIcon icon={faCloudSunRain} className="text-yellow-500 mr-2" />
          Weather Forecast and Analysis
        </h2>
        <p className="text-gray-600">
          Track temperature trends, rainfall patterns, and forecast for your farm.
        </p>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-sm">
          <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
          <span className="font-medium">{selectedLocation || 'DIT Pune'}</span>
        </div>
        <div className="ml-auto flex space-x-2">
          <button 
            className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
            onClick={() => setShowDateRangePicker(!showDateRangePicker)}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
            <span>Date Range</span>
          </button>
          <button className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
            <FontAwesomeIcon icon={faFilter} className="mr-1" />
            <span>Filter</span>
          </button>
          <button className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
            <FontAwesomeIcon icon={faDownload} className="mr-1" />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {showDateRangePicker && (
        <div className="bg-white shadow-md rounded-md p-4 mb-4">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input 
                type="date" 
                id="startDate" 
                name="startDate"
                className="border rounded px-3 py-2"
                value={dateRange.startDate}
                onChange={onDateRangeChange}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input 
                type="date" 
                id="endDate" 
                name="endDate"
                className="border rounded px-3 py-2"
                value={dateRange.endDate}
                onChange={onDateRangeChange}
              />
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              onClick={applyDateRange}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Apply'}
            </button>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="h-80">
              <Line data={temperatureChartData} options={getChartOptions('Temperature Trends')} />
            </div>
          </div>
          
          {/* Rainfall Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="h-80">
              <Line data={rainfallChartData} options={getChartOptions('Rainfall Patterns')} />
            </div>
          </div>
          
          {/* Weather Summary */}
          <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Weather Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="text-sm text-gray-600 mb-1">Current Temperature</div>
                <div className="text-2xl font-bold text-blue-800">
                  {weatherData.temperature?.length ? weatherData.temperature[weatherData.temperature.length - 1].value : '--'}°C
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  {weatherData.temperature?.length && weatherData.temperature[weatherData.temperature.length - 1].value > 30 ? 'Above Average' : 'Normal Range'}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="text-sm text-gray-600 mb-1">Humidity</div>
                <div className="text-2xl font-bold text-blue-800">
                  {weatherData.humidity?.length ? weatherData.humidity[weatherData.humidity.length - 1].value : '--'}%
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  {weatherData.humidity?.length && weatherData.humidity[weatherData.humidity.length - 1].value > 70 ? 'High' : 'Moderate'}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="text-sm text-gray-600 mb-1">Period Rainfall</div>
                <div className="text-2xl font-bold text-blue-800">
                  {weatherData.rainfall?.length ? weatherData.rainfall.reduce((sum, item) => sum + item.value, 0).toFixed(1) : '--'}mm
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  {weatherData.rainfall?.length && weatherData.rainfall.reduce((sum, item) => sum + item.value, 0) > 50 ? 'Above Average' : 'Below Average'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Weather Forecast */}
          <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold mb-3">5-Day Forecast</h3>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(5)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                
                // Simulate different weather conditions
                const conditions = ['sunny', 'partly_cloudy', 'cloudy', 'rainy', 'sunny'];
                const temps = [32, 31, 28, 27, 30];
                
                return (
                  <div key={i} className="text-center p-3 border rounded-md">
                    <div className="text-sm font-medium mb-2">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-3xl text-center mb-2">
                      {conditions[i] === 'sunny' && '☀️'}
                      {conditions[i] === 'partly_cloudy' && '⛅'}
                      {conditions[i] === 'cloudy' && '☁️'}
                      {conditions[i] === 'rainy' && '🌧️'}
                    </div>
                    <div className="font-bold">{temps[i]}°C</div>
                    <div className="text-xs text-gray-500">{temps[i] - 8}°C</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherAnalysis;
