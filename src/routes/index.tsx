import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ContentFormScreen } from '../screens/content-form';
import { HomeScreen } from '../screens/home';
import { LoginScreen } from '../screens/login';
import { RegisterScreen } from '../screens/register';
import { ContentFormStackParamList, HomeStackParamList, RootStackParamList } from '../types/navigation';
import { CustomHeader } from './custom-header';
import { CustomTabBar } from './custom-tab-bar';

const Stack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ContentFormStack = createNativeStackNavigator<ContentFormStackParamList>();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

const HomeStackNavigator = () => (
  <>
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ header: CustomHeader }}
      />
    </HomeStack.Navigator>
    <CustomTabBar />
  </>
);

const ContentFormStackNavigator = () => (
  <ContentFormStack.Navigator>
    <ContentFormStack.Screen
      name="ContentForm"
      component={ContentFormScreen}
      options={{ header: () => <SafeAreaView /> }}
    />
  </ContentFormStack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeStack" component={HomeStackNavigator} />
    <Stack.Screen name="ContentFormStack" component={ContentFormStackNavigator} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { signed, isLoading } = useAuth();

  if (isLoading) {
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
