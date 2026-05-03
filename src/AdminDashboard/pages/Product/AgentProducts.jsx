import { useState, useEffect } from 'react';
import { Download, Search, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import productService from '../../../services/productService';
import lookupService from '../../../services/lookupService';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../../components/Pagination/Pagination';
import { T, PageHeader, Card, Btn, Badge, getStatusVariant, DataTable, Td, Tr, SearchBar, Modal, ModalActions, GhostBtn } from '../../components/AdminUI';

const FILTERS = [
  { key: 'all', label: 'All Products', color: T.primary },
  { key: 'pending', label: 'Pending', color: T.warning },
  { key: 'approved', label: 'Approved', color: T.success },
  { key: 'rejected', label: 'Rejected', color: T.danger },
];

const AgentProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusIds, setStatusIds] = useState({ pending: null, approved: null, rejected: null });

  useEffect(() => { fetchProductStatuses(); fetchProducts(); }, []);

  const fetchProductStatuses = async () => {
    try {
      const res = await lookupService.getProductStatusTypes();
      if (res?.status === 1 && res.result) {
        const ids = {};
        res.result.forEach(s => {
          if (s.statusValue === 'Pending') ids.pending = s.statusId;
          if (s.statusValue === 'Approved') ids.approved = s.statusId;
          if (s.statusValue === 'Rejected') ids.rejected = s.statusId;
        });
        setStatusIds(ids);
      }
    } catch {}
  };

  const fetchProducts = async (statusId = null) => {
    try {
      setLoading(true);
      const res = await productService.getProducts();
      if (res?.status === 1 && res.result) {
        setProducts(statusId ? res.result.filter(p => p.statusId === statusId) : res.result);
      }
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to fetch products'); }
    finally { setLoading(false); }
  };

  const handleStatusFilter = (filter) => {
    setStatusFilter(filter);
    fetchProducts(filter === 'all' ? null : statusIds[filter]);
  };

  const handleApproveReject = async (productId, statusId) => {
    try {
      setLoading(true);
      const res = await productService.approveRejectProduct(productId, statusId);
      if (res?.status === 1) {
        toast.success(res.message || 'Product status updated');
        fetchProducts(statusFilter === 'all' ? null : statusIds[statusFilter]);
      } else toast.error(res.message || 'Failed to update status');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to update status'); }
    finally { setLoading(false); }
  };

  const groupedByAgent = products.reduce((acc, p) => {
    const id = p.createdBy;
    if (!acc[id]) acc[id] = { agentId: id, agentName: p.userFullName || `Agent ${id}`, agentCode: p.agentCode || '', products: [], totalProducts: 0, totalPrice: 0 };
    acc[id].products.push(p);
    acc[id].totalProducts += 1;
    acc[id].totalPrice += parseFloat(p.finalPrice || 0);
    return acc;
  }, {});

  const agentRecords = Object.values(groupedByAgent);
  const filteredRecords = agentRecords.filter(a => {
    const q = searchTerm.toLowerCase();
    return !searchTerm || a.agentName.toLowerCase().includes(q) || a.agentCode.toLowerCase().includes(q);
  });
  const { currentPage, totalPages, currentRecords, handlePageChange } = usePagination(filteredRecords, 10);

  const handleExport = () => {
    try {
      const data = [];
      agentRecords.forEach(a => {
        a.products.forEach(p => data.push({ 'Agent Name': a.agentName, 'Agent Code': a.agentCode, 'Product': p.productName, 'Category': p.categoryName || 'N/A', 'Price': `₹${p.price}`, 'Final Price': `₹${p.finalPrice}`, 'Status': p.statusName || 'Pending' }));
      });
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Agent Products');
      XLSX.writeFile(wb, `Agent_Products_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Exported successfully');
    } catch { toast.error('Export failed'); }
  };

  return (
    <div>
      <PageHeader
        title="Agent Products"
        subtitle="Review and approve products submitted by agents"
        actions={<Btn color={T.success} onClick={handleExport}><Download size={14} /> Export Excel</Btn>}
      />

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => handleStatusFilter(f.key)} style={{
            padding: '8px 20px', borderRadius: '999px', fontWeight: 700, fontSize: T.fontBase,
            cursor: 'pointer', border: `2px solid ${statusFilter === f.key ? f.color : T.border}`,
            backgroundColor: statusFilter === f.key ? f.color : 'white',
            color: statusFilter === f.key ? 'white' : T.textMuted,
            transition: 'all 0.15s',
            boxShadow: statusFilter === f.key ? `0 4px 12px ${f.color}44` : 'none'
          }}>
            {f.label}
          </button>
        ))}
        <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search agent name..." style={{ marginLeft: 'auto', width: '260px' }} />
      </div>

      <Card noPad>
        <DataTable headers={['Agent', 'Total Products', 'Total Value', 'Action']} loading={loading} empty={filteredRecords.length === 0}>
          {currentRecords.map((agent, i) => (
            <Tr key={i}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                    {agent.agentName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: T.text }}>{agent.agentName}</div>
                    <div style={{ fontSize: T.fontSm, color: T.textMuted, fontFamily: 'monospace' }}>{agent.agentCode}</div>
                  </div>
                </div>
              </Td>
              <Td><Badge variant="info">{agent.totalProducts} products</Badge></Td>
              <Td style={{ fontWeight: 700 }}>₹{agent.totalPrice.toFixed(2)}</Td>
              <Td>
                <button onClick={() => setSelectedAgent(agent)} style={{ padding: '6px 16px', backgroundColor: T.primaryLight, color: T.primary, border: `1px solid ${T.primary}33`, borderRadius: T.radiusSm, fontWeight: 700, fontSize: T.fontBase, cursor: 'pointer' }}>
                  View Products
                </button>
              </Td>
            </Tr>
          ))}
        </DataTable>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${T.borderLight}` }}>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </Card>

      {/* Products Modal */}
      <Modal open={!!selectedAgent} onClose={() => setSelectedAgent(null)} title={`${selectedAgent?.agentName} (${selectedAgent?.agentCode}) — ${selectedAgent?.totalProducts} Products`} width="900px">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                {['Product Name', 'Category', 'Price', 'Final Price', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: T.textMuted, borderBottom: `1px solid ${T.border}`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedAgent?.products.map((p, i) => {
                const isApproved = p.statusId === statusIds.approved;
                const isRejected = p.statusId === statusIds.rejected;
                const isPending = p.statusId === statusIds.pending;
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.borderLight}` }}>
                    <td style={{ padding: '13px 16px', fontWeight: 600, color: T.text }}>{p.productName}</td>
                    <td style={{ padding: '13px 16px', color: T.textMuted }}>{p.categoryName || 'N/A'}</td>
                    <td style={{ padding: '13px 16px' }}>₹{p.price}</td>
                    <td style={{ padding: '13px 16px', fontWeight: 700 }}>₹{p.finalPrice}</td>
                    <td style={{ padding: '13px 16px' }}><Badge variant={getStatusVariant(p.statusName || 'pending')}>{p.statusName || 'Pending'}</Badge></td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleApproveReject(p.productId, statusIds.approved)} disabled={loading || isApproved}
                          style={{ padding: '5px 12px', backgroundColor: isApproved ? '#d1fae5' : T.success, color: isApproved ? T.success : 'white', border: 'none', borderRadius: T.radiusSm, fontWeight: 700, fontSize: '11px', cursor: isApproved ? 'default' : 'pointer', opacity: isApproved ? 0.7 : 1 }}>
                          Approve
                        </button>
                        <button onClick={() => handleApproveReject(p.productId, statusIds.pending)} disabled={loading || isPending}
                          style={{ padding: '5px 12px', backgroundColor: isPending ? '#fef3c7' : T.warning, color: isPending ? T.warning : 'white', border: 'none', borderRadius: T.radiusSm, fontWeight: 700, fontSize: '11px', cursor: isPending ? 'default' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
                          Pending
                        </button>
                        <button onClick={() => handleApproveReject(p.productId, statusIds.rejected)} disabled={loading || isRejected}
                          style={{ padding: '5px 12px', backgroundColor: isRejected ? '#fee2e2' : T.danger, color: isRejected ? T.danger : 'white', border: 'none', borderRadius: T.radiusSm, fontWeight: 700, fontSize: '11px', cursor: isRejected ? 'default' : 'pointer', opacity: isRejected ? 0.7 : 1 }}>
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ModalActions><GhostBtn onClick={() => setSelectedAgent(null)}>Close</GhostBtn></ModalActions>
      </Modal>
    </div>
  );
};

export default AgentProducts;
