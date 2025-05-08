import './App.css';
import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import Router and Routes from react-router-dom
import Dashboard from './Dashboard';
import Home from './Home';
import Charts from './Charts';



function App() {

  return (

    <div className="App">

      <Home />
      <Router>

        <Routes>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
          {/* Add more routes as needed */}
        </Routes>

      </Router>

    </div>

  );
}

export default App;
