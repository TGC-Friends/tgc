const BOOQABLE_API_KEY = process.env.BOOQABLE_API_KEY || '';
const BOOQABLE_BASE_URL = 'https://the-gown-connoisseur.booqable.com/api/1';

export interface BooqableCustomer {
  id: string;
  number: string;
  name: string;
  email: string;
  properties?: Array<{
    type: string;
    name: string;
    value: string;
  }>;
}

export interface BooqableOrder {
  id: string;
  number: string;
  customer_id: string;
  status: string;
  properties?: Array<{
    type: string;
    name: string;
    value: string;
  }>;
  lines?: Array<{
    title: string;
  }>;
}

export async function createCustomer(
  name: string,
  email: string,
  phone: string
): Promise<{ id: string; number: string } | { error: string }> {
  if (!email && !phone) {
    return { error: 'Warning: No account created due to missing/invalid email and phone number.' };
  }

  try {
    const response = await fetch(`${BOOQABLE_BASE_URL}/customers?api_key=${BOOQABLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: {
          name,
          email,
          properties_attributes: [
            {
              type: 'Property::Phone',
              name: 'Phone',
              value: phone,
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { error: `failed in customer creation phase: ${error}` };
    }

    const data = await response.json();
    const customer = data.customer;
    return {
      id: customer.id,
      number: customer.number,
    };
  } catch (error: any) {
    return { error: `failed in customer creation phase: ${error.message}` };
  }
}

export async function getCustomer(customerNumOrId: string): Promise<BooqableCustomer | { error: string }> {
  try {
    const response = await fetch(
      `${BOOQABLE_BASE_URL}/customers/${customerNumOrId}?api_key=${BOOQABLE_API_KEY}`
    );

    if (!response.ok) {
      return { error: `Failed to retrieve customer: ${response.statusText}` };
    }

    const data = await response.json();
    return data.customer;
  } catch (error: any) {
    return { error: `Failed to retrieve customer: ${error.message}` };
  }
}

export async function createOrder(
  customerId: string,
  weddingDate?: string,
  pwsDate?: string,
  romDate?: string
): Promise<BooqableOrder | { error: string }> {
  try {
    const properties: any[] = [];
    
    if (weddingDate) {
      properties.push({
        type: 'Property::TextField',
        name: 'Wedding Date',
        value: weddingDate,
        show_on: ['quote', 'invoice'],
      });
    }
    
    if (pwsDate) {
      properties.push({
        type: 'Property::TextField',
        name: 'PWS Date',
        value: pwsDate,
        show_on: ['quote', 'invoice'],
      });
    }
    
    if (romDate) {
      properties.push({
        type: 'Property::TextField',
        name: 'ROM Date',
        value: romDate,
        show_on: ['quote', 'invoice'],
      });
    }

    const response = await fetch(`${BOOQABLE_BASE_URL}/orders?api_key=${BOOQABLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order: {
          customer_id: customerId,
          properties_attributes: properties,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { error: `failed in order "Creation" status: ${error}` };
    }

    const data = await response.json();
    const order = data.order;

    // Save order as concept
    const saveResponse = await fetch(
      `${BOOQABLE_BASE_URL}/orders/${order.id}/concept?api_key=${BOOQABLE_API_KEY}`,
      {
        method: 'POST',
      }
    );

    if (!saveResponse.ok) {
      const error = await saveResponse.text();
      return { error: `failed in order "Saving" status: ${error}` };
    }

    const savedData = await saveResponse.json();
    return savedData.order;
  } catch (error: any) {
    return { error: `failed in order creation: ${error.message}` };
  }
}

export async function getOrder(orderNumOrId: string): Promise<BooqableOrder | { error: string }> {
  try {
    const response = await fetch(
      `${BOOQABLE_BASE_URL}/orders/${orderNumOrId}?api_key=${BOOQABLE_API_KEY}`
    );

    if (!response.ok) {
      return { error: `Failed to retrieve order: ${response.statusText}` };
    }

    const data = await response.json();
    return data.order;
  } catch (error: any) {
    return { error: `Failed to retrieve order: ${error.message}` };
  }
}

export async function getInvoice(invoiceNum: string): Promise<any | { error: string }> {
  try {
    const response = await fetch(
      `${BOOQABLE_BASE_URL}/invoices/${invoiceNum}?api_key=${BOOQABLE_API_KEY}`
    );

    if (!response.ok) {
      return { error: `Failed to retrieve invoice: ${response.statusText}` };
    }

    const data = await response.json();
    return data.invoice;
  } catch (error: any) {
    return { error: `Failed to retrieve invoice: ${error.message}` };
  }
}

