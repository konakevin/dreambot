#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/conservatory_spaces.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} CONSERVATORY / GREENHOUSE space descriptions for BloomBot's conservatory path.

Each entry: 15-25 words. One specific conservatory/greenhouse SPACE — the architecture, atmosphere, and camera angle. Do NOT name specific flower types (a separate pool handles that).

━━━ STRUCTURE TYPES (mix evenly) ━━━
- Victorian glass conservatories with ornate iron ribbing
- Abandoned greenhouses reclaimed by nature — cracked panes, rusted frames, overgrown
- Grand palm houses — Kew-Gardens-scale soaring glass domes
- Orangeries — elegant stone-and-glass rooms attached to manors
- Botanical garden atriums — multi-story glass walls, spiral staircases
- Solarium ruins — half-collapsed glass roof open to sky
- Art-nouveau glasshouses — Mucha-inspired curved iron, stained-glass accents
- Small backyard greenhouses — intimate potting-shed scale
- Rooftop glass gardens — city skyline through fogged panes
- Underground crystal conservatories — carved from rock, crystal skylights
- Tropical conservatories — steaming jungle canopy pressing against glass, humid mist, palm fronds, exotic vines, monstera leaves
- Desert glasshouses — arid botanical collection, succulents, cacti, sand-colored stone floors, dry heat shimmer
- Aquatic conservatories — lily ponds reflecting glass ceiling, water channels between stone walkways, floating blooms

━━━ CAMERA ANGLE / PERSPECTIVE (vary across entries, ~equal distribution) ━━━
- Ground-level looking up through iron ribs and glass vault
- Bird's-eye looking down through glass roof into the greenhouse below
- Through-the-doorway framing — peeking into the space from outside
- Low-angle from stone path looking down a long corridor of glass
- Overhead skylight view — looking straight up at glass ceiling with vines
- Wide establishing shot — full exterior visible with glass walls glowing from inside
- Intimate corner closeup — a single bench or table in a mossy corner
- Through broken/fogged glass — shooting through the pane itself

━━━ FLOWER INSTRUCTIONS (critical) ━━━
Do NOT name specific flower species. Use generic terms like "blooms", "flowers", "vines", "plants", "botanical explosion", "floral overflow". A separate pool provides the specific flower type.

~40% of entries: mention "mixed wildflowers" or "dozens of species" or "botanical chaos of mixed blooms" or "riot of mixed tropical and temperate flowers" to signal multi-flower compositions.
~60% of entries: just say "blooms" or "flowers" generically (the separate pool will fill in one specific type).

━━━ WILDLIFE SPLASHES (~25% of entries) ━━━
Occasionally include a small wildlife detail for life and magic:
- Butterflies drifting through shafts of light
- Dragonflies hovering near glass panes
- Fireflies glowing in a dim/twilight scene
- Hummingbird frozen mid-flight
- Bees working blooms
- Moths circling a gaslight
Keep them peripheral — never the subject, just an accent. Most entries (75%) should have NO wildlife.

━━━ DEDUP ━━━
Each entry must be a DIFFERENT structure type + camera angle combo. No two entries with the same perspective AND same structure.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
