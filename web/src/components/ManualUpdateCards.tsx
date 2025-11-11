import { useState } from 'react';

interface ManualUpdateCardsProps {
  onUpdateCustomer: (customerNum: string) => Promise<string>;
  onUpdateOrder: (orderNum: string, orderId: string) => Promise<string>;
  onUpdateInvoice: (invoiceNum: string) => Promise<string>;
  onUpdateFittingDates: () => Promise<string>;
}

function ManualUpdateCards({
  onUpdateCustomer,
  onUpdateOrder,
  onUpdateInvoice,
  onUpdateFittingDates,
}: ManualUpdateCardsProps) {
  const [customerNum, setCustomerNum] = useState('');
  const [orderNum, setOrderNum] = useState('');
  const [orderId, setOrderId] = useState('');
  const [invoiceNum, setInvoiceNum] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [invoiceMessage, setInvoiceMessage] = useState('');
  const [fittingDatesMessage, setFittingDatesMessage] = useState('');
  const [isLoading, setIsLoading] = useState({
    customer: false,
    order: false,
    invoice: false,
    fittingDates: false,
  });

  const handleUpdateCustomer = async () => {
    if (!customerNum) return;
    setIsLoading(prev => ({ ...prev, customer: true }));
    setCustomerMessage('Retrieving Customer Info from Booqable...');
    const message = await onUpdateCustomer(customerNum);
    setCustomerMessage(message);
    setIsLoading(prev => ({ ...prev, customer: false }));
  };

  const handleUpdateOrder = async () => {
    if (!orderNum && !orderId) return;
    setIsLoading(prev => ({ ...prev, order: true }));
    setOrderMessage('Retrieving Order from Booqable...');
    const message = await onUpdateOrder(orderNum, orderId);
    setOrderMessage(message);
    setIsLoading(prev => ({ ...prev, order: false }));
  };

  const handleUpdateInvoice = async () => {
    if (!invoiceNum) return;
    setIsLoading(prev => ({ ...prev, invoice: true }));
    setInvoiceMessage('Retrieving Invoice from Booqable...');
    const message = await onUpdateInvoice(invoiceNum);
    setInvoiceMessage(message);
    setIsLoading(prev => ({ ...prev, invoice: false }));
  };

  const handleUpdateFittingDates = async () => {
    setIsLoading(prev => ({ ...prev, fittingDates: true }));
    setFittingDatesMessage('Retrieving Google Calendar Data...');
    const message = await onUpdateFittingDates();
    setFittingDatesMessage(message);
    setIsLoading(prev => ({ ...prev, fittingDates: false }));
  };

  return (
    <>
      {/* Update Manual Customer by Number */}
      <div className="card border border-gray-300 rounded mb-2">
        <div className="card-header flex items-center pr-3 p-3 bg-gray-100 border-b border-gray-300">
          <span className="mr-auto">Update GS Customer Details Manually:</span>
          <input
            id="customernuminputbox"
            className="mr-2 border border-gray-300 px-2 py-1 rounded"
            type="number"
            placeholder="Customer Number"
            value={customerNum}
            onChange={(e) => setCustomerNum(e.target.value)}
          />
          <button
            id="gs_updatecustomer_btn"
            onClick={handleUpdateCustomer}
            disabled={isLoading.customer || !customerNum}
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading.customer ? 'Updating...' : 'Update Customer in GS'}
          </button>
        </div>
        {customerMessage && (
          <div className="card-body p-3">
            <span>{customerMessage}</span>
          </div>
        )}
      </div>

      {/* Update Manual Order */}
      <div className="card border border-gray-300 rounded mb-2">
        <div className="card-header flex items-center pr-3 p-3 bg-gray-100 border-b border-gray-300">
          <span className="mr-auto">Update GS Order Details Manually:</span>
          <input
            id="ordernuminputbox"
            className="mr-2 border border-gray-300 px-2 py-1 rounded"
            type="number"
            placeholder="Order Number"
            value={orderNum}
            onChange={(e) => setOrderNum(e.target.value)}
          />
          <input
            id="orderidinputbox"
            className="mr-2 border border-gray-300 px-2 py-1 rounded"
            type="text"
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button
            id="gs_updateorder_btn"
            onClick={handleUpdateOrder}
            disabled={isLoading.order || (!orderNum && !orderId)}
            className="px-4 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            {isLoading.order ? 'Updating...' : 'Update Order in GS'}
          </button>
        </div>
        {orderMessage && (
          <div className="card-body p-3">
            <span>{orderMessage}</span>
          </div>
        )}
      </div>

      {/* Update Manual Invoice */}
      <div className="card border border-gray-300 rounded mb-2">
        <div className="card-header flex items-center pr-3 p-3 bg-gray-100 border-b border-gray-300">
          <span className="mr-auto">Update GS Invoice Details Manually</span>
          <input
            id="invoicenuminputbox"
            className="mr-2 border border-gray-300 px-2 py-1 rounded"
            type="text"
            placeholder="Invoice Number"
            value={invoiceNum}
            onChange={(e) => setInvoiceNum(e.target.value)}
          />
          <button
            id="gs_updateinvoice_btn"
            onClick={handleUpdateInvoice}
            disabled={isLoading.invoice || !invoiceNum}
            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading.invoice ? 'Updating...' : 'Update Invoice in GS'}
          </button>
        </div>
        {invoiceMessage && (
          <div className="card-body p-3">
            <span>{invoiceMessage}</span>
          </div>
        )}
      </div>

      {/* Update Wix Dates */}
      <div className="card border border-gray-300 rounded mb-2">
        <div className="card-header flex items-center pr-3 p-3 bg-gray-100 border-b border-gray-300">
          <span>Update Fitting Dates in GS</span>
          <button
            id="gs_updatefittingdates_btn"
            onClick={handleUpdateFittingDates}
            disabled={isLoading.fittingDates}
            className="ml-auto px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading.fittingDates ? 'Updating...' : 'Update Fitting Dates in GS'}
          </button>
        </div>
        {fittingDatesMessage && (
          <div className="card-body p-3">
            <span>{fittingDatesMessage}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default ManualUpdateCards;

