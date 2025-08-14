import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "/api", // Proxy to /api
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
