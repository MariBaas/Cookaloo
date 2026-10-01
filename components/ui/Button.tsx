import React from 'react';
import { Pressable, Text, ActivityIndicator, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  textClassName = '',
  disabled,
  icon,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-acc active:opacity-90';
      case 'secondary':
        return 'bg-surface2 active:bg-line';
      case 'outline':
        return 'bg-surface border border-line2 active:bg-surface2';
      case 'ghost':
        return 'bg-transparent active:bg-surface2';
      default:
        return 'bg-acc active:opacity-90';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-acc-ink font-semibold';
      case 'secondary':
        return 'text-ink font-semibold';
      case 'outline':
        return 'text-ink font-medium';
      case 'ghost':
        return 'text-muted font-medium';
      default:
        return 'text-acc-ink font-semibold';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3 rounded-full';
      case 'lg':
        return 'py-4 px-8 rounded-full';
      case 'md':
      default:
        return 'py-3.5 px-6 rounded-full';
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-lg';
      case 'md':
      default:
        return 'text-base';
    }
  };

  return (
    <Pressable
      className={`flex-row items-center justify-center ${getVariantStyles()} ${getSizeStyles()} ${
        disabled || loading ? 'opacity-50' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#2A211B'}
        />
      ) : (
        <>
          {icon ? <React.Fragment>{icon}</React.Fragment> : null}
          <Text
            className={`font-figtree ${getTextStyles()} ${getTextSizeStyles()} ${
              icon ? 'ml-2' : ''
            } ${textClassName}`}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
