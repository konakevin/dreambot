/**
 * styleDistiller.js — Node port of supabase/functions/_shared/styleDistiller.ts.
 *
 * Synthesizes a unified style fingerprint from the trifecta that defined a
 * rendered image: medium key, vibe key, and the final ai_prompt.
 *
 * Used by:
 *   - scripts/lib/botEngine.js (postAsBot — bot V2 engine, blocking await)
 *   - scripts/backfill-style-summary.js (backfill old NULL rows)
 *
 * The Edge Function version (Deno/TS) lives at
 *   supabase/functions/_shared/styleDistiller.ts
 * Both versions MUST stay in sync — same SYSTEM_PROMPT, same Haiku call,
 * same null-on-failure semantics. If you change one, change both.
 *
 * Contract:
 *   distillStyle({ rawPrompt, mediumKey, vibeKey }, anthropicKey, supabase)
 *     → Promise<string | null>
 *
 * - Fetches medium + vibe directives from DB on first call (cached per
 *   process via the supabase client passed in)
 * - Returns ≤320 char comma-separated style fingerprint, or null
 * - On any failure (Anthropic outage, missing directives, parse error,
 *   retries exhausted, NO_STYLE_SIGNAL), returns null. Caller stores NULL,
 *   DLT falls back to raw ai_prompt with the existing weaker filtering.
 *   Zero-regression scenario.
 */

const { HAIKU } = require('./models');
const HAIKU_MODEL = HAIKU;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504, 529]);
const RETRY_DELAYS_MS = [1000, 3000, 8000];

const SYSTEM_PROMPT = `You synthesize a unified style fingerprint from three sources that together defined a rendered image: a MEDIUM (art style identity), a VIBE (mood identity), and the final FLUX PROMPT used by the image model.

The fingerprint is used by a "Dream Like This" feature — when a user taps a post they love, your output is fed to the image model alongside their NEW subject prompt. The user wants to FAITHFULLY RECREATE the look of the original post applied to whatever they're dreaming about now.

So: your job is to capture HOW the source image looked — palette, lighting, technique, mood, character-design conventions, named aesthetics — while removing the specific subjects-in-the-scene (which would replace the user's new subject and ruin the recreation).

OUTPUT FORMAT: a comma-separated list, max 35 words. Lead with the most distinctive style anchors. Be specific. The more vivid the style language, the better the recreation.

KEEP (these define the LOOK and should be preserved):
- Medium / technique words: "watercolor washes", "oil paint", "heavy ink", "pixel art", "claymation", "3D render", "ray-traced", "cel-shaded"
- Named aesthetics and references: "Tim Burton aesthetic", "Studio Ghibli", "Pixar character design", "Wes Anderson", "Bauhaus", "Art Deco", "Bloodborne dread", "Castlevania energy", "Moebius linework" — these are STYLE SHORTHAND, they tell the model how to render
- Stylistic body/figure language: "spindly elongated proportions", "exaggerated facial features", "anime-large eyes", "pale gothic skin tones", "dark sunken eye sockets", "Disney princess proportions" — these describe HOW characters/figures are drawn, regardless of WHAT character it is
- Color palette, light direction/quality/temperature
- Camera/lens descriptors, depth of field, focal length, aspect, color grading
- Atmosphere and mood words: "haunted", "luminous", "dreamy", "cozy", "ethereal", "moody"
- Texture and material language
- Era/genre style descriptors: "noir", "baroque", "vaporwave", "70s film grain"

STRIP (these are the SUBJECT — what the source image was OF):
- Specific creatures and beings IN the scene: "vampire", "dragon", "T-rex", "warrior", "mermaid", "robot" (when they're scene subjects)
- Specific buildings/structures: "cathedral", "castle", "tower", "mall", "diner"
- Specific named places: "Tokyo", "Paris", "Mars", "the moon"
- Specific objects: "lightsaber", "guitar", "telescope", "umbrella"
- Specific vehicles, weapons, animals-as-pets, plants-as-subjects, food
- Actions/poses: "running", "kissing", "holding"
- Specific named characters/IP-figures: "Mickey Mouse", "Yoda", "Hello Kitty" (named characters AS SUBJECTS — distinct from named-aesthetic references like "Tim Burton")
- Body parts only when described as scene action (e.g., "raised fist" = subject; but "spindly limbs" describing a style = KEEP)

The key distinction: if removing it changes WHAT the picture is OF, strip it. If removing it changes HOW the picture LOOKS, keep it.

WEIGHT THE MEDIUM AND VIBE: even if the FLUX PROMPT's language is light on them, anchor the fingerprint in the medium and vibe character — they are the structural identity.

If all three sources are too thin to extract any meaningful style, output exactly: NO_STYLE_SIGNAL

Output the comma-separated descriptors only. No preamble. No quotes. No labels.

Examples:

MEDIUM: watercolor (watercolor washes with translucent layers, soft pigment bloom, organic paper texture)
VIBE: macabre (haunting, gothic, blood-tinged, candlelit shadows, oil-painted gloom)
FLUX PROMPT: "watercolor, gothic cathedral at midnight, vampire portrait, blood moon, candlelight, oil paint and heavy ink, pale skin and dark sunken eyes, no text"
Output: watercolor washes, macabre haunted mood, oil paint, heavy ink, pale gothic skin tones, dark sunken eyes, blood-tinged crimson palette, candlelit shadows, midnight blue gloom, gothic atmosphere

MEDIUM: animation (Tim Burton stop-motion aesthetic, exaggerated character design, gothic whimsy)
VIBE: cinematic (dramatic three-point lighting, cinematic color grading)
FLUX PROMPT: "Tim Burton gothic style, spindly elongated limbs, spiral motifs, black and white with purple accents, sunken dark-ringed eyes, crooked angular architecture"
Output: Tim Burton gothic whimsy, cinematic dramatic lighting, spindly elongated proportions, sunken dark-ringed eyes, pale skin tones, spiral motifs, black and white with purple accents, angular crooked silhouettes, atmospheric fog and moonlight, teal-orange grading

MEDIUM: anime (Studio Ghibli hand-painted, soft cel-shaded, watercolor backgrounds)
VIBE: enchanted (sparkling magical wonder, luminous, dreamlike)
FLUX PROMPT: "Studio Ghibli style, hand-painted watercolor backgrounds, soft organic linework, warm golden lighting, glowing pollen particles, muted earth tones"
Output: Studio Ghibli hand-painted watercolor, soft cel-shaded, organic linework, enchanted dreamlike wonder, warm golden lighting, luminous glowing pollen particles, muted earth tones, ethereal mist, dreamy nostalgic depth

MEDIUM: photography (photorealistic, natural light, fine grain)
VIBE: peaceful (calm, soft, centered, gently illuminated)
FLUX PROMPT: "a person walking"
Output: photorealistic, peaceful soft light, gentle natural palette, calm atmosphere

MEDIUM: (none)
VIBE: (none)
FLUX PROMPT: "a thing"
Output: NO_STYLE_SIGNAL`;

// Per-supabase-client directive cache. WeakMap so multiple clients don't
// pollute each other; keys are the supabase client object itself. Each
// cache holds {mediums: Map, vibes: Map, loaded: boolean}.
const _directiveCache = new WeakMap();

function _getCache(supabase) {
  let c = _directiveCache.get(supabase);
  if (!c) {
    c = { mediums: new Map(), vibes: new Map(), loaded: false };
    _directiveCache.set(supabase, c);
  }
  return c;
}

async function _loadDirectivesOnce(supabase) {
  const cache = _getCache(supabase);
  if (cache.loaded) return cache;
  const [m, v] = await Promise.all([
    supabase.from('dream_mediums').select('key, directive'),
    supabase.from('dream_vibes').select('key, directive'),
  ]);
  for (const row of m.data || []) cache.mediums.set(row.key, row.directive);
  for (const row of v.data || []) cache.vibes.set(row.key, row.directive);
  cache.loaded = true;
  return cache;
}

function truncateDirective(directive) {
  if (!directive) return null;
  const cleaned = directive.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 400) return cleaned;
  return cleaned.slice(0, 400).replace(/\s+\S*$/, '') + '…';
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Distill a unified style fingerprint from medium + vibe + ai_prompt.
 *
 * @param {{rawPrompt:string|null, mediumKey:string|null, vibeKey:string|null}} input
 * @param {string} anthropicKey
 * @param {object} supabase  Supabase client (for directive lookups, cached)
 * @returns {Promise<string|null>}  ≤320 char fingerprint, or null on failure / NO_STYLE_SIGNAL
 */
async function distillStyle(input, anthropicKey, supabase) {
  const { rawPrompt, mediumKey, vibeKey } = input;
  if (!anthropicKey) return null;
  if (!rawPrompt?.trim() && !mediumKey && !vibeKey) return null;

  // Lazy-load directives once per supabase client.
  const cache = await _loadDirectivesOnce(supabase);

  const mediumDir = mediumKey ? truncateDirective(cache.mediums.get(mediumKey)) : null;
  const vibeDir = vibeKey ? truncateDirective(cache.vibes.get(vibeKey)) : null;
  const mediumLine = mediumDir ? `${mediumKey} (${mediumDir})` : mediumKey || '(none)';
  const vibeLine = vibeDir ? `${vibeKey} (${vibeDir})` : vibeKey || '(none)';
  const promptLine = rawPrompt?.trim() || '(none)';

  const userMessage = `MEDIUM: ${mediumLine}\nVIBE: ${vibeLine}\nFLUX PROMPT: "${promptLine}"`;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: HAIKU_MODEL,
          max_tokens: 100,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!res.ok) {
        if (RETRYABLE_STATUSES.has(res.status) && attempt < RETRY_DELAYS_MS.length) {
          await sleep(RETRY_DELAYS_MS[attempt]);
          continue;
        }
        return null;
      }

      const data = await res.json();
      const text = (data?.content?.[0]?.text ?? '').trim();
      if (!text) return null;
      if (text === 'NO_STYLE_SIGNAL' || text.startsWith('NO_STYLE_SIGNAL')) return null;
      return text.length > 320 ? text.slice(0, 320) : text;
    } catch (err) {
      if (attempt < RETRY_DELAYS_MS.length) {
        await sleep(RETRY_DELAYS_MS[attempt]);
        continue;
      }
      return null;
    }
  }
  return null;
}

module.exports = { distillStyle };
