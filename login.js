// BOOKNEST SUPABASE LOGIN

const SUPABASE_URL = "https://qcxhunpvbqcxlaiytric.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_LEGACY_ANON_KEY_HERE";
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

script.onload = function () {
    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    const loginForm = document.getElementById("loginForm");
    const message = document.getElementById("message");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        message.textContent = "Logging in...";

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            message.textContent = "Login failed: " + error.message;
            return;
        }

        sessionStorage.setItem("booknestLoggedIn", "true");
        sessionStorage.setItem("booknestUserEmail", data.user.email);

        message.textContent = "Login successful!";

        setTimeout(function () {
            window.location.href = "index.html";
        }, 1000);
    });
};

script.onerror = function () {
    document.getElementById("message").textContent =
        "Unable to load Supabase. Check your internet connection.";
};

document.head.appendChild(script);
