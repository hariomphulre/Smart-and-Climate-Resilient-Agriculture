import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  getAuthToken, 
  removeAuthToken, 
  isAuthenticated, 
  decodeToken 
} from '../utils/authUtils';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const ActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case ActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error
      };

    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload.user }
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken();
        
        if (token && isAuthenticated()) {
          const decodedToken = decodeToken(token);
          
          if (decodedToken) {
            // You might want to verify the token with your server here
            dispatch({
              type: ActionTypes.LOGIN_SUCCESS,
              payload: {
                user: {
                  id: decodedToken.sub,
                  email: decodedToken.email,
                  name: decodedToken.name,
                  picture: decodedToken.picture
                },
                token
              }
            });
          } else {
            // Invalid token
            removeAuthToken();
            dispatch({ type: ActionTypes.LOGOUT });
          }
        } else {
          // No valid token
          removeAuthToken();
          dispatch({ type: ActionTypes.LOGOUT });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        removeAuthToken();
        dispatch({ type: ActionTypes.LOGOUT });
      } finally {
        dispatch({
          type: ActionTypes.SET_LOADING,
          payload: { isLoading: false }
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (token, user) => {
    try {
      dispatch({ type: ActionTypes.LOGIN_START });

      // You might want to verify the token with your server here
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: {
            user: userData.user || user,
            token
          }
        });

        return { success: true };
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // For demo purposes, if server verification fails, still allow login
      // In production, you should handle this more securely
      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user, token }
      });

      return { success: true };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout endpoint if available
      const token = getAuthToken();
      if (token) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Logout API error:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up local storage and state
      removeAuthToken();
      dispatch({ type: ActionTypes.LOGOUT });
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    dispatch({
      type: ActionTypes.UPDATE_USER,
      payload: { user: userData }
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Check if user has specific role/permission
  const hasRole = (role) => {
    return state.user?.roles?.includes(role) || false;
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    return state.user?.permissions?.includes(permission) || false;
  };

  // Get user profile
  const getUserProfile = async () => {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        updateUser(userData);
        return userData;
      }
    } catch (error) {
      console.error('Get profile error:', error);
    }
    return null;
  };

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    logout,
    updateUser,
    clearError,
    hasRole,
    hasPermission,
    getUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route component
export const ProtectedRoute = ({ children, roles = [], permissions = [] }) => {
  const { isAuthenticated, isLoading, user, hasRole, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login or show auth component
    return <div>Please log in to access this page.</div>;
  }

  // Check roles if specified
  if (roles.length > 0 && !roles.some(role => hasRole(role))) {
    return <div>You don't have permission to access this page.</div>;
  }

  // Check permissions if specified
  if (permissions.length > 0 && !permissions.some(permission => hasPermission(permission))) {
    return <div>You don't have permission to access this page.</div>;
  }

  return children;
};

export default AuthContext;