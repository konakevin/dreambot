#!/usr/bin/env node
/**
 * TOYBOX_SURFACE — real-surface anchor for the ToyBot toybox-chaos
 * vignette. The toys are interacting ON a real surface (hardwood floor /
 * carpet / counter / sandbox / etc.). Short single-sentence descriptions
 * that feel real, lived-in, and grounded. Short anchor — 15-25 words.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/toybox_surface.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURFACE entries for ToyBot's toybox-chaos path — the real lived-in surface that the chaos toys are interacting ON. Stop-motion-feeling, real, slightly worn, domestic or backyard. Each entry is ONE short single-sentence surface description. NO title-caps prefix — open directly with the surface noun.

━━━ THE BAR ━━━
Every entry is ONE real-feeling surface, specified with material + LOCATION CONTEXT (kitchen / bedroom / garage / backyard / etc.) + a small LIVED-IN DETAIL (worn / dusty / dimpled / stained / faded / scratched / sun-warmed / damp). Short — 15-25 words. Feels like a real domestic-or-outdoor surface you'd actually find toys on.

━━━ EXAMPLE PHRASINGS (mirror this register exactly — NO title prefix) ━━━
"Scratched hardwood floor near the living room baseboard heater, slightly dusty."
"Beige bedroom carpet with low pile, worn flat near the closet door."
"Smooth laminate kitchen counter beside the toaster and paper towel holder."
"Round kitchen table with a vinyl wipe-clean cloth still damp from lunch."
"Rough concrete garage floor with faint oil stains near the workbench leg."
"Flat wooden coffee table with a ring stain from a forgotten juice cup."
"Shallow plastic sandbox on the backyard lawn, sand still warm from afternoon sun."

━━━ VARIETY MANDATE (distribute across these surface categories) ━━━

INTERIOR FLOORS (~25%):
- ~3 HARDWOOD (scratched hardwood / polished hardwood / wide-plank pine / worn oak parquet / dark walnut / sun-faded floorboards)
- ~3 CARPET (beige low-pile carpet / shaggy living-room carpet / berber bedroom carpet / kid-room carpet with toy stains / worn-flat hallway carpet / faded rug-on-carpet)
- ~3 RUG (braided rag rug / oriental wool rug / sheepskin rug / cotton flatweave / faded shag rug / hooked rug worn at center / area rug with pet hair / colorful kids rug)
- ~2 TILE / LINOLEUM (cracked kitchen tile / checkerboard linoleum / cool stone bathroom tile / vinyl-plank flooring / faux-wood tile / mosaic-tile bathroom)

INTERIOR SURFACES (~25%):
- ~3 KITCHEN COUNTER / TABLE (laminate counter / granite counter / wooden farm-table / round breakfast-table / counter beside the sink / counter near the fruit bowl)
- ~3 COFFEE / SIDE TABLE (round coffee-table / glass-top coffee-table / rustic plank coffee-table / IKEA Lack table / wooden side-table with magazine pile / dark coffee-table with coaster)
- ~2 DESK / WORKBENCH (cluttered desk / scratched office-desk / kid's homework-desk / dad's workbench / dresser top / craft table)
- ~2 BED / DRESSER / SHELF (kid's bed comforter / bookshelf surface / dresser-top with framed photos / nightstand surface / closet shelf)

OUTDOOR / SEMI-OUTDOOR (~30%):
- ~3 BACKYARD (grass lawn patch / weedy lawn corner / mulched flower-bed / overgrown corner / shady lawn under tree / damp dewy morning lawn)
- ~3 PATIO / DECK (wooden deck boards / stone garden patio / concrete patio / paver-stone walkway / brick-paver patio / weathered porch)
- ~2 SANDBOX / SAND (plastic sandbox / dug sand-pit / damp morning sandbox / sandbox after the rain / sandbox with footprints / playground sand)
- ~3 DRIVEWAY / GARAGE (cracked driveway / oil-stained garage floor / cement carport / sun-cracked asphalt / muddy driveway edge / smooth garage-floor)
- ~2 GARDEN / DIRT (dirt path / mulched flower-bed / gravel border / pebble-edged garden path / sandy patch beside the rose bush)

PUBLIC / TRANSITIONAL (~10%):
- ~2 CARPETED ROOM (classroom carpet / library reading-rug / daycare play-mat / preschool carpet circle / nursery carpet)
- ~2 MISC (basement concrete / attic plywood / treehouse floor / camping tent-floor / picnic blanket / beach towel on sand)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- NO title-caps prefix — open directly with the surface noun.
- Single sentence, 15-25 words.
- ALWAYS specify MATERIAL or SURFACE TYPE.
- ALWAYS specify LOCATION CONTEXT (near baseboard heater / under the tree / beside the workbench / etc.).
- ALWAYS include a LIVED-IN DETAIL (slightly dusty / worn flat / faintly damp / oil-stained / sun-warmed / etc.).
- Tone: domestic, real, grounded, worn-in.

━━━ BANS ━━━
- NO toys / characters / scenarios on the surface — surface ONLY.
- NO photoreal language — natural domestic descriptive register.
- NO fantasy / fictional / supernatural surfaces.
- NO modern brand-name (no specific Lego / IKEA-named pieces).
- NO repeating exact same surface.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
