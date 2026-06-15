Vercel deployment and local testing for serverless NewsAPI proxy

Overview

This project includes a Vercel-compatible serverless function at `api/fetchNews.js` that proxies requests to NewsAPI. Store your NewsAPI key as a server environment variable so it is never exposed to browser clients.

Environment variable

- On Vercel set: `NEWS_API_KEY` (recommended) or `REACT_APP_NEWS_API`.

Deploy to Vercel

1. Install Vercel CLI (optional):

```bash
npm i -g vercel
```

2. From project root run:

```bash
vercel login
vercel --prod
```

3. In the Vercel dashboard for your project, add the environment variable `NEWS_API_KEY` with your NewsAPI key.

Local testing

Option A — Vercel dev (recommended for function parity):

```bash
npm i -g vercel
vercel dev
# This will serve the serverless function at http://localhost:3000/api/fetchNews
```

Option B — Use the included Express proxy server for local development (if you prefer):

```bash
# Ensure you have a .env file with REACT_APP_NEWS_API set
npm run server      # starts server at http://localhost:5000
npm start           # starts React dev server at http://localhost:3000
# OR run both
npm run dev
```

Notes

- Do not commit your `.env` file to git. Add `.env` to `.gitignore`.
- Vercel provides `fetch` in the runtime; the function uses `fetch` directly.
- The client should call `/api/fetchNews` (already wired in `src/components/News.js`).
