// ========================================
// BOOKNEST ADMIN SYSTEM
// ========================================

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

// START ADMIN SYSTEM
document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("admin-login-form");
    const panel = document.getElementById("admin-panel");
    const addBookForm = document.getElementById("add-book-form");

    // GET ORDERS
    function getOrders() {
        return JSON.parse(localStorage.getItem("booknestOrders") || "[]");
    }

    // GET BOOKS ADDED BY ADMIN
    function getExtraBooks() {
        return JSON.parse(localStorage.getItem("booknestExtraBooks") || "[]");
    }

    // SHOW ADMIN PANEL
    function showAdminPanel() {
        if (loginForm) loginForm.style.display = "none";
        if (panel) panel.style.display = "block";

        displaySales();
        displayAdminBooks();
    }

    // ADMIN LOGIN
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("admin-username").value.trim();
            const password = document.getElementById("admin-password").value;

            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                sessionStorage.setItem("booknestAdminLoggedIn", "true");
                showAdminPanel();
            } else {
                alert("Incorrect username or password!");
            }
        });
    }

    // ADD A NEW BOOK
    if (addBookForm) {
        addBookForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const title = document.getElementById("new-book-title").value.trim();
            const author = document.getElementById("new-book-author").value.trim();
            const price = Number(document.getElementById("new-book-price").value);
            const category = document.getElementById("new-book-category").value;

            if (!title || !author || !category || !Number.isFinite(price) || price <= 0) {
                alert("Please enter valid book details.");
                return;
            }

            const books = getExtraBooks();

            const newBook = {
                id: Date.now(),
                title: title,
                author: author,
                price: price,
                category: category
            };

            books.push(newBook);

            localStorage.setItem("booknestExtraBooks", JSON.stringify(books));

            const message = document.getElementById("add-book-message");

            if (message) {
                message.textContent = "✅ Book added successfully: " + title;
            }

            addBookForm.reset();
            displayAdminBooks();
        });
    }

    // DISPLAY BOOKS ADDED BY ADMIN
    function displayAdminBooks() {
        const bookList = document.getElementById("admin-book-list");

        if (!bookList) return;

        const books = getExtraBooks();
        bookList.innerHTML = "";

        if (books.length === 0) {
            bookList.textContent = "No additional books added yet.";
            return;
        }

        books.forEach(function (book) {
            const card = document.createElement("div");

            card.style.border = "1px solid #ccc";
            card.style.padding = "12px";
            card.style.marginBottom = "10px";
            card.style.borderRadius = "8px";

            const details = document.createElement("p");
            details.textContent =
                book.title + " | By " + book.author +
                " | ₹" + Number(book.price).toFixed(2) +
                " | " + book.category;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete Book";

            deleteButton.addEventListener("click", function () {
                if (!confirm("Delete " + book.title + "?")) return;

                const updatedBooks = getExtraBooks().filter(function (item) {
                    return item.id !== book.id;
                });

                localStorage.setItem(
                    "booknestExtraBooks",
                    JSON.stringify(updatedBooks)
                );

                displayAdminBooks();
            });

            card.appendChild(details);
            card.appendChild(deleteButton);
            bookList.appendChild(card);
        });
    }

    // DISPLAY SALES AND CUSTOMER ORDERS
    function displaySales() {
        const orders = getOrders();

        let totalBooks = 0;
        let totalRevenue = 0;

        orders.forEach(function (order) {
            const books = Array.isArray(order.books) ? order.books : [];

            if (books.length > 0) {
                books.forEach(function (book) {
                    totalBooks += Number(book.quantity || 1);
                });
            } else {
                totalBooks += Number(order.totalBooks || 0);
            }

            totalRevenue += Number(order.total ?? order.totalAmount ?? 0);
        });

        document.getElementById("total-orders").textContent = orders.length;
        document.getElementById("total-books-sold").textContent = totalBooks;
        document.getElementById("total-revenue").textContent =
            "₹" + totalRevenue.toFixed(2);

        const orderList = document.getElementById("order-list");

        if (!orderList) return;

        orderList.innerHTML = "";

        if (orders.length === 0) {
            orderList.textContent = "No orders yet.";
            return;
        }

        orders.forEach(function (order) {
            const card = document.createElement("div");

            card.style.border = "1px solid #ccc";
            card.style.padding = "15px";
            card.style.marginBottom = "15px";
            card.style.borderRadius = "8px";

            function addLine(label, value) {
                const p = document.createElement("p");
                const strong = document.createElement("strong");

                strong.textContent = label + ": ";
                p.appendChild(strong);
                p.appendChild(document.createTextNode(
                    value === undefined || value === null ? "Not provided" : String(value)
                ));

                card.appendChild(p);
            }

            addLine("Order ID", order.orderId || "N/A");
            addLine("Customer Name", order.customerName || "N/A");
            addLine("Phone", order.phone || "N/A");
            addLine("Order Date", order.date || "N/A");
            addLine("Delivery Address", order.address || "N/A");

            const heading = document.createElement("h3");
            heading.textContent = "Books Ordered";
            card.appendChild(heading);

            const books = Array.isArray(order.books) ? order.books : [];

            if (books.length > 0) {
                books.forEach(function (book) {
                    const quantity = Number(book.quantity || 1);
                    const price = Number(book.price || 0);

                    const p = document.createElement("p");
                    p.textContent =
                        book.name +
                        " | Quantity: " + quantity +
                        " | Unit Price: ₹" + price.toFixed(2) +
                        " | Subtotal: ₹" + (quantity * price).toFixed(2);

                    card.appendChild(p);
                });
            } else {
                addLine("Books", "Details unavailable");
            }

            addLine(
                "Total Amount",
                "₹" + Number(order.total ?? order.totalAmount ?? 0).toFixed(2)
            );

            addLine("Payment Method", order.paymentMethod || "Not provided");
            addLine("Status", order.status || "Order Placed");

            orderList.appendChild(card);
        });
    }

    // RESTORE ADMIN SESSION
    if (sessionStorage.getItem("booknestAdminLoggedIn") === "true") {
        showAdminPanel();
    }

});
