#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_hair.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} VAMPIRE HAIR descriptions for GothBot's vampire-girls-2 path. Each entry is ONE complete hair description — color + cut/style + texture/state + headpiece (when relevant). Each entry: 10-20 words, comma-separated phrases.

━━━ WHAT MAKES A GOOD ENTRY ━━━
- A specific COLOR (not just "black" — black with a silver streak, blood-red dyed, raven-with-violet-undertones, snow-white with shadowed roots, etc.)
- A specific CUT or STYLE (not just "long" — shaved temple with long top, asymmetric undercut, razor-cropped above shoulders, bound in war-braids)
- A specific STATE (sleek and glossy, soaked-wet plastered, wind-tossed, perfectly oiled, ratted and feral)
- WHEN RELEVANT, a headpiece (mantilla, raven-feather headdress, pearl-strung braid crown, antique tiara, mourning veil, ribbon-strung)

━━━ HAIR SPREAD (enforce variety across ${n}) ━━━

CONVENTIONAL VAMPIRE LONG (5-6) — but with a TWIST that makes it distinctive:
- waist-length raven black hair with one silver-white streak from temple
- midnight-black waves swept over one shoulder, threaded with jet-black ribbon
- inky black hair to the hips, sleek and oiled, parted severely down the center
- raven hair in a single thick braid coiled like rope across one collarbone
- black-with-violet-undertones loose curls falling past the shoulders, half-pinned with a silver comb

ARISTOCRATIC UPDOS (4-5):
- raven hair pulled into a severe high chignon pinned with a jet-and-silver hairpin
- elaborate pearl-strung braid crown across the top of the head
- Belle Époque puffed updo with a single black orchid pinned at the side
- powdered-grey wig in tight ringlets pinned high — Regency court style
- antique tiara of dark gold and obsidian set into a coiled braid

UNCONVENTIONAL CUTS (3-5):
- shaved at one temple, the rest in a long curtain falling across the other side
- razor-jagged crop just below the jaw, dyed inky black with violet sheen at the tips
- asymmetric undercut with the long side dyed blood-red
- bone-pale platinum bob with severe blunt fringe — 1920s flapper into vampire
- chopped to the chin in uneven layers, dark with rust-red streaks

DRY / FERAL / FRESH-RISEN (3-4):
- wind-tossed black hair tangled across half her face, fresh from the storm
- soaked-wet plastered to her skull, water beading at the tips, just emerged from the bath
- ratted and feral with twigs and ash caught in the strands
- tangled raven mane with a single feather and a strand of moss caught in it

VEILED / RITUAL (3-4):
- black mourning veil draped from a tarnished-silver comb, hair coiled beneath it
- silver-white hair beneath a translucent mantilla edged in jet beadwork
- raven hair half-hidden by a deep hood pushed back to her temples
- crown of woven raven feathers set into elaborate side-plaits

UNCANNY / SUPERNATURAL (2-3):
- snow-white hair with the shadowed roots of someone who turned much later in life
- hair the color of dried blood — clearly dyed, the roots black where it's growing back
- full bald with intricate dark henna ritual marks across the scalp

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
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
