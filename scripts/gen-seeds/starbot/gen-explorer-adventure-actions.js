#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/explorer_adventure_actions.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} MOTION-FIRST EXPLORATION action entries for StarBot's female-explorer and male-explorer paths. Each entry is a SHORT phrase (10-22 words) describing the EXACT body position of an explorer caught MID-MOTION while exploring an alien planet — striding, climbing, traversing, examining, looking up, pointing, wading, reaching, turning.

CRITICAL — ABSOLUTELY NO SEATED / SITTING / KNEELING-STILL / MEDITATION / EYES-CLOSED / LEANING-BACK / CURLED-UP / RESTING poses. The character is ALWAYS in motion or caught mid-action while exploring. They are EXPLORERS — they explore, traverse, climb, look. Never just sit there.

CRITICAL — ABSOLUTELY NO BATTLE / NO COMBAT / NO weapon-aimed-at-foe / NO violence. Weapons can be HOLSTERED / slung / drawn-low caught mid-motion — never in active combat use.

CRITICAL — LOCATION-AGNOSTIC. Describe ONLY the body position + what they're doing. The location pool sets the WHERE.

NEVER write: "in the cockpit", "at a station bar", "on an alien surface", "at a viewport". Just describe the body, eyes, hands, posture mid-motion.

━━━ ACTION CATEGORIES (enforce variety across ${n}) ━━━

WALKING / STRIDING (5-6) — caught mid-step:
- striding forward across uneven terrain, cape catching the wind, eyes locked on the horizon
- mid-step on a rocky path with weight shifted forward, one boot raised for the next stride
- walking cautiously with one hand outstretched for balance, the other near a holstered sidearm
- walking away from the camera into the distance, silhouette against the world, gear-pack swaying with the gait
- mid-stride with the cloak catching motion behind, head turned slightly to look at something
- striding up a slope with the body angled forward, breathing visible in the cold thin air

CLIMBING / TRAVERSING (4-5):
- mid-climb on a rocky face, one hand reaching for the next handhold, body weight shifted onto the gripping hand
- traversing a narrow ledge with arms held out for balance, eyes focused on the path ahead
- climbing up a slope with both hands gripping rocks, one knee braced against a ledge, gear-pack shifting
- vaulting over a low rock outcropping with one hand pushed off, weight committed to the leap
- pulling up onto a ledge with one arm, the other reaching back for support, body half-suspended

LOOKING UP / OBSERVING (4-5) — head and eyes upward:
- standing with one hand shielding the eyes from a low alien sun, gazing up at the massive thing in the sky
- head thrown back to look up at a colossal structure, jaw slightly open in awe, body rooted in place
- standing with arms loose at the sides, head tilted back, watching something pass overhead
- one hand raised to point at something distant in the sky, body half-turned in mid-stride
- pausing mid-stride with a hand to the visor or brow, lifting the head to scan the horizon

CROUCHING / EXAMINING (3-4) — caught mid-motion, never still:
- crouched mid-motion to touch alien soil with a fingertip, one knee bent, the other leg extended for balance
- bending forward to examine alien plants, hand mid-reach, body weight forward
- kneeling on one knee for a moment to inspect tracks in the ground, the other foot flat for quick rise
- crouched at the edge of a stream, hand mid-reach toward the water, body coiled to spring back up

REACHING / INTERACTING (3-4):
- reaching out with one hand to touch a strange alien plant or formation, body leaning forward
- mid-gesture pulling a holographic screen out from a wrist-device, hand still raised
- one hand reaching back toward the gear-pack while striding forward, eyes still ahead
- pulling on a glove mid-stride, eyes on the path ahead, weight shifting

TURNING / GLANCING (3) — caught mid-rotation:
- mid-stride looking back over the shoulder at where they came from, body in three-quarter rear pose
- turning sharply to look at something off-frame, cape whipping with the motion
- pausing mid-stride to turn the head back, hand on a holstered weapon

WADING / DRINKING-IN (2-3):
- wading mid-step through shallow alien water, ripples spreading from the boots, weight on the back leg
- mid-stride through dense alien fog with hand outstretched, parting the mist before the body
- pushing through alien underbrush with arms raised slightly, weight committed forward

━━━ RULES ━━━
- ABSOLUTELY NO sitting / kneeling-still / cross-legged / lying / leaning-back / eyes-closed / meditation / curled-up / "resting" poses
- Every entry is MID-MOTION — striding, climbing, reaching, looking up, turning, wading, vaulting
- Body weight shifted, limb in motion, captured at a loaded instant
- LOCATION-AGNOSTIC — never name "cockpit", "bar", "bedroom"
- Suitable for both male and female explorers (gender-neutral)
- 10-22 words — vivid and specific
- ABSOLUTELY NO battle / combat / weapon-IN-USE / violence
- Mood: capable / alert / curious / determined — caught exploring

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. NO seated / meditation / eyes-closed poses anywhere.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
