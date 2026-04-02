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
      const user = authService.getUserPermissions();
      
      // Prevent Admin from accessing Agent dashboard
      if (currentPath.startsWith('/agent') && authService.isAdmin()) {
        toast.error('Access denied. Admins cannot access Agent dashboard.');
        navigate('/admin', { replace: true });
        return;
      }
      
      // Prevent Agent from accessing Admin dashboard
      if (currentPath.startsWith('/admin') && authService.isAgent()) {
        toast.error('Access denied. Agents cannot access Admin dashboard.');
        navigate('/agent', { replace: true });
        return;
      }
    }
  }, [location.pathname, navigate]);

  return children;
};

export default RouteGuard;