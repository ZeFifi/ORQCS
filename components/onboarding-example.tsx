import React from 'react';
import { OnboardingSlide } from './onboarding-slide';

/**
 * Example usage of the OnboardingSlide component
 * This shows how to use a single slide with custom content
 */
export const OnboardingExample: React.FC = () => {
  const handleGetStarted = () => {
    console.log('Get started pressed!');
    // Handle navigation or any other action
  };

  return (
    <OnboardingSlide
      title="Download the app"
      highlightedText="and discover your next favorite film!"
      subtitle="Build your personal watchlist and let ORQCS randomly select what to watch tonight. End the endless scrolling and start enjoying great movies."
      buttonText="Get Started Now"
      onButtonPress={handleGetStarted}
    />
  );
};

OnboardingExample.displayName = 'OnboardingExample';