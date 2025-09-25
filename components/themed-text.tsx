import React, { useMemo } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type TextVariant = 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';

export interface ThemedTextProps extends TextProps {
  lightColor?: string;
  darkColor?: string;
  type?: TextVariant;
}

export const ThemedText = React.memo(({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const textStyle = useMemo(() => [
    { color },
    styles[type],
    style,
  ], [color, type, style]);

  return (
    <Text
      style={textStyle}
      {...rest}
    />
  );
});

ThemedText.displayName = 'ThemedText';

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
