// HoldFunds.jsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const HoldFunds = () => {
  const [holdDuration, setHoldDuration] = useState('untilRelease'); // 'untilRelease' or 'duration'

  return (
    <>
      <style>{`
        .hold-funds-page {
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

        .filter-section {
          background: white;
          border-radius: 12px;
          padding: 24px 32px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          margin-bottom: 40px;
        }

        .filter-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 24px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px 32px;
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

        .form-input,
        .form-select {
          padding: 10px 14px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: rgba(75, 175, 71, 1);
          box-shadow: 0 0 0 3px rgba(75, 175, 71, 0.15);
        }

        .form-input::placeholder,
        .form-select option:disabled {
          color: #94a3b8;
        }

        .balance-display {
          font-size: 16px;
          font-weight: 600;
          color: #10b981;
        }

        .toggle-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 12px 0;
        }

        .toggle-label {
          font-size: 14px;
          color: #334155;
        }

        .toggle {
          position: relative;
          width: 48px;
          height: 24px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #10b981;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        .buttons-row {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 32px;
        }

        .btn {
          padding: 10px 28px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
          border: none;
        }

        .btn-hold {
          background: rgba(75, 175, 71, 1);
          color: white;
          border: none;
        }

        /* History Table */
        .history-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .history-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .history-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
        }

        .history-table th,
        .history-table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          color: #334155;
        }

        .history-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .status-active {
          background: #d1fae5;
          color: #065f46;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-released {
          background: #e5e7eb;
          color: #374151;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .action-btn {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
        }

        .release-btn {
          background: #ef4444;
          color: white;
        }
      `}</style>

      <div className="hold-funds-page">
        <h1 className="page-title">Hold Funds Users</h1>

        <div className="filter-section">
          <h2 className="filter-title">Search & Filter Users</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">User name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter User name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Balance</label>
              <div className="balance-display">₹14,000</div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Hold</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Reason for Hold"
              />
            </div>

            <div className="form-group">
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter User ID"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hold Amount</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Hold Amount"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hold Duration</label>
              <div className="toggle-wrapper">
                <label className="toggle-label">Until Release</label>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={holdDuration === 'untilRelease'}
                    onChange={() => setHoldDuration('untilRelease')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="buttons-row">
            <button className="btn btn-cancel">Cancel</button>
            <button className="btn btn-hold">Hold Amount</button>
          </div>
        </div>

        <div className="history-card">
          <div className="history-header">
            <h2 className="history-title">History & Active Holds</h2>
          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'AG-2078', name: 'Sarah Johnson', amount: '₹80,000', reason: 'Pending Verification', status: 'Active', date: 'Oct 24, 2025' },
                { id: 'AG-2078', name: 'Sarah Johnson', amount: '₹80,000', reason: 'Pending Verification', status: 'Released', date: 'Oct 24, 2025' },
                { id: 'AG-2078', name: 'Sarah Johnson', amount: '₹80,000', reason: 'Pending Verification', status: 'Active', date: 'Oct 24, 2025' },
                { id: 'AG-2078', name: 'Sarah Johnson', amount: '₹80,000', reason: 'Pending Verification', status: 'Released', date: 'Oct 24, 2025' },
                { id: 'AG-2078', name: 'Sarah Johnson', amount: '₹80,000', reason: 'Pending Verification', status: 'Active', date: 'Oct 24, 2025' },
              ].map((item, idx) => (
                <tr key={idx}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.amount}</td>
                  <td>{item.reason}</td>
                  <td>
                    <span className={`status-badge ${item.status === 'Active' ? 'status-active' : 'status-released'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    {item.status === 'Active' ? (
                      <button className="action-btn release-btn">Release</button>
                    ) : (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Released</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HoldFunds;