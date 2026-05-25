/**
 * Style distiller — synthesizes a unified style fingerprint from the
 * trifecta that defines every dream: medium key, vibe key, and the
 * final ai_prompt that produced the image.
 *
 * Why all three:
 * - The Flux ai_prompt only contains 70-90 words. The DB medium directive
 *   can be 120-150 words; Sonnet drops half. The vibe directive same.
 *   Distilling from ai_prompt alone loses style signal that lived in the
 *   directives but didn't make it into the final prompt.
 * - The medium and vibe KEYS are structural identity anchors. A
 *   "coquette" dream and a "macabre" dream should reliably feel coquette
 *   and macabre when DLT'd, even if the source prompt's language is thin
 *   on either. Categorical identity preservation matters.
 * - The ai_prompt carries the runtime synthesis: face-swap overrides,
 *   scene-expander language, action-pool injections. Things the
 *   medium/vibe directives alone don't see.
 *
 * The distiller fetches the medium + vibe directives from the DB once,
 * then sends Haiku all three sources (keys + directives + prompt) and
 * asks for one unified, subject-stripped style fingerprint.
 *
 * Failure mode: returns null on any failure (Anthropic outage, missing
 * directive rows, retries exhausted). Caller stores NULL in
 * uploads.style_summary — DLT then falls back to ai_prompt with the
 * existing weaker filtering. Zero-regression scenario.
 */

import { HAIKU } from './models.ts';
const HAIKU_MODEL = HAIKU;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504, 529]);
const RETRY_DELAYS_MS = [1000, 3000, 8000];

const SYSTEM_PROMPT = `You synthesize a unified style fingerprint from three sources that together defined a rendered image: a MEDIUM (art style identity), a VIBE (mood identity), and the final FLUX PROMPT used by the image model.

The fingerprint is used by a "Dream Like This" feature — when a user taps a post they love, your output is fed to the image model alongside their NEW subject prompt. The user wants to FAITHFULLY RECREATE the look of the original post applied to whatever they're dreaming about now.

So: your job is to capture HOW the source image looked — its FORMAT, palette, lighting, technique, mood, character-design conventions, named aesthetics — while removing the specific subjects-in-the-scene (which would replace the user's new subject and ruin the recreation).

OUTPUT FORMAT: a comma-separated list, max 45 words. LEAD with a FORMAT clause stating what KIND of image this is — and at what SCALE and FRAMING when distinctive — because that is the single most recognizable thing about a look. Examples of a FORMAT clause: "macro photograph of a small hand-painted tabletop miniature figurine on a flocked base, shallow depth of field", "product photo of a glossy vinyl collectible figure", "photograph of a physical scene built from LEGO bricks", "stop-motion claymation still", "oil-painted fantasy book-cover illustration", "pixel-art sprite", "diorama photographed close-up". THEN list the style anchors (palette, lighting, technique, texture). Be specific — the more vivid, the better the recreation.

KEEP (these define the LOOK and should be preserved):
- FORMAT / image-type: what KIND of object or image this is and its SCALE + FRAMING — "macro photo of a physical miniature on a base", "product shot of a figurine", "a painting", "a sculpture", "a pixel sprite", "a claymation still", "extreme close macro, shallow DOF", "single small object filling the frame". This is the MOST important anchor — without it the recreation collapses into a generic realistic scene.
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

MEDIUM: tabletop_minis (Warhammer / D&D / Reaper tabletop-miniature aesthetic, 28-32mm painted pewter figures, flocked scenic bases)
VIBE: arcane (otherworldly luminescence, glowing violet)
FLUX PROMPT: "hand-painted tabletop miniature, single fantasy warrior figure on a flocked base, drybrushed metallic armor, cabinet LED rim-light, shallow depth of field, blurred tabletop background"
Output: macro photograph of a single small hand-painted tabletop miniature figurine on a flocked scenic base, extreme shallow depth of field, blurred tabletop background, 28-32mm scale, visible brushstrokes and drybrushed metallic paint, cabinet LED rim-light, arcane glowing violet palette

MEDIUM: watercolor (watercolor washes with translucent layers, soft pigment bloom, organic paper texture)
VIBE: macabre (haunting, gothic, blood-tinged, candlelit shadows, oil-painted gloom)
FLUX PROMPT: "watercolor, gothic cathedral at midnight, vampire portrait, blood moon, candlelight, oil paint and heavy ink, pale skin and dark sunken eyes, no text"
Output: watercolor painting on paper texture, translucent washes, macabre haunted mood, oil paint, heavy ink, pale gothic skin tones, dark sunken eyes, blood-tinged crimson palette, candlelit shadows, midnight blue gloom, gothic atmosphere

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
Output: photorealistic photograph, peaceful soft natural light, gentle natural palette, fine grain, calm atmosphere

MEDIUM: (none)
VIBE: (none)
FLUX PROMPT: "a thing"
Output: NO_STYLE_SIGNAL`;

interface DistillInput {
  /** The ai_prompt that produced the image (70-90 word Flux output). Optional but heavily weighted. */
  rawPrompt: string | null | undefined;
  /** Medium key from dream_mediums (e.g., "watercolor", "fairytale"). Looked up to fetch the directive. */
  mediumKey: string | null | undefined;
  /** Vibe key from dream_vibes (e.g., "macabre", "coquette"). Looked up to fetch the directive. */
  vibeKey: string | null | undefined;
}

/**
 * Distill a unified style fingerprint from medium + vibe + ai_prompt.
 *
 * Fetches medium + vibe directives from the DB so Haiku sees the canonical
 * style language for each, not just the key. Sends all three sources to
 * Haiku as a structured prompt and asks for one synthesized fingerprint.
 *
 * Returns null on any failure — caller stores NULL and DLT falls back.
 */
export async function distillStyle(
  input: DistillInput,
  anthropicKey: string | undefined,
  // deno-lint-ignore no-explicit-any
  supabase: any
): Promise<string | null> {
  const { rawPrompt, mediumKey, vibeKey } = input;
  if (!anthropicKey) return null;
  // Need at least one signal to distill. If everything's empty, give up.
  if (!rawPrompt?.trim() && !mediumKey && !vibeKey) return null;

  // Fetch medium + vibe directives in parallel. Missing rows are okay
  // (treated as "(none)") — the prompt alone may still carry signal.
  const [mediumRow, vibeRow] = await Promise.all([
    mediumKey
      ? supabase
          .from('dream_mediums')
          .select('key, directive')
          .eq('key', mediumKey)
          .maybeSingle()
          .then((r: { data: { key: string; directive: string } | null }) => r.data)
          .catch(() => null)
      : Promise.resolve(null),
    vibeKey
      ? supabase
          .from('dream_vibes')
          .select('key, directive')
          .eq('key', vibeKey)
          .maybeSingle()
          .then((r: { data: { key: string; directive: string } | null }) => r.data)
          .catch(() => null)
      : Promise.resolve(null),
  ]);

  const mediumLine = mediumRow
    ? `${mediumRow.key} (${truncateDirective(mediumRow.directive)})`
    : mediumKey || '(none)';
  const vibeLine = vibeRow
    ? `${vibeRow.key} (${truncateDirective(vibeRow.directive)})`
    : vibeKey || '(none)';
  const promptLine = rawPrompt?.trim() || '(none)';

  const userMessage = `MEDIUM: ${mediumLine}
VIBE: ${vibeLine}
FLUX PROMPT: "${promptLine}"`;

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
          max_tokens: 150,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!res.ok) {
        if (RETRYABLE_STATUSES.has(res.status) && attempt < RETRY_DELAYS_MS.length) {
          await sleep(RETRY_DELAYS_MS[attempt]);
          continue;
        }
        console.warn(`[styleDistiller] non-retryable ${res.status}`);
        return null;
      }

      const data = await res.json();
      const text = (data?.content?.[0]?.text ?? '').trim();
      if (!text) return null;
      if (text === 'NO_STYLE_SIGNAL' || text.startsWith('NO_STYLE_SIGNAL')) {
        return null;
      }
      // Cap at 400 chars to fit the format clause + style anchors (45-word budget).
      return text.length > 400 ? text.slice(0, 400) : text;
    } catch (err) {
      if (attempt < RETRY_DELAYS_MS.length) {
        console.warn(`[styleDistiller] attempt ${attempt + 1} failed: ${(err as Error).message}`);
        await sleep(RETRY_DELAYS_MS[attempt]);
        continue;
      }
      console.warn(`[styleDistiller] retries exhausted: ${(err as Error).message}`);
      return null;
    }
  }
  return null;
}

/**
 * Trim a medium/vibe directive to a tight ~80-word summary so the
 * Haiku context stays small and focused. The directives can be 120-150
 * words; we don't need every detail — just the dominant style language.
 */
function truncateDirective(directive: string): string {
  const cleaned = directive.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 400) return cleaned;
  return cleaned.slice(0, 400).replace(/\s+\S*$/, '') + '…';
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
