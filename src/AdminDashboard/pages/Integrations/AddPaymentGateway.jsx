// AddPaymentGateway.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import paymentService from '../../../services/paymentService';

const AddPaymentGateway = () => {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [gatewayName, setGatewayName] = useState('');

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getGateways();
      if (response.status === 1) {
        setGateways(response.result || []);
      }
    } catch (error) {
      console.error('Error fetching gateways:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch gateways';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const gatewayData = {
        gatewayId: editingGateway ? editingGateway.gatewayId : 0,
        gatewayName: gatewayName,
        isActive: true
      };
      
      const response = await paymentService.manageGateway(gatewayData);
      
      if (response.status === 1) {
        toast.success(editingGateway ? 'Gateway updated successfully!' : 'Gateway added successfully!');
        setGatewayName('');
        setShowModal(false);
        setEditingGateway(null);
        fetchGateways();
      } else {
        toast.error('Failed to save gateway');
      }
    } catch (error) {
      console.error('Error saving gateway:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save gateway';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (gateway) => {
    setEditingGateway(gateway);
    setGatewayName(gateway.gatewayName);
    setShowModal(true);
  };

  const handleDelete = (gateway) => {
    setDeleteItem(gateway);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await paymentService.deleteGateway(deleteItem.gatewayId);
      
      if (response.status === 1) {
        toast.success('Gateway deleted successfully!');
        fetchGateways();
      } else {
        toast.error('Failed to delete gateway');
      }
    } catch (error) {
      console.error('Error deleting gateway:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete gateway';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteItem(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGateway(null);
    setGatewayName('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .page-subtitle {
          color: #64748b;
          font-size: 15px;
          margin: 4px 0 0 0;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(75, 175, 71, 1);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-btn:hover {
          background: rgba(65, 155, 61, 1);
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th,
        .table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          color: #334155;
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
          font-size: 15px;
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

        .status-badge {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          background: #d1fae5;
          color: #065f46;
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
      `}</style>

      <div className="payment-gateway-page">
        <div className="header-row">
          <div>
            <h1 className="page-title">Payment Gateway Setup</h1>
            <p className="page-subtitle">
              Configure and manage your payment gateways
            </p>
          </div>

          <button className="add-btn" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Add Payment Gateway
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Gateway Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {gateways.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="no-data">
                      <h3 className="no-data-title">No Gateways Configured</h3>
                      <p className="no-data-subtitle">
                        Add your first payment gateway to start accepting payments
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                gateways.map((gateway) => (
                  <tr key={gateway.gatewayId}>
                    <td>{gateway.gatewayName}</td>
                    <td>
                      <span className="status-badge">
                        {gateway.isActive === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDate(gateway.createdAt)}</td>
                    <td>
                      <div className="action-icons">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(gateway)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(gateway)}
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

        {/* Add/Edit Gateway Modal */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingGateway ? 'Edit Payment Gateway' : 'Add Payment Gateway'}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Gateway Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Gateway Name (e.g., Razorpay, PayU)"
                        value={gatewayName}
                        onChange={(e) => setGatewayName(e.target.value)}
                        required
                        minLength="2"
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success" disabled={loading || !gatewayName}>
                      {loading ? 'Saving...' : editingGateway ? 'Update' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {showModal && <div className="modal-backdrop fade show"></div>}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && deleteItem && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <p>Are you sure you want to delete <strong>{deleteItem.gatewayName}</strong>? This action cannot be undone.</p>
                </div>
                <div className="modal-footer justify-content-center">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowDeleteConfirm(false)}
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
        {showDeleteConfirm && <div className="modal-backdrop fade show"></div>}
      </div>
    </>
  );
};

export default AddPaymentGateway;