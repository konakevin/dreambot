/**
 * ai_generation_log insert — the Phase 1 observability contract.
 *
 * Every pipeline (V4, nightly, restyle-photo) writes one row per generation.
 * Fire-and-forget (wrapped in `.then(noop, noop)` at the call site) so log
 * write failures never break the user-facing generation.
 *
 * Schema owned by migration 117_ai_log_full_brief.sql.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface GenerationLogEntry {
  user_id: string;
  recipe_snapshot: Record<string, unknown>;
  rolled_axes: Record<string, unknown>;
  enhanced_prompt: string;
  model_used: string;
  cost_cents: number;
  status: 'completed' | 'failed';
  // Phase 1 observability fields
  sonnet_brief: string | null;
  sonnet_raw_response: string | null;
  vision_description: string | null;
  fallback_reasons: string[];
  replicate_prediction_id: string | null;
}

/**
 * Insert a generation log entry. Never throws — errors are swallowed so a
 * log failure doesn't break the generation. Callers use this inside
 * `Promise.all` without needing their own .catch.
 */
export function insertGenerationLog(
  supabase: SupabaseClient,
  entry: GenerationLogEntry
): PromiseLike<void> {
  return supabase
    .from('ai_generation_log')
    .insert(entry)
    .then(
      () => {},
      (err: unknown) => {
        console.warn('[logging] ai_generation_log insert failed:', (err as Error)?.message);
      }
    );
}
