// src/components/Button/Button.jsx
import { useNavigate } from 'react-router-dom';

const Button = ({
  text,
  route,
  onClick,
  bgColor = '#EC5B13',
  className = '',
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Always redirect to login if not authenticated (marketing site)
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (onClick) onClick();
    if (route) navigate(route);
  };

  return (
    <button
      className={`btn text-white fw-semibold ${className}`}
      onClick={handleClick}
      disabled={disabled}
      style={{
        background: bgColor,
        borderRadius: '10px',
        padding: '12px',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {text}
    </button>
  );
};

export default Button;
