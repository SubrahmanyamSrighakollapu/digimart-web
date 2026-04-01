// src/components/AgentDashboard/AgentSidebar.jsx

import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { MdCategory, MdAddBox } from 'react-icons/md';

// Import all sidebar icons
import Icon1 from '../../assets/AgentDashboard/Sidebar/Icon1.png';
import Icon2 from '../../assets/AgentDashboard/Sidebar/Icon2.png';
import Icon3 from '../../assets/AgentDashboard/Sidebar/Icon3.png';
import Icon4 from '../../assets/AgentDashboard/Sidebar/Icon4.png';
import Icon5 from '../../assets/AgentDashboard/Sidebar/Icon5.png';
import Icon6 from '../../assets/AgentDashboard/Sidebar/Icon6.png';

const AgentSidebar = ({ onClose }) => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const menuItems = [
    { icon: Icon1, title: 'Dashboard', path: '/agent' },
    { icon: Icon2, title: 'Buy From Farmers', path: '/agent/buy-from-farmers' },
    { icon: Icon3, title: 'Place Orders', path: '/agent/place-orders' },
    { 
      icon: Icon4, 
      title: 'Products', 
      hasDropdown: true,
      subItems: [
        { title: 'Add Product Category', path: '/agent/products/add-category', icon: MdCategory },
        { title: 'Add Product', path: '/agent/products/add-product', icon: MdAddBox }
      ]
    },
    { icon: Icon5, title: 'Vendor Payments', path: '/agent/vendor-payments' },
    { icon: Icon6, title: 'Settlements', path: '/agent/settlements' },
    { icon: Icon6, title: 'Reports', path: '/agent/reports' }
  ];

  const toggleDropdown = (index) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const sidebarStyles = {
    container: {
      backgroundColor: '#FBFFF6',
      borderRight: '0.5px solid #6B6B6B',
      height: 'auto',
      padding: '1rem',
      paddingTop: '0.5rem'
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      cursor: 'pointer',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s ease',
      marginBottom: '0.5rem',
      textDecoration: 'none',
      color: 'inherit'
    },
    activeItem: {
      backgroundColor: '#4BAF4747',
      fontWeight: '600'
    },
    icon: {
      width: '1.75rem',
      height: '1.75rem',
      opacity: 1
    },
    dropdownContainer: {
      marginBottom: '0.5rem',
    },
    subItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem 0.75rem 0.5rem 3rem',
      cursor: 'pointer',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s ease',
      textDecoration: 'none',
      color: 'inherit',
      fontSize: '0.9rem'
    },
    arrow: {
      marginLeft: 'auto',
      transition: 'transform 0.2s ease',
      fontSize: '0.8rem'
    }
  };

  const isActive = (path) => {
    if (path === '/agent') {
      return location.pathname === '/agent';
    }
    return location.pathname === path;
  };

  const isDropdownActive = (subItems) => {
    return subItems?.some(item => location.pathname === item.path);
  };

  return (
    <div style={sidebarStyles.container}>
      {menuItems.map((item, index) => (
        <div key={index} style={sidebarStyles.dropdownContainer}>
          {item.hasDropdown ? (
            <>
              <div
                style={{
                  ...sidebarStyles.item,
                  ...(isDropdownActive(item.subItems) ? sidebarStyles.activeItem : {})
                }}
                onClick={() => toggleDropdown(index)}
                onMouseEnter={(e) => {
                  if (!isDropdownActive(item.subItems)) {
                    e.currentTarget.style.backgroundColor = '#E8F5E9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDropdownActive(item.subItems)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <img 
                  src={item.icon} 
                  alt={item.title}
                  style={sidebarStyles.icon}
                />
                <p className="sidebar-title mb-0">{item.title}</p>
                <IoChevronForward 
                  style={{
                    ...sidebarStyles.arrow,
                    transform: openDropdowns[index] ? 'rotate(90deg)' : 'rotate(0deg)'
                  }}
                />
              </div>
              {openDropdowns[index] && (
                <div>
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
                          e.currentTarget.style.backgroundColor = '#E8F5E9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(subItem.path)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {subItem.icon && <subItem.icon size={16} style={{ marginRight: '8px' }} />}
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Link 
              to={item.path}
              onClick={onClose}
              style={{
                ...sidebarStyles.item,
                ...(isActive(item.path) ? sidebarStyles.activeItem : {})
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = '#E8F5E9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <img 
                src={item.icon} 
                alt={item.title}
                style={sidebarStyles.icon}
              />
              <p className="sidebar-title mb-0">{item.title}</p>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default AgentSidebar;