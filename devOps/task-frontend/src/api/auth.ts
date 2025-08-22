import axios from './axios';

export const registerUser = (data: { email: string; password: string }) => {
  return axios.post('/auth/register', data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return axios.post('/auth/login', data);
};
