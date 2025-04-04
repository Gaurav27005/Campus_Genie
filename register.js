document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Clear previous error messages
      const errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.textContent = '';
      }
      
      // Validate passwords match
      if (password !== confirmPassword) {
        if (errorElement) {
          errorElement.textContent = 'Passwords do not match';
        }
        return;
      }
      
      // Show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Registering...';
      submitButton.disabled = true;
      
      try {
        console.log('Sending registration request to server...');
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (!response.ok) {
          // Display error message
          if (errorElement) {
            errorElement.textContent = data.error || 'Registration failed. Please try again.';
          }
          // Reset button
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
          return;
        }
        
        // Registration successful
        console.log('Registration successful, saving token...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to home page
        window.location.href = 'index.html';
      } catch (error) {
        console.error('Error during registration:', error);
        
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