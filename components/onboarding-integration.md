# Onboarding Components Integration Guide

This document explains how to integrate the new cinema-themed onboarding components into the ORQCS app.

## Components Overview

### OnboardingSlide
A single onboarding slide with:
- Full-screen background image from Unsplash
- Gradient overlay for text readability
- Typography hierarchy (title, highlighted text, subtitle)
- Carousel dots indicator
- Call-to-action button
- Theme-aware styling

### OnboardingCarousel
A complete carousel implementation with:
- Horizontal scrolling between slides
- Automatic dot indicator updates
- AsyncStorage integration for completion tracking
- Customizable slide content
- Navigation to auth screen on completion

## Quick Integration

### Option 1: Replace Existing Onboarding
Replace the current `/app/onboarding.tsx` with `/app/onboarding-new.tsx`:

```bash
mv app/onboarding.tsx app/onboarding-old.tsx
mv app/onboarding-new.tsx app/onboarding.tsx
```

### Option 2: Use as Alternative Screen
Keep existing onboarding and use new design for specific flows:

```tsx
// In your navigation logic
if (shouldUseNewDesign) {
  router.push('/onboarding-new');
} else {
  router.push('/onboarding');
}
```

### Option 3: Custom Implementation
Use individual components for custom layouts:

```tsx
import { OnboardingSlide } from '@/components/onboarding-slide';

export default function CustomOnboarding() {
  return (
    <OnboardingSlide
      title="Welcome to ORQCS"
      highlightedText="your movie companion"
      subtitle="Discover amazing films curated just for you"
      buttonText="Start Exploring"
      onButtonPress={handleStart}
      currentIndex={0}
      totalSlides={1}
    />
  );
}
```

## Customization

### Styling
Components respect the app's theme system:
- Light/dark mode support
- Uses `useThemeColor` hook
- Follows existing typography patterns
- Responsive design for different screen sizes

### Colors
Highlight colors are theme-aware:
- Light mode: Golden yellow (#FFD700)
- Dark mode: Light green (#90EE90)
- Button: Dark background with white text

## File Structure

```
components/
├── onboarding-slide.tsx      # Individual slide component
├── onboarding-carousel.tsx   # Complete carousel
└── onboarding-example.tsx    # Usage example

app/
├── onboarding.tsx            # Existing onboarding (preserved)
└── onboarding-new.tsx        # New cinema-themed onboarding
```

## Dependencies

The components use only existing project dependencies:
- React Native core components
- expo-router for navigation
- react-native-safe-area-context
- Existing hooks and theme system

No additional packages required.

## Performance Considerations

- Images are loaded from Unsplash CDN
- Components use React.memo for optimization
- Styles are memoized with useMemo
- Minimal re-renders during carousel navigation

## Accessibility

- Proper semantic structure
- Safe area handling
- Touch targets meet minimum size requirements
- Supports dynamic font scaling

## Testing

To test the new components:

1. Start the development server: `npm start`
2. Navigate to `/onboarding-new` to see the full carousel
3. Test on both iOS and Android
4. Verify theme switching works correctly
5. Test completion flow and AsyncStorage integration