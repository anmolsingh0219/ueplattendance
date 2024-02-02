// OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      navigate('/');
      return;
    }

    // Exchange the code for tokens (should be done in the backend)
    const exchangeCodeForTokens = async () => {
      // Replace with your server endpoint that handles the exchange
      const response = await fetch('YOUR_SERVER_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (data.access_token) {
        // Store the access token and navigate to the homepage
        localStorage.setItem('access_token', data.access_token);
        navigate('/homepage');
      } else {
        // Handle errors, such as displaying a message to the user
        navigate('/');
      }
    };

    exchangeCodeForTokens();
  }, [searchParams, navigate]);

  // Render a loading indicator or similar while the exchange is happening
  return <div>Exchanging authorization code for tokens...</div>;
};

export default OAuthCallback;
