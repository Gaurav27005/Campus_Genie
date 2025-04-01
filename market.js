// Market page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize filters
    initializeFilters();
    
    // Initialize listing interactions
    initializeListingInteractions();
});

function initializeFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const priceInputs = document.querySelectorAll('.price-range input');
    const conditionSelect = document.querySelector('select[name="condition"]');

    // Category filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterListings();
        });
    });

    // Price range filter
    priceInputs.forEach(input => {
        input.addEventListener('input', filterListings);  // Changed from 'change' to 'input' for real-time filtering
    });

    function filterListings() {
        const activeCategory = document.querySelector('.category-btn.active')?.dataset.category;
        const listingCards = document.querySelectorAll('.listing-card');
        const minPrice = parseFloat(document.querySelector('.price-range input[placeholder="Min"]')?.value) || 0;
        const maxPrice = parseFloat(document.querySelector('.price-range input[placeholder="Max"]')?.value) || Infinity;
    
        // Convert listings to array for sorting
        const listingsArray = Array.from(listingCards);
    
        // Sort listings by price
        listingsArray.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
            const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
            return priceA - priceB;
        });
    
        // Apply filters and display sorted listings
        listingsArray.forEach(card => {
            const price = parseFloat(card.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));
            const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
            const priceMatch = price >= minPrice && (maxPrice === Infinity || price <= maxPrice);
    
            if (categoryMatch && priceMatch) {
                card.style.display = 'block';
                // Reorder the cards in the DOM based on price
                card.parentNode.appendChild(card);
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Condition filter
    conditionSelect?.addEventListener('change', filterListings);
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
    
    // Post New Ad button
    document.querySelector('.post-ad-btn').addEventListener('click', () => {
        openPostAdModal();
    });
    
    // Helper functions for modals
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Fix the modal styles syntax error
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
                        <div class="form-group">
                            <label for="adCategory">Category *</label>
                            <select id="adCategory" required>
                                <option value="">Select Category</option>
                                <option value="buy-sell">Buy & Sell</option>
                                <option value="rental">Rental</option>
                                <option value="jobs">Jobs</option>
                                <option value="tickets">Event Tickets</option>
                                <option value="ride-share">Ride Share</option>
                            </select>
                        </div>
                        <!-- ... rest of the form fields ... -->
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        // ... implement form handling ...
    }
    
    // Remove duplicate event listeners
    // Remove the entire duplicate DOMContentLoaded event listener at the bottom
    // and move the search functionality to the main initialization
    
    // In the main DOMContentLoaded event listener at the top, add:
    // Keep only one DOMContentLoaded event listener at the top of the file
    document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-btn');
    const listingCards = document.querySelectorAll('.listing-card');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const priceInputs = document.querySelectorAll('.price-range input');
    const postAdButton = document.querySelector('.post-ad-btn');
    
    // Initialize all functionality
    initializeFilters();
    initializeListingInteractions();
    initializeSearch();
});
}