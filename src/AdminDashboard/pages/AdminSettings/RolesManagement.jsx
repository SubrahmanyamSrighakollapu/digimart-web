import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  T, PageHeader, Card, Btn, GhostBtn, SectionLabel,
  DataTable, Td, Tr, SelectInput, EmptyState,
  Modal, ConfirmDialog, FormGrid, FormField, InputField, SelectField, ModalActions, IconBtn
} from '../../components/AdminUI';

const RolesManagement = () => {
  const [roleName, setRoleName] = useState('');
  const [roleCode, setRoleCode] = useState('');
  const [defaultCommission, setDefaultCommission] = useState('');
  const [newRoleIsEmployee, setNewRoleIsEmployee] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [isEmployee, setIsEmployee] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  useEffect(() => { fetchRoles(); }, [isEmployee]);

  const fetchRoles = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/getuserrolemaster`, { roleId: 0, isEmployee, isActive: true }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1) { setRoles(res.data.result || []); setCurrentPage(1); }
    } catch { console.error('Error fetching roles'); }
  };

  const handleSave = async () => {
    if (!roleName.trim() || !roleCode.trim()) { toast.error('Enter role name and code'); return; }
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/manageuserrolemaster`, { roleId: 0, roleName, roleCode, parentId: 1, hierarchyLevel: 1, defaultCommission: parseFloat(defaultCommission) || 0, isEmployee: newRoleIsEmployee, isActive: true }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1) { toast.success('Role created!'); setRoleName(''); setRoleCode(''); setDefaultCommission(''); setNewRoleIsEmployee(false); fetchRoles(); }
      else toast.error(res.data.message || 'Failed to create role');
    } catch { toast.error('Error creating role'); }
    finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    if (!editRole.roleName.trim() || !editRole.roleCode.trim()) { toast.error('Enter role name and code'); return; }
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/manageuserrolemaster`, { roleId: editRole.roleId, roleName: editRole.roleName, roleCode: editRole.roleCode, parentId: editRole.parentId || 1, hierarchyLevel: editRole.hierarchyLevel || 1, defaultCommission: parseFloat(editRole.defaultCommission) || 0, isEmployee: editRole.isEmployee ?? false, isActive: true }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1) { toast.success('Role updated!'); setShowEditModal(false); setEditRole(null); fetchRoles(); }
      else toast.error(res.data.message || 'Failed to update role');
    } catch { toast.error('Error updating role'); }
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/deleteuserrolemaster/${deleteConfirm.id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1) { toast.success('Role deleted!'); fetchRoles(); }
    } catch { toast.error('Error deleting role'); }
    finally { setDeleteConfirm({ show: false, id: null }); }
  };

  const paged = roles.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(roles.length / perPage);

  return (
    <div>
      <PageHeader title="Roles Management" subtitle="Create and manage user roles and permissions" />

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Add Role Form */}
        <Card>
          <SectionLabel>Add New Role</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="Role Name">
              <InputField value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="e.g. Super Admin" />
            </FormField>
            <FormField label="Role Code">
              <InputField value={roleCode} onChange={e => setRoleCode(e.target.value)} placeholder="e.g. SUPER_ADMIN" />
            </FormField>
            <FormField label="Default Commission (%)">
              <InputField type="number" value={defaultCommission} onChange={e => setDefaultCommission(e.target.value)} placeholder="e.g. 2.5" min="0" step="0.01" />
            </FormField>

            {/* Employee Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: T.bg, borderRadius: T.radius, border: `1px solid ${T.borderLight}` }}>
              <div>
                <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 600, color: T.text }}>Role Type</p>
                <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>
                  {newRoleIsEmployee ? 'Employee role' : 'Non-employee role'}
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={newRoleIsEmployee}
                  onChange={e => setNewRoleIsEmployee(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '24px',
                  backgroundColor: newRoleIsEmployee ? T.primary : '#d1c4bc',
                  transition: 'background 0.25s'
                }} />
                <span style={{
                  position: 'absolute', top: '3px',
                  left: newRoleIsEmployee ? '23px' : '3px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  backgroundColor: 'white', transition: 'left 0.25s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </label>
            </div>
            <Btn onClick={handleSave} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Saving...' : 'Save Role'}
            </Btn>
          </div>
        </Card>

        {/* Roles Table */}
        <Card noPad>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Roles Directory</h3>
            <SelectInput value={isEmployee ? 'employees' : 'non-employees'} onChange={e => setIsEmployee(e.target.value === 'employees')} style={{ minWidth: '160px' }}>
              <option value="non-employees">Non-Employees</option>
              <option value="employees">Employees</option>
            </SelectInput>
          </div>

          <DataTable headers={['Role Name', 'Role Code', 'Commission', 'Actions']} loading={false} empty={roles.length === 0}>
            {paged.map(role => (
              <Tr key={role.roleId}>
                <Td style={{ fontWeight: 600 }}>{role.roleName}</Td>
                <Td><span style={{ fontFamily: 'monospace', fontSize: T.fontBase, color: T.textMuted, backgroundColor: T.bg, padding: '2px 8px', borderRadius: '4px' }}>{role.roleCode}</span></Td>
                <Td><span style={{ fontWeight: 600, color: T.primary }}>{role.defaultCommission}%</span></Td>
                <Td>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <IconBtn onClick={() => { setEditRole(role); setShowEditModal(true); }} title="Edit" hoverColor={T.primary}><Edit size={15} /></IconBtn>
                    <IconBtn onClick={() => setDeleteConfirm({ show: true, id: role.roleId })} title="Delete" hoverColor={T.danger}><Trash2 size={15} /></IconBtn>
                  </div>
                </Td>
              </Tr>
            ))}
          </DataTable>

          {totalPages > 1 && (
            <div style={{ padding: '14px 20px', borderTop: `1px solid ${T.borderLight}`, display: 'flex', justifyContent: 'center', gap: '6px' }}>
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={{ padding: '6px 12px', border: `1px solid ${T.border}`, borderRadius: T.radiusSm, background: 'white', cursor: 'pointer', fontSize: T.fontBase, color: T.textMuted }}>←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} style={{ padding: '6px 12px', border: `1px solid ${p === currentPage ? T.primary : T.border}`, borderRadius: T.radiusSm, background: p === currentPage ? T.primary : 'white', color: p === currentPage ? 'white' : T.textMuted, cursor: 'pointer', fontSize: T.fontBase, fontWeight: p === currentPage ? 700 : 400 }}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: '6px 12px', border: `1px solid ${T.border}`, borderRadius: T.radiusSm, background: 'white', cursor: 'pointer', fontSize: T.fontBase, color: T.textMuted }}>→</button>
            </div>
          )}
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => { setShowEditModal(false); setEditRole(null); }} title="Edit Role" width="460px">
        {editRole && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="Role Name">
              <InputField value={editRole.roleName} onChange={e => setEditRole(p => ({ ...p, roleName: e.target.value }))} />
            </FormField>
            <FormField label="Role Code">
              <InputField value={editRole.roleCode} onChange={e => setEditRole(p => ({ ...p, roleCode: e.target.value }))} />
            </FormField>
            <FormField label="Default Commission (%)">
              <InputField type="number" value={editRole.defaultCommission ?? ''} onChange={e => setEditRole(p => ({ ...p, defaultCommission: e.target.value }))} placeholder="e.g. 2.5" min="0" step="0.01" />
            </FormField>

            {/* Employee Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', backgroundColor: T.bg, borderRadius: T.radius, border: `1px solid ${T.borderLight}` }}>
              <div>
                <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 600, color: T.text }}>Role Type</p>
                <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>
                  {editRole.isEmployee ? 'Employee role' : 'Non-employee role'}
                </p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={editRole.isEmployee ?? false}
                  onChange={e => setEditRole(p => ({ ...p, isEmployee: e.target.checked }))}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '24px',
                  backgroundColor: editRole.isEmployee ? T.primary : '#d1c4bc',
                  transition: 'background 0.25s'
                }} />
                <span style={{
                  position: 'absolute', top: '3px',
                  left: editRole.isEmployee ? '23px' : '3px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  backgroundColor: 'white', transition: 'left 0.25s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }} />
              </label>
            </div>
            <ModalActions>
              <GhostBtn onClick={() => { setShowEditModal(false); setEditRole(null); }}>Cancel</GhostBtn>
              <Btn onClick={handleUpdate}>Update</Btn>
            </ModalActions>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Role"
        message="Are you sure you want to delete this role? This action cannot be undone."
        confirmLabel="Delete"
        confirmColor={T.danger}
      />
    </div>
  );
};

export default RolesManagement;
