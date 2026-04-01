// API Configuration and Base Setup
const API_BASE_URL = 'https://api.totalneeds.in/api';

// Get dynamic token from session storage
const getAuthToken = () => {
  return sessionStorage.getItem('token') || '';
};

// Base API function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;
  const token = getAuthToken();

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Throw the parsed JSON error so we can access error.message
      const error = new Error(data.message || `HTTP error! status: ${response.status}`);
      error.response = { data };
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// API Methods
export const api = {
  // GET request
  get: (endpoint) =>
    apiCall(endpoint, { method: 'GET' }),

  // POST request (JSON or FormData)
  post: (endpoint, data) =>
    apiCall(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  // PUT request (JSON or FormData)
  put: (endpoint, data) =>
    apiCall(endpoint, {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  // PATCH request (JSON or FormData)
  patch: (endpoint, data) =>
    apiCall(endpoint, {
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  // DELETE request
  delete: (endpoint) =>
    apiCall(endpoint, { method: 'DELETE' }),
};

export default api;
