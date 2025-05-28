import React, { useState } from 'react';

const PartNumberInput = ({ onPriceFetched }) => {
  const [partNumber, setPartNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const getWholesalePrice = async (partNumber) => {
    await new Promise((res) => setTimeout(res, 500));
    return parseFloat((Math.random() * 50 + 10).toFixed(2));
  };

  const handleFetchPrice = async () => {
    if (!partNumber.trim()) return;
    setLoading(true);
    const price = await getWholesalePrice(partNumber.trim());
    setLoading(false);
    onPriceFetched(price);
  };

  return (
    <div>
      <label>Part Number:</label>
      <input
        value={partNumber}
        onChange={(e) => setPartNumber(e.target.value)}
        onBlur={handleFetchPrice}
        onKeyDown={(e) => e.key === 'Enter' && handleFetchPrice()}
        placeholder="e.g., WH13X10024"
      />
      {loading && <span> Looking up price...</span>}
    </div>
  );
};

export default PartNumberInput;
