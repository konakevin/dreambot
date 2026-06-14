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
import { useFocusEffect } from 'expo-router';

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
import { verticalScale, fontScale } from '@/lib/responsive';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { useDreamStore } from '@/store/dream';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { formatCompact } from '@/lib/formatNumber';
import { Toast } from '@/components/Toast';
import { StylePickerSheet } from '@/components/StylePickerSheet';
import { ModelPicker } from '@/components/ModelPicker';
import { CreateIntroSheet, hasSeenCreateIntro } from '@/components/CreateIntroSheet';
import { MediumsIntroSheet, hasSeenMediumsIntro } from '@/components/MediumsIntroSheet';
import { sparkleCostFrom, DEFAULT_MODEL_ID } from '@/constants/imageModels';
import { showPremiumGate } from '@/lib/premiumGate';
import { useImageModels } from '@/hooks/useImageModels';
import { useEngineConfig } from '@/hooks/useEngineConfig';

// Same brand gradient used by the homepage wordmark, brochure Hero, and the
// onboarding info-step headlines: moon purple → cloud pink → star teal.
// Applied to the "Create" title at the top of the screen so the tab reads
// as part of the same brand surface.
const BRAND_GRADIENT: [string, string, string] = ['#A78BFA', '#F9A8D4', '#5EEAD4'];

// Cast-detection patterns (defaults). The LIVE source is engine_config
// (relationship_words / pet_words, migration 256) — the same word lists the
// server detector uses, so editing them in the dashboard fixes BOTH the render
// and this helper text with no deploy. These constants are the bundled fallback
// for when the DB value is null/offline; keep them in sync with
// DEFAULT_RELATIONSHIP_WORDS / DEFAULT_PET_WORDS in selfInsertDetector.ts.
const DEFAULT_SELF_REF_REGEX = /\b(I|I'm|I'll|I'd|I've|me|myself|mine|selfie)\b/i;
const DEFAULT_RELATIONSHIP_WORDS =
  'plus[\\s-]?one|plus\\s?1|\\+\\s?1|significant other|partner|wife|husband|girlfriend|boyfriend|gf|bf|spouse|fiancée?|fiancé|fiance|fiancee|friend|best friend|bestie|buddy|bff|pal|mate|mom|mum|dad|mother|father|parent|brother|sister|sibling|twin|son|daughter|kid|kids|child|children|cousin|aunt|uncle|niece|nephew|grandma|grandpa|grandmother|grandfather|granny|roommate|neighbour|neighbor|coworker|colleague|teammate|classmate|hubby|wifey|family';
const DEFAULT_PET_WORDS = 'dog|cat|pet|puppy|kitten|pup|kitty|pupper|doggo';
const DEFAULT_RELATIONSHIP_REGEX = new RegExp(
  `\\bmy\\s+(${DEFAULT_RELATIONSHIP_WORDS}|${DEFAULT_PET_WORDS})\\b`,
  'i'
);

/** Build a case-insensitive RegExp from an admin-provided string; fall back to
 *  `fallback` when the pattern is null/empty or invalid (never throws in render). */
function safeRegex(pattern: string | null, fallback: RegExp): RegExp {
  if (!pattern) return fallback;
  try {
    return new RegExp(pattern, 'i');
  } catch {
    return fallback;
  }
}

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
  const [photoSourceOpen, setPhotoSourceOpen] = useState(false);
  // The image picker can't present while this Modal is still dismissing (iOS),
  // so stash the chosen action and fire it AFTER the modal is gone.
  const pendingPhotoAction = useRef<null | (() => void)>(null);
  const runPendingPhotoAction = () => {
    const action = pendingPhotoAction.current;
    pendingPhotoAction.current = null;
    action?.();
  };
  // Unified AI model — the single top-level model choice shared by BOTH routes
  // (DreamBot engine + Direct). Synced from <ModelPicker> (persisted to
  // users.pro_mode_flux_model, cross-device). Drives force_model + the Dream
  // button's sparkle cost for both routes.
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);
  const imageModels = useImageModels();
  const engineConfig = useEngineConfig();
  const promptRef = useRef<TextInput>(null);

  // The chosen model is forced for BOTH routes: Direct sends the prompt verbatim
  // to it; DreamBot runs the full engine (mediums/vibes/face-swap) and renders
  // with it. The server charges getSparkleCost(force_model), so the cost is the
  // model's tier (1–5) regardless of route — matching the Dream button below.
  useEffect(() => {
    setForceModel(selectedModelId);
  }, [selectedModelId, setForceModel]);

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
  // Re-check on every focus (not just mount) so the admin "Reset First-Run
  // Tutorials" tool re-shows this without an app restart — the Create tab stays
  // mounted, so a mount-only effect would never re-fire after the flag clears.
  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  // First time the user opens the medium picker, teach the face-vs-art
  // distinction (MediumsIntroSheet) before the picker opens. Default the ref to
  // `true` (don't show) until the async flag loads, so a fast tap before load
  // never re-traps a user who's already seen it.
  const mediumsIntroSeen = useRef(true);
  // Re-read on focus too, so the admin tutorials-reset re-arms this without an
  // app restart.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      hasSeenMediumsIntro().then((seen) => {
        if (!cancelled) mediumsIntroSeen.current = seen;
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );
  const [mediumsIntroVisible, setMediumsIntroVisible] = useState(false);
  // Whether dismissing the intro sheet should fall through to the medium picker.
  // True when the sheet was triggered BY tapping Medium (teach → then pick);
  // false when opened from the (i) for a re-read (just close).
  const openPickerAfterIntro = useRef(false);

  // Show the face-vs-art teaching sheet. Marks it seen so it never auto-pops
  // again (the sheet also persists the flag), and records whether to open the
  // picker on dismiss.
  const showMediumsIntro = useCallback((thenOpenPicker: boolean) => {
    mediumsIntroSeen.current = true;
    openPickerAfterIntro.current = thenOpenPicker;
    setMediumsIntroVisible(true);
  }, []);

  // Open the medium picker, but the first time gate it behind the intro sheet.
  const openMediumPicker = useCallback(() => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!mediumsIntroSeen.current) {
      showMediumsIntro(true);
    } else {
      setPickerType('medium');
    }
  }, [showMediumsIntro]);

  // The (i) next to the engine row re-opens that same teaching sheet. If the
  // user taps it before ever opening Medium, marking it seen here means it
  // won't auto-pop a second time on their first Medium tap.
  const openMediumsIntroInfo = useCallback(() => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showMediumsIntro(false);
  }, [showMediumsIntro]);

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
  // A photo dream ALWAYS runs through the DreamBot engine (the submit path in
  // useDreamCreate ignores use_exact_prompt for photos), so Direct mode never
  // applies when a photo is attached. Drive all the engine-dependent UI off
  // this so the picker/medium/face-swap UI matches what actually renders.
  const effectiveExactPrompt = config.useExactPrompt && !hasPhoto;

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

  // Self-reference + relationship detection. The relationship/pet patterns are
  // built from engine_config word lists (relationship_words / pet_words) — the
  // SAME live source the server detector uses, so the helper + the render stay
  // in sync from one dashboard edit. safeRegex falls back to the bundled
  // constants if the DB value is null or an admin saves an invalid pattern.
  const SELF_REF_REGEX = safeRegex(engineConfig.selfRefRegex, DEFAULT_SELF_REF_REGEX);
  const mentionsSelf = hasPrompt && !hasPhoto && SELF_REF_REGEX.test(config.userPrompt);

  const relWords = engineConfig.relationshipWords || DEFAULT_RELATIONSHIP_WORDS;
  const petWords = engineConfig.petWords || DEFAULT_PET_WORDS;
  const RELATIONSHIP_REGEX = safeRegex(
    `\\bmy\\s+(${relWords}|${petWords})\\b`,
    DEFAULT_RELATIONSHIP_REGEX
  );
  const mentionsOther = hasPrompt && !hasPhoto && RELATIONSHIP_REGEX.test(config.userPrompt);

  // Whether the selected medium face-swaps (composites real face into scene)
  const selectedMediumRow = dbMediums.find((m) => m.key === config.selectedMedium);
  const mediumFaceSwaps = isSurpriseMedium
    ? config.selectedMedium === 'surprise_me_face'
    : (selectedMediumRow?.face_swaps ?? true);

  // Models that render the selected medium well (good face swap + on-style),
  // from the medium's client_meta.recommended_models (migration 266). Drives
  // the "Best for this look" group in the ModelPicker so users are steered
  // toward models that don't drift photoreal on stylized mediums.
  const recommendedModelIds = ((): string[] | undefined => {
    const rec = selectedMediumRow?.client_meta?.recommended_models;
    return Array.isArray(rec) ? rec.filter((m): m is string => typeof m === 'string') : undefined;
  })();

  // Generic mode hint (shown when the face indicator doesn't apply — blank
  // surprise, plain prompt, or photo restyle).
  const contextHint = hasPhoto
    ? config.photoStyle === 'new_scene'
      ? 'Put your photo in a new scene'
      : 'Restyle your photo in this medium'
    : hasPrompt
      ? 'Generate from your prompt'
      : 'Leave blank for a surprise';

  // ── Face indicator (footer) ───────────────────────────────────────────────
  // One face icon that answers "will you be in this dream?" It glows green when
  // a self / relationship reference (or a new-scene photo) puts you in the
  // scene, and stays gray with a nudge otherwise. The medium's face/art badge
  // says HOW you'd appear (real face vs look-alike); this says WHETHER you do.
  const selfPresent =
    mentionsSelf || mentionsOther || (hasPhoto && config.photoStyle === 'new_scene');
  const faceActive = selfPresent && !effectiveExactPrompt;
  // Show the face line whenever you're (or could be) in the scene; otherwise
  // fall back to contextHint (blank surprise / plain prompt / photo restyle).
  const showFaceHint = selfPresent || (hasPrompt && !hasPhoto);
  const faceHint: { icon: keyof typeof Ionicons.glyphMap; color: string; text: string } =
    effectiveExactPrompt && selfPresent
      ? {
          icon: 'warning-outline',
          color: '#F59E0B',
          text: 'Exact prompt’s on, so you’ll sit this one out',
        }
      : faceActive
        ? {
            icon: 'happy',
            color: '#34D399',
            text: mediumFaceSwaps
              ? 'Your real face stars in this dream'
              : 'You’ll pop in as a look-alike',
          }
        : {
            icon: 'happy-outline',
            color: 'rgba(255,255,255,0.5)',
            text: 'Add “me” to hop into the dream',
          };

  // Placeholder text
  const placeholder = hasPhoto
    ? 'Describe a scene...'
    : 'Describe your dream... or leave blank for a surprise.';

  // Process a picked/captured image asset
  async function processPhotoAsset(asset: ImagePicker.ImagePickerAsset) {
    try {
      const compressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: engineConfig.photoPreprocessWidth } }],
        {
          compress: engineConfig.photoPreprocessQuality,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
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

  // Photo picker — opens a themed bottom sheet (camera / library). Replaces the
  // native grey iOS action sheet so it matches the app's dark aesthetic.
  function handlePickPhoto() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhotoSourceOpen(true);
  }

  function handleDream() {
    Keyboard.dismiss();
    // Gate on insufficient sparkles HERE (before navigating) so the user gets the
    // premium gate on this screen and never enters the loading flow on a dream
    // they can't afford. The server charge stays authoritative as a backstop.
    const cost = sparkleCostFrom(imageModels, selectedModelId);
    if (sparkleBalance < cost) {
      showPremiumGate({ kind: 'sparkles', needed: cost, balance: sparkleBalance });
      return;
    }
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
            {/* Photo upload — only in DreamBot mode (photos always use the
                DreamBot engine; Direct mode is text-only, so hide it there). */}
            {!effectiveExactPrompt && (
              <TouchableOpacity
                onPress={handlePickPhoto}
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.accent }}
                hitSlop={6}
              >
                <Ionicons name={hasPhoto ? 'image' : 'camera-outline'} size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Scrollable content */}
        <ScrollView
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: verticalScale(96) }}
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
                  ? 'We’ll invent a fresh scene around you. Works best with a clear single-subject photo.'
                  : 'We’ll keep your pose and restyle it in this medium. Restyle uses one model built for accurate edits, so the model picker doesn’t apply here.'}
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
                maxLength={engineConfig.promptMaxLength}
                multiline
                scrollEnabled
                returnKeyType="default"
              />
            </View>
          )}

          {/* Unified AI-model picker — top-level. The model is orthogonal to the
              engine: any model can render a raw (Direct) prompt, a full DreamBot
              dream, OR a New Scene photo dream (your uploaded face is swapped
              onto a scene the chosen model renders — model-agnostic, like the
              cast photos). Hidden ONLY for Restyle, which is a Kontext img2img
              transform of the photo itself and needs an edit-capable model. */}
          {(!hasPhoto || config.photoStyle === 'new_scene') && (
            <View className="mb-4">
              <ModelPicker
                onChange={setSelectedModelId}
                recommendedModelIds={recommendedModelIds}
                dreamBotMode={!config.useExactPrompt}
              />
            </View>
          )}

          {/* Engine selector — two named engines (no photo attached):
              • DreamBot (config.useExactPrompt = false) — our engine: custom
                mediums/vibes, prompt polish, and cast-photo face swap.
              • Direct (config.useExactPrompt = true) — prompt goes verbatim to
                the chosen AI model, skipping styling + face swap.
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
                  style={{ color: colors.textSecondary, opacity: 0.7, lineHeight: fontScale(16) }}
                >
                  {config.useExactPrompt
                    ? 'Your exact prompt goes straight to the AI model you pick. No DreamBot styling, polish, or likeness.'
                    : 'Custom mediums & vibes, prompt polish, and your saved Dream Cast likeness when you mention yourself.'}
                </Text>
                <TouchableOpacity
                  onPress={openMediumsIntroInfo}
                  activeOpacity={0.6}
                  hitSlop={10}
                  style={{ marginLeft: 8, marginTop: verticalScale(1) }}
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

          {/* Medium/Vibe pills (engine directives). Shown for the DreamBot route
              AND whenever a photo is attached (photo dreams always use the
              engine). Vibe is hidden for Restyle — that path is a Kontext img2img
              edit driven by the medium only. Direct text dreams hide both. */}
          {!effectiveExactPrompt && (
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
                  onPress={openMediumPicker}
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
                          paddingVertical: verticalScale(1),
                          borderRadius: 5,
                          backgroundColor: mediumFaceSwaps
                            ? 'rgba(96,165,250,0.15)'
                            : 'rgba(245,158,11,0.15)',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontScale(8),
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

              {/* Vibe — hidden for Restyle (medium-only Kontext edit). */}
              {!(hasPhoto && config.photoStyle === 'restyle') && (
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
              )}
            </View>
          )}

          {/* Helper hint + Dream button — flow directly under the controls
              (no longer bottom-pinned). This makes the resting layout match the
              keyboard-open position, so the button no longer jumps up/down when
              the keyboard appears, and the dead space below the Medium/Vibe row
              is gone. */}
          <View style={{ marginTop: verticalScale(28) }}>
            {/* Contextual hint — face indicator (will you be in this dream?) when
                you're in the scene, otherwise the generic mode hint. */}
            <View className="flex-row items-center justify-center gap-1.5 mb-2">
              {showFaceHint ? (
                <>
                  <Ionicons name={faceHint.icon} size={15} color={faceHint.color} />
                  <Text
                    className="text-center text-sm font-medium"
                    style={{ color: faceHint.color }}
                  >
                    {faceHint.text}
                  </Text>
                </>
              ) : (
                <Text
                  className="text-center text-sm font-medium"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {contextHint}
                </Text>
              )}
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
                  Dream · {sparkleCostFrom(imageModels, selectedModelId)}
                </Text>
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
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

      {/* First-Create-tap teaching sheet — see effect above. */}
      <CreateIntroSheet visible={introVisible} onClose={() => setIntroVisible(false)} />

      {/* Face-vs-art teaching sheet. Auto-shown the first time Medium is tapped
          (falls through to the picker on dismiss), and re-openable from the (i)
          next to the engine row (just closes on dismiss). */}
      <MediumsIntroSheet
        visible={mediumsIntroVisible}
        onClose={() => {
          setMediumsIntroVisible(false);
          if (openPickerAfterIntro.current) {
            openPickerAfterIntro.current = false;
            setPickerType('medium');
          }
        }}
      />

      {/* Photo source sheet — themed replacement for the native iOS action
          sheet (Take Photo / Choose from Library), matching the dark app UI. */}
      <Modal
        visible={photoSourceOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPhotoSourceOpen(false)}
        onDismiss={runPendingPhotoAction}
      >
        <TouchableOpacity
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          activeOpacity={1}
          onPress={() => setPhotoSourceOpen(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View
              className="rounded-t-3xl px-5 pt-3"
              style={{
                backgroundColor: colors.background,
                paddingBottom: verticalScale(40),
                borderTopWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                className="self-center rounded-full mb-4"
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: colors.border,
                  marginTop: verticalScale(2),
                }}
              />
              <Text className="text-base font-bold mb-3 ml-1" style={{ color: colors.textPrimary }}>
                Add a photo
              </Text>
              {(
                [
                  { icon: 'camera', label: 'Take Photo', action: launchCamera },
                  { icon: 'images', label: 'Choose from Library', action: launchLibrary },
                ] as const
              ).map((opt) => (
                <TouchableOpacity
                  key={opt.label}
                  className="flex-row items-center gap-3 px-4 py-3.5 rounded-xl mb-2.5"
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (Platform.OS === 'ios') {
                      // iOS: the picker can't present while the modal is still
                      // dismissing — launch from the Modal's onDismiss instead.
                      pendingPhotoAction.current = opt.action;
                      setPhotoSourceOpen(false);
                    } else {
                      // Android has no presentation collision; launch directly.
                      setPhotoSourceOpen(false);
                      opt.action();
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    className="w-9 h-9 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.accent + '22' }}
                  >
                    <Ionicons name={opt.icon} size={18} color={colors.accent} />
                  </View>
                  <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                className="items-center py-3.5 rounded-xl mt-1"
                onPress={() => setPhotoSourceOpen(false)}
                activeOpacity={0.7}
              >
                <Text className="text-base font-semibold" style={{ color: colors.textSecondary }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
