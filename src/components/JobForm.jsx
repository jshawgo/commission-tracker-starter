import React, { useState, useEffect } from 'react';
import PartNumberInput from './PartNumberInput';

const JobForm = () => {
  const [wholesale, setWholesale] = useState('');
  const [retail, setRetail] = useState('');
  const [labor, setLabor] = useState('');
  const [shipping, setShipping] = useState('0');
  const [commissionRate, setCommissionRate] = useState(() => {
    return parseFloat(localStorage.getItem('commissionRate') || 25);
  });
  const [commission, setCommission] = useState(null);
  const [jobLog, setJobLog] = useState(() => {
    return JSON.parse(localStorage.getItem('jobLog') || '[]');
  });

  useEffect(() => {
    localStorage.setItem('jobLog', JSON.stringify(jobLog));
  }, [jobLog]);

  const handleRateChange = (e) => {
    const value = parseFloat(e.target.value);
    setCommissionRate(value);
    localStorage.setItem('commissionRate', value);
  };

  const calculateCommission = () => {
    const partProfit = parseFloat(retail) - parseFloat(wholesale);
    const total = partProfit + parseFloat(labor) + parseFloat(shipping);
    const rate = commissionRate / 100;
    const commissionValue = parseFloat((rate * total).toFixed(2));
    setCommission(commissionValue);

    const newJob = {
      date: new Date().toISOString(),
      wholesale: parseFloat(wholesale),
      retail: parseFloat(retail),
      labor: parseFloat(labor),
      shipping: parseFloat(shipping),
      commission: commissionValue
    };
    setJobLog([...jobLog, newJob]);
  };

  const resetLog = () => {
    setJobLog([]);
    localStorage.removeItem('jobLog');
  };

  const exportCSV = () => {
    const headers = ['Date', 'Wholesale', 'Retail', 'Labor', 'Shipping', 'Commission'];
    const rows = jobLog.map(job =>
      [job.date, job.wholesale, job.retail, job.labor, job.shipping, job.commission].join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'commission_log.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalCommission = jobLog.reduce((sum, job) => sum + job.commission, 0).toFixed(2);

  return (
    <div>
      <h2>Commission Calculator</h2>
      <PartNumberInput onPriceFetched={(price) => setWholesale(price)} />

      <div style={{ marginTop: '10px' }}>
        <label>Wholesale Price: ${wholesale}</label>
      </div>

      <label>Commission Rate (%):</label>
      <input
        type="number"
        value={commissionRate}
        onChange={handleRateChange}
        step="0.1"
        min="0"
        max="100"
      /><br />

      <label>Retail Price:</label>
      <input value={retail} onChange={(e) => setRetail(e.target.value)} /><br />

      <label>Labor Billed:</label>
      <input value={labor} onChange={(e) => setLabor(e.target.value)} /><br />

      <label>Shipping:</label>
      <select value={shipping} onChange={(e) => setShipping(e.target.value)}>
        <option value="0">None</option>
        <option value="14.99">Standard ($14.99)</option>
        <option value="80">Oversized ($80.00)</option>
      </select><br /><br />

      <button onClick={calculateCommission}>Calculate</button>
      <button onClick={resetLog} style={{ marginLeft: '10px' }}>Reset All Logs</button>
      <button onClick={exportCSV} style={{ marginLeft: '10px' }}>Export CSV</button>

      {commission !== null && <p>Last Commission: ${commission}</p>}
      <p><strong>Total Logged Commission:</strong> ${totalCommission}</p>

      <h3>Job Log</h3>
      <ul>
        {jobLog.map((job, index) => (
          <li key={index}>
            {new Date(job.date).toLocaleString()}: ${job.commission} from ${job.retail} retail / ${job.wholesale} wholesale / ${job.labor} labor / ${job.shipping} shipping
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobForm;
