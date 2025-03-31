document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset error messages
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Basic validation
    let isValid = true;
    
    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        isValid = false;
    }
    
    if (!password) {
        document.getElementById('passwordError').textContent = 'Password is required';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
    if (isValid) {
        // Store login data if remember me is checked
        if (rememberMe) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('rememberMe');
        }

        // Store login timestamp
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        // Store login attempt in session storage
        const loginAttempt = {
            email: email,
            timestamp: new Date().toISOString(),
            success: true
        };
        sessionStorage.setItem('lastLoginAttempt', JSON.stringify(loginAttempt));

        // Redirect to dashboard or show success message
        alert('Login successful!');
        // window.location.href = 'dashboard.html'; // Uncomment when dashboard is ready
    }
});

// Check for remembered email on page load
window.addEventListener('load', function() {
    const rememberedEmail = localStorage.getItem('userEmail');
    const wasRemembered = localStorage.getItem('rememberMe');
    
    if (rememberedEmail && wasRemembered) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to clear stored data (for logout)
function clearStoredData() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('lastLogin');
    sessionStorage.removeItem('lastLoginAttempt');
}