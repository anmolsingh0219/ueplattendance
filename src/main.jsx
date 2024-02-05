// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'
import './index.css'
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Accessing environment variables in Vite
const googleClientId = "115381404024-j4bi9p94iarcutrv7o896fpieevq1k2f.apps.googleusercontent.com";


root.render(
  <React.StrictMode>
    <RecoilRoot>
     <GoogleOAuthProvider clientId={googleClientId}>
       <App />
     </GoogleOAuthProvider> 
    </RecoilRoot>
  </React.StrictMode>
);
