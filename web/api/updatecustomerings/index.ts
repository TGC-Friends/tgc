import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getWorksheet, findRowByValue, insertRow, getRowValues } from '../utils/googleSheets';
import { getCustomer } from '../utils/booqable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ customer_msg: 'not a POST request.' });
  }

  try {
    const body = req.body || {};
    const customerNum = (body.customernum || '').trim();

    if (!customerNum) {
      return res.status(400).json({ 
        customer_msg: 'Customer number is required' 
      });
    }

    // Get customer from Booqable
    const customer = await getCustomer(customerNum);

    if ('error' in customer) {
      return res.status(200).json({ customer_msg: customer.error });
    }

    const email = customer.email || '';
    const phone = customer.properties?.find(p => p.type === 'Property::Phone')?.value || '';

    // Check if exists in Google Sheets
    let rowNum: number | null = null;
    
    if (email && email.includes('@')) {
      rowNum = await findRowByValue('booqable customer id', 1, email);
    }
    
    if (!rowNum && phone && phone.length >= 7) {
      rowNum = await findRowByValue('booqable customer id', 5, phone);
    }

    let message = '';

    if (!rowNum) {
      // Insert new row
      await insertRow('booqable customer id', [
        email,
        customer.id,
        customer.name || '',
        customer.number,
        phone,
      ], 1);
      message = `Customer #${customer.number}, id: ${customer.id} exist in Booqable and created in GS in row 2`;
    } else {
      // Update existing row
      await insertRow('booqable customer id', [
        email,
        customer.id,
        customer.name || '',
        customer.number,
        phone,
      ], rowNum);
      message = `Customer #${customer.number}, id: ${customer.id} updated in GS at row ${rowNum}`;
    }

    return res.status(200).json({ customer_msg: message });
  } catch (error: any) {
    console.error('Error in updatecustomerings:', error);
    return res.status(500).json({ 
      customer_msg: `Error: ${error.message}` 
    });
  }
}

