import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useQueryClient } from '@tanstack/react-query';
import { showAlert } from '@/components/CustomAlert';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { showAvatarConfirm } from '@/components/AvatarConfirm';

/**
 * Change-avatar flow — the action sheet (pick from library / take photo /
 * delete) + upload. Extracted from the old Settings avatar hero so the
 * Profile screen owns it: changing your picture belongs with your profile,
 * not buried in Settings.
 *
 * `currentAvatarUrl` gates the "Delete Photo" option (nothing to delete when
 * there's no avatar). Returns `uploading` so callers can show progress.
 */
export function useChangeAvatar(currentAvatarUrl: string | null | undefined) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const { mutate: uploadAvatar, isPending: uploading } = useAvatarUpload();

  const changePhoto = useCallback(() => {
    showAlert('Profile picture', '', [
      {
        text: 'Choose from library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            showAlert('Permission needed', 'Allow photo library access in Settings.');
            return;
          }
          // Loop so "Choose another" in the confirm re-opens the picker.
          for (;;) {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [1, 1],
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
        },
      },
      {
        text: 'Take photo',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            showAlert('Permission needed', 'Allow camera access in Settings.');
            return;
          }
          // Loop so "Choose another" in the confirm re-opens the camera.
          for (;;) {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (result.canceled || !result.assets[0]) return;
            const choice = await showAvatarConfirm(result.assets[0].uri);
            if (choice === 'use') {
              uploadAvatar(result.assets[0].uri);
              return;
            }
            if (choice === 'cancel') return;
            // 'retry' → loop, re-open the camera
          }
        },
      },
      ...(currentAvatarUrl
        ? [
            {
              text: 'Delete Photo',
              style: 'destructive' as const,
              onPress: () => {
                showAlert('Delete Photo', 'Are you sure you want to remove your profile picture?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      if (!user) return;
                      // Clean up the avatar file too — otherwise every delete
                      // orphans the JPEG. Path is fixed: <userId>/avatar.jpg.
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
              },
            },
          ]
        : []),
      { text: 'Cancel', style: 'cancel' as const },
    ]);
  }, [user, currentAvatarUrl, uploadAvatar, queryClient]);

  return { changePhoto, uploading };
}
