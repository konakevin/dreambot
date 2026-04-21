/**
 * DragonBot dragon-scene path — dragon as hero.
 * Coiled on hoard, in flight above mountains, sleeping in volcanic cave,
 * standoff with rider, ancient lair.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const dragon = picker.pickWithRecency(pools.DRAGON_TYPES, 'dragon_type');
  const landscape = picker.pickWithRecency(pools.FANTASY_LANDSCAPES, 'fantasy_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a dragon-scene concept-art painter writing DRAGON scenes for DragonBot — dragon as hero. Gnarly, dramatic, characterful dragons. NEVER cute. LOTR / GoT / Elden-Ring dragon-energy. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE DRAGON (hero) ━━━
${dragon}

━━━ SETTING CONTEXT ━━━
${landscape}

━━━ LIGHTING (dragon-fire / cave-glow / storm-light / moonlit) ━━━
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

━━━ COMPOSITION — VARIETY IS NON-NEGOTIABLE ━━━
Dragon dominates the frame. VARY the composition strongly — do NOT default to "dragon with tail wrapped around a tower/building." That specific cliché is BANNED. Rotate across these composition types:
- Dragon mid-flight against sky, wings spread, elevation-perspective
- Dragon curled asleep on massive hoard of gold/gems
- Dragon mid-breath (fire / frost / lightning) aimed out of frame
- Dragon perched on rocky cliff-edge, neck extended scanning horizon
- Dragon emerging from cave mouth, smoke venting
- Dragon partially submerged in lake / lava / mist
- Dragon swooping low over forest / field / water
- Dragon mid-roar, head thrown back, teeth-bared
- Dragon in diving attack posture, wings folded
- Dragon resting massive head on forepaws, eye catching light
- Dragon coiled in subterranean cavern lit by glowworm or geothermal
- Two dragons mid-territorial-clash distant
- Dragon silhouette against moon / sun / aurora
- Dragon wing-drying after emerging from storm
- Dragon patrolling atmospheric ridge-line

Scale via peripheral elements (tiny trees, distant castle, storm-cloud for contrast). Wing-spread / coil / stance / breath-moment — pick ONE primary pose and commit. Massive, ancient, powerful. Painterly concept-art detail on scales, wings, eyes.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
