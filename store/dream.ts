/**
 * Ephemeral Zustand store for the dream creation flow.
 *
 * Populated step-by-step across screens:
 *   Create → sets mode (+ photoBase64/photoUri for photo)
 *   Configure → sets medium, vibe, userPrompt
 *   Loading → reads config, writes result
 *   Reveal → reads result, then reset()
 */

import { create } from 'zustand';
import type { PhotoClassification } from '@/lib/dreamApi';

export type DreamFlowMode = 'surprise' | 'photo' | 'prompt';

/** classify-photo result for the CURRENTLY attached photo, resolved at ATTACH
 *  time (fire-and-forget from the Create screen) so the UI can adapt to the
 *  render branch before submit (hide the moot Quality tier on solo-swap photos,
 *  early group-size feedback). `uri` ties it to config.photoUri — a photo swap
 *  makes it stale and useDreamCreate falls back to classifying inline. */
export interface AttachedPhotoClassification {
  uri: string;
  classification: PhotoClassification;
}

/**
 * Photo modes — set by user toggle on the Create screen when a photo is attached.
 *   'restyle'   — Kontext path, preserves pose and composition (same scene, new style)
 *   'new_scene' — Flux + face-swap path, invents a fresh scene with the person's face preserved
 */
export type PhotoStyle = 'restyle' | 'new_scene';

/**
 * New Scene likeness tier — reference-render quality/price toggle.
 *   'standard' — Seedream / Nano Banana (new_scene_price_standard sparkles)
 *   'best'     — Nano Banana Pro, strongest likeness (new_scene_price_best)
 * Only meaningful when photoStyle === 'new_scene'; server maps it to the model.
 */
export type NewSceneTier = 'standard' | 'best';

interface DreamConfig {
  mode: DreamFlowMode;
  photoBase64: string | null;
  photoUri: string | null;
  photoStyle: PhotoStyle;
  /** New Scene likeness tier (Standard vs Best). Only used when
   *  photoStyle === 'new_scene'; drives the reference model + price. */
  newSceneTier: NewSceneTier;
  selectedMedium: string;
  selectedVibe: string;
  userPrompt: string;
  stylePrompt: string | null;
  /** DLT recipe-replay payload — frozen LOOK anchors from the source post.
   *  When set, the server locks medium/vibe/model from the recipe instead of
   *  using the user's picker values. See docs/DLT_RECIPE_PLAN.md. Null for
   *  non-DLT flows or when source post has no recipe (pre-Phase-1). */
  dltRecipe: Record<string, unknown> | null;
  /** When true, the user's prompt is sent verbatim to flux-1.1-pro with NO
   *  Sonnet expansion, NO chaos layer, NO medium/vibe directive merging.
   *  Power-user mode for people pasting fully polished prompts. */
  useExactPrompt: boolean;
  /** DreamSmart toggle (default true). On → the model picker is curated to the
   *  models that render the chosen style well, and the server enforces it. Off →
   *  full model list, no coercion (render exactly what's picked). See
   *  SMART_DREAM_PLAN.md §7b. */
  dreamSmart: boolean;
  /** DLT only — the source post's Flux model, read from `recipe.model`
   *  (uploads has no model_used column). Threaded through to the Edge Function
   *  as `force_model` so a render that landed perfectly on e.g. flux-1.1-pro
   *  doesn't get re-rolled on flux-dev. Null for non-DLT flows or recipe-less
   *  posts (engine then picks a model). */
  forceModel: string | null;
}

interface DreamResult {
  imageUrl: string;
  prompt: string;
  aiConcept: Record<string, unknown> | null;
  dreamMode: string | null;
  archetype: string | null;
  resolvedMedium: string | null;
  resolvedVibe: string | null;
  uploadId: string | null;
}

/**
 * Set when a generate-dream call fails. The Loading screen reads this
 * and renders the appropriate failure card (refunded / refund-pending /
 * NSFW / pre-flight moderation).
 */
export interface DreamFailure {
  jobId: string;
  message: string;
  /** True if the server confirmed a refund landed (or self-moderation refund succeeded). */
  refunded: boolean;
  /** Server-provided classification of the failure (e.g., 'flux_gen', 'storage_upload'). */
  refundReason: string | null;
  isNsfw: boolean;
  isPreFlightModeration: boolean;
}

/** A dream's saved inputs, reloaded into Create by "Dream this again" (owner-
 *  only, 2026-07-06). Set by the action-sheet handler, consumed + cleared by the
 *  Create screen on focus so it survives the sticky medium/vibe rehydrate. */
export interface CreatePreset {
  prompt: string;
  medium: string;
  vibe: string;
  /** Model id to preselect, or null to leave the picker default. */
  model: string | null;
}

interface DreamStore {
  // Config (set by Create + Configure screens)
  config: DreamConfig;
  // Result (set by Loading screen)
  result: DreamResult | null;
  // Queue tracking
  activeJobId: string | null;
  // Failure state — set by useDreamCreate's catch block, consumed by Loading screen
  activeJobFailure: DreamFailure | null;
  // One-shot "Dream this again" hand-off to the Create screen (see CreatePreset).
  pendingCreatePreset: CreatePreset | null;
  // Attach-time classify-photo result for the current photo (see the type doc).
  photoClassification: AttachedPhotoClassification | null;
  // Actions
  setPendingCreatePreset: (preset: CreatePreset | null) => void;
  setPhotoClassification: (value: AttachedPhotoClassification | null) => void;
  setMode: (mode: DreamFlowMode) => void;
  setPhoto: (base64: string, uri: string) => void;
  setPhotoStyle: (style: PhotoStyle) => void;
  setNewSceneTier: (tier: NewSceneTier) => void;
  setMedium: (key: string) => void;
  setVibe: (key: string) => void;
  setPrompt: (text: string) => void;
  setStylePrompt: (prompt: string | null) => void;
  setDltRecipe: (recipe: Record<string, unknown> | null) => void;
  setUseExactPrompt: (value: boolean) => void;
  setDreamSmart: (value: boolean) => void;
  setForceModel: (model: string | null) => void;
  setResult: (result: DreamResult) => void;
  clearResult: () => void;
  clearPhoto: () => void;
  setActiveJobId: (id: string | null) => void;
  setActiveJobFailure: (failure: DreamFailure | null) => void;
  reset: () => void;
}

const INITIAL_CONFIG: DreamConfig = {
  mode: 'surprise',
  photoBase64: null,
  photoUri: null,
  // Default to 'new_scene' — the higher-quality path with face-swap +
  // Sonnet-invented scenes. Users who want to preserve their photo's pose
  // can toggle to 'restyle'.
  photoStyle: 'new_scene',
  newSceneTier: 'standard',
  selectedMedium: 'surprise_me',
  selectedVibe: 'surprise_me',
  userPrompt: '',
  stylePrompt: null,
  dltRecipe: null,
  useExactPrompt: false,
  dreamSmart: true,
  forceModel: null,
};

export const useDreamStore = create<DreamStore>((set) => ({
  config: { ...INITIAL_CONFIG },
  result: null,
  activeJobId: null,
  activeJobFailure: null,
  pendingCreatePreset: null,
  photoClassification: null,

  setPendingCreatePreset: (preset) => set({ pendingCreatePreset: preset }),
  setPhotoClassification: (value) => set({ photoClassification: value }),
  // A new photo invalidates the previous photo's classification immediately —
  // the attach-time classify writes the fresh one when (and if) it lands.
  setPhoto: (base64, uri) =>
    set((s) => ({
      config: { ...s.config, photoBase64: base64, photoUri: uri, mode: 'photo' },
      photoClassification: null,
    })),
  setMode: (mode) => set((s) => ({ config: { ...s.config, mode } })),
  setPhotoStyle: (style) => set((s) => ({ config: { ...s.config, photoStyle: style } })),
  setNewSceneTier: (tier) => set((s) => ({ config: { ...s.config, newSceneTier: tier } })),
  setMedium: (key) => set((s) => ({ config: { ...s.config, selectedMedium: key } })),
  setVibe: (key) => set((s) => ({ config: { ...s.config, selectedVibe: key } })),
  setPrompt: (text) => set((s) => ({ config: { ...s.config, userPrompt: text } })),
  setStylePrompt: (prompt) => set((s) => ({ config: { ...s.config, stylePrompt: prompt } })),
  setDltRecipe: (recipe) => set((s) => ({ config: { ...s.config, dltRecipe: recipe } })),
  setUseExactPrompt: (value) => set((s) => ({ config: { ...s.config, useExactPrompt: value } })),
  setDreamSmart: (value) => set((s) => ({ config: { ...s.config, dreamSmart: value } })),
  setForceModel: (model) => set((s) => ({ config: { ...s.config, forceModel: model } })),
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),
  clearPhoto: () =>
    set((s) => ({
      config: {
        ...s.config,
        photoBase64: null,
        photoUri: null,
        photoStyle: 'new_scene',
        newSceneTier: 'standard',
      },
      photoClassification: null,
    })),
  setActiveJobId: (id) => set({ activeJobId: id }),
  setActiveJobFailure: (failure) => set({ activeJobFailure: failure }),
  reset: () =>
    set({
      config: { ...INITIAL_CONFIG },
      result: null,
      activeJobId: null,
      activeJobFailure: null,
      pendingCreatePreset: null,
      photoClassification: null,
    }),
}));
