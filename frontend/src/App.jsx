import './App.css';
import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Router and Routes from react-router-dom
import Dashboard from './Dashboard';
import Home from './Home';

function App() {
  return (
    <div className="App">
      <Home />
      <Router>  {/* Wrap the app in Router */}
        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />  {/* Dashboard route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
