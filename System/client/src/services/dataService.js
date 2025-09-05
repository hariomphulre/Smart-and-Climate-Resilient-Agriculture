import { parseCSV } from '../utils/dataUtils';

// This is a mock service that would normally fetch data from an API
// For the development phase, we'll simulate loading CSV files

// Function to fetch vegetation indices data
export const fetchVegetationIndices = async (indexName) => {
  try {
    // In a real application, this would be an API call
    // For now, we'll simulate loading a CSV file
    const response = await fetch(`/${indexName}.csv`);
    const csvData = await response.text();
    return parseCSV(csvData);
  } catch (error) {
    console.error(`Error loading ${indexName} data:`, error);
    return [];
  }
};

// Function to fetch weather forecast data
export const fetchWeatherForecast = async (location) => {
  // This would be an API call to a weather service
  // For now, return mock data
  return {
    location,
    forecast: [
      { date: '2025-08-15', high: 32, low: 24, condition: 'sunny' },
      { date: '2025-08-16', high: 30, low: 23, condition: 'partly_cloudy' },
      { date: '2025-08-17', high: 29, low: 22, condition: 'cloudy' },
      { date: '2025-08-18', high: 31, low: 23, condition: 'sunny' },
      { date: '2025-08-19', high: 33, low: 25, condition: 'sunny' },
    ]
  };
};

// Function to fetch field data
export const fetchFieldData = async (fieldId) => {
  // This would be an API call to get field-specific data
  // For now, return mock data
  return {
    id: fieldId,
    name: `Field ${fieldId}`,
    size: 20, // acres
    crops: ['Wheat', 'Corn'],
    soilType: 'Clay Loam',
    plantingDate: '2025-06-10',
    ndviHistory: [
      { date: '2025-07-15', value: 0.65 },
      { date: '2025-07-22', value: 0.68 },
      { date: '2025-07-29', value: 0.72 },
      { date: '2025-08-05', value: 0.75 },
      { date: '2025-08-12', value: 0.78 },
    ]
  };
};
