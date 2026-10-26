// ======================================
// BOOKNEST - COMPLETE SHOPPING SYSTEM
// AUTOMATIC BOOK COVER IMAGES
// ======================================

let cart = JSON.parse(localStorage.getItem("booknestCart") || "[]");

// ======================================
// LOAD ALL BOOKS
// ======================================

function getAllBooks() {
    const defaultBooks = window.defaultBooks || [];

    const extraBooks = JSON.parse(
        localStorage.getItem("booknestExtraBooks") || "[]"
    );

    return [...defaultBooks, ...extraBooks];
}

// ======================================
// GET BOOK COVER IMAGE
// ======================================

function getBookImage(book) {
    // Use an image URL saved with the book first.
    if (book.image) return book.image;
    if (book.imageUrl) return book.imageUrl;
    if (book.coverImage) return book.coverImage;

    // Use the automatic image function from books.js.
    if (typeof window.getBookCoverImage === "function") {
        return window.getBookCoverImage(book);
    }

    // Fallback if the image function is unavailable.
    return "https://placehold.co/300x420/f2e8d5/3d3028?text=" +
        encodeURIComponent(book.title || "Book Cover");
}

// ======================================
// DISPLAY BOOKS WITH COVER IMAGES
// ======================================

function displayBooks(bookList) {
    const container = document.getElementById("booksContainer");

    if (!container) return;

    container.innerHTML = "";

    if (!bookList || bookList.length === 0) {
        container.textContent = "No books found.";
        return;
    }

    bookList.forEach(function (book) {
        const card = document.createElement("article");
        card.className = "book-card";

        card.dataset.title = book.title || "";
        card.dataset.author = book.author || "";
        card.dataset.category = (book.category || "").toLowerCase();

        // BOOK COVER
        const cover = document.createElement("div");
        cover.className = "book-cover";

        const image = document.createElement("img");

        image.src = getBookImage(book);
        image.alt = (book.title || "Book") + " cover";
        image.loading = "lazy";

        // Show a fallback if the cover cannot be loaded.
        image.onerror = function () {
            this.onerror = null;
            this.src =
                "https://placehold.co/300x420/f2e8d5/3d3028?text=" +
                encodeURIComponent(book.title || "Book Cover");
        };

        cover.appendChild(image);

        // BOOK INFORMATION
        const info = document.createElement("div");
        info.className = "book-info";

        const category = document.createElement("p");
        category.className = "category-name";
        category.textContent =
            (book.category || "General").toUpperCase();

        const title = document.createElement("h3");
        title.textContent = book.title || "Untitled Book";

        const author = document.createElement("p");
        author.className = "author";
        author.textContent = "By " + (book.author || "Unknown Author");

        const rating = document.createElement("p");
        rating.className = "rating";
        rating.textContent = "★★★★☆";

        const bottom = document.createElement("div");
        bottom.className = "book-bottom";

        const price = document.createElement("strong");
        price.textContent =
            "₹" + Number(book.price || 0).toLocaleString("en-IN");

        const button = document.createElement("button");
        button.textContent = "Add to Cart";

        button.addEventListener("click", function () {
            addToCart(
                book.title || "Untitled Book",
                Number(book.price || 0)
            );
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
    const existingBook = cart.find(function (book) {
        return book.name === name;
    });

    if (existingBook) {
        existingBook.quantity =
            Number(existingBook.quantity || 1) + 1;
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

    cart.forEach(function (book) {
        const quantity = Number(book.quantity || 1);

        totalItems += quantity;
        totalPrice += Number(book.price || 0) * quantity;
    });

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (cartTotal) {
        cartTotal.textContent =
            totalPrice.toLocaleString("en-IN");
    }

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
        return;
    }

    cart.forEach(function (book, index) {
        const item = document.createElement("div");
        item.className = "cart-item";

        const details = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent = book.name || book.title || "Book";

        const price = document.createElement("p");
        price.textContent =
            "₹" + Number(book.price || 0).toLocaleString("en-IN") +
            " × " + Number(book.quantity || 1);

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
// REMOVE BOOK FROM CART
// ======================================

function removeFromCart(index) {
    cart.splice(index, 1);

    saveCart();
    updateCart();
}

// ======================================
// OPEN CART
// ======================================

function openCart() {
    const modal = document.getElementById("cartModal");

    if (modal) {
        modal.hidden = false;
        modal.style.display = "flex";
    }

    updateCart();
}

// ======================================
// CLOSE CART
// ======================================

function closeCart() {
    const modal = document.getElementById("cartModal");

    if (modal) {
        modal.hidden = true;
        modal.style.display = "none";
    }
}

// ======================================
// CHECKOUT
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

    const filteredBooks = getAllBooks().filter(function (book) {
        return (
            (book.title || "").toLowerCase().includes(searchText) ||
            (book.author || "").toLowerCase().includes(searchText) ||
            (book.category || "").toLowerCase().includes(searchText)
        );
    });

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
        : books.filter(function (book) {
            return (book.category || "").toLowerCase() ===
                category.toLowerCase();
        });

    displayBooks(filteredBooks);

    if (message) {
        message.textContent =
            "Showing " + filteredBooks.length + " book(s).";
    }
}

// ======================================
// DISPLAY CUSTOMER NAME
// ======================================

function displayCustomerName() {
    const nameElement =
        document.getElementById("booknest-customer-name");

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
