import api from './api';

const paymentService = {
  // Payment Methods
  managePaymentMethod: async (methodData) => {
    return await api.post('/payment/managemethods', methodData);
  },

  getPaymentMethods: async () => {
    return await api.get('/payment/getPaymentMethods/0/true');
  },

  deletePaymentMethod: async (id) => {
    return await api.delete(`/payment/deletePaymentMethod/${id}`);
  },

  // Payment Method Options
  managePaymentMethodOption: async (optionData) => {
    return await api.post('/payment/managePaymentMethodOptions', optionData);
  },

  getPaymentMethodOptions: async () => {
    return await api.get('/payment/getPaymentMethodOptions/0/0/true');
  },

  deletePaymentMethodOption: async (id) => {
    return await api.delete(`/payment/deletePaymentMethodOptions/${id}`);
  },

  // Payment Gateways
  manageGateway: async (gatewayData) => {
    return await api.post('/payment/manageGateway', gatewayData);
  },

  getGateways: async () => {
    return await api.get('/payment/getGateways/0/true');
  },

  deleteGateway: async (id) => {
    return await api.delete(`/payment/deleteGateway/${id}`);
  },

  // Gateway Method Mapping
  manageGatewayMethodMapping: async (data) => {
    return await api.post('/payment/manageGatewayMethodMapping', data);
  },

  getGatewayMethodMappings: async (gatewayId = 0, methodId = 0, status = true) => {
    return await api.get(`/payment/getGatewayMathodMappings/${gatewayId}/${methodId}/${status}`);
  },

  deleteGatewayMethodMapping: async (id) => {
    return await api.delete(`/payment/deleteGatewayMethodMapping/${id}`);
  }
};

export default paymentService;