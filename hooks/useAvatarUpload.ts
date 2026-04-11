import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

const MAX_AVATAR_BYTES = 8 * 1024 * 1024; // 8MB

export function useAvatarUpload() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uri: string) => {
      const userId = user!.id;
      const fileName = `${userId}/avatar.jpg`;

      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();

      if (arrayBuffer.byteLength > MAX_AVATAR_BYTES) {
        throw new Error(
          `Image too large (${(arrayBuffer.byteLength / 1024 / 1024).toFixed(1)}MB). Max 8MB.`
        );
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, arrayBuffer, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      // Cache-bust so expo-image picks up the new file
      const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

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
  });
}
