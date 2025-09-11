// This file contains API URLs and other configuration values
// Determine if we're in production based on environment
const isDevelopment = import.meta.env ? import.meta.env.DEV : (process.env.NODE_ENV === 'development');

// Use different base URLs for development and production
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000'
  : '/api'; // In production, use relative URLs

const CLIENT_URL = isDevelopment
  ? 'http://localhost:5173'
  : window.location.origin;

export const API_URLS = {
  FIELDS: `${API_BASE_URL}/api/fields`,
  SOIL_DATA: `${API_BASE_URL}/api/soil`,
  UPDATE_MANIPAL: `${API_BASE_URL}/api/update-manipal`
};

export default {
  API_BASE_URL,
  API_URLS
};
