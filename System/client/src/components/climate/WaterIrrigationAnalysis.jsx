import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDroplet,
  faInfoCircle,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { useAppContext } from '../../context/AppContext';
import { fetchWaterData } from '../../services/climateService';

const WaterIrrigationAnalysis = ({ dateRange, loading, setLoading }) => {
  const { selectedField, selectedLocation } = useAppContext();
  const [waterData, setWaterData] = useState({
    soilMoisture: [],
    irrigationEvents: [],
    recommendations: []
  });
  
  useEffect(() => {
    loadWaterData();
  }, [selectedField, selectedLocation, dateRange]);
  
  const loadWaterData = async () => {
    setLoading(true);
    try {
      const data = await fetchWaterData(
        selectedField, 
        selectedLocation, 
        dateRange
      );
      setWaterData(data);
    } catch (error) {
      console.error('Error loading water data:', error);
    } finally {
      setLoading(false);
    }
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
  
  // Generate chart data for soil moisture
  const soilMoistureChartData = {
    labels: waterData.soilMoisture?.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'Soil Moisture (%)',
        data: waterData.soilMoisture?.map(item => item.value) || [],
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
          <FontAwesomeIcon icon={faDroplet} className="text-blue-500 mr-2" />
          Water & Irrigation
        </h2>
        <p className="text-gray-600">
          Monitor soil moisture, irrigation patterns, and water usage efficiency.
        </p>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading water data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Soil Moisture Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="h-80">
              <Line data={soilMoistureChartData} options={getChartOptions('Soil Moisture')} />
            </div>
          </div>
          
          {/* Irrigation Recommendations */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Irrigation Recommendations</h3>
            
            <div className="space-y-4">
              {waterData.recommendations?.map((recommendation, index) => (
                <div 
                  key={index} 
                  className={`p-3 ${
                    recommendation.priority === 'warning' 
                      ? 'bg-yellow-50 border-l-4 border-yellow-500' 
                      : 'bg-blue-50 border-l-4 border-blue-500'
                  } rounded`}
                >
                  <div className="flex items-start">
                    <FontAwesomeIcon 
                      icon={recommendation.priority === 'warning' ? faTriangleExclamation : faInfoCircle} 
                      className={recommendation.priority === 'warning' ? 'text-yellow-500 mt-1 mr-2' : 'text-blue-500 mt-1 mr-2'} 
                    />
                    <div>
                      <h4 className="font-medium">{recommendation.title}</h4>
                      <p className="text-sm text-gray-600">{recommendation.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {!waterData.recommendations?.length && (
                <div className="p-3 bg-gray-50 border-l-4 border-gray-300 rounded">
                  <p className="text-sm text-gray-600">No irrigation recommendations available for the selected period.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Irrigation History */}
          <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Irrigation History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field Section</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water Used (L)</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {waterData.irrigationEvents?.map((event, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.fieldSection}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          event.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          event.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {!waterData.irrigationEvents?.length && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No irrigation events found for the selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Water Efficiency Metrics */}
          <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Water Efficiency Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="text-sm text-gray-600 mb-1">Water Use Efficiency</div>
                <div className="text-2xl font-bold text-blue-800">87%</div>
                <div className="text-sm text-blue-600 mt-1">Above Average</div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="text-sm text-gray-600 mb-1">Total Water Used (30 days)</div>
                <div className="text-2xl font-bold text-blue-800">35,500 L</div>
                <div className="text-sm text-blue-600 mt-1">12% less than last month</div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="text-sm text-gray-600 mb-1">Irrigation Frequency</div>
                <div className="text-2xl font-bold text-blue-800">3.2 days</div>
                <div className="text-sm text-blue-600 mt-1">Average interval between events</div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-md">
                <div className="text-sm text-gray-600 mb-1">Water Savings</div>
                <div className="text-2xl font-bold text-blue-800">15%</div>
                <div className="text-sm text-blue-600 mt-1">Compared to regional average</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterIrrigationAnalysis;
