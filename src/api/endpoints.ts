// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  VERIFY_OTP: '/auth/verify-otp',
  REQUEST_OTP: '/auth/request-otp',
};

// Document endpoints
export const DOCUMENT_ENDPOINTS = {
  LIST: '/documents',
  GET: (id: string) => `/documents/${id}`,
  DOWNLOAD: (id: string) => `/documents/${id}/download`,
  DELETE: (id: string) => `/documents/${id}`,
  REGENERATE: (id: string) => `/documents/${id}/regenerate`,
  VISIBILITY: (id: string) => `/documents/${id}/visibility`,
  MOVE: (id: string) => `/documents/${id}/move`,
};

// Upload endpoints
export const UPLOAD_ENDPOINTS = {
  UPLOAD: '/upload',
};

// Folder endpoints
export const FOLDER_ENDPOINTS = {
  LIST: '/folders',
  GET: (id: string) => `/folders/${id}`,
  CREATE: '/folders',
  UPDATE: (id: string) => `/folders/${id}`,
  DELETE: (id: string) => `/folders/${id}`,
};
