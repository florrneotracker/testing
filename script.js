const API_URL = "https://florrneotracker.pythonanywhere.com/auth";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
}
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
async function validateKey() {
    const key = getCookie("auth_key");
    const statusText = document.getElementById("status");
    const authContainer = document.getElementById("auth-container");

    if (!key) {
        statusText.innerText = "No key found. Please enter your key.";
        authContainer.style.display = "block";
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key })
        });

        const data = await response.json();

        if (data.success) {
            console.log("✅ Key is valid!");
            statusText.innerText = "✅ Access granted!";
        } else {
            console.warn("❌ Invalid key:", data.error);
            deleteCookie("auth_key");
            statusText.innerText = "❌ Invalid key. Please enter a new one.";
            authContainer.style.display = "block";
        }
    } catch (error) {
        console.error("⚠️ Error validating key:", error);
        statusText.innerText = "⚠️ Error connecting to server.";
    }
}
function submitKey() {
    const keyInput = document.getElementById("key-input").value.trim();
    if (keyInput) {
        setCookie("auth_key", keyInput, 30);
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("status").innerText = "Checking authentication...";
        validateKey();
    }
}

validateKey();
