import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Rephrase the following text while keeping the meaning intact.' },
        { role: 'user', content: text },
      ],
    });

    const rephrasedText = response.choices[0].message.content;
    res.status(200).json({ rephrasedText });
  } catch (error) {
    console.error('Error rephrasing text:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}