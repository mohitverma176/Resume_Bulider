import axios from "axios";
import { BASE_URL } from "./apipath.js";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach Auth Token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // Optional redirect if needed
        // window.location.href = "/";
      } else if (error.response.status === 500) {
        console.error("Server error:", error.response.data?.message || "Internal server error");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Please try again.");
    } else {
      console.error("Network or connection error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { axiosInstance };