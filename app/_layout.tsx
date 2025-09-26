import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo } from 'react';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAsyncStorageBoolean } from '@/hooks/use-async-storage';

export const unstable_settings = {
  anchor: '(tabs)',
};

const NavigationLayout = React.memo(() => {
  const router = useRouter();
  const segments = useSegments();
  const { session, loading } = useAuth();
  const [hasLaunched, , storageLoading] = useAsyncStorageBoolean('hasLaunched', false);

  const isFirstLaunch = hasLaunched === false;

  useEffect(() => {
    if (loading || storageLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (isFirstLaunch) {
      router.replace('/onboarding');
    } else if (!session && inAuthGroup) {
      router.replace('/auth-choice');
    } else if (session && !inAuthGroup && segments[0] !== 'modal') {
      router.replace('/(tabs)');
    }
  }, [session, loading, isFirstLaunch, storageLoading, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="auth-choice" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
});

NavigationLayout.displayName = 'NavigationLayout';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Create a light theme overriding the default background to pure white
  const lightTheme = useMemo(() => ({
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
    },
  }), []);

  const theme = useMemo(() =>
    colorScheme === 'dark' ? DarkTheme : lightTheme,
    [colorScheme, lightTheme]
  );

  return (
    <ErrorBoundary>
      <AuthProvider>
        <WatchlistProvider>
          <ThemeProvider value={theme}>
            <NavigationLayout />
            <StatusBar style="auto" />
          </ThemeProvider>
        </WatchlistProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
