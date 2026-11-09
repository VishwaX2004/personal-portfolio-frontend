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
// FILE UPLOADS - Using Supabase
// ============================================================

import {
  uploadProjectImages,
  uploadCertificateImages,
  uploadLogoToSupabase,
  deleteImageFromSupabase,
  deleteImagesFromSupabase,
} from "./supabaseService";

// Upload project images to Supabase
export const uploadProjectImagesToSupabase = async (files, projectId) => {
  try {
    const result = await uploadProjectImages(files, projectId);
    return {
      success: true,
      uploaded: result.uploaded.map(item => ({
        publicUrl: item.url,
      })),
    };
  } catch (error) {
    throw error;
  }
};

// Upload certificate images to Supabase
export const uploadCertificateImagesToSupabase = async (files, certificateId) => {
  try {
    const result = await uploadCertificateImages(files, certificateId);
    return {
      success: true,
      uploaded: result.uploaded.map(item => ({
        publicUrl: item.url,
      })),
    };
  } catch (error) {
    throw error;
  }
};

// Upload logo to Supabase
export const uploadLogo = async (file, institutionId = "default") => {
  try {
    const result = await uploadLogoToSupabase(file, institutionId);
    return result;
  } catch (error) {
    throw error;
  }
};

// Legacy certificate upload (maintained for backward compatibility)
export const uploadCertificationImages = async (files) => {
  try {
    const result = await uploadCertificateImages(files, "temp");
    return {
      success: true,
      uploaded: result.uploaded.map(item => ({
        publicUrl: item.url,
      })),
    };
  } catch (error) {
    throw error;
  }
};

// Delete image from Supabase
export const deleteImageFromStorage = async (imageUrl) => {
  try {
    await deleteImageFromSupabase(imageUrl);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Delete multiple images from Supabase
export const deleteImagesFromStorage = async (imageUrls) => {
  try {
    await deleteImagesFromSupabase(imageUrls);
    return { success: true };
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
