import api from './api';

// User Management API Services
export const userService = {
  // Create User (Onboard User)
  createUser: async (userData) => {
    return await api.post('/auth/users/onboarduser', userData);
  },

  // Get All Users
  getAllUsers: async () => {
    return await api.get('/auth/users/getAll');
  },

  // Get User by ID
  getUserById: async (userId) => {
    return await api.get(`/auth/users/getUserById/${userId}`);
  },

  // Update User
  updateUser: async (userId, userData) => {
    return await api.put(`/users/${userId}`, userData);
  },

  // Delete User
  deleteUser: async (userId) => {
    return await api.delete(`/users/${userId}`);
  },

  // Update User Status
  updateUserStatus: async (userId, payload) => {
    return await api.post(`/auth/users/updateUserStatus/${userId}`, payload);
  },
};

export default userService;