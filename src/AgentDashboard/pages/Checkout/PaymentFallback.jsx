import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const PaymentFallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, orderCode, paymentProcessId } = location.state || {};
  const [loading, setLoading] = useState(false);

  const handleFinalizeOrder = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');

      const payload = {
        orderId: orderId,
        rawPayload: "N/A",
        rawPayloadResponse: "N/A",
        paymentStatus: "success",
        isSuccess: true
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/verifyPayInPaymentStatus`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.status === 1 && data.result.success) {
        toast.success(data.result.message || 'Transaction processed successfully');
        navigate('/agent/invoice-details', { state: { orderId } });
      } else {
        toast.error(data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-5 text-center">
            <div className="mb-4">
              <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
              </div>
            </div>

            <h3 className="fw-bold mb-3">Order Initiated Successfully</h3>
            <p className="text-muted mb-4">Your order has been created and is ready for finalization</p>

            <div className="bg-light rounded p-3 mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Order Code:</span>
                <span className="fw-semibold">{orderCode}</span>
              </div>
              {/* <div className="d-flex justify-content-between">
                <span className="text-muted">Order ID:</span>
                <span className="fw-semibold">{orderId}</span>
              </div> */}
            </div>

            <button
              className="btn btn-success btn-lg w-100"
              onClick={handleFinalizeOrder}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Finalizing...
                </>
              ) : (
                'Finalize Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFallback;
