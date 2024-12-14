// const { copyFileSync } = require("original-fs");

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

let selectedProducts = []; // Array to store selected product IDs

function showSelectedProducts() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(productCard => {
        productCard.addEventListener('click', (e) => {
            const productId = productCard.dataset.productId;
            const sizeId = productCard.dataset.sizeId;

            // Store selected product details
            selectedProducts.push({ productId, sizeId });

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
        const nam = products_to_show.find(p => p.id == product.productId)?.name;
        const size = products_to_show.find(p => p.id == product.productId)?.product_variations[0].variations.find(v => v.id == product.sizeId)?.name;
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="https://via.placeholder.com/60" alt="Product Image" class="product-img me-3">
                    <div>
                        <strong>${nam} (${size})</strong><br>
                        <span class="text-muted">7.00 Pc(s) in stock</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <button class="btn btn-outline-secondary btn-sm decrement"><i class="bi bi-dash"></i></button>
                    <input type="number" value="1" min="1" class="form-control form-control-sm mx-2 quantity-input">
                    <button class="btn btn-outline-secondary btn-sm increment"><i class="bi bi-plus"></i></button>
                </div>
            </td>
            <td>J$ ${getProductPrice(product.productId, product.sizeId)}</td>
            <td>
                <span class="remove-btn"><i class="bi bi-x-circle"></i></span>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function getProductPrice(productId, sizeId) {
    // Mock function to get product price based on productId and sizeId
    // Replace with actual logic to fetch the price
    return productId === '1' && sizeId === 'Large' ? '12.00' : '10.00';
}

// Initialize product selection and event listeners
showSelectedProducts();




// product.product_variations.forEach(variat => {
//     variat.variations.forEach(p => {
//         // console.log(p.default_sell_price)
//         console.log(p.name)
//         // p.variation_location_details.forEach(l => {
//         //     console.log(l.qty_available)
//         // })
//     })
// })
