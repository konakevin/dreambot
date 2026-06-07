#!/usr/bin/env node
/**
 * CLAYMATION story-beat pool — bespoke per-path (2026-06-06).
 * Verb-led, multi-figure, shared-object/event structure.
 * MVP-25 first per [[feedback_always_seed_25_to_test_then_scale]].
 */
const { generatePool } = require('../../lib/seedGenHelper');
const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/claymation_story_beats.json',
  total: TOTAL, batch: Math.min(TOTAL, 25), append: APPEND,
  metaPrompt: (n) => `You are writing ${n} CLAYMATION STORY-MOMENT scenarios for ToyBot's claymation path. The characters are stop-motion Plasticine CLAY puppets (Aardman / Laika / Coraline / Wallace-Gromit DNA) — visible thumbprints, paint-strokes, slightly-asymmetric hand-sculpted features, painted glossy-enamel irises, armature-supported bodies. Everything in frame is clay (clay world, clay props, clay creatures). Drama comes from the situation.

━━━ STRUCTURAL MANDATE (every entry, NON-NEGOTIABLE) ━━━
1. OPEN with an active verb (Hauling / Chasing / Building / Toppling / Dragging / Sneaking / Rolling / Lifting / Stuffing / Sliding / Discovering / Sculpting / Repairing / Stealing / Wrestling / Smashing / Mixing).
2. Name ONE shared object/event 3-5 clay characters are reacting to (a tipping clay cake / a melting clay candle / a runaway clay pig / a misfired clay invention / an arriving stranger / a discovered map).
3. HARD BAN: "X mid-Y", "X frozen mid-Y", "X watching", "X looking at", "X gazing", "X stands", "X posed", any opener that isn't a verb.
4. Present-tense-active throughout. 3-5 named cast roles, each doing a DIFFERENT verb.

━━━ FORMAT ━━━
60-90 words, semicolon-separated phrases. Cast roles: clay-baker / clay-tinkerer / clay-shopkeeper / clay-detective / clay-rabbit / clay-sheep / clay-grandma / clay-postman / clay-witch / clay-villager. Stop-motion-set context.

━━━ FAMILY SPLIT (~50/50) ━━━
A) COZY VILLAGE MISHAP — domestic claymation comedy (kitchen mishap / shop chaos / workshop disaster / village squabble). Aardman-cozy register.
B) ADVENTURE/MYSTERY BEAT — Coraline-eerie / Wallace-Gromit-invention / Laika-quest register. Claymation-with-edge.

━━━ PASS EXAMPLES ━━━
- "Chasing the runaway clay pig across the village square as it knocks over a market-stall of clay turnips — the clay-baker drops his clay-bread tray and lunges, two clay-shopkeepers leap aside as the turnips bounce, the clay-grandma swings a clay-rolling-pin trying to corral, the pig veers around the well as the postman crashes his bicycle into a haystack scattering clay-feathers"
- "Sculpting frantically as a clay-witch hammers on the workshop door demanding the cursed clay-mask back — the clay-tinkerer crams clay into the mask's eye-socket racing the clock, his clay-apprentice braces both hands against the door bracing for impact, the clay-cat arches its back hissing from the workbench, the clay-window shows the witch's distorted shadow growing, a half-finished clay-skeleton on the bench rattles from the pounding"

━━━ FAIL EXAMPLES (do NOT write these) ━━━
- "Clay baker mid-knead frozen in the kitchen…" ← noun opener + pose language
- "The villagers watch as the pig escapes…" ← reaction-only

━━━ HARD BANS ━━━
- NO real animals, NO real humans, NO CGI register, NO illustration register
- NO IP names (no Wallace, no Gromit, no Coraline) — generic clay archetypes
- NO solo figures — 3+ cast minimum

JSON array of ${n} strings. No preamble. Every opener a verb.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
