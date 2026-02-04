import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Anamnese from './components/Anamnese';
import Dashboard from './components/Dashboard';
import AiTest from './components/AiTest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/anamnese" element={<Anamnese />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test-ai" element={<AiTest />} />
      </Routes>
    </Router>
  );
}

export default App;
