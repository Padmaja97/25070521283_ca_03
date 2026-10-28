import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('flexgym_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getErrorMessage(error) {
  const validation = error.response?.data?.errors?.[0]?.message;
  if (!error.response) return 'Cannot reach the Flex Gym API. Start the server and configure server/.env with a valid MongoDB Atlas URI.';
  return validation || error.response?.data?.message || 'Something went wrong. Please try again.';
}

export default api;
