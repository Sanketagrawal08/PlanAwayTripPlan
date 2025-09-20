import axios from "axios";

// for local use
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
