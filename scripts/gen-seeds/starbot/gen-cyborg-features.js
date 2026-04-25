#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cyborg_features.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} DOMINANT CYBORG FEATURE descriptions for StarBot's cyborg-woman path. Each describes one showpiece mechanical body element that dominates 40-50% of the visible frame — the thing your eye goes to first.

Each entry: 15-25 words. One specific mechanical feature with material, texture, and visual detail.

━━━ CATEGORIES (spread across all) ━━━
- Fully chrome arm with exposed hydraulic pistons, articulated servo fingers, visible actuators
- Transparent acrylic forearm showing platinum skeletal structure and glowing fluid-filled pistons
- Segmented chrome spine visible through transparent dorsal plate, each vertebra a separate unit
- Chrome rib cage as open latticework, power core visible between gaps like a caged star
- Biomechanical leg from hip to ankle, every hinge joint and shock absorber exposed
- Translucent torso panel revealing spinning gyroscopes and stellar-map projections
- Chrome shoulder ball-joints with exposed hydraulic mechanisms, heat-dissipation fins
- Segmented chrome neck with visible actuators allowing inhuman rotation range
- One arm fully organic, the other entirely chrome — the asymmetry is the statement
- Carbon-fiber plating with glowing seam-lines revealing fiber-optic nerve bundles beneath
- Chrome jawbone visible where organic flesh ends in precise architectural lines
- Transparent skull section revealing circuit mesh and quantum processors
- Mechanical ear housings with visible brass resonance chambers and tiny LEDs
- Rose-gold chrome limbs with golden hydraulic fluid visible through transparent sections
- Battle-damaged chrome plating with carbon scoring, rebuilt sections in mismatched alloys

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: body region (arm/leg/torso/spine/head/neck) + material (chrome/acrylic/carbon-fiber/brass/organic-hybrid) + condition (pristine/worn/battle-damaged/ornate)

━━━ RULES ━━━
- Each should be visually DISTINCT — not just "chrome arm" variations
- Material variety: chrome, titanium, brass, carbon fiber, acrylic, ceramic, obsidian glass, copper, rose-gold
- These are ORNATE and BEAUTIFUL, not industrial — think museum-piece engineering
- Include texture cues: polished, brushed, etched, filigree, corroded, iridescent

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
