import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { CustomStatusBar } from '../components/custom-status-bar';
import { useAuth } from '../hooks/useAuth';
import { useColorScheme } from '../lib/useColorScheme';
import { ContentFormScreen } from '../screens/content-form';
import { LoginScreen } from '../screens/login';
import { MainScreen } from '../screens/main';
import { RegisterScreen } from '../screens/register';
import { ChangePasswordScreen } from '../screens/settings/change-password';
import { EditProfileScreen } from '../screens/settings/edit-profile';
import { ContentFormStackParamList, HomeStackParamList, RootStackParamList } from '../types/navigation';
import { CustomHeader } from './custom-header';
import { CustomTabBar } from './custom-tab-bar';
import { LoadingScreen } from './loading-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ContentFormStack = createNativeStackNavigator<ContentFormStackParamList>();

const HomeStackNavigator = () => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <>
      <CustomStatusBar backgroundColor={isDarkColorScheme ? "#232336" : "#5c5d8d"} barStyle={"light-content"} />

      <HomeStack.Navigator
        screenOptions={{
          animation: 'none',
        }}
      >
        <HomeStack.Screen
          name="Main"
          component={MainScreen}
          options={{ header: CustomHeader }}
        />
      </HomeStack.Navigator>
      <CustomTabBar />
    </>
  );
};

const ContentFormStackNavigator = () => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <>
      <CustomStatusBar backgroundColor={isDarkColorScheme ? "#232336" : "#5c5d8d"} barStyle={"light-content"} />

      <ContentFormStack.Navigator>
        <ContentFormStack.Screen
          name="ContentForm"
          component={ContentFormScreen}
          options={{ header: () => <SafeAreaView /> }}
        />
        <ContentFormStack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ header: () => <SafeAreaView /> }}
        />
        <ContentFormStack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ header: () => <SafeAreaView /> }}
        />
      </ContentFormStack.Navigator>
    </>
  )
};

const AuthStack = () => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar barStyle={isDarkColorScheme ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </>
  );
};

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeStack" component={HomeStackNavigator} />
    <Stack.Screen name="ContentFormStack" component={ContentFormStackNavigator} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { signed, isLoading, user } = useAuth();

  if (isLoading || (signed && !user)) {
    return <LoadingScreen />;
  }

  return signed ? <AppStack /> : <AuthStack />;
};

export const Routes = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};
