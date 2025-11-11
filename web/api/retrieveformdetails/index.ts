import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getWorksheet, findRowByValue, getRowValues } from '../utils/googleSheets';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ retrieve_msg: 'not a POST request.' });
  }

  try {
    const body = req.body || {};
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();

    let rowNum: number | null = null;

    // Search by email first
    if (email && email.includes('@')) {
      rowNum = await findRowByValue('Tablet Form', 4, email);
    }

    // If not found, search by phone
    if (!rowNum && phone && phone.length >= 7) {
      rowNum = await findRowByValue('Tablet Form', 3, phone);
    }

    if (!rowNum) {
      return res.status(200).json({ 
        error: 'could not find email or phone in history sheet.' 
      });
    }

    // Get row values
    const rowValues = await getRowValues('Tablet Form', rowNum);
    
    // Pad to 24 columns if needed
    while (rowValues.length < 24) {
      rowValues.push('');
    }

    const formData = {
      bridename: rowValues[0] || '',
      groomname: rowValues[1] || '',
      phonenum: rowValues[2] || '',
      emailfield: rowValues[3] || '',
      howdidyouhear: rowValues[4] || '',
      eventdate1: rowValues[5] || '',
      eventtype1: rowValues[6] || 'None',
      eventvenue1: rowValues[7] || '',
      eventdate2: rowValues[8] || '',
      eventtype2: rowValues[9] || 'None',
      eventvenue2: rowValues[10] || '',
      eventdate3: rowValues[11] || '',
      eventtype3: rowValues[12] || 'None',
      eventvenue3: rowValues[13] || '',
      requiredoutfit: rowValues[14] || '',
      noofgowns: rowValues[15] || '',
      preferredoutfit: rowValues[16] || '',
      preferredoutOthers: rowValues[17] || '',
      preferredstyle: rowValues[18] || '',
      preferredstyleOthers: rowValues[19] || '',
      preferredNeckline: rowValues[20] || '',
      preferredNeckOthers: rowValues[21] || '',
      attendant: rowValues[22] || '',
      additionalnotes: rowValues[23] || '',
    };

    return res.status(200).json(formData);
  } catch (error: any) {
    console.error('Error in retrieveformdetails:', error);
    return res.status(500).json({ 
      error: `Error retrieving form: ${error.message}` 
    });
  }
}

