import React, { ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Here you could log to a crash reporting service like Crashlytics
    // crashlytics().recordError(error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Oops! Something went wrong
          </ThemedText>
          <ThemedText style={styles.message}>
            We&apos;re sorry, but something unexpected happened. Please try restarting the app.
          </ThemedText>
          {__DEV__ && this.state.error && (
            <View style={styles.errorDetails}>
              <ThemedText style={styles.errorText}>
                {this.state.error.toString()}
              </ThemedText>
            </View>
          )}
        </ThemedView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  errorDetails: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    maxWidth: '100%',
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#d32f2f',
  },
});