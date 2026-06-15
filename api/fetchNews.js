// Vercel serverless function: api/fetchNews.js
// This function proxies requests to NewsAPI so the API key remains on the server.
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }

    const { searchQuery, category = '', country = 'in', pageSize = '8', page = '1' } = req.query;
    const apiKey = process.env.NEWS_API_KEY || process.env.REACT_APP_NEWS_API;

    if (!apiKey) {
        return res.status(500).json({ status: 'error', message: 'Missing server-side NEWS API key. Set NEWS_API_KEY in Vercel environment variables.' });
    }

    const url = searchQuery && searchQuery !== 'undefined'
        ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`
        : `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Propagate NewsAPI failures cleanly
        if (!response.ok || data.status === 'error') {
            const message = data.message || 'NewsAPI request failed';
            return res.status(response.status || 500).json({ status: 'error', message });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}