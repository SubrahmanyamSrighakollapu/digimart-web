import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Home, FileText, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getPaymentOrderCode,
  getPaymentOrderId,
  getPaymentToken,
  restorePaymentSessionFromLocalStorage,
} from '../../../utils/paymentSession';

const P = '#EC5B13';

const PaymentFallback = () => {
  const navigate = useNavigate();
  const called = useRef(false);
  const [invoice, setInvoice] = useState(null);
  const [gstInvoice, setGstInvoice] = useState(null);
  const [downloadingType, setDownloadingType] = useState('');

  // Parse params directly from window.location — most reliable for payment gateway redirects
  const params = new URLSearchParams(window.location.search);
  const merchantOrderId = params.get('orderId');  // from payment gateway URL param
  const status = params.get('status')?.toUpperCase();
  const isSuccess = status === 'SUCCESS';

  // Build invoice payload — priority: merchantOrderId > orderCode > orderId
  const buildInvoicePayload = () => {
    const orderCode = getPaymentOrderCode();
    const orderId   = getPaymentOrderId();
    if (merchantOrderId) return { orderId: 0,  orderCode: '',   merchantOrderId };
    if (orderCode)       return { orderId: 0,  orderCode,       merchantOrderId: '' };
    return                      { orderId,     orderCode: '',   merchantOrderId: '' };
  };

  const fetchInvoiceData = async (endpoint) => {
    const token = getPaymentToken();
    const payload = buildInvoicePayload();
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (data.status === 1) return data.result;
    throw new Error(data.message || 'Failed to fetch invoice');
  };

  // Keep orderId string for display badge (from URL param)
  const displayOrderId = merchantOrderId || getPaymentOrderCode() || String(getPaymentOrderId() || '') || '—';

  console.log('[PaymentFallback] raw search:', window.location.search);
  console.log('[PaymentFallback] merchantOrderId:', merchantOrderId, '| status:', status, '| isSuccess:', isSuccess);

  useEffect(() => {
    console.log('[PaymentFallback] useEffect — merchantOrderId:', merchantOrderId, 'called:', called.current);
    if (called.current) return;
    called.current = true;

    restorePaymentSessionFromLocalStorage();

    const token = getPaymentToken();
    const payload = buildInvoicePayload();
    console.log('[PaymentFallback] token present:', !!token);
    console.log('[PaymentFallback] invoice payload:', payload);

    // Notify backend — commented out, not required
    // fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/verifyPayInPaymentStatus`, {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     orderId: merchantOrderId || '',
    //     rawPayload: 'N/A',
    //     rawPayloadResponse: 'N/A',
    //     paymentStatus: isSuccess ? 'success' : 'failure',
    //     isSuccess,
    //   }),
    // })
    //   .then(r => r.json())
    //   .then(d => console.log('[PaymentFallback] verifyPayment response:', d))
    //   .catch(e => console.error('[PaymentFallback] verifyPayment error:', e));

    // Fetch invoice only on success using POST
    if (isSuccess) {
      Promise.allSettled([
        fetchInvoiceData('/api/payment/invoice/details'),
        fetchInvoiceData('/api/payment/gst-invoice/details'),
      ])
        .then(([purchaseResult, gstResult]) => {
          if (purchaseResult.status === 'fulfilled') {
            console.log('[PaymentFallback] invoice response:', purchaseResult.value);
            setInvoice(purchaseResult.value);
          } else {
            console.error('[PaymentFallback] invoice fetch error:', purchaseResult.reason);
          }

          if (gstResult.status === 'fulfilled') {
            console.log('[PaymentFallback] GST invoice response:', gstResult.value);
            setGstInvoice(gstResult.value);
          } else {
            console.error('[PaymentFallback] GST invoice fetch error:', gstResult.reason);
          }
        })
        .catch(e => console.error('[PaymentFallback] invoice fetch error:', e));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = async (type) => {
    const isGst = type === 'gst';
    const currentInvoice = isGst ? gstInvoice : invoice;
    const endpoint = isGst ? '/api/payment/gst-invoice/download' : '/api/payment/invoice/download';
    const filePrefix = isGst ? 'GST_Invoice' : 'Invoice';
    const successMessage = isGst ? 'GST invoice downloaded successfully' : 'Invoice downloaded successfully';
    const errorMessage = isGst ? 'Failed to download GST invoice' : 'Failed to download invoice';

    try {
      setDownloadingType(type);
      const token = getPaymentToken();
      const payload = buildInvoicePayload();
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filePrefix}_${currentInvoice?.invoiceCode || displayOrderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(successMessage);
      } else {
        toast.error(errorMessage);
      }
    } catch {
      toast.error(errorMessage);
    } finally {
      setDownloadingType('');
    }
  };

  // Safety: if status missing entirely, show error
  if (!status) {
    console.warn('[PaymentFallback] Missing status in URL');
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Invalid payment callback. Missing status.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#faf9f8', fontFamily: "'Inter','Segoe UI',sans-serif", padding: '24px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', padding: '48px 40px', maxWidth: '460px', width: '100%', textAlign: 'center' }}>

        {/* Icon */}
        <div style={{ width: '88px', height: '88px', borderRadius: '50%', backgroundColor: isSuccess ? '#e6f7ed' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          {isSuccess
            ? <CheckCircle size={44} color="#16a34a" strokeWidth={1.8} />
            : <XCircle size={44} color="#dc2626" strokeWidth={1.8} />
          }
        </div>

        {/* Title */}
        <h2 style={{ margin: '0 0 10px', fontSize: '24px', fontWeight: 800, color: '#1c1917' }}>
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </h2>
        <p style={{ margin: '0 0 28px', fontSize: '15px', color: '#6b7280', lineHeight: 1.6 }}>
          {isSuccess
            ? 'Your order has been placed and payment received. You will receive a confirmation shortly.'
            : 'Your payment could not be processed. Please try again or use a different payment method.'}
        </p>

        {/* Order ID badge */}
        <div style={{ backgroundColor: '#faf8f6', border: '1px solid #f0ede9', borderRadius: '10px', padding: '12px 20px', marginBottom: '28px', display: 'inline-block' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</span>
          <p style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>{displayOrderId}</p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isSuccess ? (
            <>
              <button
                onClick={() => navigate('/agent/view-invoice', { state: { merchantOrderId, orderCode: getPaymentOrderCode(), orderId: getPaymentOrderId(), preferredInvoiceType: 'purchase' } })}
                style={{ width: '100%', padding: '13px', backgroundColor: P, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(236,91,19,0.3)' }}
              >
                <FileText size={16} /> View Invoice
              </button>
              <button
                onClick={() => navigate('/agent/view-invoice', { state: { merchantOrderId, orderCode: getPaymentOrderCode(), orderId: getPaymentOrderId(), preferredInvoiceType: 'gst' } })}
                style={{ width: '100%', padding: '13px', backgroundColor: '#fff', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <FileText size={16} /> View GST Invoice
              </button>
              <button
                onClick={() => handleDownload('purchase')}
                disabled={downloadingType === 'purchase'}
                style={{ width: '100%', padding: '13px', backgroundColor: '#fff', color: '#16a34a', border: '2px solid #16a34a', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: downloadingType === 'purchase' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: downloadingType === 'purchase' ? 0.7 : 1 }}
              >
                <Download size={16} /> {downloadingType === 'purchase' ? 'Downloading...' : 'Download Invoice'}
              </button>
              <button
                onClick={() => handleDownload('gst')}
                disabled={downloadingType === 'gst'}
                style={{ width: '100%', padding: '13px', backgroundColor: '#fff', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: downloadingType === 'gst' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: downloadingType === 'gst' ? 0.7 : 1 }}
              >
                <Download size={16} /> {downloadingType === 'gst' ? 'Downloading...' : 'Download GST Invoice'}
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/agent/cart')}
              style={{ width: '100%', padding: '13px', backgroundColor: P, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(236,91,19,0.3)' }}
            >
              Try Again <ArrowRight size={16} />
            </button>
          )}
          <button
            onClick={() => navigate('/agent')}
            style={{ width: '100%', padding: '13px', backgroundColor: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Home size={15} /> Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFallback;
