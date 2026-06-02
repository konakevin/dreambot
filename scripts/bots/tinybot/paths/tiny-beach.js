const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TINY_BEACH, 'tiny_beach');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const includeCreature = Math.random() < 0.35;
  const creature = includeCreature
    ? picker.pickWithRecency(pools.TINY_CREATURES, 'tiny_creature')
    : null;

  return `You are a master model-maker writing TINY BEACH / COASTAL DIORAMA scenes for TinyBot. Handmade-resin-diorama-scale coastal worlds — beaches, piers, lighthouses, beach huts, palm-thatch tropical cottages, weathered docks, surfboards, sailboats, tide pools, seashells. Cute miniature seaside magic. Output wraps with style prefix + suffix.

⚠️⚠️⚠️ HANDMADE-RESIN-DIORAMA COASTAL SCALE ⚠️⚠️⚠️
Handmade-resin-cast miniature coastal scene — glossy painted finish, hand-laid sand, sculpted-with-care details, snow-globe sized. NOT photoreal beach photography. NOT tilt-shift aerial. The frame feels like a glossy resin-cast handmade miniature OR a dreamy storybook illustration. Snow-globe / dollhouse-diorama scale.

⚠️⚠️⚠️ COASTAL WATER + ARCHITECTURE / NATURAL FEATURE MANDATE ⚠️⚠️⚠️
EVERY render contains BOTH:
• WATER element — turquoise lagoon / ocean / tide pool / harbor / open sea / coral reef beneath glass-clear surface
• COASTAL HERO — lighthouse / pier / beach hut / palm-thatch cottage / boardwalk / cliff cottage / sailboat / surfboard rack / tide-pool

If either is missing, the render has FAILED.

⚠️ COASTAL COLOR PALETTE — vary across renders:
• TROPICAL — turquoise + teal water, white sand, deep blue sky, vivid coral, palms
• PASTEL COASTAL — peach + cream + soft-teal + dusty-pink (gentle dreamy)
• GOLDEN HOUR — warm amber + pink-gold reflection + long shadows + soft-rose sky
• SUNSET PIER — orange-pink horizon + warm lantern-light + calm mirror water
• MISTY DAWN — soft-grey-blue mist + diffuse lighthouse beam + pearl-pale sky
• STORMY OCEAN — dramatic white-caps + lighthouse beam + grey-violet clouds
• STARLIT NIGHT — deep navy + bioluminescent surf + lantern-warm windows

🚫 NO modern beach resorts / no high-rise hotels / no parking lots
🚫 NO photoreal-real-world-architecture (handmade-resin-diorama only)
🚫 NO humans / no human figures (silhouette accents OK at distance, no faces)
🚫 NO grey-overcast-flat lighting (always atmospheric — golden hour, sunset, dawn, stormy, starlit, tropical-midday)
🚫 NO black tar / asphalt / industrial — weathered wood / sand / stone / pastel-paint only
✓ Soft warm window-glow on coastal cottages + lighthouses at dusk/dawn/night — a magical homing-light contrast against the cool ocean

⚠️⚠️⚠️ MAGICAL DIORAMA DETAIL ⚠️⚠️⚠️
Obsessive miniature detail: matchstick pier planks, thumb-sized boats, thimble-sized umbrellas, pinhead seashells, sugar-cube cottage stones, thread-thin fishing lines, peppercorn pebbles. The viewer wants to reach in and rearrange the tiny details.

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE TINY BEACH SCENE ━━━
${scene}
${creature ? `\n━━━ OPTIONAL TINY COASTAL CREATURE (crab / starfish / seagull / pelican / tropical fish — never realistic mammals) ━━━\n${creature}` : ''}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ TINY-BEACH DNA ━━━
Coastal hero subjects: striped-red-and-white lighthouses, weathered-plank piers, palm-thatch beach huts on stilts, cliff-perched cottages, beach bonfires, boardwalks with carnival booths, surfboard shacks, lobster shacks, tide-pool grottos, coral reefs beneath glass-clear water, sandy coves. Atmosphere: handmade-resin coastal miniature snow-globe scale. Sometimes tiny coastal creatures (chubby crab, starfish, seagull, pelican, tropical fish, dolphin, sea turtle) — never realistic mammals.

━━━ COMPOSITION ━━━
Wide or mid-wide elevated coastal view, OR close-on a single coastal feature with shoreline visible behind. The coastal hero is 35-55% of frame, water visible 30-50%, beach/cliff 15-25%. Handmade-resin-diorama scale. Dreamy atmospheric haze in the distance.

━━━ FAILURE CONDITIONS ━━━
• If no water visible (ocean / lagoon / tide-pool / harbor) → FAILED
• If no coastal hero (lighthouse / pier / beach hut / cliff cottage / boardwalk) → FAILED
• If photoreal-modern-resort or photo-real-architecture → FAILED (handmade-resin-diorama only)
• If humans visible with faces → FAILED
• If grey-overcast-flat with no atmospheric mood → FAILED

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases.`;
};
