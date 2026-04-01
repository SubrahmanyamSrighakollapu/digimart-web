// PaymentMethodsManager.jsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import paymentService from '../../../services/paymentService';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../../components/Pagination/Pagination';

const PaymentMethodsManager = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Payment Method Form
  const [methodForm, setMethodForm] = useState({
    methodName: '',
    methodCode: ''
  });
  
  // Payment Option Form
  const [optionForm, setOptionForm] = useState({
    methodId: '',
    optionName: '',
    optionCode: ''
  });
  
  // Modal states
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editingMethod, setEditingMethod] = useState(null);
  const [editingOption, setEditingOption] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
    fetchPaymentOptions();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentMethods();
      if (response.status === 1) {
        setPaymentMethods(response.result || []);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentOptions = async () => {
    try {
      const response = await paymentService.getPaymentMethodOptions();
      if (response.status === 1) {
        setPaymentOptions(response.result || []);
      }
    } catch (error) {
      console.error('Error fetching payment options:', error);
      toast.error('Failed to fetch payment options');
    }
  };

  const handleMethodSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const methodData = {
        methodId: editingMethod ? editingMethod.methodId : 0,
        methodName: methodForm.methodName,
        methodCode: methodForm.methodCode,
        iaActive: true
      };
      
      const response = await paymentService.managePaymentMethod(methodData);
      
      if (response.status === 1) {
        toast.success(editingMethod ? 'Payment method updated successfully!' : 'Payment method added successfully!');
        setMethodForm({ methodName: '', methodCode: '' });
        setShowMethodModal(false);
        setEditingMethod(null);
        fetchPaymentMethods();
      } else {
        toast.error('Failed to save payment method');
      }
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error('Failed to save payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const optionData = {
        methodOptionId: editingOption ? editingOption.methodOptionId : 0,
        methodId: parseInt(optionForm.methodId),
        optionName: optionForm.optionName,
        optionCode: optionForm.optionCode,
        isActive: true
      };
      
      const response = await paymentService.managePaymentMethodOption(optionData);
      
      if (response.status === 1) {
        toast.success(editingOption ? 'Payment option updated successfully!' : 'Payment option added successfully!');
        setOptionForm({ methodId: '', optionName: '', optionCode: '' });
        setShowOptionModal(false);
        setEditingOption(null);
        fetchPaymentOptions();
      } else {
        toast.error('Failed to save payment option');
      }
    } catch (error) {
      console.error('Error saving payment option:', error);
      toast.error('Failed to save payment option');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      let response;
      
      if (deleteItem.type === 'method') {
        response = await paymentService.deletePaymentMethod(deleteItem.id);
        if (response.status === 1) {
          toast.success('Payment method deleted successfully!');
          fetchPaymentMethods();
        }
      } else {
        response = await paymentService.deletePaymentMethodOption(deleteItem.id);
        if (response.status === 1) {
          toast.success('Payment option deleted successfully!');
          fetchPaymentOptions();
        }
      }
      
      if (response.status !== 1) {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteItem(null);
    }
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    setMethodForm({
      methodName: method.methodName,
      methodCode: method.methodCode
    });
    setShowMethodModal(true);
  };

  const handleEditOption = (option) => {
    setEditingOption(option);
    setOptionForm({
      methodId: option.methodId.toString(),
      optionName: option.optionName,
      optionCode: option.optionCode
    });
    setShowOptionModal(true);
  };

  const handleDeleteMethod = (method) => {
    setDeleteItem({ type: 'method', id: method.methodId, name: method.methodName });
    setShowDeleteConfirm(true);
  };

  const handleDeleteOption = (option) => {
    setDeleteItem({ type: 'option', id: option.methodOptionId, name: option.optionName });
    setShowDeleteConfirm(true);
  };

  const closeMethodModal = () => {
    setShowMethodModal(false);
    setEditingMethod(null);
    setMethodForm({ methodName: '', methodCode: '' });
  };

  const closeOptionModal = () => {
    setShowOptionModal(false);
    setEditingOption(null);
    setOptionForm({ methodId: '', optionName: '', optionCode: '' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const { currentPage: methodsPage, totalPages: methodsTotalPages, currentRecords: currentMethods, handlePageChange: handleMethodsPageChange } = usePagination(paymentMethods, 5);
  const { currentPage: optionsPage, totalPages: optionsTotalPages, currentRecords: currentOptions, handlePageChange: handleOptionsPageChange } = usePagination(paymentOptions, 5);

  return (
    <>
      <style>{`
        .payment-methods-manager {
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

        .two-column-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 48px;
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          padding: 28px 32px;
        }

        .card-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 24px 0;
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

        .form-input,
        .form-select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          background: white;
        }

        .form-input:focus,
        .form-select:focus {
          border-color: rgba(75, 175, 71, 1);
          box-shadow: 0 0 0 3px rgba(75, 175, 71, 0.15);
        }

        .form-input:disabled {
          background: #f8fafc;
          color: #64748b;
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .helper-text {
          font-size: 13px;
          color: #64748b;
          margin-top: 6px;
        }

        .add-btn {
          width: 100%;
          padding: 12px;
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

        .add-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Tables Section */
        .tables-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .table-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-title {
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

      <div className="payment-methods-manager">
        <h1 className="page-title">Payment Methods Manager</h1>
        <p className="page-subtitle">
          Configure payment methods and options for seamless transactions
        </p>

        <div className="two-column-layout">
          {/* Left - Add Payment Method */}
          <div className="card">
            <h2 className="card-title">Add Payment Method</h2>

            <div className="form-group">
              <label className="form-label">Method Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Method Name"
                value={methodForm.methodName}
                onChange={(e) => setMethodForm({...methodForm, methodName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Payment Method Code"
                value={methodForm.methodCode}
                onChange={(e) => setMethodForm({...methodForm, methodCode: e.target.value})}
              />
              <div className="helper-text">
                Unique code for this payment method
              </div>
            </div>

            <button 
              className="add-btn" 
              onClick={() => handleMethodSubmit({ preventDefault: () => {} })}
              disabled={loading || !methodForm.methodName || !methodForm.methodCode}
            >
              {loading ? 'Adding...' : 'Add Method'}
            </button>
          </div>

          {/* Right - Add Payment Option */}
          <div className="card">
            <h2 className="card-title">Add Payment Option</h2>

            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-select"
                value={optionForm.methodId}
                onChange={(e) => setOptionForm({...optionForm, methodId: e.target.value})}
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method.methodId} value={method.methodId}>
                    {method.methodName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Payment Method Option</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Payment Method Option"
                value={optionForm.optionName}
                onChange={(e) => setOptionForm({...optionForm, optionName: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Payment Option Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter Payment Option Code"
                value={optionForm.optionCode}
                onChange={(e) => setOptionForm({...optionForm, optionCode: e.target.value})}
              />
              <div className="helper-text">
                Unique code for this payment option
              </div>
            </div>

            <button 
              className="add-btn"
              onClick={() => handleOptionSubmit({ preventDefault: () => {} })}
              disabled={loading || !optionForm.methodId || !optionForm.optionName || !optionForm.optionCode}
            >
              {loading ? 'Adding...' : 'Add Option'}
            </button>
          </div>
        </div>

        {/* Tables */}
        <div className="tables-section">
          {/* All Payment Methods Table */}
          <div className="table-card">
            <div className="table-header">
              <h2 className="table-title">All Payment Methods</h2>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethods.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="no-data">No Payment Methods</div>
                    </td>
                  </tr>
                ) : (
                  currentMethods.map((method) => (
                    <tr key={method.methodId}>
                      <td>{method.methodName}</td>
                      <td>{formatDate(method.createdAt)}</td>
                      <td>
                        <div className="action-icons">
                          <button 
                            className="action-btn edit-btn"
                            onClick={() => handleEditMethod(method)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteMethod(method)}
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
            <Pagination 
              currentPage={methodsPage}
              totalPages={methodsTotalPages}
              onPageChange={handleMethodsPageChange}
            />
          </div>

          {/* All Payment Options Table */}
          <div className="table-card">
            <div className="table-header">
              <h2 className="table-title">All Payment Options</h2>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Payment Method Option</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentOptions.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="no-data">No Payment Options</div>
                    </td>
                  </tr>
                ) : (
                  currentOptions.map((option) => {
                    const method = paymentMethods.find(m => m.methodId === option.methodId);
                    return (
                      <tr key={option.methodOptionId}>
                        <td>{method ? method.methodName : 'N/A'}</td>
                        <td>{option.optionName}</td>
                        <td>{formatDate(option.createdAt)}</td>
                        <td>
                          <div className="action-icons">
                            <button 
                              className="action-btn edit-btn"
                              onClick={() => handleEditOption(option)}
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteOption(option)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <Pagination 
              currentPage={optionsPage}
              totalPages={optionsTotalPages}
              onPageChange={handleOptionsPageChange}
            />
          </div>
        </div>

        {/* Payment Method Modal */}
        {showMethodModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeMethodModal}></button>
                </div>
                
                <form onSubmit={handleMethodSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Method Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Method Name"
                        value={methodForm.methodName}
                        onChange={(e) => setMethodForm({...methodForm, methodName: e.target.value})}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Payment Method Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Payment Method Code"
                        value={methodForm.methodCode}
                        onChange={(e) => setMethodForm({...methodForm, methodCode: e.target.value})}
                        disabled={editingMethod}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeMethodModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? 'Saving...' : editingMethod ? 'Update' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {showMethodModal && <div className="modal-backdrop fade show"></div>}

        {/* Payment Option Modal */}
        {showOptionModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingOption ? 'Edit Payment Option' : 'Add Payment Option'}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeOptionModal}></button>
                </div>
                
                <form onSubmit={handleOptionSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Payment Method</label>
                      <select
                        className="form-select"
                        value={optionForm.methodId}
                        onChange={(e) => setOptionForm({...optionForm, methodId: e.target.value})}
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

                    <div className="mb-3">
                      <label className="form-label">Payment Method Option</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Payment Method Option"
                        value={optionForm.optionName}
                        onChange={(e) => setOptionForm({...optionForm, optionName: e.target.value})}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Payment Option Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Payment Option Code"
                        value={optionForm.optionCode}
                        onChange={(e) => setOptionForm({...optionForm, optionCode: e.target.value})}
                        disabled={editingOption}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeOptionModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                      {loading ? 'Saving...' : editingOption ? 'Update' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {showOptionModal && <div className="modal-backdrop fade show"></div>}

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
                  <p>Are you sure you want to delete <strong>{deleteItem.name}</strong>? This action cannot be undone.</p>
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

export default PaymentMethodsManager;