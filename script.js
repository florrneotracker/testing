const API_URL = "https://florrneotracker.pythonanywhere.com/auth";
const output = document.getElementById("output");
const inputField = document.getElementById("key-input");
const terminal = document.getElementById("terminal");
const mainInterface = document.getElementById("main-interface");

// 🔥 Function to simulate terminal typing effect
async function typeEffect(text, speed = 50) {
    for (let char of text) {
        output.innerHTML += char;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    output.innerHTML += "<br>";
}

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

// 🔥 Function to fade out the terminal and show the main UI
function transitionToMainUI() {
    terminal.style.opacity = "0"; // Fade out
    setTimeout(() => {
        terminal.style.display = "none";
        mainInterface.style.display = "flex";
        mainInterface.style.opacity = "1"; // Fade in
    }, 1500);
}

// 🔥 Function to validate the stored key with the API
async function validateKey() {
    const key = getCookie("auth_key");

    if (!key) {
        await typeEffect("No key found. Please enter your access key:");
        inputField.style.display = "inline-block";
        inputField.focus();
        return;
    }

    await typeEffect("Validating key...");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key })
        });

        const data = await response.json();

        if (data.success) {
            await typeEffect("✅ Access granted!");
            setTimeout(transitionToMainUI, 1000); // Start UI transition
        } else {
            await typeEffect("❌ Invalid key. Please enter a new one.");
            deleteCookie("auth_key");
            inputField.style.display = "inline-block";
            inputField.focus();
        }
    } catch (error) {
        await typeEffect("⚠️ Error connecting to server.");
    }
}

// 🔥 Function to handle key submission
inputField.addEventListener("keypress", async function (event) {
    if (event.key === "Enter") {
        const key = inputField.value.trim();
        if (key) {
            inputField.style.display = "none";
            output.innerHTML += `$ ${key} <br>`;
            setCookie("auth_key", key, 30);
            await validateKey();
        }
    }
});

// ✅ Show intro animation, then validate key
window.onload = async function () {
    await typeEffect("NeoTracker Team Presents\n", 100);
    await typeEffect("---------------------------\n", 50);
    await validateKey();
};
