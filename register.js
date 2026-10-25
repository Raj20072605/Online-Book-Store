// BookNest Login System

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    // Get the registered account
    const savedAccount = localStorage.getItem("booknestDemoAccount");

    if (!savedAccount) {
        message.style.color = "red";
        message.textContent = "No account found. Please register first.";
        return;
    }

    const account = JSON.parse(savedAccount);

    // Check username and password
    if (account.username === username && account.password === password) {
        sessionStorage.setItem("booknestLoggedIn", "true");
        sessionStorage.setItem("booknestUsername", username);

        message.style.color = "green";
        message.textContent = "Login successful! Opening BookNest...";

        setTimeout(function() {
            window.location.href = "index.html";
        }, 1000);

    } else {
        message.style.color = "red";
        message.textContent = "Incorrect username or password.";
    }
});
