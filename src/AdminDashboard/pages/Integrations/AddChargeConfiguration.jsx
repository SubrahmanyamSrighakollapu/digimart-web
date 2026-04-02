import { T, PageHeader, Card, Btn, GhostBtn, SectionLabel, FormGrid, FormField, InputField, TextareaField, EmptyState } from '../../components/AdminUI';
import { DollarSign, Info } from 'lucide-react';

const AddChargeConfiguration = () => (
  <div>
    <PageHeader title="Charge Configuration" subtitle="Configure payment charges for Payin transactions" />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={16} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Charge Details</p>
              <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Basic charge configuration</p>
            </div>
          </div>
          <FormGrid>
            <FormField label="Charge Type">
              <InputField placeholder="e.g. Platform Fee, GST" />
            </FormField>
            <FormField label="Charge Percentage">
              <InputField placeholder="e.g. 2.5" type="number" min="0" step="0.01" />
            </FormField>
          </FormGrid>
        </Card>

        <Card>
          <SectionLabel>Advanced Options</SectionLabel>
          <FormField label="Credit Days" style={{ marginBottom: '16px' }}>
            <InputField placeholder="e.g. 0 for instant, 1 for T+1" type="number" min="0" />
          </FormField>

          <div style={{ display: 'flex', gap: '10px', padding: '14px 16px', background: 'linear-gradient(135deg,#eff6ff,#eef2ff)', borderRadius: T.radius, border: `1px solid #bfdbfe`, marginBottom: '16px' }}>
            <Info size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{ margin: 0, fontSize: T.fontBase, color: '#1e40af', lineHeight: 1.6 }}>
              <strong>Pro Tip:</strong> Credit days determine when funds are settled. Use <code style={{ backgroundColor: '#dbeafe', padding: '1px 5px', borderRadius: '4px' }}>0</code> for instant settlement, or specify T+1, T+7 for delayed settlement.
            </p>
          </div>

          <FormField label="Description (Optional)">
            <TextareaField placeholder="Enter a description for this charge type..." />
          </FormField>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <GhostBtn>Cancel</GhostBtn>
            <Btn>Add Charge Type</Btn>
          </div>
        </Card>
      </div>

      {/* Existing Charges Table */}
      <Card noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Existing Charges</h3>
          <p style={{ margin: '3px 0 0', fontSize: T.fontBase, color: T.textMuted }}>All configured charge types</p>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                {['Charge Type', 'Percentage', 'Description', 'Credit Time', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: T.textMuted, borderBottom: `1px solid ${T.border}`, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5}><EmptyState title="No charges configured" subtitle="Add your first charge type using the form" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
);

export default AddChargeConfiguration;
