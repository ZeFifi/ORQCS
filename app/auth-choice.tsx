import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { resetOnboarding } from '@/utils/storage';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthChoiceScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    logo: {
      fontSize: 60,
      marginBottom: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: colors.text,
      textAlign: 'center',
      opacity: 0.7,
      marginBottom: 60,
      lineHeight: 22,
    },
    buttonContainer: {
      width: '100%',
      gap: 15,
    },
    primaryButton: {
      backgroundColor: colors.tint,
      paddingVertical: 18,
      paddingHorizontal: 40,
      borderRadius: 25,
      alignItems: 'center',
    },
    primaryButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      paddingVertical: 18,
      paddingHorizontal: 40,
      borderRadius: 25,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.tint,
    },
    secondaryButtonText: {
      color: colors.tint,
      fontSize: 18,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>🎬</Text>
      <Text style={styles.title}>ORQCS</Text>
      <Text style={styles.subtitle}>
        Never waste time choosing what to watch again. Build your watchlist and let us pick for you!
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace('/signup')}
        >
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.secondaryButtonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={resetOnboarding}
        >
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}