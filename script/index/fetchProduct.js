// Define the API URL and parameters
const url = new URL(
    "https://pos.faddishbuilder.com/connector/api/product"
);

const params = {
    "order_by": "et",
    "order_direction": "molestiae",
    "send_lot_detail": "eum",
    "per_page": "10",
};

Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

// Get access token
const access_token = localStorage.getItem('accessToken');
const headers = {
    "Authorization": `Bearer ${access_token}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
};

// Initialize product lists
let products_to_show = [];
let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || []; // Persist selected products

// Save selected products to localStorage
function saveSelectedProducts() {
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
}

// Fetch products from the API
async function fetchProducts() {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers,
        });
        const data = await response.json();

        if (data) {
            products_to_show = data.data;
        }
    } catch (err) {
        console.error('Error fetching products:', err);
    }
}

// Render product cards dynamically
function renderProductCards() {
    const container = document.getElementById('product-container');
    container.innerHTML = '';

    products_to_show.forEach(product => {
        const name = product.name;
        const url = product.image_url;

        product.product_variations.forEach(variat => {
            variat.variations.forEach(pro => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card', 'col');
                productCard.dataset.productId = pro.product_id;
                productCard.dataset.sizeId = pro.id;

                const card = document.createElement('div');
                card.classList.add('card', 'text-center');

                const img = document.createElement('img');
                img.classList.add('card-img-top');
                img.src = url;

                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                const p = document.createElement('p');
                p.classList.add('card-text');
                p.innerHTML = `${name} - (${pro.name})`;

                cardBody.appendChild(p);
                card.appendChild(img);
                card.appendChild(cardBody);
                productCard.appendChild(card);
                container.appendChild(productCard);
            });
        });
    });
    setupProductSelectionListeners();
}

// Add event listeners to product cards for selection
function setupProductSelectionListeners() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(productCard => {
        productCard.addEventListener('click', () => {
            const productId = productCard.dataset.productId;
            const sizeId = productCard.dataset.sizeId;

            // Check if already selected
            const isAlreadySelected = selectedProducts.some(p => p.productId === productId && p.sizeId === sizeId);
            if (isAlreadySelected) return;

            const product = products_to_show.find(p => p.id == productId);
            const variation = product?.product_variations[0].variations.find(v => v.id == sizeId);

            const newProduct = {
                productId,
                sizeId,
                name: product?.name,
                img: product?.image_url,
                price: variation?.default_sell_price,
                size: variation?.name,
                quantity: variation?.variation_location_details[0]?.qty_available,
                currentQuantity: 1,
                currentPrice: variation?.default_sell_price,
            };

            selectedProducts.push(newProduct);
            saveSelectedProducts();
            renderProductRows();
        });
    });
}

// Render selected product rows in the table
function renderProductRows() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    selectedProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${product.img}" alt="Product Image" class="product-img me-3">
                    <div>
                        <strong>${product.name} (${product.size})</strong><br>
                        <span class="text-muted">${Math.floor(product.quantity)} Pc(s) in stock</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <button class="btn btn-outline-secondary btn-sm decrement"><i class="bi bi-dash"></i></button>
                    <input type="number" value="${product.currentQuantity}" min="1" class="form-control form-control-sm mx-2 quantity-input" data-product-id="${product.productId}" data-size-id="${product.sizeId}">
                    <button class="btn btn-outline-secondary btn-sm increment"><i class="bi bi-plus"></i></button>
                </div>
            </td>
            <td>J$ ${product.currentPrice}</td>
            <td>
                <span class="remove-btn" data-product-id="${product.productId}" data-size-id="${product.sizeId}"><i class="bi bi-x-circle"></i></span>
            </td>
        `;

        tbody.appendChild(row);
    });
    handleQuantityChange();
    handleProductRemoval();
    updateTotalValuesText();
}

// Handle quantity increment/decrement
function handleQuantityChange() {
    document.querySelectorAll('.increment, .decrement').forEach(button => {
        button.addEventListener('click', (e) => {
            const input = e.target.closest('div').querySelector('input');
            const productId = input.dataset.productId;
            const sizeId = input.dataset.sizeId;

            const product = selectedProducts.find(p => p.productId === productId && p.sizeId === sizeId);
            if (!product) return;

            if (e.target.classList.contains('increment') && product.currentQuantity < product.quantity) {
                product.currentQuantity++;
            } else if (e.target.classList.contains('decrement') && product.currentQuantity > 1) {
                product.currentQuantity--;
            }

            product.currentPrice = product.currentQuantity * product.price;
            saveSelectedProducts();
            renderProductRows();
        });
    });
}

// Handle product removal
function handleProductRemoval() {
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = button.dataset.productId;
            const sizeId = button.dataset.sizeId;

            selectedProducts = selectedProducts.filter(p => !(p.productId === productId && p.sizeId === sizeId));
            saveSelectedProducts();
            renderProductRows();
        });
    });
}

// Update total items and prices
function updateTotalValuesText() {
    const item = document.getElementById('total_items');
    const price = document.getElementById('total_price');
    item.innerHTML = selectedProducts.reduce((acc, product) => acc + product.currentQuantity, 0);
    price.innerHTML = selectedProducts.reduce((acc, product) => acc + product.currentPrice, 0);
}

// Main function to initialize everything
async function showProductsCard() {
    await fetchProducts();
    renderProductCards();
    renderProductRows();
}
// clear the product list
function clearProductList() {
    selectedProducts = [];
    saveSelectedProducts();
    renderProductRows();
}
document.getElementById('cancelBtn').addEventListener('click', clearProductList);



// Initialize
showProductsCard();
