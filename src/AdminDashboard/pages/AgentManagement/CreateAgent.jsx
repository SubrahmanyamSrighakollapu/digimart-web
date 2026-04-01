// src/AdminDashboard/pages/Dashboard/AdminActions/CreateAgent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import lookupService from '../../../services/lookupService';
import agentService from '../../../services/agentService';

const CreateAgent = () => {
  const [step, setStep] = useState(1);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    panNumber: '',
    fullName: '',
    email: '',
    mobile: '',
    operatingArea: '',
    languagePreferred: '',
    businessType: '',
    businessName: '',
    address: '',
    serviceRadius: '',
    commission: '',
    isAadhaarVerified: false,
    isPanVerified: false,
    businessTypeId: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinessTypes();
    fetchDocumentTypes();
  }, []);

  const fetchBusinessTypes = async () => {
    try {
      setLoading(true);
      const response = await lookupService.getBusinessTypes();
      if (response.status === 1 && response.result) {
        setBusinessTypes(response.result);
      }
    } catch (error) {
      console.error('Error fetching business types:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      const response = await lookupService.getAgentDocumentTypes();
      if (response.status === 1 && response.result) {
        setDocumentTypes(response.result);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'businessType') {
      const selectedType = businessTypes.find(type => type.statusValue === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        businessTypeId: selectedType ? selectedType.statusId : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleVerifyAadhaar = () => {
    if (formData.aadhaarNumber) {
      setFormData(prev => ({ ...prev, isAadhaarVerified: true }));
    }
  };

  const handleVerifyPan = () => {
    if (formData.panNumber) {
      setFormData(prev => ({ ...prev, isPanVerified: true }));
    }
  };

  const handleCreateAgent = async () => {
    try {
      setLoading(true);
      
      const apiFormData = new FormData();
      
      apiFormData.append('fullName', formData.fullName || '');
      apiFormData.append('email', formData.email || '');
      apiFormData.append('contactNo', formData.mobile || '');
      apiFormData.append('aadharNo', formData.aadhaarNumber || '');
      apiFormData.append('panNo', formData.panNumber || '');
      apiFormData.append('agentAddress', formData.operatingArea || '');
      apiFormData.append('businessTypeId', formData.businessTypeId || '');
      apiFormData.append('businessName', formData.businessName || '');
      apiFormData.append('businessAddress', formData.address || '');
      apiFormData.append('agentStatusId', '1');
      apiFormData.append('operationsAreas', formData.operatingArea || '');
      apiFormData.append('languagePreferences', formData.languagePreferred || '');
      apiFormData.append('serviceRadius', formData.serviceRadius || '0');
      apiFormData.append('commission', '0');
      apiFormData.append('isAadharVerify', formData.isAadhaarVerified.toString());
      apiFormData.append('isPanNoVerify', formData.isPanVerified.toString());
      apiFormData.append('IsActive', 'true');
      
      // Handle document files - create placeholder if not uploaded
      const createPlaceholderFile = (name) => {
        return new File(['placeholder'], `${name}.txt`, { type: 'text/plain' });
      };
      
      console.log('Uploaded files:', uploadedFiles);
      
      // Handle document files - map API document types to required parameters
      Object.entries(uploadedFiles).forEach(([docType, file]) => {
        console.log('Processing document:', docType, file);
        if (docType === 'ID Proof') {
          apiFormData.append('idProofDoc', file);
          console.log('Added Adhaar ID as idProofDoc');
        } else if (docType === 'Address Proof') {
          apiFormData.append('addressProofDoc', file);
          console.log('Added Voter ID as addressProofDoc');
        } else if (docType === 'Bank Proof') {
          apiFormData.append('bankProofDoc', file);
          console.log('Added Bank ID as bankProofDoc');
        } else if (docType === 'Profile Photo') {
          apiFormData.append('profilePhotoDoc', file);
          console.log('Added Profile Photo as profilePhotoDoc');
        }
        // Ignore PAN ID and VISA ID documents - don't add them to payload
      });
      
      console.log("====== CREATE AGENT PAYLOAD (FormData) ======");

      for (let [key, value] of apiFormData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("====== END PAYLOAD ======");

      
      const response = await agentService.onboardAgent(apiFormData);
      
      console.log('API Response:', response);
      
      if (response.status === 1) {
        toast.success('Agent created successfully!');
        setFormData({
          aadhaarNumber: '', panNumber: '', fullName: '', email: '', mobile: '',
          operatingArea: '', languagePreferred: '', businessType: '', businessName: '',
          address: '', serviceRadius: '', commission: '', isAadhaarVerified: false,
          isPanVerified: false, businessTypeId: ''
        });
        setUploadedFiles({});
        setStep(1);
      } else {
        console.error('API Error Response:', response);
        toast.error(response.message || 'Failed to create agent');
      }
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      const errorMessage = error.response?.data?.message || error.message || 'Error creating agent. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (documentType, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [documentType]: file
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const goToKyc = () => navigate('/admin/agent-kyc-verification');

  return (
    <>
      <style jsx>{`
        .create-agent-container {
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
          margin-bottom: 24px;
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

        .form-group.full-width {
          grid-column: 1 / -1;
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

        .input-wrapper {
          display: flex;
          align-items: stretch;
        }

        .input-wrapper input {
          flex: 1;
          border-radius: 8px 0 0 8px;
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

        .btn-next {
          background-color: #54CF17;
          color: white;
        }

        .btn-next:hover {
          background-color: #54CF17;
        }

        .btn-cancel {
          background-color: #f7fafc;
          color: #4a5568;
          border: 1px solid #e2e8f0;
        }

        .btn-cancel:hover {
          background-color: #edf2f7;
        }

        /* Form Validation Styles */
        input:required:invalid:not(:placeholder-shown):not(:focus),
        select:required:invalid:not(:focus) {
          border-color: #ef4444;
        }

        input:valid:not(:placeholder-shown),
        select:valid {
          border-color: #10b981;
        }

        input:focus:invalid,
        select:focus:invalid {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .upload-section {
          margin-bottom: 24px;
        }

        .upload-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 16px;
          background: #f8fafc;
        }

        .upload-info {
          flex: 1;
        }

        .upload-label {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 4px;
        }

        .upload-description {
          font-size: 13px;
          color: #718096;
        }

        .file-input {
          display: none;
        }

        .upload-btn {
          padding: 8px 16px;
          background: #54CF17;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .upload-btn:hover {
          background: #48b814;
        }

        .file-selected {
          color: #059669;
          font-size: 13px;
          font-weight: 500;
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

      <div className="create-agent-container">
        <h1 className="title">Create Agent</h1>

        {/* STEP 1: Agent Basic Details */}
        {step === 1 && (
          <div className="card">
            <h2 className="step-title">STEP 1: Agent Basic Details</h2>

            <div className="form-grid">
              {/* Aadhaar Number + Verify */}
              <div className="form-group full-width">
                <label>Aadhaar Number *</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange}
                    placeholder="Enter 12-digit Aadhaar Number" 
                    required
                    pattern="[0-9]{12}"
                    minLength="12"
                    maxLength="12"
                  />
                  <button type="button" className="verify-btn" onClick={handleVerifyAadhaar}>
                    Verify →
                  </button>
                </div>
              </div>

              {/* PAN Number + Verify */}
              <div className="form-group full-width">
                <label>PAN Number *</label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    placeholder="Enter PAN (e.g., ABCDE1234F)" 
                    required
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    maxLength="10"
                    style={{ textTransform: 'uppercase' }}
                  />
                  <button type="button" className="verify-btn" onClick={handleVerifyPan}>
                    Verify →
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name" 
                  required
                  minLength="2"
                />
              </div>

              <div className="form-group">
                <label>Email ID *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email ID" 
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input 
                  type="tel" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile" 
                  required
                  pattern="[0-9]{10}"
                  minLength="10"
                  maxLength="10"
                />
              </div>

              <div className="form-group">
                <label>Operating Area *</label>
                <input 
                  type="text" 
                  name="operatingArea"
                  value={formData.operatingArea}
                  onChange={handleInputChange}
                  placeholder="Enter Operating Area" 
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Language Preferred</label>
                <input 
                  type="text" 
                  name="languagePreferred"
                  value={formData.languagePreferred}
                  onChange={handleInputChange}
                  placeholder="Enter Language (optional)" 
                />
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

        {/* STEP 2: Bank Details */}
        {step === 2 && (
          <div className="card">
            <h2 className="step-title">STEP 2: Bank Details</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Business Type *</label>
                <select 
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                >
                  <option value="">Select Business Type</option>
                  {businessTypes.map((type) => (
                    <option key={type.statusId} value={type.statusValue}>
                      {type.statusValue}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Business Name *</label>
                <input 
                  type="text" 
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter Business Name" 
                  required
                  minLength="2"
                />
              </div>

              <div className="form-group full-width">
                <label>Business Address *</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter Business Address" 
                  required
                />
              </div>

              <div className="form-group">
                <label>Service Radius (km)</label>
                <input 
                  type="number" 
                  name="serviceRadius"
                  value={formData.serviceRadius}
                  onChange={handleInputChange}
                  placeholder="Enter Service Radius (optional)" 
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-next" onClick={nextStep}>
                Next
              </button>
              <button className="btn btn-cancel" onClick={prevStep}>
                Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Upload Documents */}
        {step === 3 && (
          <div className="card">
            <h2 className="step-title">STEP 3: Upload Documents</h2>

            <div className="upload-section">
              {documentTypes.map((docType) => (
                <div key={docType.statusId} className="upload-item">
                  <div className="upload-info">
                    <div className="upload-label">{docType.statusValue}</div>
                    <div className="upload-description">{docType.stausDiscription}</div>
                    {uploadedFiles[docType.statusValue] && (
                      <div className="file-selected">
                        ✓ {uploadedFiles[docType.statusValue].name}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id={`file-${docType.statusId}`}
                      className="file-input"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleFileUpload(docType.statusValue, file);
                        }
                      }}
                    />
                    <label htmlFor={`file-${docType.statusId}`} className="upload-btn">
                      {uploadedFiles[docType.statusValue] ? 'Change File' : 'Choose File'}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="actions">
              <button className="btn btn-next" onClick={handleCreateAgent} disabled={loading}>
                {loading ? 'Creating...' : 'Create Agent'}
              </button>
              <button className="btn btn-cancel" onClick={prevStep}>
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateAgent;