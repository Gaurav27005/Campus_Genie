// Market page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize filters
    initializeFilters();
    
    // Initialize listing interactions
    initializeListingInteractions();
    
    // Initialize search functionality
    initializeSearch();
    
    // Load listings from the database
    loadListingsFromDatabase();
});

// Remove the filterListings function from inside initializeFilters
// and keep only the global one at the bottom of the file

function initializeFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const priceInputs = document.querySelectorAll('.price-range input');
    const conditionSelect = document.querySelector('select[name="condition"]');

    // Category filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterListings(); // This now calls the global function
        });
    });

    // Price range filter
    priceInputs.forEach(input => {
        input.addEventListener('input', filterListings);  // Changed from 'change' to 'input' for real-time filtering
    });

    // Condition filter
    conditionSelect?.addEventListener('change', filterListings);
}

// Add this new function to initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-btn');
    
    searchButton.addEventListener('click', function() {
        filterListings();
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filterListings();
        }
    });
}

function initializeListingInteractions() {
    // Enable favorite button functionality
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.textContent = this.textContent === '❤️' ? '💖' : '❤️';
            showNotification('Added to favorites!');
        });
    });
    
    // Enable contact buttons
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const listing = this.closest('.listing-card');
            const title = listing.querySelector('h3').textContent;
            const seller = listing.querySelector('.seller-info span').textContent;
            openContactModal(title, seller);
        });
    });
    
    // Enable report buttons
    document.querySelectorAll('.report-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const listing = this.closest('.listing-card');
            const title = listing.querySelector('h3').textContent;
            openReportModal(title);
        });
    });
    
    // Post New Ad button - Fixed by adding proper selector and event listener
    const postAdButton = document.querySelector('.post-ad-btn');
    if (postAdButton) {
        postAdButton.addEventListener('click', openPostAdModal);
    }
}

// Helper function for notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function openContactModal(listingTitle, seller) {
    const modalHTML = `
        <div class="contact-modal">
            <div class="modal-content">
                <h2>Contact for ${listingTitle}</h2>
                <p class="seller-info">Seller: ${seller}</p>
                <form id="contactForm" class="visitor-form">
                    <div class="form-group">
                        <label for="visitorName">Your Name *</label>
                        <input type="text" id="visitorName" required>
                    </div>
                    <div class="form-group">
                        <label for="visitorEmail">Email Address *</label>
                        <input type="email" id="visitorEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="visitorPhone">Phone Number *</label>
                        <input type="tel" id="visitorPhone" pattern="[0-9]{10}" title="Please enter valid 10-digit number" required>
                    </div>
                    <div class="form-group">
                        <label for="visitorCollege">College Name *</label>
                        <input type="text" id="visitorCollege" required>
                    </div>
                    <div class="form-group">
                        <label for="visitorOffer">Your Offer (Optional)</label>
                        <input type="text" id="visitorOffer" placeholder="Enter your price offer">
                    </div>
                    <div class="form-group">
                        <label for="visitorMessage">Message *</label>
                        <textarea id="visitorMessage" rows="4" required></textarea>
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="submit-btn">Send Message</button>
                        <button type="button" class="close-btn">Close</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add these new styles
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .contact-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        }
    
        .modal-content {
            background: #1a1a1a;
            padding: 1.5rem;
            border-radius: 15px;
            width: 90%;
            max-width: 400px;
            max-height: 80vh;
            color: white;
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.2);
            overflow-y: auto;
        }
    
        .modal-content::-webkit-scrollbar {
            width: 8px;
        }
    
        .modal-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
    
        .modal-content::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #ff6b6b, #ff9f43);
            border-radius: 4px;
        }
    
        .visitor-form .form-group {
            margin-bottom: 1rem;
        }
    
        .visitor-form label {
            display: block;
            margin-bottom: 0.3rem;
            color: #ff9f43;
            font-size: 0.85rem;
        }
    
        .visitor-form input,
        .visitor-form textarea {
            width: 100%;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(30, 30, 30, 0.95);
            color: white;
            font-size: 0.9rem;
        }
    
        .modal-buttons {
            position: sticky;
            bottom: 0;
            background: #1a1a1a;
            padding-top: 1rem;
            margin-top: 1rem;
        }

        .submit-btn, .close-btn {
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .submit-btn {
            background: linear-gradient(45deg, #ff6b6b, #ff9f43);
            color: white;
            flex: 2;
        }

        .close-btn {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            flex: 1;
        }

        .submit-btn:hover, .close-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
        }
    `; // Fix the closing bracket and add missing styles
    document.head.appendChild(modalStyle);

    const modal = document.querySelector('.contact-modal');
    const form = document.getElementById('contactForm');
    const closeBtn = modal.querySelector('.close-btn'); // Fix selector to use modal as context

    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        showNotification('Message sent successfully! Seller will contact you soon.');
        modal.remove();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function openReportModal(listingTitle) {
    const reason = prompt(`Report listing: ${listingTitle}\nPlease provide a reason:`);
    if (reason) {
        showNotification('Thank you for reporting. We will review it.');
    }
}

// Implement proper post ad modal
function openPostAdModal() {
    const modalHTML = `
        <div class="contact-modal">
            <div class="modal-content">
                <h2>Post New Advertisement</h2>
                <form id="postAdForm" class="visitor-form">
                    <input type="hidden" id="adCategory" value="buy-sell">
                    <div class="form-group">
                        <label for="adTitle">Title *</label>
                        <input type="text" id="adTitle" required placeholder="Enter a descriptive title">
                    </div>
                    <div class="form-group">
                        <label for="adPrice">Price (₹) *</label>
                        <input type="number" id="adPrice" required min="0" placeholder="Enter price">
                    </div>
                    <div class="form-group">
                        <label for="adDescription">Description *</label>
                        <textarea id="adDescription" rows="4" required placeholder="Describe your item or service in detail"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="adLocation">Location *</label>
                        <input type="text" id="adLocation" required placeholder="Where is this available?">
                    </div>
                    <div class="form-group">
                        <label for="adCondition">Condition (for items)</label>
                        <select id="adCondition">
                            <option value="">Select Condition</option>
                            <option value="new">New</option>
                            <option value="like-new">Like New</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="used">Used</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="adImage">Upload Image *</label>
                        <input type="file" id="adImage" accept="image/*" required>
                    </div>
                    <div class="form-group">
                        <label for="adContact">Contact Information *</label>
                        <input type="text" id="adContact" required placeholder="Phone or email">
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="submit-btn">Post Advertisement</button>
                        <button type="button" class="close-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add Campus Genie themed styles for the modal
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .contact-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 10, 10, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(8px);
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            max-height: 85vh;
            color: white;
            box-shadow: 0 0 30px rgba(255, 107, 107, 0.3);
            overflow-y: auto;
            animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid rgba(255, 159, 67, 0.2);
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-content h2 {
            color: #ff6b6b;
            margin-bottom: 1.5rem;
            font-weight: 600;
            text-align: center;
            font-size: 1.8rem;
            background: linear-gradient(270deg, #ff6b6b, #ff9f43);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradient 3s linear infinite;
        }
        
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .modal-content::-webkit-scrollbar {
            width: 8px;
        }
        
        .modal-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
        
        .modal-content::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #ff6b6b, #ff9f43);
            border-radius: 4px;
        }
        
        .visitor-form .form-group {
            margin-bottom: 1.2rem;
        }
        
        .visitor-form label {
            display: block;
            margin-bottom: 0.5rem;
            color: #ff9f43;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .visitor-form input,
        .visitor-form textarea,
        .visitor-form select {
            width: 100%;
            padding: 12px 15px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(30, 30, 30, 0.95);
            color: white;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            font-family: 'Poppins', sans-serif;
        }
        
        .visitor-form input:focus,
        .visitor-form textarea:focus,
        .visitor-form select:focus {
            border-color: #ff6b6b;
            box-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
            outline: none;
        }
        
        .visitor-form input::placeholder,
        .visitor-form textarea::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
        
        .modal-buttons {
            display: flex;
            gap: 10px;
            margin-top: 1.5rem;
        }
        
        .submit-btn, .close-btn {
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Poppins', sans-serif;
        }
        
        .submit-btn {
            background: linear-gradient(45deg, #ff6b6b, #ff9f43);
            color: white;
            flex: 2;
        }
        
        .close-btn {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            flex: 1;
        }
        
        .submit-btn:hover, .close-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }
    `;
    document.head.appendChild(modalStyle);
    
    const modal = document.querySelector('.contact-modal');
    const form = document.getElementById('postAdForm');
    const closeBtn = modal.querySelector('.close-btn');
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data (removed token check)
        const category = document.getElementById('adCategory').value;
        const title = document.getElementById('adTitle').value;
        const price = document.getElementById('adPrice').value;
        const description = document.getElementById('adDescription').value;
        const location = document.getElementById('adLocation').value;
        const condition = document.getElementById('adCondition').value;
        const imageFile = document.getElementById('adImage').files[0];
        const contact = document.getElementById('adContact').value;
        
        // Create a new listing card
        createNewListing(category, title, price, description, location, condition, imageFile, contact);
    });
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Function to create a new listing
// Remove token check from createNewListing function
function createNewListing(category, title, price, description, location, condition, imageFile, contact) {
    // Create FormData object to send to server
    const formData = new FormData();
    formData.append('category', category);
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('condition', condition);
    formData.append('image', imageFile);
    formData.append('contact', contact);
    
    // Send data to server without authentication header
    fetch('/api/marketplace/items', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('API endpoint not found. Please make sure the server is running and the routes are set up correctly.');
            }
            return response.json().then(err => {
                throw new Error(err.message || 'Failed to post advertisement');
            }).catch(e => {
                throw new Error(`Server error (${response.status}): The server might not be configured correctly.`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Advertisement posted successfully:', data);
        
        // Create a new listing card
        const listingCard = document.createElement('div');
        listingCard.className = 'listing-card';
        listingCard.dataset.category = category;
        
        // Get user info from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const sellerName = user.name || 'Anonymous User';
        
        // Create the HTML structure for the new listing
        listingCard.innerHTML = `
            <div class="listing-image">
                <img src="${data.image}" alt="${title}">
            </div>
            <div class="listing-details">
                <h3>${title}</h3>
                <p class="price">₹${price}</p>
                <p class="description">${description}</p>
                <div class="seller-info">
                    <span>Posted by ${sellerName}</span>
                    <span>Just now</span>
                </div>
                <div class="contact-info">
                    <p><strong>Contact:</strong> ${contact}</p>
                </div>
            </div>
        `;
        
        // Add the new listing to the listings grid
        const listingsGrid = document.querySelector('.listings-grid');
        listingsGrid.insertBefore(listingCard, listingsGrid.firstChild);
        
        // Close the modal
        document.querySelector('.contact-modal').remove();
        
        showNotification('Your advertisement has been posted successfully!');
    })
    .catch(error => {
        console.error('Error posting advertisement:', error);
        showNotification('Error: ' + error.message);
        
        // If it's a server configuration issue, provide more helpful information
        if (error.message.includes('API endpoint not found') || error.message.includes('Server error')) {
            console.log('Developer tip: Check that you have set up the marketplace routes in server.js and created the MarketplaceItem model.');
        }
    });
}

// Function to load listings from the database
function loadListingsFromDatabase() {
    fetch('/api/marketplace/items')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch listings');
            }
            return response.json();
        })
        .then(items => {
            const listingsGrid = document.querySelector('.listings-grid');
            
            // Clear existing listings
            listingsGrid.innerHTML = '';
            
            if (items.length === 0) {
                // No items found
                const noItemsMessage = document.createElement('div');
                noItemsMessage.className = 'no-items-message';
                noItemsMessage.innerHTML = `
                    <h3>No Listings Found</h3>
                    <p>There are currently no items listed in the marketplace.</p>
                    <p>Be the first to <button class="post-ad-btn-inline">post an advertisement</button>!</p>
                `;
                
                listingsGrid.appendChild(noItemsMessage);
                
                // Add event listener to the inline post ad button
                const postAdBtnInline = noItemsMessage.querySelector('.post-ad-btn-inline');
                postAdBtnInline.addEventListener('click', openPostAdModal);
            } else {
                // Loop through the items and create HTML for each
                items.forEach(item => {
                    const listingCard = document.createElement('div');
                    listingCard.className = 'listing-card';
                    listingCard.dataset.category = item.category;
                    
                    // Format date
                    const date = new Date(item.createdAt);
                    const formattedDate = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                    
                    // Get user info from localStorage
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    
                    // Create the HTML structure for the listing
                    listingCard.innerHTML = `
                        <div class="listing-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="listing-details">
                            <h3>${item.title}</h3>
                            <p class="price">₹${item.price}</p>
                            <p class="description">${item.description}</p>
                            <div class="seller-info">
                                <span>Posted by ${user.name || item.sellerName || 'User'}</span>
                                <span>${formattedDate}</span>
                            </div>
                            <div class="contact-info">
                                <p><strong>Contact:</strong> ${item.contact || 'No contact information provided'}</p>
                            </div>
                        </div>
                    `;
                    
                    // Add the listing card to the grid
                    listingsGrid.appendChild(listingCard);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching listings:', error);
            showNotification('Error loading listings. Please try again later.');
        });
}

// This is now the only filterListings function
function filterListings() {
    const activeCategory = document.querySelector('.category-btn.active')?.dataset.category;
    const listingCards = document.querySelectorAll('.listing-card');
    const minPrice = parseFloat(document.querySelector('.price-range input[placeholder="Min"]')?.value) || 0;
    const maxPrice = parseFloat(document.querySelector('.price-range input[placeholder="Max"]')?.value) || Infinity;
    const searchQuery = document.querySelector('.search-bar input')?.value.toLowerCase();

    // Convert listings to array for sorting
    const listingsArray = Array.from(listingCards);

    // Sort listings by price
    listingsArray.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price')?.textContent.replace(/[^\d.]/g, '')) || 0;
        const priceB = parseFloat(b.querySelector('.price')?.textContent.replace(/[^\d.]/g, '')) || 0;
        return priceA - priceB;
    });

    // Apply filters
    listingsArray.forEach(card => {
        const cardCategory = card.dataset.category;
        const cardPrice = parseFloat(card.querySelector('.price')?.textContent.replace(/[^\d.]/g, '')) || 0;
        const cardTitle = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const cardDescription = card.querySelector('.description')?.textContent.toLowerCase() || '';
        
        // Show card if it matches all filters
        const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory || cardCategory === 'buy-sell';
        const matchesPrice = cardPrice >= minPrice && cardPrice <= maxPrice;
        const matchesSearch = !searchQuery || 
                            cardTitle.includes(searchQuery) || 
                            cardDescription.includes(searchQuery);
        
        if (matchesCategory && matchesPrice && matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
} // Add this closing curly brace to fix the error