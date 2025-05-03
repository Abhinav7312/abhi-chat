import axios from 'axios';
import ollama from 'ollama';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (or specify your frontend URL, e.g., 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST requests
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      // Call the Ollama API
      const response = await ollama.chat({
        model: 'deepseek-r1:1.5b',
        messages: [{ role: 'user', content: message }],
      });

      // Extract the chatbot's response
      const chatbotResponse = response.message?.content.replace(/<think>[\s\S]*?<\/think>/g, '').trim() || "Sorry, I couldn't understand that.";

      // Send the response back to the client
      res.status(200).json({ response: chatbotResponse });
    } catch (error) {
      console.error('Error calling Ollama:', error);
      res.status(500).json({ error: 'Failed to get response from Ollama' });
    }
  } else {
    // Handle unsupported methods
    res.status(405).json({ error: 'Method not allowed' });
  }
}