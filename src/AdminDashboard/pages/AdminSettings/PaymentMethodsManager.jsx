import { useState, useEffect } from 'react';
import { Edit, Trash2, CreditCard, Layers } from 'lucide-react';
import { toast } from 'react-toastify';
import paymentService from '../../../services/paymentService';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../../components/Pagination/Pagination';
import {
  T, PageHeader, Card, Btn, GhostBtn, SectionLabel,
  DataTable, Td, Tr, Modal, ConfirmDialog,
  FormField, InputField, SelectField, ModalActions, IconBtn
} from '../../components/AdminUI';

const PaymentMethodsManager = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [methodForm, setMethodForm] = useState({ methodName: '', methodCode: '' });
  const [optionForm, setOptionForm] = useState({ methodId: '', optionName: '', optionCode: '' });
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editingMethod, setEditingMethod] = useState(null);
  const [editingOption, setEditingOption] = useState(null);

  useEffect(() => { fetchPaymentMethods(); fetchPaymentOptions(); }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getPaymentMethods();
      if (res.status === 1) setPaymentMethods(res.result || []);
    } catch { toast.error('Failed to fetch payment methods'); }
    finally { setLoading(false); }
  };

  const fetchPaymentOptions = async () => {
    try {
      const res = await paymentService.getPaymentMethodOptions();
      if (res.status === 1) setPaymentOptions(res.result || []);
    } catch { toast.error('Failed to fetch payment options'); }
  };

  const handleMethodSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await paymentService.managePaymentMethod({ methodId: editingMethod?.methodId || 0, methodName: methodForm.methodName, methodCode: methodForm.methodCode, iaActive: true });
      if (res.status === 1) { toast.success(editingMethod ? 'Method updated!' : 'Method added!'); setMethodForm({ methodName: '', methodCode: '' }); setShowMethodModal(false); setEditingMethod(null); fetchPaymentMethods(); }
      else toast.error('Failed to save method');
    } catch { toast.error('Failed to save method'); }
    finally { setLoading(false); }
  };

  const handleOptionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await paymentService.managePaymentMethodOption({ methodOptionId: editingOption?.methodOptionId || 0, methodId: parseInt(optionForm.methodId), optionName: optionForm.optionName, optionCode: optionForm.optionCode, isActive: true });
      if (res.status === 1) { toast.success(editingOption ? 'Option updated!' : 'Option added!'); setOptionForm({ methodId: '', optionName: '', optionCode: '' }); setShowOptionModal(false); setEditingOption(null); fetchPaymentOptions(); }
      else toast.error('Failed to save option');
    } catch { toast.error('Failed to save option'); }
    finally { setLoading(false); }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const res = deleteItem.type === 'method'
        ? await paymentService.deletePaymentMethod(deleteItem.id)
        : await paymentService.deletePaymentMethodOption(deleteItem.id);
      if (res.status === 1) { toast.success('Deleted!'); deleteItem.type === 'method' ? fetchPaymentMethods() : fetchPaymentOptions(); }
      else toast.error('Failed to delete');
    } catch { toast.error('Failed to delete'); }
    finally { setLoading(false); setShowDeleteConfirm(false); setDeleteItem(null); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const { currentPage: mp, totalPages: mtp, currentRecords: cm, handlePageChange: hmp } = usePagination(paymentMethods, 6);
  const { currentPage: op, totalPages: otp, currentRecords: co, handlePageChange: hop } = usePagination(paymentOptions, 6);

  return (
    <div>
      <PageHeader title="Payment Methods Manager" subtitle="Configure payment methods and options for seamless transactions" />

      {/* Add Forms */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={16} color="white" />
            </div>
            <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Add Payment Method</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FormField label="Method Name"><InputField value={methodForm.methodName} onChange={e => setMethodForm(p => ({ ...p, methodName: e.target.value }))} placeholder="e.g. UPI, Credit Card" /></FormField>
            <FormField label="Method Code">
              <InputField value={methodForm.methodCode} onChange={e => setMethodForm(p => ({ ...p, methodCode: e.target.value }))} placeholder="e.g. UPI, CC" />
              <p style={{ margin: '4px 0 0', fontSize: T.fontSm, color: T.textMuted }}>Unique code for this payment method</p>
            </FormField>
            <Btn onClick={() => handleMethodSubmit({ preventDefault: () => {} })} disabled={loading || !methodForm.methodName || !methodForm.methodCode} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Adding...' : 'Add Method'}
            </Btn>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={16} color="white" />
            </div>
            <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Add Payment Option</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FormField label="Payment Method">
              <SelectField value={optionForm.methodId} onChange={e => setOptionForm(p => ({ ...p, methodId: e.target.value }))}>
                <option value="">Select Payment Method</option>
                {paymentMethods.map(m => <option key={m.methodId} value={m.methodId}>{m.methodName}</option>)}
              </SelectField>
            </FormField>
            <FormField label="Option Name"><InputField value={optionForm.optionName} onChange={e => setOptionForm(p => ({ ...p, optionName: e.target.value }))} placeholder="e.g. Google Pay" /></FormField>
            <FormField label="Option Code">
              <InputField value={optionForm.optionCode} onChange={e => setOptionForm(p => ({ ...p, optionCode: e.target.value }))} placeholder="e.g. GPAY" />
              <p style={{ margin: '4px 0 0', fontSize: T.fontSm, color: T.textMuted }}>Unique code for this option</p>
            </FormField>
            <Btn color={T.success} onClick={() => handleOptionSubmit({ preventDefault: () => {} })} disabled={loading || !optionForm.methodId || !optionForm.optionName || !optionForm.optionCode} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Adding...' : 'Add Option'}
            </Btn>
          </div>
        </Card>
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card noPad>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
            <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Payment Methods</h3>
          </div>
          <DataTable headers={['Method', 'Code', 'Created', 'Action']} loading={loading} empty={paymentMethods.length === 0}>
            {cm.map(m => (
              <Tr key={m.methodId}>
                <Td style={{ fontWeight: 600 }}>{m.methodName}</Td>
                <Td><span style={{ fontFamily: 'monospace', fontSize: T.fontSm, color: T.textMuted, backgroundColor: T.bg, padding: '2px 6px', borderRadius: '4px' }}>{m.methodCode}</span></Td>
                <Td style={{ color: T.textMuted }}>{formatDate(m.createdAt)}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    <IconBtn onClick={() => { setEditingMethod(m); setMethodForm({ methodName: m.methodName, methodCode: m.methodCode }); setShowMethodModal(true); }} title="Edit" hoverColor={T.primary}><Edit size={14} /></IconBtn>
                    <IconBtn onClick={() => { setDeleteItem({ type: 'method', id: m.methodId, name: m.methodName }); setShowDeleteConfirm(true); }} title="Delete" hoverColor={T.danger}><Trash2 size={14} /></IconBtn>
                  </div>
                </Td>
              </Tr>
            ))}
          </DataTable>
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${T.borderLight}` }}>
            <Pagination currentPage={mp} totalPages={mtp} onPageChange={hmp} />
          </div>
        </Card>

        <Card noPad>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
            <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Payment Options</h3>
          </div>
          <DataTable headers={['Method', 'Option', 'Created', 'Action']} loading={loading} empty={paymentOptions.length === 0}>
            {co.map(opt => {
              const method = paymentMethods.find(m => m.methodId === opt.methodId);
              return (
                <Tr key={opt.methodOptionId}>
                  <Td style={{ color: T.textMuted }}>{method?.methodName || 'N/A'}</Td>
                  <Td style={{ fontWeight: 600 }}>{opt.optionName}</Td>
                  <Td style={{ color: T.textMuted }}>{formatDate(opt.createdAt)}</Td>
                  <Td>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <IconBtn onClick={() => { setEditingOption(opt); setOptionForm({ methodId: opt.methodId.toString(), optionName: opt.optionName, optionCode: opt.optionCode }); setShowOptionModal(true); }} title="Edit" hoverColor={T.primary}><Edit size={14} /></IconBtn>
                      <IconBtn onClick={() => { setDeleteItem({ type: 'option', id: opt.methodOptionId, name: opt.optionName }); setShowDeleteConfirm(true); }} title="Delete" hoverColor={T.danger}><Trash2 size={14} /></IconBtn>
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </DataTable>
          <div style={{ padding: '12px 20px', borderTop: `1px solid ${T.borderLight}` }}>
            <Pagination currentPage={op} totalPages={otp} onPageChange={hop} />
          </div>
        </Card>
      </div>

      {/* Method Modal */}
      <Modal open={showMethodModal} onClose={() => { setShowMethodModal(false); setEditingMethod(null); setMethodForm({ methodName: '', methodCode: '' }); }} title={editingMethod ? 'Edit Payment Method' : 'Add Payment Method'} width="440px">
        <form onSubmit={handleMethodSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField label="Method Name"><InputField value={methodForm.methodName} onChange={e => setMethodForm(p => ({ ...p, methodName: e.target.value }))} placeholder="Enter method name" required /></FormField>
          <FormField label="Method Code"><InputField value={methodForm.methodCode} onChange={e => setMethodForm(p => ({ ...p, methodCode: e.target.value }))} placeholder="Enter method code" disabled={!!editingMethod} required /></FormField>
          <ModalActions>
            <GhostBtn type="button" onClick={() => { setShowMethodModal(false); setEditingMethod(null); }}>Cancel</GhostBtn>
            <Btn type="submit" disabled={loading}>{loading ? 'Saving...' : editingMethod ? 'Update' : 'Save'}</Btn>
          </ModalActions>
        </form>
      </Modal>

      {/* Option Modal */}
      <Modal open={showOptionModal} onClose={() => { setShowOptionModal(false); setEditingOption(null); setOptionForm({ methodId: '', optionName: '', optionCode: '' }); }} title={editingOption ? 'Edit Payment Option' : 'Add Payment Option'} width="440px">
        <form onSubmit={handleOptionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField label="Payment Method">
            <SelectField value={optionForm.methodId} onChange={e => setOptionForm(p => ({ ...p, methodId: e.target.value }))} required>
              <option value="">Select Method</option>
              {paymentMethods.map(m => <option key={m.methodId} value={m.methodId}>{m.methodName}</option>)}
            </SelectField>
          </FormField>
          <FormField label="Option Name"><InputField value={optionForm.optionName} onChange={e => setOptionForm(p => ({ ...p, optionName: e.target.value }))} placeholder="Enter option name" required /></FormField>
          <FormField label="Option Code"><InputField value={optionForm.optionCode} onChange={e => setOptionForm(p => ({ ...p, optionCode: e.target.value }))} placeholder="Enter option code" disabled={!!editingOption} required /></FormField>
          <ModalActions>
            <GhostBtn type="button" onClick={() => { setShowOptionModal(false); setEditingOption(null); }}>Cancel</GhostBtn>
            <Btn type="submit" disabled={loading}>{loading ? 'Saving...' : editingOption ? 'Update' : 'Save'}</Btn>
          </ModalActions>
        </form>
      </Modal>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setDeleteItem(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor={T.danger}
        loading={loading}
      />
    </div>
  );
};

export default PaymentMethodsManager;
