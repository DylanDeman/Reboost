import axiosRoot from 'axios';
import { JWT_TOKEN_KEY } from '../contexts/Auth.context';
const baseUrl = import.meta.env.VITE_API_URL;

// Create an axios instance with base URL
const api = axiosRoot.create({
  baseURL: baseUrl,
});

// Automatically attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(JWT_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // Check if error is due to an expired token (usually 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Remove the expired token from localStorage
      localStorage.removeItem(JWT_TOKEN_KEY);
      
      const pathname = window.location.pathname;
      window.location.href = `/login?redirect=${pathname}`;
    }
    
    return Promise.reject(error);
  },
);

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
  const method = id ? 'PUT' : 'POST';
  const requestUrl = id ? `/${url}/${id}` : `/${url}`;

  const response = await api({
    method,
    url: requestUrl,
    data,
  });


  return response.data;
}


export const post = async (url, { arg }) => {
  const { data } = await api.post(`/${url}`, arg);
  return data;
};


// export async function updateGereedschap(id, data) {
//   await api({
//     method: 'PUT',
//     url: `/gereedschap/${id}`,
//     data,
//   });
// }
