import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Download, ArrowLeft } from 'lucide-react';

const G = '#32a862';

const InvoiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { merchantOrderId, orderCode, orderId } = location.state || {};

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Priority: merchantOrderId > orderCode > orderId
  const buildPayload = () => {
    if (merchantOrderId) return { orderId: 0,            orderCode: '',   merchantOrderId };
    if (orderCode)       return { orderId: 0,            orderCode,       merchantOrderId: '' };
    return                      { orderId: orderId || 0, orderCode: '',   merchantOrderId: '' };
  };

  useEffect(() => { fetchInvoice(); }, []);

  const fetchInvoice = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/invoice/details`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (data.status === 1) setInvoice(data.result);
      else toast.error(data.message || 'Failed to fetch invoice');
    } catch { toast.error('Failed to fetch invoice'); }
    finally { setLoading(false); }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/invoice/download`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invoice?.invoiceCode || 'download'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Invoice downloaded');
      } else toast.error('Failed to download invoice');
    } catch { toast.error('Failed to download invoice'); }
    finally { setDownloading(false); }
  };

  const fmt = (n) => parseFloat(n || 0).toFixed(2);
  const fmtDate = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: `3px solid #e6f7ed`, borderTop: `3px solid ${G}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading invoice...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!invoice) return (
    <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
      <p style={{ fontSize: '16px' }}>No invoice data available.</p>
      <button onClick={() => navigate(-1)} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: G, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Go Back</button>
    </div>
  );

  const paymentStatusColor = invoice.payment?.status === 'SUCCESS' ? G : invoice.payment?.status === 'PENDING' ? '#d97706' : '#dc2626';

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", maxWidth: '900px', margin: '0 auto' }}>

      {/* Top actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={handleDownload} disabled={downloading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: G, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: downloading ? 'not-allowed' : 'pointer', opacity: downloading ? 0.7 : 1 }}>
          <Download size={16} /> {downloading ? 'Downloading...' : 'Download PDF'}
        </button>
      </div>

      {/* Invoice card */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>

        {/* Header — dark banner */}
        <div style={{ backgroundColor: '#1a1f2e', padding: '24px 32px' }}>
          <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>INVOICE</h1>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Invoice #: <strong style={{ color: 'white' }}>{invoice.invoiceCode}</strong></span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Order: <strong style={{ color: 'white' }}>{invoice.orderCode}</strong></span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Date: <strong style={{ color: 'white' }}>{new Date(invoice.orderDate).toLocaleDateString('en-IN')}</strong></span>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* From / To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            {[{ label: 'From', data: invoice.from }, { label: 'To', data: invoice.to }].map(({ label, data }) => (
              <div key={label} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '18px 20px' }}>
                <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                <p style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 700, color: '#1c1917' }}>{data?.name}</p>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}>{data?.address}</p>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}>Phone: {data?.phone}</p>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}>Email: {data?.email}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>GST: {data?.gst}</p>
              </div>
            ))}
          </div>

          {/* Items table */}
          <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700, color: '#1c1917' }}>Invoice Items</h3>
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1f2e' }}>
                  {['S.No', 'Product', 'Amount', 'Platform Fee', 'GST', 'Total'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{item.sNo}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1c1917', fontWeight: 500 }}>
                      {item.productName}
                      <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>{item.productCode}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.amount)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.platformFee)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{item.gst}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1c1917', fontWeight: 600 }}>{fmt(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary — right aligned */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
            <div style={{ width: '320px' }}>
              {[
                { label: 'Subtotal:', value: fmt(invoice.summary?.subtotal) },
                { label: 'Tax on goods (0%):', value: fmt(invoice.summary?.taxOnGoods) },
                { label: 'Platform fee (10%):', value: fmt(invoice.summary?.platformFee) },
                { label: 'GST for Platform fee (10%):', value: fmt(invoice.summary?.gstOnPlatformFee) },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151' }}>
                  <span>{row.label}</span>
                  <span style={{ fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
              {/* Grand Total row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#1a1f2e', borderRadius: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Grand Total:</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{fmt(invoice.summary?.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '20px 24px', marginBottom: '28px' }}>
            <p style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: G }}>Payment Information</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280' }}>Payment Mode</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>{invoice.payment?.mode}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280' }}>Transaction ID</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: G }}>{invoice.payment?.transactionId}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280' }}>Payment Status</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: paymentStatusColor }}>{invoice.payment?.status}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280' }}>Paid On</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>{fmtDate(invoice.payment?.paidOn)}</p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Terms &amp; Conditions:</p>
            {['Payment is due within 30 days', 'Please include invoice number with payment', 'Thank you for your business'].map((t, i) => (
              <p key={i} style={{ margin: '0 0 4px', fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: G, fontWeight: 700 }}>·</span> {t}
              </p>
            ))}
          </div>

          {/* Signature */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-block', borderTop: '1px solid #374151', paddingTop: '8px', minWidth: '180px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>Authorized Signature</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
