/**
 * Replicate model routing — maps a generation request to the correct model +
 * per-model input overrides. Used by all three pipelines (V4, nightly,
 * restyle-photo).
 *
 * Priority order (first match wins):
 *   1. Explicit force model (test-mode override from `force_model` request field)
 *   2. Kontext mode → flux-kontext-pro
 *   3. Medium-keyed SDXL always list (anime, pixels — SDXL renders these better)
 *   4. DB-stored preferred_model per medium (migration 118)
 *   5. Prompt-keyword SDXL fallback (only when no medium provided)
 *   6. Default: flux-2-dev (T5 encoder handles full-length prompts)
 *
 * DB reads are cached in-memory with a 60-second TTL so we don't hit the
 * database on every generation.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface PickedModel {
  model: string;
  inputOverrides: Record<string, unknown>;
}

const SDXL_OVERRIDES = {
  width: 768,
  height: 1344,
  num_inference_steps: 30,
  guidance_scale: 7.5,
} as const;

const SDXL_ALWAYS = new Set(['anime', 'pixels']);
const DEFAULT_MODEL = 'black-forest-labs/flux-2-dev';

// ── In-memory cache for preferred_model lookups ──────────────────────────

let preferredModelCache: Map<string, string | null> = new Map();
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

async function getPreferredModel(mediumKey: string): Promise<string | null> {
  const now = Date.now();
  if (now - cacheTimestamp > CACHE_TTL_MS) {
    // Refresh entire cache in one query
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      if (supabaseUrl && serviceKey) {
        const sb = createClient(supabaseUrl, serviceKey);
        const { data } = await sb
          .from('dream_mediums')
          .select('key, preferred_model')
          .eq('is_active', true);
        preferredModelCache = new Map();
        if (data) {
          for (const row of data) {
            preferredModelCache.set(row.key as string, (row.preferred_model as string) || null);
          }
        }
        cacheTimestamp = now;
      }
    } catch (err) {
      console.warn('[modelPicker] Cache refresh failed:', (err as Error).message);
      // Continue with stale cache
    }
  }
  return preferredModelCache.get(mediumKey) ?? null;
}

// ── Main export ──────────────────────────────────────────────────────────

export async function pickModel(
  mode: string,
  prompt: string,
  mediumKey?: string
): Promise<PickedModel> {
  if (mode === 'flux-kontext') {
    return { model: 'black-forest-labs/flux-kontext-pro', inputOverrides: {} };
  }

  // SDXL routing by medium key (code-owned, not DB — these models need special input overrides)
  if (mediumKey && SDXL_ALWAYS.has(mediumKey)) {
    return { model: 'sdxl', inputOverrides: { ...SDXL_OVERRIDES } };
  }

  // DB-stored preferred model per medium (migration 118)
  if (mediumKey) {
    const preferred = await getPreferredModel(mediumKey);
    if (preferred) {
      return { model: preferred, inputOverrides: {} };
    }
  }

  // SDXL fallback by keyword — only when no medium key provided (legacy paths)
  if (!mediumKey) {
    const p = prompt.toLowerCase();
    if (
      p.includes('anime') ||
      p.includes('manga') ||
      p.includes('pixel art') ||
      p.includes('8-bit') ||
      p.includes('16-bit')
    ) {
      return { model: 'sdxl', inputOverrides: { ...SDXL_OVERRIDES } };
    }
  }

  return { model: DEFAULT_MODEL, inputOverrides: {} };
}
