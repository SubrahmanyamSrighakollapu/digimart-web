import { useState, useEffect } from 'react';
import { Trash2, AlignLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { T, PageHeader, Card, Btn, GhostBtn, SectionLabel, FormField, TextareaField, DataTable, Td, Tr, IconBtn, ConfirmDialog } from '../../components/AdminUI';

const ScrollTextManager = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/getscrollmessages`, { alertsId: 0, isActive: true }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1) setMessages(res.data.result || []);
    } catch {}
  };

  const handleSave = async () => {
    if (!message.trim()) { toast.error('Please enter a message'); return; }
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/managescrollmessage`, { AlertsId: 0, AlertMessage: message, IsActive: true }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1) { toast.success('Scroll message saved!'); setMessage(''); fetchMessages(); }
      else toast.error(res.data.message || 'Failed to save message');
    } catch { toast.error('Error saving message'); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/lookup/deletescrollmessage/${deleteConfirm.id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.status === 1) { toast.success('Message deleted!'); fetchMessages(); }
    } catch { toast.error('Error deleting message'); }
    finally { setDeleteConfirm({ show: false, id: null }); }
  };

  return (
    <div>
      <PageHeader title="Scroll Text Manager" subtitle="Manage scrolling messages displayed across your platform" />

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Create Form */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlignLeft size={16} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: T.fontMd, fontWeight: 700, color: T.text }}>Create Message</p>
              <p style={{ margin: 0, fontSize: T.fontSm, color: T.textMuted }}>Add a new scroll message</p>
            </div>
          </div>
          <FormField label="Scrolling Message">
            <TextareaField value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter the scrolling message here..." style={{ minHeight: '100px' }} />
          </FormField>
          <p style={{ margin: '6px 0 16px', fontSize: T.fontSm, color: T.textMuted }}>Keep messages clear and concise. Avoid special characters that may affect display.</p>
          <div style={{ padding: '12px 14px', background: '#fff7ed', borderRadius: T.radius, border: '1px solid #fed7aa', marginBottom: '16px' }}>
            <p style={{ margin: 0, fontSize: T.fontBase, color: '#c2410c', lineHeight: 1.6 }}>
              <strong>Important:</strong> Scroll messages are visible to all users and should contain important announcements or updates.
            </p>
          </div>
          <Btn onClick={handleSave} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Saving...' : 'Save Text'}
          </Btn>
        </Card>

        {/* Archive Table */}
        <Card noPad>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}` }}>
            <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Message Archive</h3>
            <p style={{ margin: '3px 0 0', fontSize: T.fontBase, color: T.textMuted }}>{messages.length} active messages</p>
          </div>
          <DataTable headers={['Message', 'Action']} loading={false} empty={messages.length === 0}>
            {messages.map(msg => (
              <Tr key={msg.alertsId}>
                <Td style={{ maxWidth: '500px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: T.primary, marginTop: '6px', flexShrink: 0 }} />
                    <span style={{ fontSize: T.fontMd, color: T.text, lineHeight: 1.5 }}>{msg.alertMessage}</span>
                  </div>
                </Td>
                <Td style={{ width: '60px' }}>
                  <IconBtn onClick={() => setDeleteConfirm({ show: true, id: msg.alertsId })} title="Delete" hoverColor={T.danger}><Trash2 size={15} /></IconBtn>
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
        title="Delete Message"
        message="Are you sure you want to delete this scroll message?"
        confirmLabel="Delete"
        confirmColor={T.danger}
      />
    </div>
  );
};

export default ScrollTextManager;
