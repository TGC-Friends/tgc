import { useState } from 'react';

interface StatusCardsProps {
  accountMessage: string;
  orderMessage: string;
}

function StatusCards({ accountMessage, orderMessage }: StatusCardsProps) {
  const [accountExpanded, setAccountExpanded] = useState(false);
  const [orderExpanded, setOrderExpanded] = useState(false);

  return (
    <>
      {/* Account Details Card */}
      <div className="card border border-gray-300 rounded mb-2">
        <div className="card-header flex justify-between items-center pr-2 p-3 bg-gray-100 border-b border-gray-300">
          <span>Account Details</span>
        </div>
        {accountMessage && (
          <div className={`card-body p-3 ${accountExpanded ? '' : 'hidden'}`}>
            <span>{accountMessage}</span>
          </div>
        )}
        {accountMessage && (
          <button
            onClick={() => setAccountExpanded(!accountExpanded)}
            className="w-full text-left p-2 text-sm text-blue-600 hover:bg-gray-50"
          >
            {accountExpanded ? 'Hide' : 'Show'} Details
          </button>
        )}
      </div>

      {/* Order Details Card */}
      <div className="card border border-gray-300 rounded mb-2">
        <div className="card-header flex justify-between items-center pr-2 p-3 bg-gray-100 border-b border-gray-300">
          <span>Order Details</span>
        </div>
        {orderMessage && (
          <div className={`card-body p-3 ${orderExpanded ? '' : 'hidden'}`}>
            <span>{orderMessage}</span>
          </div>
        )}
        {orderMessage && (
          <button
            onClick={() => setOrderExpanded(!orderExpanded)}
            className="w-full text-left p-2 text-sm text-blue-600 hover:bg-gray-50"
          >
            {orderExpanded ? 'Hide' : 'Show'} Details
          </button>
        )}
      </div>
    </>
  );
}

export default StatusCards;

