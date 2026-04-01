// Auth utility functions
export const authUtils = {
  // Get user data from session storage
  getUser: () => {
    try {
      const user = sessionStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get full user details from session storage
  getUserDetails: () => {
    try {
      const userDetails = sessionStorage.getItem('userDetails');
      return userDetails ? JSON.parse(userDetails) : null;
    } catch (error) {
      console.error('Error parsing user details:', error);
      return null;
    }
  },

  // Get token from session storage
  getToken: () => {
    return sessionStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  },

  // Get user role ID
  getUserRoleId: () => {
    const user = authUtils.getUser();
    return user ? user.roleId : null;
  },

  // Get user role name
  getUserRoleName: () => {
    const user = authUtils.getUser();
    return user ? user.roleName : null;
  },

  // Get user ID
  getUserId: () => {
    const user = authUtils.getUser();
    return user ? user.userId : null;
  },

  // Clear all auth data (logout)
  clearAuth: () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userDetails');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isAuthenticated');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authUtils.getUser();
    return user && user.roleName === 'Super Admin';
  }
};

export default authUtils;