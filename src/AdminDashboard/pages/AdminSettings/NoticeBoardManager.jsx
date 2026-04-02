import { useState, useEffect } from 'react';
import { Trash2, Megaphone } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { T, PageHeader, Card, Btn, FormField, TextareaField, DataTable, Td, Tr, IconBtn, ConfirmDialog } from '../../components/AdminUI';

const NoticeBoardManager = () => {
  const [message, setMessage] = useState('');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/getnoticemessages`, { alertsId: 0, isActive: true }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1) setNotices(res.data.result || []);
    } catch {}
  };

  const handleSave = async () => {
    if (!message.trim()) { toast.error('Please enter a notice message'); return; }
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/managenoticemessage`, { AlertsId: 0, AlertMessage: message, IsActive: true }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1) { toast.success('Notice saved!'); setMessage(''); fetchNotices(); }
      else toast.error(res.data.message || 'Failed to save notice');
    } catch { toast.error('Error saving notice'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/deletenoticemessage/${deleteConfirm.id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1) { toast.success('Notice deleted!'); fetchNotices(); }
    } catch { toast.error('Error deleting notice'); }
    finally { setDeleteConfirm({ show: false, id: null }); }
  };

  return (
    <div>
      <PageHeader title="Noticeboard Manager" subtitle="Post important notices and announcements for your users" />

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Create Form */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={16} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Create Notice</p>
              <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Post a new announcement</p>
            </div>
          </div>
          <FormField label="Notice Content">
            <TextareaField value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter the notice message here..." style={{ minHeight: '120px' }} />
          </FormField>
          <p style={{ margin: '6px 0 16px', fontSize: T.fontSm, color: T.textMuted }}>Notices appear prominently on the dashboard and notification center.</p>
          <div style={{ padding: '12px 14px', background: '#fff7ed', borderRadius: T.radius, border: '1px solid #fed7aa', marginBottom: '16px' }}>
            <p style={{ margin: 0, fontSize: T.fontBase, color: '#c2410c', lineHeight: 1.6 }}>
              <strong>Important:</strong> Notices are visible to all users and should contain important announcements or updates.
            </p>
          </div>
          <Btn onClick={handleSave} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Saving...' : 'Save Notice'}
          </Btn>
        </Card>

        {/* Archive Table */}
        <Card noPad>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
            <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Notices Archive</h3>
            <p style={{ margin: '3px 0 0', fontSize: T.fontBase, color: T.textMuted }}>{notices.length} active notices</p>
          </div>
          <DataTable headers={['Notice', 'Action']} loading={false} empty={notices.length === 0}>
            {notices.map(notice => (
              <Tr key={notice.alertsId}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: T.warning, marginTop: '6px', flexShrink: 0 }} />
                    <span style={{ fontSize: T.fontMd, color: T.text, lineHeight: 1.5 }}>{notice.alertMessage}</span>
                  </div>
                </Td>
                <Td style={{ width: '60px' }}>
                  <IconBtn onClick={() => setDeleteConfirm({ show: true, id: notice.alertsId })} title="Delete" hoverColor={T.danger}><Trash2 size={15} /></IconBtn>
                </Td>
              </Tr>
            ))}
          </DataTable>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Notice"
        message="Are you sure you want to delete this notice?"
        confirmLabel="Delete"
        confirmColor={T.danger}
      />
    </div>
  );
};

export default NoticeBoardManager;
