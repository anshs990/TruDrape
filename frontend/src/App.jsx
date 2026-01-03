import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ModelViewer from './pages/3d_model';

function App() {
  return (
    <Router>
      {/* 
          1. Change this div to display: flex 
          2. flex-direction: column ensures Navbar is ON TOP of the content
      */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100vw', 
        minHeight: '100vh', 
        background: '#050505' 
      }}>
        <Navbar />
        
        {/* The content area will now fill the remaining space */}
        <div style={{ flex: 1, width: '100%' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/3d-model" element={<ModelViewer />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
