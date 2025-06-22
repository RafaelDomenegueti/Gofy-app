import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { HomeStackParamList } from '../../types/navigation';
import { CommunityScreen } from '../community';
import { HomeScreen } from '../home';
import { SettingsScreen } from '../settings';

type MainScreenProps = {
  route: {
    params?: {
      screen?: HomeStackParamList['Main']['screen'];
    };
  };
};

const { width: screenWidth } = Dimensions.get('window');

export const MainScreen: React.FC<MainScreenProps> = ({ route }) => {
  const { screen = 'home' } = route.params || {};
  const translateX = useSharedValue(0);
  const isInitialized = useRef(false);
  const { i18n } = useTranslation();

  const getScreenIndex = (screenName: string) => {
    switch (screenName) {
      case 'home': return 0;
      case 'community': return 1;
      case 'settings': return 2;
      default: return 0;
    }
  };

  useEffect(() => {
    const currentIndex = getScreenIndex(screen);

    if (!isInitialized.current) {
      translateX.value = -currentIndex * screenWidth;
      isInitialized.current = true;
      return;
    }

    translateX.value = withTiming(
      -currentIndex * screenWidth,
      {
        duration: 300,
        easing: Easing.out(Easing.cubic)
      }
    );
  }, [screen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const languageKey = i18n.language;

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          width: screenWidth * 3,
        },
        animatedStyle
      ]}
    >
      <View style={{ width: screenWidth }} key={`home-${languageKey}`}>
        <HomeScreen />
      </View>
      <View style={{ width: screenWidth }} key={`community-${languageKey}`}>
        <CommunityScreen />
      </View>
      <View style={{ width: screenWidth }} key={`settings-${languageKey}`}>
        <SettingsScreen />
      </View>
    </Animated.View>
  );
};
