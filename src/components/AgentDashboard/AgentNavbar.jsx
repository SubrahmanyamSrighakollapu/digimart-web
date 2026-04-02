// src/components/AgentDashboard/AgentNavbar.jsx

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Icon1 from '../../assets/AgentDashboard/Navbar/Icon1.png';
import Icon2 from '../../assets/AgentDashboard/Navbar/Icon2.png';
import logo from '../../assets/digimart.png';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const AgentNavbar = () => {
  const navigate = useNavigate();
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [agentDetails, setAgentDetails] = useState(null);
  const [walletDetails, setWalletDetails] = useState(null);
  const profileRef = useRef(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const details = sessionStorage.getItem('agentDetails');
    if (details) {
      setAgentDetails(JSON.parse(details));
    }
    
    const wallet = sessionStorage.getItem('walletDetails');
    if (wallet) {
      setWalletDetails(JSON.parse(wallet));
    }

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileCard(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefreshWallet = async () => {
    // console.log('Refresh wallet clicked');
    setLoading(true);
    
    // Get userId from user object
    const userStr = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    
    let userId = null;
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userId = user.userId;
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // console.log('UserId:', userId, 'Token:', token ? 'exists' : 'missing');
    
    if (userId && token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/wallet-details/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        // console.log('Wallet API response:', data);
        
        if (data.status === 1) {
          sessionStorage.setItem('walletDetails', JSON.stringify(data.result));
          setWalletDetails(data.result);
          toast.success('Wallet refreshed successfully');
        } else {
          toast.error('Failed to refresh wallet');
        }
      } catch (error) {
        console.error('Error fetching wallet details:', error);
        toast.error('Error refreshing wallet');
      }
    } else {
      toast.error('User session not found');
    }
    setLoading(false);
  };
  
  const handleLogout = () => {
    const logoutRoute = authService.logout();
    navigate(logoutRoute);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="border" style={{ borderColor: '#929292', backgroundColor: '#FFFFFF' }}>
      <div className="container-fluid">
        <div className="row align-items-center py-2 px-3">
          {/* Left Side - Logo */}
          <div className="col-4 col-sm-4 col-md-4 col-lg-3">
            <img 
              src={logo} 
              alt="Total Needs" 
              style={{ height: '6rem', cursor: 'pointer' }}
              onClick={() => navigate('/agent')}
            />
          </div>

          {/* Right Side - Icons and Wallet */}
          <div className="col-8 col-sm-8 col-md-8 col-lg-9">
            <div className="d-flex align-items-center justify-content-end gap-3">
              {/* Icon 1 */}
              <div className="d-none d-md-flex">
                <img
                  src={Icon1}
                  alt="Icon 1"
                  style={{ width: '25px', height: '25px', opacity: 1 }}
                />
              </div>

              {/* Wallet Balance Container with Reload */}
              <div className="d-flex align-items-center gap-2">
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
                      Main: {walletDetails?.balance ? `₹${parseFloat(walletDetails.balance).toFixed(2)}` : '₹0.00'}
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>
                      Lean: {walletDetails?.holdBalance ? `₹${parseFloat(walletDetails.holdBalance).toFixed(2)}` : '₹0.00'}
                    </p>
                  </div>
                </div>

                {/* Reload Icon */}
                <div
                  onClick={handleRefreshWallet}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#4BAF47',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: loading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#3d9a3a')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#4BAF47')}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      animation: loading ? 'spin 1s linear infinite' : 'none'
                    }}
                  >
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                  </svg>
                </div>
              </div>

              {/* Wishlist Icon */}
              <div 
                className="d-flex align-items-center justify-content-center"
                onClick={() => navigate('/agent/wishlist')}
                style={{
                  width: '46px',
                  height: '46px',
                  background: 'white',
                  borderRadius: '50%',
                  border: '1px solid #929292',
                  cursor: 'pointer'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000" stroke="#FF0000" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>

              {/* Cart Icon */}
              <div 
                className="d-flex align-items-center justify-content-center"
                onClick={() => navigate('/agent/cart')}
                style={{
                  width: '46px',
                  height: '46px',
                  background: 'white',
                  borderRadius: '50%',
                  border: '1px solid #929292',
                  cursor: 'pointer'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>

              {/* User Profile Container */}
              <div
                ref={profileRef}
                style={{
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={() => setShowProfileCard(!showProfileCard)}
              >
                {/* User Avatar */}
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
                    fontSize: '1.2rem',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  {getInitials(agentDetails?.userFullName)}
                </div>

                {/* Profile Dropdown Card */}
                {showProfileCard && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      width: '280px',
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      padding: '20px',
                      zIndex: 1000
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: '#4BAF47',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '1.5rem',
                          margin: '0 auto 12px'
                        }}
                      >
                        {getInitials(agentDetails?.userFullName)}
                      </div>
                      <h6 style={{ margin: '0 0 4px', fontWeight: '600' }}>{agentDetails?.userFullName}</h6>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{agentDetails?.emailAddress}</p>
                    </div>
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
                        <span style={{ color: '#6b7280' }}>Contact:</span>
                        <span style={{ marginLeft: '8px', fontWeight: '500' }}>{agentDetails?.contactNo}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
                        <span style={{ color: '#6b7280' }}>Business:</span>
                        <span style={{ marginLeft: '8px', fontWeight: '500' }}>{agentDetails?.businessName}</span>
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>
                        <span style={{ color: '#6b7280' }}>Area:</span>
                        <span style={{ marginLeft: '8px', fontWeight: '500' }}>{agentDetails?.operationsAreas}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#4BAF47',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '400px',
              maxWidth: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 style={{ marginBottom: '16px', fontWeight: '600' }}>Confirm Logout</h5>
            <p style={{ marginBottom: '24px', color: '#6b7280' }}>Are you sure you want to logout?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: '8px 20px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Responsive Styles */}
      <style jsx="true">{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 767.98px) {
          h1 {
            font-size: 1.5rem;
          }
          
          .gap-3 {
            gap: 0.5rem !important;
          }
          
          div[style*="minHeight"] {
            min-height: 60px !important;
            padding: 0.5rem 1rem !important;
          }
          
          div[style*="minHeight"] img {
            width: 28px !important;
            height: 28px !important;
          }
          
          div[style*="minHeight"] p:first-child {
            font-size: 0.65rem !important;
          }
          
          div[style*="minHeight"] p:last-child {
            font-size: 0.9rem !important;
          }

          /* Hide user profile on mobile */
          div[style*="13rem"] {
            display: none !important;
          }
        }

        @media (max-width: 575.98px) {
          h1 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentNavbar;