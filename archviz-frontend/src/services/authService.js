import client from '../services/client';

export const authService = {
  // Register
  register: async (name, email, password) => {
    const response = await client.post('/register', {
      name,
      email,
      password,
      password_confirmation: password,
    });
    localStorage.setItem('auth_token', response.data.access_token);
    return response.data.user;
  },

  // Login
  login: async (email, password) => {
    const response = await client.post('/login', {
      email,
      password,
    });
    localStorage.setItem('auth_token', response.data.access_token);
    return response.data.user;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await client.get('/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    await client.post('/logout');
    localStorage.removeItem('auth_token');
  },
};