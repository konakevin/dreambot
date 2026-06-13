/**
 * Admin-only UI preferences (Zustand store + AsyncStorage persistence).
 *
 * Shared across all components so toggling in Settings instantly updates
 * FullScreenFeed / DreamCard (and any other admin-aware UI). Default OFF —
 * admins/supreme-admins flip them ON from Settings → ADMIN when they need them.
 *
 * Prefs:
 *  - showAdminDeleteButton — the one-tap-delete red X on fullscreen cards (admin)
 *  - showModelBadge        — the AI model chip on cards (supreme-admin only)
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const KEY_SHOW_ADMIN_DELETE = 'admin.showDeleteButton';
const KEY_SHOW_MODEL_BADGE = 'admin.showModelBadge';

interface AdminPrefsState {
  showAdminDeleteButton: boolean;
  showModelBadge: boolean;
  hydrated: boolean;
  setShowAdminDeleteButton: (next: boolean) => void;
  setShowModelBadge: (next: boolean) => void;
  hydrate: () => Promise<void>;
}

const useAdminPrefsStore = create<AdminPrefsState>((set) => ({
  showAdminDeleteButton: false,
  showModelBadge: false,
  hydrated: false,
  setShowAdminDeleteButton: (next) => {
    set({ showAdminDeleteButton: next });
    AsyncStorage.setItem(KEY_SHOW_ADMIN_DELETE, next ? '1' : '0').catch((e) => {
      if (__DEV__) console.warn('[adminPrefs] persist failed', e);
    });
  },
  setShowModelBadge: (next) => {
    set({ showModelBadge: next });
    AsyncStorage.setItem(KEY_SHOW_MODEL_BADGE, next ? '1' : '0').catch((e) => {
      if (__DEV__) console.warn('[adminPrefs] persist failed', e);
    });
  },
  hydrate: async () => {
    try {
      const [del, badge] = await Promise.all([
        AsyncStorage.getItem(KEY_SHOW_ADMIN_DELETE),
        AsyncStorage.getItem(KEY_SHOW_MODEL_BADGE),
      ]);
      set({ showAdminDeleteButton: del === '1', showModelBadge: badge === '1', hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
}));

/**
 * Returns [showAdminDeleteButton, setter]. Triggers AsyncStorage hydration on first use.
 */
export function useAdminShowDeleteButton(): [boolean, (next: boolean) => void] {
  const value = useAdminPrefsStore((s) => s.showAdminDeleteButton);
  const hydrated = useAdminPrefsStore((s) => s.hydrated);
  const setter = useAdminPrefsStore((s) => s.setShowAdminDeleteButton);
  const hydrate = useAdminPrefsStore((s) => s.hydrate);
  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);
  return [value, setter];
}

/**
 * Returns [showModelBadge, setter]. Triggers AsyncStorage hydration on first use.
 * The badge is ALSO gated on isSuperAdmin at the render site — this is just the
 * owner's on/off switch.
 */
export function useAdminShowModelBadge(): [boolean, (next: boolean) => void] {
  const value = useAdminPrefsStore((s) => s.showModelBadge);
  const hydrated = useAdminPrefsStore((s) => s.hydrated);
  const setter = useAdminPrefsStore((s) => s.setShowModelBadge);
  const hydrate = useAdminPrefsStore((s) => s.hydrate);
  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);
  return [value, setter];
}
