// src/components/GoogleAuth.jsx
import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const scope = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/spreadsheets',
].join(' ');

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
    <div className='flex flex-col content-center items-center py-10 bg-white h-screen w-screen text-black'>
      <h1>Attendance Master Ubiquity</h1>
      <button className='text-white bg-black' onClick={() => handleLogin()}>Login</button>
      {error && <p>Login failed. Please try again.</p>}
    </div>
  );
};

export default GoogleAuth;
