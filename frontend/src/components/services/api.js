import axios from 'axios';

const API = axios.create({
  baseURL: 'https://weekly-reminder-psmf.onrender.com/api',
  timeout: 30000, // Increase timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// SIMPLIFIED Request interceptor - remove complex logic temporarily
API.interceptors.request.use(
  (config) => {
    // Simple token attachment - remove any complex logic
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.log('No user token available');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// SIMPLIFIED Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Named exports
export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);
export const getNotes = () => API.get('/notes');
export const createNote = (noteData) => API.post('/notes', noteData);
export const updateNote = (id, noteData) => API.put(`/notes/${id}`, noteData);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const markAsDone = (id) => API.put(`/notes/${id}`, { status: 'done' });
export const markAsTodo = (id) => API.put(`/notes/${id}`, { status: 'todo' });

export default API;