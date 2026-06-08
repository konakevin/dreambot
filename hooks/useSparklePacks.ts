/**
 * useSparklePacks — sparkle pack display info (sparkles / icon / label) keyed by
 * App Store product ID, from the sparkle_packs DB table. The constants PACK_INFO
 * is the offline fallback. Lets pack sizes/labels/icons be tuned from the dashboard
 * with no app build (the webhook grants from the same table). See migration 255.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PACK_INFO } from '@/constants/sparklePacks';

export type PackInfo = { sparkles: number; icon: string; label: string };
export type PackInfoMap = Record<string, PackInfo>;

export function useSparklePacks(): PackInfoMap {
  const { data } = useQuery({
    queryKey: ['sparklePacks'],
    queryFn: async (): Promise<PackInfoMap> => {
      const { data, error } = await supabase
        .from('sparkle_packs')
        .select('product_id, sparkles, icon, label')
        .eq('is_active', true)
        .order('sort_order');
      if (error || !data || data.length === 0) return PACK_INFO;
      return Object.fromEntries(
        data.map((p) => [p.product_id, { sparkles: p.sparkles, icon: p.icon, label: p.label }])
      );
    },
    staleTime: 5 * 60_000,
  });
  return data ?? PACK_INFO;
}
