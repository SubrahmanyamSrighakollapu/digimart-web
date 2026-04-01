// PlanCommissionManager.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import planService from '../../../services/planService';
import paymentService from '../../../services/paymentService';
import lookupService from '../../../services/lookupService';

const PlanCommissionManager = () => {
  const [plans, setPlans] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [roles, setRoles] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    planId: '',
    gatewayId: '',
    roleId: ''
  });
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [deletingConfig, setDeletingConfig] = useState(null);
  const [editForm, setEditForm] = useState({ planId: '', gatewayId: '', roleId: '' });
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterGateway, setFilterGateway] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansRes, gatewaysRes, rolesRes, configsRes] = await Promise.all([
        planService.getPlans(),
        paymentService.getGateways(),
        lookupService.getUserRoles(),
        planService.getAllPlanGatewayRoleConfig()
      ]);
      
      if (plansRes.status === 1) setPlans(plansRes.result || []);
      if (gatewaysRes.status === 1) setGateways(gatewaysRes.result || []);
      if (rolesRes.status === 1) setRoles(rolesRes.result || []);
      if (configsRes.status === 1) setConfigurations(configsRes.result || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.planId || !formData.gatewayId || !formData.roleId) {
      toast.error('Please select plan, gateway, and role');
      return;
    }

    try {
      setLoading(true);
      const response = await planService.managePlanGatewayRoleConfig({
        planConfigId: 0,
        planId: parseInt(formData.planId),
        gatewayId: parseInt(formData.gatewayId),
        roleId: parseInt(formData.roleId),
        isActive: true
      });
      
      if (response.status === 1) {
        toast.success('Configuration saved successfully!');
        setFormData({ planId: '', gatewayId: '', roleId: '' });
        fetchData();
      } else {
        toast.error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config) => {
    setEditingConfig(config);
    setEditForm({
      planId: config.planId.toString(),
      gatewayId: config.gatewayId.toString(),
      roleId: config.roleId.toString()
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await planService.managePlanGatewayRoleConfig({
        planConfigId: editingConfig.planConfigId,
        planId: parseInt(editForm.planId),
        gatewayId: parseInt(editForm.gatewayId),
        roleId: parseInt(editForm.roleId),
        isActive: true
      });
      
      if (response.status === 1) {
        toast.success('Configuration updated successfully!');
        setShowEditModal(false);
        setEditingConfig(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error('Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (config) => {
    setDeletingConfig(config);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await planService.deletePlanGatewayRoleConfigById(deletingConfig.planConfigId);
      if (response.status === 1) {
        toast.success('Configuration deleted successfully!');
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast.error('Failed to delete configuration');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeletingConfig(null);
    }
  };

  const getPlanName = (planId) => {
    const plan = plans.find(p => p.planId === planId);
    return plan ? plan.planName : 'Unknown';
  };

  const getGatewayName = (gatewayId) => {
    const gateway = gateways.find(g => g.gatewayId === gatewayId);
    return gateway ? gateway.gatewayName : 'Unknown';
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.roleId === roleId);
    return role ? role.roleName : 'Unknown';
  };

  const filteredConfigurations = configurations.filter(config => {
    const planName = getPlanName(config.planId).toLowerCase();
    const gatewayName = getGatewayName(config.gatewayId).toLowerCase();
    const roleName = getRoleName(config.roleId).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = planName.includes(searchLower) || 
                         gatewayName.includes(searchLower) || 
                         roleName.includes(searchLower);
    
    const matchesPlan = !filterPlan || config.planId.toString() === filterPlan;
    const matchesRole = !filterRole || config.roleId.toString() === filterRole;
    const matchesGateway = !filterGateway || config.gatewayId.toString() === filterGateway;
    
    return matchesSearch && matchesPlan && matchesRole && matchesGateway;
  });

  return (
    <>
      <style>{`
        .commission-manager-page {
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
          padding: 28px 32px;
          margin-bottom: 32px;
          border: 2px solid #3b82f6;
        }

        .form-title {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 24px 0;
        }

        .select-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #334155;
        }

        .form-select {
          padding: 10px 14px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 15px;
          background: white;
          outline: none;
        }

        .form-select:focus {
          border-color: rgba(75, 175, 71, 1);
          box-shadow: 0 0 0 3px rgba(75, 175, 71, 0.15);
        }

        .info-box {
          background: #fefce8;
          border: 1px solid #fef08a;
          border-radius: 10px;
          padding: 16px 20px;
          color: #854d0e;
          font-size: 14px;
          line-height: 1.5;
          margin: 24px 0 32px 0;
        }

        .info-box strong {
          color: #713f12;
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

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .directory-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .directory-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .directory-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 16px 0;
        }

        .filters-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-wrapper {
          flex: 1;
          min-width: 260px;
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
          min-width: 140px;
          padding: 10px 12px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 14px;
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

        .actions-cell {
          display: flex;
          gap: 12px;
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
      `}</style>

      <div className="commission-manager-page">
        <h1 className="page-title">Plan Commission Manager</h1>
        <p className="page-subtitle">
          Configure commission structures for different plans and roles
        </p>

        <div className="form-card">
          <h2 className="form-title">Select Plan, Gateway & Role</h2>

          <div className="select-row">
            <div className="form-group">
              <label className="form-label">Select Plan</label>
              <select 
                className="form-select"
                value={formData.planId}
                onChange={(e) => setFormData({...formData, planId: e.target.value})}
              >
                <option value="">Choose Plan</option>
                {plans.map((plan) => (
                  <option key={plan.planId} value={plan.planId}>
                    {plan.planName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Gateway</label>
              <select 
                className="form-select"
                value={formData.gatewayId}
                onChange={(e) => setFormData({...formData, gatewayId: e.target.value})}
              >
                <option value="">Choose Gateway</option>
                {gateways.map((gateway) => (
                  <option key={gateway.gatewayId} value={gateway.gatewayId}>
                    {gateway.gatewayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Role</label>
              <select 
                className="form-select"
                value={formData.roleId}
                onChange={(e) => setFormData({...formData, roleId: e.target.value})}
              >
                <option value="">Choose Role</option>
                {roles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button 
            className="save-btn" 
            onClick={handleSubmit}
            disabled={loading || !formData.planId || !formData.gatewayId || !formData.roleId}
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </button>

          <div className="info-box">
            <strong>How it works:</strong><br />
            Configure which payment gateways are available for specific plans and roles. 
            This determines the payment options available to users based on their plan and role.
          </div>
        </div>

        <div className="directory-card">
          <div className="directory-header">
            <h2 className="directory-title">Configuration Directory</h2>

            <div className="filters-row">
              <div className="search-wrapper">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for plan, role, gateway..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="filter-select"
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
              >
                <option value="">All Plans</option>
                {plans.map((plan) => (
                  <option key={plan.planId} value={plan.planId}>
                    {plan.planName}
                  </option>
                ))}
              </select>

              <select 
                className="filter-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>

              <select 
                className="filter-select"
                value={filterGateway}
                onChange={(e) => setFilterGateway(e.target.value)}
              >
                <option value="">All Gateways</option>
                {gateways.map((gateway) => (
                  <option key={gateway.gatewayId} value={gateway.gatewayId}>
                    {gateway.gatewayName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Role Name</th>
                <th>Gateway Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigurations.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="no-data">
                      <h3 className="no-data-title">No Configurations Found</h3>
                      <p className="no-data-subtitle">
                        Create your first plan gateway role configuration above
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredConfigurations.map((config) => (
                  <tr key={config.planConfigId}>
                    <td>{getPlanName(config.planId)}</td>
                    <td>{getRoleName(config.roleId)}</td>
                    <td>{getGatewayName(config.gatewayId)}</td>
                    <td>
                      <span className="status-active">
                        {config.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEdit(config)}
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDelete(config)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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
                  <h5 className="modal-title">Edit Configuration</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Plan</label>
                      <select
                        className="form-select"
                        value={editForm.planId}
                        onChange={(e) => setEditForm({...editForm, planId: e.target.value})}
                        required
                      >
                        <option value="">Select Plan</option>
                        {plans.map((plan) => (
                          <option key={plan.planId} value={plan.planId}>
                            {plan.planName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Gateway</label>
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
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={editForm.roleId}
                        onChange={(e) => setEditForm({...editForm, roleId: e.target.value})}
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                          <option key={role.roleId} value={role.roleId}>
                            {role.roleName}
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
        {showDeleteModal && deletingConfig && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <p>Are you sure you want to delete the configuration for:</p>
                  <p><strong>Plan:</strong> {getPlanName(deletingConfig.planId)}</p>
                  <p><strong>Gateway:</strong> {getGatewayName(deletingConfig.gatewayId)}</p>
                  <p><strong>Role:</strong> {getRoleName(deletingConfig.roleId)}</p>
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

export default PlanCommissionManager;