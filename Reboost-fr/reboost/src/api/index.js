import axios from 'axios';
import { JWT_TOKEN_KEY } from '../contexts/Auth.context';

const baseUrl = import.meta.env.VITE_API_URL;

if (!baseUrl) {
  console.warn('API URL not set. Please set VITE_API_URL in .env');
}

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(JWT_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && 
        (error.config.url.includes('sessions') || error.config.url.includes('auth'))) {
      console.error('Authentication error:', error.response?.data?.error || error.message);
      return Promise.resolve({ error: error.response?.data || error.message });
    }
    
    return Promise.reject(error);
  }
);

export const get = async (endpoint) => {
  try {
    const response = await api.get(`/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to GET ${endpoint}:`, error);
    throw error;
  }
};

export const getAll = async (endpoint) => {
  try {
    const response = await api.get(`/${endpoint}`);
    return response.data.items || response.data;
  } catch (error) {
    console.error(`Failed to GET all ${endpoint}:`, error);
    throw error;
  }
};

export const getById = async (endpoint) => {
  try {
    const response = await api.get(`/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to GET ${endpoint}:`, error);
    throw error;
  }
};

export const post = async (endpoint, { arg }) => {
  try {
    const response = await api.post(`/${endpoint}`, arg);
    return response.data;
  } catch (error) {
    if (endpoint === 'sessions' && error.response?.status === 401) {
      console.error('Login failed:', error.response?.data?.error || error.message);
      return { error: error.response?.data || error.message };
    }
    console.error(`Failed to POST to ${endpoint}:`, error);
    throw error;
  }
};

export const save = async (endpoint, { arg }) => {
  const { id, ...data } = arg;
  
  try {
    if (id) {
      const response = await api.put(`/${endpoint}/${id}`, data);
      return response.data;
    } else {
      const response = await api.post(`/${endpoint}`, data);
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to SAVE ${endpoint}:`, error);
    throw error;
  }
};

export const deleteById = async (endpoint, { arg }) => {
  try {
    if (Array.isArray(arg)) {
      const [resourceEndpoint, id] = arg;
      
      if (!id) {
        throw new Error('ID is required for deleteById operation');
      }
      
      const formattedEndpoint = resourceEndpoint.endsWith('/') ? resourceEndpoint.slice(0, -1) : resourceEndpoint;
      
      const response = await api.delete(`/${formattedEndpoint}/${id}`);
      
      return response.data;
    } else {
      const id = arg;
      
      if (!id) {
        throw new Error('ID is required for deleteById operation');
      }
      
      const formattedEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
      
      const response = await api.delete(`/${formattedEndpoint}/${id}`);
      
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to DELETE ${endpoint}/${Array.isArray(arg) ? arg[1] : arg}:`, error);
    throw error;
  }
};

export default api;
      