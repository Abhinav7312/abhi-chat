// pages/api/gif.js
import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (or specify your frontend URL, e.g., 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.query.q; // The search query (e.g., "happy", "sad")
  
  try {
    // Fetch GIFs from Giphy API
    const response = await axios.get('https://api.giphy.com/v2/emoji', {
      params: {
        api_key: 'SvnxAxrisCp32dMcT6zLknDtSi5QLIpx',
        q: query,
        limit: 5, // Fetch only 1 GIF
      },
    });
    // Extract the GIF URL
    const gifUrl = response.data.data.map(item => item.images.original.url);
    res.status(200).json({ gifUrl });
  } catch (error) {
    console.error('Error fetching GIF:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}