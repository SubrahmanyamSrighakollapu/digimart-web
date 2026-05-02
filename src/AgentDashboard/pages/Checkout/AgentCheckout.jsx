import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MapPin, User, Phone, Hash, FileText, ArrowLeft, Lock, CheckCircle, Truck, Shield } from 'lucide-react';

const P  = '#EC5B13';
const PL = '#FEF0E9';
const G  = '#32a862';
const GL = '#e6f7ed';

const inp = {
  width: '100%', padding: '11px 14px', border: '1px solid #e5e7eb',
  borderRadius: '9px', fontSize: '14px', outline: 'none',
  backgroundColor: '#fff', color: '#1c1917', boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const Field = ({ label, icon: Icon, required, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px' }}>
      {Icon && <Icon size={12} color={P} />}
      {label}{required && <span style={{ color: P }}>*</span>}
    </label>
    {children}
  </div>
);

const AgentCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutData = location.state || {};

  const [formData, setFormData] = useState({ userGSTNo: '', deliveryPersonName: '', deliveryPersonNo: '', deliveryAddress: '', deliveryStatePin: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async () => {
    const { deliveryPersonName, deliveryPersonNo, deliveryAddress, deliveryStatePin } = formData;
    if (!deliveryPersonName || !deliveryPersonNo || !deliveryAddress || !deliveryStatePin) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/initiateProductPurchaseOrder`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...checkoutData, ...formData }),
      });
      const data = await res.json();
      if (data.status === 1) {
        toast.success('Order placed successfully!');
        // Store order identifiers for invoice retrieval after payment redirect
        sessionStorage.setItem('lastOrderId',   String(data.result.orderId   ?? ''));
        sessionStorage.setItem('lastOrderCode', String(data.result.orderCode ?? ''));
        window.open(data.result.checkoutUrl, '_blank');
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const summaryRows = [
    { label: 'Products Total', value: `₹${checkoutData.productsTotal?.toFixed(2) || '0.00'}` },
    { label: 'GST',            value: `₹${checkoutData.gstTotal?.toFixed(2) || '0.00'}` },
    { label: 'Subtotal',       value: `₹${checkoutData.subtotal?.toFixed(2) || '0.00'}`, bold: true },
    ...(checkoutData.commissionRate > 0 ? [{ label: `Platform Fee (${checkoutData.commissionRate}%)`, value: `₹${checkoutData.commissionAmount?.toFixed(2) || '0.00'}` }] : []),
  ];

  const requiredFields = ['deliveryPersonName', 'deliveryPersonNo', 'deliveryAddress', 'deliveryStatePin'];
  const filledCount = requiredFields.filter(k => formData[k].trim()).length;
  const allFilled = filledCount === requiredFields.length;

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Back */}
      <button onClick={() => navigate('/agent/cart')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px', padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer', transition: 'all 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = P; e.currentTarget.style.color = P; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
      >
        <ArrowLeft size={15} /> Back to Cart
      </button>

      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `linear-gradient(135deg, ${P}, #F07030)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lock size={18} color="white" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1c1917' }}>Secure Checkout</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>Complete your delivery details to place the order</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

        {/* Delivery Form */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', background: `linear-gradient(135deg, ${PL}, #fff)`, borderBottom: '1px solid #f0ede9', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: PL, border: `1px solid ${P}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={15} color={P} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Delivery Details</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>GST is optional, other fields are required</p>
            </div>
          </div>

          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <Field label="GST Number" icon={Hash}>
              <input name="userGSTNo" value={formData.userGSTNo} onChange={handleChange} placeholder="e.g. 22AAAAA0000A1Z5" style={inp}
                onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </Field>

            <Field label="Delivery Person Name" icon={User} required>
              <input name="deliveryPersonName" value={formData.deliveryPersonName} onChange={handleChange} placeholder="Enter full name" style={inp}
                onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </Field>

            <Field label="Delivery Person Phone" icon={Phone} required>
              <input name="deliveryPersonNo" value={formData.deliveryPersonNo} onChange={handleChange} placeholder="10-digit mobile number" style={inp}
                onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </Field>

            <Field label="State PIN Code" icon={Hash} required>
              <input name="deliveryStatePin" value={formData.deliveryStatePin} onChange={handleChange} placeholder="6-digit PIN code" maxLength={6} style={inp}
                onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
              />
            </Field>

            <div style={{ gridColumn: '1 / -1' }}>
              <Field label="Delivery Address" icon={MapPin} required>
                <textarea name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} placeholder="Enter complete delivery address including street, city, state" rows={3}
                  style={{ ...inp, resize: 'vertical', minHeight: '80px' }}
                  onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </Field>
            </div>
          </div>

          {/* Progress indicator */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #f0ede9', backgroundColor: '#faf8f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '4px', backgroundColor: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(filledCount / requiredFields.length) * 100}%`, backgroundColor: P, borderRadius: '999px', transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
              {filledCount}/{requiredFields.length} fields filled
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f0ede9', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', background: `linear-gradient(135deg, ${PL}, #fff)`, borderBottom: '1px solid #f0ede9' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1c1917' }}>Order Summary</h3>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {summaryRows.map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '14px', fontWeight: row.bold ? 700 : 400, color: row.bold ? '#1c1917' : '#6b7280', borderBottom: row.bold ? '1px solid #f0ede9' : 'none', marginBottom: row.bold ? '4px' : 0 }}>
                  <span>{row.label}</span><span>{row.value}</span>
                </div>
              ))}

              {/* Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: PL, borderRadius: '10px', margin: '12px 0' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Total</span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: P }}>₹{checkoutData.total?.toFixed(2) || '0.00'}</span>
              </div>

              <p style={{ margin: '0 0 16px', fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>Includes all applicable taxes</p>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !allFilled}
                style={{ width: '100%', padding: '13px', backgroundColor: allFilled && !loading ? P : '#d1d5db', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: allFilled && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: allFilled ? `0 4px 14px rgba(236,91,19,0.3)` : 'none', transition: 'all 0.15s', marginBottom: '16px' }}
                onMouseEnter={e => { if (allFilled && !loading) e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                {loading ? 'Placing Order...' : <><Lock size={15} /> Place Order</>}
              </button>

              {/* Trust */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #f0ede9', paddingTop: '16px' }}>
                {[
                  { icon: Shield,      label: 'Secure Checkout',  sub: 'SSL encrypted & safe' },
                  { icon: Truck,       label: 'Tracked Delivery', sub: 'Real-time updates' },
                  { icon: CheckCircle, label: 'Quality Assured',  sub: 'Verified produce' },
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
  );
};

export default AgentCheckout;
