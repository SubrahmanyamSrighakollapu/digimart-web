import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserPlus, Send, ShieldCheck, User, Settings } from 'lucide-react';
import userService from '../../../services/userService';
import lookupService from '../../../services/lookupService';
import {
  T, PageHeader, Card, Btn, GhostBtn, SectionLabel,
  FormGrid, FormField, InputField, SelectField, Toggle, VerifyInput
} from '../../components/AdminUI';

const CreateUser = () => {
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(true);
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [formData, setFormData] = useState({ aadhaarNumber: '', panNumber: '', fullName: '', email: '', mobile: '', role: '', statusType: '', statusId: '', password: '' });
  const [verified, setVerified] = useState({ aadhaar: false, pan: false });

  useEffect(() => { fetchRoles(); fetchStatusTypes(); }, []);

  const fetchRoles = async () => {
    try {
      const res = await lookupService.getUserRoleMaster({ roleId: 0, isEmployee: false, isActive: true });
      if (res.status === 1 && res.result) setRoles(res.result);
    } catch {}
  };

  const fetchStatusTypes = async () => {
    try {
      const res = await lookupService.getDefaultStatusTypes();
      if (res.status === 1 && res.result) setStatusTypes(res.result);
    } catch {}
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'statusType') {
      const sel = statusTypes.find(s => s.statusValue === value);
      setFormData(p => ({ ...p, [name]: value, statusId: sel?.statusId || '' }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      const selectedRole = roles.find(r => r.roleName === formData.role);
      const res = await userService.createUser({
        userId: 0, fullName: formData.fullName, email: formData.email,
        contactNo: formData.mobile, password: autoGeneratePassword ? 'N/A' : formData.password,
        isAutoPassword: autoGeneratePassword, roleId: selectedRole?.roleId || 0,
        aadharNo: formData.aadhaarNumber, panNo: formData.panNumber,
        statusId: formData.statusId || statusTypes[0]?.statusId || 0,
        isAadharVerify: verified.aadhaar, panNoVerify: verified.pan, isActive: status
      });
      if (res.status === 1) {
        toast.success('User created successfully!');
        setFormData({ aadhaarNumber: '', panNumber: '', fullName: '', email: '', mobile: '', role: '', statusType: '', statusId: '', password: '' });
        setVerified({ aadhaar: false, pan: false });
        setAutoGeneratePassword(true); setStatus(true);
      } else toast.error(res.message || 'Failed to create user');
    } catch (e) { toast.error(e.response?.data?.message || e.message || 'Failed to create user'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader
        title="Create User"
        subtitle="Add a new user to the platform"
        actions={
          <>
            <GhostBtn>Cancel</GhostBtn>
            <Btn color={T.info} onClick={() => toast.success('Login credentials sent!')}>
              <Send size={14} /> Send Credentials
            </Btn>
            <Btn onClick={handleCreateUser} disabled={loading}>
              <UserPlus size={14} /> {loading ? 'Creating...' : 'Create User'}
            </Btn>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Identity Verification */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={16} color="white" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Identity Verification</p>
                <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Verify Aadhaar & PAN before creating</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <VerifyInput label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange}
                placeholder="Enter 12-digit Aadhaar number"
                onVerify={() => { setVerified(p => ({ ...p, aadhaar: true })); toast.success('Aadhaar verified!'); }}
                verified={verified.aadhaar} />
              <VerifyInput label="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange}
                placeholder="Enter PAN (e.g. ABCDE1234F)"
                onVerify={() => { setVerified(p => ({ ...p, pan: true })); toast.success('PAN verified!'); }}
                verified={verified.pan} />
            </div>
          </Card>

          {/* Account Settings */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={16} color="white" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Account Settings</p>
                <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Password and activation options</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Toggle checked={autoGeneratePassword} onChange={() => setAutoGeneratePassword(p => !p)} label="Auto-generate password" />
              {!autoGeneratePassword && (
                <FormField label="Password">
                  <InputField type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" />
                </FormField>
              )}
              <Toggle checked={status} onChange={() => setStatus(p => !p)} label="Account active on creation" />
            </div>
          </Card>
        </div>

        {/* Right column */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Personal Details</p>
              <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Basic user information and role</p>
            </div>
          </div>
          <FormGrid>
            <FormField label="Full Name">
              <InputField name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
            </FormField>
            <FormField label="Email ID">
              <InputField type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" />
            </FormField>
            <FormField label="Mobile Number">
              <InputField name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter 10-digit mobile" />
            </FormField>
            <FormField label="Role">
              <SelectField name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select Role</option>
                {roles.map(r => <option key={r.roleId} value={r.roleName}>{r.roleName}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Status Type" fullWidth>
              <SelectField name="statusType" value={formData.statusType} onChange={handleChange}>
                <option value="">Select Status</option>
                {statusTypes.map(s => <option key={s.statusId} value={s.statusValue}>{s.statusValue}</option>)}
              </SelectField>
            </FormField>
          </FormGrid>
          <div style={{ marginTop: '16px', padding: '14px 16px', background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', borderRadius: T.radius, border: `1px solid #e0e7ff` }}>
            <p style={{ margin: 0, fontSize: T.fontBase, color: '#4338ca', lineHeight: 1.7 }}>
              <strong>Role guide:</strong> <span style={{ color: T.textMuted }}>Admin — full platform access · Agent — account & transaction management · Employee — limited support access</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateUser;
