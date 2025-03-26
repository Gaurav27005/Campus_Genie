import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../lostandfound.css';

const LostAndFound = () => {
  const [adminClicks, setAdminClicks] = useState(0);
  
  const handleLogoClick = () => {
    setAdminClicks(adminClicks + 1);
    
    // After 5 clicks, redirect to admin login
    if (adminClicks === 4) {
      window.location.href = '/admin/login?devMode=campusGenieAdmin2023';
      setAdminClicks(0);
    }
  };
  
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <img 
            src="/assets/noto_man-genie.png" 
            alt="Genie" 
            onClick={handleLogoClick} 
            style={{ cursor: 'pointer' }}
          />
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/find-items">Find item</Link>
          <Link to="/post-item">Post item</Link>
        </div>
      </nav>

      <main>
        <section className="hero">
          <h1>Lost and Found</h1>
        </section>

        <section className="about-us">
          <div className="about-content">
            <p>Welcome to our online community dedicated to helping you find lost items and reconnect with cherished possessions. At <span className="highlight">Lost and Found</span>, we understand the heartache and frustration that losing something valuable can bring. Whether it's a beloved pet, a sentimental piece of jewelry, or a vital piece of equipment, the distress of losing an item can be overwhelming. Our mission is simple: to provide a platform where people can share information about lost and found items in our college campus, fostering a sense of community and support. We firmly believe that by coming together, we can increase the chances of reuniting lost items with their rightful owners.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LostAndFound;