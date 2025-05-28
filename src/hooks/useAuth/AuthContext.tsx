import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import { AuthService } from '../../services/auth';
import { clearStorage, getStorage, setStorage, storageKeys } from '../../utils/storage';
import { IAuthContextData, IAuthProviderProps, ILoginData, IRegisterData, IUser } from './types';

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [signed, setSigned] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const logout = useCallback(async () => {
    try {
      await clearStorage();
      setUser(null);
      setSigned(false);
    } catch (error) {
      console.error('Error during logout:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to logout properly',
      });
    }
  }, []);

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
    setIsLoading(true);

    try {
      const response = await AuthService.login(data);

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { token, refreshToken, user: userData } = response.data;

      await Promise.all([
        setStorage(storageKeys.token, token),
        setStorage(storageKeys.refreshToken, refreshToken)
      ]);

      setUser(userData);
      setSigned(true);
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'An error occurred during login';
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: IRegisterData) => {
    setIsLoading(true);

    try {
      const response = await AuthService.register(data);

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Registration failed');
      }

      const { token, refreshToken, user: userData } = response.data;

      await Promise.all([
        setStorage(storageKeys.token, token),
        setStorage(storageKeys.refreshToken, refreshToken)
      ]);

      setUser(userData);
      setSigned(true);
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'An error occurred during registration';
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
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

  useEffect(() => {
    checkIsSigned();
  }, [checkIsSigned]);

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
    }),
    [signed, user, isLoading, isRefreshing, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
