// scripting of payment modal
function handlePayment(){
    let selectedProducts = window.selectedProducts;
    amount = document.getElementById('amount');
    amount.value = selectedProducts.reduce((acc, product) => acc + product.currentPrice, 0);
    console.log(selectedProducts);

}
handlePayment();