import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UseAsyncStorageReturn<T> = [
  T | null,
  (value: T | null) => Promise<void>,
  boolean,
  Error | null
];

export function useAsyncStorage<T = string>(
  key: string,
  initialValue?: T
): UseAsyncStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T | null>(initialValue ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const value = await AsyncStorage.getItem(key);

      if (value !== null) {
        try {
          const parsedValue = JSON.parse(value) as T;
          setStoredValue(parsedValue);
        } catch {
          // If parsing fails, assume it's a string
          setStoredValue(value as T);
        }
      } else {
        setStoredValue(initialValue ?? null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get value from AsyncStorage');
      setError(error);
      console.error(`Error getting AsyncStorage key "${key}":`, error);
    } finally {
      setLoading(false);
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    async (value: T | null) => {
      try {
        setError(null);

        if (value === null) {
          await AsyncStorage.removeItem(key);
        } else {
          const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
          await AsyncStorage.setItem(key, stringValue);
        }

        setStoredValue(value);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to set value in AsyncStorage');
        setError(error);
        console.error(`Error setting AsyncStorage key "${key}":`, error);
        throw error;
      }
    },
    [key]
  );

  useEffect(() => {
    getValue();
  }, [getValue]);

  return [storedValue, setValue, loading, error];
}

export function useAsyncStorageString(key: string, initialValue?: string) {
  return useAsyncStorage<string>(key, initialValue);
}

export function useAsyncStorageBoolean(key: string, initialValue?: boolean) {
  return useAsyncStorage<boolean>(key, initialValue);
}

export function useAsyncStorageObject<T extends object>(key: string, initialValue?: T) {
  return useAsyncStorage<T>(key, initialValue);
}