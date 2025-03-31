import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <h1>About CampusGenie</h1>
      <div className="about-content">
        <div className="about-text">
          <p>
            CampusGenie is a comprehensive campus assistant designed to help students
            navigate their college experience with ease. Our platform provides tools
            for campus navigation, event tracking, resource finding, and much more.
          </p>
          <p>
            Founded in 2023, our mission is to simplify campus life and help students
            make the most of their educational journey.
          </p>
        </div>
        <div className="about-image">
          {/* Placeholder for an image */}
          <div className="image-placeholder">About Image</div>
        </div>
      </div>
    </div>
  );
};

export default About;