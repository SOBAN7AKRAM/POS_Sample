// Select the logout link
document.querySelector('.logout-link').addEventListener('click', (e) => {
    // Clear localStorage
    localStorage.clear();
    window.location.href = './login.html';
});
