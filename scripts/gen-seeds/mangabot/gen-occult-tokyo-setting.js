#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/occult_tokyo_setting.json',
  total: 25, batch: 25, append: true,
  metaPrompt: (n) => `Write ${n} OCCULT-TOKYO SETTING entries — modern urban Tokyo locations bleeding with supernatural energy. Character ENGAGED with the location, NOT silhouetted-staring.

Each 14-22 words. Location + foreground occult-prop + midground depth + character ENGAGED.

⚠️ STRICT URBAN-MODERN-JAPAN — Tokyo alleys, shrines, convenience stores, subway tunnels, love-hotel rows, school occult-clubs, rooftop overlooks. NO western settings (no churches, no graveyards-with-celtic-crosses).

VARIETY:
- 18% TOKYO-ALLEY (narrow back-alley with vending-machine + neon-sign / cursed-graffiti alley with puddles / late-night izakaya alley)
- 14% MODERN-SHRINE (urban shrine with torii + ofuda-tree / city-shrine washing-station / shrine courtyard with ema-plaques)
- 12% SUBWAY-TUNNEL (subway-platform with cursed-shadows on tile / underground passage with sigil-graffiti / station-stairs at night)
- 10% CONVENIENCE-STORE (konbini interior with shelves + flickering fluorescent / konbini parking-lot at night with vending-light / lawson aisle with cursed-air)
- 10% LOVE-HOTEL-ROW (neon-lit love-hotel street with pink-cyan signs / kabukicho alley with hostess-signage / red-light alley with paper-lanterns)
- 8% SCHOOL-OCCULT-CLUB (school classroom with candles + ofuda-collage / clubroom with sigil-chalkboard / library back-corner with paranormal-books)
- 8% ROOFTOP-TOKYO-OCCULT (apartment rooftop with sigil-chalk circle / school-rooftop with ofuda-pinned chain-link / office-roof with prayer-bead-strung antenna)
- 6% APARTMENT-INTERIOR (small Tokyo apartment with talisman-walls / cluttered bedroom with sigil-papers / kitchen with offering-altar)
- 4% TEMPLE-INTERIOR (urban-temple back-room with butsudan altar / temple-corridor with sliding-doors / prayer-hall with floor-cushions)
- 4% RAMEN-SHOP (small ramen-counter at night with steam / izakaya counter with sake-bottles / late-night oden-stand)
- 4% BUSINESS-DISTRICT (Shibuya-crossing at night with cursed-fog / Shinjuku alley with billboard-glow / Akihabara back-street with neon-sigils)
- 2% PARK-NIGHT (urban park at night with playground-shadows / pond-park with floating-paper-lanterns)

DO write:
- Narrow Tokyo back-alley with vending-machine + cursed-graffiti close foreground, neon-sign midground, salaryman-silhouette deep — she stands AT vending mid-talisman-throw
- Urban shrine with torii-gate + ofuda-tree close foreground, washing-station midground, neon city deep — he kneels AT shrine mid-prayer-bead-mantra
- Subway-platform with cursed-shadow-stain on tile close foreground, train-tracks midground, tunnel-glow deep — she crouches mid-sigil-draw on platform
- Konbini interior with cursed-shelves + flickering fluorescent close foreground, register-counter midground, parking-lot deep — he stands AT shelf mid-ofuda-pin
- Neon-lit love-hotel street with paper-lantern close foreground, hostess-signage midground, kabukicho deep — she walks AT alley mid-shikigami-deploy
- School clubroom with candle-circle + sigil-chalkboard close foreground, bookshelf midground, window deep — he sits AT circle mid-kuji-hand

DO NOT: "standing at edge looking out over Tokyo" — explicit back-to-camera trap. Pure-vista. Western occult settings. Photoreal.

City is BACKDROP. Character ENGAGED at the location with occult-prop AT HAND, NOT staring at distance.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
