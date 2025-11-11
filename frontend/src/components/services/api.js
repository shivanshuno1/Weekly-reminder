import axios from 'axios';

const API = axios.create({
  baseURL: 'https://weekly-reminder-psmf.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const user = JSON.parse(userData);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Named exports - FIXED: All endpoints should start with '/'
export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);
export const getNotes = () => API.get('/notes');
export const createNote = (noteData) => API.post('/notes', noteData);
export const updateNote = (id, noteData) => API.put(`/notes/${id}`, noteData);
export const deleteNote = (id) => API.delete(`/notes/${id}`); // Fixed this one

export const markAsDone = (id) => API.put(`/notes/${id}`, { status: 'done' });
export const markAsTodo = (id) => API.put(`/notes/${id}`, { status: 'todo' });

export default API;