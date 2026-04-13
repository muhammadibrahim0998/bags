import axios from 'axios';

// Ensure this environment variable in Vercel is: https://cbu5b9pz.up.railway.app
const API_BASE = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true, // Required for cross-site cookies (Vercel to Railway)
});

// Request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for centralized error logging
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const message = error.response?.data?.message || error.message;
  console.error(`[API Error ${error.response?.status}]:`, message);
  return Promise.reject(error);
});

// --- AUTH API ---
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// --- ITEMS API ---
export const getItems = async () => {
  const response = await api.get('/items');
  return response.data;
};

export const getItem = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await api.post('/items', itemData);
  return response.data;
};

export const updateItem = async (id, itemData, password, role) => {
  const response = await api.put(`/items/${id}`, itemData, {
    headers: { 
      'x-owner-password': password,
      'x-user-role': role
    }
  });
  return response.data;
};

export const deleteItem = async (id, password, role) => {
  const response = await api.delete(`/items/${id}`, {
    headers: { 
      'x-owner-password': password,
      'x-user-role': role
    }
  });
  return response.data;
};

// --- UPLOAD API ---
export const uploadImages = async (files) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append('images', file);
  }
  
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.images; 
};

// --- SALES API ---
export const getSales = async () => {
  const response = await api.get('/sales');
  return response.data;
};

export const createSale = async (saleData) => {
  const response = await api.post('/sales', saleData);
  return response.data;
};

export const updateSale = async (id, saleData, password, role) => {
  const response = await api.put(`/sales/${id}`, saleData, {
    headers: { 
      'x-owner-password': password,
      'x-user-role': role
    }
  });
  return response.data;
};

export const deleteSale = async (id, password, role) => {
  const response = await api.delete(`/sales/${id}`, {
    headers: { 
      'x-owner-password': password,
      'x-user-role': role
    }
  });
  return response.data;
};

export const returnSale = async (id, returnData, password, role) => {
  const response = await api.put(`/sales/${id}/return`, returnData, {
    headers: { 
      'x-owner-password': password,
      'x-user-role': role
    }
  });
  return response.data;
};

// --- USER MANAGEMENT API ---
export const getUsers = async (role) => {
  const response = await api.get('/users', {
    headers: { 'x-user-role': role }
  });
  return response.data;
};

export const createUser = async (userData, role) => {
  const response = await api.post('/users', userData, {
    headers: { 'x-user-role': role }
  });
  return response.data;
};

export const updateUser = async (id, userData, role) => {
  const response = await api.put(`/users/${id}`, userData, {
    headers: { 'x-user-role': role }
  });
  return response.data;
};

export const deleteUser = async (id, role) => {
  const response = await api.delete(`/users/${id}`, {
    headers: { 'x-user-role': role }
  });
  return response.data;
};

export const getSystemUpdates = async () => {
  const response = await api.get('/updates');
  return response.data;
};

export default api;