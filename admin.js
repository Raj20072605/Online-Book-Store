const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("admin-login-form");
    const panel = document.getElementById("admin-panel");

    function getOrders() {
        return JSON.parse(
            localStorage.getItem("booknestOrders") || "[]"
        );
    }

    function showAdminPanel() {
        if (loginForm) {
            loginForm.style.display = "none";
        }

        if (panel) {
            panel.style.display = "block";
        }

        displaySales();
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username =
                document.getElementById("admin-username").value;

            const password =
                document.getElementById("admin-password").value;

            if (
                username === ADMIN_USERNAME &&
                password === ADMIN_PASSWORD
            ) {
                sessionStorage.setItem(
                    "booknestAdminLoggedIn", "true"
                );

                showAdminPanel();
            } else {
                alert("Incorrect username or password!");
            }
        });
    }

    function displaySales() {
        const orders = getOrders();

        let totalBooks = 0;
        let totalRevenue = 0;

        orders.forEach(function (order) {
            const books = Array.isArray(order.books)
                ? order.books
                : [];

            if (books.length > 0) {
                books.forEach(function (book) {
                    totalBooks += Number(book.quantity || 1);
                });
            } else {
                totalBooks += Number(order.totalBooks || 0);
            }

            totalRevenue += Number(
                order.total ?? order.totalAmount ?? 0
            );
        });

        const totalOrdersElement =
            document.getElementById("total-orders");

        const totalBooksElement =
            document.getElementById("total-books-sold");

        const totalRevenueElement =
            document.getElementById("total-revenue");

        if (totalOrdersElement) {
            totalOrdersElement.textContent = orders.length;
        }

        if (totalBooksElement) {
            totalBooksElement.textContent = totalBooks;
        }

        if (totalRevenueElement) {
            totalRevenueElement.textContent =
                "₹" + totalRevenue.toFixed(2);
        }

        const orderList = document.getElementById("order-list");

        if (!orderList) {
            return;
        }

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
                p.appendChild(
                    document.createTextNode(
                        value === undefined || value === null
                            ? "Not provided"
                            : String(value)
                    )
                );

                card.appendChild(p);
            }

            addLine("Order ID", order.orderId || "N/A");
            addLine("Customer Name", order.customerName || "N/A");
            addLine("Phone", order.phone || "N/A");
            addLine("Order Date", order.date || "N/A");
            addLine("Delivery Address", order.address || "N/A");

            const books = Array.isArray(order.books)
                ? order.books
                : [];

            const heading = document.createElement("h3");
            heading.textContent = "Books Ordered";
            card.appendChild(heading);

            if (books.length > 0) {
                books.forEach(function (book) {
                    const quantity = Number(book.quantity || 1);
                    const price = Number(book.price || 0);

                    const p = document.createElement("p");
                    p.textContent =
                        book.name +
                        " | Quantity: " + quantity +
                        " | Unit Price: ₹" + price.toFixed(2) +
                        " | Subtotal: ₹" +
                        (quantity * price).toFixed(2);

                    card.appendChild(p);
                });
            } else {
                addLine("Books", "Details unavailable for this older order");
            }

            addLine(
                "Total Amount",
                "₹" + Number(
                    order.total ?? order.totalAmount ?? 0
                ).toFixed(2)
            );

            addLine(
                "Payment Method",
                order.paymentMethod || "Not provided"
            );

            addLine("Status", order.status || "Order Placed");

            orderList.appendChild(card);
        });
    }

    if (
        sessionStorage.getItem("booknestAdminLoggedIn") === "true"
    ) {
        showAdminPanel();
    }

});
