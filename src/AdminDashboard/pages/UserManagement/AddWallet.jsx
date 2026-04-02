import { Search } from 'lucide-react';
import { T, PageHeader, Card, Btn, GhostBtn, Badge, DataTable, Td, Tr, SearchBar, SelectInput, FilterBar } from '../../components/AdminUI';

const AddWallet = () => (
  <div>
    <PageHeader title="Add Wallet" subtitle="Manage wallet transactions and balances" />

    <Card noPad style={{ marginBottom: '20px' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
        <FilterBar>
          <SearchBar placeholder="Search by user..." style={{ flex: 1, minWidth: '260px' }} />
          <SelectInput><option>Select All</option><option>Agent</option><option>Farmer</option></SelectInput>
          <SelectInput><option>Select Role</option><option>Agent</option><option>Farmer</option></SelectInput>
          <SelectInput><option>Select Transaction</option><option>Credit</option><option>Debit</option><option>Transfer</option></SelectInput>
        </FilterBar>
      </div>

      <DataTable headers={['Sr No', 'Trans Date', 'Trans ID', 'Name', 'Mobile', 'User ID', 'Type', 'Business', 'Wallet From', 'Wallet To', 'Amount', 'Status']}>
        <Tr>
          <Td>01</Td>
          <Td style={{ color: T.textMuted }}>04-07-25</Td>
          <Td><span style={{ fontFamily: 'monospace', fontSize: '12px', color: T.textMuted }}>TXN50001</span></Td>
          <Td style={{ fontWeight: 600 }}>Ravi</Td>
          <Td style={{ color: T.textMuted }}>09887654321</Td>
          <Td style={{ color: T.textMuted }}>102</Td>
          <Td><Badge variant="info">Transfer</Badge></Td>
          <Td>Ravi Traders</Td>
          <Td style={{ color: T.textMuted }}>Main Wallet</Td>
          <Td style={{ color: T.textMuted }}>Lean Wallet</Td>
          <Td style={{ fontWeight: 700 }}>₹10,000</Td>
          <Td><Badge variant="success">Success</Badge></Td>
        </Tr>
      </DataTable>
    </Card>

    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
      <Btn color={T.danger}>Deduct from Wallet</Btn>
      <GhostBtn>Cancel</GhostBtn>
      <Btn color={T.success}>Add Amount</Btn>
    </div>
  </div>
);

export default AddWallet;
