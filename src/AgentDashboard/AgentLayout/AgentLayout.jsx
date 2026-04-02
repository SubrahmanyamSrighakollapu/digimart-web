import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AgentNavbar from '../../components/AgentDashboard/AgentNavbar';
import AgentSidebar from '../../components/AgentDashboard/AgentSidebar';
import ScrollingMessages from '../../components/AgentDashboard/ScrollingMessages';

const NAVBAR_H = 64;
const TICKER_H = 36;
const TOTAL_TOP = NAVBAR_H + TICKER_H;
const SIDEBAR_W = 220;
const COLLAPSED_W = 64;

const AgentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Fixed top bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <ScrollingMessages />
        <AgentNavbar sidebarCollapsed={collapsed} />
      </div>

      {/* Fixed sidebar */}
      <AgentSidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />

      {/* Main content */}
      <div style={{
        marginTop: TOTAL_TOP,
        marginLeft: collapsed ? COLLAPSED_W : SIDEBAR_W,
        transition: 'margin-left 0.25s ease',
        padding: '28px',
        minHeight: `calc(100vh - ${TOTAL_TOP}px)`,
      }}>
        <Outlet />
        <div style={{ textAlign: 'center', padding: '24px 0 8px', marginTop: '40px', fontSize: '12px', color: '#9ca3af', borderTop: '1px solid #e5e7eb' }}>
          © 2024 DigiMart. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AgentLayout;
