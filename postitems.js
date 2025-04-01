
document.addEventListener('DOMContentLoaded', function() {
  const itemForm = document.getElementById('itemForm');
  
  if (itemForm) {
    itemForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to post an item');
        window.location.href = '/login.html';
        return;
      }
      
      const formData = new FormData();
      
      // Get form values
      const title = document.getElementById('itemTitle').value;
      const description = document.getElementById('itemDescription').value;
      const category = document.getElementById('itemType').value;
      const location = document.getElementById('itemLocation').value;
      const date = document.getElementById('itemDate').value;
      const status = document.getElementById('itemStatus').value;
      const contactInfo = document.getElementById('contactInfo').value;
      const image = document.getElementById('itemImage').files[0];
      
      // Add values to FormData
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location);
      formData.append('date', date);
      formData.append('status', status);
      formData.append('contactInfo', contactInfo);
      
      if (image) {
        formData.append('image', image);
      }
      
      try {
        const response = await fetch('/api/lostfound', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Show success popup
          document.getElementById('successIcon').style.display = 'block';
          document.getElementById('errorIcon').style.display = 'none';
          document.getElementById('popupTitle').textContent = 'Item Posted Successfully!';
          document.getElementById('popupMessage').textContent = 'Your item has been posted to the lost and found board.';
          document.getElementById('popup').style.display = 'flex';
          
          // Reset form
          itemForm.reset();
        } else {
          // Show error popup
          document.getElementById('successIcon').style.display = 'none';
          document.getElementById('errorIcon').style.display = 'block';
          document.getElementById('popupTitle').textContent = 'Error Posting Item';
          document.getElementById('popupMessage').textContent = data.message || 'There was an error posting your item. Please try again.';
          document.getElementById('popup').style.display = 'flex';
        }
      } catch (error) {
        console.error('Error:', error);
        // Show error popup
        document.getElementById('successIcon').style.display = 'none';
        document.getElementById('errorIcon').style.display = 'block';
        document.getElementById('popupTitle').textContent = 'Error Posting Item';
        document.getElementById('popupMessage').textContent = 'There was an error connecting to the server. Please try again later.';
        document.getElementById('popup').style.display = 'flex';
      }
    });
  }
  
  // Close popup when close button is clicked
  const closePopupBtn = document.getElementById('closePopup');
  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', function() {
      document.getElementById('popup').style.display = 'none';
      
      // If item was posted successfully, redirect to find-items page
      if (document.getElementById('successIcon').style.display === 'block') {
        window.location.href = '/find-items.html';
      }
    });
  }
});