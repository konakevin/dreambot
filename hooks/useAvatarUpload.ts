import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { normalizeAvatarToJpeg } from '@/lib/normalizeImageToJpeg';
import { showAlert } from '@/components/CustomAlert';

const MAX_AVATAR_BYTES = 8 * 1024 * 1024; // 8MB

export function useAvatarUpload() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uri: string) => {
      const userId = user!.id;
      const fileName = `${userId}/avatar.jpg`;

      // Transcode to real JPEG bytes AND downscale to ≤512px before upload, so
      // avatar_url is a small (~30-50 KB) file we serve DIRECTLY — no Storage
      // image transform (Pro plan meters those at 100/cycle; see
      // project_image_transform_quota). 512px is retina for every avatar spot.
      const normalized = await normalizeAvatarToJpeg(uri);
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
