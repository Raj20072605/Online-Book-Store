// ======================================
// BOOKNEST - COMPLETE SHOPPING SYSTEM
// ======================================

let cart = JSON.parse(localStorage.getItem("booknestCart") || "[]");

// ======================================
// LOAD BOOKS
// ======================================

function getAllBooks() {
    const defaultBooks = window.defaultBooks || [];

    const extraBooks = JSON.parse(
        localStorage.getItem("booknestExtraBooks") || "[]"
    );

    return [...defaultBooks, ...extraBooks];
}

// ======================================
// DISPLAY BOOKS
// ======================================

function displayBooks(bookList) {
    const container = document.getElementById("booksContainer");

    if (!container) return;

    container.innerHTML = "";

    if (bookList.length === 0) {
        container.innerHTML = "<p>No books found.</p>";
        return;
    }

    bookList.forEach(book => {
        const card = document.createElement("article");
        card.className = "book-card";
        card.dataset.title = book.title;
        card.dataset.author = book.author;
        card.dataset.category = book.category.toLowerCase();

        const cover = document.createElement("div");
        cover.className = "book-cover programming-cover";
        cover.textContent = "📚 " + book.title;

        const info = document.createElement("div");
        info.className = "book-info";

        const category = document.createElement("p");
        category.className = "category-name";
        category.textContent = book.category.toUpperCase();

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.className = "author";
        author.textContent = "By " + book.author;

        const rating = document.createElement("p");
        rating.className = "rating";
        rating.textContent = "★★★★☆";

        const bottom = document.createElement("div");
        bottom.className = "book-bottom";

        const price = document.createElement("strong");
        price.textContent = "₹" + Number(book.price).toLocaleString("en-IN");

        const button = document.createElement("button");
        button.textContent = "Add to Cart";
        button.addEventListener("click", function () {
            addToCart(book.title, Number(book.price));
        });

        bottom.appendChild(price);
        bottom.appendChild(button);

        info.appendChild(category);
        info.appendChild(title);
        info.appendChild(author);
        info.appendChild(rating);
        info.appendChild(bottom);

        card.appendChild(cover);
        card.appendChild(info);

        container.appendChild(card);
    });
}

// ======================================
// SAVE CART
// ======================================

function saveCart() {
    localStorage.setItem("booknestCart", JSON.stringify(cart));
}

// ======================================
// ADD BOOK TO CART
// ======================================

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

// ======================================
// UPDATE CART
// ======================================

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(book => {
        totalItems += Number(book.quantity || 1);
        totalPrice += Number(book.price || 0) * Number(book.quantity || 1);
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
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
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
            "₹" + Number(book.price).toLocaleString("en-IN") +
            " × " + book.quantity;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-btn";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {
            removeFromCart(index);
        });

        details.appendChild(title);
        details.appendChild(price);

        item.appendChild(details);
        item.appendChild(removeButton);

        cartItems.appendChild(item);
    });
}

// ======================================
// REMOVE BOOK
// ======================================

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

// ======================================
// OPEN AND CLOSE CART
// ======================================

function openCart() {
    const modal = document.getElementById("cartModal");

    if (modal) {
        modal.hidden = false;
        modal.style.display = "flex";
    }

    updateCart();
}

function closeCart() {
    const modal = document.getElementById("cartModal");

    if (modal) {
        modal.hidden = true;
        modal.style.display = "none";
    }
}

// ======================================
// PROCEED TO CHECKOUT
// ======================================

function proceedToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add books first.");
        return;
    }

    saveCart();
    window.location.href = "delivery.html";
}

// ======================================
// SEARCH BOOKS
// ======================================

function searchBooks() {
    const searchInput = document.getElementById("searchInput");
    const message = document.getElementById("searchMessage");

    if (!searchInput) return;

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredBooks = getAllBooks().filter(book =>
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText) ||
        book.category.toLowerCase().includes(searchText)
    );

    displayBooks(filteredBooks);

    if (message) {
        message.textContent = filteredBooks.length === 0
            ? "No books found. Try another search."
            : "Found " + filteredBooks.length + " book(s).";
    }
}

// ======================================
// FILTER BY CATEGORY
// ======================================

function filterCategory(category) {
    const searchInput = document.getElementById("searchInput");
    const message = document.getElementById("searchMessage");

    if (searchInput) {
        searchInput.value = "";
    }

    const books = getAllBooks();

    const filteredBooks = category === "all"
        ? books
        : books.filter(book =>
            book.category.toLowerCase() === category.toLowerCase()
        );

    displayBooks(filteredBooks);

    if (message) {
        message.textContent = "Showing " + filteredBooks.length + " book(s).";
    }
}

// ======================================
// CUSTOMER NAME
// ======================================

function displayCustomerName() {
    const nameElement = document.getElementById("booknest-customer-name");

    if (!nameElement) return;

    const name =
        sessionStorage.getItem("booknestUsername") ||
        localStorage.getItem("booknestUsername") ||
        "";

    if (name && name !== "true") {
        nameElement.textContent = "Welcome, " + name + "!";
    }
}

// ======================================
// INITIALIZE WEBSITE
// ======================================

document.addEventListener("DOMContentLoaded", function () {
    displayBooks(getAllBooks());
    updateCart();
    displayCustomerName();
});
