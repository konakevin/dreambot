import { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
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
import { supabase } from '@/lib/supabase';
import { saveVibeProfile } from '@/lib/saveVibeProfile';
import { generateFirstDreamCascade } from '@/lib/firstDreamCascade';
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
  const generating = useRef(false);
  const scrollRef = useRef<ScrollView>(null);

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

  async function runBootSequence() {
    await new Promise((r) => setTimeout(r, 1500));
  }

  async function describeCastPhotos(): Promise<typeof profile.dream_cast> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) return profile.dream_cast;

    const described = await Promise.all(
      profile.dream_cast.map(async (member) => {
        // Skip if already described or no URL
        if (member.description || !member.thumb_url) return member;
        // Skip local file:// URIs — need a public URL
        if (member.thumb_url.startsWith('file://')) return member;
        try {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/describe-photo`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                image_url: member.thumb_url,
                role: member.role,
              }),
            }
          );
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
      // Describe cast photos (one-time AI vision call per photo)
      const describedCast = await describeCastPhotos();
      const profileWithDescriptions = {
        ...profile,
        dream_cast: describedCast,
      };
      describedProfile.current = profileWithDescriptions;

      // Save the profile with descriptions so they persist in the database
      if (user) {
        await saveVibeProfile(user.id, profileWithDescriptions);
      }

      await bootPromise;
      setPhase('generating');

      const result = await generateFirstDreamCascade(describedProfile.current);
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
    } catch (err) {
      if (__DEV__) console.warn('[Reveal] Generation failed:', err);
      setError('Image generation failed. Tap to try again.');
      setPhase('reveal');
    } finally {
      generating.current = false;
    }
  }

  async function handleCreateBot(makePublic: boolean) {
    if (!user || !activeDream) return;
    setPhase('creating');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      // Use describedProfile if available (has AI-generated cast descriptions),
      // otherwise fall back to raw profile. NEVER save profile with empty cast descriptions
      // over one that already has them.
      const profileToSave = describedProfile.current ?? profile;
      await saveVibeProfile(user.id, profileToSave);

      // The render engine (nightly-dreams) already persisted the first dream as
      // a PRIVATE uploads row and returned its id. Posting just flips that SAME
      // row public — we never insert a second row (that was the old double-post
      // bug). Only the legacy / first-dream-engine path (no uploadId) still
      // inserts here as a fallback.
      let uploadId: string | null = activeDream.uploadId ?? null;
      if (uploadId) {
        if (makePublic) {
          const { error: pubError } = await supabase
            .from('uploads')
            // Clear the prompt-derived caption so the feed post reads clean
            // (the engine seeds caption with the raw prompt for nightly).
            .update({ is_public: true, posted_at: new Date().toISOString(), caption: null })
            .eq('id', uploadId);
          if (pubError && __DEV__) console.warn('[Reveal] Publish error:', pubError);
        }
      } else {
        const { data: insertedRow, error: uploadError } = await supabase
          .from('uploads')
          .insert({
            user_id: user.id,
            image_url: activeDream.url,
            caption: null,
            ai_prompt: activeDream.prompt || null,
            // Schema uses dream_medium / dream_vibe (not medium / vibe).
            dream_medium: activeDream.medium || null,
            dream_vibe: activeDream.vibe || null,
            is_public: makePublic,
            ...(makePublic ? { posted_at: new Date().toISOString() } : {}),
          })
          .select('id')
          .single();
        if (uploadError && __DEV__) console.warn('[Reveal] Upload error:', uploadError);
        uploadId = insertedRow?.id ?? null;
      }

      // Pin the just-posted first dream to the top of the home feed only when
      // shared publicly (a private dream lives in the album, not the feed).
      // We hand the home screen the upload id, not a hand-built item: its
      // pendingPostId effect fetches the FULL persisted row (real storage URL,
      // like/repost state, dimensions, etc.) so the pinned card renders cleanly
      // — the old partial item used the temp render URL and the post survives
      // through the post-onboarding FeedIntroGate (bot selection) underneath.
      if (makePublic && uploadId) {
        setPendingPostId(uploadId);
      }

      trackFirstDreamGenerated({ medium: activeDream.medium, vibe: activeDream.vibe });

      // Grant welcome sparkles (engine_config.welcome_sparkle_bonus, default 25).
      // Check balance first to avoid double-grant on retry.
      const welcomeBonus = engineConfig.welcomeSparkleBonus;
      const { data: balanceCheck } = await supabase
        .from('users')
        .select('sparkle_balance')
        .eq('id', user.id)
        .single();
      if ((balanceCheck?.sparkle_balance ?? 0) < welcomeBonus) {
        await supabase.rpc('grant_sparkles', {
          p_user_id: user.id,
          p_amount: welcomeBonus,
          p_reason: 'welcome_bonus',
        });
      }

      // Send welcome-gift notification. Routes to /welcome-gift on tap —
      // a celebratory screen that introduces DreamBot, calls out the 25
      // sparkles, and gives a brief feature tour. Subject-only (no body
      // shown in the inbox row); the screen carries the full message.
      // Migration 223 added 'welcome_gift' as a top-level type. Replaces
      // the legacy dream_generated/subtype='welcome' insert that pointed
      // at the first-dream upload.
      await supabase.from('notifications').insert({
        recipient_id: user.id,
        actor_id: user.id,
        type: 'welcome_gift',
        upload_id: uploadId,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      trackOnboardingCompleted();
      // Bot intro + selection now happen AFTER this, as a first-run gate on the
      // feed (FeedIntroGate, 2026-06-14) — so we route straight to the feed here
      // and the gate fires there.
      //
      // Post → reset + go straight to the feed.
      // Skip → drop the reveal overlay + pager chrome (chromeHidden) and
      //        transition to the "finished" phase, which renders the dream
      //        edge-to-edge with a single "Go to feed" CTA. Defer reset()
      //        until that CTA tap so onboarding state stays consistent
      //        while the preview is on screen.
      if (makePublic) {
        reset();
        router.replace('/(tabs)');
      } else {
        // chromeHidden flips via the phase-driven effect above.
        setPhase('finished');
      }
    } catch (err) {
      if (__DEV__) console.warn('[Reveal] Create error:', err);
      setPhase('reveal');
      Toast.show('Something went wrong', 'close-circle');
    }
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
          <Text style={s.bigTitle}>Time for your first dream!</Text>
          <Text style={s.centeredSub}>
            Your DreamBot knows what you like. Tap below to see what it dreams up!
          </Text>
          <TouchableOpacity
            style={[s.createButton, { alignSelf: 'stretch', marginTop: verticalScale(8) }]}
            onPress={() => generateImage()}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={18} color="#FFFFFF" />
            <Text style={s.createButtonText}>Let’s go!</Text>
          </TouchableOpacity>
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
        <MagicalLoadingStage subtext="Hang tight, this can take a moment." />
      </View>
    );
  }

  // ── Reveal state — fullscreen image with "Post my Dream" ──
  return (
    <View style={s.root}>
      {error && dreams.length === 0 ? (
        <TouchableOpacity style={s.centeredContent} onPress={() => generateImage()}>
          <Ionicons name="refresh" size={32} color={colors.textSecondary} />
          <Text style={s.errorText}>{error}</Text>
        </TouchableOpacity>
      ) : activeDream ? (
        <View style={{ flex: 1 }}>
          {/* Fullscreen dream image */}
          <Image
            source={{ uri: activeDream.url }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={300}
          />

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
              <Text style={s.revealTitle}>Your first dream</Text>
              <Text style={s.revealBody}>(saved to your Dreams album either way)</Text>
              <TouchableOpacity
                style={s.createButton}
                onPress={() => handleCreateBot(true)}
                disabled={phase === 'creating'}
                activeOpacity={0.7}
              >
                {phase === 'creating' ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={s.createButtonText}>Post to my feed</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={s.secondaryButton}
                onPress={() => handleCreateBot(false)}
                disabled={phase === 'creating'}
                activeOpacity={0.7}
              >
                <Text style={s.secondaryButtonText}>Skip</Text>
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
    color: 'rgba(255,255,255,0.85)',
    fontSize: fontScale(15),
    lineHeight: fontScale(21),
    textAlign: 'center',
    marginBottom: verticalScale(22),
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
