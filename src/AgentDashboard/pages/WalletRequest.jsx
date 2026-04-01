// WalletRequest.jsx
import React from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';

const WalletRequest = () => {
  return (
    <>
      <style>{`
        .wallet-request-page {
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          border-left: 6px solid;
        }

        .stat-card.current {
          border-color: #10b981;
        }

        .stat-card.pending {
          border-color: #f59e0b;
        }

        .stat-card.approved {
          border-color: #3b82f6;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .stat-change {
          font-size: 14px;
          font-weight: 500;
        }

        .stat-change.positive {
          color: #10b981;
        }

        .request-form-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          padding: 28px 32px;
          margin-bottom: 40px;
        }

        .form-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 24px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
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
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
        }

        .request-btn {
          padding: 12px 32px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 24px;
          transition: background 0.2s;
        }

        .request-btn:hover {
          background: #059669;
        }

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
        }

        .history-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-failed {
          background: #fee2e2;
          color: #991b1b;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-approved {
          background: #d1fae5;
          color: #065f46;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .action-icons {
          display: flex;
          gap: 12px;
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

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          color: #64748b;
          font-size: 14px;
        }

        .pagination-numbers {
          display: flex;
          gap: 8px;
        }

        .page-number {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: #e5e7eb;
          color: #374151;
          cursor: pointer;
        }

        .page-number.active {
          background: #10b981;
          color: white;
          font-weight: 600;
        }
      `}</style>

      <div className="wallet-request-page">
        <h1 className="page-title">wallet request</h1>

        <div className="stats-grid">
          <div className="stat-card current">
            <div className="stat-label">Current Balance</div>
            <div className="stat-value">₹98,000</div>
            <div className="stat-change positive">↑12% from last week</div>
          </div>

          <div className="stat-card pending">
            <div className="stat-label">Pending requests</div>
            <div className="stat-value">₹98,000</div>
            <div className="stat-change">2 active requests</div>
          </div>

          <div className="stat-card approved">
            <div className="stat-label">Last approved</div>
            <div className="stat-value">₹98,000</div>
            <div className="stat-change">Mar 12, 2025 10:45 AM</div>
          </div>
        </div>

        <div className="request-form-card">
          <h2 className="form-title">New Top-up Requests</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Request Amount</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Amount"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select className="form-select">
                <option>Select here</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
                <option>Net Banking</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter ID"
              />
            </div>
          </div>

          <button className="request-btn">Request wallet</button>
        </div>

        <div className="history-card">
          <div className="history-header">
            <h2 className="history-title">Request History</h2>
          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Reference</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ORD #247</td>
                <td>₹52,000</td>
                <td>UPI</td>
                <td>GPY3456789..</td>
                <td><span className="status-pending">Pending</span></td>
                <td>23 Dec 25</td>
                <td className="action-icons">
                  <button className="action-btn"><Edit size={18} /></button>
                  <button className="action-btn"><Trash2 size={18} /></button>
                </td>
              </tr>

              <tr>
                <td>ORD #241</td>
                <td>₹48,000</td>
                <td>Bank Transfer</td>
                <td>GPY3456789</td>
                <td><span className="status-failed">Failed</span></td>
                <td>26 Dec 25</td>
                <td className="action-icons">
                  <button className="action-btn"><Edit size={18} /></button>
                  <button className="action-btn"><Trash2 size={18} /></button>
                </td>
              </tr>

              <tr>
                <td>ORD #248</td>
                <td>₹85,000</td>
                <td>UPI</td>
                <td>GPY3456789</td>
                <td><span className="status-approved">Approved</span></td>
                <td>24 Dec 25</td>
                <td className="action-icons">
                  <button className="action-btn"><Edit size={18} /></button>
                  <button className="action-btn"><Trash2 size={18} /></button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="pagination">
            <div>Showing 1 to 3 of 100</div>
            <div className="pagination-numbers">
              <div className="page-number">«</div>
              <div className="page-number active">1</div>
              <div className="page-number">2</div>
              <div className="page-number">3</div>
              <div className="page-number">»</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletRequest;