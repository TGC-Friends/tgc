import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processFormData } from '../utils/dateUtils';
import { getWorksheet, findRowByValue, insertRow, getRowValues } from '../utils/googleSheets';
import { createCustomer, getCustomer } from '../utils/booqable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      custform_msg: 'not a POST request.',
      availcustID: null 
    });
  }

  try {
    const body = req.body || {};
    const formData = processFormData(body);
    const email = formData.emailfield || '';
    const phone = formData.phonenum || '';

    // Check if customer exists in Google Sheets
    let rowNum: number | null = null;
    
    if (email && email.includes('@')) {
      rowNum = await findRowByValue('booqable customer id', 1, email); // Column 1 is email
    }
    
    if (!rowNum && phone && phone.length >= 7) {
      rowNum = await findRowByValue('booqable customer id', 5, phone); // Column 5 is phone
    }

    let message = '';
    let availcustID: string | null = null;

    if (!email && !phone) {
      message = 'Invalid Email and Phone. Cannot Initiate Account.';
    } else if (rowNum) {
      // Customer exists in GS
      const rowValues = await getRowValues('booqable customer id', rowNum);
      availcustID = rowValues[1] || null; // Column 2 is custID
      const custNum = rowValues[3] || '';
      message = `Customer registered before. Updated record in GS under row ${rowNum}, Cust Number: #${custNum}, id: ${availcustID}`;
    } else {
      // Create new customer in Booqable
      const customerResult = await createCustomer(
        formData.bridename || '',
        email,
        phone
      );

      if ('error' in customerResult) {
        message = customerResult.error;
      } else {
        // Get full customer details
        const customer = await getCustomer(customerResult.number);
        
        if ('error' in customer) {
          message = customer.error;
        } else {
          availcustID = customer.id;
          
          // Insert into Google Sheets
          await insertRow('booqable customer id', [
            customer.email || '',
            customer.id,
            customer.name || '',
            customer.number,
            customer.properties?.find(p => p.type === 'Property::Phone')?.value || phone,
          ], 1);
          
          message = `Customer Acct created in Booqable under Cust Number: #${customer.number}, id: ${customer.id}`;
        }
      }
    }

    return res.status(200).json({
      custform_msg: message,
      availcustID,
    });
  } catch (error: any) {
    console.error('Error in processcustomeracct:', error);
    return res.status(500).json({
      custform_msg: `Error: ${error.message}`,
      availcustID: null,
    });
  }
}

