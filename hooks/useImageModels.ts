/**
 * useImageModels — the AI model catalog, served from the DB (image_models via
 * the get_image_models RPC) so prices and the model lineup can change without
 * a client build. Falls back to the bundled IMAGE_MODELS list when the RPC
 * hasn't resolved yet or is unreachable, so the picker always has data.
 *
 * Pair with sparkleCostFrom(models, id) for cost lookups, so the cost the user
 * sees + is pre-checked against always matches the server's DB-driven price.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { IMAGE_MODELS, type ImageModel, type ModelFamily } from '@/constants/imageModels';

export function useImageModels(): ImageModel[] {
  const { data } = useQuery({
    queryKey: ['image_models'],
    queryFn: async (): Promise<ImageModel[]> => {
      const { data, error } = await supabase.rpc('get_image_models');
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        label: r.label,
        family: r.family as ModelFamily,
        sparkleCost: r.sparkle_cost,
        description: r.description,
      }));
    },
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
  // Fallback to the bundled catalog until the RPC resolves / if it fails.
  return data && data.length > 0 ? data : IMAGE_MODELS;
}
