import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on authentication failure
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  getDashboardStats: async () => {
    const response = await api.get('/api/dashboard/stats');
    return response.data;
  },

  getEventsTimeline: async (days: number = 7) => {
    const response = await api.get(`/api/dashboard/events/timeline?days=${days}`);
    return response.data;
  },

  getRecentActivity: async (limit: number = 10) => {
    const response = await api.get(`/api/dashboard/recent-activity?limit=${limit}`);
    return response.data;
  },

  getPerformanceMetrics: async () => {
    const response = await api.get('/api/dashboard/performance-metrics');
    return response.data;
  },

  getViolationsByCategory: async () => {
    const response = await api.get('/api/dashboard/violations/by-category');
    return response.data;
  },

  getPoliciesByStatus: async () => {
    const response = await api.get('/api/dashboard/policies/by-status');
    return response.data;
  },

  getPolicies: async (params?: { skip?: number; limit?: number; status?: string; category?: string }) => {
    const response = await api.get('/api/policies/', { params });
    return response.data;
  },

  getPolicy: async (policyId: number) => {
    const response = await api.get(`/api/policies/${policyId}`);
    return response.data;
  },

  createPolicy: async (policyData: any) => {
    const response = await api.post('/api/policies/', policyData);
    return response.data;
  },

  updatePolicy: async (policyId: number, policyData: any) => {
    const response = await api.put(`/api/policies/${policyId}`, policyData);
    return response.data;
  },

  deletePolicy: async (policyId: number) => {
    const response = await api.delete(`/api/policies/${policyId}`);
    return response.data;
  },

  getPolicyTemplates: async () => {
    const response = await api.get('/api/policies/templates/');
    return response.data;
  },

  testPolicy: async (policyId: number, testData: any) => {
    const response = await api.post(`/api/policies/${policyId}/test`, testData);
    return response.data;
  },


  getEvents: async (params?: { 
    skip?: number; 
    limit?: number; 
    status?: string; 
    severity?: string; 
    policy_id?: number
  }) => {
    const response = await api.get('/api/events/', { params });
    return response.data;
  },

  getEvent: async (eventId: number) => {
    const response = await api.get(`/api/events/${eventId}`);
    return response.data;
  },

  createEvent: async (eventData: any) => {
    const response = await api.post('/api/events/', eventData);
    return response.data;
  },

  updateEvent: async (eventId: number, eventData: any) => {
    const response = await api.put(`/api/events/${eventId}`, eventData);
    return response.data;
  },

  getEventViolations: async (eventId: number) => {
    const response = await api.get(`/api/events/${eventId}/violations`);
    return response.data;
  },

  getEventStats: async () => {
    const response = await api.get('/api/events/stats/summary');
    return response.data;
  },

  getViolations: async (params?: { skip?: number; limit?: number; status?: string; severity?: string }) => {
    const response = await api.get('/api/violations/', { params });
    return response.data;
  },

  getViolation: async (violationId: number) => {
    const response = await api.get(`/api/violations/${violationId}`);
    return response.data;
  },

  updateViolation: async (violationId: number, violationData: any) => {
    const response = await api.put(`/api/violations/${violationId}`, violationData);
    return response.data;
  },

  connectWebSocket: (onMessage: (data: any) => void) => {
    const wsUrl = API_BASE_URL.replace('http', 'ws') + '/api/events/ws';
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return ws;
  },
};

export default api;
