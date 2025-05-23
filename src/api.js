import axios from 'axios';

// Set up the base URL for your backend API
const API = axios.create({
  baseURL: 'http://localhost:5000',
  // baseURL: 'https://uni-guide-frontend-git-main-diparshanbarals-projects.vercel.app',
  // baseURL: 'https://uniguide-backend-git-main-diparshanbarals-projects.vercel.app',
  withCredentials: true,
});

// Add a request interceptor to include the token in headers
API.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem('session');
    if (session) {
      const { token } = JSON.parse(session);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
