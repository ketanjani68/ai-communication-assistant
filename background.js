// Set default settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    apiProvider: "groq",
    groqApiKey: "",
    googleApiKey: "",
    modelName: "llama-3.1-8b-instant",
    tone: "formal"
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "callGroq") {

    chrome.storage.sync.get(["apiProvider", "groqApiKey", "googleApiKey", "modelName"], async (data) => {
      const provider = data.apiProvider || "groq";

      // ── GROQ ──────────────────────────────────────────────────────────────
      if (provider === "groq") {
        if (!data.groqApiKey || data.groqApiKey.trim() === "") {
          sendResponse({
            success: false,
            error: "⚠️ Groq API key not set. Click the extension icon to add your API key."
          });
          return;
        }

        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${data.groqApiKey.trim()}`
            },
            body: JSON.stringify({
              model: data.modelName || "llama-3.1-8b-instant",
              temperature: 0.3,
              max_tokens: 500,
              messages: [
                {
                  role: "system",
                  content: "You are a professional English writing assistant. Always return only the corrected or translated text. Never add explanations, quotes, or extra words."
                },
                {
                  role: "user",
                  content: request.prompt
                }
              ]
            })
          });

          const result = await response.json();

          if (result.error) {
            sendResponse({ success: false, error: "❌ Groq API Error: " + result.error.message });
          } else {
            sendResponse({ success: true, text: result.choices[0].message.content.trim() });
          }

        } catch (err) {
          sendResponse({ success: false, error: "❌ Network error. Check your internet connection." });
        }

      // ── GOOGLE GEMINI ─────────────────────────────────────────────────────
      } else if (provider === "google") {
        if (!data.googleApiKey || data.googleApiKey.trim() === "") {
          sendResponse({
            success: false,
            error: "⚠️ Google API key not set. Click the extension icon to add your API key."
          });
          return;
        }

        const systemInstruction = "You are a professional English writing assistant. Always return only the corrected or translated text. Never add explanations, quotes, or extra words.";

        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${data.googleApiKey.trim()}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [{ text: systemInstruction + "\n\n" + request.prompt }]
                  }
                ],
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 500
                }
              })
            }
          );

          const result = await response.json();

          if (result.error) {
            sendResponse({ success: false, error: "❌ Google API Error: " + result.error.message });
          } else {
            sendResponse({ success: true, text: result.candidates[0].content.parts[0].text.trim() });
          }

        } catch (err) {
          sendResponse({ success: false, error: "❌ Network error. Check your internet connection." });
        }
      }
    });

    return true; // Keep message channel open for async
  }
});
