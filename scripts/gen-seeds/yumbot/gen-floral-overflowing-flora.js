#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/floral_overflowing_flora.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing \${n} OVERFLOWING FLORA elements for YumBot floral-garden-cup. Each is one specific oversized flower / sprig / floral piece that BURSTS UP AND OUT of the kawaii vessel as a magical bouquet. Template picks 4 per render to form the multi-bloom bouquet.

Each entry: 12-22 words. ONE specific flora piece.

━━━ REFERENCE — bex.ai ━━━

The bouquet is OVERSIZED — bigger than the vessel itself. Mix of pastel sphere-flowers (dahlias / peonies / hydrangeas), cherry-blossom sprigs, sphere-floral-puffs, ornamental pearls, fluffy flower-balls, sometimes whimsical additions like cinnamon-sticks or floating-petals. Hand-painted oil-gouache texture on the petals. Pop-Mart-illustration fusion.

━━━ DISTRIBUTION ━━━

- 25% SPHERE-FLOWERS (giant pastel-pink dahlia-bloom with rolled petals / pearl-cream peony-sphere with overlapping ruffles / lavender hydrangea-cluster with hundreds of tiny pastel petals / blush-pink chrysanthemum-globe with fluffy curling petals)
- 20% CHERRY-BLOSSOM SPRIGS (cherry-blossom branch with five pink blooms cascading / sprig of cherry-blossom with closed-bud and opening-flower / pastel-pink cherry-blossom branch arching upward / cherry-blossom-mini-bouquet bursting out)
- 15% FLUFFY FLORAL-BALLS (fluffy pastel pom-pom dahlia / billowy cotton-pink chrysanthemum-ball / pearl-iridescent floral-puff sphere / soft pastel-mint moss-ball / fluffy cream baby's-breath cluster)
- 10% TINY-FLOWER CLUSTER (cluster of small pastel-yellow daisies / sprig of soft pastel-lavender violets / cluster of mini pastel-pink rose-buds / scatter of small pearl-white star-flowers)
- 10% TRAILING / VINE (trailing pastel-pink wisteria vine cascading downward / hanging-bell sprig of pastel-flowers / curling pastel-tendril vine with tiny blooms)
- 5% PEARL / GEM-ACCENT (string of giant pearl-beads woven into the bouquet / cluster of pastel-pearl-orbs nestled among flowers / iridescent floating-pearl strand)
- 5% LEAFY ACCENT (sprig of pastel-mint leaves / curly fern-frond unfurling / gentle silver-leaf sprig / pastel-blue eucalyptus)
- 5% WHIMSICAL ACCENT (cinnamon-stick poking out / pearl-tipped pin / pastel-ribbon trailing / sprinkle of edible glitter falling)
- 5% FRUIT-ACCENT (cluster of pastel-pink raspberries / blueberry-cluster nestled in flowers / pearl-strawberry tucked among blooms)

━━━ HARD MANDATES ━━━

- OVERSIZED relative to a normal flower — these are giant magical-sized
- Hand-painted oil-gouache texture on petals (visible brushstroke / illustration fusion)
- Pastel palette
- Visible ATTENTION to detail — never generic

━━━ HARD BANS ━━━

- NO creatures / animals / humans
- NO whole-bouquet descriptions — ONE piece per entry
- NO vessel description (other pool)
- NO scary / dark florals

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
