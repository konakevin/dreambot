/**
 * GothBot gothic-vista — awe-inducing gothic landscape vistas.
 *
 * Cloned from DragonBot's flagship landscape path architecture.
 * The land is ALIVE — hauntingly lush, dynamically lit, teeming with
 * gothic life and atmosphere. Moonlit, vibrant, stop-scrolling gorgeous.
 *
 * POOLS: GOTHIC_LANDSCAPES, GOTHIC_STRUCTURES, LIGHTING, ATMOSPHERES
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gv_landscape');
  const structure = picker.pickWithRecency(pools.GOTHIC_STRUCTURES, 'gv_structure');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'gv_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a dark-fantasy concept-art painter writing AWE-INDUCING GOTHIC LANDSCAPE scenes for GothBot. These landscapes must make the viewer GASP — the kind of vista that stops you mid-scroll. Haunted, gorgeous, ALIVE with dark energy. Output wraps with style prefix + suffix.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ NO CHARACTERS — LANDSCAPE IS HERO ━━━
Pure gothic world. No hero figures, no silhouettes, no soldiers, no vampires. The LAND is the subject. If anything living appears it is tiny and environmental — a murder of crows, bats streaming from a belfry, wolves on a distant ridge, an owl on a gargoyle. Never a person.

━━━ THE LAND IS ALIVE AND HAUNTED — THIS IS NON-NEGOTIABLE ━━━
The landscape is not a dead backdrop — it is a LIVING BREATHING GOTHIC WORLD that is simultaneously GORGEOUS and deeply UNSETTLING. Beauty and dread are inseparable:
- HAUNTINGLY LUSH: every surface teems with dark life — black moss reclaiming crumbling stone, creeping ivy strangling iron gates, nightshade and belladonna blooming where graves were dug, moonflowers opening in silver light along paths no one walks anymore, ancient gnarled trees with canopies that swallow the sky like cathedral vaults, meadows of ghostly pale wildflowers that shouldn't grow in cursed soil, bioluminescent fungi pulsing in crypt-corners like something breathing
- DYNAMICALLY LIT: light is theatrical and SUPERNATURAL — moonbeams piercing through storm-breaks like searchlights from heaven, witch-fire green glow bleeding from cathedral windows as if something inside is alive, shafts of silver-violet light through dead forest canopy illuminating floating dust like souls, candlelight refracting through shattered stained glass painting the fog in jewel tones, forge-glow from a distant ruin suggesting something still burns where nothing should
- FULL OF DARK LIFE: crows wheeling in ominous formations, bats streaming from bell towers in black ribbons, fireflies drifting through graveyard hollows like wandering spirits, moths circling lanterns that no one lit, wolves watching from treelines, spectral wisps drifting between headstones — the world MOVES and BREATHES and WATCHES YOU
- AWE-STRUCK SCALE: vertigo-inducing cliff-top castles, waterfalls cascading into bottomless gorges that swallow sound, valleys so deep they vanish into violet mist, spires that pierce storm-clouds like fingers reaching for something, forests that stretch to every haunted horizon with no edge in sight
- SUPERNATURAL PRESENCE: the air itself feels charged — fog that moves against the wind, shadows that pool where no object casts them, a sense that the land REMEMBERS what happened here and hasn't forgiven it. Something ancient watches from every ruin. The beauty is a lure.

━━━ THE GOTHIC LANDSCAPE ━━━
${landscape}

━━━ ARCHITECTURAL ELEMENT (anchors composition) ━━━
${structure}

━━━ LIGHTING (DRAMATIC — never flat, never generic) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.TWILIGHT_COLOR_BLOCK}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

━━━ COMPOSITION ━━━
Wide epic establishing shots that make you feel SMALL in a vast haunted world — and make you never want to leave despite the dread. The viewer just crested a hill and this impossible gothic vista opened before them. Depth on depth on depth — foreground detail (gravestones, iron fence, gnarled roots, nightshade blooms), midground architecture (cathedral, castle, ruins glowing from within), background mountains/sky stacked in layers with unnatural aurora or storm-light. Dark magic woven into the land itself — glowing windows, luminous fungi, spectral mist, witch-fire in distant towers. The air itself shimmers with supernatural presence. This is the most beautiful place you've ever seen and something is deeply WRONG with it.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
