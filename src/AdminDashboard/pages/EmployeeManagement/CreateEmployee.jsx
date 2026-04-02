import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserPlus, Briefcase, Shield, Calendar } from 'lucide-react';
import lookupService from '../../../services/lookupService';
import employeeService from '../../../services/employeeService';
import {
  T, PageHeader, Card, Btn, GhostBtn, SectionLabel,
  FormGrid, FormField, InputField, SelectField, Toggle, StepIndicator
} from '../../components/AdminUI';

const STEPS = ['Basic Details', 'Work Details'];

const PERMISSIONS = [
  { key: 'isViewOrder', label: 'View Orders', desc: 'Can view all orders' },
  { key: 'isManageInventory', label: 'Manage Inventory', desc: 'Can add/edit products' },
  { key: 'isPaymentApproval', label: 'Approve Payments', desc: 'Can approve payouts' },
  { key: 'isViewReports', label: 'View Reports', desc: 'Can access reports' },
];

const CreateEmployee = () => {
  const [step, setStep] = useState(1);
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', mobile: '', employeeId: '', department: '', roleType: '', statusType: '', statusId: '', joiningDate: '', shift: '', password: '' });
  const [permissions, setPermissions] = useState({ isViewOrder: false, isManageInventory: false, isPaymentApproval: false, isViewReports: false });

  useEffect(() => { fetchDepartments(); fetchRoles(); fetchStatusTypes(); }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await lookupService.getEmployeeDepartmentTypes();
      if (res.status === 1 && res.result) setDepartments(res.result);
    } catch {} finally { setLoading(false); }
  };

  const fetchRoles = async () => {
    try {
      const res = await lookupService.getUserRoleMaster({ roleId: 0, isEmployee: true, isActive: true });
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

  const resetForm = () => {
    setFormData({ fullName: '', email: '', mobile: '', employeeId: '', department: '', roleType: '', statusType: '', statusId: '', joiningDate: '', shift: '', password: '' });
    setPermissions({ isViewOrder: false, isManageInventory: false, isPaymentApproval: false, isViewReports: false });
    setAutoGeneratePassword(true); setStep(1);
  };

  const handleSave = async (addAnother = false) => {
    setLoading(true);
    try {
      const selectedRole = roles.find(r => r.roleName === formData.roleType);
      const selectedDept = departments.find(d => d.statusValue === formData.department);
      const res = await employeeService.onboardEmployee({
        userId: 0, fullName: formData.fullName, email: formData.email, contactNo: formData.mobile,
        password: autoGeneratePassword ? 'N/A' : formData.password, isAutoPassword: autoGeneratePassword,
        roleId: selectedRole?.roleId || 0, employeeCode: formData.employeeId,
        joiningDate: formData.joiningDate, shifts: formData.shift,
        departmentId: selectedDept?.statusId || 0,
        isViewOrder: permissions.isViewOrder, isPaymentApproval: permissions.isPaymentApproval,
        isManageInventory: permissions.isManageInventory, isViewReports: permissions.isViewReports,
        statusId: formData.statusId || statusTypes[0]?.statusId || 0
      });
      if (res.status === 1) { toast.success('Employee created!'); resetForm(); }
      else toast.error(res.message || 'Failed to create employee');
    } catch (e) { toast.error(e.response?.data?.message || e.message || 'Failed to create employee'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Create Employee" subtitle="Onboard a new employee to the platform" />
      <StepIndicator steps={STEPS} current={step} />

      {/* Step 1 */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Left: Personal + Role */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserPlus size={16} color="white" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Personal Details</p>
                <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Basic employee information</p>
              </div>
            </div>
            <FormGrid>
              <FormField label="Full Name">
                <InputField name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
              </FormField>
              <FormField label="Email ID">
                <InputField type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
              </FormField>
              <FormField label="Mobile Number">
                <InputField name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10-digit mobile" />
              </FormField>
              <FormField label="Employee Code">
                <InputField name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="e.g. EMP001" />
              </FormField>
              <FormField label="Department">
                <SelectField name="department" value={formData.department} onChange={handleChange} disabled={loading}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.statusId} value={d.statusValue}>{d.statusValue}</option>)}
                </SelectField>
              </FormField>
              <FormField label="Role Type">
                <SelectField name="roleType" value={formData.roleType} onChange={handleChange}>
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
          </Card>

          {/* Right: Password + Permissions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={16} color="white" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Account Settings</p>
                  <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Password configuration</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Toggle checked={autoGeneratePassword} onChange={() => setAutoGeneratePassword(p => !p)} label="Auto-generate password" />
                {!autoGeneratePassword && (
                  <FormField label="Password">
                    <InputField type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" />
                  </FormField>
                )}
              </div>
            </Card>

            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={16} color="white" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Permissions</p>
                  <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Access control settings</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {PERMISSIONS.map(p => (
                  <div key={p.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: permissions[p.key] ? '#f0fdf4' : T.bg, borderRadius: T.radius, border: `1px solid ${permissions[p.key] ? T.success : T.border}`, transition: 'all 0.2s' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 600, color: T.text }}>{p.label}</p>
                      <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>{p.desc}</p>
                    </div>
                    <Toggle checked={permissions[p.key]} onChange={() => setPermissions(prev => ({ ...prev, [p.key]: !prev[p.key] }))} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <GhostBtn onClick={resetForm}>Cancel</GhostBtn>
            <Btn onClick={() => setStep(2)}>Next →</Btn>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={16} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Work Details</p>
              <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Joining date and shift information</p>
            </div>
          </div>
          <FormGrid>
            <FormField label="Joining Date">
              <InputField type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
            </FormField>
            <FormField label="Shift (Optional)">
              <InputField name="shift" value={formData.shift} onChange={handleChange} placeholder="e.g. Morning, Night" />
            </FormField>
          </FormGrid>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <GhostBtn onClick={resetForm}>Cancel</GhostBtn>
            <GhostBtn onClick={() => setStep(1)}>← Back</GhostBtn>
            <Btn color={T.info} onClick={() => handleSave(true)} disabled={loading}>{loading ? 'Saving...' : 'Save & Add Another'}</Btn>
            <Btn onClick={() => handleSave(false)} disabled={loading}>{loading ? 'Saving...' : 'Save Employee'}</Btn>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreateEmployee;
