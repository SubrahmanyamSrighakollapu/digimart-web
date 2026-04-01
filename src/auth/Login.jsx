import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { styles } from '../styles/authStyles';
import api from '../services/api';
import userService from '../services/userService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // show only the first visible error to avoid multiple messages and scrollbars
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
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      password: true
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });

        if (response.status === 1 && response.result) {
          const { user, token } = response.result;
          
          // Store basic user data and token
          sessionStorage.setItem('user', JSON.stringify(user));
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('isAuthenticated', 'true');
          
          toast.success('Login successful!');
          
          // Navigate based on user role
          let redirectRoute = '/home';
          
          if (user.roleName === 'Super Admin' || user.roleName === 'Admin') {
            redirectRoute = '/admin';
          } else if (user.roleName === 'Super Distributor') {
            redirectRoute = '/super-distributor';
          } else if (user.roleName === 'Master Distributor') {
            redirectRoute = '/master-distributor';
          } else if (user.roleName === 'Distributor') {
            redirectRoute = '/distributor';
          } else if (user.roleName === 'Agent' || user.roleName === 'Supervisor') {
            redirectRoute = '/agent';
            
            // Fetch agent details for agents
            api.get(`/auth/users/getAgentById/${user.userId}`)
              .then(agentDetailsResponse => {
                if (agentDetailsResponse.status === 1 && agentDetailsResponse.result) {
                  sessionStorage.setItem('agentDetails', JSON.stringify(agentDetailsResponse.result));
                }
              })
              .catch(error => {
                console.error('Failed to fetch agent details:', error);
              });
            
            // Fetch wallet details for agents
            api.get(`/payment/wallet-details/${user.userId}`)
              .then(walletResponse => {
                if (walletResponse.status === 1 && walletResponse.result) {
                  sessionStorage.setItem('walletDetails', JSON.stringify(walletResponse.result));
                }
              })
              .catch(error => {
                console.error('Failed to fetch wallet details:', error);
              });
          }
          
          navigate(redirectRoute);
          
          // Fetch full user details in background (non-blocking)
          userService.getUserById(user.userId)
            .then(userDetailsResponse => {
              if (userDetailsResponse.status === 1 && userDetailsResponse.result) {
                sessionStorage.setItem('userDetails', JSON.stringify(userDetailsResponse.result));
              }
            })
            .catch(error => {
              console.error('Failed to fetch user details:', error);
            });
        } else {
          toast.error(response.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${styles.backgroundImage})` }}>
      <div className={styles.card}>
        <div className={styles.avatarCircle}>
          <User className={styles.avatarIcon} />
        </div>
        
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign In to continue</p>
        
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
                placeholder="Enter your password"
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
          
          <div className="forget-password">
            <a href="#forgot">Forget Password?</a>
          </div>
          
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <p className={styles.linkText}>
          Don't have an account? <a onClick={() => navigate('/signup')}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;