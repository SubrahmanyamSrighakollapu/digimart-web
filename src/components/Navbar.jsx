// src/components/Navbar.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import navbarBg from '../assets/Navbar_bgImg.png';
import logo from '../assets/digimart.png';
import { useCart } from '../context/CartContext';

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F1E17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F1E17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const MenuIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Partners', path: '/partners' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname === path;
  const cartCount = cartItems.length;

  return (
    <>
      <nav 
        className="navbar-custom py-0" 
        style={{
          height: '5.678rem',
          backgroundImage: `url(${navbarBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1000
        }}
      >
        <div className="container-fluid px-lg-5 px-3 h-100">
          <div className="row align-items-center justify-content-between h-100 g-0">
            
            {/* Logo */}
            <div className="col-auto">
              <Link to="/" className="text-decoration-none">
                <img src={logo} alt="DigiMart" style={{ height: '6rem', marginBottom: '1rem' }} />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="col-auto d-none d-lg-flex">
              <div className="d-flex align-items-center" style={{ gap: '2.5rem' }}>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`text-decoration-none nav-item-link ${isActive(item.path) ? 'active' : ''}`}
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '1rem',
                      color: isActive(item.path) ? '#1F1E17' : '#878680',
                      fontWeight: isActive(item.path) ? 600 : 500,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      paddingBottom: '4px'
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Right Section */}
            <div className="col-auto d-none d-lg-flex">
              <div className="d-flex align-items-center" style={{ gap: '1.5rem' }}>
                <button 
                  className="btn text-white fw-medium"
                  style={{
                    width: '11.3125rem',
                    height: '2.6875rem',
                    background: '#EC5B13',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '1rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                  onClick={() => navigate('/login')}
                >
                  Join Our Network
                </button>
                
                <div 
                  className="d-flex align-items-center" 
                  style={{ 
                    cursor: 'pointer', 
                    borderLeft: '1px solid #E4E2D7',
                    paddingLeft: '1.5rem',
                    paddingRight: '0.5rem'
                  }}
                >
                  <SearchIcon />
                </div>
                
                <div 
                  className="position-relative d-flex align-items-center" 
                  style={{ cursor: 'pointer', padding: '0.5rem' }}
                  onClick={() => navigate('/cart')}
                >
                  <CartIcon />
                  {cartCount > 0 && (
                    <span 
                      className="position-absolute"
                      style={{
                        top: '-2px',
                        left: '12px',
                        background: '#EC5B13',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Right Section - Menu + Cart */}
            <div className="col-auto d-lg-none">
              <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
                {/* Cart Icon for Mobile */}
                <div 
                  className="position-relative d-flex align-items-center" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/cart')}
                >
                  <CartIcon />
                  {cartCount > 0 && (
                    <span 
                      className="position-absolute"
                      style={{
                        top: '-8px',
                        left: '12px',
                        background: '#EC5B13',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </div>

                {/* Menu Toggle */}
                <div 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{ cursor: 'pointer', color: '#1F1E17' }}
                >
                  {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="position-fixed top-0 start-0 vh-100"
          style={{
            width: '75%',
            background: 'rgba(100, 100, 100, 0.95)',
            backdropFilter: 'blur(8px)',
            zIndex: 999,
            animation: 'slideIn 0.3s ease-out'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="p-5 d-flex flex-column"
            style={{ gap: '2rem', paddingTop: '5rem !important' }}
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-decoration-none"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '1.25rem',
                  color: isActive(item.path) ? '#EC5B13' : 'white',
                  fontWeight: isActive(item.path) ? 800 : 600
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div 
              className="mt-4"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 500,
                color: '#EC5B13',
                cursor: 'pointer'
              }}
              onClick={() => {
                navigate('/login');
                setIsMobileMenuOpen(false);
              }}
            >
              Join Our Network
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }

        .nav-item-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background-color: #EC5B13;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-item-link:hover::after,
        .nav-item-link.active::after {
          width: 100%;
        }

        .nav-item-link:hover {
          color: #1F1E17 !important;
        }

        @media (max-width: 1023.98px) {
          .navbar-custom .col-auto:first-child a {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;