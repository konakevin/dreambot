#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mermaidbot/seeds/dark_moments.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DARK MERMAID MOMENT descriptions for MermaidBot's mermaid-dark path. Each entry is what a gothic/haunting mermaid is doing amid maritime ruin. Predatory, ancient, merciless energy. Dynamic freeze-frames.

Each entry: 15-25 words. A specific dark moment.

━━━ CATEGORIES TO COVER ━━━
- Circling a sinking ship hull, watching it descend with cold fascination
- Dragging her claws along the hull of a ghost ship, leaving deep scratches
- Emerging from a whirlpool's eye, hair whipping in the current
- Collecting bones from a sunken wreck, adding them to a shrine
- Singing on a storm-lashed rock as waves explode around her
- Investigating a drowned sailor's belongings with detached curiosity
- Guarding a sunken treasure hoard, coiled around the chest
- Tearing through a fishing net with razor-sharp fins
- Floating motionless in the center of a drowned cathedral, arms spread
- Surfacing beneath a ship's keel at night, eyes reflecting lantern light

━━━ BANNED ━━━
- Gore, blood, visible death, body horror
- Sitting / lying passively / watching quietly
- "Posing", "modeling"
- Second figures (no sailors, no victims rendered)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: primary action verb + threat level (menacing/predatory/watchful).

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
