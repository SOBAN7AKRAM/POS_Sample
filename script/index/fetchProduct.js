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

async function getProducts() {
    await fetchProducts();
    // console.log('Products after fetch:', products_to_show);
    cards = documents.getElementByClassName('product-card');
    cards.style.display = 'block';
    products_to_show.forEach(product => {
        console.log(product.name)
        product.product_variations.forEach(variat => {
            variat.variations.forEach(p => {
                console.log(p.default_sell_price)
                p.variation_location_details.forEach(l => {
                    console.log(l.qty_available)
                })
            })
        })
    });
}

getProducts();
