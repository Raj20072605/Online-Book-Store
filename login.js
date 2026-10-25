// BookNest Login System

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    let account;

    try {
        account = JSON.parse(localStorage.getItem("booknestDemoAccount"));
    } catch (error) {
        account = null;
    }

    if (!account) {
        message.style.color = "red";
        message.textContent = "Please register an account first.";
        return;
    }

    if (account.username === username && account.password === password) {
        sessionStorage.setItem("booknestLoggedIn", "true");
        sessionStorage.setItem("booknestUsername", username);

        message.style.color = "green";
        message.textContent = "Login successful!";

        setTimeout(function() {
            window.location.href = "index.html";
        }, 1000);
    } else {
        message.style.color = "red";
        message.textContent = "Incorrect username or password. Please register again.";
    }
});
