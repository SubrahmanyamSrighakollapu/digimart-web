import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, CheckCircle, UserCheck, Building2, FileText } from 'lucide-react';
import lookupService from '../../../services/lookupService';
import agentService from '../../../services/agentService';
import {
  T, PageHeader, Card, Btn, GhostBtn, SectionLabel,
  FormGrid, FormField, InputField, SelectField, VerifyInput, StepIndicator
} from '../../components/AdminUI';

const STEPS = ['Basic Details', 'Business Info', 'Documents'];

const CreateAgent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    aadhaarNumber: '', panNumber: '', fullName: '', email: '', mobile: '',
    operatingArea: '', languagePreferred: '', businessType: '', businessName: '',
    address: '', serviceRadius: '', isAadhaarVerified: false, isPanVerified: false, businessTypeId: ''
  });

  useEffect(() => { fetchBusinessTypes(); fetchDocumentTypes(); }, []);

  const fetchBusinessTypes = async () => {
    try {
      setLoading(true);
      const res = await lookupService.getBusinessTypes();
      if (res.status === 1 && res.result) setBusinessTypes(res.result);
    } catch {} finally { setLoading(false); }
  };

  const fetchDocumentTypes = async () => {
    try {
      const res = await lookupService.getAgentDocumentTypes();
      if (res.status === 1 && res.result) setDocumentTypes(res.result);
    } catch {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'businessType') {
      const sel = businessTypes.find(t => t.statusValue === value);
      setFormData(p => ({ ...p, [name]: value, businessTypeId: sel?.statusId || '' }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const handleCreateAgent = async () => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append('fullName', formData.fullName);
      fd.append('email', formData.email);
      fd.append('contactNo', formData.mobile);
      fd.append('aadharNo', formData.aadhaarNumber);
      fd.append('panNo', formData.panNumber);
      fd.append('agentAddress', formData.operatingArea);
      fd.append('businessTypeId', formData.businessTypeId);
      fd.append('businessName', formData.businessName);
      fd.append('businessAddress', formData.address);
      fd.append('agentStatusId', '1');
      fd.append('operationsAreas', formData.operatingArea);
      fd.append('languagePreferences', formData.languagePreferred);
      fd.append('serviceRadius', formData.serviceRadius || '0');
      fd.append('commission', '0');
      fd.append('isAadharVerify', formData.isAadhaarVerified.toString());
      fd.append('isPanNoVerify', formData.isPanVerified.toString());
      fd.append('IsActive', 'true');
      Object.entries(uploadedFiles).forEach(([docType, file]) => {
        if (docType === 'ID Proof') fd.append('idProofDoc', file);
        else if (docType === 'Address Proof') fd.append('addressProofDoc', file);
        else if (docType === 'Bank Proof') fd.append('bankProofDoc', file);
        else if (docType === 'Profile Photo') fd.append('profilePhotoDoc', file);
      });
      const res = await agentService.onboardAgent(fd);
      if (res.status === 1) {
        toast.success('Agent created successfully!');
        setFormData({ aadhaarNumber: '', panNumber: '', fullName: '', email: '', mobile: '', operatingArea: '', languagePreferred: '', businessType: '', businessName: '', address: '', serviceRadius: '', isAadhaarVerified: false, isPanVerified: false, businessTypeId: '' });
        setUploadedFiles({}); setStep(1);
      } else toast.error(res.message || 'Failed to create agent');
    } catch (e) { toast.error(e.response?.data?.message || e.message || 'Error creating agent'); }
    finally { setLoading(false); }
  };

  const stepIcons = [UserCheck, Building2, FileText];
  const StepIcon = stepIcons[step - 1];

  return (
    <div>
      <PageHeader title="Create Agent" subtitle="Onboard a new agent to the platform" />
      <StepIndicator steps={STEPS} current={step} />

      {/* Step 1 — Basic Details */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Left: Identity */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#32a862,#2a9054)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={16} color="white" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Identity Verification</p>
                <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Verify Aadhaar & PAN</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <VerifyInput label="Aadhaar Number *" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange}
                placeholder="Enter 12-digit Aadhaar"
                onVerify={() => setFormData(p => ({ ...p, isAadhaarVerified: true }))}
                verified={formData.isAadhaarVerified} />
              <VerifyInput label="PAN Number *" name="panNumber" value={formData.panNumber} onChange={handleChange}
                placeholder="Enter PAN (e.g. ABCDE1234F)"
                onVerify={() => setFormData(p => ({ ...p, isPanVerified: true }))}
                verified={formData.isPanVerified} />
            </div>
          </Card>

          {/* Right: Personal Info */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={16} color="white" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Personal Information</p>
                <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Agent contact & area details</p>
              </div>
            </div>
            <FormGrid>
              <FormField label="Full Name *">
                <InputField name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" required />
              </FormField>
              <FormField label="Email ID *">
                <InputField type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" required />
              </FormField>
              <FormField label="Mobile Number *">
                <InputField type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10-digit mobile" maxLength="10" required />
              </FormField>
              <FormField label="Operating Area *">
                <InputField name="operatingArea" value={formData.operatingArea} onChange={handleChange} placeholder="Enter operating area" required />
              </FormField>
              <FormField label="Language Preferred" fullWidth>
                <InputField name="languagePreferred" value={formData.languagePreferred} onChange={handleChange} placeholder="e.g. Hindi, English (optional)" />
              </FormField>
            </FormGrid>
          </Card>

          {/* Full-width actions */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <GhostBtn>Cancel</GhostBtn>
            <Btn onClick={() => setStep(2)}>Next →</Btn>
          </div>
        </div>
      )}

      {/* Step 2 — Business Info */}
      {step === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          <Card style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={16} color="white" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Business Information</p>
                <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Agent's business and operational details</p>
              </div>
            </div>
            <FormGrid>
              <FormField label="Business Type *">
                <SelectField name="businessType" value={formData.businessType} onChange={handleChange} disabled={loading} required>
                  <option value="">Select Business Type</option>
                  {businessTypes.map(t => <option key={t.statusId} value={t.statusValue}>{t.statusValue}</option>)}
                </SelectField>
              </FormField>
              <FormField label="Business Name *">
                <InputField name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Enter business name" required />
              </FormField>
              <FormField label="Business Address *" fullWidth>
                <InputField name="address" value={formData.address} onChange={handleChange} placeholder="Enter full business address" required />
              </FormField>
              <FormField label="Service Radius (km)">
                <InputField type="number" name="serviceRadius" value={formData.serviceRadius} onChange={handleChange} placeholder="e.g. 50" min="0" />
              </FormField>
            </FormGrid>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <GhostBtn onClick={() => setStep(1)}>← Back</GhostBtn>
              <Btn onClick={() => setStep(3)}>Next →</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* Step 3 — Documents */}
      {step === 3 && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={16} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Upload Documents</p>
              <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Upload required KYC documents</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
            {documentTypes.map(doc => (
              <div key={doc.statusId} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px',
                border: `1px solid ${uploadedFiles[doc.statusValue] ? T.success : T.border}`,
                borderRadius: T.radius,
                backgroundColor: uploadedFiles[doc.statusValue] ? '#f0fdf4' : T.bg,
                transition: 'all 0.2s'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    {uploadedFiles[doc.statusValue]
                      ? <CheckCircle size={14} color={T.success} />
                      : <Upload size={14} color={T.textMuted} />}
                    <span style={{ fontWeight: 700, fontSize: T.fontMd, color: T.text }}>{doc.statusValue}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>{doc.stausDiscription}</p>
                  {uploadedFiles[doc.statusValue] && (
                    <p style={{ margin: '4px 0 0', fontSize: T.fontSm, color: T.success, fontWeight: 600 }}>✓ {uploadedFiles[doc.statusValue].name}</p>
                  )}
                </div>
                <div style={{ marginLeft: '12px' }}>
                  <input type="file" id={`file-${doc.statusId}`} accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files[0]; if (f) setUploadedFiles(p => ({ ...p, [doc.statusValue]: f })); }} />
                  <label htmlFor={`file-${doc.statusId}`} style={{
                    padding: '8px 16px',
                    backgroundColor: uploadedFiles[doc.statusValue] ? T.success : T.primary,
                    color: 'white', borderRadius: T.radiusSm, fontSize: T.fontBase,
                    fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', display: 'block'
                  }}>
                    {uploadedFiles[doc.statusValue] ? 'Change' : 'Choose File'}
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <GhostBtn onClick={() => setStep(2)}>← Back</GhostBtn>
            <Btn onClick={handleCreateAgent} disabled={loading}>{loading ? 'Creating...' : 'Create Agent'}</Btn>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreateAgent;
