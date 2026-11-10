import axios from "axios";
import { getAdminToken, clearAdminToken } from "../utils/adminAuth";

const API_URL = import.meta.env.VITE_API_URL;

const adminAPI = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
adminAPI.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
adminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAdminToken();
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// ============================================================
// AUTH
// ============================================================

export const loginAdmin = async (username, password) => {
  try {
    const response = await adminAPI.post("/api/admin/login", {
      username,
      password,
    });
    return response.data.token;
  } catch (error) {
    throw error;
  }
};

// ============================================================
// PROJECTS
// ============================================================

export const getAdminProjects = async () => {
  try {
    const response = await adminAPI.get("/api/admin/projects");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAdminProject = async (data) => {
  try {
    const response = await adminAPI.post("/api/admin/projects", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminProject = async (id, data) => {
  try {
    const response = await adminAPI.put(`/api/admin/projects/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminProject = async (id) => {
  try {
    const response = await adminAPI.delete(`/api/admin/projects/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================================
// QUALIFICATIONS
// ============================================================

export const getAdminQualifications = async () => {
  try {
    const response = await adminAPI.get("/api/admin/qualifications");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAdminQualification = async (data) => {
  try {
    const response = await adminAPI.post("/api/admin/qualifications", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminQualification = async (id, data) => {
  try {
    const response = await adminAPI.put(`/api/admin/qualifications/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminQualification = async (id) => {
  try {
    const response = await adminAPI.delete(`/api/admin/qualifications/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================================
// EDUCATION (Legacy - for backward compatibility)
// ============================================================

export const getAdminEducation = async () => {
  try {
    const response = await adminAPI.get("/api/admin/education");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAdminEducation = async (data) => {
  try {
    const response = await adminAPI.post("/api/admin/education", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdminEducation = async (id, data) => {
  try {
    const response = await adminAPI.put(`/api/admin/education/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAdminEducation = async (id) => {
  try {
    const response = await adminAPI.delete(`/api/admin/education/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================================
// FILE UPLOADS - Using mediaUpload utility (Supabase)
// ============================================================

// Upload single logo
export const uploadLogo = async (file) => {
  try {
    const mediaUpload = (await import("../utils/mediaUpload")).default;
    const publicUrl = await mediaUpload(file);
    return {
      success: true,
      publicUrl,
    };
  } catch (error) {
    throw error;
  }
};

// Upload certification images
export const uploadCertificationImages = async (files) => {
  try {
    const mediaUpload = (await import("../utils/mediaUpload")).default;
    const uploadedUrls = [];
    
    for (const file of files) {
      const publicUrl = await mediaUpload(file);
      uploadedUrls.push({
        publicUrl,
      });
    }
    
    return {
      success: true,
      uploaded: uploadedUrls,
    };
  } catch (error) {
    throw error;
  }
};

// Upload project images
export const uploadProjectImages = async (files) => {
  try {
    const mediaUpload = (await import("../utils/mediaUpload")).default;
    const uploadedUrls = [];
    
    for (const file of files) {
      const publicUrl = await mediaUpload(file);
      uploadedUrls.push({
        publicUrl,
      });
    }
    
    return {
      success: true,
      uploaded: uploadedUrls,
    };
  } catch (error) {
    throw error;
  }
};

// ============================================================
// MESSAGES
// ============================================================

export const getMessages = async () => {
  try {
    const response = await adminAPI.get("/api/admin/messages");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMessage = async (id) => {
  try {
    const response = await adminAPI.delete(`/api/admin/messages/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsRead = async (id) => {
  try {
    const response = await adminAPI.put(`/api/admin/messages/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
