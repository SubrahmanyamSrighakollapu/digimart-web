// AddChargeConfiguration.jsx
import React from 'react';

const AddChargeConfiguration = () => {
  return (
    <>
      <style>{`
        .add-charge-page {
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
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 20px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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

        .form-input {
          padding: 10px 14px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }

        .form-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .pro-tip {
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          padding: 14px 16px;
          margin: 16px 0 24px 0;
          color: #0369a1;
          font-size: 14px;
          line-height: 1.5;
        }

        .pro-tip strong {
          color: #1e40af;
        }

        .buttons-row {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
        }

        .btn {
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
          border: none;
        }

        .btn-cancel:hover {
          background: #e2e8f0;
        }

        .btn-add {
          background: rgba(75, 175, 71, 1);
          color: white;
          border: none;
        }

        .btn-add:hover {
          background: rgba(75, 175, 71, 1);
        }

        /* Existing Charge List */
        .list-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .list-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .list-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 16px 24px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          color: #334155;
          font-size: 14px;
        }

        .table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .no-data {
          padding: 80px 24px;
          text-align: center;
          color: #64748b;
        }

        .no-data-title {
          font-size: 18px;
          font-weight: 600;
          color: #334155;
          margin: 0 0 8px 0;
        }

        .no-data-subtitle {
          margin: 0;
          font-size: 15px;
        }
      `}</style>

      <div className="add-charge-page">
        <h1 className="page-title">Add Charge Configuration</h1>
        <p className="page-subtitle">
          Configure payment charges for Payin transactions
        </p>

        <div className="form-card">
          <h2 className="section-title">Charge details</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Charge Type</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Type"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Charge Percentage</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Percentage"
              />
            </div>
          </div>

          <h2 className="section-title" style={{ marginTop: '40px' }}>
            Advance Options
          </h2>

          <div className="form-group">
            <label className="form-label">Credit Days</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter Type"
            />
          </div>

          <div className="pro-tip">
            <strong>Pro Tip:</strong> Credit days determine when funds are settled. Use 0 for instant settlement, or specify T+1, T+7 for delayed settlement.
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-input"
              placeholder="Enter Description (Optional)..."
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="buttons-row">
            <button className="btn btn-cancel">Cancel</button>
            <button className="btn btn-add">Add Charge Type</button>
          </div>
        </div>

        <div className="list-card">
          <div className="list-header">
            <h2 className="list-title">Charge Details</h2>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Charge Type</th>
                <th>Percentage</th>
                <th>Description</th>
                <th>Credit Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}>
                  <div className="no-data">
                    <h3 className="no-data-title">No Gateways Configured</h3>
                    <p className="no-data-subtitle">
                      Add your first payment gateway to start accepting payments
                    </p>
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

export default AddChargeConfiguration;