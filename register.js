// BookNest Registration System

document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("message");

    if (password !== confirmPassword) {
        message.style.color = "red";
        message.textContent = "Passwords do not match!";
        return;
    }

    // Save demo account in this browser only.
    // Do not use this method for real passwords.
    const account = {
        fullname: fullname,
        username: username,
        email: email,
        password: password
    };

    localStorage.setItem("booknestDemoAccount", JSON.stringify(account));

    message.style.color = "green";
    message.textContent = "Registration successful! Redirecting to login...";

    setTimeout(function() {
        window.location.href = "login.html";
    }, 1500);
});
