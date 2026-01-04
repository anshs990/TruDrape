import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';
import { log } from 'three';

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    // Validation Logic
    const validate = (name, value) => {
        let error = "";
        switch (name) {
        case 'firstName':
            // Checks if empty or just spaces
            if (!value.trim()) {
            error = "First name is required.";
            } else if (value.length < 2) {
            error = "First name must be at least 2 characters.";
            }
            break;

        case 'lastName':
            if (!value.trim()) {
            error = "Last name is required.";
            } else if (value.length < 2) {
            error = "Last name must be at least 2 characters.";
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) error = "Enter a valid email address.";
            break;
        case 'password':
            if (value.length < 8) error = "Password must be at least 8 characters.";
            break;
        case 'confirmPassword':
            if (value !== formData.password) error = "Passwords do not match.";
            break;
        default:
            break;
        }
        return error;
    };

    // Run validation on every change if the field was already touched
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (touched[name]) {
        const error = validate(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        
        // Mark the current field as touched
        setTouched((prev) => ({ ...prev, [name]: true }));

        // --- CROSS VALIDATION LOGIC ---
        // If user leaves First Name, we check if Last Name is empty
        if (name === 'firstName' && !formData.lastName.trim()) {
            setTouched((prev) => ({ ...prev, lastName: true }));
            setErrors((prev) => ({ ...prev, lastName: "Last name is also mandatory." }));
        }

        // If user leaves Last Name, we check if First Name is empty
        if (name === 'lastName' && !formData.firstName.trim()) {
            setTouched((prev) => ({ ...prev, firstName: true }));
            setErrors((prev) => ({ ...prev, firstName: "First name is also mandatory." }));
        }

        // Run normal validation for the current field
        const error = validate(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    // Check form validity whenever formData or errors change
    useEffect(() => {
        const allFieldsFilled = Object.values(formData).every(val => val.trim() !== "");
        const noErrors = Object.values(errors).every(err => err === "" || err === undefined);
        setIsFormValid(allFieldsFilled && noErrors);
    }, [formData, errors]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            try {
                const response = fetch("http://localhost:8000/api/register_user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                const data = response.json();
                alert("Backend Response: " + data.message);
            } 
            catch (error) {
                console.error("Connection Error:", error);
                alert("Backend is offline. Run 'python main.py' in the backend folder.");
            } 
            finally {
                setLoading(false);
            }
        }
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
            const response = await fetch("http://localhost:8000/api/register_user", {
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
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2 style={{ color: '#4CAF50', marginBottom: '10px' }}>Join TruDrape</h2>
            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>Experience personalized 3D fashion.</p>
            
            <div style={{ display: 'flex', gap: '20px', width: "100%" }}>
            <div style={{ width: '100%' }}>
                <input 
                name="firstName" type="text" placeholder="First Name" style={inputStyle} required 
                onChange={handleChange} onBlur={handleBlur}
                />
                {touched.firstName && errors.firstName && <span style={errorStyle}>{errors.firstName}</span>}
            </div>
            <div style={{ width: '100%' }}>
                <input 
                name="lastName" type="text" placeholder="Last Name" style={inputStyle} required 
                onChange={handleChange} onBlur={handleBlur}
                />
                {touched.lastName && errors.lastName && <span style={errorStyle}>{errors.lastName}</span>}
            </div>
            </div>

            <input 
            name="email" type="email" placeholder="Email Address" style={inputStyle} required 
            onChange={handleChange} onBlur={handleBlur}
            />
            {touched.email && errors.email && <span style={errorStyle}>{errors.email}</span>}
            
            <input 
            name="password" type="password" placeholder="Password" style={inputStyle} required 
            onChange={handleChange} onBlur={handleBlur}
            />
            {touched.password && errors.password && <span style={errorStyle}>{errors.password}</span>}

            <input 
            name="confirmPassword" type="password" placeholder="Confirm Password" style={inputStyle} required 
            onChange={handleChange} onBlur={handleBlur}
            />
            {touched.confirmPassword && errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword}</span>}
            
            <button 
                type="submit" 
                style={{...btnStyle, opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed'}} 
                disabled={!isFormValid}
            >
            Create Account
            </button>

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
            
            <p style={{ marginTop: '20px', fontSize: '13px', color: '#bbb' }}>
            Already have an account? <Link to="/login" style={{ color: '#4CAF50', textDecoration: 'none' }}>Login</Link>
            </p>
        </form>
        </div>
    );
};

// --- STYLES ---
const errorStyle = {
    color: '#ff4d4d',
    fontSize: '11px',
    display: 'block',
    textAlign: 'left',
    marginTop: '-5px',
    marginBottom: '10px'
};

const containerStyle = { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '90vh', 
    width: '100%',
    padding: '20px',
    margin: 'auto'
};

const formStyle = { 
    background: '#111', 
    padding: '35px', 
    borderRadius: '16px', 
    width: '400px', 
    border: '1px solid #222', 
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
};

const inputStyle = { 
    width: '100%', // Changed to 100% since parent handles padding
    padding: '12px', 
    margin: '8px 0', 
    background: '#050505', 
    border: '1px solid #333', 
    color: 'white', 
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box'
};

const btnStyle = { 
    width: '100%', 
    padding: '12px', 
    background: '#4CAF50', 
    border: 'none', 
    color: 'white', 
    fontWeight: 'bold', 
    borderRadius: '8px', 
    marginTop: '15px',
    fontSize: '15px',
    transition: 'opacity 0.3s'
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
    marginTop: '10px',
    fontSize: '14px'
};

const dividerContainer = {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0'
};

const line = {
    flex: 1,
    height: '1px',
    background: '#333'
};

export default Register;