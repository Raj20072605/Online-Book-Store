const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("admin-login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("admin-username").value;
            const password = document.getElementById("admin-password").value;

            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                alert("Admin login successful!");
                localStorage.setItem("booknestAdminLoggedIn", "true");
                showAdminPanel();
            } else {
                alert("Incorrect username or password!");
            }
        });
    }

    function showAdminPanel() {
        const loginForm = document.getElementById("admin-login-form");
        if (loginForm) {
            loginForm.style.display = "none";
        }

        const panel = document.getElementById("admin-panel");
        if (panel) {
            panel.style.display = "block";
        }
    }

    if (localStorage.getItem("booknestAdminLoggedIn") === "true") {
        showAdminPanel();
    }
});
