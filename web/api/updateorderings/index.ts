import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getWorksheet, findRowByValue, getRowValues, insertRow, updateRow } from '../utils/googleSheets';
import { getOrder } from '../utils/booqable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ orders_msg: 'not a POST request.' });
  }

  try {
    const body = req.body || {};
    const orderNum = (body.ordernum || '').trim();
    const orderId = (body.orderid || '').trim();

    if (!orderNum && !orderId) {
      return res.status(400).json({ 
        orders_msg: 'Order number or Order ID is required' 
      });
    }

    // Get order from Booqable
    const order = await getOrder(orderNum || orderId);

    if ('error' in order) {
      return res.status(200).json({ orders_msg: order.error });
    }

    const custID = order.customer_id;
    const orderID = order.id;
    const orderNumber = order.number || '';
    const status = order.status || '';

    // Extract dates from properties
    const weddingDate = order.properties?.find(p => p.name === 'Wedding Date')?.value?.replace('(TBC)', '').split('to')[0].trim() || '';
    const pwsDate = order.properties?.find(p => p.name === 'PWS Date')?.value?.replace('(TBC)', '').split('to')[0].trim() || '';
    const romDate = order.properties?.find(p => p.name === 'ROM Date')?.value?.replace('(TBC)', '').split('to')[0].trim() || '';
    
    const eventDate = weddingDate || pwsDate || romDate || '';
    
    // Extract order details from lines
    const orderDetails = order.lines?.map(l => l.title).join(', ') || '';

    // Check if order exists in Google Sheets
    let rowNum: number | null = null;
    
    if (orderID) {
      rowNum = await findRowByValue('booqable orders', 2, orderID); // Column 2 is orderID
    }
    
    if (!rowNum && orderNumber) {
      rowNum = await findRowByValue('booqable orders', 3, orderNumber); // Column 3 is orderNum
    }

    const rowData = [
      custID,
      orderID,
      orderNumber,
      status,
      orderDetails,
      weddingDate,
      pwsDate,
      romDate,
      eventDate,
    ];

    let message = '';

    if (rowNum) {
      // Update existing row
      await updateRow('booqable orders', rowNum, rowData);
      message = `Order updated in GS row ${rowNum}, for Order Number: ${orderNumber}, Order Id: ${orderID}`;
    } else {
      // Insert new row
      await insertRow('booqable orders', rowData, 1);
      message = `Order updated in GS row 2, for Order Number: ${orderNumber}, Order Id: ${orderID}`;
    }

    return res.status(200).json({ orders_msg: message });
  } catch (error: any) {
    console.error('Error in updateorderings:', error);
    return res.status(500).json({ 
      orders_msg: `Error: ${error.message}` 
    });
  }
}

