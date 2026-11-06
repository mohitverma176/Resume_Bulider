const rawBaseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
export const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },
  RESUME: {
    CREATE: "/api/resume",
    GET_ALL: "/api/resume",
    GET_BY_ID: (id) => `/api/resume/${id}`,
    UPDATE: (id) => `/api/resume/${id}`,
    DELETE: (id) => `/api/resume/${id}`,
    UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
  },
  IMAGE: {
    UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
  },
};

// Backward compatibility alias
export const API_PATH = API_PATHS;

export default API_PATHS;
