// PlansManagement.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Search, Filter, Edit, Trash2 } from 'lucide-react';
import api from '../../../services/api';

const PlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingPlanId, setDeletingPlanId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    planName: '',
    planPrice: '',
    planDescription: '',
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async (isActive = null) => {
    try {
      setLoading(true);
      const activeParam = isActive === null ? 'true' : isActive.toString();
      const response = await api.get(`/plan/getAllPlans/0/${activeParam}`);
      if (response && response.status === 1 && response.result) {
        setPlans(response.result);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const planData = {
        planId: editingPlan ? editingPlan.planId : 0,
        planName: formData.planName,
        planPrice: parseFloat(formData.planPrice),
        planDescription: formData.planDescription,
        isActive: formData.isActive
      };
      
      const response = await api.post('/plan/manageplans', planData);
      
      if (response && response.status === 1) {
        toast.success(editingPlan ? 'Plan updated successfully!' : 'Plan added successfully!');
        setFormData({ planName: '', planPrice: '', planDescription: '', isActive: true });
        setEditingPlan(null);
        setShowEditPopup(false);
        await fetchPlans(statusFilter === 'all' ? null : statusFilter === 'active');
      } else {
        toast.error('Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Error saving plan');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      planName: plan.planName,
      planPrice: plan.planPrice,
      planDescription: plan.planDescription,
      isActive: plan.isActive === 1
    });
    setShowEditPopup(true);
  };

  const handleDelete = (planId) => {
    setDeletingPlanId(planId);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await api.delete(`/plan/deletePlanById/${deletingPlanId}`);
      if (response && response.status === 1) {
        toast.success('Plan deleted successfully!');
        await fetchPlans(statusFilter === 'all' ? null : statusFilter === 'active');
      } else {
        toast.error('Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Error deleting plan');
    } finally {
      setLoading(false);
      setShowDeletePopup(false);
      setDeletingPlanId(null);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === 'all') {
      fetchPlans(null);
    } else {
      fetchPlans(status === 'active');
    }
  };
  return (
    <>
      <style>{`
        .plans-management-page {
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

        .main-content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .card.blue-border {
          border: 2px solid #3b82f6;
        }

        .card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .form-section {
          padding: 28px 24px;
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
        .form-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
          resize: vertical;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: rgba(75, 175, 71, 1);
          box-shadow: 0 0 0 3px rgba(75, 175, 71, 0.15);
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #94a3b8;
        }

        .save-btn {
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

        .save-btn:hover {
          background: rgba(65, 155, 61, 1);
        }

        /* Plans Directory */
        .directory-header {
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-wrapper {
          flex: 1;
          min-width: 240px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .filter-select {
          padding: 10px 12px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          min-width: 140px;
          font-size: 14px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: rgba(75, 175, 71, 1);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
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
          color: #334155;
          font-size: 14px;
        }

        .table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .status-active {
          color: #10b981;
          font-weight: 600;
        }

        .status-inactive {
          color: #ef4444;
          font-weight: 600;
        }

        .actions-cell {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
        }

        .action-btn:hover {
          color: #1a1a1a;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .popup {
          background: white;
          border-radius: 12px;
          padding: 32px;
          width: 500px;
          max-width: 90vw;
        }

        .popup-title {
          font-size: 20px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 24px 0;
        }

        .popup-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .btn-cancel {
          background-color: #e2e8f0;
          color: #4a5568;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-submit {
          background-color: #10b981;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .delete-popup {
          background: white;
          border-radius: 12px;
          padding: 24px;
          width: 400px;
          max-width: 90vw;
          text-align: center;
        }

        .delete-popup h3 {
          margin: 0 0 16px 0;
          color: #2d3748;
          font-size: 18px;
        }

        .delete-popup p {
          margin: 0 0 24px 0;
          color: #4a5568;
        }

        .btn-no {
          background-color: #e2e8f0;
          color: #4a5568;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 12px;
        }

        .btn-yes {
          background-color: #ef4444;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .toggle-group {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .toggle-switch {
          position: relative;
          width: 48px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e0;
          transition: .3s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #10b981;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }
      `}</style>

      <div className="plans-management-page">
        <h1 className="page-title">Plans Management</h1>
        <p className="page-subtitle">
          Create and manage subscription plans with pricing and features
        </p>

        <div className="main-content">
          {/* Add New Plan Form */}
          <div className="card blue-border">
            <div className="card-header">
              <h2 className="card-title">Add New Plan</h2>
            </div>

            <form onSubmit={handleSubmit} className="form-section">
              <div className="form-group">
                <label className="form-label">Plan Name</label>
                <input
                  type="text"
                  name="planName"
                  value={formData.planName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter Plan Name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  name="planPrice"
                  value={formData.planPrice}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter Price (₹)"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="planDescription"
                  value={formData.planDescription}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="4"
                  placeholder="Enter Description"
                  required
                />
              </div>

              <div className="toggle-group">
                <label className="form-label">Status</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <span className="slider"></span>
                </label>
                <span>{formData.isActive ? 'Active' : 'Inactive'}</span>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save Plan'}
              </button>
            </form>
          </div>

          {/* Plans Directory */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Plans Directory</h2>
            </div>

            <div className="directory-header">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for plan, id, ..."
                />
              </div>

              <select className="filter-select" value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button className="filter-btn">
                <Filter size={18} />
                Filter
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Plan Details</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
                  </tr>
                ) : plans.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No plans found</td>
                  </tr>
                ) : (
                  plans.map((plan) => (
                    <tr key={plan.planId}>
                      <td>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{plan.planName}</div>
                          <div style={{ fontSize: '13px', color: '#64748b' }}>{plan.planDescription}</div>
                        </div>
                      </td>
                      <td>₹{parseFloat(plan.planPrice).toLocaleString()}</td>
                      <td>
                        <span className={plan.isActive === 1 ? 'status-active' : 'status-inactive'}>
                          {plan.isActive === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(plan.createdAt).toLocaleDateString('en-GB')}</td>
                      <td className="actions-cell">
                        <button className="action-btn" title="Edit" onClick={() => handleEdit(plan)}>
                          <Edit size={18} />
                        </button>
                        <button className="action-btn" title="Delete" onClick={() => handleDelete(plan.planId)}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Plan Popup */}
        {showEditPopup && (
          <div className="popup-overlay" onClick={() => setShowEditPopup(false)}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <h2 className="popup-title">Edit Plan</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Plan Name</label>
                  <input
                    type="text"
                    name="planName"
                    value={formData.planName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter Plan Name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    name="planPrice"
                    value={formData.planPrice}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter Price (₹)"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="planDescription"
                    value={formData.planDescription}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows="4"
                    placeholder="Enter Description"
                    required
                  />
                </div>

                <div className="toggle-group">
                  <label className="form-label">Status</label>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <span className="slider"></span>
                  </label>
                  <span>{formData.isActive ? 'Active' : 'Inactive'}</span>
                </div>

                <div className="popup-actions">
                  <button type="button" className="btn-cancel" onClick={() => {
                    setShowEditPopup(false);
                    setEditingPlan(null);
                    setFormData({ planName: '', planPrice: '', planDescription: '', isActive: true });
                  }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <div className="popup-overlay" onClick={() => setShowDeletePopup(false)}>
            <div className="delete-popup" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Plan</h3>
              <p>Are you sure you want to delete this plan?</p>
              <div>
                <button className="btn-no" onClick={() => {
                  setShowDeletePopup(false);
                  setDeletingPlanId(null);
                }}>
                  No
                </button>
                <button className="btn-yes" onClick={confirmDelete} disabled={loading}>
                  {loading ? 'Deleting...' : 'Yes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlansManagement;