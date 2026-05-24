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
    theme: `EYE descriptions for airship-female. Each entry 8-15 words: ONE specific eye color + steampunk-coded detail (goggle-tan-line, soot-streak, brass-flecked iris, kohl-rimmed, etc.).

⚠️ COLOR DIVERSITY IS THE WHOLE POINT — most of the world has BROWN or DARK eyes. The "weathered pale-grey/blue aviator" look is the FAILURE MODE; do NOT default to it. Brown/dark eyes MUST DOMINATE. In 25 entries: ~10 brown (deep-brown / dark-brown / near-black / coffee / chestnut / mahogany), ~5 amber/honey/hazel, ~5 green/jade/sea-green, only ~5 grey/blue/steel. Pale eyes are the MINORITY here.

ONLY eyes — NEVER mention body / breast / lips.`,
    touchpoints: [
      'deep dark-brown eyes, kohl-rimmed and smudged from cannon-smoke, brass-flecked near the pupil',
      'near-black coffee eyes under thick lashes, a soot-streak across the lower lid',
      'warm amber-honey eyes flecked with gold, goggle-tan-line pressed pale at the temple',
      'rich mahogany-brown eyes catching lantern-light, a fine scar bisecting the right brow',
      'dark chestnut eyes with copper-flecks, brass-rimmed flight goggles pushed up onto her forehead',
      'jade-green eyes ringed with kohl, lashes thick with brass-dust',
      'sea-green eyes with a hint of gold near the pupil, intent in the cannon-flash',
      'sharp pale-grey eyes with a goggle-tan-line and soot-streak across the bridge of her nose',
    ],
    instructions: `Each entry 8-15 words. Brown/dark eyes MUST DOMINATE the list (at least half). Output as a NUMBERED list. NO internal newlines.`,
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
    theme: `ETHNICITY-NOUN-ANCHORED skin descriptions for airship-female. THIS IS THE PRIMARY DIVERSITY-DRIVING AXIS. Each entry 18-30 words and MUST follow the strict format: "[Ethnicity-adjective] woman with [skin tone description] and [undertone], [steampunk-coded face-area detail], [optional face-area scar/feature]."

⚠️ FORMAT IS NON-NEGOTIABLE — every entry literally STARTS with "[Nationality/Ethnicity] woman with..." so the template can pull the first comma-segment ("Japanese woman with cool ivory skin") and drop it verbatim into the opening tokens of the Flux prompt. Flux locks ethnicity from the first 5-8 tokens — if the opening says only "a woman" Flux defaults to Euro-brunette. The ethnicity-noun anchor is load-bearing.

✓ DIVERSITY MANDATE — TWO equally-important goals: (1) diverse SKIN TONES across a global cast, AND (2) enough LIGHT-HAIR-FRIENDLY heritages that blonde / red / auburn / strawberry / silver hair actually appears in renders. The render template derives hair color from the heritage, so a pool that is all non-European heritages = every woman a dark brunette (the exact failure we are fixing). Distribute roughly per ~25 entries:
  • Northern & Eastern European LIGHT-HAIR heritages (~30% — THE SOURCE of blonde/red/auburn/ginger/strawberry/silver hair; without these, hair never varies): Norwegian, Swedish, Finnish, Icelandic, Danish, Irish, Scottish, English, German, Polish, Russian, Ukrainian. Fair / rose / cool-pale / freckled / wind-burnt skin.
  • African / African Diaspora (~16%): Nigerian, Ethiopian, Kenyan, Yoruba, Zulu, Senegalese, Somali, Eritrean
  • East Asian (~10%): Japanese, Chinese, Korean, Vietnamese, Mongolian, Tibetan, Thai
  • South & Southeast Asian (~12%): Indian, Pakistani, Tamil, Sri Lankan, Filipina, Indonesian
  • Middle Eastern / Levantine / Persian / Mediterranean (~12%): Persian, Lebanese, Turkish, Egyptian, Moroccan, Syrian, Greek, Italian, Spanish
  • Indigenous American (~8%): Navajo, Comanche, Lakota, Cherokee
  • Pacific Islander / Latin American / Caribbean (~10%): Samoan, Maori, Fijian, Brazilian, Mexican, Colombian, Peruvian, Haitian
  • Mixed-heritage entries (~2): "Mixed-heritage woman of [Group A] and [Group B] descent, with..."

⚠️ STRICT BANS:
  - NEVER describe torso, chest, breasts, shoulders, arms, abdomen, hips, neckline, décolletage, collarbones
  - NEVER use moisture-on-skin / wet / glistening / dewy / beaded language
  - NEVER use "voluptuous" / "curvy" / body-shape descriptors
  - NEVER "exotic" / "oriental" / othering language — same dignity-of-description across all ethnicities
  - ONLY face-area words for the detail clause: cheek, jaw, brow, temple, nose, forehead, lip, lash, eyelid
  - NEVER skip the opening "[Ethnicity] woman with..." format — even one entry without it dilutes the pool

✓ STEAMPUNK-CODED FACE DETAIL examples (use one per entry): soot-streak across cheek, brass-dust on temple, oil-smudge on jaw, salt-spray sheen, wind-burn flush, kohl-smear from rubbing eye, cannon-flash glow on cheekbone, goggle-tan-line, copper-amber light bronzing her brow, lantern-glow warming her temple, gas-light catching dust along jawline.

Lineage to channel: cinematic global cast of Last-Exile / Mortal-Engines / Treasure-Planet sky-crews — every face distinct, every ethnicity rendered with dignity, the steampunk grit a costume not a substitute for identity.`,
    touchpoints: [
      'Japanese woman with cool ivory skin and subtle pink undertone, brass lamplight warming temple, fine translucent hairs along jawline.',
      'Nigerian woman with rich mahogany skin and warm undertone, cannon-flash bronzing high cheekbones, delicate scar near left eye.',
      'Norwegian woman with fair wind-burnt skin and cool rose undertone, pale freckles scattered high on her cheekbones, frost-flush across the bridge of her nose.',
      'Scottish woman with cream-pale freckled skin and neutral undertone, ruddy wind-chap across both cheeks, fine soot-streak along her jaw.',
      'Russian woman with cool porcelain skin and faint blue undertone, sharp high cheekbones catching gas-light, a healed scar through her left brow.',
      'Comanche woman with sun-warmed copper-bronze skin and warm undertone, wind-burn flush along her broad cheekbones, fine soot-streak from temple to ear.',
      'Persian woman with warm olive complexion and golden-honey undertone, brass-dust faintly glinting on her temple, sharp angle of nose lit by morning sun.',
      'Mixed-heritage woman of Korean and Senegalese descent, warm caramel skin with rose undertone, salt-spray sheen along her cheekbone, single freckle at the corner of her mouth.',
      'German woman with fair ruddy skin and warm peach undertone, light sun-freckling across her forehead, lantern-glow warming her temple.',
      'Irish woman with cream-pale skin and warm rose undertones, light freckles across the bridge of her nose, wind-burn flush across both cheeks.',
    ],
    instructions: `Each entry 18-30 words. STRICT FORMAT: "[Ethnicity-adjective] woman with [tone and undertone], [steampunk-coded face detail], [optional face feature]." The ethnicity-noun-phrase is non-negotiable — it's the first 3-4 words. Output as a NUMBERED list. NO internal newlines.`,
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

  // ═══════════════════════════════════════════════════════════
  // AIRSHIP-MALE path (2026-05-23) — male sister to airship-female.
  // Same airship-action scenes, male actors. 7 male-bespoke pools;
  // role/accessory/backdrop/drama shared from airship-female above.
  // ═══════════════════════════════════════════════════════════

  airship_male_skin: {
    format: 'simple',
    theme: `ETHNICITY-NOUN-ANCHORED skin descriptions for airship-MALE. THE PRIMARY DIVERSITY AXIS. Each entry 18-30 words, strict format: "[Ethnicity-adjective] man with [skin tone] and [undertone], [steampunk-coded male face detail], [optional weathered feature]."

⚠️ FORMAT NON-NEGOTIABLE — every entry STARTS with "[Nationality/Ethnicity] man with..." so the template drops the noun verbatim into the opening tokens. Flux locks ethnicity from the first 5-8 tokens.

✓ DIVERSITY MANDATE — two goals: (1) diverse skin tones, (2) ~30% Northern/Eastern European LIGHT-HAIR heritages (Norwegian, Swedish, Finnish, Icelandic, Danish, Irish, Scottish, English, German, Polish, Russian, Ukrainian — the SOURCE of blond/red/auburn hair). Rest globally diverse: African ~16%, East Asian ~10%, South+SE Asian ~12%, MENA+Mediterranean ~12%, Indigenous American ~8%, Pacific+Latin+Caribbean ~10%, mixed ~2.

⚠️ MALE FACE DETAIL — ONLY face-area words, MALE-coded: strong jaw, square jaw, stubble-shadow, heavy brow, broad cheekbones, sun-creased temple, weathered crease, sharp nose, scar. NEVER torso/chest/shoulders/arms. NEVER kohl/makeup/lipstick. NEVER "voluptuous/curvy". NEVER "exotic/oriental".

✓ STEAMPUNK FACE DETAIL: soot-streak across cheek, brass-dust on temple, oil-smudge on jaw, salt-spray sheen, wind-burn flush, cannon-flash glow on cheekbone, goggle-tan-line, lantern-glow warming his brow, gas-light catching stubble along the jaw.`,
    touchpoints: [
      'Norwegian man with fair wind-burnt skin and cool rose undertone, heavy brow over deep-set eyes, frost-flush across a sharp nose, faint scar through one eyebrow.',
      'Nigerian man with deep mahogany skin and warm undertone, strong square jaw, cannon-flash bronzing his broad cheekbones, soot-streak from temple to jaw.',
      'Japanese man with cool ivory skin and subtle warm undertone, sharp jaw shadowed with stubble, brass lamplight warming his temple.',
      'Scottish man with cream-pale freckled skin and neutral undertone, ruddy wind-chap across both cheeks, weathered crease at the eye, oil-smudge along the jaw.',
      'Persian man with warm olive complexion and golden undertone, heavy dark brow, sharp aquiline nose lit by morning sun, brass-dust on his temple.',
      'Yoruba man with rich deep-ebony skin and cool undertone, broad noble nose, lantern-glow on a strong cheekbone, fine ritual scar at the temple.',
      'Russian man with cool porcelain skin and faint blue undertone, hard-set jaw, gas-light catching dust along the cheekbone, healed scar through the left brow.',
      'Samoan man with deep warm-brown skin and amber undertone, broad heavy jaw, cannon-flash glow on his forehead, salt-spray sheen across the brow.',
      'German man with fair ruddy skin and warm peach undertone, square jaw with three-day stubble, sun-creased temple, lantern-glow warming his brow.',
      'Tamil man with rich dark-brown skin and warm amber undertone, sharp cheekbones, brass-dust glinting along his jaw, deep-set intent eyes.',
    ],
    instructions: `Each entry 18-30 words. STRICT FORMAT: "[Ethnicity] man with [tone and undertone], [male steampunk face detail], [optional weathered feature]." Ethnicity-noun is the first 3-4 words. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_male_eyes: {
    format: 'simple',
    theme: `EYE descriptions for airship-MALE. Each entry 8-15 words: ONE eye color + a MALE steampunk detail (goggle-tan-line, soot-streak, brass-flecked iris, weathered squint, scar-through-brow). NO kohl / NO makeup / NO eyeliner (male).

⚠️ COLOR DIVERSITY — most of the world has BROWN/DARK eyes; do NOT default to pale-grey "aviator" eyes. In 25 entries: ~10 brown (deep-brown/dark-brown/near-black/coffee/chestnut), ~5 amber/honey/hazel, ~5 green/sea-green, only ~5 grey/blue/steel.

ONLY eyes — NEVER torso/chest/lips.`,
    touchpoints: [
      'deep dark-brown eyes narrowed against the slipstream, brass-flecked near the pupil',
      'near-black coffee eyes under a heavy brow, soot-streak across the cheekbone below',
      'warm amber eyes flecked with gold, goggle-tan-line pressed pale at the temple',
      'rich mahogany-brown eyes catching lantern-light, a scar through the right brow',
      'dark chestnut eyes with a weathered squint, brass goggles pushed up on his forehead',
      'sea-green eyes sharp and intent in the cannon-flash, wind-reddened at the corners',
      'steel-grey eyes hard as a compass needle, a deep goggle-crease at each temple',
      'hazel eyes shifting green-to-gold, soot dusting the lower lid',
    ],
    instructions: `Each entry 8-15 words. Brown/dark eyes MUST dominate. NO kohl/makeup. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_male_facial_hair: {
    format: 'simple',
    theme: `FACIAL HAIR descriptions for airship-MALE — period-Victorian/steampunk, each 6-15 words. ONE specific style + a steampunk/weathered texture detail.

✓ VARIETY in 25 entries: clean-shaven sharp jaw (~5), short/3-day stubble (~5), full beard (~5: iron-grey / black / sailor / soot-flecked), mustache styles (~5: waxed handlebar / Imperial / pencil), mutton-chops & Van Dyke & goatee (~5).

✓ Tie to weathering: salt-stiffened beard, soot-flecked stubble, wax-curled mustache, wind-roughened jaw. Greys for older men.

🚫 NO modern styles (no "fade", no "soul patch"). NO fantasy. Face only.`,
    touchpoints: [
      'a neatly waxed handlebar mustache, tips curled and brass-bright with pomade',
      'a full salt-and-pepper beard, wind-roughened and salt-stiffened',
      'a sharp clean-shaven jaw shadowed faintly blue, soot-flecked along the cheek',
      'a Van Dyke goatee, precise and oil-darkened at the chin',
      'thick mutton-chop sideburns framing a strong jaw, brass-dust caught in them',
      'three-day stubble across a square jaw, soot-flecked from the engine room',
      'an iron-grey full beard cropped short, weathered and wind-tossed',
      'a trimmed Imperial mustache over a clean chin, wax-curled at the ends',
    ],
    instructions: `Each entry 6-15 words. ONE facial-hair style + weathered/steampunk texture. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_male_hair_color: {
    format: 'simple',
    theme: `HAIR COLOR descriptions for airship-MALE. Each entry 6-15 words: ONE specific hair color + period/weathered material descriptor (wind-tossed / oil-streaked / salt-stiffened / smoke-stained). SOURCE OF HAIR-COLOR VARIETY — the template pairs it with heritage.

✓ DISTRIBUTE: black/jet (~20%), brown/chestnut (~22%), red/auburn/ginger (~16%), blond/sandy/flax (~16%), silver/grey/salt-pepper (~14%), copper/mahogany (~12%). NEVER fantasy colors (no pink/blue/purple).`,
    touchpoints: [
      'jet-black hair cropped close at the sides, oil-streaked from the engine housing',
      'sandy-blond hair sun-bleached and wind-tossed across his brow',
      'deep auburn hair raked back, salt-stiffened from sky-spray',
      'iron-grey at the temples fading to dark, wind-roughened',
      'wind-tossed chestnut-brown hair with a streak of premature silver',
      'ginger hair cropped short, smoke-stained at the edges',
      'salt-and-pepper hair swept back, salt-stiff from the slipstream',
      'copper-red hair tied in a short queue, oil-darkened at the nape',
    ],
    instructions: `Each entry 6-15 words. ONE hair color + weathered descriptor. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_male_hairstyle: {
    format: 'simple',
    theme: `HAIRSTYLE descriptions for airship-MALE — period-correct steampunk-airship menswear styles that READ MID-ACTION (wind-tossed / escaping / slipstream-torn). Each entry 10-18 words.

✓ VARIETY in 25: short military crop (~6), slicked/raked back (~5), short queue/ponytail tied at nape (~5), windswept loose medium (~5), tucked under flight-cap / leather helmet (~4). MALE styles only.

🚫 NO modern cuts (no fade / man-bun / undercut-as-fashion). NO long flowing romance-cover hair. Hair conveys ACTION not stationary portrait.`,
    touchpoints: [
      'short military crop wind-flattened against his scalp in the slipstream',
      'dark hair raked back with oil, a few strands torn loose by the wind',
      'a short queue tied at the nape with a leather cord, wind-whipped',
      'windswept medium hair shoved back off his brow, flight-goggles pushed up into it',
      'close-cropped sides with the top tossed wild by the storm-wind',
      'hair tucked under a leather flight-cap, only the wind-burnt edges showing',
      'slicked-back hair coming loose mid-action, strands across his weathered brow',
      'a short sailor queue under a battered tricorn, salt-stiff and wind-torn',
    ],
    instructions: `Each entry 10-18 words. Male period style + motion. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_male_outfit: {
    format: 'simple',
    theme: `OUTFIT descriptions for airship-MALE — period-correct steampunk airship-officer/crew MENSWEAR, OBSESSIVELY layered + detailed. Each entry 30-55 words. FULLY DRESSED always (never shirtless / open-chest). The outfit is a major show.

✓ SILHOUETTE VARIETY in 25: naval frock coat + breeches + boots; leather flight greatcoat + brass pauldron + flight suit; sky-corsair longcoat + linen shirt + leather baldric + sash; riding-coat + waistcoat + cravat; canvas flight suit + harness + bandolier; dress-uniform tunic + gear-embroidered collar; weathered pirate-captain layered coat + boarding gear. Heritage-coded variants welcome (Persian sky-corsair caftan-coat over trousers, Mughal sky-officer achkan, Tokyo airship-academy tunic).

✓ MANDATORY per entry: the coat/jacket layer + what is under it (shirt/waistcoat/tunic) + trousers/breeches + boots + at least 2 brass/leather hardware details (epaulets / clasps / buckles / bandolier / goggle-harness / baldric).

🚫 NO bare chest, NO open-to-navel shirt, NO sleeveless, NO modern clothing. Brass + leather + wool + canvas + linen + copper material vocabulary.`,
    touchpoints: [
      'a double-breasted midnight-blue naval frock coat with two rows of brass anchor-buttons and gold-braid epaulets, over a white high-collar linen shirt and grey waistcoat, charcoal breeches tucked into knee-high black-leather boots, a wide brass-buckled belt with a holstered brass revolver, leather flight-goggles pushed up onto his brow',
      'an oxblood-leather flight greatcoat with five copper turn-buckle clasps and a hammered-brass pauldron at one shoulder, over a cream cotton shirt and leather waistcoat, dark trousers tucked into laced flight-boots, an ammunition-bandolier of brass shells across his chest, an articulated brass gauntlet on one hand',
      'a sky-corsair scarred longcoat of dark-brown leather over a loose linen shirt and a leather baldric, a brass-buckled sash at the waist with a cutlass through it, canvas trousers tucked into mismatched boots, fingerless leather gauntlets, a battered tricorn with a tarnished brass cockade',
      'a fitted gunmetal-grey wool officer tunic with a high gear-embroidered collar and brass toggle-buttons, over a white shirt, dark breeches and polished knee-boots, a leather cross-belt bearing a brass spyglass and a holstered pistol, brass-rimmed goggles on a copper chain',
      'a deep-crimson Mughal-cut sky-officer achkan with gold-zardozi cuffs and brass-and-ruby buttons over a fine cotton shirt, a leather waistcoat, churidar trousers tucked into embroidered ankle-boots, a broad brass-and-enamel belt with a scimitar in a jeweled scabbard',
      'a waxed-canvas hip-length flight jacket with brass turn-buckles over a grey high-collar shirt and a leather chest-harness, heavy twill trousers tucked into cuffed boots, a map-satchel on a brass-buckled strap, leather elbow-patches riveted in brass',
    ],
    instructions: `Each entry 30-55 words. FULLY DRESSED menswear: coat + under-layer + trousers + boots + 2+ brass/leather details. Output as a NUMBERED list. NO internal newlines.`,
  },

  airship_male_action: {
    format: 'simple',
    theme: `AIRSHIP-MALE MID-ACTION descriptors — the headline of every render. Each entry 30-60 words: ONE specific MID-MOTION moment combining his body position + what he is doing + airship location + kinetic specifics + an implied next-second. Combat allowed and encouraged. He is CAUGHT mid-frame, never posed.

✓ ACTION CATEGORIES — distribute in 25 entries (don't default to one):
  A. COMBAT cannon/boarding (~6): manning the starboard cannon mid-recoil, firing a brass pistol at boarders mid-leap, parrying a sky-cutlass blow, lighting a cannon-fuse with a brass match
  B. COMBAT pursuit/boarding-leap (~4): leaping from the gunwale onto an enemy deck, swinging on a rigging-line between two ships, sprinting the spar with a cutlass raised
  C. COMMAND (~4): shouting orders through a brass speaking-tube over the chart-table, gripping the wheel with a spyglass in the other hand, signaling another ship with a brass signal-lantern
  D. NAVIGATION (~3): plotting a course with a brass quill as gauges glow, sweeping the horizon with a spyglass from the spotter-platform, reading an astrolabe against the cloud-cover
  E. ENGINEERING mid-crisis (~4): climbing the rigging mid-storm to repair a torn fin, hauling a rope to right the listing ship, wrenching a misfiring engine valve
  F. RIDING THE EXTREME (~2): clinging to the prow as the ship dives, standing on the bow mid-vortex with coat streaming
  G. SIGNALING/RECON (~2): firing a signal-flare from a brass pistol, releasing a clockwork messenger-bird

✓ MANDATORY per entry: his body position/pose + the specific airship feature/location + the action verb + a kinetic detail (smoke / muzzle-flash / sparks / recoil / wind-tear / coat-swirl) + the implied next-second.

🚫 NO stationary poses, NO cheesecake/beefcake-coded action, NO ground-based action, NO modern combat, NO solo-repelling-an-army.

Lineage: Mortal-Engines engine-room fight / Last-Exile bridge mid-broadside / Treasure-Planet sky-crew in the storm / Sinbad on the rigging.`,
    touchpoints: [
      'manning the starboard sky-cannon as it recoils, the brass breech kicking back against his shoulder, smoke blossoming from the muzzle, a spent brass shell ejecting at his feet, coat-tails caught in the recoil-wind, an enemy ship looming in the smoke beyond',
      'leaping from the gunwale onto a parallel enemy deck mid-dogfight, a brass pistol in one hand and a cutlass in the other, coat streaming, the gap between the two ships visible below, cannon-flash lighting him from beneath',
      'shouting course-corrections through a brass speaking-tube while braced over the chart-table on the bridge, a brass divider still in his free hand, gas-lit gauges glowing amber behind him',
      'climbing the dirigible-rigging mid-storm to repair a torn fin, a brass wrench gripped in his teeth, rope wound around his gauntleted hand, lightning forking past the dirigible-spine behind him',
      'sweeping the horizon with a brass spyglass from the spotter-platform high in the rigging, leaning into the slipstream, coat-tails fully horizontal in the wind, the deck small below him',
      'parrying a sky-cutlass blow on the gunwale, sparks flying where the blades meet, his free hand braced on the brass railing, an enemy boarder swinging in for a second strike',
      'hauling hand-over-hand on a braided hawser to right the listing ship, body thrown back against the cant of the deck, boots braced on oil-dark planking, rain sheeting past',
      'firing a signal-flare from a brass-handled pistol at the gunwale, arm raised, the flare corkscrewing skyward trailing red smoke, his coat snapping in the wind',
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
