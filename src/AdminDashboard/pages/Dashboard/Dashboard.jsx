import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Users, Leaf, TrendingUp, Clock,
  CreditCard, Wheat, UserCheck, ArrowUpRight,
  ArrowDownRight, UserPlus, Briefcase, CheckCircle,
  AlertTriangle, Zap, Activity
} from 'lucide-react';

const P   = '#EC5B13';
const PH  = '#D44E0E';
const PL  = '#FEF0E9';
const G   = '#32a862';
const GL  = '#e6f7ed';
const SEC = '#F7EEEA';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const getBase = () => {
    if (user.roleName === 'Super Distributor') return '/super-distributor';
    if (user.roleName === 'Master Distributor') return '/master-distributor';
    if (user.roleName === 'Distributor') return '/distributor';
    return '/admin';
  };
  const base = getBase();
  const isDistributor = ['Super Distributor', 'Master Distributor', 'Distributor'].includes(user.roleName);

  const overviewCards = [
    { label: 'Total Orders',      value: '2,345', sub: '+12% this month',  icon: ShoppingCart, bg: PL,        accent: P,        iconBg: '#fddccc' },
    { label: 'Active Agents',     value: '24',    sub: '+3 this week',      icon: UserCheck,    bg: '#fef9ec', accent: '#d97706', iconBg: '#fef3c7' },
    { label: 'Active Farmers',    value: '17',    sub: 'Active deliveries', icon: Leaf,         bg: GL,        accent: G,         iconBg: '#bbf7d0' },
    { label: 'Gross Trade Value', value: '₹80K',  sub: 'Pending release',   icon: TrendingUp,   bg: '#f3f0ff', accent: '#7c3aed', iconBg: '#ede9fe' },
    { label: 'Pending Payouts',   value: '₹80K',  sub: 'This month',        icon: Clock,        bg: '#e0f2fe', accent: '#0369a1', iconBg: '#bae6fd' },
  ];

  const financialCards = [
    { label: 'Customer Payments', value: '₹80,000', change: '+5% last month',  positive: true,  icon: CreditCard, accent: P,         iconBg: PL        },
    { label: 'Farmer Payouts',    value: '₹80,000', change: '+10% last month', positive: true,  icon: Wheat,      accent: '#7c3aed', iconBg: '#f5f3ff'  },
    { label: 'Agent Earnings',    value: '₹80,000', change: '-7% last month',  positive: false, icon: Users,      accent: G,         iconBg: GL         },
    { label: 'Platform Margin',   value: '₹80,000', change: '+5% last month',  positive: true,  icon: TrendingUp, accent: '#0369a1', iconBg: '#e0f2fe'  },
  ];

  const orderStatuses = [
    { label: 'Pending Assignment', count: 14, color: '#d97706', bg: '#fef3c7' },
    { label: 'In Procurement',     count: 23, color: P,         bg: PL        },
    { label: 'In Transit',         count: 36, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Delivered',          count: 89, color: G,         bg: GL        },
    { label: 'Disputes Raised',    count: 5,  color: '#dc2626', bg: '#fee2e2' },
  ];

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${P} 0%, #f07030 50%, ${G} 100%)`,
        borderRadius: '16px', padding: '28px 32px', marginBottom: '28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: `0 6px 24px rgba(236,91,19,0.2)`,
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '120px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30px', right: '20px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', filter: 'blur(30px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.8)' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live Dashboard</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            {greeting}, {user.roleName || 'Admin'} 👋
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
            {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
          {[
            { label: 'Add Agent',    onClick: () => navigate(`${base}/agent-management/add-agent`),  icon: UserPlus  },
            { label: 'Add User',     onClick: () => navigate(`${base}/user-management/create-user`), icon: UserPlus  },
            ...(!isDistributor ? [{ label: 'Add Employee', onClick: () => navigate(`${base}/create-employee`), icon: Briefcase }] : [])
          ].map(({ label, onClick, icon: Icon }) => (
            <button key={label} onClick={onClick} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 18px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',
              border: '1px solid rgba(255,255,255,0.35)', borderRadius: '10px', fontWeight: 700,
              fontSize: '13px', cursor: 'pointer', backdropFilter: 'blur(4px)',
              transition: 'background 0.15s, transform 0.15s'
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.32)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section Label ────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Activity size={14} color={G} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Platform Overview</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '16px', marginBottom: '28px' }}>
        {overviewCards.map((c, i) => (
          <div key={i} style={{
            backgroundColor: c.bg, borderRadius: '14px', padding: '20px 18px',
            border: `1px solid ${c.accent}22`,
            boxShadow: `0 2px 12px ${c.accent}18`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative', overflow: 'hidden'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${c.accent}28`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 2px 12px ${c.accent}18`; }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <c.icon size={18} color={c.accent} />
            </div>
            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{c.label}</p>
            <p style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.02em' }}>{c.value}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: c.accent, fontWeight: 600 }}>
              <ArrowUpRight size={12} />{c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Section Label ────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Zap size={14} color={P} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: P, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Revenue & Financial Flow</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
      </div>

      {/* ── Financial Cards ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
        {financialCards.map((c, i) => (
          <div key={i} style={{
            backgroundColor: '#ffffff', borderRadius: '14px', padding: '20px',
            border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 10px 28px ${c.accent}18`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${c.accent}, ${c.accent}66)`, borderRadius: '14px 14px 0 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <c.icon size={18} color={c.accent} />
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                padding: '3px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                backgroundColor: c.positive ? '#dcfce7' : '#fee2e2',
                color: c.positive ? '#15803d' : '#b91c1c'
              }}>
                {c.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {c.change.split(' ')[0]}
              </span>
            </div>
            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#78716c', fontWeight: 500 }}>{c.label}</p>
            <p style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.02em' }}>{c.value}</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#a8a29e' }}>{c.change}</p>
          </div>
        ))}
      </div>

      {/* ── Bottom 3-col ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>

        {/* Order Status */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Order Status</h3>
            <span style={{ fontSize: '11px', color: G, fontWeight: 600, cursor: 'pointer' }}>View all →</span>
          </div>
          {orderStatuses.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < orderStatuses.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#44403c' }}>{s.label}</span>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '28px', height: '22px', padding: '0 8px', borderRadius: '999px', backgroundColor: s.bg, color: s.color, fontSize: '12px', fontWeight: 700 }}>
                {s.count}
              </span>
            </div>
          ))}
        </div>

        {/* User Overview */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>User Overview</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Farmers',     value: '25', note: 'New registrations', bg: GL,        accent: G,         iconBg: '#bbf7d0' },
              { label: 'KYC Pending', value: '6',  note: 'Action required',   bg: '#fee2e2', accent: '#dc2626', iconBg: '#fca5a5' },
            ].map(box => (
              <div key={box.label} style={{ background: box.bg, borderRadius: '12px', padding: '16px', border: `1px solid ${box.accent}22` }}>
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: box.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{box.label}</p>
                <p style={{ margin: '0 0 2px', fontSize: '30px', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.02em' }}>{box.value}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>{box.note}</p>
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px', border: '1px solid #e5e7eb' }}>
            {[{ label: 'Active Agents', value: '87' }, { label: 'New Buyers', value: '21' }].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: i === 0 ? '0 0 8px' : '8px 0 0', borderBottom: i === 0 ? '1px solid #e5e7eb' : 'none' }}>
                <span style={{ fontSize: '12px', color: '#78716c' }}>{row.label}</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#1c1917' }}>{row.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
            <button onClick={() => navigate(`${base}/agent-kyc-verification`)} style={{
              flex: 1, padding: '10px', background: G,
              color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700,
              fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: `0 4px 12px ${G}40`
            }}>
              <CheckCircle size={13} /> Approve KYC
            </button>
            <button onClick={() => navigate(`${base}/user-management/users-list`)} style={{
              flex: 1, padding: '10px', backgroundColor: '#f9fafb',
              color: '#374151', border: '1px solid #e5e7eb', borderRadius: '10px', fontWeight: 700,
              fontSize: '12px', cursor: 'pointer'
            }}>
              View Users
            </button>
          </div>
        </div>

        {/* Critical Alerts */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={14} color="#dc2626" />
            </div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Critical Alerts</h3>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#dc2626', color: 'white', fontSize: '10px', fontWeight: 700 }}>3</span>
          </div>

          <div style={{ background: '#fee2e2', borderRadius: '12px', padding: '16px', marginBottom: '14px', border: '1px solid #fca5a5' }}>
            <p style={{ margin: '0 0 2px', fontSize: '11px', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>KYC PENDING</p>
            <p style={{ margin: '0 0 2px', fontSize: '36px', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.02em' }}>6</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>Immediate action required</p>
          </div>

          {[
            { title: 'Failed Payment',  sub: 'Farmer ID: #12345 — Payout failed',        btnLabel: 'Resolve',          btnColor: '#dc2626', btnBg: '#fee2e2' },
            { title: 'Quality Issue',   sub: 'Order #12345 flagged for moisture content', btnLabel: 'Assign Inspector', btnColor: '#d97706', btnBg: '#fef3c7' },
          ].map((alert, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: i === 0 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 700, color: '#1c1917' }}>{alert.title}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#78716c', lineHeight: 1.4 }}>{alert.sub}</p>
                </div>
                <button style={{ padding: '5px 12px', backgroundColor: alert.btnBg, color: alert.btnColor, border: `1px solid ${alert.btnColor}33`, borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {alert.btnLabel}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
