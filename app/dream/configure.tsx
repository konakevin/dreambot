/**
 * Configure Screen — medium/vibe selectors + optional prompt + photo preview.
 *
 * Reached from:
 *   Create (Upload Photo) → configure with photo preview
 *   Create (Enter Prompt) → configure with prompt input focused
 */

import { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { useDreamStore } from '@/store/dream';
import type { PhotoStyle } from '@/store/dream';
import { MediumVibeSelector } from '@/components/MediumVibeSelector';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { formatCompact } from '@/lib/formatNumber';

export default function DreamConfigureScreen() {
  const config = useDreamStore((s) => s.config);
  const setMedium = useDreamStore((s) => s.setMedium);
  const setVibe = useDreamStore((s) => s.setVibe);
  const setPrompt = useDreamStore((s) => s.setPrompt);
  const setPhotoStyle = useDreamStore((s) => s.setPhotoStyle);
  const { data: sparkleBalance = 0 } = useSparkleBalance();

  const [kbOpen, setKbOpen] = useState(false);
  const promptRef = useRef<TextInput>(null);

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

  // Auto-focus prompt for "Enter Prompt" mode
  useEffect(() => {
    if (config.mode === 'prompt') {
      setTimeout(() => promptRef.current?.focus(), 300);
    }
  }, [config.mode]);

  const hasPhoto = !!config.photoUri;
  const needsPrompt = hasPhoto && config.photoStyle === 'reimagine' && !config.userPrompt.trim();

  function handleDream() {
    if (needsPrompt) return;
    Keyboard.dismiss();
    router.push('/dream/loading');
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
          <Text style={s.headerTitle}>{hasPhoto ? 'Transform Photo' : 'Create Dream'}</Text>
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
          {/* Photo preview */}
          {hasPhoto && !kbOpen && (
            <View style={s.photoWrap}>
              <Image source={{ uri: config.photoUri! }} style={s.photoPreview} contentFit="cover" />
            </View>
          )}

          {/* Photo style toggle */}
          {hasPhoto && (
            <View style={s.styleToggle}>
              <TouchableOpacity
                style={[s.styleOption, config.photoStyle === 'restyle' && s.styleOptionActive]}
                onPress={() => setPhotoStyle('restyle')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={18}
                  color={config.photoStyle === 'restyle' ? colors.accent : colors.textSecondary}
                />
                <View style={s.styleOptionText}>
                  <Text
                    style={[s.styleLabel, config.photoStyle === 'restyle' && s.styleLabelActive]}
                  >
                    Restyle
                  </Text>
                  <Text style={s.styleDesc}>Same scene, new art style</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.styleOption, config.photoStyle === 'reimagine' && s.styleOptionActive]}
                onPress={() => setPhotoStyle('reimagine')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="planet-outline"
                  size={18}
                  color={config.photoStyle === 'reimagine' ? colors.accent : colors.textSecondary}
                />
                <View style={s.styleOptionText}>
                  <Text
                    style={[s.styleLabel, config.photoStyle === 'reimagine' && s.styleLabelActive]}
                  >
                    Reimagine
                  </Text>
                  <Text style={s.styleDesc}>New scenario, keep subject</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Medium + Vibe selectors */}
          <View style={s.selectors}>
            <MediumVibeSelector
              selectedMedium={config.selectedMedium}
              selectedVibe={config.selectedVibe}
              onMediumChange={setMedium}
              onVibeChange={setVibe}
            />
          </View>

          {/* Prompt input */}
          {(hasPhoto && config.photoStyle === 'reimagine') || !hasPhoto ? (
            <View style={s.promptWrap}>
              <TextInput
                ref={promptRef}
                style={s.promptInput}
                placeholder={
                  hasPhoto ? 'Describe the new scenario...' : 'Describe your dream (optional)...'
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
          ) : null}
        </ScrollView>

        {/* Fixed footer */}
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
              {needsPrompt ? 'Enter a scenario to dream' : 'Dream'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  sparkleText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 20,
  },
  photoWrap: {
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 16,
    maxHeight: 280,
  },
  selectors: {
    gap: 12,
  },
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
  promptClear: {
    paddingTop: 2,
    paddingLeft: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  dreamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: colors.accent,
  },
  dreamBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  dreamBtnDisabled: {
    backgroundColor: colors.surface,
  },
  dreamBtnTextDisabled: {
    color: 'rgba(255,255,255,0.4)',
  },
  styleToggle: {
    flexDirection: 'row',
    gap: 10,
  },
  styleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  styleOptionActive: {
    borderColor: colors.accent,
  },
  styleOptionText: {
    flex: 1,
    gap: 2,
  },
  styleLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  styleLabelActive: {
    color: colors.accent,
  },
  styleDesc: {
    color: colors.textMuted,
    fontSize: 11,
  },
});
