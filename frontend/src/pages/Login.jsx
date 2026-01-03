import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", formData);
    // Logic for FastAPI Auth will go here later
    navigate('/dashboard');
  };

  const handleGoogleLogin = async (credentialResponse) => {        
    try {
      // credentialResponse.credential is the string token
      const token = credentialResponse.credential;
      
      if (!token) {
        console.error("No token found");
        return;
      }

      const decoded = jwtDecode(token);
      const formData = {
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        email: decoded.email,
        google_id: decoded.sub
      };

      // Send to backend
      const response = await fetch("http://localhost:8000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`Welcome ${decoded.given_name}!`);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error during Google Login:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={{ color: '#4CAF50', marginBottom: '10px' }}>Welcome Back</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '25px' }}>
          Login to access your 3D fitting room.
        </p>

        <input 
          type="email" 
          placeholder="Email Address" 
          style={inputStyle} 
          required 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          style={inputStyle} 
          required 
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />

        <div style={{ textAlign: 'right', marginBottom: '15px' }}>
            <Link to="#" style={{ color: '#4CAF50', fontSize: '12px', textDecoration: 'none' }}>
                Forgot Password?
            </Link>
        </div>

        <button type="submit" style={btnStyle}>Login</button>

        {/* Divider */}
        <div style={dividerContainer}>
          <div style={line}></div>
          <span style={{ padding: '0 10px', color: '#666', fontSize: '12px' }}>OR</span>
          <div style={line}></div>
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin} // This correctly passes the token
            useOneTap
            theme="filled_blue"
            width="400" // Matches your form width
          />
        </div>

        <p style={{ marginTop: '25px', fontSize: '13px', color: '#bbb' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

// --- STYLES (Identical to Register for consistency) ---
const containerStyle = { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '85vh', 
    width: '100%',
    padding: '20px'
};

const formStyle = { 
    background: '#111', 
    padding: '40px', 
    borderRadius: '16px', 
    width: '400px', 
    border: '1px solid #222', 
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
};

const inputStyle = { 
    width: '100%', 
    padding: '14px', 
    margin: '10px 0', 
    background: '#050505', 
    border: '1px solid #333', 
    color: 'white', 
    borderRadius: '8px',
    outline: 'none',
    fontSize: '14px'
};

const btnStyle = { 
    width: '100%', 
    padding: '14px', 
    background: '#4CAF50', 
    border: 'none', 
    color: 'white', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    borderRadius: '8px', 
    fontSize: '15px',
    transition: 'background 0.3s'
};

const googleBtnStyle = {
    width: '100%',
    padding: '12px',
    background: '#fff',
    border: 'none',
    color: '#000',
    cursor: 'pointer',
    fontWeight: '600',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px'
};

const dividerContainer = {
    display: 'flex',
    alignItems: 'center',
    margin: '25px 0'
};

const line = {
    flex: 1,
    height: '1px',
    background: '#333'
};

export default Login;