import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { normalizeImageToJpeg } from '@/lib/normalizeImageToJpeg';
import { showAlert } from '@/components/CustomAlert';

const MAX_AVATAR_BYTES = 8 * 1024 * 1024; // 8MB

export function useAvatarUpload() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uri: string) => {
      const userId = user!.id;
      const fileName = `${userId}/avatar.jpg`;

      // Transcode picker output to real JPEG bytes before upload. Without
      // this, PNG/WebP/GIF picks land with their raw bytes under a lying
      // 'image/jpeg' content-type. See lib/normalizeImageToJpeg.ts header.
      const normalized = await normalizeImageToJpeg(uri);
      const response = await fetch(normalized.uri);
      const arrayBuffer = await response.arrayBuffer();

      if (arrayBuffer.byteLength > MAX_AVATAR_BYTES) {
        throw new Error(
          `Image too large (${(arrayBuffer.byteLength / 1024 / 1024).toFixed(1)}MB). Max 8MB.`
        );
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
          cacheControl: '2592000',
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      // Cache-bust so expo-image picks up the new file. MUST be named `?v=`:
      // lib/imageUrl.ts `transform()` only carries a cache-buster named `v`
      // onto the resized render URL (the profile hero, feed, comments all use
      // that resized path). A `?t=` buster gets stripped there, so the CDN
      // keeps serving the OLD avatar and "change photo" looks broken even
      // though the upload + DB update succeeded. (root-caused 2026-06-23)
      const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Keep auth session in sync so optimistic UI uses the correct avatar
      await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } });

      return avatarUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicProfile', user?.id] });
    },
    onError: (err) => {
      // Don't fail silently — the user picked a photo and tapped through, so a
      // swallowed error reads as "change photo is broken".
      if (__DEV__) console.warn('[avatar] upload failed', err);
      showAlert(
        "Couldn't update photo",
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    },
  });
}
