# 🚀 Postcraft AI — Social Media Content Generator

A production-quality AI-powered content generator built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Generate platform-perfect posts for LinkedIn, Twitter/X, and Instagram — with or without an API key.

---

## ✨ Features

- **4 output types**: LinkedIn post, Twitter/X post, Instagram caption, AI image prompt
- **Smart fallback**: Works out-of-the-box with template-based generation
- **AI-powered**: Plug in OpenAI or Google Gemini for premium results
- **Copy to clipboard**: One-click copy for each output card
- **Character counter**: Visual limit indicator per platform
- **Keyboard shortcut**: `Cmd/Ctrl + Enter` to generate
- **Responsive design**: Beautiful on mobile and desktop
- **Dark theme**: Refined dark UI with amber accents

---

## 🛠 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Framework  | Next.js 15 (App Router)       |
| Language   | TypeScript                    |
| Styling    | Tailwind CSS                  |
| Icons      | Lucide React                  |
| Fonts      | Syne + DM Sans + JetBrains Mono |
| Backend    | Next.js API Routes            |
| AI         | OpenAI GPT-4o-mini / Gemini 1.5 Flash |

---

## 🏃 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Add your API keys
cp .env.example .env.local
# Then edit .env.local with your keys

# 3. Run the dev server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

---

## 📁 Project Structure

```
ai-content-gen/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts        # API endpoint
│   ├── globals.css             # Global styles + animations
│   ├── layout.tsx              # Root layout + metadata
│   └── page.tsx                # Main UI component
├── lib/
│   └── contentGenerator.ts     # Core logic (templates + AI)
├── .env.example                # Environment variables template
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔐 API Keys (Optional)

The app works without any API key using smart template-based generation.

To enable AI-powered generation:

**OpenAI** (recommended):
1. Get a key at [platform.openai.com](https://platform.openai.com/api-keys)
2. Add to `.env.local`: `OPENAI_API_KEY=sk-...`
3. Uses `gpt-4o-mini` (fast + affordable)

**Google Gemini** (free tier):
1. Get a key at [aistudio.google.com](https://aistudio.google.com/app/apikey)
2. Add to `.env.local`: `GEMINI_API_KEY=AIza...`
3. Uses `gemini-1.5-flash`

> If both keys are set, OpenAI is used first with Gemini as fallback.

---

## 🚀 Deploy to Vercel

```bash
npx vercel deploy
```

Or connect your GitHub repo to Vercel and add environment variables in the dashboard.

---

## 📝 License

MIT — use it, build on it, ship it.
