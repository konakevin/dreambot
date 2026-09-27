import { useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { showAlert } from '@/components/CustomAlert';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { avatarFrameHref } from '@/lib/avatarPicture';

/**
 * Change-avatar flow: the actions behind the profile-picture sheet (Profile tab and
 * Edit Profile both render it via photoSourceRows). Choose from your dreams, choose
 * from the library, take a photo, or delete.
 *
 * Every picture goes through Move and Scale (app/avatarFrame.tsx), which frames it in
 * the circle, crops it on the phone, and uploads it. This hook only opens the right
 * screen; it never uploads itself. `hasAvatar` gates the "Delete photo" row.
 */
export function useChangeAvatar(currentAvatarUrl: string | null | undefined) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const chooseFromDreams = useCallback(() => {
    router.push('/avatarPicker');
  }, []);

  const chooseFromLibrary = useCallback(async () => {
    // No allowsEditing → iOS uses the modern PHPicker: faster to open and needs no
    // library-permission prompt. Move and Scale does the framing.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    if (result.canceled || !result.assets[0]) return;
    router.push(avatarFrameHref({ uri: result.assets[0].uri, source: 'library' }));
  }, []);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permission needed', 'Allow camera access in Settings.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.9 });
    if (result.canceled || !result.assets[0]) return;
    router.push(avatarFrameHref({ uri: result.assets[0].uri, source: 'camera' }));
  }, []);

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
    chooseFromDreams,
    chooseFromLibrary,
    takePhoto,
    deletePhoto,
    hasAvatar: !!currentAvatarUrl,
  };
}
