#!/usr/bin/env node
/**
 * GOTHBOT_GOTHIC_ARCHITECTURE_DETAIL — ornate architectural detail-porn
 * for the structure-as-hero gothic-architecture path. Rose-windows,
 * flying buttresses, spire-pinnacles, crockets, gargoyles, grotesques,
 * gutter-spouts, tracery. Picked 3× per render (pickN:3). Castlevania /
 * Bloodborne / Crimson-Peak / Berserk lineage.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_gothic_architecture_detail.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ARCHITECTURAL-DETAIL entries for GothBot's gothic-architecture path — ornate gothic detail-porn elements on the structure (the hero of the frame). Each entry is one rich descriptive sentence (18-30 words) naming ONE specific architectural detail + its carving/condition. Three are picked per render so each must stand alone.

━━━ THE BAR ━━━
Every entry: (1) names ONE specific gothic architectural element (rose-window, flying-buttress, spire-pinnacle, crocket, gargoyle, grotesque, gutter-spout, tracery, finial, oculus, cornice, gallery, transept-arch, quatrefoil, lancet-window, crenellation); (2) describes its CARVING / DETAIL (skeletal, thorned, leering, screaming, cursed); (3) names its CONDITION / WEATHERING (soot-stained, moss-encrusted, lichen, dried blood, split). Castlevania / Bloodborne / Crimson-Peak / Berserk painted register.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Rose-window tracery fractured into razor-petal lobes, stone veins stained black with centuries of soot and dried rain."
"Flying buttresses arcing outward like skeletal ribs, each pier capped with a leering stone face splitting at the seams."
"Spire-pinnacles bristling with crockets carved as curling thorns, silhouetted jagged against a blood-bruised sky at every tower crown."
"Gargoyle in full profile crouched at parapet edge, wings folded tight, jaw split wide, channeling black water from stone throat."
"Grotesques lining the cornice in a leering procession, each face unique in its anguish, mouths frozen mid-scream above the nave."

━━━ VARIETY MANDATE (distribute across these architectural families) ━━━
- ~4 ROSE-WINDOWS / OCULI / ROUND WINDOWS (tracery, stained glass remnants, lead came patterns)
- ~3 FLYING BUTTRESSES / RIB-ARCS / PIER-SUPPORTS (skeletal, arcing outward, capped with statuary)
- ~3 SPIRES / PINNACLES / FINIALS (crockets, curling-thorn finials, cross-topped, sky-piercing)
- ~3 GARGOYLES / GROTESQUES / WATER-SPOUTS (leering, screaming, jaw-split, drainage details)
- ~3 STATUARY / FRIEZES / RELIEFS (procession-of-saints, dance-of-death frieze, screaming-soul reliefs)
- ~2 LANCET WINDOWS / ARROW-SLITS / SLITS (narrow vertical windows, blood-light bleeding through)
- ~2 CORNICES / GALLERIES / ARCADES (cornice lined with grotesques, arcade gallery)
- ~2 CRENELLATIONS / PARAPETS / BATTLEMENTS (jagged crown, broken merlons)
- ~2 PORTAL / DOORWAY / TYMPANUM (carved tympanum, ornate iron-bound doors, demonic portal frame)
- ~2 BELL-TOWERS / OPEN BELFRY / CAMPANILE (skeletal bell-cage, fractured bell mouth)
- ~2 QUATREFOIL / TREFOIL / TRACERY PATTERNS (woven stone-lace, ornate window-mullion patterns)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 18-30 words per entry.
- ONE architectural element per entry — never two stacked.
- Carving + condition / weathering both present.
- Painted Castlevania / Bloodborne register — never modern photoreal architecture-textbook.

━━━ BANS ━━━
- NO interior elements (this is exterior architectural detail).
- NO modern building elements (no rebar, no concrete-cracking).
- NO inside-the-room language — this axis is on the structure's exterior.
- NO sky / atmosphere language — this axis is the building's carved detail.
- NO characters / figures — only stone-carved figures as decorative reliefs.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
