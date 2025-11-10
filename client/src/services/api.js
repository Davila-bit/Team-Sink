import axios from 'axios';
import { auth } from '../config/firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (uid, role) => api.post('/auth/register', { uid, role }),
  verify: (token) => api.post('/auth/verify', { token }),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.post('/profile', data),
  deleteProfile: () => api.delete('/profile'),
};

export const resourceAPI = {
  getResources: (params) => api.get('/resources', { params }),
  getResource: (id) => api.get(`/resources/${id}`),
  createResource: (data) => api.post('/resources', data),
  updateResource: (id, data) => api.put(`/resources/${id}`, data),
  deleteResource: (id) => api.delete(`/resources/${id}`),
};

export const bookmarkAPI = {
  getBookmarks: () => api.get('/bookmarks'),
  addBookmark: (resourceId) => api.post('/bookmarks', { resourceId }),
  removeBookmark: (id) => api.delete(`/bookmarks/${id}`),
};

export const partnerAPI = {
  getPartners: (verified) => api.get('/partners', { params: { verified } }),
  getPartner: (id) => api.get(`/partners/${id}`),
  registerPartner: (data) => api.post('/partners', data),
  updatePartner: (id, data) => api.put(`/partners/${id}`, data),
  verifyPartner: (id) => api.post(`/partners/${id}/verify`),
  deletePartner: (id) => api.delete(`/partners/${id}`),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  createNotification: (data) => api.post('/notifications', data),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;
