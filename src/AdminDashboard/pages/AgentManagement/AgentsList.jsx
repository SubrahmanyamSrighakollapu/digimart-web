import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Power, PowerOff, Trash2, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import agentService from '../../../services/agentService';
import lookupService from '../../../services/lookupService';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../../components/Pagination/Pagination';
import {
  T, PageHeader, Card, Btn, GhostBtn, Badge, getStatusVariant,
  DataTable, Td, Tr, SearchBar, SelectInput, FilterBar,
  Modal, ConfirmDialog, FormGrid, FormField, InputField, SelectField, TextareaField, ModalActions, IconBtn
} from '../../components/AdminUI';

const AgentsList = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showPlanPopup, setShowPlanPopup] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);
  const [plans, setPlans] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [formData, setFormData] = useState({ agentName: '', email: '', mobile: '', businessName: '', address: '', statusType: '' });
  const [planFormData, setPlanFormData] = useState({ planId: '', planStartDate: '', planEndDate: '' });

  useEffect(() => { fetchAgents(); fetchStatusTypes(); }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await agentService.getAllAgents();
      if (res?.status === 1 && res.result) setAgents(res.result);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to fetch agents'); }
    finally { setLoading(false); }
  };

  const fetchStatusTypes = async () => {
    try {
      const res = await lookupService.getDefaultStatusTypes();
      if (res.status === 1 && res.result) setStatusTypes(res.result);
    } catch {}
  };

  const fetchPlans = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('https://api.mdigimart.com/api/plan/getAllPlans/0/true', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.status === 1 && data.result) setPlans(data.result);
    } catch { toast.error('Failed to fetch plans'); }
  };

  const handleEditAgent = (agent) => {
    setEditingAgent(agent);
    setFormData({ agentName: agent.userFullName || '', email: agent.emailAddress || '', mobile: agent.contactNo || '', businessName: agent.businessName || '', address: agent.agentAddress || '', statusType: agent.statusName || '' });
    setShowUpdatePopup(true);
  };

  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const selectedStatus = statusTypes.find(s => s.statusValue === formData.statusType);
      const res = await agentService.updateAgent(editingAgent.agentId, {
        agentId: editingAgent.agentId, agentName: formData.agentName, email: formData.email,
        mobile: formData.mobile, businessName: formData.businessName, address: formData.address,
        statusId: selectedStatus?.statusId ?? editingAgent.statusId, isActive: editingAgent.isActive
      });
      if (res.status === 1) { toast.success('Agent updated!'); setShowUpdatePopup(false); fetchAgents(); }
      else toast.error(res.message || 'Failed to update agent');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to update agent'); }
    finally { setLoading(false); }
  };

  const confirmToggleStatus = async () => {
    try {
      setLoading(true);
      const res = await agentService.updateAgentStatus({ userId: selectedAgent.userId, isActive: selectedAgent.isActive !== 1 });
      if (res.status === 1) {
        toast.success(`Agent ${selectedAgent.isActive === 1 ? 'deactivated' : 'activated'}!`);
        setShowConfirmPopup(false); setSelectedAgent(null); fetchAgents();
      } else toast.error(res.message || 'Failed to update status');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to update status'); }
    finally { setLoading(false); }
  };

  const handleAssignPlan = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const selectedPlan = plans.find(p => p.planId === parseInt(planFormData.planId));
      const res = await fetch('https://api.mdigimart.com/api/plan/user-plan-mapping', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPlanId: 0, userId: selectedAgent.userId, planId: parseInt(planFormData.planId), planPrice: parseFloat(selectedPlan.planPrice), planStartDate: planFormData.planStartDate, planEndDate: planFormData.planEndDate, isActive: true })
      });
      const data = await res.json();
      if (data.status === 1) { toast.success('Plan assigned!'); setShowPlanPopup(false); }
      else toast.error(data.message || 'Failed to assign plan');
    } catch { toast.error('Failed to assign plan'); }
    finally { setLoading(false); }
  };

  const filteredAgents = agents.filter(a => {
    const q = searchTerm.toLowerCase();
    return (!searchTerm || a.userFullName?.toLowerCase().includes(q) || a.emailAddress?.toLowerCase().includes(q) || a.contactNo?.includes(q) || a.businessName?.toLowerCase().includes(q))
      && (!statusFilter || a.statusName === statusFilter)
      && (!activeFilter || (activeFilter === 'active' ? a.isActive === 1 : a.isActive === 0));
  });

  const uniqueStatuses = [...new Set(agents.map(a => a.statusName).filter(Boolean))];
  const { currentPage, totalPages, currentRecords, handlePageChange } = usePagination(filteredAgents, 10);

  return (
    <div>
      <PageHeader
        title="Agent List"
        subtitle={`${agents.length} total agents`}
        actions={
          <Btn onClick={() => navigate('/admin/agent-management/add-agent')} color={T.primary}>
            <Plus size={15} /> Add Agent
          </Btn>
        }
      />

      <Card noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
          <FilterBar>
            <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search name, email, mobile, business..." style={{ flex: 1, minWidth: '260px' }} />
            <SelectInput value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </SelectInput>
            <SelectInput value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
              <option value="">All Agents</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </SelectInput>
          </FilterBar>
        </div>

        <DataTable
          headers={['Agent ID', 'Name', 'Business','Plan', 'Mobile', 'Address', 'Status', 'Actions']}
          loading={loading}
          empty={filteredAgents.length === 0}
        >
          {currentRecords.map(agent => (
            <Tr key={agent.agentId}>
              <Td><span style={{ fontFamily: 'monospace', fontSize: T.fontBase, color: T.textMuted }}>{agent.agentCode}</span></Td>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                    {agent.userFullName?.substring(0, 2).toUpperCase() || 'AG'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: T.fontMd, color: T.text }}>{agent.userFullName || 'N/A'}</div>
                    <div style={{ fontSize: T.fontSm, color: T.textMuted }}>{agent.emailAddress}</div>
                  </div>
                </div>
              </Td>
              <Td style={{ fontWeight: 500 }}>{agent.businessName || 'N/A'}</Td>
              <Td style={{ fontWeight: 500 }}>{agent.planName || 'N/A'}</Td>
              <Td style={{ color: T.textMuted }}>{agent.contactNo || 'N/A'}</Td>
              <Td style={{ color: T.textMuted, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.agentAddress || 'N/A'}</Td>
              <Td><Badge variant={getStatusVariant(agent.statusName)}>{agent.statusName || 'N/A'}</Badge></Td>
              <Td>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <IconBtn onClick={() => handleEditAgent(agent)} title="Edit" hoverColor={T.primary}><Edit size={15} /></IconBtn>
                  <IconBtn onClick={() => { setSelectedAgent(agent); setShowConfirmPopup(true); }} title={agent.isActive === 1 ? 'Deactivate' : 'Activate'} color={agent.isActive === 1 ? T.danger : T.success} hoverColor={agent.isActive === 1 ? T.danger : T.success}>
                    {agent.isActive === 1 ? <PowerOff size={15} /> : <Power size={15} />}
                  </IconBtn>
                  <IconBtn onClick={() => { setSelectedAgent(agent); fetchPlans(); setShowPlanPopup(true); }} title="Assign Plan" hoverColor={T.info}><FileText size={15} /></IconBtn>
                  <IconBtn title="Delete" hoverColor={T.danger}><Trash2 size={15} /></IconBtn>
                </div>
              </Td>
            </Tr>
          ))}
        </DataTable>

        <div style={{ padding: '16px 20px', borderTop: `1px solid ${T.borderLight}` }}>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal open={showUpdatePopup} onClose={() => setShowUpdatePopup(false)} title="Update Agent" width="600px">
        <form onSubmit={handleUpdateAgent}>
          <FormGrid>
            <FormField label="Agent Name"><InputField name="agentName" value={formData.agentName} onChange={e => setFormData(p => ({ ...p, agentName: e.target.value }))} required /></FormField>
            <FormField label="Email"><InputField type="email" name="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required /></FormField>
            <FormField label="Mobile"><InputField name="mobile" value={formData.mobile} onChange={e => setFormData(p => ({ ...p, mobile: e.target.value }))} required /></FormField>
            <FormField label="Business Name"><InputField name="businessName" value={formData.businessName} onChange={e => setFormData(p => ({ ...p, businessName: e.target.value }))} required /></FormField>
            <FormField label="Status">
              <SelectField name="statusType" value={formData.statusType} onChange={e => setFormData(p => ({ ...p, statusType: e.target.value }))} required>
                <option value="">Select Status</option>
                {statusTypes.map(s => <option key={s.statusId} value={s.statusValue}>{s.statusValue}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Address" fullWidth>
              <TextareaField name="address" value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} placeholder="Enter full address" required />
            </FormField>
          </FormGrid>
          <ModalActions>
            <GhostBtn type="button" onClick={() => setShowUpdatePopup(false)}>Cancel</GhostBtn>
            <Btn type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Agent'}</Btn>
          </ModalActions>
        </form>
      </Modal>

      {/* Confirm Toggle */}
      <ConfirmDialog
        open={showConfirmPopup}
        onClose={() => { setShowConfirmPopup(false); setSelectedAgent(null); }}
        onConfirm={confirmToggleStatus}
        title={selectedAgent?.isActive === 1 ? 'Deactivate Agent' : 'Activate Agent'}
        message={`Are you sure you want to ${selectedAgent?.isActive === 1 ? 'deactivate' : 'activate'} ${selectedAgent?.userFullName}?`}
        confirmLabel={selectedAgent?.isActive === 1 ? 'Deactivate' : 'Activate'}
        confirmColor={selectedAgent?.isActive === 1 ? T.danger : T.success}
        loading={loading}
      />

      {/* Assign Plan Modal */}
      <Modal open={showPlanPopup} onClose={() => setShowPlanPopup(false)} title={`Assign Plan — ${selectedAgent?.userFullName}`} width="500px">
        <form onSubmit={handleAssignPlan}>
          <FormGrid cols={1}>
            <FormField label="Select Plan">
              <SelectField name="planId" value={planFormData.planId} onChange={e => setPlanFormData(p => ({ ...p, planId: e.target.value }))} required>
                <option value="">Choose a plan</option>
                {plans.map(p => <option key={p.planId} value={p.planId}>{p.planName} — ₹{p.planPrice}</option>)}
              </SelectField>
            </FormField>
          </FormGrid>
          <FormGrid>
            <FormField label="Start Date"><InputField type="date" name="planStartDate" value={planFormData.planStartDate} onChange={e => setPlanFormData(p => ({ ...p, planStartDate: e.target.value }))} required /></FormField>
            <FormField label="End Date"><InputField type="date" name="planEndDate" value={planFormData.planEndDate} onChange={e => setPlanFormData(p => ({ ...p, planEndDate: e.target.value }))} required /></FormField>
          </FormGrid>
          <ModalActions>
            <GhostBtn type="button" onClick={() => setShowPlanPopup(false)}>Cancel</GhostBtn>
            <Btn type="submit" disabled={loading}>{loading ? 'Assigning...' : 'Assign Plan'}</Btn>
          </ModalActions>
        </form>
      </Modal>
    </div>
  );
};

export default AgentsList;
