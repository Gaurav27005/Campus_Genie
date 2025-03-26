import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', formData);
      // Store token in localStorage
      localStorage.setItem('token', res.data.token);
      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      <header>
        <div className="Genie"><img src="/assets/noto_man-genie.png" alt="Genie" /></div>
        <div className="brand">Campus Genie</div>
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>
        </nav>
      </header>

      <main className="auth-container">
        <div className="auth-form-container">
          <h1 className="auth-title">Login</h1>
          {error && <div className="auth-error">{error}</div>}
          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn auth-btn">Login</button>
          </form>
          <p className="auth-redirect">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </main>

      <footer>
        <p>&copy; 2025 Campus Genie. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Login;