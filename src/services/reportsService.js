import api from './api';

// Reports and Analytics API Services
export const reportsService = {
  // Get Transaction Reports
  getTransactionReports: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await api.get(`/reports/transactions?${queryParams}`);
  },

  // Get Hold Transactions
  getHoldTransactions: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await api.get(`/reports/hold-transactions?${queryParams}`);
  },

  // Get Dashboard Analytics
  getDashboardAnalytics: async () => {
    return await api.get('/reports/dashboard');
  },

  // Export Reports
  exportReports: async (reportType, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await api.get(`/reports/export/${reportType}?${queryParams}`);
  },
};

export default reportsService;