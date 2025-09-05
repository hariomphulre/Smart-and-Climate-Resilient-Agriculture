import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLeaf,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { useAppContext } from '../../context/AppContext';
import { fetchVegetationData } from '../../services/climateService';

const VegetationAnalysis = ({ dateRange, loading, setLoading }) => {
  const { selectedField, selectedLocation } = useAppContext();
  const [vegetationData, setVegetationData] = useState({
    ndvi: [],
    evi: [],
    gci: [],
    fieldSections: []
  });
  
  useEffect(() => {
    loadVegetationData();
  }, [selectedField, selectedLocation, dateRange]);
  
  const loadVegetationData = async () => {
    setLoading(true);
    try {
      const data = await fetchVegetationData(
        selectedField,
        selectedLocation,
        dateRange
      );
      setVegetationData(data);
    } catch (error) {
      console.error('Error loading vegetation data:', error);
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
  
  // Generate chart data for NDVI
  const ndviChartData = {
    labels: vegetationData.ndvi?.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [],
    datasets: [
      {
        label: 'NDVI',
        data: vegetationData.ndvi?.map(item => item.value) || [],
        fill: true,
        backgroundColor: 'rgba(75, 192, 75, 0.2)',
        borderColor: 'rgb(75, 192, 75)',
        tension: 0.3,
        pointBackgroundColor: 'rgb(75, 192, 75)',
      }
    ]
  };
  
  // Health status color mapping
  const getHealthStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="Analytics">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FontAwesomeIcon icon={faLeaf} className="text-green-600 mr-2" />
          Vegetation & Crop Health
        </h2>
        <p className="text-gray-600">
          Monitor crop health indicators, vegetation indices, and growth patterns.
        </p>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner border-t-4 border-green-500 border-solid rounded-full w-12 h-12 mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading vegetation data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NDVI Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">NDVI - Normalized Difference Vegetation Index</h3>
              <button className="text-gray-500 hover:text-gray-700">
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
            </div>
            <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm">
              <p>NDVI measures <b>green vegetation amount & health</b> using NIR and red light reflectance.</p>
              <p className="mt-1"><b>Range</b>: -1 to +1</p>
              <p className="mt-1"><b>Interpretation</b>: Higher values indicate healthier vegetation.</p>
            </div>
            <div className="h-72">
              <Line data={ndviChartData} options={getChartOptions('NDVI Trend')} />
            </div>
          </div>
          
          {/* Health Analysis */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Crop Health Analysis</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Health</span>
                  <span className="text-sm font-medium">
                    {vegetationData.ndvi?.length && vegetationData.ndvi[vegetationData.ndvi.length - 1].value > 0.7 ? 'Excellent' : 
                    vegetationData.ndvi?.length && vegetationData.ndvi[vegetationData.ndvi.length - 1].value > 0.5 ? 'Good' : 'Fair'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${vegetationData.ndvi?.length ? vegetationData.ndvi[vegetationData.ndvi.length - 1].value * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Stress Detection</span>
                  <span className="text-sm font-medium">Low</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full" 
                    style={{ width: '15%' }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Growth Rate</span>
                  <span className="text-sm font-medium">Normal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: '65%' }}
                  ></div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                <div className="flex items-start">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-green-500 mt-1 mr-2" />
                  <div>
                    <h4 className="font-medium">Recommendation</h4>
                    <p className="text-sm text-gray-600">Crop health indicators are within normal ranges. Continue current management practices and monitor for any changes in NDVI values.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Vegetation Comparison */}
          <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Field Section Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vegetationData.fieldSections?.map((section, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500">{section.name}</span>
                  </div>
                  <div className="flex justify-center mb-2">
                    <div className={`h-20 w-20 rounded-full ${section.value > 0.7 ? 'bg-green-100' : section.value > 0.6 ? 'bg-green-100' : 'bg-yellow-100'} flex items-center justify-center`}>
                      <span className={`text-2xl font-bold ${section.value > 0.7 ? 'text-green-700' : section.value > 0.6 ? 'text-green-700' : 'text-yellow-700'}`}>{section.value}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getHealthStatusColor(section.status)}`}>{section.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Vegetation Insights */}
          <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold mb-3">Vegetation Health Insights</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">NDVI Interpretation</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block bg-red-400 rounded-full mr-2"></span>
                      <span>&lt; 0.1: Barren areas (rock, sand, snow)</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block bg-yellow-400 rounded-full mr-2"></span>
                      <span>0.2 - 0.5: Sparse vegetation</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block bg-green-300 rounded-full mr-2"></span>
                      <span>0.6 - 0.8: Moderate to dense vegetation</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 inline-block bg-green-700 rounded-full mr-2"></span>
                      <span>&gt; 0.8: Very dense vegetation</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Current Assessment</h4>
                  <p className="text-sm mb-3">Based on current NDVI values averaging {vegetationData.ndvi?.length ? vegetationData.ndvi[vegetationData.ndvi.length - 1].value.toFixed(2) : '0.00'}, your crops are showing:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="w-3 h-3 inline-block bg-green-500 rounded-full mt-1 mr-2"></span>
                      <span>Healthy overall crop development</span>
                    </li>
                    {vegetationData.ndvi?.length && vegetationData.ndvi[vegetationData.ndvi.length - 1].value > 0.7 ? (
                      <li className="flex items-start">
                        <span className="w-3 h-3 inline-block bg-green-500 rounded-full mt-1 mr-2"></span>
                        <span>Excellent canopy coverage and photosynthetic activity</span>
                      </li>
                    ) : (
                      <li className="flex items-start">
                        <span className="w-3 h-3 inline-block bg-yellow-500 rounded-full mt-1 mr-2"></span>
                        <span>Some room for improvement in canopy density</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VegetationAnalysis;
