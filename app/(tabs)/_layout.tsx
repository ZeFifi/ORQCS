import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TabIconProps {
  color: string;
  focused: boolean;
}

const HomeIcon = ({ color }: TabIconProps) => (
  <IconSymbol size={28} name="house.fill" color={color} />
);

const WatchlistIcon = ({ color }: TabIconProps) => (
  <IconSymbol size={28} name="list.bullet" color={color} />
);

const SettingsIcon = ({ color }: TabIconProps) => (
  <IconSymbol size={28} name="gear" color={color} />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const tabBarStyle = useMemo(() => ({
    borderRadius: 100,
    borderTopColor: Colors[colorScheme ?? 'light'].tint,
    backgroundColor: Colors[colorScheme ?? 'light'].tint,
    width: '80%' as const,
    marginHorizontal: 'auto' as const,
    height: 65,
    bottom: Platform.select({ ios: 10, android: 20, default: 10 }),
    paddingBottom: Platform.select({ ios: 0, android: 10, default: 0 }),
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  }), [colorScheme]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].background,
        tabBarInactiveTintColor: `${Colors[colorScheme ?? 'light'].background}80`,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: HomeIcon,
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: WatchlistIcon,
          tabBarAccessibilityLabel: 'Watchlist tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: SettingsIcon,
          tabBarAccessibilityLabel: 'Settings tab',
        }}
      />
    </Tabs>
  );
}
