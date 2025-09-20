# Authentication Integration Guide

This guide shows how to integrate the Auth.jsx component with your existing React application.

## 1. Environment Setup

First, make sure you have the required environment variables set up:

```bash
# In your .env file
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

## 2. App.jsx Integration

Here's how to integrate authentication into your main App.jsx:

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, ProtectedRoute } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard'; // Your existing components
import VegetationAnalysis from './pages/VegetationAnalysis';
import WaterIrrigationAnalysis from './pages/WaterIrrigationAnalysis';
import RainfallAnalysis from './pages/RainfallAnalysis';

// Main App Content Component
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/vegetation" 
          element={
            <ProtectedRoute>
              <VegetationAnalysis />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/water" 
          element={
            <ProtectedRoute>
              <WaterIrrigationAnalysis />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/rainfall" 
          element={
            <ProtectedRoute>
              <RainfallAnalysis />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />
          } 
        />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
```

## 3. Navigation Component with Auth

Create a navigation component that responds to authentication state:

```jsx
// components/Navigation.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaLeaf } from 'react-icons/fa';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <FaLeaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">AgriClimate</span>
            </Link>
            
            <div className="ml-10 flex space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/vegetation"
                className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Vegetation
              </Link>
              <Link
                to="/water"
                className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Water & Irrigation
              </Link>
              <Link
                to="/rainfall"
                className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Rainfall
              </Link>
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <FaUser className="h-8 w-8 text-gray-400 p-1 border rounded-full" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {user?.name || user?.email}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              <FaSignOutAlt className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
```

## 4. Using Auth State in Components

Here's how to use authentication state in your existing components:

```jsx
// In any component
import { useAuth } from '../context/AuthContext';

const SomeComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## 5. API Request with Authentication

Add authentication headers to your API requests:

```jsx
// utils/api.js
import { getAuthToken } from './authUtils';

export const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    // Token expired or invalid
    window.location.href = '/auth';
    return;
  }

  return response;
};
```

## 6. Error Boundary for Auth Errors

Create an error boundary to handle authentication errors:

```jsx
// components/AuthErrorBoundary.jsx
import React from 'react';

class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Auth Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Error
            </h1>
            <p className="text-gray-600 mb-6">
              Something went wrong with authentication. Please try logging in again.
            </p>
            <button
              onClick={() => window.location.href = '/auth'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
```

## 7. Complete main.jsx Setup

Update your main.jsx to include the error boundary:

```jsx
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AuthErrorBoundary from './components/AuthErrorBoundary.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthErrorBoundary>
      <App />
    </AuthErrorBoundary>
  </React.StrictMode>
);
```

## 8. Testing Authentication

1. **Set up environment variables** as shown in AUTH_SETUP.md
2. **Start your development server**: `npm run dev`
3. **Navigate to `/auth`** in your browser
4. **Test Google OAuth** by clicking the Google sign-in button
5. **Test reCAPTCHA** by completing the checkbox verification
6. **Test form validation** by entering invalid data
7. **Test logout** functionality from any protected page

## 9. Production Considerations

- **Server-side token verification**: Implement proper JWT verification on your backend
- **HTTPS**: Ensure all authentication flows use HTTPS in production
- **CSP Headers**: Configure Content Security Policy headers for Google APIs
- **Rate limiting**: Implement rate limiting for authentication endpoints
- **Monitoring**: Set up monitoring for authentication failures and suspicious activity

This setup provides a complete authentication system that's ready for production use with proper security considerations.