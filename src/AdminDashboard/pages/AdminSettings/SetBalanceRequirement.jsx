import { T, PageHeader, Card, Btn, GhostBtn, FormGrid, FormField, InputField, SelectField, EmptyState } from '../../components/AdminUI';
import { Wallet, Info } from 'lucide-react';

const SetBalanceRequirement = () => (
  <div>
    <PageHeader title="Set Balance Requirement" subtitle="Configure minimum wallet balance requirements by role" />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
      {/* Form */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={16} color="white" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Configure Minimum Balance</p>
            <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Set per-role wallet requirements</p>
          </div>
        </div>
        <FormGrid>
          <FormField label="Select Role">
            <SelectField>
              <option value="">Select Role</option>
              <option>Agent</option>
              <option>Farmer</option>
              <option>Admin</option>
            </SelectField>
          </FormField>
          <FormField label="Minimum Wallet Balance (₹)">
            <InputField type="number" placeholder="e.g. 500" min="0" />
          </FormField>
        </FormGrid>
        <div style={{ display: 'flex', gap: '10px', padding: '12px 14px', background: '#fefce8', borderRadius: T.radius, border: '1px solid #fef08a', margin: '16px 0' }}>
          <Info size={15} color="#ca8a04" style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={{ margin: 0, fontSize: T.fontBase, color: '#854d0e', lineHeight: 1.6 }}>
            <strong>Pro Tip:</strong> Set appropriate minimum balances to ensure users can complete transactions without interruption.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <GhostBtn>Cancel</GhostBtn>
          <Btn>Save</Btn>
        </div>
      </Card>

      {/* Directory Table */}
      <Card noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Balance Requirements</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              {['Role Name', 'Minimum Balance', 'Action'].map(h => (
                <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: T.textMuted, borderBottom: `1px solid ${T.border}`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={3}><EmptyState title="No requirements set" subtitle="Configure minimum balance requirements using the form" /></td></tr>
          </tbody>
        </table>
      </Card>
    </div>
  </div>
);

export default SetBalanceRequirement;
