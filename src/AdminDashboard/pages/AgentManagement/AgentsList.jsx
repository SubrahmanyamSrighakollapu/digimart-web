// AgentsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, X, Power, PowerOff, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import agentService from '../../../services/agentService';
import lookupService from '../../../services/lookupService';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../../components/Pagination/Pagination';

const AgentsList = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);
  const [plans, setPlans] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [formData, setFormData] = useState({
    agentName: '',
    email: '',
    mobile: '',
    businessName: '',
    address: '',
    statusType: ''
  });
  const [planFormData, setPlanFormData] = useState({
    planId: '',
    planStartDate: '',
    planEndDate: ''
  });

  useEffect(() => {
    fetchAgents();
    fetchStatusTypes();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await agentService.getAllAgents();
      if (response && response.status === 1 && response.result) {
        setAgents(response.result);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch agents';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusTypes = async () => {
    try {
      const response = await lookupService.getDefaultStatusTypes();
      if (response.status === 1 && response.result) {
        setStatusTypes(response.result);
      }
    } catch (error) {
      console.error('Error fetching status types:', error);
    }
  };

  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
    setFormData({
      agentName: agent.userFullName || '',
      email: agent.emailAddress || '',
      mobile: agent.contactNo || '',
      businessName: agent.businessName || '',
      address: agent.agentAddress || '',
      statusType: agent.statusName || ''
    });
    setShowUpdatePopup(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const selectedStatus = statusTypes.find(status => status.statusValue === formData.statusType);
      
      const agentData = {
        agentId: editingAgent.agentId,
        agentName: formData.agentName,
        email: formData.email,
        mobile: formData.mobile,
        businessName: formData.businessName,
        address: formData.address,
        statusId: selectedStatus ? selectedStatus.statusId : editingAgent.statusId,
        isActive: editingAgent.isActive
      };
      
      const response = await agentService.updateAgent(editingAgent.agentId, agentData);
      
      if (response.status === 1) {
        toast.success('Agent updated successfully!');
        setShowUpdatePopup(false);
        setEditingAgent(null);
        fetchAgents();
      } else {
        toast.error(response.message || 'Failed to update agent');
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update agent';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowUpdatePopup(false);
    setEditingAgent(null);
    setFormData({
      agentName: '',
      email: '',
      mobile: '',
      businessName: '',
      address: '',
      statusType: ''
    });
  };

  const handleToggleAgentStatus = (agent) => {
    setSelectedAgent(agent);
    setShowConfirmPopup(true);
  };

  const confirmToggleStatus = async () => {
    try {
      setLoading(true);
      const newStatus = selectedAgent.isActive === 1 ? false : true;
      const payload = {
        userId: selectedAgent.userId,
        isActive: newStatus
      };
      const response = await agentService.updateAgentStatus(payload);
      
      if (response.status === 1) {
        const action = selectedAgent.isActive === 1 ? 'deactivated' : 'activated';
        toast.success(`Agent ${action} successfully!`);
        setShowConfirmPopup(false);
        setSelectedAgent(null);
        fetchAgents();
      } else {
        toast.error(response.message || 'Failed to update agent status');
      }
    } catch (error) {
      console.error('Error updating agent status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update agent status';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closeConfirmPopup = () => {
    setShowConfirmPopup(false);
    setSelectedAgent(null);
  };

  const handleAddPlan = (agent) => {
    setSelectedAgent(agent);
    fetchPlans();
    setShowPlanPopup(true);
  };

  const fetchPlans = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('https://api.totalneeds.in/api/plan/getAllPlans/0/true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 1 && data.result) {
        setPlans(data.result);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to fetch plans');
    }
  };

  const handlePlanInputChange = (e) => {
    const { name, value } = e.target;
    setPlanFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignPlan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const selectedPlan = plans.find(plan => plan.planId === parseInt(planFormData.planId));
      
      const payload = {
        userPlanId: 0,
        userId: selectedAgent.userId,
        planId: parseInt(planFormData.planId),
        planPrice: parseFloat(selectedPlan.planPrice),
        planStartDate: planFormData.planStartDate,
        planEndDate: planFormData.planEndDate,
        isActive: true
      };

      const response = await fetch('https://api.totalneeds.in/api/plan/user-plan-mapping', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.status === 1) {
        toast.success('Plan assigned successfully!');
        closePlanPopup();
      } else {
        toast.error(data.message || 'Failed to assign plan');
      }
    } catch (error) {
      console.error('Error assigning plan:', error);
      toast.error('Failed to assign plan');
    } finally {
      setLoading(false);
    }
  };

  const closePlanPopup = () => {
    setShowPlanPopup(false);
    setSelectedAgent(null);
    setPlanFormData({
      planId: '',
      planStartDate: '',
      planEndDate: ''
    });
  };

  const handleCreateAgent = () => {
    navigate('/admin/agent-management/add-agent');
  };

  const getStatusBadgeClass = (statusName) => {
    const status = statusName?.toLowerCase();
    if (status?.includes('active') || status?.includes('approved')) return 'status-approved';
    if (status?.includes('pending') || status?.includes('review')) return 'status-pending';
    return 'status-rejected';
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.contactNo?.includes(searchTerm) ||
                         agent.businessName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || agent.statusName === statusFilter;
    const matchesActive = !activeFilter || 
                         (activeFilter === 'active' && agent.isActive === 1) ||
                         (activeFilter === 'inactive' && agent.isActive === 0);
    return matchesSearch && matchesStatus && matchesActive;
  });

  const uniqueStatuses = [...new Set(agents.map(agent => agent.statusName).filter(Boolean))];

  const { currentPage, totalPages, currentRecords, handlePageChange } = usePagination(filteredAgents, 5);

  return (
    <>
      <style>{`
        .agents-list-page {
          padding: 24px 32px;
          background: #f5f7fa;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .create-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .create-btn:hover {
          background: #059669;
        }

        .filter-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-wrapper {
          flex: 1;
          min-width: 300px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 15px;
          outline: none;
        }

        .search-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .select {
          padding: 12px 16px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 15px;
          min-width: 160px;
          background: white;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
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
        }

        .table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-approved {
          background: #d1fae5;
          color: #065f46;
        }

        .status-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .action-icons {
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

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          color: #64748b;
          font-size: 14px;
        }

        .pagination-numbers {
          display: flex;
          gap: 8px;
        }

        .page-number {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          cursor: pointer;
        }

        .page-number.active {
          background: #10b981;
          color: white;
          font-weight: 600;
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
          width: 600px;
          max-width: 95vw;
          max-height: 90vh;
          overflow-y: auto;
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .popup-title {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 4px;
        }

        .close-btn:hover {
          color: #1a1a1a;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          background: white;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .popup-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          margin-top: 32px;
        }

        .btn-cancel {
          padding: 12px 24px;
          background-color: #f3f4f6;
          color: #6b7280;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-update {
          padding: 12px 24px;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-update:hover {
          background-color: #059669;
        }

        .btn-update:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .confirm-popup {
          background: white;
          border-radius: 12px;
          padding: 24px;
          width: 400px;
          max-width: 95vw;
          text-align: center;
        }

        .confirm-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 16px 0;
        }

        .confirm-message {
          color: #64748b;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .confirm-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-yes {
          padding: 10px 20px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-no {
          padding: 10px 20px;
          background-color: #f3f4f6;
          color: #6b7280;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>

      <div className="agents-list-page">
        <div className="page-header">
          <h1 className="page-title">Agent List</h1>
          <button className="create-btn" onClick={handleCreateAgent}>
            <Plus size={18} />
            Add New Agent
          </button>
        </div>

        <div className="filter-bar">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, mobile, business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select className="select" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
            <option value="">All Agents</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Agent ID</th>
                <th>Name</th>
                <th>Business</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    Loading agents...
                  </td>
                </tr>
              ) : filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No agents found
                  </td>
                </tr>
              ) : (
                currentRecords.map((agent) => (
                  <tr key={agent.agentId}>
                    <td>{agent.agentCode}</td>
                    <td>{agent.userFullName || 'N/A'}</td>
                    <td>{agent.businessName || 'N/A'}</td>
                    <td>{agent.contactNo || 'N/A'}</td>
                    <td>{agent.agentAddress || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(agent.statusName)}`}>
                        {agent.statusName || 'N/A'}
                      </span>
                    </td>
                    <td className="action-icons">
                      <button className="action-btn" onClick={() => handleEditAgent(agent)}>
                        <Edit size={18} />
                      </button>
                      <button 
                        className="action-btn" 
                        onClick={() => handleToggleAgentStatus(agent)}
                        title={agent.isActive === 1 ? 'Deactivate Agent' : 'Activate Agent'}
                      >
                        {agent.isActive === 1 ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                      <button className="action-btn" onClick={() => handleAddPlan(agent)} title="Add Plan">
                        <FileText size={18} />
                      </button>
                      <button className="action-btn"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {showUpdatePopup && (
          <div className="popup-overlay" onClick={closePopup}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h2 className="popup-title">Update Agent</h2>
                <button className="close-btn" onClick={closePopup}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateAgent}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Agent Name</label>
                    <input
                      type="text"
                      name="agentName"
                      value={formData.agentName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Mobile</label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="statusType"
                      value={formData.statusType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Status</option>
                      {statusTypes.map((status) => (
                        <option key={status.statusId} value={status.statusValue}>
                          {status.statusValue}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      required
                    />
                  </div>
                </div>
                
                <div className="popup-actions">
                  <button type="button" className="btn-cancel" onClick={closePopup}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-update" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Agent'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showConfirmPopup && selectedAgent && (
          <div className="popup-overlay" onClick={closeConfirmPopup}>
            <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
              <h3 className="confirm-title">
                {selectedAgent.isActive === 1 ? 'Deactivate Agent' : 'Activate Agent'}
              </h3>
              <p className="confirm-message">
                Are you sure you want to {selectedAgent.isActive === 1 ? 'deactivate' : 'activate'} agent <strong>{selectedAgent.userFullName}</strong>?
              </p>
              <div className="confirm-actions">
                <button className="btn-yes" onClick={confirmToggleStatus} disabled={loading}>
                  {loading ? 'Processing...' : 'Yes'}
                </button>
                <button className="btn-no" onClick={closeConfirmPopup}>
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {showPlanPopup && selectedAgent && (
          <div className="popup-overlay" onClick={closePlanPopup}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h2 className="popup-title">Assign Plan to {selectedAgent.userFullName}</h2>
                <button className="close-btn" onClick={closePlanPopup}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAssignPlan}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Select Plan *</label>
                    <select
                      name="planId"
                      value={planFormData.planId}
                      onChange={handlePlanInputChange}
                      required
                    >
                      <option value="">Choose a plan</option>
                      {plans.map((plan) => (
                        <option key={plan.planId} value={plan.planId}>
                          {plan.planName} - ₹{plan.planPrice}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      name="planStartDate"
                      value={planFormData.planStartDate}
                      onChange={handlePlanInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="date"
                      name="planEndDate"
                      value={planFormData.planEndDate}
                      onChange={handlePlanInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="popup-actions">
                  <button type="button" className="btn-cancel" onClick={closePlanPopup}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-update" disabled={loading}>
                    {loading ? 'Assigning...' : 'Assign Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgentsList;