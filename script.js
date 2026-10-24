// ===============================
// BOOKNEST SHOPPING CART
// ===============================

let cart = JSON.parse(localStorage.getItem("booknestCart") || "[]");

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

// SAVE CART
function saveCart() {
    localStorage.setItem("booknestCart", JSON.stringify(cart));
}

// UPDATE CART DISPLAY
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

// REMOVE BOOK FROM CART
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

    books.forEach(book => {
        const title = (book.dataset.title || book.innerText).toLowerCase();
        const author = (book.dataset.author || "").toLowerCase();

        book.style.display =
            title.includes(searchText) || author.includes(searchText)
                ? ""
                : "none";
    });
}

// FILTER BOOKS BY CATEGORY
function filterCategory(category) {
    const books = document.querySelectorAll(".book-card");
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.value = "";
    }

    books.forEach(book => {
        const bookCategory = (book.dataset.category || "").toLowerCase();

        book.style.display =
            category === "all" || bookCategory === category.toLowerCase()
                ? ""
                : "none";
    });
}

// CHECKOUT
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const totalBooks = cart.reduce(
        (sum, book) => sum + book.quantity, 0
    );

    const totalAmount = cart.reduce(
        (sum, book) => sum + book.price * book.quantity, 0
    );

    const orders = JSON.parse(
        localStorage.getItem("booknestOrders") || "[]"
    );

    const order = {
        orderId: Date.now(),
        date: new Date().toLocaleString(),
        books: cart.map(book => ({
            name: book.name,
            price: book.price,
            quantity: book.quantity
        })),
        totalBooks: totalBooks,
        totalAmount: totalAmount
    };

    orders.push(order);

    localStorage.setItem("booknestOrders", JSON.stringify(orders));

    alert(
        "Order placed successfully!\n\n" +
        "Total Books: " + totalBooks +
        "\nTotal Amount: ₹" + totalAmount.toLocaleString("en-IN") +
        "\n\nThank you for shopping with BookNest!"
    );

    cart = [];

    saveCart();
    updateCart();
    closeCart();
}

// INITIALIZE PAGE
document.addEventListener("DOMContentLoaded", function () {
    updateCart();
});
