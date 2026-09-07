/**
 * Loads `nightly_model_policy` (migration 468) for the render. Cached per isolate with a 60 s TTL like
 * engine_config, so a dashboard row edit propagates within a minute without a redeploy. Fails OPEN to the
 * legacy-equivalent rows (a render must never break because a config read failed) and says so in the log.
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import {
  LEGACY_EQUIVALENT_POLICY,
  parsePolicyRows,
  type NightlyModelPolicy,
} from '../nightlyModelPolicy.ts';

const TTL_MS = 60_000;
let cached: { policy: NightlyModelPolicy; at: number } | null = null;

export async function loadNightlyModelPolicy(
  supabase: SupabaseClient,
  bypassCache = false
): Promise<NightlyModelPolicy> {
  const now = Date.now();
  if (!bypassCache && cached && now - cached.at < TTL_MS) return cached.policy;
  const { data, error } = await supabase
    .from('nightly_model_policy')
    .select('surface,primary_models,fallback_models')
    .returns<Record<string, unknown>[]>();
  if (error) {
    console.warn(`[nightlyModelPolicy] load failed (${error.message}) → legacy-equivalent rows`);
    return LEGACY_EQUIVALENT_POLICY;
  }
  const { policy, missing } = parsePolicyRows(data ?? []);
  if (missing.length > 0) {
    console.warn(
      `[nightlyModelPolicy] rows missing for ${missing.join(', ')} → legacy-equivalent for those`
    );
  }
  cached = { policy, at: now };
  return policy;
}
