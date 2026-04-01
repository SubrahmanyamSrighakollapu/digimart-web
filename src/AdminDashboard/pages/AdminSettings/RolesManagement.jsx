// RolesManagement.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RolesManagement = () => {
  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [defaultCommission, setDefaultCommission] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [isEmployee, setIsEmployee] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    fetchRoles();
  }, [isEmployee]);

  const fetchRoles = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/getuserrolemaster`, {
        roleId: 0,
        isEmployee: isEmployee,
        isActive: true
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data.status === 1) {
        setRoles(response.data.result || []);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleSave = async () => {
    if (!roleName.trim() || !roleCode.trim()) {
      toast.error('Please enter role name and role code');
      return;
    }

    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/manageuserrolemaster`, {
        roleId: 0,
        roleName: roleName,
        roleCode: roleCode,
        parentId: 1,
        hierarchyLevel: 1,
        defaultCommission: parseFloat(defaultCommission) || 0,
        isEmployee: true,
        isActive: true
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.status === 1) {
        toast.success('Role created successfully');
        setRoleName('');
        setRoleCode('');
        setDefaultCommission('');
        fetchRoles();
      } else {
        toast.error(response.data.message || 'Failed to create role');
      }
    } catch (error) {
      toast.error('Error creating role');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setEditRole(role);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editRole.roleName.trim() || !editRole.roleCode.trim()) {
      toast.error('Please enter role name and role code');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/manageuserrolemaster`, {
        roleId: editRole.roleId,
        roleName: editRole.roleName,
        roleCode: editRole.roleCode,
        parentId: editRole.parentId || 1,
        hierarchyLevel: editRole.hierarchyLevel || 1,
        defaultCommission: editRole.defaultCommission || 0,
        isEmployee: true,
        isActive: true
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.status === 1) {
        toast.success('Role updated successfully');
        setShowEditModal(false);
        setEditRole(null);
        fetchRoles();
      } else {
        toast.error(response.data.message || 'Failed to update role');
      }
    } catch (error) {
      toast.error('Error updating role');
    }
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/deleteuserrolemaster/${deleteConfirm.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.status === 1) {
        toast.success('Role deleted successfully');
        fetchRoles();
      }
    } catch (error) {
      toast.error('Error deleting role');
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  return (
    <>
      <style>{`
        .roles-management-page {
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
          display: grid;
          grid-template-columns: 1fr;
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
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #334155;
          margin-bottom: 6px;
          display: block;
        }

        .form-input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
        }

        .form-input:focus {
          border-color: rgba(75, 175, 71, 1);
          box-shadow: 0 0 0 3px rgba(75, 175, 71, 0.15);
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
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          font-size: 14px;
        }

        .table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
        }

        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          margin-left: 12px;
        }

        .action-btn:hover {
          color: #ef4444;
        }

        .filter-dropdown {
          padding: 8px 16px;
          border: 1px solid #d1d9e0;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          background: white;
          cursor: pointer;
          outline: none;
        }

        .filter-dropdown:focus {
          border-color: rgba(75, 175, 71, 1);
          box-shadow: 0 0 0 3px rgba(75, 175, 71, 0.15);
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .pagination-btn {
          padding: 8px 12px;
          border: 1px solid #d1d9e0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-btn.active {
          background: rgba(75, 175, 71, 1);
          color: white;
          border-color: rgba(75, 175, 71, 1);
        }

        .header-with-filter {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>

      <div className="roles-management-page">
        <h1 className="page-title">Roles Management</h1>
        <p className="page-subtitle">Create and manage user roles</p>

        <div className="main-content">
          <div className="card blue-border">
            <div className="card-header">
              <h2 className="card-title">Add New Role</h2>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Role Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter Role Name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter Role Code"
                  value={roleCode}
                  onChange={(e) => setRoleCode(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Default Commission Rate (%)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter Commission Rate"
                  value={defaultCommission}
                  onChange={(e) => setDefaultCommission(e.target.value)}
                />
              </div>

              <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Role'}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="header-with-filter">
                <h2 className="card-title">Roles Directory</h2>
                <select 
                  className="filter-dropdown"
                  value={isEmployee ? 'employees' : 'non-employees'}
                  onChange={(e) => setIsEmployee(e.target.value === 'employees')}
                >
                  <option value="non-employees">Non-Employees</option>
                  <option value="employees">Employees</option>
                </select>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Role Code</th>
                  <th>Commission</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles
                    .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                    .map((role) => (
                      <tr key={role.roleId}>
                        <td>{role.roleName}</td>
                        <td>{role.roleCode}</td>
                        <td>{role.defaultCommission}%</td>
                        <td>
                          <button className="action-btn" onClick={() => handleEdit(role)}>
                            <Edit size={18} />
                          </button>
                          <button className="action-btn" onClick={() => setDeleteConfirm({ show: true, id: role.roleId })}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No roles found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {roles.length > 0 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.ceil(roles.length / recordsPerPage) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(roles.length / recordsPerPage)))}
                  disabled={currentPage === Math.ceil(roles.length / recordsPerPage)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editRole && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }} onClick={() => setShowEditModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '500px',
            maxWidth: '90%'
          }} onClick={(e) => e.stopPropagation()}>
            <h5 style={{ marginBottom: '20px', fontWeight: '600' }}>Edit Role</h5>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Role Name</label>
              <input
                type="text"
                className="form-input"
                value={editRole.roleName}
                onChange={(e) => setEditRole({ ...editRole, roleName: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Role Code</label>
              <input
                type="text"
                className="form-input"
                value={editRole.roleCode}
                onChange={(e) => setEditRole({ ...editRole, roleCode: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setShowEditModal(false)} style={{
                padding: '8px 20px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>Cancel</button>
              <button onClick={handleUpdate} style={{
                padding: '8px 20px',
                background: '#4BAF47',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }} onClick={() => setDeleteConfirm({ show: false, id: null })}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '400px',
            maxWidth: '90%'
          }} onClick={(e) => e.stopPropagation()}>
            <h5 style={{ marginBottom: '16px', fontWeight: '600' }}>Confirm Delete</h5>
            <p style={{ marginBottom: '24px', color: '#6b7280' }}>Are you sure you want to delete this role?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirm({ show: false, id: null })} style={{
                padding: '8px 20px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>Cancel</button>
              <button onClick={handleDelete} style={{
                padding: '8px 20px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RolesManagement;
