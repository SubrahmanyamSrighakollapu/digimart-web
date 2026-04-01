import api from './api';

// Agent Management API Services
export const agentService = {
  // Get All Agents
  getAllAgents: async () => {
    return await api.get('/agents/getAllAgentDetails');
  },

  // Create Agent
  createAgent: async (agentData) => {
    return await api.post('/agents/create', agentData);
  },

  // Onboard Agent (with file uploads)
  onboardAgent: async (formData) => {
    return await api.post('/agents/onboardAgent', formData);
  },

  // Update Agent
  updateAgent: async (agentId, agentData) => {
    return await api.put(`/agents/update/${agentId}`, agentData);
  },

  // Update Agent Status
  updateAgentStatus: async (payload) => {
    return await api.post('/agents/updateAgentStatus', payload);
  },

  // Get Agent Products
  getAgentProducts: async () => {
    return await api.get('/agents/getAgentProducts');
  },

  // Submit/Update Bank Details
  submitUpdateBankDetails: async (payload) => {
    return await api.post('/agents/submitUpdateBankDetails', payload);
  },

  // Delete Agent
  deleteAgent: async (agentId) => {
    return await api.delete(`/agents/delete/${agentId}`);
  },
};

export default agentService;