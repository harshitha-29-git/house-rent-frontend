import axios from 'axios';

const API = axios.create({
  baseURL: 'https://house-rent-application.onrender.com/api',
});

// Request interceptor to attach JWT token to headers automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
