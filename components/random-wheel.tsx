import { WatchlistItem } from '@/lib/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from './themed-text';

interface RandomWheelProps {
  items: WatchlistItem[];
  isSpinning: boolean;
  onSpinComplete: (selectedItem: WatchlistItem | null) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export function RandomWheel({ items, isSpinning, onSpinComplete }: RandomWheelProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const isSpinningRef = useRef(false);

  const availableItems = useMemo(() => {
    return items.filter(item => !item.watched);
  }, [items]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const startSpinning = useCallback(() => {
    if (isSpinningRef.current || availableItems.length === 0) {
      return;
    }

    isSpinningRef.current = true;
    console.log('RandomWheel: Starting spin animation');

    // Show the display with entrance animation
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withTiming(1, { duration: 300 });

    // Select the final item
    const randomItemIndex = Math.floor(Math.random() * availableItems.length);
    const finalSelectedItem = availableItems[randomItemIndex];
    setSelectedItem(finalSelectedItem);

    console.log(`RandomWheel: Selected item: ${finalSelectedItem?.title}`);

    let currentIndex = 0;
    let cycleCount = 0;
    const totalCycles = 15 + Math.floor(Math.random() * 10); // 15-25 total cycles
    const maxSpeed = 50; // Fastest interval in ms
    const minSpeed = 300; // Slowest interval in ms

    const cycleItems = () => {
      // Check if we should still be spinning
      if (!isSpinningRef.current) {
        return;
      }

      setCurrentItemIndex(currentIndex);
      currentIndex = (currentIndex + 1) % availableItems.length;
      cycleCount++;

      if (cycleCount >= totalCycles) {
        // Stop on the selected item
        const finalIndex = availableItems.findIndex(item => item.id === finalSelectedItem.id);
        setCurrentItemIndex(finalIndex >= 0 ? finalIndex : 0);

        // Hide after delay and complete
        setTimeout(() => {
          opacity.value = withTiming(0, { duration: 500 });
          scale.value = withTiming(0.8, { duration: 500 });
          setTimeout(() => {
            isSpinningRef.current = false;
            runOnJS(onSpinComplete)(finalSelectedItem);
          }, 500);
        }, 1000);
        return;
      }

      // Calculate speed - start fast, slow down towards the end
      const progress = cycleCount / totalCycles;
      const speed = maxSpeed + (minSpeed - maxSpeed) * Math.pow(progress, 2);

      animationRef.current = setTimeout(cycleItems, speed);
    };

    // Start cycling
    cycleItems();
  }, [availableItems, opacity, scale, onSpinComplete]);

  const stopSpinning = useCallback(() => {
    console.log('RandomWheel: Stopping spin animation');
    isSpinningRef.current = false;

    // Clear any pending animations
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }

    // Reset values
    opacity.value = 0;
    scale.value = 0.8;
    setCurrentItemIndex(0);
    setSelectedItem(null);
  }, [opacity, scale]);

  useEffect(() => {
    if (isSpinning && !isSpinningRef.current) {
      startSpinning();
    } else if (!isSpinning && isSpinningRef.current) {
      stopSpinning();
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isSpinning, startSpinning, stopSpinning]);

  if (!isSpinning || availableItems.length === 0) {
    return null;
  }

  const currentItem = availableItems[currentItemIndex];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.displayContainer, containerAnimatedStyle]}>
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <ThemedText style={styles.itemTitle} numberOfLines={2}>
            {currentItem?.title || ''}
          </ThemedText>
          <ThemedText style={styles.itemYear}>
            {currentItem?.year || ''}
          </ThemedText>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
  },
  displayContainer: {
    width: screenWidth - 40,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  itemYear: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});