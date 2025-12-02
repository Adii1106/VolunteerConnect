import axios from "axios";
import { getToken } from "../hooks/auth";

const isProd = import.meta.env.PROD;
const defaultBaseURL = isProd
  ? "https://volunteerconnect-8ydj.onrender.com/api"
  : "http://localhost:4000/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
