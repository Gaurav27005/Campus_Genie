import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../lostandfound.css';
import '../post-item.css';

const PostItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    description: '',
    imageUrl: ''
  });

  const { name, email, phone, title, description } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    // In a real app, you would upload the image to a storage service
    // and get back a URL. For this example, we'll use a placeholder
    const imageUrl = 'https://via.placeholder.com/300';
    
    try {
      await axios.post('/api/lostandfound', { ...formData, imageUrl });
      navigate('/find-items');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <h2 className="section-title">Post Found Item</h2>
        <form className="post-form" onSubmit={onSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Name" 
              name="name"
              value={name}
              onChange={onChange}
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email" 
              name="email"
              value={email}
              onChange={onChange}
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="tel" 
              placeholder="Phone" 
              name="phone"
              value={phone}
              onChange={onChange}
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Title" 
              name="title"
              value={title}
              onChange={onChange}
              required 
            />
          </div>
          <div className="form-group">
            <textarea 
              placeholder="Description" 
              name="description"
              value={description}
              onChange={onChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <input type="file" required />
          </div>
          <button type="submit" className="submit-button">POST</button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default PostItem;