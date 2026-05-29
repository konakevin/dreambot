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
import { useAuthStore } from '@/store/auth';
import { useDreamStore } from '@/store/dream';
import { saveDream } from '@/lib/dreamSave';
import { Toast } from '@/components/Toast';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DreamRevealScreen() {
  const user = useAuthStore((s) => s.user);
  const result = useDreamStore((s) => s.result);
  const clearResult = useDreamStore((s) => s.clearResult);
  const reset = useDreamStore((s) => s.reset);

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
      // Save as private first, then route to New Post screen for description + publish
      const { uploadId, imageUrl } = await saveDream({
        userId: user.id,
        tempImageUrl: result!.imageUrl,
        prompt: result!.prompt,
        aiConcept: result!.aiConcept,
        dreamMedium: result!.resolvedMedium,
        dreamVibe: result!.resolvedVibe,
        existingUploadId: result!.uploadId ?? undefined,
      });

      queryClient.invalidateQueries({ queryKey: ['my-dreams'] });
      // Push (not replace) so Cancel from New Post returns here
      router.push(`/dream/newPost?uploadId=${uploadId}&imageUrl=${encodeURIComponent(imageUrl)}`);
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
      router.back();
    } catch (err) {
      if (__DEV__) console.error('[Reveal] Skip error:', err);
      Toast.show('Failed to save dream', 'close-circle');
      setSaving(false);
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

      {/* Bottom actions */}
      <View style={[s.actions, { paddingBottom: insets.bottom + 16 }]}>
        {saving ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
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
    marginBottom: 4,
  },
  savedHintText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  primaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    paddingVertical: 15,
    borderRadius: 26,
    backgroundColor: colors.accent,
  },
  primaryPillText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  skipButton: { paddingVertical: 10, alignItems: 'center' },
  skipText: { color: 'rgba(255,255,255,0.65)', fontSize: 15, fontWeight: '600' },
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
});
