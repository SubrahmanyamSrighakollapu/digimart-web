import api from './api';

const employeeService = {
  // Create/Update employee
  onboardEmployee: async (employeeData) => {
    return await api.post('/employees/onboardEmployee', employeeData);
  },

  // Get all employees
  getAllEmployees: async (payload = {
    empId: 0,
    departmentId: 0,
    roleId: 0,
    statusId: 0,
    isActive: null
  }) => {
    return await api.post('/employees/getEmployees', payload);
  },

  // Toggle employee active status
  toggleEmployeeStatus: async (userId, isActive) => {
    return await api.patch('/employees/toggleActive', {
      userId,
      isActive
    });
  }
};

export default employeeService;