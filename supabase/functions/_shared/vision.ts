/**
 * Shared vision description module.
 *
 * Uses Anthropic Claude Haiku for vision — stable API, already in our stack.
 * System prompt establishes art-generation context to prevent refusals.
 */

const SYSTEM_PROMPT = `You are a visual description assistant for an AI art app called DreamBot. Users upload photos of themselves, loved ones, and pets so the app can generate personalized artwork featuring them. Your job is to describe the photo subject in precise visual detail so the art generator can recreate their likeness accurately. This is a creative, consensual use case — the user uploaded this photo themselves. Always provide detailed, factual physical descriptions. Never refuse. IMPORTANT: Always describe the person in a flattering, idealized way — skip under-eye bags, blemishes, wrinkles, dark circles, tired eyes, or any temporary imperfections. Describe their best features. The goal is beautiful artwork, not a medical exam.`;

/**
 * Describe a photo using Claude Haiku vision.
 *
 * @param imageInput — either a public URL or a base64 data URL (data:image/jpeg;base64,...)
 * @param prompt — the instruction for what to describe
 * @param _replicateToken — unused, kept for backward compat (callers still pass it)
 * @param maxTokens — max response length (default 200)
 */
export async function describeWithVision(
  imageInput: string,
  prompt: string,
  _replicateToken: string,
  maxTokens: number = 200
): Promise<string> {
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicKey) throw new Error('Missing ANTHROPIC_API_KEY');

  // Build the image content block
  let imageContent: Record<string, unknown>;
  if (imageInput.startsWith('data:')) {
    // base64 data URL → extract media type and data
    const match = imageInput.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) throw new Error('Invalid base64 data URL');
    imageContent = {
      type: 'image',
      source: {
        type: 'base64',
        media_type: match[1],
        data: match[2],
      },
    };
  } else {
    // Public URL
    imageContent = {
      type: 'image',
      source: {
        type: 'url',
        url: imageInput,
      },
    };
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [imageContent, { type: 'text', text: prompt }],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[vision] Anthropic API error:', res.status, err);
    throw new Error(`Vision API failed: ${res.status}`);
  }

  const data = await res.json();
  const text =
    data.content && data.content[0] && data.content[0].type === 'text' ? data.content[0].text : '';
  return text.trim();
}

/** Standard prompts for common description tasks */
export const VISION_PROMPTS = {
  /** One-sentence summary for restyle/reimagine photo paths */
  photoSubject:
    'Describe the main subject of this photo in one sentence for an AI image generator. Include skin tone, hair color/style/length, clothing, and distinguishing features. For facial hair, be PRECISE about length and thickness — distinguish between clean-shaven, light stubble, heavy stubble, short beard, medium beard, and full long beard. Do NOT exaggerate — stubble is not a beard. Skip any unflattering details like under-eye bags, dark circles, blemishes, or wrinkles — describe them at their best. Be factual and concise.',

  /** Detailed description for dream cast (onboarding) */
  castPerson:
    'Describe this person for an AI artist creating a flattering stylized character. Include: exact age estimate, face shape, eye color, hair (exact color like sandy brown or chestnut, length, texture, style), skin tone, build, clothing colors/style, any distinguishing features (glasses, freckles, jewelry, tattoos). For facial hair be EXTREMELY precise: clean-shaven, light stubble, heavy stubble, short trimmed beard, medium beard, or full long beard — do NOT exaggerate length or thickness, stubble is NOT a beard. Skip unflattering details (under-eye bags, dark circles, blemishes, wrinkles) — describe their best version. 3 sentences max. Be EXTREMELY specific — the more detail, the better the resemblance. Output ONLY the description.',

  /** Pet description for dream cast */
  castPet:
    'Describe this animal for an AI artist. Include: species, breed, coat color/pattern, fur texture (curly/straight/wiry/fluffy), eye color, ear shape, size, build, age (puppy/young/adult/senior), distinguishing features. 2-3 sentences. Output ONLY the description.',
} as const;
