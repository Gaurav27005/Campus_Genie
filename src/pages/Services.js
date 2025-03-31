import React from 'react';
import './Services.css';

const Services = () => {
  return (
    <div className="services">
      <h1>Our Services</h1>
      <div className="services-grid">
        <div className="service-card">
          <h3>Campus Navigation</h3>
          <p>Interactive maps and directions to help you find your way around campus.</p>
        </div>
        <div className="service-card">
          <h3>Event Calendar</h3>
          <p>Comprehensive calendar of campus events, clubs, and activities.</p>
        </div>
        <div className="service-card">
          <h3>Resource Finder</h3>
          <p>Locate campus resources like libraries, study rooms, and computer labs.</p>
        </div>
        <div className="service-card">
          <h3>Course Planner</h3>
          <p>Plan your academic schedule and track your degree progress.</p>
        </div>
      </div>
    </div>
  );
};

export default Services;