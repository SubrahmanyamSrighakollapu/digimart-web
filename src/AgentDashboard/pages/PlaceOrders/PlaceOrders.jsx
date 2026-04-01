import React from "react";
import del from "../../../assets/AgentDashboard/Dashboard/material-symbols_delete.png";
import customer from "../../../assets/AgentDashboard/Dashboard/ix_customer.png";
import cart from "../../../assets/AgentDashboard/Dashboard/cart_outline.png";
import tabler from "../../../assets/AgentDashboard/Dashboard/tabler_cash.png";

const PlaceOrders = () => {
  return (
    <div className="place-page">
      <div className="left-section">
        <h2 className="title">Place customer Order</h2>
        <p className="subtitle">
          Manage current orders and track fulfilment progress from farmers to customers.
        </p>

        <input
          className="search"
          placeholder="Search orders, customers..."
        />
        <div className="orders-box">
          <div className="orders-header">Customer orders</div>
          <div className="orders-thead">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Product</span>
            <span>QTY</span>
            <span className="text-center">status</span>
            <span>Action</span>
          </div>

          <div className="orders-row">
            <span>Order #2415</span>
            <span>Ramesh</span>
            <span>Wheat</span>
            <span>2.5 Tons</span>
            <span className="awaiting text-center">Awaiting Purchase</span>
            <span><img src={del} alt="" /></span>
          </div>

          <div className="orders-row">
            <span>Order #2418</span>
            <span>Raju</span>
            <span>Toor Dal</span>
            <span>500 Kg</span>
            <span className="transit text-center">In Transit</span>
            <span><img src={del} alt="" /></span>
          </div>
          
          <div className="orders-row">
            <span>Order #2480</span>
            <span>Ramesh</span>
            <span>Basmati Rice</span>
            <span>1 Ton</span>
            <span className="delivered text-center">Delivered</span>
            <span><img src={del} alt="" /></span>
          </div>
        </div>
        
        <div className="orders-footer">
          <span>Showing <b>1-3</b> of 30</span>
          <button>Next</button>
        </div>
      </div>

      <div className="right-section">
        <div className="create-card">
          <div className="create-header">
            <div className="plus">+</div>
            <span>Create New Order</span>
          </div>

          <div className="form-body">
            <div className="section">
              <img src={customer} alt="" />
              <span>Customer Details</span>
            </div>

            <input placeholder="Customer name" />

            <div className="row2">
              <input placeholder="Contact No." />
              <input placeholder="Zip Code" />
            </div>

            <div className="section">
              <img src={cart} alt="" />
              <span>Product Details</span>
            </div>

            <input placeholder="Enter Crop Type" />

            <div className="row2">
              <input placeholder="Qty" />
              <input placeholder="Grade Type" />
            </div>

            <input placeholder="mm/dd/yy" />

            <div className="section">
              <img src={tabler} alt="" />
              <span>Pricing</span>
            </div>

            <div className="row2">
              <input placeholder="Selling price" />
              <input placeholder="Est, Margin" />
            </div>

            <button className="submit">→ Submit Order</button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        * {
          box-sizing: border-box;
          font-family: 'Segoe UI', sans-serif;
        }

        .place-page {
          display: flex;
          gap: 24px;
          padding: 24px;
          background-color: #f7f9fc;
          min-height: 100vh;
        }

        .left-section {
          flex: 1;
          max-width: 1000px;
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        .subtitle {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .search {
          width: 100%;
          height: 44px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          padding: 0 16px;
          margin-bottom: 20px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .orders-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .orders-header {
          padding: 16px 20px;
          font-weight: 600;
          font-size: 16px;
          color: #2d3748;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .orders-thead {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.2fr 0.8fr 1.2fr 0.6fr;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .orders-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.2fr 0.8fr 1.2fr 0.6fr;
          padding: 12px 20px;
          font-size: 14px;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.2s;
        }

        .orders-row:hover {
          background-color: #f8fafc;
        }

        .orders-row img {
          width: 20px;
          height: 20px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .orders-row img:hover {
          transform: scale(1.1);
        }

        .awaiting { 
          color: #f59e0b;
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
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

        .orders-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          font-size: 14px;
          color: #4a5568;
        }

        .orders-footer button {
          padding: 8px 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .orders-footer button:hover {
          background-color: #10b981;
          color: white;
          border-color: #10b981;
          transform: translateY(-1px);
        }

        .right-section {
          width: 400px;
          flex-shrink: 0;
        }

        .create-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .create-header {
          height: 64px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 20px;
          font-weight: 600;
          font-size: 16px;
          color: white;
        }

        .plus {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: white;
          color: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
          padding-bottom:5px;
        }

        .form-body {
          padding: 20px;
        }

        .form-body input {
          width: 100%;
          height: 40px;
          margin-bottom: 12px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          transition: all 0.2s;
        }

        .form-body input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .row2 {
          display: flex;
          gap: 10px;
        }

        .section {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 14px;
          color: #2d3748;
          margin: 20px 0 12px;
        }

        .section img {
          width: 18px;
          height: 18px;
        }

        .submit {
          width: 100%;
          height: 44px;
          background: #10b981;
          border: none;
          border-radius: 8px;
          color: white;
          margin-top: 20px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        @media (max-width: 1200px) {
          .place-page {
            flex-direction: column;
          }
          
          .left-section, .right-section {
            width: 100%;
            max-width: 100%;
          }

          .orders-thead,
          .orders-row {
            font-size: 12px;
            padding: 10px 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default PlaceOrders;