const LOCAL_STORAGE_KEYS = {
  token: 'paymentToken',
  isAuthenticated: 'paymentIsAuthenticated',
  user: 'paymentUser',
  agentDetails: 'paymentAgentDetails',
  walletDetails: 'paymentWalletDetails',
  lastOrderId: 'lastOrderId',
  lastOrderCode: 'lastOrderCode',
};

const SESSION_STORAGE_KEYS = {
  token: 'token',
  isAuthenticated: 'isAuthenticated',
  user: 'user',
  agentDetails: 'agentDetails',
  walletDetails: 'walletDetails',
  lastOrderId: 'lastOrderId',
  lastOrderCode: 'lastOrderCode',
};

export const mirrorPaymentSessionToLocalStorage = (overrides = {}) => {
  Object.entries(SESSION_STORAGE_KEYS).forEach(([key, sessionKey]) => {
    const localKey = LOCAL_STORAGE_KEYS[key];
    const value = overrides[key] ?? sessionStorage.getItem(sessionKey);

    if (value !== null && value !== undefined && value !== '') {
      localStorage.setItem(localKey, String(value));
    }
  });
};

export const restorePaymentSessionFromLocalStorage = () => {
  Object.entries(SESSION_STORAGE_KEYS).forEach(([key, sessionKey]) => {
    const localKey = LOCAL_STORAGE_KEYS[key];
    const currentValue = sessionStorage.getItem(sessionKey);
    const fallbackValue = localStorage.getItem(localKey);

    if (!currentValue && fallbackValue) {
      sessionStorage.setItem(sessionKey, fallbackValue);
    }
  });
};

export const getPaymentToken = () =>
  sessionStorage.getItem('token') ||
  localStorage.getItem(LOCAL_STORAGE_KEYS.token) ||
  '';

export const getPaymentOrderCode = () =>
  sessionStorage.getItem('lastOrderCode') ||
  localStorage.getItem(LOCAL_STORAGE_KEYS.lastOrderCode) ||
  '';

export const getPaymentOrderId = () =>
  parseInt(
    sessionStorage.getItem('lastOrderId') ||
      localStorage.getItem(LOCAL_STORAGE_KEYS.lastOrderId) ||
      '0',
    10
  );
