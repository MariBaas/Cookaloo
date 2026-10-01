import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  hint,
  className = '',
  containerClassName = '',
  ...props
}: InputProps) {
  return (
    <View className={`w-full ${containerClassName}`}>
      {label && (
        <Text className="font-figtree text-sm font-medium text-ink mb-1.5">
          {label}
        </Text>
      )}
      <TextInput
        className={`w-full bg-surface border ${
          error ? 'border-acc' : 'border-line2'
        } rounded-2xl py-3.5 px-4 font-figtree text-ink text-base ${className}`}
        placeholderTextColor="#B5A899"
        {...props}
      />
      {hint && !error && (
        <Text className="font-figtree text-xs text-muted mt-1">{hint}</Text>
      )}
      {error && (
        <Text className="font-figtree text-xs text-acc-text mt-1">{error}</Text>
      )}
    </View>
  );
}
