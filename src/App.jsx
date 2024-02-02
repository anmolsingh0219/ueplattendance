// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleAuth from './pages/components/GoogleAuth';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleAuth />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
