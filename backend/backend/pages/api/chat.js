import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      { inputs: message },
      {
        headers: {
          Authorization: `Bearer YOUR_HUGGING_FACE_API_KEY`,
        },
      }
    );

    const reply = response.data.generated_text;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}