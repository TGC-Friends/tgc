import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processFormData, updateEventDict } from '../utils/dateUtils';
import { getWorksheet, findRowByValue, getRowValues, insertRow } from '../utils/googleSheets';
import { createOrder } from '../utils/booqable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ orders_msg: 'not a POST request.' });
  }

  try {
    const body = req.body || {};
    const formData = processFormData(body);
    const custId = formData.cust_id || '';

    if (!custId) {
      return res.status(400).json({ 
        orders_msg: 'Customer ID is required' 
      });
    }

    // Build event dictionary
    let eventDict = {
      weddingdate: null as string | null,
      PWS: null as string | null,
      ROMdate: null as string | null,
    };

    eventDict = updateEventDict(eventDict, formData, 1);
    eventDict = updateEventDict(eventDict, formData, 2);
    eventDict = updateEventDict(eventDict, formData, 3);

    // Check if order exists in Google Sheets
    const orderRowNum = await findRowByValue('booqable orders', 1, custId); // Column 1 is custID

    let message = '';

    if (orderRowNum) {
      // Order exists
      const rowValues = await getRowValues('booqable orders', orderRowNum);
      const orderNum = rowValues[2] || '';
      const orderID = rowValues[1] || '';
      message = `Latest Order in GS at row ${orderRowNum}, Order Number: ${orderNum} Order Id: ${orderID}`;
    } else {
      // Create new order
      const orderResult = await createOrder(
        custId,
        eventDict.weddingdate || undefined,
        eventDict.PWS || undefined,
        eventDict.ROMdate || undefined
      );

      if ('error' in orderResult) {
        message = orderResult.error;
      } else {
        // Insert into Google Sheets
        const eventDate = eventDict.weddingdate || eventDict.PWS || eventDict.ROMdate || '';
        
        await insertRow('booqable orders', [
          custId,
          orderResult.id,
          orderResult.number || '',
          orderResult.status || '',
          '', // order details
          eventDict.weddingdate || '',
          eventDict.PWS || '',
          eventDict.ROMdate || '',
          eventDate,
        ], 1);

        message = `New Order Created under #${orderResult.number}, Order id: ${orderResult.id}`;
      }
    }

    return res.status(200).json({ orders_msg: message });
  } catch (error: any) {
    console.error('Error in processorders:', error);
    return res.status(500).json({ 
      orders_msg: `Error: ${error.message}` 
    });
  }
}

