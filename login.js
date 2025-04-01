document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Clear previous error messages
      const errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.textContent = '';
      }
      
      // Show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Logging in...';
      submitButton.disabled = true;
      
      try {
        console.log('Sending login request to server...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
          // Display error message
          if (errorElement) {
            errorElement.textContent = data.message || 'Login failed. Please try again.';
          }
          // Reset button
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
          return;
        }
        
        // Login successful
        console.log('Login successful, saving token...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to home page
        window.location.href = '/';
      } catch (error) {
        console.error('Error during login:', error);
        
        // Show error to user
        if (errorElement) {
          errorElement.textContent = 'Connection error. Please check your internet connection and try again.';
        }
        
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
});