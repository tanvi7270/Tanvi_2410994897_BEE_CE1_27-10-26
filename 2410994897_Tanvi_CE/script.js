// Product details
let products = [
    {
        id: 1,
        name: "Men's T-Shirt",
        price: 499,
        category: "Men",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
    },
    {
        id: 2,
        name: "Women's Dress",
        price: 999,
        category: "Women",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"
    },
    {
        id: 3,
        name: "Men's Jacket",
        price: 1499,
        category: "Men",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"
    },
    {
        id: 4,
        name: "Women's Handbag",
        price: 799,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
    },
    {
        id: 5,
        name: "Sunglasses",
        price: 399,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400"
    },
    {
        id: 6,
        name: "Women's Top",
        price: 599,
        category: "Women",
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400"
    }
];

let cart = [];
let couponApplied = false;


// Display products
function displayProducts(list) {
    let productBox = document.getElementById("products");

    productBox.innerHTML = "";

    if (list.length === 0) {
        productBox.innerHTML = "<p>No products found.</p>";
        return;
    }

    for (let i = 0; i < list.length; i++) {
        productBox.innerHTML += `
            <div class="product">
                <img src="${list[i].image}" alt="${list[i].name}">
                <h3>${list[i].name}</h3>
                <p>Price: ₹${list[i].price}</p>
                <button onclick="addToCart(${list[i].id})">
                    Add to Cart
                </button>
            </div>
        `;
    }
}


// Search, filter and sort products
function filterProducts() {
    let search = document.getElementById("search").value.toLowerCase();
    let category = document.getElementById("category").value;
    let sort = document.getElementById("sort").value;

    let filtered = products.filter(function(product) {
        return product.name.toLowerCase().includes(search) &&
            (category === "all" || product.category === category);
    });

    if (sort === "low") {
        filtered.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (sort === "high") {
        filtered.sort(function(a, b) {
            return b.price - a.price;
        });
    }

    displayProducts(filtered);
}


// Add product to cart
function addToCart(id) {
    let item = cart.find(function(product) {
        return product.id === id;
    });

    if (item) {
        item.quantity++;
    } else {
        let product = products.find(function(product) {
            return product.id === id;
        });

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    showCart();
}


// Change quantity
function changeQuantity(id, change) {
    let item = cart.find(function(product) {
        return product.id === id;
    });

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }
    }

    showCart();
}


// Remove product from cart
function removeFromCart(id) {
    cart = cart.filter(function(product) {
        return product.id !== id;
    });

    showCart();
}


// Display cart and calculate price
function showCart() {
    let cartItems = document.getElementById("cart-items");
    let subtotal = 0;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];

        subtotal += item.price * item.quantity;

        cartItems.innerHTML += `
            <div>
                <p>
                    ${item.name} - ₹${item.price}
                    x ${item.quantity}
                </p>

                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <button onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `;
    }

    let discount = 0;

    if (couponApplied) {
        discount = subtotal * 0.10;
    }

    let total = subtotal - discount;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("discount").innerText = discount.toFixed(2);
    document.getElementById("total-amount").innerText = total.toFixed(2);
}


// Apply coupon
document.getElementById("apply-coupon").addEventListener("click", function() {
    let coupon = document.getElementById("coupon").value.trim().toUpperCase();
    let message = document.getElementById("coupon-message");

    if (coupon === "SAVE10") {
        if (cart.length === 0) {
            couponApplied = false;
            message.innerText = "Add products to your cart first.";
        } else {
            couponApplied = true;
            message.innerText = "Coupon applied! You saved 10%.";
        }
    } else {
        couponApplied = false;
        message.innerText = "Invalid coupon code.";
    }

    showCart();
});


// Checkout button
document.getElementById("checkout").addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Please add products to your cart first.");
        return;
    }

    document.getElementById("checkout-form").style.display = "block";
    document.getElementById("checkout-form").scrollIntoView({
        behavior: "smooth"
    });
});


// Place order
document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    let name = document.getElementById("customer-name").value;
    let total = document.getElementById("total-amount").innerText;

    alert(
        "Thank you, " + name + "!\n" +
        "Your order has been placed.\n" +
        "Total Amount: ₹" + total
    );

    cart = [];
    couponApplied = false;

    document.getElementById("coupon").value = "";
    document.getElementById("coupon-message").innerText = "";
    document.getElementById("checkout-form").reset();
    document.getElementById("checkout-form").style.display = "none";

    showCart();
});

document.getElementById("search").addEventListener("input", filterProducts);
document.getElementById("category").addEventListener("change", filterProducts);
document.getElementById("sort").addEventListener("change", filterProducts);


displayProducts(products);
showCart();
