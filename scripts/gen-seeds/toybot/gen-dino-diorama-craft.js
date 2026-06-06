#!/usr/bin/env node
/**
 * DINO_DIORAMA_CRAFT — handmade claymation craft DETAIL that sells
 * the stop-motion / Aardman / Laika diorama charm. Fingerprints,
 * tool-grooves, hand-rolled clay pebbles, felt scraps, pipe-cleaner
 * branches, exposed armature wire, cotton-wool smoke, corduroy-pressed
 * ridges, toothpick saplings — visible craft tells.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dino_diorama_craft.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} HANDMADE CLAYMATION CRAFT entries for ToyBot dino-diorama — visible craft TELLS that prove the world is sculpted clay + mixed-media hobbyist diorama, NOT photoreal nature. Each entry is one short clause, 18-30 words, naming 2-3 specific craft details.

━━━ THE BAR ━━━
Every entry names SPECIFIC handcraft details — visible fingerprints, sculpting-tool grooves, hand-rolled clay pebbles, pipe-cleaner branch armatures, cotton-wool smoke, torn felt leaves, corduroy fabric pressed for ridge texture, toothpick saplings, exposed armature wire, button eyes, glued seed-bead gravel, dry-brushed paint over clay. These are the construction "tells" that show the diorama is HANDMADE.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"Visible thumbprint hollows pressed into clay hillsides, sculpting-tool grooves tracing each rocky ledge, matte earth tones contrasting glossy lacquered boulders."
"Hand-rolled clay pebbles scattered unevenly, each showing faint fingerprint ridges, seed beads nestled between them for tiny gravel texture."
"Pipe-cleaner branches twisted at irregular angles, wrapped in torn felt strips for bark texture, tiny clay buds pinched at each tip."
"Cotton-wool tufts teased into wispy smoke trails, lightly dusted with grey chalk powder, anchored by thin armature wire beneath the surface."
"Armature wire coiling visibly from a crumbling clay cliff face, rust-coloured clay pressed loosely around it, intentionally rough and unfinished looking."

━━━ VARIETY MANDATE (distribute across these craft tells) ━━━
- ~3 CLAY FINGERPRINTS / TOOL GROOVES (thumb-pressed, tool-carved, knife-grooved, finger-smoothed)
- ~3 HAND-ROLLED CLAY DETAIL (rolled pebbles, pinched buds, rolled snake-strands, coiled spirals, pressed shapes)
- ~2 PIPE-CLEANER BRANCHES / ARMATURE (twisted wire trunks, exposed armature, wire skeletons)
- ~2 COTTON-WOOL SMOKE / STEAM (teased tufts, fluffed clouds, fiberfill steam)
- ~2 FELT / FABRIC SCRAPS (torn felt leaves, fabric foliage, sewn moss patches)
- ~2 TOOTHPICK / WOODEN ARMATURE (toothpick saplings, balsa scaffolding, wooden stakes)
- ~2 CORDUROY / TEXTURED PRESS (corduroy-pressed ridges, fabric-impressed texture)
- ~1 DRY-BRUSHED PAINT (dry-brushed earth tones, brushed ochre highlights, weathered wash)
- ~1 GLUED SEED-BEADS / SAND / GRIT (seed-bead gravel, scattered sand, glitter)
- ~1 BUTTON / GOOGLY EYES / BEAD DETAILS (button-eye accents, glass-bead dewdrops, sequin scales)
- ~1 GLOSSY-CLAY WATER / LACQUERED FINISH (lacquered river surface, varnished pool, gloss-finish details)
- ~1 BAKING-SODA SNOW / FLOUR DUST / PASTE TEXTURE (baking-soda frost, flour dusting, paste cracks)
- ~1 LEFT-INTENTIONALLY-ROUGH (deliberate seams, visible imperfections, unfinished edges, drying cracks)
- ~1 LAYERED PAPER / CARDBOARD (cardboard cutout silhouettes, paper backdrops, layered cardstock)

━━━ BANS ━━━
- NO living dinosaurs / nature documentary language — this is CRAFT-detail only.
- NO smooth digital-CG appearance — visible imperfection is the point.
- NO bare "handcrafted look" without naming a specific material/technique.
- NO repeating the same exact technique across entries — distribute variety.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
