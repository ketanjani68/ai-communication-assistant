let MODEL = "llama-3.1-8b-instant";
let TONE = "formal";

chrome.storage.sync.get(["modelName", "tone"], (data) => {
  if (data.modelName) MODEL = data.modelName;
  if (data.tone) TONE = data.tone;
});

async function fixGrammar(text) {
  const prompt = `Fix the English grammar and punctuation mistakes in the following text. 
Make it ${TONE} and professional. 
Return ONLY the corrected sentence, nothing else:\n\n${text}`;
  return await callGroq(prompt);
}

async function translateToEnglish(text) {
  const prompt = `Translate the following Hindi or Hinglish text into ${TONE} professional English 
suitable for workplace communication. 
Return ONLY the translated English text, nothing else:\n\n${text}`;
  return await callGroq(prompt);
}

async function callGroq(prompt) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { action: "callGroq", prompt: prompt },
      (response) => {
        if (response && response.success) {
          resolve(response.text);
        } else {
          resolve(response?.error || "❌ Something went wrong. Please check your API key in settings.");
        }
      }
    );
  });
}
