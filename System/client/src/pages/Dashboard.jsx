import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTractor, 
  faCloudSunRain, 
  faLeaf, 
  faDroplet, 
  faTemperatureHalf, 
  faCloudRain, 
  faTriangleExclamation,
  faChartLine,
  faMapMarkerAlt,
  faRulerCombined,
  faSeedling,
  faCalendarAlt,
  faBell,
  faChevronDown,
  faMap,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { fetchWeatherForecast, fetchFieldData, fetchFields } from '../services/dataService';

const Dashboard = () => {
  const contextValue = useAppContext() || {};
  const { 
    selectedField = '', 
    setSelectedField = () => {}, 
    fields = [], 
    refreshFields = async () => {} 
  } = contextValue;
  const [fieldData, setFieldData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allFields, setAllFields] = useState([]);
  const [fieldCount, setFieldCount] = useState(0);

  // Load all fields on component mount
  useEffect(() => {
    const loadAllFields = async () => {
      try {
        const fieldsData = await fetchFields();
        setAllFields(fieldsData);
        setFieldCount(fieldsData.length);
      } catch (error) {
        console.error('Error loading all fields:', error);
      }
    };
    
    loadAllFields();
  }, []);

  // Load selected field data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Use the first field if none selected
        const fieldId = selectedField || (fields.length > 0 ? fields[0]?.id : null);
        
        if (fieldId) {
          const field = await fetchFieldData(fieldId);
          const weather = await fetchWeatherForecast(field.location || 'Default Location');
          
          setFieldData(field);
          setWeatherData(weather);
        } else {
          // No field available
          setFieldData(null);
          setWeatherData(await fetchWeatherForecast('Default Location'));
        }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg flex items-center justify-center shadow-lg mr-4">
            <FontAwesomeIcon icon={faTractor} className="text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Farm Dashboard</h2>
            <p className="text-sm text-gray-500">Overview of your agricultural operations</p>
          </div>
        </div>
        
        <div className="inline-flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button 
            className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-md transition duration-200 flex items-center"
            onClick={() => {
              refreshFields();
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
          >
            <FontAwesomeIcon icon={faRefresh} className="mr-2" />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading farm data...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the latest information</p>
        </div>
      ) : (
        <>
          {/* Farm Overview Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-green-600" />
                Farm Overview
              </h3>
              <div className="mt-2 sm:mt-0 flex items-center gap-4">
                {/* Field Selector */}
                {/* <div className="flex items-center">
                  <label htmlFor="field-select" className="mr-2 text-sm text-gray-500">Select Field:</label>
                  <select
                    id="field-select"
                    className="py-1 px-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={selectedField || ''}
                    onChange={(e) => setSelectedField(e.target.value)}
                  >
                    <option value="">-- Select Field --</option>
                    {fields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                </div> */}
                
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium">
                    Active Season
                  </span>
                  
                  <Link
                    to="/field-list"
                    className="text-sm bg-blue-50 text-blue-700 py-1 px-3 rounded-full font-medium flex items-center"
                  >
                    <FontAwesomeIcon icon={faMap} className="mr-1" />
                    All Fields ({fieldCount})
                  </Link>
                </div>
              </div>
            </div>
            
            {!fieldData ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No field selected or no fields available</div>
                <Link to="/create-field" className="mt-2 inline-block text-green-600 hover:text-green-700">
                  + Create a new field
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:border-green-300 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faSeedling} className="text-green-600" />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Field Name</div>
                  </div>
                  <div className="text-lg font-semibold text-gray-800">{fieldData?.name || 'Not Selected'}</div>
                  <div className="mt-2 text-sm text-gray-500">{fieldData?.location || 'Unknown Location'}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:border-green-300 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faRulerCombined} className="text-blue-600" />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Field Size</div>
                  </div>
                  <div className="text-lg font-semibold text-gray-800">{fieldData?.size || 0} acres</div>
                  <div className="mt-2 text-sm text-gray-500">
                    Created: {fieldData?.createdAt ? new Date(fieldData.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:border-green-300 transition-colors">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={faSeedling} className="text-amber-600" />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Crop</div>
                  </div>
                  <div className="text-lg font-semibold text-gray-800">
                    {fieldData?.crop || fieldData?.mainCrop || fieldData?.crops?.[0] || 'None planted'}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <Link to={`/field-detail/${fieldData.id}`} className="text-green-600 hover:text-green-700">
                      View field details →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Farm Health Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="border-b border-gray-50 bg-gradient-to-r from-green-50 to-green-100 py-4 px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faLeaf} className="text-xl text-green-600 mr-2" />
                    Farm Health
                  </h3>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                    <FontAwesomeIcon icon={faChartLine} className="text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {fieldData?.ndviHistory && (
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between mb-2">
                        <div>
                          <span className="font-medium text-gray-800">NDVI Score</span>
                          <p className="text-xs text-gray-500">Vegetation Health Index</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-gray-800">
                            {fieldData.ndviHistory[fieldData.ndviHistory.length - 1].value.toFixed(2)}
                          </span>
                          <div className={`text-xs font-medium mt-1 ${
                            fieldData.ndviHistory[fieldData.ndviHistory.length - 1].value >= 0.7 
                              ? 'text-green-600' 
                              : fieldData.ndviHistory[fieldData.ndviHistory.length - 1].value >= 0.5 
                                ? 'text-yellow-600' 
                                : 'text-red-600'
                          }`}>
                            {fieldData.ndviHistory[fieldData.ndviHistory.length - 1].value >= 0.7 
                              ? 'Excellent' 
                              : fieldData.ndviHistory[fieldData.ndviHistory.length - 1].value >= 0.5 
                                ? 'Moderate' 
                                : 'Needs Attention'}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
                        <div 
                          className={`${getHealthStatusColor(fieldData.ndviHistory[fieldData.ndviHistory.length - 1].value)} h-3 rounded-full transition-all duration-500 shadow-inner`} 
                          style={{ width: `${fieldData.ndviHistory[fieldData.ndviHistory.length - 1].value * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                        Last updated: 3 days ago
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <a href="/climate" className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors">
                  View detailed analysis
                </a>
                <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 text-green-500" />
              </div>
            </div>
            
            {/* Weather Forecast Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="border-b border-gray-50 bg-gradient-to-r from-blue-50 to-blue-100 py-4 px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faCloudSunRain} className="text-xl text-blue-500 mr-2" />
                    Weather Forecast
                  </h3>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {weatherData && (
                  <div>
                    <div className="flex flex-wrap -mx-2 mb-4">
                      {weatherData.forecast.slice(0, 3).map((day, index) => (
                        <div key={index} className="px-2 w-1/3">
                          <div className="text-center p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100">
                            <div className="text-sm font-medium text-gray-700 mb-1">
                              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <FontAwesomeIcon 
                              icon={
                                day.condition === 'sunny' ? faCloudSunRain : 
                                day.condition === 'cloudy' ? faCloudRain : faCloudSunRain
                              } 
                              className="text-3xl text-blue-500 my-2" 
                            />
                            <div className="font-bold text-gray-800">{day.high}°C</div>
                            <div className="text-xs text-gray-500">{day.low}°C</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Humidity: 62%</span>
                        <span className="text-gray-600">Wind: 8 km/h</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <a href="/climate" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  View 7-day forecast
                </a>
                <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            
            {/* Irrigation Status Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="border-b border-gray-50 bg-gradient-to-r from-cyan-50 to-cyan-100 py-4 px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faDroplet} className="text-xl text-cyan-600 mr-2" />
                    Water & Irrigation
                  </h3>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                    <FontAwesomeIcon icon={faDroplet} className="text-cyan-500" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium text-gray-800">Soil Moisture</span>
                        <p className="text-xs text-gray-500">Current Status</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Optimal</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full shadow-inner" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-3 flex justify-between items-center border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                      <span>Last irrigation: 2 days ago</span>
                    </div>
                    <div className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                      65%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <a href="/farm-console" className="text-sm font-medium text-cyan-600 hover:text-cyan-800 transition-colors">
                  Manage irrigation
                </a>
                <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 text-cyan-500" />
              </div>
            </div>
          </div>
          
          {/* Fields Overview Section */}
          {allFields.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FontAwesomeIcon icon={faMap} className="mr-2 text-green-600" />
                  My Fields
                </h3>
                <div className="mt-2 sm:mt-0">
                  <Link 
                    to="/create-field"
                    className="text-sm bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium hover:bg-green-200 transition-colors"
                  >
                    + Add New Field
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allFields.slice(0, 3).map((field) => (
                  <div 
                    key={field.id} 
                    className={`p-4 rounded-lg border ${selectedField === field.id ? 'border-green-300 bg-green-50' : 'border-gray-200'} hover:border-green-300 hover:shadow-sm transition-all cursor-pointer`}
                    onClick={() => setSelectedField(field.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{field.name}</h4>
                      {selectedField === field.id && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Selected</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">{field.location}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Created: {new Date(field.createdAt).toLocaleDateString()}
                      </div>
                      <Link 
                        to={`/field-detail/${field.id}`}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
                
                {allFields.length > 3 && (
                  <div className="p-4 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                    <Link 
                      to="/field-list"
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                    >
                      View all {allFields.length} fields
                      <FontAwesomeIcon icon={faChevronDown} className="ml-1 transform rotate-270" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Alerts and Notifications Card */}
            {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="border-b border-gray-50 bg-gradient-to-r from-amber-50 to-amber-100 py-4 px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faBell} className="text-xl text-amber-500 mr-2" />
                    Alerts & Notifications
                  </h3>
                  <div className="flex items-center">
                    <span className="bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center mr-2">2</span>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg shadow-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center">
                          <FontAwesomeIcon icon={faCloudRain} className="text-yellow-600" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Weather Alert</div>
                        <div className="text-sm text-gray-600 mt-1">Heavy rainfall expected in your area on August 18. Consider adjusting irrigation schedules.</div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-500">1 hour ago</span>
                          <button className="text-xs text-blue-600 hover:text-blue-800">View Details</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                          <FontAwesomeIcon icon={faDroplet} className="text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Irrigation Reminder</div>
                        <div className="text-sm text-gray-600 mt-1">Schedule next irrigation for northern section. Soil moisture levels are approaching minimum threshold.</div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-500">3 hours ago</span>
                          <button className="text-xs text-blue-600 hover:text-blue-800">Schedule Now</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 flex justify-center">
                <button className="text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center transition-colors">
                  View all notifications
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div> */}
            
            {/* Recent Activity Card */}
            {/* <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="border-b border-gray-50 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-xl text-gray-500 mr-2" />
                    Recent Activities
                  </h3>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                    <FontAwesomeIcon icon={faChartLine} className="text-gray-500" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start relative">
                      <div className="flex-shrink-0 z-10">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow">
                          <FontAwesomeIcon icon={faDroplet} className="text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm w-full">
                        <div className="text-sm font-medium text-gray-800">Irrigation completed</div>
                        <div className="text-xs text-gray-500 mt-1">August 13, 2025 - 6:30 AM</div>
                        <div className="text-xs text-gray-600 mt-2 bg-blue-50 rounded-md px-2 py-1 inline-block">
                          Water usage: 450 gallons
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start relative">
                      <div className="flex-shrink-0 z-10">
                        <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow">
                          <FontAwesomeIcon icon={faLeaf} className="text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm w-full">
                        <div className="text-sm font-medium text-gray-800">Crop health scan completed</div>
                        <div className="text-xs text-gray-500 mt-1">August 12, 2025 - 10:15 AM</div>
                        <div className="text-xs text-gray-600 mt-2 bg-green-50 rounded-md px-2 py-1 inline-block">
                          NDVI: 0.78 (Excellent)
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start relative">
                      <div className="flex-shrink-0 z-10">
                        <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center border-4 border-white shadow">
                          <FontAwesomeIcon icon={faTemperatureHalf} className="text-amber-600" />
                        </div>
                      </div>
                      <div className="ml-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm w-full">
                        <div className="text-sm font-medium text-gray-800">Temperature alert triggered</div>
                        <div className="text-xs text-gray-500 mt-1">August 10, 2025 - 2:45 PM</div>
                        <div className="text-xs text-gray-600 mt-2 bg-amber-50 rounded-md px-2 py-1 inline-block">
                          35°C - Above threshold
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 flex justify-center">
                <button className="text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center transition-colors">
                  View activity history
                  <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
