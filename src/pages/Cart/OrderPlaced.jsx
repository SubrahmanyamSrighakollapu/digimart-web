import "bootstrap/dist/css/bootstrap.min.css";

import Centertick from "../../assets/orderplaced/Centertick_img.png";
import Tick from "../../assets/orderplaced/Tick_img.png";
import Time from "../../assets/orderplaced/Time_img.png";

import Button from "../../components/Button/Button";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../utils/imageLoader";

const OrderPlaced = () => {
  const { cartItems } = useCart();

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
  const shipping = cartItems.length > 0 ? 1000 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const progressSteps = [
    { img: Tick, title: "Order Received", desc: "We have received your bulk request. Supplier notification sent immediately.", completed: true },
    { img: Time, title: "Farmer Confirmation", desc: "The supplier will confirm stock availability and pickup readiness.", completed: false },
    { title: "Logistics Scheduled", desc: "If selected during checkout, transport will be assigned automatically.", completed: false },
    { title: "Invoice Shared", desc: "Final invoice sent via email & available on your dashboard.", completed: false }
  ];

  return (
    <div className="container py-4 py-md-5">
      <div className="row g-3 g-md-4">
        <div className="col-12 col-lg-8">
          <div className="card p-4 p-md-5 text-center mb-3 mb-md-4" style={{ borderRadius: '12px', border: '1px solid #E5E5E5' }}>
            <img src={Centertick} alt="Order Placed Successfully" width="56" height="56" className="mx-auto mb-3" />
            <h2 className="mb-2">Order Placed Successfully!</h2>
            <p className="text-muted mb-3">
              Thank you for choosing AgriTrade. Your bulk order has been securely forwarded to the supplier.
            </p>
            <span className="px-4 py-2 rounded-pill border d-inline-block">Order ID : AGT-ORD-2451</span>
          </div>

          <div className="card p-3 p-md-4 mb-3 mb-md-4" style={{ borderRadius: '12px', border: '1px solid #E5E5E5' }}>
            <h4 className="mb-4">What Happens Next?</h4>

            <div className="position-relative ps-4">
              <div style={{ position: "absolute", left: "8px", top: "6px", bottom: "6px", width: "2px", backgroundColor: "#4CAF50" }} />

              {progressSteps.map((step, idx) => (
                <div key={idx} className={`d-flex align-items-start ${idx !== progressSteps.length - 1 ? 'mb-4' : ''}`}>
                  {step.img ? (
                    <img src={step.img} alt={step.title} width="18" style={{ minWidth: '18px' }} />
                  ) : (
                    <span style={{ width: "16px", height: "16px", border: "2px solid #4CAF50", borderRadius: "50%", background: "#fff", minWidth: '16px' }} />
                  )}
                  <div className="ms-3">
                    <h6 className="fw-semibold mb-1">{step.title}</h6>
                    <small className="text-muted">{step.desc}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-center align-items-stretch align-items-sm-center gap-3">
            <Button text="Track Order" route="/track-order" />
            <Button text="Download Invoice" route="/download-invoice" variant="outline" />
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
              <span style={{ fontSize: '14px', color: '#565656' }}>Transport charges (Est.)</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>₹ {shipping.toLocaleString('en-IN')}</span>
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

            <div className="border rounded p-3" style={{ borderRadius: '8px', background: '#F9F9F9' }}>
              <h6 className="fw-bold mb-2">Shipping Details</h6>
              <small className="text-muted d-block">
                #405, ALLURI TRADE CENTRE<br />
                BHAGYANAGAR COLONY KUKATPALLY<br />
                HYDERABAD 500072
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;