import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import TrackPlayer from 'react-native-track-player';
import './global.css';
import ContextProvider from './src/hooks/contextProvider';
import { NAV_THEME } from './src/lib/constants';
import { useColorScheme } from './src/lib/useColorScheme';
import { Routes } from './src/routes';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const App = () => {
  const { isDarkColorScheme } = useColorScheme();

  TrackPlayer.setupPlayer();

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <ContextProvider>
        <StatusBar />
        <Routes />
        <Toast />
      </ContextProvider>
    </ThemeProvider>
  );
};

export default App;
