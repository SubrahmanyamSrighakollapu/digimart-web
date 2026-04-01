import React from "react";
import del from "../../../assets/AgentDashboard/Dashboard/material-symbols_delete.png";
import paid from "../../../assets/AgentDashboard/Dashboard/paid (2).png";
import Status from "../../../assets/AgentDashboard/Dashboard/Status.png";
import total from "../../../assets/AgentDashboard/Dashboard/total.png";
import vector from "../../../assets/AgentDashboard/Dashboard/Vector.png";

const VendorPayments = () => {
  return (
    <div className="vendor-root">
      <div className="vendor-header">
        <h3>Vendor payments</h3>
        <p>Track, approve and release farmer payouts efficiently.</p>
      </div>
      
      <div className="summary-row">
        <div className="summary-card">
          <div className="summary-top">
            <span>Total Payable</span>
            <img src={total} alt="" />
          </div>
          <div className="summary-amount">₹ 90,000</div>
          <div className="summary-note green">+10% in last month</div>
        </div>

        <div className="summary-card">
          <div className="summary-top">
            <span>Paid today</span>
            <img src={paid} alt="" />
          </div>
          <div className="summary-amount">₹ 90,000</div>
          <div className="summary-note green">18 transactions processed</div>
        </div>
      </div>
      
      <div className="vendor-table-box">
        <div className="table-controls">
          <div className="filters">
            <div className="filter-box">
              <img src={vector} alt="" />
              <span>Filter</span>
            </div>
            <div className="filter-box">
              <img src={Status} alt="" />
              <span>Status</span>
            </div>
          </div>

          <input
            className="search"
            placeholder="Search orders, customers..."
          />
        </div>
        
        <div className="table-head">
          <span>Farmer</span>
          <span>Order ID</span>
          <span>Product</span>
          <span>Amount</span>
          <span className="text-center">status</span>
          <span>Action</span>
        </div>

        <div className="table-row">
          <span>Ramesh</span>
          <span>Order #2415</span>
          <span>Wheat</span>
          <span>₹ 52,000</span>
          <span className="awaiting text-center">Awaiting Purchase</span>
          <span><img src={del} alt="" /></span>
        </div>

        <div className="table-row">
          <span>Raju</span>
          <span>Order #2418</span>
          <span>Toor Dal</span>
          <span>₹ 48,000</span>
          <span className="transit text-center">In Transit</span>
          <span><img src={del} alt="" /></span>
        </div>

        <div className="table-row">
          <span>Ramesh</span>
          <span>Order #2480</span>
          <span>Basmati Rice</span>
          <span>₹ 85,000</span>
          <span className="delivered text-center">Delivered</span>
          <span><img src={del} alt="" /></span>
        </div>
      </div>

      <div className="table-footer">
        <span>Showing <b>1–3</b> of 30</span>
        <button>Next</button>
      </div>
      
      <style jsx>{`
        * {
          box-sizing: border-box;
          font-family: 'Segoe UI', sans-serif;
        }

        .vendor-root {
          padding: 24px;
          background-color: #f7f9fc;
          min-height: 100vh;
        }

        .vendor-header h3 {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        .vendor-header p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .summary-row {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
        }

        .summary-card {
          flex: 1;
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .summary-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .summary-top span {
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
        }

        .summary-top img {
          width: 48px;
          height: 48px;
        }

        .summary-amount {
          font-size: 28px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .summary-note {
          font-size: 13px;
          color: #6b7280;
        }

        .green { color: #10b981; font-weight: 500; }

        .vendor-table-box {
          width: 100%;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .table-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .filters {
          display: flex;
          gap: 12px;
        }

        .filter-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-box:hover {
          border-color: #10b981;
          background-color: #f0fdf4;
        }

        .filter-box img {
          width: 16px;
          height: 16px;
        }

        .search {
          width: 280px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          padding: 0 16px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .table-head,
        .table-row {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1.2fr 1fr 1.2fr 0.6fr;
          padding: 12px 20px;
          font-size: 14px;
          align-items: center;
        }

        .table-head {
          background: #f8fafc;
          color: #4a5568;
          font-weight: 600;
          border-bottom: 1px solid #e2e8f0;
        }

        .table-row {
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.2s;
        }

        .table-row:hover {
          background-color: #f8fafc;
        }

        .table-row img {
          width: 20px;
          height: 20px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .table-row img:hover {
          transform: scale(1.1);
        }

        .awaiting { 
          color: #f59e0b;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 12px;
          display: inline-block;
        }
        .transit { 
          color: #8b5cf6;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 12px;
          display: inline-block;
        }
        .delivered { 
          color: #10b981;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 12px;
          display: inline-block;
        }

        .table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          font-size: 14px;
          color: #4a5568;
        }

        .table-footer button {
          padding: 8px 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .table-footer button:hover {
          background-color: #10b981;
          color: white;
          border-color: #10b981;
          transform: translateY(-1px);
        }

        @media (max-width: 1200px) {
          .summary-row {
            flex-direction: column;
          }
          
          .table-controls {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          
          .search {
            width: 100%;
          }

          .table-head,
          .table-row {
            font-size: 12px;
            padding: 10px 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default VendorPayments;