import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Basmati from "../../../assets/cart/Basmati_Rice.png";
import Wheat from "../../../assets/cart/Wheat_Gains.png";

import Centertick from "../../../assets/orderplaced/Centertick_img.png";
import Tick from "../../../assets/orderplaced/Tick_img.png";
import Time from "../../../assets/orderplaced/Time_img.png";

const AgentOrderPlaced = () => {
  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card p-5 text-center mb-4">
            <img
              src={Centertick}
              alt="Order Placed Successfully"
              width="56"
              height="56"
              className="mx-auto mb-3"
            />

            <h3 className="fw-bold mb-2">Order Placed Successfully!</h3>

            <p className="text-muted mb-3">
              Thank you for choosing AgriTrade. Your bulk order has been securely
              forwarded to the supplier.
            </p>

            <span className="px-4 py-2 rounded-pill border">
              Order ID : AGT-ORD-2451
            </span>
          </div>

          <div className="card p-4 mb-4">
            <h6 className="fw-bold mb-4">What Happens Next?</h6>

            <div className="position-relative ps-4">
              <div
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "6px",
                  bottom: "6px",
                  width: "2px",
                  backgroundColor: "#4CAF50",
                }}
              />

              <div className="d-flex mb-4 align-items-start">
                <img src={Tick} alt="Order Received" width="18" />
                <div className="ms-3">
                  <h6 className="fw-semibold mb-1">Order Received</h6>
                  <small className="text-muted">
                    We have received your bulk request. Supplier notification sent immediately.
                  </small>
                </div>
              </div>

              <div className="d-flex mb-4 align-items-start">
                <img src={Time} alt="Farmer Confirmation" width="18" />
                <div className="ms-3">
                  <h6 className="fw-semibold mb-1">Farmer Confirmation</h6>
                  <small className="text-muted">
                    The supplier will confirm stock availability and pickup readiness.
                  </small>
                </div>
              </div>
              
              <div className="d-flex mb-4 align-items-start">
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #4CAF50",
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                />
                <div className="ms-3">
                  <h6 className="fw-semibold mb-1">Logistics Scheduled</h6>
                  <small className="text-muted">
                    If selected during checkout, transport will be assigned automatically.
                  </small>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #4CAF50",
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                />
                <div className="ms-3">
                  <h6 className="fw-semibold mb-1">Invoice Shared</h6>
                  <small className="text-muted">
                    Final invoice sent via email & available on your dashboard.
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            <button
              className="btn btn-success"
              style={{ minWidth: "160px", height: "40px" }}
            >
              Track Order
            </button>

            <button
              className="btn btn-outline-success"
              style={{ minWidth: "160px", height: "40px" }}
            >
              Download Invoice
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-4">
            <h5 className="fw-bold mb-4">Order Summary</h5>

            <div className="d-flex align-items-center gap-2 mb-3">
              <img src={Wheat} alt="High-Quality Wheat Grains" width="36" className="rounded-circle" />
              <span>High-Quality Wheat Grains</span>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <img src={Basmati} alt="Premium Basmati Rice" width="36" className="rounded-circle" />
              <span>Premium Basmati Rice</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>₹ 71,250</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Transport charges (Est.)</span>
              <span>₹ 1,000</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>GST (5%)</span>
              <span>₹ 3,563</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Total</span>
              <span>₹ 75,813</span>
            </div>

            <small className="text-muted d-block mb-3">
              Includes all taxes
            </small>

            <div className="border rounded p-3">
              <h6 className="fw-bold mb-2">Shipping Details</h6>
              <small className="text-muted d-block">
                Agri Warehouse #4<br />
                124 Harvest Lane, Industrial District,<br />
                Hyderabad, Telangana
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentOrderPlaced;