/**
 * Admin-only UI preferences (Zustand store + AsyncStorage persistence).
 *
 * Shared across all components so toggling in Settings instantly updates
 * FullScreenFeed (and any other admin-aware UI). Default OFF — admins
 * toggle ON from Settings → ADMIN when bulk-cleaning, OFF otherwise to
 * avoid accidental deletes.
 *
 * Currently just `showAdminDeleteButton` — controls visibility of the
 * one-tap-delete red X button on fullscreen card views.
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const KEY_SHOW_ADMIN_DELETE = 'admin.showDeleteButton';

interface AdminPrefsState {
  showAdminDeleteButton: boolean;
  hydrated: boolean;
  setShowAdminDeleteButton: (next: boolean) => void;
  hydrate: () => Promise<void>;
}

const useAdminPrefsStore = create<AdminPrefsState>((set) => ({
  showAdminDeleteButton: false,
  hydrated: false,
  setShowAdminDeleteButton: (next) => {
    set({ showAdminDeleteButton: next });
    AsyncStorage.setItem(KEY_SHOW_ADMIN_DELETE, next ? '1' : '0').catch(() => {});
  },
  hydrate: async () => {
    try {
      const v = await AsyncStorage.getItem(KEY_SHOW_ADMIN_DELETE);
      set({ showAdminDeleteButton: v === '1', hydrated: true });
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
