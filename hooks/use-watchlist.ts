import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WatchlistItem, OMDBSearchResult } from '../lib/types';

const WATCHLIST_STORAGE_KEY = '@orqcs_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWatchlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const storedWatchlist = await AsyncStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (err) {
      console.error('Failed to load watchlist:', err);
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveWatchlist = useCallback(async (newWatchlist: WatchlistItem[]) => {
    try {
      await AsyncStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(newWatchlist));
      setWatchlist(newWatchlist);
    } catch (err) {
      console.error('Failed to save watchlist:', err);
      setError('Failed to save watchlist');
    }
  }, []);

  const addToWatchlist = useCallback(
    async (item: OMDBSearchResult) => {
      try {
        const existingItem = watchlist.find((w) => w.imdbID === item.imdbID);
        if (existingItem) {
          setError('Item already in watchlist');
          return false;
        }

        const newItem: WatchlistItem = {
          id: `${item.imdbID}_${Date.now()}`,
          title: item.Title,
          year: item.Year,
          type: item.Type === 'movie' ? 'movie' : 'series',
          poster: item.Poster,
          imdbID: item.imdbID,
          addedAt: new Date().toISOString(),
          watched: false,
        };

        const updatedWatchlist = [...watchlist, newItem];
        await saveWatchlist(updatedWatchlist);
        setError(null);
        return true;
      } catch (err) {
        console.error('Failed to add to watchlist:', err);
        setError('Failed to add to watchlist');
        return false;
      }
    },
    [watchlist, saveWatchlist]
  );

  const removeFromWatchlist = useCallback(
    async (imdbID: string) => {
      try {
        const updatedWatchlist = watchlist.filter((item) => item.imdbID !== imdbID);
        await saveWatchlist(updatedWatchlist);
        setError(null);
        return true;
      } catch (err) {
        console.error('Failed to remove from watchlist:', err);
        setError('Failed to remove from watchlist');
        return false;
      }
    },
    [watchlist, saveWatchlist]
  );

  const markAsWatched = useCallback(
    async (imdbID: string, watched: boolean = true) => {
      try {
        const updatedWatchlist = watchlist.map((item) =>
          item.imdbID === imdbID ? { ...item, watched } : item
        );
        await saveWatchlist(updatedWatchlist);
        setError(null);
        return true;
      } catch (err) {
        console.error('Failed to update watch status:', err);
        setError('Failed to update watch status');
        return false;
      }
    },
    [watchlist, saveWatchlist]
  );

  const isInWatchlist = useCallback(
    (imdbID: string) => {
      return watchlist.some((item) => item.imdbID === imdbID);
    },
    [watchlist]
  );

  const getRandomItem = useCallback(
    (filterWatched: boolean = true) => {
      const availableItems = filterWatched
        ? watchlist.filter((item) => !item.watched)
        : watchlist;

      if (availableItems.length === 0) return null;

      const randomIndex = Math.floor(Math.random() * availableItems.length);
      return availableItems[randomIndex];
    },
    [watchlist]
  );

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    markAsWatched,
    isInWatchlist,
    getRandomItem,
    refreshWatchlist: loadWatchlist,
  };
}