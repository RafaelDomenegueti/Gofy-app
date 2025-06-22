import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  token: 'token',
  refreshToken: 'refreshToken',
  user: 'user',
  lastSearchedContents: 'lastSearchedContents',
};

export const setStorage = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

export const getStorage = async (key: string) => {
  const item = await AsyncStorage.getItem(key);

  return item;
};

export const getJsonItem = async (key: string) => {
  const item = await AsyncStorage.getItem(key);

  if (!item) {
    return {};
  }

  return JSON.parse(item);
};

export const clearStorage = async () => {
  await AsyncStorage.clear();
};
