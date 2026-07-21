import { useQuery } from '@tanstack/react-query';
import { getAutoRenewInfo, type AutoRenewInfo } from '@/lib/revenuecat';
import { useAuthStore } from '@/store/auth';

/**
 * Live auto-renew state from RevenueCat (willRenew + expiry + which tier).
 * Drives the "subscribed but cancelled" UI — the Plans "Turn on auto-renew"
 * button and the Settings "Manage subscription" row — where the DB's frozen
 * will_renew column isn't visible to the client. Cheap on-device read; short
 * staleTime so it reflects a just-made change on the manage sheet's return.
 */
export function useSubscriptionStatus() {
  const user = useAuthStore((s) => s.user);
  return useQuery<AutoRenewInfo>({
    queryKey: ['subscriptionStatus', user?.id],
    queryFn: getAutoRenewInfo,
    enabled: !!user,
    staleTime: 30_000,
  });
}
