#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mecha_hangars_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} SURPRISE-ELEMENT entries for a MangaBot mecha-hangar keyframe. Each entry adds ONE small narrative-beat or sensory grace-note that makes the scene alive — NEVER a distraction that competes with the mech.

Each entry: 10-18 words. ONE subtle moment. Must support, not steal, the mech-hero composition.

SURPRISE VARIETY:
- WISP OF VAPOR escaping a shoulder-joint mid-test
- SINGLE WARNING-LIGHT pulsing red on the cockpit-rim
- STRAY SPARK hitting a puddle on the hangar floor
- ECHO OF DISTANT ALARM reverberating off the walls
- DROP OF HYDRAULIC-FLUID hitting the concrete from the elbow-joint
- AMBIENT HUM of engines spooling up
- MECHANIC DROPPING wrench in midground
- CRANE-CABLE swaying gently
- MECH'S EYE flickering on for the first time
- TEAR OF COOLANT running down the chest-plate
- TINY KAITEN-PRAYER-TAG fluttering from the antenna
- CIGARETTE-ASH falling from a tech smoking on a catwalk
- DROPPED CLIPBOARD clattering at the deck-edge
- SMALL CAT lounging on a scaffold-rail nearby
- TINY ORIGAMI CRANE folded and placed on the mech's foot
- LONE STROBE flickering out at the back of the bay
- PAPER-LANTERN swaying in the bay-door draft
- BENT GIRDER from yesterday's overload still being repaired
- PAINT-DRIP halfway-down a freshly-resprayed shoulder
- TINY HAND-PRINT on the mech's calf where a child touched it
- KETTLE STEAMING on a tech's portable hotplate
- ROBOT-MASCOT-DOLL strapped to the cockpit-handle (Patlabor canon)
- KOI-FISH SWIMMING in a small tank a tech keeps on the scaffold
- FOLDED RECEIPT pinned to a clipboard at the foot of the mech
- DISCARDED HELMET tipped over at the mech's heel

DO write:
- A wisp of vapor escaping a shoulder-joint mid-test, drifting up across the chest plate
- A single warning-light pulsing red on the cockpit-rim, slow heartbeat rhythm
- A stray spark hitting a coolant-puddle on the hangar floor, brief flash
- The echo of a distant alarm reverberating off the bay walls
- A drop of hydraulic-fluid hitting the concrete from the elbow-joint
- The ambient hum of engines spooling up, sub-bass pulse felt through the deck
- A mechanic dropping his wrench in the midground, the sound echoing

DO NOT write:
- Anything that steals focus from the mech (large objects, bright competing focal points)
- Combat moments (this is HANGAR)
- Hero-portrait pilot moments
- "Magical sparkles" / non-mecha fantasy elements

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
