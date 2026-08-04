export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/admin/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/admin/change-password',
  },
  DASHBOARD: {
    HOME: '/dashboard/admin',
  },
  SELLERS: {
    LIST: '/sellers',
    DETAILS: (id) => `/sellers/${id}`,
  },
  CUSTOMERS: {
    LIST: '/customers',
  },
  SUBSCRIPTIONS: {
    LIST: '/subscriptions',
    DETAILS: (id) => `/subscriptions/${id}`,
    APPROVE: (id) => `/subscriptions/${id}/approve`,
    REJECT: (id) => `/subscriptions/${id}/reject`,
    PLANS: {
      LIST: '/subscriptions/plans',
      DETAILS: (id) => `/subscriptions/plans/${id}`,
      CREATE: '/subscriptions/plans',
      UPDATE: (id) => `/subscriptions/plans/${id}`,
      DELETE: (id) => `/subscriptions/plans/${id}`,
    },
  },
  ADVERTISEMENTS: {
    LIST: '/advertisements',
    CREATE: '/advertisements',
    DETAILS: (id) => `/advertisements/${id}`,
    UPDATE: (id) => `/advertisements/${id}`,
    DELETE: (id) => `/advertisements/${id}`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    CREATE: '/notifications',
    DELETE: (id) => `/notifications/${id}`,
  },
  SETTINGS: {
    TRIAL_DURATION: '/settings/trial-duration',
  },
  CRASH_LOGS: {
    LIST: '/crash-logs',
    DETAILS: (id) => `/crash-logs/${id}`,
    DELETE: (id) => `/crash-logs/${id}`,
  },
}
