import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Power, PowerOff, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import employeeService from '../../../services/employeeService';
import lookupService from '../../../services/lookupService';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../../components/Pagination/Pagination';
import {
  T, PageHeader, Card, Btn, GhostBtn, Badge, getStatusVariant,
  DataTable, Td, Tr, SearchBar, SelectInput, FilterBar,
  Modal, ConfirmDialog, FormGrid, FormField, InputField, SelectField, ModalActions, IconBtn, Toggle
} from '../../components/AdminUI';

const PERMS = [
  { key: 'isViewOrder', label: 'View Orders' },
  { key: 'isManageInventory', label: 'Manage Inventory' },
  { key: 'isPaymentApproval', label: 'Approve Payments' },
  { key: 'isViewReports', label: 'View Reports' },
];

const EmployeesList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [formData, setFormData] = useState({ fullName: '', mobile: '', department: '', roleType: '', statusType: '', joiningDate: '', shift: '' });
  const [permissions, setPermissions] = useState({ isViewOrder: false, isManageInventory: false, isPaymentApproval: false, isViewReports: false });

  useEffect(() => { fetchEmployees(); fetchLookupData(); }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await employeeService.getAllEmployees();
      if (res?.status === 1 && res.result) setEmployees(res.result);
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to fetch employees'); }
    finally { setLoading(false); }
  };

  const fetchLookupData = async () => {
    try {
      const [d, r, s] = await Promise.all([
        lookupService.getEmployeeDepartmentTypes(),
        lookupService.getUserRoleMaster({ roleId: 0, isEmployee: true, isActive: true }),
        lookupService.getDefaultStatusTypes()
      ]);
      if (d.status === 1) setDepartments(d.result);
      if (r.status === 1) setRoles(r.result);
      if (s.status === 1) setStatusTypes(s.result);
    } catch {}
  };

  const handleEditEmployee = (emp) => {
    setEditingEmployee(emp);
    setFormData({ fullName: emp.employeeName || '', mobile: emp.mobileNo || '', department: emp.departmentName || '', roleType: emp.roleName || '', statusType: emp.statusName || '', joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '', shift: emp.shifts || '' });
    setPermissions({ isViewOrder: emp.isViewOrder === 1, isManageInventory: emp.isManageInventory === 1, isPaymentApproval: emp.isPaymentApproval === 1, isViewReports: emp.isViewReports === 1 });
    setShowUpdatePopup(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const selectedRole = roles.find(r => r.roleName === formData.roleType);
      const selectedDept = departments.find(d => d.statusValue === formData.department);
      const selectedStatus = statusTypes.find(s => s.statusValue === formData.statusType);
      const res = await employeeService.onboardEmployee({
        userId: editingEmployee.userId, fullName: formData.fullName, email: editingEmployee.emailAddress,
        contactNo: formData.mobile, password: 'N/A', isAutoPassword: true,
        roleId: selectedRole?.roleId ?? editingEmployee.roleId,
        employeeCode: editingEmployee.employeeCode, joiningDate: formData.joiningDate, shifts: formData.shift,
        departmentId: selectedDept?.statusId ?? editingEmployee.departmentId,
        isViewOrder: permissions.isViewOrder, isPaymentApproval: permissions.isPaymentApproval,
        isManageInventory: permissions.isManageInventory, isViewReports: permissions.isViewReports,
        statusId: selectedStatus?.statusId ?? editingEmployee.statusId
      });
      if (res.status === 1) { toast.success('Employee updated!'); setShowUpdatePopup(false); fetchEmployees(); }
      else toast.error('Failed to update employee');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to update employee'); }
    finally { setLoading(false); }
  };

  const confirmToggleStatus = async () => {
    try {
      setLoading(true);
      const res = await employeeService.toggleEmployeeStatus(selectedEmployee.userId, selectedEmployee.isActive !== 1);
      if (res.status === 1) {
        toast.success(`Employee ${selectedEmployee.isActive === 1 ? 'deactivated' : 'activated'}!`);
        setShowConfirmPopup(false); setSelectedEmployee(null); fetchEmployees();
      } else toast.error('Failed to update status');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to update status'); }
    finally { setLoading(false); }
  };

  const filteredEmployees = employees.filter(e => {
    const q = searchTerm.toLowerCase();
    return (!searchTerm || e.employeeName?.toLowerCase().includes(q) || e.emailAddress?.toLowerCase().includes(q) || e.mobileNo?.includes(q) || e.employeeCode?.toLowerCase().includes(q))
      && (!statusFilter || e.statusName === statusFilter)
      && (!activeFilter || (activeFilter === 'active' ? e.isActive === 1 : e.isActive === 0));
  });

  const uniqueStatuses = [...new Set(employees.map(e => e.statusName).filter(Boolean))];
  const { currentPage, totalPages, currentRecords, handlePageChange } = usePagination(filteredEmployees, 10);

  return (
    <div>
      <PageHeader
        title="Employee List"
        subtitle={`${employees.length} total employees`}
        actions={<Btn onClick={() => navigate('/admin/employee-management/add-employee')}><Plus size={15} /> Add Employee</Btn>}
      />

      <Card noPad>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
          <FilterBar>
            <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search name, email, mobile, code..." style={{ flex: 1, minWidth: '260px' }} />
            <SelectInput value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </SelectInput>
            <SelectInput value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
              <option value="">All Employees</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </SelectInput>
          </FilterBar>
        </div>

        <DataTable headers={['Employee ID', 'Name', 'Department', 'Role', 'Mobile', 'Status', 'Active', 'Actions']} loading={loading} empty={filteredEmployees.length === 0}>
          {currentRecords.map(emp => (
            <Tr key={emp.empId}>
              <Td><span style={{ fontFamily: 'monospace', fontSize: T.fontSm, color: T.textMuted }}>{emp.employeeCode}</span></Td>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                    {emp.employeeName?.substring(0, 2).toUpperCase() || 'EM'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: T.fontMd, color: T.text }}>{emp.employeeName || 'N/A'}</div>
                    <div style={{ fontSize: T.fontSm, color: T.textMuted }}>{emp.emailAddress}</div>
                  </div>
                </div>
              </Td>
              <Td><Badge variant="info">{emp.departmentName || 'N/A'}</Badge></Td>
              <Td style={{ color: T.textMuted }}>{emp.roleName || 'N/A'}</Td>
              <Td style={{ color: T.textMuted }}>+91 {emp.mobileNo || 'N/A'}</Td>
              <Td><Badge variant={getStatusVariant(emp.statusName)}>{emp.statusName || 'N/A'}</Badge></Td>
              <Td>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: T.fontBase, fontWeight: 600, color: emp.isActive === 1 ? T.success : T.danger }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: emp.isActive === 1 ? T.success : T.danger }} />
                  {emp.isActive === 1 ? 'Active' : 'Inactive'}
                </span>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '2px' }}>
                  <IconBtn onClick={() => handleEditEmployee(emp)} title="Edit" hoverColor={T.primary}><Edit size={15} /></IconBtn>
                  <IconBtn onClick={() => { setSelectedEmployee(emp); setShowConfirmPopup(true); }} title={emp.isActive === 1 ? 'Deactivate' : 'Activate'} color={emp.isActive === 1 ? T.danger : T.success} hoverColor={emp.isActive === 1 ? T.danger : T.success}>
                    {emp.isActive === 1 ? <PowerOff size={15} /> : <Power size={15} />}
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
      <Modal open={showUpdatePopup} onClose={() => setShowUpdatePopup(false)} title="Update Employee" width="680px">
        <form onSubmit={handleUpdateEmployee}>
          <FormGrid>
            <FormField label="Full Name"><InputField name="fullName" value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} required /></FormField>
            <FormField label="Email ID"><InputField value={editingEmployee?.emailAddress} disabled style={{ backgroundColor: T.bg, color: T.textMuted }} /></FormField>
            <FormField label="Mobile"><InputField name="mobile" value={formData.mobile} onChange={e => setFormData(p => ({ ...p, mobile: e.target.value }))} required /></FormField>
            <FormField label="Employee Code"><InputField value={editingEmployee?.employeeCode} disabled style={{ backgroundColor: T.bg, color: T.textMuted }} /></FormField>
            <FormField label="Department">
              <SelectField name="department" value={formData.department} onChange={e => setFormData(p => ({ ...p, department: e.target.value }))}>
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.statusId} value={d.statusValue}>{d.statusValue}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Role Type">
              <SelectField name="roleType" value={formData.roleType} onChange={e => setFormData(p => ({ ...p, roleType: e.target.value }))}>
                <option value="">Select Role</option>
                {roles.map(r => <option key={r.roleId} value={r.roleName}>{r.roleName}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Status">
              <SelectField name="statusType" value={formData.statusType} onChange={e => setFormData(p => ({ ...p, statusType: e.target.value }))}>
                <option value="">Select Status</option>
                {statusTypes.map(s => <option key={s.statusId} value={s.statusValue}>{s.statusValue}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Joining Date"><InputField type="date" name="joiningDate" value={formData.joiningDate} onChange={e => setFormData(p => ({ ...p, joiningDate: e.target.value }))} /></FormField>
            <FormField label="Shift"><InputField name="shift" value={formData.shift} onChange={e => setFormData(p => ({ ...p, shift: e.target.value }))} placeholder="e.g. Morning" /></FormField>
          </FormGrid>

          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: T.bg, borderRadius: T.radius, border: `1px solid ${T.borderLight}` }}>
            <p style={{ margin: '0 0 12px', fontSize: T.fontBase, fontWeight: 700, color: T.text }}>Permissions</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {PERMS.map(p => (
                <Toggle key={p.key} checked={permissions[p.key]} onChange={() => setPermissions(prev => ({ ...prev, [p.key]: !prev[p.key] }))} label={p.label} />
              ))}
            </div>
          </div>

          <ModalActions>
            <GhostBtn type="button" onClick={() => setShowUpdatePopup(false)}>Cancel</GhostBtn>
            <Btn type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Employee'}</Btn>
          </ModalActions>
        </form>
      </Modal>

      <ConfirmDialog
        open={showConfirmPopup}
        onClose={() => { setShowConfirmPopup(false); setSelectedEmployee(null); }}
        onConfirm={confirmToggleStatus}
        title={selectedEmployee?.isActive === 1 ? 'Deactivate Employee' : 'Activate Employee'}
        message={`Are you sure you want to ${selectedEmployee?.isActive === 1 ? 'deactivate' : 'activate'} ${selectedEmployee?.employeeName}?`}
        confirmLabel={selectedEmployee?.isActive === 1 ? 'Deactivate' : 'Activate'}
        confirmColor={selectedEmployee?.isActive === 1 ? T.danger : T.success}
        loading={loading}
      />
    </div>
  );
};

export default EmployeesList;
