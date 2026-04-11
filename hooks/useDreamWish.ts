import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { moderateText } from '@/lib/moderation';
import type { WishModifiers } from '@/constants/wishModifiers';

interface WishData {
  wish: string | null;
  modifiers: WishModifiers | null;
  recipientIds: string[];
}

export function useDreamWish() {
  const user = useAuthStore((s) => s.user);

  const query = useQuery({
    queryKey: ['dreamWish', user?.id],
    queryFn: async (): Promise<WishData> => {
      const { data } = await supabase
        .from('user_recipes')
        .select('dream_wish, wish_modifiers, wish_recipient_ids')
        .eq('user_id', user!.id)
        .single();
      return {
        wish: data?.dream_wish ?? null,
        modifiers: (data?.wish_modifiers as WishModifiers | null) ?? null,
        recipientIds: (data?.wish_recipient_ids as string[] | null) ?? [],
      };
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  return {
    wish: query.data?.wish ?? null,
    modifiers: query.data?.modifiers ?? null,
    recipientIds: query.data?.recipientIds ?? [],
    isLoading: query.isLoading,
  };
}

interface SetWishArgs {
  wish: string | null;
  modifiers?: WishModifiers | null;
  recipientIds?: string[] | null;
}

export function useSetDreamWish() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: SetWishArgs) => {
      // Moderate wish text — wishes are displayed on dream cards
      if (args.wish && args.wish.trim()) {
        const modResult = await moderateText(args.wish.trim());
        if (!modResult.passed) {
          throw new Error(modResult.reason ?? 'Wish contains inappropriate language');
        }
      }
      const update: Record<string, unknown> = { dream_wish: args.wish };
      if (args.modifiers !== undefined) {
        update.wish_modifiers = args.modifiers;
      }
      if (args.recipientIds !== undefined) {
        update.wish_recipient_ids = args.recipientIds;
      }
      const { error } = await supabase.from('user_recipes').update(update).eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dreamWish', user?.id] });
    },
  });
}
