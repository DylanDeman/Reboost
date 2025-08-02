import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

// Create an axios instance with base URL
const api = axios.create({
  baseURL: baseUrl,
});

// Automatically attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// API functions using the configured axios instance

export async function getAll(url) {
  const { data } = await api.get(`/${url}`);
  return data.items;
}



export async function getById(url) {
  const { data } = await api.get(`/${url}`);
  return data;
}

export const deleteById = async (url, { arg: id }) => {
  await api.delete(`/${url}/${id}`);
};

export async function save(url, { arg: { id, ...data } }) {
  await api({
    method: id ? 'PUT' : 'POST',
    url: `/${url}/${id ?? ''}`,
    data,
  });
}

export const post = async (url, { arg }) => {
  const { data } = await api.post(`/${url}`, arg);
  return data;
};
