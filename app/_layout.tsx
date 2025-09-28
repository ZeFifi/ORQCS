import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo } from 'react';
import 'react-native-reanimated';

import { ErrorBoundary } from '@/components/error-boundary';
import { Colors } from '@/constants/theme';
import { AnimationProvider } from '@/contexts/AnimationContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WatchlistProvider } from '@/contexts/WatchlistContext';
import { useAsyncStorageBoolean } from '@/hooks/use-async-storage';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
    const currentRoute = segments[0];

    if (isFirstLaunch) {
      // First launch - show onboarding unless already there or completing onboarding
      if (currentRoute !== 'onboarding' && currentRoute !== 'auth-choice') {
        router.replace('/onboarding');
      }
    } else if (!session && inAuthGroup) {
      // User is not authenticated but trying to access authenticated routes
      router.replace('/auth-choice');
    } else if (!session && !inAuthGroup && currentRoute !== 'auth-choice' && currentRoute !== 'login' && currentRoute !== 'signup') {
      // User is not authenticated and not on auth-related screens
      router.replace('/auth-choice');
    } else if (session && !inAuthGroup && segments[0] !== 'modal') {
      // User is authenticated but not on authenticated routes
      router.replace('/(tabs)');
    }
  }, [session, loading, isFirstLaunch, storageLoading, segments, router]);

  // Avoid flashing an unintended screen before routing decision is made
  if (loading || storageLoading) {
    return null;
  }

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
          <AnimationProvider>
            <ThemeProvider value={theme}>
              <NavigationLayout />
              <StatusBar style="light" translucent={false} />
            </ThemeProvider>
          </AnimationProvider>
        </WatchlistProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
