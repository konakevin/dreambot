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

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  Modal,
  Linking,
  LayoutAnimation,
  useWindowDimensions,
  type KeyboardEvent,
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
import { verticalScale, fontScale, isTabletDevice } from '@/lib/responsive';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { hasAiConsent } from '@/lib/aiConsent';
import { detectCastRoles } from '@/lib/selfInsertDetect';
import { showAiConsent } from '@/components/AiConsentSheet';
import { useDreamMediums, useDreamVibes } from '@/hooks/useDreamStyles';
import { useDreamStore } from '@/store/dream';
import { useSparkleBalance } from '@/hooks/useSparkles';
import { formatCompact } from '@/lib/formatNumber';
import { Toast } from '@/components/Toast';
import { StylePickerSheet } from '@/components/StylePickerSheet';
import { ModelPicker } from '@/components/ModelPicker';
import {
  RestyleModelPicker,
  DEFAULT_RESTYLE_MODEL_ID,
  resolveRestyleCost,
} from '@/components/RestyleModelPicker';
import { GradientTitle } from '@/components/GradientTitle';
import { GradientButton } from '@/components/GradientButton';
import { showAlert } from '@/components/CustomAlert';
import { CreateIntroSheet, hasSeenCreateIntro } from '@/components/CreateIntroSheet';
import {
  MediumsIntroSheet,
  hasSeenMediumsIntro,
  markMediumsIntroSeen,
} from '@/components/MediumsIntroSheet';
import { SparkleIntroSheet, hasSeenSparkleIntro } from '@/components/SparkleIntroSheet';
import { sparkleCostFrom, DEFAULT_MODEL_ID } from '@/constants/imageModels';
import { showPremiumGate } from '@/lib/premiumGate';
import { useImageModels } from '@/hooks/useImageModels';
import { useEngineConfig } from '@/hooks/useEngineConfig';
import { useConfirmSurpriseDream } from '@/hooks/useConfirmSurpriseDream';

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
  const setMode = useDreamStore((s) => s.setMode);
  const setMedium = useDreamStore((s) => s.setMedium);
  const setVibe = useDreamStore((s) => s.setVibe);
  const setPrompt = useDreamStore((s) => s.setPrompt);
  const setPhotoStyle = useDreamStore((s) => s.setPhotoStyle);
  const setNewSceneTier = useDreamStore((s) => s.setNewSceneTier);
  const setUseExactPrompt = useDreamStore((s) => s.setUseExactPrompt);
  const setForceModel = useDreamStore((s) => s.setForceModel);

  const { data: sparkleBalance = 0 } = useSparkleBalance();
  const { data: dbMediums = [] } = useDreamMediums();
  const { data: dbVibes = [] } = useDreamVibes();
  // Cross-device pref: show the "Surprise dream?" confirmation before an
  // empty-prompt dream. The dialog's "Don't show again" checkbox + Settings both
  // write it. Defaults true while loading, so we never skip it prematurely.
  const { confirm: confirmSurprise, setConfirm: setConfirmSurprise } = useConfirmSurpriseDream();

  const [pickerType, setPickerType] = useState<'medium' | 'vibe' | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState(false);
  const [photoSourceOpen, setPhotoSourceOpen] = useState(false);
  // Keyboard-open tracking, used to collapse the model + medium/vibe controls
  // into a one-line summary while typing (so the selected medium/vibe stay
  // visible and the Dream CTA is one tap away). Core RN Keyboard listeners
  // (not the keyboard-controller reanimated hook, which crashes if it can't
  // bind — see feedback_render_crashes_uncovered_prefer_core_apis).
  //
  // iOS listens to keyboardWILLShow/Hide — they fire at animation START and
  // carry the keyboard's duration, which we hand to LayoutAnimation so the
  // collapse/expand slides in lockstep with the keyboard. The old
  // keyboardDidShow + runAfterInteractions pair waited for the keyboard to
  // fully land, then hard-swapped the layout — the "keyboard settles, then
  // the controls pop a beat later" jank (Kevin 2026-07-03). Android has no
  // will* events, so it keeps did* (and still gets the animated swap).
  const [kbOpen, setKbOpen] = useState(false);
  // Live keyboard height (from the native event) — reserved as bottom padding so
  // the flex-filled prompt stretches down to the keyboard's top, not behind it.
  const [kbHeight, setKbHeight] = useState(0);
  // Measured height of the sticky Dream CTA footer that floats above the
  // keyboard. Used to compute the exact prompt height (below).
  const [footerHeight, setFooterHeight] = useState(0);
  // Window Y of the prompt box's top edge (measured in window coords). With the
  // window height + keyboard + Dream-CTA heights, this lets us compute an EXACT
  // prompt height that stretches to just above the Dream button, instead of
  // relying on flaky flex-through-scrollview behavior.
  const promptWrapRef = useRef<View>(null);
  const [promptTopY, setPromptTopY] = useState(0);
  const measurePromptTop = useCallback(() => {
    promptWrapRef.current?.measureInWindow((_x, y) => {
      if (y > 0) setPromptTopY(y);
    });
  }, []);
  // Re-measure when the keyboard toggles — the folded controls change the prompt's
  // top. rAF lets the collapse layout settle first.
  useEffect(() => {
    const id = requestAnimationFrame(measurePromptTop);
    return () => cancelAnimationFrame(id);
  }, [kbOpen, measurePromptTop]);
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const onToggle = (open: boolean) => (e: KeyboardEvent) => {
      if (open && e?.endCoordinates?.height) setKbHeight(e.endCoordinates.height);
      LayoutAnimation.configureNext({
        duration: e?.duration && e.duration > 0 ? e.duration : 250,
        update: { type: LayoutAnimation.Types.keyboard },
        create: {
          type: LayoutAnimation.Types.keyboard,
          property: LayoutAnimation.Properties.opacity,
        },
        delete: {
          type: LayoutAnimation.Types.keyboard,
          property: LayoutAnimation.Properties.opacity,
        },
      });
      setKbOpen(open);
    };
    const s1 = Keyboard.addListener(showEvt, onToggle(true));
    const s2 = Keyboard.addListener(hideEvt, onToggle(false));
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

  // Restyle-scoped model pick (Kontext default / Nano Banana Pro) — separate
  // state from selectedModelId ON PURPOSE: restyle is img2img with its own
  // 2-model catalog, and its pick must never overwrite the user's main model.
  // The force_model effect below (after isRestyle resolves) routes whichever
  // pick applies to the store.
  const [restyleModelId, setRestyleModelId] = useState(DEFAULT_RESTYLE_MODEL_ID);

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
  // "Dream this again" hand-off (owner-only, imageLongPress → PostActionSheet):
  // reload a past dream's saved inputs into Create, editable. Consumed + cleared
  // once here. Applied to the store (prompt/medium/vibe) + the local model
  // picker; suppresses the sticky rehydrate below for this focus so the preset
  // wins WITHOUT overwriting the user's sticky Surprise-Me default.
  const presetJustAppliedRef = useRef(false);
  useFocusEffect(
    useCallback(() => {
      const preset = useDreamStore.getState().pendingCreatePreset;
      if (!preset) return;
      useDreamStore.getState().setPendingCreatePreset(null);
      presetJustAppliedRef.current = true;
      clearPhoto(); // reload as a text dream — the original photo isn't reusable
      setMode('prompt');
      setPrompt(preset.prompt);
      setMedium(preset.medium);
      setVibe(preset.vibe);
      // Only preselect the model if it's still a known/available picker option.
      if (preset.model && imageModels.some((m) => m.id === preset.model)) {
        setSelectedModelId(preset.model);
      }
    }, [clearPhoto, setMode, setPrompt, setMedium, setVibe, imageModels])
  );

  useFocusEffect(
    useCallback(() => {
      // A "Dream this again" preset just set medium/vibe explicitly — don't let
      // the sticky rehydrate clobber it. Applies for this one focus only.
      if (presetJustAppliedRef.current) {
        presetJustAppliedRef.current = false;
        return;
      }
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

  // Open the medium picker. The face-vs-art intro no longer auto-pops on the
  // first tap — opening the picker just dismisses it for good (it's available on
  // demand via the (i) icon). Persist the seen flag so it never auto-shows.
  const openMediumPicker = useCallback(() => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!mediumsIntroSeen.current) {
      mediumsIntroSeen.current = true;
      void markMediumsIntroSeen();
    }
    setPickerType('medium');
  }, []);

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
  // Build options lists with Surprise Me prepended.
  //
  // RESTYLE offers only the curated restyle-eligible mediums (client_meta.
  // restyle_enabled, migration 294) — many mediums restyle badly (near-photoreal
  // ones go uncanny). It's an explicit pick (no Surprise Me). New Scene shows the
  // full catalog.
  const isRestyle = hasPhoto && config.photoStyle === 'restyle';
  const isNewScene = hasPhoto && config.photoStyle === 'new_scene';
  // Pool-managed restyle mediums (LEGO / Vinyl): they run the flux-dev rebuild
  // path with a curated Flux pool (client_meta.restyle_models, migration 301)
  // because Kontext can't reshape a head into a minifigure — no model choice
  // there, so the restyle picker hides and no force_model is sent.
  const restyleMeta = isRestyle
    ? dbMediums.find((m) => m.key === config.selectedMedium)?.client_meta
    : null;
  const restylePoolManaged =
    Array.isArray(restyleMeta?.restyle_models) && restyleMeta.restyle_models.length > 0;
  const restyleMediums = dbMediums.filter((m) => m.client_meta?.restyle_enabled === true);
  const mediumOptions = isRestyle
    ? restyleMediums
    : [{ key: 'surprise_me', label: 'Surprise Me' }, ...dbMediums];
  const vibeOptions = [{ key: 'surprise_me', label: 'Surprise Me' }, ...dbVibes];

  // Keep the active medium valid for restyle: entering Restyle with a non-eligible
  // medium (e.g. Photography) snaps to a sensible restyle default. Transient
  // (setMedium, not persistMedium) so the New Scene sticky preference is preserved
  // and restored when they leave restyle.
  const restyleMediumKeys = restyleMediums.map((m) => m.key);
  const restyleKeysSig = restyleMediumKeys.join(',');
  useEffect(() => {
    if (!isRestyle || restyleMediumKeys.length === 0) return;
    // Surprise tokens are VALID in restyle — they resolve at submit time to a
    // random restyle-eligible medium (useDreamCreate). Snapping them here was
    // the "Surprise Me always becomes Watercolor" bug (2026-07-06): the token
    // isn't in restyleMediumKeys, so this effect instantly overwrote it.
    if (
      config.selectedMedium === 'surprise_me_face' ||
      config.selectedMedium === 'surprise_me_art'
    ) {
      return;
    }
    if (!restyleMediumKeys.includes(config.selectedMedium)) {
      setMedium(restyleMediumKeys.includes('watercolor') ? 'watercolor' : restyleMediumKeys[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRestyle, config.selectedMedium, restyleKeysSig, setMedium]);

  const isSurpriseMedium =
    config.selectedMedium === 'surprise_me_face' || config.selectedMedium === 'surprise_me_art';
  const mediumLabel = isSurpriseMedium
    ? 'Surprise Me'
    : (mediumOptions.find((m) => m.key === config.selectedMedium)?.label ?? config.selectedMedium);
  const vibeLabel =
    vibeOptions.find((v) => v.key === config.selectedVibe)?.label ?? config.selectedVibe;
  const modelLabel = imageModels.find((m) => m.id === selectedModelId)?.label ?? 'Flux 1.1 Pro';
  // Compact one-line summary of the collapsed engine controls, shown while the
  // keyboard is up so the prompt can take the freed vertical space. Text dreams
  // fold Model + Mode; New Scene folds the mode toggle + likeness tier.
  const collapsedEngineSummary = isNewScene
    ? `New Scene · ${config.newSceneTier === 'best' ? 'Best likeness' : 'Standard'}`
    : `${modelLabel} · ${config.useExactPrompt ? 'Direct' : 'DreamBot'}`;
  // Phone: the prompt is the last field and stretches down to the Dream CTA
  // (keyboard-up: down to the keyboard). iPad keeps its centered fixed-height
  // card, so it opts out.
  const fillPrompt = !isTabletDevice;
  // EXACT prompt height so its bottom lands just above the Dream button on any
  // screen size: (Dream-button top) − (prompt top) − gap. The Dream button rides
  // above the keyboard when it's up, above the tab bar when it's down.
  const { height: windowHeight } = useWindowDimensions();
  const dreamButtonTop = windowHeight - (kbOpen ? kbHeight : tabBarHeight) - footerHeight;
  const computedPromptHeight =
    fillPrompt && promptTopY > 0
      ? Math.max(verticalScale(120), dreamButtonTop - promptTopY - verticalScale(20))
      : undefined;
  // This dream's sparkle cost — shown next to the model name so the price is
  // always visible. Restyle
  // charges by ITS OWN picked model (Kontext 1 / NB Pro 5, sent as force_model
  // — enqueue-dream prices getSparkleCost(force_model)); pool-managed restyle
  // mediums (LEGO/Vinyl) send no force_model and stay at the flat base cost.
  const sparkleCost = isNewScene
    ? // New Scene is flat-priced by tier server-side (the model picker doesn't
      // apply); Best-likeness routes to Nano Banana Pro at the higher price.
      config.newSceneTier === 'best'
      ? engineConfig.newScenePriceBest
      : engineConfig.newScenePriceStandard
    : isRestyle
      ? restylePoolManaged
        ? engineConfig.baseSparkleCost
        : // DB-preferred (matches enqueue-dream's charge); catalog is the fallback.
          resolveRestyleCost(imageModels, restyleModelId)
      : sparkleCostFrom(imageModels, selectedModelId);
  // The forced model routes by mode: Restyle sends the restyle-scoped pick
  // (Kontext / NB Pro; nothing for pool-managed LEGO/Vinyl, which keep their
  // curated Flux pool), everything else sends the main picker's model. The
  // server charges getSparkleCost(force_model), so the cost is the model's
  // tier — matching the Dream button.
  useEffect(() => {
    if (isRestyle) {
      setForceModel(restylePoolManaged ? null : restyleModelId);
    } else {
      setForceModel(selectedModelId);
    }
  }, [isRestyle, restylePoolManaged, restyleModelId, selectedModelId, setForceModel]);

  // Keyboard handling is fully scrollable (Instagram-style): the form shifts up
  // and stays scrollable so every control below the prompt is reachable while
  // typing, and a drag dismisses the keyboard. No collapse-to-summary — that
  // custom fold hid controls and grew fragile as the form did. `kbOpen` only
  // drives the extra bottom padding that lets the last field clear the sticky
  // Dream CTA (see the KeyboardAwareScrollView below).
  // Whether the selected medium face-swaps (composites real face into scene)
  const selectedMediumRow = dbMediums.find((m) => m.key === config.selectedMedium);
  const mediumFaceSwaps = isSurpriseMedium
    ? config.selectedMedium === 'surprise_me_face'
    : (selectedMediumRow?.face_swaps ?? true);
  // Live cast detection on the prompt — powers the face lamp on the Medium
  // label. Client mirror of the engine's detector (lib/selfInsertDetect.ts)
  // fed the same live-tunable engine_config word lists, so the indicator and
  // the render agree on what counts as a self-reference.
  const promptCastRoles = useMemo(
    () =>
      detectCastRoles(config.userPrompt, {
        relationshipWords: engineConfig.relationshipWords,
        petWords: engineConfig.petWords,
        selfRefRegex: engineConfig.selfRefRegex,
      }),
    [
      config.userPrompt,
      engineConfig.relationshipWords,
      engineConfig.petWords,
      engineConfig.selfRefRegex,
    ]
  );
  // The indicator is a FACE lamp: pets are cast-injected but not face-swapped,
  // so a pet-only reference ("my dog camping") stays gray. New Scene photo
  // dreams always cast the uploaded photo's face. Direct/Restyle never swap
  // (the icon's container renders only for engine dreams, so it's hidden there).
  const faceCastDetected = promptCastRoles.has('self') || promptCastRoles.has('plus_one');
  const faceSwapLit = hasPhoto ? config.photoStyle === 'new_scene' : faceCastDetected;

  // Placeholder text. Mode-dependent: Direct (use_exact_prompt) sends the prompt
  // verbatim to the model with NO transforms on our side — no face swap — so it
  // must NOT teach the real-face "me / my wife" trick (that does nothing there).
  // DreamBot mode runs the engine: the no-photo box teaches the real-face system
  // (first-person + relationship words pull the user's dream-cast photos — self +
  // plus_one — into the render as a face swap).
  const placeholder = effectiveExactPrompt
    ? 'Describe any scene. Your prompt goes straight to the model. No Dream Cast, mediums, or vibes in Direct mode.'
    : hasPhoto
      ? 'Describe a scene...'
      : 'Describe any dream. Say "me" or "my partner" to paint your Dream Cast in, or leave blank for a surprise.';

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

  // App Store 5.1.2: consent before a Create photo is sent to AI (one-and-done).
  async function ensurePhotoConsent(): Promise<boolean> {
    if (await hasAiConsent()) return true;
    return showAiConsent();
  }

  async function launchLibrary() {
    if (!(await ensurePhotoConsent())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]) {
      await processPhotoAsset(result.assets[0]);
    }
  }

  async function launchCamera() {
    if (!(await ensurePhotoConsent())) return;
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
    // Use the mode-aware cost (restyle = flat base cost — see sparkleCost above).
    if (sparkleBalance < sparkleCost) {
      showPremiumGate({ kind: 'sparkles', needed: sparkleCost, balance: sparkleBalance });
      return;
    }
    // First time they tap Dream (and can afford it): teach how Sparkles work +
    // show this dream's cost. "Got it" marks it seen and proceeds with the dream;
    // shows once, ever. (After the premium gate so an unaffordable dream routes
    // to the paywall, not the tutorial.)
    if (!sparkleIntroSeen.current) {
      sparkleIntroSeen.current = true;
      setSparkleIntroCost(sparkleCost);
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
    // Skip the dialog entirely if the user turned it off (checkbox or Settings).
    if (promptEmpty && promptBoxShown && confirmSurprise) {
      showAlert(
        'Surprise dream?',
        'No prompt, no problem. DreamBot will dream up a surprise for you. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Surprise me',
            onPress: (dontShowAgain) => {
              if (dontShowAgain) void setConfirmSurprise(false);
              startDream();
            },
          },
        ],
        { checkbox: { label: "Don't show this again" } }
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
            above the keyboard AND lets the whole form scroll under it, so every
            control below the prompt (Medium/Vibe/tier) is reachable while typing.
            `keyboardDismissMode="interactive"` gives the native drag-to-dismiss
            (Instagram-style) instead of dismissing the moment a scroll begins. */}
        <KeyboardAwareScrollView
          className="flex-1 px-5"
          bottomOffset={footerHeight + verticalScale(16)}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          // No rubber-banding — the prompt is sized to fit exactly, so the form
          // should not over-scroll into empty space.
          bounces={false}
          onLayout={measurePromptTop}
          contentContainerStyle={[
            {
              // The prompt is sized to reach the Dream CTA, so the content fits;
              // only a small bottom gap is needed (tab-bar clearance when the
              // keyboard is down).
              paddingBottom: kbOpen ? verticalScale(8) : tabBarHeight + verticalScale(16),
            },
            // iPad: vertically center the form + CTA group so a short form isn't
            // top-anchored above a big empty void (no-op on phone).
            isTabletDevice && { flexGrow: 1, justifyContent: 'center' },
          ]}
        >
          {/* iPad: keep the form a centered ~600 column instead of stretching the
              fields edge-to-edge (no-op on phone). */}
          <ResponsiveContainer
            maxWidth={600}
            style={[
              { width: '100%' },
              // iPad: contain the centered form group in a subtle card (faint
              // lift + defining border) so it reads as an intentional panel
              // rather than controls floating in a void (no-op on phone).
              isTabletDevice && {
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 24,
                padding: 24,
              },
            ]}
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

            {/* Photo mode toggle — only when a photo is attached. Folds away while
              the keyboard is up (collapsed into the summary row below the pickers)
              so the prompt can take the freed space. */}
            {hasPhoto && !kbOpen && (
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
                        config.photoStyle === 'new_scene'
                          ? 'rgba(167,139,250,0.18)'
                          : 'transparent',
                      borderWidth: 1,
                      borderColor:
                        config.photoStyle === 'new_scene'
                          ? 'rgba(167,139,250,0.55)'
                          : 'transparent',
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
                {/* Mode subtext — a quiet one-liner explaining the mode. Muted so
                  it reads as a hint, not a headline. */}
                <Text
                  className="mt-1.5 px-1"
                  style={{
                    color: colors.textSecondary,
                    fontSize: fontScale(12.5),
                    lineHeight: fontScale(17),
                  }}
                >
                  {config.photoStyle === 'new_scene'
                    ? 'Reimagines your photo into a new scene you describe.'
                    : 'Repaints your photo, keeping its composition.'}
                </Text>

                {/* New Scene — likeness tier (Standard vs Best-likeness / Nano
                  Banana Pro), which the server maps to the reference model +
                  price. */}
                {config.photoStyle === 'new_scene' && (
                  <View className="mt-3">
                    <View
                      className="flex-row rounded-xl p-1"
                      style={{
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      {[
                        {
                          tier: 'standard' as const,
                          label: 'Standard',
                          price: engineConfig.newScenePriceStandard,
                        },
                        {
                          tier: 'best' as const,
                          label: 'Best likeness',
                          price: engineConfig.newScenePriceBest,
                        },
                      ].map((opt) => {
                        const active = config.newSceneTier === opt.tier;
                        return (
                          <TouchableOpacity
                            key={opt.tier}
                            className="flex-1 flex-row items-center justify-center gap-1.5 py-2 rounded-lg"
                            style={{
                              backgroundColor: active ? 'rgba(167,139,250,0.18)' : 'transparent',
                              borderWidth: 1,
                              borderColor: active ? 'rgba(167,139,250,0.55)' : 'transparent',
                            }}
                            onPress={() => {
                              Haptics.selectionAsync();
                              setNewSceneTier(opt.tier);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text
                              className="text-xs font-semibold"
                              style={{ color: active ? '#A78BFA' : colors.textSecondary }}
                            >
                              {opt.label}
                            </Text>
                            <View className="flex-row items-center">
                              <Ionicons
                                name="sparkles"
                                size={10}
                                color={active ? '#A78BFA' : colors.textSecondary}
                              />
                              <Text
                                className="text-xs"
                                style={{
                                  color: active ? '#A78BFA' : colors.textSecondary,
                                  marginLeft: 2,
                                }}
                              >
                                {opt.price}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Unified AI-model picker — top-level. The model is orthogonal to the
              engine: any model can render a raw (Direct) prompt or a full DreamBot
              dream. Hidden for BOTH photo modes: New Scene routes to a fixed
              reference model (Standard/Best tier picks it), and Restyle is an
              img2img transform with its OWN edit-capable picker below.
              Folds into the summary row while the keyboard is up. */}
            {!hasPhoto && !kbOpen && (
              <View className="mb-4">
                <ModelPicker onChange={setSelectedModelId} dreamBotMode={!config.useExactPrompt} />
              </View>
            )}

            {/* Restyle model picker — Kontext (default, 1✦) vs Nano Banana Pro
              (5✦, strongest likeness). Separate from the main picker: img2img
              models only, own sticky pick, never touches the main model.
              Hidden for pool-managed mediums (LEGO/Vinyl — flux-dev rebuild
              path with a curated pool, no choice to make). */}
            {isRestyle && !restylePoolManaged && (
              <View className="mb-4">
                <RestyleModelPicker onChange={setRestyleModelId} />
              </View>
            )}

            {/* Engine selector — two named engines (no photo attached):
              • DreamBot (config.useExactPrompt = false) — our engine: custom
                mediums/vibes, prompt polish, and cast-photo face swap.
              • Direct (config.useExactPrompt = true) — prompt goes verbatim to
                the chosen AI model, skipping styling + face swap.
              State is sticky per-user via AsyncStorage (USE_EXACT_PROMPT_KEY).
              Photo path hides this and shows the inline note above (Direct is
              text-only). Folds into the summary row while the keyboard is up. */}
            {!hasPhoto && !kbOpen && (
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
                    <Ionicons name="information-circle-outline" size={16} color={colors.accent} />
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
                      borderColor: !config.useExactPrompt
                        ? 'rgba(167,139,250,0.55)'
                        : 'transparent',
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

            {/* Collapsed engine summary — replaces the folded controls (Model +
              Mode for text; New Scene toggle + tier for photo) while the keyboard
              is up, so their vertical space goes to the prompt. Tap to dismiss the
              keyboard and bring the full controls back. */}
            {kbOpen && !isRestyle && (
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
                <Text
                  className="text-sm font-semibold flex-shrink mr-2"
                  style={{ color: colors.textPrimary }}
                  numberOfLines={1}
                >
                  {collapsedEngineSummary}
                </Text>
                <View className="flex-row items-center">
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 8,
                      paddingHorizontal: 6,
                      paddingVertical: verticalScale(2),
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <Ionicons name="sparkles" size={11} color="#A78BFA" />
                    <Text
                      style={{
                        color: '#A78BFA',
                        fontSize: fontScale(11),
                        fontWeight: '700',
                        marginLeft: 2,
                      }}
                    >
                      {sparkleCost}
                    </Text>
                  </View>
                  <Ionicons name="chevron-expand" size={16} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            )}

            {/* Medium/Vibe pills (engine directives). Shown for the DreamBot route
              AND whenever a photo is attached (photo dreams always use the
              engine). Vibe is hidden for Restyle — that path is a Kontext img2img
              edit driven by the medium only. Direct text dreams hide both. */}
            {!effectiveExactPrompt && (
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1.5 ml-1">
                    <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                      Medium
                    </Text>
                    {/* Live face-swap lamp. Gray = no cast reference in the
                      prompt; lit = this dream casts YOU, colored by the medium
                      family (Real Face teal / Dream Art pink — the MEDIUM_BADGE
                      colors from the medium picker). New Scene photo dreams are
                      always lit. Hidden for Restyle (img2img — never swaps; the
                      Direct case is already excluded by this section's guard).
                      Tap opens the face-vs-art teaching sheet. */}
                    {!isRestyle && (
                      <TouchableOpacity
                        onPress={handleModeInfo}
                        activeOpacity={0.7}
                        hitSlop={10}
                        className="ml-1.5"
                      >
                        <Ionicons
                          name={faceSwapLit ? 'happy' : 'happy-outline'}
                          size={15}
                          color={
                            faceSwapLit
                              ? mediumFaceSwaps
                                ? MEDIUM_BADGE.face.color
                                : MEDIUM_BADGE.art.color
                              : (colors.textMuted ?? colors.textSecondary)
                          }
                        />
                      </TouchableOpacity>
                    )}
                  </View>
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
                      {/* FACE/ART tag — shown in ALL modes (text, New Scene, Restyle)
                        so the medium's type is always visible on the picker. */}
                      {(isSurpriseMedium || selectedMediumRow) && (
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

                {/* Vibe — shown for Restyle too; the selected vibe modulates the
                  restyle (Kevin's choice to keep vibe applying). */}
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

            {/* Prompt input — hidden when a photo is in Restyle mode, since
              that path is medium+vibe only (no prompt influence). The
              underlying `config.userPrompt` is preserved so flipping back
              to New Scene restores whatever the user had typed. */}
            {!(hasPhoto && config.photoStyle === 'restyle') && (
              <View
                ref={promptWrapRef}
                onLayout={measurePromptTop}
                className="rounded-xl mb-4"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  // Phone: exact computed height so the box bottom lands just above
                  // the Dream button (down to the keyboard when it's up). Falls back
                  // to a scaled default until the first measure lands. iPad: a
                  // scaled fixed height in its centered card.
                  height: fillPrompt
                    ? (computedPromptHeight ?? verticalScale(160))
                    : verticalScale(144),
                }}
              >
                <TextInput
                  ref={promptRef}
                  className="px-4 py-4"
                  style={{
                    // Responsive type instead of fixed text-base, at a smaller
                    // 14pt base — 16 read oversized even at the design size
                    // (Kevin 2026-07-02). Placeholder overlay below must stay in
                    // lockstep so the hint aligns exactly where typed text begins.
                    fontSize: fontScale(14),
                    lineHeight: fontScale(20),
                    color: colors.textPrimary,
                    // Fill the wrapper (which carries the scaled/computed height);
                    // long prompts scroll internally.
                    flex: 1,
                    textAlignVertical: 'top',
                  }}
                  value={config.userPrompt}
                  onChangeText={setPrompt}
                  maxLength={engineConfig.promptMaxLength}
                  multiline
                  scrollEnabled
                  returnKeyType="default"
                />
                {/* Custom placeholder overlay instead of the native one. iOS's
                  multiline placeholder ignores textAlignVertical:'top' until focus
                  (it floats vertically centered) AND won't re-wrap when the text
                  changes while unfocused. A top-aligned Text overlay (taps pass
                  through) sits exactly where typed text begins, so the hint is
                  stable across the photo toggle and on focus. */}
                {!config.userPrompt && (
                  <View
                    pointerEvents="none"
                    className="px-4 py-4"
                    style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
                  >
                    <Text
                      style={{
                        fontSize: fontScale(14),
                        lineHeight: fontScale(20),
                        color: colors.textMuted ?? '#6B7280',
                      }}
                    >
                      {placeholder}
                    </Text>
                  </View>
                )}
                {/* Footer: Clear + live character count. Only rendered when the
                  box has text (so an empty box stays clean and shows just the
                  placeholder). Sits below the input with a hairline divider so
                  it never overlaps the typed prompt. Clear keeps focus so you
                  can immediately retype. */}
                {config.userPrompt.length > 0 && (
                  <View
                    className="flex-row items-center justify-end px-4 py-2"
                    style={{ borderTopWidth: 1, borderTopColor: colors.border, gap: 14 }}
                  >
                    <Text
                      style={{
                        fontSize: fontScale(12),
                        fontVariant: ['tabular-nums'],
                        color:
                          config.userPrompt.length >= engineConfig.promptMaxLength
                            ? colors.error
                            : (colors.textMuted ?? '#6B7280'),
                      }}
                    >
                      {config.userPrompt.length} / {engineConfig.promptMaxLength}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setPrompt('');
                        promptRef.current?.focus();
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 12, right: 8 }}
                      activeOpacity={0.6}
                    >
                      <Text
                        style={{
                          fontSize: fontScale(13),
                          fontWeight: '600',
                          color: colors.textSecondary,
                        }}
                      >
                        Clear
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* iPad: the Dream CTA lives WITH the form as one centered group,
                instead of pinned to the far bottom like the phone sticky footer. */}
            {isTabletDevice && (
              <View style={{ marginTop: verticalScale(28) }}>
                <GradientButton label="Dream" variant="solid" onPress={handleDream} />
              </View>
            )}
          </ResponsiveContainer>
        </KeyboardAwareScrollView>

        {/* Dream CTA — pinned in a sticky footer that rides ABOVE the keyboard
            on every device (KeyboardStickyView reads the real native keyboard
            frame). The form scrolls beneath it, so the button is always one tap
            away while typing — no collapsing of controls needed.
            offset.closed lifts it above the floating tab bar when the keyboard
            is down; when the keyboard is up it covers the tab bar, so the footer
            sits right above the keyboard (opened offset 0). */}
        {!isTabletDevice && (
          <KeyboardStickyView offset={{ closed: -tabBarHeight }}>
            <View
              className="px-5"
              onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
              style={{
                backgroundColor: colors.background,
                paddingTop: verticalScale(10),
                paddingBottom: verticalScale(22),
              }}
            >
              {/* Dream button — the primary gradient CTA. Cost lives in the model
                selector now, so the CTA stays clean. iPad: capped to the same
                centered 600 column as the form so it isn't absurdly wide. */}
              <ResponsiveContainer maxWidth={600}>
                <GradientButton label="Dream" variant="solid" onPress={handleDream} />
              </ResponsiveContainer>
            </View>
          </KeyboardStickyView>
        )}
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
              {/* Sheet bg stays full-bleed; content capped to the standardized
                  600 column on iPad so the buttons aren't absurdly wide. */}
              <ResponsiveContainer maxWidth={600}>
                <View
                  className="self-center rounded-full mb-4"
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: colors.border,
                    marginTop: verticalScale(2),
                  }}
                />
                <Text
                  className="text-base font-bold mb-3 ml-1"
                  style={{ color: colors.textPrimary }}
                >
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
              </ResponsiveContainer>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
