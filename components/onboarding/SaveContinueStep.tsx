/**
 * SaveContinueStep — the onboarding CUTOFF (2026-06-18).
 *
 * The last data-collection step is the vibe sliders; this screen commits the
 * profile and kicks the free first dream off IN THE BACKGROUND, then sends the
 * user to "Meet the bots" while it renders. The reveal step awaits the stashed
 * jobId. This is the point of no return — going back past it (to change
 * places/cast/vibe) is disabled from here on; the copy reassures the user they
 * can still change everything later from their profile.
 */

import { useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, verticalScaleClamped } from '@/lib/responsive';
import { GradientTitle } from '@/components/GradientTitle';
import { OnboardingFooter } from './OnboardingFooter';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { startFirstDream } from '@/lib/firstDreamKickoff';
import { FirstDreamAlreadyClaimedError } from '@/lib/firstDreamQueue';

const MASCOT_SIZE = verticalScaleClamped(160, 120, 180);

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function SaveContinueStep({ onNext, onBack }: Props) {
  const profile = useOnboardingStore((s) => s.profile);
  const setFirstDreamJobId = useOnboardingStore((s) => s.setFirstDreamJobId);
  const setFirstDreamStatus = useOnboardingStore((s) => s.setFirstDreamStatus);
  const user = useAuthStore((s) => s.user);
  const engineConfig = useEngineConfig();
  const started = useRef(false);

  function handleSaveContinue() {
    if (started.current) return;
    started.current = true;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Kick off the first dream DETACHED — describe cast → save profile →
    // finalize → enqueue all run in the background while the user picks bots.
    // Results land in the store (the reveal step polls the jobId).
    setFirstDreamStatus('starting');
    if (user) {
      startFirstDream(profile, user.id, engineConfig.welcomeSparkleBonus)
        .then((jobId) => {
          setFirstDreamJobId(jobId);
          setFirstDreamStatus('enqueued');
        })
        .catch((err) => {
          if (err instanceof FirstDreamAlreadyClaimedError) {
            // Returning user re-onboarding — reveal will route straight to feed.
            setFirstDreamStatus('already_claimed');
          } else {
            if (__DEV__) console.warn('[SaveContinue] first-dream kickoff failed:', err);
            setFirstDreamStatus('error');
          }
        });
    } else {
      setFirstDreamStatus('error');
    }

    // Advance to "Meet the bots" immediately — the dream renders meanwhile.
    onNext();
  }

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.mascotWrap}>
          <Image
            source={require('@/assets/images/onboarding/mascot-thumbsup.png')}
            style={s.mascot}
            contentFit="cover"
          />
        </View>

        <Text style={s.eyebrow}>last step</Text>

        <GradientTitle size={24} weight={800} lineHeight={30} maxWidth={340} numberOfLines={0}>
          You&apos;re all set
        </GradientTitle>

        <Text style={s.body}>
          We&apos;ll start painting your very first dream now. It takes a moment — meet a few bots
          while it comes to life.
        </Text>

        <Text style={s.reassure}>
          You can change your places, cast, and vibe anytime from your profile.
        </Text>
      </ScrollView>

      <OnboardingFooter onNext={handleSaveContinue} onBack={onBack} nextLabel="Save & continue" />
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
  mascotWrap: { alignItems: 'center', marginBottom: verticalScale(20) },
  mascot: { width: MASCOT_SIZE, height: MASCOT_SIZE, borderRadius: 32 },
  eyebrow: {
    color: colors.accentLight,
    fontSize: fontScale(12),
    fontWeight: '700',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    textAlign: 'center',
    marginTop: verticalScale(18),
    maxWidth: 360,
  },
  reassure: {
    color: colors.textMuted,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
    textAlign: 'center',
    marginTop: verticalScale(16),
    maxWidth: 320,
  },
});
