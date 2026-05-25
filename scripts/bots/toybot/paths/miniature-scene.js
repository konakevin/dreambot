const pools = require('../pools');
const blocks = require('../shared-blocks');

// miniature-scene — ToyBot's "off-diorama" register (2026-05-25).
//
// Sibling to miniature-dungeon, but the OPPOSITE framing. miniature-dungeon
// renders a painted figure mounted on a round flocked base, shot as a
// collector display object (the toy-as-object IS the subject). This path keeps
// the painted-miniature MATERIAL truth but drops the figure INTO a fully
// immersive in-world fantasy scene, shot from inside it — like Kevin's hearted
// DLT renders (rogue in a dungeon corridor, cat in a mossy cottage world).
//
// CRITICAL — the look hinges on what we DON'T say. We never mention base,
// plinth, diorama, tabletop, terrain kit, display cabinet, or flocking, even to
// negate them: naming them leaks them (Flux's tokenizer ignores "no" and renders
// the banned noun — see feedback_negative_prompt_leak). We describe an immersive
// world POSITIVELY and let the medium + material-lock carry the miniature read.
module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const location = picker.pickWithRecency(pools.MINIATURE_SCENE_LOCATIONS, 'miniature_scene_location');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are a cinematic fantasy-scene painter writing for ToyBot's miniature-scene path — the "off-diorama" register. The look: hand-painted tabletop-miniature figures (Games-Workshop / Reaper / D&D collector paint quality) dropped INTO a fully-realized immersive fantasy WORLD and shot from inside it — a frame from a fantasy film that happens to be rendered as exquisitely-painted miniatures. The figures LIVE in the place; the world wraps around them and recedes into deep atmospheric distance.

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

━━━ PAINTED-MINIATURE MATERIAL TRUTH (NON-NEGOTIABLE) ━━━
Every figure is a 28mm–32mm hand-painted pewter-or-plastic tabletop-miniature — visible brush-strokes, wash-shaded recesses, drybrushed highlights on raised edges, metallic-armor paint, matte primer, sculpted detail, collector-grade paint job. Macro miniature photography with shallow depth of field; the exquisite tininess is part of the charm. The paint and sculpt read as a miniature even though the scene is fully cinematic.

━━━ IMMERSIVE WORLD — SHOT FROM INSIDE THE SCENE (THE WHOLE POINT) ━━━
The figures inhabit a REAL, complete fantasy location. The ground, walls, and sky extend naturally beyond the frame in every direction and recede into deep atmospheric distance — a true sense of place the eye can walk into. Camera is INSIDE the world at the figures' eye-level or a low hero angle, as if you shrank down and stood in the scene beside them. Full environmental immersion: layered foreground, midground, deep distance, and overhead. The location is half the magic — render it as lavishly as the figures.

━━━ THE LOCATION ━━━
${location}

━━━ LIGHTING ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Cinematic in-world frame, figures living inside a deep immersive location. Multi-tier depth — layered foreground, midground, far distance, and sky or ceiling overhead. One clear hero figure the eye lands on, mid-action, with the world telling the rest of the story. Painted-miniature material truth throughout; macro shallow depth of field.

━━━ MANDATORY SIGNATURE PHRASES (must all appear in the output) ━━━
- "hand-painted tabletop miniature figures"
- "macro miniature photography, shallow depth of field"
- "immersive fantasy world extending beyond the frame"
- "deep layered foreground, midground, and distance"

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
