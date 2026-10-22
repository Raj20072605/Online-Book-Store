// BookNest Login System

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    // Get the registered demo account
    const savedAccount = localStorage.getItem("booknestDemoAccount");

    if (savedAccount) {
        const account = JSON.parse(savedAccount);

        if (username === account.username && password === account.password) {
            message.style.color = "green";
            message.textContent = "Login successful! Welcome to BookNest!";

            sessionStorage.setItem("booknestLoggedIn", "true");

            setTimeout(function() {
                window.location.href = "index.html";
            }, 1000);

        } else {
            message.style.color = "red";
            message.textContent = "Incorrect username or password!";
        }

    } else {
        // Demo login when no account has been registered
        if (username === "booknest" && password === "12345") {
            message.style.color = "green";
            message.textContent = "Login successful!";

            sessionStorage.setItem("booknestLoggedIn", "true");

            setTimeout(function() {
                window.location.href = "index.html";
            }, 1000);

        } else {
            message.style.color = "red";
            message.textContent = "Please register first or check your credentials!";
        }
    }
});
