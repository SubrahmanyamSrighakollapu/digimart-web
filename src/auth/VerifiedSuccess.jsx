import { useNavigate } from 'react-router-dom';
import { styles } from '../styles/authStyles';

const VerifiedSuccess = () => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate('/home');
  }; 

  return (
    <div className="auth-container">
      <div className={styles.card}>
        <div className="success-content">
          <svg 
            className={styles.successImg} 
            viewBox="0 0 429 321" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Success Animation Illustration */}
            <circle cx="214.5" cy="160.5" r="120" fill="#E8F5E9" />
            <path 
              d="M214.5 80.5C168.9 80.5 131.5 117.9 131.5 163.5C131.5 209.1 168.9 246.5 214.5 246.5C260.1 246.5 297.5 209.1 297.5 163.5C297.5 117.9 260.1 80.5 214.5 80.5Z" 
              fill="#4CAF50"
            />
            <path 
              d="M186.5 163.5L206.5 183.5L246.5 143.5" 
              stroke="white" 
              strokeWidth="12" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <circle cx="214.5" cy="163.5" r="25" fill="white" opacity="0.3">
              <animate 
                attributeName="r" 
                from="25" 
                to="140" 
                dur="2s" 
                repeatCount="indefinite" 
              />
              <animate 
                attributeName="opacity" 
                from="0.3" 
                to="0" 
                dur="2s" 
                repeatCount="indefinite" 
              />
            </circle>
          </svg>
          
          <h1 className={`${styles.title} mt-3`}>
            We're verifying your details
          </h1>
          <p className={styles.subtitle}>
            This may take a few minutes. You'll be notified once it's done.
          </p>
          
          <button 
            onClick={handleDashboard} 
            className={`${styles.button} mt-4`}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifiedSuccess;