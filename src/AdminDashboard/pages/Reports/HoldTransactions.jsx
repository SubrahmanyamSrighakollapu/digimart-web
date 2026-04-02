import { Filter, AlertTriangle, ClipboardList } from 'lucide-react';
import { T, PageHeader, Card, Btn, SearchBar, SelectInput, FilterBar, EmptyState } from '../../components/AdminUI';

const HoldTransactions = () => (
  <div>
    <PageHeader title="Hold Transactions" subtitle="View and manage all held transactions" />

    <Card style={{ marginBottom: '20px' }}>
      <FilterBar>
        <SearchBar placeholder="Search by name, ID..." style={{ flex: 1, minWidth: '240px' }} />
        <SelectInput><option>All Roles</option><option>Farmer</option><option>Agent</option><option>Admin</option></SelectInput>
        <SelectInput><option>All Status</option><option>Pending</option><option>Hold</option><option>Approved</option><option>Rejected</option></SelectInput>
        <input placeholder="Enter Amount" style={{ padding: '10px 14px', border: `1px solid ${T.border}`, borderRadius: T.radius, fontSize: T.fontMd, outline: 'none', minWidth: '140px' }}
          onFocus={e => e.target.style.borderColor = T.primary}
          onBlur={e => e.target.style.borderColor = T.border}
        />
        <SelectInput><option>All KYC</option><option>Verified</option><option>Pending</option><option>Not Submitted</option></SelectInput>
        <Btn color={T.primary}><Filter size={14} /> Filter</Btn>
      </FilterBar>
    </Card>

    <Card noPad>
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${T.borderLight}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ClipboardList size={18} color={T.primary} />
        <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Transaction List</h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px', backgroundColor: '#fef2f2', borderBottom: `1px solid #fecaca` }}>
        <AlertTriangle size={18} color={T.danger} />
        <span style={{ fontSize: T.fontMd, color: '#991b1b' }}>
          <strong>Error:</strong> Failed to fetch transaction list. Please try again or contact support.
        </span>
      </div>

      <EmptyState title="No transactions found" subtitle="Try adjusting your filters or search criteria" />
    </Card>
  </div>
);

export default HoldTransactions;
