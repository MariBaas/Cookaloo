import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface BadgeProps extends ViewProps {
  label: string;
  variant?: 'default' | 'herb' | 'accent' | 'warn';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  textClassName = '',
  ...props
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'herb':
        return 'bg-herb-soft border-transparent';
      case 'accent':
        return 'bg-acc-soft border-transparent';
      case 'warn':
        return 'bg-warn-soft border-transparent';
      case 'default':
      default:
        return 'bg-surface2 border-line';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'herb':
        return 'text-herb-text font-medium';
      case 'accent':
        return 'text-acc-text font-semibold';
      case 'warn':
        return 'text-warn-text font-medium';
      case 'default':
      default:
        return 'text-muted font-medium';
    }
  };

  const getSizeStyles = () => {
    return size === 'sm' ? 'px-2 py-0.5 rounded-md' : 'px-3 py-1 rounded-full';
  };

  const getTextSizeStyles = () => {
    return size === 'sm' ? 'text-xs' : 'text-sm';
  };

  return (
    <View
      className={`flex-row items-center border ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {icon ? <View className="mr-1">{icon}</View> : null}
      <Text
        className={`font-figtree ${getTextStyles()} ${getTextSizeStyles()} ${textClassName}`}
      >
        {label}
      </Text>
    </View>
  );
}
