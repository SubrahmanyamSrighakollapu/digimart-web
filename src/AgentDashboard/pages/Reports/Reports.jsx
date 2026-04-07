import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ShoppingCart, TrendingUp, Wheat, Users, ArrowUpRight, Calendar, Search, Filter, BarChart2 } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip);

const P  = '#EC5B13';
const PL = '#FEF0E9';
const G  = '#32a862';
const GL = '#e6f7ed';

const inp = {
  padding: '9px 14px', border: '1px solid #e5e7eb', borderRadius: '8px',
  fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#1c1917',
};

const kpis = [
  { label: 'Total Orders',     value: '1,234', change: '+10%', icon: ShoppingCart, gradient: `linear-gradient(135deg, ${P} 0%, #F07030 100%)`,    glow: 'rgba(236,91,19,0.28)' },
  { label: 'Total Revenue',    value: '₹98,000', change: '+12%', icon: TrendingUp,   gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', glow: 'rgba(217,119,6,0.28)' },
  { label: 'Farmer Payments',  value: '₹57,000', change: '+5%',  icon: Wheat,        gradient: `linear-gradient(135deg, ${G} 0%, #2a9054 100%)`,    glow: 'rgba(50,168,98,0.28)' },
  { label: 'Agent Margin',     value: '₹80,000', change: '+10%', icon: Users,        gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', glow: 'rgba(124,58,237,0.28)' },
];

const cropSales = [
  { label: 'Basmati Rice', value: '8 Tons',  pct: 80, color: G },
  { label: 'Toor Dal',     value: '5 Tons',  pct: 55, color: P },
  { label: 'Wheat',        value: '3 Tons',  pct: 35, color: '#7c3aed' },
  { label: 'Maize',        value: '2 Tons',  pct: 22, color: '#d97706' },
];

const pieData = {
  datasets: [{ data: [20, 20, 60], backgroundColor: ['#d97706', P, '#7c3aed'], borderWidth: 0, cutout: '72%' }]
};

const topFarmers = [
  { name: 'Ramesh Kumar', orders: 123, earnings: '₹52,000', trend: '+8%' },
  { name: 'Raju Patel',   orders: 67,  earnings: '₹48,000', trend: '+5%' },
  { name: 'Suresh Singh', orders: 56,  earnings: '₹85,000', trend: '+12%' },
];

const topBuyers = [
  { name: 'Ramesh Traders', volume: '2.5 Tons', value: '₹52,000', trend: '+6%' },
  { name: 'Raju Enterprises', volume: '500 Kg', value: '₹48,000', trend: '+3%' },
  { name: 'Suresh & Co.',   volume: '1 Ton',   value: '₹85,000', trend: '+15%' },
];

const txns = [
  { id: 'TXN001', farmer: 'Ramesh Kumar', product: 'Basmati Rice', amount: '₹15,000', mode: 'UPI',           status: 'Completed', date: '2024-01-15' },
  { id: 'TXN002', farmer: 'Raju Patel',   product: 'Wheat',        amount: '₹8,500',  mode: 'Bank Transfer', status: 'Pending',   date: '2024-01-14' },
  { id: 'TXN003', farmer: 'Suresh Singh', product: 'Toor Dal',     amount: '₹12,300', mode: 'Cash',          status: 'Completed', date: '2024-01-13' },
];

const statusStyle = (s) => s === 'Completed'
  ? { backgroundColor: GL, color: G }
  : { backgroundColor: '#fef3c7', color: '#92400e' };

const Reports = () => (
  <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif" }}>

    {/* Page Header */}
    <div style={{ background: `linear-gradient(135deg, ${P} 0%, #F07030 60%, ${G} 100%)`, borderRadius: '16px', padding: '24px 32px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: `0 6px 24px rgba(236,91,19,0.22)`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-30px', right: '80px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(30px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={18} color="white" />
          </div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'white' }}>Reports & Analytics</h1>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Track performance, financials, and business growth insights</p>
      </div>
    </div>

    {/* Filters */}
    <div style={{ backgroundColor: '#fff', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', border: '1px solid #f0ede9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>Date Range</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', ...inp, width: 'auto' }}>
          <Calendar size={13} color="#9ca3af" />
          <input type="date" style={{ border: 'none', outline: 'none', fontSize: '13px', color: '#1c1917', backgroundColor: 'transparent' }} />
        </div>
      </div>
      {[
        { label: 'Crop Type', placeholder: 'Enter crop type' },
        { label: 'Region',    placeholder: 'Enter region' },
      ].map(f => (
        <div key={f.label}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>{f.label}</label>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
            <input placeholder={f.placeholder} style={{ ...inp, paddingLeft: '30px', width: '100%', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
              onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>
      ))}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '5px' }}>Farmer / Agent</label>
        <select style={{ ...inp, width: '100%' }}
          onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
          onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
        >
          <option>All Agents</option>
          <option>Farmers Only</option>
        </select>
      </div>
      <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', backgroundColor: P, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', boxShadow: `0 4px 12px rgba(236,91,19,0.3)`, whiteSpace: 'nowrap' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <Filter size={13} /> Apply
      </button>
    </div>

    {/* KPI Cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
      {kpis.map((k, i) => (
        <div key={i} style={{ background: k.gradient, borderRadius: '14px', padding: '20px', boxShadow: `0 8px 24px ${k.glow}`, position: 'relative', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${k.glow}`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 24px ${k.glow}`; }}
        >
          <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <k.icon size={16} color="white" />
          </div>
          <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{k.label}</p>
          <p style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{k.value}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', fontSize: '11px', color: 'white', fontWeight: 600 }}>
            <ArrowUpRight size={10} />{k.change}
          </div>
        </div>
      ))}
    </div>

    {/* Middle: Crop Sales + Revenue Split */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
      {/* Crop-wise Sales */}
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0ede9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Crop-wise Sales</h3>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>This month</span>
        </div>
        <div style={{ padding: '20px' }}>
          {cropSales.map((c, i) => (
            <div key={i} style={{ marginBottom: i < cropSales.length - 1 ? '18px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1c1917' }}>{c.label}</span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>{c.value}</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: `linear-gradient(90deg, ${c.color}, ${c.color}99)`, borderRadius: '999px', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Split */}
      <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '20px' }}>
        <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Revenue Split</h3>
        <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#9ca3af' }}>Breakdown of earnings distribution</p>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '24px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Doughnut data={pieData} options={{ responsive: false, plugins: { legend: { display: false } } }} width={160} height={160} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '10px', color: '#9ca3af' }}>Total</p>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1c1917' }}>100%</p>
            </div>
          </div>
          <div>
            {[
              { color: '#d97706', label: 'Farmer payout', value: '20%' },
              { color: P,        label: 'Agent margin',  value: '20%' },
              { color: '#7c3aed', label: 'Platform fees', value: '60%' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < 2 ? '14px' : 0 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: l.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>{l.label}</p>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#1c1917' }}>{l.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Recent Transactions */}
    <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '24px' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0ede9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>Recent Transactions</h3>
        <span style={{ fontSize: '12px', color: P, fontWeight: 600, cursor: 'pointer' }}>View all →</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#faf8f6' }}>
              {['Transaction ID', 'Farmer', 'Product', 'Amount', 'Mode', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '11px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: P, borderBottom: '1px solid #f0ede9', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txns.map((t, i) => (
              <tr key={i} style={{ borderBottom: i < txns.length - 1 ? '1px solid #faf8f6' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf8f6'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '13px 18px' }}><span style={{ fontFamily: 'monospace', fontSize: '12px', color: P, fontWeight: 600 }}>{t.id}</span></td>
                <td style={{ padding: '13px 18px', fontWeight: 600, color: '#1c1917', fontSize: '13px' }}>{t.farmer}</td>
                <td style={{ padding: '13px 18px', color: '#6b7280', fontSize: '13px' }}>{t.product}</td>
                <td style={{ padding: '13px 18px', fontWeight: 700, color: '#1c1917', fontSize: '14px' }}>{t.amount}</td>
                <td style={{ padding: '13px 18px' }}><span style={{ padding: '3px 10px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>{t.mode}</span></td>
                <td style={{ padding: '13px 18px' }}><span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, ...statusStyle(t.status) }}>{t.status}</span></td>
                <td style={{ padding: '13px 18px', color: '#9ca3af', fontSize: '12px' }}>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Bottom: Top Farmers + Top Buyers */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {[
        { title: 'Top Farmers', headers: ['Farmer', 'Orders', 'Earnings', 'Trend'], rows: topFarmers.map(r => [r.name, r.orders, r.earnings, r.trend]) },
        { title: 'Top Buyers',  headers: ['Buyer',  'Volume', 'Value',    'Trend'], rows: topBuyers.map(r => [r.name, r.volume, r.value, r.trend]) },
      ].map(tbl => (
        <div key={tbl.title} style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #f0ede9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0ede9' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1c1917' }}>{tbl.title}</h3>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#faf8f6' }}>
                {tbl.headers.map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: P, borderBottom: '1px solid #f0ede9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tbl.rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < tbl.rows.length - 1 ? '1px solid #faf8f6' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#faf8f6'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1c1917', fontSize: '13px' }}>{row[0]}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '13px' }}>{row[1]}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1c1917', fontSize: '13px' }}>{row[2]}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', backgroundColor: GL, color: G, borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                      <ArrowUpRight size={10} />{row[3]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  </div>
);

export default Reports;
