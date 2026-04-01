// PaymentInvoice.jsx
import React from 'react';
import { Download, Printer } from 'lucide-react';

const PaymentInvoice = () => {
  return (
    <>
      <style>{`
        .payment-invoice-page {
          padding: 32px 40px;
          background: #f8fafc;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1f2937;
        }

        .invoice-container {
          background: white;
          max-width: 900px;
          margin: 0 auto;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .invoice-header {
          background: #f1f5f9;
          padding: 24px 32px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .invoice-title {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-download {
          background: #10b981;
          color: white;
          border: none;
        }

        .btn-print {
          background: #3b82f6;
          color: white;
          border: none;
        }

        .btn-download:hover { background: #059669; }
        .btn-print:hover    { background: #2563eb; }

        .header-info {
          padding: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .party-box {
          background: #f8fafc;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        .party-title {
          font-size: 16px;
          font-weight: 600;
          color: #10b981;
          margin-bottom: 12px;
        }

        .party-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .party-detail {
          font-size: 14px;
          color: #374151;
          margin: 4px 0;
          line-height: 1.5;
        }

        .items-section {
          padding: 0 32px 32px 32px;
        }

        .items-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 16px 0;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }

        .items-table th,
        .items-table td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .items-table th {
          background: #f1f5f9;
          font-weight: 600;
          color: #475569;
        }

        .summary-box {
          background: #f8fafc;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-label {
          font-weight: 500;
          color: #374151;
        }

        .summary-value {
          font-weight: 600;
          color: #111827;
        }

        .grand-total {
          font-size: 18px;
          font-weight: 700;
          color: #10b981;
          margin-top: 16px;
          text-align: right;
        }

        .payment-info {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 10px;
          padding: 20px;
          margin: 0 32px 32px 32px;
        }

        .payment-title {
          font-size: 16px;
          font-weight: 600;
          color: #065f46;
          margin: 0 0 16px 0;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .payment-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .payment-label {
          font-size: 14px;
          color: #065f46;
          font-weight: 500;
        }

        .payment-value {
          font-size: 15px;
          color: #065f46;
        }

        .terms-section {
          padding: 0 32px 32px 32px;
          color: #4b5563;
          font-size: 14px;
          line-height: 1.6;
        }

        .terms-title {
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .signature {
          margin-top: 40px;
          text-align: right;
          font-style: italic;
          color: #6b7280;
        }
      `}</style>

      <div className="purchase-invoice-page">
        <div className="invoice-container">
          <div className="invoice-header">
            <h1 className="invoice-title">Payment Invoice</h1>
            <div className="action-buttons">
              <button className="action-btn btn-download">
                <Download size={18} />
                Download PDF
              </button>
              <button className="action-btn btn-print">
                <Printer size={18} />
                Print
              </button>
            </div>
          </div>

          <div className="header-info">
            <div className="party-box">
              <div className="party-title">From</div>
              <div className="party-name">Admin Store</div>
              <div className="party-detail">
                123 Business Street<br />
                New Delhi, 110001<br />
                Phone: +91 98765 43210<br />
                Email: admin@store.com<br />
                GST: GST123456789
              </div>
            </div>

            <div className="party-box">
              <div className="party-title">To</div>
              <div className="party-name">Mike Davis</div>
              <div className="party-detail">
                456 Agent Lane<br />
                Mumbai, 400001<br />
                Phone: +91 98765 11111<br />
                Email: john@agent.com<br />
                GST: GST123456789
              </div>
            </div>
          </div>

          <div className="items-section">
            <h2 className="items-title">Invoice Items</h2>

            <table className="items-table">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Amount</th>
                  <th>Platform Fee</th>
                  <th>GST</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>₹1000</td>
                  <td>₹100</td>
                  <td>5%</td>
                  <td>₹2000</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>₹1000</td>
                  <td>₹100</td>
                  <td>5%</td>
                  <td>₹1000</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>₹1000</td>
                  <td>₹100</td>
                  <td>5%</td>
                  <td>₹2000</td>
                </tr>
              </tbody>
            </table>

            <div className="summary-box">
              <div className="summary-row">
                <div className="summary-label">Subtotal</div>
                <div className="summary-value">₹5000</div>
              </div>
              <div className="summary-row">
                <div className="summary-label">Tax on goods (0%):</div>
                <div className="summary-value">₹0</div>
              </div>
              <div className="summary-row">
                <div className="summary-label">Platform fee (10%):</div>
                <div className="summary-value">₹500</div>
              </div>
              <div className="summary-row">
                <div className="summary-label">GST for Platform (10%):</div>
                <div className="summary-value">₹175</div>
              </div>
              <div className="grand-total">
                Grand Total: ₹5675.00
              </div>
            </div>
          </div>

          <div className="payment-info">
            <div className="payment-title">Payment Information</div>

            <div className="payment-grid">
              <div className="payment-item">
                <div className="payment-label">Payment Mode</div>
                <div className="payment-value">UPI</div>
              </div>

              <div className="payment-item">
                <div className="payment-label">Transaction ID</div>
                <div className="payment-value">TXN202401120001</div>
              </div>

              <div className="payment-item">
                <div className="payment-label">Payment Status</div>
                <div className="payment-value">Success</div>
              </div>

              <div className="payment-item">
                <div className="payment-label">Paid On</div>
                <div className="payment-value">2024-01-10 14:30:00</div>
              </div>
            </div>
          </div>

          <div className="terms-section">
            <div className="terms-title">Terms & Conditions:</div>
            <ul>
              <li>Payment is due within 30 days</li>
              <li>Please include invoice number with payment</li>
              <li>Thank you for your business</li>
            </ul>

            <div className="signature">
              Authorized Signature
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentInvoice;