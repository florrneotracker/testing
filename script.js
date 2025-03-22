const API_URL = "https://florrneotracker.pythonanywhere.com/auth";
const output = document.getElementById("output");
const inputField = document.getElementById("key-input");
const terminal = document.getElementById("terminal");
const mainInterface = document.getElementById("main-interface");
const intro = document.getElementById("intro");

let failCounter = 0;

let funnyMessages = [
    "Okay... Are you doing this on purpose?",
    "Bro, just stop. It's embarrassing.",
    "This isn't a guessing game, you know.",
    "Okay, you are clearly not worthy. Quit it.",
    "You know that I spend money to handle those requests, you are being annoying bruh.",
    "Imagine bruteforcing.",
    "You remind me of zira... we don't talk about zira.",
    "THY END IS NOW."
];

async function typeEffect(text, speed = 50) {
    for (let char of text) {
        output.innerHTML += char;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
    output.innerHTML += "<br>";
}

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

function showIntroAnimation() {
    terminal.style.opacity = "0";
    setTimeout(() => {
        terminal.style.display = "none";
        intro.style.opacity = "1";
        intro.style.transform = "scale(1)";
    }, 1500);

    setTimeout(() => {
        intro.style.opacity = "0";
        setTimeout(() => {
            intro.style.display = "none";
            mainInterface.style.display = "flex";
            mainInterface.style.opacity = "1";
        }, 1000);
    }, 4000);
}

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
            localStorage.setItem("failCounter", 0); // Reset fail counter
            setTimeout(showIntroAnimation, 1000);
        } else {
            failCounter++;
            localStorage.setItem("failCounter", failCounter);

            if (failCounter >= 7) {
                await typeEffect("💀 Okay, you know what... die.");
                setTimeout(() => location.reload(), 2000);
                return;
            }

            if (failCounter >= 3 && funnyMessages.length > 0) {
                const randomIndex = Math.floor(Math.random() * funnyMessages.length);
                const message = funnyMessages.splice(randomIndex, 1)[0]; // Remove message after using
                await typeEffect(`💀 ${message}`);
            } else {
                await typeEffect("❌ Invalid key. Please enter a new one.");
            }

            deleteCookie("auth_key");
            inputField.style.display = "inline-block";
            inputField.focus();
        }
    } catch (error) {
        await typeEffect("⚠️ Error connecting to server.");
    }
}

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

window.onload = async function () {
    await validateKey();
};
