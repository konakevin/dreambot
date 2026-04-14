/**
 * Render Entity — pre-transforms cast identity into medium-native descriptions.
 *
 * For 'natural' mediums: pass through the raw human description (face swap handles identity).
 * For 'embodied' mediums: fill a medium-specific template with extracted traits
 *   (LEGO minifigure, clay figure, pixel sprite, etc.).
 *
 * Sonnet never transforms identity — it receives the final entity description
 * and only does scene placement.
 */

// ── Types ─────────────────────────────────────────────────────────────

export interface Traits {
  gender: 'male' | 'female';
  age: string;
  hairColor: string;
  eyeColor: string;
  facialHair: string;
  build: string;
}

export interface RenderEntity {
  mode: 'natural' | 'embodied';
  description: string;
}

// ── Trait Extraction (deterministic regex, no LLM) ────────────────────

export function extractTraits(description: string): Traits {
  const lower = description.toLowerCase();

  const gender: 'male' | 'female' = /woman|female|girl/.test(lower) ? 'female' : 'male';

  const ageMatch = description.match(/(\d{1,2}-?\d{0,2})\s*year/i);
  const age = ageMatch ? ageMatch[1] : 'adult';

  const hairMatch = description.match(
    /(?:hair|hair color)[:\s]*([^,.\n]+)|(\w+(?:\s+\w+)?(?:\s+to\s+\w+)?)\s+(?:color\s+)?hair/i
  );
  const hairColor = hairMatch
    ? (hairMatch[1] || hairMatch[2] || 'dark').trim().toLowerCase()
    : 'dark';

  const eyeMatch = description.match(/(\w+(?:\s+\w+)?)\s+eyes/i);
  const eyeColor = eyeMatch ? eyeMatch[1].toLowerCase() : 'brown';

  const facialHair = /beard|goatee|mustache|moustache/i.test(description) ? 'beard' : 'none';

  const buildMatch = description.match(
    /(?:build|frame|physique)[:\s]*(\w+)|(\w+)\s+(?:build|frame|physique)/i
  );
  const build = buildMatch
    ? (buildMatch[1] || buildMatch[2] || 'average').toLowerCase()
    : /athletic|fit/i.test(description)
      ? 'athletic'
      : /heavy|large|stocky/i.test(description)
        ? 'stocky'
        : 'average';

  return { gender, age, hairColor, eyeColor, facialHair, build };
}

// ── Character Templates (code-owned, per medium) ──────────────────────

const CHARACTER_TEMPLATES: Record<string, string> = {
  lego: 'LEGO minifigure, {hairColor} snap-on hair piece, painted {eyeColor} dot eyes, {facialHairDetail}, printed {genderTorso} torso, C-shaped yellow hands, plastic sheen',

  claymation:
    'smooth clay stop-motion figure with visible fingerprint textures, {hairColor} sculpted hair, {eyeColor} glass bead eyes, {facialHairDetail}, {build} clay proportions',

  vinyl:
    'Funko Pop vinyl figure with oversized bobblehead, tiny body, {hairColor} molded hair, {eyeColor} painted button eyes, {facialHairDetail}',

  animation:
    '3D animated Pixar-style character with expressive {eyeColor} eyes, {hairColor} stylized bouncy hair, {facialHairDetail}, {build} cartoon proportions, smooth rendered skin',

  storybook:
    'illustrated storybook character with soft rounded features, {hairColor} painted watercolor hair, {eyeColor} gentle dot eyes, {facialHairDetail}, warm hand-drawn quality',

  pixels:
    '16-bit SNES pixel art sprite, {hairColor} pixel hair, {eyeColor} dot eyes, {facialHairDetail}, {build} blocky frame, visible pixel grid, retro game character',

  vaporwave:
    'glitched digital avatar with {hairColor} neon-tinted hair, {eyeColor} holographic eyes, retrofuturistic aesthetic, scan lines and chromatic aberration',

  handcrafted:
    'knitted Sackboy-style craft figure with {hairColor} yarn hair, {eyeColor} button eyes, {facialHairDetail}, stitched fabric skin, felt and burlap textures',

  gothic:
    'dark gothic illustrated character in Tim Burton style, {hairColor} wild spindly hair, {eyeColor} wide haunted eyes, {facialHairDetail}, pale sharp angular features, dark whimsy',

  coquette:
    'dreamy surreal figure with {hairColor} flowing ethereal hair, {eyeColor} luminous eyes, soft impossible lighting, chromatic prismatic glow',
};

// ── Template Filling ──────────────────────────────────────────────────

function fillTemplate(template: string, traits: Traits): string {
  const facialHairDetail =
    traits.facialHair === 'beard' ? (traits.gender === 'male' ? 'printed beard detail' : '') : '';

  const genderTorso = traits.gender === 'male' ? 'masculine' : 'feminine';

  return template
    .replace(/\{hairColor\}/g, traits.hairColor)
    .replace(/\{eyeColor\}/g, traits.eyeColor)
    .replace(/\{build\}/g, traits.build)
    .replace(/\{gender\}/g, traits.gender)
    .replace(/\{age\}/g, traits.age)
    .replace(/\{facialHairDetail\}/g, facialHairDetail)
    .replace(/\{genderTorso\}/g, genderTorso)
    .replace(/,\s*,/g, ',')
    .replace(/,\s*$/g, '')
    .trim();
}

// ── Main Export ────────────────────────────────────────────────────────

export function buildRenderEntity(
  castDescription: string,
  characterRenderMode: string,
  mediumKey: string
): RenderEntity {
  if (characterRenderMode === 'natural' || !characterRenderMode) {
    return { mode: 'natural', description: castDescription };
  }

  const traits = extractTraits(castDescription);
  const template = CHARACTER_TEMPLATES[mediumKey];

  if (!template) {
    return {
      mode: 'embodied',
      description: `stylized ${traits.gender} character with ${traits.hairColor} hair`,
    };
  }

  return {
    mode: 'embodied',
    description: fillTemplate(template, traits),
  };
}
