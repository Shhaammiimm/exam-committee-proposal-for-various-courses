import axios from 'axios';

// Default to deployed backend; can be overridden with REACT_APP_API_BASE
const API_BASE = process.env.REACT_APP_API_BASE || 'https://exam-committee-proposal-for-various.vercel.app';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});
api.interceptors.request.use((config) => {
  Object.assign(config.headers, authHeaders());
  return config;
});

export const examApi = {
  save: (data) => api.post('/api/exam', data),
};

export const courseApi = {
  getCourses: () => api.get('/api/course'),
  save: (course) => api.post('/api/course', course),
};

export const committeeApi = {
  getTeachers: () => api.get('/api/committee/teachers'),
  save: (data) => api.post('/api/committee', data),
};

export const examRelatedApi = {
  getData: () => api.get('/api/exam-related/data'),
  save: (data) => api.post('/api/exam-related', data),
};

export const summaryApi = {
  get: () => api.get('/api/summary'),
};

export const authApi = {
  login: (email, password, designation) =>
    api.post('/api/auth/login', { email, password, designation }),
  signup: (name, email, password, designation) =>
    api.post('/api/auth/signup', { name, email, password, designation }),
  me: () => api.get('/api/auth/me'),
};

export const proposalsApi = {
  create: () => api.post('/api/proposals'),
  list: () => api.get('/api/proposals'),
  get: (id) => api.get(`/api/proposals/${id}`),
  update: (id, data) => api.put(`/api/proposals/${id}`, data),
  sign: (id, signature) => api.post(`/api/proposals/${id}/sign`, { signature }),
  cancel: (id) => api.post(`/api/proposals/${id}/cancel`),
  // chairman-only: delete a draft proposal
  delete: (id) => api.delete(`/api/proposals/${id}`),
};
