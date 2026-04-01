// WalletManagement.jsx
import React, { useState } from 'react';

const WalletManagement = () => {
  const [activeTab, setActiveTab] = useState('credit'); // 'credit' or 'debit'

  return (
    <>
      <style>{`
        .wallet-management-page {
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

        .tabs {
          display: flex;
          gap: 0;
          margin-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab-btn {
          padding: 12px 32px;
          font-size: 15px;
          font-weight: 600;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }

        .tab-btn.active {
          color: #10b981;
          border-bottom-color: #10b981;
        }

        .tab-btn:hover:not(.active) {
          color: #374151;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          padding: 32px;
          max-width: 900px;
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
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }

        .form-input::placeholder,
        .form-select option:disabled {
          color: #94a3b8;
        }

        .upload-wrapper {
          grid-column: 1 / -1;
        }

        .upload-label {
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          margin-bottom: 6px;
          display: block;
        }

        .upload-box {
          border: 2px dashed #d1d9e0;
          border-radius: 8px;
          padding: 32px 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .upload-box:hover {
          border-color: #10b981;
        }

        .upload-icon {
          width: 48px;
          height: 48px;
          color: #10b981;
          margin-bottom: 12px;
        }

        .upload-text {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .upload-hint {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 8px;
        }

        .submit-btn {
          grid-column: 1 / -1;
          padding: 12px 32px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 16px;
        }

        .submit-btn:hover {
          background: #059669;
        }

        .current-balance {
          color: #10b981;
          font-weight: 600;
          font-size: 16px;
        }
      `}</style>

      <div className="wallet-management-page">
        <h1 className="page-title">Wallet Management</h1>
        <p className="page-subtitle">
          Manage credit and debit transactions for user wallets
        </p>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'credit' ? 'active' : ''}`}
            onClick={() => setActiveTab('credit')}
          >
            Credit Wallet
          </button>
          <button
            className={`tab-btn ${activeTab === 'debit' ? 'active' : ''}`}
            onClick={() => setActiveTab('debit')}
          >
            Debit Wallet
          </button>
        </div>

        <div className="form-card">
          <h2 className="form-title">Credit Transaction details</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">User Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter User Name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter user ID"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Wallet Type</label>
              <select className="form-select">
                <option>Select Type</option>
                <option>Credit Wallet</option>
                <option>Debit Wallet</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Current Balance</label>
              <div className="current-balance">₹14,000</div>
            </div>

            <div className="form-group">
              <label className="form-label">Credit Amount</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Amount"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select className="form-select">
                <option>Select Payment Mode</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Transaction Id</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Transaction id"
              />
            </div>

            <div className="upload-wrapper">
              <label className="upload-label">Upload Proof</label>
              <div className="upload-box">
                <svg
                  className="upload-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="upload-text">Upload PAN Card</p>
                <p className="upload-hint">PDF, JPG, or PNG (Max 5MB)</p>
              </div>
            </div>

            <button className="submit-btn">Credit Wallet Now</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletManagement;