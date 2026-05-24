<div align="center">

# ✦ Smart Notes Generator

### AI-powered app that converts long-form text & audio into structured, intelligent notes


## What is this?

Smart Notes Generator takes any long piece of text — a lecture, article, meeting transcript, research paper — and turns it into clean, structured notes using AI. You can also **speak directly** into the app and it transcribes your voice in real time before generating notes.

Everything runs for **free** using the Groq API (no credit card needed).

---

## Features

| Feature | Description |
|---|---|
| 🤖 **AI Note Generation** | Llama 3.3 70B via Groq — fast, free, no credit card |
| 🎙️ **Live Voice Transcription** | Speak into your mic, words appear in real time |
| 📄 **4 Note Styles** | Structured, Summary, Bullet Points, Cornell Method |
| 📥 **PDF Export** | Download a styled, multi-page PDF instantly |
| 📋 **Copy to Clipboard** | Plain text, ready to paste anywhere |
| 🔒 **Private by default** | API key stored only in your browser — never on any server |
| ☐ **Checkable Action Items** | Click to tick off tasks inside your notes |

---

## Tech Stack

```
React 18          →  UI framework
Groq API          →  AI backend (free tier, Llama 3.3 70B model)
Web Speech API    →  Browser-native voice transcription (Chrome)
jsPDF             →  PDF generation in the browser
Plain CSS         →  Styling with CSS variables, no UI library
```

---

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Google Chrome (for voice input)
- A free Groq API key (takes 2 minutes — see below)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-notes-generator.git
cd smart-notes-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the app

```bash
npm start
```

App opens at **http://localhost:3000**

### 4. Get your free Groq API key

1. Visit **[console.groq.com](https://console.groq.com)** and sign up — it's free
2. Go to **API Keys** → click **Create API Key**
3. Copy the key (it starts with `gsk_`)
4. In the app, click **"Set API Key"** (top right) and paste it in

> No credit card. No billing. Just an email signup.

---

## How to Use

```
1. Paste text   OR   click "Start Recording" to speak
          ↓
2. Choose a note style (Structured / Summary / Bullets / Cornell)
          ↓
3. Click "Generate Smart Notes"
          ↓
4. View your notes → Export as PDF, copy as text, or download JSON
```

### Note Styles Explained

| Style | Best for |
|---|---|
| **Structured** | General use — headings, sections, key points |
| **Summary** | Long articles you want condensed fast |
| **Bullet Points** | Quick-scan format, lists only |
| **Cornell** | Students — cue column + notes + summary |

---

## Project Structure

```
smart-notes-generator/
├── public/
│   └── index.html                    # HTML entry point
├── src/
│   ├── index.js                      # React entry — mounts the app
│   ├── index.css                     # Global CSS variables & resets
│   ├── App.js / App.css              # Root layout, tab switching, state
│   ├── components/
│   │   ├── Header.js / .css          # Top nav bar + API key button
│   │   ├── ApiKeyModal.js / .css     # Popup for entering Groq key
│   │   ├── InputPanel.js / .css      # Text area + voice recorder + style picker
│   │   ├── NotesPanel.js / .css      # Displays generated notes + export buttons
│   │   └── EmptyState.js / .css      # Shown when no notes exist yet
│   ├── hooks/
│   │   └── useSpeechRecognition.js   # Web Speech API logic (custom hook)
│   └── utils/
│       ├── openai.js                 # Groq API call + 4 prompt templates
│       └── pdfExport.js              # PDF generation with jsPDF
├── .gitignore
├── package.json
└── README.md
```

---

## How it Works (Simple Version)

```
You type or speak
      ↓
InputPanel sends your text + chosen style to Groq API
      ↓
Groq runs Llama 3.3 70B and returns structured JSON
      ↓
NotesPanel renders JSON as cards, sections, action items
      ↓
pdfExport.js draws a PDF and triggers browser download
```

The AI is prompted to always return JSON in a fixed shape:
```json
{
  "title": "...",
  "summary": "...",
  "keyPoints": ["...", "..."],
  "sections": [{ "heading": "...", "content": "...", "bullets": ["..."] }],
  "actionItems": ["..."],
  "tags": ["..."]
}
```
The app then maps each field to a UI component.

---

## Groq Free Tier Limits

Groq's free tier is very generous for personal use:

| Limit | Amount |
|---|---|
| Requests per minute | 30 |
| Requests per day | 14,400 |
| Tokens per minute | 6,000 |

You would have to generate notes **non-stop for 8 hours** to approach the daily limit.

---

## Deployment

### Vercel (recommended — free)
```bash
npm install -g vercel
vercel
```

### Netlify (free)
```bash
npm run build
# Drag the /build folder to netlify.com/drop
```

### GitHub Pages
```bash
# Add to package.json:
# "homepage": "https://YOUR_USERNAME.github.io/smart-notes-generator"

npm install --save-dev gh-pages
npm run build
npx gh-pages -d build
```

---

## Known Limitations

- **Voice input works in Chrome only** — Web Speech API is not supported in Firefox or Safari
- **Direct browser API calls** — your Groq key is used client-side; fine for personal use, but add a backend proxy before making this public
- **No login / cloud sync** — notes are not saved between sessions (by design, for privacy)

---

## Built With

- [React](https://reactjs.org) — UI
- [Groq](https://groq.com) — Free AI API
- [Meta Llama 3.3 70B](https://console.groq.com/docs/models) — Language model
- [jsPDF](https://github.com/parallax/jsPDF) — PDF generation
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) — Voice transcription

---

## License

MIT — free to use, modify, and deploy.

---

<div align="center">
Built with React + Groq · 100% Free to Run
</div>
