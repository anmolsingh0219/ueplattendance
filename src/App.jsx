// src/App.jsx
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OAuthCallback from './components/OAuthCallback'; // Make sure to create this component

const App = () => {
  return (
    <RecoilRoot>
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/auth/google/callback" component={OAuthCallback} />
            {/* Add other routes as needed */}
          </Switch>
        </div>
      </Router>
    </RecoilRoot>
  );
};

export default App;
