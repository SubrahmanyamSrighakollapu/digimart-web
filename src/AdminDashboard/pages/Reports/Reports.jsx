import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ShoppingCart, TrendingUp, Wheat, Users, ArrowUpRight, Calendar } from 'lucide-react';
import { T, PageHeader, Card, SectionLabel, SearchBar, SelectInput, FilterBar, Badge } from '../../components/AdminUI';

ChartJS.register(ArcElement, Tooltip);

const kpis = [
  { label: 'Total Orders',    value: '1,234', change: '+10%', icon: ShoppingCart, bg: '#eff6ff', accent: '#3b82f6', iconBg: '#dbeafe' },
  { label: 'Total Revenue',   value: '\u20b998,000', change: '+12%', icon: TrendingUp,  bg: '#fef9ec', accent: '#d97706', iconBg: '#fef3c7' },
  { label: 'Farmer Payments', value: '\u20b957,000', change: '+5%',  icon: Wheat,       bg: '#e6f7ed', accent: '#32a862', iconBg: '#bbf7d0' },
  { label: 'Agent Margin',    value: '\u20b980,000', change: '+10%', icon: Users,       bg: '#f5f3ff', accent: '#7c3aed', iconBg: '#ede9fe' },
];

const txns = [
  { id: 'TXN001', orderId: 'ORD123', agent: 'Ramesh Kumar', product: 'Basmati Rice', amount: '₹15,000', mode: 'UPI', status: 'Completed', date: '2024-01-15' },
  { id: 'TXN002', orderId: 'ORD124', agent: 'Suresh Patel', product: 'Wheat', amount: '₹8,500', mode: 'Bank Transfer', status: 'Pending', date: '2024-01-14' },
  { id: 'TXN003', orderId: 'ORD125', agent: 'Mahesh Singh', product: 'Toor Dal', amount: '₹12,300', mode: 'Cash', status: 'Completed', date: '2024-01-13' },
];

const cropSales = [
  { label: 'Basmati Rice', value: '8 Tons', pct: 80, color: '#10b981' },
  { label: 'Toor Dal', value: '5 Tons', pct: 55, color: '#6366f1' },
  { label: 'Wheat', value: '3 Tons', pct: 35, color: '#f59e0b' },
];

const pieData = {
  datasets: [{ data: [20, 20, 60], backgroundColor: ['#FFC533', '#FF5F8A', '#7A49E5'], borderWidth: 0, cutout: '72%' }]
};

const Reports = () => (
  <div>
    <PageHeader title="Transaction Reports" subtitle="Track performance, financials, and business growth insights" />

    {/* Filters */}
    <Card style={{ marginBottom: '24px' }}>
      <FilterBar>
        <div style={{ position: 'relative' }}>
          <Calendar size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: T.textLight, pointerEvents: 'none' }} />
          <input type="date" style={{ padding: '10px 14px 10px 34px', border: `1px solid ${T.border}`, borderRadius: T.radius, fontSize: T.fontMd, outline: 'none', color: T.text, backgroundColor: T.surface }}
            onFocus={e => e.target.style.borderColor = '#32a862'} onBlur={e => e.target.style.borderColor = T.border} />
        </div>
        <SearchBar placeholder="Enter crop type..." style={{ width: '200px' }} />
        <SelectInput style={{ minWidth: '160px' }}>
          <option>All Agents</option>
          <option>Farmer</option>
          <option>Agent</option>
        </SelectInput>
        <SearchBar placeholder="Enter region..." style={{ width: '180px' }} />
      </FilterBar>
    </Card>

    {/* KPI Cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
      {kpis.map((k, i) => (
        <div key={i} style={{
          backgroundColor: k.bg, borderRadius: '14px', padding: '20px',
          border: `1px solid ${k.accent}22`, boxShadow: `0 2px 12px ${k.accent}14`,
          transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden'
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${k.accent}28`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 2px 12px ${k.accent}14`; }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: k.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <k.icon size={18} color={k.accent} />
          </div>
          <p style={{ margin: '0 0 4px', fontSize: T.fontSm, color: '#6b7280', fontWeight: 500 }}>{k.label}</p>
          <p style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 800, color: '#1c1917', letterSpacing: '-0.02em' }}>{k.value}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: k.accent, fontWeight: 600 }}>
            <ArrowUpRight size={11} />{k.change} this month
          </div>
        </div>
      ))}
    </div>

    {/* Transactions Table */}
    <Card noPad style={{ marginBottom: '24px' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Recent Transactions</h3>
        <span style={{ fontSize: T.fontBase, color: '#32a862', fontWeight: 600, cursor: 'pointer' }}>View all →</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              {['Transaction ID', 'Order ID', 'Agent', 'Product', 'Amount', 'Payment Mode', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#32a862', borderBottom: `1px solid ${T.border}`, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', backgroundColor: '#e6f7ed' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txns.map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.borderLight}` }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafbff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '13px 18px' }}><span style={{ fontFamily: 'monospace', fontSize: T.fontBase, color: '#32a862', fontWeight: 600 }}>{t.id}</span></td>
                <td style={{ padding: '13px 18px', color: T.textMuted, fontSize: T.fontBase }}>{t.orderId}</td>
                <td style={{ padding: '13px 18px', fontWeight: 600, color: T.text }}>{t.agent}</td>
                <td style={{ padding: '13px 18px', color: T.textMuted }}>{t.product}</td>
                <td style={{ padding: '13px 18px', fontWeight: 700, color: T.text }}>{t.amount}</td>
                <td style={{ padding: '13px 18px' }}><Badge variant="info">{t.mode}</Badge></td>
                <td style={{ padding: '13px 18px' }}><Badge variant={t.status === 'Completed' ? 'success' : 'warning'}>{t.status}</Badge></td>
                <td style={{ padding: '13px 18px', color: T.textMuted, fontSize: T.fontBase }}>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    {/* Bottom 2-col */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Crop-wise Sales */}
      <Card>
        <h3 style={{ margin: '0 0 20px', fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Crop-wise Sales</h3>
        {cropSales.map((c, i) => (
          <div key={i} style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: T.fontMd, fontWeight: 600, color: T.text }}>{c.label}</span>
              <span style={{ fontSize: T.fontMd, color: T.textMuted }}>{c.value}</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${c.pct}%`, height: '100%', background: `linear-gradient(90deg,${c.color},${c.color}99)`, borderRadius: '999px', transition: 'width 0.6s ease' }} />
            </div>
          </div>
        ))}
      </Card>

      {/* Revenue Split */}
      <Card>
        <h3 style={{ margin: '0 0 4px', fontSize: T.fontXl, fontWeight: 700, color: T.text }}>Revenue Split</h3>
        <p style={{ margin: '0 0 24px', fontSize: T.fontBase, color: T.textMuted }}>Breakdown of earnings distribution</p>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '32px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Doughnut data={pieData} options={{ responsive: false, plugins: { legend: { display: false } } }} width={180} height={180} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '11px', color: T.textMuted }}>Total</p>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: T.text }}>100%</p>
            </div>
          </div>
          <div>
            {[{ color: '#FFC533', label: 'Farmer payout', value: '20%' }, { color: '#FF5F8A', label: 'Agent margin', value: '20%' }, { color: '#7A49E5', label: 'Platform fees', value: '60%' }].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: l.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: T.fontBase, color: T.textMuted }}>{l.label}</p>
                </div>
                <span style={{ fontSize: T.fontXl, fontWeight: 800, color: T.text }}>{l.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  </div>
);

export default Reports;
