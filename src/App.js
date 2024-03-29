import './App.css';
import '@shopify/polaris/build/esm/styles.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Login/Home';
import Dashboard from './Components/dashboard/Dashboard';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
