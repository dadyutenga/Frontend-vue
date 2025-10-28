import apiClient from './client';
import { FOLDER_ENDPOINTS } from './endpoints';

export interface Folder {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const folderAPI = {
  list: async () => {
    const response = await apiClient.get(FOLDER_ENDPOINTS.LIST);
    return response.data.data;
  },

  get: async (id: string) => {
    const response = await apiClient.get(FOLDER_ENDPOINTS.GET(id));
    return response.data.data;
  },

  create: async (data: { name: string; description?: string; isPublic: boolean }) => {
    const response = await apiClient.post(FOLDER_ENDPOINTS.CREATE, data);
    return response.data.data;
  },

  update: async (id: string, data: { name?: string; description?: string; isPublic?: boolean }) => {
    const response = await apiClient.put(FOLDER_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(FOLDER_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
