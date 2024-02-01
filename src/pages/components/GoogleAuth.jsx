// src/components/GoogleAuth.jsx
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuth = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse); // Here you can send the tokenResponse.code to your backend if necessary
      localStorage.setItem('access_token', tokenResponse.access_token);
      // Navigate to the dashboard or home page after successful login
      // window.location.href = '/homepage';
      navigate('/homepage');
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setError(error);
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets',
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
