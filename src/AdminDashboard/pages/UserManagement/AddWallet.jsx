// AddWallet.jsx
import React from 'react';
import { Search } from 'lucide-react';

const AddWallet = () => {
  return (
    <>
      <style>{`
        .add-wallet-page {
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

        .filter-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0 32px 0;
          flex-wrap: wrap;
        }

        .search-wrapper {
          flex: 1;
          min-width: 320px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 15px;
          outline: none;
        }

        .search-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .select {
          padding: 12px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 15px;
          min-width: 180px;
          background: white;
          color: #374151;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          overflow: hidden;
          margin-bottom: 32px;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .status-success {
          color: #10b981;
          font-weight: 600;
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

        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 32px;
        }

        .action-btn {
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-deduct {
          background: #ef4444;
          color: white;
          border: none;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
          border: none;
        }

        .btn-add {
          background: #10b981;
          color: white;
          border: none;
        }

        .btn-deduct:hover { background: #dc2626; }
        .btn-cancel:hover { background: #e2e8f0; }
        .btn-add:hover    { background: #059669; }
      `}</style>

      <div className="add-wallet-page">
        <h1 className="page-title">Add Wallet</h1>

        <div className="filter-bar">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search By User"
            />
          </div>

          <select className="select">
            <option>Select All</option>
            <option>Agent</option>
            <option>Farmer</option>
          </select>

          <select className="select">
            <option>Select Role</option>
            <option>Agent</option>
            <option>Farmer</option>
          </select>

          <select className="select">
            <option>Select Transaction</option>
            <option>Credit</option>
            <option>Debit</option>
            <option>Transfer</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>SrNo</th>
                <th>TransDate</th>
                <th>TransID</th>
                <th>Name</th>
                <th>Mobile No</th>
                <th>UserID</th>
                <th>Type</th>
                <th>Business Name</th>
                <th>Wallet From</th>
                <th>Wallet To</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01</td>
                <td>04-07-25</td>
                <td>TXN50001</td>
                <td>Ravi</td>
                <td>09887654321</td>
                <td>102</td>
                <td>Transfer</td>
                <td>Ravi Traders</td>
                <td>Main Wallet</td>
                <td>Lean Wallet</td>
                <td>₹10,000</td>
                <td className="status-success">Success</td>
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

        <div className="action-buttons">
          <button className="action-btn btn-deduct">Deduct from Wallet</button>
          <button className="action-btn btn-cancel">Cancel</button>
          <button className="action-btn btn-add">Add Amount</button>
        </div>
      </div>
    </>
  );
};

export default AddWallet;