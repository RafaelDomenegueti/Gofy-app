import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    if (Platform.Version >= 33) {
      const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);
      return result === RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      return result === RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

export const checkStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    if (Platform.Version >= 33) {
      const result = await check(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO);
      return result === RESULTS.GRANTED;
    } else {
      const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
      return result === RESULTS.GRANTED;
    }
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

export const getAudioDirectory = () => {
  if (Platform.OS === 'ios') {
    return `${RNFS.DocumentDirectoryPath}/Gofy/Audio`;
  } else {
    return `${RNFS.ExternalDirectoryPath}/Gofy/Audio`;
  }
};

export const ensureDirectoryExists = async (directory: string) => {
  try {
    const exists = await RNFS.exists(directory);
    if (!exists) {
      await RNFS.mkdir(directory);
    }
    return true;
  } catch (error) {
    console.error('Error ensuring directory exists:', error);
    return false;
  }
};
