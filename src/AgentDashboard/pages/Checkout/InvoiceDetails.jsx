import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Download, ArrowLeft } from 'lucide-react';
import {
  getPaymentOrderCode,
  getPaymentOrderId,
  getPaymentToken,
  restorePaymentSessionFromLocalStorage,
} from '../../../utils/paymentSession';

const G = '#32a862';

const InvoiceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { merchantOrderId, orderCode, orderId, preferredInvoiceType } = location.state || {};

  const [purchaseInvoice, setPurchaseInvoice] = useState(null);
  const [gstInvoice, setGstInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingType, setDownloadingType] = useState('');
  const purchaseInvoiceRef = useRef(null);
  const gstInvoiceRef = useRef(null);

  // Priority: merchantOrderId > orderCode > orderId
  const buildPayload = () => {
    const resolvedOrderCode = orderCode || getPaymentOrderCode();
    const resolvedOrderId = orderId || getPaymentOrderId();
    if (merchantOrderId) return { orderId: 0,            orderCode: '',   merchantOrderId };
    if (resolvedOrderCode) return { orderId: 0,                 orderCode: resolvedOrderCode, merchantOrderId: '' };
    return                       { orderId: resolvedOrderId || 0, orderCode: '',               merchantOrderId: '' };
  };

  const fetchInvoiceData = async (endpoint) => {
    const token = getPaymentToken();
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload()),
    });
    const data = await res.json();
    if (data.status === 1) return data.result;
    throw new Error(data.message || 'Failed to fetch invoice');
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      restorePaymentSessionFromLocalStorage();
      try {
        const [purchaseResult, gstResult] = await Promise.allSettled([
          fetchInvoiceData('/api/payment/invoice/details'),
          fetchInvoiceData('/api/payment/gst-invoice/details'),
        ]);

        if (purchaseResult.status === 'fulfilled') {
          setPurchaseInvoice(purchaseResult.value);
        } else {
          toast.error(purchaseResult.reason?.message || 'Failed to fetch invoice');
        }

        if (gstResult.status === 'fulfilled') {
          setGstInvoice(gstResult.value);
        } else {
          console.error('Failed to fetch GST invoice:', gstResult.reason);
        }
      } catch {
        toast.error('Failed to fetch invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (preferredInvoiceType === 'gst' && gstInvoiceRef.current) {
      gstInvoiceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (preferredInvoiceType === 'purchase' && purchaseInvoiceRef.current) {
      purchaseInvoiceRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading, preferredInvoiceType]);

  const handleDownload = async (type) => {
    const isGst = type === 'gst';
    const invoice = isGst ? gstInvoice : purchaseInvoice;
    const endpoint = isGst ? '/api/payment/gst-invoice/download' : '/api/payment/invoice/download';
    const filePrefix = isGst ? 'GST_Invoice' : 'Invoice';
    const successMessage = isGst ? 'GST invoice downloaded' : 'Invoice downloaded';
    const errorMessage = isGst ? 'Failed to download GST invoice' : 'Failed to download invoice';

    try {
      setDownloadingType(type);
      const token = getPaymentToken();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filePrefix}_${invoice?.invoiceCode || 'download'}.pdf`;
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

  const fmt = (n) => parseFloat(n || 0).toFixed(2);
  const fmtPct = (n) => `${parseFloat(n || 0).toFixed(2)}%`;
  const fmtDate = (d) => d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—';
  const fmtDateOnly = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—';
  const cleanGst = (v) => String(v || '—').replace(/`+/g, '').trim();

  const renderInvoiceCard = (invoice, title, downloadType) => {
    if (!invoice) return null;

    const paymentStatusColor = invoice.payment?.status === 'SUCCESS'
      ? G
      : invoice.payment?.status === 'PENDING'
        ? '#d97706'
        : '#dc2626';
    const isDownloading = downloadingType === downloadType;
    const downloadLabel = downloadType === 'gst' ? 'Download GST PDF' : 'Download PDF';
    const isGstInvoice = downloadType === 'gst';

    return (
      <div
        key={downloadType}
        ref={downloadType === 'gst' ? gstInvoiceRef : purchaseInvoiceRef}
        style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}
      >
        <div style={{ backgroundColor: '#1a1f2e', padding: '24px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</p>
              <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{isGstInvoice ? 'GST INVOICE' : 'INVOICE'}</h1>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Invoice #: <strong style={{ color: 'white' }}>{invoice.invoiceCode || '—'}</strong></span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Order: <strong style={{ color: 'white' }}>{invoice.orderCode || '—'}</strong></span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Date: <strong style={{ color: 'white' }}>{fmtDateOnly(invoice.orderDate)}</strong></span>
                {isGstInvoice && (
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Merchant: <strong style={{ color: 'white' }}>{invoice.merchantOrderId || '—'}</strong></span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDownload(downloadType)}
              disabled={isDownloading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: G, color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: isDownloading ? 'not-allowed' : 'pointer', opacity: isDownloading ? 0.7 : 1 }}
            >
              <Download size={16} /> {isDownloading ? 'Downloading...' : downloadLabel}
            </button>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            {[{ label: 'From', data: invoice.from }, { label: 'To', data: invoice.to }].map(({ label, data }) => (
              <div key={label} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: '18px 20px' }}>
                <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                <p style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 700, color: '#1c1917' }}>{data?.name}</p>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}>{data?.address}</p>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}>Phone: {data?.phone || '—'}</p>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#374151' }}>Email: {data?.email || '—'}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>GST: {cleanGst(data?.gst)}</p>
              </div>
            ))}
          </div>

          <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700, color: '#1c1917' }}>Invoice Items</h3>
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1f2e' }}>
                  {(isGstInvoice
                    ? ['S.No', 'Product Description', 'SAC', 'Transacted Amount', 'Platform Fee', 'Discount', 'Gross Value', 'Discounted Value', 'Taxable Amount', 'GST Rate', 'CGST', 'SGST', 'IGST', 'Total GST Amount']
                    : ['S.No', 'Product', 'Amount', 'Platform Fee', 'GST', 'Total']
                  ).map((header) => (
                    <th key={header} style={{ padding: '12px 16px', textAlign: header === 'S.No' ? 'center' : 'left', fontSize: '13px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap' }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid #f3f4f6' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    {isGstInvoice ? (
                      <>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151', textAlign: 'center' }}>{item.sNo ?? (i + 1)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1c1917', fontWeight: 500 }}>{item.productDescription || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{item.sac || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.transactedAmount)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmtPct(item.platformFee ?? invoice.rates?.platformFee)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmtPct(item.discount ?? invoice.rates?.discount)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.grossValue)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.discountedValue)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.taxableAmount)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmtPct(item.gstRate ?? invoice.rates?.gst)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.cgst)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.sgst)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.igst)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1c1917', fontWeight: 600 }}>{fmt(item.totalGstAmount)}</td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{item.sNo}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1c1917', fontWeight: 500 }}>
                          {item.productName}
                          <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' }}>{item.productCode}</span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.amount)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.platformFee)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>{fmt(item.gst)}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1c1917', fontWeight: 600 }}>{fmt(item.total)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
            <div style={{ width: '320px' }}>
              {isGstInvoice ? (
                <>
                  {[
                    { label: 'Transacted Amount:', value: fmt(invoice.summary?.transactionAmount) },
                    { label: `Platform Fee (${fmtPct(invoice.rates?.platformFee)}):`, value: fmt(invoice.summary?.platformFeeValue) },
                    { label: `Discount (${fmtPct(invoice.rates?.discount)}):`, value: fmt(invoice.summary?.discountValue) },
                    { label: 'Taxable Amount:', value: fmt(invoice.summary?.taxableAmount) },
                    { label: `GST (${fmtPct(invoice.rates?.gst)}):`, value: fmt(invoice.summary?.gstAmount) },
                    { label: 'CGST:', value: fmt(invoice.summary?.cgst) },
                    { label: 'SGST:', value: fmt(invoice.summary?.sgst) },
                    { label: 'IGST:', value: fmt(invoice.summary?.igst) },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151' }}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#1a1f2e', borderRadius: '6px', marginTop: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Total GST Amount:</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{fmt(invoice.summary?.totalGstAmount)}</span>
                  </div>
                </>
              ) : (
                <>
                  {[
                    { label: 'Subtotal:', value: fmt(invoice.summary?.subtotal) },
                    { label: 'Tax on goods (0%):', value: fmt(invoice.summary?.taxOnGoods) },
                    { label: 'Platform fee (10%):', value: fmt(invoice.summary?.platformFee) },
                    { label: 'GST for Platform fee (10%):', value: fmt(invoice.summary?.gstOnPlatformFee) },
                  ].map((row) => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px', color: '#374151' }}>
                      <span>{row.label}</span>
                      <span style={{ fontWeight: 500 }}>{row.value}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#1a1f2e', borderRadius: '6px', marginTop: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>Grand Total:</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{fmt(invoice.summary?.grandTotal)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {invoice.payment && (
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '20px 24px', marginBottom: '28px' }}>
              <p style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: G }}>Payment Information</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280' }}>Payment Mode</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>{invoice.payment?.mode || '—'}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280' }}>Transaction ID</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: G }}>{invoice.payment?.transactionId || '—'}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280' }}>Payment Status</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: paymentStatusColor }}>{invoice.payment?.status || '—'}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280' }}>Paid On</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1c1917' }}>{fmtDate(invoice.payment?.paidOn)}</p>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '32px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>Terms &amp; Conditions:</p>
            {['Payment is due within 30 days', 'Please include invoice number with payment', 'Thank you for your business'].map((term, i) => (
              <p key={i} style={{ margin: '0 0 4px', fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: G, fontWeight: 700 }}>·</span> {term}
              </p>
            ))}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-block', borderTop: '1px solid #374151', paddingTop: '8px', minWidth: '180px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: `3px solid #e6f7ed`, borderTop: `3px solid ${G}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading invoice...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!purchaseInvoice && !gstInvoice) return (
    <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
      <p style={{ fontSize: '16px' }}>No invoice data available.</p>
      <button onClick={() => navigate(-1)} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: G, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Go Back</button>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>
      {renderInvoiceCard(purchaseInvoice, 'Purchase Invoice', 'purchase')}
      {renderInvoiceCard(gstInvoice, 'GST Invoice', 'gst')}
    </div>
  );
};

export default InvoiceDetails;
