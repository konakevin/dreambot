/**
 * CoquetteBot coastal-coquette path — beach and poolside coquette.
 * Cute swimwear, beach picnics, poolside lounging, seaside cafés.
 * 50/50 girl in beach fashion OR pure coastal scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.COASTAL_SCENES, 'coastal_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const hasGirl = Math.random() < 0.5;
  const hair = hasGirl
    ? picker.pickWithRecency(pools.PRINCESS_HAIR, 'coastal_hair')
    : null;
  const woman = hasGirl
    ? picker.pickWithRecency(pools.PORTRAIT_WOMEN, 'coastal_woman')
    : null;

  const characterBlock = hasGirl
    ? `━━━ THE GIRL ━━━
A beautiful young woman in gorgeous coastal coquette fashion — ${woman}. Her hair: ${hair}. She is lounging, strolling, picnicking, or posing in an effortlessly pretty beach moment. Shell jewelry, pearl anklets, ribbon-tied sun hats, heart-shaped sunglasses. She is SOLO — no male figures, no couples. Relaxed and radiant.`
    : `━━━ PURE COASTAL SCENE ━━━
No people. The beach/pool setting IS the star — impossibly pretty, dripping with coquette detail. Pink sand, pastel beach umbrellas, floral pool floats, wicker picnic baskets with ribbons, shell arrangements, iced drinks with fruit garnish, straw hats left on towels, pearl-draped beach chairs.`;

  return `You are writing a COASTAL COQUETTE scene for CoquetteBot — beach and poolside filtered through pink pastel coquette aesthetic. ${hasGirl ? 'A beautiful young woman in stunning beach fashion — cute bikinis, elegant one-pieces, lace coverups, resort wear.' : 'Pure coastal scene — the beach/pool setting itself is the star.'} Coastal coquette Pinterest energy. ZERO male figures. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${hasGirl ? blocks.SOLO_COMPOSITION_BLOCK : ''}

${hasGirl ? blocks.NO_MALE_FIGURES_BLOCK : ''}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ COASTAL COQUETTE AESTHETIC (THIS PATH ONLY) ━━━

Beach is ROMANTIC and PRETTY, never sporty or athletic. Even the ocean looks pastel — soft turquoise water, blush-toned sand, golden-hour warmth. Every detail is coquette: shell jewelry instead of sport watches, lace coverups instead of rash guards, wicker baskets instead of coolers, champagne flutes instead of beer cans. The beach through rose-gold sunglasses. Pink umbrellas, floral floats, pearl-draped everything.

${characterBlock}

━━━ THE COASTAL SCENE ━━━
${scene}

━━━ LIGHTING ━━━
Golden-hour beach light — warm, glowing, flattering. Soft sun filtering through sheer coverups, sparkle on water, long shadows on pink sand. ${lighting}

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
${hasGirl ? 'Mid-close to full-body frame. She is relaxed and radiant in her beach fashion — the swimwear/coverup is the focal point. Solo, no other figures. Beach or pool setting enhances but never competes.' : 'Wide or mid-close frame of the coastal scene — beach picnic spread, poolside setup, seaside café table, cabana interior. Every detail precious and coquette.'} Pastel ocean, warm golden light, soft sand, coquette accessories throughout. NO dark, no sporty, no athletic.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
