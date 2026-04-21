#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/closeup_framings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} CLOSEUP FRAMING descriptions for BloomBot's closeup path — macro / mid-close shots where FLOWERS ARE THE HERO filling the frame. Could be single bloom, cluster, bouquet, stem-in-field, or vase.

Each entry: 12-25 words. Names the FRAMING composition + the nature of the subject (single / cluster / bouquet / stem-in-context / cut-flower). Flower TYPE is a separate axis — don't pick one here.

━━━ CATEGORIES TO MIX ━━━

**Single hero bloom:**
- Extreme macro of single open flower filling frame
- Three-quarter angle of a single perfect bloom, stem-base visible
- Side profile of a single flower with layered petals
- Overhead top-down macro of a single bloom center

**Cluster / bunch:**
- Tight cluster of overlapping blooms from same plant
- Macro of a budding cluster about to open
- Tight crop on three or four flower heads crowded together
- Cross-section view of densely packed petals

**Bouquet / arrangement:**
- Handheld bouquet against a dark backdrop, stems visible
- Bouquet lying flat on a rustic wooden table
- Ornate vase on windowsill with overflowing arrangement
- Antique vase on marble pedestal with cascading bouquet
- Wildflower bouquet wrapped in linen, just-picked energy
- Modern geometric vase with single statement stem

**Stem in context:**
- Single flower growing up through tall grass, macro-low angle
- Stem emerging from rocky cliffside in tight frame
- Flower pressed against rain-spotted window
- Bloom laying on mossy forest floor

**Cut / still-life:**
- Flower laid on linen with shears beside it
- Bloom resting on open book
- Flower placed on polished stone surface
- Pressed flower on parchment

**Environmental context:**
- Bloom lit by candle beside it
- Flower reflecting in a small mirror
- Drop of water on a single petal, macro
- Bee or butterfly hovering at a bloom's mouth

━━━ RULES ━━━
- Flowers fill 60%+ of the frame — hero subject
- Camera is close (macro / mid-close)
- Don't name specific flower types

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
