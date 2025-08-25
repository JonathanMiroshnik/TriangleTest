import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InputPage from './components/InputPage.tsx';
import DisplayPage from './components/DisplayPage.tsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for the input page where users enter triangle coordinates */}
          <Route path="/" element={<InputPage />} />
          {/* Route for the display page where the triangle is shown */}
          <Route path="/display" element={<DisplayPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
