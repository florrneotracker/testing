const API_URL = "https://florrneotracker.pythonanywhere.com/auth"; // Your Flask API

// 🔥 Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// 🔥 Function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
}

// 🔥 Function to delete a cookie
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// 🔥 Function to validate the stored key with the API
async function validateKey() {
    const key = getCookie("auth_key");
    const statusText = document.getElementById("status");
    const authContainer = document.getElementById("auth-container");

    if (!key) {
        statusText.innerText = "No key found. Please enter your key.";
        authContainer.style.display = "block"; // Show input field
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
            deleteCookie("auth_key"); // 🔥 Delete invalid key
            statusText.innerText = "❌ Invalid key. Please enter a new one.";
            authContainer.style.display = "block"; // Show input field
        }
    } catch (error) {
        console.error("⚠️ Error validating key:", error);
        statusText.innerText = "⚠️ Error connecting to server.";
    }
}

// 🔥 Function to handle key submission
function submitKey() {
    const keyInput = document.getElementById("key-input").value.trim();
    if (keyInput) {
        setCookie("auth_key", keyInput, 7); // Save key for 7 days
        document.getElementById("auth-container").style.display = "none"; // Hide input field
        document.getElementById("status").innerText = "Checking authentication...";
        validateKey(); // Revalidate the key
    }
}

// ✅ Run validation on page load
validateKey();
