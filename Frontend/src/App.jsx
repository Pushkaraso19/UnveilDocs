import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage/HomePage';
import PolicyInsights from './components/PolicyInsights/PolicyInsights';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<PolicyInsights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;