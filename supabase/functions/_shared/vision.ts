/**
 * Shared vision description module.
 *
 * Single source of truth for all photo-to-text description calls.
 * Uses Llama 3.2 Vision 90B via Replicate — never refuses to describe people.
 */

/** The Replicate model used for all vision/description tasks */
export const VISION_MODEL = 'meta/llama-3.2-90b-vision';

const VISION_API_URL = `https://api.replicate.com/v1/models/${VISION_MODEL}/predictions`;

/**
 * Describe a photo using Llama Vision.
 *
 * @param imageInput — either a public URL or a base64 data URL (data:image/jpeg;base64,...)
 * @param prompt — the instruction for what to describe
 * @param replicateToken — Replicate API token
 * @param maxTokens — max response length (default 200)
 */
export async function describeWithVision(
  imageInput: string,
  prompt: string,
  replicateToken: string,
  maxTokens: number = 200
): Promise<string> {
  const createRes = await fetch(VISION_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: {
        image: imageInput,
        prompt,
        max_tokens: maxTokens,
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error('[vision] Replicate create error:', createRes.status, err);
    throw new Error(`Vision API failed: ${createRes.status}`);
  }

  const pred = await createRes.json();
  if (!pred.id) throw new Error('No prediction ID');

  // Poll for result
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${replicateToken}` },
    });
    const data = await pollRes.json();
    if (data.status === 'succeeded') {
      const output = Array.isArray(data.output) ? data.output.join('') : (data.output ?? '');
      return output.trim();
    }
    if (data.status === 'failed') {
      console.error('[vision] Replicate failed:', data.error);
      throw new Error(`Vision failed: ${data.error}`);
    }
  }
  throw new Error('Vision API timed out');
}

/** Standard prompts for common description tasks */
export const VISION_PROMPTS = {
  /** One-sentence summary for restyle/reimagine photo paths */
  photoSubject:
    'Describe the main subject of this photo in one sentence. Include skin tone, hair color/style, clothing, and any distinguishing features. Be factual and concise.',

  /** Detailed description for dream cast (onboarding) */
  castPerson:
    'Describe this person for an AI artist creating a stylized character. Include: exact age estimate, face shape, eye color, hair (exact color like sandy brown or chestnut, length, texture, style), facial hair if any, skin tone, build, clothing colors/style, any distinguishing features (glasses, freckles, jewelry, tattoos). 3 sentences max. Be EXTREMELY specific — the more detail, the better the resemblance. Output ONLY the description.',

  /** Pet description for dream cast */
  castPet:
    'Describe this animal for an AI artist. Include: species, breed, coat color/pattern, fur texture (curly/straight/wiry/fluffy), eye color, ear shape, size, build, age (puppy/young/adult/senior), distinguishing features. 2-3 sentences. Output ONLY the description.',
} as const;
