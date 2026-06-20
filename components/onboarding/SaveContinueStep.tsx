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
import { isCastReadyForKickoff } from '@/lib/firstDreamReady';

const MASCOT_SIZE = verticalScaleClamped(160, 120, 180);

// First-dream diagnostic logging (DEV only). Tag every line [FD] + HH:MM:SS.mmm
// so the whole kickoff path can be read as one timeline in the Metro console.
const fdt = () => new Date().toISOString().slice(11, 23);
function castSnapshot() {
  const s = useOnboardingStore.getState();
  return {
    inFlight: s.castUploadsInFlight,
    cast: s.profile.dream_cast.map((c) => ({ role: c.role, storage_path: !!c.storage_path })),
  };
}
function fdlog(msg: string) {
  if (__DEV__) console.log(`[FD ${fdt()}] ${msg} ${JSON.stringify(castSnapshot())}`);
}

// Is the cast ready for the kickoff — every uploaded member carrying a usable
// storage_path/thumb_url? Gating on this (not a proxy in-flight COUNTER, which
// can read 0 a beat before the storage_path is committed) is what stops a
// faceless scene-only enqueue. Shared predicate (locked by firstDreamReady.test)
// so it can't drift from the server's tier-builder.
function castIsReady(): boolean {
  return isCastReadyForKickoff(useOnboardingStore.getState().profile.dream_cast);
}

// Resolve once no cast-photo upload is in flight AND every added member is usable.
// Capped at 30s so a stuck/failed upload can never trap the kickoff. Returns
// whether the cast was actually ready at the end (false → defer to the reveal).
async function waitForCastReady(): Promise<boolean> {
  const deadline = Date.now() + 30000;
  const startedAt = Date.now();
  fdlog('waitForCastReady START');
  while (
    (useOnboardingStore.getState().castUploadsInFlight > 0 || !castIsReady()) &&
    Date.now() < deadline
  ) {
    await new Promise((r) => setTimeout(r, 150));
  }
  const ready = castIsReady();
  fdlog(`waitForCastReady END after ${Date.now() - startedAt}ms ready=${ready}`);
  return ready;
}

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function SaveContinueStep({ onNext, onBack }: Props) {
  const setFirstDreamJobId = useOnboardingStore((s) => s.setFirstDreamJobId);
  const setFirstDreamStatus = useOnboardingStore((s) => s.setFirstDreamStatus);
  const user = useAuthStore((s) => s.user);
  const engineConfig = useEngineConfig();
  const started = useRef(false);

  function handleSaveContinue() {
    if (started.current) return;
    started.current = true;
    fdlog('cutoff TAP (handleSaveContinue)');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Kick off the first dream DETACHED — wait for any in-flight cast uploads to
    // settle, then describe cast → save profile → finalize → enqueue, all in the
    // background while the user picks bots. Results land in the store (the reveal
    // step polls the jobId).
    //
    // The upload wait is load-bearing: a fast user can reach this cutoff before a
    // cast photo finishes uploading. If we enqueued then, the profile's
    // dream_cast members wouldn't yet have a storage_path → buildFirstDreamTiers
    // (server) sees no usable cast → a scene-only first dream with NO face swap.
    // We wait for castUploadsInFlight to hit 0 (capped so a stuck upload can't
    // trap it), then read the FRESH profile so the kickoff always sees the
    // settled cast.
    setFirstDreamStatus('starting');
    if (user) {
      void (async () => {
        try {
          const ready = await waitForCastReady();
          if (!ready) {
            // Photos never settled with a usable storage_path within the 30s cap —
            // do NOT enqueue a faceless scene-only first dream. Reset to 'idle' so
            // the reveal step runs it in the FOREGROUND (uploads guaranteed done by
            // then) — the old, never-raced behavior. Rare: only when an upload is
            // genuinely stuck past 30s.
            fdlog('NOT READY after wait → DEFER kickoff to reveal');
            setFirstDreamStatus('idle');
            return;
          }
          fdlog('READY → calling startFirstDream (enqueue)');
          const freshProfile = useOnboardingStore.getState().profile;
          const jobId = await startFirstDream(
            freshProfile,
            user.id,
            engineConfig.welcomeSparkleBonus
          );
          fdlog(`startFirstDream RETURNED jobId=${jobId}`);
          setFirstDreamJobId(jobId);
          setFirstDreamStatus('enqueued');
        } catch (err) {
          if (err instanceof FirstDreamAlreadyClaimedError) {
            // Returning user re-onboarding — reveal will route straight to feed.
            setFirstDreamStatus('already_claimed');
          } else {
            if (__DEV__) console.warn('[SaveContinue] first-dream kickoff failed:', err);
            setFirstDreamStatus('error');
          }
        }
      })();
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
          DreamBot is ready to generate your first dream. Before we finish, meet our cast of Bots
          and see what they&apos;re dreaming up.
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
    color: colors.textSecondary,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
    textAlign: 'center',
    marginTop: verticalScale(16),
    maxWidth: 320,
  },
});
