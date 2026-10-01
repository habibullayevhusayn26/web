# Gemini AI Chat setup

1. Install Node.js 18 or newer.
2. Create a Gemini API key in Google AI Studio: https://aistudio.google.com/app/apikey
3. Copy `.env.example` to `.env` and replace `your_gemini_api_key_here` with your key. Keep `.env` private; it is excluded from Git.
4. In the project folder, run `node server.mjs`.
5. Open http://localhost:3000.

Gemini API has free usage limits and is not unlimited. The key is read only by the local server; do not put it in browser JavaScript. Change `GEMINI_MODEL` in `.env` if the model configured for your account changes.
