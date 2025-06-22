import { useNetInfo } from '@react-native-community/netinfo';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { AuthService } from '../../services/auth';
import { clearStorage, getJsonItem, getStorage, setStorage, storageKeys } from '../../utils/storage';
import { IAuthContextData, IAuthProviderProps, IChangePasswordData, IEditProfileData, ILoginData, IRegisterData, IUser } from './types';

export const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [signed, setSigned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const { isConnected } = useNetInfo();
  const { t } = useTranslation();

  const logout = useCallback(async () => {
    try {
      await clearStorage();
      setUser(null);
      setSigned(false);
    } catch (error) {
      console.error('Error during logout:', error);
      Toast.show({
        type: 'error',
        text1: t('toast.auth.logoutError'),
        text2: t('toast.auth.logoutMessage'),
      });
    }
  }, [t]);

  const refreshToken = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const refreshToken = await getStorage(storageKeys.refreshToken);

      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await AuthService.refreshToken(refreshToken);

      if (response.status === 201 || response.status === 200) {
        await Promise.all([
          setStorage(storageKeys.token, response.data.token),
          setStorage(storageKeys.refreshToken, response.data.refreshToken)
        ]);

        setUser(response.data.user);
        setSigned(true);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await logout();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [logout]);

  const login = async (data: ILoginData) => {
    try {
      const response = await AuthService.login(data);

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Login failed');
      }

      setIsLoading(true);

      const { token, refreshToken, user: userData } = response.data;

      await Promise.all([
        setStorage(storageKeys.token, token),
        setStorage(storageKeys.refreshToken, refreshToken),
        setStorage(storageKeys.user, JSON.stringify(userData))
      ]);

      setUser(userData);
      setSigned(true);
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || t('toast.auth.loginMessage');
      Toast.show({
        type: 'error',
        text1: t('toast.auth.loginError'),
        text2: message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: IRegisterData) => {
    try {
      const response = await AuthService.register(data);

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Registration failed');
      }

      setIsLoading(true);

      const { token, refreshToken, user: userData } = response.data;

      await Promise.all([
        setStorage(storageKeys.token, token),
        setStorage(storageKeys.refreshToken, refreshToken),
        setStorage(storageKeys.user, JSON.stringify(userData))
      ]);

      setUser(userData);
      setSigned(true);
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || t('toast.auth.registerMessage');
      Toast.show({
        type: 'error',
        text1: t('toast.auth.registerError'),
        text2: message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkIsSigned = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await getStorage(storageKeys.token);

      if (!token) {
        setSigned(false);
        return;
      }

      try {
        const response = await AuthService.validateToken(token);

        if (response.status === 201 || response.status === 200) {
          setUser(response.data.user);
          await setStorage(storageKeys.user, JSON.stringify(response.data.user));

          setSigned(true);
        } else {
          throw new Error('Invalid token');
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          const refreshed = await refreshToken();
          if (!refreshed) {
            await logout();
          }
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [refreshToken, logout]);

  const loginWithStoredData = useCallback(async () => {
    const token = await getStorage(storageKeys.token);
    const refreshToken = await getStorage(storageKeys.refreshToken);
    const user = await getJsonItem(storageKeys.user);

    if (!token || !refreshToken || !user) {
      await logout();
      return;
    }

    setUser(user);
    setSigned(true);
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    if (isConnected) {
      checkIsSigned();
    } else {
      loginWithStoredData();
    }
  }, [checkIsSigned, isConnected, loginWithStoredData]);

  const changePassword = async (data: IChangePasswordData) => {
    try {
      const token = await getStorage(storageKeys.token);

      if (!token) {
        throw new Error('No token found');
      }

      const response = await AuthService.changePassword(data, token);

      return response.data;
    } catch (error: any) {
      throw new Error(typeof error.response?.data?.message === 'string' ? error.response?.data?.message : 'Error changing password');
    }
  };

  const editProfile = async (data: IEditProfileData) => {
    try {
      const token = await getStorage(storageKeys.token);

      if (!token) {
        throw new Error('No token found');
      }

      const response = await AuthService.editProfile(data, token);
      setUser(response.data.user);
      return response.data;
    } catch (error: any) {
      throw new Error(typeof error.response?.data?.message === 'string' ? error.response?.data?.message : 'Error editing profile');
    }
  };

  const value = useMemo(
    () => ({
      login,
      logout,
      register,
      signed,
      user,
      isLoading,
      isRefreshing,
      refreshToken,
      changePassword,
      editProfile,
    }),
    [signed, user, isLoading, isRefreshing, refreshToken, changePassword, editProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
