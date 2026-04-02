import { useState, useEffect } from 'react';
import { Edit, Trash2, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import {
  T, PageHeader, Card, Btn, GhostBtn, Badge, SectionLabel,
  DataTable, Td, Tr, SearchBar, SelectInput, FilterBar,
  Modal, ConfirmDialog, FormField, InputField, TextareaField, ModalActions, IconBtn, Toggle
} from '../../components/AdminUI';

const PlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingPlanId, setDeletingPlanId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({ planName: '', planPrice: '', planDescription: '', isActive: true });
  const [newForm, setNewForm] = useState({ planName: '', planPrice: '', planDescription: '', isActive: true });

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async (isActive = null) => {
    try {
      setLoading(true);
      const res = await api.get(`/plan/getAllPlans/0/${isActive === null ? 'true' : isActive.toString()}`);
      if (res?.status === 1 && res.result) setPlans(res.result);
    } catch { toast.error('Failed to fetch plans'); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/plan/manageplans', { planId: 0, planName: newForm.planName, planPrice: parseFloat(newForm.planPrice), planDescription: newForm.planDescription, isActive: newForm.isActive });
      if (res?.status === 1) { toast.success('Plan created!'); setNewForm({ planName: '', planPrice: '', planDescription: '', isActive: true }); fetchPlans(); }
      else toast.error('Failed to create plan');
    } catch { toast.error('Error creating plan'); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/plan/manageplans', { planId: editingPlan.planId, planName: formData.planName, planPrice: parseFloat(formData.planPrice), planDescription: formData.planDescription, isActive: formData.isActive });
      if (res?.status === 1) { toast.success('Plan updated!'); setShowEditPopup(false); setEditingPlan(null); fetchPlans(statusFilter === 'all' ? null : statusFilter === 'active'); }
      else toast.error('Failed to update plan');
    } catch { toast.error('Error updating plan'); }
    finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const res = await api.delete(`/plan/deletePlanById/${deletingPlanId}`);
      if (res?.status === 1) { toast.success('Plan deleted!'); fetchPlans(statusFilter === 'all' ? null : statusFilter === 'active'); }
      else toast.error('Failed to delete plan');
    } catch { toast.error('Error deleting plan'); }
    finally { setLoading(false); setShowDeletePopup(false); setDeletingPlanId(null); }
  };

  const handleStatusFilter = (s) => { setStatusFilter(s); fetchPlans(s === 'all' ? null : s === 'active'); };

  return (
    <div>
      <PageHeader title="Plans Management" subtitle="Create and manage subscription plans" />

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Create Form */}
        <Card>
          <SectionLabel>Add New Plan</SectionLabel>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="Plan Name">
              <InputField name="planName" value={newForm.planName} onChange={e => setNewForm(p => ({ ...p, planName: e.target.value }))} placeholder="e.g. Basic, Premium" required />
            </FormField>
            <FormField label="Price (₹)">
              <InputField type="number" name="planPrice" value={newForm.planPrice} onChange={e => setNewForm(p => ({ ...p, planPrice: e.target.value }))} placeholder="e.g. 999" step="0.01" min="0" required />
            </FormField>
            <FormField label="Description">
              <TextareaField name="planDescription" value={newForm.planDescription} onChange={e => setNewForm(p => ({ ...p, planDescription: e.target.value }))} placeholder="Describe this plan..." required />
            </FormField>
            <Toggle checked={newForm.isActive} onChange={() => setNewForm(p => ({ ...p, isActive: !p.isActive }))} label="Active on creation" />
            <Btn type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Saving...' : 'Save Plan'}
            </Btn>
          </form>
        </Card>

        {/* Plans Table */}
        <Card noPad>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
            <FilterBar>
              <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text, marginRight: 'auto' }}>Plans Directory</h3>
              <SelectInput value={statusFilter} onChange={e => handleStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </SelectInput>
            </FilterBar>
          </div>

          <DataTable headers={['Plan Details', 'Price', 'Status', 'Created', 'Actions']} loading={loading} empty={plans.length === 0}>
            {plans.map(plan => (
              <Tr key={plan.planId}>
                <Td>
                  <div style={{ fontWeight: 700, color: T.text, marginBottom: '2px' }}>{plan.planName}</div>
                  <div style={{ fontSize: T.fontSm, color: T.textMuted, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{plan.planDescription}</div>
                </Td>
                <Td style={{ fontWeight: 700, fontSize: '15px' }}>₹{parseFloat(plan.planPrice).toLocaleString()}</Td>
                <Td><Badge variant={plan.isActive === 1 ? 'success' : 'neutral'}>{plan.isActive === 1 ? 'Active' : 'Inactive'}</Badge></Td>
                <Td style={{ color: T.textMuted }}>{new Date(plan.createdAt).toLocaleDateString('en-GB')}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <IconBtn onClick={() => { setEditingPlan(plan); setFormData({ planName: plan.planName, planPrice: plan.planPrice, planDescription: plan.planDescription, isActive: plan.isActive === 1 }); setShowEditPopup(true); }} title="Edit" hoverColor={T.primary}><Edit size={15} /></IconBtn>
                    <IconBtn onClick={() => { setDeletingPlanId(plan.planId); setShowDeletePopup(true); }} title="Delete" hoverColor={T.danger}><Trash2 size={15} /></IconBtn>
                  </div>
                </Td>
              </Tr>
            ))}
          </DataTable>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal open={showEditPopup} onClose={() => { setShowEditPopup(false); setEditingPlan(null); }} title="Edit Plan" width="500px">
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField label="Plan Name"><InputField name="planName" value={formData.planName} onChange={e => setFormData(p => ({ ...p, planName: e.target.value }))} required /></FormField>
          <FormField label="Price (₹)"><InputField type="number" name="planPrice" value={formData.planPrice} onChange={e => setFormData(p => ({ ...p, planPrice: e.target.value }))} step="0.01" min="0" required /></FormField>
          <FormField label="Description"><TextareaField name="planDescription" value={formData.planDescription} onChange={e => setFormData(p => ({ ...p, planDescription: e.target.value }))} required /></FormField>
          <Toggle checked={formData.isActive} onChange={() => setFormData(p => ({ ...p, isActive: !p.isActive }))} label="Active" />
          <ModalActions>
            <GhostBtn type="button" onClick={() => { setShowEditPopup(false); setEditingPlan(null); }}>Cancel</GhostBtn>
            <Btn type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Plan'}</Btn>
          </ModalActions>
        </form>
      </Modal>

      <ConfirmDialog
        open={showDeletePopup}
        onClose={() => { setShowDeletePopup(false); setDeletingPlanId(null); }}
        onConfirm={confirmDelete}
        title="Delete Plan"
        message="Are you sure you want to delete this plan? This action cannot be undone."
        confirmLabel="Delete"
        confirmColor={T.danger}
        loading={loading}
      />
    </div>
  );
};

export default PlansManagement;
