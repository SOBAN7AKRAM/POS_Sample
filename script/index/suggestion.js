 // Handle Product Suggestion Toggle
 const productCards = document.querySelectorAll('.product-card');
 const showSuggestions = localStorage.getItem('showProductSuggestions') === 'true';

 function toggleProductSuggestions(show) {
     productCards.forEach(card => {
         card.classList.toggle('hidden', !show);
     });
 }

 toggleProductSuggestions(showSuggestions);

    // Apply Dark Mode from LocalStorage
    window.onload = function() {
const darkModeStatus = localStorage.getItem('darkMode');
if (darkModeStatus === 'enabled') {
 document.body.classList.add('bg-dark', 'text-black');
} else {
 document.body.classList.remove('bg-dark', 'text-white');
}
};