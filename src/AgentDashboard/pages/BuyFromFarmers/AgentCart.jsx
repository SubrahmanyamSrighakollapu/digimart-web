import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

import Check from "../../../assets/cart/Check_img.png";
import Delete from "../../../assets/cart/Delete_img.png";
import Delivery from "../../../assets/cart/Delivery_img.png";
import Security from "../../../assets/cart/Security_img.png";
import productService from "../../../services/productService";

const AgentCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteCartId, setDeleteCartId] = useState(null);
  const [gateways, setGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);

  useEffect(() => {
    fetchCartItems();
    fetchGateways();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await productService.getCartItems();
      if (response && response.status === 1 && response.result) {
        setCartItems(response.result);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch cart';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getImagePath = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    return `${import.meta.env.VITE_API_BASE_URL}/${imgPath.replace(/\\/g, '/')}`;
  };

  const handleDeleteClick = (cartId) => {
    setDeleteCartId(cartId);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await productService.removeFromCart(deleteCartId);
      if (response && response.status === 1) {
        toast.success('Item removed from cart');
        setDeleteCartId(null);
        fetchCartItems();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove item';
      toast.error(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setDeleteCartId(null);
  };

  const fetchGateways = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/getAgentGatewayCommission`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 1 && data.result) {
        setGateways(data.result);
      }
    } catch (error) {
      console.error('Error fetching gateways:', error);
    }
  };

  const fetchPaymentDetails = async (planConfigId) => {
    try {
      setLoadingPayment(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/getAgentPaymentCommissionDetails?configId=${planConfigId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 1 && data.result) {
        setPaymentDetails(data.result);
        setSelectedMethod('');
        setSelectedOption('');
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Failed to fetch payment details');
    } finally {
      setLoadingPayment(false);
    }
  };

  const handleGatewayChange = (e) => {
    const gatewayId = e.target.value;
    setSelectedGateway(gatewayId);
    if (gatewayId) {
      const gateway = gateways.find(g => g.gatewayId === parseInt(gatewayId));
      if (gateway) {
        fetchPaymentDetails(gateway.planConfigId);
      }
    } else {
      setPaymentDetails([]);
      setSelectedMethod('');
      setSelectedOption('');
    }
  };

  const getUniqueMethods = () => {
    const methods = {};
    paymentDetails.forEach(detail => {
      if (!methods[detail.methodId]) {
        methods[detail.methodId] = detail.methodName;
      }
    });
    return Object.entries(methods).map(([id, name]) => ({ id: parseInt(id), name }));
  };

  const getOptionsForMethod = (methodId) => {
    return paymentDetails.filter(detail => detail.methodId === parseInt(methodId));
  };

  const calculateTotals = () => {
    const productsTotal = cartItems.reduce((sum, item) => sum + parseFloat(item.unitsTotalPrice), 0);
    const gstTotal = cartItems.reduce((sum, item) => sum + parseFloat(item.gSTAmount), 0);
    const subtotal = productsTotal + gstTotal;

    let commissionRate = 0;
    let commissionAmount = 0;
    
    if (selectedOption) {
      const selectedDetail = paymentDetails.find(d => d.methodOptionId === parseInt(selectedOption));
      if (selectedDetail) {
        commissionRate = parseFloat(selectedDetail.planCommission);
        commissionAmount = (subtotal * commissionRate) / 100;
      }
    }
    
    const total = subtotal + commissionAmount;

    return { productsTotal, gstTotal, subtotal, commissionRate, commissionAmount, total };
  };

  const { productsTotal, gstTotal, subtotal, commissionRate, commissionAmount, total } = calculateTotals();

  const handleProceedToCheckout = () => {
    const cartIds = cartItems.map(item => item.cartId).join(',');
    const checkoutData = {
      gatewayId: parseInt(selectedGateway),
      methodId: parseInt(selectedMethod),
      methodOptionId: parseInt(selectedOption),
      cartIds,
      productsTotal,
      gstTotal,
      subtotal,
      commissionRate,
      commissionAmount,
      total
    };
    navigate('/agent/checkout', { state: checkoutData });
  };

  return (
    <>
      <style>{`
        .agent-cart-container {
          background: #f8f9fa;
          min-height: 100vh;
          padding: 2rem 0;
        }

        .cart-header {
          margin-bottom: 2rem;
        }

        .cart-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .elegant-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .cart-table {
          margin: 0;
        }

        .cart-table thead th {
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 1rem;
        }

        .cart-table tbody td {
          padding: 1.25rem 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
        }

        .cart-table tbody tr:last-child td {
          border-bottom: none;
        }

        .product-img {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #e5e7eb;
        }

        .product-name {
          font-weight: 500;
          color: #111827;
          font-size: 0.9375rem;
        }

        .delete-btn {
          background: #fee2e2;
          border: none;
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .delete-btn:hover {
          background: #fecaca;
        }

        .payment-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.75rem;
          margin-top: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .payment-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1.5rem;
        }

        .form-label-custom {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          display: block;
        }

        .form-select-custom {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9375rem;
          color: #111827;
          background: #ffffff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-select-custom:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .commission-table-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.75rem;
          margin-top: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .commission-table {
          margin: 0;
        }

        .commission-table thead th {
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
          color: #6b7280;
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0.875rem 1rem;
        }

        .commission-table tbody td {
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
        }

        .commission-table tbody tr:last-child td {
          border-bottom: none;
        }

        .commission-table tbody tr.selected-row {
          background: #d1fae5;
        }

        .method-badge {
          background: #dbeafe;
          color: #1e40af;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .commission-rate {
          // color: #059669;
          font-weight: 600;
        }

        .info-alert {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 0.875rem 1rem;
          margin-top: 1rem;
          margin-bottom: 0;
        }

        .info-alert-text {
          color: #1e40af;
          font-size: 0.8125rem;
          margin: 0;
        }

        .summary-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 20px;
        }

        .summary-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.625rem 0;
          color: #6b7280;
          font-size: 0.9375rem;
        }

        .summary-row-subtotal {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 2px solid #e5e7eb;
          font-weight: 600;
          color: #374151;
        }

        .summary-divider {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 0.75rem 0;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 0;
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
        }

        .summary-note {
          color: #9ca3af;
          font-size: 0.8125rem;
          margin: 0.75rem 0 1.5rem 0;
        }

        .checkout-btn {
          width: 100%;
          padding: 0.875rem;
          background: #10b981;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-bottom: 0.75rem;
        }

        .checkout-btn:hover:not(:disabled) {
          background: #059669;
        }

        .checkout-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .quote-btn {
          width: 100%;
          padding: 0.875rem;
          background: #ffffff;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          margin-bottom: 1.5rem;
        }

        .quote-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0;
          color: #6b7280;
          font-size: 0.9375rem;
        }

        .feature-icon {
          width: 24px;
          height: 24px;
        }
      `}</style>

      <div className="agent-cart-container">
        <div className="container">
          <div className="cart-header">
            <h1 className="cart-title">Shopping Cart</h1>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="elegant-card p-5 text-center">
                  <p className="text-muted mb-3">Your cart is empty</p>
                  <button 
                    className="btn btn-success"
                    onClick={() => navigate('/agent/buy-from-farmers')}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="elegant-card">
                    <table className="table cart-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>GST</th>
                          <th>Total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.cartId}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={getImagePath(item.productImages)}
                                  alt={item.productName}
                                  className="product-img"
                                />
                                <span className="product-name">{item.productName}</span>
                              </div>
                            </td>
                            <td>{item.categoryName}</td>
                            <td>{item.noOfQuantity}</td>
                            <td>₹{parseFloat(item.unitPrice).toFixed(2)}</td>
                            <td>₹{parseFloat(item.gSTAmount).toFixed(2)}</td>
                            <td className="fw-semibold">₹{parseFloat(item.lineItemTotal).toFixed(2)}</td>
                            <td>
                              <button 
                                className="delete-btn"
                                onClick={() => handleDeleteClick(item.cartId)}
                              >
                                <img src={Delete} alt="Delete" width="18" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {cartItems.length > 0 && (
                    <div className="payment-card">
                      <h5 className="payment-title">Payment Options</h5>

                      <div className="mb-3">
                        <label className="form-label-custom">Gateway</label>
                        <select 
                          className="form-select-custom" 
                          value={selectedGateway}
                          onChange={handleGatewayChange}
                        >
                          <option value="">Select Gateway</option>
                          {gateways.map(gateway => (
                            <option key={gateway.gatewayId} value={gateway.gatewayId}>
                              {gateway.gatewayName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {loadingPayment && (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}

                      {!loadingPayment && paymentDetails.length > 0 && (
                        <>
                          <div className="mb-3">
                            <label className="form-label-custom">Payment Method</label>
                            <select 
                              className="form-select-custom" 
                              value={selectedMethod}
                              onChange={(e) => {
                                setSelectedMethod(e.target.value);
                                setSelectedOption('');
                              }}
                            >
                              <option value="">Select Method</option>
                              {getUniqueMethods().map(method => (
                                <option key={method.id} value={method.id}>
                                  {method.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {selectedMethod && (
                            <div className="mb-0">
                              <label className="form-label-custom">Payment Option</label>
                              <select 
                                className="form-select-custom" 
                                value={selectedOption}
                                onChange={(e) => setSelectedOption(e.target.value)}
                              >
                                <option value="">Select Option</option>
                                {getOptionsForMethod(selectedMethod).map(option => (
                                  <option key={option.planCommissionsId} value={option.methodOptionId}>
                                    {option.optionName} 
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {selectedGateway && paymentDetails.length > 0 && (
                    <div className="commission-table-card">
                      <h5 className="payment-title">Platform Fee Details</h5>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        Review the Platform Fee (%) for different payment options
                      </p>
                      <div className="table-responsive">
                        <table className="table commission-table">
                          <thead>
                            <tr>
                              <th>Payment Method</th>
                              <th>Option</th>
                              <th className="text-end">Platform Fee (%)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentDetails.map((detail) => (
                              <tr 
                                key={detail.planCommissionsId}
                                className={selectedOption == detail.methodOptionId ? 'selected-row' : ''}
                              >
                                <td>
                                  <span className="method-badge">{detail.methodName}</span>
                                </td>
                                <td>{detail.optionName}</td>
                                <td className="text-end">
                                  <span className="commission-rate">{detail.planCommission}%</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="info-alert">
                        <p className="info-alert-text">
                          <strong>Note:</strong> Platform fee will be calculated based on the selected payment method and applied to the subtotal amount. 
                          Select your preferred payment option above to proceed.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="col-lg-4">
              <div className="summary-card">
                <h5 className="summary-title">Order Summary</h5>

                <div className="summary-row">
                  <span>Products Total</span>
                  <span>₹ {productsTotal.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>GST</span>
                  <span>₹ {gstTotal.toFixed(2)}</span>
                </div>

                <div className="summary-row-subtotal">
                  <span>Subtotal</span>
                  <span>₹ {subtotal.toFixed(2)}</span>
                </div>

                {selectedOption && commissionRate > 0 && (
                  <div className="summary-row">
                    <span>Platform Fee</span>
                    <span>₹ {commissionAmount.toFixed(2)}</span>
                  </div>
                )}

                <hr className="summary-divider" />
                
                <div className="summary-total">
                  <span>Total</span>
                  <span>₹ {total.toFixed(2)}</span>
                </div>

                <p className="summary-note">
                  Includes all taxes
                </p>

                <button
                  className="checkout-btn"
                  onClick={handleProceedToCheckout}
                  disabled={!selectedGateway || !selectedMethod || !selectedOption || cartItems.length === 0}
                >
                  → Proceed to Checkout
                </button>

                <button className="quote-btn">
                  Request Quotation
                </button>

                <ul className="features-list">
                  <li className="feature-item">
                    <img src={Security} alt="Secure Payment" className="feature-icon" />
                    <span>Secure Payment</span>
                  </li>
                  <li className="feature-item">
                    <img src={Delivery} alt="Fast Delivery" className="feature-icon" />
                    <span>Fast Delivery</span>
                  </li>
                  <li className="feature-item">
                    <img src={Check} alt="Quality Check" className="feature-icon" />
                    <span>Quality Check</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {deleteCartId && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleCancelDelete}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCancelDelete}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to remove this item from your cart?</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCancelDelete}
                >
                  No
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleConfirmDelete}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentCart;
