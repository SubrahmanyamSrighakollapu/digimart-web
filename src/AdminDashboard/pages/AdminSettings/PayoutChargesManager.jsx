// PayoutChargesManager.jsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const PayoutChargesManager = () => {
  return (
    <>
      <style>{`
        .payout-charges-manager {
          padding: 24px 32px;
          background: #f5f7fa;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 15px;
          margin: 0 0 32px 0;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          padding: 32px;
          margin-bottom: 32px;
          border: 2px solid #3b82f6;
        }

        .inputs-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #334155;
        }

        .form-input {
          padding: 10px 14px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
        }

        .form-input:focus {
          border-color: rgba(75, 175, 71, 1);
          box-shadow: 0 0 0 3px rgba(75, 175, 71, 0.15);
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .guide-box {
          background: #fffbeb;
          border: 1px solid #fee2c7;
          border-radius: 8px;
          padding: 16px 20px;
          margin: 24px 0 32px 0;
          color: #c2410c;
          font-size: 14px;
          line-height: 1.5;
        }

        .guide-box strong {
          color: #9a3412;
        }

        .save-btn {
          width: 100%;
          padding: 12px;
          background: rgba(75, 175, 71, 1);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .save-btn:hover {
          background: rgba(65, 155, 61, 1);
        }

        /* Charge Structure Table */
        .table-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .charge-table {
          width: 100%;
          border-collapse: collapse;
        }

        .charge-table th,
        .charge-table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          color: #334155;
        }

        .charge-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .no-charges {
          padding: 80px 24px;
          text-align: center;
          color: #64748b;
        }

        .no-charges-title {
          font-size: 18px;
          font-weight: 600;
          color: #334155;
          margin: 0 0 8px 0;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
        }

        .action-btn:hover {
          color: #ef4444;
        }
      `}</style>

      <div className="payout-charges-manager">
        <h1 className="page-title">Payout Charges Manager</h1>
        <p className="page-subtitle">
          Configure payout transaction charges and fee structures
        </p>

        <div className="form-card">
          <div className="inputs-row">
            <div className="form-group">
              <label className="form-label">From Amount</label>
              <div>Starting Amount (₹)</div>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Starting Amount (₹)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">To Amount</label>
              <div>Ending Amount (₹)</div>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Ending Amount (₹)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Charge</label>
              <div>Transaction Charge (₹)</div>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Transaction Charge (₹)"
              />
            </div>
          </div>

          <div className="guide-box">
            <strong>Charge Structure Guide</strong><br />
            Define payout charges based on transaction amount ranges. 
            For example: ₹0-1000 = ₹5 charge, ₹1001-5000 = ₹10 charge.
          </div>

          <button className="save-btn">Save Changes</button>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Charge Structure Table</h2>
          </div>

          <table className="charge-table">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Charge</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="4">
                  <div className="no-charges">
                    <h3 className="no-charges-title">No Charges Defined</h3>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PayoutChargesManager;