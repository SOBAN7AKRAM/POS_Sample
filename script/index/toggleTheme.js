function toggleTheme() {
    var body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
}

// Set default theme to light mode
document.body.classList.add('light-mode');