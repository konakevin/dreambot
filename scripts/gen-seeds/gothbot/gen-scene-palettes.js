#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for GothBot — gothic color moods. Deep purple / crimson / midnight black / bone white / oxblood / velvet green / sickly chartreuse.

Each entry: 10-20 words. One specific gothic palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Deep-purple-and-black (eggplant-purple + oil-black + faint-silver)
- Crimson-and-shadow (blood-crimson + deep-shadow-black + bone-white accent)
- Midnight-black (oil-black + charcoal + cold-silver-accent)
- Bone-white-and-sepia (bone + faded-ivory + weathered-umber)
- Oxblood-and-gold (dried-blood-red + tarnished-gold + dark-brown)
- Velvet-green-dark (deep-forest + moss + black + candle-amber)
- Sickly-chartreuse (poisonous-yellow-green + black + dark-violet)
- Crimson-and-emerald (blood-red + deep-green + black)
- Amethyst-dark (deep-violet + silver + midnight-black)
- Gothic-autumn (rust-red + black + burnt-umber + faded-gold)
- Blood-moon-red (crimson-dominant + black shadow + silver touches)
- Ice-pallor (pale-blue + bone-white + deep-shadow-black)
- Funeral-palette (oil-black + bone + dried-rose)
- Cathedral-jewel (stained-glass blue + crimson + gold + black)
- Tim-Burton-muted (moss-grey + rust + faded-purple + off-white)
- Crimson-peak-romance (oxblood + cream + faded-rose + burnt-umber)
- Bloodborne-moody (charcoal + rust-red + mist-grey + amber-hint)
- Velvet-purple (royal-velvet-purple + black + gold-accent)
- Dark-academia (forest-green + burnt-umber + cream + black)
- Ghost-pale (pearl-white + mist-grey + faint-lavender)
- Occult-black-and-silver (black + silver + purple + ritual-red)
- Widow's-palette (black + dried-rose + cream + ivory)
- Plague-palette (yellow-sickly + grey-ash + crimson-scar)
- Autumn-goth (deep-burgundy + burnt-orange + charcoal + gold)
- Castlevania-film (crimson-velvet + oil-black + stained-glass + amber)
- Dark-mermaid (deep-teal + purple + silver-scale + shadow)
- Werewolf-shadow (slate-grey + black + amber-eye-glow + blue-mist)
- Nightshade (deep-violet + black-petal + poison-green + pale-silver)
- Stained-glass-spectrum (deep-blue + ruby + emerald + gold-lead)
- Moonstone-gothic (opal-pale + silver + black + faint-lavender)

━━━ RULES ━━━
- Gothic mood palettes
- 3-5 specific color words per entry
- Always dark-dominant with one accent color

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
