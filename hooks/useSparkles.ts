import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type PurchasesPackage } from 'react-native-purchases';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';
import {
  getProPackages,
  getSparklePackages,
  purchaseProPackage,
  purchaseSparklePackage,
  restorePurchases,
} from '@/lib/revenuecat';

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

export function useProPackages() {
  return useQuery({
    queryKey: ['proPackages'],
    queryFn: getProPackages,
    staleTime: 5 * 60_000,
  });
}

export function usePurchasePro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pkg: PurchasesPackage) => {
      const tier = await purchaseProPackage(pkg);
      if (!tier) throw new Error('cancelled');
      return tier;
    },
    onSuccess: (tier) => {
      const userId = useAuthStore.getState().user?.id;
      // The revenuecat-webhook authoritatively flips the entitlement column +
      // grants the bundled sparkles, and its latency is variable (usually
      // sub-second, occasionally several seconds). A single fixed-delay refresh
      // can read the DB before the webhook lands — leaving the paywall showing
      // "Get Basic"/"Get Pro" until the next app launch. So POLL refreshEntitlements
      // until the store reflects the purchased tier (or we hit the cap ~9s).
      const reflected = () => {
        const st = useAuthStore.getState();
        return tier === 'pro' ? st.isPaidPro : st.isBasic;
      };
      let attempts = 0;
      const poll = async () => {
        await useAuthStore.getState().refreshEntitlements();
        queryClient.invalidateQueries({ queryKey: ['sparkleBalance', userId] });
        attempts += 1;
        if (!reflected() && attempts < 6) {
          setTimeout(poll, 1500);
        }
      };
      void poll();
    },
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
