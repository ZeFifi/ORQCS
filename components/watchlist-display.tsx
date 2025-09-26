import React from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { WatchlistItem } from '@/lib/types';

export function WatchlistDisplay() {
  const { watchlist, removeFromWatchlist, markAsWatched, getRandomItem } = useWatchlist();

  const handleRemove = (item: WatchlistItem) => {
    Alert.alert(
      'Remove Item',
      `Remove "${item.title}" from your watchlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromWatchlist(item.imdbID),
        },
      ]
    );
  };

  const handleToggleWatched = (item: WatchlistItem) => {
    markAsWatched(item.imdbID, !item.watched);
  };

  const handleRandomPick = () => {
    const randomItem = getRandomItem();
    if (randomItem) {
      Alert.alert(
        'Random Pick! 🎬',
        `Tonight you should watch: "${randomItem.title}" (${randomItem.year})`
      );
    } else {
      Alert.alert('No Items', 'Add some movies or series to your watchlist first!');
    }
  };

  const renderItem = ({ item }: { item: WatchlistItem }) => (
    <ThemedView style={[styles.item, item.watched && styles.watchedItem]}>
      <Image
        source={{ uri: item.poster !== 'N/A' ? item.poster : undefined }}
        style={[styles.poster, item.watched && styles.watchedPoster]}
        defaultSource={require('@/assets/images/icon.png')}
      />
      <View style={styles.info}>
        <ThemedText style={[styles.title, item.watched && styles.watchedText]}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.details}>
          {item.year} • {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </ThemedText>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.watchedButton]}
            onPress={() => handleToggleWatched(item)}
          >
            <ThemedText style={styles.buttonText}>
              {item.watched ? 'Mark Unwatched' : 'Mark Watched'}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={() => handleRemove(item)}
          >
            <ThemedText style={styles.buttonText}>Remove</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );

  if (watchlist.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>Your watchlist is empty</ThemedText>
        <ThemedText style={styles.emptySubtext}>
          Search for movies and series to add them to your watchlist
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.count}>
          {watchlist.length} item{watchlist.length !== 1 ? 's' : ''} in watchlist
        </ThemedText>
        <TouchableOpacity style={styles.randomButton} onPress={handleRandomPick}>
          <ThemedText style={styles.randomButtonText}>🎲 Random Pick</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        nestedScrollEnabled={true}
      >
        {watchlist.map((item) => (
          <View key={item.id}>
            {renderItem({ item })}
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  count: {
    fontSize: 16,
    opacity: 0.7,
  },
  randomButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  randomButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  watchedItem: {
    opacity: 0.6,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 12,
  },
  watchedPoster: {
    opacity: 0.5,
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  watchedText: {
    textDecorationLine: 'line-through',
  },
  details: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  watchedButton: {
    backgroundColor: '#34C759',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});