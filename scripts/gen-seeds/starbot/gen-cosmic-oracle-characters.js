#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_oracle_characters.json',
  total: 25,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCI-FI ORACLE / SPACE PRIESTESS / COSMIC WOMAN character descriptions for StarBot's cosmic-oracle path — an art-show-quality painted-space-art illustration path (Dune / Foundation / Arrival / Blade-Runner-2049 / Moebius-Jodorowsky / Chesley-Bonestell aesthetic). Each entry is one SOLO woman caught candidly in a richly-detailed cosmic scene.

Each entry: 18-28 words. ONE specific character. Archetype + ethnicity + hair + eyes + sci-fi-ceremonial wardrobe. Aggressively deduped on ALL four dimensions.

━━━ ARCHETYPE MIX (rotate across these, don't cluster) ━━━
- Starlight Priestess / Cosmic High-Priestess / Lumen-Acolyte (ceremonial-light-bearer)
- Cosmic Seer / Star-Chart Diviner / Constellation-Reader (future-sight)
- Nebula Witch / Plasma-Mage / Void-Singer (alien magic-user)
- Void Oracle / Silence-Walker / Black-Star Oracle (emptiness-between-stars)
- Navigator-Priestess / Astrogator / Helios-Reader (pilot-mystic)
- Galactic Shaman / Star-Whisperer / Cosmic Herbalist
- Ceremonial Astronaut / Ritual-Pilot (religious spacefarer, helmet visor up)
- Temple-Guardian / Cosmic-Library Keeper
- Dune-style Bene-Gesserit-analog Truth-sayer (archetype only, no IP)
- Cyber-Mystic / Quantum-Nun / Digital-Oracle (subtle cybernetic accents)

━━━ ETHNICITY MIX (rotate evenly — Flux tends to default white-western, force variety) ━━━
Pan-African / Afro-Caribbean / Igbo / Somali / Ethiopian / Yoruba / Maori / Samoan / Tongan / Hawaiian / Aboriginal-Australian / Sámi / Pan-South-Asian / Tamil / Bengali / Rajput / Tibetan / Nepali / Mongolian / Kazakh / Persian / Kurdish / Amazigh / Moroccan / Tuareg / Coptic / Pan-East-Asian / Japanese / Korean / Vietnamese / Filipino / Thai / Indonesian / Mayan / Quechua / Mapuche / Afro-Latina / Indigenous-Andean / Inuit / Norse / Celtic / Slavic / Balkan / Ashkenazi / Sephardic / Greek / Etruscan / mixed-heritage — vary strongly.

━━━ HAIR MIX ━━━
- Braids (cornrows / Fulani / Himba-ochred-twists / silver-thread-braids / constellation-studded-micro-braids)
- Locs (silver-shot / ash-white / plasma-violet-tinted / glowing-fiber-optic-threaded)
- Updo (crown-braid / chignon / buns / top-knot / ceremonial-tiara-wound)
- Shaved / undercut / half-shaved with glowing-sigil-scalp-tattoos
- Long straight (metallic-silver / platinum-white / nebula-violet / star-dusted / holographic-shifting)
- Wavy / curly (dark-ink / silver-shot / aurora-highlighted)
- Short / pixie / chin-bob / asymmetric-cut
- Astronaut-close-cropped practical
- Head-wrapped ceremonial fabric or veil (deep-indigo / gold-embroidered / starfield-printed)
- Hood-covered / cowl-covered / turbaned
MAX ~3 entries per hair-family across the pool.

━━━ EYES MIX (most should have a SUBTLE supernatural glow — gold / violet / lime / cyan / star-white / amber) ━━━
- Luminous gold / faintly-glowing gold
- Deep violet / glowing violet iris on black-sclera
- Lime-green / plasma-green glow
- Star-white pinprick-centers in deep-black iris
- Electric cyan / aurora cyan
- Pale silver / moon-silver
- Amber / fire-amber
- Deep-ink-black with cold-white star pinprick-reflection
- Heterochromatic (gold + violet / silver + cyan)
MAX ~4 entries per eye-color across the pool.

━━━ WARDROBE MIX (sci-fi ceremonial / priestess / oracle / astronaut-mystic — NO Earth-modern clothes) ━━━
- Flowing ceremonial robes (deep-indigo / cosmic-violet / aurora-teal / star-field-black with embroidered-gold-sigils)
- Ritual cloaks with high-popped collars (black-silk / matte-void-black / starlight-silver)
- Ceremonial armor with starmetal trim (bronze-and-crystal / silver-and-aurora / obsidian-and-gold)
- Astronaut flight-suit (repurposed as ritual wear — visor up or transparent)
- Veil / face-wrap covering lower-face but eyes visible (deep-indigo / starfield-printed / gold-sigil)
- Long-sleeve floor-length robe with slit-panels showing iridescent-circuitry underlayer
- Bronze-and-crystal navigation-sextant harness with arm-gauntlets
- Cold-white vestment with gold chest-emblem
- Ancient-Egyptian / Mesoamerican / Silk-Road inspired ceremonial robes with sci-fi material-swap (glowfiber / starmetal / holo-silk)
- Subtle cybernetic-accent ceremonial wear (glowing-sigil-vein implants along collarbone, tiny antenna-circlet)

━━━ FORMAT ━━━
"[Archetype] — [ethnicity] woman with [skin tone detail], [hair], [eyes], wearing [wardrobe]"

Example (do NOT copy): "Starlight Priestess — Pan-African woman with warm-umber skin, silver-braided locs threaded with glowing-fiber-optic, glowing amber eyes, wearing deep-indigo ceremonial flight-robes trimmed in gold-embroidered sigils"

━━━ MUST-HAVE FOR EVERY ENTRY ━━━
- 18-28 words, strict
- Four-dimension dedup (archetype + ethnicity + hair + eyes)
- Sci-fi-ceremonial wardrobe (NO Earth-modern clothing)
- Subtle-supernatural detail (glowing iris / constellation tattoo / plasma-vein hint)
- SOLO character — no companion-figures, no partners

━━━ BANNED ━━━
- NO modern Earth clothes (jeans / t-shirt / sneakers / hoodie)
- NO real IP names (Ellen Ripley / Sarah Connor / Chani / Rey / Leia / Furiosa / Bene Gesserit by name)
- NO weapons brandished (blaster / pistol / laser-rifle)
- NO cyborg / cybernetic-dominant bodies (that's VenusBot territory — subtle-cyber-accents OK, full-robotic NO)
- NO child / teen subjects — adult woman only
- NO sexualized description (body-type / breasts / cleavage / curves) — focus on face + wardrobe + accessories

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
