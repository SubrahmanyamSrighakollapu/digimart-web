// src/components/AdminDashboard/AdminSidebar.jsx

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import { 
  MdDashboard, 
  MdInventory, 
  MdAssessment, 
  MdIntegrationInstructions, 
  MdPeople, 
  MdSettings, 
  MdLanguage, 
  MdAccountBalanceWallet,
  MdPause,
  MdTrendingUp,
  MdPayment,
  MdAttachMoney,
  MdPersonAdd,
  MdList,
  MdAccountBalance,
  MdLock,
  MdPerson,
  MdDescription,
  MdBusiness,
  MdTextFields,
  MdAnnouncement,
  MdMonetizationOn,
  MdCreditCard,
  MdSecurity,
  MdArticle,
  MdUndo,
  MdKeyboardArrowRight,
  MdSupervisorAccount,
  MdGroupAdd,
  MdWork
} from 'react-icons/md';

const AdminSidebar = ({ onClose }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const isLimitedAccess = authService.isLimitedAccess();
  
  // Get base route based on user role
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const getBaseRoute = () => {
    if (user.roleName === 'Super Distributor') return '/super-distributor';
    if (user.roleName === 'Master Distributor') return '/master-distributor';
    if (user.roleName === 'Distributor') return '/distributor';
    return '/admin';
  };
  const baseRoute = getBaseRoute();

  const allMenuItems = [
    { 
      icon: MdDashboard, 
      title: 'Dashboard', 
      path: baseRoute 
    },
    { 
      icon: MdInventory, 
      title: 'Products', 
      path: `${baseRoute}/products` 
    },
    { 
      icon: MdAssessment, 
      title: 'Reports', 
      hasDropdown: true,
      subItems: [
        { icon: MdPause, title: 'Hold Transactions', path: `${baseRoute}/reports/hold-transactions` },
        { icon: MdTrendingUp, title: 'Transaction Reports', path: `${baseRoute}/reports/transaction-reports` }
      ]
    },
    { 
      icon: MdIntegrationInstructions, 
      title: 'Integration', 
      hasDropdown: true,
      subItems: [
        { icon: MdPayment, title: 'Add Payment Gateway', path: `${baseRoute}/integration/add-payment-gateway` },
        { icon: MdPayment, title: 'Payment Gateway Setup', path: `${baseRoute}/integration/payment-gateway-setup` },
        { icon: MdAttachMoney, title: 'Charge', path: `${baseRoute}/integration/charge` }
      ]
    },
    { 
      icon: MdPeople, 
      title: 'User Management', 
      hasDropdown: true,
      subItems: [
        { icon: MdSettings, title: 'User Settings', path: `${baseRoute}/user-management/user-service-settings` },
        { icon: MdPersonAdd, title: 'Add User', path: `${baseRoute}/user-management/create-user` },
        { icon: MdList, title: 'User List', path: `${baseRoute}/user-management/users-list` },
        { icon: MdAccountBalance, title: 'Add Wallet', path: `${baseRoute}/user-management/add-wallet` },
        { icon: MdLock, title: 'Hold Funds', path: `${baseRoute}/user-management/hold-funds` }
      ]
    },
    { 
      icon: MdSupervisorAccount, 
      title: 'Agent Management', 
      hasDropdown: true,
      subItems: [
        { icon: MdGroupAdd, title: 'Add Agent', path: `${baseRoute}/agent-management/add-agent` },
        { icon: MdList, title: 'Agent List', path: `${baseRoute}/agent-management/agents-list` }
      ]
    },
    { 
      icon: MdWork, 
      title: 'Employee Management', 
      hasDropdown: true,
      subItems: [
        { icon: MdPersonAdd, title: 'Add Employee', path: `${baseRoute}/employee-management/add-employee` },
        { icon: MdList, title: 'Employees List', path: `${baseRoute}/employee-management/employees-list` }
      ]
    },
    { 
      icon: MdSettings, 
      title: 'Admin Settings', 
      hasDropdown: true,
      subItems: [
        { icon: MdPerson, title: 'Role', path: `${baseRoute}/admin-settings/roles-management` },
        { icon: MdDescription, title: 'Plans', path: `${baseRoute}/admin-settings/plans-management` },
        { icon: MdBusiness, title: 'Plan Commission', path: `${baseRoute}/admin-settings/plan-commission-manager` },
        { icon: MdBusiness, title: 'Plan Commission Config', path: `${baseRoute}/admin-settings/plan-commission-configuration` },
        { icon: MdTextFields, title: 'Scroll Text', path: `${baseRoute}/admin-settings/scroll-text-manager` },
        { icon: MdAnnouncement, title: 'Notice Board', path: `${baseRoute}/admin-settings/notice-board-manager` },
        { icon: MdMonetizationOn, title: 'Payout Charges', path: `${baseRoute}/admin-settings/payout-charges-manager` },
        { icon: MdAccountBalanceWallet, title: 'Minimum Wallet Balance', path: `${baseRoute}/admin-settings/set-balance-requirement` },
        { icon: MdCreditCard, title: 'Payment Methods', path: `${baseRoute}/admin-settings/payment-methods-manager` }
      ]
    },
    { 
      icon: MdLanguage, 
      title: 'Website Settings', 
      hasDropdown: true,
      subItems: [
        { icon: MdSecurity, title: 'Privacy Policy', path: `${baseRoute}/website-settings/privacy-policy` },
        { icon: MdArticle, title: 'Terms & Conditions', path: `${baseRoute}/website-settings/terms-conditions` },
        { icon: MdUndo, title: 'Refund Policy', path: `${baseRoute}/website-settings/refund-policy` }
      ]
    },
    { 
      icon: MdAccountBalanceWallet, 
      title: 'Wallet Management', 
      path: `${baseRoute}/wallet-management` 
    },
  ];

  // Filter menu items based on role
  const menuItems = isLimitedAccess ? allMenuItems.filter(item => 
    item.title === 'Dashboard' || 
    item.title === 'Agent Management' || 
    item.title === 'User Management' || 
    item.title === 'Reports'
  ) : allMenuItems;

  const sidebarStyles = {
    container: {
      backgroundColor: '#FBFFF6',
      borderRight: '1px solid #d1d5db',
      height: 'auto',
      padding: '1.5rem 0',
      marginTop: '1.85rem',
      boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.875rem 1.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '0.25rem',
      textDecoration: 'none',
      color: '#374151',
      fontSize: '0.95rem',
      fontWeight: '500',
      borderLeft: '3px solid transparent'
    },
    activeItem: {
      backgroundColor: '#dcfce7',
      color: '#16a34a',
      fontWeight: '600',
      borderLeftColor: '#16a34a'
    },
    icon: {
      fontSize: '1.25rem',
      width: '1.5rem',
      textAlign: 'center',
      flexShrink: 0,
      color: 'inherit'
    },
    dropdownContainer: {
      marginBottom: '0.25rem'
    },
    dropdownHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      padding: '0.875rem 1.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      color: '#374151',
      fontSize: '0.95rem',
      fontWeight: '500',
      borderLeft: '3px solid transparent'
    },
    dropdownContent: {
      backgroundColor: '#f0fdf4',
      borderLeft: '3px solid #bbf7d0',
      marginLeft: '1.5rem',
      marginRight: '0.5rem',
      borderRadius: '0 8px 8px 0'
    },
    subItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '0.125rem',
      textDecoration: 'none',
      color: '#374151',
      fontSize: '0.875rem',
      fontWeight: '500',
      borderRadius: '6px'
    },
    subIcon: {
      fontSize: '1rem',
      width: '1.25rem',
      textAlign: 'center',
      flexShrink: 0,
      color: 'inherit'
    },
    arrow: {
      transition: 'transform 0.2s ease',
      fontSize: '1.25rem',
      color: '#6b7280'
    },
    arrowOpen: {
      transform: 'rotate(90deg)'
    }
  };

  const isActive = (path) => {
    if (path === baseRoute) {
      return location.pathname === baseRoute;
    }
    return location.pathname === path;
  };

  const isDropdownActive = (subItems) => {
    return subItems.some(item => location.pathname === item.path);
  };

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <div style={sidebarStyles.container}>
      {menuItems.map((item, index) => {
        if (item.hasDropdown) {
          const isOpen = openDropdown === index;
          const isDropdownItemActive = isDropdownActive(item.subItems);
          
          return (
            <div key={index} style={sidebarStyles.dropdownContainer}>
              <div
                style={{
                  ...sidebarStyles.dropdownHeader,
                  ...(isDropdownItemActive ? sidebarStyles.activeItem : {})
                }}
                onClick={() => toggleDropdown(index)}
                onMouseEnter={(e) => {
                  if (!isDropdownItemActive) {
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDropdownItemActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <item.icon style={sidebarStyles.icon} />
                  <span className="sidebar-title">{item.title}</span>
                </div>
                <MdKeyboardArrowRight style={{
                  ...sidebarStyles.arrow,
                  ...(isOpen ? sidebarStyles.arrowOpen : {})
                }} />
              </div>
              
              {isOpen && (
                <div style={sidebarStyles.dropdownContent}>
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      onClick={onClose}
                      style={{
                        ...sidebarStyles.subItem,
                        ...(isActive(subItem.path) ? sidebarStyles.activeItem : {})
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive(subItem.path)) {
                          e.currentTarget.style.backgroundColor = '#dcfce7';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(subItem.path)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <subItem.icon style={sidebarStyles.subIcon} />
                      <span>{subItem.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }
        
        return (
          <Link 
            key={index} 
            to={item.path}
            onClick={onClose}
            style={{
              ...sidebarStyles.item,
              ...(isActive(item.path) ? sidebarStyles.activeItem : {})
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = '#f0fdf4';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <item.icon style={sidebarStyles.icon} />
            <span className="sidebar-title">{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminSidebar;