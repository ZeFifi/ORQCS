# Project Requirements Document

## Project Overview

The project is a mobile application called ORQCS (in french "On regarde quoi ce soir", in english "What do we watch tonight") made with Expo and React Native that allows users to select a movie or a series from their watchlist without wasting time choosing what to watch for minutes.

## Features of MVP

- User authentication
- Watchlist management (add, remove)
- Uses OMDB API: https://www.omdbapi.com/ for fetching movie or series data
- Animations
- Random selection of a movie or a series from the watchlist
- Ability to filter the watchlist (by genre, by year, by rating, etc.) before launching the random selection
- Internationalization (fr, en, es, de, pt) based on the device language
- Dark / Light mode
- Splash screen
- Toaster for handling errors and success messages
- Horizontal navigation at the bottom of the screen
- Database for storing user data with Supabase

## Launching the app for the first time
- Show a splash screen with the app logo
- Show a carousel with the app features and dots to navigate through the carousel with a swipe gesture
- Show a button to skip the carousel
- After reading the carousel or skipping it, show a new screen with a button to login or sign up
- If choice is to sign up, show a new screen with a form to sign up with:
  - email and password
  - firstname
  - lastname
  - date of birth
  - country
  - a button to register
  OR at the top of the form:
  - a button to register with Google
  - a button to register with Apple
- If choice is to login, show a new screen with a form to login with:
  - email and password
  - a button to login
  OR at the top of the form:
  - a button to login with Google
  - a button to login with Apple

## Launching the app next time
- If the user is logged in, show the home screen
- If the user is not logged in, show the login screen with a button to sign up or login

## Home screen
- Show a horizontal navigation at the bottom of the screen with the following tabs with icons ONLY (no text):
  - Home (default tab)
  - Watchlist
  - Settings
- A button to launch the random selection

## Watchlist screen
- Show a list of movies or series in the watchlist
- Show a button to add a movie or a series to the watchlist
- Show a button to remove a movie or a series from the watchlist

## Settings screen
- Show a button to logout at the bottom
- Show a dropdown menu to change the language
- Show different sections with inputs to update the user profile (firstname, lastname, email and password)
- Show a button to delete the user account