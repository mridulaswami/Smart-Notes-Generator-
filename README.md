# Smart Notes Generator ✦

An AI-powered web app that converts long-form text and live audio into structured, intelligent notes — with PDF export and multiple note styles.

**100% Free to run** — powered by [Groq](https://groq.com) (free tier, no credit card needed).

---

## Features

- **AI Note Generation** — Uses Llama 3.3 70B via Groq API (free)
- **Live Voice Transcription** — Web Speech API for real-time mic-to-text
- **4 Note Styles** — Structured, Summary, Bullet Points, Cornell Method
- **PDF Export** — Styled multi-page PDF with one click (jsPDF)
- **JSON Export** — Download raw structured notes data
- **Copy to Clipboard** — Plain text format
- **Checkable Action Items** — Interactive to-do items inside notes
- **API Key stored locally** — Never sent anywhere except Groq directly

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 |
| AI | Groq API — Llama 3.3 70B (free tier) |
| Voice | Web Speech API |
| PDF | jsPDF + jspdf-autotable |
| Styling | Plain CSS with CSS variables |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/smart-notes-generator.git
cd smart-notes-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npm start
```

Opens at `http://localhost:3000`

### 4. Get your FREE Groq API key

1. Go to [console.groq.com](https://console.groq.com) — sign up for free
2. Click **API Keys** → **Create API Key**
3. Copy it (starts with `gsk_`)
4. Paste it into the app when prompted — done!

> **No credit card. No billing. Just sign up and go.**

---

## Usage

1. Click **Set API Key** → paste your Groq key
2. **Text Input** — paste a lecture, article, meeting transcript, or any long text
3. **Voice Input** — click "Start Recording" and speak (Chrome recommended)
4. Pick a **Note Style** — Structured / Summary / Bullet Points / Cornell
5. Click **Generate Smart Notes**
6. **Export** as PDF, copy as text, or download JSON

---

## Groq Free Tier Limits

Groq's free tier is very generous:

| Limit | Value |
|---|---|
| Requests per minute | 30 |
| Requests per day | 14,400 |
| Tokens per minute | 6,000 |

For personal note-taking you will essentially never hit these limits.

---

## Project Structure

```
src/
├── components/
│   ├── Header.js / .css          # Top navigation bar
│   ├── ApiKeyModal.js / .css     # Groq key setup modal
│   ├── InputPanel.js / .css      # Text + voice input area
│   ├── NotesPanel.js / .css      # Generated notes display
│   └── EmptyState.js / .css      # Empty notes tab placeholder
├── hooks/
│   └── useSpeechRecognition.js   # Web Speech API custom hook
├── utils/
│   ├── openai.js                 # Groq API call + prompt templates
│   └── pdfExport.js              # jsPDF styled export
├── App.js / .css                 # Root layout + tab navigation
├── index.js                      # React entry point
└── index.css                     # Global CSS variables + resets
```

---

## Deployment (Free)

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag the /build folder into netlify.com/drop
```

---

## Notes

- Voice input requires **Google Chrome** (Web Speech API is not supported in Firefox/Safari)
- Model used: `llama-3.3-70b-versatile` — change in `src/utils/openai.js` if needed
- Direct browser API calls — for production, consider a small backend proxy

---

## License

MIT
