import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
} from 'react-native-reanimated';

import { useAnimationContext } from '@/contexts/AnimationContext';

const { height: screenHeight } = Dimensions.get('window');

// Local poster images
const POSTERS = [
  require('@/assets/onboarding/8-mile.jpeg'),
  require('@/assets/onboarding/da-vinci-code.jpeg'),
  require('@/assets/onboarding/gilmore-girls.jpeg'),
  require('@/assets/onboarding/la-residence.jpeg'),
  require('@/assets/onboarding/wonka.jpeg'),
  require('@/assets/onboarding/hotel-transylvania.jpeg'),
  require('@/assets/onboarding/pearl-harbor.jpeg'),
  require('@/assets/onboarding/suits.jpeg'),
];

// Configuration
const POSTER_WIDTH = 200;
const POSTER_HEIGHT = 260;
const POSTER_SPACING = 10;
const ROTATION_ANGLE = -5; // Degrees of inclination
const MAX_HORIZONTAL_OFFSET = 80; // Maximum random horizontal offset in pixels
const ROW_VARIATION_MULTIPLIER = 0.1; // Subtle row variation for visual independence

/**
 * Animated background component with movie posters moving from left to right
 * Features:
 * - Continuous horizontal scrolling animation
 * - Inclined poster layout (rotated by specified degrees)
 * - Rounded corners on all posters
 * - Seamless loop with duplicated posters
 */
export const AnimatedPosterBackground: React.FC = () => {
  // Use shared animation context for persistent animation across slides
  const { translateX } = useAnimationContext();

  // Create animated style for base animation with row-specific variation
  const createRowAnimatedStyle = (rowOffset: number) => {
    return useAnimatedStyle(() => {
      'worklet';
      // Add slight variation per row to enhance visual independence
      const rowVariation = rowOffset * 0.1; // Small multiplier for subtle effect
      return {
        transform: [
          { translateX: translateX.value + rowVariation },
          { rotate: `${ROTATION_ANGLE}deg` },
        ],
      };
    });
  };

  // Simple seeded random function for consistent results
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate random horizontal offset for a row
  const getRowHorizontalOffset = (rowIndex: number): number => {
    // Use row index as seed for consistent randomization
    const random = seededRandom(rowIndex * 123.456); // Multiply by arbitrary number for better distribution
    return (random - 0.5) * MAX_HORIZONTAL_OFFSET; // Range: -40 to +40 pixels
  };

  // Shuffle posters for a row using seeded randomization
  const getShuffledPosters = (rowIndex: number) => {
    const shuffled = [...POSTERS];
    // Simple Fisher-Yates shuffle with seeded random
    for (let i = shuffled.length - 1; i > 0; i--) {
      const random = seededRandom(rowIndex * 789.012 + i);
      const j = Math.floor(random * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Render a row of posters with optional shuffling
  const renderPosterRowWithShuffle = (keyPrefix: string, rowIndex: number) => {
    const postersToRender = getShuffledPosters(rowIndex);
    return postersToRender.map((poster, index) => (
      <Image
        key={`${keyPrefix}-${index}`}
        source={poster}
        style={styles.poster}
        resizeMode="cover"
      />
    ));
  };

  // Create multiple rows for better coverage
  const renderMultipleRows = () => {
    const rows = [];
    const rowSpacing = 10; // 10px spacing between rows
    const numberOfRows = Math.ceil(screenHeight / (POSTER_HEIGHT + rowSpacing)) + 2;

    for (let row = 0; row < numberOfRows; row++) {
      const horizontalOffset = getRowHorizontalOffset(row);
      const rowAnimatedStyle = createRowAnimatedStyle(horizontalOffset);

      rows.push(
        <Animated.View
          key={`row-${row}`}
          style={[
            styles.posterRow,
            rowAnimatedStyle,
            {
              top: row * (POSTER_HEIGHT + rowSpacing) - 200,
              left: horizontalOffset, // Add random horizontal offset
            },
          ]}
        >
          {/* Original set of posters with shuffled order */}
          {renderPosterRowWithShuffle(`original-${row}`, row)}
          {/* Duplicated set for seamless loop with same shuffle */}
          {renderPosterRowWithShuffle(`duplicate-${row}`, row)}
        </Animated.View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <View style={styles.postersContainer}>
        {renderMultipleRows()}
      </View>
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)', '#000000']}
        locations={[0, 0.6, 1]}
        style={styles.overlay}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  postersContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.4, // Make posters subtle so they don't interfere with text
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  posterRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    marginRight: POSTER_SPACING,
    borderRadius: 6, // Rounded corners
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

AnimatedPosterBackground.displayName = 'AnimatedPosterBackground';