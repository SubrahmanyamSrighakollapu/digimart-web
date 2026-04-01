// UsersList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, X, Power, PowerOff } from 'lucide-react';
import { toast } from 'react-toastify';
import userService from '../../../services/userService';
import lookupService from '../../../services/lookupService';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../../components/Pagination/Pagination';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    role: '',
    statusType: '',
    aadharNo: '',
    panNo: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchStatusTypes();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response && response.status === 1 && response.result) {
        setUsers(response.result);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const payload = { roleId: 0, isEmployee: false, isActive: true };
      const response = await lookupService.getUserRoleMaster(payload);
      if (response.status === 1 && response.result) {
        setRoles(response.result);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
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

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.userFullName,
      email: user.emailAddress,
      mobile: user.contactNo,
      role: user.roleName,
      statusType: user.statusName,
      aadharNo: user.aadharNo,
      panNo: user.panNo
    });
    setShowUpdatePopup(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const selectedRole = roles.find(role => role.roleName === formData.role);
      const selectedStatus = statusTypes.find(status => status.statusValue === formData.statusType);
      
      const userData = {
        userId: editingUser.userId,
        fullName: formData.fullName,
        email: formData.email,
        contactNo: formData.mobile,
        password: "N/A",
        isAutoPassword: true,
        roleId: selectedRole ? selectedRole.roleId : editingUser.roleId,
        aadharNo: formData.aadharNo,
        panNo: formData.panNo,
        statusId: selectedStatus ? selectedStatus.statusId : editingUser.statusId,
        isAadharVerify: editingUser.isAadharVerify === 1,
        panNoVerify: editingUser.panNoVerify === 1,
        isActive: editingUser.isActive === 1
      };
      
      const response = await userService.createUser(userData);
      
      if (response.status === 1) {
        toast.success('User updated successfully!');
        setShowUpdatePopup(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowUpdatePopup(false);
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      role: '',
      statusType: '',
      aadharNo: '',
      panNo: ''
    });
  };

  const handleToggleUserStatus = (user) => {
    setSelectedUser(user);
    setShowConfirmPopup(true);
  };

  const confirmToggleStatus = async () => {
    try {
      setLoading(true);
      const newStatus = selectedUser.isActive === 1 ? false : true;
      const response = await userService.updateUserStatus(selectedUser.userId, { status: newStatus });
      
      if (response.status === 1) {
        const action = selectedUser.isActive === 1 ? 'deactivated' : 'activated';
        toast.success(`User ${action} successfully!`);
        setShowConfirmPopup(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const closeConfirmPopup = () => {
    setShowConfirmPopup(false);
    setSelectedUser(null);
  };

  const handleCreateUser = () => {
    navigate('/admin/user-management/create-user');
  };

  const getStatusBadgeClass = (statusName) => {
    const status = statusName?.toLowerCase();
    if (status?.includes('active') || status?.includes('approved')) return 'status-approved';
    if (status?.includes('pending') || status?.includes('review')) return 'status-pending';
    return 'status-rejected';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.contactNo?.includes(searchTerm);
    const matchesRole = !roleFilter || user.roleName === roleFilter;
    const matchesStatus = !statusFilter || user.statusName === statusFilter;
    const matchesActive = !activeFilter || 
                         (activeFilter === 'active' && user.isActive === 1) ||
                         (activeFilter === 'inactive' && user.isActive === 0);
    return matchesSearch && matchesRole && matchesStatus && matchesActive;
  });

  const uniqueRoles = [...new Set(users.map(user => user.roleName).filter(Boolean))];
  const uniqueStatuses = [...new Set(users.map(user => user.statusName).filter(Boolean))];

  const { currentPage, totalPages, currentRecords, handlePageChange } = usePagination(filteredUsers, 5);
  return (
    <>
      <style>{`
        .users-list-page {
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
        .form-group select {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus {
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

      <div className="users-list-page">
        <div className="page-header">
          <h1 className="page-title">User List</h1>
          <button className="create-btn" onClick={handleCreateUser}>
            <Plus size={18} />
            Create New User
          </button>
        </div>

        <div className="filter-bar">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Role</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select className="select" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
            <option value="">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Mobile</th>
                <th>Wallet Balance</th>
                <th>Status Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                currentRecords.map((user) => (
                  <tr key={user.userManagementId}>
                    <td>USER-{user.userId}</td>
                    <td>{user.userFullName}</td>
                    <td>{user.roleName}</td>
                    <td>+91 {user.contactNo}</td>
                    <td>₹0</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(user.statusName)}`}>
                        {user.statusName}
                      </span>
                    </td>
                    <td className="action-icons">
                      <button className="action-btn" onClick={() => handleEditUser(user)}>
                        <Edit size={18} />
                      </button>
                      <button 
                        className="action-btn" 
                        onClick={() => handleToggleUserStatus(user)}
                        title={user.isActive === 1 ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.isActive === 1 ? <PowerOff size={18} /> : <Power size={18} />}
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
                <h2 className="popup-title">Update User</h2>
                <button className="close-btn" onClick={closePopup}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateUser}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
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
                    <label>Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.roleId} value={role.roleName}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
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
                  
                  <div className="form-group">
                    <label>Aadhaar Number</label>
                    <input
                      type="text"
                      name="aadharNo"
                      value={formData.aadharNo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>PAN Number</label>
                    <input
                      type="text"
                      name="panNo"
                      value={formData.panNo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="popup-actions">
                  <button type="button" className="btn-cancel" onClick={closePopup}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-update" disabled={loading}>
                    {loading ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showConfirmPopup && selectedUser && (
          <div className="popup-overlay" onClick={closeConfirmPopup}>
            <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
              <h3 className="confirm-title">
                {selectedUser.isActive === 1 ? 'Deactivate User' : 'Activate User'}
              </h3>
              <p className="confirm-message">
                Are you sure you want to {selectedUser.isActive === 1 ? 'deactivate' : 'activate'} user <strong>{selectedUser.userFullName}</strong>?
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
      </div>
    </>
  );
};

export default UsersList;