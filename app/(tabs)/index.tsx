import { Image } from 'expo-image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { RandomWheel } from '@/components/random-wheel';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchlist } from '@/hooks/use-watchlist';
import { supabase } from '@/lib/supabase';
import { WatchlistItem } from '@/lib/types';

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { watchlist } = useWatchlist();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const displayName = useMemo(() => {
    if (profile?.first_name) {
      return `, ${profile.first_name}`;
    }
    if (user?.email) {
      return `, ${user.email}`;
    }
    return '';
  }, [profile?.first_name, user?.email]);

  const handleRandomPick = useCallback(() => {
    const availableItems = watchlist.filter(item => !item.watched);

    if (availableItems.length === 0) {
      Alert.alert('No Items', 'Add some movies or series to your watchlist first!');
      return;
    }

    setIsSpinning(true);
  }, [watchlist]);

  const handleSpinComplete = useCallback((selectedItem: WatchlistItem | null) => {
    setIsSpinning(false);

    if (selectedItem) {
      Alert.alert(
        'Random Pick! 🎬',
        `Tonight you should watch: "${selectedItem.title}" (${selectedItem.year})`,
        [{ text: 'Great choice!', style: 'default' }]
      );
    }
  }, []);

  const headerImage = useMemo(() => (
    <Image
      source={require('@/assets/images/partial-react-logo.png')}
      style={styles.reactLogo}
      contentFit="contain"
      transition={200}
    />
  ), []);

  if (isLoadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText type="title">Loading...</ThemedText>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={headerImage}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome{displayName}!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.mainContent}>
        <ThemedText type="subtitle" style={styles.subtitle}>
          What do we watch tonight?
        </ThemedText>
        <ThemedText style={styles.description}>
          Let us help you choose from your watchlist!
        </ThemedText>

        <TouchableOpacity
          style={[styles.randomButton, isSpinning && styles.randomButtonDisabled]}
          onPress={handleRandomPick}
          activeOpacity={0.8}
          disabled={isSpinning}
        >
          <ThemedText style={styles.randomButtonText}>
            {isSpinning ? '🎲 Spinning...' : '🎲 Random Pick'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <RandomWheel
        items={watchlist}
        isSpinning={isSpinning}
        onSpinComplete={handleSpinComplete}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 24,
  },
  subtitle: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 16,
  },
  randomButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  randomButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  randomButtonDisabled: {
    opacity: 0.6,
    backgroundColor: '#999',
  },
});
