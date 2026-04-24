#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/beachbot/seeds/epic_sunset_scenes.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} EPIC SUNSET scene descriptions for BeachBot's epic-sunset path. Each entry describes a once-in-a-lifetime, jaw-dropping tropical sunset — the kind that makes everyone on the beach stop and stare. Every sunset is DIFFERENT — different color palettes, different cloud formations, different intensities, different moods.

Each entry: 25-40 words. One specific epic sunset with color palette, cloud type, and tropical beach setting.

━━━ THE CONCEPT ━━━
The most DRAMATIC, STRIKING, IMPOSSIBLE sunsets you've ever seen. Not a generic pretty sunset — a HOLY SHIT sunset. The kind people post on social media and nobody believes is real. Every entry should make the viewer's jaw drop. Set against gorgeous tropical beaches, coastlines, palms, volcanic landscapes.

━━━ COLOR PALETTES (distribute evenly — THIS is the dedup dimension) ━━━

FIRE/RED/ORANGE (~20%):
- Blazing crimson and deep orange, sky looks like it's literally on fire
- Molten red horizon bleeding into dark orange, silhouetted palms black against inferno
- Scarlet clouds stacked in layers, deep vermillion light on everything

WARM AMBER/GOLDEN (~15%):
- Rich honey-amber flooding everything, golden hour cranked to impossible warmth
- Deep gold and warm copper tones, entire sky molten amber, sand glowing
- Burnished bronze light, warm butterscotch clouds, everything bathed in liquid gold

PINK/MAGENTA/PURPLE (~20%):
- Electric hot pink clouds against deep purple sky, vivid and surreal
- Soft rose and magenta gradients, cotton candy clouds, gentle but intense
- Bright fuchsia streaks across lavender sky, shocking pink reflections on water

BLUE/PURPLE/INDIGO (~15%):
- Deep blue-purple twilight moment, last orange glow at horizon under indigo dome
- Cobalt and violet clouds with thin bright orange line at horizon
- Dusky purple-blue with hints of rose, stars beginning to appear

STORMY/GREEN-TINTED (~10%):
- Storm clouds creating eerie green-yellow light, dramatic and ominous beauty
- Water vapor and mist creating greenish haze, sun filtering through rain curtains
- Dark clouds breaking with acid-green and amber light, volcanic haze tinting everything

MULTI-COLOR EXPLOSION (~20%):
- Every color at once — orange base, pink middle, purple top, gold edges
- Impossible gradient cycling through peach, coral, magenta, violet, indigo
- Stratified sky — warm orange near horizon, hot pink middle, deep blue above

━━━ CLOUD FORMATIONS (vary — clouds MAKE the sunset) ━━━
- Towering cumulus lit from below, glowing like lanterns
- Thin cirrus streaks painted across the sky in parallel bands
- Broken cloud deck with light bursting through gaps
- Dramatic lenticular clouds, alien-shaped, intensely colored
- Low fog/mist layer creating layered effect at horizon
- Massive anvil cloud catching last light, edges blazing
- Scattered popcorn clouds each lit individually
- Clean horizon with no clouds — pure gradient sky

━━━ TROPICAL SETTINGS (always gorgeous, vary across entries) ━━━
- Palm-lined beach with silhouetted trees
- Rocky volcanic coastline with tide pools reflecting the sky
- Calm lagoon creating perfect mirror reflection of entire sunset
- Beach with anchored boats silhouetted against the sky
- Cliff-top vista overlooking wide bay
- Through palm fronds framing the sunset
- Island silhouettes on the horizon
- Wide open beach, nothing but sand and sky

━━━ NO PEOPLE ━━━
No humans, couples, silhouettes of people. Empty paradise — only the sunset, the beach, and the sky. Objects OK (boats, hammocks, tiki torches, surfboards).

━━━ DEDUP ━━━
Each entry must feature a DIFFERENT color palette + cloud formation + setting combo. No two entries with the same dominant color at the same location type.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
