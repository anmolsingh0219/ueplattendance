// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleAuth from './components/GoogleAuth';
import OAuthCallback from './components/OAuthCallback';
import HomePage from './HomePage';
import refreshAccessToken from './components/RefreshToken';

const App = () => {
  useEffect(() => {
    const checkTokenValidity = async () => {
      const expiresAt = localStorage.getItem('expires_at');
      if (expiresAt && new Date(expiresAt) < new Date()) {
        await refreshAccessToken();
      }
    };
    checkTokenValidity();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleAuth />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/oauth2callback" element={<OAuthCallback />} />
      </Routes>
    </Router>
  );
};

export default App;
