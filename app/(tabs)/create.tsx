/**
 * Create Tab — unified dream creation editor.
 *
 * Single screen: photo zone + medium/vibe selectors + prompt + Dream button.
 * Smart mode detection:
 *   - Photo only → restyle
 *   - Photo + prompt → reimagine
 *   - Prompt only → text dream
 *   - Nothing → Dream button disabled
 */

import { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '@/constants/theme';
import { useDreamStore } from '@/store/dream';
import { MediumVibeSelector } from '@/components/MediumVibeSelector';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { formatCompact } from '@/lib/formatNumber';
import { Toast } from '@/components/Toast';

export default function CreateScreen() {
  const config = useDreamStore((s) => s.config);
  const reset = useDreamStore((s) => s.reset);
  const setPhoto = useDreamStore((s) => s.setPhoto);
  const setPhotoStyle = useDreamStore((s) => s.setPhotoStyle);
  const setMedium = useDreamStore((s) => s.setMedium);
  const setVibe = useDreamStore((s) => s.setVibe);
  const setPrompt = useDreamStore((s) => s.setPrompt);
  const setMode = useDreamStore((s) => s.setMode);
  const { data: sparkleBalance = 0 } = useSparkleBalance();

  const promptRef = useRef<TextInput>(null);
  const hasPhoto = !!config.photoUri;
  const hasPrompt = config.userPrompt.trim().length > 0;
  const canDream = hasPhoto || hasPrompt;

  // Animate photo zone when keyboard opens/closes
  const formSlide = useSharedValue(0);
  const formSlideStyle = useAnimatedStyle(() => ({
    marginTop: formSlide.value,
  }));

  useEffect(() => {
    const s1 = Keyboard.addListener('keyboardWillShow', () => {
      formSlide.value = withTiming(hasPhoto ? -200 : 0, { duration: 250 });
    });
    const s2 = Keyboard.addListener('keyboardWillHide', () => {
      formSlide.value = withTiming(0, { duration: 250 });
    });
    return () => {
      s1.remove();
      s2.remove();
    };
  }, [hasPhoto]);

  // Reset store when the tab mounts fresh
  useEffect(() => {
    reset();
  }, []);

  async function handlePickPhoto() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const w = asset.width;
    const h = asset.height;

    // Center-crop to 9:16 portrait
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

    setPhoto(cropped.base64, cropped.uri);
  }

  function handleClearPhoto() {
    useDreamStore.setState((s) => ({
      config: { ...s.config, photoBase64: null, photoUri: null, mode: 'prompt' },
    }));
  }

  function handleDream() {
    if (!canDream) return;
    Keyboard.dismiss();

    // Auto-detect mode
    if (hasPhoto) {
      setMode('photo');
      setPhotoStyle(hasPrompt ? 'reimagine' : 'restyle');
    } else {
      setMode('prompt');
    }

    router.push('/dream/loading');
  }

  // Hint text
  const hintText = hasPhoto
    ? hasPrompt
      ? 'Your photo will be reimagined in a new scenario'
      : 'Your photo will be restyled — same scene, new art style'
    : hasPrompt
      ? null
      : null;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={s.header}>
          <View style={{ flex: 1 }} />
          <Text style={s.headerTitle}>Create</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => router.push('/sparkleStore')} style={s.sparklePill}>
              <Ionicons name="sparkles" size={14} color={colors.accent} />
              <Text style={s.sparkleText}>{formatCompact(sparkleBalance)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={s.flex}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Photo zone */}
          {hasPhoto ? (
            <View style={s.photoZone}>
              <Image source={{ uri: config.photoUri! }} style={s.photoImage} contentFit="cover" />
              <TouchableOpacity style={s.clearPhoto} onPress={handleClearPhoto} hitSlop={8}>
                <View style={s.clearPhotoCircle}>
                  <Ionicons name="close" size={14} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={s.photoPlaceholder}
              onPress={handlePickPhoto}
              activeOpacity={0.7}
            >
              <View style={s.photoPlaceholderIcon}>
                <Ionicons name="camera-outline" size={28} color={colors.textMuted} />
              </View>
              <Text style={s.photoPlaceholderText}>Add a photo to transform</Text>
              <Text style={s.photoPlaceholderHint}>or just type a prompt below</Text>
            </TouchableOpacity>
          )}

          {/* Form — slides over photo when keyboard opens */}
          <Animated.View style={[s.formSection, formSlideStyle]}>
            {/* Medium + Vibe selectors */}
            <MediumVibeSelector
              selectedMedium={config.selectedMedium}
              selectedVibe={config.selectedVibe}
              onMediumChange={setMedium}
              onVibeChange={setVibe}
            />

            {/* Prompt input */}
            <View style={s.promptWrap}>
              <TextInput
                ref={promptRef}
                style={s.promptInput}
                placeholder={
                  hasPhoto
                    ? 'Add a scenario to reimagine, or leave empty to restyle...'
                    : 'Describe your dream...'
                }
                placeholderTextColor={colors.textMuted}
                value={config.userPrompt}
                onChangeText={setPrompt}
                maxLength={300}
                multiline
              />
              {config.userPrompt.length > 0 && (
                <TouchableOpacity onPress={() => setPrompt('')} hitSlop={8} style={s.promptClear}>
                  <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {hintText && <Text style={s.promptHint}>{hintText}</Text>}
          </Animated.View>
        </ScrollView>

        {/* Fixed footer */}
        <View style={s.footer}>
          <TouchableOpacity
            style={[s.dreamBtn, !canDream && s.dreamBtnDisabled]}
            onPress={handleDream}
            activeOpacity={0.8}
            disabled={!canDream}
          >
            <Ionicons name="sparkles" size={18} color={canDream ? '#fff' : colors.textMuted} />
            <Text style={[s.dreamBtnText, !canDream && s.dreamBtnTextDisabled]}>Dream</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
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

  scrollContent: { paddingHorizontal: 16, paddingBottom: 16, gap: 16 },

  // Photo zone — uploaded
  photoZone: {
    alignSelf: 'center',
    width: '60%',
    aspectRatio: 9 / 16,
    maxHeight: 260,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  photoImage: { width: '100%', height: '100%' },
  clearPhoto: { position: 'absolute', top: 8, right: 8, zIndex: 2 },
  clearPhotoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Photo zone — placeholder
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
  },
  photoPlaceholderIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  photoPlaceholderText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  photoPlaceholderHint: {
    color: colors.textMuted,
    fontSize: 12,
  },

  // Form section — slides over photo when keyboard opens
  formSection: {
    gap: 16,
    backgroundColor: colors.background,
    paddingTop: 4,
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
  promptHint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: -8,
  },

  // Footer
  footer: { paddingHorizontal: 24, paddingVertical: 12, paddingBottom: 36 },
  dreamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.accent,
  },
  dreamBtnDisabled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dreamBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  dreamBtnTextDisabled: { color: colors.textMuted },
});
