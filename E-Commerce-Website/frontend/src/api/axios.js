import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const normalizedConfiguredBaseUrl = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/+$/, "")
  : "";

const baseURL = normalizedConfiguredBaseUrl
  ? /\/api$/i.test(normalizedConfiguredBaseUrl)
    ? normalizedConfiguredBaseUrl
    : `${normalizedConfiguredBaseUrl}/api`
  : "/api";

const api = axios.create({
  baseURL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
