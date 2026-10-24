// =====================================
// BOOKNEST SHOPPING CART
// =====================================

let cart = JSON.parse(localStorage.getItem("booknestCart") || "[]");


// SAVE CART
function saveCart() {
    localStorage.setItem("booknestCart", JSON.stringify(cart));
}


// ADD BOOK TO CART
function addToCart(name, price) {
    const existingBook = cart.find(book => book.name === name);

    if (existingBook) {
        existingBook.quantity++;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    alert(name + " added to your cart!");
}


// UPDATE CART
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(book => {
        totalItems += book.quantity;
        totalPrice += book.price * book.quantity;
    });

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (cartTotal) {
        cartTotal.textContent = totalPrice.toLocaleString("en-IN");
    }

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';
        return;
    }

    cart.forEach((book, index) => {
        const item = document.createElement("div");
        item.className = "cart-item";

        const details = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent = book.name;

        const price = document.createElement("p");
        price.textContent =
            "₹" + book.price.toLocaleString("en-IN") +
            " × " + book.quantity;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-btn";
        removeButton.textContent = "Remove";

        removeButton.onclick = function () {
            removeFromCart(index);
        };

        details.appendChild(title);
        details.appendChild(price);

        item.appendChild(details);
        item.appendChild(removeButton);

        cartItems.appendChild(item);
    });
}


// REMOVE BOOK
function removeFromCart(index) {
    cart.splice(index, 1);

    saveCart();
    updateCart();
}


// OPEN CART
function openCart() {
    const modal = document.getElementById("cartModal");

    if (modal) {
        modal.hidden = false;
        modal.style.display = "flex";
    }

    updateCart();
}


// CLOSE CART
function closeCart() {
    const modal = document.getElementById("cartModal");

    if (modal) {
        modal.hidden = true;
        modal.style.display = "none";
    }
}


// SEARCH BOOKS
function searchBooks() {
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    const searchText = searchInput.value.toLowerCase().trim();
    const books = document.querySelectorAll(".book-card");

    let visibleBooks = 0;

    books.forEach(book => {
        const title =
            (book.dataset.title || book.innerText).toLowerCase();

        const author =
            (book.dataset.author || "").toLowerCase();

        const matches =
            title.includes(searchText) ||
            author.includes(searchText);

        book.style.display = matches ? "" : "none";

        if (matches) visibleBooks++;
    });

    const message = document.getElementById("searchMessage");

    if (message) {
        message.textContent = visibleBooks === 0
            ? "No books found. Try another search."
            : "";
    }
}


// FILTER BOOKS BY CATEGORY
function filterCategory(category) {
    const books = document.querySelectorAll(".book-card");
    const searchInput = document.getElementById("searchInput");
    const message = document.getElementById("searchMessage");

    if (searchInput) searchInput.value = "";
    if (message) message.textContent = "";

    books.forEach(book => {
        const bookCategory =
            (book.dataset.category || "").toLowerCase();

        book.style.display =
            category === "all" ||
            bookCategory === category.toLowerCase()
                ? ""
                : "none";
    });
}


// CHECKOUT FORM
function setupCheckout() {
    const form = document.getElementById("checkoutForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty! Add books before placing an order.");
            return;
        }

        if (!form.reportValidity()) {
            return;
        }

        // CUSTOMER DETAILS
        const customer = {
            name: document.getElementById("customerName").value.trim(),
            phone: document.getElementById("customerPhone").value.trim(),
            house: document.getElementById("houseAddress").value.trim(),
            street: document.getElementById("streetAddress").value.trim(),
            city: document.getElementById("city").value.trim(),
            state: document.getElementById("state").value.trim(),
            pincode: document.getElementById("pincode").value.trim()
        };

        // PAYMENT METHOD
        const selectedPayment =
            document.querySelector('input[name="paymentMethod"]:checked');

        if (!selectedPayment) {
            alert("Please select a payment method.");
            return;
        }

        const paymentMethod = selectedPayment.value;

        // ORDER TOTAL
        const totalBooks = cart.reduce(
            (sum, book) => sum + book.quantity, 0
        );

        const totalAmount = cart.reduce(
            (sum, book) => sum + book.price * book.quantity, 0
        );

        // DELIVERY ESTIMATE
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        // CREATE ORDER
        const order = {
            orderId: "BN" + Date.now(),
            date: new Date().toLocaleString("en-IN"),
            customer: customer,

            address:
                customer.house + ", " +
                customer.street + ", " +
                customer.city + ", " +
                customer.state + " - " +
                customer.pincode,

            books: cart.map(book => ({
                name: book.name,
                price: book.price,
                quantity: book.quantity
            })),

            totalBooks: totalBooks,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod,

            paymentStatus:
                paymentMethod === "Cash on Delivery"
                    ? "Pay on delivery"
                    : "Demo - payment not processed",

            deliveryMethod: "Standard Delivery",
            deliveryCharge: 0,
            estimatedDelivery: deliveryDate.toLocaleDateString("en-IN"),
            orderStatus: "Order Placed"
        };

        // SAVE ORDER
        try {
            const orders = JSON.parse(
                localStorage.getItem("booknestOrders") || "[]"
            );

            orders.push(order);

            localStorage.setItem(
                "booknestOrders",
                JSON.stringify(orders)
            );

        } catch (error) {
            alert("Unable to save the order. Please try again.");
            return;
        }

        // CONFIRMATION
        alert(
            "🎉 ORDER PLACED SUCCESSFULLY!\n\n" +
            "Order ID: " + order.orderId +
            "\nCustomer: " + customer.name +
            "\nBooks: " + totalBooks +
            "\nTotal: ₹" + totalAmount.toLocaleString("en-IN") +
            "\nPayment: " + paymentMethod +
            "\nDelivery: " + order.estimatedDelivery +
            "\nStatus: " + order.orderStatus +
            "\n\nDelivery Address:\n" + order.address +
            "\n\nThank you for shopping with BookNest!"
        );

        // CLEAR CART
        cart = [];

        saveCart();
        updateCart();
        form.reset();
        closeCart();
    });
}


// INITIALIZE PAGE
document.addEventListener("DOMContentLoaded", function () {
    updateCart();
    setupCheckout();
});
