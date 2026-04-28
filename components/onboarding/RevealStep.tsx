import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';
import { useFeedStore } from '@/store/feed';
import { supabase } from '@/lib/supabase';
// Vibe profile prompt is built inline — no recipe engine needed for onboarding reveal
import { colors } from '@/constants/theme';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const MASCOT = require('@/assets/images/icon.png');
import { Toast } from '@/components/Toast';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH - 48;
const IMAGE_HEIGHT = Math.min(IMAGE_WIDTH * (SCREEN_HEIGHT / SCREEN_WIDTH), SCREEN_HEIGHT * 0.45);
const MAX_DREAMS = Infinity;

type Phase = 'idle' | 'booting' | 'generating' | 'reveal' | 'creating' | 'sparkles';

const BOOT_MESSAGE = 'Your DreamBot is dreaming up something special...';

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
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [bootMessage] = useState(BOOT_MESSAGE);
  const generating = useRef(false);
  const scrollRef = useRef<ScrollView>(null);

  const activeDream = dreams[activeIndex] ?? null;
  const dreamsRemaining = MAX_DREAMS - dreams.length;
  const describedProfile = useRef(profile);

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

  async function handleCreateBot() {
    if (!user || !activeDream) return;
    setPhase('creating');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      // Use describedProfile if available (has AI-generated cast descriptions),
      // otherwise fall back to raw profile. NEVER save profile with empty cast descriptions
      // over one that already has them.
      const profileToSave = describedProfile.current ?? profile;
      await supabase.from('user_recipes').upsert(
        {
          user_id: user.id,
          recipe: JSON.parse(JSON.stringify(profileToSave)),
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
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
            style={[s.createButton, { alignSelf: 'stretch', marginTop: 8 }]}
            onPress={async () => {
              if (!user) return;
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              try {
                const profileToSave = describedProfile.current ?? profile;
                await supabase.from('user_recipes').upsert(
                  {
                    user_id: user.id,
                    recipe: JSON.parse(JSON.stringify(profileToSave)),
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
          <Image source={MASCOT} style={s.idleMascot} contentFit="cover" />
          <Text style={s.bigTitle}>Ready to see what it dreams up?</Text>
          <Text style={s.centeredSub}>
            Your DreamBot knows your taste. Let it loose and see what happens.
          </Text>
          <TouchableOpacity
            style={[s.createButton, { alignSelf: 'stretch', marginTop: 8 }]}
            onPress={() => generateImage()}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={18} color="#FFFFFF" />
            <Text style={s.createButtonText}>Dream It</Text>
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

  // ── Boot-up sequence ──
  if (phase === 'booting') {
    return (
      <View style={s.root}>
        <View style={s.centeredContent}>
          <Image source={MASCOT} style={s.idleMascot} contentFit="cover" />
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
          <Image source={MASCOT} style={s.idleMascot} contentFit="cover" />
          <Text style={s.bigTitle}>Dreaming...</Text>
          <Text style={s.centeredSub}>Your DreamBot is painting something just for you</Text>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
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

          {/* Gradient overlay at bottom for button */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: 50,
              paddingHorizontal: 24,
              paddingTop: 80,
              backgroundColor: 'transparent',
            }}
          >
            {/* Dark gradient behind button */}
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(0,0,0,0.6)',
              }}
            />
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 22,
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              Your first dream
            </Text>
            <Text
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 14,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              {activeDream.medium?.replace(/_/g, ' ')} / {activeDream.vibe}
            </Text>
            <TouchableOpacity
              style={s.createButton}
              onPress={handleCreateBot}
              disabled={phase === 'creating'}
              activeOpacity={0.7}
            >
              {phase === 'creating' ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={s.createButtonText}>Post my Dream</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
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
