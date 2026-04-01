import { CreditCard, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles/authStyles';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    aadhaarNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // only display the first visible error to avoid multiple stacked messages
  const visibleErrorKey = Object.keys(errors).find(k => errors[k] && touched[k]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
          }
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number';
        } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) {
          error = 'Password must contain at least one special character';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      case 'aadhaarNumber':
        if (!value) {
          error = 'Aadhaar number is required';
        } else if (!/^\d{12}$/.test(value)) {
          error = 'Aadhaar must be exactly 12 digits';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Only allow digits for Aadhaar
    if (name === 'aadhaarNumber') {
      value = value.replace(/\D/g, '');
    }

    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error
      });
    }

    // Re-validate confirm password when password changes
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = formData.confirmPassword !== value ? 'Passwords do not match' : '';
      setErrors({
        ...errors,
        confirmPassword: confirmError
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      aadhaarNumber: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Signup:', formData);
      navigate('/otp-verification', { state: { aadhaarNumber: formData.aadhaarNumber } });
    }
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${styles.backgroundImage})` }}>
      <div className={styles.card}>
        <div className={styles.avatarCircle}>
          <User className={styles.avatarIcon} />
        </div>
        
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Sign Up to continue</p>
        
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <div className={styles.inputWrapper} style={{ 
              border: errors.email && touched.email ? '1px solid #d32f2f' : 'none' 
            }}>
              <div className={styles.inputIcon}>
                <Mail />
              </div>
              <input
                type="email"
                name="email"
                className={styles.inputField}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            {visibleErrorKey === 'email' && (
              <p className="error-text">{errors.email}</p>
            )} 
          </div>
          
          <div>
            <div className={styles.inputWrapper} style={{ 
              border: errors.password && touched.password ? '1px solid #d32f2f' : 'none',
              position: 'relative'
            }}>
              <div className={styles.inputIcon}>
                <Lock />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={styles.inputField}
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {visibleErrorKey === 'password' && (
              <p className="error-text">{errors.password}</p>
            )} 
          </div>
          
          <div>
            <div className={styles.inputWrapper} style={{ 
              border: errors.confirmPassword && touched.confirmPassword ? '1px solid #d32f2f' : 'none',
              position: 'relative'
            }}>
              <div className={styles.inputIcon}>
                <Lock />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                className={styles.inputField}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {visibleErrorKey === 'confirmPassword' && (
              <p className="error-text">{errors.confirmPassword}</p>
            )} 
          </div>
          
          <div>
            <div className={styles.inputWrapper} style={{ 
              border: errors.aadhaarNumber && touched.aadhaarNumber ? '1px solid #d32f2f' : 'none' 
            }}>
              <div className={styles.inputIcon}>
                <CreditCard />
              </div>
              <input
                type="text"
                name="aadhaarNumber"
                className={styles.inputField}
                placeholder="Enter Aadhaar Number"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="12"
              />
            </div>
            {visibleErrorKey === 'aadhaarNumber' && (
              <p className="error-text">{errors.aadhaarNumber}</p>
            )} 
            <p className={styles.infoText}>
              Your Aadhaar details will be used for identity verification.
            </p>
          </div>
          
          {/* <div>
            <div className={styles.inputWrapper} style={{ 
              border: errors.panNumber && touched.panNumber ? '1px solid #d32f2f' : 'none' 
            }}>
              <div className={styles.inputIcon}>
                <CreditCard />
              </div>
              <input
                type="text"
                name="panNumber"
                className={styles.inputField}
                placeholder="Enter Your PAN Card Number"
                value={formData.panNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="10"
              />
            </div>
            {errors.panNumber && touched.panNumber && (
              <p className="error-text">{errors.panNumber}</p>
            )}
            <p className={styles.infoText}>
              PAN is required for KYC verification.
            </p>
          </div> */}
          
          <button type="submit" className={styles.button}>
            Send OTP
          </button>
        </form>
        
        <p className={styles.linkText}>
          Already have an account? <a onClick={() => navigate('/login')}>Log In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;