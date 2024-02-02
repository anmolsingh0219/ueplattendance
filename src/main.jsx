// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Accessing environment variables in Vite
const googleClientId = "115381404024-j4bi9p94iarcutrv7o896fpieevq1k2f.apps.googleusercontent.com";


root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
