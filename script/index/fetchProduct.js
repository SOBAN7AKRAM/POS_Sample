

const url = new URL(
    "https://pos.faddishbuilder.com/connector/api/product"
);

const params = {
    "order_by": "et",
    "order_direction": "molestiae",
    //     "brand_id": "sapiente",
    //     "category_id": "ad",
    //     "sub_category_id": "eligendi",
    //     "location_id": "1",
    //     "selling_price_group": "harum",
    "send_lot_detail": "eum",
    //     "name": "est",
    // "sku": "autem",
    "per_page": "10",
};
Object.keys(params)
    .forEach(key => url.searchParams.append(key, params[key]));

// get access token
access_token = localStorage.getItem('accessToken')
const headers = {
    "Authorization": `Bearer ${access_token}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let products_to_show = [];

async function fetchProducts() {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers,
        });
        const data = await response.json();

        if (data) {
            // Assign data to products_to_show
            products_to_show = data.data;
        }
    } catch (err) {
        console.log('Error fetching products:', err);
    }
}

async function showProductsCard() {
    await fetchProducts();
    container = document.getElementById('product-container');
    console.log(products_to_show)
    products_to_show.forEach(product => {
        const name = product.name
        const url = product.image_url
        product.product_variations.forEach(variat => {
            variat.variations.forEach(pro => {
                productCard = document.createElement('div')
                productCard.classList.add('product-card', 'col')
                productCard.dataset.productId = pro.product_id;
                productCard.dataset.sizeId = pro.id;
                card = document.createElement('div')
                card.classList.add('card', 'text-center')
                img = document.createElement('img')
                img.classList.add('card-img-top')
                img.src = url
                cardBody = document.createElement('div')
                cardBody.classList.add('card-body')
                p = document.createElement('p')
                p.classList.add('card-text')
                p.innerHTML = `${name} - (${pro.name})`
                cardBody.appendChild(p)
                card.appendChild(img)
                card.appendChild(cardBody)
                productCard.appendChild(card)
                container.appendChild(productCard)
            })
        })
    });
    showSelectedProducts();
}

showProductsCard();

let selectedProducts = []; // Array to store selected products

function showSelectedProducts() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(productCard => {
        productCard.addEventListener('click', (e) => {
            const productId = productCard.dataset.productId;
            const sizeId = productCard.dataset.sizeId;
            // Check if the product with the same productId and sizeId is already in the selectedProducts list
            const isProductAlreadySelected = selectedProducts.some(p => p.productId === productId && p.sizeId === sizeId);
            if (isProductAlreadySelected) {
                return; // If the product is already selected, do not add it again
            }

            const product = products_to_show.find(p => p.id == productId);
            const variation = product?.product_variations[0].variations.find(v => v.id == sizeId);
            const name = product?.name;
            const img = product?.image_url;
            const size = variation?.name;
            const price = variation?.default_sell_price;
            const quantity = variation?.variation_location_details[0]?.qty_available;
            const currentQuantity = 1;
            const currentPrice = price * currentQuantity;

            // Store selected product details
            selectedProducts.push({ productId, sizeId, name, img, price, size, quantity, currentQuantity, currentPrice });

            // Call function to render table rows
            renderProductRows();
        });
    });
}

function renderProductRows() {
    const tbody = document.querySelector('tbody'); // Select the table body where rows are rendered
    tbody.innerHTML = ''; // Clear existing rows

    selectedProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src=${product.img} alt="Product Image" class="product-img me-3">
                    <div>
                        <strong>${product.name} (${product.size})</strong><br>
                        <span class="text-muted">${Math.floor(product.quantity)} Pc(s) in stock</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <button class="btn btn-outline-secondary btn-sm decrement"><i class="bi bi-dash"></i></button>
                    <input type="number" value=${product.currentQuantity} min="1" class="form-control form-control-sm mx-2 quantity-input" data-product-id="${product.productId}" data-size-id="${product.sizeId}">
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
    updateTotalValesText();
}

function handleQuantityChange() {
    document.querySelectorAll('.increment').forEach(button => {
        button.addEventListener('click', (e) => {
            const input = e.target.closest('div').querySelector('input'); // Find the input field within the same container
            const productId = input.getAttribute('data-product-id');
            const sizeId = input.getAttribute('data-size-id');
            
            // Find the corresponding product in selectedProducts
            const product = selectedProducts.find(p => p.productId === productId && p.sizeId === sizeId);
            if (!product) {
                console.error("Product not found in selectedProducts.");
                return;
            }

            if (product.currentQuantity < product.quantity) {
                product.currentQuantity += 1; // Increment the quantity
                product.currentPrice = product.currentQuantity * product.price; // Update the price
            }

            // Update the input value
            input.value = product.currentQuantity;
            renderProductRows(); // Re-render the rows to update the price
        });
    });

    document.querySelectorAll('.decrement').forEach(button => {
        button.addEventListener('click', (e) => {
            const input = e.target.closest('div').querySelector('input'); // Find the input field within the same container
            const productId = input.getAttribute('data-product-id');
            const sizeId = input.getAttribute('data-size-id');
            
            // Find the corresponding product in selectedProducts
            const product = selectedProducts.find(p => p.productId === productId && p.sizeId === sizeId);
            if (!product) {
                console.error("Product not found in selectedProducts.");
                return;
            }

            if (product.currentQuantity > 1) {
                product.currentQuantity -= 1; // Decrement the quantity
                product.currentPrice = product.currentQuantity * product.price; // Update the price
            }

            // Update the input value
            input.value = product.currentQuantity;
            renderProductRows(); // Re-render the rows to update the price
        });
    });
}

function handleProductRemoval() {
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('.remove-btn').getAttribute('data-product-id');
            const sizeId = e.target.closest('.remove-btn').getAttribute('data-size-id');
            
            // Remove the product from selectedProducts
            selectedProducts = selectedProducts.filter(p => !(p.productId === productId && p.sizeId === sizeId));
            
            // Re-render the rows
            renderProductRows();
        });
    });
}

// Initialize product selection and event listeners
showSelectedProducts();

// update total values
function updateTotalValesText(){
    const item = document.getElementById('total_items');
    const price = document.getElementById('total_price');
    selectedProducts.forEach(product => {
        item.innerHTML = selectedProducts.reduce((acc, product) => acc + product.currentQuantity, 0);
        price.innerHTML = selectedProducts.reduce((acc, product) => acc + product.currentPrice, 0);
    });
}

// expose selected products
window.selectedProducts = selectedProducts;



