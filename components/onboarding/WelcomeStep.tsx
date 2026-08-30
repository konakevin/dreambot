import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { colors } from '@/constants/theme';
import { verticalScale, verticalScaleClamped, fontScale, byDevice } from '@/lib/responsive';
import { GradientTitle } from '@/components/GradientTitle';
import { OnboardingFooter } from './OnboardingFooter';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

// Mascot size scales with screen height but never gets so small it loses
// presence (iPhone SE) or so big it dominates (iPhone Pro Max).
const MASCOT_SIZE = verticalScaleClamped(160, 120, 180);

export function WelcomeStep({ onNext, onBack }: Props) {
  return (
    <View style={s.root}>
      {/* ScrollView (not a plain flex column) so that at large OS "Larger Text"
          sizes the centered stack can scroll instead of overflowing/clipping on
          short devices. Content stays centered when it fits (flexGrow + center). */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.iconStack}>
          {/* The original robot-reaching-for-a-star mascot — kept on this screen
              even after the app icon switched to the gradient star-field design. */}
          <Image
            source={require('@/assets/images/onboarding/mascot-welcome.png')}
            style={s.mascot}
            contentFit="cover"
          />
        </View>

        <Text style={s.welcomeEyebrow}>Welcome to</Text>

        {/* Gradient wordmark — matches the dreambotapp.com Hero treatment */}
        <GradientTitle size={44} weight={800} letterSpacing={-0.5}>
          DreamBot
        </GradientTitle>

        <Text style={s.tagline}>Your own pocket sized dream world</Text>

        <Text style={s.body}>Let’s set up your dream world</Text>
      </ScrollView>

      {/* First step — no previous screen to go back to. */}
      <OnboardingFooter onNext={onNext} onBack={onBack} hideBack nextVariant="gradient" />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: verticalScale(24),
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
  tagline: {
    color: colors.textPrimary,
    fontSize: fontScale(19),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: verticalScale(14),
    marginBottom: verticalScale(18),
  },
  body: {
    color: colors.bodyOnDark,
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    textAlign: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(24),
    maxWidth: byDevice(340, 520),
  },
});
