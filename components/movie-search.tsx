import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { omdbService } from '@/lib/omdb';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { OMDBSearchResult } from '@/lib/types';

export function MovieSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<OMDBSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addToWatchlist, isInWatchlist } = useWatchlist();

  const borderColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'tabIconDefault');
  const backgroundColor = useThemeColor({}, 'background');

  const searchMovies = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await omdbService.searchMovies(searchQuery);
      if (response.Response === 'True' && response.Search) {
        setResults(response.Search);
      } else {
        setResults([]);
        if (response.Error) {
          setError(response.Error);
        }
      }
    } catch {
      setError('Failed to search movies');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        searchMovies(query);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, searchMovies]);

  const handleAddToWatchlist = useCallback(async (item: OMDBSearchResult) => {
    if (isInWatchlist(item.imdbID)) {
      Alert.alert('Already Added', 'This item is already in your watchlist');
      return;
    }

    const success = await addToWatchlist(item);
    if (success) {
      Alert.alert('Added!', `"${item.Title}" has been added to your watchlist`);
    } else {
      Alert.alert('Error', 'Failed to add item to watchlist');
    }
  }, [addToWatchlist, isInWatchlist]);

  const renderMovieItem = ({ item }: { item: OMDBSearchResult }) => {
    const inWatchlist = isInWatchlist(item.imdbID);

    return (
      <ThemedView style={styles.movieItem}>
        <Image
          source={{ uri: item.Poster !== 'N/A' ? item.Poster : undefined }}
          style={styles.poster}
          defaultSource={require('@/assets/images/icon.png')}
        />
        <View style={styles.movieInfo}>
          <ThemedText style={styles.title}>{item.Title}</ThemedText>
          <ThemedText style={styles.year}>
            {item.Year} • {item.Type.charAt(0).toUpperCase() + item.Type.slice(1)}
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.addButton,
              inWatchlist && styles.addedButton
            ]}
            onPress={() => handleAddToWatchlist(item)}
            disabled={inWatchlist}
          >
            <ThemedText style={[
              styles.addButtonText,
              inWatchlist && styles.addedButtonText
            ]}>
              {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[
          styles.searchInput,
          { borderColor, backgroundColor, color: borderColor }
        ]}
        placeholder="Search movies and series..."
        placeholderTextColor={placeholderColor}
        value={query}
        onChangeText={setQuery}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>Searching...</ThemedText>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.imdbID}
        renderItem={renderMovieItem}
        style={styles.resultsList}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
  },
  resultsList: {
    flex: 1,
  },
  movieItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 12,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addedButton: {
    backgroundColor: '#34C759',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  addedButtonText: {
    color: 'white',
  },
});