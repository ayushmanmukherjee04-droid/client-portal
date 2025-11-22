// utils/backendClient.js
const axios = require('axios');

const BASE = process.env.BACKEND_BASE_URL || 'http://localhost:5000';

function createBackendClient(token) {
  const instance = axios.create({
    baseURL: BASE,
    timeout: 15000,
    headers: { "Content-Type": "application/json" }
  });

  if (token) instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return instance;
}

module.exports = { createBackendClient };
