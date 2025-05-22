import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

const THEME_STORAGE_KEY = '@gofy/theme';

export function useColorScheme() {
  const systemColorScheme = useSystemColorScheme();
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setColorScheme(savedTheme as 'light' | 'dark');
        } else {
          setColorScheme(systemColorScheme ?? 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        setColorScheme(systemColorScheme ?? 'dark');
      }
    };

    loadSavedTheme();
  }, [systemColorScheme]);

  const handleSetColorScheme = async (newTheme: 'light' | 'dark') => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setColorScheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const handleToggleColorScheme = async () => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    await handleSetColorScheme(newTheme);
  };

  return {
    colorScheme: colorScheme ?? 'dark',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme: handleSetColorScheme,
    toggleColorScheme: handleToggleColorScheme,
  };
}
