/**
 * Generate a short location label from a Flux prompt.
 *
 * Format: "Place, Region" — like a photo album geotag.
 *   - Earth places get the state / country: "Los Angeles, California",
 *     "Lanikai Beach, Hawaii", "Bora Bora, French Polynesia"
 *   - Fictional / non-Earth places use just the proper name (no region):
 *     "Mars colony", "Cyberpunk Tokyo", "Space station"
 *
 * Ignores all styling layers (lighting, poses, mood, camera, medium).
 *
 * Used by:
 *   - nightly-dreams: parallel Haiku call alongside image gen (latency-free)
 *   - generate-dream (V4): same fallback when user doesn't supply their own
 *
 * Cost: ~$0.0001 per call. Latency: ~1-2s.
 */

import { HAIKU } from './models.ts';
const HAIKU_MODEL = HAIKU;

export async function generateSceneDescription(
  finalPrompt: string,
  anthropicKey: string
): Promise<string> {
  const promptForHaiku = `You are tagging a dream image with a SHORT location label — like a photo album geotag. Read the Flux AI prompt below and output the location in this EXACT format:

  "<Place>, <Region>"

Where <Place> is the specific city, town, beach, park, landmark, or natural feature, and <Region> is the state, province, or country.

REAL-EARTH EXAMPLES (always include the region):
- "Los Angeles, California"
- "Lanikai Beach, Hawaii"
- "Bora Bora, French Polynesia"
- "Moab, Utah"
- "Big Sur, California"
- "Banff, Alberta"
- "Tokyo, Japan"
- "Santorini, Greece"
- "Joshua Tree, California"

FICTIONAL / NON-EARTH PLACES (no region — just the proper name):
- "Mars colony"
- "Cyberpunk Tokyo"
- "Space station"
- "Underwater city"

EXTRACT THE LOCATION FROM THE PROMPT:
- If the prompt names a real Earth place (city / beach / park / landmark / region), output "<Place>, <State or Country>"
- If the prompt names a fictional or off-Earth setting, output just the proper name
- If there are multiple places named, pick the most specific identifiable one
- If the place is named without a region in the prompt but you know the region (e.g., "Lanikai Beach" → Hawaii, "Moab" → Utah), supply the region

IGNORE COMPLETELY (these are styling layers, not the location):
- Lighting (neon glow, golden hour, atmospheric haze, warm bounce light, blue hour)
- Camera / composition (medium shot, three-quarter view, eye-level, 50mm lens)
- Character poses or body language (barely touching, sitting cross-legged, hands in pockets)
- Mood adjectives (cozy, dramatic, surreal, magical, whimsical)
- Color palettes (saturated, muted, vibrant, desaturated)
- Medium / style fragments (cinematic, photoreal, watercolor, oil painting)
- Sub-spots or activities at the place (rooftop pool, casino floor, slot canyon, noodle shop)
- Comments about the characters themselves

NEVER OUTPUT:
- Sub-spot suffixes ("Las Vegas casino floor" — use "Las Vegas, Nevada")
- Mood / styling words ("magical Moab" — use "Moab, Utah")
- Sentences, hashtags, emojis, quotes
- Generic terms when a specific place is identifiable ("a beach" — use the named one)

PROMPT:
${finalPrompt}

Output ONLY the location label. No quotes, no preamble.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: HAIKU_MODEL,
      max_tokens: 60,
      messages: [{ role: 'user', content: promptForHaiku }],
    }),
  });
  if (!res.ok) throw new Error(`Haiku description gen failed: ${res.status}`);
  const data = await res.json();
  const text =
    data.content && data.content[0] && data.content[0].type === 'text' ? data.content[0].text : '';
  return text.trim().replace(/^["']|["']$/g, '');
}
