import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processFormData, updateEventDict } from './utils/dateUtils.js';
import { findRowByValue, getRowValues, insertRow, updateRow } from './utils/googleSheets.js';
import { createCustomer, getCustomer, createOrder, getOrder, getInvoice } from './utils/booqable.js';
import { updateFittingDates } from './utils/googleCalendar.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Get the endpoint from query parameter or path
  // Support both /api?endpoint=xxx and /api/xxx formats
  let endpoint = req.query.endpoint as string;
  
  if (!endpoint && req.url) {
    // Try to extract from path: /api/submitformdetails -> submitformdetails
    const pathMatch = req.url.match(/^\/api\/([^?]+)/);
    if (pathMatch) {
      endpoint = pathMatch[1];
    }
  }

  // Test endpoint
  if (endpoint === 'test' || !endpoint) {
    return res.json({ 
      message: 'API is working!',
      method: req.method,
      endpoint: endpoint || 'none',
      hasGoogleSheetsCreds: !!process.env.GOOGLE_SHEETS_CREDENTIALS,
      hasGoogleSheetId: !!process.env.GOOGLE_SHEET_ID,
      hasBooqableKey: !!process.env.BOOQABLE_API_KEY,
      timestamp: new Date().toISOString(),
    });
  }

  // Route to appropriate handler
  switch (endpoint) {
    case 'submitformdetails':
      return handleSubmitFormDetails(req, res);
    case 'processcustomeracct':
      return handleProcessCustomerAccount(req, res);
    case 'processorders':
      return handleProcessOrders(req, res);
    case 'retrieveformdetails':
      return handleRetrieveFormDetails(req, res);
    case 'updatecustomerings':
      return handleUpdateCustomerInGS(req, res);
    case 'updateorderings':
      return handleUpdateOrderInGS(req, res);
    case 'updateinvoiceings':
      return handleUpdateInvoiceInGS(req, res);
    case 'updatefittingdatesings':
      return handleUpdateFittingDatesInGS(req, res);
    default:
      return res.status(404).json({ error: `Endpoint '${endpoint}' not found. Available: submitformdetails, processcustomeracct, processorders, retrieveformdetails, updatecustomerings, updateorderings, updateinvoiceings, updatefittingdatesings` });
  }
}

// Submit Form Details
async function handleSubmitFormDetails(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ tabletform_msg: 'not a POST request.' });
  }

  try {
    const body = req.body || {};
    const formData = processFormData(body);
    const email = formData.emailfield || '';

    const emailRowNum = await findRowByValue('Tablet Form', 4, email);

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
      await updateRow('Tablet Form', emailRowNum, dataRow);
      message = 'Updated existing row in Tablet Form DB.';
    } else {
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

// Process Customer Account
async function handleProcessCustomerAccount(req: VercelRequest, res: VercelResponse) {
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

    let rowNum: number | null = null;
    
    if (email && email.includes('@')) {
      rowNum = await findRowByValue('booqable customer id', 1, email);
    }
    
    if (!rowNum && phone && phone.length >= 7) {
      rowNum = await findRowByValue('booqable customer id', 5, phone);
    }

    let message = '';
    let availcustID: string | null = null;

    if (!email && !phone) {
      message = 'Invalid Email and Phone. Cannot Initiate Account.';
    } else if (rowNum) {
      const rowValues = await getRowValues('booqable customer id', rowNum);
      availcustID = rowValues[1] || null;
      const custNum = rowValues[3] || '';
      message = `Customer registered before. Updated record in GS under row ${rowNum}, Cust Number: #${custNum}, id: ${availcustID}`;
    } else {
      const customerResult = await createCustomer(
        formData.bridename || '',
        email,
        phone
      );

      if ('error' in customerResult) {
        message = customerResult.error;
      } else {
        const customer = await getCustomer(customerResult.number);
        
        if ('error' in customer) {
          message = customer.error;
        } else {
          availcustID = customer.id;
          
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

// Process Orders
async function handleProcessOrders(req: VercelRequest, res: VercelResponse) {
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

    let eventDict = {
      weddingdate: null as string | null,
      PWS: null as string | null,
      ROMdate: null as string | null,
    };

    eventDict = updateEventDict(eventDict, formData, 1);
    eventDict = updateEventDict(eventDict, formData, 2);
    eventDict = updateEventDict(eventDict, formData, 3);

    const orderRowNum = await findRowByValue('booqable orders', 1, custId);

    let message = '';

    if (orderRowNum) {
      const rowValues = await getRowValues('booqable orders', orderRowNum);
      const orderNum = rowValues[2] || '';
      const orderID = rowValues[1] || '';
      message = `Latest Order in GS at row ${orderRowNum}, Order Number: ${orderNum} Order Id: ${orderID}`;
    } else {
      const orderResult = await createOrder(
        custId,
        eventDict.weddingdate || undefined,
        eventDict.PWS || undefined,
        eventDict.ROMdate || undefined
      );

      if ('error' in orderResult) {
        message = orderResult.error;
      } else {
        const eventDate = eventDict.weddingdate || eventDict.PWS || eventDict.ROMdate || '';
        
        // Columns 6, 7, 8, 9 are date columns (weddingDate, pwsDate, romDate, eventDate)
        await insertRow('booqable orders', [
          custId,
          orderResult.id,
          orderResult.number || '',
          orderResult.status || '',
          '',
          eventDict.weddingdate || '',
          eventDict.PWS || '',
          eventDict.ROMdate || '',
          eventDate,
        ], 1, [6, 7, 8, 9]);

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

// Retrieve Form Details
async function handleRetrieveFormDetails(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ retrieve_msg: 'not a POST request.' });
  }

  try {
    const body = req.body || {};
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();

    let rowNum: number | null = null;

    if (email && email.includes('@')) {
      rowNum = await findRowByValue('Tablet Form', 4, email);
    }

    if (!rowNum && phone && phone.length >= 7) {
      rowNum = await findRowByValue('Tablet Form', 3, phone);
    }

    if (!rowNum) {
      return res.status(200).json({ 
        error: 'could not find email or phone in history sheet.' 
      });
    }

    const rowValues = await getRowValues('Tablet Form', rowNum);
    
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

// Update Customer in GS
async function handleUpdateCustomerInGS(req: VercelRequest, res: VercelResponse) {
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

    const customer = await getCustomer(customerNum);

    if ('error' in customer) {
      return res.status(200).json({ customer_msg: customer.error });
    }

    const email = customer.email || '';
    const phone = customer.properties?.find(p => p.type === 'Property::Phone')?.value || '';

    let rowNum: number | null = null;
    
    if (email && email.includes('@')) {
      rowNum = await findRowByValue('booqable customer id', 1, email);
    }
    
    if (!rowNum && phone && phone.length >= 7) {
      rowNum = await findRowByValue('booqable customer id', 5, phone);
    }

    let message = '';

    if (!rowNum) {
      await insertRow('booqable customer id', [
        email,
        customer.id,
        customer.name || '',
        customer.number,
        phone,
      ], 1);
      message = `Customer #${customer.number}, id: ${customer.id} exist in Booqable and created in GS in row 2`;
    } else {
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

// Update Order in GS
async function handleUpdateOrderInGS(req: VercelRequest, res: VercelResponse) {
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

    const order = await getOrder(orderNum || orderId);

    if ('error' in order) {
      return res.status(200).json({ orders_msg: order.error });
    }

    const custID = order.customer_id;
    const orderID = order.id;
    const orderNumber = order.number || '';
    const status = order.status || '';

    const weddingDate = order.properties?.find(p => p.name === 'Wedding Date')?.value?.replace('(TBC)', '').split('to')[0].trim() || '';
    const pwsDate = order.properties?.find(p => p.name === 'PWS Date')?.value?.replace('(TBC)', '').split('to')[0].trim() || '';
    const romDate = order.properties?.find(p => p.name === 'ROM Date')?.value?.replace('(TBC)', '').split('to')[0].trim() || '';
    
    const eventDate = weddingDate || pwsDate || romDate || '';
    
    const orderDetails = order.lines?.map(l => l.title).join(', ') || '';

    let rowNum: number | null = null;
    
    if (orderID) {
      rowNum = await findRowByValue('booqable orders', 2, orderID);
    }
    
    if (!rowNum && orderNumber) {
      rowNum = await findRowByValue('booqable orders', 3, orderNumber);
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

    // Columns 6, 7, 8, 9 are date columns (weddingDate, pwsDate, romDate, eventDate)
    const dateColumns = [6, 7, 8, 9];
    
    if (rowNum) {
      await updateRow('booqable orders', rowNum, rowData, dateColumns);
      message = `Order updated in GS row ${rowNum}, for Order Number: ${orderNumber}, Order Id: ${orderID}`;
    } else {
      await insertRow('booqable orders', rowData, 1, dateColumns);
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

// Update Invoice in GS
async function handleUpdateInvoiceInGS(req: VercelRequest, res: VercelResponse) {
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

    const rowNum = await findRowByValue('booqable documents', 2, docId);

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
      await updateRow('booqable documents', rowNum, rowData);
      message = `Order updated in GS row ${rowNum}, for Invoice Number: ${invoiceFullNum}, Document Id: ${docId}`;
    } else {
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

// Update Fitting Dates in GS
async function handleUpdateFittingDatesInGS(req: VercelRequest, res: VercelResponse) {
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

