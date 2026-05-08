#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_adventure_actions.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} VAMPIRE-ASSASSIN ADVENTURE ACTION descriptions for GothBot's vampire-assassin paths. Each entry is 14-22 words.

CONTEXT: HOT, AGILE, mean, crafty vampire assassins MID-ACTION, never posed, never seated, never static. Castlevania + Devil May Cry + Van Helsing energy. The action is candid body-pose — the camera caught them mid-motion. Setting-agnostic so it fits any stage.

ABSOLUTELY BANNED:
- NO seated, NO cross-legged, NO meditating, NO leaning-back, NO lying down
- NO standing-still-posing, NO hands-on-hips runway pose, NO modeling
- NO eyes-closed, NO chin-up-thoughtfully, NO gazing-into-distance
- NO mid-strike-on-enemy (no combat — weapons drawn but not in active use)
- NO blood, NO fallen-body-at-feet, NO violence

EVERY entry: a SPECIFIC body action mid-motion, body weight shifted, a limb in flight. Cape / coat / hair caught mid-motion is encouraged.

Categories (rotate widely):
- Striding (mid-stride forward, mid-stride away from camera, side-stride angled toward us)
- Vaulting / leaping (mid-vault over a tomb, mid-leap from a parapet, mid-jump between rooftops)
- Climbing (mid-grip up a wall, mid-pull onto a ledge, mid-clamber over a fence)
- Drawing weapon (mid-draw of pistol over shoulder, mid-unsheath of dagger, mid-pull of crossbow from back)
- Crouched/coiled (crouched mid-motion examining a track, coiled to spring up, crouched on a parapet ready to drop)
- Mid-turn (mid-turn with cape flaring, mid-turn over shoulder catching a sound, mid-pivot blade catching moonlight)
- Stalking (mid-stalk through fog with hand on sword-hilt, mid-prowl low and silent)
- Reaching (mid-reach for a holster, mid-extend to grab a rope, mid-snap-extend toward something off-frame)
- Dropping (mid-drop from above, half-fallen with one hand on ground for balance)
- Walking-away into the world (back partially turned, cape billowing behind, head turning to the side)

EVERY entry should imply MOTION + AGILITY + CRAFT. Cape billowing, coat-tail snapping, hair-mid-flight, weight-shifted-in-mid-step.

Examples (write fresh):
- "mid-stride forward through fog with cape billowing behind, eyes fixed on a target ahead, hand drifting toward the holster at her hip"
- "mid-vault over a crooked tomb in pursuit, body coiled and weight forward, coat-tail snapping in the cold wind"
- "crouched mid-motion on a stone parapet, coiled to spring, fingertips just brushing the cold stone, gaze locked downward"
- "mid-turn over the shoulder catching a sound, blade hand drifting to the hilt, cape mid-flare in motion"
- "mid-draw of an ornate pistol over the shoulder in a single motion, body twisted at the waist, eyes locked forward"

Output ONLY a valid JSON array of ${n} strings (14-22 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
