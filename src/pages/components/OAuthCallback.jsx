// src/components/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeCodeForTokens = async (code) => {
      const tokenEndpoint = 'https://oauth2.googleapis.com/token';
      const payload = {
        client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
        client_secret: import.meta.env.VITE_APP_GOOGLE_CLIENT_SECRET,
        code: code,
        redirect_uri: `https://ueplattendance.vercel.app/oauth2callback`, // Ensure this matches the Google Cloud Console settings
        grant_type: 'authorization_code',
      };

      try {
        const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(payload),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('access_token', data.access_token);
          // Redirect to the homepage or dashboard
          navigate('/homepage');
        } else {
          throw new Error(data.error || 'Token exchange was not successful.');
        }
      } catch (error) {
        console.error('Error during token exchange:', error);
        navigate('/'); // Redirect to login on error
      }
    };

    // Extract the code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      exchangeCodeForTokens(code);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default OAuthCallback;
