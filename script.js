let cart = [];


// ADD TO CART
function addToCart(name, price) {

    const existingBook = cart.find(book => book.name === name);

    if (existingBook) {
        existingBook.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

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

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';

    } else {

        cart.forEach((book, index) => {

            totalItems += book.quantity;
            totalPrice += book.price * book.quantity;

            const item = document.createElement("div");

            item.className = "cart-item";

            item.innerHTML = `
                <div>
                    <strong>${book.name}</strong>
                    <br>
                    <small>
                        ₹${book.price} × ${book.quantity}
                    </small>
                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})">
                    Remove
                </button>
            `;

            cartItems.appendChild(item);
        });
    }

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice;
}


// REMOVE FROM CART
function removeFromCart(index) {

    cart.splice(index, 1);

    updateCart();
}


// OPEN CART
function openCart() {

    document.getElementById("cartModal").style.display = "flex";

    updateCart();
}


// CLOSE CART
function closeCart() {

    document.getElementById("cartModal").style.display = "none";
}


// SEARCH BOOKS
function searchBooks() {

    const searchText =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const books =
        document.querySelectorAll(".book-card");

    books.forEach(book => {

        const title =
            book.dataset.title.toLowerCase();

        const author =
            book.dataset.author.toLowerCase();

        if (
            title.includes(searchText) ||
            author.includes(searchText)
        ) {

            book.style.display = "block";

        } else {

            book.style.display = "none";

        }

    });
}


// FILTER BY CATEGORY
function filterCategory(category) {

    const books =
        document.querySelectorAll(".book-card");

    books.forEach(book => {

        if (
            category === "all" ||
            book.dataset.category === category
        ) {

            book.style.display = "block";

        } else {

            book.style.display = "none";

        }

    });

    // Clear search box
    document.getElementById("searchInput").value = "";
}


// CHECKOUT
function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    let total = 0;

    cart.forEach(book => {

        total += book.price * book.quantity;

    });

    alert(
        "🎉 Order placed successfully!\n\n" +
        "Total Amount: ₹" + total +
        "\n\nThank you for shopping with BookNest!"
    );

    cart = [];

    updateCart();

    closeCart();
}


// CLOSE CART WHEN CLICKING OUTSIDE
window.onclick = function(event) {

    const modal =
        document.getElementById("cartModal");

    if (event.target === modal) {

        closeCart();

    }

};
