# Authentication Setup Guide

This guide explains how to set up Google OAuth 2.0 and reCAPTCHA v2 for the Auth.jsx component.

## Prerequisites

1. Google Cloud Console account
2. Google reCAPTCHA account
3. Node.js and npm/yarn installed

## Google OAuth 2.0 Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

### 2. Configure OAuth Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (or Internal for organization)
3. Fill in the required information:
   - App name: Your app name
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if needed

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add authorized origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:5173` (for Vite dev server)
   - Your production domain
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth`
   - `http://localhost:5173/auth`
   - Your production auth callback URL
6. Copy the **Client ID** (you'll need this for the environment variable)

## reCAPTCHA v2 Setup

### 1. Create reCAPTCHA Site

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/)
2. Click **+** to create a new site
3. Fill in the form:
   - Label: Your site name
   - reCAPTCHA type: **reCAPTCHA v2** > **"I'm not a robot" Checkbox**
   - Domains: 
     - `localhost` (for development)
     - Your production domain
4. Accept the terms and submit
5. Copy the **Site Key** (you'll need this for the environment variable)

## Environment Variables Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials in `.env`:
   ```bash
   VITE_GOOGLE_CLIENT_ID=your-actual-google-client-id
   VITE_RECAPTCHA_SITE_KEY=your-actual-recaptcha-site-key
   ```

## Component Features

### Google OAuth 2.0
- One-click sign-in with Google
- Automatic user profile retrieval
- Secure token handling
- Error handling for failed authentication

### reCAPTCHA v2
- "I'm not a robot" checkbox verification
- Prevents automated bot submissions
- Expires after a certain time
- Error handling for verification failures

### Form Validation
- Email format validation
- Password strength requirements (minimum 8 characters)
- Password confirmation matching
- Terms and conditions acceptance
- Real-time error messages

### UI Features
- Responsive design for all screen sizes
- Toggle between sign-in and sign-up modes
- Password visibility toggle
- Loading states with spinners
- Gradient backgrounds and modern styling
- Accessibility-friendly form elements

## Security Best Practices

### Client-Side
- Environment variables for sensitive data
- Input validation and sanitization
- HTTPS enforcement in production
- Secure token storage (consider httpOnly cookies)

### Server-Side (Recommended)
- Verify Google tokens on your backend
- Validate reCAPTCHA responses on server
- Implement rate limiting
- Use CSRF protection
- Secure session management

## Backend Integration

To complete the authentication flow, you'll need backend endpoints:

### Google OAuth Verification
```javascript
// Example backend endpoint
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  
  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    
    // Create or update user in your database
    // Generate your own JWT token
    // Return success response
    
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

### reCAPTCHA Verification
```javascript
// Example backend verification
app.post('/api/auth/verify-recaptcha', async (req, res) => {
  const { token } = req.body;
  
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  });
  
  const data = await response.json();
  
  if (data.success) {
    // reCAPTCHA verification successful
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'reCAPTCHA verification failed' });
  }
});
```

## Testing

### Test Accounts
- Use the test Google accounts you added in the OAuth consent screen
- Test both successful and failed authentication flows
- Verify reCAPTCHA functionality in different browsers

### Development
- Ensure localhost is properly configured in both Google OAuth and reCAPTCHA settings
- Test with HTTPS in production-like environments
- Verify environment variables are loaded correctly

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Check that your redirect URI matches exactly in Google Console
   - Ensure protocol (http/https) matches

2. **reCAPTCHA not loading**
   - Verify the site key is correct
   - Check that your domain is added to reCAPTCHA settings
   - Ensure no ad blockers are interfering

3. **Environment variables not working**
   - Restart the development server after changing .env
   - Ensure variables start with `VITE_` for Vite projects
   - Check for typos in variable names

### Debug Mode
Enable debug logging by adding console.log statements in the component to track:
- OAuth flow steps
- reCAPTCHA verification status
- Form validation errors
- Network requests and responses

## Production Deployment

### Checklist
- [ ] Update OAuth authorized domains with production URL
- [ ] Update reCAPTCHA domains with production URL
- [ ] Set production environment variables
- [ ] Enable HTTPS
- [ ] Implement proper error handling
- [ ] Set up monitoring and logging
- [ ] Test all authentication flows

### Security Headers
Consider adding these security headers in production:
```
Content-Security-Policy: frame-ancestors 'self' https://www.google.com https://recaptcha.google.com
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
```

## Support

For additional help:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [reCAPTCHA v2 Documentation](https://developers.google.com/recaptcha/docs/display)
- [React Hook Form Documentation](https://react-hook-form.com/) (if you want to upgrade form handling)