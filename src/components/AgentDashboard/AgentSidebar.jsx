import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBasket, ClipboardList, Package,
  Tag, CreditCard, BarChart2, Wallet, ChevronRight, PlusSquare, FolderPlus
} from 'lucide-react';

const SB = {
  bg:           '#ffffff',
  bgHover:      '#f0faf4',
  accent:       '#32a862',
  accentLight:  '#e6f7ed',
  accentBorder: '#32a862',
  textNav:      '#374151',
  textMuted:    '#9ca3af',
  textActive:   '#32a862',
  divider:      '#e5e7eb',
};

const SIDEBAR_W   = 220;
const COLLAPSED_W = 64;

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard',       path: '/agent' },
  { icon: ShoppingBasket,  label: 'Buy From Farmers', path: '/agent/buy-from-farmers' },
  { icon: ClipboardList,   label: 'Place Orders',     path: '/agent/place-orders' },
  { icon: Package, label: 'Products', children: [
    { icon: FolderPlus, label: 'Add Category', path: '/agent/products/add-category' },
    { icon: PlusSquare, label: 'Add Product',  path: '/agent/products/add-product' },
  ]},
  { icon: CreditCard,  label: 'Vendor Payments', path: '/agent/vendor-payments' },
  { icon: Wallet,      label: 'Settlements',     path: '/agent/settlements' },
  { icon: BarChart2,   label: 'Reports',         path: '/agent/reports' },
];

const AgentSidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [popupMenu, setPopupMenu] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!popupMenu) return;
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setPopupMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popupMenu]);

  const isActive      = (path) => path === '/agent' ? location.pathname === '/agent' : location.pathname === path;
  const isGroupActive = (children) => children?.some(c => location.pathname === c.path);
  const toggle        = (label) => setOpenMenu(prev => prev === label ? null : label);

  const itemBase = {
    display: 'flex', alignItems: 'center', gap: '10px',
    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
    transition: 'all 0.15s', textDecoration: 'none',
  };

  return (
    <aside style={{
      width: collapsed ? COLLAPSED_W : SIDEBAR_W,
      minWidth: collapsed ? COLLAPSED_W : SIDEBAR_W,
      height: '100vh',
      backgroundColor: SB.bg,
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.25s ease, min-width 0.25s ease',
      overflow: 'hidden',
      position: 'fixed', top: 0, left: 0, zIndex: 999,
      paddingTop: '100px', // navbar(64) + ticker(36)
      borderRight: `1px solid ${SB.divider}`,
      boxShadow: '2px 0 12px rgba(0,0,0,0.06)',
    }}>
      {/* Brand strip */}
      {!collapsed && (
        <div style={{
          padding: '10px 16px',
          borderBottom: `1px solid ${SB.divider}`,
          background: 'linear-gradient(135deg, #EC5B13 0%, #32a862 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.95)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Agent Panel</span>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0', scrollbarWidth: 'none' }}>
        {menuItems.map((item) => {
          if (item.children) {
            const isOpen = openMenu === item.label;
            const groupActive = isGroupActive(item.children);
            return (
              <div key={item.label} style={{ position: 'relative' }}>
                <button
                  onClick={e => {
                    if (collapsed) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setPopupMenu(prev => prev?.label === item.label ? null : { label: item.label, children: item.children, top: rect.top });
                    } else {
                      toggle(item.label);
                    }
                  }}
                  onMouseEnter={e => { if (!collapsed && !groupActive) e.currentTarget.style.backgroundColor = SB.bgHover; }}
                  onMouseLeave={e => { if (!collapsed && !groupActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  style={{
                    ...itemBase,
                    width: '100%', background: groupActive ? SB.accentLight : 'none',
                    padding: collapsed ? '11px 0' : '11px 16px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderLeft: `3px solid ${groupActive ? SB.accentBorder : 'transparent'}`,
                  }}
                >
                  <item.icon size={17} style={{ flexShrink: 0, color: groupActive ? SB.accent : SB.textMuted }} />
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, textAlign: 'left', fontSize: '13px', fontWeight: groupActive ? 600 : 500, color: groupActive ? SB.textActive : SB.textNav }}>{item.label}</span>
                      <ChevronRight size={13} style={{ color: SB.textMuted, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    </>
                  )}
                </button>

                {!collapsed && isOpen && (
                  <div style={{ backgroundColor: '#f9fafb', borderLeft: `2px solid ${SB.accentBorder}33`, marginLeft: '26px' }}>
                    {item.children.map(child => (
                      <Link key={child.path} to={child.path} style={{
                        ...itemBase, display: 'flex',
                        padding: '9px 14px', fontSize: '12.5px',
                        fontWeight: isActive(child.path) ? 600 : 400,
                        color: isActive(child.path) ? SB.accent : '#6b7280',
                        backgroundColor: isActive(child.path) ? SB.accentLight : 'transparent',
                        borderLeft: `2px solid ${isActive(child.path) ? SB.accentBorder : 'transparent'}`,
                      }}
                        onMouseEnter={e => { if (!isActive(child.path)) e.currentTarget.style.backgroundColor = SB.bgHover; }}
                        onMouseLeave={e => { if (!isActive(child.path)) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <child.icon size={13} style={{ flexShrink: 0, color: isActive(child.path) ? SB.accent : SB.textMuted }} />
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
            <Link key={item.path} to={item.path} style={{
              ...itemBase, display: 'flex',
              padding: collapsed ? '11px 0' : '11px 16px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              fontSize: '13px', fontWeight: active ? 600 : 500,
              color: active ? SB.textActive : SB.textNav,
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

      {/* Collapsed popup */}
      {collapsed && popupMenu && (
        <div ref={popupRef} style={{
          position: 'fixed', left: COLLAPSED_W + 4, top: popupMenu.top,
          backgroundColor: '#fff', borderRadius: '12px', minWidth: '190px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14)', border: '1px solid #e5e7eb',
          zIndex: 1100, overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #EC5B13 0%, #32a862 100%)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{popupMenu.label}</span>
          </div>
          {popupMenu.children.map(child => (
            <Link key={child.path} to={child.path} onClick={() => setPopupMenu(null)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 16px', textDecoration: 'none', fontSize: '13px',
              fontWeight: isActive(child.path) ? 600 : 400,
              color: isActive(child.path) ? SB.accent : '#374151',
              backgroundColor: isActive(child.path) ? SB.accentLight : 'transparent',
              borderLeft: `3px solid ${isActive(child.path) ? SB.accent : 'transparent'}`,
              transition: 'background 0.12s',
            }}
              onMouseEnter={e => { if (!isActive(child.path)) e.currentTarget.style.backgroundColor = SB.bgHover; }}
              onMouseLeave={e => { if (!isActive(child.path)) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <child.icon size={14} style={{ color: isActive(child.path) ? SB.accent : SB.textMuted, flexShrink: 0 }} />
              <span>{child.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Collapse toggle */}
      <button onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end',
        padding: '14px 16px', background: 'none', border: 'none',
        borderTop: `1px solid ${SB.divider}`, cursor: 'pointer', color: SB.textMuted,
        transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.color = SB.accent; e.currentTarget.style.backgroundColor = SB.bgHover; }}
        onMouseLeave={e => { e.currentTarget.style.color = SB.textMuted; e.currentTarget.style.backgroundColor = 'transparent'; }}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <ChevronRight size={17} style={{ transform: collapsed ? 'none' : 'rotate(180deg)', transition: 'transform 0.25s' }} />
      </button>
    </aside>
  );
};

export default AgentSidebar;
