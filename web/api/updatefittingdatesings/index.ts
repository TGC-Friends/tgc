import type { VercelRequest, VercelResponse } from '@vercel/node';
import { updateFittingDates } from '../utils/googleCalendar';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ fittingdates_msg: 'not a POST request.' });
  }

  try {
    const message = await updateFittingDates(30);
    return res.status(200).json({ fittingdates_msg: message });
  } catch (error: any) {
    console.error('Error in updatefittingdatesings:', error);
    return res.status(500).json({ 
      fittingdates_msg: `Error: ${error.message}` 
    });
  }
}

