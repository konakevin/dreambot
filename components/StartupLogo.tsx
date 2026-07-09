/**
 * StartupLogo — the DreamBot wordmark on black, shown during the app's initial
 * load gap (auth init / recipe check) instead of a blank screen. It hands off
 * from the native splash (black + static wordmark) into the same wordmark with
 * the STATIC brand gradient (Kevin 2026-07-09: tried the flowing gradient here
 * and reverted — startup stays still; the flowing variant lives on in the
 * Dreaming/Upscaling loading titles).
 *
 * No artificial delay: it only shows while the app is genuinely still resolving
 * where to route (see app/index.tsx).
 */
import { View, StyleSheet } from 'react-native';
import { GradientTitle } from '@/components/GradientTitle';

export function StartupLogo() {
  return (
    <View style={styles.root}>
      <GradientTitle size={40} weight={700} letterSpacing={1}>
        DreamBot
      </GradientTitle>
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
