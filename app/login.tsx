import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    Alert.alert('Coming Soon', 'Google login will be implemented soon');
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple login
    Alert.alert('Coming Soon', 'Apple login will be implemented soon');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      paddingHorizontal: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 40,
    },
    socialButtonsContainer: {
      gap: 10,
      marginBottom: 30,
    },
    socialButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.text,
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    socialButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.text,
      opacity: 0.3,
    },
    dividerText: {
      color: colors.text,
      fontSize: 14,
      marginHorizontal: 15,
      opacity: 0.7,
    },
    formContainer: {
      gap: 20,
    },
    inputGroup: {
      gap: 8,
    },
    label: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.text,
      borderRadius: 12,
      paddingVertical: 15,
      paddingHorizontal: 15,
      fontSize: 16,
      color: colors.text,
    },
    forgotPassword: {
      textAlign: 'right',
      color: colors.tint,
      fontSize: 14,
      fontWeight: '500',
    },
    loginButton: {
      backgroundColor: colors.tint,
      paddingVertical: 18,
      paddingHorizontal: 40,
      borderRadius: 25,
      alignItems: 'center',
      marginTop: 10,
    },
    loginButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
    signupLink: {
      textAlign: 'center',
      marginTop: 20,
      color: colors.text,
      fontSize: 16,
    },
    signupLinkBold: {
      color: colors.tint,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={colors.text + '80'}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.text + '80'}
            secureTextEntry
          />
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? 'Logging In...' : 'Log In'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.signupLink}>
        Don&apos;t have an account?{' '}
        <Text style={styles.signupLinkBold} onPress={() => router.push('/signup')}>
          Sign Up
        </Text>
      </Text>
    </SafeAreaView>
  );
}