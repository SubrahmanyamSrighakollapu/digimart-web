// EmployeesList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, X, Power, PowerOff } from 'lucide-react';
import { toast } from 'react-toastify';
import employeeService from '../../../services/employeeService';
import lookupService from '../../../services/lookupService';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../../components/Pagination/Pagination';

const EmployeesList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    department: '',
    roleType: '',
    statusType: '',
    joiningDate: '',
    shift: ''
  });
  const [permissions, setPermissions] = useState({
    isViewOrder: false,
    isManageInventory: false,
    isPaymentApproval: false,
    isViewReports: false
  });

  useEffect(() => {
    fetchEmployees();
    fetchLookupData();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeService.getAllEmployees();
      if (response && response.status === 1 && response.result) {
        setEmployees(response.result);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch employees';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchLookupData = async () => {
    try {
      const [deptResponse, roleResponse, statusResponse] = await Promise.all([
        lookupService.getEmployeeDepartmentTypes(),
        lookupService.getUserRoleMaster({ roleId: 0, isEmployee: true, isActive: true }),
        lookupService.getDefaultStatusTypes()
      ]);

      if (deptResponse.status === 1) setDepartments(deptResponse.result);
      if (roleResponse.status === 1) setRoles(roleResponse.result);
      if (statusResponse.status === 1) setStatusTypes(statusResponse.result);
    } catch (error) {
      console.error('Error fetching lookup data:', error);
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      fullName: employee.employeeName || '',
      mobile: employee.mobileNo || '',
      department: employee.departmentName || '',
      roleType: employee.roleName || '',
      statusType: employee.statusName || '',
      joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
      shift: employee.shifts || ''
    });
    setPermissions({
      isViewOrder: employee.isViewOrder === 1,
      isManageInventory: employee.isManageInventory === 1,
      isPaymentApproval: employee.isPaymentApproval === 1,
      isViewReports: employee.isViewReports === 1
    });
    setShowUpdatePopup(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const selectedRole = roles.find(role => role.roleName === formData.roleType);
      const selectedDepartment = departments.find(dept => dept.statusValue === formData.department);
      const selectedStatus = statusTypes.find(status => status.statusValue === formData.statusType);
      
      const employeeData = {
        userId: editingEmployee.userId,
        fullName: formData.fullName,
        email: editingEmployee.emailAddress,
        contactNo: formData.mobile,
        password: "N/A",
        isAutoPassword: true,
        roleId: selectedRole ? selectedRole.roleId : editingEmployee.roleId,
        employeeCode: editingEmployee.employeeCode,
        joiningDate: formData.joiningDate,
        shifts: formData.shift,
        departmentId: selectedDepartment ? selectedDepartment.statusId : editingEmployee.departmentId,
        isViewOrder: permissions.isViewOrder,
        isPaymentApproval: permissions.isPaymentApproval,
        isManageInventory: permissions.isManageInventory,
        isViewReports: permissions.isViewReports,
        statusId: selectedStatus ? selectedStatus.statusId : editingEmployee.statusId
      };
      
      const response = await employeeService.onboardEmployee(employeeData);
      
      if (response.status === 1) {
        toast.success('Employee updated successfully!');
        setShowUpdatePopup(false);
        setEditingEmployee(null);
        fetchEmployees();
      } else {
        toast.error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update employee';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowUpdatePopup(false);
    setEditingEmployee(null);
    setFormData({
      fullName: '',
      mobile: '',
      department: '',
      roleType: '',
      statusType: '',
      joiningDate: '',
      shift: ''
    });
    setPermissions({
      isViewOrder: false,
      isManageInventory: false,
      isPaymentApproval: false,
      isViewReports: false
    });
  };

  const handleToggleEmployeeStatus = (employee) => {
    setSelectedEmployee(employee);
    setShowConfirmPopup(true);
  };

  const confirmToggleStatus = async () => {
    try {
      setLoading(true);
      const newStatus = selectedEmployee.isActive === 1 ? false : true;
      const response = await employeeService.toggleEmployeeStatus(selectedEmployee.userId, newStatus);
      
      if (response.status === 1) {
        const action = selectedEmployee.isActive === 1 ? 'deactivated' : 'activated';
        toast.success(`Employee ${action} successfully!`);
        setShowConfirmPopup(false);
        setSelectedEmployee(null);
        fetchEmployees();
      } else {
        toast.error('Failed to update employee status');
      }
    } catch (error) {
      console.error('Error updating employee status:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update employee status';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const closeConfirmPopup = () => {
    setShowConfirmPopup(false);
    setSelectedEmployee(null);
  };

  const handleCreateEmployee = () => {
    navigate('/admin/employee-management/add-employee');
  };

  const getStatusBadgeClass = (statusName) => {
    const status = statusName?.toLowerCase();
    if (status?.includes('active') || status?.includes('approved')) return 'status-approved';
    if (status?.includes('pending') || status?.includes('review')) return 'status-pending';
    return 'status-rejected';
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.mobileNo?.includes(searchTerm) ||
                         employee.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || employee.statusName === statusFilter;
    const matchesActive = !activeFilter || 
                         (activeFilter === 'active' && employee.isActive === 1) ||
                         (activeFilter === 'inactive' && employee.isActive === 0);
    return matchesSearch && matchesStatus && matchesActive;
  });

  const uniqueStatuses = [...new Set(employees.map(employee => employee.statusName).filter(Boolean))];

  const { currentPage, totalPages, currentRecords, handlePageChange } = usePagination(filteredEmployees, 5);

  return (
    <>
      <style>{`
        .employees-list-page {
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
          width: 700px;
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

        .form-group input:disabled {
          background: #f9fafb;
          color: #6b7280;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .permissions-section {
          margin-bottom: 20px;
        }

        .permissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #10b981;
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

      <div className="employees-list-page">
        <div className="page-header">
          <h1 className="page-title">Employee List</h1>
          <button className="create-btn" onClick={handleCreateEmployee}>
            <Plus size={18} />
            Add New Employee
          </button>
        </div>

        <div className="filter-bar">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, mobile, code..."
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
            <option value="">All Employees</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No employees found
                  </td>
                </tr>
              ) : (
                currentRecords.map((employee) => (
                  <tr key={employee.empId}>
                    <td>{employee.employeeCode}</td>
                    <td>{employee.employeeName || 'N/A'}</td>
                    <td>{employee.departmentName || 'N/A'}</td>
                    <td>{employee.roleName || 'N/A'}</td>
                    <td>+91 {employee.mobileNo || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(employee.statusName)}`}>
                        {employee.statusName || 'N/A'}
                      </span>
                    </td>
                    <td className="action-icons">
                      <button className="action-btn" onClick={() => handleEditEmployee(employee)}>
                        <Edit size={18} />
                      </button>
                      <button 
                        className="action-btn" 
                        onClick={() => handleToggleEmployeeStatus(employee)}
                        title={employee.isActive === 1 ? 'Deactivate Employee' : 'Activate Employee'}
                      >
                        {employee.isActive === 1 ? <PowerOff size={18} /> : <Power size={18} />}
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
                <h2 className="popup-title">Update Employee</h2>
                <button className="close-btn" onClick={closePopup}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateEmployee}>
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
                    <label>Email ID</label>
                    <input
                      type="email"
                      value={editingEmployee?.emailAddress}
                      disabled
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Employee Code</label>
                    <input
                      type="text"
                      value={editingEmployee?.employeeCode}
                      disabled
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.statusId} value={dept.statusValue}>
                          {dept.statusValue}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Role Type</label>
                    <select
                      name="roleType"
                      value={formData.roleType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Role Type</option>
                      {roles.map((role) => (
                        <option key={role.roleId} value={role.roleName}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Status Type</label>
                    <select
                      name="statusType"
                      value={formData.statusType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Status Type</option>
                      {statusTypes.map((status) => (
                        <option key={status.statusId} value={status.statusValue}>
                          {status.statusValue}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Joining Date</label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Shift</label>
                    <input
                      type="text"
                      name="shift"
                      value={formData.shift}
                      onChange={handleInputChange}
                      placeholder="Enter shift details"
                    />
                  </div>
                </div>
                
                <div className="permissions-section">
                  <label>Permissions</label>
                  <div className="permissions-grid">
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="viewOrders"
                        checked={permissions.isViewOrder}
                        onChange={() => handlePermissionChange('isViewOrder')}
                      />
                      <label htmlFor="viewOrders">View Orders</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="manageInventory"
                        checked={permissions.isManageInventory}
                        onChange={() => handlePermissionChange('isManageInventory')}
                      />
                      <label htmlFor="manageInventory">Manage Inventory</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="approvePayments"
                        checked={permissions.isPaymentApproval}
                        onChange={() => handlePermissionChange('isPaymentApproval')}
                      />
                      <label htmlFor="approvePayments">Approve Payments</label>
                    </div>
                    <div className="checkbox-group">
                      <input
                        type="checkbox"
                        id="viewReports"
                        checked={permissions.isViewReports}
                        onChange={() => handlePermissionChange('isViewReports')}
                      />
                      <label htmlFor="viewReports">View Reports</label>
                    </div>
                  </div>
                </div>
                
                <div className="popup-actions">
                  <button type="button" className="btn-cancel" onClick={closePopup}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-update" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showConfirmPopup && selectedEmployee && (
          <div className="popup-overlay" onClick={closeConfirmPopup}>
            <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
              <h3 className="confirm-title">
                {selectedEmployee.isActive === 1 ? 'Deactivate Employee' : 'Activate Employee'}
              </h3>
              <p className="confirm-message">
                Are you sure you want to {selectedEmployee.isActive === 1 ? 'deactivate' : 'activate'} employee <strong>{selectedEmployee.employeeName}</strong>?
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

export default EmployeesList;