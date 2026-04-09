// src/layout/Layout.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const Layout = () => {
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Fixed Navbar */}
      <header className="fixed-top">
        <Navbar />
      </header>

      {/* Main Content - add top padding to avoid overlap with fixed navbar */}
      <main ref={mainRef} style={{ flex: 1, paddingTop: '6rem' }}>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default Layout;