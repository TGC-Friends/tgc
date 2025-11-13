interface StatusCardsProps {
  accountMessage: string;
  orderMessage: string;
}

function StatusCards({ accountMessage, orderMessage }: StatusCardsProps) {
  return (
    <>
      {/* Account Details Card */}
      <div className="card border border-gray-300 rounded mb-2">
        <div className="card-header flex justify-between items-center pr-2 p-3 bg-gray-100 border-b border-gray-300">
          <span>Account Details</span>
        </div>
        {accountMessage && (
          <div className="card-body p-3">
            <span>{accountMessage}</span>
          </div>
        )}
      </div>

      {/* Order Details Card */}
      <div className="card border border-gray-300 rounded mb-2">
        <div className="card-header flex justify-between items-center pr-2 p-3 bg-gray-100 border-b border-gray-300">
          <span>Order Details</span>
        </div>
        {orderMessage && (
          <div className="card-body p-3">
            <span>{orderMessage}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default StatusCards;

