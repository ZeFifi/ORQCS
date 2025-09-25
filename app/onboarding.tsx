import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { setHasLaunched } from '@/utils/storage';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Build Your Watchlist',
    description: 'Add movies and series you want to watch to your personal watchlist.',
    icon: '📝',
  },
  {
    id: 2,
    title: 'Smart Filtering',
    description: 'Filter by genre, year, rating and more to narrow down your choices.',
    icon: '🎯',
  },
  {
    id: 3,
    title: 'Random Selection',
    description: 'Let ORQCS randomly pick what to watch tonight and end the endless scrolling.',
    icon: '🎲',
  },
  {
    id: 4,
    title: 'Multiple Languages',
    description: 'Available in French, English, Spanish, German, and Portuguese.',
    icon: '🌍',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const scrollToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollToSlide(currentIndex + 1);
    } else {
      await setHasLaunched();
      router.replace('/auth-choice');
    }
  };

  const handleSkip = async () => {
    await setHasLaunched();
    router.replace('/auth-choice');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    skipButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    skipText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    scrollView: {
      flex: 1,
    },
    slide: {
      width,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    icon: {
      fontSize: 80,
      marginBottom: 40,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    description: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 24,
      opacity: 0.8,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      paddingTop: 20,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 40,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 5,
      backgroundColor: colors.text,
      opacity: 0.3,
    },
    activeDot: {
      opacity: 1,
    },
    nextButton: {
      backgroundColor: colors.tint,
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 25,
      alignSelf: 'center',
      minWidth: 120,
    },
    nextButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {onboardingData.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <Text style={styles.icon}>{slide.icon}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
              onPress={() => scrollToSlide(index)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}