import React, { useEffect, useMemo } from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  View
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';
// Removed background here; it is rendered once in the carousel to keep animation continuous

const { width: screenWidth } = Dimensions.get('window');

/**
 * Props for the OnboardingSlide component
 */
export interface OnboardingSlideProps {
  /** Title text to display */
  title: string;
  /** Highlighted portion of the title (will be styled differently) */
  highlightedText: string;
  /** Subtitle/description text */
  subtitle: string;
  /** Button text */
  buttonText: string;
  /** Callback when button is pressed */
  onButtonPress: () => void;
  /** Whether to show the inline CTA button (hidden when carousel renders a persistent CTA) */
  showButton?: boolean;
}

/**
 * A modern onboarding slide component with cinema-themed design.
 * Features a full-screen background image with gradient overlay,
 * typography hierarchy, carousel dots, and a call-to-action button.
 *
 * @example
 * ```tsx
 * <OnboardingSlide
 *   title="Download the app"
 *   highlightedText="and discover your next favorite film!"
 *   subtitle="Build your personal watchlist..."
 *   buttonText="Get Started Now"
 *   onButtonPress={() => console.log('Button pressed')}
 *   currentIndex={0}
 *   totalSlides={3}
 * />
 * ```
 */
export const OnboardingSlide: React.FC<OnboardingSlideProps> = React.memo(({
  title,
  highlightedText,
  subtitle,
  buttonText,
  onButtonPress,
  showButton = true,
}) => {
  // Animation values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);
  const titleScale = useSharedValue(0.9);
  const buttonScale = useSharedValue(1);
  const buttonPressed = useSharedValue(0);

  // Theme-aware colors
  const buttonBackgroundColor = useThemeColor(
    { light: '#1a1a1a', dark: '#2a2a2a' },
    'surface'
  );

  const highlightColor = useThemeColor(
    { light: '#FFD700', dark: '#90EE90' },
    'warning'
  );

  // Animate content on initial mount only (do not re-trigger on swipe)
  useEffect(() => {
    // Reset and animate in
    contentOpacity.value = 0;
    contentTranslateY.value = 30;
    titleScale.value = 0.9;

    contentOpacity.value = withDelay(100, withTiming(1, { duration: 800 }));
    contentTranslateY.value = withDelay(100, withSpring(0, { damping: 20, stiffness: 200 }));
    titleScale.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 300 }));
  }, [contentOpacity, contentTranslateY, titleScale]);

  // Animated styles
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(buttonPressed.value, [0, 1], [1, 0.95]);
    return {
      transform: [{ scale: buttonScale.value * scale }],
    };
  });

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      width: screenWidth,
    },
    backgroundImage: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    gradient: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingHorizontal: 24,
      paddingBottom: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    contentContainer: {
      alignItems: 'center',
      paddingTop: 20,
      justifyContent: 'center',
      flex: 1,
    },
    // Skip and dots moved to carousel level for persistence
    titleContainer: {
      marginBottom: 16,
      width: '100%',
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'left',
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    highlightedTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: highlightColor,
      textAlign: 'left',
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'left',
      lineHeight: 24,
      marginBottom: 48,
    },
  }), [highlightColor]);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.gradient}>
          <SafeAreaView style={styles.contentContainer}>
            {/* Persistent controls (Skip & Dots) are rendered by the carousel */}

            {/* Title - with scale animation */}
            <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
              <Animated.Text style={[styles.title, contentAnimatedStyle]}>{title}</Animated.Text>
              <Animated.Text style={[styles.highlightedTitle, contentAnimatedStyle]}>{highlightedText}</Animated.Text>
            </Animated.View>

            {/* Subtitle - with fade and slide */}
            <Animated.Text style={[styles.subtitle, contentAnimatedStyle]}>{subtitle}</Animated.Text>

          </SafeAreaView>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
});

OnboardingSlide.displayName = 'OnboardingSlide';