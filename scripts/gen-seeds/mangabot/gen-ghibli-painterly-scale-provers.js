#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_painterly_scale_provers.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} SCALE PROVER entries for a MangaBot ghibli-painterly keyframe. These are the architectural sub-elements (stairs / bridges / archways / windows) that PROVE the monumental anchor is MASSIVE by giving the viewer a relatable size reference. Without scale provers, the anchor reads as a model or miniature.

Each entry: 12-22 words. ONE specific architectural sub-element that adds scale + multi-tier depth + Ghibli-painterly detail.

SCALE-PROVER VARIETY (25 bespoke entries):
- 25% STAIRCASES (stone-step stair ascending to entrance / spiral stair climbing the spire / wooden plank-stair winding up tree-trunk)
- 20% BRIDGES (curved wooden footbridge / stone arch-bridge with handrail / suspended-rope bridge over chasm / hanging plank-bridge between towers)
- 15% ARCHWAYS / GATES (vermillion torii at base / massive carved stone arch / wooden gate with iron-banded panels / cathedral-arch portal)
- 15% WINDOWS / OPENINGS (cathedral-glass window with iron tracery / row of arched openings on multiple stories / dome-skylight oculus)
- 10% COLONNADES / PILLAR-ROWS (row of carved stone columns / lacquered wooden pillars supporting eaves / cathedral nave colonnade)
- 10% TERRACES / BALCONIES (cascading terraces of garden / royal balcony jutting from spire / wooden veranda wrapping a tier)
- 5% TINY DOORS / WINDOWS revealing tiny interior figures lit warm

DO write:
- A stone-step stair ascending in switchbacks to the cathedral entrance, dwarfed by the spire above
- A curved wooden footbridge spanning the chasm between two floating islets, sagging slightly mid-span
- A vermillion torii gate at the base of the steps, head-height when seen against the towering pagoda behind
- Rows of arched cathedral windows on three stories, each one bigger than a house, with iron tracery
- A colonnade of lacquered wooden pillars supporting deep wooden eaves, each pillar twenty feet thick
- Cascading garden terraces stepping down from the spire, ivy and waterfall trailing over the parapets
- A spiral plank-stair winding up the massive cedar trunk, each turn revealing a tiny lantern-lit doorway
- Tiny warm-lit windows scattered across the floating fortress like fireflies, giving the eye a size reference

DO NOT write:
- Hero-character close-up
- The monumental anchor itself (separate axis)
- Modern western architecture
- Empty plate
- Tiny element that doesn't prove scale (e.g. a single flower)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
