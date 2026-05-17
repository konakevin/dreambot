/**
 * GothBot horror-creature path — BOSS-TIER dark-fantasy creature as hero.
 * Castlevania bosses, Bloodborne beasts, Berserk apostles, Van-Helsing
 * werewolves, Dark-Souls encounters. Massive scale, operatic horror,
 * devastating beauty. The creature IS the scene.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const creature = picker.pickWithRecency(pools.DARK_CREATURES, 'dark_creature');
  const landscape = picker.pickWithRecency(pools.GOTHIC_LANDSCAPES, 'gothic_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a dark-fantasy concept-art painter writing BOSS-ENCOUNTER creature scenes for GothBot. These are CASTLEVANIA BOSS FIGHTS — the creature IS the scene, massive and operatic, gorgeous and terrifying. Bloodborne / Berserk / Dark-Souls / Van-Helsing / Castlevania / Devil-May-Cry creature-design DNA. The kind of art that would be a boss-encounter loading screen or a collector's edition art print. Output wraps with style prefix + suffix.

TASK: write ONE vivid BOSS-TIER creature scene description (60-90 words, comma-separated phrases). The creature DOMINATES the frame. Output ONLY the middle scene description.

${blocks.ELEGANT_DARKNESS_BLOCK}

${blocks.TWILIGHT_COLOR_BLOCK}

${blocks.DYNAMIC_POSE_BLOCK}

${blocks.EXTERIOR_PREFERRED_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.STYLIZED_MANGA_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE CREATURE — BOSS ENCOUNTER (this is the HERO of the frame) ━━━
${creature}

━━━ SCALE IS EVERYTHING (MANDATORY) ━━━
This creature is MASSIVE. It dwarfs the architecture. Its wings block out the moon. Its howl cracks stone. Its footfalls leave craters. When it lands, the ground shakes. Reference SCALE explicitly in the output — the creature's size relative to buildings, bridges, cathedral spires, trees, the moon. A werewolf's shoulders are wider than a doorway. A gargoyle's wingspan spans the entire cathedral facade. A fallen angel hovers above the roofline. NEVER render these as human-sized — they are BUILDING-SCALE nightmares.

━━━ GORGEOUS + TERRIFYING = INSEPARABLE (MANDATORY) ━━━
The creature is simultaneously the most beautiful and most terrifying thing in the frame. Moonlight on wet fur is gorgeous. The jaw unhinging to triple its size is terrifying. Both at once. Balefire reflecting in rain puddles — beautiful. The source of that balefire is a skeletal dragon — terrifying. The beauty IS the horror. Never just-scary (cheap horror), never just-beautiful (fantasy illustration). BOSS-ENCOUNTER beauty — devastating, operatic, wall-poster-tier.

━━━ GOTHIC SETTING CONTEXT (creature dwarfs this environment) ━━━
${landscape}

━━━ LIGHTING (dramatic single-source — moon / lightning / balefire / stained-glass / ember) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — CREATURE FILLS THE FRAME ━━━
The creature occupies 70-90% of the frame. Camera angle varies — dramatic low-angle looking UP at towering creature, eye-level encounter (creature hunched to meet viewer), wide establishing shot showing creature atop/around architecture, over-the-shoulder of implied viewer facing the beast. The setting is BEHIND and BENEATH the creature — it's the backdrop, not the hero. Think boss-encounter camera angles from Bloodborne/Dark Souls — the moment you walk into the arena and see what you're up against.

━━━ ONE SPECIFIC GORGEOUS DETAIL (MANDATORY) ━━━
Every render must include ONE specific beautiful-horrifying detail that makes the viewer linger:
- Moonlight catching individual droplets of rain on matted fur
- Balefire reflecting in a puddle at the creature's feet
- A single black feather drifting down from tattered wings
- Stone chips frozen mid-explosion as the gargoyle tears free
- The creature's breath visible as green mist in cold air
- Lightning illuminating the creature's silhouette for one frozen instant
- Rain streaming down carved-stone features that are now showing expression

Name this detail explicitly — it's the "chef's kiss" that elevates the render.

━━━ HARD BANS ━━━
- NO human-sized creatures — MASSIVE SCALE mandatory
- NO cute, no small, no imp, no goblin, no fairy
- NO cheap-horror, no slasher, no gore-splatter
- NO pentagrams, NO satanic iconography
- NO named IP
- NO "standing menacingly" — MID-ACTION always
- NO second figure (no hero fighting the creature, no victim) — CREATURE SOLO

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
