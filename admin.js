// ========================================
// BOOKNEST ADMIN SYSTEM
// ========================================

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("admin-login-form");
    const panel = document.getElementById("admin-panel");
    const addBookForm = document.getElementById("add-book-form");

    // GET ORDERS
    function getOrders() {
        try {
            const orders = JSON.parse(
                localStorage.getItem("booknestOrders") || "[]"
            );

            return Array.isArray(orders) ? orders : [];
        } catch (error) {
            return [];
        }
    }

    // GET BOOKS ADDED BY ADMIN
    function getExtraBooks() {
        try {
            const books = JSON.parse(
                localStorage.getItem("booknestExtraBooks") || "[]"
            );

            return Array.isArray(books) ? books : [];
        } catch (error) {
            return [];
        }
    }

    // NORMALIZE BOOK DETAILS
    function getOrderBooks(order) {
        let books = [];

        if (Array.isArray(order.items)) {
            books = order.items;
        } else if (Array.isArray(order.books)) {
            books = order.books;
        } else if (order.bookName || order.title) {
            books = [{
                name: order.bookName || order.title,
                price: order.price || 0,
                quantity: order.quantity || 1
            }];
        }

        return books.map(function (book) {
            return {
                name: book.name || book.title || book.bookName || "Book",
                price: Number(book.price) || 0,
                quantity: Number(book.quantity) || 1
            };
        });
    }

    // NORMALIZE ORDER TOTAL
    function getOrderTotal(order) {
        if (order.total !== undefined && order.total !== null) {
            return Number(order.total) || 0;
        }

        if (order.totalAmount !== undefined && order.totalAmount !== null) {
            return Number(order.totalAmount) || 0;
        }

        return getOrderBooks(order).reduce(function (sum, book) {
            return sum + book.price * book.quantity;
        }, 0);
    }

    // SHOW ADMIN PANEL
    function showAdminPanel() {
        if (loginForm) {
            loginForm.style.display = "none";
        }

        if (panel) {
            panel.style.display = "block";
        }

        displaySales();
        displayAdminBooks();
    }

    // ADMIN LOGIN
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username =
                document.getElementById("admin-username").value.trim();

            const password =
                document.getElementById("admin-password").value;

            if (
                username === ADMIN_USERNAME &&
                password === ADMIN_PASSWORD
            ) {
                sessionStorage.setItem(
                    "booknestAdminLoggedIn",
                    "true"
                );

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

            const title =
                document.getElementById("new-book-title").value.trim();

            const author =
                document.getElementById("new-book-author").value.trim();

            const price =
                Number(document.getElementById("new-book-price").value);

            const category =
                document.getElementById("new-book-category").value;

            if (
                !title ||
                !author ||
                !category ||
                !Number.isFinite(price) ||
                price <= 0
            ) {
                alert("Please enter valid book details.");
                return;
            }

            const books = getExtraBooks();

            books.push({
                id: Date.now(),
                title: title,
                author: author,
                price: price,
                category: category
            });

            localStorage.setItem(
                "booknestExtraBooks",
                JSON.stringify(books)
            );

            const message =
                document.getElementById("add-book-message");

            if (message) {
                message.textContent =
                    "Book added successfully: " + title;
            }

            addBookForm.reset();
            displayAdminBooks();
        });
    }

    // DISPLAY BOOKS ADDED BY ADMIN
    function displayAdminBooks() {
        const bookList =
            document.getElementById("admin-book-list");

        if (!bookList) return;

        const books = getExtraBooks();

        bookList.innerHTML = "";

        if (books.length === 0) {
            bookList.textContent =
                "No additional books added yet.";
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
                book.title +
                " | By " + book.author +
                " | ₹" + Number(book.price).toFixed(2) +
                " | " + book.category;

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete Book";

            deleteButton.addEventListener("click", function () {
                if (!confirm("Delete " + book.title + "?")) {
                    return;
                }

                const updatedBooks = getExtraBooks().filter(
                    function (item) {
                        return item.id !== book.id;
                    }
                );

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
            const books = getOrderBooks(order);

            books.forEach(function (book) {
                totalBooks += book.quantity;
            });

            totalRevenue += getOrderTotal(order);
        });

        document.getElementById("total-orders").textContent =
            orders.length;

        document.getElementById("total-books-sold").textContent =
            totalBooks;

        document.getElementById("total-revenue").textContent =
            "₹" + totalRevenue.toFixed(2);

        const orderList = document.getElementById("order-list");

        if (!orderList) return;

        orderList.innerHTML = "";

        if (orders.length === 0) {
            orderList.textContent = "No orders yet.";
            return;
        }

        // SHOW NEWEST ORDERS FIRST
        orders.slice().reverse().forEach(function (order) {

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

                p.appendChild(
                    document.createTextNode(
                        value === undefined ||
                        value === null ||
                        value === ""
                            ? "Not provided"
                            : String(value)
                    )
                );

                card.appendChild(p);
            }

            // CUSTOMER DETAILS
            addLine("Order ID", order.orderId || "N/A");

            addLine(
                "Customer Name",
                order.customerName || order.name || "N/A"
            );

            addLine("Phone", order.phone || "N/A");

            addLine(
                "Order Date",
                order.orderDate || order.date || "N/A"
            );

            addLine(
                "Delivery Address",
                order.address || "N/A"
            );

            addLine("City", order.city || "N/A");

            addLine("PIN Code", order.pincode || "N/A");

            // BOOK DETAILS
            const heading = document.createElement("h3");

            heading.textContent = "Books Ordered";

            card.appendChild(heading);

            const books = getOrderBooks(order);

            if (books.length > 0) {
                books.forEach(function (book) {

                    const p = document.createElement("p");

                    p.textContent =
                        book.name +
                        " | Quantity: " + book.quantity +
                        " | Unit Price: ₹" +
                        book.price.toFixed(2) +
                        " | Subtotal: ₹" +
                        (book.price * book.quantity).toFixed(2);

                    card.appendChild(p);
                });
            } else {
                addLine(
                    "Books",
                    "Details unavailable in saved order"
                );
            }

            // PAYMENT AND TOTAL
            addLine(
                "Total Amount",
                "₹" + getOrderTotal(order).toFixed(2)
            );

            addLine(
                "Payment Method",
                order.payment ||
                order.paymentMethod ||
                "Not provided"
            );

            addLine(
                "Status",
                order.status || "Order Placed"
            );

            orderList.appendChild(card);
        });
    }

    // RESTORE ADMIN SESSION
    if (
        sessionStorage.getItem("booknestAdminLoggedIn") === "true"
    ) {
        showAdminPanel();
    }

});
