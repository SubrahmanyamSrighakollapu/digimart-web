// PaymentGatewaySetup.jsx
import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Building, Receipt, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import paymentService from '../../../services/paymentService';

const PaymentGatewaySetup = () => {
  const [gateways, setGateways] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [gatewayMappings, setGatewayMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [selectedGateway, setSelectedGateway] = useState('');
  const [selectedMethods, setSelectedMethods] = useState([]);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);
  const [deletingMapping, setDeletingMapping] = useState(null);
  const [editForm, setEditForm] = useState({ gatewayId: '', methodId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gatewaysRes, methodsRes, mappingsRes] = await Promise.all([
        paymentService.getGateways(),
        paymentService.getPaymentMethods(),
        paymentService.getGatewayMethodMappings()
      ]);
      
      if (gatewaysRes.status === 1) setGateways(gatewaysRes.result || []);
      if (methodsRes.status === 1) setPaymentMethods(methodsRes.result || []);
      if (mappingsRes.status === 1) setGatewayMappings(mappingsRes.result || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getMethodIcon = (methodName) => {
    const name = methodName.toLowerCase();
    if (name.includes('card') || name.includes('credit') || name.includes('debit')) {
      return <CreditCard size={32} color="#3b82f6" />;
    }
    if (name.includes('wallet') || name.includes('digital')) {
      return <Wallet size={32} color="#10b981" />;
    }
    if (name.includes('bank') || name.includes('transfer') || name.includes('upi')) {
      return <Building size={32} color="#f59e0b" />;
    }
    if (name.includes('invoice') || name.includes('pay')) {
      return <Receipt size={32} color="#6b7280" />;
    }
    return <CreditCard size={32} color="#8b5cf6" />;
  };

  const handleMethodToggle = (methodId) => {
    setSelectedMethods(prev => 
      prev.includes(methodId) 
        ? prev.filter(id => id !== methodId)
        : [...prev, methodId]
    );
  };

  const handleSubmit = async () => {
    if (!selectedGateway || selectedMethods.length === 0) {
      toast.error('Please select gateway and at least one payment method');
      return;
    }

    try {
      setLoading(true);
      const promises = selectedMethods.map(methodId => 
        paymentService.manageGatewayMethodMapping({
          gatewayMethodId: 0,
          gatewayId: parseInt(selectedGateway),
          methodId: parseInt(methodId),
          isActive: true
        })
      );
      
      await Promise.all(promises);
      toast.success('Gateway methods configured successfully!');
      setSelectedGateway('');
      setSelectedMethods([]);
      fetchData();
    } catch (error) {
      console.error('Error saving gateway methods:', error);
      toast.error('Failed to save gateway methods');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mapping) => {
    setEditingMapping(mapping);
    setEditForm({
      gatewayId: mapping.gatewayId.toString(),
      methodId: mapping.methodId.toString()
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await paymentService.manageGatewayMethodMapping({
        gatewayMethodId: editingMapping.gatewayMethodId,
        gatewayId: parseInt(editForm.gatewayId),
        methodId: parseInt(editForm.methodId),
        isActive: true
      });
      
      if (response.status === 1) {
        toast.success('Gateway method updated successfully!');
        setShowEditModal(false);
        setEditingMapping(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating gateway method:', error);
      toast.error('Failed to update gateway method');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (mapping) => {
    setDeletingMapping(mapping);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await paymentService.deleteGatewayMethodMapping(deletingMapping.gatewayMethodId);
      if (response.status === 1) {
        toast.success('Gateway method deleted successfully!');
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting gateway method:', error);
      toast.error('Failed to delete gateway method');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeletingMapping(null);
    }
  };

  const getGatewayName = (gatewayId) => {
    const gateway = gateways.find(g => g.gatewayId === gatewayId);
    return gateway ? gateway.gatewayName : 'Unknown';
  };

  const getMethodName = (methodId) => {
    const method = paymentMethods.find(m => m.methodId === methodId);
    return method ? method.methodName : 'Unknown';
  };

  return (
    <>
      <style>{`
        .payment-gateway-page {
          padding: 24px 32px;
          background: #f5f7fa;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 15px;
          margin: 0 0 32px 0;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          padding: 32px;
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 16px 0;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          margin-bottom: 6px;
          display: block;
        }

        .form-select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          background: white;
        }

        .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .payment-methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .method-chip {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.2s;
          cursor: pointer;
          position: relative;
        }

        .method-chip:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .method-chip.selected {
          border-color: #10b981;
          background: #f0fdf4;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .method-chip .icon {
          margin-bottom: 12px;
          display: flex;
          justify-content: center;
        }

        .method-chip .name {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 15px;
          margin-bottom: 4px;
        }

        .method-chip .code {
          font-size: 12px;
          color: #64748b;
          font-family: monospace;
        }

        .buttons-row {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn {
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
        }

        .btn-cancel:hover {
          background: #e2e8f0;
        }

        .btn-save {
          background: rgba(75, 175, 71, 1);
          color: white;
        }

        .btn-save:hover {
          background: rgba(65, 155, 61, 1);
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .list-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .list-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .list-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 16px 24px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          color: #334155;
          font-size: 14px;
        }

        .table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .no-data {
          padding: 80px 24px;
          text-align: center;
          color: #64748b;
        }

        .no-data-title {
          font-size: 18px;
          font-weight: 600;
          color: #334155;
          margin: 0 0 8px 0;
        }

        .no-data-subtitle {
          margin: 0;
          font-size: 15px;
        }

        .action-icons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edit-btn {
          color: #3b82f6;
        }

        .edit-btn:hover {
          background: #eff6ff;
        }

        .delete-btn {
          color: #ef4444;
        }

        .delete-btn:hover {
          background: #fef2f2;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          background: #d1fae5;
          color: #065f46;
        }
      `}</style>

      <div className="payment-gateway-page">
        <h1 className="page-title">Payment Gateway Setup</h1>
        <p className="page-subtitle">
          Configure payment methods for your gateways
        </p>

        <div className="form-card">
          <h2 className="section-title">Gateway Configuration</h2>

          <div className="form-group">
            <label className="form-label">Select Gateway *</label>
            <select
              className="form-select"
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              required
            >
              <option value="">Choose a gateway</option>
              {gateways.map((gateway) => (
                <option key={gateway.gatewayId} value={gateway.gatewayId}>
                  {gateway.gatewayName}
                </option>
              ))}
            </select>
          </div>

          <h2 className="section-title">Select Payment Methods</h2>

          <div className="payment-methods-grid">
            {paymentMethods.map((method) => (
              <div
                key={method.methodId}
                className={`method-chip ${
                  selectedMethods.includes(method.methodId) ? 'selected' : ''
                }`}
                onClick={() => handleMethodToggle(method.methodId)}
              >
                <div className="icon">
                  {getMethodIcon(method.methodName)}
                </div>
                <div className="name">{method.methodName}</div>
                <div className="code">{method.methodCode}</div>
              </div>
            ))}
          </div>

          <div className="buttons-row">
            <button 
              className="btn btn-cancel"
              onClick={() => {
                setSelectedGateway('');
                setSelectedMethods([]);
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-save" 
              onClick={handleSubmit}
              disabled={loading || !selectedGateway || selectedMethods.length === 0}
            >
              {loading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>

        <div className="list-card">
          <div className="list-header">
            <h2 className="list-title">Configured Gateway Methods</h2>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Gateway</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gatewayMappings.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="no-data">
                      <h3 className="no-data-title">No Configurations Found</h3>
                      <p className="no-data-subtitle">
                        Configure your first gateway method mapping above
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                gatewayMappings.map((mapping) => (
                  <tr key={mapping.gatewayMethodId}>
                    <td>{getGatewayName(mapping.gatewayId)}</td>
                    <td>{getMethodName(mapping.methodId)}</td>
                    <td>
                      <span className="status-badge">
                        {mapping.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-icons">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(mapping)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(mapping)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Gateway Method</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Gateway *</label>
                      <select
                        className="form-select"
                        value={editForm.gatewayId}
                        onChange={(e) => setEditForm({...editForm, gatewayId: e.target.value})}
                        required
                      >
                        <option value="">Select Gateway</option>
                        {gateways.map((gateway) => (
                          <option key={gateway.gatewayId} value={gateway.gatewayId}>
                            {gateway.gatewayName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Payment Method *</label>
                      <select
                        className="form-select"
                        value={editForm.methodId}
                        onChange={(e) => setEditForm({...editForm, methodId: e.target.value})}
                        required
                      >
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map((method) => (
                          <option key={method.methodId} value={method.methodId}>
                            {method.methodName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {showEditModal && <div className="modal-backdrop fade show"></div>}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingMapping && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <p>Are you sure you want to delete the mapping between <strong>{getGatewayName(deletingMapping.gatewayId)}</strong> and <strong>{getMethodName(deletingMapping.methodId)}</strong>?</p>
                  {/* <p className="text-muted">This action cannot be undone.</p> */}
                </div>
                <div className="modal-footer justify-content-center">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={handleDeleteConfirm}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </>
  );
};

export default PaymentGatewaySetup;