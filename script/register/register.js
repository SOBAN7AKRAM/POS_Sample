function printContainer() {
    var container = document.querySelector('.print-container').innerHTML; // Get container content
    var originalContent = document.body.innerHTML; // Store original content

    document.body.innerHTML = container; // Replace body with container content
    window.print(); // Trigger print
    document.body.innerHTML = originalContent; // Restore original content
}
// Select the dark mode toggle button (or implement the toggle functionality)
document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.querySelector('#darkModeToggle'); // Add an ID to your toggle in `setting.html`
    
    // Check for previously saved mode in localStorage
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // Add event listener to the toggle button
  
});
