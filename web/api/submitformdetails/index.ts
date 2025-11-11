import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processFormData } from '../utils/dateUtils';
import { getWorksheet, findRowByValue, insertRow, updateRow } from '../utils/googleSheets';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ tabletform_msg: 'not a POST request.' });
  }

  try {
    // Vercel automatically parses JSON, but handle both cases
    const body = req.body || {};
    const formData = processFormData(body);
    const email = formData.emailfield || '';

    // Check if email exists in Tablet Form sheet
    const emailRowNum = await findRowByValue('Tablet Form', 4, email); // Column 4 is email

    const dataRow = [
      formData.bridename || '',
      formData.groomname || '',
      formData.phonenum || '',
      formData.emailfield || '',
      formData.howdidyouhear || '',
      formData.eventdate1 || '',
      formData.eventtype1 || 'None',
      formData.eventvenue1 || '',
      formData.eventdate2 || '',
      formData.eventtype2 || 'None',
      formData.eventvenue2 || '',
      formData.eventdate3 || '',
      formData.eventtype3 || 'None',
      formData.eventvenue3 || '',
      formData.requiredoutfit || '',
      formData.noofgowns || '',
      formData.preferredoutfit || '',
      formData.preferredoutOthers || '',
      formData.preferredstyle || '',
      formData.preferredstyleOthers || '',
      formData.preferredNeckline || '',
      formData.preferredNeckOthers || '',
      formData.attendant || '',
      formData.additionalnotes || '',
    ];

    let message = '';

    if (!email || email === '') {
      message = 'Invalid Email address. Tablet Form not updated.';
    } else if (emailRowNum) {
      // Update existing row
      await updateRow('Tablet Form', emailRowNum, dataRow);
      message = 'Updated existing row in Tablet Form DB.';
    } else {
      // Insert new row
      await insertRow('Tablet Form', dataRow, 1);
      message = 'New data/row created in Tablet Form DB.';
    }

    return res.status(200).json({ tabletform_msg: message });
  } catch (error: any) {
    console.error('Error in submitformdetails:', error);
    return res.status(500).json({ 
      tabletform_msg: `Error: ${error.message}` 
    });
  }
}

