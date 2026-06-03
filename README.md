# AI Communication Assistant

AI Communication Assistant is a Chrome Extension designed for Microsoft Teams Web that helps users improve workplace communication by correcting grammar, translating Hindi and Hinglish into professional English, and enhancing message clarity with a single click.

## Overview

Professionals often communicate using a mixture of Hindi and English while collaborating on Microsoft Teams. This can result in grammatical mistakes, unclear messaging, and inconsistent communication standards.

AI Communication Assistant provides an AI powered solution directly within Microsoft Teams Web, enabling users to improve messages before sending them.

## Features

- Grammar correction
- Hindi to English translation
- Hinglish to professional English conversion
- Workplace communication enhancement
- One click message improvement
- Multiple AI provider support
- Microsoft Teams Web integration

## How It Works

1. Open Microsoft Teams Web.
2. Type your message in the chat box.
3. Select either Grammar Check or Hindi to English.
4. Review the AI generated suggestion.
5. Apply the improved text directly to the chat.
6. Send the message.


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

### Load Extension Locally

Clone the repository:

```bash
git clone https://github.com/ketanjani68/ai-communication-assistant.git
```

Open Chrome and navigate to:

```text
chrome://extensions
```

Enable Developer Mode.

Click Load unpacked and select the project folder.

Open Microsoft Teams Web and configure your preferred AI provider from the extension settings.

## Supported AI Providers

### Groq

- Fast response times
- Llama 3.1 Instant model support
- User provided API key

### Google Gemini

- Google AI Studio integration
- Gemini Flash model support
- User provided API key

## Use Cases

- Client communication
- Team collaboration
- Professional messaging
- Grammar correction
- Hindi to English translation
- Workplace communication improvement

## Privacy

- Messages are processed only when requested by the user.
- No message history is stored by the extension.
- Users manage their own API keys.
- No personal data is collected.

## Roadmap

- Slack support
- Gmail support
- WhatsApp Web support
- Additional tone options
- AI auto detection mode
- Chrome Web Store publication
- Custom communication styles

## Author

Ketan Jani

Digital Marketing Team Leader

Dolphin Web Solution

## License

MIT License
