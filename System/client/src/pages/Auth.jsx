import { useState, useEffect, useRef } from 'react';
import { FcGoogle } from "react-icons/fc";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const recaptchaRef = useRef(null);
  
  // Error state
  const [errors, setErrors] = useState({});

  // Google OAuth and reCAPTCHA configuration
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

  // Load Google OAuth script
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google) {
        console.log('Google OAuth already loaded');
        return;
      }
      
      console.log('Loading Google OAuth script...');
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      script.onerror = () => {
        console.error('Failed to load Google OAuth script');
        setErrors(prev => ({ ...prev, google: 'Failed to load Google OAuth. Please refresh the page.' }));
      };
      document.head.appendChild(script);
    };

    const initializeGoogleAuth = () => {
      if (window.google && GOOGLE_CLIENT_ID !== 'your-google-client-id') {
        try {
          console.log('Initializing Google OAuth with client ID:', GOOGLE_CLIENT_ID);
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
          });
          console.log('Google OAuth initialized successfully');
        } catch (error) {
          console.error('Google OAuth initialization error:', error);
          setErrors(prev => ({ ...prev, google: 'Failed to initialize Google OAuth.' }));
        }
      } else {
        console.warn('Google OAuth client ID not configured properly');
      }
    };

    loadGoogleScript();
  }, [GOOGLE_CLIENT_ID]);

  // Load reCAPTCHA script
  useEffect(() => {
    const loadRecaptchaScript = () => {
      if (window.grecaptcha) {
        console.log('reCAPTCHA already loaded');
        setRecaptchaLoaded(true);
        return;
      }
      
      console.log('Loading reCAPTCHA script...');
      
      // Set up callback function
      window.recaptchaCallback = () => {
        console.log('reCAPTCHA script loaded successfully');
        setRecaptchaLoaded(true);
      };

      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        setErrors(prev => ({ ...prev, recaptcha: 'Failed to load reCAPTCHA. Please refresh the page.' }));
      };
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
        console.log('Rendering reCAPTCHA with site key:', RECAPTCHA_SITE_KEY);
        window.grecaptcha.render(recaptchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: handleRecaptchaResponse,
          'expired-callback': handleRecaptchaExpired,
          'error-callback': handleRecaptchaError
        });
        console.log('reCAPTCHA rendered successfully');
      } catch (error) {
        console.error('reCAPTCHA render error:', error);
        setErrors(prev => ({ ...prev, recaptcha: 'Failed to initialize reCAPTCHA. Please refresh the page.' }));
      }
    }
  }, [recaptchaLoaded]);

  // Handle Google OAuth response
  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      console.log('Google OAuth response received:', response);
      
      // Decode the JWT token to get user info
      try {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        const googleUser = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        };

        console.log('Google user authenticated:', googleUser);
        
        // Store user data
        localStorage.setItem('authToken', response.credential);
        localStorage.setItem('user', JSON.stringify(googleUser));
        
        // Simulate API call to your backend
        setTimeout(() => {
          alert(`Google authentication successful! Welcome ${googleUser.name}!`);
          setLoading(false);
          
          // Reset reCAPTCHA
          if (window.grecaptcha && recaptchaRef.current) {
            window.grecaptcha.reset();
            setRecaptchaVerified(false);
          }
          
          // Redirect to dashboard
          window.location.href = '/dashboard';
        }, 1000);
        
      } catch (decodeError) {
        console.error('Error decoding Google token:', decodeError);
        setErrors({ general: 'Google authentication failed. Invalid token received.' });
        setLoading(false);
      }
      
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
      setErrors({ general: 'Please complete the reCAPTCHA verification first.' });
      return;
    }

    if (window.google && window.google.accounts) {
      try {
        console.log('Initiating Google sign-in...');
        window.google.accounts.id.prompt();
      } catch (error) {
        console.error('Google sign-in error:', error);
        setErrors({ general: 'Failed to initiate Google sign-in. Please try again.' });
      }
    } else {
      console.log('Google OAuth not ready yet');
      setErrors({ general: 'Google OAuth is loading. Please wait a moment and try again.' });
    }
  };

  const checkDetails = (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    
    const usernameInput = document.querySelector('input[placeholder="Username"]').value;
    const passwordInput = document.querySelector('input[placeholder="Password"]').value;
    
    // Basic validation
    if (!usernameInput || !passwordInput) {
      setErrors({ general: 'Please enter both username and password' });
      return;
    }
    
    if (!recaptchaVerified) {
      console.log('Validation failed: reCAPTCHA not verified');
      setErrors({ general: 'Please complete the reCAPTCHA verification' });
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    setTimeout(() => {
      if (passwordInput === "admin12345" && usernameInput === "Hariom") {
        // Store authentication data
        localStorage.setItem('authToken', 'mock-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify({ 
          username: usernameInput, 
          loginTime: new Date().toISOString() 
        }));
        window.location.href = '/dashboard';
      } else {
        setErrors({ general: 'Invalid username or password.' });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="flex flex-row ">
        <img src="/logo.png" alt="logo loading..." className="w-15 h-auto position-fixed overflow-y-hidden m-3"/>
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

          <form onSubmit={checkDetails} className="space-y-4">
            <div>
              <h1 style={{fontFamily: "arial"}} className="font-bold text-3xl">Sign in</h1>
            </div>
            <div className="flex flex-col gap-3 pt-3">
              <input 
                type="text" 
                placeholder='Username' 
                className="border black rounded-xs p-1 pl-2 text-lg"
                required
              />
              <input 
                type="password" 
                placeholder='Password' 
                className="border black rounded-xs p-1 pl-2 text-lg"
                required
              />
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
              disabled={loading || !recaptchaVerified}
              className="w-full cursor-pointer hover:bg-blue-700 flex justify-center py-3 px-4 border border-transparent rounded-xs shadow-sm text-white bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Sign in
            </button>
          </form>
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
              className="w-full cursor-pointer flex flex-row gap-12 items-center py-3 border border-gray-300 rounded-xs shadow-sm bg-white hover:bg-gray-100 transition-all disabled:cursor-not-allowed"
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