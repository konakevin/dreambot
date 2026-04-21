#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glowbot/seeds/architectural_elements.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ARCHITECTURAL ELEMENT descriptions for GlowBot scenes — structures/features that appear in luminous scenes to anchor composition. Always peaceful + ornate.

Each entry: 10-20 words. One architectural element + how it integrates with light.

━━━ CATEGORIES ━━━
- Temples / pagodas (overgrown with moss, light-drenched, moonlit)
- Arches / gates (glowing stone archways, vine-covered, dawn-illuminated)
- Bridges (stone bridge over glowing creek, wooden bridge in forest with light-shafts, elvish bridge of crystal)
- Staircases (ascending into light, stone steps lit by lanterns, spiral stairs in ethereal scene)
- Portals (archway glowing with inner light, doorway to ethereal realm)
- Fountain / reflecting pools (stone fountain with glowing water, still pool reflecting divine light)
- Towers / spires (ancient tower with beacon of light, crystal spire catching sun)
- Stone circles / megaliths (standing stones at sunrise, Stonehenge-inspired lit by dawn)
- Shrines / altars (mossy shrine with lanterns, stone altar with candle glow)
- Ruins (overgrown ruins with light pouring through broken roof, peaceful temple ruins with moss + light)
- Tree houses / tree-architecture (Elven-tree-dwelling, treehouse glowing warm in forest)
- Observation platforms (cliff-edge platform with light-pouring-down from sky)
- Courtyards (ancient courtyard with light filtering through)
- Cathedrals (stained-glass chamber with divine rainbow light)
- Pagoda / temple bells (hanging bells with morning mist)
- Wishing wells (stone well with soft glowing water)
- Gazebos (wooden gazebo with lantern-hung peaceful evening)
- Stepping stones (across glowing water, peaceful path)
- Bells / wind-chimes (hanging with soft light-catching)

━━━ RULES ━━━
- All peaceful + ornate + light-integrated
- Complements rather than dominates (light is still hero)
- Never menacing / aggressive / modern-cold

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
