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
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
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
import { formatCompact } from '@/lib/formatNumber';
import { Toast } from '@/components/Toast';
import { StylePickerSheet } from '@/components/StylePickerSheet';
import { FluxModelPicker } from '@/components/FluxModelPicker';
import { CreateIntroSheet, hasSeenCreateIntro } from '@/components/CreateIntroSheet';
import { sparkleCostFrom, DEFAULT_MODEL_ID } from '@/constants/imageModels';
import { useImageModels } from '@/hooks/useImageModels';

// Same brand gradient used by the homepage wordmark, brochure Hero, and the
// onboarding info-step headlines: moon purple → cloud pink → star teal.
// Applied to the "Create" title at the top of the screen so the tab reads
// as part of the same brand surface.
const BRAND_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

export default function CreateScreen() {
  const config = useDreamStore((s) => s.config);
  const setPhoto = useDreamStore((s) => s.setPhoto);
  const clearPhoto = useDreamStore((s) => s.clearPhoto);
  const setMedium = useDreamStore((s) => s.setMedium);
  const setVibe = useDreamStore((s) => s.setVibe);
  const setPrompt = useDreamStore((s) => s.setPrompt);
  const setPhotoStyle = useDreamStore((s) => s.setPhotoStyle);
  const setUseExactPrompt = useDreamStore((s) => s.setUseExactPrompt);
  const setForceModel = useDreamStore((s) => s.setForceModel);

  const { data: sparkleBalance = 0 } = useSparkleBalance();
  const { data: dbMediums = [] } = useDreamMediums();
  const { data: dbVibes = [] } = useDreamVibes();

  const [kbOpen, setKbOpen] = useState(false);
  const [pickerType, setPickerType] = useState<'medium' | 'vibe' | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState(false);
  const [showProModeInfo, setShowProModeInfo] = useState(false);
  // Advanced Mode AI model — synced from <FluxModelPicker> (which persists it to
  // users.pro_mode_flux_model). Tracked here so the dream button can show the
  // selected model's sparkle cost.
  const [advancedModelId, setAdvancedModelId] = useState(DEFAULT_MODEL_ID);
  const imageModels = useImageModels();
  const promptRef = useRef<TextInput>(null);

  // Keep config.forceModel in sync with Advanced Mode: ON → charge + render the
  // picked model; OFF → null (standard dream, 1 sparkle, engine picks the model).
  // Without this the charge defaulted to 1 sparkle for ALL advanced dreams
  // regardless of model (config.forceModel was only ever set by the DLT screen).
  useEffect(() => {
    setForceModel(config.useExactPrompt ? advancedModelId : null);
  }, [config.useExactPrompt, advancedModelId, setForceModel]);

  // The Create-screen pickers used to filter their options down to the
  // user's onboarding-curated aesthetics + art_styles via a `userFilter`
  // prop. Kevin removed that selection step entirely 2026-05-29, so the
  // filter has nothing to clamp against and the pickers now show the
  // full active catalog every time. State + the effect that loaded the
  // recipe lived here too — gone along with the prop.

  // Rehydrate "use my exact prompt" toggle on mount + persist on changes.
  // Power users only flip it once.
  const USE_EXACT_PROMPT_KEY = 'create.useExactPrompt.v1';
  useEffect(() => {
    AsyncStorage.getItem(USE_EXACT_PROMPT_KEY)
      .then((val) => {
        if (val === '1') setUseExactPrompt(true);
      })
      .catch((e) => {
        if (__DEV__) console.warn('[create] pref persist failed', e);
      });
  }, [setUseExactPrompt]);
  const toggleUseExactPrompt = useCallback(
    (next: boolean) => {
      setUseExactPrompt(next);
      AsyncStorage.setItem(USE_EXACT_PROMPT_KEY, next ? '1' : '0').catch((e) => {
        if (__DEV__) console.warn('[create] pref persist failed', e);
      });
    },
    [setUseExactPrompt]
  );

  // First-Create-tap teaching sheet — explains the modes + sparkles via a
  // full sheet (CreateIntroSheet) the first time a user opens the Create
  // tab. Replaces the older one-liner "1 sparkle = 1 dream" toast which
  // didn't actually explain how Create works. Once-per-device-per-install
  // (persistence handled inside the sheet on its own mount).
  const [introVisible, setIntroVisible] = useState(false);
  useEffect(() => {
    let cancelled = false;
    hasSeenCreateIntro().then((seen) => {
      if (cancelled || seen) return;
      // Wait a tick so the sheet doesn't fight the screen mount animation.
      setTimeout(() => {
        if (!cancelled) setIntroVisible(true);
      }, 350);
    });
    return () => {
      cancelled = true;
    };
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
          {/* Gradient wordmark — same MaskedView + LinearGradient pattern used
              by the onboarding WelcomeStep/InfoStep titles. White Text inside
              the mask defines the SHAPE; the LinearGradient fills it. */}
          <MaskedView
            maskElement={
              <Text className="text-2xl font-extrabold" style={{ color: '#FFFFFF' }}>
                Create
              </Text>
            }
          >
            <LinearGradient colors={BRAND_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text className="text-2xl font-extrabold" style={{ opacity: 0 }}>
                Create
              </Text>
            </LinearGradient>
          </MaskedView>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => nav.push('/sparkleStore')}
              className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-2xl"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons name="sparkles" size={14} color={colors.accent} />
              <Text className="text-xs font-bold" style={{ color: colors.accent }}>
                {formatCompact(sparkleBalance)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePickPhoto}
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.accent }}
              hitSlop={6}
            >
              <Ionicons name={hasPhoto ? 'image' : 'camera-outline'} size={16} color="#fff" />
            </TouchableOpacity>
          </View>
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

          {/* Advanced Mode + photo notice — Advanced Mode is text-only, so
              when a photo is attached the toggle is hidden but the user's
              preference (config.useExactPrompt) is preserved for when the
              photo is removed. Surface a one-line note so the override
              isn't silent. */}
          {hasPhoto && config.useExactPrompt && (
            <View
              className="flex-row items-start gap-2 px-3 py-2 mb-3 rounded-xl"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={colors.textSecondary}
                style={{ marginTop: 1 }}
              />
              <Text
                className="flex-1 text-xs"
                style={{ color: colors.textSecondary, lineHeight: 16 }}
              >
                Photo dreams use the DreamBot engine — Direct mode is for text-only dreams.
              </Text>
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

          {/* Prompt input — hidden when a photo is in Restyle mode, since
              that path is medium+vibe only (no prompt influence). The
              underlying `config.userPrompt` is preserved so flipping back
              to New Scene restores whatever the user had typed. */}
          {!(hasPhoto && config.photoStyle === 'restyle') && (
            <View
              className="rounded-xl mb-4"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <TextInput
                ref={promptRef}
                className="px-4 py-4 text-base"
                style={{
                  color: colors.textPrimary,
                  // Fixed height — long prompts scroll internally rather than
                  // stretching the box. iOS multiline TextInputs scroll
                  // automatically when height is fixed. Shrink in the
                  // photo-uploaded + keyboard-open state so Medium and Vibe
                  // dropdowns stay visible below.
                  height: hasPhoto && kbOpen ? 80 : 120,
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
            </View>
          )}

          {/* Engine selector — two named engines (no photo attached):
              • DreamBot (config.useExactPrompt = false) — our engine: custom
                mediums/vibes, prompt polish, and cast-photo face swap.
              • Direct (config.useExactPrompt = true) — prompt goes verbatim to
                the user's chosen AI model, skipping styling + face swap.
              State is sticky per-user via AsyncStorage (USE_EXACT_PROMPT_KEY).
              Photo path hides this and shows the inline note above (Direct is
              text-only). */}
          {!hasPhoto && (
            <View className="mb-4">
              <View
                className="flex-row rounded-xl p-1"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <TouchableOpacity
                  className="flex-row items-center justify-center py-2 rounded-lg"
                  style={{
                    flex: 1,
                    backgroundColor: !config.useExactPrompt ? colors.accent : 'transparent',
                  }}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleUseExactPrompt(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: !config.useExactPrompt ? '#fff' : colors.textSecondary }}
                  >
                    DreamBot
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center justify-center py-2 rounded-lg"
                  style={{
                    flex: 1,
                    backgroundColor: config.useExactPrompt ? colors.accent : 'transparent',
                  }}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleUseExactPrompt(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: config.useExactPrompt ? '#fff' : colors.textSecondary }}
                  >
                    Direct
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-start mt-1.5 px-1">
                <Text
                  className="flex-1 text-xs"
                  style={{ color: colors.textSecondary, opacity: 0.7, lineHeight: 16 }}
                >
                  {config.useExactPrompt
                    ? 'Your exact prompt goes straight to the AI model you pick — no DreamBot styling, polish, or face swap.'
                    : 'Custom mediums & vibes, prompt polish, and your cast photos swapped into the scene.'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowProModeInfo(true)}
                  activeOpacity={0.6}
                  hitSlop={10}
                  style={{ marginLeft: 8, marginTop: 1 }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Advanced Mode ON → the AI model picker replaces Medium/Vibe (those
              directives are bypassed in this mode). OFF → the Medium/Vibe pills. */}
          {config.useExactPrompt ? (
            <View className="mb-4">
              <FluxModelPicker variant="pill" onChange={setAdvancedModelId} />
            </View>
          ) : (
            <View className="flex-row gap-3 mb-4">
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
          )}
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
              <Text className="text-white text-base font-bold">
                Dream · {config.useExactPrompt ? sparkleCostFrom(imageModels, advancedModelId) : 1}
              </Text>
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

      {/* Engine info modal — centered card explaining the two engines
          (DreamBot vs Direct), opened from the (i) next to the engine
          selector. Floats above the keyboard so the user can read it without
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
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 17,
                fontWeight: '700',
                marginBottom: 14,
              }}
            >
              Two ways to dream
            </Text>

            <View className="flex-row items-center mb-1.5">
              <Ionicons name="sparkles" size={16} color={colors.accent} />
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 15,
                  fontWeight: '700',
                  marginLeft: 7,
                }}
              >
                DreamBot
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 21 }}>
              Our engine. Renders your custom mediums & vibes, polishes your prompt for the best
              result, and swaps your cast photos into the scene so you and your +1 appear in the
              dream. 1 sparkle per dream.
            </Text>

            <View className="flex-row items-center mb-1.5" style={{ marginTop: 16 }}>
              <Ionicons name="flash" size={16} color={colors.accent} />
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 15,
                  fontWeight: '700',
                  marginLeft: 7,
                }}
              >
                Direct
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 21 }}>
              Sends your exact prompt straight to the AI model you choose — no styling, polish, or
              face swap. Each model shows its own sparkle cost in the picker.
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

      {/* First-Create-tap teaching sheet — see effect above. */}
      <CreateIntroSheet visible={introVisible} onClose={() => setIntroVisible(false)} />
    </SafeAreaView>
  );
}
