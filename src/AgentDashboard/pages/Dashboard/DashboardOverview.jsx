import Icon10 from '../../../assets/AgentDashboard/Dashboard/Icon10.png';
import Icon7  from '../../../assets/AgentDashboard/Dashboard/Icon7.png';
import Icon8  from '../../../assets/AgentDashboard/Dashboard/Icon8.png';
import Icon9  from '../../../assets/AgentDashboard/Dashboard/Icon9.png';
import LineImg from '../../../assets/AgentDashboard/Dashboard/Line.png';
import MapImg  from '../../../assets/AgentDashboard/Dashboard/Map.png';

const G  = '#32a862';
const GL = '#e6f7ed';
const P  = '#EC5B13';
const PL = '#FEF0E9';

const DashboardOverview = ({ data }) => {
  const deliveries = data ? data.liveDeliveries.map((d, i) => ({
    id: i + 1,
    orderId: d.orderId,
    status: d.status,
    statusColor: d.status === 'PENDING' ? '#d97706' : G,
    statusBg:    d.status === 'PENDING' ? '#fef9ec' : GL,
    location: d.location,
    time: new Date(d.pickupTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
  })) : [];

  const paymentCards = data ? [
    { title: 'Customer Payment', amount: data.finance.customerPayment.amount.toLocaleString('en-IN'), status: data.finance.customerPayment.status, accent: G,         bg: GL        },
    { title: 'Agent Margin',     amount: parseFloat(data.finance.agentMargin.amount).toLocaleString('en-IN'), status: data.finance.agentMargin.status, accent: '#6b7280', bg: '#f9fafb' },
    { title: 'Farmer Payout',    amount: data.finance.farmerPayout.amount.toLocaleString('en-IN'), status: data.finance.farmerPayout.status, accent: '#d97706', bg: '#fef9ec' },
  ] : [];

  const flowSteps = [
    { icon: Icon7, bg: '#e0e7ff', border: '2px solid #4f46e5', text: 'Customer Pays' },
    { icon: Icon8, bg: '#1f2937', border: '2px solid #1f2937', text: 'Platform Security' },
  ];
  const flowCards = [
    { icon: Icon9,  bg: GL,       border: `1px solid ${G}`,    text: 'Farmer Credit' },
    { icon: Icon10, bg: '#f9fafb', border: '1px solid #e5e7eb', text: 'Agent Margin'  },
  ];

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>

        {/* Live Deliveries */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '22px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Live Deliveries</h3>
            <span style={{ fontSize: '11px', color: G, fontWeight: 600, cursor: 'pointer' }}>View all →</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {deliveries.length > 0 ? deliveries.map(d => (
              <div key={d.id} style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '12px 14px', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151', fontFamily: 'monospace' }}>{d.orderId}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: d.statusColor, backgroundColor: d.statusBg, padding: '2px 10px', borderRadius: '999px' }}>{d.status}</span>
                </div>
                <div style={{ height: '4px', borderRadius: '4px', backgroundColor: '#e5e7eb', marginBottom: '8px', overflow: 'hidden' }}>
                  <div style={{ width: d.status === 'PENDING' ? '40%' : '80%', height: '100%', backgroundColor: d.statusColor, borderRadius: '4px', transition: 'width 0.4s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>{d.location}</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{d.time}</span>
                </div>
              </div>
            )) : (
              <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', padding: '24px 0' }}>No live deliveries</p>
            )}
          </div>

          <div style={{ marginTop: '16px', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={MapImg} alt="Map" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Payment Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
            {paymentCards.map((c, i) => (
              <div key={i} style={{
                backgroundColor: '#fff', borderRadius: '14px', padding: '18px',
                border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${c.accent}20`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${c.accent}, ${c.accent}66)`, borderRadius: '14px 14px 0 0' }} />
                <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{c.title}</p>
                <p style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.02em' }}>₹{c.amount}</p>
                <span style={{ fontSize: '11px', fontWeight: 700, color: c.accent, backgroundColor: c.bg, padding: '3px 10px', borderRadius: '999px', border: `1px solid ${c.accent}33` }}>{c.status}</span>
              </div>
            ))}
          </div>

          {/* Payment Flow */}
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Payment Flow</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {flowSteps.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: step.bg, border: step.border, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={step.icon} alt={step.text} style={{ width: '28px', height: '28px' }} />
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151', textAlign: 'center' }}>{step.text}</p>
                  </div>
                  <img src={LineImg} alt="→" style={{ height: '16px', width: '48px', opacity: 0.5 }} />
                </div>
              ))}
              {flowCards.map((card, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ backgroundColor: card.bg, border: card.border, borderRadius: '12px', padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <img src={card.icon} alt={card.text} style={{ width: '28px', height: '28px' }} />
                      <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151' }}>{card.text}</p>
                    </div>
                  </div>
                  {i < flowCards.length - 1 && <img src={LineImg} alt="→" style={{ height: '16px', width: '48px', opacity: 0.5 }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
