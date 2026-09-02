/**
 * ai_generation_log insert — the Phase 1 observability contract.
 *
 * Every pipeline (V4, nightly, restyle-photo) writes one row per generation.
 * Fire-and-forget (wrapped in `.then(noop, noop)` at the call site) so log
 * write failures never break the user-facing generation.
 *
 * Schema owned by migration 117_ai_log_full_brief.sql.
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';

/**
 * Adapt a typed object (e.g. a VibeProfile) to the loosely-typed JSONB
 * `recipe_snapshot` / `rolled_axes` columns in ONE justified place, so call
 * sites don't each need an `as unknown as Record<...>` cast. The single `as`
 * here is a legitimate object→record downcast at the JSONB serialization
 * boundary (the value is stored as opaque JSONB for observability).
 */
export function asJsonbObject(v: object | null | undefined): Record<string, unknown> {
  return (v ?? {}) as Record<string, unknown>;
}

export interface GenerationLogEntry {
  user_id: string;
  /**
   * dream_queue.id / dream_jobs.id this generation belongs to (= sparkle ledger
   * reference_id = failure-notification reference_id). Lets dream_forensics()
   * stitch this audit row to an exact render. NULL for pure-synchronous renders
   * that have no job. Column added in migration 272.
   */
  job_id?: string | null;
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
  /** The actual error text for status='failed' rows. The column has existed
   *  since the table's creation but NO writer ever populated it — failure
   *  audits had to fish the message out of rolled_axes, and hard_fail:unknown
   *  rows carried no detail at all (2026-07-09 dreamer2927 investigation).
   *  Callers pass the raw error sliced to ~500 chars. */
  error_message?: string | null;
  /** Caller-generated UUID for the row (2026-09-02): lets the nightly backfill
   *  upload_id onto EXACTLY this row after the uploads insert returns — the
   *  log row is created in parallel with storage persist, before the upload
   *  exists. Without it, direct-invoke renders (no job_id) left upload_id
   *  permanently null and forensics couldn't join log ↔ upload. */
  id?: string;
  upload_id?: string | null;
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
