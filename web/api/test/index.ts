import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ 
    message: 'API is working!',
    method: req.method,
    hasGoogleSheetsCreds: !!process.env.GOOGLE_SHEETS_CREDENTIALS,
    hasGoogleSheetId: !!process.env.GOOGLE_SHEET_ID,
    hasBooqableKey: !!process.env.BOOQABLE_API_KEY,
    timestamp: new Date().toISOString(),
  });
}

