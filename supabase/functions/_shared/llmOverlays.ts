/**
 * llmOverlays.ts — loads the model-specific prompt overlays (table llm_prompt_overlays, mig 577;
 * LLM_5_5_TUNING_PLAN.md). Cached per isolate for 60 s, like engine_config, so an edited overlay is live within a
 * minute with no deploy. Any error → no overlays (every prompt exactly as the code writes it).
 */
import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.100.0';
import { parseLlmOverlays, type LlmOverlay } from './anthropic.ts';

let cached: LlmOverlay[] | null = null;
let cachedAt = 0;
const TTL_MS = 60_000;

export async function fetchLlmOverlays(sb: SupabaseClient): Promise<LlmOverlay[]> {
  if (cached && Date.now() - cachedAt < TTL_MS) return cached;
  const { data, error } = await sb.from('llm_prompt_overlays').select('*');
  cached = error ? [] : parseLlmOverlays(data);
  cachedAt = Date.now();
  return cached;
}
