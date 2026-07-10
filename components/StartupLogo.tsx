/**
 * StartupLogo — the DreamBot wordmark on black, shown during the app's initial
 * load gap (auth init / recipe check) instead of a blank screen. It CONTINUES
 * the native splash seamlessly: it renders the SAME `splash-wordmark.png` at the
 * SAME 220pt width + `contain` on the same black background, so the native → JS
 * handoff is pixel-identical and invisible.
 *
 * Do NOT swap this for text (GradientTitle) or apply fontScale/responsive
 * scaling here: the native splash is a fixed-220pt IMAGE (app.config.js →
 * expo-splash-screen imageWidth: 220), so anything that renders at a different
 * width makes the wordmark visibly POP to a new size at handoff — the
 * text-at-fontScale(40) version did exactly that (~180pt, and device-variant),
 * shrinking right before the feed loaded (Kevin 2026-07-10). The 220pt here is a
 * deliberate literal match to the splash config, not a magic number.
 *
 * No artificial delay: it only shows while the app is genuinely still resolving
 * where to route (see app/index.tsx).
 */
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

// The wordmark asset is 1812×304; width must match app.config.js splash
// imageWidth (220pt) so the JS logo is identical to the native splash.
const SPLASH_WORDMARK_WIDTH = 220;
const SPLASH_WORDMARK_ASPECT = 1812 / 304;

export function StartupLogo() {
  return (
    <View style={styles.root}>
      <Image
        source={require('@/assets/images/splash-wordmark.png')}
        style={styles.wordmark}
        contentFit="contain"
      />
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
  wordmark: {
    width: SPLASH_WORDMARK_WIDTH,
    aspectRatio: SPLASH_WORDMARK_ASPECT,
  },
});
