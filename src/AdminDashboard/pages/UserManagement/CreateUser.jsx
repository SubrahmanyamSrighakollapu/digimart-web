// src/AdminDashboard/pages/Dashboard/AdminActions/CreateUser.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import userService from '../../../services/userService';
import lookupService from '../../../services/lookupService';

const CreateUser = () => {
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(true);
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    panNumber: '',
    fullName: '',
    email: '',
    mobile: '',
    role: '',
    statusType: '',
    password: ''
  });

  const [verificationStatus, setVerificationStatus] = useState({
    isAadharVerify: false,
    panNoVerify: false
  });

  useEffect(() => {
    fetchRoles();
    fetchStatusTypes();
  }, []);

  const fetchRoles = async () => {
    try {
      const payload = {
        roleId: 0,
        isEmployee: false,
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

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const selectedRole = roles.find(role => role.roleName === formData.role);
      
      const userData = {
        userId: 0,
        fullName: formData.fullName,
        email: formData.email,
        contactNo: formData.mobile,
        password: autoGeneratePassword ? "N/A" : formData.password,
        isAutoPassword: autoGeneratePassword,
        roleId: selectedRole ? selectedRole.roleId : 0,
        aadharNo: formData.aadhaarNumber,
        panNo: formData.panNumber,
        statusId: formData.statusId || statusTypes[0]?.statusId || 0,
        isAadharVerify: verificationStatus.isAadharVerify,
        panNoVerify: verificationStatus.panNoVerify,
        isActive: status
      };
      
      const response = await userService.createUser(userData);
      
      if (response.status === 1) {
        toast.success('User created successfully!');
        
        // Reset form
        setFormData({
          aadhaarNumber: '',
          panNumber: '',
          fullName: '',
          email: '',
          mobile: '',
          role: '',
          password: ''
        });
        setVerificationStatus({
          isAadharVerify: false,
          panNoVerify: false
        });
        setAutoGeneratePassword(true);
        setStatus(true);
      } else {
        toast.error(response.message || 'Failed to create user. Please try again.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create user. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAadhaar = () => {
    console.log('Verifying Aadhaar:', formData.aadhaarNumber);
    // Simulate verification success
    setVerificationStatus(prev => ({ ...prev, isAadharVerify: true }));
    toast.success('Aadhaar verified successfully!');
  };

  const handleVerifyPan = () => {
    console.log('Verifying PAN:', formData.panNumber);
    // Simulate verification success
    setVerificationStatus(prev => ({ ...prev, panNoVerify: true }));
    toast.success('PAN verified successfully!');
  };

  const handleSendCredentials = async () => {
    console.log('Sending login credentials...');
    toast.success('Login credentials sent!');
  };

  return (
    <>
      <style jsx>{`
        .create-user-container {
          padding: 40px 20px;
          background-color: #f7f9fc;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .card {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 32px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px 32px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
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

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: stretch;          /* ← Changed: stretch instead of center */
          width: 100%;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"],
        select {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px 0 0 8px;
          font-size: 15px;
          background: white;
          border-right: none;
        }

        .verify-btn {
          padding: 0 24px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 0 8px 8px 0;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          font-size: 14px;
        }

        .verify-btn:hover {
          background: #059669;
        }

        .role-description {
          grid-column: 1 / -1;
          font-size: 13px;
          color: #718096;
          line-height: 1.6;
          margin-top: -8px;
          margin-bottom: 20px;
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

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 40px;
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

        .btn-primary {
          background-color: #10b981;
          color: white;
        }

        .btn-primary:hover {
          background-color: #059669;
        }

        .btn-secondary {
          background-color: #3b82f6;
          color: white;
        }

        .btn-secondary:hover {
          background-color: #2563eb;
        }

        .btn-cancel {
          background-color: #e2e8f0;
          color: #4a5568;
        }

        .btn-cancel:hover {
          background-color: #cbd5e0;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .input-wrapper {
            flex-direction: column;
          }

          .verify-btn {
            border-radius: 8px;
            margin-top: 8px;
            width: 100%;
          }

          .actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="create-user-container">
        <div className="card">
          <h1 className="title">Create User</h1>

          <div className="form-grid">
            {/* Aadhaar Number + Verify */}
            <div className="form-group full-width">
              <label>Aadhaar Number</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  placeholder="Enter Aadhaar Number" 
                />
                <button className="verify-btn" onClick={handleVerifyAadhaar}>
                  Verify →
                </button>
              </div>
            </div>

            {/* PAN Number + Verify */}
            <div className="form-group full-width">
              <label>PAN Number</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleInputChange}
                  placeholder="Enter Pan Number" 
                />
                <button className="verify-btn" onClick={handleVerifyPan}>
                  Verify →
                </button>
              </div>
            </div>

            {/* Full Name + Email ID */}
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

            {/* Mobile + Role */}
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
              <label>Role</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleInputChange}
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

            <p className="role-description">
              Admin: Manage all aspects of the platform.<br />
              Agent: Manage specific accounts and transactions.<br />
              Employee: Support role with limited access.
            </p>
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
            <div className="form-group full-width">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password" 
              />
            </div>
          )}

          {/* Status toggle */}
          <div className="toggle-group">
            <span className="toggle-label">Status</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={status}
                onChange={() => setStatus(!status)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="actions">
            <button 
              className="btn btn-primary" 
              onClick={handleCreateUser}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>

            <button 
              className="btn btn-secondary"
              onClick={handleSendCredentials}
            >
              Send Login Credentials
            </button>

            <button className="btn btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUser;