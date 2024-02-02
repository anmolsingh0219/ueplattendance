// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleAuth from './pages/components/GoogleAuth';
import OAuthCallback from './pages/components/OAuthCallback';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleAuth />} />
        <Route path="/oauthcallback" element={<OAuthCallback />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
