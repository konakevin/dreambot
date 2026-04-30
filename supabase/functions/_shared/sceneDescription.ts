/**
 * Generate a short Instagram-style scene description from a Flux prompt.
 *
 * Voice: frank, slightly understated, location-anchored. 2-6 words like a
 * museum plaque or photo album caption — names WHERE this is and WHAT'S
 * happening there. Ignores styling layers (lighting, poses, mood, camera).
 *
 * Used by:
 *   - nightly-dreams: parallel Haiku call alongside image gen (latency-free)
 *   - generate-dream (V4): same fallback when user doesn't supply their own
 *
 * Cost: ~$0.0001 per call. Latency: ~1-2s.
 */

const HAIKU_MODEL = 'claude-haiku-4-5-20251001';

export async function generateSceneDescription(
  finalPrompt: string,
  anthropicKey: string
): Promise<string> {
  const promptForHaiku = `You are tagging a dream image with a SHORT location/scene label — like a museum plaque or photo album caption. Read the Flux AI prompt below and output 2-6 words that name ONLY the LOCATION (the place) and optionally the SCENE ANCHOR (a defining feature/sub-spot/activity at that place).

EXTRACT FROM THE PROMPT:
- The base location (e.g., "Mars colony", "Caribbean island", "Moab arches", "space station")
- The specific spot or activity if relevant ("quarters", "slot canyon", "casino floor", "noodle shop")

IGNORE COMPLETELY (these are styling layers, not the dream's subject):
- Lighting (neon glow, golden hour, atmospheric haze, warm bounce light, blue hour)
- Camera/composition (medium shot, three-quarter view, eye-level, 50mm lens)
- Character poses or body language (barely touching, sitting cross-legged, hands in pockets)
- Mood adjectives (cozy, dramatic, surreal, magical, whimsical)
- Color palettes (saturated, muted, vibrant, desaturated)
- Medium/style fragments (cinematic, photoreal, watercolor, oil painting)
- Comments about the characters themselves ("two of us", "couple", "man and woman")

GOOD EXAMPLES:
- "Mars colony quarters"
- "Caribbean dock"
- "Cyberpunk noodle shop"
- "Moab slot canyon"
- "Bora Bora overwater bungalow"
- "Las Vegas casino floor"
- "Space station observation deck"
- "Hawaiian black sand beach"
- "LA rooftop pool"
- "Cathedral ruins, Caribbean"

AVOID:
- "Mars colony quarters at night, neon glow" (lighting commentary)
- "Caribbean dock with two of us touching" (character commentary)
- "A magical Moab moment" (mood)
- Sentences, hashtags, emojis, quotes

PROMPT:
${finalPrompt}

Output ONLY the 2-6 word location/scene label. No quotes, no preamble.`;

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
