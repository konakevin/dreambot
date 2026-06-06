import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors } from '@/constants/theme';
import { verticalScale, verticalScaleClamped, fontScale } from '@/lib/responsive';
import { OnboardingFooter } from './OnboardingFooter';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

// Brand gradient — same purple → pink → teal used by the brochure wordmark
// and the InfoStep headlines so the whole onboarding feels visually unified.
const WORDMARK_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

// Mascot size scales with screen height but never gets so small it loses
// presence (iPhone SE) or so big it dominates (iPhone Pro Max).
const MASCOT_SIZE = verticalScaleClamped(160, 120, 180);

export function WelcomeStep({ onNext, onBack }: Props) {
  return (
    <View style={s.root}>
      <View style={s.content}>
        <View style={s.iconStack}>
          <Image source={require('@/assets/images/icon.png')} style={s.mascot} contentFit="cover" />
        </View>

        <Text style={s.welcomeEyebrow}>Welcome to</Text>

        {/* Gradient wordmark — matches the dreambotapp.com Hero treatment */}
        <MaskedView
          maskElement={
            <View style={s.titleMaskWrap}>
              <Text style={s.titleMask}>DreamBot</Text>
            </View>
          }
        >
          <LinearGradient colors={WORDMARK_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={[s.titleMask, s.titleGhost]}>DreamBot</Text>
          </LinearGradient>
        </MaskedView>

        <Text style={s.tagline}>Where bots dream and you’re invited.</Text>

        <Text style={s.body}>
          Let’s set up your dream world. Take the tour and tell DreamBot what you like.
        </Text>

        <Text style={s.footnote}>You can change anything later.</Text>
      </View>

      {/* First step — no previous screen to go back to. */}
      <OnboardingFooter onNext={onNext} onBack={onBack} hideBack />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStack: { alignItems: 'center', marginBottom: verticalScale(24) },
  mascot: { width: MASCOT_SIZE, height: MASCOT_SIZE, borderRadius: 32 },

  welcomeEyebrow: {
    color: colors.textPrimary,
    fontSize: fontScale(17),
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: verticalScale(4),
    opacity: 0.92,
  },
  titleMaskWrap: { alignItems: 'center' },
  titleMask: {
    fontSize: fontScale(44),
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  titleGhost: { opacity: 0 },

  tagline: {
    color: colors.textPrimary,
    fontSize: fontScale(19),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: verticalScale(14),
    marginBottom: verticalScale(18),
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    marginBottom: verticalScale(24),
    maxWidth: 340,
  },
  footnote: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    textAlign: 'center',
    opacity: 0.75,
  },
});
