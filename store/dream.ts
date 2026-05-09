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

export type DreamFlowMode = 'surprise' | 'photo' | 'prompt';

/**
 * Photo modes — set by user toggle on the Create screen when a photo is attached.
 *   'restyle'   — Kontext path, preserves pose and composition (same scene, new style)
 *   'new_scene' — Flux + face-swap path, invents a fresh scene with the person's face preserved
 */
export type PhotoStyle = 'restyle' | 'new_scene';

interface DreamConfig {
  mode: DreamFlowMode;
  photoBase64: string | null;
  photoUri: string | null;
  photoStyle: PhotoStyle;
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
  /** DLT only — the source post's `uploads.model_used`. Threaded through to
   *  the Edge Function as `force_model` so a render that landed perfectly on
   *  e.g. flux-1.1-pro doesn't get re-rolled on flux-dev. The recipe path
   *  already locks model when present; this covers legacy posts that have
   *  `model_used` but no recipe. Null for non-DLT flows. */
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

interface DreamStore {
  // Config (set by Create + Configure screens)
  config: DreamConfig;
  // Result (set by Loading screen)
  result: DreamResult | null;
  // Queue tracking
  activeJobId: string | null;
  // Failure state — set by useDreamCreate's catch block, consumed by Loading screen
  activeJobFailure: DreamFailure | null;
  // Actions
  setMode: (mode: DreamFlowMode) => void;
  setPhoto: (base64: string, uri: string) => void;
  setPhotoStyle: (style: PhotoStyle) => void;
  setMedium: (key: string) => void;
  setVibe: (key: string) => void;
  setPrompt: (text: string) => void;
  setStylePrompt: (prompt: string | null) => void;
  setDltRecipe: (recipe: Record<string, unknown> | null) => void;
  setUseExactPrompt: (value: boolean) => void;
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
  selectedMedium: 'surprise_me_face',
  selectedVibe: 'surprise_me',
  userPrompt: '',
  stylePrompt: null,
  dltRecipe: null,
  useExactPrompt: false,
  forceModel: null,
};

export const useDreamStore = create<DreamStore>((set) => ({
  config: { ...INITIAL_CONFIG },
  result: null,
  activeJobId: null,
  activeJobFailure: null,

  setMode: (mode) => set((s) => ({ config: { ...s.config, mode } })),
  setPhoto: (base64, uri) =>
    set((s) => ({ config: { ...s.config, photoBase64: base64, photoUri: uri, mode: 'photo' } })),
  setPhotoStyle: (style) => set((s) => ({ config: { ...s.config, photoStyle: style } })),
  setMedium: (key) => set((s) => ({ config: { ...s.config, selectedMedium: key } })),
  setVibe: (key) => set((s) => ({ config: { ...s.config, selectedVibe: key } })),
  setPrompt: (text) => set((s) => ({ config: { ...s.config, userPrompt: text } })),
  setStylePrompt: (prompt) => set((s) => ({ config: { ...s.config, stylePrompt: prompt } })),
  setDltRecipe: (recipe) => set((s) => ({ config: { ...s.config, dltRecipe: recipe } })),
  setUseExactPrompt: (value) => set((s) => ({ config: { ...s.config, useExactPrompt: value } })),
  setForceModel: (model) => set((s) => ({ config: { ...s.config, forceModel: model } })),
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),
  clearPhoto: () =>
    set((s) => ({
      config: { ...s.config, photoBase64: null, photoUri: null, photoStyle: 'new_scene' },
    })),
  setActiveJobId: (id) => set({ activeJobId: id }),
  setActiveJobFailure: (failure) => set({ activeJobFailure: failure }),
  reset: () =>
    set({ config: { ...INITIAL_CONFIG }, result: null, activeJobId: null, activeJobFailure: null }),
}));
