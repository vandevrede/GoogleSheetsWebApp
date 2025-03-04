const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqKPxGQ1MU_eueYK9fSm556eBOY1KemmdB-SyyCkGBl4EDnpq4qnobmogn4jVUL9Uu/exec";  // Replace with your actual Apps Script URL

// 🚀 Load the user's Google Sheet when the page loads
window.onload = function () {
    fetch(`${APPS_SCRIPT_URL}?action=getSheet`)
        .then(response => response.text())
        .then(url => {
            localStorage.setItem("userSheetUrl", url.trim());
            document.getElementById("googleSheet").src = `${url.trim()}?widget=true&headers=false`;
        })
        .catch(error => console.error("❌ Error fetching sheet:", error));
};

// 📝 Send user message to Google Apps Script (which talks to OpenAI)
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
        console.error("❌ Error:", error);
        appendMessage("AI: Sorry, something went wrong.");
    });
}

// 📊 Read data from Google Sheets via Apps Script
async function readSheetData() {
    const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "readSheet" })
    });

    const data = await response.json();
    console.log("📊 Google Sheet Data:", data);
    return data.sheetData || [];
}

// ✏️ Write data to Google Sheets via Apps Script
async function writeToSheet(value) {
    const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "writeSheet", data: value })
    });

    const result = await response.json();
    console.log("✅ Write Response:", result);
}

// 📩 Append messages to chatbox
function appendMessage(message) {
    let chatbox = document.getElementById("chatbox");
    let msgElement = document.createElement("div");
    msgElement.textContent = message;
    chatbox.appendChild(msgElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// 💾 Save chat history in localStorage
function saveChatHistory() {
    let chatbox = document.getElementById("chatbox");
    localStorage.setItem("chatHistory", chatbox.innerHTML);
}

// 🔄 Load chat history on page load
window.addEventListener("load", function () {
    let savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
        document.getElementById("chatbox").innerHTML = savedChat;
    }
});
