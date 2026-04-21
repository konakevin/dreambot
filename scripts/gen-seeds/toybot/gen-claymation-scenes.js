#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/claymation_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} CLAYMATION SCENE descriptions for ToyBot's claymation path — stop-motion clay scenes with clay-characters. Wallace-Gromit / Coraline / Laika / Play-Doh energy. Clay fingerprints + paint-strokes visible.

Each entry: 15-30 words. One specific claymation scene with clay-characters in action.

━━━ CATEGORIES ━━━
- Wallace-Gromit-style domestic (cheese-eating clay-man at kitchen)
- Coraline-eerie (clay-girl in button-eye world)
- Kubo-whimsical (clay-boy with shamisen)
- Play-Doh vivid (bright-primary clay children)
- Clay-villain laugh (villainous clay-figure dramatic)
- Claymation forest walk (clay-adventurer + clay-trees)
- Claymation pirate ship (clay-captain at clay-wheel)
- Claymation castle tea-party (clay-princess + clay-dragon)
- Claymation space-walk (clay-astronaut mid-float)
- Claymation chase (clay-thief + clay-guard)
- Claymation carnival (clay-circus-master + clay-elephant)
- Claymation circus-tent high-dive
- Claymation kitchen-soup-pot bubbling
- Claymation barn-animals harvest
- Claymation wedding ceremony
- Claymation school-classroom
- Claymation jungle-explorer with map
- Claymation underwater-scene clay-fish
- Claymation detective-investigation scene
- Claymation aircraft cockpit
- Claymation mad-scientist lab
- Claymation monster-truck rally
- Claymation firefighter ladder-rescue
- Claymation concert-stage performance
- Claymation tea-party formal
- Claymation magician-disappearing
- Claymation athletic race finish
- Claymation picnic-basket opened
- Claymation snow-sledding
- Claymation beach-surf
- Claymation farmer's market
- Claymation train-conductor punches ticket
- Claymation sleigh-ride winter

━━━ RULES ━━━
- Clay-everything (characters + set)
- Thumbprints / paint-strokes / subtle imperfections visible
- Claymation-stop-motion aesthetic
- Cinematic storytelling

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
