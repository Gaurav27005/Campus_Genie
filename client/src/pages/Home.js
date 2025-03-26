import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // For simplicity, we're just setting a user object
      // In a real app, you would decode the token or fetch user data
      setUser({ name: 'User' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <header>
        <div className="Genie"><img src="/assets/noto_man-genie.png" alt="Genie" /></div>
        <div className="brand">Campus Genie</div>
        <nav className="navbar">
          {isLoggedIn ? (
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
      </header>

      {/* Section for Campus Map and Study Materials */}
      <section className="group">
        <div className="group-content">
          <div className="sections">
            <section id="map" className="section">
              <h2>Campus Map 🗺️</h2>
              <p>Explore your college with our interactive map!</p>
              <Link className="btn" to="/map">View Map</Link>
            </section>

            <section id="materials" className="section">
              <h2>Study Materials 📚</h2>
              <p>Access and upload notes, guides, and other study resources.</p>
              <Link className="btn" to="/materials">View Materials</Link>
            </section>
          </div>
          <img src="/assets/image 8.png" alt="Unified Image for Map and Materials" id="group-img1" />
        </div>
      </section>

      {/* Section for Lost and Found, PG Finder, and Marketplace */}
      <section className="group">
        <div className="group-content">
          <img src="/assets/image 23.png" alt="Unified Image for Lost and Found, PG Finder, and Marketplace"
            id="group-img2" />
          <div className="sections">
            <section id="lostandfound" className="section">
              <h2>Lost and Found 🔍</h2>
              <p>Report or find lost items on campus with ease.</p>
              <Link className="btn" to="/lostandfound">Explore Lost and Found</Link>
            </section>

            <section id="pgfinder" className="section">
              <h2>PG Finder 🏠</h2>
              <p>Find the perfect accommodation near your campus.</p>
              <Link className="btn" to="/pgfinder">Find PG</Link>
            </section>

            <section id="marketplace" className="section">
              <h2>Campus Marketplace 🛍️</h2>
              <p>Buy and sell items with fellow students on campus.</p>
              <Link className="btn" to="/marketplace">Visit Marketplace</Link>
            </section>
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 Campus Genie. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Home;