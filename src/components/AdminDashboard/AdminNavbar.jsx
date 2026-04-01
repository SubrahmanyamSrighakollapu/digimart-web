// src/components/AdminDashboard/AdminNavbar.jsx

import { useState } from 'react';
import Icon1 from '../../assets/AgentDashboard/Navbar/Icon1.png';
import Icon2 from '../../assets/AgentDashboard/Navbar/Icon2.png';
import logo from '../../assets/total-needs-logo.png';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const handleLogout = () => {
    const logoutRoute = authService.logout();
    navigate(logoutRoute);
  };

  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  
  // Get dashboard route based on role
  const getDashboardRoute = () => {
    if (user.roleName === 'Super Distributor') return '/super-distributor';
    if (user.roleName === 'Master Distributor') return '/master-distributor';
    if (user.roleName === 'Distributor') return '/distributor';
    return '/admin';
  };
  
  const getInitials = (email) => {
    if (!email) return 'AD';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="border" style={{ borderColor: '#929292', backgroundColor: '#FFFFFF', position: 'relative' }}>
      <div className="container-fluid">
        <div className="row align-items-center py-2 px-3">
          <div className="col-4 col-sm-4 col-md-4 col-lg-3">
            <img 
              src={logo} 
              alt="Total Needs" 
              style={{ height: '6rem', cursor: 'pointer' }}
              onClick={() => navigate(getDashboardRoute())}
            />
          </div>

          <div className="col-8 col-sm-8 col-md-8 col-lg-9">
            <div className="d-flex align-items-center justify-content-end gap-3">
              <div className="d-none d-md-flex">
                <img 
                  src={Icon1} 
                  alt="Icon 1" 
                  style={{ width: '25px', height: '25px', opacity: 1 }}
                />
              </div>

              <div 
                className="d-flex align-items-center gap-2 px-3 py-2"
                style={{
                  backgroundColor: '#98F894',
                  border: '1px solid #98F894',
                  borderRadius: '10px',
                  minWidth: '170px',
                  height: '50px'
                }}
              >
                <img 
                  src={Icon2} 
                  alt="Wallet" 
                  style={{ width: '24px', height: '24px' }}
                />
                <div className="d-flex flex-column justify-content-center">
                  <p className="mb-0 fw-bold" style={{ fontSize: '0.95rem', lineHeight: '1.2' }}>
                    Main: 16000
                  </p>
                  <p className="mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                    Lean: 10000
                  </p>
                </div>
              </div>

              <div 
                className="d-flex align-items-center gap-2"
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div 
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#4BAF47',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  {getInitials(user.email)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showProfileDropdown && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setShowProfileDropdown(false)}
          />
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              right: '20px',
              marginTop: '8px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              padding: '20px',
              minWidth: '280px',
              zIndex: 1000,
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div 
                style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: '#4BAF47',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1.8rem',
                  margin: '0 auto 12px'
                }}
              >
                {getInitials(user.email)}
              </div>
              <h6 style={{ margin: '0 0 4px', fontWeight: '600' }}>{user.roleName || 'Admin User'}</h6>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{user.email || 'admin@totalneeds.in'}</p>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginBottom: '12px' }}>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>User ID:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{user.userId || 'N/A'}</span>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>Contact:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{user.contactNo || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>Role ID:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{user.roleId || 'N/A'}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminNavbar;