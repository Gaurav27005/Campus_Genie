import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../lostandfound.css';
import '../find-items.css';

const FindItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('/api/lostandfound');
        setItems(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <h2 className="section-title">Lost and Found Items</h2>
        {loading ? (
          <p>Loading items...</p>
        ) : (
          <div className="items-grid">
            {items.length > 0 ? (
              items.map(item => (
                <div className="item-card" key={item._id}>
                  <img src={item.imageUrl} alt={item.title} />
                  <h3>{item.title}</h3>
                  <p>{item.description.substring(0, 100)}...</p>
                </div>
              ))
            ) : (
              <>
                <div className="item-card">
                  <img src="/assets/book.jpg" alt="Book Of Vishanti" />
                  <h3>Found Book Of Vishanti</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...</p>
                </div>
                <div className="item-card">
                  <img src="/assets/hammer.jpg" alt="Mjolnir" />
                  <h3>Found Mjolnir @ Earth</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...</p>
                </div>
                <div className="item-card">
                  <img src="/assets/keys.jpg" alt="Keys" />
                  <h3>Found keys</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...</p>
                </div>
                <div className="item-card">
                  <img src="/assets/stones.jpg" alt="Infinity Stones" />
                  <h3>Found Infinity Stones @ TVA</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...</p>
                </div>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default FindItems;