import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTractor, 
  faCloudSunRain, 
  faLeaf, 
  faDroplet, 
  faTemperatureHalf, 
  faCloudRain, 
  faTriangleExclamation 
} from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from '../context/AppContext';
import { fetchWeatherForecast, fetchFieldData } from '../services/dataService';

const Dashboard = () => {
  const { selectedField, fields } = useAppContext();
  const [fieldData, setFieldData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Use the first field if none selected
        const fieldId = selectedField || (fields.length > 0 ? fields[0].id : 1);
        const field = await fetchFieldData(fieldId);
        const weather = await fetchWeatherForecast(field.location || 'DIT Pune');
        
        setFieldData(field);
        setWeatherData(weather);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedField, fields]);

  const getHealthStatusColor = (value) => {
    if (value >= 0.7) return 'bg-green-500';
    if (value >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <FontAwesomeIcon icon={faTractor} className="text-2xl text-green-700 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner border-t-4 border-green-500 border-solid rounded-full w-12 h-12 mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading farm data...</p>
        </div>
      ) : (
        <>
          {/* Farm Overview Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Farm Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-600">Farm Name</div>
                <div className="text-lg font-medium">{fieldData?.name || 'Not Selected'}</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-600">Field Size</div>
                <div className="text-lg font-medium">{fieldData?.size || 0} acres</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-sm text-gray-600">Crops</div>
                <div className="text-lg font-medium">
                  {fieldData?.crops?.join(', ') || 'None planted'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Farm Health Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faLeaf} className="text-xl text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold">Farm Health</h3>
                </div>
                
                {fieldData?.ndviHistory && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>NDVI (Vegetation Health)</span>
                        <span className="font-medium">{fieldData.ndviHistory[fieldData.ndviHistory.length - 1].value.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`${getHealthStatusColor(fieldData.ndviHistory[fieldData.ndviHistory.length - 1].value)} h-2.5 rounded-full`} 
                          style={{ width: `${fieldData.ndviHistory[fieldData.ndviHistory.length - 1].value * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-6 py-3">
                <a href="/climate" className="text-sm text-green-600 hover:text-green-800">View detailed analysis →</a>
              </div>
            </div>
            
            {/* Weather Forecast Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faCloudSunRain} className="text-xl text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold">Weather Forecast</h3>
                </div>
                
                {weatherData && (
                  <div className="flex flex-wrap -mx-2">
                    {weatherData.forecast.slice(0, 3).map((day, index) => (
                      <div key={index} className="px-2 w-1/3">
                        <div className="text-center p-2">
                          <div className="text-xs text-gray-600 mb-1">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <FontAwesomeIcon 
                            icon={
                              day.condition === 'sunny' ? faCloudSunRain : 
                              day.condition === 'cloudy' ? faCloudRain : faCloudSunRain
                            } 
                            className="text-2xl text-blue-400 mb-1" 
                          />
                          <div className="font-medium">{day.high}°C</div>
                          <div className="text-xs text-gray-600">{day.low}°C</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-6 py-3">
                <a href="/climate" className="text-sm text-blue-600 hover:text-blue-800">View 7-day forecast →</a>
              </div>
            </div>
            
            {/* Irrigation Status Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faDroplet} className="text-xl text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold">Water & Irrigation</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Soil Moisture</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Good</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Last irrigation: 2 days ago</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3">
                <a href="/farm-console" className="text-sm text-blue-600 hover:text-blue-800">Manage irrigation →</a>
              </div>
            </div>
          </div>
          
          {/* Additional Information Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Alerts and Notifications Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-xl text-amber-500 mr-2" />
                <h3 className="text-lg font-semibold">Alerts & Notifications</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <div>
                    <div className="font-medium">Weather Alert</div>
                    <div className="text-sm text-gray-600">Heavy rainfall expected in your area on August 18.</div>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <div>
                    <div className="font-medium">Irrigation Reminder</div>
                    <div className="text-sm text-gray-600">Schedule next irrigation for northern section.</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faDroplet} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Irrigation completed</div>
                    <div className="text-xs text-gray-500">August 13, 2025 - 6:30 AM</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faLeaf} className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Crop health scan completed</div>
                    <div className="text-xs text-gray-500">August 12, 2025 - 10:15 AM</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faTemperatureHalf} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Temperature alert triggered</div>
                    <div className="text-xs text-gray-500">August 10, 2025 - 2:45 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
