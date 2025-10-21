// frontend/src/services/authService.js
// --- FULL REPLACEABLE CODE ---

import axios from 'axios';

// --- THIS IS THE FIX ---
// Tell axios to send cookies with all requests
axios.defaults.withCredentials = true;
// --------------------

const API_URL = '/api/auth/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = async () => {
  localStorage.removeItem('user');
  // We'll also call the backend logout to clear the cookie
  await axios.post(API_URL + 'logout');
};

const authService = {
  register,
  logout,
  login,
};

export default authService;