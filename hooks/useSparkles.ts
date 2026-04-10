import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type PurchasesPackage } from 'react-native-purchases';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import { getSparklePackages, purchaseSparklePackage, restorePurchases } from '@/lib/revenuecat';

export function useSparkleBalance() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['sparkleBalance', user?.id],
    queryFn: async (): Promise<number> => {
      const { data } = await supabase
        .from('users')
        .select('sparkle_balance')
        .eq('id', user!.id)
        .single();
      return data?.sparkle_balance ?? 0;
    },
    enabled: !!user,
    staleTime: 30_000,
  });
}

export function useSparklePackages() {
  return useQuery({
    queryKey: ['sparklePackages'],
    queryFn: getSparklePackages,
    staleTime: 5 * 60_000,
  });
}

export function usePurchaseSparkles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pkg: PurchasesPackage) => {
      const success = await purchaseSparklePackage(pkg);
      if (!success) throw new Error('cancelled');
      return success;
    },
    onSuccess: () => {
      const userId = useAuthStore.getState().user?.id;
      // Webhook will grant sparkles; poll balance after short delay
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['sparkleBalance', userId] });
      }, 2000);
      // Also invalidate immediately for optimistic feel
      queryClient.invalidateQueries({ queryKey: ['sparkleBalance', userId] });
    },
  });
}

export function useRestorePurchases() {
  return useMutation({
    mutationFn: restorePurchases,
  });
}

export function useSpendSparkles() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      reason,
      referenceId,
    }: {
      amount: number;
      reason: string;
      referenceId?: string;
    }) => {
      const { data, error } = await supabase.rpc('spend_sparkles', {
        p_user_id: user!.id,
        p_amount: amount,
        p_reason: reason,
        p_reference_id: referenceId ?? undefined,
      });
      if (error) throw error;
      if (!data) throw new Error('Not enough sparkles');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sparkleBalance', user?.id] });
    },
  });
}
