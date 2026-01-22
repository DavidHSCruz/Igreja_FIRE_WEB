import axios from 'axios';

const url = 'https://igreja-fire-api.onrender.com/'; //'http://localhost:3000'

export const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
