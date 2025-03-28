import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../lostandfound.css';

const LostAndFound = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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

  return (
    <>
      <Navbar />
      <main>
        <div className="lostandfound-container">
          <div className="lostandfound-header">
            <h1 className="lostandfound-title">Lost and Found</h1>
            <div className="action-buttons">
              <Link to="/find-items" className="btn">Find Item</Link>
              <Link to="/post-item" className="btn">Post Item</Link>
            </div>
          </div>
          
          <section className="hero">
            <h1>Lost and Found</h1>
          </section>
          
          <section className="about-us">
            <div className="about-content">
              <p>Welcome to our online community dedicated to helping you find lost items and reconnect with cherished possessions. At <span className="highlight">Lost and Found</span>, we understand the heartache and frustration that losing something valuable can bring. Whether it's a beloved pet, a sentimental piece of jewelry, or a vital piece of equipment, the distress of losing an item can be overwhelming. Our mission is simple: to provide a platform where people can share information about lost and found items in our college campus, fostering a sense of community and support. We firmly believe that by coming together, we can increase the chances of reuniting lost items with their rightful owners.</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LostAndFound;