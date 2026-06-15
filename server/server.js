const express = require('express');
const dotenv = require('dotenv');
const fetch = global.fetch;

if (!fetch) {
  console.warn('Global fetch is not available in this Node runtime. Install node 18+ or add node-fetch as a dependency.');
}

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/fetchNews', async (req, res) => {
  try {
    const { searchQuery, category, country, pageSize, page } = req.query;
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ status: 'error', message: 'Server missing API key' });
    }

    const url = searchQuery && searchQuery !== 'undefined'
      ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&pageSize=${pageSize || 10}&page=${page || 1}&apiKey=${apiKey}`
      : `https://newsapi.org/v2/top-headlines?country=${country || 'in'}&category=${category || ''}&pageSize=${pageSize || 10}&page=${page || 1}&apiKey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    return res.status(response.status === 200 ? 200 : 500).json(data);
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`News proxy server running on http://localhost:${PORT}`);
});
