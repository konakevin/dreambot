/**
 * Reveal Screen — full-screen dream reveal with glassmorphic action overlay.
 *
 * The image fills the entire screen (like a feed card). Actions float
 * over the bottom with a subtle gradient backdrop.
 */

import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Text } from '@/components/AppText';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { runOnJS, FadeIn, FadeOut } from 'react-native-reanimated';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCardGestures } from '@/hooks/gestures/useCardGestures';
import { colors, ui } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useAuthStore } from '@/store/auth';
import { useDreamStore } from '@/store/dream';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { saveDream } from '@/lib/dreamSave';
import { clearDreamInFlight } from '@/lib/dreamInFlightMarker';
import { syncDreamWidget } from '@/lib/widgetSync';
import { Toast } from '@/components/Toast';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DreamRevealScreen() {
  const user = useAuthStore((s) => s.user);
  const result = useDreamStore((s) => s.result);
  const config = useDreamStore((s) => s.config);
  const clearResult = useDreamStore((s) => s.clearResult);
  const reset = useDreamStore((s) => s.reset);
  const { data: dbMediums } = useDreamMediums();
  const { data: dbVibes } = useDreamVibes();

  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);
  // Tap the image hides/shows the HUD (Post/Skip chrome). The top-right expand
  // icon toggles the full-dimension preview (whole, non-clipped contain image).
  const [preview, setPreview] = useState(false);
  const [hudVisible, setHudVisible] = useState(true);

  // Pinch-to-zoom (focal-aware) + two-finger pan while zoomed, springing back
  // to identity on release — same Instagram-peek behavior as the feed / photo
  // detail. Swipe-left-to-profile is off; there's no author to navigate to on
  // an unposted reveal.
  const { gesture, imageTransformStyle } = useCardGestures({ disableSwipeLeft: true });

  // Single tap toggles the HUD. Composed Exclusive with the card gesture so a
  // real pinch/pan still wins; a clean one-finger tap falls through to this.
  function toggleHud() {
    Haptics.selectionAsync();
    setHudVisible((v) => !v);
  }
  const tapToggleHud = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      runOnJS(toggleHud)();
    });
  const imageGesture = Gesture.Exclusive(gesture, tapToggleHud);

  // Expand icon → toggle the full-dimension preview.
  function togglePreview() {
    Haptics.selectionAsync();
    setPreview((p) => !p);
  }

  // Reaching reveal means the user has seen this render (normal flow OR a
  // cold-start resume) — drop the in-flight marker so the next launch won't
  // re-pop it. Also rotate the fresh dream onto the iOS Home Screen widget
  // (self-guarded no-op on Android / binaries without the widget module).
  useEffect(() => {
    void clearDreamInFlight();
    void syncDreamWidget();
  }, []);

  if (!result) {
    return (
      <View style={s.container}>
        <View style={s.center}>
          <Text style={s.emptyText}>No dream to show</Text>
          <TouchableOpacity
            style={s.glassPill}
            onPress={() => {
              reset();
              router.replace('/(tabs)/create');
            }}
          >
            <Text style={s.glassPillText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Dream badge — reinforce what they just dreamed (medium · vibe) on EVERY
  // reveal, not only surprises. When an axis WAS a Surprise Me roll, a "Surprise
  // Me ·" eyebrow is prefixed so the leave-it-to-chance payoff still reads.
  // Creator-only by nature (their own reveal).
  const prettify = (k: string) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const mediumWasSurprise =
    config.selectedMedium === 'surprise_me' ||
    config.selectedMedium === 'surprise_me_face' ||
    config.selectedMedium === 'surprise_me_art';
  const vibeWasSurprise = config.selectedVibe === 'surprise_me';
  const wasSurprise = mediumWasSurprise || vibeWasSurprise;
  const badgeParts: string[] = [];
  if (result.resolvedMedium) {
    badgeParts.push(
      dbMediums?.find((m) => m.key === result.resolvedMedium)?.label ??
        prettify(result.resolvedMedium)
    );
  }
  if (result.resolvedVibe) {
    badgeParts.push(
      dbVibes?.find((v) => v.key === result.resolvedVibe)?.label ?? prettify(result.resolvedVibe)
    );
  }
  const dreamBadge = badgeParts.join(' · ');

  async function handlePost() {
    if (!user || saving) return;
    setSaving(true);
    try {
      // Save as private first, then route to New Post screen for description + publish
      const { uploadId } = await saveDream({
        userId: user.id,
        tempImageUrl: result!.imageUrl,
        prompt: result!.prompt,
        aiConcept: result!.aiConcept,
        dreamMedium: result!.resolvedMedium,
        dreamVibe: result!.resolvedVibe,
        existingUploadId: result!.uploadId ?? undefined,
      });

      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      // Push (not replace) so Cancel from New Post returns here. This dream is
      // preselected in the unified compose (Add more → gallery).
      router.push(`/post/new?ids=${uploadId}`);
      setSaving(false);
    } catch (err) {
      if (__DEV__) console.error('[Reveal] Post error:', err);
      Toast.show('Failed to save dream', 'close-circle');
      setSaving(false);
    }
  }

  // "Skip" — the dream is already saved to the album (Edge Function persisted a
  // private draft at generation, or we insert one here as a fallback). Skipping
  // just dismisses without posting publicly; nothing is lost.
  async function handleSkip() {
    if (!user || saving) return;
    setSaving(true);
    try {
      // Edge Function already created a private draft — only insert if no existing upload
      if (!result!.uploadId) {
        await saveDream({
          userId: user.id,
          tempImageUrl: result!.imageUrl,
          prompt: result!.prompt,
          aiConcept: result!.aiConcept,
          dreamMedium: result!.resolvedMedium,
          dreamVibe: result!.resolvedVibe,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Saved to your dreams', 'checkmark-circle');

      clearResult();
      // Return to where the dream started. DLT dreams were pushed from a post
      // (Dream-Like-This), so pop back to it; a normal Create dream should land
      // back on the Create tab, NOT dumped on the home feed (router.back() lands
      // on whatever tab was last active). Mirrors the loading screen's Queue nav.
      const fromDlt = config.dltRecipe !== null || config.stylePrompt !== null;
      if (fromDlt) {
        router.back();
      } else {
        router.replace('/(tabs)/create');
      }
    } catch (err) {
      if (__DEV__) console.error('[Reveal] Skip error:', err);
      Toast.show('Failed to save dream', 'close-circle');
      setSaving(false);
    }
  }

  return (
    <View style={s.container}>
      {/* Full-bleed image — pinch to zoom + drag; single tap → HUD-free full
          preview. The detector rides an UNTRANSFORMED wrapper (the zoom
          transform lives on the inner view) so the pinch's focal coords stay
          in screen space while the image scales under the fingers. */}
      <GestureDetector gesture={imageGesture}>
        <View style={s.fullImage}>
          <Animated.View style={[StyleSheet.absoluteFill, imageTransformStyle]}>
            <Image
              source={{ uri: result.imageUrl }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={600}
              cachePolicy="memory-disk"
            />
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Expand icon (top-right) — toggles the full-dimension preview. Same
          icon + treatment as the feed cards. Persistent (not part of the HUD)
          so it's reachable whether the HUD is shown or hidden. */}
      {!preview && (
        <TouchableOpacity
          style={[ui.sideButton, s.expandBtn, { top: insets.top + verticalScale(8) }]}
          onPress={togglePreview}
          hitSlop={12}
          activeOpacity={0.7}
        >
          <Ionicons name="scan-outline" size={28} color="#FFFFFF" style={ui.sideIcon} />
        </TouchableOpacity>
      )}

      {/* HUD — bottom gradient + actions. Tap the image to hide / show. */}
      {hudVisible && (
        <Animated.View
          style={StyleSheet.absoluteFill}
          pointerEvents="box-none"
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.4, 1]}
            style={s.bottomGradient}
            pointerEvents="none"
          />
          <View style={[s.actions, { paddingBottom: insets.bottom + 16 }]}>
            {saving ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <>
                {dreamBadge ? (
                  <View style={s.surpriseChip}>
                    <Ionicons name="sparkles" size={13} color={colors.accentLight} />
                    <Text style={s.surpriseChipText}>
                      {wasSurprise ? (
                        <Text style={s.surpriseChipEyebrow}>Surprise Me · </Text>
                      ) : null}
                      {dreamBadge}
                    </Text>
                  </View>
                ) : null}
                <View style={s.savedRow}>
                  <Ionicons name="checkmark-circle" size={14} color="rgba(255,255,255,0.7)" />
                  <Text style={s.savedHintText}>Saved to your dreams</Text>
                </View>
                <TouchableOpacity style={s.primaryPill} onPress={handlePost} activeOpacity={0.85}>
                  <Ionicons name="globe-outline" size={17} color="#fff" />
                  <Text style={s.primaryPillText}>Post to my feed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.skipButton} onPress={handleSkip} activeOpacity={0.7}>
                  <Text style={s.skipText}>Skip</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      )}

      {/* Full-dimension preview — opened/closed ONLY by the expand icon. Whole,
          non-clipped image (contentFit:contain); crossfades in over the reveal
          (no black flash), image from memory cache so it's instant. */}
      {preview && (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(150)}
          style={s.previewLayer}
        >
          <Image
            source={{ uri: result.imageUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <TouchableOpacity
            style={[ui.sideButton, s.expandBtn, { top: insets.top + verticalScale(8) }]}
            onPress={togglePreview}
            hitSlop={12}
            activeOpacity={0.7}
          >
            <Ionicons name="scan-outline" size={28} color="#FFFFFF" style={ui.sideIcon} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontScale(16),
  },
  fullImage: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.4,
  },
  actions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    gap: 12,
    alignItems: 'center',
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: verticalScale(4),
  },
  surpriseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: verticalScale(7),
    borderRadius: 20,
    // Dark translucent (was white 0.14) so the text stays legible over light
    // renders too — a white chip vanished on a beige image (Kevin 2026-07-23).
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.16)',
    marginBottom: verticalScale(6),
  },
  surpriseChipText: {
    color: '#fff',
    fontSize: fontScale(13),
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Brighter + on-brand (was a dim 0.7 white that got lost). accentLight reads
  // clearly on the dark chip and marks the Surprise Me roll.
  surpriseChipEyebrow: { color: colors.accentLight, fontWeight: '700' },
  savedHintText: { color: 'rgba(255,255,255,0.7)', fontSize: fontScale(13), fontWeight: '600' },
  primaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    paddingVertical: verticalScale(15),
    borderRadius: 26,
    backgroundColor: colors.accent,
  },
  primaryPillText: { color: '#fff', fontSize: fontScale(16), fontWeight: '700' },
  skipButton: { paddingVertical: verticalScale(10), alignItems: 'center' },
  skipText: { color: 'rgba(255,255,255,0.65)', fontSize: fontScale(15), fontWeight: '600' },
  glassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: verticalScale(11),
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  glassPillText: {
    color: '#fff',
    fontSize: fontScale(14),
    fontWeight: '600',
  },
  // Full-frame HUD-free preview layer (sits above the reveal HUD).
  previewLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 20,
  },
  // Expand icon (top-right) — matches the feed card's button (ui.sideButton +
  // ui.sideIcon, scan-outline); this only adds position.
  expandBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 30,
  },
});
