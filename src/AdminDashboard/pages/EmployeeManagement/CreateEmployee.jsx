// src/AdminDashboard/pages/CreateEmployee/CreateEmployee.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import lookupService from '../../../services/lookupService';
import employeeService from '../../../services/employeeService';

const CreateEmployee = () => {
  const [step, setStep] = useState(1);
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    employeeId: '',
    department: '',
    roleType: '',
    statusType: '',
    joiningDate: '',
    shift: '',
    password: ''
  });
  const [permissions, setPermissions] = useState({
    isViewOrder: false,
    isManageInventory: false,
    isPaymentApproval: false,
    isViewReports: false
  });

  useEffect(() => {
    fetchDepartments();
    fetchRoles();
    fetchStatusTypes();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await lookupService.getEmployeeDepartmentTypes();
      if (response.status === 1 && response.result) {
        setDepartments(response.result);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const payload = {
        roleId: 0,
        isEmployee: true,
        isActive: true
      };
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'statusType') {
      const selectedStatus = statusTypes.find(status => status.statusValue === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        statusId: selectedStatus ? selectedStatus.statusId : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePermissionChange = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      employeeId: '',
      department: '',
      roleType: '',
      joiningDate: '',
      shift: '',
      password: ''
    });
    setPermissions({
      isViewOrder: false,
      isManageInventory: false,
      isPaymentApproval: false,
      isViewReports: false
    });
    setAutoGeneratePassword(true);
    setStep(1);
  };

  const handleSaveEmployee = async (saveAndAddAnother = false) => {
    setLoading(true);
    try {
      const selectedRole = roles.find(role => role.roleName === formData.roleType);
      const selectedDepartment = departments.find(dept => dept.statusValue === formData.department);
      
      const employeeData = {
        userId: 0,
        fullName: formData.fullName,
        email: formData.email,
        contactNo: formData.mobile,
        password: autoGeneratePassword ? "N/A" : formData.password,
        isAutoPassword: autoGeneratePassword,
        roleId: selectedRole ? selectedRole.roleId : 0,
        employeeCode: formData.employeeId,
        joiningDate: formData.joiningDate,
        shifts: formData.shift,
        departmentId: selectedDepartment ? selectedDepartment.statusId : 0,
        isViewOrder: permissions.isViewOrder,
        isPaymentApproval: permissions.isPaymentApproval,
        isManageInventory: permissions.isManageInventory,
        isViewReports: permissions.isViewReports,
        statusId: formData.statusId || statusTypes[0]?.statusId || 0
      };
      
      const response = await employeeService.onboardEmployee(employeeData);
      
      if (response.status === 1) {
        toast.success('Employee created successfully!');
        
        if (saveAndAddAnother) {
          resetForm();
        } else {
          resetForm();
        }
      } else {
        toast.error(response.message || 'Failed to create employee. Please try again.');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create employee. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };



  const nextStep = () => setStep(2);

  return (
    <>
      <style jsx>{`
        .create-employee-container {
          padding: 40px 20px;
          background-color: #f7f9fc;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .title {
          font-size: 28px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 32px;
          text-align: left;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .card {
          max-width: 900px;
          margin: 0 auto 32px auto;
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .step-title {
          font-size: 18px;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 28px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          font-size: 14px;
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
        }

        input {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          background-color: #fff;
          transition: border-color 0.2s;
        }

        select {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          background-color: #fff;
          transition: border-color 0.2s;
          cursor: pointer;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .permissions {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 16px;
          margin-bottom: 32px;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #54CF17;
        }

        .checkbox-group label {
          font-size: 15px;
          font-weight: normal;
          margin-bottom: 0;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }

        .btn {
          padding: 12px 28px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-next,
        .btn-save-add {
          background-color: #54CF17;
          color: white;
        }

        .btn-next:hover,
        .btn-save-add:hover {
          background-color: #54CF17;
        }

        .btn-cancel,
        .btn-save {
          background-color: #f7fafc;
          color: #4a5568;
          border: 1px solid #e2e8f0;
        }

        .btn-cancel:hover,
        .btn-save:hover {
          background-color: #edf2f7;
        }



        /* Toast Animations */
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        /* Toggle Switch */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
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
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
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

        .toggle-group {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
        }

        .toggle-label {
          font-size: 15px;
          font-weight: 500;
          color: #4a5568;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .permissions {
            grid-template-columns: 1fr;
          }

          .actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="create-employee-container">
        <h1 className="title">Create Employee</h1>

        {/* STEP 1: Employee Basic Details */}
        {step === 1 && (
          <div className="card">
            <h2 className="step-title">STEP 1: Employee Basic Details</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name" 
                />
              </div>

              <div className="form-group">
                <label>Email ID</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email ID" 
                />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input 
                  type="text" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number" 
                />
              </div>

              <div className="form-group">
                <label>Employee Code</label>
                <input 
                  type="text" 
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="Enter Employee Code" 
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={loading}
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
                >
                  <option value="">Select Status Type</option>
                  {statusTypes.map((status) => (
                    <option key={status.statusId} value={status.statusValue}>
                      {status.statusValue}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Auto-generate password toggle */}
            <div className="toggle-group">
              <span className="toggle-label">Auto-generate password</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={autoGeneratePassword}
                  onChange={() => setAutoGeneratePassword(!autoGeneratePassword)}
                />
                <span className="slider"></span>
              </label>
            </div>

            {/* Password (conditional) */}
            {!autoGeneratePassword && (
              <div className="form-grid">
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password" 
                  />
                </div>
              </div>
            )}

            <div className="permissions">
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

            <div className="actions">
              <button className="btn btn-next" onClick={nextStep}>
                Next
              </button>
              <button className="btn btn-cancel">Cancel</button>
            </div>
          </div>
        )}

        {/* STEP 2: Work Details */}
        {step === 2 && (
          <div className="card">
            <h2 className="step-title">STEP 2: Work Details</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Joining Date</label>
                <input 
                  type="date" 
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  placeholder="Enter Joining Date" 
                />
              </div>

              <div className="form-group">
                <label>Shift (Optional)</label>
                <input 
                  type="text" 
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  placeholder="Enter Shift details" 
                />
              </div>
            </div>

            <div className="actions">
              <button 
                className="btn btn-save-add" 
                onClick={() => handleSaveEmployee(true)}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save & Add Another'}
              </button>
              <button 
                className="btn btn-save" 
                onClick={() => handleSaveEmployee(false)}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Employee'}
              </button>
              <button className="btn btn-cancel" onClick={resetForm}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateEmployee;