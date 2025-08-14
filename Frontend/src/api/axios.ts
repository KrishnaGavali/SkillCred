import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "/api", // Proxy to /api
  headers: {
    "Content-Type": "application/json",
  },
});

api.defaults.withCredentials = true; // Enable cookies for cross-origin requests

export default api;
