import { useState } from 'react';

interface RetrieveSectionProps {
  onRetrieve: (email: string, phone: string) => Promise<void>;
}

function RetrieveSection({ onRetrieve }: RetrieveSectionProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isRetrieving, setIsRetrieving] = useState(false);

  const handleRetrieve = async () => {
    if (!email && !phone) return;
    setIsRetrieving(true);
    try {
      await onRetrieve(email, phone);
    } finally {
      setIsRetrieving(false);
    }
  };

  return (
    <div className="flex items-center px-3 mt-3">
      <div id="retrieve_status_div" className="flex mr-auto">
        <div className="mr-3">Retrieve Record by:</div>
      </div>
      <input
        id="emailinputbox"
        className="mr-2 border border-gray-300 px-2 py-1 rounded"
        type="text"
        placeholder="Email Add"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        id="phonenuminputbox"
        className="mr-2 border border-gray-300 px-2 py-1 rounded"
        type="tel"
        placeholder="Phone Num"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        id="retrieveformdetails_btn"
        onClick={handleRetrieve}
        disabled={isRetrieving || (!email && !phone)}
        className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white disabled:opacity-50"
      >
        {isRetrieving ? 'Retrieving...' : 'Retrieve Form Details'}
      </button>
    </div>
  );
}

export default RetrieveSection;

