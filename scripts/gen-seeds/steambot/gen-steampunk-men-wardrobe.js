#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_men_wardrobe.json',
  total: 100,
  append: true,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} STEAMPUNK MAN WARDROBE descriptions for SteamBot's steampunk-man path. Period-accurate Victorian-industrial menswear with steampunk modifications. NOT modern, NOT anime, NOT shirtless.

Each entry: 18-32 words. ONE complete outfit description with material detail.

━━━ OUTFIT TYPES (mix broadly across all entries) ━━━
1. AIRSHIP CAPTAIN — weathered greatcoat with brass buttons, double-breasted, leather harness, brass-toed boots
2. ENGINEER WORKING-WEAR — leather apron over white shirt sleeves, soot-streaked vest, heavy boots
3. INVENTOR / ALCHEMIST — vest under leather apron, ink-stained shirtsleeves rolled, brass watch chain
4. GENTLEMAN-EXPLORER — khaki linen suit, pith helmet, tall riding boots, leather satchel-strap across chest
5. WAR VETERAN MILITARY — military greatcoat with brass epaulettes, brass-buttoned tunic, sash, sword-belt
6. FROCK-COATED PROFESSIONAL — wool frock coat, vest with watch chain, cravat, tall collar, top hat at his side
7. STEAM-PIRATE — patched leather waistcoat over linen shirt, brass-and-leather harness, knee-high pirate boots, sash with brass buckle
8. RAILWAY ENGINEER — striped overalls, peaked cap, leather gloves at his hip, oil-stained kerchief
9. BRASS-LIMBED SOLDIER — military uniform with one sleeve rolled to expose bronze prosthetic arm
10. TWEED ACADEMIC — Norfolk-jacket tweed with elbow patches, vest, watch chain, polished oxfords
11. STEAM-GUNSLINGER — long duster coat, twin holstered brass-revolvers, slouch hat pulled low, boots with brass spurs
12. CHIRURGEON / DOCTOR — frock coat over surgical apron, leather doctor's bag at his feet, pocket watch
13. NOBLEMAN'S FORMAL — embroidered velvet waistcoat under tailcoat, silk cravat, gold pocket-watch chain
14. AETHER PILOT — leather flying-suit, sheepskin-lined collar, brass goggles raised above forehead
15. BLACKSMITH — bare arms below leather apron, heavy boots, hammer at his belt
16. TELEGRAPHER — railway uniform with brass insignia, leather code-key satchel, peaked cap

━━━ MATERIAL DETAIL TO INCLUDE ━━━
- Specific fabrics (wool, linen, leather, tweed, velvet, brocade, suede, oilcloth, canvas)
- Brass / copper hardware (buttons, buckles, clasps, epaulettes, watch chains, prosthetic gear-joints)
- Wear / weathering (soot-streaked, oil-stained, rain-darkened, factory-faded, sun-bleached, moth-eaten cuff)
- Period accuracy (frock coat, waistcoat, cravat, pocket watch, Norfolk jacket, paletot, Inverness cape)

━━━ ABSOLUTELY BANNED ━━━
- NO modern clothing (no T-shirts, jeans, hoodies, sneakers, baseball caps)
- NO shirtless / open-shirt gratuitous exposure
- NO anime / manga clothing tropes
- NO contemporary fashion brands
- NO casual undress for sex appeal

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "Weathered double-breasted greatcoat with tarnished brass buttons, leather aviator harness, brass-toed boots, oil-stained leather gloves"
- "Soot-streaked leather apron over rolled white shirt sleeves, oil-stained brown trousers, brass-buckled belt, heavy steel-toed work boots"
- "Tweed Norfolk jacket with elbow patches, mahogany vest with gold watch chain, cream cravat at high collar, polished oxford shoes"
- "Patched leather waistcoat over linen shirt, brass-and-leather chest harness, sash with brass buckle, knee-high cuffed pirate boots"
- "Frock coat with velvet collar, embroidered silk waistcoat with antique brass buttons, white cravat, tall stovepipe hat at his side"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
