import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to CampusGenie</h1>
        <p>Your ultimate campus assistant</p>
        <button className="cta-button">Get Started</button>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>Campus Navigation</h3>
          <p>Find your way around campus with ease</p>
        </div>
        <div className="feature-card">
          <h3>Event Calendar</h3>
          <p>Stay updated with all campus events</p>
        </div>
        <div className="feature-card">
          <h3>Resource Finder</h3>
          <p>Locate campus resources quickly</p>
        </div>
      </div>
    </div>
  );
};

export default Home;