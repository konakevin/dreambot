/**
 * Essence Cards — rich cinematic descriptions of locations and objects.
 *
 * Shared across all users. Generated lazily by Sonnet on first encounter,
 * then cached in DB forever. Module-level cache prevents duplicate queries
 * within a single Edge Function invocation.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SONNET } from './models.ts';
import { isBannedLocationName, isBannedLocationBiome } from './locationFilters.ts';

// ── Types ─────────────────────────────────────────────────────────────

export interface LocationCard {
  name: string;
  tags: string[];
  visual_palette: string[];
  atmosphere: string[];
  architecture: string[];
  light_signature: string[];
  texture_details: string[];
  cinematic_phrases: string[];
  fusion_settings: Record<string, string[]>;
  /** Biome CLASS (location_cards.biome) — drives scene-DNA scope filtering. */
  biome?: string | null;
}

// ObjectCard interface + objectCache removed 2026-06-02 — the entire
// objects / object_cards system was ripped out. See
// project_objects_removed_2026-06-02 memory.

// ── Caches ────────────────────────────────────────────────────────────

const locationCache = new Map<string, LocationCard>();

// ── Helpers ───────────────────────────────────────────────────────────

function getServiceClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
}

export function normalizeName(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

const PROMPT_VERSION = 1;
const MODEL_VERSION = SONNET;

// ── Sonnet call ───────────────────────────────────────────────────────

async function callSonnet(
  prompt: string,
  anthropicKey: string,
  maxTokens: number
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL_VERSION,
        max_tokens: maxTokens,
        messages: [
          { role: 'user', content: prompt },
          { role: 'assistant', content: '{' },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error('Sonnet ' + res.status);
    const data = await res.json();
    const text =
      data.content && data.content[0] && data.content[0].text ? data.content[0].text : '';
    return '{' + text;
  } finally {
    clearTimeout(timeout);
  }
}

function parseJsonSafe(text: string): Record<string, unknown> | null {
  try {
    const cleaned = text
      .replace(/```json\s*/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function ensureArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') return [val];
  return [];
}

function ensureRecord(val: unknown): Record<string, string[]> {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    const result: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      result[k] = ensureArray(v);
    }
    return result;
  }
  return {};
}

// ensureStringRecord() removed 2026-06-02 — was only used by the object
// card parser (deprecated). Location cards use ensureRecord (array form).

// ── Location Card Generation ──────────────────────────────────────────

async function generateLocationCard(
  name: string,
  anthropicKey: string
): Promise<LocationCard | null> {
  const prompt = `You are a cinematic location scout creating a visual essence card for an AI dream generator.

Given this place: "${name}"

Return ONLY valid JSON with these exact keys:
{
  "tags": ["2-4 tags from: tropical, coastal, urban, nature, forest, fantasy, sky, underwater, gothic, interior, snow, mountain, desert, space, fire, epic, surreal, underground, cozy"],
  "visual_palette": ["5 specific visual elements unique to this place, 6-10 words each"],
  "atmosphere": ["4 sensory atmosphere phrases — sounds, air quality, temperature, 6-10 words each"],
  "architecture": ["4 built environment details — structures, surfaces, materials, 6-10 words each"],
  "light_signature": ["3 phrases describing how light behaves in this place, 8-12 words each"],
  "texture_details": ["4 tactile close-up details — surfaces, natural elements, 6-10 words each"],
  "cinematic_phrases": ["6 short evocative phrases a cinematographer would use, 6-10 words each"],
  "fusion_settings": {
    "realistic": ["5 unique cinematic scene settings in this place, each 15-25 words, each a DIFFERENT sub-location or landmark"],
    "fantasy": ["5 unique fantasy/magical reimaginings of this place, each 15-25 words, each a DIFFERENT concept"],
    "scifi": ["5 unique sci-fi/futuristic reimaginings of this place, each 15-25 words, each a DIFFERENT concept"]
  }
}

Be SPECIFIC to this exact place. Not generic. What makes THIS place visually unique?
Every phrase must be something a camera can see or a microphone can hear.
MOOD-NEUTRAL: describe physical environment ONLY. No emotional tone, no darkness, no eeriness, no menace, no haunting. The mood system handles tone separately.
Even fantasy/scifi entries should be BEAUTIFUL and WONDER-FILLED, not dark or threatening.
Each fusion setting MUST include a camera distance term (medium wide, medium, three-quarter, environmental portrait).
NEVER include: looking out over, gazing at horizon, standing at the edge, silhouette against, from behind, walking away.
Each phrase max 10 words. Fusion settings max 25 words.
No metaphors, no cliches.`;

  try {
    const raw = await callSonnet(prompt, anthropicKey, 800);
    const parsed = parseJsonSafe(raw);
    if (!parsed) return null;

    return {
      name,
      tags: ensureArray(parsed.tags),
      visual_palette: ensureArray(parsed.visual_palette),
      atmosphere: ensureArray(parsed.atmosphere),
      architecture: ensureArray(parsed.architecture),
      light_signature: ensureArray(parsed.light_signature),
      texture_details: ensureArray(parsed.texture_details),
      cinematic_phrases: ensureArray(parsed.cinematic_phrases),
      fusion_settings: ensureRecord(parsed.fusion_settings),
    };
  } catch (err) {
    console.error('[essenceCards] Location card generation failed:', (err as Error).message);
    return null;
  }
}

// generateObjectCard() removed 2026-06-02 with the objects feature rip-out.

// ── Public API ────────────────────────────────────────────────────────

export async function getLocationCard(
  rawName: string,
  anthropicKey: string
): Promise<LocationCard | null> {
  const name = normalizeName(rawName);

  // Safety net (2026-06-03): refuse fantasy/sci-fi names UPFRONT so we
  // never auto-generate a fresh card for one. Without this, removing
  // "high fantasy" from is_approved=true silently triggers the
  // generateLocationCard() fallback below — Sonnet would happily write
  // a brand-new "high fantasy" card and the engine would render it.
  if (isBannedLocationName(name)) {
    console.log('[essenceCards] Refusing banned location name:', name);
    return null;
  }

  if (locationCache.has(name)) return locationCache.get(name)!;

  const sb = getServiceClient();

  // Try to fetch existing card
  const { data, error } = await sb
    .from('location_cards')
    .select('*')
    .eq('name', name)
    .eq('is_approved', true)
    .maybeSingle();

  if (!error && data) {
    // Belt+suspenders biome check — refuses any card whose biome class
    // is in the banned set even if is_approved gets flipped back later.
    if (isBannedLocationBiome(data.biome)) {
      console.log('[essenceCards] Refusing banned biome:', data.biome, 'for', name);
      return null;
    }

    const card: LocationCard = {
      name: data.name,
      tags: data.tags || [],
      visual_palette: data.visual_palette || [],
      atmosphere: data.atmosphere || [],
      architecture: data.architecture || [],
      light_signature: data.light_signature || [],
      texture_details: data.texture_details || [],
      cinematic_phrases: data.cinematic_phrases || [],
      fusion_settings: data.fusion_settings || {},
      biome: data.biome ?? null,
    };
    locationCache.set(name, card);
    return card;
  }

  // Generate new card
  console.log('[essenceCards] Generating location card for:', name);
  const card = await generateLocationCard(name, anthropicKey);
  if (!card) return null;

  // Insert into DB (handle race condition)
  const { error: insertErr } = await sb.from('location_cards').insert({
    name,
    tags: card.tags,
    prompt_version: PROMPT_VERSION,
    model_version: MODEL_VERSION,
    visual_palette: card.visual_palette,
    atmosphere: card.atmosphere,
    architecture: card.architecture,
    light_signature: card.light_signature,
    texture_details: card.texture_details,
    cinematic_phrases: card.cinematic_phrases,
    fusion_settings: card.fusion_settings,
  });

  if (insertErr) {
    // Race condition — another invocation created it. Fetch theirs.
    if (insertErr.message && insertErr.message.includes('duplicate')) {
      const { data: existing } = await sb
        .from('location_cards')
        .select('*')
        .eq('name', name)
        .eq('is_approved', true)
        .maybeSingle();
      if (existing) {
        const fetched: LocationCard = {
          name: existing.name,
          tags: existing.tags || [],
          visual_palette: existing.visual_palette || [],
          atmosphere: existing.atmosphere || [],
          architecture: existing.architecture || [],
          light_signature: existing.light_signature || [],
          texture_details: existing.texture_details || [],
          cinematic_phrases: existing.cinematic_phrases || [],
          fusion_settings: existing.fusion_settings || {},
          biome: existing.biome ?? null,
        };
        locationCache.set(name, fetched);
        return fetched;
      }
    }
    console.error('[essenceCards] Location card insert failed:', insertErr.message);
  }

  locationCache.set(name, card);
  console.log(
    '[essenceCards] Location card created:',
    name,
    '| phrases:',
    card.cinematic_phrases.length
  );
  return card;
}

// getObjectCard() removed 2026-06-02 with the objects feature rip-out.
