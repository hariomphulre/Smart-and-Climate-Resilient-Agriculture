import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FcGoogle } from "react-icons/fc";
import {
  faEye,
  faEyeSlash,
  faLock,
  faEnvelope,
  faUser,
  faShieldHalved,
  faSignInAlt,
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { FaGoogle } from 'react-icons/fa';
const background = "/background_img.jpeg"
const Auth = () => {
  // const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const recaptchaRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    acceptTerms: false
  });
  
  // Error state
  const [errors, setErrors] = useState({});

  // Google OAuth and reCAPTCHA configuration
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'your-recaptcha-site-key';

  // Load Google OAuth script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) return;
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      document.head.appendChild(script);
    };

    const initializeGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
        });
      }
    };

    loadGoogleScript();
  }, []);

  // Load reCAPTCHA script
  useEffect(() => {
    const loadRecaptchaScript = () => {
      if (window.grecaptcha) {
        setRecaptchaLoaded(true);
        return;
      }
      
      window.recaptchaCallback = () => {
        setRecaptchaLoaded(true);
      };

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadRecaptchaScript();

    return () => {
      // Cleanup
      if (window.recaptchaCallback) {
        delete window.recaptchaCallback;
      }
    };
  }, []);

  // Initialize reCAPTCHA when loaded
  useEffect(() => {
    if (recaptchaLoaded && window.grecaptcha && recaptchaRef.current) {
      try {
        window.grecaptcha.render(recaptchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: handleRecaptchaResponse,
          'expired-callback': handleRecaptchaExpired,
          'error-callback': handleRecaptchaError
        });
      } catch (error) {
        console.error('reCAPTCHA render error:', error);
      }
    }
  }, [recaptchaLoaded]);

  // Handle Google OAuth response
  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      console.log('Google OAuth response:', response);
      
      // Here you would typically send the token to your backend
      // const result = await fetch('/api/auth/google', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: response.credential })
      // });
      
      // Mock success for demo
      setTimeout(() => {
        alert('Google authentication successful!');
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Google auth error:', error);
      setErrors({ general: 'Google authentication failed. Please try again.' });
      setLoading(false);
    }
  };

  // Handle reCAPTCHA response
  const handleRecaptchaResponse = (token) => {
    console.log('reCAPTCHA verified:', token);
    setRecaptchaVerified(true);
    setErrors(prev => ({ ...prev, recaptcha: '' }));
  };

  const handleRecaptchaExpired = () => {
    console.log('reCAPTCHA expired');
    setRecaptchaVerified(false);
    setErrors(prev => ({ ...prev, recaptcha: 'reCAPTCHA expired. Please verify again.' }));
  };

  const handleRecaptchaError = () => {
    console.log('reCAPTCHA error');
    setRecaptchaVerified(false);
    setErrors(prev => ({ ...prev, recaptcha: 'reCAPTCHA error. Please try again.' }));
  };

  // Handle Google sign in button click
  const handleGoogleSignIn = () => {
    if (!recaptchaVerified) {
      setErrors(prev => ({ ...prev, recaptcha: 'Please complete the reCAPTCHA verification.' }));
      return;
    }

    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Registration-specific validations
    // if (!isLogin) {
    //   if (!formData.firstName.trim()) {
    //     newErrors.firstName = 'First name is required';
    //   }
      
    //   if (!formData.lastName.trim()) {
    //     newErrors.lastName = 'Last name is required';
    //   }
      
    //   if (formData.password !== formData.confirmPassword) {
    //     newErrors.confirmPassword = 'Passwords do not match';
    //   }
      
    //   if (!formData.acceptTerms) {
    //     newErrors.acceptTerms = 'Please accept the terms and conditions';
    //   }
    // }

    // reCAPTCHA validation
    if (!recaptchaVerified) {
      newErrors.recaptcha = 'Please complete the reCAPTCHA verification';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Here you would typically send data to your backernd
      const endpoint = '/api/auth/login';
      
      // Mock API call
      console.log('Login data: ', formData);
      
      // Simulate API call
      setTimeout(() => {
        alert('Login successful!');
        setLoading(false);
        
        // Reset form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          acceptTerms: false
        });
        
        // Reset reCAPTCHA
        if (window.grecaptcha && recaptchaRef.current) {
          window.grecaptcha.reset();
          setRecaptchaVerified(false);
        }
      }, 1500);
      
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'Authentication failed. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <img src={background} alt="background loading..." style={{position: "fixed"}} className="w-full h-full"/> */}
      <div className="flex flex-row ">
        <img src="/logo.png" alt="logo loding..." className="w-15 h-auto position-fixed overflow-y-hidden m-3"/>
        <h1 style={{fontFamily: "sans-serif"}} className="pt-5 text-3xl font-bold text-green-900">Smart & Climate Resilient Agriculture</h1>
      </div>

      <div style={{justifySelf: "center"}} className="flex items-center flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-sm w-full space-y-8">

        <div className="bg-white shadow-2xl rounded-2xl pl-6 pr-6 pb-6 pt-3 space-y-0">
          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h1 style={{fontFamily: "arial"}} className="font-bold text-3xl">Sign in</h1>
            </div>
            <div className="flex flex-col gap-3 pt-3">
              <input type="text" placeholder='Username' className="border black rounded-xs  p-1 pl-2 text-lg"/>
              <input type="text" placeholder='Password' className="border black rounded-xs  p-1 pl-2 text-lg"/>
            </div>
            <div>
              <div 
                ref={recaptchaRef}
                className="flex justify-center"
              ></div>
              {errors.recaptcha && <p className="mt-2 text-sm text-red-500 text-center">{errors.recaptcha}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xs shadow-sm text-white bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="h-5 w-5 border-b-2 border-white mr-2"></div>
                  Singing In...
                </div>
              ) : (
                <>
                  Sign in
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm pt-1 pb-1">
              <span className="px-2 bg-white text-gray-500">or</span> 
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || !recaptchaVerified}
              className="w-full flex flex-row gap-12 items-center py-3 border border-gray-300 rounded-xs shadow-sm bg-white hover:bg-gray-100 transition-all disabled:cursor-not-allowed"
            >
              <FcGoogle className="ml-4 text-2xl"/>
              {loading ? 'Signing in...' : `Sign in with Google`}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Secured with Google OAuth 2.0 and reCAPTCHA</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;