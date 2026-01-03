import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 40px', background: '#111', borderBottom: '1px solid #222' }}>
    <Link to="/" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>TRUDRAPE</Link>
    <div style={{ display: 'flex', gap: '20px' }}>
      <Link to="/3d-model" style={{ color: '#4CAF50', textDecoration: 'none', border: '1px solid #4CAF50', padding: '5px 15px', borderRadius: '4px' }}>3D Fitting Room</Link>
      <Link to="/login" style={{ color: '#4CAF50', textDecoration: 'none', border: '1px solid #4CAF50', padding: '5px 15px', borderRadius: '4px' }}>Login</Link>
      <Link to="/register" style={{ color: '#4CAF50', textDecoration: 'none', border: '1px solid #4CAF50', padding: '5px 15px', borderRadius: '4px' }}>Sign Up</Link>
    </div>
  </nav>
);

export default Navbar;