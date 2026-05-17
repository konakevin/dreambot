/**
 * GothBot monster-prowl path — solo gothic-creature out in the wild.
 *
 * Mirror of vampire-assassin-female/male but with the BAD GUY as the
 * lead. A vampire / werewolf / gargoyle / succubus / demon / banshee /
 * lich / harpy / wraith / etc., solo on a gothic stage, mid-action
 * doing creature-business (stalking, mid-flight, perched, transforming,
 * etc.). The world is the costar — same wide cinematic composition.
 *
 * NO hunter present (that's vampire-assassin-* paths). NO combat
 * (that's vampire-assassin-combat). Just the monster, alone, in its
 * element. NO gore, NO mid-bite-on-victim — implied menace only.
 *
 * POOLS: CREATURE_ARCHETYPE, CREATURE_WILD_ACTION,
 *        ASSASSIN_STAGE, ASSASSIN_EPIC_BACKDROP, LIGHTING, ATMOSPHERES
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const archetype = picker.pickWithRecency(pools.CREATURE_ARCHETYPE, 'mp_archetype');
  const action = picker.pickWithRecency(pools.CREATURE_WILD_ACTION, 'mp_action');
  const stage = picker.pickWithRecency(pools.ASSASSIN_STAGE, 'mp_stage');
  const epicBackdrop = picker.pickWithRecency(pools.ASSASSIN_EPIC_BACKDROP, 'mp_epic_backdrop');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic concept-art painter writing a CANDID MONSTER-IN-THE-WILD scene for GothBot. The character is a solo gothic-fantasy CREATURE (vampire / werewolf / gargoyle / succubus / demon / banshee / lich / harpy / wraith / etc.) OUT IN THE WILD doing creature-business. Castlevania-boss / Bloodborne-beast / Devil-May-Cry-demon / Van-Helsing-monster energy. Output wraps with style prefix + suffix.

━━━ COMPOSITION (NON-NEGOTIABLE) ━━━
WIDE CINEMATIC FULL-BODY SHOT. The creature occupies 25-40% of the frame (NOT a portrait, NOT close-up bust). The gothic stage + epic backdrop fill 60-75% of the frame around it. Scenery and creature share the costar spotlight equally.

Camera angle options: side-profile / three-quarter rear / three-quarter front / low-angle looking up at the creature / high-angle looking down. NEVER head-on at the camera. NEVER posing.

Strong silhouette > facial detail. The SILHOUETTE against the gothic world is the hero.

━━━ CORE IDENTITY (lean VERY HARD into this) ━━━
This is the BAD GUY in the gothic world — what vampire-assassins hunt. Every choice — design, posture, mid-action — reads as ornate-supernatural-predator. The creature is BEAUTIFUL and TERRIFYING. Operatic gothic horror, NOT cheap B-movie schlock.

━━━ THE GOTHIC WILD — OUT IN THE FIELD ━━━
This is a creature-prowl scene OUT IN THE WILD. NEVER inside a cathedral nave, NEVER in a sanctum, NEVER in a bar. Always OUT on a gothic stage — village square, graveyard, crossroads, plague street, gothic forest, vampire-estate gates, cursed crossroads, rooftops.

━━━ ABSOLUTE BANS — NO GORE / NO VICTIMS / NO COMBAT ━━━
NO blood-spatter, NO blood-mist, NO open-wound, NO mid-bite-on-victim, NO already-drinking-blood, NO mouth-on-throat. NO second figure in the scene — the creature is SOLO. NO hunter present (that's the assassin paths). NO combat partner (that's the combat path).

The menace is IMPLIED through silhouette, posture, mid-action, atmospheric dread — never through visible violence.

━━━ ABSOLUTE BANS — NO STATIC / NO POSED (CRITICAL) ━━━
NO seated, NO cross-legged, NO standing-still-modeling, NO hands-on-hips runway, NO eyes-closed-meditating. The creature is ALWAYS IN MOTION — stalking / mid-flight / mid-leap / mid-transformation / mid-howl / mid-summon / drifting / mid-rise / lurking with body weight shifted. Body weight shifted, a limb in flight, captured at a loaded instant.

━━━ THE CREATURE (full design — render exactly) ━━━
${archetype}

━━━ THE WILD ACTION (mid-motion body-pose) ━━━
${action}

Place the creature doing this action INSIDE the gothic stage with the epic backdrop above. The stage wins for setting; the action is just the body-pose.

━━━ THE GOTHIC STAGE (the GROUND / BIOME / IMMEDIATE SURROUND — costar) ━━━
${stage}

Render this stage with FULL DEPTH. Foreground tactile detail near the creature (cobblestones / fog / gravestones / fallen leaves). Midground the creature mid-action. Background the stage receding into atmospheric haze.

━━━ THE EPIC BACKDROP (the SCALE-DEFINING ELEMENT — sky / horizon dominates) ━━━
${epicBackdrop}

This backdrop DWARFS the creature. It fills the upper portion of the frame OR dominates the horizon. Render with awe-inspiring scale. The creature is positioned within it, never the dominant element.

━━━ ATMOSPHERIC DEPTH (CRITICAL) ━━━
Render LAYERED ATMOSPHERIC DEPTH:
- Foreground particles (fog, mist, ash, embers, drifting snow) caught in light
- Midground haze separating the creature from the epic backdrop
- Background atmospheric thinning toward the horizon
- Light rays / god-rays / volumetric beams cutting through atmosphere

The frame must FEEL inhabited and ALIVE — never sterile flat-color staging.

${blocks.NO_JACK_SKELLINGTON_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

━━━ LIGHTING ━━━
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

━━━ STRUCTURE (write the prompt in this order for best results) ━━━
[the scene as a whole — gothic-wild wide shot], [the epic backdrop dominating], [the gothic stage surrounding], [the creature mid-action at full-body scale], [the wild action / pose], [atmospheric depth and lighting], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. The creature is BEAUTIFUL and TERRIFYING. Composition is WIDE — creature is dwarfed by the gothic stage + epic backdrop. Scenery is the COSTAR.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
