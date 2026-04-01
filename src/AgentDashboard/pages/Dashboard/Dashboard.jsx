// src/AgentDashboard/pages/Dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Import images
import Icon1 from '../../../assets/AgentDashboard/Dashboard/Icon1.png';
import Icon2 from '../../../assets/AgentDashboard/Dashboard/Icon2.png';
import Icon3 from '../../../assets/AgentDashboard/Dashboard/Icon3.png';
import Icon4 from '../../../assets/AgentDashboard/Dashboard/Icon4.png';
import Icon5 from '../../../assets/AgentDashboard/Dashboard/Icon5.png';
import Icon6 from '../../../assets/AgentDashboard/Dashboard/Icon6.png';
import SidebarIcon2 from '../../../assets/AgentDashboard/Sidebar/Icon2.png';
import SidebarIcon3 from '../../../assets/AgentDashboard/Sidebar/Icon3.png';
import CustomerOrdersCards from './CustomerOrderCards';
import DashboardOverview from './DashboardOverview';
import NoticeBoardCard from '../../../components/AgentDashboard/NoticeBoardCard';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agents/getAgentDashboardDetails`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.status === 1 && data.result) {
        setDashboardData(data.result);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };
  // Alert Notifications
  const alerts = [
    {
      bg: '#FEFCE8',
      border: '#8D8213',
      text: 'Farmer Payout Pending for Order #2415',
      buttonText: 'View Order',
      buttonColor: '#8D8213'
    },
    {
      bg: '#EFF6FF',
      border: '#0F468C',
      text: 'Customer delivery confirmation awaited (Order #2345)',
      buttonText: 'Track',
      buttonColor: '#0F468C'
    }
  ];

  // Stats Cards - Dynamic
  const statsCards = dashboardData ? [
    {
      borderColor: '#0A6806',
      title: 'New Orders',
      icon: Icon1,
      iconBg: '#4BAF473B',
      number: dashboardData.stats.newOrders.count,
      subtitle: dashboardData.stats.newOrders.label
    },
    {
      borderColor: '#AA871B',
      title: 'To purchase',
      icon: SidebarIcon2,
      iconBg: '#FEFCE8',
      number: dashboardData.stats.toPurchase.count,
      subtitle: dashboardData.stats.toPurchase.label
    },
    {
      borderColor: '#3B82F6',
      title: 'In Transit',
      icon: Icon2,
      iconBg: '#EFF6FF',
      number: dashboardData.stats.inTransit.count,
      subtitle: dashboardData.stats.inTransit.label
    },
    {
      borderColor: '#A855F7',
      title: 'Farmer payout',
      icon: Icon1,
      iconBg: '#FAF5FF',
      number: `₹ ${parseFloat(dashboardData.stats.farmerPayout.amount).toLocaleString('en-IN')}`,
      subtitle: dashboardData.stats.farmerPayout.label
    },
    {
      borderColor: '#88DB15',
      title: 'Margin earned',
      icon: Icon3,
      iconBg: '#E6F6CF',
      number: `₹ ${parseFloat(dashboardData.stats.marginEarned.amount).toLocaleString('en-IN')}`,
      subtitle: dashboardData.stats.marginEarned.label
    }
  ] : [];

  // Quick Action Cards
  const quickActions = [
    { icon: SidebarIcon2, title: 'Buy From Farmers' },
    { icon: SidebarIcon3, title: 'Place Orders' }
  ];

  // Order Lifecycle - Dynamic
  const orderLifecycle = dashboardData ? [
    { icon: Icon4, bg: dashboardData.lifecycle.customerOrder > 0 ? '#4BAF47' : '#E8E8E8', border: dashboardData.lifecycle.customerOrder > 0 ? 'none' : '1px solid #B3B3B3', title: `Customer Order (${dashboardData.lifecycle.customerOrder})` },
    { icon: null, bg: dashboardData.lifecycle.agentPurchase > 0 ? '#4BAF47' : '#E8E8E8', border: dashboardData.lifecycle.agentPurchase > 0 ? 'none' : '1px solid #B3B3B3', title: `Agent purchase (${dashboardData.lifecycle.agentPurchase})` },
    { icon: Icon5, bg: dashboardData.lifecycle.farmerConfirm > 0 ? '#4BAF476B' : '#E8E8E8', border: '1px solid #4BAF47', title: `Farmer Confirm (${dashboardData.lifecycle.farmerConfirm})` },
    { icon: Icon2, bg: dashboardData.lifecycle.delivery > 0 ? '#4BAF476B' : '#E8E8E8', border: dashboardData.lifecycle.delivery > 0 ? '1px solid #4BAF47' : '1px solid #B3B3B3', title: `Delivery (${dashboardData.lifecycle.delivery})` },
    { icon: Icon1, bg: dashboardData.lifecycle.farmerPayment > 0 ? '#4BAF476B' : '#E8E8E8', border: dashboardData.lifecycle.farmerPayment > 0 ? '1px solid #4BAF47' : '1px solid #B3B3B3', title: `Farmer payment (${dashboardData.lifecycle.farmerPayment})` },
    { icon: Icon6, bg: dashboardData.lifecycle.closed > 0 ? '#4BAF47' : '#E8E8E8', border: dashboardData.lifecycle.closed > 0 ? 'none' : '1px solid #B3B3B3', title: `Closed (${dashboardData.lifecycle.closed})` }
  ] : [];

  return (
    <div className="container-fluid px-4 py-3">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
      {/* Alert Notifications */}
      <div className="row mb-4 g-3 mt-4">
        {alerts.map((alert, index) => (
          <div key={index} className="col-12 col-lg-6">
            <div 
              className="d-flex align-items-center justify-content-between p-3"
              style={{
                backgroundColor: alert.bg,
                border: `1px solid ${alert.border}`,
                borderRadius: '10px',
                minHeight: '3.9375rem'
              }}
            >
              <p className="text-inter-22 mb-0" style={{fontSize:"1rem"}}>{alert.text}</p>
              <p className="text-inter-22-medium mb-0" style={{ color: alert.buttonColor, fontSize:"1rem" }}>
                {alert.buttonText}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="row mb-4 g-3">
        {statsCards.map((card, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4 col-lg">
            <div 
              className="bg-white p-2 d-flex flex-column justify-content-around align-items-start"
              style={{
                // height: "6rem",
                borderLeft: `5px solid ${card.borderColor}`,
                borderRight: '0.8px solid #878787',
                borderTop: '0.8px solid #878787',
                borderBottom: '0.8px solid #878787',
                borderRadius: '10px',
                minHeight: '11.8125rem',
              }}
            >
              <div className="d-flex align-items-center justify-content-between g-5 mb-2">
                <p className="text-inter-22">{card.title}</p>
                <div className="icon-bg-small" style={{ backgroundColor: card.iconBg }}>
                  <img src={card.icon} alt={card.title} />
                </div>
              </div>
              <p className="text-number mb-1">{card.number}</p>
              <p className="text-gray-20 mb-0">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Order Lifecycle */}
      <div className="row g-3">
        {/* Quick Action Cards */}
        {quickActions.map((action, index) => (
          <div key={index} className="col-6 col-md-3 col-lg-2">
            <div 
              className="bg-white d-flex flex-column align-items-center justify-content-center p-3"
              style={{
                border: '0.8px solid #878787',
                borderRadius: '10px',
                minHeight: '11.4375rem'
              }}
            >
              <div 
                className="d-flex align-items-center justify-content-center mb-3"
                style={{
                  width: '3.125rem',
                  height: '3.125rem',
                  backgroundColor: '#CDCDCD3B',
                  borderRadius: '50%'
                }}
              >
                <img 
                  src={action.icon} 
                  alt={action.title}
                  style={{ width: '1.625rem', height: '1.625rem' }}
                />
              </div>
              <p className="text-inter-22 mb-0 text-center">{action.title}</p>
            </div>
          </div>
        ))}

        {/* Order Lifecycle Overview */}
        <div className="col-12 col-md-6 col-lg-8">
          <div 
            className="bg-white p-3"
            style={{
              border: '0.8px solid #878787',
              borderRadius: '10px',
              minHeight: '11.4375rem'
            }}
          >
            <p className="text-inter-22-medium mb-3">Order Lifecycle Overview</p>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-1">
              {orderLifecycle.map((step, index) => (
                <div key={index} className="d-flex flex-column align-items-center ">
                  <div 
                    className="icon-bg-medium d-flex align-items-center justify-content-center mb-2"
                    style={{
                      backgroundColor: step.bg,
                      border: step.border
                    }}
                  >
                    {step.icon && (
                      <img 
                        src={step.icon} 
                        alt={step.title}
                        style={{ width: '1.5rem', height: '1.5rem' }}
                      />
                    )}
                  </div>
                  <p className="text-gray-20 mb-0 text-center">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notice Board Card */}
      <NoticeBoardCard />

      <CustomerOrdersCards data={dashboardData} />
      <DashboardOverview data={dashboardData} />
        </>
      )}
    </div>
  );
};

export default Dashboard;