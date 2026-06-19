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
  TouchableOpacity,
  Keyboard,
  Platform,
  Modal,
  Linking,
  InteractionManager,
} from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Text, TextInput } from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as nav from '@/lib/navigate';
import { colors, MEDIUM_BADGE } from '@/constants/theme';
import { verticalScale, fontScale } from '@/lib/responsive';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { useDreamStore } from '@/store/dream';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { formatCompact } from '@/lib/formatNumber';
import { Toast } from '@/components/Toast';
import { StylePickerSheet } from '@/components/StylePickerSheet';
import { ModelPicker } from '@/components/ModelPicker';
import { GradientTitle } from '@/components/GradientTitle';
import { GradientButton } from '@/components/GradientButton';
import { showAlert } from '@/components/CustomAlert';
import { CreateIntroSheet, hasSeenCreateIntro } from '@/components/CreateIntroSheet';
import { MediumsIntroSheet, hasSeenMediumsIntro } from '@/components/MediumsIntroSheet';
import { SparkleIntroSheet, hasSeenSparkleIntro } from '@/components/SparkleIntroSheet';
import { sparkleCostFrom, DEFAULT_MODEL_ID } from '@/constants/imageModels';
import { showPremiumGate } from '@/lib/premiumGate';
import { useImageModels } from '@/hooks/useImageModels';
import { useEngineConfig } from '@/hooks/useEngineConfig';

// Sticky medium/vibe — last explicit Create-tab pick, remembered across app
// launches (local, like the useExactPrompt toggle; the model has its own DB
// stickiness). AsyncStorage is the source of truth for the PREFERENCE: it's
// written only on a deliberate pick here, and re-applied on every Create focus
// — so the per-dream reset() and a DLT look-replay (which mutate the shared
// dream store transiently) never overwrite the user's remembered choice.
const SELECTED_MEDIUM_KEY = 'create.selectedMedium.v1';
const SELECTED_VIBE_KEY = 'create.selectedVibe.v1';

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

  const [pickerType, setPickerType] = useState<'medium' | 'vibe' | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState(false);
  const [photoSourceOpen, setPhotoSourceOpen] = useState(false);
  // Keyboard-open tracking, used to collapse the model + medium/vibe controls
  // into a one-line summary while typing (so the selected medium/vibe stay
  // visible and the Dream CTA is one tap away). Core RN Keyboard listeners
  // (not the keyboard-controller reanimated hook, which crashes if it can't
  // bind — see feedback_render_crashes_uncovered_prefer_core_apis). Deferred
  // to after the keyboard animation so the layout swap doesn't jump.
  const [kbOpen, setKbOpen] = useState(false);
  useEffect(() => {
    const s1 = Keyboard.addListener('keyboardDidShow', () =>
      InteractionManager.runAfterInteractions(() => setKbOpen(true))
    );
    const s2 = Keyboard.addListener('keyboardDidHide', () =>
      InteractionManager.runAfterInteractions(() => setKbOpen(false))
    );
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);
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
  // Height of the floating (position:absolute) bottom tab bar. The sticky Dream
  // footer rests at the screen's bottom edge, so without this it sits BEHIND the
  // tab bar when the keyboard is closed — offset it up by exactly this much.
  const tabBarHeight = useBottomTabBarHeight();

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

  // Persisting setters for medium/vibe — store the deliberate pick so it
  // survives app relaunches + the per-dream reset(). Used by the picker below.
  const persistMedium = useCallback(
    (key: string) => {
      setMedium(key);
      AsyncStorage.setItem(SELECTED_MEDIUM_KEY, key).catch((e) => {
        if (__DEV__) console.warn('[create] medium persist failed', e);
      });
    },
    [setMedium]
  );
  const persistVibe = useCallback(
    (key: string) => {
      setVibe(key);
      AsyncStorage.setItem(SELECTED_VIBE_KEY, key).catch((e) => {
        if (__DEV__) console.warn('[create] vibe persist failed', e);
      });
    },
    [setVibe]
  );

  // Re-apply the remembered medium/vibe on every Create focus. Runs on mount
  // (cross-session restore) AND whenever the user returns to the tab — so a
  // reset() after a dream, or a DLT replay that changed the shared store, is
  // overridden back to the user's sticky choice. No-op on first run (no keys).
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          const [m, v] = await Promise.all([
            AsyncStorage.getItem(SELECTED_MEDIUM_KEY),
            AsyncStorage.getItem(SELECTED_VIBE_KEY),
          ]);
          if (cancelled) return;
          if (m) setMedium(m);
          if (v) setVibe(v);
        } catch (e) {
          if (__DEV__) console.warn('[create] medium/vibe rehydrate failed', e);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [setMedium, setVibe])
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

  // First-Dream-tap teaching sheet — the FIRST time the user taps Dream, explain
  // how Sparkles relate to models + dreams, show this dream's cost, and set
  // expectations (AI is unpredictable). "Got it" dismisses + proceeds; shows
  // once. Default the ref to `true` (don't show) until the async flag loads so a
  // fast tap before load never re-traps a user who's already seen it. Re-read on
  // focus so the admin tutorials-reset re-arms it without an app restart.
  const sparkleIntroSeen = useRef(true);
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      hasSeenSparkleIntro().then((seen) => {
        if (!cancelled) sparkleIntroSeen.current = seen;
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );
  const [sparkleIntroVisible, setSparkleIntroVisible] = useState(false);
  const [sparkleIntroCost, setSparkleIntroCost] = useState(0);

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

  // The (i) next to the Mode label opens the teaching sheet, which explains BOTH
  // modes (DreamBot's Real Face / Dream Art looks + Direct), so it's the same in
  // either mode.
  const handleModeInfo = useCallback(() => {
    openMediumsIntroInfo();
  }, [openMediumsIntroInfo]);

  // Derived state
  const hasPhoto = !!config.photoUri;
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
  const modelLabel = imageModels.find((m) => m.id === selectedModelId)?.label ?? 'Flux 1.1 Pro';
  // Collapse the model + medium/vibe controls into a one-line summary while the
  // keyboard is up on any ENGINE dream (DreamBot mode OR a photo) — keeps the
  // selected medium/vibe visible and the Dream CTA one tap away. NOT in Direct
  // mode (no medium/vibe there). Tapping the summary dismisses the keyboard,
  // which restores the full form.
  const collapsed = kbOpen && !effectiveExactPrompt;
  // Whether the selected medium face-swaps (composites real face into scene)
  const selectedMediumRow = dbMediums.find((m) => m.key === config.selectedMedium);
  const mediumFaceSwaps = isSurpriseMedium
    ? config.selectedMedium === 'surprise_me_face'
    : (selectedMediumRow?.face_swaps ?? true);

  // Placeholder text. The no-photo box has room to teach the real-face system:
  // first-person + relationship words pull the user's dream-cast photos (self +
  // plus_one) into the render as a face swap.
  const placeholder = hasPhoto
    ? 'Describe a scene...'
    : 'Describe your dream...\nSay "me", "my wife", or "my friend" to add real faces.\nOr leave blank for a surprise.';

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

  // Double-submit guard: a rapid double-tap on "Dream" was pushing the loading
  // screen twice → two generate() calls → two paid jobs from one prompt
  // (2026-06-15). Ignore a second launch within 2.5s; a legitimate re-create
  // happens only after returning from the loading screen, well past this window.
  const lastLaunchRef = useRef(0);
  function startDream() {
    const now = Date.now();
    if (now - lastLaunchRef.current < 2500) return;
    lastLaunchRef.current = now;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    nav.push('/dream/loading');
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
    // First time they tap Dream (and can afford it): teach how Sparkles work +
    // show this dream's cost. "Got it" marks it seen and proceeds with the dream;
    // shows once, ever. (After the premium gate so an unaffordable dream routes
    // to the paywall, not the tutorial.)
    if (!sparkleIntroSeen.current) {
      sparkleIntroSeen.current = true;
      setSparkleIntroCost(cost);
      setSparkleIntroVisible(true);
      return;
    }
    proceedWithDream();
  }

  // The dream-launch tail (shared by handleDream + the sparkle sheet's "Got it").
  function proceedWithDream() {
    // Empty-prompt confirmation: when the prompt box is shown but blank, the
    // dream is fully random — either a totally surprise scene, or (with a photo
    // in New Scene mode) a random scene invented around the person. Restyle has
    // no prompt box (it just transforms the photo into the medium), so it's
    // exempt. Confirm the random intent before spending sparkles.
    const promptEmpty = !config.userPrompt.trim();
    const promptBoxShown = !(hasPhoto && config.photoStyle === 'restyle');
    if (promptEmpty && promptBoxShown) {
      showAlert(
        'Surprise dream?',
        'No prompt, no problem! DreamBot will dream up something wild and totally unexpected. Ready?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Surprise me', onPress: startDream },
        ]
      );
      return;
    }
    startDream();
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }} edges={['top']}>
      <View className="flex-1">
        {/* Header — centered gradient title (absolutely centered so the
            right-side actions don't push it off-center), matching the shared
            nav-title treatment used across Settings/Inbox/Edit Profile. */}
        <View className="flex-row items-center px-5 py-3">
          <View className="flex-1" />
          <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
            <GradientTitle size={24}>Create</GradientTitle>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => nav.push('/sparkleStore')}
              className="flex-row items-center gap-1.5 px-3.5 h-8 rounded-full"
              style={{
                backgroundColor: 'rgba(167,139,250,0.18)',
                borderWidth: 1,
                borderColor: 'rgba(167,139,250,0.55)',
              }}
            >
              <Ionicons name="sparkles" size={15} color="#A78BFA" />
              <Text className="text-sm font-extrabold" style={{ color: '#A78BFA' }}>
                {formatCompact(sparkleBalance)}
              </Text>
            </TouchableOpacity>
            {/* Photo upload — only in DreamBot mode (photos always use the
                DreamBot engine; Direct mode is text-only, so hide it there). */}
            {!effectiveExactPrompt && (
              <TouchableOpacity
                onPress={handlePickPhoto}
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: '#A78BFA' }}
                hitSlop={6}
              >
                <Ionicons
                  name={hasPhoto ? 'image' : 'camera'}
                  size={16}
                  color="#fff"
                  style={{
                    textShadowColor: 'rgba(0,0,0,0.35)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Scrollable content — KeyboardAwareScrollView keeps the focused prompt
            (and the Dream CTA below it) above the keyboard on every device,
            measuring the real keyboard frame natively instead of guessing. */}
        <KeyboardAwareScrollView
          className="flex-1 px-5"
          bottomOffset={verticalScale(24)}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: tabBarHeight + verticalScale(16) }}
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
                    // Tonal moon-purple when active — matches the DreamBot/Direct
                    // mode tabs so it doesn't compete with the gradient Dream CTA.
                    backgroundColor:
                      config.photoStyle === 'new_scene' ? 'rgba(167,139,250,0.18)' : 'transparent',
                    borderWidth: 1,
                    borderColor:
                      config.photoStyle === 'new_scene' ? 'rgba(167,139,250,0.55)' : 'transparent',
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
                    color={config.photoStyle === 'new_scene' ? '#A78BFA' : colors.textSecondary}
                  />
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: config.photoStyle === 'new_scene' ? '#A78BFA' : colors.textSecondary,
                    }}
                  >
                    New Scene
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      config.photoStyle === 'restyle' ? 'rgba(167,139,250,0.18)' : 'transparent',
                    borderWidth: 1,
                    borderColor:
                      config.photoStyle === 'restyle' ? 'rgba(167,139,250,0.55)' : 'transparent',
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
                    color={config.photoStyle === 'restyle' ? '#A78BFA' : colors.textSecondary}
                  />
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: config.photoStyle === 'restyle' ? '#A78BFA' : colors.textSecondary,
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
                  // automatically when height is fixed.
                  height: 120,
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
          {(!hasPhoto || config.photoStyle === 'new_scene') && !collapsed && (
            <View className="mb-4">
              <ModelPicker onChange={setSelectedModelId} dreamBotMode={!config.useExactPrompt} />
            </View>
          )}

          {/* Collapsed summary — while the keyboard is up on an engine dream, the
              model + mode + medium/vibe controls fold into this one-line summary
              so the selected medium/vibe stay visible and the Dream CTA is one
              tap away. Tapping it dismisses the keyboard, restoring the full
              form. (Restored 2026-06-17 — was removed in f601e81e; now covers
              text DreamBot dreams too, not just photo dreams.) */}
          {collapsed && (
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                Keyboard.dismiss();
              }}
              activeOpacity={0.7}
              className="flex-row items-center justify-between px-4 py-3 rounded-xl mb-4"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View className="flex-1 mr-2">
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.textPrimary }}
                  numberOfLines={1}
                >
                  {modelLabel}
                </Text>
                <Text className="text-xs" style={{ color: colors.textSecondary }} numberOfLines={1}>
                  <Text style={{ color: colors.textMuted ?? colors.textSecondary }}>Medium: </Text>
                  {mediumLabel} ·{' '}
                  <Text style={{ color: colors.textMuted ?? colors.textSecondary }}>Vibe: </Text>
                  {vibeLabel}
                </Text>
              </View>
              <Ionicons name="chevron-expand" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          {/* Engine selector — two named engines (no photo attached):
              • DreamBot (config.useExactPrompt = false) — our engine: custom
                mediums/vibes, prompt polish, and cast-photo face swap.
              • Direct (config.useExactPrompt = true) — prompt goes verbatim to
                the chosen AI model, skipping styling + face swap.
              State is sticky per-user via AsyncStorage (USE_EXACT_PROMPT_KEY).
              Photo path hides this and shows the inline note above (Direct is
              text-only). Hidden while collapsed (keyboard up). */}
          {!hasPhoto && !collapsed && (
            <View className="mb-4">
              {/* Mode label + contextual info icon (DreamBot → medium sheet,
                  Direct → Direct explainer). */}
              <View className="flex-row items-center mb-1.5 ml-1">
                <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                  Mode
                </Text>
                <TouchableOpacity
                  onPress={handleModeInfo}
                  activeOpacity={0.6}
                  hitSlop={10}
                  className="ml-1.5"
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={14}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
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
                    // Tonal moon-purple when active (selected) — a quiet selector,
                    // so it doesn't compete with the gradient Dream CTA. Border on
                    // both (transparent when inactive) to avoid a 1px toggle shift.
                    backgroundColor: !config.useExactPrompt
                      ? 'rgba(167,139,250,0.18)'
                      : 'transparent',
                    borderWidth: 1,
                    borderColor: !config.useExactPrompt ? 'rgba(167,139,250,0.55)' : 'transparent',
                  }}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleUseExactPrompt(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: !config.useExactPrompt ? '#A78BFA' : colors.textSecondary }}
                  >
                    DreamBot
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center justify-center py-2 rounded-lg"
                  style={{
                    flex: 1,
                    backgroundColor: config.useExactPrompt
                      ? 'rgba(167,139,250,0.18)'
                      : 'transparent',
                    borderWidth: 1,
                    borderColor: config.useExactPrompt ? 'rgba(167,139,250,0.55)' : 'transparent',
                  }}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleUseExactPrompt(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: config.useExactPrompt ? '#A78BFA' : colors.textSecondary }}
                  >
                    Direct
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Medium/Vibe pills (engine directives). Shown for the DreamBot route
              AND whenever a photo is attached (photo dreams always use the
              engine). Vibe is hidden for Restyle — that path is a Kontext img2img
              edit driven by the medium only. Direct text dreams hide both.
              Collapsed into the summary above while the keyboard is up. */}
          {!effectiveExactPrompt && !collapsed && (
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
                    {/* FACE/ART tag indicates whether the medium face-swaps. Hidden
                        in uploaded-picture mode (hasPhoto) — photo dreams don't run
                        the face swap, so the tag would be misleading there. */}
                    {(isSurpriseMedium || selectedMediumRow) && !hasPhoto && (
                      <View
                        style={{
                          paddingHorizontal: 5,
                          paddingVertical: verticalScale(1),
                          borderRadius: 5,
                          backgroundColor: mediumFaceSwaps
                            ? MEDIUM_BADGE.face.bg
                            : MEDIUM_BADGE.art.bg,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontScale(8),
                            fontWeight: '700',
                            color: mediumFaceSwaps
                              ? MEDIUM_BADGE.face.color
                              : MEDIUM_BADGE.art.color,
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
        </KeyboardAwareScrollView>

        {/* Dream CTA — pinned in a sticky footer that rides ABOVE the keyboard
            on every device (KeyboardStickyView reads the real native keyboard
            frame). The form scrolls beneath it, so the button is always one tap
            away while typing — no collapsing of controls needed.
            offset.closed lifts it above the floating tab bar when the keyboard
            is down; when the keyboard is up it covers the tab bar, so the footer
            sits right above the keyboard (opened offset 0). */}
        <KeyboardStickyView offset={{ closed: -tabBarHeight }}>
          <View
            className="px-5"
            style={{
              backgroundColor: colors.background,
              paddingTop: verticalScale(10),
              paddingBottom: verticalScale(22),
            }}
          >
            {/* Dream button — the primary gradient CTA. Cost lives in the model
                selector now, so the CTA stays clean. */}
            <GradientButton label="Dream" variant="solid" onPress={handleDream} />
          </View>
        </KeyboardStickyView>
      </View>

      {/* Style picker bottom sheet */}
      <StylePickerSheet
        visible={pickerType !== null}
        type={pickerType ?? 'medium'}
        selected={pickerType === 'vibe' ? config.selectedVibe : config.selectedMedium}
        onSelect={(key) => {
          if (pickerType === 'vibe') persistVibe(key);
          else persistMedium(key);
        }}
        onClose={() => setPickerType(null)}
        options={pickerType === 'vibe' ? vibeOptions : mediumOptions}
        mediumIsFace={mediumFaceSwaps}
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

      {/* First-Dream-tap sparkle teaching sheet. "Got it" dismisses + proceeds
          with the dream. Shows once (flag set on the sheet's mount). */}
      <SparkleIntroSheet
        visible={sparkleIntroVisible}
        cost={sparkleIntroCost}
        balance={sparkleBalance}
        onClose={() => {
          setSparkleIntroVisible(false);
          proceedWithDream();
        }}
      />

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
                    style={{ backgroundColor: 'rgba(167,139,250,0.18)' }}
                  >
                    <Ionicons name={opt.icon} size={18} color="#A78BFA" />
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
