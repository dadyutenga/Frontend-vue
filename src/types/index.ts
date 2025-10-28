export interface User {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

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

export interface Folder {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
}
