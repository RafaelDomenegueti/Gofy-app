import { useEffect } from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring } from "react-native-reanimated";
import { Logo } from "../components/logo";

export const LoadingScreen = () => {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withSpring(-10, { damping: 2, stiffness: 100 }),
        withSpring(0, { damping: 2, stiffness: 100 })
      ),
      -1,
      true
    );
  }, []);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }]
  }));

  return (
    <View className="flex-1 bg-background dark:bg-background-dark justify-center items-center">
      <Animated.View
        entering={FadeIn.duration(1000)}
        className="flex items-center justify-center gap-4"
      >
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="w-24 h-24 flex items-center justify-center"
        >
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            style={bounceStyle}
          >
            <View className="rounded-full bg-primary/10 dark:bg-primary-dark/20 p-5">
              <Logo width={60} height={60} />
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};