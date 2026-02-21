const authApi = "http://127.0.0.1:8003";
const playerPage = "http://127.0.0.1:5501";


function showRegister() {
    document.getElementById("loginCard").style.display = "none";
    document.getElementById("registerCard").style.display = "block";
}

function showLogin() {
    document.getElementById("registerCard").style.display = "none";
    document.getElementById("loginCard").style.display = "block";
}
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("loginMessage");

    if (!username || !password) {
        message.style.color = "red";
        message.textContent = "Enter username and password";
        return;
    }

    try {
        const response = await fetch(`${authApi}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            message.style.color = "red";
            message.textContent = data.detail || "Login error";
            return;
        }

        if (!data.access_token) {
            message.style.color = "red";
            message.textContent = "Token not received";
            return;
        }

        // Сохраняем токен и переходим на страницу игроков с токеном в URL
        localStorage.setItem("token", data.access_token);
        message.style.color = "green";
        message.textContent = "Login successful! Redirecting...";

        setTimeout(() => {
            window.location.href = `${playerPage}?token=${data.access_token}`;
        }, 500);

    } catch (err) {
        message.style.color = "red";
        message.textContent = "Auth service unavailable";
        console.error(err);
    }
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const message = document.getElementById("registerMessage");

    try {
        const response = await fetch(`${authApi}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            message.style.color = "red";
            message.textContent = data.detail || "Registration error";
            return;
        }

        message.style.color = "green";
        message.textContent = "Account created! You can now login.";

        setTimeout(() => {
            showLogin();
        }, 1000);

    } catch (err) {
        message.style.color = "red";
        message.textContent = "Server error";
        console.error(err);
    }
});
