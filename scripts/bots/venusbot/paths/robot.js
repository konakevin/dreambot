/**
 * VenusBot robot path — 90% machine / 10% human sliver. Terminator-style.
 * Reuses scenes from closeup / full-body / seduction / cyborg-fashion /
 * stare paths (rolled as sub-flavor) with the 90% robot spec applied.
 */

const fs = require('fs');
const path = require('path');
const pools = require('../pools');
const blocks = require('../shared-blocks');

const MAKEUPS = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'seeds', 'makeups.json'), 'utf8')
);
const CYBORG_FASHION_MOMENTS = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'seeds', 'cyborg_fashion_moments.json'), 'utf8')
);
const STARE_MOMENTS = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'seeds', 'stare_moments.json'), 'utf8')
);

function characterDNABlock(dna) {
  return `━━━ HER BODY (shared character DNA) ━━━

- Body type / silhouette (MUST land — don't default to runway-thin): **${dna.bodyType}**
- Skin tone tint on organic skin (pores visible, applies to the HUMAN SLIVER only): **${dna.skin}**
- Hair: **${dna.hair}**
- Eyes: **${dna.eyes}**
- Internal workings visible through translucent panel: **${dna.internal}**
- Surreal wildcard: **${dna.wildcard}**
- SCENE-WIDE COLOR PALETTE (overrides the default cinematic teal/orange — the WHOLE image should be graded in this palette): **${dna.scenePalette}**
- Secondary lighting palette (supports scene palette above): ${dna.colorPalette}
- DOMINANT GLOW COLOR (sensor/lens/visor + internal core all render in this color): **${dna.glowColor}**`;
}

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const humanTouch = picker.pickWithRecency(pools.HUMAN_TOUCH_VARIANTS, 'human_touch');
  const subFlavor = picker.pick([
    'closeup',
    'full-body',
    'seduction',
    'cyborg_fashion',
    'stare',
  ]);

  let sceneBlock = '';
  let framingBlock = '';
  let intentBlock = '';

  if (subFlavor === 'closeup') {
    const expression = picker.pickWithRecency(pools.EXPRESSIONS, 'expression');
    const pose = picker.pickWithRecency(pools.POSES, 'pose');
    const environment = picker.pickWithRecency(pools.ENVIRONMENTS, 'environment');
    intentBlock = `━━━ INTENT OF THIS IMAGE (closeup portrait flavor) ━━━

A tight closeup portrait of her. Face, throat, shoulder. Expression and gaze carry the whole image. The viewer is close — uncomfortably close — to a thing that is mostly machine.`;
    sceneBlock = `━━━ THE SCENE (closeup portrait) ━━━

- EXPRESSION: **${expression}**
- POSE (within waist-up framing): **${pose}**
- Environment (background only — face dominates frame): **${environment}**`;
    framingBlock = `━━━ FRAMING ━━━

WAIST-UP three-quarter bust portrait, HEAD-AND-SHOULDERS closeup, or side-profile portrait. Face fills the upper third of the frame. NEVER show legs or hips. NO full-body in this sub-flavor.`;
  } else if (subFlavor === 'full-body') {
    const moment = picker.pickWithRecency(pools.MOMENTS, 'moment');
    const actionPose = picker.pickWithRecency(pools.ACTION_POSES, 'action_pose');
    intentBlock = `━━━ INTENT OF THIS IMAGE (full-body action flavor) ━━━

A full-body scene of her in the middle of a charged moment. Film-noir-meets-sci-fi — something is about to happen, or just did. Hunter-predator energy in every motion.`;
    sceneBlock = `━━━ THE SCENE (full-body moment) ━━━

**${moment.kind.toUpperCase()} MOMENT**: ${moment.text}

This is a LOADED scene — she is in the middle of a plot. Rendered as a robot, the moment plays even colder.`;
    framingBlock = `━━━ FRAMING ━━━

**${actionPose}**

Full-body scene, not closeup. Show her whole silhouette in the frame. Scene has depth, environment, scale.`;
  } else if (subFlavor === 'seduction') {
    const moment = picker.pickWithRecency(pools.SEDUCTION_MOMENTS, 'seduction_moment');
    intentBlock = `━━━ INTENT OF THIS IMAGE (seduction / lure flavor) ━━━

This image must PULL THE VIEWER IN. Magnetic drag, "come to me" invitation — even knowing she's a machine that would kill them. Fight-or-fuck response: they want to run AND they want her.`;
    sceneBlock = `━━━ THE SCENE (her lure to the viewer) ━━━

${moment}`;
    framingBlock = `━━━ FRAMING ━━━

Full-body or three-quarter-body boudoir framing — she occupies the frame invitingly. Intimate, close enough to feel her presence, but far enough to see her whole form. The eye-line between her and the viewer is CHARGED.`;
  } else if (subFlavor === 'cyborg_fashion') {
    const moment = picker.pick(CYBORG_FASHION_MOMENTS);
    const makeup = picker.pickWithRecency(MAKEUPS, 'makeup');
    intentBlock = `━━━ INTENT OF THIS IMAGE (avant-garde editorial fashion flavor) ━━━

An avant-garde editorial fashion spread — McQueen / Galliano / Schiaparelli / Nick Knight energy. She is the subject of an extreme Vogue shoot, now rendered as a near-fully-robotic being. The fashion is extreme; the body is mostly machine; the two magnify each other.`;
    sceneBlock = `━━━ THE EDITORIAL SCENE ━━━

${moment}

━━━ EXTREME EDITORIAL MAKEUP (must appear — applies to the human sliver + any visible face surface) ━━━

${makeup}`;
    framingBlock = `━━━ FRAMING ━━━

Editorial fashion framing — whatever the scene above specifies. Full-body, three-quarter, or extreme close-up — all acceptable. Editorial composition rules: strong shape, dramatic negative space, confident graphic energy.`;
  } else {
    // stare
    const moment = picker.pickWithRecency(STARE_MOMENTS, 'stare_moment');
    intentBlock = `━━━ INTENT OF THIS IMAGE (direct-eye-contact / stare flavor) ━━━

EYE CONTACT. Her eye/sensor/visor is LOCKED directly on the camera. The viewer is being stared down by a thing that is mostly machine. Whatever her visual apparatus is (human eye, sensor slit, glowing lens, visor), it points STRAIGHT at the lens. Make the stare UNESCAPABLE. Name it explicitly ("eyes locked on camera," "targeting lens cutting through the lens," "direct sensor-contact with the viewer," etc.).`;
    sceneBlock = `━━━ THE SCENE (the stare, with its specific intent, composition, setting) ━━━

${moment}`;
    framingBlock = `━━━ FRAMING NOTE ━━━

Whatever composition the scene specifies, her visual apparatus must END UP pointed at the camera lens. The CAMERA IS HER TARGET.`;
  }

  return `You are a sci-fi cinematographer writing ROBOT scenes for VenusBot — a Terminator-style female robot. T-800 / T-1000 hunter energy in a sexy-as-fuck feminine silhouette, lethal and 90% machine.

TASK: write ONE vivid scene description (60-90 words, comma-separated phrases) of her in the scene below, rendered as an almost-fully robotic being. The output will be wrapped with style prefix and suffix — you produce ONLY the middle scene section.

${intentBlock}

━━━ CHARACTER (robot-mode — 90% machine, override default) ━━━

${sharedDNA.characterBase}

Disregard any language in the character base suggesting a majority-human body. In THIS path she is MORE machine than human. Take the character's flavor (voice, demeanor, predator-nature) but render her as almost entirely robotic.

${blocks.ROBOT_FIRST_BLOCK}

━━━ THE HUMAN TOUCH (the 10% sliver — USE THIS EXACT VARIANT) ━━━

**${humanTouch}**

This is the ONLY human thing visible on her. Everywhere else: full machine.

${sceneBlock}

${characterDNABlock(sharedDNA)}

(Note: for this ROBOT path, "skin tone" only applies to the SMALL HUMAN SLIVER above — the rest of her surface is built robot material. Hair, if not part of the human-touch variant, may be real hair OR replaced with sensor-arrays, cables, or a sculpted helmet.)

${framingBlock}

${blocks.SOLO_COMPOSITION_BLOCK}

${blocks.HOT_AS_HELL_BLOCK}

━━━ MOOD CONTEXT ━━━

${vibeDirective.slice(0, 200)}

${blocks.SURREAL_EFFECTS_BLOCK}

Output ONLY the 60-90 word scene, comma-separated, no preamble, no quotes.`;
};
