import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/AdminDashboard/AdminNavbar';
import AdminSidebar from '../../components/AdminDashboard/AdminSidebar';

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH  = 240;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#faf9f8' }}>
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />

      <div style={{ flex: 1, marginLeft: sidebarWidth, transition: 'margin-left 0.25s ease', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AdminNavbar sidebarCollapsed={collapsed} />

        <main style={{ flex: 1, marginTop: '64px', padding: '28px', overflowY: 'auto' }}>
          <Outlet />
        </main>

        <footer style={{
          padding: '14px 28px',
          borderTop: '1px solid #edddd6',
          backgroundColor: '#ffffff',
          fontSize: '12px',
          color: '#a8897a',
          textAlign: 'center'
        }}>
          © {new Date().getFullYear()} Total Needs. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
