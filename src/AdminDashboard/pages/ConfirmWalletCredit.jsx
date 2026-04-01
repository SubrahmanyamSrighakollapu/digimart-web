// ConfirmWalletCredit.jsx
import React from 'react';

const ConfirmWalletCredit = () => {
  return (
    <>
      <style>{`
        .confirm-wallet-credit-page {
          padding: 32px 40px;
          background: #f5f7fa;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 32px 0;
        }

        .confirm-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          max-width: 600px;
          margin: 0 auto;
          overflow: hidden;
        }

        .user-header {
          background: #f8fafc;
          padding: 24px 32px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 600;
          color: #64748b;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .user-id {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .details-section {
          padding: 32px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-label {
          font-size: 15px;
          color: #475569;
          font-weight: 500;
        }

        .detail-value {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .net-balance-box {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 10px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
        }

        .net-balance-label {
          font-size: 15px;
          color: #065f46;
          margin-bottom: 8px;
        }

        .net-balance-amount {
          font-size: 28px;
          font-weight: 700;
          color: #065f46;
          margin: 0;
        }

        .net-balance-note {
          font-size: 13px;
          color: #065f46;
          margin-top: 8px;
          font-style: italic;
        }

        .extra-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .extra-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .extra-label {
          font-size: 14px;
          color: #64748b;
        }

        .extra-value {
          font-size: 15px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .confirm-btn {
          width: 100%;
          padding: 14px;
          background: rgba(75, 175, 71, 1);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .confirm-btn:hover {
          background: rgba(65, 155, 61, 1);
        }
      `}</style>

      <div className="confirm-wallet-credit-page">
        <h1 className="page-title">Confirm Wallet Credit</h1>

        <div className="confirm-card">
          <div className="user-header">
            <div className="avatar">R</div>
            <div className="user-info">
              <h3 className="user-name">Ramesh kumar</h3>
              <p className="user-id">ID: AGF-1234</p>
            </div>
          </div>

          <div className="details-section">
            <div className="detail-row">
              <div className="detail-label">Current Balance</div>
              <div className="detail-value">₹10,000</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Add Amount</div>
              <div className="detail-value">₹5,000</div>
            </div>

            <div className="net-balance-box">
              <div className="net-balance-label">Net Balance (After Credit)</div>
              <p className="net-balance-amount">₹15,000</p>
              <div className="net-balance-note">Calculation Verified</div>
            </div>

            <div className="extra-info">
              <div className="extra-item">
                <div className="extra-label">Payment Mode</div>
                <div className="extra-value">Bank Transfer</div>
              </div>

              <div className="extra-item">
                <div className="extra-label">Remarks</div>
                <div className="extra-value">Monthly Top-up</div>
              </div>
            </div>

            <button className="confirm-btn">Confirm & Add Wallet</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmWalletCredit;