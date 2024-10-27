import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL;

export async function getAll(url) {
  const { data } = await axios.get(`${baseUrl}/${url}`); 
  return data.items;
}

export async function getById(url) {
  const {data} = await axios.get(`${baseUrl}/${url}`);
  return data;
}

export const deleteById = async (url, { arg: id }) => {
  await axios.delete(`${baseUrl}/${url}/${id}`); 
};

export async function save(url, { arg: { id, ...data } }) {
  await axios({
    method: id ? 'PUT' : 'POST',
    url: `${baseUrl}/${url}/${id ?? ''}`,
    data,
  });
}