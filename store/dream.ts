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

/** For photos: restyle keeps the scene, reimagine dreams up a new scenario */
export type PhotoStyle = 'restyle' | 'reimagine';

interface DreamConfig {
  mode: DreamFlowMode;
  photoBase64: string | null;
  photoUri: string | null;
  photoStyle: PhotoStyle;
  selectedMedium: string;
  selectedVibe: string;
  userPrompt: string;
}

interface DreamResult {
  imageUrl: string;
  prompt: string;
  aiConcept: Record<string, unknown> | null;
  dreamMode: string | null;
  archetype: string | null;
}

interface DreamStore {
  // Config (set by Create + Configure screens)
  config: DreamConfig;
  // Result (set by Loading screen)
  result: DreamResult | null;
  // Actions
  setMode: (mode: DreamFlowMode) => void;
  setPhoto: (base64: string, uri: string) => void;
  setPhotoStyle: (style: PhotoStyle) => void;
  setMedium: (key: string) => void;
  setVibe: (key: string) => void;
  setPrompt: (text: string) => void;
  setResult: (result: DreamResult) => void;
  clearResult: () => void;
  reset: () => void;
}

const INITIAL_CONFIG: DreamConfig = {
  mode: 'surprise',
  photoBase64: null,
  photoUri: null,
  photoStyle: 'restyle',
  selectedMedium: 'surprise_me',
  selectedVibe: 'surprise_me',
  userPrompt: '',
};

export const useDreamStore = create<DreamStore>((set) => ({
  config: { ...INITIAL_CONFIG },
  result: null,

  setMode: (mode) => set((s) => ({ config: { ...s.config, mode } })),
  setPhoto: (base64, uri) =>
    set((s) => ({ config: { ...s.config, photoBase64: base64, photoUri: uri, mode: 'photo' } })),
  setPhotoStyle: (style) => set((s) => ({ config: { ...s.config, photoStyle: style } })),
  setMedium: (key) => set((s) => ({ config: { ...s.config, selectedMedium: key } })),
  setVibe: (key) => set((s) => ({ config: { ...s.config, selectedVibe: key } })),
  setPrompt: (text) => set((s) => ({ config: { ...s.config, userPrompt: text } })),
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),
  reset: () => set({ config: { ...INITIAL_CONFIG }, result: null }),
}));
