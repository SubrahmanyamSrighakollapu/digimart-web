import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const AgentCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkoutData = location.state || {};
  
  const [formData, setFormData] = useState({
    userGSTNo: '',
    deliveryPersonName: '',
    deliveryPersonNo: '',
    deliveryAddress: '',
    deliveryStatePin: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.userGSTNo || !formData.deliveryPersonName || !formData.deliveryPersonNo || 
        !formData.deliveryAddress || !formData.deliveryStatePin) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      
      const payload = {
        gatewayId: checkoutData.gatewayId,
        methodId: checkoutData.methodId,
        methodOptionId: checkoutData.methodOptionId,
        cartIds: checkoutData.cartIds,
        userGSTNo: formData.userGSTNo,
        deliveryPersonName: formData.deliveryPersonName,
        deliveryPersonNo: formData.deliveryPersonNo,
        deliveryAddress: formData.deliveryAddress,
        deliveryStatePin: formData.deliveryStatePin
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/initiateProductPurchaseOrder`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.status === 1) {
        toast.success('Order initiated successfully!');
        navigate('/agent/payment-fallback', { 
          state: { 
            orderId: data.result.orderId,
            orderCode: data.result.orderCode,
            paymentProcessId: data.result.paymentProcessId
          } 
        });
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-lg-8">
          {/* <h4 className="fw-bold mb-4">Secure CheckOut</h4> */}

          <div className="card p-4 mb-4">
            <h6 className="fw-bold mb-3">Delivery Details</h6>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">GST Number *</label>
                <input 
                  className="form-control" 
                  name="userGSTNo"
                  value={formData.userGSTNo}
                  onChange={handleInputChange}
                  placeholder="Enter GST Number" 
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Delivery Person Name *</label>
                <input 
                  className="form-control" 
                  name="deliveryPersonName"
                  value={formData.deliveryPersonName}
                  onChange={handleInputChange}
                  placeholder="Enter Delivery Person Name" 
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Delivery Person Phone *</label>
                <input 
                  className="form-control" 
                  name="deliveryPersonNo"
                  value={formData.deliveryPersonNo}
                  onChange={handleInputChange}
                  placeholder="Enter Phone Number" 
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">State PIN Code *</label>
                <input 
                  className="form-control" 
                  name="deliveryStatePin"
                  value={formData.deliveryStatePin}
                  onChange={handleInputChange}
                  placeholder="Enter PIN Code" 
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Delivery Address *</label>
                <textarea 
                  className="form-control" 
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Enter Full Delivery Address" 
                  rows="3"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-4">
            <h5 className="fw-bold mb-4">Order Summary</h5>

            <div className="d-flex justify-content-between mb-2">
              <span>Products Total</span>
              <span>₹ {checkoutData.productsTotal?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>GST</span>
              <span>₹ {checkoutData.gstTotal?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="d-flex justify-content-between mb-2 pb-2 border-bottom">
              <span className="fw-semibold">Subtotal</span>
              <span className="fw-semibold">₹ {checkoutData.subtotal?.toFixed(2) || '0.00'}</span>
            </div>

            {checkoutData.commissionRate > 0 && (
              <div className="d-flex justify-content-between mb-2">
                <span>Commission ({checkoutData.commissionRate}%)</span>
                <span>₹ {checkoutData.commissionAmount?.toFixed(2) || '0.00'}</span>
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between fw-bold mb-3">
              <span>Total</span>
              <span>₹ {checkoutData.total?.toFixed(2) || '0.00'}</span>
            </div>

            <small className="text-muted d-block mb-3">
              Includes all taxes
            </small>

            <button
              className="btn btn-success w-100"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCheckout;