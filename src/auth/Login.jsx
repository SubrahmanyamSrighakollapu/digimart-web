import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { styles } from '../styles/authStyles';
import heroBg from '../assets/MainPage/super-market.jpg';
import api from '../services/api';
import userService from '../services/userService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const visibleErrorKey = Object.keys(errors).find(k => errors[k] && touched[k]);

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
          return 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        break;
      default:
        break;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.status === 1 && response.result) {
        const { user, token } = response.result;

        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('isAuthenticated', 'true');

        toast.success('Login successful!');

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
          api.get(`/auth/users/getAgentById/${user.userId}`)
            .then(res => {
              if (res.status === 1 && res.result)
                sessionStorage.setItem('agentDetails', JSON.stringify(res.result));
            })
            .catch(err => console.error('Failed to fetch agent details:', err));
          api.get(`/payment/wallet-details/${user.userId}`)
            .then(res => {
              if (res.status === 1 && res.result)
                sessionStorage.setItem('walletDetails', JSON.stringify(res.result));
            })
            .catch(err => console.error('Failed to fetch wallet details:', err));
        }

        navigate(redirectRoute);

        userService.getUserById(user.userId)
          .then(res => {
            if (res.status === 1 && res.result)
              sessionStorage.setItem('userDetails', JSON.stringify(res.result));
          })
          .catch(err => console.error('Failed to fetch user details:', err));
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(2px)',
        transform: 'scale(1.05)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        zIndex: 1,
      }} />
      <div className="auth-container" style={{ position: 'relative', zIndex: 2 }}>
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
                <div className={styles.inputIcon}><Mail /></div>
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
              {visibleErrorKey === 'email' && <p className="error-text">{errors.email}</p>}
            </div>

            <div>
              <div className={styles.inputWrapper} style={{
                border: errors.password && touched.password ? '1px solid #d32f2f' : 'none',
                position: 'relative'
              }}>
                <div className={styles.inputIcon}><Lock /></div>
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
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#64748b'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {visibleErrorKey === 'password' && <p className="error-text">{errors.password}</p>}
            </div>

            <div className="forget-password">
              <a href="#forgot">Forget Password?</a>
            </div>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className={styles.linkText}>
            Don't have an account?
            <a onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: '#EC5609', marginLeft: '4px' }}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
