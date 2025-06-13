import { ReactNode } from 'react';

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface IAuthProviderProps {
  children: ReactNode;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
}

export interface IAuthContextData {
  user: IUser | null;
  signed: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  login: (data: ILoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: IRegisterData) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  editProfile: (data: IEditProfileData) => Promise<EditProfileResponse | undefined>;
  changePassword: (data: IChangePasswordData) => Promise<ChangePasswordResponse | undefined>;
}

export interface LoginDataResponse {
  token: string;
  refreshToken: string;
  user: IUser;
  message?: string;
}

export interface RegisterDataResponse {
  token: string;
  refreshToken: string;
  user: IUser;
  message?: string;
}

export interface ValidateTokenResponse {
  user: IUser;
  message?: string;
}

export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface IEditProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface EditProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  message: string;
}
