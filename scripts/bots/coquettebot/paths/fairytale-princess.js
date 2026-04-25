/**
 * CoquetteBot fairytale-princess path — full Disney princess spectrum
 * (Rapunzel, Elsa, Belle, Aurora, Cinderella, Ariel, Moana, etc.).
 * Pulls scenes from ALL other path pools but forces the Disney princess
 * aesthetic. 50/50 character vs pure scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const SCENE_POOLS = [
  { pool: 'COTTAGECORE_SCENES', label: 'cottagecore scene' },
  { pool: 'PINK_NATURE_SCENES', label: 'pink nature scene' },
  { pool: 'WHIMSICAL_SWEETS', label: 'whimsical sweets scene' },
  { pool: 'PARISIAN_SCENES', label: 'Parisian daydream' },
  { pool: 'TEA_PARTY_SCENES', label: 'tea party romance' },
  { pool: 'BEDROOM_SCENES', label: 'bedroom princess scene' },
  { pool: 'COUTURE_SCENES', label: 'couture fantasy scene' },
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scenePick = SCENE_POOLS[Math.floor(Math.random() * SCENE_POOLS.length)];
  const scene = picker.pickWithRecency(pools[scenePick.pool], 'princess_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const hasCharacter = Math.random() < 0.5;
  const creature = hasCharacter
    ? picker.pickWithRecency(pools.ADORABLE_CREATURES, 'princess_creature')
    : null;
  const hair = hasCharacter
    ? picker.pickWithRecency(pools.PRINCESS_HAIR, 'hair')
    : null;

  const characterBlock = hasCharacter
    ? `━━━ FAIRYTALE PRINCESS CHARACTER ━━━
A Disney-princess-inspired girl OR a tiny adorable creature dressed as a princess — ${creature}. Her hair: ${hair}. Channel the FULL Disney princess universe: Rapunzel's cascading golden hair and lanterns, Elsa's ice-crystal gown and snowflake magic, Belle's golden ballgown and enchanted roses, Aurora's pink-and-blue fairy blessing, Cinderella's glass slippers and midnight sparkle, Ariel's flowing red hair and ocean shimmer, Jasmine's jeweled silks, Moana's tropical flowers. Pick ONE princess energy per render — don't blend. She is SOLO — no prince, no male figure. Whimsical illustrated style, NOT photorealistic. If creature: dressed in a tiny version of the princess look, impossibly cute.`
    : `━━━ PURE FAIRYTALE SCENE ━━━
No characters. The scene itself IS a Disney princess world — a location so magical it feels like a concept painting from any Disney princess film. Rapunzel's tower draped in flowers, Elsa's ice palace glittering at sunrise, Belle's enchanted library with floating books, Cinderella's ballroom at midnight with crystal chandeliers, Ariel's grotto of treasures, Aurora's forest glade with fairy lights, Jasmine's moonlit palace garden. Pick ONE princess world per render.`;

  return `You are writing a DISNEY FAIRYTALE PRINCESS scene for CoquetteBot — the full Disney princess universe (Rapunzel, Elsa, Belle, Aurora, Cinderella, Ariel, Jasmine, Moana, and beyond) filtered through coquette pink-pastel magic. ${hasCharacter ? 'A princess girl or tiny creature in a magical fairytale moment.' : 'Pure fairytale scene — the world itself is the princess.'} Every frame should feel like a Disney concept painting drenched in coquette energy. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${hasCharacter ? blocks.SOLO_COMPOSITION_BLOCK : ''}

${blocks.STYLIZED_AESTHETIC_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ DISNEY PRINCESS AESTHETIC (THIS PATH ONLY) ━━━

Full Disney princess energy — Tangled, Frozen, Beauty and the Beast, Sleeping Beauty, Cinderella, The Little Mermaid, Aladdin, Moana, and beyond. Render as if painted by a Disney concept artist: luminous watercolor-gouache textures, magical sparkles and floating lights, impossibly romantic architecture, soft dreamy color grading. Each render channels ONE specific princess energy — her world, her magic, her palette — all filtered through coquette pink-pastel softness. Enchanted castles, magical forests, crystalline palaces, flower-draped towers, lantern-lit skies, ocean grottos, ice kingdoms — all made precious and pink.

${characterBlock}

━━━ THE SCENE (${scenePick.label}) ━━━
${scene}

━━━ LIGHTING (fairytale magic) ━━━
Warm golden-hour glow OR cool magical sparkle depending on the princess world. Floating light particles — lanterns, snowflakes, fireflies, fairy dust, ocean bioluminescence. The light of "once upon a time" meets coquette romance. ${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
${hasCharacter ? 'Mid-close frame with the princess/creature as hero — she fills the frame, surrounded by magical details. Solo composition, no other figures.' : 'Wide establishing shot — a magical world that makes every girl want to live there. Disney concept painting quality.'} Every surface touched by fairytale magic — cascading flowers, floating lights, sparkles, crystalline details, enchanted objects. Pink-pastel palette with the specific princess world's accent colors.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
