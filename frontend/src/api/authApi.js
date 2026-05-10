import axiosClient from './axiosClient';

export async function loginUser(credentials) {
  const response = await axiosClient.post('/api/auth/login', {
    username: credentials.username.trim(),
    password: credentials.password
  });

  return response.data;
}

export async function registerUser(registration) {
  const response = await axiosClient.post('/api/auth/register', {
    username: registration.username.trim(),
    email: registration.email.trim(),
    password: registration.password,
    role: registration.role
  });

  return response.data;
}
