import api from './api';

const planService = {
  // Plan Gateway Role Configuration
  managePlanGatewayRoleConfig: async (configData) => {
    return await api.post('/plan/managePlanGatewayRoleConfig', configData);
  },

  getAllPlanGatewayRoleConfig: async (id = 0) => {
    const payload = {
      planConfigId: 0,
      planId: 0,
      gatewayId: 0,
      roleId: 0,
      isActive: true
    };
    return await api.post(`/plan/getAllPlanGatewayRoleConfig/${id}`, payload);
  },

  deletePlanGatewayRoleConfigById: async (id) => {
    return await api.delete(`/plan/deletePlanGatewayRoleConfigById/${id}`);
  },

  // Get Plans
  getPlans: async () => {
    return await api.get('/plan/getAllPlans/0/true');
  },

  // Get Plan Role Gateway Commissions
  getPlanRoleGatewayCommissions: async (payload) => {
    return await api.post('/plan/getPlanRoleGatewayCommissions', payload);
  },

  // Manage Plan Gateway Role Commission Mapping
  managePlanGatewayRoleCommission: async (commissionData) => {
    return await api.post('/plan/planGatewayRoleCommissionMapp', commissionData);
  }
};

export default planService;