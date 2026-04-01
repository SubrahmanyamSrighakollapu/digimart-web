// DiscoverMoreButton.jsx
import React from 'react';

const DiscoverMoreButton = ({ text = "Discover More", onClick = null, href = null }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.location.href = href;
    }
  };

  return (
    <button 
      style={styles.button}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#3d8f3a';
        e.currentTarget.style.transform = 'translateY(-0.1875rem)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#4BAF47';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {text}
    </button>
  );
};

const styles = {
  button: {
    width: '12.269rem',
    height: '3.625rem',
    background: '#4BAF47',
    color: 'white',
    fontFamily: 'Manrope, sans-serif',
    fontWeight: 700,
    fontSize: '0.875rem',
    lineHeight: '1.875rem',
    border: 'none',
    borderRadius: '0.625rem',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default DiscoverMoreButton;