import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    secretKey: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      navigate('/admin/dashboard');
    }
    
    // Secret method: Check for special URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get('devMode');
    if (devMode === 'campusGenieAdmin2023') {
      // Auto-fill the secret key field
      setFormData(prev => ({
        ...prev,
        secretKey: 'genie-admin-access'
      }));
    }
  }, [navigate]);

  const { username, password, secretKey } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    // Hardcoded credentials check (in a real app, this would be on the server)
    if (
      username === 'admin' && 
      password === 'CampusGenie@2023' && 
      secretKey === 'genie-admin-access'
    ) {
      // Set admin token
      localStorage.setItem('adminToken', 'admin-jwt-token-would-be-here');
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Admin access denied.');
    }
  };

  // Secret method: Konami code implementation
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    const handleKeyDown = (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          // Konami code completed
          setFormData(prev => ({
            ...prev,
            secretKey: 'genie-admin-access'
          }));
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1>Admin Access</h1>
        <p className="admin-warning">Restricted Area. Developer access only.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={onSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Developer Secret Key</label>
            <input
              type="password"
              name="secretKey"
              value={secretKey}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn admin-login-btn">Access Admin Panel</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;