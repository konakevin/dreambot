import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useQueryClient } from '@tanstack/react-query';
import { showAlert } from '@/components/CustomAlert';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { showAvatarConfirm } from '@/components/AvatarConfirm';

/**
 * Change-avatar flow — the three actions (pick from library / take photo /
 * delete) + upload. Extracted from the old Settings avatar hero so the Profile
 * screen owns it: changing your picture belongs with your profile.
 *
 * The action-picker UI is now a PostActionSheet rendered by the Profile screen
 * (matches the dream-card long-press sheet), so this hook exposes the raw
 * actions instead of showing an alert. `hasAvatar` lets the caller gate the
 * "Delete Photo" row (nothing to delete when there's no avatar). Returns
 * `uploading` so callers can show progress.
 */
export function useChangeAvatar(currentAvatarUrl: string | null | undefined) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const { mutate: uploadAvatar, isPending: uploading } = useAvatarUpload();

  const chooseFromLibrary = useCallback(async () => {
    // No allowsEditing → iOS uses the modern PHPicker: faster to open and needs
    // no library-permission prompt (the avatar renders cover-cropped in a
    // circle, so a square crop step isn't needed). Loop so "Choose another" in
    // the confirm re-opens the picker.
    for (;;) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;
      const choice = await showAvatarConfirm(result.assets[0].uri);
      if (choice === 'use') {
        uploadAvatar(result.assets[0].uri);
        return;
      }
      if (choice === 'cancel') return;
      // 'retry' → loop, re-open the picker
    }
  }, [uploadAvatar]);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permission needed', 'Allow camera access in Settings.');
      return;
    }
    // Loop so "Choose another" in the confirm re-opens the camera.
    for (;;) {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (result.canceled || !result.assets[0]) return;
      const choice = await showAvatarConfirm(result.assets[0].uri);
      if (choice === 'use') {
        uploadAvatar(result.assets[0].uri);
        return;
      }
      if (choice === 'cancel') return;
      // 'retry' → loop, re-open the camera
    }
  }, [uploadAvatar]);

  const deletePhoto = useCallback(() => {
    showAlert('Delete Photo', 'Are you sure you want to remove your profile picture?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!user) return;
          // Clean up the avatar file too — otherwise every delete orphans the
          // JPEG. Path is fixed: <userId>/avatar.jpg.
          supabase.storage
            .from('avatars')
            .remove([`${user.id}/avatar.jpg`])
            .catch((e) => {
              if (__DEV__) console.warn('[avatar] storage cleanup failed', e);
            });
          await supabase.from('users').update({ avatar_url: null }).eq('id', user.id);
          await supabase.auth.updateUser({ data: { avatar_url: null } });
          queryClient.invalidateQueries({ queryKey: ['publicProfile'] });
        },
      },
    ]);
  }, [user, queryClient]);

  return {
    chooseFromLibrary,
    takePhoto,
    deletePhoto,
    hasAvatar: !!currentAvatarUrl,
    uploading,
  };
}
