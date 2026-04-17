/**
 * Vibe Engine — the two-pass prompt builder for AI dream generation.
 * Lives in _shared/ because it runs server-side only (Edge Functions).
 * Tests import this file directly via Jest moduleNameMapper.
 */

import type { VibeProfile, MoodAxes, ConceptRecipe, PromptMode } from './vibeProfile.ts';

interface PromptModeConfig {
  userWeight: number;
  spiceWeight: number;
  directive: string;
}

const PROMPT_MODE_CONFIGS: Record<PromptMode, PromptModeConfig> = {
  dream_me: {
    userWeight: 0.7,
    spiceWeight: 0.3,
    directive: 'Create a personalized dream that feels like it was made just for this person.',
  },
  chaos: {
    userWeight: 0.3,
    spiceWeight: 0.7,
    directive:
      'Go wild. Use their taste as a launchpad but take it somewhere unexpected and bizarre. Surprise them.',
  },
  cinematic_poster: {
    userWeight: 0.7,
    spiceWeight: 0.3,
    directive:
      'Frame this as a cinematic movie poster. Dramatic lighting, strong focal point, epic scale. Anamorphic lens, dramatic angle.',
  },
  minimal_mood: {
    userWeight: 0.8,
    spiceWeight: 0.2,
    directive:
      'Strip everything to essentials: ONE subject, ONE color mood, ONE emotion. Negative space. Less is more.',
  },
  nature_escape: {
    userWeight: 0.6,
    spiceWeight: 0.4,
    directive:
      'Create a breathtaking landscape with NO characters. Pure place. Light, texture, depth.',
  },
  character_study: {
    userWeight: 0.7,
    spiceWeight: 0.3,
    directive:
      'Focus on a single character or creature. Give them personality through pose and detail.',
  },
  nostalgia_trip: {
    userWeight: 0.8,
    spiceWeight: 0.2,
    directive:
      'Lean heavily into their era and personal anchors. Warm memory. Golden tones, soft focus, familiar objects.',
  },
};

function describeMoods(moods: MoodAxes): string {
  const parts: string[] = [];
  if (moods.peaceful_chaotic < 0.3) parts.push('deeply peaceful');
  else if (moods.peaceful_chaotic > 0.7) parts.push('chaotic and intense');
  else parts.push('balanced energy');
  if (moods.cute_terrifying < 0.3) parts.push('cute and warm');
  else if (moods.cute_terrifying > 0.7) parts.push('dark and unsettling');
  else parts.push('tonally neutral');
  if (moods.minimal_maximal < 0.3) parts.push('clean and minimal');
  else if (moods.minimal_maximal > 0.7) parts.push('lush and maximalist');
  else parts.push('moderately detailed');
  if (moods.realistic_surreal < 0.3) parts.push('grounded in reality');
  else if (moods.realistic_surreal > 0.7) parts.push('deeply surreal');
  else parts.push('slightly stylized');
  return parts.join(', ');
}

export function buildConceptPrompt(
  profile: VibeProfile,
  mode: PromptMode = 'dream_me',
  seed: number = Math.random()
): string {
  const config = PROMPT_MODE_CONFIGS[mode];

  // Pick dream seeds — one from each category that has entries
  const seeds = profile.dream_seeds ?? { characters: [], places: [], things: [] };
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const pickedCharacter = seeds.characters.length > 0 ? pick(seeds.characters) : null;
  const pickedPlace = seeds.places.length > 0 ? pick(seeds.places) : null;
  const pickedThing = seeds.things.length > 0 ? pick(seeds.things) : null;
  const pickedSeeds = [pickedCharacter, pickedPlace, pickedThing].filter(Boolean) as string[];

  // Build the seed fusion instruction — this is the CORE of the dream
  let seedInstruction: string;
  if (pickedSeeds.length >= 2) {
    seedInstruction = `DREAM INGREDIENTS (MANDATORY — the dream MUST be built from these):
${pickedCharacter ? `- Character: "${pickedCharacter}"` : ''}
${pickedPlace ? `- Place: "${pickedPlace}"` : ''}
${pickedThing ? `- Thing: "${pickedThing}"` : ''}

Your job is to FUSE these ingredients into one surprising scene. Don't just place them side by side — MASH THEM UP. Examples of good fusion:
- "cat" + "donuts" = a cat made entirely of glazed donuts, sitting on a giant sprinkle
- "astronaut" + "Tokyo" = a tiny astronaut exploring a ramen bowl like it's an alien planet
- "guitar" + "ocean" = a guitar growing from a coral reef, fish swimming through its strings

Be WILD. Be UNEXPECTED. The weirder the fusion, the better the dream.`;
  } else if (pickedSeeds.length === 1) {
    seedInstruction = `DREAM INGREDIENT (MANDATORY — the dream MUST feature this):
- "${pickedSeeds[0]}"

Don't use it literally. Reimagine it. Put it somewhere impossible. Change its scale. Make it out of the wrong material. Give it a life it never asked for. A guitar could be growing from a mountain. A cat could be piloting a spaceship. Push it somewhere unexpected.`;
  } else {
    seedInstruction = `No specific dream seeds provided. Invent something visually stunning and unexpected based on their aesthetic taste. Be bold — this should feel like a fever dream, not a stock photo.`;
  }

  const avoidBlock = profile.avoid.length > 0 ? `\nNEVER INCLUDE: ${profile.avoid.join(', ')}` : '';

  return `You are designing a single dream image. This must feel like a REAL DREAM — unexpected, vivid, personal, slightly impossible. Output structured JSON.

TASTE PROFILE:
- Aesthetics: ${profile.aesthetics.join(', ') || 'eclectic'}
- Art styles: ${profile.art_styles.join(', ') || 'mixed media'}
- Mood: ${describeMoods(profile.moods)}

${seedInstruction}
${avoidBlock}

CREATIVE DIRECTION:
${config.directive}

OUTPUT exactly this JSON (no markdown, no commentary):
{
  "subject": "the SPECIFIC main subject — built from the dream ingredients above. NOT generic.",
  "environment": "where this happens — concrete sensory details, not 'a beautiful place'",
  "lighting": "specific dramatic lighting that sets the emotional tone",
  "camera": "camera angle and perspective — try unusual ones (worm's eye, bird's eye, through a keyhole, reflected in water)",
  "style": "ONE art style from their preferences",
  "palette": "2-3 specific colors (e.g. 'burnt sienna, midnight blue, electric pink')",
  "twist": "one visual element that makes this image IMPOSSIBLE in real life",
  "composition": "portrait 9:16 vertical — describe the layout",
  "mood": "2-3 word emotional tone"
}

RULES:
- The subject MUST come from the dream ingredients. Do NOT ignore them.
- Be CONCRETE: name textures, materials, specific objects. Not adjectives.
- NO generic scenes. NO "cozy room." NO "lone figure gazing at landscape."
- The twist should be physically impossible — wrong scale, wrong material, defying gravity, merged objects.
- Portrait 9:16 vertical composition only.
- Stylized characters welcome. No photorealistic human faces, no nudity.`;
}

export function buildPolisherPrompt(concept: ConceptRecipe): string {
  return `Convert this concept into a Flux image generation prompt. 50-70 words, comma-separated phrases, no sentences.

${JSON.stringify(concept, null, 2)}

FORMAT:
- Start with the art style/medium
- Describe subject and scene concretely
- Include lighting, palette, mood
- Work the "twist" in naturally
- Include camera/composition as technical terms
- End with quality terms (hyper detailed, gorgeous lighting, etc.)
- No negative prompts, no meta-commentary, no quotation marks
- SAFETY: NEVER use words infant, baby, child, toddler, kid, minor, nude, naked. Use "small character", "tiny figure", "young character" instead.

Output ONLY the prompt text.`;
}

export function buildFallbackConcept(profile: VibeProfile): ConceptRecipe {
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const style =
    profile.art_styles.length > 0
      ? pick(profile.art_styles).replace(/_/g, ' ')
      : 'digital painting';
  const seeds = profile.dream_seeds ?? { characters: [], places: [], things: [] };
  const allSeeds = [...seeds.characters, ...seeds.places, ...seeds.things];
  const interest = allSeeds.length > 0 ? pick(allSeeds) : 'mysterious landscape';
  const aesthetic =
    profile.aesthetics.length > 0 ? pick(profile.aesthetics).replace(/_/g, ' ') : 'dreamy';
  const isSurreal = profile.moods.realistic_surreal > 0.5;
  const isDark = profile.moods.cute_terrifying > 0.5;

  return {
    subject: `a scene about ${interest}`,
    environment: `an atmospheric ${aesthetic} setting`,
    lighting: isDark ? 'moody low-key light with deep shadows' : 'soft golden hour light',
    camera: '35mm wide angle, eye level',
    style,
    palette: 'vivid and expressive',
    twist: isSurreal ? 'objects floating weightlessly' : 'unexpected reflections in water',
    composition: 'center subject, depth of field',
    mood: isDark ? 'haunting and atmospheric' : 'warm and dreamlike',
  };
}

export function buildFallbackFluxPrompt(concept: ConceptRecipe): string {
  return [
    concept.style,
    concept.subject,
    concept.environment,
    concept.lighting,
    concept.palette + ' color palette',
    concept.twist,
    concept.camera,
    concept.composition,
    concept.mood + ' atmosphere',
    'hyper detailed, gorgeous lighting',
  ]
    .filter(Boolean)
    .join(', ');
}

export function parseConceptJson(raw: string): ConceptRecipe {
  // Strip markdown fences, backticks, and any surrounding text
  let cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .replace(/`/g, '')
    .trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found');
  cleaned = cleaned.slice(start, end + 1);
  // Fix common JSON issues: trailing commas, single quotes
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
  return JSON.parse(cleaned) as ConceptRecipe;
}

// ═══════════════════════════════════════════════════════════════════════
// V2 ENGINE — Medium + Vibe directive-based prompt generation
// ═══════════════════════════════════════════════════════════════════════

interface DirectiveInput {
  /** The curated medium directive (e.g., watercolor masterclass brief) */
  mediumDirective: string;
  /** The curated vibe directive (e.g., cinematic mood/lighting brief) */
  vibeDirective: string;
  /** The medium's flux-optimized fragment for the polisher */
  fluxFragment: string;
  /** Optional user prompt — the subject to transform */
  userPrompt?: string;
  /** User's vibe profile for personal flavor (anchors, companion, avoid) */
  profile?: VibeProfile;
}

export function buildConceptPromptV2(input: DirectiveInput): string {
  const { mediumDirective, vibeDirective, userPrompt, profile } = input;

  let personalBlock = '';
  if (profile) {
    const anchors = profile.personal_anchors;
    const anchorLines: string[] = [];
    if (anchors?.place && Math.random() < 0.4)
      anchorLines.push(`- Places they love: "${anchors.place}"`);
    if (anchors?.object && Math.random() < 0.4)
      anchorLines.push(`- Objects they love: "${anchors.object}"`);
    if (anchors?.era && Math.random() < 0.4)
      anchorLines.push(`- Eras they vibe with: "${anchors.era}"`);
    if (anchors?.dream_vibe) anchorLines.push(`- Their dream vibe: "${anchors.dream_vibe}"`);

    const spiritHint =
      profile.spirit_companion && Math.random() < 0.2
        ? `\nTheir spirit companion is a ${profile.spirit_companion.replace(/_/g, ' ')} — consider weaving it in.`
        : '';

    const avoidBlock =
      profile.avoid.length > 0 ? `\nNEVER INCLUDE: ${profile.avoid.join(', ')}` : '';

    if (anchorLines.length > 0 || spiritHint || avoidBlock) {
      personalBlock = `\nPERSONAL TOUCH (weave in naturally when they fit):${anchorLines.length > 0 ? '\n' + anchorLines.join('\n') : ''}${spiritHint}${avoidBlock}`;
    }
  }

  const subjectBlock = userPrompt
    ? `\nSUBJECT TO TRANSFORM: "${userPrompt}"\nYour job: Take this subject and make it EXTRAORDINARY through the lens of the medium and vibe above. Don't just illustrate it — REIMAGINE it. Find the most visually stunning interpretation. What would make someone stop scrolling?`
    : `\nSUBJECT: Invent a compelling, visually rich subject. Be SPECIFIC and unexpected — no generic sunsets or landscapes. Create something that would make someone stop scrolling and say "how did they even think of that?"`;

  return `You are a world-class concept artist designing a single breathtaking image.

MEDIUM — This defines how the image is rendered:
${mediumDirective}

VIBE — This defines how the image feels:
${vibeDirective}
${personalBlock}
${subjectBlock}

SCENE ANGLE: Before designing, invent a unique creative angle. Don't default to the obvious. Consider: an unusual time of day, an unexpected perspective, a fantasy element, an impossible scale, a hidden detail, a surreal twist. Pick ONE angle that makes this image unforgettable.

OUTPUT exactly this JSON (no markdown, no commentary):
{
  "subject": "the main subject — specific, visual, evocative",
  "environment": "where the scene takes place — concrete sensory details",
  "lighting": "specific lighting that serves both the medium and the vibe",
  "camera": "camera angle, lens feel, perspective",
  "style": "the medium technique in 3-5 words",
  "palette": "3-4 specific color names that anchor the image",
  "twist": "one unexpected visual detail that elevates the scene",
  "signature_detail": "one small, poetic detail that makes this feel hand-crafted, not generated",
  "composition": "framing and spatial arrangement",
  "mood": "2-3 word emotional tone"
}

RULES:
- COMPOSITION MUST be portrait orientation (9:16 vertical) — tall, not wide
- The "twist" and "signature_detail" MUST be different things
- "subject" must NOT be generic — be inventive and specific
- Name textures, materials, specific objects — not just adjectives
- The medium directive should visibly influence your style and technique choices
- The vibe directive should visibly influence your lighting, mood, and composition choices
- Stylized characters welcome, no photorealistic human faces, no nudity
- SAFETY (Flux filter avoidance): Attractive and stylized characters are welcome. Suggestive is fine. But avoid: explicit nudity, fully bare torsos, underwear-only outfits, sexual acts. Characters should wear at least light clothing (dresses, robes, fitted outfits). Beach scenes should focus on the environment, not bodies.`;
}

export function buildPolisherPromptV2(
  concept: ConceptRecipe & { signature_detail?: string },
  fluxFragment: string
): string {
  return `Convert this concept into a Flux image generation prompt. 50-70 words, comma-separated phrases.

CONCEPT:
${JSON.stringify(concept, null, 2)}

CRITICAL — The prompt MUST start with this medium fragment (copy it exactly):
"${fluxFragment}"

Then describe the subject, environment, lighting, and mood concretely.
Weave in the twist and signature_detail naturally — don't label them.
Include camera/composition as technical terms. MUST be portrait 9:16 vertical composition.
End with quality terms (hyper detailed, gorgeous lighting, masterful, etc.)

No negative prompts, no meta-commentary, no quotation marks around the output.

SAFETY — To avoid triggering AI safety filters, NEVER use the words: infant, baby, child, toddler, kid, minor, nude, naked. Instead describe young subjects by their size and features: "very small young person", "tiny seated figure", "little one with [hair/clothing details]". Always include gender cues (boy/girl) and age-indicating size. This is critical — the image will be rejected if banned words appear.

Output ONLY the prompt text.`;
}
