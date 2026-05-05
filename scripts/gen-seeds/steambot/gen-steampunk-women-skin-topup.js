#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_women_skin.json',
  total: 150,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} ADDITIONAL STEAMPUNK WOMAN SKIN descriptions for SteamBot's sexy-steampunk-woman path. The existing pool is heavy on European/Mediterranean/Black skin tones — these new entries MUST fill the missing ethnic representations.

Each entry: 12-22 words. ONE specific skin description with steampunk-light interaction.

━━━ MANDATORY DISTRIBUTION (across these 50 NEW entries) ━━━
- ~10 East Asian (Chinese, Japanese, Korean, Vietnamese, Thai) — porcelain to wheat to amber tones
- ~8 South Asian (Indian, Pakistani, Sri Lankan, Bangladeshi) — warm wheat to deep brown
- ~8 Middle Eastern / Arab / Persian / Levantine — olive to caramel to bronze
- ~8 Latin / Hispanic / Mestizo — caramel to terracotta to cinnamon
- ~6 Indigenous / Native American / Pacific Islander — copper to russet to bronze
- ~5 African — ebony to deep mahogany to coffee with red undertones
- ~5 Mixed / multi-heritage — undefined-warm-glow tones

━━━ EACH ENTRY MUST INCLUDE ━━━
- Ethnic specificity (clearly identifiable as the named region)
- Specific tone description (not generic "tan" or "brown" — be precise)
- Steampunk-light interaction: how brass-light / gaslight / forge-light / verdigris / amber lamp hits her skin
- Texture detail: pores, freckles, sun-weathering, scars, faint birthmarks, fine lines

━━━ HARD BANS ━━━
- NO repeating Mediterranean / European / generic-Black entries (those are already in the existing 100)
- NO sexualizing language / NO objectifying skin descriptions
- NO age description (just skin tone + texture + light)

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Korean porcelain skin with cool undertone, brass lamplight giving warm rose to apple of cheek, tiny mole below left eye"
- "Wheat-honey Persian complexion with green undertone, gaslamp catching gold across high cheekbones, faint freckle constellation across nose"
- "Caramel Mexican mestiza skin with warm red undertone, forge-light bronzing forehead, healed scar near right brow"
- "Copper Navajo skin with deep golden undertone, verdigris lamplight giving green-gold sheen to throat hollow"
- "Deep ebony Senegalese skin with warm-red undertone, brass gaslamp making cheekbone glow like polished walnut"
- "Bronze Polynesian skin with warm gold undertone, lantern-glow catching scar at jawline from old burn"
- "Cool jade Vietnamese complexion with neutral undertone, copper-light skating across nose-bridge, fine wisp of hair on temple"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
