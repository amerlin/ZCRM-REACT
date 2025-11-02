import axios from 'axios';
import { appSettings } from './appSettings';

const httpClient = axios.create({
  baseURL: appSettings.apiServiceBaseUri,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem('basicAuthentication');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.token) {
          config.headers.Authorization = `Bearer ${authData.token}`;
        }
      } catch (error) {
        console.error('Failed to parse auth token', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('basicAuthentication');
      window.location.href = '/sign-in';
    }
    if (error.response?.status === 500) {
      console.error('Server error:', error);
    }
    return Promise.reject(error);
  }
);

export default httpClient;
