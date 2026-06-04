import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors } from '@/constants/theme';
import { OnboardingFooter } from './OnboardingFooter';

// Informational onboarding screens that interleave with the data-collection
// steps (Locations / Cast / Personality). They mirror the four pieces of
// pitch on the dreambotapp.com brochure: the nightly postcard idea, Dream
// Cast, the mood knob, and "what else lives in the app" (studio + bot feed).
//
// Visual: mascot or emoji at top, brand-gradient headline (the same
// purple→pink→teal `bg-gradient-cta` used on the homepage wordmark), short
// body copy, optional sub-feature cards, full-width Next button.

export interface InfoSubFeature {
  emoji: string;
  title: string;
  body: string;
}

export interface InfoStepConfig {
  eyebrow: string;
  /** When true, show the app icon mascot at the top instead of a glyph. */
  useMascot?: boolean;
  /** Large emoji shown above the eyebrow when no mascot/image is set. */
  emoji?: string;
  /**
   * Optional phone-frame screenshot shown above the eyebrow (replaces the
   * mascot/emoji slot). Pass a `require('@/assets/…')` source.
   */
  imageSource?: number;
  headline: string;
  body: string;
  /** Optional sub-feature cards under the body. */
  subFeatures?: InfoSubFeature[];
  ctaLabel?: string;
}

// Brand gradient — matches the homepage Hero wordmark + the 404 page's
// "404" headline + CTA buttons on the web brochure.
const HEADLINE_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

interface Props extends InfoStepConfig {
  onNext: () => void;
  onBack: () => void;
}

export function InfoStep({
  eyebrow,
  useMascot,
  emoji,
  imageSource,
  headline,
  body,
  subFeatures,
  ctaLabel = 'Continue',
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
        ) : useMascot ? (
          <View style={s.mascotWrap}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={s.mascot}
              contentFit="cover"
            />
          </View>
        ) : emoji ? (
          <Text style={s.emoji}>{emoji}</Text>
        ) : null}

        <Text style={s.eyebrow}>{eyebrow}</Text>

        {/* Gradient headline — MaskedView + LinearGradient is the standard
            RN trick for gradient-filled text. Same pattern used by
            GradientUsername. */}
        <MaskedView
          maskElement={
            <View style={s.headlineMaskWrap}>
              <Text style={s.headlineMask}>{headline}</Text>
            </View>
          }
        >
          <LinearGradient colors={HEADLINE_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={[s.headlineMask, s.headlineGhost]}>{headline}</Text>
          </LinearGradient>
        </MaskedView>

        <Text style={s.body}>{body}</Text>

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
    paddingTop: 24,
    paddingBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotWrap: { alignItems: 'center', marginBottom: 20 },
  mascot: { width: 130, height: 130, borderRadius: 28 },
  emoji: { fontSize: 64, marginBottom: 18, textAlign: 'center' },
  // 4:5 aspect matches the cropped Create-screen capture used today; if a
  // future step ships a full phone-bezel screenshot, swap to 9/16 or make
  // it configurable.
  screenshotWrap: {
    width: 220,
    aspectRatio: 4 / 5,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  screenshot: { width: '100%', height: '100%' },

  eyebrow: {
    color: colors.accentLight,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    textAlign: 'center',
  },
  headlineMaskWrap: { alignItems: 'center' },
  headlineMask: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38,
    color: '#FFFFFF', // fills the mask shape; LinearGradient supplies the color
    maxWidth: 340,
  },
  headlineGhost: { opacity: 0 },
  body: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 360,
  },

  subFeatures: { width: '100%', marginTop: 28, gap: 14 },
  subFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  subFeatureEmoji: { fontSize: 28, lineHeight: 32, width: 32, textAlign: 'center' },
  subFeatureText: { flex: 1, gap: 4 },
  subFeatureTitle: { color: colors.textPrimary, fontSize: 15, fontWeight: '700' },
  subFeatureBody: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
});
