import { ILoginData, IRegisterData, LoginDataResponse, RegisterDataResponse, ValidateTokenResponse } from '../hooks/useAuth/types';
import { api } from './api';

export const AuthService = {
  login: async (data: ILoginData) => {
    return api.post<LoginDataResponse>('/auth/login', data);
  },

  register: async (data: IRegisterData) => {
    return api.post<RegisterDataResponse>('/auth/register', data);
  },

  validateToken: async (token: string) => {
    return api.get<ValidateTokenResponse>('/auth/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  refreshToken: async (refreshToken: string) => {
    return api.post<LoginDataResponse>('/auth/refresh', {
      refreshToken,
    });
  },
};
