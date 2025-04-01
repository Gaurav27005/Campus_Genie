import React, { useState } from 'react';
import './market.css';

const Market = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [condition, setCondition] = useState('all');

    const categories = [
        { id: 'buy-sell', name: 'Buy & Sell', icon: '🛍️' },
        { id: 'rental', name: 'Rental Services', icon: '🏠' },
        { id: 'jobs', name: 'Jobs & Internships', icon: '💼' },
        { id: 'lost-found', name: 'Lost & Found', icon: '🔍' },
        { id: 'tickets', name: 'Event Tickets', icon: '🎫' },
        { id: 'ride-share', name: 'Ride Sharing', icon: '🚗' }
    ];

    return (
        <div className="marketplace">
            <header className="market-header">
                <h1>Campus Marketplace</h1>
                <button className="post-ad-btn">+ Post New Ad</button>
            </header>

            <div className="search-section">
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="search-btn">Search</button>
                </div>
            </div>

            <div className="marketplace-content">
                <aside className="filters-sidebar">
                    <div className="filter-section">
                        <h3>Categories</h3>
                        <div className="category-list">
                            {categories.map(category => (
                                <button 
                                    key={category.id}
                                    className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category.id)}
                                >
                                    <span>{category.icon}</span>
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Price Range</h3>
                        <div className="price-range">
                            <input 
                                type="number" 
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                            />
                            <span>-</span>
                            <input 
                                type="number" 
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Condition</h3>
                        <select 
                            value={condition} 
                            onChange={(e) => setCondition(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="new">New</option>
                            <option value="used">Used</option>
                        </select>
                    </div>
                </aside>

                <main className="listings-grid">
                    {/* Sample Listing Card */}
                    <div className="listing-card">
                        <div className="listing-image">
                            <img src="sample-item.jpg" alt="Item" />
                            <button className="favorite-btn">❤️</button>
                        </div>
                        <div className="listing-details">
                            <h3>Engineering Textbook</h3>
                            <p className="price">₹500</p>
                            <p className="description">Like new condition, includes practice problems</p>
                            <div className="seller-info">
                                <span>Posted by John D.</span>
                                <span>2 days ago</span>
                            </div>
                            <div className="listing-actions">
                                <button className="contact-btn">Contact Seller</button>
                                <button className="report-btn">⚠️ Report</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Market;

// Add this at the end of your market.jsx file
ReactDOM.render(
    <Market />,
    document.getElementById('root')
);