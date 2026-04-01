// SetBalanceRequirement.jsx
import React from 'react';

const SetBalanceRequirement = () => {
  return (
    <>
      <style>{`
        .balance-requirement-page {
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
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          padding: 32px;
          margin-bottom: 40px;
          border: 2px solid #3b82f6;
        }

        .form-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 24px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
          background: white;
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

        .helper-text {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }

        .pro-tip {
          grid-column: 1 / -1;
          background: #fefce8;
          border: 1px solid #fef08a;
          border-radius: 8px;
          padding: 16px 20px;
          margin: 16px 0 32px 0;
          color: #854d0e;
          font-size: 14px;
          line-height: 1.5;
        }

        .pro-tip strong {
          color: #713f12;
        }

        .save-btn {
          grid-column: 1 / -1;
          padding: 12px 32px;
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

        /* Directory Table */
        .directory-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .directory-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .directory-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .directory-table {
          width: 100%;
          border-collapse: collapse;
        }

        .directory-table th,
        .directory-table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          color: #334155;
        }

        .directory-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .no-data {
          padding: 80px 24px;
          text-align: center;
          color: #64748b;
          font-size: 15px;
        }
      `}</style>

      <div className="balance-requirement-page">
        <h1 className="page-title">Set Balance Requirement</h1>
        <p className="page-subtitle">Configure by role</p>

        <div className="form-card">
          <h2 className="form-title">Configure Minimum Wallet Balance</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Select Role</label>
              <select className="form-select">
                <option>Select Role</option>
                <option>Agent</option>
                <option>Farmer</option>
                <option>Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Wallet Balance (₹)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Minimum Wallet Balance (₹)"
              />
              <div className="helper-text">
                Users must maintain this minimum balance
              </div>
            </div>

            <div className="pro-tip">
              <strong>Pro Tip</strong><br />
              Set appropriate minimum balances to ensure users can complete transactions without interruption...
            </div>

            <button className="save-btn">Save</button>
          </div>
        </div>

        <div className="directory-card">
          <div className="directory-header">
            <h2 className="directory-title">Balance Requirements Directory</h2>
          </div>

          <table className="directory-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Minimum Wallet Balance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="no-data">
                    No Balance Requirements Set
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

export default SetBalanceRequirement;