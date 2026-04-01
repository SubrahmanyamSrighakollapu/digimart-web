// src/AdminDashboard/pages/Dashboard/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Get base route based on user role
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const getBaseRoute = () => {
    if (user.roleName === 'Super Distributor') return '/super-distributor';
    if (user.roleName === 'Master Distributor') return '/master-distributor';
    if (user.roleName === 'Distributor') return '/distributor';
    return '/admin';
  };
  const baseRoute = getBaseRoute();
  
  // Check if user is a distributor role
  const isDistributor = user.roleName === 'Super Distributor' || 
                        user.roleName === 'Master Distributor' || 
                        user.roleName === 'Distributor';
  
  // Data objects for easy maintenance
  const overviewData = [
    { title: 'Total Orders', value: '2345', subtitle: 'Customer Request', borderColor: '#0A6806' },
    { title: 'Active Agents', value: '24', subtitle: 'Active', borderColor: '#AA871B' },
    { title: 'Active Farmers', value: '17', subtitle: 'Active deliveries', borderColor: '#3B82F6' },
    { title: 'Gross Trade value', value: '₹ 80,000', subtitle: 'Pending release', borderColor: '#A855F7' },
    { title: 'Pending Payouts', value: '₹ 80,000', subtitle: 'This Month', borderColor: '#88DB15' },
  ];

  const financialData = [
    { title: 'Customer Payments', value: '₹ 80,000', change: '+5% in last month', positive: true, gradientFrom: '#fdba74' },
    { title: 'Farmer Payouts', value: '₹ 80,000', change: '+10% in last month', positive: true, gradientFrom: '#c4b5fd' },
    { title: 'Agent Earnings', value: '₹ 80,000', change: '-7% in last month', positive: false, gradientFrom: '#a7f3d0' },
    { title: 'Platform margin', value: '₹ 80,000', change: '+5% in last month', positive: true, gradientFrom: '#fbcfe8' },
  ];

  const orderStatusData = [
    { label: 'Pending Assignment', count: 14, color: '#FFB732' },
    { label: 'In Procurement', count: 23, color: '#324DFF' },
    { label: 'In Transit', count: 36, color: '#CC32FF' },
    { label: 'Delivered', count: 89, color: '#0A6806' },
    { label: 'Disputes raised', count: 89, color: '#FF3232' },  
  ];

  return (
    <>
      <style jsx>{`
        .dashboard-container {
          padding: 25px;
          background-color: #f7f9fc;
          font-family: 'Segoe UI', sans-serif;
          color: #333;
          max-width: 1600px;
          margin: 0 auto;
          min-height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .financial-title {
          margin: 40px 0 24px;
        }

        .action-buttons .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          margin-left: 12px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .btn-agent { 
          background-color: #4159D3; 
          color: white; 
        }
        
        .btn-agent:hover {
          background-color: #3146b8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(65, 89, 211, 0.3);
        }
        
        .btn-user { 
          background-color: #12AE0C; 
          color: white; 
        }
        
        .btn-user:hover {
          background-color: #0f9209;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(18, 174, 12, 0.3);
        }
        
        .btn-employee { 
          background-color: #CA28B7; 
          color: white; 
        }
        
        .btn-employee:hover {
          background-color: #b0229c;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(202, 40, 183, 0.3);
        }

        .overview-cards,
        .financial-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 32px;
          margin-bottom: 48px;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border-left: 6px solid transparent;
        }

        .overview-card {
          border-left-color: var(--border-color);
        }

        .financial-card {
          background: linear-gradient(to bottom, #fff 60%, #f1f5f9 100%);
          border-left-color: var(--gradient-from);
        }

        .card h3 {
          font-size: 16px;
          color: #64748b;
          margin: 0 0 12px 0;
        }

        .big-number {
          font-size: 28px;
          font-weight: 700;
          margin: 8px 0;
          color: #1e293b;
        }

        .subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0;
        }

        .change {
          font-size: 14px;
          margin-top: 12px;
        }

        .positive { color: #22c55e; }
        .negative { color: #ef4444; }

        .bottom-sections {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }

        .bottom-card {
          min-height: 320px;
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .bottom-card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #2d3748;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .status-item:last-child {
          border-bottom: none;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: var(--dot-color);
          display: inline-block;
          margin-right: 12px;
        }

        .status-label {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .count {
          font-weight: 600;
          font-size: 18px;
          color: #1e293b;
        }

        .user-overview {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.user-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
  margin-bottom: 40px;
  align-items: start;
}
  

.user-grid > .user-main-box:nth-child(1) {
  /* Farmers - top left */
}

.user-grid > .user-main-box:nth-child(2) {
  /* KYC pending - top right */
}

.user-grid > .user-main-box:nth-child(3) {
  /* Active Agents - spans full width below */
  grid-column: 1 / -1;
  background-color: transparent !important; /* No background card */
  padding: 0;
  text-align: left;
}

.agents-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}

.agents-left {
  text-align: left;
}

.agents-left h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #4f46e5;
}

.agents-left .user-note {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.agents-right {
  text-align: right;
}

.agents-right .user-big {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.agents-right .small-count {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #1e293b;
}

/* Improve button spacing and size */
.user-actions {
  display: flex;
  gap: 16px;
  margin-top: auto; /* Ensures buttons stick to bottom */
}

.user-actions button {
  flex: 1;
  padding: 12px 20px;
  font-size: 15px;
  border-radius: 8px;
}
.user-main-box {
  background-color: var(--user-bg);
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 8px;
  border-left: 4px solid var(--border-color, transparent);
}

.user-main-box h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.user-main-box .user-big {
  font-size: 34px;
  font-weight: 700;
  margin: 12px 0;
  color: #1e293b;
}

.user-main-box .user-note {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.agents-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.small-count {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.kyc-box h4 {
  color: #dc2626 !important;
}

/* Remove or comment out the old .user-box styles if still present */
        .btn-approve {
          background-color: #22c55e;
          color: white;
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-view {
          background-color: #64748b;
          color: white;
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .critical-alerts h3 {
          margin-bottom: 20px;
        }

        .alert-box.kyc {
          background-color: #fee2e2;
          padding: 24px;
          border-radius: 12px;
          text-align: center;
          margin-bottom: 32px;
        }

        .alert-title {
          font-weight: 600;
          color: #dc2626;
          margin: 0 0 8px 0;
        }

        .alert-desc {
          font-size: 36px;
          font-weight: 700;
          color: #dc2626;
          margin: 8px 0;
        }

        .alert-note {
          color: #64748b;
          font-size: 14px;
        }

        .alert-item {
          padding: 16px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .alert-item:last-child {
          border-bottom: none;
        }

        .alert-item p {
          margin: 4px 0;
          font-size: 15px;
        }

        .resolve-btn, .assign-btn {
          background-color: transparent;
          border-radius: 6px;
          padding: 6px 16px;
          margin-top: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .resolve-btn {
          border: 1px solid #ef4444;
          color: #ef4444;
        }

        .assign-btn {
          border: 1px solid #f59e0b;
          color: #f59e0b;
        }

        @media (max-width: 1200px) {
          .bottom-sections {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          .action-buttons {
            margin-top: 16px;
            width: 100%;
          }
          .action-buttons .btn {
            flex: 1;
            margin-left: 0;
            margin-right: 8px;
          }
          .action-buttons .btn:last-child {
            margin-right: 0;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="header">
          <h1 className="section-title">Platform Overview</h1>
          <div className="action-buttons">
            <button className="btn btn-agent" onClick={() => navigate(`${baseRoute}/agent-management/add-agent`)}>+ Add Agent</button>
            <button className="btn btn-user" onClick={() => navigate(`${baseRoute}/user-management/create-user`)}>+ Add User</button>
            {!isDistributor && (
              <button className="btn btn-employee" onClick={() => navigate(`${baseRoute}/create-employee`)}>+ Add Employee</button>
            )}
          </div>
        </div>

        <div className="overview-cards">
          {overviewData.map((item, index) => (
            <div key={index} className="card overview-card" style={{ '--border-color': item.borderColor }}>
              <h3>{item.title}</h3>
              <p className="big-number">{item.value}</p>
              <p className="subtitle">{item.subtitle}</p>
            </div>
          ))}
        </div>

        <h1 className="section-title financial-title">Revenue & Financial Flow</h1>

        <div className="financial-cards">
          {financialData.map((item, index) => (
            <div key={index} className="card financial-card" style={{ '--gradient-from': item.gradientFrom }}>
              <h3>{item.title}</h3>
              <p className="big-number">{item.value}</p>
              <p className={`change ${item.positive ? 'positive' : 'negative'}`}>{item.change}</p>
            </div>
          ))}
        </div>

        <div className="bottom-sections">
          {/* Order Status */}
          <div className="bottom-card">
            <h3>Order Status</h3>
            {orderStatusData.map((status, index) => (
              <div key={index} className="status-item">
                <div className="status-label">
                  <span className="dot" style={{ '--dot-color': status.color }}></span>
                  <span>{status.label}</span>
                </div>
                <span className="count">{status.count}</span>
              </div>
            ))}
          </div>

          {/* User Overview */}
          <div className="bottom-card user-overview">
            <h3>User Overview</h3>
            <div className="user-grid">
              {/* Farmers - left top */}
              <div className="user-main-box" style={{ '--user-bg': '#dbeafe' }}>
                <h4 style={{ color: '#1e40af' }}>Farmers</h4>
                <p className="user-big">25</p>
                <p className="user-note">New Registration</p>
              </div>

              {/* KYC pending - right top */}
              <div className="user-main-box" style={{ '--user-bg': '#fee2e2' }}>
                <h4 style={{ color: '#dc2626' }}>KYC pending</h4>
                <p className="user-big">6</p>
                <p className="user-note">Action Required</p>
              </div>

              {/* Active Agents - full width below, no background card */}
              <div className="user-main-box">
                <div className="agents-section">
                  <div className="agents-left">
                    <p className="user-note">Active Agents</p>
                    <p className="user-note">New Buyers</p>
                  </div>
                  <div className="agents-right">
                    <p className="small-count">87</p>
                    <p className="small-count">21</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="user-actions">
              <button className="btn-approve">Approve KYC</button>
              <button className="btn-view">View User</button>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bottom-card critical-alerts">
            <h3>Critical Alerts</h3>
            <div className="alert-box kyc">
              <p className="alert-title">KYC pending</p>
              <p className="alert-desc">6</p>
              <p className="alert-note">Action Required</p>
            </div>
            <div className="alert-item">
              <p>Failed Payments</p>
              <p>Farmer ID: #12345 Payout</p>
              <button className="resolve-btn">Resolve</button>
            </div>
            <div className="alert-item">
              <p>Quality Issue</p>
              <p>Order ID: #12345 flagged for moisture Content</p>
              <button className="assign-btn">Assign Inspector</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;