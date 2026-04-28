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

interface DreamStore {
  // Config (set by Create + Configure screens)
  config: DreamConfig;
  // Result (set by Loading screen)
  result: DreamResult | null;
  // Queue tracking
  activeJobId: string | null;
  // Actions
  setMode: (mode: DreamFlowMode) => void;
  setPhoto: (base64: string, uri: string) => void;
  setPhotoStyle: (style: PhotoStyle) => void;
  setMedium: (key: string) => void;
  setVibe: (key: string) => void;
  setPrompt: (text: string) => void;
  setStylePrompt: (prompt: string | null) => void;
  setResult: (result: DreamResult) => void;
  clearResult: () => void;
  clearPhoto: () => void;
  setActiveJobId: (id: string | null) => void;
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
};

export const useDreamStore = create<DreamStore>((set) => ({
  config: { ...INITIAL_CONFIG },
  result: null,
  activeJobId: null,

  setMode: (mode) => set((s) => ({ config: { ...s.config, mode } })),
  setPhoto: (base64, uri) =>
    set((s) => ({ config: { ...s.config, photoBase64: base64, photoUri: uri, mode: 'photo' } })),
  setPhotoStyle: (style) => set((s) => ({ config: { ...s.config, photoStyle: style } })),
  setMedium: (key) => set((s) => ({ config: { ...s.config, selectedMedium: key } })),
  setVibe: (key) => set((s) => ({ config: { ...s.config, selectedVibe: key } })),
  setPrompt: (text) => set((s) => ({ config: { ...s.config, userPrompt: text } })),
  setStylePrompt: (prompt) => set((s) => ({ config: { ...s.config, stylePrompt: prompt } })),
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),
  clearPhoto: () =>
    set((s) => ({
      config: { ...s.config, photoBase64: null, photoUri: null, photoStyle: 'new_scene' },
    })),
  setActiveJobId: (id) => set({ activeJobId: id }),
  reset: () => set({ config: { ...INITIAL_CONFIG }, result: null, activeJobId: null }),
}));
