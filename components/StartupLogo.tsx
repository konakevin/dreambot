/**
 * StartupLogo — the animated DreamBot wordmark on black, shown during the app's
 * initial load gap (auth init / recipe check) instead of a blank screen. It
 * hands off from the native splash (black + static wordmark) into the SAME
 * wordmark, now with the flowing brand gradient, so startup feels alive.
 *
 * No artificial delay: it only shows while the app is genuinely still resolving
 * where to route (see app/index.tsx).
 */
import { View, StyleSheet } from 'react-native';
import { AnimatedGradientTitle } from '@/components/AnimatedGradientTitle';

export function StartupLogo() {
  return (
    <View style={styles.root}>
      <AnimatedGradientTitle size={40} weight={700} letterSpacing={1}>
        DreamBot
      </AnimatedGradientTitle>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
