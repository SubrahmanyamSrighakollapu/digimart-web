import { T, PageHeader, Card, Btn, GhostBtn, SectionLabel, FormGrid, FormField, InputField, EmptyState } from '../../components/AdminUI';
import { DollarSign, Info } from 'lucide-react';

const PayoutChargesManager = () => (
  <div>
    <PageHeader title="Payout Charges Manager" subtitle="Configure payout transaction charges and fee structures" />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
      {/* Form */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={16} color="white" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Add Charge Range</p>
            <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Define amount-based charge tiers</p>
          </div>
        </div>
        <FormGrid>
          <FormField label="From Amount (₹)"><InputField type="number" placeholder="e.g. 0" min="0" /></FormField>
          <FormField label="To Amount (₹)"><InputField type="number" placeholder="e.g. 1000" min="0" /></FormField>
          <FormField label="Transaction Charge (₹)" fullWidth><InputField type="number" placeholder="e.g. 5" min="0" step="0.01" /></FormField>
        </FormGrid>
        <div style={{ display: 'flex', gap: '10px', padding: '12px 14px', background: '#fff7ed', borderRadius: T.radius, border: '1px solid #fed7aa', margin: '16px 0' }}>
          <Info size={15} color="#c2410c" style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={{ margin: 0, fontSize: T.fontBase, color: '#c2410c', lineHeight: 1.6 }}>
            <strong>Guide:</strong> Define payout charges based on transaction amount ranges. e.g. ₹0–1000 = ₹5 charge, ₹1001–5000 = ₹10 charge.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <GhostBtn>Cancel</GhostBtn>
          <Btn>Save Changes</Btn>
        </div>
      </Card>

      {/* Table */}
      <Card noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Charge Structure</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              {['From', 'To', 'Charge', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: T.textMuted, borderBottom: `1px solid ${T.border}`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={4}><EmptyState title="No charges defined" subtitle="Add your first charge range using the form" /></td></tr>
          </tbody>
        </table>
      </Card>
    </div>
  </div>
);

export default PayoutChargesManager;
