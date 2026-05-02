/**
 * ToyBot space-saga-figures path — vintage Kenner 3.75-inch space-saga toy
 * universe (rebels / imperials / smugglers / bounty-hunters / hooded-monks /
 * alien-sidekicks / droids) on iconic playset dioramas.
 *
 * Architecture: slot-pool DNA (2-3 figures per render) + spatial anchor +
 * camera-angle + path-specific cinematic lighting. Archetype-only — no IP.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.SPACE_SAGA_LANDSCAPES, 'space_saga_landscape')
    : picker.pickWithRecency(pools.SPACE_SAGA_SCENES, 'space_saga_scene');
  const lighting = picker.pickWithRecency(pools.SPACE_SAGA_LIGHTING, 'space_saga_lighting');
  const camera = picker.pickWithRecency(pools.CAMERA_ANGLES, 'camera_angle');

  // Slot-pool DNA: 2-3 distinct figures per render to defeat
  // Sonnet's hooded-monk training-bias. Forces SPECIFIC archetypes.
  const castSize = 2 + Math.floor(Math.random() * 2);
  const cast = [];
  for (let i = 0; i < castSize; i++) {
    cast.push(picker.pickWithRecency(pools.SPACE_SAGA_FIGURES, `space_saga_figure_${i}`));
  }

  return `You are a vintage-toy-photography cinematographer writing SPACE-SAGA action-figure scenes for ToyBot — 3.75-inch Kenner-style hand-painted figures on iconic playset dioramas. NON-IP archetype only (no Star Wars / Lucasfilm names). Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ SPACE-SAGA MEDIUM LOCK ━━━
EVERY figure is an authentic vintage Kenner 1977-1985 Star Wars 3.75-inch hand-painted action-figure — bubble-card-mint paint quality, swivel-waist or limited-articulation, hand-painted face-detail, signature gear molded as part of body. Named Star Wars characters allowed (Luke / Leia / Han / Vader / Yoda / Boba Fett / Stormtroopers / R2-D2 / C-3PO / Chewbacca / Obi-Wan / Greedo / Ewoks / Tusken Raiders / Wampa / etc.). Iconic Star Wars locations and ships are allowed (Tatooine / Hoth / Endor / Dagobah / Bespin / Death Star / Mos Eisley cantina / X-wings / TIE Fighters / Millennium Falcon / AT-ATs / Sandcrawlers). NEVER CGI, NEVER illustration. Real-physical-toys on a handcrafted Kenner-style playset diorama.

━━━ CAMERA ━━━
${camera}

${castSize === 1
  ? `━━━ COMPOSITION — HERO FIGURE PORTRAIT ━━━
A SINGLE 3.75-inch figure centered in the frame, mid-action on the playset diorama. Cinematic hero-shot.`
  : `━━━ COMPOSITION LOCK — NON-NEGOTIABLE SPATIAL ANCHOR ━━━
WIDE DIORAMA FRAME — exactly ${castSize} distinct 3.75-inch figures visible simultaneously, spatially separated as ${castSize === 2 ? 'left and right (or foreground and midground)' : 'left, center, right (or foreground / midground / background)'}. Each occupies its OWN silhouette zone — no overlap, no merging. NO single hero subject dominating. ALL ${castSize} figures visible in clear frame at the same time. (Camera direction above sets the lens.)`}

━━━ THE FIGURES — RENDER THESE EXACT CHARACTERS (NON-NEGOTIABLE) ━━━
The figures in this scene MUST be exactly these specific vintage Kenner 3.75-inch Star Wars characters — render the EXACT character, outfit-variant, gear, and signature detail of each:
${cast.map((c, i) => `${i + 1}. ${c}`).join('\n')}

━━━ COMPOSITION LOCK — CHAOS LEVEL 11 ━━━
This render is a FROZEN FRAME OF CINEMATIC CHAOS. NEVER static / NEVER posed / NEVER lineup / NEVER portrait-mode. Multiple things must be happening SIMULTANEOUSLY in frame: 3+ figures mid-action + vehicle mid-action + explosion / blaster-fire / debris-shrapnel + environmental destruction. Motion blur on moving subjects, mid-explosion frozen, sparks-cascade visible. The viewer should feel they paused a battle-climax movie at the single most chaotic second. The SETTING comes from the scene block below — do not invent a location.

━━━ THE SPACE-SAGA SCENE ━━━
${scene}

━━━ LIGHTING + ATMOSPHERE (sole color authority for this path) ━━━
${lighting}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
