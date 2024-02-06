// src/components/GoogleAuth.jsx
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const scope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/spreadsheets',
];

const GoogleAuth = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse); // Here you can send the tokenResponse.code to your backend if necessary
      // Navigate to OAuthCallback component that will handle the code exchange
      navigate(`/oauth2callback?code=${tokenResponse.code}`);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setError(error);
    },
    scope: scope,
    flow: 'auth-code', // This specifies that you want to get an authorization code
  });

  return (
    <div>
      <h1>Login with Google</h1>
      <button onClick={() => handleLogin()}>Login</button>
      {error && <p>Login failed. Please try again.</p>}
    </div>
  );
};

export default GoogleAuth;
