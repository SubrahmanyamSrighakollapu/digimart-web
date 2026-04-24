import authUtils from '../utils/authUtils';

// Define role-based route permissions
const ROLE_PERMISSIONS = {
  'Super Admin': {
    allowedRoutes: ['/admin', '/home', '/shop', '/cart', '/about', '/services', '/contact'],
    defaultRoute: '/admin',
    restrictedRoutes: ['/agent']
  },
  'Admin': {
    allowedRoutes: ['/admin', '/home', '/shop', '/cart', '/about', '/services', '/contact'],
    defaultRoute: '/admin',
    restrictedRoutes: ['/agent']
  },
  'Super Distributor': {
    allowedRoutes: ['/super-distributor', '/home', '/shop', '/cart', '/about', '/services', '/contact'],
    defaultRoute: '/super-distributor',
    restrictedRoutes: ['/admin', '/agent', '/master-distributor', '/distributor'],
    limitedAccess: true
  },
  'Master Distributor': {
    allowedRoutes: ['/master-distributor', '/home', '/shop', '/cart', '/about', '/services', '/contact'],
    defaultRoute: '/master-distributor',
    restrictedRoutes: ['/admin', '/agent', '/super-distributor', '/distributor'],
    limitedAccess: true
  },
  'Distributor': {
    allowedRoutes: ['/distributor', '/home', '/shop', '/cart', '/about', '/services', '/contact'],
    defaultRoute: '/distributor',
    restrictedRoutes: ['/admin', '/agent', '/super-distributor', '/master-distributor'],
    limitedAccess: true
  },
  'Agent': {
    allowedRoutes: ['/agent', '/home', '/shop', '/cart', '/about', '/services', '/contact'],
    defaultRoute: '/agent',
    restrictedRoutes: ['/admin']
  },
  'Supervisor': {
    allowedRoutes: ['/agent', '/home', '/shop', '/cart', '/about', '/services', '/contact'],
    defaultRoute: '/agent',
    restrictedRoutes: ['/admin']
  },
  'Employee': {
    allowedRoutes: ['/home', '/shop', '/cart', '/about', '/services', '/contact'],
    defaultRoute: '/home',
    restrictedRoutes: ['/admin', '/agent']
  },
  'User': {
    allowedRoutes: ['/home', '/shop', '/cart', '/about', '/services', '/contact'],
    defaultRoute: '/home',
    restrictedRoutes: ['/admin', '/agent']
  },
  'Farmer': {
    allowedRoutes: ['/home', '/shop', '/cart', '/about', '/services', '/contact'],
    defaultRoute: '/home',
    restrictedRoutes: ['/admin', '/agent']
  }
};

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/admin', '/agent', '/super-distributor', '/master-distributor', '/distributor'];

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/otp-verification', '/', '/home', '/shop', '/cart', '/about', '/services', '/contact'];

export const authService = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return authUtils.isAuthenticated() && authUtils.getToken() && authUtils.getUser();
  },

  // Get user's role permissions
  getUserPermissions: () => {
    const user = authUtils.getUser();
    if (!user || !user.roleName) return null;
    
    return ROLE_PERMISSIONS[user.roleName] || ROLE_PERMISSIONS['User'];
  },

  // Check if user can access a specific route
  canAccessRoute: (route) => {
    // Allow access to public routes for everyone
    if (PUBLIC_ROUTES.some(publicRoute => route.startsWith(publicRoute))) {
      return true;
    }

    // Check if user is authenticated for protected routes
    if (!authService.isAuthenticated()) {
      return false;
    }

    const permissions = authService.getUserPermissions();
    if (!permissions) return false;

    // Check if route is explicitly restricted
    if (permissions.restrictedRoutes.some(restrictedRoute => route.startsWith(restrictedRoute))) {
      return false;
    }

    // Check if route is in allowed routes
    return permissions.allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute));
  },

  // Get redirect route based on user role and current route
  getRedirectRoute: (currentRoute) => {
    // If not authenticated and trying to access protected route
    if (!authService.isAuthenticated()) {
      if (PROTECTED_ROUTES.some(protectedRoute => currentRoute.startsWith(protectedRoute))) {
        return '/login';
      }
      return null; // Allow access to public routes
    }

    const permissions = authService.getUserPermissions();
    if (!permissions) return '/login';

    // If trying to access restricted route, redirect to default route
    if (permissions.restrictedRoutes.some(restrictedRoute => currentRoute.startsWith(restrictedRoute))) {
      return permissions.defaultRoute;
    }

    // If trying to access allowed route, allow it
    if (authService.canAccessRoute(currentRoute)) {
      return null; // No redirect needed
    }

    // Default redirect to user's default route
    return permissions.defaultRoute;
  },

  // Get user's default route after login
  getDefaultRoute: () => {
    const permissions = authService.getUserPermissions();
    return permissions ? permissions.defaultRoute : '/home';
  },

  // Check if current route requires authentication
  isProtectedRoute: (route) => {
    return PROTECTED_ROUTES.some(protectedRoute => route.startsWith(protectedRoute));
  },

  // Logout and clear authentication
  logout: () => {
    authUtils.clearAuth();
    return '/login';
  },

  // Get user role for display purposes
  getUserRole: () => {
    const user = authUtils.getUser();
    return user ? user.roleName : null;
  },

  // Check if user has admin privileges
  isAdmin: () => {
    const user = authUtils.getUser();
    return user && (user.roleName === 'Super Admin' || user.roleName === 'Admin');
  },

  // Check if user has agent privileges
  isAgent: () => {
    const user = authUtils.getUser();
    return user && (user.roleName === 'Agent' || user.roleName === 'Supervisor');
  },

  // Check if user has limited access (distributor roles)
  isLimitedAccess: () => {
    const user = authUtils.getUser();
    if (!user || !user.roleName) return false;
    const permissions = ROLE_PERMISSIONS[user.roleName];
    return permissions?.limitedAccess === true;
  },

  // Validate session and token expiry
  validateSession: () => {
    const token = authUtils.getToken();
    if (!token) return false;

    try {
      // Basic JWT token validation (check if expired)
      const parts = token.split('.');
      if (parts.length !== 3) return true; // not a standard JWT, allow through

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp && payload.exp < currentTime) {
        // Token expired, clear auth
        authUtils.clearAuth();
        return false;
      }

      return true;
    } catch (error) {
      // If we can't decode the token, don't clear auth — just allow through
      // The API will reject it if truly invalid
      console.warn('Token decode warning:', error.message);
      return true;
    }
  }
};

export default authService;