import { useState, useEffect } from 'react';
import { Edit, Trash2, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import planService from '../../../services/planService';
import paymentService from '../../../services/paymentService';
import lookupService from '../../../services/lookupService';
import {
  T, PageHeader, Card, Btn, GhostBtn, Badge, SectionLabel,
  DataTable, Td, Tr, SearchBar, SelectInput, FilterBar,
  Modal, ConfirmDialog, FormField, SelectField, ModalActions, IconBtn
} from '../../components/AdminUI';

const PlanCommissionManager = () => {
  const [plans, setPlans] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [roles, setRoles] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ planId: '', gatewayId: '', roleId: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [deletingConfig, setDeletingConfig] = useState(null);
  const [editForm, setEditForm] = useState({ planId: '', gatewayId: '', roleId: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterGateway, setFilterGateway] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pR, gR, rR, cR] = await Promise.all([planService.getPlans(), paymentService.getGateways(), lookupService.getUserRoles(), planService.getAllPlanGatewayRoleConfig()]);
      if (pR.status === 1) setPlans(pR.result || []);
      if (gR.status === 1) setGateways(gR.result || []);
      if (rR.status === 1) setRoles(rR.result || []);
      if (cR.status === 1) setConfigurations(cR.result || []);
    } catch { toast.error('Failed to fetch data'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!formData.planId || !formData.gatewayId || !formData.roleId) { toast.error('Select plan, gateway, and role'); return; }
    try {
      setLoading(true);
      const res = await planService.managePlanGatewayRoleConfig({ planConfigId: 0, planId: parseInt(formData.planId), gatewayId: parseInt(formData.gatewayId), roleId: parseInt(formData.roleId), isActive: true });
      if (res.status === 1) { toast.success('Configuration saved!'); setFormData({ planId: '', gatewayId: '', roleId: '' }); fetchData(); }
      else toast.error('Failed to save configuration');
    } catch { toast.error('Failed to save configuration'); }
    finally { setLoading(false); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await planService.managePlanGatewayRoleConfig({ planConfigId: editingConfig.planConfigId, planId: parseInt(editForm.planId), gatewayId: parseInt(editForm.gatewayId), roleId: parseInt(editForm.roleId), isActive: true });
      if (res.status === 1) { toast.success('Updated!'); setShowEditModal(false); setEditingConfig(null); fetchData(); }
    } catch { toast.error('Failed to update'); }
    finally { setLoading(false); }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const res = await planService.deletePlanGatewayRoleConfigById(deletingConfig.planConfigId);
      if (res.status === 1) { toast.success('Deleted!'); fetchData(); }
    } catch { toast.error('Failed to delete'); }
    finally { setLoading(false); setShowDeleteModal(false); setDeletingConfig(null); }
  };

  const getName = (arr, idKey, nameKey, id) => arr.find(x => x[idKey] === id)?.[nameKey] || 'Unknown';

  const filtered = configurations.filter(c => {
    const q = searchTerm.toLowerCase();
    return (!searchTerm || getName(plans, 'planId', 'planName', c.planId).toLowerCase().includes(q) || getName(gateways, 'gatewayId', 'gatewayName', c.gatewayId).toLowerCase().includes(q) || getName(roles, 'roleId', 'roleName', c.roleId).toLowerCase().includes(q))
      && (!filterPlan || c.planId.toString() === filterPlan)
      && (!filterRole || c.roleId.toString() === filterRole)
      && (!filterGateway || c.gatewayId.toString() === filterGateway);
  });

  return (
    <div>
      <PageHeader title="Plan Commission Manager" subtitle="Configure commission structures for plans, gateways, and roles" />

      {/* Config Form */}
      <Card style={{ marginBottom: '20px' }}>
        <SectionLabel>Select Plan, Gateway & Role</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end', marginBottom: '20px' }}>
          <FormField label="Select Plan">
            <SelectField value={formData.planId} onChange={e => setFormData(p => ({ ...p, planId: e.target.value }))}>
              <option value="">Choose Plan</option>
              {plans.map(p => <option key={p.planId} value={p.planId}>{p.planName}</option>)}
            </SelectField>
          </FormField>
          <FormField label="Select Gateway">
            <SelectField value={formData.gatewayId} onChange={e => setFormData(p => ({ ...p, gatewayId: e.target.value }))}>
              <option value="">Choose Gateway</option>
              {gateways.map(g => <option key={g.gatewayId} value={g.gatewayId}>{g.gatewayName}</option>)}
            </SelectField>
          </FormField>
          <FormField label="Select Role">
            <SelectField value={formData.roleId} onChange={e => setFormData(p => ({ ...p, roleId: e.target.value }))}>
              <option value="">Choose Role</option>
              {roles.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
            </SelectField>
          </FormField>
          <Btn onClick={handleSubmit} disabled={loading || !formData.planId || !formData.gatewayId || !formData.roleId} style={{ alignSelf: 'flex-end' }}>
            {loading ? 'Saving...' : 'Save Config'}
          </Btn>
        </div>
        <div style={{ display: 'flex', gap: '10px', padding: '12px 16px', background: '#fefce8', borderRadius: T.radius, border: '1px solid #fef08a' }}>
          <Info size={15} color="#ca8a04" style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={{ margin: 0, fontSize: T.fontBase, color: '#854d0e', lineHeight: 1.6 }}>
            <strong>How it works:</strong> Configure which payment gateways are available for specific plans and roles. This determines payment options available to users based on their plan and role.
          </p>
        </div>
      </Card>

      {/* Directory */}
      <Card noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
          <FilterBar>
            <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search plan, role, gateway..." style={{ flex: 1, minWidth: '220px' }} />
            <SelectInput value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
              <option value="">All Plans</option>
              {plans.map(p => <option key={p.planId} value={p.planId}>{p.planName}</option>)}
            </SelectInput>
            <SelectInput value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="">All Roles</option>
              {roles.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
            </SelectInput>
            <SelectInput value={filterGateway} onChange={e => setFilterGateway(e.target.value)}>
              <option value="">All Gateways</option>
              {gateways.map(g => <option key={g.gatewayId} value={g.gatewayId}>{g.gatewayName}</option>)}
            </SelectInput>
          </FilterBar>
        </div>

        <DataTable headers={['Plan Name', 'Role Name', 'Gateway Name', 'Status', 'Actions']} loading={loading} empty={filtered.length === 0}>
          {filtered.map(c => (
            <Tr key={c.planConfigId}>
              <Td style={{ fontWeight: 600 }}>{getName(plans, 'planId', 'planName', c.planId)}</Td>
              <Td><Badge variant="info">{getName(roles, 'roleId', 'roleName', c.roleId)}</Badge></Td>
              <Td>{getName(gateways, 'gatewayId', 'gatewayName', c.gatewayId)}</Td>
              <Td><Badge variant={c.isActive ? 'success' : 'neutral'}>{c.isActive ? 'Active' : 'Inactive'}</Badge></Td>
              <Td>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <IconBtn onClick={() => { setEditingConfig(c); setEditForm({ planId: c.planId.toString(), gatewayId: c.gatewayId.toString(), roleId: c.roleId.toString() }); setShowEditModal(true); }} title="Edit" hoverColor={T.primary}><Edit size={15} /></IconBtn>
                  <IconBtn onClick={() => { setDeletingConfig(c); setShowDeleteModal(true); }} title="Delete" hoverColor={T.danger}><Trash2 size={15} /></IconBtn>
                </div>
              </Td>
            </Tr>
          ))}
        </DataTable>
      </Card>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => { setShowEditModal(false); setEditingConfig(null); }} title="Edit Configuration" width="460px">
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField label="Plan">
            <SelectField value={editForm.planId} onChange={e => setEditForm(p => ({ ...p, planId: e.target.value }))} required>
              <option value="">Select Plan</option>
              {plans.map(p => <option key={p.planId} value={p.planId}>{p.planName}</option>)}
            </SelectField>
          </FormField>
          <FormField label="Gateway">
            <SelectField value={editForm.gatewayId} onChange={e => setEditForm(p => ({ ...p, gatewayId: e.target.value }))} required>
              <option value="">Select Gateway</option>
              {gateways.map(g => <option key={g.gatewayId} value={g.gatewayId}>{g.gatewayName}</option>)}
            </SelectField>
          </FormField>
          <FormField label="Role">
            <SelectField value={editForm.roleId} onChange={e => setEditForm(p => ({ ...p, roleId: e.target.value }))} required>
              <option value="">Select Role</option>
              {roles.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
            </SelectField>
          </FormField>
          <ModalActions>
            <GhostBtn type="button" onClick={() => { setShowEditModal(false); setEditingConfig(null); }}>Cancel</GhostBtn>
            <Btn type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</Btn>
          </ModalActions>
        </form>
      </Modal>

      <ConfirmDialog
        open={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeletingConfig(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Configuration"
        message={`Delete config for Plan: "${getName(plans, 'planId', 'planName', deletingConfig?.planId)}", Gateway: "${getName(gateways, 'gatewayId', 'gatewayName', deletingConfig?.gatewayId)}", Role: "${getName(roles, 'roleId', 'roleName', deletingConfig?.roleId)}"?`}
        confirmLabel="Delete"
        confirmColor={T.danger}
        loading={loading}
      />
    </div>
  );
};

export default PlanCommissionManager;
