/**
 * Create Tab — unified dream creation screen.
 *
 * 4 implicit modes based on what the user provides:
 *   No prompt + no photo → surprise dream
 *   Prompt only → generate from prompt
 *   Photo only → stylize/remix photo
 *   Photo + prompt → reimagine photo with prompt
 *
 * One screen, one button: "Dream ✨"
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  InteractionManager,
  Platform,
  Modal,
  ActionSheetIOS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Linking } from 'react-native';
import * as nav from '@/lib/navigate';
import { colors } from '@/constants/theme';
import { vs } from '@/lib/responsive';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { useDreamStore } from '@/store/dream';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { isVibeProfile } from '@/lib/migrateRecipe';
import { formatCompact } from '@/lib/formatNumber';
import { Toast } from '@/components/Toast';
import { StylePickerSheet } from '@/components/StylePickerSheet';
import type { VibeProfile } from '@/types/vibeProfile';

export default function CreateScreen() {
  const config = useDreamStore((s) => s.config);
  const setPhoto = useDreamStore((s) => s.setPhoto);
  const clearPhoto = useDreamStore((s) => s.clearPhoto);
  const setMedium = useDreamStore((s) => s.setMedium);
  const setVibe = useDreamStore((s) => s.setVibe);
  const setPrompt = useDreamStore((s) => s.setPrompt);
  const { data: sparkleBalance = 0 } = useSparkleBalance();
  const user = useAuthStore((s) => s.user);
  const { data: dbMediums = [] } = useDreamMediums();
  const { data: dbVibes = [] } = useDreamVibes();

  const [kbOpen, setKbOpen] = useState(false);
  const [hasCastSelf, setHasCastSelf] = useState(false);
  const [pickerType, setPickerType] = useState<'medium' | 'vibe' | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState(false);
  const promptRef = useRef<TextInput>(null);

  // Load user's art_styles/aesthetics for filtering
  const [userArtStyles, setUserArtStyles] = useState<string[] | undefined>();
  const [userAesthetics, setUserAesthetics] = useState<string[] | undefined>();
  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_recipes')
      .select('recipe')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        const raw = data?.recipe as unknown;
        if (raw && isVibeProfile(raw)) {
          const vp = raw as VibeProfile;
          if (vp.art_styles?.length) setUserArtStyles(vp.art_styles);
          if (vp.aesthetics?.length) setUserAesthetics(vp.aesthetics);
          const cast = vp.dream_cast;
          if (cast && Array.isArray(cast)) {
            setHasCastSelf(
              cast.some(
                (m: { role: string; thumb_url?: string }) => m.role === 'self' && !!m.thumb_url
              )
            );
          }
        }
      });
  }, [user]);

  // Keyboard tracking — delay state update until after keyboard animation
  useEffect(() => {
    const s1 = Keyboard.addListener('keyboardDidShow', () => {
      InteractionManager.runAfterInteractions(() => setKbOpen(true));
    });
    const s2 = Keyboard.addListener('keyboardDidHide', () => {
      InteractionManager.runAfterInteractions(() => setKbOpen(false));
    });
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

  // Derived state
  const hasPhoto = !!config.photoUri;
  const hasPrompt = config.userPrompt.trim().length > 0;

  // Find labels for selected medium/vibe
  // Build options lists with Surprise Me prepended
  const mediumOptions = [{ key: 'surprise_me', label: 'Surprise Me' }, ...dbMediums];
  const vibeOptions = [{ key: 'surprise_me', label: 'Surprise Me' }, ...dbVibes];

  const mediumLabel =
    mediumOptions.find((m) => m.key === config.selectedMedium)?.label ?? config.selectedMedium;
  const vibeLabel =
    vibeOptions.find((v) => v.key === config.selectedVibe)?.label ?? config.selectedVibe;

  // Self-reference detection
  const SELF_REF_REGEX =
    /\b(put me|place me|make me|show me|me as|me in|me on|me at|me \w+ing|i am|i'm|myself|my face)\b/i;
  const mentionsSelf = hasPrompt && SELF_REF_REGEX.test(config.userPrompt);

  // Medium transform quality
  const selectedMediumData = dbMediums.find((m) => m.key === config.selectedMedium);
  const isGoodTransform =
    config.selectedMedium === 'surprise_me' || selectedMediumData?.transform_quality === 'good';

  // Whether this medium uses face swap (composites real face) vs description only
  const NON_SWAP_MEDIUMS = new Set([
    'lego', 'pixel_art', 'stained_glass', 'embroidery', 'funko_pop',
    'minecraft', 'sack_boy', 'ghibli', 'tim_burton', 'plushie',
    'disney', '3d_cartoon',
  ]);
  const doesFaceSwap =
    config.selectedMedium !== 'surprise_me' && !NON_SWAP_MEDIUMS.has(config.selectedMedium);

  // Contextual hint above Dream button
  const contextHint = hasPhoto
    ? hasPrompt
      ? isGoodTransform
        ? 'Inspired by your likeness'
        : 'Artistic interpretation'
      : 'Restyle your photo'
    : hasPrompt
      ? 'Generate from your prompt'
      : 'Leave blank for a surprise';

  // Placeholder text
  const placeholder = hasPhoto
    ? 'Describe a scene...'
    : 'Describe your dream... or leave blank for a surprise.';

  // Process a picked/captured image asset
  async function processPhotoAsset(asset: ImagePicker.ImagePickerAsset) {
    try {
      const compressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      if (!compressed.base64) {
        Toast.show('Could not process photo', 'close-circle');
        return;
      }
      setPhoto(compressed.base64, compressed.uri);
    } catch {
      Toast.show('Could not process photo', 'close-circle');
    }
  }

  async function launchLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      await processPhotoAsset(result.assets[0]);
    }
  }

  async function launchCamera() {
    const existing = await ImagePicker.getCameraPermissionsAsync();
    if (existing.status === 'denied' && !existing.canAskAgain) {
      Toast.show('Enable camera in Settings', 'close-circle');
      Linking.openSettings();
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show('Camera permission required', 'close-circle');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      await processPhotoAsset(result.assets[0]);
    }
  }

  // Photo picker — action sheet to choose camera or library
  function handlePickPhoto() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Take Photo', 'Choose from Library', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (index) => {
        if (index === 0) launchCamera();
        else if (index === 1) launchLibrary();
      }
    );
  }

  function handleDream() {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nav.push('/dream/loading');
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }} edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3">
          <Text className="text-2xl font-extrabold" style={{ color: colors.textPrimary }}>
            Create
          </Text>
          <TouchableOpacity
            onPress={() => nav.push('/sparkleStore')}
            className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-2xl"
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
          >
            <Ionicons name="sparkles" size={14} color={colors.accent} />
            <Text className="text-xs font-bold" style={{ color: colors.accent }}>
              {formatCompact(sparkleBalance)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable content */}
        <ScrollView
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Photo attachment card */}
          {/* Photo attachment card */}
          {hasPhoto && (
            <View
              className="flex-row items-center gap-3 p-3 mb-4 rounded-xl"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <TouchableOpacity onPress={() => setPreviewPhoto(true)}>
                <Image
                  source={{ uri: config.photoUri! }}
                  className="rounded-lg"
                  style={{ width: 48, height: 48 }}
                  contentFit="cover"
                />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                  Reference Photo
                </Text>
                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                  Tap to preview
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  clearPhoto();
                }}
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Contextual info hint — photo or self-insert states */}
          {hasPhoto && (
            <View className="flex-row items-center gap-1.5 mb-2 px-1">
              <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
              <Text className="text-xs flex-1" style={{ color: colors.textSecondary }}>
                {!hasPrompt
                  ? 'Leave blank to restyle your photo, or type a scene for a likeness-based dream'
                  : isGoodTransform
                    ? 'Your photo will help capture your likeness in this style'
                    : 'This style creates an artistic interpretation — not your exact likeness'}
              </Text>
            </View>
          )}
          {!hasPhoto && mentionsSelf && hasCastSelf && (
            <View className="flex-row items-center gap-1.5 mb-2 px-1">
              <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
              <Text className="text-xs flex-1" style={{ color: colors.textSecondary }}>
                {doesFaceSwap
                  ? 'Your character will be crafted from your Dream Cast — results vary by style'
                  : 'Your character will be based on your look — stylized for this medium'}
              </Text>
            </View>
          )}
          {!hasPhoto && mentionsSelf && !hasCastSelf && (
            <View className="flex-row items-center gap-1.5 mb-2 px-1">
              <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
              <Text className="text-xs flex-1" style={{ color: colors.textSecondary }}>
                Add yourself to Dream Cast in settings to see yourself in dreams
              </Text>
            </View>
          )}

          {/* Prompt input */}
          <View
            className="rounded-xl mb-4"
            style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
          >
            <TextInput
              ref={promptRef}
              className="px-4 pt-4 pb-10 text-base"
              style={{
                color: colors.textPrimary,
                minHeight: 120,
                textAlignVertical: 'top',
              }}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted ?? '#6B7280'}
              value={config.userPrompt}
              onChangeText={setPrompt}
              maxLength={300}
              multiline
              returnKeyType="default"
            />
            {/* Photo icon inside prompt field */}
            <TouchableOpacity
              className="absolute bottom-2 right-3 w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.accent }}
              onPress={handlePickPhoto}
              hitSlop={8}
            >
              <Ionicons name={hasPhoto ? 'image' : 'camera-outline'} size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Style pills */}
          {
            <View className="flex-row gap-3 mb-4">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPickerType('medium');
                }}
                activeOpacity={0.7}
              >
                <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                  Medium
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: colors.textPrimary }}
                    numberOfLines={1}
                  >
                    {mediumLabel}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 flex-row items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPickerType('vibe');
                }}
                activeOpacity={0.7}
              >
                <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                  Vibe
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: colors.textPrimary }}
                    numberOfLines={1}
                  >
                    {vibeLabel}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            </View>
          }
        </ScrollView>

        {/* Fixed footer — always visible above keyboard */}
        <View className="px-5" style={{ paddingBottom: kbOpen ? 8 : vs(96) }}>
          {/* Contextual hint */}
          <View className="flex-row items-center justify-center gap-1.5 mb-2">
            {((hasPhoto && hasPrompt) || mentionsSelf) && (
              <Ionicons name="information-circle" size={14} color={colors.accent} />
            )}
            <Text
              className="text-center text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {contextHint}
            </Text>
          </View>

          {/* Dream button */}
          <TouchableOpacity
            className="items-center justify-center py-4 rounded-2xl"
            style={{ backgroundColor: colors.accent }}
            onPress={handleDream}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-white text-base font-bold">Dream</Text>
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Style picker bottom sheet */}
      <StylePickerSheet
        visible={pickerType !== null}
        type={pickerType ?? 'medium'}
        selected={pickerType === 'vibe' ? config.selectedVibe : config.selectedMedium}
        onSelect={(key) => {
          if (pickerType === 'vibe') setVibe(key);
          else setMedium(key);
        }}
        onClose={() => setPickerType(null)}
        options={pickerType === 'vibe' ? vibeOptions : mediumOptions}
        userFilter={pickerType === 'vibe' ? userAesthetics : userArtStyles}
      />

      {/* Photo fullscreen preview */}
      <Modal visible={previewPhoto} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
          onPress={() => setPreviewPhoto(false)}
          activeOpacity={1}
        >
          {config.photoUri && (
            <Image
              source={{ uri: config.photoUri }}
              style={{ width: '90%', height: '70%' }}
              contentFit="contain"
            />
          )}
          <TouchableOpacity
            className="absolute top-16 right-5 w-11 h-11 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={() => setPreviewPhoto(false)}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
