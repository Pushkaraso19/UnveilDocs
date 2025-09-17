import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './components/Homepage/HomePage';
import PolicyInsights from './components/PolicyInsights/PolicyInsights';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<PolicyInsights />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;