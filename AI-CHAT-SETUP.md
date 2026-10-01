# Gemini AI Chat setup

1. Install Node.js 18 or newer.
2. Create a Gemini API key in Google AI Studio: https://aistudio.google.com/app/apikey
3. Copy `.env.example` to `.env` and replace `your_gemini_api_key_here` with your key. Keep `.env` private; it is excluded from Git.
4. In the project folder, run `node server.mjs`.
5. Open http://localhost:3000.

Gemini API has free usage limits and is not unlimited. The key is read only by the local server; do not put it in browser JavaScript. Change `GEMINI_MODEL` in `.env` if the model configured for your account changes.

## Deploy to Netlify

1. Push the project to GitHub without committing `.env`.
2. Import the repository in Netlify. The included `netlify.toml` publishes the project root and deploys `netlify/functions/chat.mjs`.
3. In the Netlify site's environment variables, add `GEMINI_API_KEY`. Optionally add `GEMINI_MODEL` with a model enabled for your key, for example `gemini-3.5-flash-lite`.
4. Trigger a new deploy. The `/api/chat` route is redirected to the Netlify Function.

Do not add the Gemini key to HTML, JavaScript, or Git. Netlify Functions use a regular JSON response; the chat client supports that and the streaming response used by the local server.
