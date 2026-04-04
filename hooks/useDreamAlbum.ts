import { useState, useRef, useCallback } from 'react';
import { FlatList } from 'react-native';
import type { PromptMode } from '@/types/vibeProfile';

export interface ControlState {
  selectedMode: PromptMode;
  customPrompt: string;
  reDreamCurrent: boolean;
  reusePhoto: boolean;
}

export interface DreamAlbumItem {
  url: string;
  prompt: string;
  fromWish: string | null;
  dreamMode?: string;
  archetype?: string;
  fromUpload?: boolean;
  aiConcept?: Record<string, unknown> | null;
  controlState: ControlState;
}

export interface DreamAlbum {
  album: DreamAlbumItem[];
  activeIndex: number;
  albumRef: React.RefObject<FlatList>;
  activeDream: DreamAlbumItem | null;
  setActiveIndex: (index: number) => void;

  // Control state — lives on the album so it persists per-dream
  selectedMode: PromptMode;
  customPrompt: string;
  reDreamCurrent: boolean;
  reusePhoto: boolean;
  setSelectedMode: (mode: PromptMode) => void;
  setCustomPrompt: (prompt: string) => void;
  setReDreamCurrent: (v: boolean) => void;
  setReusePhoto: (v: boolean) => void;

  /** Build a ControlState snapshot of the current controls */
  makeControlState: () => ControlState;
  /** Save current controls into the active dream's controlState */
  saveControlsToActiveDream: () => void;
  /** Restore controls from a dream item */
  restoreControlsFromDream: (dream: DreamAlbumItem) => void;
  /** Add a new dream to the album and scroll to it */
  addDream: (item: DreamAlbumItem) => void;
  /** Remove a dream by index (fixes bounds) */
  removeDream: (index: number) => void;
  /** Clear the album entirely */
  clearAlbum: () => void;
}

export function useDreamAlbum(): DreamAlbum {
  const [album, setAlbum] = useState<DreamAlbumItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const albumRef = useRef<FlatList>(null) as React.RefObject<FlatList>;

  // Per-dream control state
  const [selectedMode, setSelectedMode] = useState<PromptMode>('dream_me');
  const [customPrompt, setCustomPrompt] = useState('');
  const [reDreamCurrent, setReDreamCurrent] = useState(false);
  const [reusePhoto, setReusePhoto] = useState(false);

  const activeDream = album[activeIndex] ?? null;

  const makeControlState = useCallback(
    (): ControlState => ({
      selectedMode,
      customPrompt,
      reDreamCurrent,
      reusePhoto,
    }),
    [selectedMode, customPrompt, reDreamCurrent, reusePhoto]
  );

  const saveControlsToActiveDream = useCallback(() => {
    const cs: ControlState = { selectedMode, customPrompt, reDreamCurrent, reusePhoto };
    setAlbum((prev) => prev.map((d, i) => (i === activeIndex ? { ...d, controlState: cs } : d)));
  }, [activeIndex, selectedMode, customPrompt, reDreamCurrent, reusePhoto]);

  const restoreControlsFromDream = useCallback((dream: DreamAlbumItem) => {
    setSelectedMode(dream.controlState.selectedMode);
    setCustomPrompt(dream.controlState.customPrompt);
    setReDreamCurrent(dream.controlState.reDreamCurrent);
    setReusePhoto(dream.controlState.reusePhoto);
  }, []);

  const addDream = useCallback(
    (item: DreamAlbumItem) => {
      setAlbum((prev) => {
        const newIndex = prev.length;
        setActiveIndex(newIndex);
        setTimeout(() => albumRef.current?.scrollToIndex({ index: newIndex, animated: true }), 100);
        return [...prev, item];
      });
    },
    [albumRef]
  );

  const removeDream = useCallback((index: number) => {
    setAlbum((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // Fix bounds — use the new length, not old
      setActiveIndex((ai) => Math.max(0, Math.min(ai, next.length - 1)));
      return next;
    });
  }, []);

  const clearAlbum = useCallback(() => {
    setAlbum([]);
    setActiveIndex(0);
    setSelectedMode('dream_me');
    setCustomPrompt('');
    setReDreamCurrent(false);
    setReusePhoto(false);
  }, []);

  return {
    album,
    activeIndex,
    albumRef,
    activeDream,
    setActiveIndex,
    selectedMode,
    customPrompt,
    reDreamCurrent,
    reusePhoto,
    setSelectedMode,
    setCustomPrompt,
    setReDreamCurrent,
    setReusePhoto,
    makeControlState,
    saveControlsToActiveDream,
    restoreControlsFromDream,
    addDream,
    removeDream,
    clearAlbum,
  };
}
