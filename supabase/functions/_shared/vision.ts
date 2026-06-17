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
/**
 * Read a two-person render for dual face-swap routing.
 *
 * Returns, for the LEFT and RIGHT person, their apparent gender, plus
 * `faceCount` (how many distinct faces vision could see) and `twoDistinctFaces`
 * (a clear face on each side). The caller uses gender to route male→male /
 * female→female, and uses faceCount/twoDistinctFaces to AVOID dual-swapping
 * when the render clustered the couple — that's the "both faces pasted onto
 * one person" failure (the fixed 55/55 crop catches the same face twice).
 *
 * HARDENING 2026-06-16: the old parser accepted ONLY the literal words
 * "male"/"female", but vision models overwhelmingly say "man"/"woman" — and
 * "woman" contains "man" but not "male" — so it returned null ~every call →
 * `routing: 'unread'` ~100% of the time → the whole gender safeguard was inert.
 * Now we accept man/woman/boy/girl/etc., ask for a face count, and retry once
 * when the first read is unusable (stylized renders read inconsistently).
 */
export async function classifyDualGenders(
  imageInput: string,
  replicateToken: string
): Promise<{
  left: 'male' | 'female' | null;
  right: 'male' | 'female' | null;
  faceCount: number | null;
  twoDistinctFaces: boolean;
}> {
  const prompt =
    'This image is for routing a consensual face-swap of a user onto their OWN cast photos — describe the people factually. Reply with EXACTLY three fields separated by vertical bars |: (1) the number of distinct human faces clearly visible, (2) the apparent gender of the person on the LEFT, (3) the apparent gender of the person on the RIGHT. Use the word "man" or "woman" for each gender. If only one face is clearly visible, put "none" for the side with no person. No other words. Examples: "2|woman|man" or "1|man|none".';

  const readGender = (s: string): 'male' | 'female' | null => {
    const t = s.toLowerCase();
    // FEMALE first — "female" contains "male"; "woman" contains "man".
    if (/\b(female|woman|women|girl|lady|gal)\b/.test(t)) return 'female';
    if (/\b(male|man|men|boy|guy|gentleman|dude|gent)\b/.test(t)) return 'male';
    return null;
  };

  const classifyOnce = async () => {
    const raw = (await describeWithVision(imageInput, prompt, replicateToken, 40)).trim();
    const parts = raw.split('|');
    let left: 'male' | 'female' | null = null;
    let right: 'male' | 'female' | null = null;
    let faceCount: number | null = null;
    if (parts.length >= 3) {
      const c = parts[0].match(/\d+/);
      faceCount = c ? parseInt(c[0], 10) : null;
      left = readGender(parts[1]);
      right = /\bnone\b/i.test(parts[2]) ? null : readGender(parts[2]);
    } else {
      // Fallback: model ignored the format. Scan free-form (also covers the old
      // "female, male" two-word style).
      const seg = raw.split(/[,;\n|]/);
      left = readGender(seg[0] || '');
      right = readGender(seg[1] || '');
      const c = raw.match(/\b([1-9])\b/);
      faceCount = c ? parseInt(c[1], 10) : null;
    }
    return { left, right, faceCount, readAny: left !== null || right !== null };
  };

  // DOUBLE-READ AGREEMENT — classify TWICE and trust a side ONLY when both
  // independent reads agree. A single transient vision misread can no longer
  // produce a confident (wrong) gender; it takes two consistent reads to confirm
  // a side, otherwise that side reads null and the caller degrades. This is the
  // belt-and-suspenders against the classifier itself being wrong.
  const r1 = await classifyOnce();
  const r2 = await classifyOnce();
  const agree = (a: 'male' | 'female' | null, b: 'male' | 'female' | null) =>
    a !== null && a === b ? a : null;
  const left = agree(r1.left, r2.left);
  const right = agree(r1.right, r2.right);
  // faceCount: if EITHER read sees a single face, treat as clustered
  // (conservative — never dual a maybe-clustered render); else take an agreed
  // count, else the best available.
  const faceCount =
    r1.faceCount === 1 || r2.faceCount === 1
      ? 1
      : r1.faceCount !== null && r1.faceCount === r2.faceCount
        ? r1.faceCount
        : (r1.faceCount ?? r2.faceCount ?? null);

  // Two distinct faces only when BOTH sides agree on a gender AND the count
  // isn't an explicit 1. A clustered couple reads as faceCount=1 or a non-agreed
  // side → twoDistinctFaces=false → caller single-swaps / degrades.
  const twoDistinctFaces = faceCount !== 1 && left !== null && right !== null;

  return { left, right, faceCount, twoDistinctFaces };
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
    'Your response MUST BEGIN with a HEADER LINE and nothing before it, in EXACTLY this format: the gender ("Male" or "Female"), a comma, then the build (exactly ONE of "thin", "athletic", or "average"). Examples: "Female, average" or "Male, athletic". Commit to the GENDER and the BUILD on this first line — they are the two most important calls, so decide them FIRST. BUILD RULE (critical, honor it exactly): use ONLY thin / athletic / average. Anyone who is not clearly thin or clearly athletic is "average". NEVER output any other size or shape word anywhere (NO curvy, full-figured, soft, stocky, petite, heavy, heavyset, plus, plus-size, overweight, busty, chubby, large, big) — "average" covers everyone else, so no one is ever given a heavy or unkind label. Then describe them for an AI artist creating a flattering stylized character — focus on the FACE and HAIR. Include: exact age estimate, face shape, eye color, hair (exact color like sandy brown or chestnut, length, texture, style), skin tone, any distinguishing features (glasses, freckles, jewelry, tattoos). Do NOT describe clothing or accessories that change — the art generator will dress them in the scene style. Do NOT describe body size or shape again in the prose — the header build word is the ONLY body descriptor allowed. For facial hair be EXTREMELY precise: clean-shaven, light stubble, heavy stubble, short trimmed beard, medium beard, or full long beard — do NOT exaggerate length or thickness, stubble is NOT a beard. Skip unflattering details (under-eye bags, dark circles, blemishes, wrinkles) — describe their best version. 3 sentences max. Be EXTREMELY specific — the more detail, the better the resemblance.\n\nAfter the description, add a NEW LINE starting with "AGE:" followed by your best numeric age estimate as an integer only (no words, no qualifiers, no range). Example: "AGE: 34". Lean YOUNGER if uncertain — image gen drifts older by default.\n\nAfter the AGE line, add a NEW LINE starting with "TRAITS:" followed by a single concise sentence listing ONLY the non-negotiable physical traits: hair color and length, facial hair (if any), skin tone, approximate age, build (ONLY one of: thin/athletic/average), and eye color. Example: "TRAITS: Short dark brown hair, full beard, olive skin, mid-30s, athletic build, brown eyes." This line must be factual and compact — no adjectives beyond what\'s needed to identify the trait. IMPORTANT: never use negative phrasing like "no facial hair" or "no glasses" — AI generators interpret negatives as positives. If a trait is absent, simply omit it. For clean-shaven MALE faces, say "clean-shaven" instead of "no beard." For females, do NOT mention facial hair at all. Output ONLY the description, AGE line, and TRAITS line.',

  /** Pet description for dream cast */
  castPet:
    'Describe this animal for an AI artist. Include: species, breed, coat color/pattern, fur texture (curly/straight/wiry/fluffy), eye color, ear shape, size, build, age (puppy/young/adult/senior), distinguishing features. 2-3 sentences.\n\nAfter the description, add a NEW LINE starting with "TRAITS:" followed by a single concise sentence listing the key physical traits: species, breed, coat color/pattern, size, and any distinguishing features. Example: "TRAITS: Medium golden retriever, wavy cream coat, brown eyes, floppy ears." Output ONLY the description and TRAITS line.',
} as const;
