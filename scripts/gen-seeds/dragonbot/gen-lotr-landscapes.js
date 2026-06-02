#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/lotr_landscapes.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} LORD-OF-THE-RINGS-CODED LANDSCAPE entries for DragonBot's lotr-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ICONIC FANTASY VISTA in the Tolkien / Middle-earth aesthetic tradition — Shire-coded green hills with hobbit-holes, Mordor volcanic hellscape with looming dark tower, Rivendell elven-waterfall-valley, Lothlórien golden-mallorn-forest, Moria dwarven-dark-depths, Edoras golden-roof horse-clan plain, Minas Tirith white-stone seven-tier city silhouette, Helm's Deep fortress in valley, Fangorn ancient mossy forest, Erebor lonely-mountain, Misty Mountains pass.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO HOBBITS, NO ELVES, NO ORCS-AS-FOREGROUND, NO HEROES. Pure landscape only.

CRITICAL — NO PROPER NOUNS. Never write "Middle-earth", "Shire", "Mordor", "Rivendell", "Lothlórien", "Moria", "Edoras", "Rohan", "Gondor", "Minas Tirith", "Helm's Deep", "Fangorn", "Erebor", "Mount Doom", "Khazad-dûm", "Sauron", "Frodo", "Gandalf", "Aragorn" — describe the AESTHETIC generically. Use phrases like "rolling green-hills with hobbit-style round-doored cottages", "volcanic hellscape with looming black tower at the horizon", "elven-waterfall valley city", "ancient mossy primeval forest", "white-stone seven-tier city carved into a mountain".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of Peter-Jackson / Alan-Lee / John-Howe / Ted-Nasmith painted concept-art tradition. EVERY entry feels EPIC, ANCIENT, BIBLICAL in scale and history. Painted-matte-quality. Bone-deep mythological weight. Dramatic skies — golden dawns over green hills, blood-red volcanic glow, silver moon over mountain pass, mist drifting through ancient trees. Color palettes are RICH and EARTHEN — emerald-and-gold (Shire), black-and-blood-red (Mordor), silver-and-blue (Rivendell), gold-and-amber (Lothlórien), grey-and-stone (Moria), white-and-gold (Minas Tirith).

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

SHIRE-CODED ROLLING-HILL HAMLETS (~3):
- rolling green hills with hobbit-style round-doored cottages built into the slopes, sun-dappled fields, distant pipe-smoke rising
- pastoral hill-village at golden-hour with circular doors set in earth-mounds, manicured gardens, distant farmlands
- emerald hilltops with hobbit-hole hamlets nestled into the slopes, woodsmoke threading up, distant party-tree silhouette

MORDOR VOLCANIC HELLSCAPE (~3):
- vast volcanic black-rock plain with looming dark tower at the horizon under blood-red sky, glowing eye-symbol pulsing distant
- ash-and-obsidian wasteland with single tall ominous black-tower silhouette, sulfur-yellow clouds, oppressive dread
- volcanic hellscape with cracked black-glass terrain, lava-rivers, dim red sky, distant fortress silhouette in the haze

ELVEN WATERFALL-VALLEY CITY (~3):
- elven city built into a misty valley with cascading waterfalls, slim white-and-blue bridges spanning chasms, soft silver light
- valley sanctuary with elven architecture nestled among waterfalls, autumn-gold trees, atmospheric mist rolling between buildings
- elf-kingdom valley at twilight with crystalline waterfalls and silver-blue spires, soft ambient glow, moon rising above

GOLDEN-MALLORN-FOREST (~3):
- ancient elven forest with kilometer-tall golden-mallorn trees, soft amber light filtering through canopy, hanging-moss flets in branches
- twilight golden-forest with shimmering gold-leaved trees, glowing motes in the air, soft amber ambient
- enchanted gold-forest grove with massive ancient trees, ladder-platforms wrapping the trunks, atmospheric silver-mist

DWARVEN UNDERGROUND DEPTHS (~3):
- vast underground stone-cathedral chamber with massive carved pillars receding into darkness, single shaft of light from above
- dwarven mine-cavern with enormous stone-bridge spanning a chasm, abyss below, distant drum-echo implied
- underground stone-hall with carved-pillar architecture, ancient runes glowing faintly, dim light from a single skylight

ROHAN GOLDEN-ROOF PLAINS (~2):
- vast green-and-gold plains with distant golden-roofed wooden hall on a low hill, banners flying, horse silhouettes in the distance
- horse-clan plains with golden-thatched mead-hall in middle-distance, banners with horse-sigils, atmospheric haze

WHITE-STONE SEVEN-TIER CITY (~2):
- vast white-stone city carved in seven concentric tiers ascending a mountain, single white tree-court at the top, distant beacon-fire
- seven-tier white-stone city silhouette against dawn sky, mountain peak rising behind, atmospheric grandeur

ANCIENT FOREST / FANGORN (~2):
- ancient mossy primeval forest with massive twisted trees, atmospheric mist, dappled green light, sense of slow-watching presences
- old-growth fantasy forest with kilometer-tall trees, mist drifting between trunks, soft emerald ambient, ancient silence

LONELY MOUNTAIN / MISTY PASS (~2):
- single colossal mountain rising from a windswept plain, ancient delved-stone gate at its base, dragon-sigil banner flying
- misty mountain pass winding between cliffs, ancient stone-watchtowers, snow drifting, golden-hour light through clouds

PELENNOR / BATTLE-PLAIN (~2):
- vast green-and-gold battle-plain with distant white-stone city silhouette, banners and watch-fires, dramatic sky
- broad fertile plain stretching to a distant fortress-city, mountains in the background, atmospheric scale

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO hobbits / NO elves / NO orcs-as-figures / NO heroes
- NO franchise proper nouns
- PEAKER-JACKSON / ALAN-LEE / JOHN-HOWE painted-matte mood — EPIC, ANCIENT, BIBLICAL
- Variety across the 10 categories above mandatory
- Color palette per region (emerald-gold Shire, blood-red Mordor, silver-blue Rivendell, gold-amber Lothlórien, grey-stone Moria, white-gold Minas Tirith)
- Cinematic mythological scale

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
