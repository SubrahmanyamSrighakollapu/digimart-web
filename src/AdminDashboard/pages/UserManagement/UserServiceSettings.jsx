import { useState } from 'react';
import { T, PageHeader, Card, Badge, Toggle } from '../../components/AdminUI';

const UserServiceSettings = () => {
  const [services, setServices] = useState([
    { name: 'Crop Listing', description: 'Add, edit, and manage crop products', enabled: true },
    { name: 'Seed & Fertilizer Order', description: 'Order seeds, fertilizers, and pesticides', enabled: false },
    { name: 'Equipment Rental', description: 'Rent tractors and farming equipment', enabled: true },
    { name: 'Soil Testing', description: 'Request soil quality testing service', enabled: false },
    { name: 'Payout / Settlement', description: 'Receive payments for crop sales', enabled: false },
  ]);

  const toggle = (i) => setServices(p => p.map((s, idx) => idx === i ? { ...s, enabled: !s.enabled } : s));

  return (
    <div>
      <PageHeader title="User Service Settings" subtitle="Enable or disable services for users" />

      <Card noPad style={{ maxWidth: '900px' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Service Control</h3>
          <p style={{ margin: '4px 0 0', fontSize: T.fontBase, color: T.textMuted }}>Toggle services on or off for the selected user</p>
        </div>

        {services.map((service, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 24px', borderBottom: i < services.length - 1 ? `1px solid ${T.borderLight}` : 'none',
            transition: 'background 0.15s'
          }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafbff'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3px' }}>
                <span style={{ fontWeight: 600, fontSize: T.fontMd, color: T.text }}>{service.name}</span>
                <Badge variant={service.enabled ? 'success' : 'neutral'}>{service.enabled ? 'Enabled' : 'Disabled'}</Badge>
              </div>
              <p style={{ margin: 0, fontSize: T.fontBase, color: T.textMuted }}>{service.description}</p>
            </div>
            <Toggle checked={service.enabled} onChange={() => toggle(i)} />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default UserServiceSettings;
