import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MovieSearch } from '@/components/movie-search';
import { WatchlistDisplay } from '@/components/watchlist-display';

export default function WatchlistScreen() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'search'>('watchlist');

  if (activeTab === 'search') {
    return (
      <ThemedView style={styles.searchContainer}>
        <ThemedView style={styles.searchHeader}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Watchlist</ThemedText>
          </ThemedView>

          <ThemedView style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'watchlist' && styles.activeTab]}
              onPress={() => setActiveTab('watchlist')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'watchlist' && styles.activeTabText]}>
                My Watchlist
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'search' && styles.activeTab]}
              onPress={() => setActiveTab('search')}
            >
              <ThemedText style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
                Add Movies
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <MovieSearch />
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="list.bullet"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Watchlist</ThemedText>
      </ThemedView>

      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'watchlist' && styles.activeTab]}
          onPress={() => setActiveTab('watchlist')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'watchlist' && styles.activeTabText]}>
            My Watchlist
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'search' && styles.activeTab]}
          onPress={() => setActiveTab('search')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
            Add Movies
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <View style={styles.contentContainer}>
        <WatchlistDisplay />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    minHeight: 400,
  },
  searchContainer: {
    flex: 1,
  },
  searchHeader: {
    padding: 32,
    paddingBottom: 0,
  },
});