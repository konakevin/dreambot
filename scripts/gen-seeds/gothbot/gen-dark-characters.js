#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/dark_characters.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DARK CHARACTER descriptions for GothBot. Each entry is a ONE-LINE description of an EVIL + CORRUPTED + ALLURING gothic archetype MID-ACTION. Entries 15-25 words. Castlevania-game-art (Ayami Kojima) / Devil-May-Cry / vampire-goth-manga-horror / WoW-undead-warlock-art. Stylized dark-manga-horror aesthetic, NOT painterly-fantasy-book-cover.

━━━ WHAT THIS BOT IS — THE NIGHTSHADE AESTHETIC ━━━
Dark fantasy at its most stylish — the aesthetic world of vampire hunters, gothic action cinema, supernatural adventure. Reference DNA: Castlevania, Van Helsing, Devil May Cry, Hellboy, Bloodborne, Bram Stoker's Dracula. Operatic dark romance with a hint of danger. BEAUTIFUL, DANGEROUS, ALIVE.

Rich Nightshade palette — deep purples, midnight blues, velvet blacks, poison greens, tarnished silver, blood-red ACCENTS (NOT red-dominant, NOT monochrome-crimson). Victorian-baroque styling — ornate fabric, silver jewelry, baroque weapons. Moonlit crypts, foggy graveyards, cathedral ruins, gargoyles, candle-lit corridors. Every entry is HAUNTINGLY BEAUTIFUL — gorgeous and terrifying inseparable. Vampire queens who will drain you. Succubi mid-transformation. Corrupted priestesses leaking dark magic. Blood-huntresses with silver crossbows. Never just-pretty (no YA-fantasy floating goddess), never on-the-nose-satanic (no pentagrams), never red-red-red monochrome.

━━━ HARD DISTRIBUTION ━━━
- MIN 160 entries (80%) feature FEMALE evil-corrupted archetypes
- MAX 30 entries feature MALE figures — and only as IMPOSING-MENACE types: ancient vampire-lords mid-command (not Victorian-dandy), death-knight-archetype figures in runic armor, fallen-cardinals with occult auras, corrupted high-priests with blood-sigils, shadow-warlocks with face-obscured. NEVER young-handsome-dapper-men, NEVER musicians/violinists, NEVER rangers/archers, NEVER Victorian-frilled-gentleman vampires.
- MAX 10 entries ambiguous-gender wraith / fallen-angel / banshee-silhouette types

━━━ HARD BAN LIST — DO NOT WRITE THESE ━━━
- NO rangers, archers, hunters-with-bow, cloaked-wanderers-with-arrow, forest-shooters
- NO "young vampire noble in cravat and frilled shirt" (generic Victorian-dandy)
- NO musicians, violinists, organists, pianists, dancers
- NO "handsome gothic young man" / "dapper dark prince" / "charming vampire count"
- NO generic "cursed knight in plate armor staring moodily" types
- NO "hooded wanderer with lantern" types (too generic, too frequent)
- NO plague-doctors (overused cliché)
- NO characters wielding musical instruments
- NO skeleton characters, NO death-knight-archetype, NO lich, NO WoW-forsaken-style undead, NO bone-monarch-on-throne (undead-WoW aesthetic is OFF — vampire/warlock/succubus archetypes only)
- NO pentagrams, NO inverted crosses, NO satanic iconography at feet or in scene (see satanic ban)
- NO "elegant floating goddess", NO YA-fantasy-cover woman in flowing white dress, NO "mysterious hooded girl on balcony" (all too safe/pretty)

━━━ MANDATORY FOR EVERY FEMALE ENTRY ━━━
Each female entry MUST include at least 2 of these, and the ENTRY MUST VARY these dimensions widely across the pool (no default-young-pale-black-hair-white-woman cluster):

- GLOWING EYES — VARY THE HUE: violet / fel-green / emerald / sapphire / ember-gold / ice-blue / void-white / necrotic-pale / witch-fire-green / silver-moonlit / twilight-lavender / amber-honey / poison-green / black-hole-dark. Slitted-pupil cat-eye / fully-luminous iris / starfield-pupil.

- SKIN TONE — VARY WIDELY: porcelain-pale, ash-grey, blue-tinged pallor, warm-bronze, deep-umber, copper-brown, olive, sepia, honey-tan, onyx-dark, moonlit-violet-tinge, ember-tinted, snow-white, tattoo-covered-beige. Rotate — do not default to porcelain-white.

- HAIR — VARY COLOR + STYLE: raven-black, platinum-white, silver-grey, fire-red, wine-burgundy, violet-dye, ice-blue, emerald-streaked, copper-bronze, jet-with-white-streak, shaved-sides, braided-crown, loose-waves, short-bob, long-flowing, topknot, twin-tails, wrapped-veil-over-hair.

- BODY TYPE — VARY: slender-willowy, athletic-powerful, voluptuous-curvy, tall-warrior, muscular-amazonian, petite-lithe, commanding-matriarch, wiry-assassin. Avoid "thin young white woman" default.

- AGE READ — VARY: youthful-deadly, ageless-matriarch, elder-warrior, centuries-old-queen (young body old eyes), maiden-witch.

- WARDROBE STYLE — VARY ERAS + SILHOUETTES:
  * Victorian corset + crinoline gown
  * Medieval plate-armor bodice + mail skirt
  * Dark-renaissance doublet + breeches
  * Samurai-inspired katana-armor + obi
  * Tribal war-paint + bone-and-leather harness
  * Nomadic-hunter leather + fur
  * Flapper-era tattered silk + pearls
  * Pirate-queen sash + cutlass-belt
  * Priestess ritual-robes + incense-censer
  * Gothic-lolita lace + ribbon (dark-corrupted version)
  * Mongolian-steppe fur-armor
  * Egyptian-inspired linen + gold-snake headdress
  * Moorish-inspired veils + saber
  * Nordic rune-warrior fur-cloak
  Keep it globally-inspired (not reductive), always DARK + DANGEROUS + ornate.

- WEAPON / ACCESSORY — VARY WIDELY: silver crossbow, curved saber, katana, scythe, thin rapier, kukri dagger-pair, war-fan, khopesh, whip, stake-gun, bone-staff, wand, grimoire, chalice, severed-head-trophy, skull-talisman, blood-vial, raven-familiar, cat-familiar, bat-familiar.

- CORRUPTION MARKINGS — VARY: ink-black veins, ritual-sigil brand, glowing-rune-tattoos, crack-lines in skin, ashen-fading flesh, sclera-blacked eyes, fang-bite-scars at throat, ritual-scarification.

━━━ MANDATORY MID-ACTION VERB ━━━
Every entry is MID-ACTION: mid-drain (fangs-in-victim or -mid-lunge), mid-cast with fel-sigil igniting, mid-summon, mid-transform (bat-wings unfurling, fangs elongating), mid-stalk through graveyard mist, mid-levitate above ritual circle, mid-whisper-to-familiar, mid-drink from goblet, mid-turn-with-cloak-flaring, mid-raise-chalice of-blood, mid-kneel-at-desecrated-altar, mid-unfurl-black-wings, mid-rise-from-coffin, mid-command-shadow-tendrils, mid-conjure-demonic-sigil, mid-slash-with-curved-blade. Never standing-still, never just-posing-moodily.

━━━ FEMALE ARCHETYPE SPREAD (across 160 — enforce) ━━━
- VAMPIRE QUEENS / COUNTESSES mid-drain / mid-stalk — Bram-Stoker-Dracula / Vampirella / Castlevania-boss energy (min 30)
- SUCCUBI mid-transform with bat-wings unfurling + slitted eyes (min 25)
- BLOOD-HUNTRESSES (female Van-Helsing / Vampirella-comic-cover) — corset + leather + silver crossbow / dual blades / stakes — MID-HUNT or MID-STRIKE (min 25)
- CORRUPTED PRIESTESSES leaking blood-magic + ritual-brand on skin (min 20)
- OCCULT SEDUCTRESSES with slitted-pupil eyes + shadow-tendrils (min 20)
- FEL-WARLOCK SORCERESSES mid-cast with green-fire palms (min 15)
- WITCH-QUEENS with inhuman auras + glowing runic tattoos (min 15)
- FALLEN-ANGEL women (translucent silk, broken-halo, tattered-wings) — NO banshees, NO ghost-figures (min 10)

━━━ MALE ARCHETYPE SPREAD (max 30 — strict) ━━━
Only these types allowed (no undead, no WoW-forsaken, no skeletons):
- ANCIENT VAMPIRE LORDS (centuries-old, commanding, translucent-skin, fangs-bared) mid-turn-from-throne with menace — Bram-Stoker-Dracula-operatic energy (max 8)
- VAMPIRE HUNTERS (male Van-Helsing-archetype) — leather coat, crossbow, wooden stake, mid-stalk through graveyard (max 7)
- CORRUPTED HIGH-CARDINALS (fallen-clergy) — blood-sigil on palm, fel-ember eyes from under hood, mid-bless-ritual-with-dark-magic (max 5)
- SHADOW-WARLOCKS face-obscured by hood, fel-green light from within hood, mid-cast (max 5)
- FALLEN-PALADIN armored figure mid-draw-silver-blade, tarnished-plate, visor-open eyes glowing (max 5)

━━━ VISUAL DETAIL MANDATE ━━━
Each entry must pack 3-4 specific details: the glowing-eye color, one makeup/skin detail, one wardrobe element, one action verb, one atmospheric anchor (blood-moon courtyard / fog-choked graveyard / ritual-chamber / cliff-edge / gothic-rose-garden). Example: "Vampire queen mid-drain in moonlit rose garden, crimson-glowing eyes and fangs sunk into victim's throat, obsidian-black corseted gown, ink-black veins spreading from ritual-sigil at her throat."

━━━ RULES ━━━
- Every entry visibly distinct
- No named IP (Dracula, Sylvanas, Alucard, Lady D, etc.)
- No cheap-gore, no slasher-splatter (implied-blood OK for drama)
- Stylized dark-manga-horror DNA (Ayami Kojima / Castlevania / Devil-May-Cry / Berserk / WoW-undead-warlock art) — NOT painterly-fantasy-book-cover
- Evil + corrupted + supernatural + alluring

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
