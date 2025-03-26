import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles.css';

const Marketplace = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'New',
    contactInfo: '',
    imageUrl: 'https://via.placeholder.com/150'
  });
  const [successMessage, setSuccessMessage] = useState('');

  const { title, description, price, category, condition, contactInfo } = formData;

  useEffect(() => {
    // Fetch marketplace items from API
    const fetchItems = async () => {
      try {
        const res = await axios.get('/api/marketplace');
        setItems(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load marketplace items');
        setLoading(false);
        
        // Fallback to mock data if API fails
        const mockItems = [
          {
            _id: '1',
            title: 'Calculus Textbook',
            description: 'Calculus: Early Transcendentals, 8th Edition. Good condition with minimal highlighting.',
            price: '₹800',
            category: 'Books',
            condition: 'Used - Good',
            contactInfo: 'john.doe@example.com',
            imageUrl: 'https://via.placeholder.com/150',
            postedDate: '2023-04-15',
            seller: 'John Doe'
          },
          // ... other mock items
        ];
        
        setItems(mockItems);
      }
    };

    fetchItems();
  }, []);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = e => {
    // In a real app, you would upload the image to a storage service
    // For this demo, we'll just use a placeholder URL
    setFormData({ ...formData, imageUrl: 'https://via.placeholder.com/150' });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Send data to the backend API
      const res = await axios.post('/api/marketplace', {
        ...formData,
        seller: 'Current User' // In a real app, this would come from auth
      });
      
      // Add the new item to the state
      setItems([res.data, ...items]);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: 'New',
        contactInfo: '',
        imageUrl: 'https://via.placeholder.com/150'
      });
      
      setShowAddForm(false);
      setSuccessMessage('Item listed successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to list item. Please try again.');
    }
  };

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
    setError('');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Navbar />
      <main className="marketplace-container">
        <div className="marketplace-header">
          <h1>Campus Marketplace</h1>
          <p>Buy and sell items with fellow students on campus</p>
          <button className="btn add-item-btn" onClick={toggleAddForm}>
            {showAddForm ? 'Cancel' : '+ Sell an Item'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {showAddForm && (
          <div className="add-item-form-container">
            <h2>List an Item for Sale</h2>
            <form className="add-item-form" onSubmit={onSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={title}
                  onChange={onChange}
                  placeholder="What are you selling?"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={description}
                  onChange={onChange}
                  placeholder="Describe your item (condition, features, etc.)"
                  required
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="text"
                    name="price"
                    value={price}
                    onChange={onChange}
                    placeholder="Price in Rupees"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={category}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Books">Books</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Sports">Sports Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Condition</label>
                  <select
                    name="condition"
                    value={condition}
                    onChange={onChange}
                    required
                  >
                    <option value="New">New</option>
                    <option value="Used - Like New">Used - Like New</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Contact Information</label>
                  <input
                    type="text"
                    name="contactInfo"
                    value={contactInfo}
                    onChange={onChange}
                    placeholder="Email or Phone Number"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Upload Image</label>
                <input
                  type="file"
                  onChange={onImageChange}
                  accept="image/*"
                />
              </div>
              <button type="submit" className="btn submit-btn">List Item</button>
            </form>
          </div>
        )}

        <div className="marketplace-filters">
          <div className="search-bar">
            <input type="text" placeholder="Search items..." />
            <button className="search-btn">Search</button>
          </div>
          <div className="filter-options">
            <select defaultValue="">
              <option value="">All Categories</option>
              <option value="Books">Books</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Sports">Sports Equipment</option>
              <option value="Other">Other</option>
            </select>
            <select defaultValue="newest">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="marketplace-items">
          {loading ? (
            <p className="loading-text">Loading items...</p>
          ) : items.length > 0 ? (
            items.map(item => (
              <div className="item-card" key={item._id || item.id}>
                <div className="item-image">
                  <img src={item.imageUrl} alt={item.title} />
                </div>
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-price">{item.price}</p>
                  <p className="item-description">{item.description}</p>
                  <div className="item-meta">
                    <span className="item-category">{item.category}</span>
                    <span className="item-condition">{item.condition}</span>
                  </div>
                  <div className="item-seller">
                    <p>Seller: {item.seller}</p>
                    <p>Posted: {formatDate(item.postedDate)}</p>
                  </div>
                  <button className="btn contact-btn" onClick={() => window.location.href = `mailto:${item.contactInfo}`}>
                    Contact Seller
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-items">No items found. Be the first to list something!</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Marketplace;