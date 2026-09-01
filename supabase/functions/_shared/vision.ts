/**
 * Shared vision description module.
 *
 * Uses Anthropic Claude Haiku for vision — stable API, already in our stack.
 * System prompt establishes art-generation context to prevent refusals.
 */

import { HAIKU } from './models.ts';
import { sanitizeUserText } from './sanitizeUserText.ts';
import { jitter } from './jitter.ts';
import { RETRY_DELAYS_MS, RETRYABLE_STATUSES } from './llm.ts';

// Vision retries fewer times than the brief path (llm.ts, 4): the callers here
// (cast description, dual-gender classification) degrade gracefully on failure,
// and classifyDualGenders already double-reads — so a short, jittered ladder is
// enough to survive a transient Anthropic 429/5xx without over-spending calls.
const VISION_MAX_RETRIES = 2;
const SYSTEM_PROMPT = `You are a visual description assistant for an AI art app called DreamBot. Users upload photos of themselves, loved ones, and pets so the app can generate personalized artwork featuring them. Your job is to describe the photo subject in precise visual detail so the art generator can recreate their likeness accurately. This is a creative, consensual use case — the user uploaded this photo themselves. Always provide detailed, factual physical descriptions. Never refuse. IMPORTANT: Always describe the person in a flattering, idealized way — skip under-eye bags, blemishes, wrinkles, dark circles, tired eyes, or any temporary imperfections. Describe their best features. The goal is beautiful artwork, not a medical exam.`;

// System prompt for analyzing the app's OWN AI-generated renders (face-count /
// gender probes). The uploaded-photo SYSTEM_PROMPT above claims "the user
// uploaded this photo themselves" — shown an obviously AI-generated artwork,
// Haiku 4.5 flags that mismatch and REFUSES (verified 2026-07-05: the solo-swap
// guard read 'unread' on 6/6 probes; with this prompt the same image read
// "2|man|woman" 4/4). Keep it factual and justification-free: asking to count
// people in our own artwork needs no consent story, and including one is
// exactly what trips the refusal.
const RENDER_ANALYSIS_SYSTEM_PROMPT = `You are an image-analysis assistant for an AI art application. You are shown AI-generated artwork produced by the app itself and answer factual questions about the image content (composition, subject count, apparent attributes) concisely and in the exact format requested.`;

/**
 * Describe a photo using Claude Haiku vision.
 *
 * @param imageInput — either a public URL or a base64 data URL (data:image/jpeg;base64,...)
 * @param prompt — the instruction for what to describe
 * @param _replicateToken — unused, kept for backward compat (callers still pass it)
 * @param maxTokens — max response length (default 200)
 * @param systemPrompt — override for non-photo use (AI-render analysis probes)
 */
export async function describeWithVision(
  imageInput: string,
  prompt: string,
  _replicateToken: string,
  maxTokens: number = 200,
  systemPrompt: string = SYSTEM_PROMPT
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

  const body = JSON.stringify({
    model: HAIKU,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [imageContent, { type: 'text', text: prompt }],
      },
    ],
  });

  // Retry transient Anthropic pressure (429/5xx) with jittered backoff — a single
  // 429 used to throw immediately and silently degrade the whole dual-gender /
  // cast-description path (Anthropic is the first provider to throttle under a
  // burst). Non-retryable statuses (e.g. 400/401) still fail fast.
  let res: Response;
  for (let attempt = 0; ; attempt++) {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body,
    });
    if (res.ok) break;
    if (!RETRYABLE_STATUSES.has(res.status) || attempt >= VISION_MAX_RETRIES) {
      const err = await res.text();
      console.error('[vision] Anthropic API error:', res.status, err);
      throw new Error(`Vision API failed: ${res.status}`);
    }
    console.warn(
      `[vision] ${res.status} on attempt ${attempt + 1}/${VISION_MAX_RETRIES + 1}, retrying`
    );
    await new Promise((r) =>
      setTimeout(r, jitter(RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)]))
    );
  }

  const data = await res.json();
  const text =
    data.content && data.content[0] && data.content[0].type === 'text' ? data.content[0].text : '';
  // Treat the description as UNTRUSTED — a user can paint instructions onto the
  // photo (indirect prompt injection) which the model would faithfully repeat
  // into the brief. Strip injection/control/zero-width before any caller uses it.
  return sanitizeUserText(text, 'vision');
}

/**
 * Broad race/appearance buckets for the cast, used ONLY as a render anchor to
 * stop a location prior from overriding the cast's actual race (RACE_FIDELITY_PLAN.md).
 * FINALIZED after a Haiku accuracy probe (2026-09-01): these 6 classify reliably;
 * Southeast Asian + Pacific Islander are deliberately NOT offered because Haiku
 * conflates them with East Asian — so those faces land on 'East Asian', which is
 * the intended merge. Never surfaced to users; internal render anchor only.
 */
export const CAST_ETHNICITY_BUCKETS = [
  'White',
  'Black',
  'East Asian',
  'South Asian',
  'Hispanic/Latino',
  'Middle Eastern',
] as const;
export type CastEthnicity = (typeof CAST_ETHNICITY_BUCKETS)[number];

/**
 * Read a cast photo's broad race bucket (one of CAST_ETHNICITY_BUCKETS) or null
 * when unsure. NULL-SAFE by contract: any refusal / uncertain / off-list / API
 * error → null, and the caller falls back to skin-tone-only (never guesses).
 * Runs ONCE at cast-photo upload (describe-photo) + the backfill — never per render.
 * Justification-FREE closed-set prompt (Haiku refuses "justified" probes).
 */
export async function classifyEthnicity(imageInput: string): Promise<CastEthnicity | null> {
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicKey) return null;
  try {
    let imageContent: Record<string, unknown>;
    if (imageInput.startsWith('data:')) {
      const match = imageInput.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match) return null;
      imageContent = {
        type: 'image',
        source: { type: 'base64', media_type: match[1], data: match[2] },
      };
    } else {
      imageContent = { type: 'image', source: { type: 'url', url: imageInput } };
    }
    const prompt =
      "Which single option best matches this person's broad appearance? Choose EXACTLY one and reply with only that option, nothing else:\n" +
      CAST_ETHNICITY_BUCKETS.join(', ') +
      ', Uncertain.';
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: HAIKU,
        max_tokens: 30,
        messages: [{ role: 'user', content: [imageContent, { type: 'text', text: prompt }] }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const txt =
      data.content && data.content[0] && data.content[0].type === 'text'
        ? String(data.content[0].text).toLowerCase()
        : '';
    // Longest-first match so "South Asian" isn't shadowed by "Asian" etc.
    const hit = [...CAST_ETHNICITY_BUCKETS]
      .sort((a, b) => b.length - a.length)
      .find((b) => txt.includes(b.toLowerCase()));
    return hit ?? null;
  } catch (_e) {
    return null;
  }
}

/**
 * Focused HAIR-COLOR read — a single-trait vision call, far more accurate than
 * the combined describe. The combined describe mislabeled a dirty-blonde/greying
 * man "chestnut brown"; a FOCUSED read on the same photo got "light blonde/gray"
 * (Kevin, sunnysteph +1, 2026-09-01 — focused beats combined, same as ethnicity).
 * Returns a short color phrase or null. NULL-SAFE. Runs once at upload + backfill.
 */
export async function classifyHairColor(imageInput: string): Promise<string | null> {
  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicKey) return null;
  try {
    let imageContent: Record<string, unknown>;
    if (imageInput.startsWith('data:')) {
      const match = imageInput.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match) return null;
      imageContent = {
        type: 'image',
        source: { type: 'base64', media_type: match[1], data: match[2] },
      };
    } else {
      imageContent = { type: 'image', source: { type: 'url', url: imageInput } };
    }
    const prompt =
      "In 2 to 4 words, what is this person's natural hair color (say 'greying' or 'salt-and-pepper' if grey is present)? Reply with only the color words, nothing else.";
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: HAIKU,
        max_tokens: 20,
        messages: [{ role: 'user', content: [imageContent, { type: 'text', text: prompt }] }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const txt =
      data.content && data.content[0] && data.content[0].type === 'text'
        ? String(data.content[0].text).trim()
        : '';
    // Guard: a short color phrase only — reject refusals / sentences.
    if (!txt || txt.length > 40 || /(cannot|can't|unable|sorry|not able)/i.test(txt)) return null;
    return sanitizeUserText(txt, 'vision').toLowerCase();
  } catch (_e) {
    return null;
  }
}

/**
 * Swap the (often-wrong) combined-describe hair color in a physical_summary for
 * the focused, accurate one — keeping cut/style so everything downstream
 * (extractHair + the render color anchor) works on corrected data.
 */
export function replaceHairColorInSummary(summary: string, color: string): string {
  if (!summary || !color) return summary;
  const parts = summary.split(',');
  const idx = parts.findIndex(
    (p) => /\bhair\b/i.test(p) && !/\b(beard|mustache|moustache|stubble|sideburns)\b/i.test(p)
  );
  if (idx === -1) return `${color} hair, ${summary}`;
  parts[idx] = parts[idx].replace(/^(\s*).*?\bhair\b/i, `$1${color} hair`);
  return parts.join(',');
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
  // ⚠️ Keep this prompt JUSTIFICATION-FREE. It used to open with "This image is
  // for routing a consensual face-swap…" — Haiku 4.5 reads that consent story
  // (against the photo-description system prompt) as an injection attempt and
  // REFUSES, which parses as all-null → every gender guard silently degrades to
  // its fallback (found 2026-07-05: 6/6 solo probes 'unread'). A plain factual
  // question about our own artwork, under RENDER_ANALYSIS_SYSTEM_PROMPT, reads
  // clean and consistent.
  const prompt =
    'Reply with EXACTLY three fields separated by vertical bars |: (1) the number of distinct human faces clearly visible in this artwork, (2) the apparent gender of the person on the LEFT (or of the only person), (3) the apparent gender of the person on the RIGHT. Use the word "man" or "woman" for each gender. If only one face is clearly visible, put "none" for the side with no person. No other words. Examples: "2|woman|man" or "1|woman|none".';

  const readGender = (s: string): 'male' | 'female' | null => {
    const t = s.toLowerCase();
    // FEMALE first — "female" contains "male"; "woman" contains "man".
    if (/\b(female|woman|women|girl|lady|gal)\b/.test(t)) return 'female';
    if (/\b(male|man|men|boy|guy|gentleman|dude|gent)\b/.test(t)) return 'male';
    return null;
  };

  const classifyOnce = async () => {
    const raw = (
      await describeWithVision(
        imageInput,
        prompt,
        replicateToken,
        40,
        RENDER_ANALYSIS_SYSTEM_PROMPT
      )
    ).trim();
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
    'Your response MUST BEGIN with a HEADER LINE and nothing before it, in EXACTLY this format: the gender ("Male" or "Female"), a comma, then the build (exactly ONE of "thin", "athletic", or "average"). Examples: "Female, average" or "Male, athletic". Commit to the GENDER and the BUILD on this first line — they are the two most important calls, so decide them FIRST. BUILD RULE (critical, honor it exactly): use ONLY thin / athletic / average. Anyone who is not clearly thin or clearly athletic is "average". NEVER output any other size or shape word anywhere (NO curvy, full-figured, soft, stocky, petite, heavy, heavyset, plus, plus-size, overweight, busty, chubby, large, big) — "average" covers everyone else, so no one is ever given a heavy or unkind label. Then describe them for an AI artist creating a flattering stylized character — focus on the FACE and HAIR. Include: exact age estimate, face shape, eye color, hair (exact color like sandy brown or chestnut, length, texture, style — and ALWAYS the CUT: if they have bangs/fringe say so explicitly (e.g. "with soft wispy bangs"), and say how the hair is worn (loose, ponytail, bun, braids, half-up). If there are no bangs, describe the hairline positively (e.g. "center-parted", "swept back from the forehead") — never write "no bangs"), skin tone, any distinguishing features (glasses, freckles, jewelry, tattoos). Do NOT describe clothing or accessories that change — the art generator will dress them in the scene style. Do NOT describe body size or shape again in the prose — the header build word is the ONLY body descriptor allowed. For facial hair be EXTREMELY precise: clean-shaven, light stubble, heavy stubble, short trimmed beard, medium beard, or full long beard — do NOT exaggerate length or thickness, stubble is NOT a beard. Skip unflattering details (under-eye bags, dark circles, blemishes, wrinkles) — describe their best version. 3 sentences max. Be EXTREMELY specific — the more detail, the better the resemblance.\n\nAfter the description, add a NEW LINE starting with "AGE:" followed by your best numeric age estimate as an integer only (no words, no qualifiers, no range). Example: "AGE: 34". Estimate their TRUE age as accurately as you can — do NOT lean younger (the model already tends to under-read age, so an honest estimate lands closest to reality).\n\nAfter the AGE line, add a NEW LINE starting with "TRAITS:" followed by a single concise sentence listing ONLY the non-negotiable physical traits: hair color, length, and cut (include bangs/fringe if present — e.g. "shoulder-length auburn hair with bangs"), facial hair (if any), skin tone, approximate age, build (ONLY one of: thin/athletic/average), and eye color. Example: "TRAITS: Short dark brown hair, full beard, olive skin, mid-30s, athletic build, brown eyes." This line must be factual and compact — no adjectives beyond what\'s needed to identify the trait. IMPORTANT: never use negative phrasing like "no facial hair" or "no glasses" — AI generators interpret negatives as positives. If a trait is absent, simply omit it. For clean-shaven MALE faces, say "clean-shaven" instead of "no beard." For females, do NOT mention facial hair at all. Output ONLY the description, AGE line, and TRAITS line.',

  /** Pet description for dream cast */
  castPet:
    'Describe this animal for an AI artist. Include: species, breed, coat color/pattern, fur texture (curly/straight/wiry/fluffy), eye color, ear shape, size, build, age (puppy/young/adult/senior), distinguishing features. 2-3 sentences.\n\nAfter the description, add a NEW LINE starting with "TRAITS:" followed by a single concise sentence listing the key physical traits: species, breed, coat color/pattern, size, and any distinguishing features. Example: "TRAITS: Medium golden retriever, wavy cream coat, brown eyes, floppy ears." Output ONLY the description and TRAITS line.',
} as const;
