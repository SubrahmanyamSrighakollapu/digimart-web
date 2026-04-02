import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Truck, Leaf, TrendingUp, DollarSign,
  ArrowUpRight, AlertTriangle, CheckCircle, Clock,
  ShoppingBasket, ClipboardList, Activity, Zap
} from 'lucide-react';
import CustomerOrdersCards from './CustomerOrderCards';
import DashboardOverview from './DashboardOverview';
import NoticeBoardCard from '../../../components/AgentDashboard/NoticeBoardCard';

const G  = '#32a862';
const GL = '#e6f7ed';
const P  = '#EC5B13';
const PL = '#FEF0E9';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/getAgentDashboardDetails`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 1 && data.result) setDashboardData(data.result);
    } catch { toast.error('Failed to fetch dashboard data'); }
    finally { setLoading(false); }
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const agentDetails = JSON.parse(sessionStorage.getItem('agentDetails') || '{}');

  const statsCards = dashboardData ? [
    { label: 'New Orders',     value: dashboardData.stats.newOrders.count,   sub: dashboardData.stats.newOrders.label,     icon: ShoppingCart, bg: GL,        accent: G,         iconBg: '#bbf7d0' },
    { label: 'To Purchase',    value: dashboardData.stats.toPurchase.count,  sub: dashboardData.stats.toPurchase.label,    icon: ShoppingBasket, bg: '#fef9ec', accent: '#d97706', iconBg: '#fef3c7' },
    { label: 'In Transit',     value: dashboardData.stats.inTransit.count,   sub: dashboardData.stats.inTransit.label,     icon: Truck,        bg: '#eff6ff', accent: '#3b82f6', iconBg: '#dbeafe' },
    { label: 'Farmer Payout',  value: `₹${parseFloat(dashboardData.stats.farmerPayout.amount).toLocaleString('en-IN')}`, sub: dashboardData.stats.farmerPayout.label, icon: Leaf, bg: '#f5f3ff', accent: '#7c3aed', iconBg: '#ede9fe' },
    { label: 'Margin Earned',  value: `₹${parseFloat(dashboardData.stats.marginEarned.amount).toLocaleString('en-IN')}`, sub: dashboardData.stats.marginEarned.label, icon: TrendingUp, bg: PL, accent: P, iconBg: '#fddccc' },
  ] : [];

  const lifecycle = dashboardData ? [
    { label: `Customer Order`,   count: dashboardData.lifecycle.customerOrder,  color: G,         bg: GL        },
    { label: `Agent Purchase`,   count: dashboardData.lifecycle.agentPurchase,  color: '#d97706', bg: '#fef9ec' },
    { label: `Farmer Confirm`,   count: dashboardData.lifecycle.farmerConfirm,  color: '#7c3aed', bg: '#f5f3ff' },
    { label: `Delivery`,         count: dashboardData.lifecycle.delivery,       color: '#3b82f6', bg: '#eff6ff' },
    { label: `Farmer Payment`,   count: dashboardData.lifecycle.farmerPayment,  color: P,         bg: PL        },
    { label: `Closed`,           count: dashboardData.lifecycle.closed,         color: '#16a34a', bg: '#dcfce7' },
  ] : [];

  const alerts = [
    { text: 'Farmer Payout Pending for Order #2415', action: 'View Order', color: '#d97706', bg: '#fef9ec', border: '#fde68a' },
    { text: 'Customer delivery confirmation awaited (Order #2345)', action: 'Track', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: `3px solid ${GL}`, borderTop: `3px solid ${G}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${G} 0%, #2a9054 50%, ${P} 100%)`,
        borderRadius: '16px', padding: '24px 28px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: `0 6px 24px ${G}30`, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '100px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.8)' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Agent Dashboard</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            {greeting}, {agentDetails?.userFullName?.split(' ')[0] || 'Agent'} 👋
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
            {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
          {[
            { label: 'Buy From Farmers', icon: ShoppingBasket, path: '/agent/buy-from-farmers' },
            { label: 'Place Orders',     icon: ClipboardList,  path: '/agent/place-orders' },
          ].map(({ label, icon: Icon, path }) => (
            <button key={label} onClick={() => navigate(path)} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white',
              border: '1px solid rgba(255,255,255,0.35)', borderRadius: '10px',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              backdropFilter: 'blur(4px)', transition: 'background 0.15s, transform 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.32)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {alerts.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', backgroundColor: a.bg,
              border: `1px solid ${a.border}`, borderRadius: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={16} color={a.color} />
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{a.text}</span>
              </div>
              <span style={{ fontSize: '12px', color: a.color, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: '12px' }}>{a.action} →</span>
            </div>
          ))}
        </div>
      )}

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Activity size={14} color={G} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Performance Overview</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '14px', marginBottom: '24px' }}>
        {statsCards.map((c, i) => (
          <div key={i} style={{
            backgroundColor: c.bg, borderRadius: '14px', padding: '18px 16px',
            border: `1px solid ${c.accent}22`, boxShadow: `0 2px 12px ${c.accent}14`,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${c.accent}28`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 2px 12px ${c.accent}14`; }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <c.icon size={17} color={c.accent} />
            </div>
            <p style={{ margin: '0 0 3px', fontSize: '11px', color: '#6b7280', fontWeight: 500 }}>{c.label}</p>
            <p style={{ margin: '0 0 5px', fontSize: '22px', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.02em' }}>{c.value}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: c.accent, fontWeight: 600 }}>
              <ArrowUpRight size={11} />{c.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Zap size={14} color={P} />
        <span style={{ fontSize: '11px', fontWeight: 700, color: P, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order Lifecycle</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
      </div>

      {/* Order Lifecycle */}
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '12px' }}>
          {lifecycle.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                backgroundColor: s.bg, border: `2px solid ${s.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px',
                boxShadow: s.count > 0 ? `0 4px 12px ${s.color}30` : 'none',
              }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: s.count > 0 ? s.color : '#9ca3af' }}>{s.count}</span>
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: s.count > 0 ? '#374151' : '#9ca3af', fontWeight: s.count > 0 ? 600 : 400, lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notice Board */}
      <NoticeBoardCard />

      {/* Customer Orders & Overview */}
      <CustomerOrdersCards data={dashboardData} />
      <DashboardOverview data={dashboardData} />
    </div>
  );
};

export default Dashboard;
