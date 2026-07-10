import { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import { useCardGestures } from '@/hooks/gestures/useCardGestures';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { GradientButton } from '@/components/GradientButton';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { GradientTitle } from '@/components/GradientTitle';
import { supabase } from '@/lib/supabase';
import { saveVibeProfile } from '@/lib/saveVibeProfile';
import {
  awaitFirstDream,
  FirstDreamAlreadyClaimedError,
  type FirstDreamResult,
} from '@/lib/firstDreamQueue';
import { startFirstDream } from '@/lib/firstDreamKickoff';
import { decideRevealAction } from '@/lib/firstDreamReveal';
import { trackFirstDreamGenerated } from '@/lib/analytics';
// Vibe profile prompt is built inline — no recipe engine needed for onboarding reveal
import { colors, ui } from '@/constants/theme';
import { verticalScale, fontScale, verticalScaleClamped } from '@/lib/responsive';
import { Toast } from '@/components/Toast';
import { MagicalLoadingStage } from '@/components/MagicalLoadingStage';

const MASCOT = require('@/assets/images/onboarding/mascot-welcome.png');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH - 48;
const IMAGE_HEIGHT = Math.min(IMAGE_WIDTH * (SCREEN_HEIGHT / SCREEN_WIDTH), SCREEN_HEIGHT * 0.45);
const IDLE_MASCOT_SIZE = verticalScaleClamped(140, 110, 160);

type Phase = 'idle' | 'booting' | 'generating' | 'reveal' | 'sparkles' | 'finished';
/**
 * Reveal overlay: the user already saw the nightly-dream pitch on the
 * INFO Nightly onboarding screen, so the reveal collapses to a single
 * beat — a small caption + Post/Skip buttons over the rendered image.
 * (Previous 3-beat "this is your first dream → this happens every night →
 * post or skip" sequence was three sequential taps of redundant copy; cut
 * 2026-06-03.)
 *
 * The "Keep it private" path is intentionally NOT implemented yet — needs
 * the privacy/visibility migration first (memory: project_privacy_visibility).
 */

interface Dream {
  url: string;
  prompt: string;
  medium?: string;
  vibe?: string;
  /**
   * The uploads row id the render engine already persisted (nightly-dreams
   * inserts a PRIVATE draft and returns its id). When present, Post just flips
   * the row public — we never insert a second row. Undefined only on the
   * legacy/first-dream-engine path, which still inserts in handleCreateBot.
   */
  uploadId?: string;
}

interface Props {
  onNext: () => void;
  onBack: () => void;
  // The pager (FlatList) mounts EVERY step up front, so RevealStep mounts on the
  // welcome screen. Its first-dream kickoff/await MUST only run once the user has
  // actually reached this step — otherwise the "defensive" retryDream fires on
  // mount with an empty profile and claims the one-per-account first dream as a
  // faceless scene-only render. Gate every kickoff effect on this.
  isActive?: boolean;
}

export function RevealStep({ onBack, isActive = false }: Props) {
  const profile = useOnboardingStore((s) => s.profile);
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const reset = useOnboardingStore((s) => s.reset);
  const setChromeHidden = useOnboardingStore((s) => s.setChromeHidden);
  const setScrollLocked = useOnboardingStore((s) => s.setScrollLocked);
  // First dream is kicked off at the cutoff step (SaveContinueStep) and awaited
  // here — these carry the in-flight job across the bots screen in between.
  const firstDreamJobId = useOnboardingStore((s) => s.firstDreamJobId);
  const firstDreamStatus = useOnboardingStore((s) => s.firstDreamStatus);
  const setFirstDreamJobId = useOnboardingStore((s) => s.setFirstDreamJobId);
  const setFirstDreamStatus = useOnboardingStore((s) => s.setFirstDreamStatus);
  const user = useAuthStore((s) => s.user);
  const engineConfig = useEngineConfig();
  const insets = useSafeAreaInsets();
  // Bottom inset for the overlay buttons: respect the home indicator when
  // present (insets.bottom > 0), otherwise use a sensible floor so the
  // buttons don't sit flush against the screen edge on SE-class devices.
  const overlayBottom = Math.max(insets.bottom + verticalScale(8), verticalScale(24));

  // The dream is already kicked off (at the cutoff step) by the time we mount, so
  // start on the loader — never the legacy "Let's go!" idle screen. Edit mode (no
  // first dream) starts idle to show its "Save changes" screen.
  const [phase, setPhase] = useState<Phase>(isEditing ? 'idle' : 'generating');
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Tap the image hides/shows the HUD (post/skip chrome).
  const [hudVisible, setHudVisible] = useState(true);
  // Pinch-to-zoom-and-drag on the revealed dream — same Instagram-peek behavior
  // as the feed cards (zoom follows the fingers, springs back on release). No
  // author to swipe to on an unposted first dream.
  const { gesture: zoomGesture, imageTransformStyle } = useCardGestures({
    disableSwipeLeft: true,
  });
  // Single tap toggles the HUD. Composed Exclusive with the zoom gesture so a
  // real pinch still wins; a clean one-finger tap falls through to this.
  function toggleHud() {
    Haptics.selectionAsync();
    setHudVisible((v) => !v);
  }
  const tapToggleHud = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      runOnJS(toggleHud)();
    });
  const imageGesture = Gesture.Exclusive(zoomGesture, tapToggleHud);
  // Guards: one await/kick at a time, run the on-mount kickoff/await once, and
  // one Post/Skip exit navigation (both CTAs are instant redirects).
  const navigated = useRef(false);
  const awaiting = useRef(false);
  const kickoffStarted = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  // Aborts the first-dream poll loop on unmount / retry so a stale poll never
  // resolves into an unmounted screen.
  const pollAbort = useRef<AbortController | null>(null);

  const activeDream = dreams.at(activeIndex) ?? null;
  const describedProfile = useRef(profile);

  // Hide the pager's step header from the moment the user taps "Let's go!"
  // (phase leaves 'idle') through the whole render → reveal → finished
  // flow. By the time the dream's on screen the step indicator just adds
  // noise; the user is past the data-collection stage. Restored on reset()
  // when nav'ing away (store.reset clears chromeHidden back to false).
  useEffect(() => {
    const hidden =
      phase === 'booting' || phase === 'generating' || phase === 'reveal' || phase === 'finished';
    setChromeHidden(hidden);
    // Also LOCK the pager swipe for these phases — once the dream is
    // generating/revealed there's no going back through onboarding; the only
    // way out is the "Go to feed" CTA (which calls reset() → clears this).
    setScrollLocked(hidden);
  }, [phase, setChromeHidden, setScrollLocked]);

  // Abort any in-flight first-dream poll loop on unmount.
  useEffect(() => () => pollAbort.current?.abort(), []);

  // Append the rendered dream + flip to the reveal state.
  function showDream(result: FirstDreamResult) {
    setDreams((prev) => {
      const next = [
        ...prev,
        {
          url: result.url,
          prompt: result.prompt,
          medium: result.medium,
          vibe: result.vibe,
          uploadId: result.uploadId,
        },
      ];
      const newIdx = next.length - 1;
      setActiveIndex(newIdx);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: newIdx * IMAGE_WIDTH, animated: true });
      }, 100);
      return next;
    });
    setPhase('reveal');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    trackFirstDreamGenerated({ medium: result.medium, vibe: result.vibe });
  }

  function handleDreamError(err: unknown) {
    if (err instanceof FirstDreamAlreadyClaimedError) {
      // Returning user re-onboarding — they already have their free first dream.
      if (__DEV__) console.log('[Reveal] first dream already claimed → feed');
      router.replace('/(tabs)');
      return;
    }
    if ((err as Error)?.message === 'aborted') return; // unmount / retry — not a failure
    if (__DEV__) console.warn('[Reveal] first dream failed:', err);
    setError('We couldn’t finish your first dream just now.');
    setPhase('reveal');
  }

  // Poll the first dream that was already enqueued at the cutoff step.
  async function awaitDream(jobId: string) {
    if (awaiting.current) return;
    awaiting.current = true;
    setError(null);
    setPhase('generating');
    pollAbort.current?.abort();
    pollAbort.current = new AbortController();
    try {
      const result = await awaitFirstDream(jobId, { signal: pollAbort.current.signal });
      if (__DEV__) console.log('[Reveal] Got URL:', result.url?.slice(0, 80));
      showDream(result);
    } catch (err) {
      handleDreamError(err);
    } finally {
      awaiting.current = false;
    }
  }

  // Re-run the FULL kickoff — used by "Try again", and as a defensive fallback if
  // the reveal is somehow reached without the cutoff having started the dream.
  async function retryDream() {
    if (awaiting.current || !user) return;
    awaiting.current = true;
    setError(null);
    setPhase('generating');
    pollAbort.current?.abort();
    pollAbort.current = new AbortController();
    try {
      if (__DEV__)
        console.log(
          `[FD ${new Date().toISOString().slice(11, 23)}] RevealStep retryDream → startFirstDream (FOREGROUND fallback)`
        );
      setFirstDreamStatus('starting');
      const jobId = await startFirstDream(profile, user.id, engineConfig.welcomeSparkleBonus);
      setFirstDreamJobId(jobId);
      setFirstDreamStatus('enqueued');
      const result = await awaitFirstDream(jobId, { signal: pollAbort.current.signal });
      showDream(result);
    } catch (err) {
      handleDreamError(err);
    } finally {
      awaiting.current = false;
    }
  }

  // When the user ACTUALLY REACHES this step (isActive), resolve the first dream:
  // await the cutoff's background job, or — if nothing was started (the cutoff
  // deferred because the cast wasn't ready, or some path skipped it) — kick it off
  // here in the foreground. CRITICAL: gated on isActive + runs only once. The pager
  // mounts every step up front, so WITHOUT this gate the "defensive" retryDream
  // below fires on the WELCOME screen with an empty profile and burns the
  // one-per-account first dream on a faceless scene-only render. Edit mode exempt.
  useEffect(() => {
    if (isEditing || !isActive || kickoffStarted.current) return;
    kickoffStarted.current = true;
    const action = decideRevealAction({
      isActive,
      isEditing,
      status: firstDreamStatus,
      jobId: firstDreamJobId,
    });
    switch (action) {
      case 'route_feed':
        router.replace('/(tabs)');
        break;
      case 'show_error':
        setError('We couldn’t finish your first dream just now.');
        setPhase('reveal');
        break;
      case 'await_job':
        if (firstDreamJobId) void awaitDream(firstDreamJobId);
        break;
      case 'show_loader':
        // Kickoff in flight; show the loader — the jobId effect awaits when it lands.
        setPhase('generating');
        break;
      case 'kickoff':
        // Reached reveal with nothing started → start it here (foreground; by now
        // the cast uploads are guaranteed settled).
        void retryDream();
        break;
      case 'noop':
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // When the background kickoff produces a jobId AFTER we've reached the reveal,
  // start awaiting it. Gated on isActive so it never polls from the pre-mounted
  // (off-screen) instance.
  useEffect(() => {
    if (isEditing || !isActive) return;
    if (firstDreamJobId && phase === 'generating' && !awaiting.current && dreams.length === 0) {
      void awaitDream(firstDreamJobId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstDreamJobId, isActive]);

  // (End-of-onboarding bookkeeping — welcome sparkles + completion + welcome-gift
  // notification — now runs in lib/firstDreamKickoff.startFirstDream at the cutoff
  // step, before the dream renders, so the reveal has nothing left to persist.)

  function handleCreateBot(makePublic: boolean) {
    if (!user || !activeDream || navigated.current) return;
    navigated.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Profile, welcome sparkles, welcome-gift notification, and completion all
    // already persisted at the END of onboarding (finalizeOnboarding, before the
    // dream generated). So there is NOTHING left to save here:
    //   • SKIP  → instant redirect, zero awaits, can't get stuck.
    //   • POST  → hand off to the STANDARD New Post screen (description input +
    //             moderation + publish flip + feed pin) — the same flow as
    //             posting a manual dream or tapping + on a private dream in the
    //             album. The render already persisted the dream privately, so
    //             nothing is lost if the user cancels there.
    const uploadId: string | null = activeDream.uploadId ?? null;
    if (makePublic && uploadId) {
      // Clear the prompt-derived caption so the eventual feed post reads clean —
      // fire-and-forget on the still-private row; New Post owns the publish.
      supabase
        .from('uploads')
        .update({ caption: null })
        .eq('id', uploadId)
        .then(({ error }) => {
          if (error && __DEV__) console.warn('[Reveal] caption clear failed:', error.message);
        });
      reset();
      // replace (not push): onboarding is done — there's no stepping back into
      // it. fromOnboarding tells New Post's Cancel to land on the feed.
      router.replace(`/post/new?ids=${uploadId}&fromOnboarding=1`);
      return;
    }

    reset();
    // Route the feed exit THROUGH the welcome-gift screen (2026-07-05): it's
    // the one surface that explains the sparkle bonus + the Pro trial, and as
    // an inbox-notification-only destination almost nobody saw it. The
    // from=onboarding param makes its back/CTA land on the feed, not /inbox.
    // (The "Post to my feed" fork above skips it — those users still have the
    // welcome_gift inbox row.)
    router.replace('/welcome-gift?from=onboarding');
  }

  // ── Sparkles welcome (legacy — now skipped, goes straight to home) ──
  if (phase === 'sparkles') {
    return <View style={s.root} />;
  }

  // ── Edit mode: just save and go home ──
  if (phase === 'idle' && isEditing) {
    return (
      <View style={s.root}>
        <View style={s.centeredContent}>
          <Image source={MASCOT} style={s.idleMascot} contentFit="cover" />
          <Text style={s.bigTitle}>Save your changes</Text>
          <Text style={s.centeredSub}>Your updated taste profile will shape all future dreams</Text>
          <TouchableOpacity
            style={[s.createButton, { alignSelf: 'stretch', marginTop: verticalScale(8) }]}
            onPress={async () => {
              if (!user) return;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              try {
                const profileToSave = describedProfile.current ?? profile;
                await saveVibeProfile(user.id, profileToSave);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Toast.show('Profile saved!', 'checkmark-circle');
                reset();
                router.replace('/(tabs)');
              } catch {
                Toast.show('Failed to save', 'close-circle');
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={s.createButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: verticalScale(12) }}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text
              style={{ color: colors.textSecondary, fontSize: fontScale(15), fontWeight: '600' }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── First-time idle state ──
  if (phase === 'idle') {
    return (
      <View style={s.root}>
        <View style={s.centeredContent}>
          <Image source={MASCOT} style={s.idleMascot} contentFit="cover" />
          <GradientTitle size={22} weight={800} lineHeight={28} numberOfLines={2}>
            Time for your first dream!
          </GradientTitle>
          <Text style={s.centeredSub}>
            Your DreamBot knows what you like. Tap below to see what it dreams up!
          </Text>
          <GradientButton
            label="Let’s go!"
            onPress={() => retryDream()}
            style={{ alignSelf: 'stretch', marginTop: verticalScale(8) }}
          />
          <TouchableOpacity
            style={{ marginTop: verticalScale(12) }}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text
              style={{ color: colors.textSecondary, fontSize: fontScale(15), fontWeight: '600' }}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Boot-up + generating ── single clean loading screen.
  // Both phases used to render their own copy ("Your DreamBot is dreaming
  // up something special..." → "Dreaming...") which flashed in sequence
  // and felt like the screen reloaded mid-render. Consolidated 2026-06-03
  // to the same MagicalLoadingStage component the Create-tab loader uses,
  // so the first-dream wait visually matches every subsequent dream
  // generation — repetition + familiarity.
  if (phase === 'booting' || (phase === 'generating' && dreams.length === 0)) {
    return (
      <View style={s.loadingContainer}>
        <MagicalLoadingStage subtext="First dreams take a minute or two to paint" />
      </View>
    );
  }

  // ── Reveal state — fullscreen image with "Post my Dream" ──
  return (
    <View style={s.root}>
      {error && dreams.length === 0 ? (
        <View style={s.centeredContent}>
          <Ionicons name="sparkles-outline" size={40} color={colors.textSecondary} />
          <Text style={s.errorText}>{error}</Text>
          <View
            style={{ alignSelf: 'stretch', paddingHorizontal: 32, marginTop: verticalScale(18) }}
          >
            <GradientButton label="Try again" onPress={() => retryDream()} />
            {/* Escape hatch so a repeatedly-failing first dream never traps the
                user (was app-restart-only). Aborts the poll, restores chrome,
                and goes back to the previous "Let's go" step. */}
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                pollAbort.current?.abort();
                setError(null);
                setPhase('idle');
                setChromeHidden(false);
                setScrollLocked(false);
                onBack();
              }}
              hitSlop={8}
              style={{
                marginTop: verticalScale(14),
                alignSelf: 'center',
                paddingVertical: verticalScale(8),
                paddingHorizontal: 16,
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: fontScale(15),
                  fontWeight: '600',
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : activeDream ? (
        <View style={{ flex: 1 }}>
          {/* Fullscreen dream image — pinch to zoom + drag; single tap toggles
              the HUD (post/skip chrome). The GestureDetector replaces the old
              tap-catching TouchableOpacity overlay; it sits below the bottom
              HUD, so the buttons still win their taps. */}
          <GestureDetector gesture={imageGesture}>
            {/* Detector rides the UNTRANSFORMED wrapper — the zoom transform
                lives on the inner view, so focal coords stay in screen space. */}
            <View style={StyleSheet.absoluteFill}>
              <Animated.View style={[StyleSheet.absoluteFill, imageTransformStyle]}>
                <Image
                  source={{ uri: activeDream.url }}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  transition={300}
                  cachePolicy="memory-disk"
                />
              </Animated.View>
            </View>
          </GestureDetector>

          {hudVisible &&
            (phase === 'finished' ? (
              // Post-Skip preview — overlay text removed entirely so the dream
              // gets the whole frame. Single bottom CTA finalizes the nav to
              // home (lands on Explore tab by default).
              <View style={[s.finishedFooter, { paddingBottom: overlayBottom }]}>
                <View style={s.finishedFooterScrim} />
                <TouchableOpacity
                  style={s.createButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    reset();
                    // Through the welcome-gift screen — see handleCreateBot.
                    router.replace('/welcome-gift?from=onboarding');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={s.createButtonText}>Go to feed</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  paddingBottom: overlayBottom,
                  paddingHorizontal: 24,
                  // Keep the scrim tight to the content — it dims the dream
                  // reveal, so every extra point of height costs showcase.
                  paddingTop: verticalScale(20),
                  backgroundColor: 'transparent',
                }}
              >
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: 'rgba(0,0,0,0.65)',
                  }}
                />
                <ResponsiveContainer maxWidth={600} style={{ alignSelf: 'center' }}>
                  <GradientTitle
                    size={22}
                    weight={800}
                    lineHeight={28}
                    align="center"
                    numberOfLines={2}
                    style={{ marginBottom: verticalScale(10) }}
                  >
                    Your first dream
                  </GradientTitle>
                  {/* The moon glyph matches the profile Dreams tab icon so the
                      association sticks when they go looking for the album. */}
                  <Text style={s.revealBody}>
                    All dreams are saved to your Dreams{' '}
                    <Ionicons name="moon" size={fontScale(13)} color="rgba(255,255,255,0.72)" />{' '}
                    album privately by default
                  </Text>
                  <GradientButton
                    label="Post to my feed"
                    onPress={() => handleCreateBot(true)}
                    style={{ alignSelf: 'stretch' }}
                  />
                  <TouchableOpacity
                    style={s.secondaryButton}
                    onPress={() => handleCreateBot(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={s.secondaryButtonText}>Skip and go to feed</Text>
                  </TouchableOpacity>
                </ResponsiveContainer>
              </View>
            ))}
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  // Centers the MagicalLoadingStage during boot+generating phases (same
  // layout the Create-tab dream loader uses).
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Post-Skip "finished" state — just a thin gradient scrim behind a
  // single Go-to-feed CTA pinned at the bottom. paddingBottom comes from
  // the safe-area inset (set in-component) so the CTA sits above the
  // home indicator on devices that have one.
  finishedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: verticalScale(60),
  },
  finishedFooterScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: verticalScale(16),
    paddingHorizontal: 32,
  },
  idleMascot: {
    width: IDLE_MASCOT_SIZE,
    height: IDLE_MASCOT_SIZE,
    borderRadius: 28,
    marginBottom: verticalScale(8),
  },
  bigTitle: {
    color: colors.textPrimary,
    fontSize: fontScale(22),
    fontWeight: '800',
    textAlign: 'center',
  },
  centeredSub: { color: colors.textSecondary, fontSize: fontScale(15), textAlign: 'center' },
  revealTitle: {
    color: '#FFFFFF',
    fontSize: fontScale(22),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  revealBody: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    textAlign: 'center',
    marginBottom: verticalScale(22),
    paddingHorizontal: verticalScale(12),
  },

  content: { flex: 1, paddingTop: verticalScale(4), alignItems: 'center' },
  heading: {
    color: colors.textPrimary,
    fontSize: fontScale(20),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: verticalScale(6),
    paddingHorizontal: 20,
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: fontScale(13),
    textAlign: 'center',
    marginBottom: verticalScale(16),
    paddingHorizontal: 24,
    lineHeight: fontScale(19),
  },

  imageWrap: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageSlide: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    zIndex: 1,
  },
  generatingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  generatingText: { color: '#FFFFFF', fontSize: fontScale(16), fontWeight: '700' },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: verticalScale(14),
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 20,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },

  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { color: colors.textSecondary, fontSize: fontScale(15) },

  footer: { paddingHorizontal: 20, paddingBottom: verticalScale(16), gap: 10 },
  footerRow: { flexDirection: 'row', gap: 10 },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: verticalScale(18),
  },
  createButtonText: { color: '#FFFFFF', fontSize: fontScale(18), fontWeight: '800' },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    marginTop: verticalScale(4),
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontScale(15),
    fontWeight: '700',
  },
  dreamAgainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: verticalScale(14),
  },
  dreamAgainText: {
    color: '#FFFFFF',
    fontSize: fontScale(15),
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: verticalScale(14),
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: fontScale(15),
    fontWeight: '700',
  },

  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImageWrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullscreenClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
