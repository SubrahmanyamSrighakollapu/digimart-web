import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Heart, ShoppingCart, RefreshCw, LogOut, ChevronDown, Wallet } from 'lucide-react';
import logo from '../../assets/digimart.png';
import authService from '../../services/authService';

const G = '#32a862';
const GL = '#e6f7ed';
const P = '#EC5B13';

const AgentNavbar = ({ sidebarCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [agentDetails, setAgentDetails] = useState(null);
  const [walletDetails, setWalletDetails] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const d = sessionStorage.getItem('agentDetails');
    if (d) setAgentDetails(JSON.parse(d));
    const w = sessionStorage.getItem('walletDetails');
    if (w) setWalletDetails(JSON.parse(w));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRefreshWallet = async () => {
    setRefreshing(true);
    const userStr = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    let userId = null;
    if (userStr) {
      try { userId = JSON.parse(userStr).userId; } catch {}
    }
    if (userId && token) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/wallet-details/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.status === 1) {
          sessionStorage.setItem('walletDetails', JSON.stringify(data.result));
          setWalletDetails(data.result);
          toast.success('Wallet refreshed');
        } else toast.error('Failed to refresh wallet');
      } catch { toast.error('Error refreshing wallet'); }
    } else toast.error('User session not found');
    setRefreshing(false);
  };

  const handleLogout = () => navigate(authService.logout());

  const getInitials = (name) => {
    if (!name) return 'AG';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBreadcrumbs = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    return segments.map((seg, i) => ({
      label: seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      path: '/' + segments.slice(0, i + 1).join('/')
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: '16px',
      position: 'relative', zIndex: 1,
      boxShadow: '0 1px 8px rgba(50,168,98,0.08)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', minWidth: sidebarCollapsed ? '64px' : '200px', transition: 'min-width 0.3s' }}>
        <img src={logo} alt="DigiMart" style={{ height: '76px', cursor: 'pointer', objectFit: 'contain' }}
          onClick={() => navigate('/agent')} />
      </div>

      {/* Breadcrumbs */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', overflow: 'hidden' }}>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
            {i > 0 && <span style={{ color: '#d1d5db' }}>/</span>}
            <span onClick={() => i < breadcrumbs.length - 1 && navigate(crumb.path)} style={{
              cursor: i < breadcrumbs.length - 1 ? 'pointer' : 'default',
              color: i === breadcrumbs.length - 1 ? '#1c1917' : '#9ca3af',
              fontWeight: i === breadcrumbs.length - 1 ? 600 : 400,
            }}>
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      {/* Wallet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          backgroundColor: GL, border: `1px solid ${G}33`,
          borderRadius: '10px', padding: '8px 14px',
        }}>
          <Wallet size={16} color={G} />
          <div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: G, lineHeight: 1.2 }}>
              ₹{walletDetails?.balance ? parseFloat(walletDetails.balance).toFixed(2) : '0.00'}
            </p>
            <p style={{ margin: 0, fontSize: '10px', color: '#6b7280', lineHeight: 1.2 }}>
              Hold: ₹{walletDetails?.holdBalance ? parseFloat(walletDetails.holdBalance).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
        <button onClick={handleRefreshWallet} disabled={refreshing} style={{
          width: '34px', height: '34px', borderRadius: '50%',
          backgroundColor: G, border: 'none', cursor: refreshing ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: refreshing ? 0.6 : 1, transition: 'all 0.2s',
          boxShadow: `0 2px 8px ${G}40`,
        }}
          onMouseEnter={e => { if (!refreshing) e.currentTarget.style.backgroundColor = '#2a9054'; }}
          onMouseLeave={e => { if (!refreshing) e.currentTarget.style.backgroundColor = G; }}
        >
          <RefreshCw size={15} color="white" style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* Wishlist */}
      <button onClick={() => navigate('/agent/wishlist')} style={{
        width: '38px', height: '38px', borderRadius: '50%',
        backgroundColor: '#fff', border: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.backgroundColor = '#fff1f2'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#fff'; }}
      >
        <Heart size={17} color="#ef4444" fill="#ef4444" />
      </button>

      {/* Cart */}
      <button onClick={() => navigate('/agent/cart')} style={{
        width: '38px', height: '38px', borderRadius: '50%',
        backgroundColor: '#fff', border: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${G}66`; e.currentTarget.style.backgroundColor = GL; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#fff'; }}
      >
        <ShoppingCart size={17} color="#374151" />
      </button>

      {/* Profile */}
      <div ref={profileRef} style={{ position: 'relative' }}>
        <button onClick={() => setShowProfile(!showProfile)} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: showProfile ? GL : 'none', border: '1px solid #e5e7eb',
          borderRadius: '10px', padding: '6px 12px', cursor: 'pointer', transition: 'all 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = GL}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = showProfile ? GL : 'transparent'}
        >
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${G}, #2a9054)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '11px', flexShrink: 0,
          }}>
            {getInitials(agentDetails?.userFullName)}
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#1c1917', lineHeight: 1.2 }}>{agentDetails?.userFullName?.split(' ')[0] || 'Agent'}</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', lineHeight: 1.2 }}>{agentDetails?.businessName || 'Agent'}</p>
          </div>
          <ChevronDown size={13} style={{ color: '#9ca3af', transition: 'transform 0.2s', transform: showProfile ? 'rotate(180deg)' : 'none' }} />
        </button>

        {showProfile && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '260px',
            backgroundColor: 'white', borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(50,168,98,0.15)', border: '1px solid #e5e7eb',
            zIndex: 100, overflow: 'hidden',
          }}>
            <div style={{ padding: '20px', background: `linear-gradient(135deg, ${G}, #2a9054)`, textAlign: 'center' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '18px', margin: '0 auto 10px',
              }}>
                {getInitials(agentDetails?.userFullName)}
              </div>
              <p style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '14px' }}>{agentDetails?.userFullName || 'Agent'}</p>
              <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>{agentDetails?.emailAddress || ''}</p>
            </div>
            <div style={{ padding: '12px' }}>
              {[
                { label: 'Contact', value: agentDetails?.contactNo },
                { label: 'Business', value: agentDetails?.businessName },
                { label: 'Area', value: agentDetails?.operationsAreas },
              ].map(({ label, value }) => value ? (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px', fontSize: '12px', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#9ca3af' }}>{label}</span>
                  <span style={{ color: '#1c1917', fontWeight: 600, maxWidth: '160px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                </div>
              ) : null)}
              <button onClick={() => { setShowProfile(false); setShowLogoutConfirm(true); }} style={{
                width: '100%', marginTop: '12px', padding: '10px',
                backgroundColor: '#fee2e2', color: '#dc2626',
                border: '1px solid #fca5a5', borderRadius: '8px',
                fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fecaca'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div onClick={() => setShowLogoutConfirm(false)} style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'white', borderRadius: '14px', padding: '32px',
            width: '380px', maxWidth: '90vw', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <LogOut size={22} color="#dc2626" />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#1c1917' }}>Confirm Logout</h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280' }}>Are you sure you want to logout?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{
                padding: '10px 24px', backgroundColor: '#f9fafb', color: '#374151',
                border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleLogout} style={{
                padding: '10px 24px', backgroundColor: '#dc2626', color: 'white',
                border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
              }}>Logout</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </header>
  );
};

export default AgentNavbar;
