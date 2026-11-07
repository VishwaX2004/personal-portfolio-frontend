import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ============================================================
// REQUEST INTERCEPTOR - ATTACH BEARER TOKEN
// ============================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// EDUCATION / QUALIFICATIONS HELPERS
// ============================================================

export const getEducation = async () => {
  const response = await API.get("/api/education");
  return response.data;
};

export const createEducation = async (data) => {
  const response = await API.post("/api/education", data);
  return response.data;
};

export const updateEducation = async (id, data) => {
  const response = await API.put(`/api/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id) => {
  const response = await API.delete(`/api/education/${id}`);
  return response.data;
};

// ============================================================
// PROJECTS HELPERS
// ============================================================

export const getProjects = async () => {
  const response = await API.get("/api/projects");
  return response.data;
};

export const createProject = async (data) => {
  const response = await API.post("/api/projects", data);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await API.put(`/api/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await API.delete(`/api/projects/${id}`);
  return response.data;
};

// ============================================================
// MESSAGES HELPERS
// ============================================================

export const getMessages = async () => {
  const response = await API.get("/api/messages");
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await API.delete(`/api/messages/${id}`);
  return response.data;
};

export default API;