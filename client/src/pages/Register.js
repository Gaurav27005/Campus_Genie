import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setError('Passwords do not match');
    } else {
      try {
        const newUser = {
          name,
          email,
          password
        };
        const res = await axios.post('/api/auth/register', newUser);
        // Store token in localStorage
        localStorage.setItem('token', res.data.token);
        // Redirect to home page
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
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
          <h1 className="auth-title">Register</h1>
          {error && <div className="auth-error">{error}</div>}
          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={onChange}
                required
              />
            </div>
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
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={password2}
                onChange={onChange}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="btn auth-btn">Register</button>
          </form>
          <p className="auth-redirect">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>

      <footer>
        <p>&copy; 2025 Campus Genie. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Register;