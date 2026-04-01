import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

import BAnk from "../../assets/checkout/Bank_img.png";
import Farmer from "../../assets/checkout/Farmer_img.png";
import Invoice from "../../assets/checkout/Invoice_img.png";
import Platform from "../../assets/checkout/Platform_img.png";
import Upi from "../../assets/checkout/Upi_img.png";
import Warehouse from "../../assets/checkout/Warehouse_img.png";

import Button from "../../components/Button/Button";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../utils/imageLoader";

const CheckOut = () => {
  const { cartItems } = useCart();
  const [selectedFulfillment, setSelectedFulfillment] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);

  const getImagePath = (imgName) => {
    const url = getImageUrl(imgName);
    return url || '';
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price.replace(/,/g, '')) * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const processingFee = 1000;
  const tax = subtotal * 0.05;
  const total = subtotal + processingFee + tax;

  const businessFields = [
    { label: "Business Name", placeholder: "Enter Business name", col: 6 },
    { label: "GSTIN", placeholder: "Enter GSTIN", col: 6 },
    { label: "Contact Person", placeholder: "Enter Contact Person name", col: 6 },
    { label: "Phone Number", placeholder: "Enter Phone Number", col: 6 },
    { label: "Email Address", placeholder: "Enter Email Address", col: 12 }
  ];

  const deliveryFields = [
    { label: "Warehouse / Godown Name", placeholder: "Enter Warehouse / Godown Name", col: 12 },
    { label: "Full Address", placeholder: "Enter Full Address", col: 12 },
    { label: "City, State, PIN", placeholder: "Enter City, State, PIN", col: 6 },
    { label: "Phone Number", placeholder: "Enter Phone Number", col: 6 }
  ];

  const fulfillmentMethods = [
    { img: Platform, title: "Platform Logistics", desc: "Pan-India verified transport with insurance coverage." },
    { img: Farmer, title: "Farmer Pickup (Take Away)", desc: "Pickup directly from Farmer / FPO location." },
    { img: Warehouse, title: "Warehouse Hold (Advanced)", desc: "Store temporarily for consolidation." }
  ];

  const paymentMethods = [
    { img: BAnk, title: "Bank Transfer", desc: "Invoice shared via email" },
    { img: Upi, title: "UPI / Net Banking", desc: "Instant payment" },
    { img: Invoice, title: "Pay on Invoice", desc: "Credit terms apply" }
  ];

  const inputStyle = {
    height: '48px',
    borderRadius: '8px',
    border: '1px solid #E5E5E5'
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="row g-3 g-md-4">
        <div className="col-12 col-lg-8">
          <h3 className="card-title mb-3 mb-md-4">Secure Checkout</h3>

          <div className="card p-3 p-md-4 mb-3 mb-md-4" style={{ borderRadius: '12px', border: '1px solid #E5E5E5' }}>
            <h4 className="mb-3">Business Details</h4>
            <div className="row g-3">
              {businessFields.map((field, idx) => (
                <div key={idx} className={`col-12 col-md-${field.col}`}>
                  <label className="form-label">{field.label}</label>
                  <input className="form-control" placeholder={field.placeholder} style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-3 p-md-4 mb-3 mb-md-4" style={{ borderRadius: '12px', border: '1px solid #E5E5E5' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
              <h4 className="mb-2 mb-md-0">Fulfillment Method</h4>
              <small className="text-muted">How would you like to receive this order?</small>
            </div>

            {fulfillmentMethods.map((method, idx) => (
              <div 
                key={idx} 
                className="border rounded p-3 mb-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3" 
                style={{ borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => setSelectedFulfillment(idx)}
              >
                <div className="d-flex gap-3 align-items-start flex-grow-1">
                  <img src={method.img} alt={method.title} width="36" style={{ minWidth: '36px' }} />
                  <div>
                    <h6 className="fw-semibold mb-1">{method.title}</h6>
                    <small className="text-muted">{method.desc}</small>
                  </div>
                </div>
                <input 
                  type="radio" 
                  checked={selectedFulfillment === idx} 
                  onChange={() => setSelectedFulfillment(idx)}
                  style={{ minWidth: '20px' }} 
                />
              </div>
            ))}
          </div>

          <div className="card p-3 p-md-4 mb-3 mb-md-4" style={{ borderRadius: '12px', border: '1px solid #E5E5E5' }}>
            <h4 className="mb-3">Delivery Details</h4>
            <div className="row g-3">
              {deliveryFields.map((field, idx) => (
                <div key={idx} className={`col-12 col-md-${field.col}`}>
                  <label className="form-label">{field.label}</label>
                  <input className="form-control" placeholder={field.placeholder} style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-3 p-md-4" style={{ borderRadius: '12px', border: '1px solid #E5E5E5' }}>
            <h4 className="mb-3">Payment & Quote</h4>
            <div className="row g-3">
              {paymentMethods.map((method, idx) => (
                <div key={idx} className="col-12 col-sm-6 col-md-4">
                  <div 
                    className={`border rounded p-3 h-100 ${selectedPayment === idx ? 'bg-success bg-opacity-10' : ''}`} 
                    style={{ borderRadius: '8px', cursor: 'pointer' }}
                    onClick={() => setSelectedPayment(idx)}
                  >
                    <img src={method.img} alt={method.title} width="32" className="mb-2" />
                    <h6 className="fw-semibold">{method.title}</h6>
                    <small>{method.desc}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card p-3 p-md-4" style={{ borderRadius: '12px', border: '1px solid #E5E5E5' }}>
            <h4 className="mb-3 mb-md-4">Order Summary</h4>

            {cartItems.map((item) => (
              <div key={item.id} className="d-flex align-items-center gap-2 mb-3">
                <img 
                  src={getImagePath(item.img)} 
                  alt={item.title} 
                  width="36" 
                  height="36"
                  className="rounded-circle" 
                  style={{ minWidth: '36px', objectFit: 'cover' }} 
                />
                <span style={{ fontSize: '14px' }}>{item.title}</span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between mb-2">
              <span style={{ fontSize: '14px', color: '#565656' }}>Subtotal</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>₹ {subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span style={{ fontSize: '14px', color: '#565656' }}>Processing Fee</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>₹ {processingFee.toLocaleString('en-IN')}</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span style={{ fontSize: '14px', color: '#565656' }}>GST (5%)</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>₹ {Math.round(tax).toLocaleString('en-IN')}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold mb-3">
              <span style={{ fontSize: '16px' }}>Total</span>
              <span style={{ fontSize: '16px' }}>₹ {Math.round(total).toLocaleString('en-IN')}</span>
            </div>

            <small className="text-muted d-block mb-3">Includes all taxes</small>

            <Button text="Place Order" route="/order-placed" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;