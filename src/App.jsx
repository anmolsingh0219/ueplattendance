// src/App.jsx
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Ensure this import is correct
import GoogleAuth from './pages/components/GoogleAuth'; // Ensure this import is correct

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/" element={<GoogleAuth />} /> {/* Use `element` instead of `component` */}
          {/* Add other routes as needed */}
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;
