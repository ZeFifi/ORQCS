import React, { useMemo } from 'react';
import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export const ThemedView = React.memo(({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  const viewStyle = useMemo(() => [
    { backgroundColor },
    style
  ], [backgroundColor, style]);

  return <View style={viewStyle} {...otherProps} />;
});

ThemedView.displayName = 'ThemedView';
