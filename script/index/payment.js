function handlePayment() {
    let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || []; 
    const amount = document.getElementById('amount');
    amount.value = selectedProducts.reduce((acc, product) => acc + product.currentPrice, 0);

    // Get the right side elements of the modal
    const modalItem = document.getElementById('modal_items');
    const modalPayable = document.getElementById('modal_payable');
    const modalPaying = document.getElementById('modal_paying');
    const modalReturn = document.getElementById('modal_return');
    const modalBalance = document.getElementById('modal_balance');

    const updateModalValues = () => {
        const totalPayable = selectedProducts.reduce((acc, product) => acc + product.currentPrice, 0);
        const payingAmount = parseFloat(amount.value) || 0;
        modalItem.innerHTML = selectedProducts.reduce((acc, product) => acc + product.currentQuantity, 0);
        modalPayable.innerHTML = totalPayable;
        modalPaying.innerHTML = payingAmount;
        modalReturn.innerHTML = payingAmount - totalPayable;
    };

    // Initial update
    updateModalValues();

    // Add event listener to update modal values when amount changes
    amount.addEventListener('input', updateModalValues);

    document.getElementById('finalizeBtn').addEventListener('click', () => {
        // Populate the invoice modal with data
        const invoiceContent = document.getElementById('invoiceContent');
        // const customerName = document.getElementById('customerName').value;
        const currentDate = new Date().toLocaleDateString();

        invoiceContent.innerHTML = `
            <h1>Invoice</h1>
            <p>Customer: soban</p>
            <p>Date: ${currentDate}</p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${modalItem.innerHTML}
                </tbody>
            </table>
            <p>Total Payable: ${modalPayable.innerHTML}</p>
            <p>Paying Amount: ${modalPaying.innerHTML}</p>
            <p>Return Amount: ${modalReturn.innerHTML}</p>
        `;

        // Show the invoice modal
        const invoiceModal = new bootstrap.Modal(document.getElementById('invoiceModal'));
        invoiceModal.show();
    });

    // Add event listener to save the invoice as PDF
    document.getElementById('saveInvoiceBtn').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        // const customerName = document.getElementById('customerName').value;
        const currentDate = new Date().toLocaleDateString();
        const invoiceContent = `
            Invoice
            Customer: "soban"
            Date: ${currentDate}
            Items:
            ${selectedProducts.map(product => `
                Name: ${product.name}, Unit Price: ${product.currentPrice}, Quantity: ${product.currentQuantity}, Total Price: ${product.currentPrice * product.currentQuantity}
            `).join('\n')}
            Total Payable: ${modalPayable.innerHTML}
            Paying Amount: ${modalPaying.innerHTML}
            Return Amount: ${modalReturn.innerHTML}
        `;

        doc.text(invoiceContent, 10, 10);
        doc.save('invoice.pdf');
    });

}

// Ensure the function is called only when the payment button is clicked
document.getElementById('paymentBtn').addEventListener('click', handlePayment);