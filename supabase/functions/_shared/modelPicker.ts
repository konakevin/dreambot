/**
 * Replicate model routing — maps a generation request to the correct model +
 * per-model input overrides. Used by all three pipelines (V4, nightly,
 * restyle-photo).
 *
 * Priority order (first match wins):
 *   1. force_model (test-mode override)
 *   2. Kontext mode → flux-kontext-pro
 *   3. SDXL always list (anime, pixels)
 *   4. model_overrides table — medium+vibe combo (random from pool)
 *   5. dream_mediums.allowed_models — medium default (random from pool)
 *   6. Keyword SDXL fallback (no medium provided)
 *   7. Default: flux-2-dev
 *
 * Both DB tables are cached in-memory with a 60-second TTL.
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

const SDXL_ALWAYS = new Set<string>();
const DEFAULT_MODEL = 'black-forest-labs/flux-2-dev';

// ── In-memory cache ─────────────────────────────────────────────────────

// medium key → allowed models array
let mediumModelsCache: Map<string, string[]> = new Map();
// "medium|vibe" → allowed models array
let overrideCache: Map<string, string[]> = new Map();
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000;

function pickRandom(models: string[]): string {
  return models[Math.floor(Math.random() * models.length)];
}

async function refreshCache(): Promise<void> {
  const now = Date.now();
  if (now - cacheTimestamp <= CACHE_TTL_MS) return;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) return;

    const sb = createClient(supabaseUrl, serviceKey);

    // Fetch both tables in parallel
    const [mediumsRes, overridesRes] = await Promise.all([
      sb.from('dream_mediums').select('key, allowed_models').eq('is_active', true),
      sb.from('model_overrides').select('medium_key, vibe_key, allowed_models'),
    ]);

    const newMediumCache: Map<string, string[]> = new Map();
    if (mediumsRes.data) {
      for (const row of mediumsRes.data) {
        const models = row.allowed_models as string[] | null;
        if (models && models.length > 0) {
          newMediumCache.set(row.key as string, models);
        }
      }
    }
    mediumModelsCache = newMediumCache;

    const newOverrideCache: Map<string, string[]> = new Map();
    if (overridesRes.data) {
      for (const row of overridesRes.data) {
        const models = row.allowed_models as string[] | null;
        if (models && models.length > 0) {
          newOverrideCache.set(`${row.medium_key}|${row.vibe_key}`, models);
        }
      }
    }
    overrideCache = newOverrideCache;

    cacheTimestamp = now;
  } catch (err) {
    console.warn('[modelPicker] Cache refresh failed:', (err as Error).message);
  }
}

// ── Main export ─────────────────────────────────────────────────────────

export async function pickModel(
  mode: string,
  prompt: string,
  mediumKey?: string,
  vibeKey?: string
): Promise<PickedModel> {
  if (mode === 'flux-kontext') {
    return { model: 'black-forest-labs/flux-kontext-pro', inputOverrides: {} };
  }

  // SDXL routing by medium key (code-owned — needs special input overrides)
  if (mediumKey && SDXL_ALWAYS.has(mediumKey)) {
    return { model: 'sdxl', inputOverrides: { ...SDXL_OVERRIDES } };
  }

  // DB-driven routing
  await refreshCache();

  // Check medium+vibe override first (e.g., photography+coquette → flux-1 only)
  if (mediumKey && vibeKey) {
    const overrideModels = overrideCache.get(`${mediumKey}|${vibeKey}`);
    if (overrideModels && overrideModels.length > 0) {
      const picked = pickRandom(overrideModels);
      return { model: picked, inputOverrides: picked === 'sdxl' ? { ...SDXL_OVERRIDES } : {} };
    }
  }

  // Fall back to medium's default pool
  if (mediumKey) {
    const mediumModels = mediumModelsCache.get(mediumKey);
    if (mediumModels && mediumModels.length > 0) {
      const picked = pickRandom(mediumModels);
      return { model: picked, inputOverrides: picked === 'sdxl' ? { ...SDXL_OVERRIDES } : {} };
    }
  }

  return { model: DEFAULT_MODEL, inputOverrides: {} };
}
