import apiClient from './client';
import { DOCUMENT_ENDPOINTS } from './endpoints';

export interface Document {
  id: string;
  title: string;
  author: string;
  uploader_id: string;
  folder_id: string | null;
  is_private: boolean;
  file_size_bytes: number;
  download_count: number;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

export const documentAPI = {
  list: async (folderId?: string) => {
    const params = folderId ? { folderId } : {};
    const response = await apiClient.get(DOCUMENT_ENDPOINTS.LIST, { params });
    return response.data.data;
  },

  get: async (id: string) => {
    const response = await apiClient.get(DOCUMENT_ENDPOINTS.GET(id));
    return response.data.data;
  },

  download: async (id: string) => {
    const response = await apiClient.get(DOCUMENT_ENDPOINTS.DOWNLOAD(id));
    return response.data.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(DOCUMENT_ENDPOINTS.DELETE(id));
    return response.data;
  },

  regeneratePDF: async (id: string) => {
    const response = await apiClient.post(DOCUMENT_ENDPOINTS.REGENERATE(id));
    return response.data;
  },

  changeVisibility: async (id: string, isPrivate: boolean) => {
    const response = await apiClient.post(DOCUMENT_ENDPOINTS.VISIBILITY(id), { isPrivate });
    return response.data;
  },

  move: async (id: string, folderId: string | null) => {
    const response = await apiClient.post(DOCUMENT_ENDPOINTS.MOVE(id), { folderId });
    return response.data;
  },
};
