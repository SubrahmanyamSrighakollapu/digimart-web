// HoldTransactions.jsx
import React from 'react';
import { Search, Filter, AlertTriangle, Clipboard } from 'lucide-react';

const HoldTransactions = () => {
  return (
    <>
      <style>{`
        .hold-transactions-page {
          padding: 24px 32px;
          background: #f5f7fa;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        /* Filter Section */
        .filter-section {
          background: white;
          border-radius: 12px;
          padding: 20px 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 32px;
        }

        .filter-title {
          font-size: 16px;
          font-weight: 600;
          color: #444;
          margin-bottom: 16px;
        }

        .filters-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
          min-width: 240px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #8a94a6;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .filter-select,
        .amount-input {
          padding: 10px 12px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          min-width: 140px;
          outline: none;
        }

        .amount-input-wrapper {
          position: relative;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(75, 175, 71, 1);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .filter-btn:hover {
          background: rgba(75, 175, 71, 1);
        }

        /* Transaction List */
        .transactions-list-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          border: 2px solid #3b82f6;
        }

        .list-header {
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .list-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
        }

        /* Error Alert */
        .error-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fef2f2;
          color: #991b1b;
          padding: 16px 24px;
          border-bottom: 1px solid #fecaca;
        }

        .alert-icon {
          color: #ef4444;
        }

        /* No Data State */
        .no-data-container {
          padding: 80px 24px;
          text-align: center;
          color: #64748b;
        }

        .no-data-icon-wrapper {
          margin-bottom: 24px;
        }

        .no-data-title {
          font-size: 20px;
          font-weight: 600;
          color: #334155;
          margin: 0 0 8px 0;
        }

        .no-data-subtitle {
          font-size: 15px;
          margin: 0;
        }
      `}</style>

      <div className="hold-transactions-page">
        <div className="page-header">
          <h1 className="page-title">Hold Transactions</h1>
        </div>

        <div className="filter-section">
          <div className="filter-title">Search & Filter Users</div>

          <div className="filters-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, ID..."
                className="search-input"
              />
            </div>

            <select className="filter-select">
              <option>All Role</option>
              <option>Farmer</option>
              <option>Agent</option>
              <option>Admin</option>
            </select>

            <select className="filter-select">
              <option>All Status</option>
              <option>Pending</option>
              <option>Hold</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            <div className="amount-input-wrapper">
              <input
                type="text"
                placeholder="Enter Amount"
                className="amount-input"
              />
            </div>

            <select className="filter-select">
              <option>All KYC</option>
              <option>Verified</option>
              <option>Pending</option>
              <option>Not Submitted</option>
            </select>

            <button className="filter-btn">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        <div className="transactions-list-container">
          <div className="list-header">
            <h2 className="list-title">Transaction List</h2>
          </div>

          <div className="error-alert">
            <AlertTriangle size={20} className="alert-icon" />
            <span>
              <strong>Error:</strong> Failed to fetch user list. Please try again
              or contact support if the issue persists.
            </span>
          </div>

          <div className="no-data-container">
            <div className="no-data-icon-wrapper">
              <Clipboard size={48} className="no-data-icon" />
            </div>
            <h3 className="no-data-title">No transactions found</h3>
            <p className="no-data-subtitle">
              Try adjusting your filters or search criteria
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HoldTransactions;