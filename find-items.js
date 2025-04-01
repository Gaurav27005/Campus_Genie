document.addEventListener('DOMContentLoaded', function() {
  // Fetch lost and found items from the API
  fetchItems();
  
  // Add event listeners for filter buttons if they exist
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const status = this.dataset.status;
        fetchItems(status);
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
});

async function fetchItems(status = null) {
  try {
    let url = '/api/lostfound';
    if (status) {
      url += `?status=${status}`;
    }
    
    const response = await fetch(url);
    const items = await response.json();
    
    if (response.ok) {
      displayItems(items);
    } else {
      console.error('Error fetching items:', items.message);
      displayError('Failed to load items. Please try again later.');
    }
  } catch (error) {
    console.error('Error:', error);
    displayError('Failed to connect to the server. Please try again later.');
  }
}

function displayItems(items) {
  const itemsGrid = document.querySelector('.items-grid');
  
  // Clear existing items
  itemsGrid.innerHTML = '';
  
  if (items.length === 0) {
    itemsGrid.innerHTML = '<div class="no-items">No items found</div>';
    return;
  }
  
  // Create item cards
  items.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';
    
    const statusLabel = item.status === 'lost' ? 'Lost' : 'Found';
    const statusClass = item.status === 'lost' ? 'lost-status' : 'found-status';
    
    itemCard.innerHTML = `
      <div class="img-container">
        <img src="${item.imageUrl || '/Assets/placeholder.png'}" alt="${item.title}">
        <span class="status-badge ${statusClass}">${statusLabel}</span>
      </div>
      <div class="content">
        <h3>${item.title}</h3>
        <p><strong>Category:</strong> ${item.category}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
        <p><strong>Description:</strong> ${item.description}</p>
        <p><strong>Contact:</strong> ${item.contactInfo}</p>
        <p class="posted-by"><small>Posted by: ${item.postedBy ? item.postedBy.name : 'Anonymous'}</small></p>
      </div>
    `;
    
    itemsGrid.appendChild(itemCard);
  });
}

function displayError(message) {
  const itemsGrid = document.querySelector('.items-grid');
  itemsGrid.innerHTML = `<div class="error-message">${message}</div>`;
}