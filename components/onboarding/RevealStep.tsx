import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Modal,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { supabase } from '@/lib/supabase';
import { saveDream } from '@/lib/dreamSave';
// Vibe profile prompt is built inline — no recipe engine needed for onboarding reveal
import { colors } from '@/constants/theme';
import { MASCOT_URLS } from '@/constants/mascots';
import { Toast } from '@/components/Toast';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Balanced resolution: sharper than 512, cheaper than 768
const GEN_WIDTH = 640;
const GEN_HEIGHT = Math.round(((SCREEN_HEIGHT / SCREEN_WIDTH) * GEN_WIDTH) / 8) * 8; // round to nearest 8
const IMAGE_WIDTH = SCREEN_WIDTH - 48;
const IMAGE_HEIGHT = Math.min(IMAGE_WIDTH * (SCREEN_HEIGHT / SCREEN_WIDTH), 380);
const MAX_DREAMS = Infinity;

type Phase = 'idle' | 'booting' | 'generating' | 'reveal' | 'creating' | 'sparkles';

const BOOT_MESSAGES = [
  'Initializing your DreamBot...',
  'Sharpening pencils...',
  'Adjusting the mood lighting...',
  'Giving it an attitude...',
  'Filling its head with your weird stuff...',
  'Here goes nothing...',
];

interface Dream {
  url: string;
  prompt: string;
  medium?: string;
  vibe?: string;
}

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function RevealStep({ onBack }: Props) {
  const profile = useOnboardingStore((s) => s.profile);
  const isEditing = useOnboardingStore((s) => s.isEditing);
  const reset = useOnboardingStore((s) => s.reset);
  const user = useAuthStore((s) => s.user);
  const setPinnedPost = useFeedStore((s) => s.setPinnedPost);

  const [phase, setPhase] = useState<Phase>('idle');
  const [isZoomed, setIsZoomed] = useState(false);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [bootMessage, setBootMessage] = useState(BOOT_MESSAGES[0]);
  const generating = useRef(false);
  const scrollRef = useRef<ScrollView>(null);

  const activeDream = dreams[activeIndex] ?? null;
  const dreamsRemaining = MAX_DREAMS - dreams.length;
  const canDreamAgain = dreamsRemaining > 0;
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);
  const describedProfile = useRef(profile);

  // Pinch to zoom on preview
  const zoomScale = useSharedValue(1);
  const zoomTransX = useSharedValue(0);
  const zoomTransY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const startFocalX = useSharedValue(0);
  const startFocalY = useSharedValue(0);

  const zoomStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: zoomTransX.value },
      { translateY: zoomTransY.value },
      { scale: zoomScale.value },
    ],
  }));

  // Fullscreen pinch zoom
  const fsScale = useSharedValue(1);
  const fsTransX = useSharedValue(0);
  const fsTransY = useSharedValue(0);
  const fsFocalX = useSharedValue(0);
  const fsFocalY = useSharedValue(0);
  const fsStartFocalX = useSharedValue(0);
  const fsStartFocalY = useSharedValue(0);

  const fsZoomStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: fsTransX.value },
      { translateY: fsTransY.value },
      { scale: fsScale.value },
    ],
  }));

  const fsPinch = Gesture.Pinch()
    .onStart((e) => {
      fsFocalX.value = e.focalX - SCREEN_WIDTH / 2;
      fsFocalY.value = e.focalY - SCREEN_HEIGHT / 2;
      fsStartFocalX.value = e.focalX;
      fsStartFocalY.value = e.focalY;
    })
    .onUpdate((e) => {
      const sc = Math.max(1, Math.min(5, e.scale));
      fsScale.value = sc;
      fsTransX.value = fsFocalX.value * (1 - sc) + (e.focalX - fsStartFocalX.value);
      fsTransY.value = fsFocalY.value * (1 - sc) + (e.focalY - fsStartFocalY.value);
    })
    .onEnd(() => {
      fsScale.value = withTiming(1, { duration: 200 });
      fsTransX.value = withTiming(0, { duration: 200 });
      fsTransY.value = withTiming(0, { duration: 200 });
    });

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      runOnJS(setIsZoomed)(true);
      focalX.value = e.focalX - IMAGE_WIDTH / 2;
      focalY.value = e.focalY - IMAGE_HEIGHT / 2;
      startFocalX.value = e.focalX;
      startFocalY.value = e.focalY;
    })
    .onUpdate((e) => {
      const sc = Math.max(1, Math.min(5, e.scale));
      zoomScale.value = sc;
      const panX = e.focalX - startFocalX.value;
      const panY = e.focalY - startFocalY.value;
      zoomTransX.value = focalX.value * (1 - sc) + panX;
      zoomTransY.value = focalY.value * (1 - sc) + panY;
    })
    .onEnd(() => {
      zoomScale.value = withTiming(1, { duration: 200 });
      zoomTransX.value = withTiming(0, { duration: 200 });
      zoomTransY.value = withTiming(0, { duration: 200 });
      runOnJS(setIsZoomed)(false);
    });

  async function runBootSequence() {
    for (let i = 0; i < BOOT_MESSAGES.length; i++) {
      setBootMessage(BOOT_MESSAGES[i]);
      await new Promise((r) => setTimeout(r, 600));
    }
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
          return { ...member, description: data.description ?? '' };
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
        await supabase.from('user_recipes').upsert(
          {
            user_id: user.id,
            recipe: JSON.parse(JSON.stringify(profileWithDescriptions)),
            onboarding_completed: true,
            ai_enabled: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
        await supabase.from('users').update({ has_ai_recipe: true }).eq('id', user.id);
      }

      await bootPromise;
      setPhase('generating');

      // Let the engine pick from user's selections
      const mediumKey = 'surprise_me';
      const vibeKey = 'surprise_me';

      if (__DEV__) console.log('[Reveal] medium:', mediumKey, 'vibe:', vibeKey);
      const result = await generateVibeProfileDream(mediumKey, vibeKey);
      if (__DEV__) console.log('[Reveal] Got URL:', result.url?.slice(0, 80));

      setDreams((prev) => {
        const next = [
          ...prev,
          {
            url: result.url,
            prompt: result.prompt,
            medium: result.medium,
            vibe: result.vibe,
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

  async function generateVibeProfileDream(
    mediumKey?: string,
    vibeKey?: string
  ): Promise<{ url: string; prompt: string; medium?: string; vibe?: string }> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error('Not authenticated');

    const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/generate-dream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        mode: 'flux-dev',
        medium_key: mediumKey,
        vibe_key: vibeKey,
        vibe_profile: describedProfile.current,
        persist: false,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      if (__DEV__) console.warn('[Reveal] Edge function error:', res.status, errBody);
      throw new Error(`Generation failed: ${res.status}`);
    }

    const data = await res.json();
    if (!data.image_url) throw new Error('No image URL in response');
    return {
      url: data.image_url,
      prompt: data.prompt_used ?? '',
      medium: data.resolved_medium ?? undefined,
      vibe: data.resolved_vibe ?? undefined,
    };
  }

  function handleDreamAgain() {
    if (!canDreamAgain) return;
    generateImage();
  }

  const handleScrollEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / IMAGE_WIDTH);
      if (idx >= 0 && idx < dreams.length && idx !== activeIndex) {
        setActiveIndex(idx);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [dreams.length, activeIndex]
  );

  async function handleCreateBot() {
    if (!user || !activeDream) return;
    setPhase('creating');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      await supabase.from('user_recipes').upsert(
        {
          user_id: user.id,
          recipe: JSON.parse(JSON.stringify(profile)),
          onboarding_completed: true,
          ai_enabled: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

      await supabase.from('users').update({ has_ai_recipe: true }).eq('id', user.id);

      const { data: insertedRow, error: uploadError } = await supabase
        .from('uploads')
        .insert({
          user_id: user.id,
          image_url: activeDream.url,
          caption: null,
          ai_prompt: activeDream.prompt || null,
          medium: activeDream.medium || null,
          vibe: activeDream.vibe || null,
        })
        .select('id')
        .single();

      if (uploadError) {
        if (__DEV__) console.warn('[Reveal] Upload error:', uploadError);
      }

      // Pin this dream so the home feed shows it as the first card
      setPinnedPost({
        id: insertedRow?.id ?? `temp-${Date.now()}`,
        user_id: user.id,
        image_url: activeDream.url,
        caption: null,
        username: user.user_metadata?.username ?? '',
        avatar_url: user.user_metadata?.avatar_url ?? null,
        created_at: new Date().toISOString(),
        comment_count: 0,
      });

      // Grant 25 welcome sparkles (check balance first to avoid double-grant on retry)
      const { data: balanceCheck } = await supabase
        .from('users')
        .select('sparkle_balance')
        .eq('id', user.id)
        .single();
      if ((balanceCheck?.sparkle_balance ?? 0) < 25) {
        await supabase.rpc('grant_sparkles', {
          p_user_id: user.id,
          p_amount: 25,
          p_reason: 'welcome_bonus',
        });
      }

      // Send welcome notification from DreamBot
      await supabase.from('notifications').insert({
        recipient_id: user.id,
        actor_id: user.id,
        type: 'dream_generated',
        upload_id: insertedRow?.id ?? null,
        body: "welcome:Hello, I'm DreamBot, your new AI buddy. Here's 25 Sparkles to help you get dreaming. Sweet Dreams!",
      });

      reset();
      setPhase('sparkles');
    } catch (err) {
      if (__DEV__) console.warn('[Reveal] Create error:', err);
      setPhase('reveal');
      Toast.show('Something went wrong', 'close-circle');
    }
  }

  // ── Sparkles welcome ──
  if (phase === 'sparkles') {
    return (
      <View style={s.root}>
        <View style={s.centeredContent}>
          <Text style={s.bigTitle}>25 Sparkles!</Text>
          <Text style={[s.centeredSub, { marginBottom: 24, lineHeight: 22 }]}>
            {`Your DreamBot is alive! It'll dream for you every night — for free. Use sparkles to dream on demand with the Dream tool — any style, no limits.`}
          </Text>

          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 20,
              width: '100%',
              gap: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="sparkles" size={20} color={colors.accent} />
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
                1 Sparkle = 1 on-demand dream
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="moon" size={20} color={colors.accent} />
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
                Your DreamBot dreams every night for free
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="bag-handle" size={20} color={colors.accent} />
              <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
                Get more sparkles anytime in the shop
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[s.createButton, { alignSelf: 'stretch', marginTop: 24 }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              router.replace('/(tabs)');
            }}
            activeOpacity={0.7}
          >
            <Text style={s.createButtonText}>Start Dreaming</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Edit mode: just save and go home ──
  if (phase === 'idle' && isEditing) {
    return (
      <View style={s.root}>
        <View style={s.centeredContent}>
          <Image source={{ uri: MASCOT_URLS[1] }} style={s.idleMascot} contentFit="cover" />
          <Text style={s.bigTitle}>Save your changes</Text>
          <Text style={s.centeredSub}>Your updated taste profile will shape all future dreams</Text>
          <TouchableOpacity
            style={[s.createButton, { alignSelf: 'stretch', marginTop: 8 }]}
            onPress={async () => {
              if (!user) return;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              try {
                await supabase.from('user_recipes').upsert(
                  {
                    user_id: user.id,
                    recipe: JSON.parse(JSON.stringify(profile)),
                    onboarding_completed: true,
                    ai_enabled: true,
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: 'user_id' }
                );
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
          <TouchableOpacity style={{ marginTop: 12 }} onPress={onBack} activeOpacity={0.7}>
            <Text style={{ color: colors.textSecondary, fontSize: 15, fontWeight: '600' }}>
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
          <Image source={{ uri: MASCOT_URLS[1] }} style={s.idleMascot} contentFit="cover" />
          <Text style={s.bigTitle}>Your DreamBot is built</Text>
          <Text style={s.centeredSub}>{`Stand back. It's about to wake up.`}</Text>
          <TouchableOpacity
            style={[s.createButton, { alignSelf: 'stretch', marginTop: 8 }]}
            onPress={() => generateImage()}
            activeOpacity={0.7}
          >
            <Text style={s.createButtonText}>Activate DreamBot</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Boot-up sequence ──
  if (phase === 'booting') {
    return (
      <View style={s.root}>
        <View style={s.centeredContent}>
          <Image source={{ uri: MASCOT_URLS[2] }} style={s.idleMascot} contentFit="cover" />
          <Text style={s.bigTitle}>{bootMessage}</Text>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      </View>
    );
  }

  // ── Generating (after boot-up) ──
  if (phase === 'generating' && dreams.length === 0) {
    return (
      <View style={s.root}>
        <View style={s.centeredContent}>
          <Image source={{ uri: MASCOT_URLS[2] }} style={s.idleMascot} contentFit="cover" />
          <Text style={s.bigTitle}>Generating first dream...</Text>
          <Text style={s.centeredSub}>Your DreamBot is online</Text>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      </View>
    );
  }

  // ── Reveal state ──
  return (
    <View style={s.root}>
      <View style={s.content}>
        {error && dreams.length === 0 ? (
          <TouchableOpacity style={s.errorContainer} onPress={() => generateImage()}>
            <Ionicons name="refresh" size={32} color={colors.textSecondary} />
            <Text style={s.errorText}>{error}</Text>
          </TouchableOpacity>
        ) : activeDream ? (
          <>
            <Text style={s.heading}>Pick your first dream</Text>
            <Text style={s.subheading}>
              {dreams.length === 1 && canDreamAgain
                ? 'This is one of many possible dreams your bot can create. Tap "Dream Again" to see more, or post this one now.'
                : canDreamAgain
                  ? `Swipe to browse your dreams. When you find one you love, post it. ${dreamsRemaining} dream${dreamsRemaining === 1 ? '' : 's'} left to try.`
                  : 'Swipe to browse your dreams and pick your favorite to post.'}
            </Text>

            {/* Swipeable image preview with pinch to zoom */}
            <GestureDetector gesture={pinchGesture}>
              <Animated.View style={[s.imageWrap, zoomStyle]}>
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  pagingEnabled
                  scrollEnabled={!isZoomed}
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={handleScrollEnd}
                  scrollEventThrottle={16}
                  style={{ width: IMAGE_WIDTH }}
                  contentContainerStyle={{ alignItems: 'center' }}
                >
                  {dreams.map((dream, i) => (
                    <TouchableOpacity
                      key={i}
                      style={s.imageSlide}
                      onPress={() => setFullscreenUrl(dream.url)}
                      activeOpacity={0.9}
                    >
                      <ActivityIndicator style={s.imageLoader} size="small" color={colors.accent} />
                      <Image
                        source={{ uri: dream.url }}
                        style={s.image}
                        contentFit="cover"
                        transition={200}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Generating overlay */}
                {phase === 'generating' && (
                  <View style={s.generatingOverlay}>
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text style={s.generatingText}>Dreaming...</Text>
                  </View>
                )}
              </Animated.View>
            </GestureDetector>

            {/* Dot indicators */}
            {dreams.length > 1 && (
              <View style={s.dots}>
                {dreams.map((_, i) => (
                  <View key={i} style={[s.dot, i === activeIndex && s.dotActive]} />
                ))}
              </View>
            )}
          </>
        ) : null}
      </View>

      {dreams.length > 0 && (
        <View style={s.footer}>
          <View style={s.footerRow}>
            {canDreamAgain && (
              <TouchableOpacity
                style={s.dreamAgainButton}
                onPress={handleDreamAgain}
                disabled={phase === 'creating' || phase === 'generating'}
                activeOpacity={0.7}
              >
                <Text style={s.dreamAgainText}>Dream Again</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={s.saveButton}
              onPress={async () => {
                if (!user || !activeDream) return;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                try {
                  await saveDream({
                    userId: user.id,
                    tempImageUrl: activeDream.url,
                    prompt: activeDream.prompt || '',
                    visibility: 'private',
                    dreamMedium: activeDream.medium,
                    dreamVibe: activeDream.vibe,
                  });
                  Toast.show('Dream saved!', 'checkmark-circle');
                } catch (err) {
                  if (__DEV__) console.warn('[Reveal] Save error:', err);
                  Toast.show('Failed to save dream', 'close-circle');
                }
              }}
              disabled={phase === 'creating' || phase === 'generating'}
              activeOpacity={0.7}
            >
              <Text style={s.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={s.createButton}
            onPress={handleCreateBot}
            disabled={phase === 'creating' || phase === 'generating'}
            activeOpacity={0.7}
          >
            {phase === 'creating' ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={s.createButtonText}>Finish Setup</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Fullscreen image modal */}
      <Modal visible={!!fullscreenUrl} transparent animationType="fade" statusBarTranslucent>
        <StatusBar hidden />
        <TouchableOpacity
          style={s.fullscreenBackdrop}
          onPress={() => setFullscreenUrl(null)}
          activeOpacity={1}
        >
          <GestureDetector gesture={fsPinch}>
            <Animated.View style={[s.fullscreenImageWrap, fsZoomStyle]}>
              {fullscreenUrl && (
                <Image
                  source={{ uri: fullscreenUrl }}
                  style={s.fullscreenImage}
                  contentFit="contain"
                  transition={200}
                />
              )}
            </Animated.View>
          </GestureDetector>
          <TouchableOpacity
            style={s.fullscreenClose}
            onPress={() => setFullscreenUrl(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  idleMascot: {
    width: 140,
    height: 140,
    borderRadius: 28,
    marginBottom: 8,
  },
  bigTitle: { color: colors.textPrimary, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  centeredSub: { color: colors.textSecondary, fontSize: 15, textAlign: 'center' },

  content: { flex: 1, paddingTop: 4, alignItems: 'center' },
  heading: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    paddingHorizontal: 20,
  },
  subheading: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
    lineHeight: 19,
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
  generatingText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
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
  errorText: { color: colors.textSecondary, fontSize: 15 },

  footer: { paddingHorizontal: 20, paddingBottom: 16, gap: 10 },
  footerRow: { flexDirection: 'row', gap: 10 },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 18,
  },
  createButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  dreamAgainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
  },
  dreamAgainText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
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
