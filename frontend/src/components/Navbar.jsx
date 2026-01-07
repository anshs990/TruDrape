import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const logoutBtn = {
    padding: "5px 15px",
    background: "#4CAF50",
    border: "none",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 40px', background: '#111', borderBottom: '1px solid #222' }}>
      <Link to="/" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>TRUDRAPE</Link>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/3d-model" style={{ color: '#4CAF50', textDecoration: 'none', border: '1px solid #4CAF50', padding: '5px 15px', borderRadius: '4px' }}>
          3D Fitting Room
        </Link>

        {user ? (
          <>
            <span style={{ color: 'white' }}>👋 Hi, {user.firstName}</span>
            <button onClick={handleLogout} style={logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#4CAF50', textDecoration: 'none', border: '1px solid #4CAF50', padding: '5px 15px', borderRadius: '4px' }}>Login</Link>
            <Link to="/register" style={{ color: '#4CAF50', textDecoration: 'none', border: '1px solid #4CAF50', padding: '5px 15px', borderRadius: '4px' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
