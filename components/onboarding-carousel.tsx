import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAsyncStorageBoolean } from '@/hooks/use-async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPosterBackground } from './animated-poster-background';
import { OnboardingSlide } from './onboarding-slide';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlideData {
  id: number;
  title: string;
  highlightedText: string;
  subtitle: string;
  buttonText: string;
}

const onboardingSlides: OnboardingSlideData[] = [
  {
    id: 1,
    title: 'Download the app',
    highlightedText: 'and discover your next favorite film!',
    subtitle: 'Build your personal watchlist and let ORQCS randomly select what to watch tonight. End the endless scrolling and start enjoying great movies.',
    buttonText: 'Get Started Now',
  },
  {
    id: 2,
    title: 'Smart Selection',
    highlightedText: 'powered by AI recommendations',
    subtitle: 'Our intelligent algorithm learns your preferences and suggests movies you\'ll love. Filter by genre, year, rating, and more.',
    buttonText: 'Continue',
  },
  {
    id: 3,
    title: 'Never miss',
    highlightedText: 'a great movie again',
    subtitle: 'Available in multiple languages and synced across all your devices. Your watchlist is always with you.',
    buttonText: 'Start Watching',
  },
];

/**
 * Props for the OnboardingCarousel component
 */
export interface OnboardingCarouselProps {
  /** Callback when onboarding is completed */
  onComplete?: () => void;
  /** Custom slides data (optional) */
  slides?: OnboardingSlideData[];
}

/**
 * A full-featured onboarding carousel that displays multiple OnboardingSlide components.
 * Handles horizontal scrolling, slide navigation, and onboarding completion.
 * Integrates with the app's AsyncStorage for tracking completion state.
 *
 * @example
 * ```tsx
 * <OnboardingCarousel
 *   onComplete={() => router.push('/home')}
 * />
 * ```
 */
export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({
  onComplete,
  slides = onboardingSlides,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const [, setHasLaunched] = useAsyncStorageBoolean('hasLaunched', false);
  const insets = useSafeAreaInsets();

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    if (index !== currentIndex && index >= 0 && index < slides.length) {
      setCurrentIndex(index);
      // Add haptic feedback when slide changes
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [currentIndex, slides.length]);

  const scrollToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
      setCurrentIndex(index);
      // Add haptic feedback for programmatic scrolling
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [slides.length]);

  const completeOnboarding = useCallback(async () => {
    try {
      // Add success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await setHasLaunched(true);
      if (onComplete) {
        onComplete();
      } else {
        // Default navigation to auth choice
        setTimeout(() => {
          router.replace('/auth-choice');
        }, 100);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Fallback navigation even if AsyncStorage fails
      if (onComplete) {
        onComplete();
      } else {
        router.replace('/auth-choice');
      }
    }
  }, [setHasLaunched, onComplete, router]);

  const handleButtonPress = useCallback(async () => {
    if (currentIndex < slides.length - 1) {
      // Navigate to next slide
      scrollToSlide(currentIndex + 1);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  }, [currentIndex, slides.length, scrollToSlide, completeOnboarding]);

  // Memoize slides rendering for performance
  const renderedSlides = useMemo(() =>
    slides.map((slide, index) => (
      <OnboardingSlide
        key={slide.id}
        title={slide.title}
        highlightedText={slide.highlightedText}
        subtitle={slide.subtitle}
        buttonText={index === slides.length - 1 ? slide.buttonText : 'Continue'}
        onButtonPress={handleButtonPress}
        showButton={false}
      />
    )), [slides, handleButtonPress]);

  return (
    <View style={styles.container}>
      {/* Render animated background once so it doesn't restart on slide changes */}
      <AnimatedPosterBackground />
      {/* Persistent top-right Skip button */}
      <View style={[styles.skipWrapper, { paddingTop: insets.top + 12 }]} pointerEvents="box-none">
        <View style={styles.skipInner}>
          {currentIndex < slides.length - 1 && (
            <View style={styles.skipButton}>
              <Text onPress={completeOnboarding} style={styles.skipText}>Skip</Text>
            </View>
          )}
        </View>
      </View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onScrollEndDrag={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        bounces={false}
        decelerationRate="fast"
        directionalLockEnabled
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
      >
        {renderedSlides}
      </ScrollView>
      {/* Persistent CTA button above dots */}
      <View style={[styles.ctaContainer, { paddingBottom: Math.max(insets.bottom + 56, 96) }]}>
        <Text onPress={handleButtonPress} style={styles.ctaButtonText}>
          {currentIndex === slides.length - 1 ? slides[slides.length - 1].buttonText : 'Continue'}
        </Text>
      </View>
      {/* Persistent dots indicator */}
      <View style={[styles.dotsContainer, { paddingBottom: Math.max(insets.bottom, 16) }]} pointerEvents="none">
        {Array.from({ length: slides.length }, (_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

OnboardingCarousel.displayName = 'OnboardingCarousel';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  ctaContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 15,
  },
  ctaButtonText: {
    backgroundColor: 'rgba(26,26,26,1)',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: '100%',
    maxWidth: 320,
    textAlign: 'center',
    overflow: 'hidden',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  skipWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 20,
  },
  skipInner: {
    alignItems: 'flex-end',
    paddingTop: 12,
    paddingRight: 24,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 24,
  },
});