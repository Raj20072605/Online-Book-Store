const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("admin-login-form");

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
                sessionStorage.setItem("booknestAdminLoggedIn", "true");
                showAdminPanel();
            } else {
                alert("Incorrect username or password!");
            }
        });
    }

    function showAdminPanel() {
        if (loginForm) {
            loginForm.style.display = "none";
        }

        const panel = document.getElementById("admin-panel");

        if (panel) {
            panel.style.display = "block";
        }

        displaySales();
    }

    function displaySales() {

        const orders = JSON.parse(
            localStorage.getItem("booknestOrders") || "[]"
        );

        let totalBooks = 0;
        let totalRevenue = 0;

        orders.forEach(function (order) {
            totalBooks += order.totalBooks;
            totalRevenue += order.totalAmount;
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
            totalRevenueElement.textContent = "₹" + totalRevenue;
        }

        const orderList = document.getElementById("order-list");

        if (orderList) {
            orderList.innerHTML = "";

            if (orders.length === 0) {
                orderList.innerHTML = "<p>No orders yet.</p>";
                return;
            }

            orders.forEach(function (order) {

                const item = document.createElement("div");

                item.innerHTML =
                    "<hr>" +
                    "<p><b>Order ID:</b> " + order.orderId + "</p>" +
                    "<p><b>Date:</b> " + order.date + "</p>" +
                    "<p><b>Books Sold:</b> " + order.totalBooks + "</p>" +
                    "<p><b>Amount:</b> ₹" + order.totalAmount + "</p>";

                orderList.appendChild(item);
            });
        }
    }

    if (
        sessionStorage.getItem("booknestAdminLoggedIn") === "true"
    ) {
        showAdminPanel();
    }

});
       
