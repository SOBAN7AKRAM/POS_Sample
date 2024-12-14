function updateDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString(); // Format: MM/DD/YYYY
    const time = now.toLocaleTimeString(); // Format: HH:MM:SS AM/PM
    const formattedDateTime = `${date} ${time}`;

    // Update the button text
    document.getElementById('liveDateTimeButton').innerText = formattedDateTime;
}

// Call the updateDateTime function every second
setInterval(updateDateTime, 1000);

// Initial call to display the time immediately when the page loads
updateDateTime();