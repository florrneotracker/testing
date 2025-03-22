const API_URL = "https://florrneotracker.pythonanywhere.com/auth";
const output = document.getElementById("output");
const inputField = document.getElementById("key-input");
const terminal = document.getElementById("terminal");
const neoTrackerAnim = document.getElementById("neotracker-animation");
const mainInterface = document.getElementById("main-interface");
const presentsText = document.getElementById("presents-text");

// 🔥 Typing effect for terminal-style animations
async function typeEffect(element, text, speed = 50, glitch = false) {
    element.innerHTML = "";
    for (let char of text) {
        element.innerHTML += glitch && Math.random() > 0.8 ? randomChar() : char;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

// 🔥 Random glitch effect characters
function randomChar() {
    const chars = "!@#$%^&*()_+=-{}[]:;<>?/|";
    return chars[Math.floor(Math.random() * chars.length)];
}

// 🔥 Validate the stored key
async function validateKey() {
    const key = getCookie("auth_key");

    if (!key) {
        await typeEffect(output, "No key found. Please enter your access key:");
        inputField.style.display = "inline-block";
        inputField.focus();
        return;
    }

    await typeEffect(output, "Validating key...");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key })
        });

        const data = await response.json();

        if (data.success) {
            await typeEffect(output, "✅ Access granted!");
            setTimeout(startNeoTrackerAnimation, 1000);
        } else {
            await typeEffect(output, "❌ Invalid key. Please enter a new one.");
            deleteCookie("auth_key");
            inputField.style.display = "inline-block";
            inputField.focus();
        }
    } catch (error) {
        await typeEffect(output, "⚠️ Error connecting to server.");
    }
}

// 🔥 NeoTracker Animation with Glitch Effect
async function startNeoTrackerAnimation() {
    terminal.style.opacity = "0";
    setTimeout(async () => {
        terminal.style.display = "none";
        neoTrackerAnim.style.display = "flex";
        neoTrackerAnim.style.opacity = "1";

        await typeEffect(presentsText, "NeoTracker Team Presents", 80, true);

        setTimeout(() => {
            neoTrackerAnim.classList.add("fade-out"); // Smooth fade-out
            setTimeout(transitionToMainUI, 2000);
        }, 2500);
    }, 1000);
}

// 🔥 Transition to Main UI
function transitionToMainUI() {
    neoTrackerAnim.style.display = "none";
    mainInterface.style.display = "flex";
    setTimeout(() => {
        mainInterface.style.opacity = "1";
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

// 🔥 Get and Set Cookies
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

// ✅ Start key validation on load
window.onload = async function () {
    await validateKey();
};
