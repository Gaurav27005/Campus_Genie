document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  // Clear previous error messages
  const errorElement = document.getElementById('error-message');
  errorElement.textContent = '';
  
  // Validate passwords match
  if (password !== confirmPassword) {
    errorElement.textContent = 'Passwords do not match';
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      errorElement.textContent = data.message || 'Registration failed. Please try again.';
      return;
    }
    
    // Registration successful
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect to home page
    window.location.href = '/';
  } catch (error) {
    console.error('Error:', error);
    errorElement.textContent = 'An error occurred. Please try again later.';
  }
});