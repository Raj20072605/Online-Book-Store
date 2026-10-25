// =====================================
// BOOKNEST SHOPPING CART
// =====================================

let cart = JSON.parse(
    localStorage.getItem("booknestCart") || "[]"
);

// SAVE CART
function saveCart() {
    localStorage.setItem(
        "booknestCart",
        JSON.stringify(cart)
    );
}

// GET LOGGED-IN CUSTOMER NAME
function getCustomerName() {
    const keys = [
        "booknestUsername",
        "booknestUser",
        "loggedInUser",
        "username"
    ];

    for (const key of keys) {
        const name =
            sessionStorage.getItem(key) ||
            localStorage.getItem(key);

        if (name && name !== "true") {
            try {
                const parsed = JSON.parse(name);

                if (typeof parsed === "string") {
                    return parsed;
                }

                if (parsed && parsed.username) {
                    return parsed.username;
                }

                if (parsed && parsed.name) {
                    return parsed.name;
                }
            } catch (error) {
                return name;
            }
        }
    }

    return "";
}

// SHOW CUSTOMER NAME
function displayCustomerName() {
    const name = getCustomerName();

    if (!name) return;

    let nameElement = document.getElementById(
        "booknest-customer-name"
    );

    if (!nameElement) {
        nameElement = document.createElement("span");
        nameElement.id = "booknest-customer-name";

        nameElement.style.color = "#ffffff";
        nameElement.style.fontWeight = "bold";
        nameElement.style.margin = "0 10px";

        const signOut = Array.from(
            document.querySelectorAll("a, button")
        ).find(element =>
            /sign out|logout|log out/i.test(
                element.textContent.trim()
            )
        );

        if (signOut && signOut.parentElement) {
            signOut.parentElement.insertBefore(
                nameElement,
                signOut
            );
        } else {
            const header = document.querySelector("header");

            if (header) {
                header.appendChild(nameElement);
            }
        }
    }

    nameElement.textContent = "Welcome, " + name + "! ";
}

// ADD BOOK TO CART
function addToCart(name, price) {
    const existingBook = cart.find(
        book => book.name === name
    );

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
        totalItems += Number(book.quantity || 1);
        totalPrice +=
            Number(book.price || 0) *
            Number(book.quantity || 1);
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
            "₹" +
            Number(book.price).toLocaleString("en-IN") +
            " × " +
            book.quantity;

        const removeButton =
            document.createElement("button");

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

// PROCEED TO SEPARATE DELIVERY PAGE
function proceedToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add books first.");
        return;
    }

    saveCart();

    window.location.href = "delivery.html";
}

// SEARCH BOOKS
function searchBooks() {
    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) return;

    const searchText =
        searchInput.value.toLowerCase().trim();

    const books =
        document.querySelectorAll(".book-card");

    let visibleBooks = 0;

    books.forEach(book => {
        const title =
            (book.dataset.title || book.innerText)
                .toLowerCase();

        const author =
            (book.dataset.author || "").toLowerCase();

        const matches =
            title.includes(searchText) ||
            author.includes(searchText);

        book.style.display = matches ? "" : "none";

        if (matches) visibleBooks++;
    });

    const message =
        document.getElementById("searchMessage");

    if (message) {
        message.textContent = visibleBooks === 0
            ? "No books found. Try another search."
            : "";
    }
}

// FILTER BOOKS BY CATEGORY
function filterCategory(category) {
    const books =
        document.querySelectorAll(".book-card");

    const searchInput =
        document.getElementById("searchInput");

    const message =
        document.getElementById("searchMessage");

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

// INITIALIZE PAGE
document.addEventListener("DOMContentLoaded", function () {
    updateCart();
    displayCustomerName();

    // Connect the checkout form's submit button
    // to the separate delivery page.
    const checkoutForm =
        document.getElementById("checkoutForm");

    if (checkoutForm) {
        checkoutForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();
                proceedToCheckout();
            }
        );

        // Also handle checkout buttons if the form
        // is using a button rather than form submission.
        const submitButton =
            checkoutForm.querySelector('[type="submit"]');

        if (submitButton) {
            submitButton.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    proceedToCheckout();
                }
            );
        }
    }

    // Support a separately identified checkout button.
    const checkoutButton =
        document.getElementById("proceedToCheckout");

    if (checkoutButton && !checkoutForm?.contains(checkoutButton)) {
        checkoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            proceedToCheckout();
        });
    }
});
