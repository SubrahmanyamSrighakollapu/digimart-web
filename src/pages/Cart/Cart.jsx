// src/pages/Cart/Cart.jsx
import { File, Minus, Plus, Trash2, Lock, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Check from '../../assets/cart/Check_img.png';
import Delivery from '../../assets/cart/Delivery_img.png';
import Security from '../../assets/cart/Security_img.png';
import Button from '../../components/Button/Button';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageLoader';

const isLoggedIn = () => !!sessionStorage.getItem('token');

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeItem } = useCart();
  const loggedIn = false;

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
  const tax = subtotal * 0.05;
  const shipping = cartItems.length > 0 ? 1000 : 0;
  const total = subtotal + tax + shipping;

  // ── Not logged in: show blur + login prompt ──────────────
  if (!loggedIn) {
    return (
      <div style={{ position: 'relative', minHeight: '80vh', overflow: 'hidden' }}>
        {/* Blurred skeleton background */}
        <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', padding: '40px 24px', opacity: 0.55 }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
              <div style={{ height: '20px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '30%', marginBottom: '24px' }} />
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '8px', backgroundColor: '#f3f4f6', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '10px', width: '55%' }} />
                    <div style={{ height: '12px', backgroundColor: '#f3f4f6', borderRadius: '4px', width: '35%' }} />
                  </div>
                  <div style={{ width: '80px', height: '36px', backgroundColor: '#f3f4f6', borderRadius: '6px' }} />
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
              <div style={{ height: '18px', backgroundColor: '#e5e7eb', borderRadius: '4px', width: '50%', marginBottom: '20px' }} />
              {[1, 2, 3].map(i => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ height: '12px', backgroundColor: '#f3f4f6', borderRadius: '4px', width: '45%' }} />
                  <div style={{ height: '12px', backgroundColor: '#f3f4f6', borderRadius: '4px', width: '25%' }} />
                </div>
              ))}
              <div style={{ height: '44px', backgroundColor: '#fddccc', borderRadius: '10px', marginTop: '20px' }} />
            </div>
          </div>
        </div>

        {/* Login overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.5)',
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '20px', padding: '44px 36px',
            textAlign: 'center', maxWidth: '400px', width: '90%',
            boxShadow: '0 20px 60px rgba(236,91,19,0.18)', border: '1px solid #f0ede9',
          }}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: '#FEF0E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ShoppingCart size={30} color="#EC5B13" />
            </div>
            <h3 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: 800, color: '#1c1917' }}>Your Cart Awaits</h3>
            <p style={{ margin: '0 0 6px', fontSize: '15px', color: '#6b7280', lineHeight: 1.6 }}>
              Please log in to view your cart and place your order.
            </p>
            <p style={{ margin: '0 0 28px', fontSize: '13px', color: '#9ca3af' }}>
              Your saved items will be ready when you sign in.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%', padding: '14px', backgroundColor: '#EC5B13',
                color: 'white', border: 'none', borderRadius: '12px',
                fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 16px rgba(236,91,19,0.3)', marginBottom: '12px',
              }}
            >
              <Lock size={16} /> Login to Access Cart
            </button>
            {/* <button
              onClick={() => navigate('/signup')}
              style={{
                width: '100%', padding: '12px', backgroundColor: 'transparent',
                color: '#EC5B13', border: '1.5px solid #EC5B13', borderRadius: '12px',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              }}
            >
              Create an Account
            </button> */}
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <h2 className="mb-4">Your Cart is Empty</h2>
          <p className="text-muted mb-4">Add some products to your cart to get started!</p>
          <Button text="Continue Shopping" route="/shop" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="row g-3 g-md-4">
        <div className="col-12 col-lg-8">
          <h2 className="mb-3 mb-md-4">Your Cart</h2>

          {/* Desktop View */}
          <div className="card p-3 mb-3 mb-md-4 d-none d-md-block" style={{ borderRadius: '8px', border: '1px solid #E5E5E5' }}>
            <div className="row mb-3 pb-2 border-bottom">
              <div className="col-1"></div>
              <div className="col-4"><h6 className="mb-0 fw-semibold">Product</h6></div>
              <div className="col-2"><h6 className="mb-0 fw-semibold">Bag Size</h6></div>
              <div className="col-2"><h6 className="mb-0 fw-semibold">Quantity</h6></div>
              <div className="col-2"><h6 className="mb-0 fw-semibold">Price</h6></div>
              <div className="col-1"></div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="row align-items-center border-bottom py-3">
                <div className="col-1">
                  <img
                    src={getImagePath(item.img)}
                    alt={item.title}
                    style={{
                      width: '5rem',
                      height: '3rem',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div className="col-4">
                  <p className="mb-0 text-dark fw-normal" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                    {item.title}
                  </p>
                </div>
                <div className="col-2">
                  <p className="mb-0" style={{ fontSize: '14px', color: '#565656' }}>
                    {item.specifications?.packaging || item.quantity}
                  </p>
                </div>
                <div className="col-2">
                  <div 
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      border: '1px solid #E5E5E5',
                      borderRadius: '4px',
                      width: '100px',
                      height: '40px'
                    }}
                  >
                    <button 
                      className="btn btn-sm px-2"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ border: 'none', background: 'transparent', padding: '0' }}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3" style={{ fontSize: '14px' }}>
                      {item.quantity}
                    </span>
                    <button 
                      className="btn btn-sm px-2"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ border: 'none', background: 'transparent', padding: '0' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="col-2">
                  <p className="mb-0 fw-semibold" style={{ color: '#000000', fontSize: '14px' }}>
                    ₹{(parseFloat(item.price.replace(/,/g, '')) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="col-1 text-end">
                  <button
                    className="btn btn-sm p-0"
                    onClick={() => removeItem(item.id)}
                    style={{ border: 'none', background: 'transparent' }}
                  >
                    <Trash2 size={20} color="#565656" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="d-md-none">
            {cartItems.map((item) => (
              <div key={item.id} className="card p-3 mb-3" style={{ borderRadius: '8px', border: '1px solid #E5E5E5' }}>
                <div className="d-flex gap-3 mb-3">
                  <img
                    src={getImagePath(item.img)}
                    alt={item.title}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      minWidth: '80px'
                    }}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-2 text-dark fw-semibold" style={{ fontSize: '14px' }}>
                      {item.title}
                    </p>
                    <p className="mb-2 text-muted" style={{ fontSize: '13px' }}>
                      Bag Size: {item.specifications?.packaging || item.quantity}
                    </p>
                    <p className="mb-0 fw-bold" style={{ color: '#EC5B13', fontSize: '16px' }}>
                      ₹{(parseFloat(item.price.replace(/,/g, '')) * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div 
                    className="d-flex align-items-center"
                    style={{
                      border: '1px solid #E5E5E5',
                      borderRadius: '4px',
                      width: '110px',
                      height: '40px'
                    }}
                  >
                    <button 
                      className="btn btn-sm px-2"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ border: 'none', background: 'transparent', padding: '0' }}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3" style={{ fontSize: '14px' }}>
                      {item.quantity}
                    </span>
                    <button 
                      className="btn btn-sm px-2"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ border: 'none', background: 'transparent', padding: '0' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    className="btn btn-sm"
                    onClick={() => removeItem(item.id)}
                    style={{ border: 'none', background: 'transparent', padding: '8px' }}
                  >
                    <Trash2 size={20} color="#dc3545" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center gap-3" style={{ maxWidth: '600px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Have a coupon code?"
              style={{
                height: '48px',
                borderRadius: '8px',
                border: '1px solid #E5E5E5'
              }}
            />
            <button
              className="btn"
              style={{
                height: '48px',
                minWidth: '100px',
                background: '#EC5B13',
                color: 'white',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none'
              }}
            >
              Apply
            </button>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card p-3 p-md-4" style={{ borderRadius: '12px', border: '1px solid #E5E5E5' }}>
            <h4 className="mb-3 mb-md-4 fw-semibold">Order Summary</h4>

            <div className="d-flex justify-content-between mb-3">
              <p className="mb-0" style={{ color: '#565656', fontSize: '14px' }}>Subtotal</p>
              <p className="mb-0 fw-semibold" style={{ color: '#000000', fontSize: '14px' }}>
                ₹ {subtotal.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <p className="mb-0" style={{ color: '#565656', fontSize: '14px' }}>Transport charges (Est.)</p>
              <p className="mb-0 fw-semibold" style={{ color: '#000000', fontSize: '14px' }}>
                ₹ {shipping.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="d-flex justify-content-between mb-4 pb-3 border-bottom">
              <p className="mb-0" style={{ color: '#565656', fontSize: '14px' }}>GST (5%)</p>
              <p className="mb-0 fw-semibold" style={{ color: '#000000', fontSize: '14px' }}>
                ₹ {Math.round(tax).toLocaleString('en-IN')}
              </p>
            </div>

            <p className="mb-1 small text-muted">Includes all taxes</p>

            <button
              onClick={() => navigate('/cart/checkout')}
              className="btn w-100 mb-3"
              style={{
                background: '#EC5B13',
                color: 'white',
                fontWeight: '600',
                borderRadius: '12px',
                border: 'none',
                padding: '12px',
                fontSize: '16px'
              }}
            >
              → Proceed to Checkout
            </button>

            <div
              className="d-flex align-items-center justify-content-center gap-2 mb-4"
              style={{
                width: '100%',
                height: '40px',
                background: '#F0F5F0',
                borderRadius: '12px',
                padding: '0 16px',
                cursor: 'pointer'
              }}
            >
              <File size={20} color="#000000" strokeWidth={1.5} />
              <p className="mb-0 fw-semibold" style={{ fontSize: '14px', color: '#000000' }}>
                Request Quotation
              </p>
            </div>

            <ul className="list-unstyled mb-0">
              <li className="d-flex align-items-center gap-2 mb-3">
                <img src={Security} alt="Secure Payment" width="24" height="24" />
                <p className="mb-0" style={{ color: '#000000', fontSize: '14px' }}>Secure Payment</p>
              </li>
              <li className="d-flex align-items-center gap-2 mb-3">
                <img src={Delivery} alt="Fast Delivery" width="24" height="24" />
                <p className="mb-0" style={{ color: '#000000', fontSize: '14px' }}>Fast Delivery</p>
              </li>
              <li className="d-flex align-items-center gap-2">
                <img src={Check} alt="Quality Check" width="24" height="24" />
                <p className="mb-0" style={{ color: '#000000', fontSize: '14px' }}>Quality Check</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;