import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { styles } from '../styles/authStyles';
import badgeImg from '../assets/auth_Imgs/badge.png';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(35);
  const [error, setError] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);

  // Get masked phone from state or use default
  const aadhaarNumber = location.state?.aadhaarNumber || '';
  const maskedPhone = '+91 ××××× ××××';

  useEffect(() => {
    if (timer > 0) {
      setIsResendDisabled(true);
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const validateOtp = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return false;
    }

    if (!/^\d{6}$/.test(otpValue)) {
      setError('OTP must contain only numbers');
      return false;
    }

    setError('');
    return true;
  };

  const handleChange = (index, value) => {
    // Clear error when user starts typing
    if (error) setError('');

    // Handle multiple characters (paste scenario)
    if (value.length > 1) {
      handlePasteData(value);
      return;
    }

    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Clear error on any key press
    if (error) setError('');

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (otp[index]) {
        // Clear current box
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous box and clear it
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePasteData = (pastedData) => {
    // Only get first 6 digits
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length === 0) return;

    const newOtp = [...otp];
    digits.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    
    // Focus last filled box or last box
    const nextEmpty = newOtp.findIndex(val => !val);
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty].focus();
    } else {
      inputRefs.current[5].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    handlePasteData(pastedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateOtp()) {
      const otpCode = otp.join('');
      console.log('OTP Verified:', otpCode);
      navigate('/verified-success');
    }
  };

  const handleResend = () => {
    if (!isResendDisabled) {
      setTimer(35);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0].focus();
      console.log('OTP Resent');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${styles.backgroundImage})` }}>
      <div className={styles.card}>
        <img src={badgeImg} alt="Badge" className={styles.badgeImg} />
        
        <h1 className={styles.title}>OTP Verification</h1>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="otp-input-section">
            <label className="otp-label">
              Enter the 6-digit OTP sent to your Aadhaar-linked mobile number
            </label>
            
            <div className="masked-number">
              <CreditCard size={20} />
              <span>{maskedPhone}</span>
            </div>
            
            <div className={styles.otpContainer} onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className={styles.otpBox}
                  style={{
                    borderColor: error ? '#d32f2f' : '#055D69',
                    borderWidth: error ? '2px' : '0.2px'
                  }}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            
            {error && (
              <p className="error-text" style={{ textAlign: 'center' }}>{error}</p>
            )}
            
            <div className={styles.timerText}>
              {timer > 0 ? (
                `Resend OTP in ${formatTime(timer)}`
              ) : (
                <span 
                  onClick={handleResend} 
                  style={{ 
                    color: '#0A6806', 
                    cursor: 'pointer', 
                    fontWeight: 600 
                  }}
                >
                  Resend OTP
                </span>
              )}
            </div>
          </div>
          
          <button type="submit" className={styles.button}>
            Verify and Continue
          </button>
        </form>
        
        <p className="support-link">Having trouble? Contact Support</p>
        
        <p className={styles.linkText}>
          Already have an account? <a onClick={() => navigate('/login')}>Log In</a>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;