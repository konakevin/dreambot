#!/usr/bin/env node
/**
 * Generate a SteamBot axis pool using Sonnet.
 *
 * Mirrors gen-earthbot-pool.js / gen-bloombot-pool.js: signature-based dedup,
 * --target iterative gen+dedup loop, append-mode preservation.
 *
 * Usage:
 *   node scripts/gen-steambot-pool.js --pool airship_female_outfit --count 25
 *   node scripts/gen-steambot-pool.js --pool airship_female_outfit --target 200
 *
 * Output: scripts/bots/steambot/seeds/<pool>.json
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch { return {}; }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) { console.error('ANTHROPIC_API_KEY missing'); process.exit(1); }

const args = process.argv.slice(2);
const flag = (n, fb) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : fb; };
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '30'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');
if (!POOL) { console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]'); process.exit(1); }

// ─────────────────────────────────────────────────────────────
// SteamBot shared identity guards (referenced across all recipes)
// ─────────────────────────────────────────────────────────────
// All paths: Victorian-industrial / steampunk world, brass + leather +
// mahogany + copper + glass material vocabulary. NEVER sci-fi-futurist /
// modern / cyberpunk / mythical-magic. NSFW-safe vocabulary (no
// sexy/erotic/sensual/seductive/sultry/bare-midriff/cleavage/etc.).
//
// For airship-female pool family (2026-05-23 — new path):
//   - Always steampunk-coded materials (brass / leather / canvas / oil /
//     mahogany / copper / gear / clockwork / cogwork)
//   - Steampunk-globe heritage allowed (Victorian English, Prussian,
//     Persian sky-corsair, Tokyo airship academy, Hindustani sky-noble,
//     Yoruba airship clan, Mediterranean cloud-pirate, etc.) — NOT
//     Victorian-British-only
//   - Combat allowed (cannon-fire, pistol/sword duels, repelling boarders)
//   - Female-coded pools enforce NSFW-safe vocab; male-coded (future) enforce
//     no-shirtless mandate

const POOL_RECIPES = {

  // ═══════════════════════════════════════════════════════════
  // AIRSHIP-FEMALE path (2026-05-23) — solo female air-officer mid-action
  // on a steampunk airship. Combat allowed. 4 female-bespoke pools + 7
  // shared with future airship-male sister (heritage/role/eyes/hair_color/
  // accessory/backdrop/drama).
  // ═══════════════════════════════════════════════════════════

  airship_heritage: {
    format: 'simple',
    theme: `STEAMPUNK-GLOBE HERITAGE descriptors for airship-female's heritage axis. Each entry is ONE specific cultural/regional heritage that locks the woman's ethnicity, skin coloring, and visual heritage register. Each entry 12-25 words. Steampunk-globe (NOT Victorian-British-only) — the airship era spans cultures.

⚠️ MANDATORY — every entry must combine a real ethnic/regional heritage with a STEAMPUNK CULTURAL FRAMING (sky-corsair clan / airship academy / aerial navy / dirigible-engineer guild / etc.). The reader should be able to picture a SPECIFIC heritage-coded face + WHAT KIND of airship culture she comes from. The cultural framing is the steampunk overlay on top of the real-world ethnicity.

✓ VARIETY MANDATE — distribute across regions. In a 50-entry pool, target ~5 per region:
  A. Victorian European (English, Scottish, Welsh, Irish — Royal Aerial Navy / sky-merchant guild / dirigible-prospector)
  B. Continental European (Prussian, French, Italian, Spanish — Prussian Sky-Hussars / French aerostatic-corps / Italian cloud-pirate)
  C. Eastern European / Slavic (Russian, Ukrainian, Romanian, Polish — Romanov sky-lancer / Carpathian dirigible-clan)
  D. Mediterranean / Levantine (Greek, Sicilian, Turkish, Lebanese, Egyptian — Aegean cloud-corsair / Constantinople airship-academy)
  E. Persian / Central Asian (Persian, Afghan, Uzbek, Mongol — Esfahan sky-corsair / Samarkand caravan-airship clan)
  F. South Asian (Hindustani, Punjabi, Bengali, Sri Lankan, Tamil — Mughal-rajput airship-noble / Rajasthan sky-corsair)
  G. East Asian (Han Chinese, Japanese, Korean, Mongolian — Qing imperial airship-corps / Tokyo airship-academy / Joseon sky-bureaucracy)
  H. Southeast Asian (Vietnamese, Filipino, Indonesian, Thai, Malay — Sulu sky-pirate clan / Malacca airship-merchant)
  I. African (Yoruba, Zulu, Ethiopian, Berber, Mali, Egyptian — Yoruba sky-noble / Ethiopian highland-airship / Berber dune-airship)
  J. Indigenous American (Comanche, Navajo, Lakota, Cherokee, Aztec — Comanche sky-scout / Andean condor-airship clan)

🚫 STRICT BANS:
  - NO fantasy races (no elven / dwarven / half-orc / dragonborn)
  - NO "exotic" / "oriental" / "ethnic" coded as othering — describe the heritage with the same dignity as European entries
  - NO body descriptors (no "voluptuous", "curvy", "thin", "petite", "buxom")
  - NO fashion mentions (those go in outfit pool)

Lineage to channel: cinematic steampunk world-building (Treasure-Planet's diverse crew / Last-Exile's multi-culture sky-fleets / Mortal-Engines' London Airhaven / Skies-of-Arcadia's multinational pirates).`,
    touchpoints: [
      'PRUSSIAN SKY-HUSSAR — pale Northern-European complexion, ash-blonde or copper-red hair, ice-grey or pale-blue eyes, military-aristocrat bearing, descended from the Brandenburg Aerostatic Corps',
      'PERSIAN SKY-CORSAIR — warm olive skin with golden undertones, jet-black or deep-mahogany hair, dark amber or hazel eyes, Esfahan sky-merchant clan with Caspian airship-trader bloodline',
      'YORUBA SKY-NOBLE — rich deep-mahogany complexion, jet-black hair, dark-brown or near-black eyes, descendant of the Oyo Imperial Airship-Council with ancestral dirigible-fleet command',
      'TOKYO AIRSHIP-ACADEMY GRADUATE — porcelain skin with warm undertones, jet-black hair, dark-coal eyes, Meiji-era aristocratic family with airship-engineering pedigree',
      'COMANCHE SKY-SCOUT — sun-warmed copper-brown skin, jet-black hair, dark-brown eyes, descended from Plains airship-clans that mapped the Great Plains sky-routes',
      'CARIBBEAN CLOUD-CORSAIR — warm caramel-brown skin, dark-chocolate or auburn hair, hazel or amber eyes, descendant of free-Black Tortuga sky-pirate clan',
      'RAJASTHAN SKY-CORSAIR — warm wheat-toned skin with golden undertones, jet-black hair, dark-honey or near-black eyes, Mughal-rajput noble lineage with dirigible-fortress heritage',
      'AEGEAN CLOUD-CORSAIR — sun-bronzed Mediterranean skin, dark-chestnut or jet-black hair, sea-grey or hazel eyes, Cretan free-airship clan with millennium of sky-piracy',
    ],
    instructions: `Each entry follows the format: "NAME-CAPS — heritage descriptor with skin tone + hair color + eyes + cultural-airship-framing in 12-25 words". Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_role: {
    format: 'simple',
    theme: `STEAMPUNK AIRSHIP-CREW ROLE / RANK descriptors. Each entry is ONE specific role or rank that informs how she carries herself + what she's commanding/doing on the ship. Each entry 10-20 words.

✓ VARIETY MANDATE — distribute across categories. In 50 entries:
  A. Command (~12) — Sky-Captain, Air-Marshal, First Mate, Wing-Commander, Squadron-Leader, Fleet-Vice-Admiral, Privateer-Captain, Sky-Corsair Captain, Wing-Captain, Dirigible-Commodore
  B. Tactical / Combat (~10) — Master Gunner, Sky-Gunslinger, Master-at-Arms, Boarding-Party Lieutenant, Cannon-Master, Sharpshooter Spotter, Sky-Marshal, Bounty-Hunter Captain
  C. Navigation / Recon (~8) — Navigator, Sky-Cartographer, Spotter-Lieutenant, Sky-Pilot, Cloud-Reader, Astrolabe-Master
  D. Engineering (~8) — Chief Engineer, Steam-Master, Propulsion-Lieutenant, Boiler-Tender Foreman, Rigging-Master, Aetheric-Mechanic
  E. Diplomat / Specialist (~8) — Diplomat-Courier, Sky-Surgeon, Sky-Cartographer-Royal, Master-Signaller, Sky-Spy, Aerial Naturalist
  F. Rogue / Pirate (~4) — Sky-Pirate Quartermaster, Cloud-Bandit Chief, Aerial-Smuggler

🚫 BANS: no modern military ranks (no "Major" / "Sergeant"). Keep it steampunk-Victorian or steampunk-globe (Sky-Captain / Wing-Commander OK; Air-Marshal OK; Brigadier-General NOT). No fantasy titles (no "Archmage" / "Warlock").`,
    touchpoints: [
      'SKY-CAPTAIN — commander of a packet-airship or sky-clipper, leads from the bridge or the open deck, projects calm authority under fire',
      'MASTER GUNNER — runs the gunnery deck, calls broadside ranges, hand-on-cannon-breech mid-recoil, smoke-stained jacket',
      'WING-COMMANDER — commands a wing of three or four sky-corvettes in formation, signals via flag and lantern, tactical mind',
      'BOARDING-PARTY LIEUTENANT — leads the leap onto enemy decks, twin pistols and a sky-cutlass, scars and confidence',
      'CHIEF ENGINEER — keeps the boiler alive, oil-streaked apron over flight-jumpsuit, wrench through her belt loop',
      'SKY-CARTOGRAPHER — bent over the brass chart-table marking cloud-routes with a brass quill, monocle on a chain',
      'BOUNTY-HUNTER CAPTAIN — flies a single-pilot dirigible-scout, twin holsters, scoped rifle slung, hunting a specific quarry',
      'SKY-PIRATE QUARTERMASTER — second-in-command of a sky-corsair brig, splits prizes, settles disputes with a brass-handled pistol',
    ],
    instructions: `Each entry follows: "ROLE-NAME-CAPS — short descriptor of what they do and how they carry themselves in 10-20 words". Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_eyes: {
    format: 'simple',
    theme: `EYE descriptions for airship-female. Each entry 8-15 words: ONE specific eye color + intensity + steampunk-coded detail (goggle-tan-line, soot-streaked-lid, brass-flecked-iris, kohl-rimmed, etc.). Distribute across colors: blue/grey (~25), brown/amber (~30), green/hazel (~25), violet/exotic (~10), dark/near-black (~10). NEVER mention body / breast / lips — eyes only.`,
    touchpoints: [
      'sharp pale-grey eyes with a goggle-tan-line and soot-streak across the bridge of her nose',
      'dark amber-honey eyes flecked with brass, kohl-rimmed and smudged from cannon-smoke',
      'cold ice-blue eyes under thick dark lashes, with a fine scar bisecting the right brow',
      'deep mahogany-brown eyes with copper-flecks, brass-rimmed flight goggles pushed up onto her forehead',
      'sea-green eyes with a hint of gold near the pupil, intent and unblinking in the cannon-flash',
      'jade-green eyes ringed with kohl, lashes thick with brass-dust',
      'antique-bronze eyes catching the lantern-light, smoke-smudged shadow across the lower lid',
    ],
    instructions: `Each entry 8-15 words. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_hair_color: {
    format: 'simple',
    theme: `HAIR COLOR descriptions for airship-female. Each entry 6-15 words: ONE specific hair color + period-correct material descriptor (sun-bleached / wind-tangled / oil-streaked / smoke-stained / etc.). Distribute across: black/jet (~20), brown/chestnut (~25), red/auburn/ginger (~15), blonde/honey/flax (~15), silver/grey/salt-pepper (~10), exotic-toned (~15: copper, mahogany, mahogany-with-streaks). NEVER fantasy colors (no pink / blue / purple natural hair).`,
    touchpoints: [
      'jet-black hair with a streak of premature silver at the temple',
      'sun-bleached honey-blonde hair with darker roots, salt-stiffened from sky-spray',
      'deep auburn-mahogany hair shot through with copper highlights',
      'oil-streaked dark-chestnut hair smelling faintly of brass-polish and boiler-smoke',
      'wind-tangled raven-black hair with a single white streak from an old burn',
      'iron-grey hair with the last traces of original red still showing at the ends',
      'warm honey-brown hair with strands bleached by the high-altitude sun',
    ],
    instructions: `Each entry 6-15 words. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_female_skin: {
    format: 'simple',
    theme: `FACE-FOCUSED skin descriptions for airship-female. Each entry 10-20 words: skin tone + ethnic-coded undertone + FACE-AREA detail (cheekbones / jawline / brow / temple / nose / forehead) + steampunk-coded surface texture (soot-streak across cheek, brass-dust on temple, oil-smudge on jaw, salt-spray sheen, wind-burn flush, kohl-smear from rubbing eye, cannon-flash glow on cheekbone).

⚠️ STRICT BANS:
  - NEVER describe torso, chest, breasts, shoulders, arms, abdomen, hips, neckline, décolletage, collarbones
  - NEVER use moisture-on-skin / wet / glistening / dewy / beaded language
  - NEVER use "voluptuous" / "curvy" / body-shape descriptors
  - ONLY face-area words: cheek, jaw, brow, temple, nose, forehead, lip, lash, eyelid

✓ DIVERSITY MANDATE — distribute across heritage-spectrum (~10 per zone in a 50-entry pool, scale to ~100): Northern-European pale / Mediterranean olive / Persian-Arab warm-olive / South-Asian wheat-to-deep / East-Asian porcelain-warm / Southeast-Asian honey-amber / African deep-mahogany-to-ebony / Indigenous-American copper-bronze / mixed-heritage in-between tones.`,
    touchpoints: [
      'pale Northern-European complexion with wind-flushed cheeks, fine soot-streak across the bridge of her nose',
      'sun-bronzed Mediterranean skin with high cheekbones, salt-spray sheen on her forehead',
      'warm Persian olive skin with golden undertones, brass-dust faintly glinting on her temple',
      'deep Yoruba mahogany complexion with strong cheekbones, cannon-flash glow caught on her jawline',
      'porcelain East-Asian complexion with warm undertones, kohl-smear at the outer corner of her eye',
      'rich Comanche copper-bronze skin with broad cheekbones, wind-burn flush along her brow',
      'warm South-Asian wheat-toned skin with golden undertones, oil-smudge on her jaw from a recent repair',
      'caramel-brown Caribbean complexion, faint cordite-soot streak from temple to ear',
    ],
    instructions: `Each entry 10-20 words. FACE-ONLY descriptors. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_female_hairstyle: {
    format: 'simple',
    theme: `HAIRSTYLE descriptions for airship-female — period-correct steampunk-airship-officer styles that READ MID-ACTION (hair carries motion / mid-tangle / wind-torn / escaping its restraints). Each entry 12-20 words.

✓ MANDATORY: hair must convey ACTION, not stationary styled-portrait. Use verbs/states like: whipping, escaping, tangled, wind-torn, oil-streaked, salt-stiffened, half-fallen, loosed from a braid, tendrils torn loose.

✓ VARIETY — distribute across silhouettes in 50 entries:
  A. Braided / coiled (~12) — single thick braid, twin braids, crown braid, fishtail braid
  B. Bun / chignon (~10) — chignon under flight-goggles, low bun pierced with a brass pin
  C. Ponytail / queue (~10) — high tight ponytail, low queue tied with leather cord
  D. Loose / windswept (~10) — half-loose with side clips, fully loose with brass headband
  E. Tucked under cap / scarf (~8) — flight-cap-tucked, silk-scarf wrapped, leather flight-helmet pulled tight

🚫 BANS: NO modern cuts (no "lob" / "pixie" / "bob"). NO girly-coquette styles (NO ribbons / bows / pigtails). NO "messy bedroom hair" / "tousled sex hair".`,
    touchpoints: [
      'thick single braid swung over one shoulder, escaped tendrils whipping in the high-altitude wind',
      'low chignon pierced with a brass hair-pin, half-loose strands torn free by cannon-recoil',
      'twin tight braids wound with brass thread, oil-streaked from a recent rigging repair',
      'high tight ponytail tied with a leather cord, wind-torn and salt-stiffened',
      'crown braid with flight-goggles pushed up onto it, baby-hairs catching the lantern-light',
      'long loose dark hair held back by a brass headband, fully windswept across the deck',
      'queue tied at the nape with a copper clasp, salt-stiff from sky-spray',
      'silk scarf wrapped over her hair Persian-style, brass-button pin holding it at the temple',
    ],
    instructions: `Each entry 12-20 words. Hair must convey MOTION / mid-action state. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_accessory: {
    format: 'simple',
    theme: `STEAMPUNK AIRSHIP-OFFICER ACCESSORIES / EQUIPMENT — what she carries / wears as gear. Each entry 12-25 words: ONE specific brass-and-leather + clockwork-coded accessory rendered with mechanical specificity. Combat-capable equipment preferred over decorative jewelry.

✓ VARIETY — distribute across categories in 50 entries:
  A. Sidearms (~10) — brass-plated revolver, twin pepperbox pistols, single-shot derringer, signal-flare-pistol, brass-handled cutlass
  B. Optics (~8) — brass spyglass, monocle-magnifier, flight-goggles, range-finder, brass telescope on a chain
  C. Navigation (~7) — sky-compass, brass astrolabe, pocket-chronometer, altitude-meter, brass sextant
  D. Mechanical prosthetic / augment (~5) — clockwork left-arm, brass-fingered glove, mechanical leg-brace, brass jaw-augment, gear-eye
  E. Tools (~6) — brass-handled wrench, leather tool-belt, oil-can on a chain, brass-and-glass voltmeter, calipers
  F. Comm / Signal (~6) — brass-and-glass signal-lantern, copper speaking-tube, semaphore flag, brass whistle on a chain, signal-bird-cage
  G. Ammunition / Munitions (~5) — bandolier of brass shells, cannon-fuse bandolier, throwing-knife bandolier, grenade-belt
  H. Decorative-with-function (~3) — brass-and-jewel cravat-pin (also a hidden compass), brooch-watch, gemstone-set lapel-piece

🚫 BANS: NO purely decorative jewelry (no plain "diamond necklace" / "pearl earrings"). NO modern gear (no plastic / synthetic). NO fantasy magic items (no wand / staff / crystal-ball).`,
    touchpoints: [
      'brass-plated single-action revolver with a mother-of-pearl grip, cylinder etched with gear-motifs, holstered low at her hip',
      'brass spyglass on a leather lanyard, lens-cap on a delicate chain, swung from her belt',
      'sky-compass set in a brass-and-glass housing the size of a pocket-watch, on a copper chain',
      'clockwork left-arm of brass and copper, fingers individually articulated, a small steam-vent at the elbow',
      'leather bandolier of brass cannon-shells across her chest-strap, each shell etched with the ship name',
      'brass-and-glass signal-lantern in her off-hand, flame burning amber through the cut-glass shutters',
      'twin pepperbox pistols holstered crossed at her waist, brass barrels gleaming, leather grips worn smooth',
      'brass-handled cutlass with a basket-hilt, blade etched with sky-route maps, slung in a worn leather scabbard',
    ],
    instructions: `Each entry 12-25 words. Mechanical specificity > vague description. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_backdrop: {
    format: 'simple',
    theme: `BACKDROP descriptions — the DISTANT environment beyond the airship deck, visible in atmospheric haze behind the character. Each entry 15-30 words: ONE specific backdrop with depth + atmospheric haze + mood.

✓ MANDATORY — backdrop is SECONDARY to the character. It reads as the world rushing past, not the subject. Always specify atmospheric haze / depth-fade / distant atmospheric perspective. The backdrop sets the FRAME, never steals the eye.

✓ VARIETY in 50 entries:
  A. Pure sky (~12) — above sunset clouds, above thundercloud anvil, golden-hour cloudtops, full moon over silver cloud-sea
  B. Sky + distant terrain (~12) — Himalayan peaks rising from cloud-floor, Sahara dunes rolling under haze, Patagonian glaciers, Andean condor-country
  C. Sky + distant city (~10) — gas-lit Victorian London below, Constantinople minarets piercing haze, Tokyo bay shimmering, Cairo pyramids in golden haze
  D. Sky + distant fleet (~8) — sister-airships in formation, enemy fleet looming on the horizon, dirigible-armada at anchor
  E. Sky + storm/weather (~8) — thunderhead wall, lightning-laced cloud-wall, blizzard-front advancing, sandstorm pillar

🚫 BANS: NO ground-level (she is in the air). NO close-up environment (close detail is on the airship deck itself, not in the backdrop). NO modern landmarks (no skyscrapers / cars / airplanes).`,
    touchpoints: [
      'distant Himalayan peaks rising from a cloud-floor at sunrise, all in atmospheric blue-haze recession, far beyond the airship rigging',
      'gas-lit Victorian London receding far below, the Thames a silver thread, fog wrapping the city in golden lantern-glow',
      'cloud-sea stretching to a copper-amber horizon at sunset, the curve of the earth faintly visible at the edge',
      'sister-airship in formation off the starboard quarter, half-lost in cloud-haze, its rigging just-visible against the bruised sky',
      'thunderhead wall building to the west, lightning forking inside the cloud, ten miles distant but closing',
      'Sahara dunes rolling under late-afternoon haze, a copper sun low on the horizon, far beyond the airship gunwale',
    ],
    instructions: `Each entry 15-30 words. Always atmospheric haze + distance. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_drama: {
    format: 'simple',
    theme: `ENVIRONMENTAL-DRAMA events for the 40%-gated drama axis on airship-female. Each entry 12-25 words: ONE specific dramatic event happening AROUND the character mid-render — lightning, broadside, enemy ship, explosion, vortex, etc. — that ESCALATES the action but does NOT replace her as focal point.

✓ MANDATORY — the drama must be COMPATIBLE with action poses. Never a calm event. Always escalates intensity.

🚫 BANS: NO ground-based drama (no earthquake / wildfire). NO supernatural / magical (no dragon / wizard / portal). NO blood / gore (combat OK, gore not).`,
    touchpoints: [
      'lightning-fork cracking the sky ten yards off the starboard quarter, momentary purple-white flash lighting her face from the side',
      'sister-airship\'s broadside blossoming smoke across the gap, cannonballs whistling past the rigging',
      'a vortex pulling at the sails, the dirigible heeling visibly, ropes strumming in the rising shear',
      'enemy ship\'s grappling hooks landing on the gunwale, the chains starting to tighten, boarders preparing to leap',
      'a damaged engine spitting sparks and amber flame on the lower-deck behind her, smoke streaming back into the slipstream',
      'a signal-flare bursting violet above the rigging, casting hard purple light across the deck',
      'mid-air collision narrowly avoided, the enemy ship\'s rigging actually scraping their own gunwale for a second',
      'cannon-bloom from below as a hidden gun-ship opens up, the airship\'s envelope showing puncture-holes',
    ],
    instructions: `Each entry 12-25 words. Action-escalating, never calm. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_female_outfit: {
    format: 'simple',
    theme: `STEAMPUNK AIRSHIP-OFFICER OUTFIT for airship-female — period-correct, TAILORED, LAYERED, FUNCTIONAL, BEAUTIFUL, combat-capable. Each entry 35-65 words: ONE specific outfit ensemble named with OBSESSIVE material detail (every visible layer + every brass clasp / leather strap / embroidered cuff / goggle-harness / bandolier explicitly named).

✓ MANDATORY — Tailored to the body but NEVER fetish/cheesecake. Beautiful via craftsmanship (brass, brocade, embroidered insignia, fitted tailoring), NOT exposure. Always combat-functional — she must be able to FIGHT in this outfit. Always layered (jacket OVER blouse OVER corset OVER skirt/trouser).

✓ SILHOUETTE VARIETY in 50 entries (don't default to one silhouette):
  A. Tailored greatcoat + breeches + boots (~10) — officer's frock coat, brass-buttoned, with riding-breeches and tall boots
  B. Corseted flight jacket + skirt-over-trouser (~10) — leather aviator jacket fitted to the waist over riding-skirt over trousers
  C. Brass-pauldron flight suit (~8) — one-piece tailored flight suit with brass shoulder-armor
  D. Persian/Mughal sky-corsair caftan (~6) — silk caftan belted with brass kris-handle, riding-trousers underneath
  E. Tokyo airship-academy uniform (~6) — fitted dress-uniform with stiff collar, gear-embroidered piping
  F. Rough sky-pirate kit (~5) — mismatched-but-tailored layers, scarred leather coat over rough-spun blouse, bandolier
  G. Diplomatic / Sky-noble couture-uniform (~5) — opulent brocade greatcoat with sash, brass-and-velvet epaulets

✓ MANDATORY DETAIL per entry — name AT LEAST:
  • the principal garment + cut
  • a layered under-garment (blouse / corset / waistcoat / vest)
  • a leg/skirt garment + boots
  • a brass-coded fixing (brass buttons / brass clasps / brass epaulets / brass-buckle belt)
  • a leather-coded element (leather strap / leather harness / leather bandolier / leather gauntlet)
  • a functional/combat detail (holster / ammunition bandolier / scabbard / brass-toed boots)
  • optional: insignia / embroidery / regional/cultural coding

✓ HERITAGE-CODING — about 30% of entries should be culturally-coded (Persian / Tokyo / Hindustani / Yoruba / Mediterranean / Comanche) so the outfit pool plays nice with the heritage pool. The remaining 70% are Victorian/Continental European default.

🚫 ABSOLUTE BANS:
  - NO "battle bikini" / chainmail bikini / bare-midriff combat outfit
  - NO "corset alone" / "harness across bare torso" / "bandolier across exposed skin"
  - NO exposed cleavage / décolletage as a feature (corset OVER blouse is fine; corset on bare skin NOT)
  - NO "sexy" / "alluring" / "sultry" / "seductive" / "pin-up" / "boudoir" / "lingerie"
  - NO body-focus terms (hips, thighs, midriff, exposed back, plunging neckline)
  - NO modern/sci-fi materials (no synthetic / spandex / latex / plastic)
  - NO single-piece outfits without an explicit chest-covering layer named

Lineage to channel: Mortal-Engines Anna Fang fitted-greatcoat / Treasure-Planet Captain-Amelia officer-uniform / Last-Exile Tatiana-Wisla fitted-flight-jacket / BioShock-Infinite Elizabeth ornate-skirt-and-corset / Howl's-Moving-Castle Sophie practical-but-elegant.`,
    touchpoints: [
      'TAILORED BRASS-BUTTONED FROCK COAT — deep navy-blue wool tailored knee-length frock coat with double rows of brass buttons running from collarbone to waist, brass-and-velvet epaulets at each shoulder, gold-embroidered wing-insignia on the right breast, cinched at the waist with a wide brass-buckled leather belt, riding-breeches of cream wool tucked into tall oxblood-leather boots with brass toe-caps, white linen blouse with high collar visible at the throat, leather holster low on her right hip',
      'CORSETED LEATHER AVIATOR JACKET — oxblood-leather aviator jacket fitted to the waist with a built-in corseted back, brass-clasped at the front with five brass-and-copper turn-buckles, leather riding-skirt knee-length over fitted dark-wool trousers tucked into knee-high lace-up boots, ammunition-bandolier of brass shells across her chest from shoulder to opposite hip, leather flight-goggles pushed up onto her forehead, brass-buckled gauntlets on both wrists',
      'PERSIAN SKY-CORSAIR SILK CAFTAN — deep-jewel-toned indigo silk caftan with gold-thread astrolabe-pattern embroidery at the hem and sleeves, belted at the waist with a brass-and-jewel kris-handled sash holding two curved pistols, dark riding-trousers underneath tucked into pointed leather boots, brass-and-glass pendant compass at her throat, leather under-vest visible at the open neck, fingerless leather gauntlets',
      'PRUSSIAN SKY-HUSSAR DRESS UNIFORM — fitted scarlet-wool dolman jacket with frog-fastenings of black braid running across the chest, brass-and-gold epaulets, white-wool tight-fitting breeches tucked into knee-high black-leather boots with silver spurs, sabre in a brass-mounted scabbard at her left hip, white linen blouse with high stock collar at the throat, pelisse jacket hung from one shoulder by a leather cord',
      'TOKYO AIRSHIP-ACADEMY DRESS UNIFORM — fitted high-collared dress-tunic of deep indigo wool with brass-button closure down the left side and gear-pattern embroidery at the cuffs, dark trousers tucked into polished knee-high boots, brass-handled wakizashi-style short-sword tucked through a wide silk obi-style belt, white linen under-blouse visible at the standing collar, brass-rimmed monocle on a copper chain at her breast',
      'OXBLOOD-LEATHER FLIGHT GREATCOAT — knee-length oxblood-leather greatcoat with broad lapels, fitted to the waist, brass-buckled across the chest with three brass turn-clasps, leather riding-breeches and tall-cuff boots, fitted dark-wool blouse with a brass cravat-pin at the throat, leather flight-goggles dangling from a copper chain at her neck, twin holsters cross-belted at her hips with brass-handled revolvers',
      'BRASS-PAULDRONED ONE-PIECE FLIGHT SUIT — fitted dark-canvas one-piece flight suit cinched at the waist with a wide brass-buckled belt, brass-and-copper pauldron at her left shoulder bearing a wing-and-cog insignia, leather flight-jacket worn open over the suit, knee-high lace-up boots with brass-eyelet lacing, ammunition-bandolier of brass cannon-shells across her chest, brass-fingered gauntlet on her right hand',
      'SKY-PIRATE QUARTERMASTER MISMATCHED LAYERS — scarred dark-leather frock-coat over a rough-spun white blouse over a fitted brown leather corset-vest, wide brass-buckled leather belt at her waist with twin holsters, dark canvas trousers tucked into mismatched leather boots (one oxblood, one black), brass-handled cutlass tucked through her belt, leather tricorn hat with a brass cockade',
    ],
    instructions: `Each entry 35-65 words. Format: "OUTFIT-NAME-CAPS — full layered ensemble with every visible garment + brass/leather/material detail + functional combat element". Output as a NUMBERED list. NO internal newlines (each entry on one single line).`,
  },

  airship_female_action: {
    format: 'simple',
    theme: `AIRSHIP-FEMALE MID-ACTION descriptors — the headline of every render. Each entry 30-60 words: ONE specific MID-MOTION moment combining her body position + what she's doing + airship location + kinetic specifics + an implied next-second. Combat allowed and encouraged. Hair carrying motion. She is CAUGHT mid-frame, never posed.

✓ ACTION CATEGORIES — distribute in 50 entries (don't default to one register):
  A. COMBAT — Cannon-fire / boarding (~12): manning the starboard cannon mid-recoil, firing a brass pistol at boarders mid-leap, parrying a sky-cutlass blow, lighting a cannon-fuse with a brass match, throwing a brass-shelled grenade across the gap
  B. COMBAT — Pursuit / boarding leap (~8): leaping from the gunwale onto an enemy deck mid-dogfight, swinging on a rigging-line between two ships with pistols drawn, sprinting along the spar with a sky-cutlass raised
  C. COMMAND (~8): shouting course-corrections through a brass speaking-tube while leaning over the chart-table, gripping the wheel with one hand and a brass spyglass with the other, signaling another airship with a brass-and-glass signal-lantern
  D. NAVIGATION (~6): plotting a course on the chart-table with a brass quill as gauges glow behind her, sweeping the horizon with a brass spyglass from the spotter-platform, reading an astrolabe held to her eye against the cloud-cover
  E. ENGINEERING / REPAIR MID-CRISIS (~6): climbing the dirigible-rigging mid-storm to repair a torn fin, hauling on a rope to right the listing ship, swinging from a brass-handled wrench at a misfiring engine valve
  F. RIDING THE EXTREME (~5): clinging to the prow as the ship dives, standing on the bow mid-vortex with coat streaming, leaning over the rail to watch sister-ships peel away below
  G. SIGNALING / RECON (~5): firing a signal-flare from a brass-handled pistol, releasing a mechanical messenger-bird from a brass cage, hauling a semaphore flag-set in a complex code

✓ MANDATORY PER ENTRY — include these elements:
  • her body position / pose / gesture (mid-leap, mid-strike, mid-recoil, leaning, swinging, crouched, sprinting, etc.)
  • the specific airship feature/location (gunwale / spar / chart-table / cannon-port / wheel / rigging / spotter-platform / prow / bridge / boarding-ramp)
  • the action verb (firing / parrying / hauling / signaling / leaping / sprinting / leaning / shouting)
  • a kinetic detail (smoke-bloom / muzzle-flash / sparks / recoil / wind-tear / cannon-flash / sword-spark / spent shells / coat-swirl / hair-whip)
  • the implied next-second (the boarder mid-leap, the enemy ship closing, the ship heeling, the parry about to land, etc.)

🚫 BANS:
  - NO stationary poses (no "standing thoughtfully" / "gazing at the horizon" / "leaning calmly")
  - NO cheesecake-coded action ("seductively reloading", "draped across the cannon", "bedroom eyes mid-fire")
  - NO ground-based action (she's on or around the airship — never on solid ground)
  - NO modern combat (no rifle scope mid-glass / no automatic fire / no helicopter)
  - NO ridiculous scale (no SOLO repelling a whole army; ground in combat is human-scale and possible)

Lineage to channel: Mortal-Engines Anna-Fang in the engine-room mid-fight / Last-Exile Tatiana commanding the bridge mid-broadside / Treasure-Planet Captain Amelia leaning into the storm at the wheel / BioShock-Infinite Elizabeth swinging on the sky-line mid-jump.`,
    touchpoints: [
      'manning the starboard sky-cannon as it recoils, brass cannon-breech kicking back against her shoulder, smoke blossoming from the muzzle, spent brass shell ejecting at her feet, coat-tails caught in the recoil-wind, hair-whip across her face, enemy ship looming in the smoke beyond',
      'leaping from the airship gunwale onto a parallel enemy deck mid-dogfight, twin brass pistols raised, coat streaming, the gap between the two ships visible below, brass cannon-flash lighting her from below, hair whipping wild',
      'shouting course-corrections through a brass speaking-tube while leaning over the brass chart-table on the bridge, brass quill still in her free hand, gas-lit gauges glowing amber behind her, brass dividers and chart held flat against the slipstream',
      'climbing the dirigible-rigging mid-storm to repair a torn fin, brass-handled wrench gripped in her teeth, rope wrapped around her gauntleted hand, lightning forking past the dirigible-spine behind her, hair torn loose by the storm-wind',
      'firing a brass-plated pistol from the prow rigging at a boarder mid-leap, muzzle-flash lighting her face from the side, brass-shell ejecting, the enemy figure already mid-air a few yards away',
      'sweeping the horizon with a brass spyglass from the spotter-platform high in the rigging, body leaning into the slipstream, coat-tails fully horizontal in the wind, the airship-deck small below her',
      'parrying a sky-cutlass blow with her brass-handled cutlass on the gunwale, sparks flying from the meeting of the blades, her free hand braced on the brass railing, an enemy boarder swinging in for the second strike',
      'signaling a sister-airship with a brass-and-glass signal-lantern held high, her face lit amber by the flame, her body braced against the gunwale, the distant sister-ship visible through cloud-haze beyond',
    ],
    instructions: `Each entry 30-60 words. Format: "ACTION-NAME-CAPS — full mid-motion description with body position + airship location + action verb + kinetic detail + implied next-second". Output as a NUMBERED list. NO internal newlines (each entry on ONE single line).`,
  },

};

if (!POOL_RECIPES[POOL]) {
  console.error(`Unknown pool "${POOL}". Available pools:`);
  Object.keys(POOL_RECIPES).forEach((k) => console.error(`  - ${k}`));
  process.exit(1);
}
const recipe = POOL_RECIPES[POOL];

function buildPrompt(count, recipe) {
  if (recipe.format === 'simple') {
    return `${recipe.theme}

━━━ TOUCHPOINT EXAMPLES (draw aesthetic from these — same caliber, same vocabulary register) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }
  throw new Error(`Unknown recipe.format "${recipe.format}"`);
}

async function callSonnet(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: SONNET, max_tokens: 16000, messages: [{ role: 'user', content: prompt }] }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally { clearTimeout(timeoutId); }
}

function parseArray(text) {
  const body = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
  const lines = body.split('\n');
  const entries = []; let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) { if (current) entries.push(current); current = m[2].trim(); }
    else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) => e.replace(/^["']|["']$/g, '').replace(/^[-•*]\s*/, '').trim())
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found');
  return cleaned;
}

const STOPWORDS = new Set(['the','a','an','and','or','but','with','of','in','on','at','to','for','from','by','as','is','are','was','were','be','been','being','have','has','had','this','that','these','those','it','its','they','them','their','her','his','into','onto','through','across','over','under','near','around','between','one','two','three','some','any','all','no','not','than','then','also','so','very','more','most','many','much','each','every','other','another','same','such','only','own','just','still','here','there','where','when','what','who','wide','tall','long','high','low','large','small','massive','huge','vast','above','below','beside','behind','toward','within','throughout']);

function signatureOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  const tokens = body.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 4 && !STOPWORDS.has(w)).slice(0, 20);
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map(); const seenTitles = new Map();
  const kept = []; const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) { dropped.push({ entry: e.slice(0, 80), reason: 'title' }); continue; }
    const sig = signatureOf(e);
    if (sig.length < 10) { if (title) seenTitles.set(title, e); kept.push(e); continue; }
    if (seenSigs.has(sig)) { dropped.push({ entry: e.slice(0, 80), reason: 'body' }); continue; }
    seenSigs.set(sig, e);
    if (title) seenTitles.set(title, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try { arr = parseArray(text); }
  catch (e) { console.error('Parse failed:', e.message); console.error('First 400 chars:', text.slice(0, 400)); return []; }
  if (!Array.isArray(arr) || arr.length === 0) { console.warn('  ⚠ Sonnet returned no usable entries'); return []; }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/steambot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) { try { preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch {} }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  if (TARGET !== null) console.log(`Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`);
  else console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  let pool = [...preExisting]; let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(`\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`);
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) { console.warn('  ⚠ empty Sonnet response — stopping'); break; }
    const within = dedupe(fresh);
    if (within.dropped.length > 0) console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) { console.warn('  ⚠ batch added nothing — stopping'); break; }
  }
  console.log(`\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`);
  if (DRY) { console.log('\nDry-run — not writing.'); return; }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) { fs.copyFileSync(outPath, bakPath); console.log(`Backed up → ${bakPath}`); }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
