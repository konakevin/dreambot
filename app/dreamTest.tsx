/**
 * Dream Generator Test — generates dreams using the nightly pipeline
 * with the user's saved profile. Same path as onboarding reveal +
 * nightly cron, but accessible from settings for quick testing.
 */

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
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { saveDream } from '@/lib/dreamSave';
import { colors } from '@/constants/theme';
import type { VibeProfile } from '@/types/vibeProfile';
import { Toast } from '@/components/Toast';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH - 48;
const IMAGE_HEIGHT = Math.min(IMAGE_WIDTH * (SCREEN_HEIGHT / SCREEN_WIDTH), 380);

interface Dream {
  url: string;
  prompt: string;
  medium?: string;
  vibe?: string;
}

export default function DreamTestScreen() {
  const user = useAuthStore((s) => s.user);
  const [generating, setGenerating] = useState(false);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fullscreenUrl, setFullscreenUrl] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const profileRef = useRef<VibeProfile | null>(null);

  const activeDream = dreams[activeIndex] ?? null;

  // Pinch to zoom
  const zoomScale = useSharedValue(1);
  const zoomTransX = useSharedValue(0);
  const zoomTransY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const startFocalX = useSharedValue(0);
  const startFocalY = useSharedValue(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const zoomStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: zoomTransX.value },
      { translateY: zoomTransY.value },
      { scale: zoomScale.value },
    ],
  }));

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
      zoomTransX.value = focalX.value * (1 - sc) + (e.focalX - startFocalX.value);
      zoomTransY.value = focalY.value * (1 - sc) + (e.focalY - startFocalY.value);
    })
    .onEnd(() => {
      zoomScale.value = withTiming(1, { duration: 200 });
      zoomTransX.value = withTiming(0, { duration: 200 });
      zoomTransY.value = withTiming(0, { duration: 200 });
      runOnJS(setIsZoomed)(false);
    });

  // Fullscreen pinch
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

  async function loadProfile(): Promise<VibeProfile | null> {
    if (profileRef.current) return profileRef.current;
    if (!user) return null;
    const { data } = await supabase
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', user.id)
      .single();
    const recipe = data?.recipe as Record<string, unknown> | null;
    if (recipe?.version === 2) {
      profileRef.current = recipe as unknown as VibeProfile;
      return profileRef.current;
    }
    return null;
  }

  async function generateDream() {
    if (generating || !user) return;
    setGenerating(true);
    setError(null);

    try {
      const profile = await loadProfile();
      if (!profile) throw new Error('No vibe profile found');

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Not authenticated');

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/generate-dream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            mode: 'flux-dev',
            medium_key: 'my_mediums',
            vibe_key: 'my_vibes',
            vibe_profile: profile,
            persist: false,
          }),
        }
      );

      if (!res.ok) {
        const errBody = await res.text();
        if (__DEV__) {
          console.warn('[DreamTest] Error:', res.status, errBody);
          console.warn(
            '[DreamTest] Profile sent:',
            JSON.stringify({
              version: profile.version,
              aesthetics: profile.aesthetics?.length,
              art_styles: profile.art_styles?.length,
              cast: profile.dream_cast?.length,
              seeds: Object.values(profile.dream_seeds ?? {}).flat().length,
            })
          );
        }
        throw new Error(`Generation failed: ${res.status} — ${errBody.slice(0, 100)}`);
      }

      const data = await res.json();
      if (!data.image_url) throw new Error('No image URL');

      const newDream: Dream = {
        url: data.image_url,
        prompt: data.prompt_used ?? '',
        medium: data.resolved_medium ?? undefined,
        vibe: data.resolved_vibe ?? undefined,
      };

      setDreams((prev) => {
        const next = [...prev, newDream];
        const newIdx = next.length - 1;
        setActiveIndex(newIdx);
        setTimeout(() => {
          scrollRef.current?.scrollTo({ x: newIdx * IMAGE_WIDTH, animated: true });
        }, 100);
        return next;
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      if (__DEV__) console.warn('[DreamTest] Failed:', err);
      setError('Generation failed. Tap to retry.');
    } finally {
      setGenerating(false);
    }
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

  return (
    <View className="flex-1 bg-[#0F0F1A]">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-16 pb-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-extrabold text-white">
          Dream Generator Test
        </Text>
        <View className="w-7" />
      </View>

      {/* Content */}
      <View className="flex-1 items-center pt-2">
        {dreams.length === 0 && !generating && !error && (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-white text-xl font-extrabold text-center mb-2">
              Test the nightly dream pipeline
            </Text>
            <Text className="text-gray-400 text-sm text-center mb-6">
              Uses your saved profile — same path as onboarding reveal and nightly cron.
            </Text>
            <TouchableOpacity
              className="bg-purple-600 rounded-2xl px-8 py-4"
              onPress={generateDream}
              activeOpacity={0.7}
            >
              <Text className="text-white text-lg font-bold">Generate Dream</Text>
            </TouchableOpacity>
          </View>
        )}

        {generating && dreams.length === 0 && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.accent} />
            <Text className="text-white text-lg font-bold mt-4">Dreaming...</Text>
          </View>
        )}

        {error && dreams.length === 0 && (
          <TouchableOpacity
            className="flex-1 items-center justify-center gap-3"
            onPress={generateDream}
          >
            <Ionicons name="refresh" size={32} color={colors.textSecondary} />
            <Text className="text-gray-400 text-base">{error}</Text>
          </TouchableOpacity>
        )}

        {activeDream && (
          <>
            {/* Medium/Vibe badge */}
            <Text className="text-gray-400 text-xs mb-2">
              {activeDream.medium ?? '?'} / {activeDream.vibe ?? '?'} — dream {activeIndex + 1} of{' '}
              {dreams.length}
            </Text>

            {/* Image carousel */}
            <GestureDetector gesture={pinchGesture}>
              <Animated.View
                style={[
                  {
                    width: IMAGE_WIDTH,
                    height: IMAGE_HEIGHT,
                    borderRadius: 20,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
                  zoomStyle,
                ]}
              >
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  pagingEnabled
                  scrollEnabled={!isZoomed}
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={handleScrollEnd}
                  scrollEventThrottle={16}
                  style={{ width: IMAGE_WIDTH }}
                >
                  {dreams.map((dream, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                      onPress={() => setFullscreenUrl(dream.url)}
                      activeOpacity={0.9}
                    >
                      <ActivityIndicator
                        style={StyleSheet.absoluteFill}
                        size="small"
                        color={colors.accent}
                      />
                      <Image
                        source={{ uri: dream.url }}
                        style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                        contentFit="cover"
                        transition={200}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {generating && (
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                      },
                    ]}
                  >
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text className="text-white text-base font-bold">Dreaming...</Text>
                  </View>
                )}
              </Animated.View>
            </GestureDetector>

            {/* Dots */}
            {dreams.length > 1 && (
              <View className="flex-row justify-center gap-2 mt-3">
                {dreams.map((_, i) => (
                  <View key={i} style={[s.dot, i === activeIndex && s.dotActive]} />
                ))}
              </View>
            )}

            {/* Prompt preview */}
            <ScrollView className="max-h-16 mx-6 mt-3" showsVerticalScrollIndicator={false}>
              <Text className="text-gray-500 text-xs leading-4">
                {activeDream.prompt.slice(0, 300)}
              </Text>
            </ScrollView>
          </>
        )}
      </View>

      {/* Footer */}
      {dreams.length > 0 && (
        <View className="px-5 pb-10 gap-2">
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 items-center justify-center rounded-2xl py-4"
              style={{ backgroundColor: colors.accent }}
              onPress={generateDream}
              disabled={generating}
              activeOpacity={0.7}
            >
              <Text className="text-white text-base font-bold">Dream Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center justify-center rounded-2xl py-4"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.accentBorder,
              }}
              onPress={async () => {
                if (!user || !activeDream) return;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                try {
                  await saveDream({
                    userId: user.id,
                    tempImageUrl: activeDream.url,
                    prompt: activeDream.prompt,
                    visibility: 'private',
                    dreamMedium: activeDream.medium,
                    dreamVibe: activeDream.vibe,
                  });
                  Toast.show('Dream saved!', 'checkmark-circle');
                } catch {
                  Toast.show('Failed to save', 'close-circle');
                }
              }}
              disabled={generating}
              activeOpacity={0.7}
            >
              <Text className="text-white text-base font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Fullscreen modal */}
      <Modal visible={!!fullscreenUrl} transparent animationType="fade" statusBarTranslucent>
        <StatusBar hidden />
        <TouchableOpacity
          style={s.fullscreenBackdrop}
          onPress={() => setFullscreenUrl(null)}
          activeOpacity={1}
        >
          <GestureDetector gesture={fsPinch}>
            <Animated.View style={[{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }, fsZoomStyle]}>
              {fullscreenUrl && (
                <Image
                  source={{ uri: fullscreenUrl }}
                  style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
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
  fullscreenBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
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
