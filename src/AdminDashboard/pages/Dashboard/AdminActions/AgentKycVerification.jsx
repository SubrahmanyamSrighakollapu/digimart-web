// src/AdminDashboard/pages/Dashboard/AdminActions/AgentKycVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lookupService from '../../../../services/lookupService';

const AgentKycVerification = () => {
  const navigate = useNavigate();
  const [documentTypes, setDocumentTypes] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true);
      const response = await lookupService.getAgentDocumentTypes();
      if (response.status === 1 && response.result) {
        setDocumentTypes(response.result);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (documentType, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [documentType]: file
      }));
    }
  };

  const handleApprove = () => {
    navigate('/admin/agent-onboarded');
  };
  return (
    <>
      <style jsx>{`
        .kyc-container {
          padding: 40px 20px;
          background-color: #f7f9fc;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .title {
          font-size: 28px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 15px;
          color: #718096;
          margin-bottom: 32px;
        }

        .pending-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .pending-text h3 {
          font-size: 18px;
          font-weight: 600;
          color: #4a5568;
          margin: 0 0 8px 0;
        }

        .pending-text p {
          font-size: 14px;
          color: #718096;
          margin: 0;
          line-height: 1.5;
        }

        .pending-actions {
          display: flex;
          gap: 16px;
          flex-shrink: 0;
        }

        .btn {
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-reupload {
          background-color: white;
          color: #4a5568;
          border: 1px solid #e2e8f0;
        }

        .btn-reupload:hover {
          background-color: #f7fafc;
        }

        .btn-approve {
          background-color: #54CF17;
          color: white;
        }

        .btn-approve:hover {
          background-color: #54CF17;
        }

        .documents-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .documents-title {
          font-size: 20px;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 24px;
        }

        .document-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .document-item:last-child {
          border-bottom: none;
        }

        .document-info h4 {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        .document-info p {
          font-size: 14px;
          color: #718096;
          margin: 0;
          line-height: 1.5;
        }

        .upload-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 180px;
          height: 80px;
          border: 2px dashed #cbd5e0;
          border-radius: 12px;
          background-color: #f8fafc;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .upload-box:hover {
          border-color: #6366f1;
          background-color: #f0f4ff;
        }

        .upload-box.uploaded {
          border-color: #54CF17;
          background-color: #f0fdf4;
        }

        .file-input {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .upload-text {
          font-size: 14px;
          color: #64748b;
          margin-top: 8px;
          text-align: center;
        }

        .file-name {
          font-size: 12px;
          color: #54CF17;
          margin-top: 4px;
          text-align: center;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .upload-icon {
          font-size: 24px;
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          .pending-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .pending-actions {
            width: 100%;
          }

          .pending-actions .btn {
            flex: 1;
          }

          .document-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .upload-box {
            width: 100%;
          }
        }
      `}</style>

      <div className="kyc-container">
        <div className="content">
          <h1 className="title">Agent KYC Verification</h1>
          <p className="subtitle">Verify agent identity and enable payouts</p>

          {/* Pending Review Card */}
          <div className="pending-card">
            <div className="pending-text">
              <h3>Pending review</h3>
              <p>
                Agent has submitted all requested documents.<br />
                Please review to enable payout functionality.
              </p>
            </div>
            <div className="pending-actions">
              <button className="btn btn-reupload">Request Re-upload</button>
              <button className="btn btn-approve" onClick={handleApprove}>Approve</button>
            </div>
          </div>

          {/* Upload Documents Card */}
          <div className="documents-card">
            <h2 className="documents-title">Upload Documents</h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                Loading document types...
              </div>
            ) : (
              documentTypes.map((docType) => (
                <div key={docType.statusId} className="document-item">
                  <div className="document-info">
                    <h4>{docType.statusValue}</h4>
                    <p>{docType.stausDiscription}</p>
                  </div>
                  <div className={`upload-box ${uploadedFiles[docType.statusValue] ? 'uploaded' : ''}`}>
                    <input 
                      type="file" 
                      className="file-input" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(docType.statusValue, e)}
                    />
                    <div className="upload-icon">{uploadedFiles[docType.statusValue] ? '✓' : '↑'}</div>
                    <div className="upload-text">
                      {uploadedFiles[docType.statusValue] ? 'Uploaded' : 'Click to upload'}
                    </div>
                    {uploadedFiles[docType.statusValue] && (
                      <div className="file-name">{uploadedFiles[docType.statusValue].name}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentKycVerification;