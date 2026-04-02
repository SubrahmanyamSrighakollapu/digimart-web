import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import paymentService from '../../../services/paymentService';
import { T, PageHeader, Card, Btn, GhostBtn, Badge, DataTable, Td, Tr, EmptyState, Modal, ConfirmDialog, FormField, InputField, ModalActions, IconBtn } from '../../components/AdminUI';

const AddPaymentGateway = () => {
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [gatewayName, setGatewayName] = useState('');

  useEffect(() => { fetchGateways(); }, []);

  const fetchGateways = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getGateways();
      if (res.status === 1) setGateways(res.result || []);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to fetch gateways'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await paymentService.manageGateway({ gatewayId: editingGateway?.gatewayId || 0, gatewayName, isActive: true });
      if (res.status === 1) {
        toast.success(editingGateway ? 'Gateway updated!' : 'Gateway added!');
        setGatewayName(''); setShowModal(false); setEditingGateway(null); fetchGateways();
      } else toast.error('Failed to save gateway');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to save gateway'); }
    finally { setLoading(false); }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const res = await paymentService.deleteGateway(deleteItem.gatewayId);
      if (res.status === 1) { toast.success('Gateway deleted!'); fetchGateways(); }
      else toast.error('Failed to delete gateway');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to delete gateway'); }
    finally { setLoading(false); setShowDeleteConfirm(false); setDeleteItem(null); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      <PageHeader
        title="Payment Gateways"
        subtitle="Configure and manage your payment gateways"
        actions={
          <Btn onClick={() => { setEditingGateway(null); setGatewayName(''); setShowModal(true); }}>
            <Plus size={14} /> Add Gateway
          </Btn>
        }
      />

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Gateways', value: gateways.length,                          bg: '#eff6ff', accent: '#3b82f6', iconBg: '#dbeafe' },
          { label: 'Active',         value: gateways.filter(g => g.isActive === 1).length, bg: '#e6f7ed', accent: '#32a862', iconBg: '#bbf7d0' },
          { label: 'Inactive',       value: gateways.filter(g => g.isActive !== 1).length, bg: '#fef9ec', accent: '#d97706', iconBg: '#fef3c7' },
        ].map((s, i) => (
          <div key={i} style={{
            backgroundColor: s.bg, borderRadius: '14px', padding: '20px',
            border: `1px solid ${s.accent}22`, boxShadow: `0 2px 12px ${s.accent}14`,
            transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <CreditCard size={16} color={s.accent} />
            </div>
            <p style={{ margin: '0 0 4px', fontSize: T.fontSm, color: '#6b7280', fontWeight: 500 }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#1c1917' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <Card noPad>
        <DataTable headers={['Gateway Name', 'Status', 'Created At', 'Actions']} loading={loading} empty={gateways.length === 0}>
          {gateways.map(gw => (
            <Tr key={gw.gatewayId}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e6f7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={16} color="#32a862" />
                  </div>
                  <span style={{ fontWeight: 700, color: T.text }}>{gw.gatewayName}</span>
                </div>
              </Td>
              <Td><Badge variant={gw.isActive === 1 ? 'success' : 'neutral'}>{gw.isActive === 1 ? 'Active' : 'Inactive'}</Badge></Td>
              <Td style={{ color: T.textMuted }}>{formatDate(gw.createdAt)}</Td>
              <Td>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <IconBtn onClick={() => { setEditingGateway(gw); setGatewayName(gw.gatewayName); setShowModal(true); }} title="Edit" hoverColor="#32a862"><Edit size={15} /></IconBtn>
                  <IconBtn onClick={() => { setDeleteItem(gw); setShowDeleteConfirm(true); }} title="Delete" hoverColor={T.danger}><Trash2 size={15} /></IconBtn>
                </div>
              </Td>
            </Tr>
          ))}
        </DataTable>
      </Card>

      {/* Add/Edit Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setEditingGateway(null); setGatewayName(''); }} title={editingGateway ? 'Edit Payment Gateway' : 'Add Payment Gateway'} width="460px">
        <form onSubmit={handleSubmit}>
          <FormField label="Gateway Name *">
            <InputField value={gatewayName} onChange={e => setGatewayName(e.target.value)} placeholder="e.g. Razorpay, PayU, Stripe" required minLength={2} />
          </FormField>
          <ModalActions>
            <GhostBtn type="button" onClick={() => { setShowModal(false); setEditingGateway(null); setGatewayName(''); }}>Cancel</GhostBtn>
            <Btn type="submit" disabled={loading || !gatewayName}>{loading ? 'Saving...' : editingGateway ? 'Update' : 'Add Gateway'}</Btn>
          </ModalActions>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setDeleteItem(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Gateway"
        message={`Are you sure you want to delete "${deleteItem?.gatewayName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor={T.danger}
        loading={loading}
      />
    </div>
  );
};

export default AddPaymentGateway;
