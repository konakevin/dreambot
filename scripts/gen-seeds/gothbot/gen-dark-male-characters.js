#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/dark_male_characters.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} DARK MALE CHARACTER descriptions for GothBot's male character paths. Each entry is a ONE-LINE description of a MENACING + POWERFUL + HAUNTINGLY BEAUTIFUL male gothic archetype. Entries 15-25 words. Castlevania (Ayami Kojima) / Devil-May-Cry / Bloodborne / Berserk / Van-Helsing aesthetic. Dark-manga-horror stylization.

━━━ WHAT THIS BOT IS — THE NIGHTSHADE AESTHETIC ━━━
Dark fantasy at its most stylish — vampire hunters, gothic action cinema, supernatural adventure. Reference DNA: Castlevania (Alucard, Richter Belmont archetypes — NOT by name), Devil May Cry (Dante/Vergil archetypes), Bloodborne hunters, Berserk (Guts archetype), Van Helsing. Operatic dark romance with DANGER. BEAUTIFUL, DANGEROUS, ALIVE.

Rich Nightshade palette — deep purples, midnight blues, velvet blacks, poison greens, tarnished silver. Victorian-baroque styling — ornate fabric, silver jewelry, baroque weapons. Every entry is HAUNTINGLY BEAUTIFUL — gorgeous and terrifying inseparable.

━━━ MALE ARCHETYPE SPREAD (across ${n} — enforce diversity) ━━━

VAMPIRE LORDS (25%) — ancient aristocratic undead, centuries-old, commanding, terrifying beauty:
- Translucent corpse-pale skin, visible veins, sharp aristocratic features
- Long hair (silver, black, white), high-collared capes, ornate Victorian attire
- Glowing eyes (crimson, ember-gold, ice-blue, void-violet)
- FANGS mandatory — sharp upper canines visible
- Commanding + predatory + ancient menace

BLOOD-HUNTERS / MONSTER-SLAYERS (25%) — male Van-Helsing / Belmont / Bloodborne hunter archetypes:
- Scarred, weathered, battle-hardened
- Leather longcoats, crossbows, silver stakes, thin-blades, flintlocks
- Mix of lean-wiry and rugged-muscular builds
- Determined hunter's gaze, not pretty-boy
- Trophies on belt (vampire teeth, holy-water vials, silver bolts)

DARK KNIGHTS / FALLEN PALADINS (20%) — corrupted warriors in tarnished armor:
- Plate armor etched with forbidden runes, tarnished and battle-worn
- Glowing eyes visible through visor slits
- Heavy greatswords, war-hammers, halberds
- Cloaks tattered and burned
- Corruption spreading through armor cracks (dark veins, fel-glow)

WARLOCKS / DARK MAGES (15%) — occult power practitioners:
- Robes with runic embroidery, ritual-chain jewelry
- Fel-green or void-violet glow emanating from hands/eyes
- Grimoires, bone-staffs, crystal focuses
- Mix of hooded-mysterious and face-revealed
- Tattoo-covered arms with glowing sigils

CORRUPTED CLERGY (15%) — fallen priests, dark cardinals, death-cult monks:
- Tattered vestments, blood-stained surplices
- Ritual-scarred hands, incense-censers trailing dark smoke
- Inverted iconography (tarnished silver crosses, broken halos)
- Emaciated or imposing builds
- Fel-ember eyes from under hoods

━━━ MANDATORY DIVERSITY DIMENSIONS ━━━
Each entry MUST vary these — no default-young-pale-white-man cluster:

- SKIN TONE — VARY WIDELY: porcelain-pale, ash-grey, deep-umber, warm-bronze, olive, copper-brown, onyx-dark, sepia, blue-tinged pallor, moonlit-violet-tinge. Rotate through.

- HAIR — VARY: raven-black, platinum-white, silver-grey, fire-red, copper-bronze, shaved, short-cropped, long-flowing, warrior-braids, topknot, wild-mane, streaked.

- BUILD — VARY: lean-lethal, massive-imposing, wiry-assassin, broad-shouldered-warrior, gaunt-ancient, athletic-hunter, towering-knight, compact-powerful.

- AGE READ — VARY: young-deadly, battle-scarred-veteran, centuries-old-aristocrat (young body ancient eyes), grizzled-hunter, ageless-warlock.

- ETHNICITY — globally inspired, dark-fantasy versions: Nordic berserker, Moorish blade-master, East-Asian ronin-hunter, West-African warrior-priest, Mediterranean assassin, Slavic knight, Celtic druid-warrior. Keep it respectful + gothic-adapted.

━━━ VISUAL DETAIL MANDATE ━━━
Each entry packs 3-4 specific details: glowing-eye color, one skin/scar detail, one wardrobe element, one weapon/accessory, one atmospheric anchor. Example: "Ancient vampire lord with translucent ash-grey skin and crimson-glowing eyes, platinum hair in warrior-braids, obsidian plate armor etched with blood-runes, silver longsword mid-draw, standing in moonlit crypt."

━━━ HARD BANS ━━━
- NO named IP (Dracula, Alucard, Dante, Vergil, Guts, Van Helsing as names)
- NO pretty-boy / romantic-lead / YA-love-interest types
- NO Victorian-dandy / dapper-gentleman / frilled-cravat types
- NO musicians, violinists, pianists
- NO skeletons, liches, WoW-forsaken-style undead
- NO plague-doctors (overused)
- NO pentagrams, inverted crosses, satanic iconography
- NO cheap-gore, no slasher imagery

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
