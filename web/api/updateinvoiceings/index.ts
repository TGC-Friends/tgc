import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getWorksheet, findRowByValue, getRowValues, insertRow, updateRow } from '../utils/googleSheets';
import { getInvoice } from '../utils/booqable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ invoice_msg: 'not a POST request.' });
  }

  try {
    const body = req.body || {};
    const invoiceNum = (body.invoicenum || '').trim();

    if (!invoiceNum) {
      return res.status(400).json({ 
        invoice_msg: 'Invoice number is required' 
      });
    }

    // Get invoice from Booqable
    const invoice = await getInvoice(invoiceNum);

    if ('error' in invoice) {
      return res.status(200).json({ invoice_msg: invoice.error });
    }

    const customerId = invoice.customer_id || '';
    const docId = invoice.id || '';
    const name = invoice.name || '';
    const invoiceNumber = String(invoice.number || '');
    const orderID = invoice.order_id || '';
    const invoiceFullNum = invoice.title || '';
    const docType = invoice.type || '';

    // Check if invoice exists in Google Sheets
    const rowNum = await findRowByValue('booqable documents', 2, docId); // Column 2 is docID

    const rowData = [
      customerId,
      docId,
      name,
      parseInt(invoiceNumber) || 0,
      orderID,
      invoiceFullNum,
      docType,
    ];

    let message = '';

    if (rowNum) {
      // Update existing row
      await updateRow('booqable documents', rowNum, rowData);
      message = `Order updated in GS row ${rowNum}, for Invoice Number: ${invoiceFullNum}, Document Id: ${docId}`;
    } else {
      // Insert new row
      await insertRow('booqable documents', rowData, 1);
      message = `Order updated in GS row 2, for Invoice Number: ${invoiceFullNum}, Document Id: ${docId}`;
    }

    return res.status(200).json({ invoice_msg: message });
  } catch (error: any) {
    console.error('Error in updateinvoiceings:', error);
    return res.status(500).json({ 
      invoice_msg: `Error: ${error.message}` 
    });
  }
}

