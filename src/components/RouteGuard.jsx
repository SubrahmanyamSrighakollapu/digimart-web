import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RouteGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;

    // Only strictly guard /admin and /agent
    // Distributor routes (/super-distributor, /master-distributor, /distributor)
    // are allowed through — they have their own routes defined
    const strictlyProtected = path.startsWith('/admin') || path.startsWith('/agent');
    if (!strictlyProtected || path.startsWith('/payment')) return;

    const token = sessionStorage.getItem('token');
    const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';

    if (!token || !isAuth) {
      toast.error('Please login to continue');
      navigate('/login', { replace: true });
      return;
    }

    // Role-based cross-access restrictions
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const role = user?.roleName;
      if (!role) return;

      // Admin cannot access agent dashboard
      if (path.startsWith('/agent') && (role === 'Super Admin' || role === 'Admin')) {
        navigate('/admin', { replace: true });
        return;
      }

      // Agent/Supervisor cannot access admin dashboard
      if (path.startsWith('/admin') && (role === 'Agent' || role === 'Supervisor')) {
        navigate('/agent', { replace: true });
        return;
      }

      // Distributor roles cannot access /admin or /agent
      const distributorRoles = ['Super Distributor', 'Master Distributor', 'Distributor'];
      if (distributorRoles.includes(role)) {
        const defaultRoute =
          role === 'Super Distributor' ? '/super-distributor' :
          role === 'Master Distributor' ? '/master-distributor' :
          '/distributor';
        navigate(defaultRoute, { replace: true });
        return;
      }
    } catch {}

  }, [location.pathname, navigate]);

  return children;
};

export default RouteGuard;
