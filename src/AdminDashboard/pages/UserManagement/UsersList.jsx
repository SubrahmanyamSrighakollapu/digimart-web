import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Power, PowerOff, Trash2, ArrowLeftRight, X, Search, Mail, Phone, CheckCircle, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import userService from '../../../services/userService';
import lookupService from '../../../services/lookupService';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../../components/Pagination/Pagination';
import {
  T, PageHeader, Card, Btn, GhostBtn, Badge, getStatusVariant,
  DataTable, Td, Tr, SearchBar, SelectInput, FilterBar,
  Modal, ConfirmDialog, FormGrid, FormField, InputField, SelectField, ModalActions, IconBtn
} from '../../components/AdminUI';

// Hierarchy: index = seniority (lower = more senior)
const ROLE_HIERARCHY = ['Super Admin', 'Super Distributor', 'Master Distributor', 'Distributor'];

// Roles above a given role (can swap to)
const getSwapTargets = (roleName) => {
  const idx = ROLE_HIERARCHY.indexOf(roleName);
  if (idx <= 0) return []; // Super Admin or unknown — no swap targets
  // Can swap to all roles above (more senior), including Self (Super Admin)
  return ROLE_HIERARCHY.slice(0, idx).map(r => ({
    roleId: r === 'Super Admin' ? 'self' : r === 'Super Distributor' ? 2 : r === 'Master Distributor' ? 3 : 4,
    label: r === 'Super Admin' ? 'Self' : r,
    isSelf: r === 'Super Admin',
  }));
};

// Swap API config — keyed by the ROLE of the user being swapped
const SWAP_API = {
  'Super Distributor': { url: '/api/auth/users/swapUserWithSuperDistributor', key: 'superDistributorId' },
  'Master Distributor': { url: '/api/auth/users/swapUserWithMasterDistributor', key: 'masterDistributorId' },
  'Distributor':        { url: '/api/auth/users/swapUserWithDistributor',       key: 'distributorId' },
};

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [formData, setFormData] = useState({ fullName: '', email: '', mobile: '', role: '', statusType: '', aadharNo: '', panNo: '' });

  // Swap state
  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const currentRole = currentUser?.roleName || '';
  const isDistributorRole = ['Super Distributor', 'Master Distributor', 'Distributor'].includes(currentRole);
  const [showSwap, setShowSwap] = useState(false);
  const [swapUser, setSwapUser] = useState(null);
  const [swapRoleId, setSwapRoleId] = useState(null);
  const [swapTargets, setSwapTargets] = useState([]);
  const [swapUsers, setSwapUsers] = useState([]);
  const [swapSearch, setSwapSearch] = useState('');
  const [swapSelectedUser, setSwapSelectedUser] = useState(null);
  const [swapLoading, setSwapLoading] = useState(false);

  useEffect(() => { fetchUsers(); fetchRoles(); fetchStatusTypes(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      if (res?.status === 1 && res.result) setUsers(res.result);
    } catch { toast.error('Failed to fetch users'); }
    finally { setLoading(false); }
  };

  const fetchRoles = async () => {
    try {
      const res = await lookupService.getUserRoleMaster({ roleId: 0, isEmployee: false, isActive: true });
      if (res.status === 1 && res.result) setRoles(res.result);
    } catch {}
  };

  const fetchStatusTypes = async () => {
    try {
      const res = await lookupService.getDefaultStatusTypes();
      if (res.status === 1 && res.result) setStatusTypes(res.result);
    } catch {}
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({ fullName: user.userFullName, email: user.emailAddress, mobile: user.contactNo, role: user.roleName, statusType: user.statusName, aadharNo: user.aadharNo, panNo: user.panNo });
    setShowUpdatePopup(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const selectedRole = roles.find(r => r.roleName === formData.role);
      const selectedStatus = statusTypes.find(s => s.statusValue === formData.statusType);
      const res = await userService.createUser({
        userId: editingUser.userId, fullName: formData.fullName, email: formData.email,
        contactNo: formData.mobile, password: 'N/A', isAutoPassword: true,
        roleId: selectedRole?.roleId ?? editingUser.roleId,
        aadharNo: formData.aadharNo, panNo: formData.panNo,
        statusId: selectedStatus?.statusId ?? editingUser.statusId,
        isAadharVerify: editingUser.isAadharVerify === 1,
        panNoVerify: editingUser.panNoVerify === 1,
        isActive: editingUser.isActive === 1
      });
      if (res.status === 1) { toast.success('User updated!'); setShowUpdatePopup(false); fetchUsers(); }
      else toast.error('Failed to update user');
    } catch { toast.error('Failed to update user'); }
    finally { setLoading(false); }
  };

  const confirmToggleStatus = async () => {
    try {
      setLoading(true);
      const res = await userService.updateUserStatus(selectedUser.userId, { status: selectedUser.isActive !== 1 });
      if (res.status === 1) {
        toast.success(`User ${selectedUser.isActive === 1 ? 'deactivated' : 'activated'}!`);
        setShowConfirmPopup(false); setSelectedUser(null); fetchUsers();
      } else toast.error('Failed to update status');
    } catch { toast.error('Failed to update status'); }
    finally { setLoading(false); }
  };

  const handleOpenSwap = (user) => {
    setSwapUser(user);
    setSwapRoleId(null);
    setSwapUsers([]);
    setSwapSearch('');
    setSwapSelectedUser(null);
    setSwapTargets(getSwapTargets(user.roleName));
    setShowSwap(true);
  };

  const handleSwapRoleSelect = async (target) => {
    setSwapRoleId(target.roleId);
    setSwapSearch('');
    if (target.isSelf) {
      const selfUser = {
        userId: currentUser.userId,
        userFullName: currentUser.userFullName || currentUser.fullName || 'You',
        emailAddress: currentUser.emailAddress || currentUser.email || '',
        contactNo: currentUser.contactNo || currentUser.mobile || '',
        isActive: 1,
      };
      setSwapUsers([selfUser]);
      setSwapSelectedUser(selfUser);
      return;
    }
    setSwapSelectedUser(null);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/users/getUserInfoByRoleId/${target.roleId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSwapUsers(data.status === 1 ? data.result : []);
    } catch { toast.error('Failed to fetch users'); setSwapUsers([]); }
  };

  const handleConfirmSwap = async () => {
    if (!swapSelectedUser || !swapUser) return;
    const target = swapTargets.find(t => t.roleId === swapRoleId);
    try {
      setSwapLoading(true);
      const token = sessionStorage.getItem('token');
      // API is determined by the ROLE OF THE USER BEING SWAPPED
      const api = SWAP_API[swapUser.roleName];
      if (!api && !target?.isSelf) { toast.error('No swap API for this role'); return; }
      const url = `${import.meta.env.VITE_API_BASE_URL}${api.url}`;
      // userId = the person we are swapping TO (selected target user)
      // [roleKey]Id = the user being swapped (current swapUser)
      const body = { userId: swapSelectedUser.userId, [api.key]: swapUser.userId };
      const res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.status === 1) {
        toast.success('User swapped successfully!');
        setShowSwap(false);
        fetchUsers();
      } else toast.error(data.message || 'Swap failed');
    } catch { toast.error('Swap failed'); }
    finally { setSwapLoading(false); }
  };

  const filteredUsers = users.filter(u => {
    const q = searchTerm.toLowerCase();
    return (!searchTerm || u.userFullName?.toLowerCase().includes(q) || u.emailAddress?.toLowerCase().includes(q) || u.contactNo?.includes(q))
      && (!roleFilter || u.roleName === roleFilter)
      && (!statusFilter || u.statusName === statusFilter)
      && (!activeFilter || (activeFilter === 'active' ? u.isActive === 1 : u.isActive === 0));
  });

  const uniqueRoles = [...new Set(users.map(u => u.roleName).filter(Boolean))];
  const uniqueStatuses = [...new Set(users.map(u => u.statusName).filter(Boolean))];
  const { currentPage, totalPages, currentRecords, handlePageChange } = usePagination(filteredUsers, 10);

  return (
    <div>
      <PageHeader
        title="User List"
        subtitle={`${users.length} total users`}
        actions={
          <Btn onClick={() => navigate('/admin/user-management/create-user')} color={T.primary}>
            <Plus size={15} /> Create User
          </Btn>
        }
      />

      <Card noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
          <FilterBar>
            <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search name, email, mobile..." style={{ flex: 1, minWidth: '260px' }} />
            <SelectInput value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </SelectInput>
            <SelectInput value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </SelectInput>
            <SelectInput value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
              <option value="">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </SelectInput>
          </FilterBar>
        </div>

        <DataTable
          headers={['Name', 'Role', 'Mobile', 'Created By', 'Status', 'Active', 'Actions']}
          loading={loading}
          empty={filteredUsers.length === 0}
        >
          {currentRecords.map(user => (
            <Tr key={user.userManagementId}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                    {user.userFullName?.substring(0, 2).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: T.fontMd, color: T.text }}>{user.userFullName}</div>
                    <div style={{ fontSize: T.fontSm, color: T.textMuted }}>{user.emailAddress}</div>
                  </div>
                </div>
              </Td>
              <Td><Badge variant="info">{user.roleName}</Badge></Td>
              <Td style={{ color: T.textMuted }}>+91 {user.contactNo}</Td>
              <Td>
                {user.createdByName
                  ? <div>
                      <div style={{ fontWeight: 500, fontSize: T.fontMd, color: T.text }}>{user.createdByName}</div>
                      <div style={{ fontSize: T.fontSm, color: T.textMuted }}>{user.createdByRoleName || ''}</div>
                    </div>
                  : <span style={{ fontSize: T.fontSm, color: T.textMuted }}>—</span>
                }
              </Td>
              <Td><Badge variant={getStatusVariant(user.statusName)}>{user.statusName}</Badge></Td>
              <Td>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: T.fontBase, fontWeight: 600, color: user.isActive === 1 ? T.success : T.danger }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: user.isActive === 1 ? T.success : T.danger }} />
                  {user.isActive === 1 ? 'Active' : 'Inactive'}
                </span>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <IconBtn onClick={() => handleEditUser(user)} title="Edit" hoverColor={T.primary}><Edit size={15} /></IconBtn>
                  <IconBtn onClick={() => { setSelectedUser(user); setShowConfirmPopup(true); }} title={user.isActive === 1 ? 'Deactivate' : 'Activate'} hoverColor={user.isActive === 1 ? T.danger : T.success} color={user.isActive === 1 ? T.danger : T.success}>
                    {user.isActive === 1 ? <PowerOff size={15} /> : <Power size={15} />}
                  </IconBtn>
                  {!isDistributorRole && getSwapTargets(user.roleName).length > 0 && (
                    <IconBtn onClick={() => handleOpenSwap(user)} title="Swap User" hoverColor="#7c3aed"><ArrowLeftRight size={15} /></IconBtn>
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
      <Modal open={showUpdatePopup} onClose={() => setShowUpdatePopup(false)} title="Update User" width="600px">
        <form onSubmit={handleUpdateUser}>
          <FormGrid>
            <FormField label="Full Name"><InputField name="fullName" value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} required /></FormField>
            <FormField label="Email"><InputField type="email" name="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} required /></FormField>
            <FormField label="Mobile"><InputField name="mobile" value={formData.mobile} onChange={e => setFormData(p => ({ ...p, mobile: e.target.value }))} required /></FormField>
            <FormField label="Role">
              <SelectField name="role" value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} required>
                <option value="">Select Role</option>
                {roles.map(r => <option key={r.roleId} value={r.roleName}>{r.roleName}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Status">
              <SelectField name="statusType" value={formData.statusType} onChange={e => setFormData(p => ({ ...p, statusType: e.target.value }))} required>
                <option value="">Select Status</option>
                {statusTypes.map(s => <option key={s.statusId} value={s.statusValue}>{s.statusValue}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Aadhaar Number"><InputField name="aadharNo" value={formData.aadharNo} onChange={e => setFormData(p => ({ ...p, aadharNo: e.target.value }))} /></FormField>
            <FormField label="PAN Number"><InputField name="panNo" value={formData.panNo} onChange={e => setFormData(p => ({ ...p, panNo: e.target.value }))} /></FormField>
          </FormGrid>
          <ModalActions>
            <GhostBtn type="button" onClick={() => setShowUpdatePopup(false)}>Cancel</GhostBtn>
            <Btn type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update User'}</Btn>
          </ModalActions>
        </form>
      </Modal>

      {/* Confirm Toggle */}
      <ConfirmDialog
        open={showConfirmPopup}
        onClose={() => { setShowConfirmPopup(false); setSelectedUser(null); }}
        onConfirm={confirmToggleStatus}
        title={selectedUser?.isActive === 1 ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${selectedUser?.isActive === 1 ? 'deactivate' : 'activate'} ${selectedUser?.userFullName}?`}
        confirmLabel={selectedUser?.isActive === 1 ? 'Deactivate' : 'Activate'}
        confirmColor={selectedUser?.isActive === 1 ? T.danger : T.success}
        loading={loading}
      />
      {/* Swap User Offcanvas */}
      {showSwap && (
        <>
          <div onClick={() => setShowSwap(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1040, backdropFilter: 'blur(2px)' }} />
          <div style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: '420px', backgroundColor: '#fff', zIndex: 1050, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.15)' }}>
            {/* Header */}
            <div style={{ padding: '18px 20px', background: 'linear-gradient(135deg,#1a6b3c,#2d9e5f)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ArrowLeftRight size={18} color="white" />
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>Swap User</span>
              </div>
              <button onClick={() => setShowSwap(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} color="white" />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {/* Current User Card */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Current User</div>
                <div style={{ padding: '14px 16px', border: `1px solid ${T.borderLight}`, borderRadius: '12px', backgroundColor: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
                      {swapUser?.userFullName?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: T.text }}>{swapUser?.userFullName}</div>
                      <div style={{ fontSize: '12px', color: T.textMuted }}>{swapUser?.emailAddress}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600, padding: '3px 10px', backgroundColor: '#ede9fe', color: '#6d28d9', borderRadius: '20px', flexShrink: 0 }}>{swapUser?.roleName}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: T.textMuted }}>
                      <Mail size={12} /><span>{swapUser?.emailAddress}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: T.textMuted }}>
                      <Phone size={12} /><span>{swapUser?.contactNo}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Move To */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Move User To</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {swapTargets.map(target => (
                    <button key={target.roleId} onClick={() => handleSwapRoleSelect(target)}
                      style={{ padding: '11px 16px', borderRadius: '10px', border: `2px solid ${swapRoleId === target.roleId ? '#1a6b3c' : T.borderLight}`, backgroundColor: swapRoleId === target.roleId ? '#f0fdf4' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s', textAlign: 'left' }}
                    >
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: `2px solid ${swapRoleId === target.roleId ? '#1a6b3c' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {swapRoleId === target.roleId && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1a6b3c' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: swapRoleId === target.roleId ? '#1a6b3c' : T.text }}>{target.label}</span>
                        {target.isSelf && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#6b7280' }}>(assign to yourself)</span>}
                      </div>
                      {target.isSelf && swapRoleId === 'self' && <CheckCircle size={15} color="#1a6b3c" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* User list — skip for Self */}
              {swapRoleId && swapRoleId !== 'self' && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                    Select {swapTargets.find(t => t.roleId === swapRoleId)?.label}
                  </div>
                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <Search size={14} color={T.textMuted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input value={swapSearch} onChange={e => setSwapSearch(e.target.value)} placeholder="Search by name, email or mobile..." style={{ width: '100%', padding: '9px 12px 9px 32px', border: `1px solid ${T.borderLight}`, borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto' }}>
                    {swapUsers
                      .filter(u => { const q = swapSearch.toLowerCase(); return !swapSearch || u.userFullName?.toLowerCase().includes(q) || u.emailAddress?.toLowerCase().includes(q) || u.contactNo?.includes(q); })
                      .map(u => (
                        <div key={u.userId} onClick={() => setSwapSelectedUser(u)}
                          style={{ padding: '12px 14px', borderRadius: '10px', border: `2px solid ${swapSelectedUser?.userId === u.userId ? '#1a6b3c' : T.borderLight}`, backgroundColor: swapSelectedUser?.userId === u.userId ? '#f0fdf4' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.15s' }}
                        >
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#1a6b3c,#2d9e5f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                            {u.userFullName?.substring(0, 2).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '13px', color: T.text }}>{u.userFullName}</div>
                            <div style={{ fontSize: '11px', color: T.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.emailAddress} | {u.contactNo}</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px', backgroundColor: u.isActive === 1 ? '#dcfce7' : '#fee2e2', color: u.isActive === 1 ? '#16a34a' : '#dc2626' }}>
                              {u.isActive === 1 ? 'Active' : 'Inactive'}
                            </span>
                            {swapSelectedUser?.userId === u.userId && <CheckCircle size={14} color="#1a6b3c" />}
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
                <p style={{ margin: 0, fontSize: '12px', color: '#92400e', lineHeight: 1.6 }}>This user will be moved under the selected hierarchy. All permissions and reporting will be updated accordingly.</p>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 20px', borderTop: `1px solid ${T.borderLight}`, display: 'flex', gap: '12px', flexShrink: 0 }}>
              <button onClick={() => setShowSwap(false)} style={{ flex: 1, padding: '11px', backgroundColor: '#fff', border: `1px solid ${T.borderLight}`, borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: T.text }}>Cancel</button>
              <button onClick={handleConfirmSwap} disabled={!swapSelectedUser || swapLoading}
                style={{ flex: 1, padding: '11px', backgroundColor: swapSelectedUser && !swapLoading ? '#1a6b3c' : '#d1d5db', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: swapSelectedUser && !swapLoading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ArrowLeftRight size={15} /> {swapLoading ? 'Swapping...' : 'Swap User'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersList;
