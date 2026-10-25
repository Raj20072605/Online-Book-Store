// BookNest Original Login System

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const users = JSON.parse(localStorage.getItem("booknestUsers")) || [];

    const user = users.find(function(u) {
        return u.username === username && u.password === password;
    });

    if (user) {
        sessionStorage.setItem("booknestLoggedIn", "true");
        sessionStorage.setItem("booknestUsername", username);

        message.textContent = "Login successful!";

        setTimeout(function() {
            window.location.href = "index.html";
        }, 1000);
    } else {
        message.textContent = "Invalid username or password. Please register first.";
    }
});
       
