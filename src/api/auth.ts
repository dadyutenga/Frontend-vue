import apiClient from './client';
import { AUTH_ENDPOINTS } from './endpoints';

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOTPPayload {
  email: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const authAPI = {
  register: async (data: RegisterPayload) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, data);
    return response.data;
  },

  login: async (data: LoginPayload) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, data);
    return response.data;
  },

  verifyOTP: async (data: VerifyOTPPayload): Promise<AuthResponse> => {
    const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_OTP, data);
    return response.data.data;
  },

  requestOTP: async (email: string) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.REQUEST_OTP, { email });
    return response.data;
  },
};
