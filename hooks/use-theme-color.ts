/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useMemo } from 'react';
import { Colors, type ColorName } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ThemeColorProps {
  light?: string;
  dark?: string;
}

export function useThemeColor(props: ThemeColorProps, colorName: ColorName) {
  const theme = useColorScheme() ?? 'light';

  return useMemo(() => {
    const colorFromProps = props[theme];
    return colorFromProps ?? Colors[theme][colorName];
  }, [theme, props, colorName]);
}
