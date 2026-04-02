import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, ChevronDown, LogOut, User, Settings, X } from 'lucide-react';
import logo from '../../assets/digimart.png';
import authService from '../../services/authService';

const P = '#EC5B13';
const PL = '#FEF0E9';
const SEC = '#F7EEEA';

const AdminNavbar = ({ sidebarCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const getDashboardRoute = () => {
    if (user.roleName === 'Super Distributor') return '/super-distributor';
    if (user.roleName === 'Master Distributor') return '/master-distributor';
    if (user.roleName === 'Distributor') return '/distributor';
    return '/admin';
  };

  const getInitials = (email) => (!email ? 'AD' : email.substring(0, 2).toUpperCase());

  const getBreadcrumbs = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments.map((seg, i) => ({
      label: seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      path: '/' + segments.slice(0, i + 1).join('/')
    }));
  };

  const handleLogout = () => navigate(authService.logout());

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const breadcrumbs = getBreadcrumbs();
  const notifications = [
    { id: 1, text: '6 KYC verifications pending', time: '2m ago', type: 'warning' },
    { id: 2, text: 'New agent registered', time: '15m ago', type: 'info' },
    { id: 3, text: 'Failed payout: Farmer #12345', time: '1h ago', type: 'error' },
  ];

  const notifDot = { warning: '#d97706', error: '#dc2626', info: P };

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: `1px solid #edddd6`,
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: '16px',
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 1000,
      boxShadow: '0 1px 8px rgba(236,91,19,0.08)'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', minWidth: sidebarCollapsed ? '64px' : '220px', transition: 'min-width 0.3s' }}>
        <img src={logo} alt="DigiMart" style={{ height: '80px', cursor: 'pointer', objectFit: 'contain' }}
          onClick={() => navigate(getDashboardRoute())} />
      </div>

      {/* Breadcrumbs */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', overflow: 'hidden' }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            {i > 0 && <span style={{ color: '#d4b8ae' }}>/</span>}
            <span onClick={() => i < breadcrumbs.length - 1 && navigate(crumb.path)} style={{
              cursor: i < breadcrumbs.length - 1 ? 'pointer' : 'default',
              color: i === breadcrumbs.length - 1 ? '#1c1917' : '#a8897a',
              fontWeight: i === breadcrumbs.length - 1 ? '600' : '400',
            }}>
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', width: '220px' }}>
        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#a8897a', pointerEvents: 'none' }} />
        <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '8px 32px 8px 32px', border: '1px solid #edddd6', borderRadius: '8px', fontSize: '13px', outline: 'none', backgroundColor: SEC, color: '#1c1917', boxSizing: 'border-box' }}
          onFocus={e => { e.target.style.borderColor = P; e.target.style.backgroundColor = '#fff'; e.target.style.boxShadow = `0 0 0 3px ${PL}`; }}
          onBlur={e => { e.target.style.borderColor = '#edddd6'; e.target.style.backgroundColor = SEC; e.target.style.boxShadow = 'none'; }}
        />
        {searchQuery && <X size={13} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#a8897a', cursor: 'pointer' }} onClick={() => setSearchQuery('')} />}
      </div>

      {/* Notifications */}
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button onClick={() => setShowNotifications(!showNotifications)} style={{
          background: showNotifications ? PL : 'none', border: `1px solid #edddd6`,
          cursor: 'pointer', position: 'relative', padding: '8px', borderRadius: '8px',
          color: '#6b5c55', display: 'flex', alignItems: 'center', transition: 'all 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = PL}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = showNotifications ? PL : 'transparent'}
        >
          <Bell size={18} />
          <span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', backgroundColor: P, borderRadius: '50%', fontSize: '9px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', border: '2px solid white' }}>
            {notifications.length}
          </span>
        </button>

        {showNotifications && (
          <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '320px', backgroundColor: 'white', borderRadius: '14px', boxShadow: '0 8px 32px rgba(236,91,19,0.15)', border: '1px solid #edddd6', zIndex: 100, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f3ede9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `linear-gradient(135deg, ${P}, #D44E0E)` }}>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'white' }}>Notifications</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontWeight: '500' }}>Mark all read</span>
            </div>
            {notifications.map(n => (
              <div key={n.id} style={{ padding: '13px 18px', borderBottom: '1px solid #faf5f2', display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = SEC}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px', flexShrink: 0, backgroundColor: notifDot[n.type] }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1a0f0a', lineHeight: '1.4' }}>{n.text}</p>
                  <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#a8897a' }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile */}
      <div ref={profileRef} style={{ position: 'relative' }}>
        <button onClick={() => setShowProfile(!showProfile)} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: showProfile ? PL : 'none', border: `1px solid #edddd6`,
          borderRadius: '10px', padding: '6px 12px', cursor: 'pointer', transition: 'all 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = PL}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = showProfile ? PL : 'transparent'}
        >
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: `linear-gradient(135deg, ${P}, #D44E0E)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '11px', flexShrink: 0 }}>
            {getInitials(user.email)}
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#1c1917', lineHeight: '1.2' }}>{user.roleName || 'Admin'}</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#a8897a', lineHeight: '1.2' }}>{user.email?.split('@')[0] || 'admin'}</p>
          </div>
          <ChevronDown size={13} style={{ color: '#a8897a', transition: 'transform 0.2s', transform: showProfile ? 'rotate(180deg)' : 'none' }} />
        </button>

        {showProfile && (
          <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '260px', backgroundColor: 'white', borderRadius: '14px', boxShadow: '0 8px 32px rgba(236,91,19,0.15)', border: '1px solid #edddd6', zIndex: 100, overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: `linear-gradient(135deg, ${P}, #D44E0E)`, textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '18px', margin: '0 auto 10px' }}>
                {getInitials(user.email)}
              </div>
              <p style={{ margin: 0, color: 'white', fontWeight: '700', fontSize: '14px' }}>{user.roleName || 'Admin User'}</p>
              <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>{user.email || ''}</p>
            </div>
            <div style={{ padding: '8px' }}>
              <div style={{ padding: '10px 12px', fontSize: '12px', color: '#a8897a', borderBottom: '1px solid #f3ede9', marginBottom: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>User ID</span><span style={{ color: '#1a0f0a', fontWeight: '600' }}>{user.userId || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Contact</span><span style={{ color: '#1a0f0a', fontWeight: '600' }}>{user.contactNo || 'N/A'}</span>
                </div>
              </div>
              {[{ icon: User, label: 'Profile' }, { icon: Settings, label: 'Settings' }].map(({ icon: Icon, label }) => (
                <button key={label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '13px', color: '#1a0f0a' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = PL}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Icon size={14} color={P} /><span>{label}</span>
                </button>
              ))}
              <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '13px', color: '#dc2626', marginTop: '2px' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={14} /><span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
