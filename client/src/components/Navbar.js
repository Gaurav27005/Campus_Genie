import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../lostandfound.css';
import '../styles.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check which page we're on
  const isHomePage = location.pathname === '/';
  const isSpecialPage = ['/marketplace', '/map', '/materials', '/lostandfound'].includes(location.pathname);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // For simplicity, we're just setting a user object
      setUser({ name: 'User' });
    }

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isSpecialPage ? 'full-width' : ''}`}>
      <Link to="/" className="nav-logo">
        <img src="/assets/noto_man-genie.png" alt="Genie" />
      </Link>
      
      <div className="nav-links">
        <Link to="/">Home</Link>
        
        {/* Show different nav links based on the page */}
        {isHomePage && (
          <>
            <Link to="/find-items">Find Item</Link>
            <Link to="/post-item">Post Item</Link>
            <Link to="/map">Map</Link>
            <Link to="/materials">Materials</Link>
            <Link to="/marketplace">Marketplace</Link>
          </>
        )}
        
        {isSpecialPage && (
          <>
            <Link to="/map">Map</Link>
            <Link to="/materials">Materials</Link>
            <Link to="/marketplace">Marketplace</Link>
          </>
        )}
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
              <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
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