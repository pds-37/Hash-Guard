import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';
export const IS_MOCK_FALLBACK = 
  import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true' ||
  (typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('github.io')
  ) && (!import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL.includes('localhost')));

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Inject auth token
    const token = localStorage.getItem('cee_auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Inject organization ID if user is logged in
    const user = JSON.parse(localStorage.getItem('cee_user') || '{}');
    if (user.organization_id) {
      config.headers['X-Organization-ID'] = user.organization_id;
    }

    // Ensure FormData does not have Content-Type forced to application/json so browser can set boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('cee_auth_token');
      localStorage.removeItem('cee_user');
      window.location.href = '#/login';
    }
    console.warn('[API Client] Request failed:', error.message);
    return Promise.reject(error);
  }
);
