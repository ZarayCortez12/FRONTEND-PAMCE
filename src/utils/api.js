import axios from "axios";
import { base_url } from "./baseUrl";

const api = axios.create({
  baseURL: base_url,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
