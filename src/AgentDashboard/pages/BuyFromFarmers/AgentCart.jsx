import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Trash2, ShoppingCart, ArrowRight, Package, Shield, Truck, CheckCircle, CreditCard, Info, X } from 'lucide-react';
import productService from '../../../services/productService';

const P  = '#EC5B13';
const PL = '#FEF0E9';
const G  = '#32a862';
const GL = '#e6f7ed';

const inp = {
  width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb',
  borderRadius: '8px', fontSize: '14px', outline: 'none',
  backgroundColor: '#fff', color: '#1c1917', boxSizing: 'border-box',
};

const AgentCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems]       = useState([]);
  const [loading, setLoading]           = useState(false);
  const [deleteCartId, setDeleteCartId] = useState(null);
  const [gateways, setGateways]         = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [paymentDetails, setPaymentDetails]   = useState([]);
  const [selectedMethod, setSelectedMethod]   = useState('');
  const [selectedOption, setSelectedOption]   = useState('');
  const [loadingPayment, setLoadingPayment]   = useState(false);

  useEffect(() => { fetchCartItems(); fetchGateways(); }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await productService.getCartItems();
      if (res?.status === 1 && res.result) setCartItems(res.result);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to fetch cart'); }
    finally { setLoading(false); }
  };

  const getImagePath = (img) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    return `${import.meta.env.VITE_API_BASE_URL}/${img.replace(/\\/g, '/')}`;
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await productService.removeFromCart(deleteCartId);
      if (res?.status === 1) { toast.success('Item removed'); setDeleteCartId(null); fetchCartItems(); }
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to remove item'); }
  };

  const fetchGateways = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/getAgentGatewayCommission`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 1 && data.result) setGateways(data.result);
    } catch {}
  };

  const fetchPaymentDetails = async (planConfigId) => {
    try {
      setLoadingPayment(true);
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/getAgentPaymentCommissionDetails?configId=${planConfigId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 1 && data.result) { setPaymentDetails(data.result); setSelectedMethod(''); setSelectedOption(''); }
    } catch { toast.error('Failed to fetch payment details'); }
    finally { setLoadingPayment(false); }
  };

  const handleGatewayChange = (val) => {
    setSelectedGateway(val);
    if (val) {
      const gw = gateways.find(g => g.gatewayId === parseInt(val));
      if (gw) fetchPaymentDetails(gw.planConfigId);
    } else { setPaymentDetails([]); setSelectedMethod(''); setSelectedOption(''); }
  };

  const getUniqueMethods = () => {
    const m = {};
    paymentDetails.forEach(d => { if (!m[d.methodId]) m[d.methodId] = d.methodName; });
    return Object.entries(m).map(([id, name]) => ({ id: parseInt(id), name }));
  };

  const getOptionsForMethod = (methodId) => paymentDetails.filter(d => d.methodId === parseInt(methodId));

  const totals = () => {
    const productsTotal = cartItems.reduce((s, i) => s + parseFloat(i.unitsTotalPrice), 0);
    const gstTotal      = cartItems.reduce((s, i) => s + parseFloat(i.gSTAmount), 0);
    const subtotal      = productsTotal + gstTotal;
    let commissionRate = 0, commissionAmount = 0;
    if (selectedOption) {
      const d = paymentDetails.find(d => d.methodOptionId === parseInt(selectedOption));
      if (d) { commissionRate = parseFloat(d.planCommission); commissionAmount = (subtotal * commissionRate) / 100; }
    }
    return { productsTotal, gstTotal, subtotal, commissionRate, commissionAmount, total: subtotal + commissionAmount };
  };

  const { productsTotal, gstTotal, subtotal, commissionRate, commissionAmount, total } = totals();

  const handleProceedToCheckout = () => {
    navigate('/agent/checkout', {
      state: {
        gatewayId: parseInt(selectedGateway), methodId: parseInt(selectedMethod),
        methodOptionId: parseInt(selectedOption), cartIds: cartItems.map(i => i.cartId).join(','),
        productsTotal, gstTotal, subtotal, commissionRate, commissionAmount, total,
      }
    });
  };

  const canCheckout = selectedGateway && selectedMethod && selectedOption && cartItems.length > 0;

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `linear-gradient(135deg, ${P}, #F07030)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingCart size={18} color="white" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1c1917' }}>Shopping Cart</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div style={{ width: '40px', height: '40px', border: `3px solid ${PL}`, borderTopColor: P, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0ede9' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: PL, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ShoppingCart size={32} color={P} />
          </div>
          <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#1c1917' }}>Your cart is empty</h3>
          <p style={{ margin: '0 0 24px', color: '#9ca3af' }}>Add products from the marketplace to get started</p>
          <button onClick={() => navigate('/agent/buy-from-farmers')} style={{ padding: '12px 28px', backgroundColor: P, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            Browse Products
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Cart Items Table */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0ede9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Cart Items</h3>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{cartItems.length} products</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#faf8f6' }}>
                      {['Product', 'Category', 'Qty', 'Unit Price', 'GST', 'Total', ''].map(h => (
                        <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: P, borderBottom: '1px solid #f0ede9', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, i) => (
                      <tr key={item.cartId} style={{ borderBottom: i < cartItems.length - 1 ? '1px solid #faf8f6' : 'none' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf8f6'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', backgroundColor: PL, flexShrink: 0 }}>
                              {getImagePath(item.productImages)
                                ? <img src={getImagePath(item.productImages)} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={20} color={P} /></div>
                              }
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1c1917' }}>{item.productName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px', fontSize: '13px', color: '#6b7280' }}>{item.categoryName}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '32px', height: '28px', padding: '0 10px', backgroundColor: PL, color: P, borderRadius: '6px', fontSize: '13px', fontWeight: 700 }}>
                            {item.noOfQuantity}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: 600, color: '#1c1917' }}>₹{parseFloat(item.unitPrice).toFixed(2)}</td>
                        <td style={{ padding: '14px 18px', fontSize: '13px', color: '#6b7280' }}>₹{parseFloat(item.gSTAmount).toFixed(2)}</td>
                        <td style={{ padding: '14px 18px', fontSize: '14px', fontWeight: 700, color: P }}>₹{parseFloat(item.lineItemTotal).toFixed(2)}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <button onClick={() => setDeleteCartId(item.cartId)} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fee2e2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fecaca'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                          >
                            <Trash2 size={14} color="#dc2626" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Create Customer Order Card ─────────────────── */}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              {/* Card Header */}
              <div style={{ padding: '16px 22px', background: `linear-gradient(135deg, ${P} 0%, #F07030 100%)`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>+</div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'white' }}>Customer Details</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.75)' }}>Please enter customer details</p>
                </div>
              </div>

              <div style={{ padding: '20px 22px' }}>
                {/* Customer Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f0ede9' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: PL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Details</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' }}>
                  <input placeholder="Customer name" style={{ ...inp, fontSize: '13px' }}
                    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input placeholder="Contact No." style={{ ...inp, fontSize: '13px' }}
                      onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                    <input placeholder="Zip Code" style={{ ...inp, fontSize: '13px' }}
                      onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Product Details */}
                {/* <div style={{ display: 'flex', alignItems: 'center', gap: '7px', margin: '16px 0 12px', paddingBottom: '8px', borderBottom: '1px solid #f0ede9' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: PL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Details</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '4px' }}>
                  <input placeholder="Enter Crop Type" style={{ ...inp, fontSize: '13px' }}
                    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input placeholder="Qty (e.g. 2 Tons)" style={{ ...inp, fontSize: '13px' }}
                      onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                    <input placeholder="Grade Type" style={{ ...inp, fontSize: '13px' }}
                      onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <input type="date" style={{ ...inp, fontSize: '13px', color: '#6b7280' }}
                    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  />
                </div> */}

                {/* Pricing */}
                {/* <div style={{ display: 'flex', alignItems: 'center', gap: '7px', margin: '16px 0 12px', paddingBottom: '8px', borderBottom: '1px solid #f0ede9' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: PL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pricing</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                  <input placeholder="Selling price (₹)" style={{ ...inp, fontSize: '13px' }}
                    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  />
                  <input placeholder="Est. Margin (%)" style={{ ...inp, fontSize: '13px' }}
                    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  />
                </div> */}

                {/* <button style={{ width: '100%', padding: '11px', backgroundColor: P, color: 'white', border: 'none', borderRadius: '9px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: `0 4px 12px rgba(236,91,19,0.28)`, transition: 'opacity 0.15s, transform 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  → Submit Order
                </button> */}
              </div>
            </div>

            {/* Payment Options — blurred until gateway selected */}
            <div style={{ position: 'relative', borderRadius: '16px' }}>
              {!selectedGateway && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderRadius: '16px', border: '1.5px dashed #f0ede9',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  pointerEvents: 'none',
                }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: PL, border: `2px solid ${P}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>Waiting for Gateway</p>
                  {/* <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', textAlign: 'center', maxWidth: '220px', lineHeight: 1.5 }}>Please select a payment gateway to unlock payment options</p> */}
                </div>
              )}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: PL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={15} color={P} />
                </div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Payment Options</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                {/* Gateway */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Gateway</label>
                  <select value={selectedGateway} onChange={e => handleGatewayChange(e.target.value)} style={{ ...inp }}
                    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="">Select Gateway</option>
                    {gateways.map(gw => <option key={gw.gatewayId} value={gw.gatewayId}>{gw.gatewayName}</option>)}
                  </select>
                </div>

                {/* Method */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Method</label>
                  <select value={selectedMethod} onChange={e => { setSelectedMethod(e.target.value); setSelectedOption(''); }} disabled={!paymentDetails.length} style={{ ...inp, opacity: !paymentDetails.length ? 0.5 : 1 }}
                    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="">Select Method</option>
                    {getUniqueMethods().map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                {/* Option */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Option</label>
                  <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)} disabled={!selectedMethod} style={{ ...inp, opacity: !selectedMethod ? 0.5 : 1 }}
                    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                    onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="">Select Option</option>
                    {getOptionsForMethod(selectedMethod).map(o => <option key={o.planCommissionsId} value={o.methodOptionId}>{o.optionName}</option>)}
                  </select>
                </div>
              </div>

              {/* Platform Fee Table */}
              {selectedGateway && paymentDetails.length > 0 && (
                <div style={{ marginTop: '20px', borderRadius: '10px', border: '1px solid #f0ede9', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', backgroundColor: '#faf8f6', borderBottom: '1px solid #f0ede9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1c1917' }}>Platform Fee Details</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Select an option above to apply</span>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#faf8f6' }}>
                        {['Method', 'Option', 'Fee %'].map(h => (
                          <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#9ca3af', borderBottom: '1px solid #f0ede9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paymentDetails.map(d => {
                        const isSelected = selectedOption == d.methodOptionId;
                        return (
                          <tr key={d.planCommissionsId} style={{ backgroundColor: isSelected ? GL : 'transparent', borderBottom: '1px solid #faf8f6', transition: 'background 0.12s' }}>
                            <td style={{ padding: '10px 16px' }}>
                              <span style={{ padding: '3px 10px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>{d.methodName}</span>
                            </td>
                            <td style={{ padding: '10px 16px', fontSize: '13px', color: '#374151' }}>{d.optionName}</td>
                            <td style={{ padding: '10px 16px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? G : '#374151' }}>{d.planCommission}%</span>
                              {isSelected && <span style={{ marginLeft: '6px', fontSize: '10px', color: G, fontWeight: 600 }}>✓ Selected</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{ padding: '12px 16px', backgroundColor: '#eff6ff', borderTop: '1px solid #bfdbfe', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Info size={14} color="#1e40af" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ margin: 0, fontSize: '12px', color: '#1e40af', lineHeight: 1.5 }}>
                      Platform fee is calculated on the subtotal and added to your total. Select your preferred payment option above.
                    </p>
                  </div>
                </div>
              )}
              </div>
            </div>{/* end payment blur wrapper */}
          </div>{/* end left column */}

          {/* Right: Order Summary — blurred until gateway selected */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <div style={{ position: 'relative', borderRadius: '16px' }}>
              {!selectedGateway && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
                  backgroundColor: 'rgba(255,255,255,0.62)',
                  borderRadius: '16px', border: '1.5px dashed #f0ede9',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  pointerEvents: 'none',
                }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: PL, border: `2px solid ${P}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>Awaiting Gateway</p>
                  {/* <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', textAlign: 'center', maxWidth: '200px', lineHeight: 1.5 }}>Select a payment gateway to see your order total and proceed to checkout</p> */}
                </div>
              )}
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0ede9', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '18px 24px', background: `linear-gradient(135deg, ${PL}, #fff)`, borderBottom: '1px solid #f0ede9' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1c1917' }}>Order Summary</h3>
              </div>

              <div style={{ padding: '20px 24px' }}>
                {/* Line items */}
                {[
                  { label: 'Products Total', value: `₹${productsTotal.toFixed(2)}` },
                  { label: 'GST', value: `₹${gstTotal.toFixed(2)}` },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '14px', color: '#6b7280' }}>
                    <span>{row.label}</span><span>{row.value}</span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px', fontWeight: 700, color: '#1c1917', borderTop: '1px solid #f0ede9', borderBottom: '1px solid #f0ede9', margin: '4px 0' }}>
                  <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                </div>

                {selectedOption && commissionRate > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '14px', color: '#6b7280' }}>
                    <span>Platform Fee ({commissionRate}%)</span>
                    <span>₹{commissionAmount.toFixed(2)}</span>
                  </div>
                )}

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: PL, borderRadius: '10px', margin: '12px 0' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Total</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: P }}>₹{total.toFixed(2)}</span>
                </div>

                <p style={{ margin: '0 0 16px', fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>Includes all applicable taxes</p>

                {/* CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  disabled={!canCheckout}
                  style={{ width: '100%', padding: '13px', backgroundColor: canCheckout ? P : '#d1d5db', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: canCheckout ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: canCheckout ? `0 4px 14px rgba(236,91,19,0.3)` : 'none', transition: 'all 0.15s', marginBottom: '10px' }}
                  onMouseEnter={e => { if (canCheckout) e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>

                {!canCheckout && (
                  <p style={{ margin: '0 0 14px', fontSize: '11px', color: '#f59e0b', textAlign: 'center', fontWeight: 500 }}>
                    Select gateway, method & option to continue
                  </p>
                )}

                {/* Trust badges */}
                <div style={{ borderTop: '1px solid #f0ede9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { icon: Shield,       label: 'Secure Payment',  sub: 'SSL encrypted checkout' },
                    { icon: Truck,        label: 'Fast Delivery',   sub: 'Direct from farm' },
                    { icon: CheckCircle,  label: 'Quality Assured', sub: 'Verified produce' },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: GL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={14} color={G} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#1c1917' }}>{label}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
         </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteCartId && (
        <div onClick={() => setDeleteCartId(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(2px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '380px', maxWidth: '90vw', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={22} color="#dc2626" />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#1c1917' }}>Remove Item</h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280' }}>Are you sure you want to remove this item from your cart?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteCartId(null)} style={{ padding: '10px 24px', backgroundColor: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleConfirmDelete} style={{ padding: '10px 24px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentCart;
