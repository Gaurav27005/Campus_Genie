// Simple function to test if the authentication is working
function testAuth() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('No token found in localStorage');
        return;
    }
    
    fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Authentication failed with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Authentication successful:', data);
    })
    .catch(error => {
        console.error('Authentication test failed:', error);
    });
}

// Run the test when this script loads
testAuth();