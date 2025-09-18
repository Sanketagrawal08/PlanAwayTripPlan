import axios from "axios";

// for local use
const API_BASE_URL = "http://localhost:5000"

//for productikon //backend heignore the link
// const API_BASE_URL = "https://planawaytripplanfrontend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;
