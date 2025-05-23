import React from 'react';
import { Image, ImageStyle, StyleProp, View } from 'react-native';
import { useColorScheme } from '../lib/useColorScheme';
import { Text } from './ui/text';

interface LogoProps {
  style?: StyleProp<ImageStyle>;
  width?: number;
  height?: number;
  isWhite?: boolean;
  withText?: boolean;
  textStyle?: string;
}

export const Logo: React.FC<LogoProps> = ({ style, width = 120, height = 120, isWhite = false, withText = false, textStyle }) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className='flex-row items-center gap-2'>
      <Image
        source={require('../assets/gofy-logo.png')}
        style={[{ width, height, resizeMode: 'contain', tintColor: isWhite ? 'white' : isDarkColorScheme ? "#232336" : "#5c5d8d" }, style]}
        accessibilityLabel="Gofy Logo"
      />

      {withText && <Text className={`font-bold text-3xl text-white ${textStyle}`}>
        Gofy
      </Text>}
    </View>
  )
};
