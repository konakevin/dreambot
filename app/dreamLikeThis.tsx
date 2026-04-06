/**
 * Dream Like This — apply the medium + vibe from a reference post
 * to the user's own photo or prompt.
 *
 * Medium and vibe are inherited from the reference post (locked).
 * The user can upload a photo (Restyle/Reimagine) or enter a text prompt.
 * Uses the exact same engine paths as the Create flow.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useDreamStore } from '@/store/dream';
import type { PhotoStyle } from '@/store/dream';
import { DREAM_MEDIUMS, DREAM_VIBES } from '@/constants/dreamEngine';
import { colors } from '@/constants/theme';
import { Toast } from '@/components/Toast';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { formatCompact } from '@/lib/formatNumber';

export default function DreamLikeThisScreen() {
  const params = useLocalSearchParams<{
    postId: string;
    imageUrl?: string;
    username?: string;
    userId?: string;
  }>();

  const user = useAuthStore((s) => s.user);
  const { data: sparkleBalance = 0 } = useSparkleBalance();
  const reset = useDreamStore((s) => s.reset);
  const setMode = useDreamStore((s) => s.setMode);
  const setPhoto = useDreamStore((s) => s.setPhoto);
  const setPhotoStyle = useDreamStore((s) => s.setPhotoStyle);
  const setMedium = useDreamStore((s) => s.setMedium);
  const setVibe = useDreamStore((s) => s.setVibe);
  const setPrompt = useDreamStore((s) => s.setPrompt);

  // Reference post data
  const [refMedium, setRefMedium] = useState<string | null>(null);
  const [refVibe, setRefVibe] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // User's choices
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoStyle, setLocalPhotoStyle] = useState<PhotoStyle>('restyle');
  const [userPrompt, setUserPrompt] = useState('');
  const [kbOpen, setKbOpen] = useState(false);
  const promptRef = useRef<TextInput>(null);

  // Fetch the reference post's medium and vibe
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('uploads')
        .select('dream_medium, dream_vibe')
        .eq('id', params.postId)
        .single();
      const row = data as unknown as Record<string, unknown> | null;
      if (row) {
        setRefMedium((row.dream_medium as string) ?? null);
        setRefVibe((row.dream_vibe as string) ?? null);
      }
      setLoading(false);
    })();
  }, [params.postId]);

  useEffect(() => {
    const s1 = Keyboard.addListener('keyboardWillShow', () => {
      LayoutAnimation.configureNext({
        duration: 250,
        update: { type: LayoutAnimation.Types.easeInEaseOut },
      });
      setKbOpen(true);
    });
    const s2 = Keyboard.addListener('keyboardWillHide', () => {
      LayoutAnimation.configureNext({
        duration: 250,
        update: { type: LayoutAnimation.Types.easeInEaseOut },
      });
      setKbOpen(false);
    });
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

  const mediumLabel =
    DREAM_MEDIUMS.find((m) => m.key === refMedium)?.label ?? refMedium ?? 'Unknown';
  const vibeLabel = DREAM_VIBES.find((v) => v.key === refVibe)?.label ?? refVibe ?? 'Unknown';
  const hasPhoto = !!photoUri;
  const needsPrompt = hasPhoto && photoStyle === 'reimagine' && !userPrompt.trim();

  async function handlePickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const w = asset.width;
    const h = asset.height;
    const targetRatio = 9 / 16;
    const currentRatio = w / h;
    let cropAction: ImageManipulator.Action;

    if (currentRatio > targetRatio) {
      const newW = Math.round(h * targetRatio);
      cropAction = {
        crop: { originX: Math.round((w - newW) / 2), originY: 0, width: newW, height: h },
      };
    } else {
      const newH = Math.round(w / targetRatio);
      cropAction = {
        crop: { originX: 0, originY: Math.round((h - newH) / 2), width: w, height: newH },
      };
    }

    const cropped = await ImageManipulator.manipulateAsync(asset.uri, [cropAction], {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    });

    if (!cropped.base64) {
      Toast.show('Could not process photo', 'close-circle');
      return;
    }

    setPhotoUri(cropped.uri);
    setPhotoBase64(cropped.base64);
  }

  function clearPhoto() {
    setPhotoUri(null);
    setPhotoBase64(null);
  }

  function handleDream() {
    if (needsPrompt || !refMedium) return;
    Keyboard.dismiss();

    // Set up the dream store with inherited medium/vibe
    reset();
    if (photoBase64 && photoUri) {
      setPhoto(photoBase64, photoUri);
      setPhotoStyle(photoStyle);
    } else {
      setMode('prompt');
    }
    setMedium(refMedium);
    setVibe(refVibe ?? 'surprise_me');
    setPrompt(hasPhoto && photoStyle === 'restyle' ? '' : userPrompt.trim());

    // Navigate to Loading → Reveal (same as Create flow)
    router.push('/dream/loading');
  }

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <ActivityIndicator size="large" color={colors.accent} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Dream Like This</Text>
          <TouchableOpacity onPress={() => router.push('/sparkleStore')} style={s.sparklePill}>
            <Ionicons name="sparkles" size={14} color={colors.accent} />
            <Text style={s.sparkleText}>{formatCompact(sparkleBalance)}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={s.flex}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Reference post + arrow + user photo */}
          <View style={s.previewRow}>
            <View style={s.previewCard}>
              <Image source={{ uri: params.imageUrl }} style={s.previewImage} contentFit="cover" />
              <Text style={s.previewLabel}>Original</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color={colors.textMuted} />
            <TouchableOpacity style={s.previewCard} onPress={handlePickPhoto} activeOpacity={0.7}>
              {hasPhoto ? (
                <>
                  <Image source={{ uri: photoUri! }} style={s.previewImage} contentFit="cover" />
                  <TouchableOpacity style={s.clearPhoto} onPress={clearPhoto}>
                    <Ionicons name="close-circle" size={20} color="#fff" />
                  </TouchableOpacity>
                  <Text style={s.previewLabel}>Your Photo</Text>
                </>
              ) : (
                <View style={s.addPhoto}>
                  <Ionicons name="camera-outline" size={28} color={colors.textSecondary} />
                  <Text style={s.addPhotoText}>Add Photo</Text>
                  <Text style={s.addPhotoSub}>or enter a prompt below</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Locked medium + vibe display */}
          <View style={s.lockedRow}>
            <View style={s.lockedPill}>
              <Ionicons name="color-palette-outline" size={14} color={colors.accent} />
              <Text style={s.lockedText}>{mediumLabel}</Text>
            </View>
            <View style={s.lockedPill}>
              <Ionicons name="sparkles-outline" size={14} color={colors.accent} />
              <Text style={s.lockedText}>{vibeLabel}</Text>
            </View>
          </View>

          {/* Photo style toggle */}
          {hasPhoto && (
            <View style={s.styleToggle}>
              <TouchableOpacity
                style={[s.styleOption, photoStyle === 'restyle' && s.styleOptionActive]}
                onPress={() => setLocalPhotoStyle('restyle')}
                activeOpacity={0.7}
              >
                <Text style={[s.styleLabel, photoStyle === 'restyle' && s.styleLabelActive]}>
                  Restyle
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.styleOption, photoStyle === 'reimagine' && s.styleOptionActive]}
                onPress={() => setLocalPhotoStyle('reimagine')}
                activeOpacity={0.7}
              >
                <Text style={[s.styleLabel, photoStyle === 'reimagine' && s.styleLabelActive]}>
                  Reimagine
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Prompt input — show for text dreams or reimagine */}
          {(!hasPhoto || photoStyle === 'reimagine') && (
            <View style={s.promptWrap}>
              <TextInput
                ref={promptRef}
                style={s.promptInput}
                placeholder={hasPhoto ? 'Describe the new scenario...' : 'Describe your dream...'}
                placeholderTextColor={colors.textMuted}
                value={userPrompt}
                onChangeText={setUserPrompt}
                maxLength={300}
                multiline
              />
              {userPrompt.length > 0 && (
                <TouchableOpacity
                  onPress={() => setUserPrompt('')}
                  hitSlop={8}
                  style={s.promptClear}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={s.footer}>
          <TouchableOpacity
            style={[s.dreamBtn, needsPrompt && s.dreamBtnDisabled]}
            onPress={handleDream}
            activeOpacity={needsPrompt ? 1 : 0.8}
          >
            <Ionicons
              name="sparkles"
              size={18}
              color={needsPrompt ? 'rgba(255,255,255,0.4)' : '#fff'}
            />
            <Text style={[s.dreamBtnText, needsPrompt && s.dreamBtnTextDisabled]}>
              {needsPrompt ? 'Enter a scenario' : 'Dream'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  sparklePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sparkleText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16, gap: 16 },

  // Preview row
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewCard: {
    flex: 1,
    aspectRatio: 9 / 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    maxHeight: 200,
  },
  previewImage: { width: '100%', height: '100%' },
  previewLabel: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  clearPhoto: { position: 'absolute', top: 6, right: 6 },
  addPhoto: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addPhotoText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  addPhotoSub: { color: colors.textMuted, fontSize: 10 },

  // Locked medium/vibe
  lockedRow: { flexDirection: 'row', gap: 8 },
  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  lockedText: { color: colors.accent, fontSize: 13, fontWeight: '600' },

  // Photo style toggle
  styleToggle: { flexDirection: 'row', gap: 10 },
  styleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  styleOptionActive: { borderColor: colors.accent },
  styleLabel: { color: colors.textSecondary, fontSize: 14, fontWeight: '700' },
  styleLabelActive: { color: colors.accent },

  // Prompt
  promptWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 56,
  },
  promptInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    maxHeight: 100,
  },
  promptClear: { paddingTop: 2, paddingLeft: 8 },

  // Footer
  footer: { paddingHorizontal: 24, paddingVertical: 12, paddingBottom: 24 },
  dreamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.accent,
  },
  dreamBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  dreamBtnDisabled: { backgroundColor: colors.surface },
  dreamBtnTextDisabled: { color: 'rgba(255,255,255,0.4)' },
});
