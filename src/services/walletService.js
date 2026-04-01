import api from './api';

// Wallet Management API Services
export const walletService = {
  // Credit Wallet
  creditWallet: async (walletData) => {
    return await api.post('/wallet/credit', walletData);
  },

  // Debit Wallet
  debitWallet: async (walletData) => {
    return await api.post('/wallet/debit', walletData);
  },

  // Get Wallet Balance
  getWalletBalance: async (userId) => {
    return await api.get(`/wallet/balance/${userId}`);
  },

  // Get Wallet Transactions
  getWalletTransactions: async (userId) => {
    return await api.get(`/wallet/transactions/${userId}`);
  },

  // Hold Funds
  holdFunds: async (holdData) => {
    return await api.post('/wallet/hold', holdData);
  },

  // Release Funds
  releaseFunds: async (holdId) => {
    return await api.patch(`/wallet/release/${holdId}`);
  },
};

export default walletService;