import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Building, Receipt, Edit, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import paymentService from '../../../services/paymentService';
import { T, PageHeader, Card, Btn, GhostBtn, Badge, SectionLabel, DataTable, Td, Tr, EmptyState, Modal, ConfirmDialog, FormField, SelectField, ModalActions, IconBtn } from '../../components/AdminUI';

const getMethodIcon = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('card') || n.includes('credit') || n.includes('debit')) return { Icon: CreditCard, color: '#3b82f6', bg: '#eff6ff' };
  if (n.includes('wallet') || n.includes('digital')) return { Icon: Wallet, color: '#10b981', bg: '#f0fdf4' };
  if (n.includes('bank') || n.includes('transfer') || n.includes('upi')) return { Icon: Building, color: '#f59e0b', bg: '#fef3c7' };
  return { Icon: Receipt, color: '#8b5cf6', bg: '#faf5ff' };
};

const PaymentGatewaySetup = () => {
  const [gateways, setGateways] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [gatewayMappings, setGatewayMappings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);
  const [deletingMapping, setDeletingMapping] = useState(null);
  const [editForm, setEditForm] = useState({ gatewayId: '', methodId: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gRes, mRes, mapRes] = await Promise.all([paymentService.getGateways(), paymentService.getPaymentMethods(), paymentService.getGatewayMethodMappings()]);
      if (gRes.status === 1) setGateways(gRes.result || []);
      if (mRes.status === 1) setPaymentMethods(mRes.result || []);
      if (mapRes.status === 1) setGatewayMappings(mapRes.result || []);
    } catch { toast.error('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  const handleMethodToggle = (id) => setSelectedMethods(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSubmit = async () => {
    if (!selectedGateway || selectedMethods.length === 0) { toast.error('Select a gateway and at least one method'); return; }
    try {
      setLoading(true);
      await Promise.all(selectedMethods.map(methodId => paymentService.manageGatewayMethodMapping({ gatewayMethodId: 0, gatewayId: parseInt(selectedGateway), methodId: parseInt(methodId), isActive: true })));
      toast.success('Gateway methods configured!');
      setSelectedGateway(''); setSelectedMethods([]); fetchData();
    } catch { toast.error('Failed to save gateway methods'); }
    finally { setLoading(false); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await paymentService.manageGatewayMethodMapping({ gatewayMethodId: editingMapping.gatewayMethodId, gatewayId: parseInt(editForm.gatewayId), methodId: parseInt(editForm.methodId), isActive: true });
      if (res.status === 1) { toast.success('Updated!'); setShowEditModal(false); fetchData(); }
    } catch { toast.error('Failed to update'); }
    finally { setLoading(false); }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const res = await paymentService.deleteGatewayMethodMapping(deletingMapping.gatewayMethodId);
      if (res.status === 1) { toast.success('Deleted!'); fetchData(); }
    } catch { toast.error('Failed to delete'); }
    finally { setLoading(false); setShowDeleteModal(false); setDeletingMapping(null); }
  };

  const getName = (arr, idKey, nameKey, id) => arr.find(x => x[idKey] === id)?.[nameKey] || 'Unknown';

  return (
    <div>
      <PageHeader title="Payment Gateway Setup" subtitle="Configure payment methods for your gateways" />

      {/* Config Card */}
      <Card style={{ marginBottom: '24px' }}>
        <SectionLabel>Gateway Configuration</SectionLabel>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: T.fontBase, fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Select Gateway *</label>
          <SelectField value={selectedGateway} onChange={e => setSelectedGateway(e.target.value)} style={{ maxWidth: '400px' }}>
            <option value="">Choose a gateway</option>
            {gateways.map(g => <option key={g.gatewayId} value={g.gatewayId}>{g.gatewayName}</option>)}
          </SelectField>
        </div>

        <SectionLabel>Select Payment Methods</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {paymentMethods.map(m => {
            const { Icon, color, bg } = getMethodIcon(m.methodName);
            const selected = selectedMethods.includes(m.methodId);
            return (
              <div key={m.methodId} onClick={() => handleMethodToggle(m.methodId)} style={{
                padding: '18px 16px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer',
                border: `2px solid ${selected ? color : T.border}`,
                backgroundColor: selected ? bg : T.surface,
                boxShadow: selected ? `0 4px 16px ${color}33` : 'none',
                transition: 'all 0.2s', position: 'relative'
              }}>
                {selected && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={12} color="white" />
                  </div>
                )}
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: bg, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                  <Icon size={20} color={color} />
                </div>
                <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: T.fontMd, color: T.text }}>{m.methodName}</p>
                <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted, fontFamily: 'monospace' }}>{m.methodCode}</p>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <GhostBtn onClick={() => { setSelectedGateway(''); setSelectedMethods([]); }}>Reset</GhostBtn>
          <Btn onClick={handleSubmit} disabled={loading || !selectedGateway || selectedMethods.length === 0}>
            {loading ? 'Saving...' : 'Save Configuration'}
          </Btn>
        </div>
      </Card>

      {/* Mappings Table */}
      <Card noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Configured Gateway Methods</h3>
        </div>
        <DataTable headers={['Gateway', 'Payment Method', 'Status', 'Actions']} loading={loading} empty={gatewayMappings.length === 0}>
          {gatewayMappings.map(m => (
            <Tr key={m.gatewayMethodId}>
              <Td style={{ fontWeight: 600 }}>{getName(gateways, 'gatewayId', 'gatewayName', m.gatewayId)}</Td>
              <Td>{getName(paymentMethods, 'methodId', 'methodName', m.methodId)}</Td>
              <Td><Badge variant={m.isActive ? 'success' : 'neutral'}>{m.isActive ? 'Active' : 'Inactive'}</Badge></Td>
              <Td>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <IconBtn onClick={() => { setEditingMapping(m); setEditForm({ gatewayId: m.gatewayId.toString(), methodId: m.methodId.toString() }); setShowEditModal(true); }} title="Edit" hoverColor="#32a862"><Edit size={15} /></IconBtn>
                  <IconBtn onClick={() => { setDeletingMapping(m); setShowDeleteModal(true); }} title="Delete" hoverColor={T.danger}><Trash2 size={15} /></IconBtn>
                </div>
              </Td>
            </Tr>
          ))}
        </DataTable>
      </Card>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Gateway Method" width="460px">
        <form onSubmit={handleEditSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="Gateway *">
              <SelectField value={editForm.gatewayId} onChange={e => setEditForm(p => ({ ...p, gatewayId: e.target.value }))} required>
                <option value="">Select Gateway</option>
                {gateways.map(g => <option key={g.gatewayId} value={g.gatewayId}>{g.gatewayName}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Payment Method *">
              <SelectField value={editForm.methodId} onChange={e => setEditForm(p => ({ ...p, methodId: e.target.value }))} required>
                <option value="">Select Method</option>
                {paymentMethods.map(m => <option key={m.methodId} value={m.methodId}>{m.methodName}</option>)}
              </SelectField>
            </FormField>
          </div>
          <ModalActions>
            <GhostBtn type="button" onClick={() => setShowEditModal(false)}>Cancel</GhostBtn>
            <Btn type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</Btn>
          </ModalActions>
        </form>
      </Modal>

      <ConfirmDialog
        open={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeletingMapping(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Mapping"
        message={`Delete mapping between "${getName(gateways, 'gatewayId', 'gatewayName', deletingMapping?.gatewayId)}" and "${getName(paymentMethods, 'methodId', 'methodName', deletingMapping?.methodId)}"?`}
        confirmLabel="Delete"
        confirmColor={T.danger}
        loading={loading}
      />
    </div>
  );
};

export default PaymentGatewaySetup;
