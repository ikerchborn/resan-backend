import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAI } from 'openai';

// Allowed origin for CORS (defínelo en variables de entorno)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '*';

// OpenAI client (requiere OPENAI_API_KEY)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Only POST allowed' });

  const { messages } = (req.body as any) ?? {};
  if (!Array.isArray(messages))
    return res
      .status(400)
      .json({ error: 'Bad format: messages must be array' });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-3.5-turbo',
      messages,
    });
    return res
      .status(200)
      .json({ text: completion.choices[0].message?.content ?? '' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'OpenAI error' });
  }
}