const tbody = document.querySelector('.table-container tbody');
const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

if (selectedProducts.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `<td colspan="6" class="empty-cart">Cart is empty</td>`;
    tbody.appendChild(emptyRow);
} else {
    selectedProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${product.name} (${product.size})</td>
                            <td>J$ ${product.price}</td>
                            <td>J$ 0.00</td>
                            <td>${product.currentQuantity}</td>
                            <td>J$ ${product.currentPrice}</td>
                        `;
        tbody.appendChild(row);
    });
}