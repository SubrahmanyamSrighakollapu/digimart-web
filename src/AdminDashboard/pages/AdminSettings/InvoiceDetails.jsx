import { useState } from 'react';
import { Edit, Store, Building2, FileText, CheckCircle } from 'lucide-react';
import {
  T, PageHeader, Card, Btn, GhostBtn, SectionLabel,
  FormGrid, FormField, InputField, SelectField, Modal, ModalActions
} from '../../components/AdminUI';

const ACCOUNT_TYPES = ['Savings', 'Current', 'Overdraft'];

const EMPTY = {
  // Store
  storeName: '', gstNumber: '', mobile: '', email: '', address: '',
  // Bank
  beneficiaryName: '', bankName: '', accountType: '', bankBranch: '',
  city: '', accountNo: '', ifsc: '', pan: '',
};

const InfoRow = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
    <span style={{ fontSize: T.fontSm, color: T.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    <span style={{ fontSize: T.fontMd, color: T.text, fontWeight: 600 }}>{value || '—'}</span>
  </div>
);

const SectionCard = ({ icon: Icon, title, accent, children }) => (
  <div style={{
    backgroundColor: T.surface, borderRadius: T.radiusLg,
    border: `1px solid ${T.borderLight}`, boxShadow: T.shadow, overflow: 'hidden',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '16px 24px', borderBottom: `1px solid ${T.borderLight}`,
      background: `linear-gradient(135deg, ${accent}10, ${accent}05)`,
    }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} color={accent} />
      </div>
      <h3 style={{ margin: 0, fontSize: T.fontLg, fontWeight: 700, color: T.text }}>{title}</h3>
    </div>
    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px 28px' }}>
      {children}
    </div>
  </div>
);

const FormSection = ({ icon: Icon, title, accent, children }) => (
  <Card style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={16} color={accent} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>{title}</p>
      </div>
    </div>
    {children}
  </Card>
);

const InvoiceDetails = () => {
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState(EMPTY);
  const [form, setForm] = useState(EMPTY);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = () => {
    const required = ['storeName', 'gstNumber', 'mobile', 'email', 'address', 'beneficiaryName', 'bankName', 'accountType', 'bankBranch', 'city', 'accountNo', 'ifsc', 'pan'];
    const missing = required.find(k => !form[k]?.trim());
    if (missing) { alert('Please fill all required fields.'); return; }
    setLoading(true);
    setTimeout(() => {
      setData({ ...form });
      setSaved(true);
      setLoading(false);
    }, 600);
  };

  const handleEditOpen = () => { setForm({ ...data }); setEditOpen(true); };

  const handleEditSave = () => {
    setLoading(true);
    setTimeout(() => {
      setData({ ...form });
      setEditOpen(false);
      setLoading(false);
    }, 600);
  };

  // ── VIEW MODE ──────────────────────────────────────────────────────────────
  if (saved) return (
    <div>
      <PageHeader
        title="Invoice Details"
        subtitle="Business and bank details used on invoices"
        actions={
          <Btn onClick={handleEditOpen} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Edit size={14} /> Edit Details
          </Btn>
        }
      />

      {/* Saved banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 18px', borderRadius: T.radius, marginBottom: '24px',
        backgroundColor: T.greenLight, border: `1px solid ${T.greenMid}`,
      }}>
        <CheckCircle size={16} color={T.green} />
        <span style={{ fontSize: T.fontBase, color: T.greenHover, fontWeight: 600 }}>Invoice details saved successfully. These will appear on all generated invoices.</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <SectionCard icon={Store} title="Admin Business Details" accent={T.primary}>
          <InfoRow label="Business Name"  value={data.storeName} />
          <InfoRow label="GST Number"  value={data.gstNumber} />
          <InfoRow label="Mobile"      value={data.mobile} />
          <InfoRow label="Email"       value={data.email} />
          <InfoRow label="Address"     value={data.address} />
        </SectionCard>

        <SectionCard icon={Building2} title="Bank Details" accent={T.green}>
          <InfoRow label="Beneficiary Name" value={data.beneficiaryName} />
          <InfoRow label="Bank Name"        value={data.bankName} />
          <InfoRow label="Account Type"     value={data.accountType} />
          <InfoRow label="Bank Branch"      value={data.bankBranch} />
          <InfoRow label="City"             value={data.city} />
          <InfoRow label="Account No"       value={data.accountNo} />
          <InfoRow label="IFSC Code"        value={data.ifsc} />
          <InfoRow label="PAN"              value={data.pan} />
        </SectionCard>
      </div>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Invoice Details" width="680px">
        <SectionLabel style={{ marginBottom: '16px' }}>Business Details</SectionLabel>
        <FormGrid cols={2}>
          <FormField label="Business Name *">
            <InputField name="storeName" value={form.storeName} onChange={handleChange} placeholder="Enter business name" />
          </FormField>
          <FormField label="GST Number *">
            <InputField name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="e.g. 22AAAAA0000A1Z5" />
          </FormField>
          <FormField label="Mobile *">
            <InputField name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile" maxLength="10" />
          </FormField>
          <FormField label="Email *">
            <InputField type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email" />
          </FormField>
          <FormField label="Address *" fullWidth>
            <InputField name="address" value={form.address} onChange={handleChange} placeholder="Full address" />
          </FormField>
        </FormGrid>

        <div style={{ height: '1px', backgroundColor: T.borderLight, margin: '20px 0' }} />
        <SectionLabel style={{ marginBottom: '16px' }}>Bank Details</SectionLabel>
        <FormGrid cols={2}>
          <FormField label="Beneficiary Name *">
            <InputField name="beneficiaryName" value={form.beneficiaryName} onChange={handleChange} placeholder="Account holder name" />
          </FormField>
          <FormField label="Bank Name *">
            <InputField name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. State Bank of India" />
          </FormField>
          <FormField label="Account Type *">
            <SelectField name="accountType" value={form.accountType} onChange={handleChange}>
              <option value="">Select account type</option>
              {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </SelectField>
          </FormField>
          <FormField label="Bank Branch *">
            <InputField name="bankBranch" value={form.bankBranch} onChange={handleChange} placeholder="Branch name" />
          </FormField>
          <FormField label="City *">
            <InputField name="city" value={form.city} onChange={handleChange} placeholder="City" />
          </FormField>
          <FormField label="Account No *">
            <InputField name="accountNo" value={form.accountNo} onChange={handleChange} placeholder="Bank account number" />
          </FormField>
          <FormField label="IFSC Code *">
            <InputField name="ifsc" value={form.ifsc} onChange={handleChange} placeholder="e.g. SBIN0001234" />
          </FormField>
          <FormField label="PAN *">
            <InputField name="pan" value={form.pan} onChange={handleChange} placeholder="e.g. ABCDE1234F" />
          </FormField>
        </FormGrid>

        <ModalActions>
          <GhostBtn onClick={() => setEditOpen(false)}>Cancel</GhostBtn>
          <Btn onClick={handleEditSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Btn>
        </ModalActions>
      </Modal>
    </div>
  );

  // ── FORM MODE ──────────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader title="Invoice Details" subtitle="Set up your store and bank details for invoice generation" />

      {/* Hero prompt */}
      <div style={{
        background: `linear-gradient(135deg, ${T.primary} 0%, #f07030 50%, ${T.green} 100%)`,
        borderRadius: '16px', padding: '22px 28px', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '16px',
        boxShadow: `0 6px 24px rgba(236,91,19,0.2)`,
      }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FileText size={24} color="white" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: T.fontLg, fontWeight: 700, color: 'white' }}>First-time Setup</p>
          <p style={{ margin: '3px 0 0', fontSize: T.fontBase, color: 'rgba(255,255,255,0.8)' }}>Fill in your store and bank details below. These will be used on all invoices generated from this platform.</p>
        </div>
      </div>

      {/* Store Details */}
      <FormSection icon={Store} title="Admin Business Details" accent={T.primary}>
        <FormGrid cols={2}>
          <FormField label="Business Name *">
            <InputField name="storeName" value={form.storeName} onChange={handleChange} placeholder="Enter business name" />
          </FormField>
          <FormField label="GST Number *">
            <InputField name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="e.g. 22AAAAA0000A1Z5" />
          </FormField>
          <FormField label="Mobile *">
            <InputField name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit mobile number" maxLength="10" />
          </FormField>
          <FormField label="Email *">
            <InputField type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email address" />
          </FormField>
          <FormField label="Address *" fullWidth>
            <InputField name="address" value={form.address} onChange={handleChange} placeholder="Full business address" />
          </FormField>
        </FormGrid>
      </FormSection>

      {/* Bank Details */}
      <FormSection icon={Building2} title="Bank Details" accent={T.green}>
        <FormGrid cols={2}>
          <FormField label="Beneficiary Name *">
            <InputField name="beneficiaryName" value={form.beneficiaryName} onChange={handleChange} placeholder="Account holder name" />
          </FormField>
          <FormField label="Bank Name *">
            <InputField name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. State Bank of India" />
          </FormField>
          <FormField label="Account Type *">
            <SelectField name="accountType" value={form.accountType} onChange={handleChange}>
              <option value="">Select account type</option>
              {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </SelectField>
          </FormField>
          <FormField label="Bank Branch *">
            <InputField name="bankBranch" value={form.bankBranch} onChange={handleChange} placeholder="Branch name" />
          </FormField>
          <FormField label="City *">
            <InputField name="city" value={form.city} onChange={handleChange} placeholder="City" />
          </FormField>
          <FormField label="Bank Account No *">
            <InputField name="accountNo" value={form.accountNo} onChange={handleChange} placeholder="Bank account number" />
          </FormField>
          <FormField label="IFSC Code *">
            <InputField name="ifsc" value={form.ifsc} onChange={handleChange} placeholder="e.g. SBIN0001234" />
          </FormField>
          <FormField label="PAN *">
            <InputField name="pan" value={form.pan} onChange={handleChange} placeholder="e.g. ABCDE1234F" />
          </FormField>
        </FormGrid>
      </FormSection>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <GhostBtn onClick={() => setForm(EMPTY)}>Reset</GhostBtn>
        <Btn onClick={handleSave} disabled={loading} style={{ minWidth: '140px', justifyContent: 'center' }}>
          {loading ? 'Saving...' : 'Save Details'}
        </Btn>
      </div>
    </div>
  );
};

export default InvoiceDetails;
