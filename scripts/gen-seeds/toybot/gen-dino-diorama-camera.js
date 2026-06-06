#!/usr/bin/env node
/**
 * DINO_DIORAMA_CAMERA — wide cinematic ESTABLISHING-SHOT framing of
 * the entire sprawling toy-dinosaur diorama world. Forced variety in
 * angle (top-down, hilltop, ground-level, off-center, up-angle,
 * panoramic, diagonal) so every render is a different composition.
 * Deep focus is mandatory. Tiny dinos at scale across the frame.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dino_diorama_camera.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} CAMERA / FRAMING entries for ToyBot dino-diorama — wide establishing-shot compositions for a sprawling sculpted-clay prehistoric world populated by tiny toy dinosaurs. Each entry is one sentence, 25-40 words, naming the angle + the deep-focus mandate + a specific composition beat that places dinos at scale across the frame.

━━━ THE BAR ━━━
Every entry MUST: (1) name a specific camera angle/framing (top-down flat-lay / ground-level / hilltop overlook / panoramic ridgeline / diagonal corner-to-corner / hard off-center / up-angle / panoramic sweep / aerial three-quarter / track-side / etc.); (2) include the phrase "deep focus"; (3) place tiny toy dinos visibly across the frame at varying distances (foreground, midground, background) as small inhabitants of a vast world.

━━━ VARIETY MANDATE (distribute across these angles — explicit count distribution non-negotiable) ━━━
- ~3 TOP-DOWN BIRD'S-EYE / FLAT-LAY (straight-down, the diorama world spread out as a map)
- ~3 GROUND-LEVEL EYE-LINE (camera at toy-scale height, dinos peering through foliage, world looming)
- ~3 HILLTOP / ELEVATED THREE-QUARTER OVERLOOK (camera high on a ridge, sweeping view of the valley below)
- ~3 LOW-ANGLE UP / WORM'S-EYE (camera tilted up at rearing dinos or towering anchor, sky dominating)
- ~3 DIAGONAL / RULE-OF-THIRDS CORNER-TO-CORNER (composition cuts the frame diagonally — landform sweeps from one corner)
- ~3 HARD OFF-CENTER (anchor shoved to one edge, vast space spreading the other way)
- ~3 PANORAMIC RIDGELINE / WIDE-VISTA SWEEP (camera hugging a ridge or rim, the world unfolding left-to-right)
- ~2 AERIAL THREE-QUARTER (camera high above, slightly tilted, sweeping vista with depth)
- ~1 DUTCH-TILT / OFF-AXIS (slight angled-tilt for dramatic effect)
- ~1 TRACK-SIDE / EYE-WITH-HERD (camera moving with a migrating herd at their height)
- ~1 BEHIND-THE-ANCHOR LOOKING OUT (camera tucked beside the monumental landform, world receding)

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"Top-down bird's-eye flat-lay, deep focus, sprawling fern-carpeted valley floor packed with grazing sauropods clustered in the upper-left quadrant, volcanic ridges framing all edges."
"Ground-level eye-line through dense cycad trunks, deep focus, a herd of ankylosaurs filling the right half, jagged escarpments towering behind them into stormy sky."
"Sweeping panoramic ridgeline, deep focus, camera hugging the spine of a rocky crest, the whole dino-world panorama unfolding left-to-right below, Stegosaurs silhouetted on the ridge itself."
"Hard off-center, deep focus, towering volcanic peak shoved to the left edge, vast ash-dusted plain spreading right, tiny stampeding Hadrosaurs lost in the right third."

━━━ BANS ━━━
- NO close-up / macro / shallow-DOF / portrait framing — the path is wide-establishing only.
- NO tilt-shift / fake-miniature blur — deep focus end-to-end.
- NO defaulting to "winding river running down the center" — vary the angle / quadrant / off-center placement aggressively.
- NO bare "wide shot" without naming angle + quadrant + dino placement.
- NO repeating the same dino species across entries — vary which dinosaurs appear.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
