#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/sea_colors.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SEA COLOR descriptions for BeachBot — specific sea-color states.

Each entry: 6-14 words. One specific sea-color state.

━━━ CATEGORIES ━━━
- Crystal-turquoise with visible sand-bottom
- Deep-cobalt-blue open-ocean
- Pale-aquamarine tropical-shallow
- Emerald-green-over-kelp
- Steel-grey under storm-clouds
- Sapphire-blue calm-deep
- Translucent-jade near-reef
- Pearl-silver moonlit
- Rose-gold sunset-reflection
- Fiery-orange at sunset
- Lavender-pink dawn
- Turquoise-teal Bahamian
- Cyan-electric tropical
- Deep-navy-blue Mediterranean
- Aqua-crystal Caribbean
- Misty-grey North-Atlantic
- Milky-aqua glacial-runoff
- Black-glassy volcanic-water
- Green-murky tropical-estuary
- Bottle-green Cornish
- Sapphire-cobalt Greek-Aegean
- Cerulean-azure Mediterranean
- Aqua-blue Pacific
- Teal-gradient Great-Barrier
- Slate-blue stormy
- Mirror-silver calm
- Molten-gold sunset
- Deep-turquoise Maldives
- Pale-mint Seychelles
- Ice-blue arctic
- Deep-violet twilight
- Rainbow-refraction waves
- Muddy-brown river-mouth
- Emerald-glass Curaçao
- Cloudy-teal reef-break
- Moss-green kelp-rich
- Amber-brown kelp-dense
- Pink-tinted coral-sand-reflected

━━━ RULES ━━━
- Named sea-colors
- Brief + evocative
- Real sea-states

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
