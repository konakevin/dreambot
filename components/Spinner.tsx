/**
 * Spinner — the one ActivityIndicator to rule them all.
 *
 * Use this instead of raw <ActivityIndicator> so color/size stay
 * consistent across the app. Dark-mode-aware by default.
 */

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';

interface SpinnerProps {
  /** 'small' (default) or 'large' */
  size?: 'small' | 'large';
  /** Override color — defaults to white for dark backgrounds */
  color?: string;
  /** Center in parent (wraps in a flex container) */
  centered?: boolean;
}

export function Spinner({ size = 'small', color = colors.textPrimary, centered }: SpinnerProps) {
  const indicator = <ActivityIndicator size={size} color={color} />;
  if (centered) {
    return <View style={s.centered}>{indicator}</View>;
  }
  return indicator;
}

const s = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
