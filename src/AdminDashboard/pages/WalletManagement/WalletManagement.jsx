import { useState } from 'react';
import { Upload, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { T, PageHeader, Card, Btn, GhostBtn, FormGrid, FormField, InputField, SelectField } from '../../components/AdminUI';

const TABS = [
  { key: 'credit', label: 'Credit Wallet', icon: ArrowDownLeft, color: T.success, gradient: 'linear-gradient(135deg,#10b981,#059669)' },
  { key: 'debit', label: 'Debit Wallet', icon: ArrowUpRight, color: T.danger, gradient: 'linear-gradient(135deg,#ef4444,#dc2626)' },
];

const WalletManagement = () => {
  const [activeTab, setActiveTab] = useState('credit');
  const tab = TABS.find(t => t.key === activeTab);

  return (
    <div>
      <PageHeader title="Wallet Management" subtitle="Manage credit and debit transactions for user wallets" />

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 24px', borderRadius: '10px', fontWeight: 700, fontSize: T.fontMd,
            cursor: 'pointer', border: `2px solid ${activeTab === t.key ? t.color : T.border}`,
            backgroundColor: activeTab === t.key ? t.color : 'white',
            color: activeTab === t.key ? 'white' : T.textMuted,
            boxShadow: activeTab === t.key ? `0 4px 16px ${t.color}44` : 'none',
            transition: 'all 0.2s'
          }}>
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Form */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: tab.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <tab.icon size={18} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>{tab.label} Transaction</p>
              <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Fill in the transaction details below</p>
            </div>
          </div>

          <FormGrid>
            <FormField label="User Name"><InputField placeholder="Enter user name" /></FormField>
            <FormField label="User ID"><InputField placeholder="Enter user ID" /></FormField>
            <FormField label="Wallet Type">
              <SelectField>
                <option value="">Select Type</option>
                <option>Main Wallet</option>
                <option>Lean Wallet</option>
              </SelectField>
            </FormField>
            <FormField label="Current Balance">
              <div style={{ padding: '10px 14px', backgroundColor: T.successLight, borderRadius: T.radius, fontWeight: 700, fontSize: '16px', color: T.success }}>₹14,000</div>
            </FormField>
            <FormField label={activeTab === 'credit' ? 'Credit Amount (₹)' : 'Debit Amount (₹)'}>
              <InputField type="number" placeholder="Enter amount" min="0" />
            </FormField>
            <FormField label="Payment Mode">
              <SelectField>
                <option value="">Select Payment Mode</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
                <option>NEFT/RTGS</option>
              </SelectField>
            </FormField>
            <FormField label="Transaction ID" fullWidth>
              <InputField placeholder="Enter transaction ID" />
            </FormField>
          </FormGrid>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <GhostBtn>Cancel</GhostBtn>
            <Btn color={tab.color}>{activeTab === 'credit' ? 'Credit Wallet Now' : 'Debit Wallet Now'}</Btn>
          </div>
        </Card>

        {/* Upload Proof */}
        <Card>
          <p style={{ margin: '0 0 16px', fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Upload Payment Proof</p>
          <div style={{
            border: `2px dashed ${T.border}`, borderRadius: T.radiusLg, padding: '48px 24px',
            textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
            backgroundColor: T.bg
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.primary; e.currentTarget.style.backgroundColor = T.primaryLight; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.backgroundColor = T.bg; }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: T.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Upload size={24} color={T.primary} />
            </div>
            <p style={{ margin: '0 0 6px', fontSize: T.fontLg, fontWeight: 600, color: T.text }}>Upload Payment Proof</p>
            <p style={{ margin: '0 0 16px', fontSize: T.fontBase, color: T.textMuted }}>Drag & drop or click to browse</p>
            <p style={{ margin: 0, fontSize: T.fontSm, color: T.textLight }}>PDF, JPG, or PNG (Max 5MB)</p>
          </div>

          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: T.bg, borderRadius: T.radius, border: `1px solid ${T.borderLight}` }}>
            <p style={{ margin: '0 0 8px', fontSize: T.fontBase, fontWeight: 600, color: T.text }}>Transaction Summary</p>
            {[
              { label: 'Type', value: tab.label },
              { label: 'Status', value: 'Pending' },
              { label: 'Date', value: new Date().toLocaleDateString('en-IN') },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${T.borderLight}` }}>
                <span style={{ fontSize: T.fontBase, color: T.textMuted }}>{row.label}</span>
                <span style={{ fontSize: T.fontBase, fontWeight: 600, color: T.text }}>{row.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WalletManagement;
