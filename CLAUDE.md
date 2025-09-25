# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ORQCS (French: "On regarde quoi ce soir", English: "What do we watch tonight") is a mobile application built with Expo and React Native that helps users randomly select movies or series from their watchlist.

## Development Commands

- `npm install` - Install dependencies
- `npm start` or `npx expo start` - Start the development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset to blank project template

## Architecture & Key Technologies

- **Framework**: Expo 54 with React Native 0.81.4
- **Navigation**: React Navigation v7 with file-based routing (expo-router)
- **Language**: TypeScript
- **UI**: Custom components with themed styling and dark/light mode support
- **Animations**: React Native Reanimated v4 and Worklets
- **Database**: Supabase (planned)
- **API**: OMDB API for movie/series data

## Project Structure

```
app/                    # File-based routing with expo-router
  (tabs)/              # Tab navigation group
    index.tsx          # Home screen
    explore.tsx        # Explore screen
    _layout.tsx        # Tab layout configuration
  _layout.tsx          # Root layout with theme provider
  modal.tsx            # Modal screen
components/            # Reusable UI components
  ui/                  # Base UI components (icons, collapsible)
  themed-*.tsx         # Theme-aware components
  haptic-tab.tsx       # Custom tab with haptic feedback
hooks/                 # Custom React hooks
  use-color-scheme.ts  # Theme detection hook
constants/
  theme.ts             # Color definitions and theme constants
```

## Key Features to Implement

Based on PRD.md requirements:
- User authentication with Supabase
- Watchlist management (add/remove movies/series)
- Random selection with filtering options
- Internationalization (fr, en, es, de, pt)
- Dark/light mode theming
- Onboarding carousel for first-time users
- OMDB API integration for movie data

## Development Notes

- Uses Expo's file-based routing system - screens are defined by file structure in `app/` directory
- Custom theming system with `Colors` constants and theme-aware components
- Haptic feedback integration for enhanced UX
- Component organization separates UI primitives from themed components
- TypeScript configuration includes Expo-specific types