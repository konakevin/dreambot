#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/scene_girls_actions.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} BODY-SHAPING POSE descriptions for GothBot's scene-girls path — a dark-fantasy woman in a gothic garden/courtyard oil-painting. Every entry is ONE explicit body-position that FORCES a non-standing render.

Each entry: 12-22 words. ONE specific body pose + context-activity. The POSE leads, the activity provides context.

━━━ THE CORE RULE ━━━
FLUX'S DEFAULT is to render "beautiful gothic woman" as standing-centered-portrait. Every entry in this pool MUST break that default. The FIRST 5-8 words of every entry MUST describe a specific body-position that CANNOT render as "standing":
- KNEELING (on one knee / on both knees / kneeling deep in moss)
- CROUCHED / SQUATTING (low to the ground, weight on heels)
- SEATED (on a bench / fountain rim / stone step / garden chair / moss / fallen column)
- RECLINING (lying back / propped on elbow / draped across stone)
- LYING (on stomach / on back / curled on side)
- LEANING (far forward / far back / against a column / over a railing)
- MID-STRIDE (running / walking briskly with cloak flaring / stepping over)
- REACHING (up / far forward / both arms extended / one arm stretched high)
- BENT (over a cauldron / over a book / over a wounded creature / double over)
- TILTED / TWISTED (head thrown back / torso twisted / shoulder turned sharply)

NEVER lead with "she is standing" / "she stands" / "standing among" / "standing beside".

━━━ POSE CANON REFERENCES ━━━
Draw from real oil-painting pose canons Flux has learned:
- Pre-Raphaelite (Waterhouse "The Soul of the Rose" — kneeling/leaning to a rose / "Ophelia" — floating / "The Lady of Shalott" — seated in boat with one arm trailing)
- Rossetti — reclining, hand under chin, heavy-lidded
- Millais — kneeling at window, looking down
- Burne-Jones — intertwined figures, twisted torsos, reaching arms
- Gothic cinema canon — Crimson Peak / Penny Dreadful / The VVitch / Only Lovers Left Alive — women mid-ritual, mid-drink, mid-discovery, mid-kneel

━━━ POSE + CONTEXT FORMULA ━━━
Write as: "[BODY POSITION + SPECIFIC LIMB PLACEMENT], [ACTIVITY CONTEXT]"

Examples of the formula:
- "Kneeling deep in the moss with both hands pressed flat to the ground, head bowed, whispering into the earth"
- "Crouched low beside a black reflecting pool, one arm trailing fingertips through the dark water"
- "Reclining across a stone bench with her head tilted back, one arm draped over her eyes, grimoire splayed open on her stomach"
- "Leaning far forward over an iron cauldron, both hands gripping its rim, steam rising into her face"
- "Mid-stride running along the flagstone path with her cloak flaring behind her, hair whipping sideways"
- "Seated on the fountain rim with both legs drawn up, wrapping her arms around her knees, staring into the water"
- "Reaching up with both arms extended high, pulling a dark rose down from an overhead iron trellis, back arched"
- "Lying on her stomach in the moss with elbows propping her up, an open grimoire spread before her, chin resting in one hand"
- "Bent double in the herb bed with both hands buried in the soil, digging mandrake roots, hair falling across her face"
- "Sitting cross-legged inside a chalk-drawn sigil circle with a lit candle in each hand, arms outstretched sideways"
- "Kneeling beside a grave marker with both palms pressed to the weathered stone, forehead touching the marker"
- "Crouched on a cathedral gargoyle with one knee up and one hand gripping the stone wing, surveying the garden below"
- "Climbing a stone balustrade with one leg already over, the other still planted, mid-trespass"
- "Twisted at the waist looking sharply over her shoulder, one hand raised to her throat, startled by something in the shadows"
- "Bent over a fallen raven in the moss, both knees on the ground, cradling the bird in her palms"
- "Reaching both hands toward a floating spirit-orb at eye level, palms up, fingers splayed in summoning"
- "Seated at the edge of a stone well, one leg dangling inside, leaning far over the rim with a dropped coin"
- "Dancing mid-turn in an empty courtyard, skirts spinning outward, one arm raised, head thrown back"
- "Collapsed against a column with her back sliding down the stone, one knee up, the other stretched out, spent"
- "Mid-prayer at an outdoor altar, both hands clasped together at her chest, head bowed, knees on a velvet cushion"

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- FIRST 5-8 words = body position + specific limb placement
- Rest = context activity that makes the pose make sense
- 12-22 words total
- Character-agnostic (she / her — character comes from the character pool)
- Gothic-garden-appropriate activity (arcane / occult / ritual / herb / spell / reading / tending plants / pausing / searching / discovering)

━━━ BANNED ━━━
- NO "standing" anywhere in the entry (except as a verb of negation)
- NO "posing" / "modeling" / "facing the camera"
- NO "she is" or "she stands" (lead with the pose directly — "Kneeling deep in the moss...")
- NO combat / violence / weapon-drawn / fighting
- NO gore / explicit blood / wounds
- NO sexual / erotic body position
- NO named IP
- NO location (pool handles that)
- NO lighting (pool handles that)

━━━ POSE ROTATION MANDATE ━━━
Across 50 entries, rotate aggressively — max ~4 entries per pose-family (kneeling, crouched, seated, reclining, lying, leaning, mid-stride, reaching, bent, tilted). Do NOT cluster.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
