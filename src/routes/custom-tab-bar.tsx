import { useNavigation } from "@react-navigation/native";
import { HomeIcon, SettingsIcon, UsersIcon } from "lucide-react-native";
import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Dimensions, Platform, SafeAreaView, TouchableOpacity, View } from "react-native";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { PlayerControls } from "../components/player-controls";
import { usePlayer } from "../hooks/usePlayer";
import { Text } from "../components/ui/text";
import { useColorScheme } from "../lib/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CIRCLE_SIZE = 48;
const ICON_SIZE = 24;
const SHADOW_SIZE = 72;

const CustomSafeAreaView = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'ios') {
    return (
      <View className="w-full bg-background dark:bg-background-dark">
        <View className="w-full bg-primary dark:bg-primary-dark" style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          {children}
        </View>
        <View style={{ height: insets.bottom }} className="bg-primary dark:bg-primary-dark" />
      </View>
    );
  }

  return (
    <View className="w-full bg-background dark:bg-background-dark">
      <View className="w-full bg-primary dark:bg-primary-dark" style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
        {children}
      </View>
      <View style={{ height: insets.bottom }} className="bg-primary dark:bg-primary-dark" />
    </View>
  );
};

export function CustomTabBar() {
  const { t } = useTranslation();
  const { currentContent } = usePlayer();
  const navigation = useNavigation<NavigationProp>();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const blurAnim = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');
  const { isDarkColorScheme } = useColorScheme();

  useEffect(() => {
    const setNavigationBarColor = async () => {
      try {
        await changeNavigationBarColor(
          isDarkColorScheme ? '#232336' : '#5c5d8d',
          !isDarkColorScheme,
        );
      } catch (error) {
        console.error('Failed to set navigation bar color:', error);
      }
    };

    setNavigationBarColor();
  }, [isDarkColorScheme]);

  const handleTabPress = (route: string, index: number) => {
    blurAnim.setValue(0);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: index,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.3,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
          Animated.timing(blurAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
          Animated.timing(blurAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    navigation.navigate('HomeStack', { screen: route });
  };

  const tabs = [
    { route: 'Home', icon: HomeIcon, label: t('navigation.home') },
    { route: 'Community', icon: UsersIcon, label: t('navigation.community') },
    { route: 'Settings', icon: SettingsIcon, label: t('navigation.settings') },
  ];

  const tabWidth = width / tabs.length;

  return (
    <CustomSafeAreaView>
      {currentContent && <PlayerControls />}

      <View
        className="flex-row items-center justify-between bg-primary dark:bg-primary-dark border-t border-border/10 backdrop-blur-lg py-3"
        style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
      >
        {/* Shadow/Blur effect */}
        <Animated.View
          className="absolute rounded-full bg-white/10 dark:bg-white/5"
          style={{
            height: SHADOW_SIZE,
            width: SHADOW_SIZE,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, tabWidth, tabWidth * 2],
                }),
              },
              {
                scale: blurAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.8],
                }),
              },
            ],
            left: tabWidth / 2 - SHADOW_SIZE / 2,
            opacity: blurAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.15, 0.35],
            }),
          }}
        />

        {/* Main circle */}
        <Animated.View
          className="absolute rounded-full bg-white/5 dark:bg-white/5 backdrop-blur-sm"
          style={{
            height: CIRCLE_SIZE,
            width: CIRCLE_SIZE,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, tabWidth, tabWidth * 2],
                }),
              },
              {
                scale: scaleAnim,
              },
            ],
            left: tabWidth / 2 - CIRCLE_SIZE / 2,
          }}
        />

        {tabs.map((tab, index) => {
          const inputRange = [index - 1, index, index + 1];
          const scale = slideAnim.interpolate({
            inputRange,
            outputRange: [1, 1.2, 1],
            extrapolate: 'clamp',
          });

          return (
            <TouchableOpacity
              key={tab.route}
              className="items-center justify-center flex-1"
              onPress={() => handleTabPress(tab.route, index)}
              style={{ height: CIRCLE_SIZE }}
            >
              <Animated.View
                style={{
                  transform: [{ scale }],
                }}
                className="items-center justify-center flex"
              >
                <tab.icon
                  size={ICON_SIZE}
                  color={"white"}
                  strokeWidth={2}
                />

                <Text className="text-xs mt-1 text-white/90">{tab.label}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </CustomSafeAreaView>
  );
}
