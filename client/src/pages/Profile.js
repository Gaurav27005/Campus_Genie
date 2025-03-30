import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    college: '',
    department: '',
    year: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        // For demo purposes, we're setting mock data
        // In a real app, you would fetch from your API
        setUser({
          name: 'John Doe',
          email: 'john.doe@example.com',
          college: 'D.Y. Patil College of Engineering',
          department: 'Computer Science',
          year: '3rd Year'
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // In a real app, you would send the updated data to your API
      // await axios.put('/api/users/profile', user);
      setIsEditing(false);
      // Show success message
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="loading">Loading profile...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing && (
            <button 
              className="btn edit-profile-btn" 
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && <div className="profile-error">{error}</div>}

        <div className="profile-card">
          <div className="profile-avatar">
            <span>{user.name.charAt(0)}</span>
          </div>

          {isEditing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              <div className="form-group">
                <label>College</label>
                <input
                  type="text"
                  name="college"
                  value={user.college}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={user.department}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <select name="year" value={user.year} onChange={handleChange}>
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div className="profile-actions">
                <button type="submit" className="btn save-btn">Save Changes</button>
                <button 
                  type="button" 
                  className="btn cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="profile-info">
                <h3>Name</h3>
                <p>{user.name}</p>
              </div>
              <div className="profile-info">
                <h3>Email</h3>
                <p>{user.email}</p>
              </div>
              <div className="profile-info">
                <h3>College</h3>
                <p>{user.college || 'Not specified'}</p>
              </div>
              <div className="profile-info">
                <h3>Department</h3>
                <p>{user.department || 'Not specified'}</p>
              </div>
              <div className="profile-info">
                <h3>Year</h3>
                <p>{user.year || 'Not specified'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="profile-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <h3>Posted a lost item</h3>
                <p>Keys found near the library</p>
                <span className="activity-date">2 days ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-content">
                <h3>Uploaded study material</h3>
                <p>Data Structures notes</p>
                <span className="activity-date">1 week ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;