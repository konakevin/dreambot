#!/usr/bin/env node
/**
 * MECHA_PILOTS_COMPOSITION — pilot+mech scale-relationship angles for
 * MechBot mecha-pilots path. Vertigo-composition — the scale gap IS
 * the punchline. Pilot tiny, mech head-to-foot dominant. 20-35 words.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/mecha_pilots_composition.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} COMPOSITION entries for MechBot's mecha-pilots path — pilot+mech scale-relationship camera angles. The pilot is TINY (climbing leg / on shoulder / in palm / walking toward) and the MECH is HEAD-TO-FOOT dominant in frame. The scale gap IS the punchline. Title-caps prefix THEN " — " separator THEN 20-35 word description.

━━━ THE BAR ━━━
Every entry is ONE compact pilot+mech scale-composition. The mech is HEAD-TO-FOOT in frame. The pilot is tiny, mid-pose (climbing / boarding / walking toward / on shoulder / in palm / at control panel). Setting context is hangar / deployment-bay / launch-pad / wreckage / cradle / shuttle / etc. Short, punchy, scale-focused.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"ASYMMETRIC 1-TO-50 TWO-SHOT — pilot bottom-left tiny, mech head-to-foot filling rest of frame, deployment-bay framing"
"MECH KNEELING FOR BOARDING — mech in boarding kneel head-to-foot, pilot ascending leg-step, amber hangar lighting"
"DEEP-HANGAR WIDE-SHOT — pilot foreground walking toward mech head-to-foot at end of deep tunnel-of-mechs, vanishing-point depth"
"PILOT WALKING AWAY POST-LAUNCH — pilot small in foreground walking away from just-deployed mech head-to-foot rising on thrust, sunset"
"VERTICAL CRADLE-IN-FRAME — mech head-to-foot in vertical launch cradle, pilot ascending side-walkway, alert-strobes pulsing"

━━━ VARIETY MANDATE (distribute across these scale-composition categories) ━━━

- ~4 PILOT BOARDING (mech kneeling pilot ascending leg / pilot climbing rope-ladder / pilot at cockpit-canopy opening / pilot in palm rising / pilot at shoulder-hatch / pilot stepping into chest-port / pilot at boarding-ramp / pilot at gantry walkway)
- ~3 PILOT WALKING TOWARD (pilot foreground walking toward mech end-of-hangar / pilot crossing wet pad toward backlit mech / pilot silhouetted shuttle doorway toward mech / pilot down corridor toward mech head-to-foot / pilot through bay-doors toward mech)
- ~3 PILOT AT CONTROL / GANTRY (pilot at console mech rising background / pilot on overhead gantry / pilot at hangar-control booth / pilot at floor-control panel / pilot in cradle-control room)
- ~3 PILOT ON MECH (pilot on shoulder small / pilot on knee-plate / pilot atop chest-piece / pilot riding head-rim / pilot at cockpit hatch open)
- ~3 PILOT DWARFED COMPARISONS (pilot bottom-frame mech filling top / 1-to-50 asymmetric two-shot / pilot in palm mech reaching down / pilot at foot looking up / pilot ankle-height of mech)
- ~3 DEPLOYMENT / LAUNCH PREP (mech in vertical cradle pilot ascending / mech in deployment-bay strobes / pre-launch sequence / pilot at side-walkway mech rising on thrust / pilot under crane-lowering mech)
- ~3 ARRIVAL / DEPARTURE (mech being lowered by crane pilot below / pilot walking away post-launch / pilot foreground returning mech behind / pilot at debarkation ramp / pilot in foreground mech rising on thrust into sky)
- ~3 RAIN / NIGHT / ATMOSPHERIC (rain-wet deployment-pad night neon reflections / mech silhouetted lightning storm / mech at dawn pad pilot mid-walk / mech in fog-shrouded hangar / mech under floodlight pilot tiny silhouette)
- ~3 HANGAR DEPTH (deep-hangar wide-shot tunnel-of-mechs / pilot at end of long corridor mech at far end / wide hangar with mech-row receding / pilot dwarfed by mech-yard / fleet-of-mechs row stretching back)
- ~2 EXOTIC / FANTASTICAL (mech in cathedral-of-mechs altar style / mech reflected in oil-slick puddle / mech mirrored in glass-floor / mech in icy cathedral hangar)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-5 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- ALWAYS reference "mech head-to-foot" or "mech in frame" or "1-to-50 scale".
- ALWAYS reference the PILOT position (tiny / small / foreground / ascending / climbing / at-control / on-shoulder / etc.).
- ALWAYS include a setting context (deployment-bay / hangar / cradle / shuttle / wet-pad / crane / etc.).
- Body is 20-35 words, terse and punchy.

━━━ BANS ━━━
- NO active battlefield — that's titan-war path; this is DEPLOYMENT/HANGAR/PREP.
- NO mech-only scene — pilot must be visible and tiny.
- NO pilot-only scene — mech head-to-foot dominant.
- NO modern aircraft / jet language.
- NO photoreal name-drops.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
