#!/usr/bin/env node
const fs = require('fs');
try { fs.unlinkSync('scripts/bots/starbot/seeds/cosmic_oracle_actions.json'); } catch (_) {}
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_oracle_actions.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} BODY-SHAPING POSE + activity descriptions for StarBot's cosmic-oracle path — a vast-archetype sci-fi character (astronaut / bounty hunter / alien / explorer / mystic / treasure hunter / scientist / etc.) in a richly-detailed cosmic scene. Every entry is ONE explicit body-position that FORCES a non-standing render.

Each entry: 12-22 words. ONE specific body pose + context-activity. The POSE leads, the activity provides context. GENDER-AGNOSTIC and SPECIES-AGNOSTIC language — use "the figure" / "they" / NOT "she" / "her" / "him".

━━━ THE CORE RULE ━━━
FLUX'S DEFAULT is to render "sci-fi character" as standing-centered-portrait. Every entry in this pool MUST break that default. The FIRST 5-8 words of every entry MUST describe a specific body-position that CANNOT render as "standing":
- KNEELING (at a console / at a ruin / beside an artifact / at a nav-station / at a fallen comrade)
- CROUCHED / SQUATTING (behind cover / over a trap / beside a specimen / at a control floor-panel)
- SEATED (at a pilot-console / at a navigator's station / on an observation-ledge / on a cargo-crate / on a meditation-mat / at a plasma-altar)
- RECLINING (on a bio-bed / propped on elbow / draped across a lounge / leaned back in a captain's-chair)
- LYING (prone on a walkway with rifle aimed / on back gazing up through a viewport / prone over a survey-grid / curled in cryo-pod)
- LEANING (far forward over a map-table / far back against a bulkhead / against a crystal-pillar / over a terminal / over a railing)
- MID-STRIDE (walking a glowing corridor / running across an observation deck / striding through an alien ruin)
- REACHING (up to a console-switch / far forward to touch an artifact / both arms pulling a lever / catching a drifting data-chip)
- CLIMBING (partway up a ladder / halfway up a crystal-spire / scaling a ship's hull / climbing ruin-steps)
- BENT (over a holo-map / over a glowing-console / over a body-scanner / double-over from zero-g adjustment)
- TILTED / TWISTED (head thrown back to view a ringed-planet / torso twisted sharply at a sound / shoulder turned toward a blinking alarm)
- FLOATING / HOVERING in zero-g (mid-drift between bulkheads / mid-spin / tether-trailing / EVA mid-jet-burn)
- DRAGGED / PULLED / HAULED (pulling cargo / hauling salvage / pulling an unconscious ally)
- CRAWLING (through a ventilation-shaft / across wreckage)
- DIVING / LUNGING (toward cover / into a plasma-shield)

NEVER lead with "standing" / "poses" / "posing" / "facing the camera".

━━━ POSE + CONTEXT FORMULA ━━━
Write as: "[BODY POSITION + SPECIFIC LIMB PLACEMENT], [ACTIVITY CONTEXT]"

Example shapes (do NOT copy — invent 25 DIFFERENT variations, varied across archetype types):
- "Kneeling at the base of an excavated alien obelisk, one gloved hand pressed to glowing glyphs, brushing away millennia of dust"
- "Crouched behind a cargo crate with a rifle braced across the top, scanning the corridor ahead with a targeting-visor down"
- "Seated at a pilot's-console with both hands on the navigation-stick, helmet on the floor, reading a console display of twin-star trajectories"
- "Reclining across a bio-scan bed with eyes closed, diagnostic-halo hovering over the chest, one arm trailing to the floor"
- "Lying prone on a ship's hull in zero-g with a tether cable reeled out, welding-torch flaring at a hull-breach"
- "Leaning far forward over a holo-map table with both palms flat, studying a rotating cosmic-grid of enemy fleet positions"
- "Mid-stride running along a glowing thread-path across an alien plateau, shoulder-pack bouncing, breathing-mask fogging"
- "Reaching up to a ceiling-conduit with a multi-tool in one hand, sparks arcing from a severed cable, head tilted to see"
- "Climbing halfway up a crystal-spiral staircase in an alien temple, carved-glyph trim at shoulder, torch held overhead"
- "Bent double over a recovered alien artifact in the dust, running a survey-lens across its surface, fine dust caked on boots"
- "Twisted at the waist looking sharply over a shoulder at a dimming console-light, one hand reaching for a holstered sidearm"
- "Floating free in zero-g with both arms outstretched, drifting past a huge viewport filled with a binary-star system"
- "Crawling through a ventilation shaft with a flashlight clenched in teeth, elbows dragging, cables trailing overhead"
- "Hauling a heavy cargo-crate up a loading ramp with both hands, shoulders hunched, bootsteps leaving dust-trails"
- "Diving sideways into cover behind a bulkhead as a blaster-bolt punches through the wall where they stood"
- "Seated cross-legged on a meditation-mat inside a circle of floating orbs, eyes closed, plasma-censer smoking beside"
- "Kneeling beside a fallen alien specimen in a glowing bio-tent, recording a holo-diagnostic on a wrist-slate"
- "Perched on the edge of a cargo-crate with legs dangling, cleaning a disassembled sidearm laid out on cloth"
- "Reclining on a control-couch with one leg up, holographic star-chart rotating above, reading a data-slate"
- "Mid-leap across a widening chasm between two rocky spires, arm extended to catch the far ledge, cloak flaring"

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- FIRST 5-8 words = body position + specific limb placement
- Rest = context activity that fits SOME sci-fi archetype (not specifically mystic — mix astronaut-welding / bounty-hunter-stalking / explorer-surveying / pilot-navigating / scientist-examining / mercenary-sniping / treasure-hunter-brushing-dust)
- 12-22 words total
- GENDER-AGNOSTIC ("the figure" / "they" / NO "she" / "he")
- Species-agnostic (doesn't assume humanoid anatomy specifics)

━━━ BANNED ━━━
- NO "standing" leading the pose
- NO "posing" / "modeling" / "facing the camera"
- NO "she" / "her" / "him" / "his" — use they/their or "the figure"
- NO gore / explicit blood / wounds (injured OK, no blood-spray)
- NO sexual / erotic body position
- NO named IP (Atreides / Bene-Gesserit / Jedi / Sith / Starfleet / Mandalorian)
- NO location (pool handles that)
- NO lighting (pool handles that)

━━━ POSE ROTATION MANDATE ━━━
Across 25 entries, rotate aggressively — max ~2-3 entries per pose-family (kneeling, crouched, seated, reclining, lying, leaning, mid-stride, reaching, bent, tilted, floating, climbing, crawling, hauling, diving). Do NOT cluster.

━━━ ACTIVITY ROTATION MANDATE ━━━
Vary activity across archetype-types: ritual / welding / piloting / combat-stalking / excavating / scanning / crafting / repairing / hacking / climbing / observing / negotiating / exploring / sleeping / meditating / reading-chart / etc.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
