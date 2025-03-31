import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../lostandfound.css';
import '../styles.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // For simplicity, we're just setting a user object
      // In a real app, you would decode the token or fetch user data
      setUser({ name: 'User' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <img src="/assets/noto_man-genie.png" alt="Genie" />
      </Link>
      <div className="nav-links">
        {/* Updated Home link to point to root URL */}
        <Link to="/">Home</Link>
        <Link to="/find-items">Find item</Link>
        <Link to="/post-item">Post item</Link>
      </div>
      
      {user ? (
        <div className="user-profile">
          <div className="profile-icon" onClick={toggleDropdown}>
            <span className="profile-initial">{user.name.charAt(0)}</span>
          </div>
          {showDropdown && (
            <div className="profile-dropdown">
              <Link to="/profile" className="dropdown-item">My Profile</Link>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="login-link">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;