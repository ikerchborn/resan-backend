import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple ping endpoint so that hitting the root `/api` of the Vercel deployment
// returns a friendly message instead of a 404. This helps you verify quickly
// that the backend is running and that environment variables are loaded.
//
// Access example:
//   https://<your-vercel-project>.vercel.app/api
//   → { "status": "ok", "message": "Backend funcionando" }
//
export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ status: 'ok', message: 'Backend funcionando' });
}
