import api from './api';

// Lookup API Services
export const lookupService = {
  // Get Business Types
  getBusinessTypes: async () => {
    return await api.get('/lookup/loadBusinessTypes');
  },

  // Get Agent Document Types
  getAgentDocumentTypes: async () => {
    return await api.get('/lookup/loadAgentDocumentsType');
  },

  // Get Employee Department Types
  getEmployeeDepartmentTypes: async () => {
    return await api.get('/lookup/loadEmployeeDepartmentTypes');
  },

  // Get User Role Master
  getUserRoleMaster: async (payload) => {
    return await api.post('/lookup/getuserrolemaster', payload);
  },

  // Get User Roles (helper method)
  getUserRoles: async () => {
    const payload = {
      roleId: 0,
      isEmployee: false,
      isActive: true
    };
    return await api.post('/lookup/getuserrolemaster', payload);
  },

  // Get Default Status Types
  getDefaultStatusTypes: async () => {
    return await api.get('/lookup/loadDefaultStatusTypes');
  },

  // Get Product Quantity Types
  getProductQuantityTypes: async () => {
    return await api.get('/lookup/loadProductQuantityTypes');
  },

  // Get Account Types
  getAccountTypes: async () => {
    return await api.get('/lookup/loadAccountTypes');
  },

  // Get Bank Names
  getBankNames: async () => {
    return await api.get('/lookup/loadBankNames');
  },

  // Get Product Status Types
  getProductStatusTypes: async () => {
    return await api.get('/lookup/loadProductStatusTypes');
  },
};

export default lookupService;