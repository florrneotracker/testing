const API_URL = "https://florrneotracker.pythonanywhere.com/auth";
const output = document.getElementById("output");
const inputField = document.getElementById("key-input");
const terminal = document.getElementById("terminal");
const neoTrackerAnim = document.getElementById("neotracker-animation");
const mainInterface = document.getElementById("main-interface");

// 🔥 Typing effect for terminal
async function typeEffect(text, speed = 50) {
    for (let char of text) {
        output.innerHTML += char;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    output.innerHTML += "<br>";
}

// 🔥 Cookie functions
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

// 🔥 Function to validate the stored key
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
            setTimeout(startNeoTrackerAnimation, 1000); // Wait before starting animation
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

// 🔥 Function to start the NeoTracker animation (only plays once)
function startNeoTrackerAnimation() {
    terminal.style.opacity = "0"; // Fade out terminal
    setTimeout(() => {
        terminal.style.display = "none";
        neoTrackerAnim.style.display = "flex";
        neoTrackerAnim.style.opacity = "1"; // Fade in
        setTimeout(() => {
            neoTrackerAnim.style.opacity = "0"; // Fade out animation
            setTimeout(transitionToMainUI, 1500); // Wait before showing UI
        }, 2500);
    }, 1000);
}

// 🔥 Function to transition to the main UI
function transitionToMainUI() {
    neoTrackerAnim.style.display = "none";
    mainInterface.style.display = "flex";
    setTimeout(() => {
        mainInterface.style.opacity = "1"; // Fade in main UI
    }, 500);
}

// 🔥 Handle user key input
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

// ✅ Start key validation on load
window.onload = async function () {
    await validateKey();
};
