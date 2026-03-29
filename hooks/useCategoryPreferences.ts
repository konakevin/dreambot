import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import type { Category } from '@/types/database';

export function useCategoryPreferences() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['categoryPreferences', user?.id],
    queryFn: async (): Promise<Category[] | null> => {
      const { data, error } = await supabase
        .from('users')
        .select('preferred_categories')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      return (data?.preferred_categories as Category[] | null) ?? null;
    },
    enabled: !!user,
    staleTime: 300_000,
  });

  const mutation = useMutation({
    mutationFn: async (categories: Category[] | null) => {
      const { error } = await supabase
        .from('users')
        .update({ preferred_categories: categories })
        .eq('id', user!.id);

      if (error) throw error;
    },
    onSuccess: (_, categories) => {
      queryClient.setQueryData(['categoryPreferences', user?.id], categories);
      // Refetch feed with new preferences
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  return {
    /** null = all categories, array = only those */
    categories: query.data,
    isLoading: query.isLoading,
    save: mutation.mutate,
    isSaving: mutation.isPending,
  };
}
