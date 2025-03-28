import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/studymaterial.css';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you would fetch materials from your backend
    // For now, we'll use a mock structure
    const mockSubjects = [
      { id: 'bcn', name: 'BCN' },
      { id: 'cg', name: 'CG' },
      { id: 'dbms', name: 'DBMS' },
      { id: 'dm', name: 'DM' },
      { id: 'dsa', name: 'DSA' },
      { id: 'ldco', name: 'LDCO' },
      { id: 'm3', name: 'M3' },
      { id: 'oop', name: 'OOP' },
      { id: 'pa', name: 'PA' },
      { id: 'se', name: 'SE' }
    ];
    
    setMaterials(mockSubjects);
    setLoading(false);
  }, []);

  const toggleDropdown = (subjectId) => {
    const dropdown = document.getElementById(subjectId);
    const allDropdowns = document.getElementsByClassName('dropdown-content');
    
    // Close all other dropdowns
    for (let item of allDropdowns) {
      if (item.id !== subjectId && item.classList.contains('show')) {
        item.classList.remove('show');
      }
    }
    
    // Toggle the clicked dropdown
    dropdown.classList.toggle('show');
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <img src="/assets/noto_man-genie.png" alt="Genie" />
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
        </div>
      </nav>

      <main>
        <h2 className="section-title">Study Materials</h2>
        
        {loading ? (
          <p>Loading materials...</p>
        ) : (
          <div className="subjects-grid">
            {materials.map(subject => (
              <div key={subject.id} className="subject-container">
                <button 
                  className="subject-btn" 
                  onClick={() => toggleDropdown(subject.id)}
                >
                  {subject.name}
                </button>
                <div id={subject.id} className="dropdown-content">
                  <a href="#" className="material-btn">Notes</a>
                  <a href="#" className="material-btn">PYQ</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer>
        <p>Copyright ©2025 Campus Genie. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default StudyMaterials;