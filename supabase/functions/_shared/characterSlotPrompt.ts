/**
 * Unified character face-swap slot-based prompt pipeline.
 * Handles BOTH single-character and dual-character face-swap renders.
 *
 * Why slot-based:
 *   Freeform Sonnet output let the model write camera/face/pronoun/positioning
 *   language that fought the L/R role lock and produced gender swaps,
 *   asymmetric placements, and stylized-to-photoreal drift. With slots,
 *   Sonnet ONLY writes scene, wardrobe, mood, props — everything that
 *   drives face-swap geometry (camera, framing, face visibility, identity,
 *   gender, side assignment) is hardcoded by the template here.
 *
 * Why unified single + dual:
 *   Both paths need the SAME architectural improvements: model rotation,
 *   per-model fragment overrides, vibe bans, wardrobe-mood randomization,
 *   forbidden-phrase validation, location pillar position. Splitting into
 *   two pipelines means fixing things in two places. Unifying gets us
 *   one source of truth — cast.length === 1 vs 2 drives the few
 *   differences (gender lock, L/R framing) inside this file.
 *
 * Used by:
 *   - nightly-dreams (single human face-swap + dual face-swap)
 *   Pet single-character renders still use the legacy freeform brief
 *   because the slot pipeline assumes human cast.
 */

import { callSonnet } from './llm.ts';

// ── Public types ─────────────────────────────────────────────────────────

export type CastSlotMember = {
  /** Cast role label — used for L/R assignment in dual */
  role: string;
  /** Llama-Vision-generated prose description from describe-photo */
  promptDesc: string;
  /** Numeric age estimate (from describe-photo AGE: line) */
  age?: number | null;
  /** Compact comma-separated physical traits (hair / build / eyes / skin / age) */
  physicalSummary?: string | null;
};

export type SingleSlots = {
  scene_description: string;
  wardrobe: string;
  mood: string;
  props: string;
};

export type DualSlots = {
  scene_description: string;
  left_wardrobe: string;
  right_wardrobe: string;
  mood: string;
  props: string;
};

export type CharacterSlots = SingleSlots | DualSlots;

export interface CharacterSlotPipelineInput {
  /** 1 cast member (single character) or 2 (dual character).
   * Order matters for dual: [LEFT, RIGHT] mapping is locked downstream. */
  cast: CastSlotMember[];
  // Scene anchors
  iconicAnchor: string | null;
  userPlace: string | null;
  timeAxis: string;
  weatherAxis: string;
  phenomenaAxis: string;
  // Medium + tone
  mediumFluxFragment: string;
  vibeDirective: string;
  avoidList: string;
  // Pose
  action: string | null;
}

export interface CharacterSlotPipelineResult {
  briefUsed: string;
  rawResponse: string;
  slots: CharacterSlots;
  assembledPrompt: string;
  fallbackReasons: string[];
  retries: number;
}

// ── Cast description parsing helpers (shared single + dual) ─────────────

export function extractGender(promptDesc: string): 'man' | 'woman' | 'person' {
  const lower = promptDesc.toLowerCase();
  const manRe = /\b(man|male|guy|gentleman|boy|father|dad|husband|brother|son)\b/;
  const womanRe = /\b(woman|female|lady|girl|mother|mom|wife|sister|daughter)\b/;
  const manMatch = lower.match(manRe);
  const womanMatch = lower.match(womanRe);
  if (manMatch && womanMatch) {
    return manMatch.index! < womanMatch.index! ? 'man' : 'woman';
  }
  if (manMatch) return 'man';
  if (womanMatch) return 'woman';
  return 'person';
}

// Pull JUST the hair / facial-hair tokens out of physical_summary. The full
// physical_summary contains eye color, skin tone, face shape too — those get
// face-swapped away anyway and in the prompt they pull renders toward
// Disney-princess / stock-photo archetypes. Hair + build (handled separately)
// are the only identity traits actually visible in the final render.
export function extractHair(physicalSummary: string | null | undefined): string | null {
  if (!physicalSummary) return null;
  const parts = physicalSummary.split(/[,;]/).map((p) => p.trim());
  const hairParts = parts.filter((p) =>
    /\b(hair|beard|stubble|clean[- ]shaven|mustache|moustache|sideburns|bald|balding|hairline)\b/i.test(
      p
    )
  );
  if (hairParts.length === 0) return null;
  return hairParts.join(', ');
}

// Pull explicit build/frame word from physical_summary so we can front-load
// body proportions. Flux otherwise defaults bulkier/more muscular than source.
export function extractBuild(physicalSummary: string | null | undefined): string | null {
  if (!physicalSummary) return null;
  const s = physicalSummary.toLowerCase();
  const m = s.match(
    /\b(athletic|slim|lean|fit|toned|muscular|stocky|broad|average|medium|petite|slender|curvy|full[- ]figured|thin|skinny|trim|wiry|husky|stout)\b/
  );
  return m ? m[1].replace(/\s+/g, '-') : null;
}

// Pull explicit age phrase from cast desc so we can front-load it. Flux
// otherwise defaults "generic adult" (skewing older) when age is buried.
export function extractAge(promptDesc: string): string | null {
  const s = promptDesc.toLowerCase();
  const decadeNum = s.match(
    /\b(early|mid|late)[ -](teens|twenties|thirties|forties|fifties|sixties|seventies|eighties|\d{2}s)\b/
  );
  if (decadeNum) return decadeNum[0];
  const decadeWord = s.match(
    /\b(teens|twenties|thirties|forties|fifties|sixties|seventies|eighties)\b/
  );
  if (decadeWord) return decadeWord[0];
  const decadeShort = s.match(/\b\d{2}s\b/);
  if (decadeShort) return decadeShort[0];
  const numMatch = s.match(/\b(\d{2})[ -]?(?:year|yr)s?[ -]?old\b/);
  if (numMatch) return `${numMatch[1]} years old`;
  return null;
}

export function extractIdentityPhrase(promptDesc: string): string {
  let s = promptDesc.replace(/^\s*(this|that|these|those|a|an|the)\s+/i, '').trim();
  const sentenceEnd = s.search(/[.!?]/);
  if (sentenceEnd > 0) s = s.slice(0, sentenceEnd);
  const words = s.split(/\s+/);
  if (words.length > 18) {
    s = words.slice(0, 18).join(' ');
    const lastComma = s.lastIndexOf(',');
    if (lastComma > s.length - 40) s = s.slice(0, lastComma);
  }
  s = s.replace(/[,;:]?\s*(and|with|in|wearing|featuring|having)\s*$/i, '');
  return s.trim();
}

// ── Wardrobe-mood randomizer ────────────────────────────────────────────

const WARDROBE_MOODS = [
  'casual everyday outfits',
  'active outdoor / sporty clothing',
  'polished resort wear',
  'breezy boho artsy style',
  'vintage retro inspired',
  'simple monochrome neutrals',
  'colorful playful patterns',
  'modern minimalist',
  'utilitarian outdoor gear',
  'soft pastel palette',
  'rich saturated jewel tones',
  'classic timeless pieces',
];

// ── Resolved cast identity (computed once per render) ───────────────────

type ResolvedIdentity = {
  gender: 'man' | 'woman' | 'person';
  age: string | null; // "38 years old" or "mid-30s"
  build: string | null;
  identity: string; // hair / facial-hair string
};

function resolveIdentity(member: CastSlotMember): ResolvedIdentity {
  const gender = extractGender(member.promptDesc);
  const age =
    typeof member.age === 'number' ? `${member.age} years old` : extractAge(member.promptDesc);
  const build = extractBuild(member.physicalSummary);
  const identity = extractHair(member.physicalSummary) || extractIdentityPhrase(member.promptDesc);
  return { gender, age, build, identity };
}

function stripIdentity(s: string): string {
  const stripAgeRe =
    /\b(in\s+(?:his|her|their)\s+)?(early|mid|late)?[ -]?(teens|twenties|thirties|forties|fifties|sixties|seventies|eighties|\d{2}s)\b\s*,?\s*/i;
  const stripLeadingGenderRe = /^(man|woman|guy|gentleman|lady|girl|boy|male|female)\b\s*,?\s*/i;
  return s
    .replace(stripAgeRe, '')
    .replace(stripLeadingGenderRe, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function buildIdentityBlock(prefix: string, resolved: ResolvedIdentity, wardrobe: string): string {
  const ageAxis = resolved.age ? `, ${resolved.age}` : '';
  const buildAxis = resolved.build ? `, ${resolved.build} build` : '';
  const cleanIdentity = stripIdentity(resolved.identity);
  return `${prefix}: a ${resolved.gender}${ageAxis}${buildAxis}, ${cleanIdentity}, wearing ${wardrobe}`;
}

// ── Slot brief construction ─────────────────────────────────────────────

function buildSlotBrief(input: CharacterSlotPipelineInput): string {
  const location = input.iconicAnchor || input.userPlace || 'the location';
  const wardrobeMood = WARDROBE_MOODS[Math.floor(Math.random() * WARDROBE_MOODS.length)];

  const climateGuidance = `wardrobe MUST be what real people actually wear at ${location} given its climate, setting, and cultural context. A tropical beach, an alpine village, a desert ruin, a modern city, and an arctic glacier all call for different wardrobe. WARDROBE MOOD for this render: ${wardrobeMood}. Lean into this style while keeping it climate-appropriate. Bring distinctive pieces, colors, and silhouettes — avoid the same "linen shirt + chinos" default every render.`;

  const forbiddenList = `━━━ FORBIDDEN IN ANY FIELD — your output will be rejected if you violate ━━━
- Camera / lens / framing: close-up, wide shot, medium shot, low angle, 85mm, depth of field, fisheye
- Face / facial words: face, eyes, smile, lips, expression, gaze, jaw, cheeks, eyebrows
- Eye direction / interaction: looking at, gazing, watching, facing each other, turned toward, eye contact
- Pronouns: he, she, him, her, his, hers (refer to people by role label, not pronouns)
- Face occlusion: helmet, mask, sunglasses, hood covering face, scarf over face
- Bad framing: from behind, back view, rear view, side profile`;

  const sharedScene = `LOCATION (scene_description MUST depict this): ${location}

ATMOSPHERIC CONDITIONS (weave into scene_description, do NOT contradict):
- TIME: ${input.timeAxis}
- WEATHER: ${input.weatherAxis}
- PHENOMENON: ${input.phenomenaAxis}

VIBE (use for the mood field): ${input.vibeDirective}`;

  // Cast-count-specific brief structure
  if (input.cast.length === 1) {
    const m = resolveIdentity(input.cast[0]);
    const buildHint = m.build ? `, ${m.build} build` : '';
    return `You are designing a one-person scene for AI image generation. You write FOUR fields. The framing, camera, faces, and character identity are LOCKED by code.

Output ONLY this JSON object, no markdown, no commentary:
{
  "scene_description": "...",
  "wardrobe": "...",
  "mood": "...",
  "props": "..."
}

${sharedScene}

FIELDS YOU OWN:

scene_description (25-40 words)
  The environment ONLY. Iconic features of the location, light, weather, atmosphere.
  Do NOT mention people, characters, camera, framing, faces, eyes, pose, or distance.

wardrobe (8-15 words)
  Clothing worn by the character — a ${m.gender}${buildHint} (${m.identity}).
  ${climateGuidance}
  Clothing words only. Do NOT describe body, face, hair (locked). Do NOT describe pose.

mood (1-3 short phrases)
  Emotional tone. Examples: "warm reverent calm", "playful golden afternoon", "quiet awe".

props (0-10 words, can be empty string "")
  Optional environmental object(s) near the character. Empty string if none.

${forbiddenList}

${input.avoidList}

Output ONLY the JSON object. Start with { and end with }. No commentary.`;
  }

  // Dual (cast.length === 2)
  const left = resolveIdentity(input.cast[0]);
  const right = resolveIdentity(input.cast[1]);
  const leftBuildHint = left.build ? `, ${left.build} build` : '';
  const rightBuildHint = right.build ? `, ${right.build} build` : '';
  return `You are designing a two-person scene for AI image generation. You write FIVE fields. The framing, camera, faces, and character identities are LOCKED by code.

Output ONLY this JSON object, no markdown, no commentary:
{
  "scene_description": "...",
  "left_wardrobe": "...",
  "right_wardrobe": "...",
  "mood": "...",
  "props": "..."
}

${sharedScene}

FIELDS YOU OWN:

scene_description (25-40 words)
  The environment ONLY. Iconic features of the location, light, weather, atmosphere.
  Do NOT mention people, characters, camera, framing, faces, eyes, pose, or distance.

left_wardrobe (8-15 words)
  Clothing worn by the LEFT character — a ${left.gender}${leftBuildHint} (${left.identity}).
  ${climateGuidance}
  Clothing words only. Do NOT describe body, face, hair (locked). Do NOT describe pose.

right_wardrobe (8-15 words)
  Clothing worn by the RIGHT character — a ${right.gender}${rightBuildHint} (${right.identity}).
  Same climate rules and wardrobe mood as LEFT. Pick distinctive wardrobe in the chosen mood.
  Do NOT describe body, face, hair (locked). Do NOT describe pose.

mood (1-3 short phrases)
  Emotional tone. Examples: "warm reverent calm", "playful golden afternoon", "quiet awe".

props (0-10 words, can be empty string "")
  Optional environmental object(s) between or near the pair. Empty string if none.

${forbiddenList}

${input.avoidList}

Output ONLY the JSON object. Start with { and end with }. No commentary.`;
}

// ── JSON parsing ────────────────────────────────────────────────────────

function parseSlotsJson(text: string, castCount: 1 | 2): CharacterSlots {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('no JSON object in response');
  const parsed = JSON.parse(match[0]);
  const requiredCommon = ['scene_description', 'mood'];
  for (const k of requiredCommon) {
    if (typeof parsed[k] !== 'string' || parsed[k].length < 2) {
      throw new Error(`missing or invalid slot: ${k}`);
    }
  }
  if (castCount === 1) {
    if (typeof parsed.wardrobe !== 'string' || parsed.wardrobe.length < 2) {
      throw new Error('missing or invalid slot: wardrobe');
    }
    return {
      scene_description: String(parsed.scene_description),
      wardrobe: String(parsed.wardrobe),
      mood: String(parsed.mood),
      props: typeof parsed.props === 'string' ? parsed.props : '',
    };
  }
  for (const k of ['left_wardrobe', 'right_wardrobe']) {
    if (typeof parsed[k] !== 'string' || parsed[k].length < 2) {
      throw new Error(`missing or invalid slot: ${k}`);
    }
  }
  return {
    scene_description: String(parsed.scene_description),
    left_wardrobe: String(parsed.left_wardrobe),
    right_wardrobe: String(parsed.right_wardrobe),
    mood: String(parsed.mood),
    props: typeof parsed.props === 'string' ? parsed.props : '',
  };
}

// ── Validation: forbidden phrases ──────────────────────────────────────

const FORBIDDEN_PATTERNS: { name: string; regex: RegExp }[] = [
  { name: 'looking-direction', regex: /\blooking\s+(at|toward|into|across|up\s+at|out|over)\b/i },
  { name: 'gazing', regex: /\bgazing\b/i },
  { name: 'watching-staring', regex: /\b(watching|observing|staring|peering)\b/i },
  { name: 'facing-each-other', regex: /\bfacing\s+(each\s+other|one\s+another)\b/i },
  { name: 'face-to-face', regex: /\bface[-\s]to[-\s]face\b/i },
  { name: 'turned-toward', regex: /\bturned\s+(toward|to|away)\s+/i },
  { name: 'eye-contact', regex: /\beye\s+contact\b|\beyes?\s+(meet|locked|connect)\b/i },
  { name: 'close-up', regex: /\b(close[-\s]up|tight\s+shot|extreme\s+close)\b/i },
  { name: 'shot-words', regex: /\b(wide|establishing|medium|long|full)[-\s]shot\b/i },
  { name: 'angle-words', regex: /\b(low|high|dutch|extreme|aerial)\s+angle\b/i },
  { name: 'fisheye', regex: /\bfisheye\b/i },
  { name: 'lens-mm', regex: /\b\d{2,3}\s*mm\b/i },
  { name: 'depth-of-field', regex: /\bdepth\s+of\s+field\b/i },
  {
    name: 'face-words',
    regex: /\b(faces?|smiles?|grins?|expressions?|jaw(line|s)?|cheeks?|lips|eyebrows?|gaze)\b/i,
  },
  { name: 'eye-words', regex: /\beyes?\b/i },
  {
    name: 'from-behind',
    regex: /\b(from\s+behind|back\s+view|rear\s+view|back\s+of\s+(the|her|his|their)\s+head)\b/i,
  },
  { name: 'profile', regex: /\b(side\s+profile|profile\s+shot)\b/i },
  {
    name: 'occlusion',
    regex:
      /\b(masks?|helmets?|sunglasses|hoods?\s+covering|scarf\s+over\s+(her|his|the)?\s*face)\b/i,
  },
  { name: 'pronoun', regex: /\b(she|he|him|her|his|hers|she's|he's)\b/i },
];

function validateSlots(slots: CharacterSlots): string[] {
  const violations = new Set<string>();
  const fields: string[] = [slots.scene_description, slots.mood, slots.props ?? ''];
  if ('wardrobe' in slots) fields.push(slots.wardrobe);
  if ('left_wardrobe' in slots) fields.push(slots.left_wardrobe, slots.right_wardrobe);
  for (const field of fields) {
    if (!field) continue;
    for (const { name, regex } of FORBIDDEN_PATTERNS) {
      if (regex.test(field)) violations.add(name);
    }
  }
  return Array.from(violations);
}

// ── Fallback slots when Sonnet fails ───────────────────────────────────

function fallbackSlots(input: CharacterSlotPipelineInput): CharacterSlots {
  const location = input.iconicAnchor || input.userPlace || 'the location';
  const sceneFallback = `${location}, ${input.timeAxis.split(' — ')[0]}, ${input.weatherAxis.split(',')[0]}, atmospheric depth`;
  const moodFallback =
    input.vibeDirective.split('.')[0].slice(0, 80) || 'warm cinematic atmosphere';
  const wardrobeFallback = 'casual outdoor clothing in earthy tones';
  if (input.cast.length === 1) {
    return {
      scene_description: sceneFallback,
      wardrobe: wardrobeFallback,
      mood: moodFallback,
      props: '',
    };
  }
  return {
    scene_description: sceneFallback,
    left_wardrobe: wardrobeFallback,
    right_wardrobe: wardrobeFallback,
    mood: moodFallback,
    props: '',
  };
}

// ── Final prompt assembly (template-owned geometry) ────────────────────

function assembleCharacterPrompt(slots: CharacterSlots, input: CharacterSlotPipelineInput): string {
  const location = input.iconicAnchor || input.userPlace || '';
  const mediumSignal = (input.mediumFluxFragment || '').trim();

  // Cast-count branches
  if (input.cast.length === 1) {
    const m = resolveIdentity(input.cast[0]);
    const wardrobe = (slots as SingleSlots).wardrobe;
    const identityBlock = buildIdentityBlock('CHARACTER', m, wardrobe);

    // Single anchor — positive phrasing, no L/R
    const singleAnchor =
      'ONE person, frontal portrait, the character is looking out at the camera in three-quarter view, face turned toward the viewer';

    // Framing — single doesn't need the L/R clear-gap line
    const framingBlock = [
      'shown from the waist up, fully visible',
      'face unobstructed and clearly visible to the viewer',
      'frontal portrait composition, face turned to the camera',
    ].join(', ');

    const parts = [
      mediumSignal,
      location ? `set at ${location}` : '',
      singleAnchor,
      input.action || '',
      identityBlock,
      framingBlock,
      slots.scene_description,
      slots.mood,
      slots.props,
      'foreground midground background stacked top to bottom, layered depth',
      'no text, no words, no letters, no watermarks, ultra detailed',
    ].filter((p) => p && p.trim().length > 0);

    return parts.join(', ');
  }

  // Dual (cast.length === 2)
  const left = resolveIdentity(input.cast[0]);
  const right = resolveIdentity(input.cast[1]);
  const dualSlots = slots as DualSlots;
  const leftBlock = buildIdentityBlock('LEFT side of frame', left, dualSlots.left_wardrobe);
  const rightBlock = buildIdentityBlock('RIGHT side of frame', right, dualSlots.right_wardrobe);

  // Gender lock SHOUTED at position 1. Non-negotiable for dual.
  const genderLock = `${left.gender.toUpperCase()} on the LEFT, ${right.gender.toUpperCase()} on the RIGHT`;

  // Dual anchor — positive phrasing, no negatives
  const dualAnchor =
    'TWO people, side by side, both characters looking out at the camera, frontal couple portrait, both faces turned toward the viewer, both heads tilted toward the audience, three-quarter view to camera';

  // Framing — includes L/R clear-gap + same-height constraints for crop pipeline
  const framingBlock = [
    'both shown from the waist up, fully visible',
    'both faces unobstructed and clearly visible to the viewer',
    'frontal portrait composition, both faces turned to the camera',
    'clear gap between them, both at the same vertical height, heads at the same level',
  ].join(', ');

  const parts = [
    genderLock,
    mediumSignal,
    location ? `set at ${location}` : '',
    dualAnchor,
    input.action || '',
    leftBlock,
    rightBlock,
    framingBlock,
    slots.scene_description,
    slots.mood,
    slots.props,
    'foreground midground background stacked top to bottom, layered depth',
    'no text, no words, no letters, no watermarks, ultra detailed',
  ].filter((p) => p && p.trim().length > 0);

  return parts.join(', ');
}

// ── Main pipeline entry point ──────────────────────────────────────────

export async function runCharacterSlotPipeline(
  input: CharacterSlotPipelineInput,
  anthropicKey: string
): Promise<CharacterSlotPipelineResult> {
  if (input.cast.length < 1 || input.cast.length > 2) {
    throw new Error(
      `character slot pipeline requires 1 or 2 cast members, got ${input.cast.length}`
    );
  }
  const castCount = input.cast.length as 1 | 2;
  const slotBrief = buildSlotBrief(input);
  const fallbackReasons: string[] = [];
  let slots: CharacterSlots | null = null;
  let rawResponse = '';
  let lastAttemptBrief = slotBrief;
  let retries = 0;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const sonnet = await callSonnet(lastAttemptBrief, anthropicKey, 500);
      rawResponse = sonnet.rawResponse;
      retries = attempt;
      const parsed = parseSlotsJson(sonnet.text, castCount);
      const violations = validateSlots(parsed);
      if (violations.length === 0) {
        slots = parsed;
        break;
      }
      fallbackReasons.push(`slot_violations_attempt_${attempt + 1}:${violations.join('|')}`);
      lastAttemptBrief = `${slotBrief}\n\n━━━ YOUR PREVIOUS OUTPUT WAS REJECTED ━━━\nForbidden content categories found in your fields: ${violations.join(', ')}\nRewrite the JSON without these. Keep the same fields; only the content changes.`;
    } catch (err) {
      fallbackReasons.push(`slot_parse_error_attempt_${attempt + 1}:${(err as Error).message}`);
      lastAttemptBrief = `${slotBrief}\n\n━━━ RETRY ━━━\nYour previous output was not parseable JSON. Output ONLY a single valid JSON object — no markdown fences, no commentary, no extra text. Start with { and end with }.`;
    }
  }

  if (!slots) {
    slots = fallbackSlots(input);
    fallbackReasons.push('character_slot_fallback_used');
  }

  const assembledPrompt = assembleCharacterPrompt(slots, input);

  return {
    briefUsed: slotBrief,
    rawResponse,
    slots,
    assembledPrompt,
    fallbackReasons,
    retries,
  };
}
