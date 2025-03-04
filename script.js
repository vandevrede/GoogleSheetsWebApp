const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqKPxGQ1MU_eueYK9fSm556eBOY1KemmdB-SyyCkGBl4EDnpq4qnobmogn4jVUL9Uu/exec"; // Update with your actual Apps Script Web App URL

// Load the user's Google Sheet
window.onload = function () {
    fetch(`${APPS_SCRIPT_URL}?action=getSheet`)
        .then(response => response.text())
        .then(url => {
            localStorage.setItem("userSheetUrl", url.trim());
            document.getElementById("googleSheet").src = `${url.trim()}?widget=true&headers=false`;
        })
        .catch(error => console.error("Error fetching sheet:", error));
};

// Send user message to OpenAI via Apps Script
function sendMessage() {
    let userMessage = document.getElementById("userInput").value.trim();
    if (!userMessage) return;

    appendMessage(`You: ${userMessage}`);
    document.getElementById("userInput").value = "";

    fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "askAi", message: userMessage })
    })
    .then(response => response.json())
    .then(data => {
        appendMessage(`AI: ${data.response}`);
    })
    .catch(error => {
        console.error("Error:", error);
        appendMessage("AI: Sorry, something went wrong.");
    });
}

// Append messages to chatbox
function appendMessage(message) {
    let chatbox = document.getElementById("chatbox");
    let msgElement = document.createElement("div");
    msgElement.textContent = message;
    chatbox.appendChild(msgElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}
