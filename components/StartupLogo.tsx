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
 *
 * Boot stall (BOOT_STALL_PLAN.md): when the boot clock escalates, `status`
 * adds an ABSOLUTELY-POSITIONED block BELOW the wordmark — a quiet line at
 * soft/medium, an honest error + "Try again" at hard. The wordmark block itself
 * is untouched and never moves, so the native → JS handoff stays invisible.
 */
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Text } from '@/components/AppText';
import { GradientButton } from '@/components/GradientButton';
import { colors } from '@/constants/theme';
import { fontScale, horizontalScale, verticalScale } from '@/lib/responsive';
import type { BootStatus } from '@/lib/bootStall';

// The wordmark asset is 1812×304; width must match app.config.js splash
// imageWidth (220pt) so the JS logo is identical to the native splash.
const SPLASH_WORDMARK_WIDTH = 220;
const SPLASH_WORDMARK_ASPECT = 1812 / 304;

const QUIET: BootStatus = { phase: 'quiet' };

interface Props {
  /** Defaults to quiet = exactly the logo-only screen. */
  status?: BootStatus;
  /** Wired to the hard state's "Try again". */
  onRetry?: () => void;
}

export function StartupLogo({ status = QUIET, onRetry }: Props) {
  return (
    <View style={styles.root}>
      <Image
        source={require('@/assets/images/splash-wordmark.png')}
        style={styles.wordmark}
        contentFit="contain"
      />
      {status.phase !== 'quiet' && (
        // Keyed so the hard block fades in fresh; soft → medium just swaps text.
        <Animated.View
          key={status.phase === 'hard' ? 'hard' : 'line'}
          entering={FadeIn.duration(300)}
          style={styles.status}
          pointerEvents="box-none"
        >
          {status.phase === 'hard' ? (
            <>
              <Text style={styles.title}>{status.title}</Text>
              <Text style={styles.body}>{status.body}</Text>
              {onRetry ? (
                <GradientButton label={status.cta} onPress={onRetry} style={styles.cta} />
              ) : null}
              {status.hint ? <Text style={styles.hint}>{status.hint}</Text> : null}
            </>
          ) : (
            <Text style={styles.line}>{status.line}</Text>
          )}
        </Animated.View>
      )}
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
  // Anchored below the vertical centre so the wordmark's layout is untouched.
  // The wordmark is ~37pt tall and centred, so its bottom edge sits ~18pt below
  // centre; this block starts a comfortable gap under that.
  status: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    marginTop: verticalScale(56),
    alignItems: 'center',
    paddingHorizontal: horizontalScale(32),
  },
  line: {
    color: colors.textSecondary,
    fontSize: fontScale(14),
    textAlign: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
    fontWeight: '800',
    textAlign: 'center',
    maxWidth: horizontalScale(360),
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    marginTop: verticalScale(8),
    maxWidth: horizontalScale(360),
  },
  cta: {
    marginTop: verticalScale(20),
    alignSelf: 'center',
  },
  hint: {
    color: colors.textSecondary,
    fontSize: fontScale(12),
    textAlign: 'center',
    marginTop: verticalScale(14),
    maxWidth: horizontalScale(320),
  },
});
