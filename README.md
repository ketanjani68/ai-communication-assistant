# AI Communication Assistant

AI Communication Assistant is a Chrome Extension for Microsoft Teams Web that helps users improve workplace communication by correcting grammar, translating Hindi and Hinglish into professional English, and enhancing message clarity with a single click.

## Overview

Many professionals communicate using a mix of Hindi and English while working in Microsoft Teams. This often leads to grammatical mistakes, unclear communication, and inconsistent messaging standards.

AI Communication Assistant provides an AI powered solution directly within Microsoft Teams Web, allowing users to improve their messages before sending them. The extension integrates seamlessly into the Teams chat interface and delivers professional quality writing suggestions in real time.

## Features

- Grammar correction
- Hindi to English translation
- Hinglish to professional English conversion
- Professional workplace communication enhancement
- One click message improvement
- Multiple AI provider support
- Microsoft Teams Web integration
- Real time AI suggestions
- Easy setup and configuration

## How It Works

1. Open Microsoft Teams Web.
2. Type your message in the chat box.
3. Click either **Grammar Check** or **Hindi to ENG**.
4. The extension sends the text to the selected AI provider.
5. Review the AI generated suggestion.
6. Click **Apply to Chat**.
7. Send the improved message.

## Technology Stack

- Chrome Extension (Manifest V3)
- JavaScript
- HTML
- CSS
- Groq API
- Google Gemini API

## Project Structure

```text
ai-communication-assistant/
│
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── styles.css
├── ollama.js
│
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/ketanjani68/ai-communication-assistant.git
```

Or download the repository as a ZIP file and extract it.

## Adding the Extension to Google Chrome

### Step 1: Open Chrome Extensions

Open Google Chrome and navigate to:

```text
chrome://extensions/
```

### Step 2: Enable Developer Mode

Enable **Developer Mode** using the toggle in the top right corner.

### Step 3: Load the Extension

Click **Load unpacked**.

Select the project folder that contains:

```text
manifest.json
background.js
content.js
popup.html
popup.js
styles.css
```

### Step 4: Verify Installation

After loading, the extension will appear in your Chrome Extensions list.

You should see:

```text
AI Communication Assistant
```

### Step 5: Pin the Extension

Click the Extensions icon in Chrome and pin the extension to the toolbar for easy access.

### Step 6: Configure AI Provider

1. Click the extension icon.
2. Select your preferred AI provider:
   - Groq
   - Google Gemini
3. Enter your API key.
4. Select the preferred communication tone.
5. Click **Save Settings**.

### Step 7: Open Microsoft Teams Web

Navigate to:

```text
https://teams.microsoft.com
```

or

```text
https://teams.live.com
```

Open any chat or conversation.

### Step 8: Start Using the Extension

Type a message and use:

- Grammar Check
- Hindi to ENG

Review the AI generated suggestion and apply it directly to the chat before sending.

## Screenshots

### Extension Settings

_Add screenshot here_

### Microsoft Teams Integration

_Add screenshot here_

### AI Suggestion Panel

_Add screenshot here_

## Supported AI Providers

### Groq

- Fast response times
- Llama 3.1 Instant model support
- User provided API key
- Suitable for real time message enhancement

### Google Gemini

- Google AI Studio integration
- Gemini Flash model support
- User provided API key
- Reliable language translation and grammar correction

## Use Cases

- Client communication
- Team collaboration
- Professional messaging
- Grammar correction
- Hindi to English translation
- Hinglish to professional English conversion
- Workplace communication improvement

## Privacy

- Messages are processed only when requested by the user.
- No message history is stored by the extension.
- Users manage their own API keys.
- No personal data is collected by the extension.

## Roadmap

- Slack support
- Gmail support
- WhatsApp Web support
- Additional tone options
- AI auto detection mode
- Chrome Web Store publication
- Custom communication styles
- Message shortening and expansion

## Author

**Ketan Jani**

Digital Marketing Team Leader

Dolphin Web Solution

## License

MIT License
