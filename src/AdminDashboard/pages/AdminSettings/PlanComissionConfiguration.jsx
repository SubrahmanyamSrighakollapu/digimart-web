import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Edit2, Save, X } from 'lucide-react';
import planService from '../../../services/planService';
import lookupService from '../../../services/lookupService';
import paymentService from '../../../services/paymentService';

const PlanCommissionConfiguration = () => {
  const [plans, setPlans] = useState([]);
  const [roles, setRoles] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('');
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchRoles();
    fetchGateways();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await planService.getPlans();
      if (response.status === 1 && response.result) {
        setPlans(response.result);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to fetch plans');
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await lookupService.getUserRoles();
      if (response.status === 1 && response.result) {
        setRoles(response.result);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    }
  };

  const fetchGateways = async () => {
    try {
      const response = await paymentService.getGateways();
      if (response.status === 1 && response.result) {
        setGateways(response.result);
      }
    } catch (error) {
      console.error('Error fetching gateways:', error);
      toast.error('Failed to fetch gateways');
    }
  };

  const handleSelect = async () => {
    if (!selectedPlan || !selectedRole || !selectedGateway) {
      toast.error('Please select Plan, Role, and Gateway');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        planId: parseInt(selectedPlan),
        roleId: parseInt(selectedRole),
        gatewayId: parseInt(selectedGateway)
      };

      const response = await planService.getPlanRoleGatewayCommissions(payload);
      
      if (response.status === 1 && response.result) {
        setCommissions(response.result.map(item => ({
          ...item,
          tempCommission: item.planCommission || ''
        })));
        toast.success('Commission data loaded successfully');
      } else {
        toast.error(response.message || 'Failed to fetch commissions');
      }
    } catch (error) {
      console.error('Error fetching commissions:', error);
      toast.error(error.message || 'Failed to fetch commissions');
    } finally {
      setLoading(false);
    }
  };

  const handleCommissionChange = (index, value) => {
    const updated = [...commissions];
    updated[index].tempCommission = value;
    setCommissions(updated);
  };

  const handleSubmitNew = async () => {
    const newCommissions = commissions.filter(c => !c.planCommissionsId);
    
    if (newCommissions.length === 0) {
      toast.error('No new commissions to submit');
      return;
    }

    const invalidCommissions = newCommissions.filter(c => !c.tempCommission || parseFloat(c.tempCommission) <= 0);
    if (invalidCommissions.length > 0) {
      toast.error('Please enter valid commission rates for all records');
      return;
    }

    try {
      setLoading(true);
      const payload = newCommissions.map(item => ({
        planCommissionsId: 0,
        planConfigId: item.planConfigId,
        methodId: item.methodId || 0,
        methodOptionId: item.methodOptionId || 0,
        planCommission: parseFloat(item.tempCommission),
        isActive: true
      }));

      const response = await planService.managePlanGatewayRoleCommission(payload);
      
      if (response.status === 1) {
        toast.success('Commissions submitted successfully!');
        handleSelect(); // Refresh data
      } else {
        toast.error(response.message || 'Failed to submit commissions');
      }
    } catch (error) {
      console.error('Error submitting commissions:', error);
      toast.error(error.message || 'Failed to submit commissions');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setEditingId(index);
  };

  const handleCancelEdit = (index) => {
    const updated = [...commissions];
    updated[index].tempCommission = updated[index].planCommission;
    setCommissions(updated);
    setEditingId(null);
  };

  const handleSaveEdit = async (index) => {
    const item = commissions[index];
    
    if (!item.tempCommission || parseFloat(item.tempCommission) <= 0) {
      toast.error('Please enter a valid commission rate');
      return;
    }

    try {
      setLoading(true);
      const payload = [{
        planCommissionsId: item.planCommissionsId,
        planConfigId: item.planConfigId,
        methodId: item.methodId || 0,
        methodOptionId: item.methodOptionId || 0,
        planCommission: parseFloat(item.tempCommission),
        isActive: true
      }];

      const response = await planService.managePlanGatewayRoleCommission(payload);
      
      if (response.status === 1) {
        toast.success('Commission updated successfully!');
        setEditingId(null);
        handleSelect(); // Refresh data
      } else {
        toast.error(response.message || 'Failed to update commission');
      }
    } catch (error) {
      console.error('Error updating commission:', error);
      toast.error(error.message || 'Failed to update commission');
    } finally {
      setLoading(false);
    }
  };

  const hasNewCommissions = commissions.some(c => !c.planCommissionsId);

  return (
    <>
      <style>{`
        .commission-config-page {
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

        .selection-card {
          background: white;
          border-radius: 12px;
          padding: 28px 32px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }

        .selection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr) auto;
          gap: 16px;
          align-items: end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
        }

        .form-select {
          padding: 12px 16px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 15px;
          background: white;
          cursor: pointer;
        }

        .form-select:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
        }

        .select-btn {
          padding: 12px 32px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .select-btn:hover {
          background: #059669;
        }

        .select-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .table-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .table-container {
          overflow-x: auto;
        }

        .commission-table {
          width: 100%;
          border-collapse: collapse;
        }

        .commission-table th,
        .commission-table td {
          padding: 16px 20px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .commission-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .commission-table tbody tr:hover {
          background: #f8fafc;
        }

        .commission-input {
          padding: 8px 12px;
          border: 1px solid #d1d9e0;
          border-radius: 6px;
          font-size: 14px;
          width: 100px;
        }

        .commission-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16,185,129,0.15);
        }

        .commission-input:disabled {
          background: #f8fafc;
          color: #64748b;
          cursor: not-allowed;
        }

        .action-btns {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          padding: 6px;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .icon-btn:hover {
          background: #f1f5f9;
          color: #1a1a1a;
        }

        .icon-btn.save {
          color: #10b981;
        }

        .icon-btn.save:hover {
          background: #d1fae5;
        }

        .icon-btn.cancel {
          color: #ef4444;
        }

        .icon-btn.cancel:hover {
          background: #fee2e2;
        }

        .submit-section {
          padding: 24px 32px;
          display: flex;
          justify-content: flex-end;
        }

        .submit-btn {
          padding: 12px 32px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background: #059669;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: #64748b;
        }

        @media (max-width: 1024px) {
          .selection-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="commission-config-page">
        <h1 className="page-title">Plan Commission Configuration</h1>
        <p className="page-subtitle">Configure commission rates for plan, role, and gateway combinations</p>

        <div className="selection-card">
          <div className="selection-grid">
            <div className="form-group">
              <label className="form-label">Select Plan</label>
              <select 
                className="form-select"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
              >
                <option value="">Choose Plan</option>
                {plans.map(plan => (
                  <option key={plan.planId} value={plan.planId}>
                    {plan.planName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Role</label>
              <select 
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Choose Role</option>
                {roles.map(role => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Gateway</label>
              <select 
                className="form-select"
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value)}
              >
                <option value="">Choose Gateway</option>
                {gateways.map(gateway => (
                  <option key={gateway.gatewayId} value={gateway.gatewayId}>
                    {gateway.gatewayName}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="select-btn" 
              onClick={handleSelect}
              disabled={loading || !selectedPlan || !selectedRole || !selectedGateway}
            >
              {loading ? 'Loading...' : 'Select'}
            </button>
          </div>
        </div>

        {commissions.length > 0 && (
          <div className="table-card">
            <div className="table-container">
              <table className="commission-table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Role</th>
                    <th>Gateway</th>
                    <th>Method</th>
                    <th>Option</th>
                    <th>Commission Rate (%)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((item, index) => (
                    <tr key={index}>
                      <td>{item.planName}</td>
                      <td>{item.roleName}</td>
                      <td>{item.gatewayName}</td>
                      <td>{item.methodName || 'N/A'}</td>
                      <td>{item.optionName || 'N/A'}</td>
                      <td>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="commission-input"
                          value={item.tempCommission}
                          onChange={(e) => handleCommissionChange(index, e.target.value)}
                          disabled={item.planCommissionsId && editingId !== index}
                          placeholder="0.00"
                        />
                      </td>
                      <td>
                        {item.planCommissionsId ? (
                          <div className="action-btns">
                            {editingId === index ? (
                              <>
                                <button 
                                  className="icon-btn save" 
                                  onClick={() => handleSaveEdit(index)}
                                  disabled={loading}
                                  title="Save"
                                >
                                  <Save size={18} />
                                </button>
                                <button 
                                  className="icon-btn cancel" 
                                  onClick={() => handleCancelEdit(index)}
                                  title="Cancel"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            ) : (
                              <button 
                                className="icon-btn" 
                                onClick={() => handleEdit(index)}
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '13px' }}>New</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasNewCommissions && (
              <div className="submit-section">
                <button 
                  className="submit-btn" 
                  onClick={handleSubmitNew}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Commissions'}
                </button>
              </div>
            )}
          </div>
        )}

        {commissions.length === 0 && selectedPlan && selectedRole && selectedGateway && !loading && (
          <div className="table-card">
            <div className="empty-state">
              <p>No commission data found for the selected combination.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlanCommissionConfiguration;
