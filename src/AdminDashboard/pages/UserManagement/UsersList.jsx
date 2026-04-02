import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Power, PowerOff, Trash2 } from 'lucide-react';
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
          headers={['User ID', 'Name', 'Role', 'Mobile', 'Wallet', 'Status', 'Active', 'Actions']}
          loading={loading}
          empty={filteredUsers.length === 0}
        >
          {currentRecords.map(user => (
            <Tr key={user.userManagementId}>
              <Td><span style={{ fontFamily: 'monospace', fontSize: T.fontBase, color: T.textMuted }}>#{user.userId}</span></Td>
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
              <Td style={{ fontWeight: 600 }}>₹0</Td>
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
    </div>
  );
};

export default UsersList;
