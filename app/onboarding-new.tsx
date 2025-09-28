import { StatusBar } from 'expo-status-bar';

import { OnboardingCarousel } from '@/components/onboarding-carousel';

/**
 * New onboarding screen with cinema-themed design
 * Following the design specifications with background images,
 * gradient overlays, and modern typography
 */
export default function NewOnboardingScreen() {
  return (
    <>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <OnboardingCarousel />
    </>
  );
}