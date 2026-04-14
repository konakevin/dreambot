/**
 * Essence Cards — rich cinematic descriptions of locations and objects.
 *
 * Shared across all users. Generated lazily by Sonnet on first encounter,
 * then cached in DB forever. Module-level cache prevents duplicate queries
 * within a single Edge Function invocation.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
}

export interface ObjectCard {
  name: string;
  tags: string[];
  visual_forms: string[];
  material_textures: string[];
  signature_details: string[];
  scale_contexts: string[];
  interaction_modes: string[];
  environment_bindings: string[];
  role_options: string[];
  fusion_forms: Record<string, string[]>;
  soft_presence_forms: string[];
  faceswap_forbidden: string[];
  faceswap_safe_positive: string[];
}

// ── Caches ────────────────────────────────────────────────────────────

const locationCache = new Map<string, LocationCard>();
const objectCache = new Map<string, ObjectCard>();

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
const MODEL_VERSION = 'claude-sonnet-4-5-20250929';

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

function ensureStringRecord(val: unknown): Record<string, string> {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      result[k] = String(v);
    }
    return result;
  }
  return {};
}

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
Each fusion setting MUST include a camera distance term (medium wide, medium, three-quarter, environmental portrait).
NEVER include: looking out over, gazing at horizon, standing at the edge, silhouette against, from behind, walking away.
Each phrase max 10 words. Fusion settings max 25 words.
No metaphors, no emotions, no cliches.`;

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

// ── Object Card Generation ────────────────────────────────────────────

async function generateObjectCard(name: string, anthropicKey: string): Promise<ObjectCard | null> {
  const prompt = `You are a prop master for cinematic dream photography.

Given this object: "${name}"

Return ONLY valid JSON with these exact keys:
{
  "tags": ["2-4 tags from: instrument, vehicle, weapon, animal, food, furniture, clothing, technology, toy, nature, face_risk"],
  "visual_forms": ["4 visually striking versions of this object with specific details, 8-12 words each"],
  "material_textures": ["4 close-up tactile details — surface finish, wear, materials, 6-10 words each"],
  "signature_details": ["3 cinematic micro-details that catch light or draw the eye, 6-10 words each"],
  "scale_contexts": ["4 ways this object relates to a human body in size/position, 6-10 words each"],
  "interaction_modes": ["5 natural ways a person interacts with this object in a photo, 6-10 words each"],
  "environment_bindings": ["5 ways this object could be physically grounded in a scene, 6-10 words each"],
  "role_options": ["artifact on a pedestal", "hero prop in foreground", "carried casually", "surreal giant-scale architectural element"],
  "fusion_forms": {
    "realistic": ["2 realistic versions with specific visual details, 8-12 words each"],
    "fantasy": ["2 fantasy/magical reimagined versions, 8-12 words each"],
    "scifi": ["2 sci-fi/futuristic reimagined versions, 8-12 words each"]
  },
  "soft_presence_forms": ["3 indirect/symbolic appearances — as mural, sign, motif, shadow, 8-12 words each"],
  "faceswap_forbidden": ["constraints if this object could cover a person's face, or empty array"],
  "faceswap_safe_positive": ["2 safe positioning phrases for face-swap mode, 6-10 words each"]
}

Be specific to THIS exact object. Not generic.
Each phrase max 12 words. No metaphors. Pure visual description.`;

  try {
    const raw = await callSonnet(prompt, anthropicKey, 1000);
    const parsed = parseJsonSafe(raw);
    if (!parsed) return null;

    return {
      name,
      tags: ensureArray(parsed.tags),
      visual_forms: ensureArray(parsed.visual_forms),
      material_textures: ensureArray(parsed.material_textures),
      signature_details: ensureArray(parsed.signature_details),
      scale_contexts: ensureArray(parsed.scale_contexts),
      interaction_modes: ensureArray(parsed.interaction_modes),
      environment_bindings: ensureArray(parsed.environment_bindings),
      role_options: ensureArray(parsed.role_options),
      fusion_forms: ensureRecord(parsed.fusion_forms),
      soft_presence_forms: ensureArray(parsed.soft_presence_forms),
      faceswap_forbidden: ensureArray(parsed.faceswap_forbidden),
      faceswap_safe_positive: ensureArray(parsed.faceswap_safe_positive),
    };
  } catch (err) {
    console.error('[essenceCards] Object card generation failed:', (err as Error).message);
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────

export async function getLocationCard(
  rawName: string,
  anthropicKey: string
): Promise<LocationCard | null> {
  const name = normalizeName(rawName);
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

export async function getObjectCard(
  rawName: string,
  anthropicKey: string
): Promise<ObjectCard | null> {
  const name = normalizeName(rawName);
  if (objectCache.has(name)) return objectCache.get(name)!;

  const sb = getServiceClient();

  // Try to fetch existing card
  const { data, error } = await sb
    .from('object_cards')
    .select('*')
    .eq('name', name)
    .eq('is_approved', true)
    .maybeSingle();

  if (!error && data) {
    const card: ObjectCard = {
      name: data.name,
      tags: data.tags || [],
      visual_forms: data.visual_forms || [],
      material_textures: data.material_textures || [],
      signature_details: data.signature_details || [],
      scale_contexts: data.scale_contexts || [],
      interaction_modes: data.interaction_modes || [],
      environment_bindings: data.environment_bindings || [],
      role_options: data.role_options || [],
      fusion_forms: data.fusion_forms || {},
      soft_presence_forms: data.soft_presence_forms || [],
      faceswap_forbidden: data.faceswap_forbidden || [],
      faceswap_safe_positive: data.faceswap_safe_positive || [],
    };
    objectCache.set(name, card);
    return card;
  }

  // Generate new card
  console.log('[essenceCards] Generating object card for:', name);
  const card = await generateObjectCard(name, anthropicKey);
  if (!card) return null;

  // Insert into DB (handle race condition)
  const { error: insertErr } = await sb.from('object_cards').insert({
    name,
    tags: card.tags,
    prompt_version: PROMPT_VERSION,
    model_version: MODEL_VERSION,
    visual_forms: card.visual_forms,
    material_textures: card.material_textures,
    signature_details: card.signature_details,
    scale_contexts: card.scale_contexts,
    interaction_modes: card.interaction_modes,
    environment_bindings: card.environment_bindings,
    role_options: card.role_options,
    fusion_forms: card.fusion_forms,
    soft_presence_forms: card.soft_presence_forms,
    faceswap_forbidden: card.faceswap_forbidden,
    faceswap_safe_positive: card.faceswap_safe_positive,
  });

  if (insertErr) {
    if (insertErr.message && insertErr.message.includes('duplicate')) {
      const { data: existing } = await sb
        .from('object_cards')
        .select('*')
        .eq('name', name)
        .eq('is_approved', true)
        .maybeSingle();
      if (existing) {
        const fetched: ObjectCard = {
          name: existing.name,
          tags: existing.tags || [],
          visual_forms: existing.visual_forms || [],
          material_textures: existing.material_textures || [],
          signature_details: existing.signature_details || [],
          scale_contexts: existing.scale_contexts || [],
          interaction_modes: existing.interaction_modes || [],
          environment_bindings: existing.environment_bindings || [],
          role_options: existing.role_options || [],
          fusion_forms: existing.fusion_forms || {},
          soft_presence_forms: existing.soft_presence_forms || [],
          faceswap_forbidden: existing.faceswap_forbidden || [],
          faceswap_safe_positive: existing.faceswap_safe_positive || [],
        };
        objectCache.set(name, fetched);
        return fetched;
      }
    }
    console.error('[essenceCards] Object card insert failed:', insertErr.message);
  }

  objectCache.set(name, card);
  console.log('[essenceCards] Object card created:', name, '| forms:', card.visual_forms.length);
  return card;
}
