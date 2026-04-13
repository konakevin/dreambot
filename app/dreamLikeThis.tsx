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
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useLocalSearchParams, router } from 'expo-router';
import { ScreenLayout } from '@/components/ScreenLayout';
import { vs } from '@/lib/responsive';
import { supabase } from '@/lib/supabase';
import * as nav from '@/lib/navigate';
import { useAuthStore } from '@/store/auth';
import { useDreamStore } from '@/store/dream';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
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
    prompt?: string;
  }>();

  const user = useAuthStore((s) => s.user);
  const { data: sparkleBalance = 0 } = useSparkleBalance();
  const { data: dbMediums = [] } = useDreamMediums();
  const { data: dbVibes = [] } = useDreamVibes();
  const reset = useDreamStore((s) => s.reset);
  const setMode = useDreamStore((s) => s.setMode);
  const setPhoto = useDreamStore((s) => s.setPhoto);
  const setPhotoStyle = useDreamStore((s) => s.setPhotoStyle);
  const setMedium = useDreamStore((s) => s.setMedium);
  const setVibe = useDreamStore((s) => s.setVibe);
  const setPrompt = useDreamStore((s) => s.setPrompt);
  const setStylePrompt = useDreamStore((s) => s.setStylePrompt);

  // Reference post data
  const [refMedium, setRefMedium] = useState<string | null>(null);
  const [refVibe, setRefVibe] = useState<string | null>(null);
  const [refPrompt, setRefPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // User's choices
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [kbOpen, setKbOpen] = useState(false);
  const pickerOpenRef = useRef(false);
  const promptRef = useRef<TextInput>(null);

  // Fetch the reference post's medium and vibe
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('uploads')
        .select('dream_medium, dream_vibe, ai_prompt')
        .eq('id', params.postId)
        .single();
      const row = data as unknown as Record<string, unknown> | null;
      if (row) {
        setRefMedium((row.dream_medium as string) ?? null);
        setRefVibe((row.dream_vibe as string) ?? null);
        setRefPrompt(params.prompt ?? (row.ai_prompt as string) ?? null);
      }
      setLoading(false);
    })();
  }, [params.postId]);

  // Keyboard tracking — delay state update until after keyboard animation
  useEffect(() => {
    const s1 = Keyboard.addListener('keyboardDidShow', () => {
      InteractionManager.runAfterInteractions(() => setKbOpen(true));
    });
    const s2 = Keyboard.addListener('keyboardDidHide', () => {
      if (pickerOpenRef.current) return;
      InteractionManager.runAfterInteractions(() => setKbOpen(false));
    });
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

  const refMediumRow = dbMediums.find((m) => m.key === refMedium);
  const mediumLabel = refMediumRow?.label ?? refMedium ?? 'Unknown';
  const vibeLabel = dbVibes.find((v) => v.key === refVibe)?.label ?? refVibe ?? 'Unknown';
  const hasPhoto = !!photoUri;
  const hasPrompt = userPrompt.trim().length > 0;
  const mediumFaceSwaps = refMediumRow?.face_swaps ?? true;
  // Face is involved if photo + prompt (reimagine path)
  const faceInvolved = hasPhoto && hasPrompt;

  async function handlePickPhoto() {
    pickerOpenRef.current = true;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.[0]) {
      pickerOpenRef.current = false;
      return;
    }

    // Keep original aspect ratio for preview. 9:16 crop happens before API call.
    const asset = result.assets[0];
    const compressed = await ImageManipulator.manipulateAsync(asset.uri, [], {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    });

    if (!compressed.base64) {
      Toast.show('Could not process photo', 'close-circle');
      return;
    }

    pickerOpenRef.current = false;
    setPhotoUri(compressed.uri);
    setPhotoBase64(compressed.base64);
  }

  function clearPhoto() {
    setPhotoUri(null);
    setPhotoBase64(null);
  }

  function handleDream() {
    if (!refMedium) return;
    Keyboard.dismiss();

    // DLT with style reference = always reimagine (flux-dev + face swap) so style actually transfers
    // Without style ref: prompt entered = reimagine, no prompt = restyle
    const effectivePhotoStyle = refPrompt
      ? 'reimagine'
      : userPrompt.trim()
        ? 'reimagine'
        : 'restyle';

    // Set up the dream store with inherited medium/vibe
    reset();
    if (photoBase64 && photoUri) {
      setPhoto(photoBase64, photoUri);
      setPhotoStyle(effectivePhotoStyle);
    } else {
      setMode('prompt');
    }
    setMedium(refMedium);
    setVibe(refVibe ?? 'surprise_me');
    setPrompt(userPrompt.trim());
    setStylePrompt(refPrompt);

    // Navigate to Loading → Reveal (same as Create flow)
    nav.push('/dream/loading');
  }

  if (loading) {
    return (
      <ScreenLayout header="back" title="Dream Like This">
        <ActivityIndicator size="large" color={colors.accent} style={{ flex: 1 }} />
      </ScreenLayout>
    );
  }

  const sparklePill = (
    <TouchableOpacity
      onPress={() => nav.push('/sparkleStore')}
      style={[s.sparklePill, { zIndex: 1 }]}
    >
      <Ionicons name="sparkles" size={14} color={colors.accent} />
      <Text style={s.sparkleText}>{formatCompact(sparkleBalance)}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout header="back" title="Dream Like This" rightAction={sparklePill}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={s.flex}
          contentContainerStyle={[
            s.scrollContent,
            !hasPhoto && kbOpen && { gap: 4, paddingBottom: 2, flexGrow: 1 },
          ]}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
          showsVerticalScrollIndicator={false}
        >
          {/* Preview area */}
          {hasPhoto ? (
            <View style={s.previewRow}>
              <View style={[s.previewCard, s.previewCardDuo]}>
                <Image
                  source={{ uri: params.imageUrl }}
                  style={s.previewImage}
                  contentFit="cover"
                />
                <Text style={s.previewLabel}>Original</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color={colors.textMuted} />
              <View style={[s.previewCard, s.previewCardDuo]}>
                <Image source={{ uri: photoUri! }} style={s.previewImage} contentFit="cover" />
                <TouchableOpacity style={s.clearPhoto} onPress={clearPhoto} hitSlop={8}>
                  <View style={s.clearPhotoCircle}>
                    <Ionicons name="close" size={14} color="#fff" />
                  </View>
                </TouchableOpacity>
                <Text style={s.previewLabel}>Your Photo</Text>
              </View>
            </View>
          ) : (
            <View style={[s.previewRow, kbOpen && { justifyContent: 'center' }]}>
              <View style={[s.previewCard, kbOpen && s.previewCardSmall]}>
                <Image
                  source={{ uri: params.imageUrl }}
                  style={s.previewImage}
                  contentFit="cover"
                />
                <TouchableOpacity
                  style={s.cameraBadge}
                  onPress={handlePickPhoto}
                  activeOpacity={0.7}
                >
                  <Ionicons name="camera-outline" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Spacer — pushes text/prompt to bottom when keyboard open (single image only) */}
          {!hasPhoto && kbOpen && <View style={{ flex: 1 }} />}

          {/* Style info */}
          <View style={s.styleInfo}>
            <Text style={s.styleInfoTitle}>Dream in this style</Text>
            <Text style={s.styleInfoLine}>Medium: {mediumLabel}</Text>
            <Text style={s.styleInfoLine}>Vibe: {vibeLabel}</Text>
          </View>

          {/* Prompt input — always visible */}
          <View style={s.promptWrap}>
            <TextInput
              ref={promptRef}
              style={s.promptInput}
              placeholder={
                hasPhoto
                  ? 'Describe a scene — your likeness will be woven in...'
                  : 'Describe your dream, or tap the camera to upload a photo...'
              }
              placeholderTextColor={colors.textMuted}
              value={userPrompt}
              onChangeText={setUserPrompt}
              maxLength={300}
              multiline
            />
            {userPrompt.length > 0 && (
              <TouchableOpacity onPress={() => setUserPrompt('')} hitSlop={8} style={s.promptClear}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          {faceInvolved && (
            <View style={s.likenessHint}>
              <Ionicons name="information-circle" size={14} color={colors.accent} />
              <Text style={s.likenessHintText}>
                {mediumFaceSwaps
                  ? 'Your face will be added into the dream.'
                  : "This medium can't use your face — you'll be drawn from your Cast description."}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={[s.footer, !hasPhoto && kbOpen && { paddingBottom: 6, paddingVertical: 4 }]}>
          <TouchableOpacity style={s.dreamBtn} onPress={handleDream} activeOpacity={0.8}>
            <Ionicons name="sparkles" size={18} color="#fff" />
            <Text style={s.dreamBtnText}>Dream</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
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
    paddingVertical: 8,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
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
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },

  // Preview row
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  previewCard: {
    flex: 1,
    aspectRatio: 9 / 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    maxHeight: vs(280),
  },
  previewCardDuo: {
    maxHeight: vs(200),
    maxWidth: '40%',
  },
  previewCardSmall: {
    flex: 0,
    aspectRatio: 1,
    width: vs(200),
    height: vs(200),
    maxHeight: undefined,
    alignSelf: 'center',
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
  clearPhoto: { position: 'absolute', top: 6, right: 6, zIndex: 2 },
  clearPhotoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Source center (text mode — no photo uploaded)
  sourceCenter: {
    alignItems: 'center',
  },
  sourceThumbnail: {
    aspectRatio: 9 / 16,
    maxHeight: 200,
    borderRadius: 12,
    backgroundColor: colors.surface,
    width: '42%',
  },

  // Style info
  styleInfo: {
    alignItems: 'center',
    gap: 2,
  },
  styleInfoTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  styleInfoLine: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  promptHint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: -8,
  },
  likenessHint: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 6,
    marginTop: -8,
  },
  likenessHintText: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  // Prompt
  promptWrap: {
    flexDirection: 'row',
    alignItems: 'center',
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
  footer: { paddingHorizontal: 24, paddingVertical: 12, paddingBottom: vs(36) },
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
});
