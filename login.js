// BookNest Login System

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    // Demo login credentials
    const correctUsername = "booknest";
    const correctPassword = "12345";

    if (username === correctUsername && password === correctPassword) {
        message.style.color = "green";
        message.textContent = "Login successful! Opening BookNest...";

        // Remember the demo login in this browser
        sessionStorage.setItem("booknestLoggedIn", "true");

        setTimeout(function() {
            window.location.href = "index.html";
        }, 1000);

    } else {
        message.style.color = "red";
        message.textContent = "Incorrect username or password!";
    }
});
