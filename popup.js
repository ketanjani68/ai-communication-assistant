document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["apiProvider", "groqApiKey", "googleApiKey", "tone"], (data) => {
    const provider = data.apiProvider || "groq";

    // Populate stored values
    document.getElementById("groqApiKey").value   = data.groqApiKey   || "";
    document.getElementById("googleApiKey").value = data.googleApiKey || "";
    document.getElementById("tone").value         = data.tone         || "formal";

    // Activate the correct tab
    switchTab(provider);

    // Determine the active key and decide whether to show banner or check status
    const activeKey = provider === "groq" ? (data.groqApiKey || "") : (data.googleApiKey || "");
    if (!activeKey.trim()) {
      document.getElementById("setup-banner").classList.add("show");
      document.getElementById("status-dot").className = "dot yellow";
      document.getElementById("api-status").innerText = "⚠️ API Key not set";
      document.getElementById("api-model-status").innerText = "Enter your API key above to get started";
    } else {
      checkApiStatus(provider, activeKey.trim());
    }
  });

  // Tab clicks
  document.getElementById("tab-groq").addEventListener("click",   () => switchTab("groq"));
  document.getElementById("tab-google").addEventListener("click",  () => switchTab("google"));

  // Eye toggles
  document.getElementById("toggle-groq-eye").addEventListener("click",   () => toggleEye("groqApiKey"));
  document.getElementById("toggle-google-eye").addEventListener("click",  () => toggleEye("googleApiKey"));

  // Save
  document.getElementById("save-btn").addEventListener("click", saveSettings);
});

/* ── Tab Switcher ───────────────────────────────────────────────────────── */
function switchTab(provider) {
  document.getElementById("apiProvider").value = provider;

  const tabGroq   = document.getElementById("tab-groq");
  const tabGoogle = document.getElementById("tab-google");
  const secGroq   = document.getElementById("groq-section");
  const secGoogle = document.getElementById("google-section");

  if (provider === "groq") {
    tabGroq.classList.add("active");
    tabGoogle.classList.remove("active");
    secGroq.style.display   = "block";
    secGoogle.style.display = "none";
  } else {
    tabGoogle.classList.add("active");
    tabGroq.classList.remove("active");
    secGoogle.style.display = "block";
    secGroq.style.display   = "none";
  }
}

/* ── Eye Toggle ─────────────────────────────────────────────────────────── */
function toggleEye(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === "password" ? "text" : "password";
}

/* ── API Status Check ───────────────────────────────────────────────────── */
async function checkApiStatus(provider, apiKey) {
  const dot         = document.getElementById("status-dot");
  const statusText  = document.getElementById("api-status");
  const modelStatus = document.getElementById("api-model-status");

  dot.className      = "dot";
  statusText.innerText = "Checking connection...";
  modelStatus.innerText = "";

  try {
    let response;

    if (provider === "groq") {
      response = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });

      if (response.ok) {
        dot.classList.add("green");
        document.getElementById("setup-banner").classList.remove("show");
        statusText.innerText  = "Groq API Connected ✅";
        modelStatus.innerText = "Ready to use in Microsoft Teams";
      } else {
        dot.classList.add("yellow");
        statusText.innerText  = "Invalid Groq API Key ❌";
        modelStatus.innerText = "Please check your Groq API key";
      }

    } else if (provider === "google") {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );

      if (response.ok) {
        dot.classList.add("green");
        document.getElementById("setup-banner").classList.remove("show");
        statusText.innerText  = "Google AI Studio Connected ✅";
        modelStatus.innerText = "Ready to use in Microsoft Teams";
      } else {
        dot.classList.add("yellow");
        statusText.innerText  = "Invalid Google API Key ❌";
        modelStatus.innerText = "Please check your Google AI Studio API key";
      }
    }

  } catch (e) {
    dot.className     = "dot"; // red (default)
    statusText.innerText  = "No Internet Connection ❌";
    modelStatus.innerText = "Check your internet connection";
  }
}

/* ── Save Settings ──────────────────────────────────────────────────────── */
function saveSettings() {
  const apiProvider  = document.getElementById("apiProvider").value;
  const groqApiKey   = document.getElementById("groqApiKey").value.trim();
  const googleApiKey = document.getElementById("googleApiKey").value.trim();
  const tone         = document.getElementById("tone").value;
  const msg          = document.getElementById("msg");

  // Validate only the selected provider's key
  if (apiProvider === "groq" && !groqApiKey) {
    msg.style.color = "#DC2626";
    msg.innerText   = "⚠️ Please enter your Groq API key first!";
    setTimeout(() => { msg.innerText = ""; }, 3000);
    return;
  }

  if (apiProvider === "google" && !googleApiKey) {
    msg.style.color = "#DC2626";
    msg.innerText   = "⚠️ Please enter your Google API key first!";
    setTimeout(() => { msg.innerText = ""; }, 3000);
    return;
  }

  chrome.storage.sync.set({ apiProvider, groqApiKey, googleApiKey, tone }, () => {
    msg.style.color = "#16a34a";
    msg.innerText   = "✅ Settings saved!";
    setTimeout(() => { msg.innerText = ""; }, 3000);

    const activeKey = apiProvider === "groq" ? groqApiKey : googleApiKey;
    checkApiStatus(apiProvider, activeKey);
  });
}
