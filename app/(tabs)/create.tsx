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
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as nav from '@/lib/navigate';
import { colors } from '@/constants/theme';
import { vs } from '@/lib/responsive';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { useDreamStore } from '@/store/dream';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { isVibeProfile } from '@/types/vibeProfile';
import { formatCompact } from '@/lib/formatNumber';
import { Toast } from '@/components/Toast';
import { StylePickerSheet } from '@/components/StylePickerSheet';
import type { VibeProfile } from '@/types/vibeProfile';

// One-time toast: "1 sparkle = 1 dream" surfaces the first time a user
// opens the Create tab. Stops surfacing once dismissed (per-device flag).
const SEEN_SPARKLE_HINT_KEY = 'dreambot.seenSparkleHint.v1';

export default function CreateScreen() {
  const config = useDreamStore((s) => s.config);
  const setPhoto = useDreamStore((s) => s.setPhoto);
  const clearPhoto = useDreamStore((s) => s.clearPhoto);
  const setMedium = useDreamStore((s) => s.setMedium);
  const setVibe = useDreamStore((s) => s.setVibe);
  const setPrompt = useDreamStore((s) => s.setPrompt);
  const setPhotoStyle = useDreamStore((s) => s.setPhotoStyle);
  const setUseExactPrompt = useDreamStore((s) => s.setUseExactPrompt);

  const { data: sparkleBalance = 0 } = useSparkleBalance();
  const user = useAuthStore((s) => s.user);
  const { data: dbMediums = [] } = useDreamMediums();
  const { data: dbVibes = [] } = useDreamVibes();

  const [kbOpen, setKbOpen] = useState(false);
  const [pickerType, setPickerType] = useState<'medium' | 'vibe' | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState(false);
  const [showProModeInfo, setShowProModeInfo] = useState(false);
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
        }
      });
  }, [user]);

  // Rehydrate "use my exact prompt" toggle on mount + persist on changes.
  // Power users only flip it once.
  const USE_EXACT_PROMPT_KEY = 'create.useExactPrompt.v1';
  useEffect(() => {
    AsyncStorage.getItem(USE_EXACT_PROMPT_KEY)
      .then((val) => {
        if (val === '1') setUseExactPrompt(true);
      })
      .catch(() => {});
  }, [setUseExactPrompt]);
  const toggleUseExactPrompt = useCallback(
    (next: boolean) => {
      setUseExactPrompt(next);
      AsyncStorage.setItem(USE_EXACT_PROMPT_KEY, next ? '1' : '0').catch(() => {});
    },
    [setUseExactPrompt]
  );

  // First-Create-tap teaching toast — explains the sparkle unit cost the
  // moment a new user opens the Create tab. Fires ONCE per device per
  // install (AsyncStorage flag), then never surfaces again.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const seen = await AsyncStorage.getItem(SEEN_SPARKLE_HINT_KEY);
        if (seen === '1' || cancelled) return;
        // Wait a tick so the toast doesn't fight the screen mount animation
        setTimeout(() => {
          if (cancelled) return;
          Toast.show(`1 sparkle = 1 dream. You've got ${sparkleBalance}.`, 'sparkles');
          AsyncStorage.setItem(SEEN_SPARKLE_HINT_KEY, '1').catch(() => {});
        }, 700);
      } catch {
        // Toast is non-critical; silent fail
      }
    })();
    return () => {
      cancelled = true;
    };
    // Only run once on mount — sparkleBalance is captured in closure but
    // we deliberately don't re-fire when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const isSurpriseMedium =
    config.selectedMedium === 'surprise_me_face' || config.selectedMedium === 'surprise_me_art';
  const mediumLabel = isSurpriseMedium
    ? 'Surprise Me'
    : (mediumOptions.find((m) => m.key === config.selectedMedium)?.label ?? config.selectedMedium);
  const vibeLabel =
    vibeOptions.find((v) => v.key === config.selectedVibe)?.label ?? config.selectedVibe;

  // Self-reference detection — first-person singular pronouns (NOT "my" alone)
  const SELF_REF_REGEX = /\b(I|I'm|I'll|I'd|I've|me|myself|mine|selfie)\b/i;
  const mentionsSelf = hasPrompt && !hasPhoto && SELF_REF_REGEX.test(config.userPrompt);

  // Relationship reference — user mentions a cast member by relationship
  const RELATIONSHIP_REGEX =
    /\bmy\s+(partner|wife|husband|girlfriend|boyfriend|spouse|fiancée?|friend|bestie|buddy|bff|pal|mom|dad|mother|father|brother|sister|son|daughter|family|hubby|wifey|dog|cat|pet|puppy|kitten|pup|kitty|pupper|doggo)\b/i;
  const mentionsOther = hasPrompt && !hasPhoto && RELATIONSHIP_REGEX.test(config.userPrompt);

  // Whether the selected medium face-swaps (composites real face into scene)
  const selectedMediumRow = dbMediums.find((m) => m.key === config.selectedMedium);
  const mediumFaceSwaps = isSurpriseMedium
    ? config.selectedMedium === 'surprise_me_face'
    : (selectedMediumRow?.face_swaps ?? true);

  // Contextual hint above Dream button
  // Footer hint — surfaces the face-swap-off warning when exact-prompt mode
  // is on + the prompt mentions self/relationship. Footer is always visible
  // above the keyboard, so the user sees this even when the inline area is
  // squeezed.
  const exactPromptSelfWarning =
    config.useExactPrompt && (mentionsSelf || mentionsOther)
      ? `Face swap is off — your face won${'’'}t appear in this dream`
      : null;
  const contextHint = exactPromptSelfWarning
    ? exactPromptSelfWarning
    : hasPhoto
      ? config.photoStyle === 'new_scene'
        ? 'Put your photo in a new scene'
        : 'Restyle your photo in this medium'
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

          {/* Photo mode toggle — only when a photo is attached */}
          {hasPhoto && (
            <View className="mb-3">
              <View
                className="flex-row rounded-xl p-1"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      config.photoStyle === 'new_scene' ? colors.accent : 'transparent',
                  }}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setPhotoStyle('new_scene');
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="sparkles-outline"
                    size={14}
                    color={config.photoStyle === 'new_scene' ? '#fff' : colors.textSecondary}
                  />
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: config.photoStyle === 'new_scene' ? '#fff' : colors.textSecondary,
                    }}
                  >
                    New Scene
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      config.photoStyle === 'restyle' ? colors.accent : 'transparent',
                  }}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setPhotoStyle('restyle');
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="color-palette-outline"
                    size={14}
                    color={config.photoStyle === 'restyle' ? '#fff' : colors.textSecondary}
                  />
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: config.photoStyle === 'restyle' ? '#fff' : colors.textSecondary,
                    }}
                  >
                    Restyle
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                className="text-xs mt-1.5 px-1"
                style={{ color: colors.textSecondary, opacity: 0.7 }}
              >
                {config.photoStyle === 'new_scene'
                  ? 'We’ll invent a fresh scene around you — works best with a clear single-subject photo.'
                  : 'We’ll keep your pose and restyle the scene in this medium.'}
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
              className="pl-4 pr-14 pt-4 pb-10 text-base"
              style={{
                color: colors.textPrimary,
                // Fixed height — long prompts scroll internally rather than
                // stretching the box. iOS multiline TextInputs scroll
                // automatically when height is fixed.
                height: 120,
                textAlignVertical: 'top',
              }}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted ?? '#6B7280'}
              value={config.userPrompt}
              onChangeText={setPrompt}
              maxLength={2000}
              multiline
              scrollEnabled
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

          {/* Pro Mode toggle — only shown when there's a custom prompt with
              no photo. When ON: prompt goes verbatim to flux-1.1-pro, skipping
              Sonnet expansion, chaos, medium/vibe directives, AND face swap.
              Slim row: "Pro Mode" label + (i) info icon (tap to expand inline
              explanation) + switch on the right. Face-swap warning still
              surfaces in the footer contextHint to stay above the keyboard. */}
          {hasPrompt && !hasPhoto && (
            <View
              className="rounded-xl mb-4"
              style={{
                backgroundColor: config.useExactPrompt ? colors.accent + '22' : colors.surface,
                borderWidth: 1,
                borderColor: config.useExactPrompt ? colors.accent : colors.border,
              }}
            >
              <View className="flex-row items-center px-4 py-3">
                <TouchableOpacity
                  onPress={() => toggleUseExactPrompt(!config.useExactPrompt)}
                  activeOpacity={0.7}
                  className="flex-row items-center"
                  hitSlop={6}
                >
                  <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>
                    Pro Mode
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowProModeInfo((v) => !v)}
                  activeOpacity={0.6}
                  hitSlop={10}
                  style={{ marginLeft: 6 }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  onPress={() => toggleUseExactPrompt(!config.useExactPrompt)}
                  activeOpacity={0.7}
                  hitSlop={6}
                  className="w-12 h-7 rounded-full justify-center"
                  style={{
                    backgroundColor: config.useExactPrompt ? colors.accent : colors.border,
                    paddingHorizontal: 2,
                  }}
                >
                  <View
                    className="w-6 h-6 rounded-full"
                    style={{
                      backgroundColor: '#fff',
                      transform: [{ translateX: config.useExactPrompt ? 20 : 0 }],
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Style pills — disabled when "use my exact prompt" is on, since
              that mode bypasses medium/vibe directives entirely. */}
          {
            <View
              className="flex-row gap-3 mb-4"
              style={{ opacity: config.useExactPrompt ? 0.35 : 1 }}
              pointerEvents={config.useExactPrompt ? 'none' : 'auto'}
            >
              <View className="flex-1">
                <Text
                  className="text-xs font-medium mb-1.5 ml-1"
                  style={{ color: colors.textSecondary }}
                >
                  Medium
                </Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between px-4 py-3 rounded-xl"
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
                  <View className="flex-row items-center gap-1.5 flex-1 mr-1">
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: colors.textPrimary }}
                      numberOfLines={1}
                    >
                      {mediumLabel}
                    </Text>
                    {(isSurpriseMedium || selectedMediumRow) && (
                      <View
                        style={{
                          paddingHorizontal: 5,
                          paddingVertical: 1,
                          borderRadius: 5,
                          backgroundColor: mediumFaceSwaps
                            ? 'rgba(96,165,250,0.15)'
                            : 'rgba(245,158,11,0.15)',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 8,
                            fontWeight: '700',
                            color: mediumFaceSwaps ? '#60A5FA' : '#F59E0B',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                          }}
                        >
                          {mediumFaceSwaps ? 'face' : 'art'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <Text
                  className="text-xs font-medium mb-1.5 ml-1"
                  style={{ color: colors.textSecondary }}
                >
                  Vibe
                </Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between px-4 py-3 rounded-xl"
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
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: colors.textPrimary }}
                    numberOfLines={1}
                  >
                    {vibeLabel}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
          }
        </ScrollView>

        {/* Fixed footer — always visible above keyboard */}
        <View className="px-5" style={{ paddingBottom: kbOpen ? 8 : vs(96) }}>
          {/* Contextual hint */}
          <View className="flex-row items-center justify-center gap-1.5 mb-2">
            {exactPromptSelfWarning ? (
              <Ionicons name="warning-outline" size={14} color="#F59E0B" />
            ) : (hasPhoto && hasPrompt) || mentionsSelf || mentionsOther ? (
              <Ionicons name="information-circle" size={14} color={colors.accent} />
            ) : null}
            <Text
              className="text-center text-sm font-medium"
              style={{ color: exactPromptSelfWarning ? '#F59E0B' : 'rgba(255,255,255,0.5)' }}
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

      {/* Pro Mode info modal — centered card explaining what Pro Mode does
          and pointing the user to Settings → Pro Mode to choose Flux model.
          Modal floats above the keyboard so the user can read it without
          dismissing input. */}
      <Modal
        visible={showProModeInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProModeInfo(false)}
      >
        <TouchableOpacity
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onPress={() => setShowProModeInfo(false)}
          activeOpacity={1}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              padding: 22,
              width: '100%',
              maxWidth: 360,
            }}
          >
            <View className="flex-row items-center mb-3">
              <Ionicons name="flash-outline" size={20} color={colors.accent} />
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 17,
                  fontWeight: '700',
                  marginLeft: 8,
                }}
              >
                Pro Mode
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 21 }}>
              Sends your prompt directly to Flux. Skips AI enhancement and face swap — best for
              fully-polished prompts you want rendered exactly as written.
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                lineHeight: 21,
                marginTop: 12,
              }}
            >
              Pick which Flux model handles your Pro Mode renders in{' '}
              <Text
                style={{ color: colors.accent, fontWeight: '600' }}
                onPress={() => {
                  setShowProModeInfo(false);
                  nav.push('/settings/pro-mode');
                }}
              >
                Settings → Pro Mode
              </Text>
              .
            </Text>
            <TouchableOpacity
              onPress={() => setShowProModeInfo(false)}
              activeOpacity={0.7}
              className="self-end mt-5 py-2 px-4 rounded-lg"
              style={{ backgroundColor: colors.accent }}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Got it</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
