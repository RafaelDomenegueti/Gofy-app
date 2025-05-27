import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StatusBar, StatusBarStyle, View } from 'react-native';
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

const CustomStatusBar = ({ backgroundColor, barStyle }: { backgroundColor: string, barStyle: StatusBarStyle }) => {
  return (
    <View style={{ backgroundColor, height: StatusBar.currentHeight }}>
      <SafeAreaView>
        <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />
      </SafeAreaView>
    </View>
  );
};

const App = () => {
  const { isDarkColorScheme } = useColorScheme();

  TrackPlayer.setupPlayer();

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <ContextProvider>
        <CustomStatusBar backgroundColor={isDarkColorScheme ? "#232336" : "#5c5d8d"} barStyle={'light-content'} />
        <Routes />
        <Toast />
      </ContextProvider>
    </ThemeProvider>
  );
};

export default App;
