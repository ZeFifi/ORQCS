import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import Animated, { Easing, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

// Animation configuration constants
const POSTER_WIDTH = 200;
const POSTER_SPACING = 10;
const POSTERS_COUNT = 8; // From AnimatedPosterBackground
const ANIMATION_DURATION = 25000; // 25 seconds for one complete cycle - faster to show independence
const RANDOM_VARIATION = 2000; // ±2 seconds random variation to prevent perceived synchronization

interface AnimationContextType {
  translateX: Animated.SharedValue<number>;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

interface AnimationProviderProps {
  children: ReactNode;
}

/**
 * AnimationProvider manages global animation state for persistent poster movement
 * across onboarding slide navigation. The animation runs continuously without
 * resetting when slides change.
 *
 * Features:
 * - Single shared translateX value for all poster animations
 * - Continuous animation with infinite repeat and random timing variation
 * - 25-second base animation cycle with ±2s random variation
 * - Smooth bezier easing to visually differentiate from carousel scroll
 * - Complete independence from carousel scroll events
 */
export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const translateX = useSharedValue(0);

  // Calculate animation parameters
  const totalPosterWidth = POSTERS_COUNT * (POSTER_WIDTH + POSTER_SPACING);
  const startPosition = -totalPosterWidth;
  const endPosition = 0;

  useEffect(() => {
    // Add random variation to animation duration to prevent perceived synchronization
    const randomVariation = (Math.random() - 0.5) * RANDOM_VARIATION;
    const actualDuration = ANIMATION_DURATION + randomVariation;

    // Start the continuous animation once when provider mounts
    translateX.value = startPosition;
    translateX.value = withRepeat(
      withTiming(endPosition, {
        duration: actualDuration,
        easing: Easing.linear, // Keep a constant pace
      }),
      -1, // Infinite repeat
      false // Don't reverse
    );
  }, [translateX, startPosition, endPosition]);

  const value = {
    translateX,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

/**
 * Hook to access the shared animation context
 * @returns AnimationContextType containing the shared translateX value
 * @throws Error if used outside of AnimationProvider
 */
export const useAnimationContext = (): AnimationContextType => {
  const context = useContext(AnimationContext);

  if (context === undefined) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }

  return context;
};

AnimationProvider.displayName = 'AnimationProvider';