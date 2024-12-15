// API Configuration
const TOKEN_URL = 'https://pos.faddishbuilder.com/oauth/token'; // Replace with the correct URL
const CLIENT_ID = 7; // Provided client_id
const CLIENT_SECRET = 'mU57iuPUUqpyqougWjmbDGc20MQlDmJLvZq371id'; // Provided client_secret

// Toggle password visibility
function togglePassword() {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon svg');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('bi-eye');
        eyeIcon.classList.add('bi-eye-slash');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('bi-eye-slash');
        eyeIcon.classList.add('bi-eye');
    }
}

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const output = document.getElementById('output');
    const spinner = document.getElementById('spinner');

    // Show spinner
    spinner.style.display = 'inline-block';
    output.innerText = '';

    try {
        const response = await axios.post(TOKEN_URL, {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            username,
            password,
            grant_type: 'password'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });

        const accessToken = response.data.access_token;

        // Store token in local storage
        localStorage.setItem('accessToken', accessToken);

        // Display success message
        output.innerHTML = '<span class="text-success">Login successful! Redirecting...</span>';

        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 10);
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);

        // Display error message
        output.innerHTML = '<span class="text-danger">Login failed. Please check your credentials.</span>';

        // Remove error message after 3 seconds
        setTimeout(() => {
            output.innerHTML = '';
        }, 3000); // 3000 milliseconds = 3 seconds
    } finally {
        // Hide spinner
        spinner.style.display = 'none';
    }
});
