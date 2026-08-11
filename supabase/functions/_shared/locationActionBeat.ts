// locationActionBeat.ts — Option B (Kevin, 2026-08-10): retrofit dynamic poses
// across ALL nightly LOCATION dreams (the ~60% "you at your saved place" path
// that reads stiffest). Instead of a fixed biome pose pool (thin coverage → most
// biomes fall back to standing), we generate a swap-safe action that fits the
// EXACT place, on the fly. The nightly character slot pipeline already writes the
// scene to fit the `action` string, so a location-fit action makes the whole
// render coherent: location → fitting action → scene that matches the location.
//
// The returned string lands VERBATIM in the Flux prompt (assembly position 5,
// right after the anchor) exactly like the biome-pose strings — so it is authored
// in that same style and inside the same swap-safe envelope: waist-up, big frontal
// face, hands/props at chest level or lower, feet planted, no face occlusion, and
// (for dual) a clear gap between the two heads with no center-contact.
//
// Scoped to nightly's plain-location path ONLY. It never touches the shared slot
// pipeline that create/first-dream use. Behind engine_config.location_action_pct
// (0 = off) + a force_location_action QA flag.

import { callSonnet } from './llm.ts';

// Words that would fight the downstream face-forward framing or occlude the face
// if they leaked into the action string. If the model slips one in, we drop the
// render's action (→ classic pose) rather than ship a swap-breaking beat.
const UNSAFE_WORDS =
  /\b(face|faces|eyes?|eyebrows?|gaze|gazing|smil\w*|lips|mouth|cheeks?|jaw|forehead|helmet|mask|masked|hood|hoods|goggles|visor|balaclava|veil|spyglass to (?:the |one'?s )?eye|pipe in (?:the |his |her )?mouth|selfie|camera|lens|kiss\w*|hug\w*|embrac\w*|cheek to cheek)\b/i;

/**
 * Author a short, swap-safe action phrase that naturally fits `location`.
 * Returns null on any failure or safety-filter hit (caller falls back to the
 * classic pose pool, so the render is never blocked).
 */
export async function generateLocationActionBeat(
  location: string,
  castCount: 1 | 2,
  anthropicKey: string
): Promise<string | null> {
  const place = (location || '').trim();
  if (!place) return null;

  const dual = castCount === 2;
  const who = dual ? 'a couple, side by side' : 'one person';
  const prompt = `You caption a face-swap portrait PHOTO taken at a specific place. Invent ONE lively action that fits this EXACT place, so the photo feels dynamic and characterful instead of just standing.

PLACE: "${place}"

The photo shows ${who}, from the WAIST UP, ${dual ? 'each' : 'the person'} turned toward the camera.

HARD RULES — the photo is destroyed if you break any:
- Waist-up framing. EVERY hand, prop, and gesture stays at CHEST LEVEL OR LOWER. Nothing at, near, or above the head.
- Feet planted, near-stationary. No walking, running, jumping, climbing, or moving through the scene.
- Name a CONCRETE prop or gesture that truly belongs at this place, held in a hand.
- NEVER mention the face, eyes, head, hair, expression, a mask/helmet/hood/goggles, the camera, or a lens.
${dual ? '- Give EACH person their own small beat. Keep a clear gap between them — they do NOT touch, hug, kiss, lean together, or face each other.' : ''}

Write ONLY the action phrase, 8-20 words, present-tense gerund style like a photo caption, comma-friendly. No place description, no sentence, no quotes.
STYLE examples (invent your own, do NOT reuse): "raising a brass lantern to inspect a mooring post, other hand on a coiled rope" · "cradling a fresh-picked coconut, a machete tucked at the belt" · "one hand steadying an easel, the other lifting a loaded paintbrush"`;

  try {
    const result = await callSonnet(prompt, anthropicKey, 90);
    const beat = (result.text || '')
      .split('\n')[0]
      .trim()
      .replace(/^["'`]+|["'`]+$/g, '')
      .replace(/\s+/g, ' ')
      .slice(0, 220)
      .trim();
    if (!beat || beat.length < 6) return null;
    if (UNSAFE_WORDS.test(beat)) return null;
    return beat;
  } catch (_e) {
    return null;
  }
}
