import apiClient from './client';
import { UPLOAD_ENDPOINTS } from './endpoints';

export const uploadAPI = {
  uploadDocument: async (file: File, folderId?: string, isPublic?: boolean) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId);
    }
    if (isPublic !== undefined) {
      formData.append('isPublic', String(isPublic));
    }
    
    const response = await apiClient.post(UPLOAD_ENDPOINTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
