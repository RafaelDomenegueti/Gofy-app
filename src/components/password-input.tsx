import { forwardRef, useState } from 'react';
import { View, TouchableOpacity, TextInput, type TextInputProps } from 'react-native';
import { Input } from './ui/input';
import { Eye, EyeOff } from 'lucide-react-native';
import { cn } from '../lib/utils';
import { useColorScheme } from '../lib/useColorScheme';

interface PasswordInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  ({ value, onChangeText, placeholder = 'Password', className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const { colorScheme } = useColorScheme();

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <View className="relative flex-row items-center">
        <Input
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          className={cn(className, 'w-full pr-11')}
          {...props}
        />
        <TouchableOpacity
          className="absolute right-3 p-1"
          onPress={toggleShowPassword}
          activeOpacity={0.7}
        >
          {showPassword ? (
            <EyeOff size={20} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
          ) : (
            <Eye size={20} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
          )}
        </TouchableOpacity>
      </View>
    );
  }
);

PasswordInput.displayName = 'PasswordInput'; 