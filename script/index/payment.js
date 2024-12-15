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
    let payingAmount = 0

    const updateModalValues = () => {
        const totalPayable = selectedProducts.reduce((acc, product) => acc + product.currentPrice, 0);
        payingAmount = parseFloat(amount.value) || 0;
        modalItem.innerHTML = selectedProducts.reduce((acc, product) => acc + product.currentQuantity, 0);
        modalPayable.innerHTML = totalPayable;
        modalPaying.innerHTML = payingAmount;
        modalReturn.innerHTML = payingAmount - totalPayable;
    };

    // Initial update
    updateModalValues();

    // Add event listener to update modal values when amount changes
    amount.addEventListener('input', updateModalValues);


    // Get the access token from local storage
    const access_token = localStorage.getItem('accessToken');

    const headers = {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
    };

    // get user details

    async function getDetails(url) {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    }



    // url for getting usr detail
    let url = new URL(
        "https://pos.faddishbuilder.com/connector/api/user/loggedin"
    );

    // store the user details in a in user_detail object
    (async () => {
        const user_detail = await getDetails(url);
        console.log("Final user_detail:", user_detail);
    })();

    // url to get the business location
    url = new URL(
        "https://pos.faddishbuilder.com/connector/api/business-location"
    );

    // store the business location in a business_location object
    (async () => {
        const business_location = await getDetails(url);
        console.log("Final business_location:", business_location);
    })();

    // get the contact id
    const url1 = new URL(
        "https://pos.faddishbuilder.com/connector/api/contactapi"
    );

    const params = {
        "type": "fugiat",
    };
    Object.keys(params)
        .forEach(key => url.searchParams.append(key, params[key]));

    (async () => {
        const contact_detail = await getDetails(url1);
        console.log("Contact detail:", contact_detail);
    })();







    // Fetch and prepare product data
    async function fetchAndPrepareData() {
        let product_array = [];

        for (const product of selectedProducts) {
            const url = new URL(`https://pos.faddishbuilder.com/connector/api/product/${product.productId}`);
            
            try {
                const product_detail = await getDetails(url); // Fetch data for the current product
                console.log(`Product detail for ID ${product.productId}:`, product_detail);
    
                if (product_detail?.data) {
                    product_detail.data.forEach(p => {
                        p?.product_variations?.forEach(pv => {
                            pv?.variations?.forEach(v => {
                                product_array.push({
                                    "product_id": p.id,
                                    "variation_id": v.id,
                                    "quantity": 1
                                });
                            });
                        });
                    });
                }
            } catch (error) {
                console.error(`Error fetching details for product ID ${product.productId}:`, error);
            }
        }
    
        return product_array;
    }

    // Finalize payment
    document.getElementById('finalizeBtn').addEventListener('click', async () => {
        const product_array = await fetchAndPrepareData(); // Wait for product data
        const data = {
            "location_id": 16,
            "contact_id": 16,
            "products": product_array,
            "payments": [
                {
                    "amount": payingAmount,
                }
            ]
        };
        console.log(data);
        console.log("Data being sent:", JSON.stringify(data));
        console.log(typeof(data));

        const url = new URL("https://pos.faddishbuilder.com/connector/api/sell");
        fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => console.log("Response:", data))
            .catch(error => console.error("Error:", error));
    });
}


// Ensure the function is called only when the payment button is clicked
document.getElementById('paymentBtn').addEventListener('click', handlePayment);