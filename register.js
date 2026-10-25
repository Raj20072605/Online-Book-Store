// BookNest Registration System

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        return;
    }

    registerForm.addEventListener("submit", function (event) {
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

        const account = {
            fullname: fullname,
            username: username,
            email: email,
            password: password
        };

        try {
            localStorage.setItem(
                "booknestDemoAccount",
                JSON.stringify(account)
            );

            const savedAccount = JSON.parse(
                localStorage.getItem("booknestDemoAccount")
            );

            if (!savedAccount || savedAccount.username !== username) {
                throw new Error("Account could not be saved.");
            }

            message.style.color = "green";
            message.textContent =
                "Registration successful! Your account is saved.";

            registerForm.reset();

            setTimeout(function () {
                window.location.href = "login.html";
            }, 2000);

        } catch (error) {
            message.style.color = "red";
            message.textContent =
                "Could not save your account. Please enable browser storage.";
        }
    });

});
