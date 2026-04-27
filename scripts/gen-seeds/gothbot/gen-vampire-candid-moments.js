#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_candid_moments.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} CANDID MICRO-MOMENT descriptions for GothBot's vampire-vogue-realism path. Each entry is a SHORT phrase (6-12 words) describing a specific thing a vampire woman is caught doing in a chest-up portrait. These are NOT poses — they're the split-second between poses, the unconscious gestures of a predator at rest.

━━━ MOMENT TYPES (enforce variety across ${n}) ━━━
- WEATHER / SENSATION (5-6) — rain running down her face without blinking, breath misting in cold air, wind catching her hair across one eye, snowflakes melting on corpse-cold skin, fog curling around her jaw, frost forming on her eyelashes
- INHUMAN STILLNESS (5-6) — tilting her head at an unnaturally slow angle, staring at something behind the camera without blinking, head cocked like a bird hearing prey, completely motionless mid-thought, frozen mid-blink for an unnaturally long beat, jaw clenched in ancient restraint
- BORED IMMORTAL (5-6) — mid-exhale of a cigarette she doesn't need, half-smile at a private centuries-old joke, eyes half-lidded in ancient boredom, slight nostril-flare of contempt, picking at a loose thread with absolute disinterest, drumming one fingernail on her own collarbone
- PHYSICAL GESTURE (5-6) — running a finger along her own jaw, pushing wet hair back from her face with one hand, chin resting on knuckles, touching the hollow of her own throat, cracking her neck with eerie slowness, pressing her own temple like remembering something painful
- PREDATOR AWARENESS (4-5) — nostrils flaring as she catches a scent, eyes tracking something just past the camera, mid-turn toward a sound only she can hear, pupils shifting focus to something behind you, one ear tilting toward a distant sound

━━━ RULES ━━━
- 6-12 words max — just the moment, no scene-setting
- These are MICRO-ACTIONS visible in a chest-up portrait — no full-body movement
- Fangs should be visible/implied in at least a third of the entries
- NEVER "posing", NEVER "looking at camera seductively", NEVER "smiling for portrait"
- The camera caught her between moments — she didn't know we were watching
- SAFETY: NO blood, NO licking, NO feeding, NO tongues on skin, NO wiping mouths, NO swallowing — these trip AI safety filters. Keep it atmospheric and gestural, not visceral

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
