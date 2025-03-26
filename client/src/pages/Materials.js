import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles.css';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    fileUrl: ''
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { title, subject, description } = formData;

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get('/api/materials');
        setMaterials(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load materials');
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [uploadSuccess]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileChange = e => {
    // In a real app, you would upload the file to a storage service
    // For this demo, we'll just use a placeholder URL
    setFormData({ ...formData, fileUrl: 'https://example.com/file.pdf' });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/materials', formData);
      setFormData({
        title: '',
        subject: '',
        description: '',
        fileUrl: ''
      });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setError('Failed to upload material');
    }
  };

  return (
    <>
      <Navbar />
      <main className="materials-section">
        <h1>Study Materials</h1>
        <p>Access and share study resources with your peers.</p>
        
        {error && <div className="error-message">{error}</div>}
        {uploadSuccess && <div className="success-message">Material uploaded successfully!</div>}
        
        <div className="materials-container">
          {loading ? (
            <p>Loading materials...</p>
          ) : materials.length > 0 ? (
            materials.map(material => (
              <div className="material-card" key={material._id}>
                <h3>{material.title}</h3>
                <p className="material-subject">{material.subject}</p>
                <p>{material.description}</p>
                <a href={material.fileUrl} className="btn" target="_blank" rel="noopener noreferrer">Download</a>
              </div>
            ))
          ) : (
            <>
              <div className="material-card">
                <h3>Engineering Mathematics</h3>
                <p className="material-subject">Mathematics</p>
                <p>Comprehensive notes and solved problems</p>
                <button className="btn">Download</button>
              </div>
              
              <div className="material-card">
                <h3>Data Structures</h3>
                <p className="material-subject">Computer Science</p>
                <p>Lecture notes and practice problems</p>
                <button className="btn">Download</button>
              </div>
              
              <div className="material-card">
                <h3>Computer Networks</h3>
                <p className="material-subject">Computer Science</p>
                <p>Reference materials and diagrams</p>
                <button className="btn">Download</button>
              </div>
            </>
          )}
        </div>
        
        <div className="upload-section">
          <h2>Share Your Materials</h2>
          <form className="upload-form" onSubmit={onSubmit}>
            <input 
              type="text" 
              placeholder="Title" 
              name="title"
              value={title}
              onChange={onChange}
              required 
            />
            <input 
              type="text" 
              placeholder="Subject" 
              name="subject"
              value={subject}
              onChange={onChange}
              required 
            />
            <textarea 
              placeholder="Description" 
              name="description"
              value={description}
              onChange={onChange}
              required
            ></textarea>
            <input 
              type="file" 
              onChange={onFileChange}
              required 
            />
            <button type="submit" className="btn">Upload</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Materials;