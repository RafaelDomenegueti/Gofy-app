import { Check, ChevronDown } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';
import { Picker } from '@react-native-picker/picker';
import { useColorScheme as useCustomColorScheme } from '../../lib/useColorScheme';

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

interface SelectTriggerProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

interface SelectContentProps {
  className?: string;
  children?: React.ReactNode;
  position?: 'popper' | 'item-aligned';
}

interface SelectItemProps {
  className?: string;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
}

const Select = React.forwardRef<View, SelectProps>(({ value, onValueChange, children, disabled, options, placeholder }, ref) => {
  const { isDarkColorScheme } = useCustomColorScheme();

  return (
    <View ref={ref} className="border border-input rounded-md bg-background dark:bg-background-dark dark:border-border-dark">
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        enabled={!disabled}
        style={{
          height: 48,
          color: isDarkColorScheme ? '#e2e8f0' : '#1e293b',
        }}
        dropdownIconColor={isDarkColorScheme ? '#e2e8f0' : '#1e293b'}
      >
        {placeholder && (
          <Picker.Item
            label={placeholder}
            value=""
            enabled={false}
            color={isDarkColorScheme ? '#e2e8f0' : '#1e293b'}
          />
        )}
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
            enabled={!option.disabled}
            color={isDarkColorScheme ? '#e2e8f0' : '#1e293b'}
          />
        ))}
      </Picker>
    </View>
  );
});

const SelectGroup = ({ children }: { children: React.ReactNode }) => {
  return <View>{children}</View>;
};

const SelectValue = ({ children }: { children: React.ReactNode }) => {
  return <View>{children}</View>;
};

const SelectTrigger = React.forwardRef<View, SelectTriggerProps>(({ className, children, disabled }, ref) => {
  return (
    <View
      ref={ref}
      className={cn(
        'flex flex-row h-10 native:h-12 items-center text-sm text-black justify-between rounded-md border border-input bg-background dark:bg-background-dark px-3 py-2 web:ring-offset-background text-muted-foreground web:focus:outline-none web:focus:ring-2 web:focus:ring-ring web:focus:ring-offset-2 [&>span]:line-clamp-1 dark:border-border-dark',
        disabled && 'web:cursor-not-allowed opacity-50',
        className
      )}
    >
      {children}
      <ChevronDown size={16} aria-hidden={true} className='text-foreground opacity-50' />
    </View>
  );
});

const SelectContent = React.forwardRef<View, SelectContentProps>(({ className, children, position = 'popper' }, ref) => {
  return (
    <View
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] rounded-md border border-border bg-popover shadow-md shadow-foreground/10 py-2 px-1',
        position === 'popper' &&
        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
    >
      {children}
    </View>
  );
});

const SelectItem = React.forwardRef<View, SelectItemProps>(({ className, children, value, disabled }, ref) => {
  return (
    <View
      ref={ref}
      className={cn(
        'relative web:group flex flex-row w-full web:cursor-default web:select-none items-center rounded-sm py-1.5 native:py-2 pl-8 native:pl-10 pr-2 web:hover:bg-accent/50 active:bg-accent web:outline-none web:focus:bg-accent',
        disabled && 'web:pointer-events-none opacity-50',
        className
      )}
    >
      <View className='absolute left-2 native:left-3.5 flex h-3.5 native:pt-px w-3.5 items-center justify-center'>
        <Check size={16} strokeWidth={3} className='text-popover-foreground' />
      </View>
      <View className='text-sm native:text-lg text-popover-foreground native:text-base web:group-focus:text-accent-foreground'>
        {children}
      </View>
    </View>
  );
});

const SelectSeparator = React.forwardRef<View, { className?: string }>(({ className }, ref) => {
  return (
    <View ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} />
  );
});

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectOption
};
