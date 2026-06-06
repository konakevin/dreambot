#!/usr/bin/env node
/**
 * GOTHBOT_GOTHIC_VISTA_PHENOMENON — supernatural-presence events for
 * the gothic-vista "LAND IS ALIVE" path (80%-gated). Fog rolling
 * uphill against the wind, phantom carriages at the treeline, the east
 * tower windows glowing in pulsing sequence, firefly-iris formations,
 * shadow-pools deepening as the moon brightens. Awe + dread. NO chars.
 *
 * GATED at 80% per archetype config → target 100, not 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_gothic_vista_phenomenon.json',
  total: 100,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SUPERNATURAL-PRESENCE entries for GothBot's gothic-vista path — atmospheric events that AMPLIFY the LAND-IS-ALIVE mandate (80%-gated). Sister to dark-landscape's phenomena but framed for HAUNTED-VISTA with structures glowing-from-within + dark-wildlife + bioluminescent-flora baseline. Each entry is one rich descriptive sentence (25-45 words) naming ONE specific haunting supernatural event visible in the landscape.

━━━ THE BAR ━━━
Every entry: (1) names ONE specific haunting EVENT (fog-against-wind, phantom carriage at treeline, tower windows pulsing in sequence, firefly-iris formation, shadows gathering wrong, ghost-bell ripples, blood-mist, time-skip-rain, choir-wind, statue's gaze shifting); (2) describes how it MOVES WRONG / behaves with intent; (3) places it specifically in the gothic landscape with a watcher-feeling. Castlevania / Bloodborne / Crimson-Peak / Berserk lineage. AWE + DREAD register.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Fog rolls steadily uphill against a windless night, pooling around the castle gates in deliberate silence — as though something beneath the earth exhales it purposefully, marking the boundary between worlds."
"Shadows gather thick at the base of the standing stones where no object overhead could cast them, overlapping like cupped hands, deepening even as the moon brightens the surrounding field."
"A phantom carriage materializes at the far tree-line, drawn by horses whose legs move without sound or hoofprint, wheels trailing pale mist-ribbons — it travels the old road slowly, then folds back into nothing."
"Three windows in the derelict east tower glow amber in sequence, extinguish, glow again — not flickering like fire but pulsing like breath, counting something, measuring something, patient as a creature."
"Fireflies converge from the treeline in slow spiraling arcs, organizing themselves at mid-distance into two concentric rings — an unmistakable iris-and-pupil formation hanging eight feet above the marsh."

━━━ VARIETY MANDATE (distribute across these phenomenon families) ━━━
- ~4 FOG / MIST behaving with intent (rolling against wind, pooling, parting, walking, exhaling from soil)
- ~3 SHADOWS behaving WRONG (gathering where no object casts them, deepening as light brightens)
- ~3 PHANTOM PRESENCE / CARRIAGE / RIDER / FIGURE on the horizon
- ~3 WINDOW-PULSE / DOOR-PULSE / LIGHT-SEQUENCE in a derelict structure (counting / breathing)
- ~3 ANIMAL CONVERGENCE (firefly-iris, crow-flock face, wolves moving in impossible unison, bat-spiral)
- ~2 SOUND-PHENOMENON visualized (ghost-bell ripples, choir-wind shudder, distant scream as fog-distortion)
- ~2 TEMPORAL PHENOMENON (rain frozen mid-fall, lightning rewinding, clouds running backwards)
- ~2 STATUE / ICON moving impossibly (gaze shifting, head turned, hand fallen, weeping)
- ~2 SKY-PHENOMENON (witch-fire aurora, blood-eclipse, moon-too-large, double-moon)
- ~1 GROUND-PHENOMENON (graveyard stones leaning toward each other, ground breathing)
- ~1 WATER-PHENOMENON (reflection lagged behind movement, water flowing uphill)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 25-45 words per entry.
- ONE specific phenomenon per entry — no stacking.
- MUST name (a) specific event, (b) how it behaves wrong / intentionally, (c) where in the landscape.
- AWE + DREAD register — the watcher feels witnessed.

━━━ BANS ━━━
- NO jump-scares / gore / explicit violence.
- NO characters harmed / consumed — the phenomenon is environmental dread.
- NO modern register (no UFOs, no electric, no neon).
- NO Halloween cliches.
- NO architectural inner-light (that's a separate axis).
- NO wildlife as the focal subject (wildlife is the surprise_element pool).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
