// src/App.jsx
import { RecoilRoot } from 'recoil';
import { HomePage } from './pages/HomePage';

const App = () => {
  return (
    <RecoilRoot>
      <div className="App">
        <HomePage />
      </div>
    </RecoilRoot>
  );
};

export default App;
