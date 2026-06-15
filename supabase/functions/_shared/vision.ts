/**
 * Shared vision description module.
 *
 * Uses Anthropic Claude Haiku for vision — stable API, already in our stack.
 * System prompt establishes art-generation context to prevent refusals.
 */

import { HAIKU } from './models.ts';
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
      model: HAIKU,
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

/**
 * Classify the apparent gender of the LEFT and RIGHT person in a two-person
 * render. Used by the dual face-swap pipeline to route each cast member's face
 * onto the body of the matching gender.
 *
 * Why this exists: Flux frequently renders the two people on the OPPOSITE sides
 * from the prompt, and the face-swap model pastes a face onto whatever body is
 * in each crop. So on a mixed-gender couple, a left/right flip becomes a gender
 * swap (self's face landing on the partner's body). We classify the rendered
 * image and route sources by gender instead of trusting position.
 *
 * Returns 'male' | 'female' per side, or null for a side it can't read. The
 * caller treats any failure as a fall-back to positional assignment.
 */
export async function classifyDualGenders(
  imageInput: string,
  replicateToken: string
): Promise<{ left: 'male' | 'female' | null; right: 'male' | 'female' | null }> {
  const prompt =
    'This image shows two people positioned side by side (this is for routing a consensual face-swap of the user and their own cast photos). Identify the apparent gender of the person in the LEFT half and the person in the RIGHT half. Respond with EXACTLY two words separated by a comma — the left person first, then the right person — each either "male" or "female". No other text. Example: "female, male".';
  const raw = await describeWithVision(imageInput, prompt, replicateToken, 20);
  const parse = (s: string): 'male' | 'female' | null => {
    const t = s.toLowerCase();
    // Check 'female' first — 'female' contains the substring 'male'.
    if (t.includes('female')) return 'female';
    if (t.includes('male')) return 'male';
    return null;
  };
  const parts = raw.split(',');
  return { left: parse(parts[0] || ''), right: parse(parts[1] || '') };
}

/** Standard prompts for common description tasks */
export const VISION_PROMPTS = {
  /** One-sentence summary for the RESTYLE path — KEEPS the actual outfit, since
   *  restyle transforms the real photo (pose + clothing preserved). */
  photoSubject:
    'Describe the main subject of this photo in one sentence for an AI image generator. Include skin tone, hair color/style/length, clothing, and distinguishing features. For facial hair, be PRECISE about length and thickness — distinguish between clean-shaven, light stubble, heavy stubble, short beard, medium beard, and full long beard. Do NOT exaggerate — stubble is not a beard. Skip any unflattering details like under-eye bags, dark circles, blemishes, or wrinkles — describe them at their best. Be factual and concise.',

  /** Detailed person description for dream cast (onboarding) AND uploaded-photo
   *  face-swap dreams (new_scene / reimagine) — ONE high-quality standard for
   *  both. Clothing-free (the generator dresses them for the scene) + detailed
   *  for resemblance. Returns a prose description, then AGE: and TRAITS: lines;
   *  the upload path keeps only the prose via stripCastMeta(). */
  castPerson:
    'FIRST WORD of your response MUST be either "Male:" or "Female:" — identify the gender of this person, then describe them for an AI artist creating a flattering stylized character. Include: exact age estimate, face shape, eye color, hair (exact color like sandy brown or chestnut, length, texture, style), skin tone, build, any distinguishing features (glasses, freckles, jewelry, tattoos). Do NOT describe clothing or accessories that change — the art generator will dress them in the scene style. For facial hair be EXTREMELY precise: clean-shaven, light stubble, heavy stubble, short trimmed beard, medium beard, or full long beard — do NOT exaggerate length or thickness, stubble is NOT a beard. Skip unflattering details (under-eye bags, dark circles, blemishes, wrinkles) — describe their best version. For BUILD, use the most flattering ACCURATE descriptor — graceful, body-positive language (curvy, full-figured, soft) and never clinical or unkind size labels. Stay true to their real build so they remain recognizable — never slim someone down unrealistically — but always present them in their best, most attractive light. 3 sentences max. Be EXTREMELY specific — the more detail, the better the resemblance.\n\nAfter the description, add a NEW LINE starting with "AGE:" followed by your best numeric age estimate as an integer only (no words, no qualifiers, no range). Example: "AGE: 34". Lean YOUNGER if uncertain — image gen drifts older by default.\n\nAfter the AGE line, add a NEW LINE starting with "TRAITS:" followed by a single concise sentence listing ONLY the non-negotiable physical traits: hair color and length, facial hair (if any), skin tone, approximate age, build, and eye color. Example: "TRAITS: Short dark brown hair, full beard, olive skin, mid-30s, athletic build, brown eyes." This line must be factual and compact — no adjectives beyond what\'s needed to identify the trait. IMPORTANT: never use negative phrasing like "no facial hair" or "no glasses" — AI generators interpret negatives as positives. If a trait is absent, simply omit it. For clean-shaven MALE faces, say "clean-shaven" instead of "no beard." For females, do NOT mention facial hair at all. Output ONLY the description, AGE line, and TRAITS line.',

  /** Pet description for dream cast */
  castPet:
    'Describe this animal for an AI artist. Include: species, breed, coat color/pattern, fur texture (curly/straight/wiry/fluffy), eye color, ear shape, size, build, age (puppy/young/adult/senior), distinguishing features. 2-3 sentences.\n\nAfter the description, add a NEW LINE starting with "TRAITS:" followed by a single concise sentence listing the key physical traits: species, breed, coat color/pattern, size, and any distinguishing features. Example: "TRAITS: Medium golden retriever, wavy cream coat, brown eyes, floppy ears." Output ONLY the description and TRAITS line.',
} as const;
