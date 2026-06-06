#!/usr/bin/env node
/**
 * GOTHBOT_COZY_GOTH_INTERIOR_SPACE — the warm-dark gothic interior that
 * is the hero of cozy-goth renders. Witch's apothecary / candlelit
 * library / scrying chamber / alchemy laboratory / curio-cabinet
 * wonder-room / gothic study. LAYERED with foreground / mid / deep,
 * obsessive props. Crimson Peak / Pan's Labyrinth / Practical Magic /
 * Hocus Pocus / 19th-c curio engraving register.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_cozy_goth_interior_space.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} INTERIOR-SPACE entries for GothBot's cozy-goth path — the warm-dark gothic room that is the hero of the render. Each entry is one rich multi-clause sentence (50-90 words) describing the room with FOREGROUND / MID-FRAME / DEEP-FRAME layered props. Witch's apothecary / candlelit library / scrying chamber / alchemy lab / curio-cabinet wonder-room / gothic study.

━━━ THE BAR ━━━
Every entry: (1) names ONE specific INTERIOR TYPE (witch's apothecary corner, candlelit gothic library, scrying-chamber alcove, alchemy laboratory shelf, curio-cabinet wonder-room, gothic study, occult parlor, dark-academy reading nook, mourning-parlor, séance chamber); (2) builds THREE depth layers — foreground prop closest to viewer, mid-frame, deeper detail — each with its own specific gothic objects; (3) the room reads warm-dark + intimately layered + obsessively detail-packed. Crimson Peak / Pan's Labyrinth / Practical Magic / Hocus Pocus / 19th-c curio engraving register.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Witch's apothecary corner — foreground brass scale tilted under amber candlelight, mortar dusted with dried chamomile; mid-shelf rows of hand-labeled cork-stopped jars dense as a library wall; deeper alcove glows with a single witch-fire flame above the hearth, pots and dried herbs hanging in silhouette."
"Candlelit gothic library — oil-lamp pools amber over an ornate mahogany writing-desk cluttered with open ledgers and a wax-sealed inkwell; mid-frame towering dark-oak bookcases press leather-bound spines floor-to-ceiling; deep arch frames a velvet wing-chair half-swallowed in shadow beside a smoldering fireplace."
"Scrying-chamber alcove — foreground velvet-draped table holds a fogged crystal orb ringed by dripping taper candles; scattered tarot cards curl at table-edge; mid-ground a brass astrolabe and pendulum hang from carved oak ceiling beams; deeper darkness conceals a tarnished mirror in an obsidian frame, reflecting nothing."
"Alchemy laboratory shelf — close frame on a stone-slab workbench where a copper alembic crouches beside coiled glass tubing catching oil-lamp warmth; mid-ground a cluttered rack holds brass retorts and jars of pigment; deeper shadow contains shelves of leather-bound treatises, a snuffed forge glowing faintly orange beneath."
"Curio-cabinet wonder-room — foreground glass case lit by a single oil-lamp holds a small articulated fox skull beside a nautilus shell; mid-ground shelves display taxidermied beetles under bell-jars and pinned moths in shadow-boxes; deeper darkness reveals a wall of obscure scientific instruments and a carved oak desk strewn with vellum sketches."

━━━ VARIETY MANDATE (distribute across these interior families) ━━━
- ~3 WITCH'S APOTHECARY / HERBALIST CORNER (mortar/pestle, hanging herbs, labeled jars, brass scale)
- ~3 CANDLELIT GOTHIC LIBRARY (towering bookcases, writing-desk, leather volumes, wax-sealed letters)
- ~3 SCRYING / DIVINATION CHAMBER (crystal orb, tarot, astrolabe, pendulum, dark mirror)
- ~3 ALCHEMY LABORATORY / WORKSHOP (alembics, retorts, copper tubing, jars of pigment, snuffed forge)
- ~2 CURIO-CABINET / WONDER-ROOM (taxidermy, fossils, articulated skulls, pinned insects, oddities)
- ~2 GOTHIC STUDY / WRITER'S RETREAT (desk by fireplace, ink and quill, manuscripts, raven on perch)
- ~2 MOURNING-PARLOR / SÉANCE ROOM (heavy black drapes, photographs of the dead, hair-jewelry, oil-portraits)
- ~2 OCCULT PARLOR / SECRET-SOCIETY CHAMBER (sigil-floor, sigil-tapestries, ritual brazier, secret bookshelf)
- ~1 DARK-ACADEMY READING NOOK (leaded windows, plum velvet armchairs, fireplace, stacked tomes)
- ~1 GOTHIC GREENHOUSE / CONSERVATORY INTERIOR (carnivorous plants, twisted vines, gas-lamp light)
- ~1 GOTHIC MUSIC ROOM / SOLITUDE PARLOR (cabinet pipe-organ, violin on stand, sheet music in disarray)
- ~1 GOTHIC TEAROOM / OCCULTIST'S READING NOOK (chipped porcelain tea, tarot beside teapot, ravens at window)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 50-90 words per entry — long enough to layer three depth-tiers.
- ONE single multi-clause sentence using semicolons to chain foreground / mid / deep layers (mirror the examples above).
- MUST contain foreground + mid + deep specifics.
- Warm-dark register — amber light pools, deep shadow, layered props.

━━━ BANS ━━━
- NO outdoor / exterior — INTERIOR only.
- NO modern / electric / LED.
- NO characters — the room is the hero (cozy-goth has a separate figure-accent pool for the scale-prover figure).
- NO Halloween-cheese (no plastic skulls, no rubber spiders).
- NO sterile / minimal / Scandinavian-clean — this register is OBSESSIVELY layered.
- NO photographic register ("backlit", "HDR", "tack-sharp").

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
