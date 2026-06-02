#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_hair.json',
  total: 100,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} VAMPIRE HAIR descriptions for GothBot's vampire-girls-2 path. Each entry is ONE complete hair description — color + cut/style + texture/state + headpiece (when relevant). Each entry: 10-20 words, comma-separated phrases.

━━━ WHAT MAKES A GOOD ENTRY ━━━
- A specific COLOR (not just "black" — black with a silver streak, blood-red dyed, raven-with-violet-undertones, snow-white with shadowed roots, etc.)
- A specific CUT or STYLE (not just "long" — shaved temple with long top, asymmetric undercut, razor-cropped above shoulders, bound in war-braids)
- A specific STATE (sleek and glossy, soaked-wet plastered, wind-tossed, perfectly oiled, ratted and feral)
- WHEN RELEVANT, a headpiece (mantilla, raven-feather headdress, pearl-strung braid crown, antique tiara, mourning veil, ribbon-strung)

━━━ MANDATORY HAIR COLOR SPREAD (across all ${n} entries) ━━━
Previous gen was 64% black/raven and only 4% blonde. CORRECT THE BIAS — wide hair-color variety is the goal. Distribute the color of EACH entry across these buckets:

- BLACK family (~15 entries, 15%): jet-black, raven, midnight-black, inky-black, blue-black — many with a TWIST (silver streak / violet undertones / rust-red streaks / electric-blue tips)
- BROWN family (~15 entries, 15%): chocolate-brown, chestnut-brown, espresso, mahogany, honey-brown, hazel-brown, dark-cocoa, walnut
- BLONDE family (~12 entries, 12%): platinum-blonde, ash-blonde, honey-blonde, golden-blonde, strawberry-blonde, butter-blonde, ash-grey-blonde
- WHITE/SILVER family (~12 entries, 12%): snow-white, silver-white, pearl-white, moonlight-grey, ash-silver, chrome-silver, frost-white
- RED/AUBURN/ORANGE family (~12 entries, 12%): deep-auburn, copper-red, fire-red, rust-red, burgundy, crimson, fox-red, sunset-orange, marmalade, ginger
- PURPLE/VIOLET family (~10 entries, 10%): deep-amethyst, royal-violet, plum, lavender-grey, dark-aubergine, electric-violet, midnight-violet
- GREEN family (~8 entries, 8%): forest-green, moss-green, jade-green, witch-fire-green, deep-emerald, dark-teal, poison-green
- BLUE family (~8 entries, 8%): midnight-blue, navy-blue, sapphire, electric-blue, ocean-blue, deep-cobalt
- MULTI-TONE / HIGHLIGHTS (~8 entries, 8%): silver-with-black-roots, blonde-with-violet-tips, brown-with-silver-streak, black-with-crimson-underlayer, blonde-with-pink-highlights, brown-ombre-into-blonde, silver-streaked-through-black

ENFORCE the spread — do NOT default to black. If you find yourself writing black/raven for more than 2 entries in a row, switch colors. Cycle through the families.

━━━ HAIR ARCHETYPES (mix across the colors above) ━━━

LONG flowing (waist+ length, loose / over-shoulder / cascade):
- example: cascading platinum-blonde waves swept over one shoulder, threaded with seed-pearl strands
- example: chestnut-brown curls falling past the hips, sleek and oiled, parted severely down the center
- example: deep-auburn loose curls flowing wild past the waist, single dark-rose pinned behind one ear

ARISTOCRATIC UPDOS (chignon / Belle Époque / Regency):
- example: honey-blonde hair pulled into a severe high chignon pinned with a jet-and-silver hairpin
- example: snow-white braid crown coiled across the top of the head, threaded with antique pearls
- example: powdered-grey wig in tight ringlets pinned high — Regency court style
- example: chocolate-brown puffed updo with a single black orchid at the temple

UNCONVENTIONAL CUTS (shaved temple / asymmetric / cropped):
- example: copper-red shaved at one temple, long curtain falling across the other side
- example: platinum-blonde razor-jagged crop just below the jaw with ash-grey roots
- example: blood-red dyed asymmetric undercut, the long side falling past the shoulder
- example: bone-pale white bob with severe blunt fringe — 1920s flapper into vampire

DRY / FERAL / FRESH-RISEN:
- example: wind-tossed honey-blonde hair tangled across half her face
- example: soaked-wet ash-blonde plastered to her skull, water beading at the tips
- example: ratted-feral burgundy mane with twigs caught in the strands
- example: storm-tangled silver-white mane with a single feather

VEILED / RITUAL (mantilla / mourning veil / hood):
- example: brown hair coiled beneath a silver mantilla edged in jet beadwork
- example: ash-blonde half-hidden by a deep mourning hood pushed back to her temples
- example: copper-red crown of woven raven feathers set into elaborate side-plaits

UNCANNY / SUPERNATURAL:
- example: pure-white hair with shadowed-grey roots of someone who turned much later in life
- example: hair the color of dried blood — clearly dyed, the roots showing
- example: full bald with intricate dark henna ritual marks across the scalp
- example: half-and-half — silver on the left, jet-black on the right

━━━ RULES ━━━
- 10-20 words per entry
- ONE complete hair description with color + cut + state + (optional) headpiece
- Comma-separated phrases
- Mix dramatic + restrained — a few minimal entries are fine, but lean toward distinctive over generic
- NO named IP characters
- SAFETY: nothing suggestive

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: color + cut/length + style direction. Two entries are too similar if they share more than one of these.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
