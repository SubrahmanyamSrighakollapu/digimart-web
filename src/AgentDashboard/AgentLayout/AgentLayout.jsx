// src/AgentDashboard/AgentLayout/AgentLayout.jsx

import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';
import AgentNavbar from '../../components/AgentDashboard/AgentNavbar';
import AgentSidebar from '../../components/AgentDashboard/AgentSidebar';
import ScrollingMessages from '../../components/AgentDashboard/ScrollingMessages';
import Footer from '../../components/Footer';

const AgentLayout = () => {
  const navbarHeight = '90px';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="d-flex flex-column vh-100">
      <div className="fixed-top" style={{ zIndex: 1030 }}>
        <ScrollingMessages />
        <AgentNavbar />
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          position: 'fixed',
          top: `calc(${navbarHeight} + 60px)`,
          left: isSidebarOpen ? 'calc(25% - 24px)' : '10px',
          zIndex: 1050,
          backgroundColor: '#54CF17',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(84, 207, 23, 0.4)',
          transition: 'all 0.3s ease'
        }}
      >
        {isSidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
      </button>

      <div className="d-flex flex-grow-1" style={{ marginTop: 'calc(90px + 50px)' }}>
        <div 
          className="position-fixed"
          style={{
            width: '25%',
            height: `calc(100vh - ${navbarHeight} - 50px)`,
            overflowY: 'auto',
            top: 'calc(90px + 50px)',
            left: isSidebarOpen ? 0 : '-25%',
            zIndex: 1020,
            transition: 'left 0.3s ease',
            boxShadow: isSidebarOpen ? '4px 0 12px rgba(0,0,0,0.1)' : 'none',
            paddingTop: '20px'
          }}
        >
          <AgentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 'calc(90px + 50px)',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 1010,
              transition: 'opacity 0.3s ease'
            }}
          />
        )}

        <div 
          className="flex-grow-1"
          style={{
            marginLeft: 0,
            width: '100%',
            padding: '1.5rem',
            paddingLeft: '5rem',
            overflowY: 'auto',
            height: `calc(100vh - ${navbarHeight} - 50px)`,
            transition: 'margin-left 0.3s ease'
          }}
        >
          <Outlet />
          <div style={{
            textAlign: 'center',
            padding: '20px',
            marginTop: '40px',
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.02))',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
            borderRadius: '8px 8px 0 0',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            © All Copyright 2024. All rights reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentLayout;