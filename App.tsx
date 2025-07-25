import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import TrackPlayer from 'react-native-track-player';
import './global.css';
import ContextProvider from './src/hooks/contextProvider';
import './src/i18n';
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

  useEffect(() => {
    TrackPlayer.setupPlayer();
    SplashScreen.hide();
  }, []);

  return (
    <>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <ContextProvider>
          <Routes />
          <Toast />
        </ContextProvider>
      </ThemeProvider>
      <PortalHost name="root" />
    </>
  );
};

export default App;
