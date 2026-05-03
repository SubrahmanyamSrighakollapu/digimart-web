import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Power, PowerOff, Trash2, FileText, BadgeCheck, CalendarDays, ArrowLeftRight, X, Search, Mail, Phone, CheckCircle, Briefcase, MapPin, Info } from 'lucide-react';
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

  // Swap state
  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const currentRole = currentUser?.roleName || '';
  const isDistributorRole = ['Super Distributor', 'Master Distributor', 'Distributor'].includes(currentRole);

  const SWAP_ROLES = [
    { roleId: 'self', label: 'Self' },
    { roleId: 2, label: 'Super Distributor' },
    { roleId: 3, label: 'Master Distributor' },
    { roleId: 4, label: 'Distributor' },
  ];
  const [showSwap, setShowSwap] = useState(false);
  const [swapAgent, setSwapAgent] = useState(null);
  const [swapRoleId, setSwapRoleId] = useState(null);
  const [swapUsers, setSwapUsers] = useState([]);
  const [swapSearch, setSwapSearch] = useState('');
  const [swapSelectedUser, setSwapSelectedUser] = useState(null);
  const [swapLoading, setSwapLoading] = useState(false);

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

  const handleOpenSwap = (agent) => {
    setSwapAgent(agent);
    setSwapRoleId(null);
    setSwapUsers([]);
    setSwapSearch('');
    setSwapSelectedUser(null);
    setShowSwap(true);
  };

  const handleSwapRoleSelect = async (roleId) => {
    setSwapRoleId(roleId);
    setSwapSearch('');

    // Self — use current logged-in user directly, no API needed
    if (roleId === 'self') {
      const selfUser = {
        userId: currentUser.userId,
        userFullName: currentUser.userFullName || currentUser.fullName || 'You',
        emailAddress: currentUser.emailAddress || currentUser.email || '',
        contactNo: currentUser.contactNo || currentUser.mobile || '',
        roleName: currentRole,
        isActive: 1,
      };
      setSwapUsers([selfUser]);
      setSwapSelectedUser(selfUser);
      return;
    }

    setSwapSelectedUser(null);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/users/getUserInfoByRoleId/${roleId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSwapUsers(data.status === 1 ? data.result : []);
    } catch { toast.error('Failed to fetch users'); setSwapUsers([]); }
  };

  const handleConfirmSwap = async () => {
    if (!swapSelectedUser) return;
    try {
      setSwapLoading(true);
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/users/swapAgentUser`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: swapSelectedUser.userId, agentId: swapAgent.agentId }),
      });
      const data = await res.json();
      if (data.status === 1) {
        toast.success('Agent swapped successfully!');
        setShowSwap(false);
        fetchAgents();
      } else toast.error(data.message || 'Swap failed');
    } catch { toast.error('Swap failed'); }
    finally { setSwapLoading(false); }
  };

  const handleOpenPlanPopup = (agent) => {
    setSelectedAgent(agent);
    fetchPlans();
    // Pre-populate with existing plan if assigned
    setPlanFormData({
      planId: agent.planId ? String(agent.planId) : '',
      planStartDate: agent.planStartDate ? agent.planStartDate.split('T')[0] : '',
      planEndDate: agent.planEndDate ? agent.planEndDate.split('T')[0] : '',
    });
    setShowPlanPopup(true);
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
          headers={['Name', 'Business', 'Plan', 'Mobile', 'Created By', 'Status', 'Actions']}
          loading={loading}
          empty={filteredAgents.length === 0}
        >
          {currentRecords.map(agent => (
            <Tr key={agent.agentId}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                    {agent.userFullName?.substring(0, 2).toUpperCase() || 'AG'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: T.fontMd, color: T.text }}>{agent.userFullName || 'N/A'}</div>
                    <div style={{ fontSize: T.fontSm, color: T.textMuted }}>{agent.emailAddress}</div>
                    <div style={{ fontSize: T.fontSm, color: T.textMuted, fontFamily: 'monospace' }}>{agent.agentCode}</div>
                  </div>
                </div>
              </Td>
              <Td>
                <div style={{ fontWeight: 500, color: T.text }}>{agent.businessName || 'N/A'}</div>
                <div style={{ fontSize: T.fontSm, color: T.textMuted }}>{agent.businessType || ''}</div>
              </Td>
              <Td>
                {agent.planName
                  ? <div>
                      <div style={{ fontWeight: 600, fontSize: T.fontMd, color: T.text }}>{agent.planName}</div>
                      <div style={{ fontSize: T.fontSm, color: T.textMuted }}>₹{agent.planPrice}</div>
                    </div>
                  : <span style={{ fontSize: T.fontSm, color: T.textMuted }}>No Plan</span>
                }
              </Td>
              <Td style={{ color: T.textMuted }}>{agent.contactNo || 'N/A'}</Td>
              <Td>
                {agent.createdByName
                  ? <div>
                      <div style={{ fontWeight: 500, fontSize: T.fontMd, color: T.text }}>{agent.createdByName}</div>
                      <div style={{ fontSize: T.fontSm, color: T.textMuted }}>{agent.createdByRoleName || ''}</div>
                    </div>
                  : <span style={{ fontSize: T.fontSm, color: T.textMuted }}>—</span>
                }
              </Td>
              <Td><Badge variant={getStatusVariant(agent.statusName)}>{agent.statusName || 'N/A'}</Badge></Td>
              <Td>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <IconBtn onClick={() => handleEditAgent(agent)} title="Edit" hoverColor={T.primary}><Edit size={15} /></IconBtn>
                  <IconBtn onClick={() => { setSelectedAgent(agent); setShowConfirmPopup(true); }} title={agent.isActive === 1 ? 'Deactivate' : 'Activate'} color={agent.isActive === 1 ? T.danger : T.success} hoverColor={agent.isActive === 1 ? T.danger : T.success}>
                    {agent.isActive === 1 ? <PowerOff size={15} /> : <Power size={15} />}
                  </IconBtn>
                  <IconBtn onClick={() => handleOpenPlanPopup(agent)} title="Assign Plan" hoverColor={T.info}><FileText size={15} /></IconBtn>
                  {!isDistributorRole && (
                    <IconBtn onClick={() => handleOpenSwap(agent)} title="Swap Agent" hoverColor="#7c3aed"><ArrowLeftRight size={15} /></IconBtn>
                  )}
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

      {/* Assign / Update Plan Modal */}
      <Modal open={showPlanPopup} onClose={() => setShowPlanPopup(false)} title={`${selectedAgent?.planId ? 'Update' : 'Assign'} Plan — ${selectedAgent?.userFullName}`} width="500px">
        <form onSubmit={handleAssignPlan}>
          {/* Current plan banner */}
          {selectedAgent?.planId && (
            <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</span>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '4px' }}>
  
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <BadgeCheck size={14} color="#1e3a8a" />
    <span style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: 600 }}>
      {selectedAgent.planName} — ₹{selectedAgent.planPrice}
    </span>
  </div>

  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <CalendarDays size={14} color="#374151" />
    <span style={{ fontSize: '13px', color: '#374151' }}>
      {new Date(selectedAgent.planStartDate).toLocaleDateString()} → {new Date(selectedAgent.planEndDate).toLocaleDateString()}
    </span>
  </div>

</div>
            </div>
          )}
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
            <Btn type="submit" disabled={loading}>{loading ? 'Saving...' : selectedAgent?.planId ? 'Update Plan' : 'Assign Plan'}</Btn>
          </ModalActions>
        </form>
      </Modal>
      {/* Swap Agent Offcanvas */}
      {showSwap && (
        <>
          {/* Backdrop */}
          <div onClick={() => setShowSwap(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1040, backdropFilter: 'blur(2px)' }} />
          {/* Panel */}
          <div style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: '420px', backgroundColor: '#fff', zIndex: 1050, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)' }}>
            {/* Header */}
            <div style={{ padding: '18px 20px', background: 'linear-gradient(135deg, #1a6b3c, #2d9e5f)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ArrowLeftRight size={18} color="white" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>Swap Agent</span>
              </div>
              <button onClick={() => setShowSwap(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} color="white" />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {/* Current Agent Card */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Current Agent</div>
                <div style={{ padding: '14px 16px', border: `1px solid ${T.borderLight}`, borderRadius: '12px', backgroundColor: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                      {swapAgent?.userFullName?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: T.text }}>{swapAgent?.userFullName}</div>
                      <div style={{ fontSize: '12px', color: T.textMuted, fontFamily: 'monospace' }}>{swapAgent?.agentCode}</div>
                    </div>
                    {swapAgent?.createdByRoleName && (
                      <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600, padding: '3px 10px', backgroundColor: '#ede9fe', color: '#6d28d9', borderRadius: '20px' }}>{swapAgent.createdByRoleName}</span>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {[
                      { icon: Mail, val: swapAgent?.emailAddress },
                      { icon: Phone, val: swapAgent?.contactNo },
                      { icon: Briefcase, val: swapAgent?.businessName },
                      { icon: MapPin, val: swapAgent?.agentAddress }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: T.textMuted }}>
                        <item.icon size={12} />
                        <span>{item.val || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Move To — Role Buttons */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Move Agent To</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SWAP_ROLES.map(role => (
                    <button key={role.roleId} onClick={() => handleSwapRoleSelect(role.roleId)}
                      style={{ padding: '11px 16px', borderRadius: '10px', border: `2px solid ${swapRoleId === role.roleId ? '#1a6b3c' : T.borderLight}`, backgroundColor: swapRoleId === role.roleId ? '#f0fdf4' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s', textAlign: 'left' }}
                    >
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${swapRoleId === role.roleId ? '#1a6b3c' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {swapRoleId === role.roleId && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1a6b3c' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: swapRoleId === role.roleId ? '#1a6b3c' : T.text }}>{role.label}</span>
                        {role.roleId === 'self' && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>(assign to yourself)</span>}
                      </div>
                      {role.roleId === 'self' && swapRoleId === 'self' && <CheckCircle size={15} color="#1a6b3c" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* User List — skip for Self since it's auto-selected */}
              {swapRoleId && swapRoleId !== 'self' && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                    Select {SWAP_ROLES.find(r => r.roleId === swapRoleId)?.label}
                  </div>
                  {/* Search */}
                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <Search size={14} color={T.textMuted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={swapSearch} onChange={e => setSwapSearch(e.target.value)} placeholder="Search by name, email or mobile..." style={{ width: '100%', padding: '9px 12px 9px 32px', border: `1px solid ${T.borderLight}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  {/* Users */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                    {swapUsers
                      .filter(u => {
                        const q = swapSearch.toLowerCase();
                        return !swapSearch || u.userFullName?.toLowerCase().includes(q) || u.emailAddress?.toLowerCase().includes(q) || u.contactNo?.includes(q);
                      })
                      .map(user => (
                        <div key={user.userId} onClick={() => setSwapSelectedUser(user)}
                          style={{ padding: '12px 14px', borderRadius: '10px', border: `2px solid ${swapSelectedUser?.userId === user.userId ? '#1a6b3c' : T.borderLight}`, backgroundColor: swapSelectedUser?.userId === user.userId ? '#f0fdf4' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.15s' }}
                        >
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#1a6b3c,#2d9e5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                            {user.userFullName?.substring(0, 2).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: T.text }}>{user.userFullName}</div>
                            <div style={{ fontSize: '11px', color: T.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.emailAddress} | {user.contactNo}</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', backgroundColor: user.isActive === 1 ? '#dcfce7' : '#fee2e2', color: user.isActive === 1 ? '#16a34a' : '#dc2626' }}>
                              {user.isActive === 1 ? 'Active' : 'Inactive'}
                            </span>
                            {swapSelectedUser?.userId === user.userId && <CheckCircle size={14} color="#1a6b3c" />}
                          </div>
                        </div>
                      ))
                    }
                    {swapUsers.length === 0 && <p style={{ textAlign: 'center', color: T.textMuted, fontSize: '13px', padding: '20px 0' }}>No users found for this role</p>}
                  </div>
                </div>
              )}

              {/* Note */}
              <div style={{ marginTop: '20px', padding: '12px 14px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', display: 'flex', gap: '10px' }}>
                <Info size={15} color="#92400e" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ margin: 0, fontSize: '12px', color: '#92400e', lineHeight: 1.6 }}>This agent will be moved under the selected user. All permissions, hierarchy and reporting will be updated accordingly.</p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${T.borderLight}`, display: 'flex', gap: '12px', flexShrink: 0 }}>
              <button onClick={() => setShowSwap(false)} style={{ flex: 1, padding: '11px', backgroundColor: '#fff', border: `1px solid ${T.borderLight}`, borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: T.text }}>Cancel</button>
              <button onClick={handleConfirmSwap} disabled={!swapSelectedUser || swapLoading}
                style={{ flex: 1, padding: '11px', backgroundColor: swapSelectedUser && !swapLoading ? '#1a6b3c' : '#d1d5db', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: swapSelectedUser && !swapLoading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ArrowLeftRight size={15} /> {swapLoading ? 'Swapping...' : 'Swap Agent'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AgentsList;
