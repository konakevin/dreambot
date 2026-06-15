import { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { useFeedStore } from '@/store/feed';
import { GradientButton } from '@/components/GradientButton';
import { GradientTitle } from '@/components/GradientTitle';
import { supabase } from '@/lib/supabase';
import { fetchEdge } from '@/lib/edgeFunction';
import { saveVibeProfile } from '@/lib/saveVibeProfile';
import { enqueueFirstDream, awaitFirstDream } from '@/lib/firstDreamQueue';
import { trackFirstDreamGenerated, trackOnboardingCompleted } from '@/lib/analytics';
// Vibe profile prompt is built inline — no recipe engine needed for onboarding reveal
import { colors } from '@/constants/theme';
import { verticalScale, fontScale, verticalScaleClamped } from '@/lib/responsive';
import { Toast } from '@/components/Toast';
import { MagicalLoadingStage } from '@/components/MagicalLoadingStage';

const MASCOT = require('@/assets/images/icon.png');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH - 48;
const IMAGE_HEIGHT = Math.min(IMAGE_WIDTH * (SCREEN_HEIGHT / SCREEN_WIDTH), SCREEN_HEIGHT * 0.45);
const IDLE_MASCOT_SIZE = verticalScaleClamped(140, 110, 160);

// Race a promise against a timeout so a stalled network call can never trap the
// user on the reveal. The underlying request keeps running in the background if
// it loses the race — we just stop waiting on it.
function withTimeout<T>(p: PromiseLike<T>, ms: number): Promise<T> {
  return Promise.race([
    Promise.resolve(p),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

type Phase = 'idle' | 'booting' | 'generating' | 'reveal' | 'creating' | 'sparkles' | 'finished';
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
}

export function RevealStep({ onBack }: Props) {
  const profile = useOnboardingStore((s) => s.profile);
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const reset = useOnboardingStore((s) => s.reset);
  const setChromeHidden = useOnboardingStore((s) => s.setChromeHidden);
  const setScrollLocked = useOnboardingStore((s) => s.setScrollLocked);
  const user = useAuthStore((s) => s.user);
  const engineConfig = useEngineConfig();
  const setPendingPostId = useFeedStore((s) => s.setPendingPostId);
  const insets = useSafeAreaInsets();
  // Bottom inset for the overlay buttons: respect the home indicator when
  // present (insets.bottom > 0), otherwise use a sensible floor so the
  // buttons don't sit flush against the screen edge on SE-class devices.
  const overlayBottom = Math.max(insets.bottom + verticalScale(8), verticalScale(24));

  const [phase, setPhase] = useState<Phase>('idle');
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Tap-to-preview: shows the dream full-frame with the post/skip HUD hidden.
  // Exiting (close button or tap anywhere) returns to the reveal screen.
  const [preview, setPreview] = useState(false);
  // Which CTA is in flight ('post' vs 'skip') — both set phase='creating', so
  // this is what keeps the Post button from reading "Posting…" during a Skip.
  // Only POST has an in-flight state now (the publish flip) — SKIP is an instant
  // redirect, so it never enters a busy state.
  const [busyAction, setBusyAction] = useState<'post' | null>(null);
  const generating = useRef(false);
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
      phase === 'booting' ||
      phase === 'generating' ||
      phase === 'reveal' ||
      phase === 'creating' ||
      phase === 'finished';
    setChromeHidden(hidden);
    // Also LOCK the pager swipe for these phases — once the dream is
    // generating/revealed there's no going back through onboarding; the only
    // way out is the "Go to feed" CTA (which calls reset() → clears this).
    setScrollLocked(hidden);
  }, [phase, setChromeHidden, setScrollLocked]);

  // Abort any in-flight first-dream poll loop on unmount.
  useEffect(() => () => pollAbort.current?.abort(), []);

  async function runBootSequence() {
    await new Promise((r) => setTimeout(r, 1500));
  }

  async function describeCastPhotos(): Promise<typeof profile.dream_cast> {
    const described = await Promise.all(
      profile.dream_cast.map(async (member) => {
        // Skip if already described or no URL
        if (member.description || !member.thumb_url) return member;
        // Skip local file:// URIs — need a public URL
        if (member.thumb_url.startsWith('file://')) return member;
        try {
          // fetchEdge guarantees a fresh access token per call (proactive
          // refresh + 401 retry) — no stale-token 401 on a backgrounded device.
          const res = await fetchEdge('describe-photo', {
            image_url: member.thumb_url,
            role: member.role,
          });
          if (!res.ok) throw new Error(`${res.status}`);
          const data = await res.json();
          if (__DEV__)
            console.log(`[Reveal] Described ${member.role}:`, data.description?.slice(0, 80));
          return {
            ...member,
            description: data.description ?? '',
            ...(data.gender ? { gender: data.gender } : {}),
            ...(typeof data.age === 'number' ? { age: data.age } : {}),
            ...(data.physical_summary ? { physical_summary: data.physical_summary } : {}),
          };
        } catch (err) {
          if (__DEV__) console.warn(`[Reveal] Failed to describe ${member.role}:`, err);
          return member;
        }
      })
    );
    return described;
  }

  async function generateImage() {
    if (generating.current) return;
    generating.current = true;
    setPhase('booting');
    setError(null);

    // Run boot-up sequence in parallel with saving profile + describing cast photos
    const bootPromise = runBootSequence();

    try {
      // Describe cast photos (one-time AI vision call per photo). Timeout-
      // guarded so a stalled vision call can never trap the loading screen — if
      // it doesn't finish in time we proceed with the cast we already have.
      let describedCast = profile.dream_cast;
      try {
        describedCast = await withTimeout(describeCastPhotos(), 45000);
      } catch (err) {
        if (__DEV__) console.warn('[Reveal] describe cast timed out/failed, proceeding:', err);
      }
      const profileWithDescriptions = {
        ...profile,
        dream_cast: describedCast,
      };
      describedProfile.current = profileWithDescriptions;

      // Persist the profile (timeout-guarded — never trap the user before their
      // dream if the write stalls; it's idempotent and re-saved on edit anyway).
      if (user) {
        try {
          await withTimeout(saveVibeProfile(user.id, profileWithDescriptions), 15000);
        } catch (err) {
          if (__DEV__) console.warn('[Reveal] profile save timed out/failed:', err);
        }
      }

      // END OF ONBOARDING — persist all remaining bookkeeping NOW, before the
      // dream generates (welcome sparkles + completion + welcome-gift
      // notification). Fire-and-forget so it never blocks generation OR the
      // reveal: by the time the dream lands and the reveal shows, everything is
      // already saved, so Post/Skip is a pure instant redirect.
      void finalizeOnboarding();

      await bootPromise;
      setPhase('generating');

      // Enqueue ONE first-dream job + poll for its terminal state. The
      // dual → single → scene cascade runs server-side (first-dream-render
      // advances tiers across isolates), so the client never holds a long HTTP
      // connection — no more "loading forever". A fresh AbortController per run
      // lets unmount / retry cancel the poll loop cleanly.
      pollAbort.current?.abort();
      pollAbort.current = new AbortController();
      const jobId = await enqueueFirstDream(describedProfile.current);
      const result = await awaitFirstDream(jobId, { signal: pollAbort.current.signal });
      if (__DEV__) console.log('[Reveal] Got URL:', result.url?.slice(0, 80));

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
      // Non-network analytics about the rendered dream (medium/vibe only known
      // now). Onboarding-completion + persistence already fired in
      // finalizeOnboarding before generation.
      trackFirstDreamGenerated({ medium: result.medium, vibe: result.vibe });
    } catch (err) {
      if (__DEV__) console.warn('[Reveal] Generation failed:', err);
      setError('We couldn’t finish your first dream just now.');
      setPhase('reveal');
    } finally {
      generating.current = false;
    }
  }

  // End-of-onboarding bookkeeping — fired ONCE from generateImage before the
  // dream renders, so the reveal has nothing left to persist. All best-effort +
  // timeout-guarded; a failure here never blocks the user or the dream.
  //   • welcome sparkles (balance-checked → no double-grant on a retry)
  //   • completion analytics
  //   • welcome-gift notification (no upload_id — it routes to /welcome-gift by
  //     TYPE and the screen doesn't display a dream, so the id was vestigial)
  async function finalizeOnboarding() {
    if (!user) return;
    trackOnboardingCompleted();
    try {
      const welcomeBonus = engineConfig.welcomeSparkleBonus;
      const { data: balanceCheck } = await withTimeout(
        supabase.from('users').select('sparkle_balance').eq('id', user.id).single(),
        10000
      );
      if ((balanceCheck?.sparkle_balance ?? 0) < welcomeBonus) {
        await withTimeout(
          supabase.rpc('grant_sparkles', {
            p_user_id: user.id,
            p_amount: welcomeBonus,
            p_reason: 'welcome_bonus',
          }),
          10000
        );
      }
      await withTimeout(
        supabase.from('notifications').insert({
          recipient_id: user.id,
          actor_id: user.id,
          type: 'welcome_gift',
        }),
        10000
      );
    } catch (err) {
      if (__DEV__) console.warn('[Reveal] onboarding finalize failed:', err);
    }
  }

  async function handleCreateBot(makePublic: boolean) {
    if (!user || !activeDream) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Profile, welcome sparkles, welcome-gift notification, and completion all
    // already persisted at the END of onboarding (finalizeOnboarding, before the
    // dream generated). So there is NOTHING left to save here:
    //   • SKIP  → instant redirect, zero awaits, can't get stuck.
    //   • POST  → ONE timeout-guarded write (flip the private draft public) +
    //             pin it to the feed, then go. The render already persisted the
    //             dream, so we never insert a second row.
    const uploadId: string | null = activeDream.uploadId ?? null;
    if (makePublic && uploadId) {
      setBusyAction('post');
      setPhase('creating');
      try {
        await withTimeout(
          supabase
            .from('uploads')
            // Clear the prompt-derived caption so the feed post reads clean.
            .update({ is_public: true, posted_at: new Date().toISOString(), caption: null })
            .eq('id', uploadId),
          4000
        );
        // Pin the just-posted dream to the top of the home feed. The home screen
        // fetches the FULL persisted row from this id (real storage URL, like
        // state, dimensions) so the pinned card renders cleanly, and it survives
        // the post-onboarding FeedIntroGate (bot selection) underneath.
        setPendingPostId(uploadId);
      } catch (err) {
        // Publish stalled/failed — the dream still lives privately in the album.
        // Don't trap the user on the reveal; head to the feed regardless.
        if (__DEV__) console.warn('[Reveal] publish flip failed/timed out:', err);
      }
    }

    reset();
    router.replace('/(tabs)');
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
            onPress={() => generateImage()}
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
        <MagicalLoadingStage subtext="This can take a moment. Hang tight while we dream up something special for you!" />
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
            <GradientButton label="Try again" onPress={() => generateImage()} />
          </View>
        </View>
      ) : activeDream ? (
        <View style={{ flex: 1 }}>
          {/* Fullscreen dream image */}
          <Image
            source={{ uri: activeDream.url }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
          />

          {/* Tap the image (anywhere not covered by the HUD) for a HUD-free
              full preview. Sits above the image but below the bottom HUD, so
              the post/skip buttons still win their own taps. */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => {
              Haptics.selectionAsync();
              setPreview(true);
            }}
          />

          {/* Subtle affordance so tap-to-preview is discoverable. */}
          {phase !== 'finished' && (
            <TouchableOpacity
              style={[s.previewHint, { top: insets.top + verticalScale(8) }]}
              onPress={() => {
                Haptics.selectionAsync();
                setPreview(true);
              }}
              hitSlop={12}
              activeOpacity={0.7}
            >
              <Ionicons name="expand" size={18} color="rgba(255,255,255,0.95)" />
            </TouchableOpacity>
          )}

          {phase === 'finished' ? (
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
                  router.replace('/(tabs)');
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
                paddingTop: verticalScale(60),
                backgroundColor: 'transparent',
              }}
            >
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: 'rgba(0,0,0,0.65)',
                }}
              />
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
              <Text style={s.revealBody}>
                All dreams are saved to your Dreams album privately by default
              </Text>
              <GradientButton
                label={busyAction === 'post' ? 'Posting…' : 'Post to my feed'}
                onPress={() => handleCreateBot(true)}
                disabled={phase === 'creating'}
                style={{ alignSelf: 'stretch' }}
              />
              <TouchableOpacity
                style={s.secondaryButton}
                onPress={() => handleCreateBot(false)}
                disabled={phase === 'creating'}
                activeOpacity={0.7}
              >
                <Text style={s.secondaryButtonText}>Skip and go to feed</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* HUD-free full preview — the whole generated image, no post/skip
              chrome. Tap anywhere or the close button to return to the reveal. */}
          {preview && (
            <View style={s.previewLayer}>
              <Image
                source={{ uri: activeDream.url }}
                style={StyleSheet.absoluteFill}
                contentFit="contain"
                transition={150}
              />
              <TouchableOpacity
                style={StyleSheet.absoluteFill}
                activeOpacity={1}
                onPress={() => setPreview(false)}
              />
              <TouchableOpacity
                style={[s.previewClose, { top: insets.top + verticalScale(8) }]}
                onPress={() => setPreview(false)}
                hitSlop={12}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={26} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
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
  // Tap-to-preview affordance (top-right of the reveal image).
  previewHint: {
    position: 'absolute',
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  // Full-frame HUD-free preview layer (sits above the reveal HUD).
  previewLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 20,
  },
  previewClose: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
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
