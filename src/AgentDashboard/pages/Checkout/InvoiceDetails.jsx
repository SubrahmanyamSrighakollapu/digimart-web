import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const InvoiceDetails = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchInvoiceDetails();
    }
  }, [orderId]);

  const fetchInvoiceDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/invoice/details/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.status === 1) {
        setInvoice(data.result);
      } else {
        toast.error(data.message || 'Failed to fetch invoice details');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to fetch invoice details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      const token = sessionStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/invoice/download/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invoice.invoiceCode}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Invoice downloaded successfully');
      } else {
        toast.error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container my-5 text-center">
        <p className="text-muted">No invoice data available</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          {/* Header */}
          <div className="row mb-4 pb-4 border-bottom">
            <div className="col-md-6">
              <h2 className="fw-bold text-success mb-1">INVOICE</h2>
              <p className="text-muted mb-0">{invoice.invoiceCode}</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-1"><strong>Order Code:</strong> {invoice.orderCode}</p>
              <p className="mb-1"><strong>Order Date:</strong> {new Date(invoice.orderDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* From & To */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="fw-bold text-uppercase mb-3">From</h6>
              <p className="mb-1"><strong>{invoice.from.name}</strong></p>
              <p className="mb-1 text-muted">{invoice.from.address}</p>
              <p className="mb-1 text-muted">Phone: {invoice.from.phone}</p>
              <p className="mb-1 text-muted">Email: {invoice.from.email}</p>
              <p className="mb-0 text-muted">GST: {invoice.from.gst}</p>
            </div>
            <div className="col-md-6">
              <h6 className="fw-bold text-uppercase mb-3">To</h6>
              <p className="mb-1"><strong>{invoice.to.name}</strong></p>
              <p className="mb-1 text-muted">{invoice.to.address}</p>
              <p className="mb-1 text-muted">Phone: {invoice.to.phone}</p>
              <p className="mb-1 text-muted">Email: {invoice.to.email}</p>
              <p className="mb-0 text-muted">GST: {invoice.to.gst}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="table-responsive mb-4">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>S.No</th>
                  <th>Product Name</th>
                  <th>Product Code</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Amount</th>
                  <th className="text-end">Platform Fee</th>
                  <th className="text-center">GST</th>
                  <th className="text-end">GST Amount</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.sNo}>
                    <td>{item.sNo}</td>
                    <td>{item.productName}</td>
                    <td className="text-muted">{item.productCode}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-end">₹ {item.amount.toLocaleString()}</td>
                    <td className="text-end">₹ {item.platformFee.toLocaleString()}</td>
                    <td className="text-center">{item.gst}</td>
                    <td className="text-end">₹ {item.gstAmount.toLocaleString()}</td>
                    <td className="text-end fw-semibold">₹ {item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="row">
            <div className="col-md-6 offset-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹ {invoice.summary.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax on Goods:</span>
                    <span>₹ {invoice.summary.taxOnGoods.toLocaleString()}</span>
                  </div>
                  {invoice.summary.platformFee > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Platform Fee:</span>
                      <span>₹ {invoice.summary.platformFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-3">
                    <span>GST on Platform Fee:</span>
                    <span>₹ {invoice.summary.gstOnPlatformFee.toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Grand Total:</span>
                    <span className="text-success">₹ {invoice.summary.grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-success">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">Payment Information</h6>
                  <div className="row">
                    <div className="col-md-3">
                      <p className="mb-1 text-muted">Payment Mode</p>
                      <p className="fw-semibold">{invoice.payment.mode}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-1 text-muted">Transaction ID</p>
                      <p className="fw-semibold">{invoice.payment.transactionId}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-1 text-muted">Status</p>
                      <span className="badge bg-success">{invoice.payment.status}</span>
                    </div>
                    <div className="col-md-3">
                      <p className="mb-1 text-muted">Paid On</p>
                      <p className="fw-semibold">{new Date(invoice.payment.paidOn).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-success btn-lg px-5"
              onClick={handleDownloadInvoice}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Downloading...
                </>
              ) : (
                <>
                  <i className="bi bi-download me-2"></i>
                  Download Invoice
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
