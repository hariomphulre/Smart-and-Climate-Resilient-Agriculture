import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSeedling,
  faInfoCircle,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { useAppContext } from '../../context/AppContext';
import { fetchSoilData } from '../../services/climateService';

const SoilLandAnalysis = ({ dateRange, loading, setLoading }) => {
  const { selectedField, selectedLocation } = useAppContext();
  const [soilData, setSoilData] = useState({
    soilType: '',
    ph: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    organicMatter: 0,
    recommendations: []
  });
  
  useEffect(() => {
    loadSoilData();
  }, [selectedField, selectedLocation, dateRange]);
  
  const loadSoilData = async () => {
    setLoading(true);
    try {
      const data = await fetchSoilData(
        selectedField, 
        selectedLocation, 
        dateRange
      );
      setSoilData(data);
    } catch (error) {
      console.error('Error loading soil data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="Analytics">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FontAwesomeIcon icon={faSeedling} className="text-amber-700 mr-2" />
          Soil & Land Analysis
        </h2>
        <p className="text-gray-600">
          Monitor soil health, nutrient levels, and get recommendations for optimal crop growth.
        </p>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner border-t-4 border-amber-500 border-solid rounded-full w-12 h-12 mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading soil data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Soil Overview */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Soil Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Soil Type:</span>
                <span className="font-medium">{soilData.soilType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">pH Level:</span>
                <div className="flex items-center">
                  <span className={`font-medium ${
                    soilData.ph < 5.5 ? 'text-red-600' : 
                    soilData.ph > 7.5 ? 'text-blue-600' : 
                    'text-green-600'
                  }`}>
                    {soilData.ph}
                  </span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">
                    {soilData.ph < 5.5 ? 'Acidic' : 
                    soilData.ph > 7.5 ? 'Alkaline' : 
                    'Optimal'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Organic Matter:</span>
                <span className="font-medium">{soilData.organicMatter}%</span>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Soil Health Score</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${(soilData.organicMatter / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Nutrient Levels */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Nutrient Levels</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Nitrogen (N)</span>
                  <span className="text-sm font-medium">{soilData.nitrogen} kg/ha</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${soilData.nitrogen < 30 ? 'bg-red-500' : soilData.nitrogen < 60 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                    style={{ width: `${Math.min(100, (soilData.nitrogen / 100) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Phosphorus (P)</span>
                  <span className="text-sm font-medium">{soilData.phosphorus} kg/ha</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${soilData.phosphorus < 20 ? 'bg-red-500' : soilData.phosphorus < 40 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                    style={{ width: `${Math.min(100, (soilData.phosphorus / 60) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Potassium (K)</span>
                  <span className="text-sm font-medium">{soilData.potassium} kg/ha</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${soilData.potassium < 100 ? 'bg-red-500' : soilData.potassium < 200 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                    style={{ width: `${Math.min(100, (soilData.potassium / 300) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faInfoCircle} className="text-amber-500 mt-1 mr-2" />
                <div>
                  <h4 className="font-medium">Nutrient Status</h4>
                  <p className="text-sm text-gray-600">
                    {soilData.nitrogen < 30 || soilData.phosphorus < 20 || soilData.potassium < 100 ? 
                      'Some nutrients are critically low. Check recommendations for fertilizer application.' :
                      soilData.nitrogen < 60 || soilData.phosphorus < 40 || soilData.potassium < 200 ?
                      'Nutrient levels are below optimal. Consider supplementing for best crop yields.' :
                      'Nutrient levels are in good range for most crops.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommendations */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            
            <div className="space-y-4">
              {soilData.recommendations?.map((rec, index) => (
                <div key={index} className="p-3 bg-gray-50 border rounded">
                  <h4 className="font-medium text-gray-800">{rec.nutrient}</h4>
                  <p className="text-sm text-gray-600 mt-1">Current: <span className="font-medium">{rec.current}</span></p>
                  <p className="text-sm text-gray-600 mt-1">{rec.recommendation}</p>
                </div>
              ))}
              
              {!soilData.recommendations?.length && (
                <p className="text-gray-500 text-center p-4">No specific recommendations available.</p>
              )}
            </div>
          </div>
          
          {/* pH Interpretation */}
          <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold mb-3">pH Interpretation</h3>
            
            <div className="relative h-12 mb-8 mt-6">
              <div className="absolute inset-0 flex">
                <div className="w-1/7 bg-red-500"></div>
                <div className="w-1/7 bg-orange-400"></div>
                <div className="w-1/7 bg-yellow-300"></div>
                <div className="w-1/7 bg-green-500"></div>
                <div className="w-1/7 bg-green-400"></div>
                <div className="w-1/7 bg-blue-400"></div>
                <div className="w-1/7 bg-purple-500"></div>
              </div>
              
              <div className="absolute inset-0 flex justify-between px-2 text-xs text-white font-medium pt-2">
                <span>4.0</span>
                <span>5.0</span>
                <span>6.0</span>
                <span>7.0</span>
                <span>8.0</span>
                <span>9.0</span>
                <span>10.0</span>
              </div>
              
              {/* pH pointer */}
              <div 
                className="absolute top-0 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-800 rounded-full z-10"
                style={{ left: `${((soilData.ph - 4) / 6) * 100}%`, top: '50%' }}
              ></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className="p-2 border rounded-md bg-gray-50">
                <h4 className="font-medium text-red-700">Acidic (4.0-5.5)</h4>
                <p className="text-xs text-gray-600 mt-1">Good for blueberries, potatoes, sweet potatoes</p>
              </div>
              
              <div className="p-2 border rounded-md bg-gray-50">
                <h4 className="font-medium text-green-700">Neutral (6.0-7.0)</h4>
                <p className="text-xs text-gray-600 mt-1">Ideal for most vegetables and grains</p>
              </div>
              
              <div className="p-2 border rounded-md bg-gray-50">
                <h4 className="font-medium text-blue-700">Alkaline (7.5-10.0)</h4>
                <p className="text-xs text-gray-600 mt-1">Good for asparagus, beets, cabbage</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="flex items-start">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mt-1 mr-2" />
                <div>
                  <h4 className="font-medium">Your Soil pH</h4>
                  <p className="text-sm text-gray-600">
                    {soilData.ph < 5.5 ? 
                      'Your soil is acidic. Consider adding agricultural lime to raise pH for most crops.' :
                      soilData.ph > 7.5 ? 
                      'Your soil is alkaline. Consider adding sulfur or organic matter to lower pH for most crops.' :
                      'Your soil pH is in optimal range for most crops.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Soil Management Practices */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Soil Management Practices</h3>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="flex w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs font-bold items-center justify-center mr-2 mt-0.5">1</span>
                <span className="text-sm">Apply organic matter to improve soil structure and water retention</span>
              </li>
              <li className="flex items-start">
                <span className="flex w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs font-bold items-center justify-center mr-2 mt-0.5">2</span>
                <span className="text-sm">Implement crop rotation to prevent nutrient depletion</span>
              </li>
              <li className="flex items-start">
                <span className="flex w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs font-bold items-center justify-center mr-2 mt-0.5">3</span>
                <span className="text-sm">Use cover crops during off-seasons to prevent erosion</span>
              </li>
              <li className="flex items-start">
                <span className="flex w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs font-bold items-center justify-center mr-2 mt-0.5">4</span>
                <span className="text-sm">Apply fertilizers based on soil test recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="flex w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs font-bold items-center justify-center mr-2 mt-0.5">5</span>
                <span className="text-sm">Minimize soil compaction by avoiding heavy machinery when soil is wet</span>
              </li>
            </ul>
            
            <button className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium transition-colors">
              View Detailed Soil Management Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilLandAnalysis;
