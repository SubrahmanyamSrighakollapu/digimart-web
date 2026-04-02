import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import {
  LayoutDashboard, Package, BarChart2, Zap, Users, UserCheck,
  Briefcase, Settings, Globe, Wallet, ChevronRight,
  PauseCircle, TrendingUp, CreditCard, DollarSign, UserPlus,
  List, Lock, UserCog, FileText, Building2, AlignLeft,
  Megaphone, Coins, BadgeDollarSign, Shield, ScrollText, Undo2
} from 'lucide-react';

// Brand palette for sidebar — #EC5B13 is the darkest allowed color
const SB = {
  bg:          '#EC5B13',   // primary brand orange as sidebar bg
  bgHover:     'rgba(255,255,255,0.12)',
  accent:      '#ffffff',
  accentLight: 'rgba(255,255,255,0.18)',
  accentBorder:'#ffffff',
  textMuted:   'rgba(255,255,255,0.65)',
  textActive:  '#ffffff',
  divider:     'rgba(255,255,255,0.15)',
};

const SIDEBAR_WIDTH   = 240;
const COLLAPSED_WIDTH = 64;

const AdminSidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const isLimitedAccess = authService.isLimitedAccess();

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const getBase = () => {
    if (user.roleName === 'Super Distributor') return '/super-distributor';
    if (user.roleName === 'Master Distributor') return '/master-distributor';
    if (user.roleName === 'Distributor') return '/distributor';
    return '/admin';
  };
  const base = getBase();

  const allMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: base },
    { icon: Package,         label: 'Products',  path: `${base}/products` },
    { icon: BarChart2, label: 'Reports', children: [
      { icon: PauseCircle,  label: 'Hold Transactions',  path: `${base}/reports/hold-transactions` },
      { icon: TrendingUp,   label: 'Transaction Reports', path: `${base}/reports/transaction-reports` },
    ]},
    { icon: Zap, label: 'Integration', children: [
      { icon: CreditCard,   label: 'Add Payment Gateway', path: `${base}/integration/add-payment-gateway` },
      { icon: CreditCard,   label: 'Gateway Setup',       path: `${base}/integration/payment-gateway-setup` },
      { icon: DollarSign,   label: 'Charge Config',       path: `${base}/integration/charge` },
    ]},
    { icon: Users, label: 'User Management', children: [
      { icon: Settings,     label: 'User Settings', path: `${base}/user-management/user-service-settings` },
      { icon: UserPlus,     label: 'Add User',      path: `${base}/user-management/create-user` },
      { icon: List,         label: 'User List',     path: `${base}/user-management/users-list` },
      { icon: Wallet,       label: 'Add Wallet',    path: `${base}/user-management/add-wallet` },
      { icon: Lock,         label: 'Hold Funds',    path: `${base}/user-management/hold-funds` },
    ]},
    { icon: UserCheck, label: 'Agent Management', children: [
      { icon: UserPlus, label: 'Add Agent',   path: `${base}/agent-management/add-agent` },
      { icon: List,     label: 'Agent List',  path: `${base}/agent-management/agents-list` },
    ]},
    { icon: Briefcase, label: 'Employee Management', children: [
      { icon: UserPlus, label: 'Add Employee',     path: `${base}/employee-management/add-employee` },
      { icon: List,     label: 'Employees List',   path: `${base}/employee-management/employees-list` },
    ]},
    { icon: Settings, label: 'Admin Settings', children: [
      { icon: UserCog,         label: 'Roles',              path: `${base}/admin-settings/roles-management` },
      { icon: FileText,        label: 'Plans',              path: `${base}/admin-settings/plans-management` },
      { icon: Building2,       label: 'Plan Commission',    path: `${base}/admin-settings/plan-commission-manager` },
      { icon: Building2,       label: 'Commission Config',  path: `${base}/admin-settings/plan-commission-configuration` },
      { icon: AlignLeft,       label: 'Scroll Text',        path: `${base}/admin-settings/scroll-text-manager` },
      { icon: Megaphone,       label: 'Notice Board',       path: `${base}/admin-settings/notice-board-manager` },
      { icon: Coins,           label: 'Payout Charges',     path: `${base}/admin-settings/payout-charges-manager` },
      { icon: BadgeDollarSign, label: 'Min Wallet Balance', path: `${base}/admin-settings/set-balance-requirement` },
      { icon: CreditCard,      label: 'Payment Methods',    path: `${base}/admin-settings/payment-methods-manager` },
    ]},
    { icon: Globe, label: 'Website Settings', children: [
      { icon: Shield,     label: 'Privacy Policy',    path: `${base}/website-settings/privacy-policy` },
      { icon: ScrollText, label: 'Terms & Conditions',path: `${base}/website-settings/terms-conditions` },
      { icon: Undo2,      label: 'Refund Policy',     path: `${base}/website-settings/refund-policy` },
    ]},
    { icon: Wallet, label: 'Wallet Management', path: `${base}/wallet-management` },
  ];

  const menuItems = isLimitedAccess
    ? allMenuItems.filter(i => ['Dashboard', 'Agent Management', 'User Management', 'Reports'].includes(i.label))
    : allMenuItems;

  const isActive      = (path) => path === base ? location.pathname === base : location.pathname === path;
  const isGroupActive = (children) => children?.some(c => location.pathname === c.path);
  const toggle        = (label) => setOpenMenu(prev => prev === label ? null : label);

  const itemBase = {
    display: 'flex', alignItems: 'center', gap: '10px',
    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'all 0.15s', textDecoration: 'none',
  };

  return (
    <aside style={{
      width: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
      minWidth: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
      height: '100vh',
      backgroundColor: SB.bg,
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease, min-width 0.25s ease',
      overflow: 'hidden',
      position: 'fixed', top: 0, left: 0, zIndex: 999,
      paddingTop: '64px',
      borderRight: `1px solid ${SB.divider}`,
    }}>
      {/* Brand strip at top */}
      {!collapsed && (
        <div style={{ padding: '12px 16px 8px', borderBottom: `1px solid ${SB.divider}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 0 6px rgba(255,255,255,0.6)' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</span>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0', scrollbarWidth: 'none' }}>
        {menuItems.map((item) => {
          if (item.children) {
            const isOpen = openMenu === item.label;
            const groupActive = isGroupActive(item.children);
            return (
              <div key={item.label}>
                <button
                  onClick={() => !collapsed && toggle(item.label)}
                  title={collapsed ? item.label : ''}
                  style={{
                    ...itemBase,
                    width: '100%', background: groupActive ? SB.accentLight : 'none',
                    padding: collapsed ? '11px 0' : '11px 16px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderLeft: `3px solid ${groupActive ? SB.accentBorder : 'transparent'}`,
                  }}
                  onMouseEnter={e => { if (!groupActive) e.currentTarget.style.backgroundColor = SB.bgHover; }}
                  onMouseLeave={e => { if (!groupActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <item.icon size={17} style={{ flexShrink: 0, color: groupActive ? SB.accent : SB.textMuted }} />
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, textAlign: 'left', fontSize: '13px', fontWeight: groupActive ? 600 : 500, color: groupActive ? SB.textActive : SB.textMuted }}>{item.label}</span>
                      <ChevronRight size={13} style={{ color: SB.textMuted, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    </>
                  )}
                </button>

                {!collapsed && isOpen && (
                  <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', borderLeft: `2px solid ${SB.divider}`, marginLeft: '26px' }}>
                    {item.children.map(child => (
                      <Link key={child.path} to={child.path} style={{
                        ...itemBase, display: 'flex',
                        padding: '9px 14px', fontSize: '12.5px',
                        fontWeight: isActive(child.path) ? 600 : 400,
                        color: isActive(child.path) ? SB.accent : SB.textMuted,
                        backgroundColor: isActive(child.path) ? SB.accentLight : 'transparent',
                        borderLeft: `2px solid ${isActive(child.path) ? SB.accentBorder : 'transparent'}`,
                      }}
                        onMouseEnter={e => { if (!isActive(child.path)) e.currentTarget.style.backgroundColor = SB.bgHover; }}
                        onMouseLeave={e => { if (!isActive(child.path)) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <child.icon size={13} style={{ flexShrink: 0 }} />
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} title={collapsed ? item.label : ''} style={{
              ...itemBase, display: 'flex',
              padding: collapsed ? '11px 0' : '11px 16px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              fontSize: '13px', fontWeight: active ? 600 : 500,
              color: active ? SB.textActive : SB.textMuted,
              backgroundColor: active ? SB.accentLight : 'transparent',
              borderLeft: `3px solid ${active ? SB.accentBorder : 'transparent'}`,
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = SB.bgHover; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <item.icon size={17} style={{ flexShrink: 0, color: active ? SB.accent : SB.textMuted }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end',
        padding: '14px 16px', background: 'none', border: 'none',
        borderTop: `1px solid ${SB.divider}`, cursor: 'pointer', color: SB.textMuted,
        transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.color = SB.accent; e.currentTarget.style.backgroundColor = SB.bgHover; }}
        onMouseLeave={e => { e.currentTarget.style.color = SB.textMuted; e.currentTarget.style.backgroundColor = 'transparent'; }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronRight size={17} style={{ transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform 0.25s' }} />
      </button>
    </aside>
  );
};

export default AdminSidebar;
