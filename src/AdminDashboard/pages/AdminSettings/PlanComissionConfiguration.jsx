import { useState, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';
import planService from '../../../services/planService';
import lookupService from '../../../services/lookupService';
import paymentService from '../../../services/paymentService';
import { T, PageHeader, Card, Btn, GhostBtn, SectionLabel, FormField, SelectField, IconBtn } from '../../components/AdminUI';

const PlanCommissionConfiguration = () => {
  const [plans, setPlans] = useState([]);
  const [roles, setRoles] = useState([]);
  const [gateways, setGateways] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('');
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    Promise.all([planService.getPlans(), lookupService.getUserRoles(), paymentService.getGateways()]).then(([p, r, g]) => {
      if (p.status === 1) setPlans(p.result || []);
      if (r.status === 1) setRoles(r.result || []);
      if (g.status === 1) setGateways(g.result || []);
    }).catch(() => toast.error('Failed to load data'));
  }, []);

  const handleSelect = async () => {
    if (!selectedPlan || !selectedRole || !selectedGateway) { toast.error('Select Plan, Role, and Gateway'); return; }
    try {
      setLoading(true);
      const res = await planService.getPlanRoleGatewayCommissions({ planId: parseInt(selectedPlan), roleId: parseInt(selectedRole), gatewayId: parseInt(selectedGateway) });
      if (res.status === 1 && res.result) {
        setCommissions(res.result.map(item => ({ ...item, tempCommission: item.planCommission || '' })));
        toast.success('Commission data loaded');
      } else toast.error(res.message || 'Failed to fetch commissions');
    } catch (e) { toast.error(e.message || 'Failed to fetch commissions'); }
    finally { setLoading(false); }
  };

  const handleCommissionChange = (index, value) => {
    const updated = [...commissions];
    updated[index].tempCommission = value;
    setCommissions(updated);
  };

  const handleSaveEdit = async (index) => {
    const item = commissions[index];
    if (!item.tempCommission || parseFloat(item.tempCommission) <= 0) { toast.error('Enter a valid commission rate'); return; }
    try {
      setLoading(true);
      const res = await planService.managePlanGatewayRoleCommission([{ planCommissionsId: item.planCommissionsId, planConfigId: item.planConfigId, methodId: item.methodId || 0, methodOptionId: item.methodOptionId || 0, planCommission: parseFloat(item.tempCommission), isActive: true }]);
      if (res.status === 1) { toast.success('Commission updated!'); setEditingId(null); handleSelect(); }
      else toast.error(res.message || 'Failed to update');
    } catch (e) { toast.error(e.message || 'Failed to update'); }
    finally { setLoading(false); }
  };

  const handleSubmitNew = async () => {
    const newOnes = commissions.filter(c => !c.planCommissionsId);
    if (newOnes.length === 0) { toast.error('No new commissions to submit'); return; }
    if (newOnes.some(c => !c.tempCommission || parseFloat(c.tempCommission) <= 0)) { toast.error('Enter valid commission rates for all records'); return; }
    try {
      setLoading(true);
      const res = await planService.managePlanGatewayRoleCommission(newOnes.map(item => ({ planCommissionsId: 0, planConfigId: item.planConfigId, methodId: item.methodId || 0, methodOptionId: item.methodOptionId || 0, planCommission: parseFloat(item.tempCommission), isActive: true })));
      if (res.status === 1) { toast.success('Commissions submitted!'); handleSelect(); }
      else toast.error(res.message || 'Failed to submit');
    } catch (e) { toast.error(e.message || 'Failed to submit'); }
    finally { setLoading(false); }
  };

  const hasNew = commissions.some(c => !c.planCommissionsId);

  return (
    <div>
      <PageHeader title="Plan Commission Configuration" subtitle="Configure commission rates for plan, role, and gateway combinations" />

      {/* Selection Card */}
      <Card style={{ marginBottom: '20px' }}>
        <SectionLabel>Select Combination</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <FormField label="Select Plan">
            <SelectField value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)}>
              <option value="">Choose Plan</option>
              {plans.map(p => <option key={p.planId} value={p.planId}>{p.planName}</option>)}
            </SelectField>
          </FormField>
          <FormField label="Select Role">
            <SelectField value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
              <option value="">Choose Role</option>
              {roles.map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
            </SelectField>
          </FormField>
          <FormField label="Select Gateway">
            <SelectField value={selectedGateway} onChange={e => setSelectedGateway(e.target.value)}>
              <option value="">Choose Gateway</option>
              {gateways.map(g => <option key={g.gatewayId} value={g.gatewayId}>{g.gatewayName}</option>)}
            </SelectField>
          </FormField>
          <Btn onClick={handleSelect} disabled={loading || !selectedPlan || !selectedRole || !selectedGateway} style={{ alignSelf: 'flex-end' }}>
            {loading ? 'Loading...' : 'Load Data'}
          </Btn>
        </div>
      </Card>

      {/* Commission Table */}
      {commissions.length > 0 && (
        <Card noPad>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Commission Rates</h3>
            {hasNew && <Btn onClick={handleSubmitNew} disabled={loading}>{loading ? 'Submitting...' : 'Submit New Commissions'}</Btn>}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  {['Plan', 'Role', 'Gateway', 'Method', 'Option', 'Commission Rate (%)', 'Action'].map(h => (
                    <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: T.textMuted, borderBottom: `1px solid ${T.border}`, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commissions.map((item, index) => (
                  <tr key={index} style={{ borderBottom: `1px solid ${T.borderLight}` }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafbff'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '13px 18px', fontWeight: 600, color: T.text }}>{item.planName}</td>
                    <td style={{ padding: '13px 18px', color: T.textMuted }}>{item.roleName}</td>
                    <td style={{ padding: '13px 18px', color: T.textMuted }}>{item.gatewayName}</td>
                    <td style={{ padding: '13px 18px', color: T.textMuted }}>{item.methodName || 'N/A'}</td>
                    <td style={{ padding: '13px 18px', color: T.textMuted }}>{item.optionName || 'N/A'}</td>
                    <td style={{ padding: '13px 18px' }}>
                      <input type="number" step="0.01" min="0" value={item.tempCommission} onChange={e => handleCommissionChange(index, e.target.value)}
                        disabled={item.planCommissionsId && editingId !== index}
                        placeholder="0.00"
                        style={{ padding: '7px 10px', border: `1px solid ${T.border}`, borderRadius: T.radiusSm, fontSize: T.fontMd, width: '100px', outline: 'none', backgroundColor: (item.planCommissionsId && editingId !== index) ? T.bg : 'white' }}
                        onFocus={e => e.target.style.borderColor = T.primary}
                        onBlur={e => e.target.style.borderColor = T.border}
                      />
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      {item.planCommissionsId ? (
                        editingId === index ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <IconBtn onClick={() => handleSaveEdit(index)} title="Save" hoverColor={T.success} color={T.success}><Save size={15} /></IconBtn>
                            <IconBtn onClick={() => { const u = [...commissions]; u[index].tempCommission = u[index].planCommission; setCommissions(u); setEditingId(null); }} title="Cancel" hoverColor={T.danger}><X size={15} /></IconBtn>
                          </div>
                        ) : (
                          <IconBtn onClick={() => setEditingId(index)} title="Edit" hoverColor={T.primary}><Edit2 size={15} /></IconBtn>
                        )
                      ) : (
                        <span style={{ fontSize: T.fontBase, color: T.warning, fontWeight: 600, padding: '3px 8px', backgroundColor: T.warningLight, borderRadius: '999px' }}>New</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {commissions.length === 0 && selectedPlan && selectedRole && selectedGateway && !loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: T.textMuted }}>
            <p style={{ margin: 0, fontSize: T.fontLg }}>No commission data found for the selected combination.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PlanCommissionConfiguration;
