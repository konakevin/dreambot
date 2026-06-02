#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_action_moment.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ACTION-MOMENT entries for a MangaBot neo-tokyo cyberpunk anime keyframe. CANDID mid-beat, never posed, never eye-contact with viewer.

CRITICAL VARIETY MANDATE: do NOT default to passive standing/walking/staring. Mix dynamic action with intimate moments. Spread across active / kinetic / quiet / intimate.

Each entry: 8-18 words. ONE specific verb-phase with body-language detail.

ACTION DISTRIBUTION (no single category above 18%):
- 18% DYNAMIC KINETIC (mid-leap / mid-run / sprinting / sliding / fighting)
- 14% TECH-INTERFACE (cyber-deck / hologram / terminal / cable-jack moment)
- 12% INTIMATE/QUIET (kissing in rain / sharing umbrella / hand-on-cheek / leaning together)
- 10% VEHICLE (mounting / dismounting bike / hovercar exit / mid-ride)
- 10% COMBAT-BEAT (drawing weapon / mid-strike / dodging / cyber-augment activating)
- 8% MID-MEAL/PAUSE (ramen-eating / drinking / smoking on curb / chair-tilted-back)
- 8% PHYSICAL TASK (climbing / reaching / opening / closing / pushing)
- 7% INTERPERSONAL (mid-conversation / handing-over / arguing / glancing-at-companion)
- 6% TRANSITIONAL (waking up / falling-asleep / collapsing / standing-from-fallen)
- 5% PASSIVE OBSERVE (kept but reduced — standing-watching used sparingly)
- 2% AUDIENCE / CROWD-WITHIN (in-crowd reacting / mid-applause / mid-cheer)

DO write:
- Mid-leap between two rooftop edges, coat flaring out, both arms forward, weight committed to the gap
- Sprinting through crowd-silhouettes, mid-stride at full speed, weaving between shoulders
- Cable jacked into temple-port, fingers paused on holographic UI, eyes flickering through projected screens
- Kissing in the rain under a paper umbrella, two figures close, lips just touching
- Dismounting a hovering motorcycle, one foot down on wet pavement, helmet still in hand
- Mid-strike with a cyber-katana arc, blade caught in motion-blur, opponent's silhouette ahead
- Caught mid-bite of ramen, chopsticks raised, steam past the face, eyes half-closed
- Mid-climb up a rusty fire-escape, one hand grasping the rail, foot rising to the next rung
- Mid-conversation, leaning toward a companion across a tatami-bar counter, hands gesturing
- Collapsing against a wet wall, clutching a damaged cyber-arm, half-down mid-fall
- Standing on a curb watching street pass by, cigarette glowing (USED SPARINGLY — only 5%)

DO NOT write:
- Multiple "mid-stride walking down street" entries — that's ONE max
- Posed model-stance (looking at camera, weapon raised heroic)
- Gore / explicit violence
- Eye-contact with viewer
- Specific named techniques
- Modern non-cyberpunk actions (driving a sedan, using a smartphone)
- Multiple actions per entry — ONE clear verb-phase

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
