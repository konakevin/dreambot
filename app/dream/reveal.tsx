/**
 * Reveal Screen — full-screen dream reveal with glassmorphic action overlay.
 *
 * The image fills the entire screen (like a feed card). Actions float
 * over the bottom with a subtle gradient backdrop.
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { DREAM_MEDIUMS, DREAM_VIBES } from '@/constants/dreamEngine';
import { useAuthStore } from '@/store/auth';
import { useDreamStore } from '@/store/dream';
import { saveDream, pinToFeed } from '@/lib/dreamSave';
import { Toast } from '@/components/Toast';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DreamRevealScreen() {
  const user = useAuthStore((s) => s.user);
  const result = useDreamStore((s) => s.result);
  const config = useDreamStore((s) => s.config);
  const clearResult = useDreamStore((s) => s.clearResult);
  const reset = useDreamStore((s) => s.reset);

  const mediumKey = result?.resolvedMedium ?? config.selectedMedium;
  const vibeKey = result?.resolvedVibe ?? config.selectedVibe;
  const mediumLabel = DREAM_MEDIUMS.find((m) => m.key === mediumKey)?.label ?? mediumKey;
  const vibeLabel = DREAM_VIBES.find((v) => v.key === vibeKey)?.label ?? vibeKey;
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);

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

  async function handlePost() {
    if (!user || saving) return;
    setSaving(true);
    try {
      const { uploadId, imageUrl } = await saveDream({
        userId: user.id,
        tempImageUrl: result!.imageUrl,
        prompt: result!.prompt,
        aiConcept: result!.aiConcept,
        visibility: 'public',
        dreamMedium: result!.resolvedMedium,
        dreamVibe: result!.resolvedVibe,
      });

      pinToFeed({
        id: uploadId,
        userId: user.id,
        imageUrl,
        username: user.user_metadata?.username ?? '',
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      });

      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Posted to your profile', 'checkmark-circle');

      clearResult();
      router.back();
    } catch (err) {
      if (__DEV__) console.error('[Reveal] Post error:', err);
      Toast.show('Failed to post dream', 'close-circle');
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!user || saving) return;
    setSaving(true);
    try {
      await saveDream({
        userId: user.id,
        tempImageUrl: result!.imageUrl,
        prompt: result!.prompt,
        aiConcept: result!.aiConcept,
        visibility: 'private',
        dreamMedium: result!.resolvedMedium,
        dreamVibe: result!.resolvedVibe,
      });

      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show('Saved to My Dreams', 'checkmark-circle');

      clearResult();
      router.back();
    } catch (err) {
      if (__DEV__) console.error('[Reveal] Save error:', err);
      Toast.show('Failed to save dream', 'close-circle');
      setSaving(false);
    }
  }

  function handleDiscard() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearResult();
    router.back();
  }

  async function handleShare() {
    try {
      await Share.share({ url: result!.imageUrl });
    } catch {
      // user cancelled
    }
  }

  return (
    <View style={s.container}>
      {/* Full-bleed image */}
      <Image
        source={{ uri: result.imageUrl }}
        style={s.fullImage}
        contentFit="cover"
        transition={600}
      />

      {/* Bottom gradient for readability */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
        locations={[0, 0.4, 1]}
        style={s.bottomGradient}
        pointerEvents="none"
      />

      {/* Top-right share button */}
      <TouchableOpacity
        style={[s.shareBtn, { top: insets.top + 12 }]}
        onPress={handleShare}
        activeOpacity={0.7}
      >
        <Ionicons name="share-outline" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Medium + Vibe labels */}
      <View style={[s.labels, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={s.labelMedium}>{mediumLabel}</Text>
        <Text style={s.labelVibe}>{vibeLabel}</Text>
      </View>

      {/* Bottom actions */}
      <View style={[s.actions, { paddingBottom: insets.bottom + 16 }]}>
        {saving ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <TouchableOpacity style={s.postBtn} onPress={handlePost} activeOpacity={0.85}>
              <Ionicons name="globe-outline" size={18} color="#fff" />
              <Text style={s.postBtnText}>Post to Profile</Text>
            </TouchableOpacity>

            <View style={s.secondaryRow}>
              <TouchableOpacity style={s.glassPill} onPress={handleSave} activeOpacity={0.85}>
                <Ionicons name="bookmark-outline" size={16} color="#fff" />
                <Text style={s.glassPillText}>Save to Dreams</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.glassPill} onPress={handleDiscard} activeOpacity={0.85}>
                <Ionicons name="close" size={16} color="rgba(255,255,255,0.6)" />
                <Text style={s.discardText}>Discard</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
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
    fontSize: 16,
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
  shareBtn: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labels: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    gap: 2,
    marginBottom: 160,
  },
  labelMedium: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  labelVibe: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
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
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 28,
    backgroundColor: colors.accent,
  },
  postBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  glassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  glassPillText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  discardText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
});
