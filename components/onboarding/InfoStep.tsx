import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, verticalScaleClamped, byDevice } from '@/lib/responsive';
import { GradientTitle } from '@/components/GradientTitle';
import { OnboardingFooter } from './OnboardingFooter';

const MASCOT_SIZE = verticalScaleClamped(160, 120, 180);
const EMOJI_SIZE = verticalScaleClamped(64, 52, 72);
const SCREENSHOT_WIDTH = verticalScaleClamped(220, 180, 240);

// Informational onboarding screens that interleave with the data-collection
// steps (Locations / Cast / Personality). They mirror the four pieces of
// pitch on the dreambotapp.com brochure: the nightly postcard idea, Dream
// Cast, the mood knob, and "what else lives in the app" (studio + bot feed).
//
// Visual: mascot or emoji at top, brand-gradient headline (the same
// purple→pink→teal `bg-gradient-cta` used on the homepage wordmark), short
// body copy, optional sub-feature cards, full-width Next button.

export interface InfoSubFeature {
  /** Ionicons name — preferred (renders reliably). Falls back to `emoji`. */
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
  title: string;
  /** Either a paragraph `body` OR a list of `bullets` (bullets take priority). */
  body?: string;
  bullets?: string[];
}

export interface InfoStepConfig {
  eyebrow: string;
  /** When true, show the default app icon mascot at the top. */
  useMascot?: boolean;
  /**
   * Optional custom mascot illustration (renders in the same 130×130
   * rounded slot as `useMascot`). Use this when each step has its own
   * tailored mascot art. Pass `require('@/assets/…')`.
   */
  customMascot?: number;
  /** Large emoji shown above the eyebrow when no mascot/image is set. */
  emoji?: string;
  /**
   * Optional phone-frame screenshot shown above the eyebrow (replaces the
   * mascot/emoji slot, larger 4:5 frame). Pass `require('@/assets/…')`.
   */
  imageSource?: number;
  headline: string;
  body: string;
  /**
   * Optional muted icon + one-liner under the body — wayfinding hints like
   * "your dreams land under [moon] on your profile". The icon should match
   * the real in-app icon it references so the association sticks.
   */
  footnote?: string;
  footnoteIcon?: keyof typeof Ionicons.glyphMap;
  /** Optional sub-feature cards under the body. */
  subFeatures?: InfoSubFeature[];
  ctaLabel?: string;
}

interface Props extends InfoStepConfig {
  onNext: () => void;
  onBack: () => void;
}

export function InfoStep({
  eyebrow,
  useMascot,
  customMascot,
  emoji,
  imageSource,
  headline,
  body,
  footnote,
  footnoteIcon,
  subFeatures,
  ctaLabel = 'Next',
  onNext,
  onBack,
}: Props) {
  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {imageSource ? (
          <View style={s.screenshotWrap}>
            <Image source={imageSource} style={s.screenshot} contentFit="contain" />
          </View>
        ) : customMascot ? (
          <View style={s.mascotWrap}>
            <Image source={customMascot} style={s.mascot} contentFit="cover" />
          </View>
        ) : useMascot ? (
          <View style={s.mascotWrap}>
            <Image
              source={require('@/assets/images/onboarding/mascot-welcome.png')}
              style={s.mascot}
              contentFit="cover"
            />
          </View>
        ) : emoji ? (
          <Text style={s.emoji}>{emoji}</Text>
        ) : null}

        <Text style={s.eyebrow}>{eyebrow}</Text>

        {/* Gradient headline — wraps freely (0 = unlimited lines), matching
            the prior unbounded Text. */}
        <GradientTitle
          size={22}
          weight={800}
          lineHeight={28}
          maxWidth={byDevice(340, 520)}
          numberOfLines={0}
        >
          {headline}
        </GradientTitle>

        <Text style={s.body}>{body}</Text>

        {footnote && (
          <View style={s.footnoteRow}>
            {footnoteIcon && (
              <Ionicons name={footnoteIcon} size={fontScale(14)} color={colors.textSecondary} />
            )}
            <Text style={s.footnote}>{footnote}</Text>
          </View>
        )}

        {subFeatures && subFeatures.length > 0 && (
          <View style={s.subFeatures}>
            {subFeatures.map((f) => (
              <View key={f.title} style={s.subFeature}>
                <Text style={s.subFeatureEmoji}>{f.emoji}</Text>
                <View style={s.subFeatureText}>
                  <Text style={s.subFeatureTitle}>{f.title}</Text>
                  <Text style={s.subFeatureBody}>{f.body}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <OnboardingFooter onNext={onNext} onBack={onBack} nextLabel={ctaLabel} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Mascot dimensions match WelcomeStep so the custom per-step mascot art
  // reads at the same size as the icon mascot on the very first screen.
  mascotWrap: { alignItems: 'center', marginBottom: verticalScale(20) },
  mascot: { width: MASCOT_SIZE, height: MASCOT_SIZE, borderRadius: 32 },
  emoji: { fontSize: EMOJI_SIZE, marginBottom: verticalScale(18), textAlign: 'center' },
  // 4:5 aspect matches the cropped Create-screen capture used today; if a
  // future step ships a full phone-bezel screenshot, swap to 9/16 or make
  // it configurable.
  screenshotWrap: {
    width: SCREENSHOT_WIDTH,
    aspectRatio: 4 / 5,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: verticalScale(20),
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  screenshot: { width: '100%', height: '100%' },

  eyebrow: {
    color: colors.accentLight,
    fontSize: fontScale(12),
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  // Near-white body (not textSecondary): on the pure-black onboarding canvas
  // secondary gray reads washed-out — the muted tone is reserved for true
  // captions, and the footnote gets the eyebrow's accent so the stack has a
  // deliberate cadence (purple / gradient / white / purple).
  body: {
    color: colors.textPrimary,
    opacity: 0.92,
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    textAlign: 'center',
    marginTop: verticalScale(18),
    maxWidth: byDevice(360, 520),
  },

  footnoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: verticalScale(16),
  },
  footnote: {
    color: colors.accentLight,
    fontSize: fontScale(13),
    fontWeight: '600',
    textAlign: 'center',
  },

  subFeatures: { width: '100%', marginTop: verticalScale(28), gap: verticalScale(14) },
  subFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: verticalScale(14),
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: verticalScale(16),
  },
  subFeatureEmoji: {
    fontSize: fontScale(28),
    lineHeight: fontScale(32),
    width: 32,
    textAlign: 'center',
  },
  subFeatureText: { flex: 1, gap: 4 },
  subFeatureTitle: { color: colors.textPrimary, fontSize: fontScale(15), fontWeight: '700' },
  subFeatureBody: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
  },
});
