/**
 * CoquetteBot rainy-cottage path — cozy rainy day in a pink pastel cottage.
 * 50/50 split: pure cozy scene OR tiny creature curled up in the cottage.
 * Rain is the CO-STAR — heavy, visible, prominent in every render.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.RAINY_COTTAGE_SCENES, 'rainy_cottage');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const hasCreature = Math.random() < 0.5;
  const creature = hasCreature
    ? picker.pickWithRecency(pools.ADORABLE_CREATURES, 'rainy_creature')
    : null;

  const creatureBlock = hasCreature
    ? `━━━ CUTE CREATURE IN THE COTTAGE ━━━
A tiny adorable creature cozied up in this rainy-day cottage — ${creature}. The creature is IN the cozy scene: curled up on a velvet cushion by the rain-streaked window, wrapped in a tiny knit blanket watching the downpour, napping beside a steaming teacup as rain drums on glass, peeking out from under a cashmere throw at the storm outside. Dressed in coquette cozy wear — tiny silk robe, knit sweater with bow, pearl-buttoned pajamas. Soft sleepy eyes, warm and content. The creature and the rain share the spotlight equally.`
    : `━━━ PURE COZY SCENE ━━━
No creatures, no characters. The cottage interior IS the star — impossibly cozy, dripping with coquette detail. Rain streaking windowpanes, steaming tea in fine china, flickering candles in rose-gold holders, velvet throws, lace curtains, stacked books, fresh flowers, silk pillows. The warmth inside against the heavy rain outside.`;

  return `You are writing a RAINY DAY COZY COTTAGE scene for CoquetteBot. ${hasCreature ? 'A tiny adorable creature is cozied up in an impossibly romantic rainy-day cottage.' : 'Pure cozy scene — the cottage interior itself is the star.'} Rain is the CO-STAR — heavy, visible, prominent. ZERO humans. Output wraps with style prefix + suffix.

${blocks.COQUETTE_ENERGY_BLOCK}

${blocks.PINK_AND_PASTEL_DOMINANT_BLOCK}

${blocks.NO_DARK_NO_EDGY_BLOCK}

${blocks.STYLIZED_AESTHETIC_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ RAINY COTTAGE AESTHETIC (THIS PATH ONLY) ━━━

RAIN IS THE CO-STAR. It must be VISIBLE and prominent — heavy rain streaking down windowpanes, droplets beading on glass, rain cascading off eaves visible through the window, puddles forming on stone paths outside, water running down old leaded glass. The viewer should HEAR the rain. Show it: blurred rain curtains beyond the glass, condensation on panes, wet leaves pressed against windows, rivulets tracing paths down the glass. Inside is impossibly cozy and feminine — pink velvet cushions, cream knit blankets, lace doilies, rose-gold candleholders, steaming teacups. The contrast between HEAVY rain outside and warm pink glow inside is the entire mood.

${creatureBlock}

━━━ THE RAINY COTTAGE SCENE ━━━
${scene}

━━━ LIGHTING (warm against heavy rain) ━━━
Warm amber candlelight and firelight from inside. Cool blue-grey stormy light filtering through rain-streaked windows. Droplets on glass catching and refracting the warm interior glow. The interplay of cozy warmth against dark rainy skies outside. ${lighting}

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
Interior cottage frame — window seat, reading nook, fireside corner, or bedroom alcove. Rain MUST be prominently visible through windows — heavy, streaking, atmospheric. At least 30% of the frame should show rain or rain-on-glass. ${hasCreature ? 'Creature curled up in the coziest spot near the window — tiny relative to the cottage furnishings, perfectly content watching the rain.' : 'Steaming tea, flickering candles, soft textiles, scattered petals, open books as hero subjects.'} NO people, no hands. Pink-cream-amber interior against moody blue-grey rain outside.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
