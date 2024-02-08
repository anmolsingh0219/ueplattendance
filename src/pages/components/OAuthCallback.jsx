// src/components/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userEmailState } from './AppState'; // Import the userEmailState atom

const OAuthCallback = () => {
  const navigate = useNavigate();
  const setUserEmail = useSetRecoilState(userEmailState); // Get the setter function for the userEmailState

  useEffect(() => {
    const exchangeCodeForTokens = async (code) => {
      const tokenEndpoint = 'https://oauth2.googleapis.com/token';
      const payload = {
        client_id: "115381404024-j4bi9p94iarcutrv7o896fpieevq1k2f.apps.googleusercontent.com",
        client_secret: "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",
        code: code,
        redirect_uri: `https://ueplattendance.vercel.app`, // Make sure this matches the redirect URI configured in Google Cloud Console
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
          localStorage.setItem('refresh_token', data.refresh_token); 
          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + data.expires_in);

          // Save refresh token
          localStorage.setItem('expires_at', expiresAt.toISOString());

          // Fetch user information
          const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${data.access_token}` },
          });

          if (userInfoResponse.ok) {
            const userInfo = await userInfoResponse.json();
            setUserEmail(userInfo.email); // Store the user's email in Recoil state
            navigate('/homepage'); // Redirect to the homepage or dashboard
          } else {
            throw new Error('Could not fetch user info.');
          }
        } else {
          throw new Error(data.error || 'Token exchange was not successful.');
        }
      } catch (error) {
        console.error('Error during token exchange or user info fetch:', error);
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
  }, [navigate, setUserEmail]);

  return <div>Loading...</div>;
};

export default OAuthCallback;
