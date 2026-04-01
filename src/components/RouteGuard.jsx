import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const RouteGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Validate session first
    if (!authService.validateSession() && authService.isProtectedRoute(currentPath)) {
      toast.error('Please login to continue');
      navigate('/login', { replace: true });
      return;
    }

    // Check if user is authenticated for protected routes
    if (authService.isProtectedRoute(currentPath) && !authService.isAuthenticated()) {
      toast.error('Please login to continue');
      navigate('/login', { replace: true });
      return;
    }

    // Role-based route restrictions
    if (authService.isAuthenticated()) {
      const redirectRoute = authService.getRedirectRoute(currentPath);
      
      if (redirectRoute) {
        toast.error('Access denied. You do not have permission to access this page.');
        navigate(redirectRoute, { replace: true });
        return;
      }
    }
  }, [location.pathname, navigate]);

  return children;
};

export default RouteGuard;