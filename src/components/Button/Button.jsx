// src/components/Button/Button.jsx
import { useNavigate } from 'react-router-dom';

const Button = ({ 
  text, 
  route, 
  onClick, 
  bgColor = '#4BAF47', 
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (route) {
      navigate(route);
    }
  };

  return (
    <button
      className={`btn text-white fw-semibold ${className}`}
      onClick={handleClick}
      style={{
        background: bgColor,
        borderRadius: '10px',
        padding: '12px',
        border: 'none'
      }}
    >
      {text}
    </button>
  );
};

export default Button;