import { useState } from 'react';
import { T, PageHeader, Card, Btn, GhostBtn, Badge, SectionLabel, DataTable, Td, Tr, FormGrid, FormField, InputField, Toggle } from '../../components/AdminUI';

const HoldFunds = () => {
  const [holdDuration, setHoldDuration] = useState(true);

  const rows = [
    { id: 'AG-2078', name: 'Sarah Johnson', amount: '₹80,000', reason: 'Pending Verification', status: 'Active', date: 'Oct 24, 2025' },
    { id: 'AG-2078', name: 'Sarah Johnson', amount: '₹80,000', reason: 'Pending Verification', status: 'Released', date: 'Oct 24, 2025' },
    { id: 'AG-2078', name: 'Sarah Johnson', amount: '₹80,000', reason: 'Pending Verification', status: 'Active', date: 'Oct 24, 2025' },
    { id: 'AG-2078', name: 'Sarah Johnson', amount: '₹80,000', reason: 'Pending Verification', status: 'Released', date: 'Oct 24, 2025' },
    { id: 'AG-2078', name: 'Sarah Johnson', amount: '₹80,000', reason: 'Pending Verification', status: 'Active', date: 'Oct 24, 2025' },
  ];

  return (
    <div>
      <PageHeader title="Hold Funds" subtitle="Freeze user wallet balances with reason and duration" />

      <Card style={{ marginBottom: '20px' }}>
        <SectionLabel>Search & Filter Users</SectionLabel>
        <FormGrid cols={3}>
          <FormField label="User Name"><InputField placeholder="Enter user name" /></FormField>
          <FormField label="Available Balance">
            <div style={{ padding: '10px 14px', backgroundColor: T.successLight, borderRadius: T.radius, fontWeight: 700, fontSize: '16px', color: T.success }}>₹14,000</div>
          </FormField>
          <FormField label="Reason for Hold"><InputField placeholder="Enter reason" /></FormField>
          <FormField label="User ID"><InputField placeholder="Enter user ID" /></FormField>
          <FormField label="Hold Amount"><InputField placeholder="Enter amount" /></FormField>
          <FormField label="Hold Duration">
            <Toggle checked={holdDuration} onChange={() => setHoldDuration(p => !p)} label="Until Release" />
          </FormField>
        </FormGrid>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <GhostBtn>Cancel</GhostBtn>
          <Btn color={T.warning}>Hold Amount</Btn>
        </div>
      </Card>

      <Card noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>History & Active Holds</h3>
        </div>
        <DataTable headers={['User ID', 'Name', 'Amount', 'Reason', 'Status', 'Date', 'Action']}>
          {rows.map((row, i) => (
            <Tr key={i}>
              <Td><span style={{ fontFamily: 'monospace', fontSize: '12px', color: T.textMuted }}>{row.id}</span></Td>
              <Td style={{ fontWeight: 600 }}>{row.name}</Td>
              <Td style={{ fontWeight: 700 }}>{row.amount}</Td>
              <Td style={{ color: T.textMuted }}>{row.reason}</Td>
              <Td><Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>{row.status}</Badge></Td>
              <Td style={{ color: T.textMuted }}>{row.date}</Td>
              <Td>
                {row.status === 'Active'
                  ? <Btn size="sm" color={T.danger}>Release</Btn>
                  : <span style={{ fontSize: T.fontBase, color: T.success, fontWeight: 600 }}>Released</span>}
              </Td>
            </Tr>
          ))}
        </DataTable>
      </Card>
    </div>
  );
};

export default HoldFunds;
