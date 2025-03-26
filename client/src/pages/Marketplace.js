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
      <main>
        <div className="marketplace-container">
          <div className="marketplace-header">
            <h1 className="marketplace-title">Campus Marketplace</h1>
            <button 
              className="btn" 
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Sell an Item'}
            </button>
          </div>
          
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          
          {showAddForm && (
            <div className="marketplace-form">
              <h3>List a New Item</h3>
              {/* Your form fields here */}
            </div>
          )}
          
          {loading ? (
            <p>Loading marketplace items...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="marketplace-grid">
              {items.map(item => (
                <div className="marketplace-item" key={item._id}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="marketplace-item-image"
                  />
                  <div className="marketplace-item-content">
                    <h3 className="marketplace-item-title">{item.title}</h3>
                    <div className="marketplace-item-price">{item.price}</div>
                    <p className="marketplace-item-description">
                      {item.description.substring(0, 100)}
                      {item.description.length > 100 ? '...' : ''}
                    </p>
                    <div className="marketplace-item-meta">
                      <div className="marketplace-item-seller">
                        <span>{item.seller}</span>
                      </div>
                      <div className="marketplace-item-date">
                        {new Date(item.postedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Marketplace;