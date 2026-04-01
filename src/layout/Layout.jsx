// src/layout/Layout.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const Layout = () => {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {/* Fixed Navbar */}
      <header className="fixed-top">
        <Navbar />
      </header>

      {/* Main Content - add top padding to avoid overlap with fixed navbar */}
      <main style={{ flex: 1, paddingTop: '6rem' }}>
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