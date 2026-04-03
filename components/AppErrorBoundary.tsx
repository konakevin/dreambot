import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) {
      console.error('[AppErrorBoundary] Uncaught error:', error.message);
      console.error('[AppErrorBoundary] Component stack:', info.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={s.root}>
          <View style={s.content}>
            <Ionicons name="cloud-offline" size={56} color={colors.textSecondary} />
            <Text style={s.title}>Something went wrong</Text>
            <Text style={s.message}>
              The app ran into an unexpected error. This has been logged and we'll look into it.
            </Text>
            <TouchableOpacity style={s.button} onPress={this.handleRetry} activeOpacity={0.7}>
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={s.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
