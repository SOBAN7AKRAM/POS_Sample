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
                 'Access-Control-Allow-Methods': 'POST',
                 'Access-Control-Allow-Headers': 'Content-Type, Authorization'
             }
         });

         const accessToken = response.data.access_token;
         // store token in local storage
         localStorage.setItem('accessToken', accessToken);

         // Display success message
         output.innerHTML = '<span class="text-success">Login successful! Access token obtained.</span>';
         alert('Login successful!');

         //redirect to home page
         window.location.href = 'index.html';

         // Token can be stored securely if needed
     } catch (error) {
         console.error('Login failed:', error.response?.data || error.message);
         output.innerText = 'Login failed. Please check your credentials.';
     }
});
