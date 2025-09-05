import { createContext, useState, useContext } from 'react';

// Create the context
const AppContext = createContext();

// Create a custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Create the provider component
export const AppProvider = ({ children }) => {
  // State for user selections
  const [selectedField, setSelectedField] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  // State for field data
  const [fields, setFields] = useState([
    { id: 1, name: 'Farm 1', location: 'DIT Pune' },
    { id: 2, name: 'Baramati', location: 'Baramati' }
  ]);
  
  // State for analytics data
  const [analyticsData, setAnalyticsData] = useState({
    weather: {},
    vegetation: {},
    soil: {},
    water: {}
  });
  
  // Function to add a new field
  const addField = (fieldName, location) => {
    const newField = {
      id: fields.length + 1,
      name: fieldName,
      location: location || selectedLocation
    };
    
    setFields([...fields, newField]);
  };
  
  // Function to update analytics data
  const updateAnalyticsData = (category, data) => {
    setAnalyticsData(prev => ({
      ...prev,
      [category]: data
    }));
  };
  
  // Values to be provided to consumers
  const value = {
    selectedField,
    setSelectedField,
    selectedLocation,
    setSelectedLocation,
    fields,
    addField,
    analyticsData,
    updateAnalyticsData
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
