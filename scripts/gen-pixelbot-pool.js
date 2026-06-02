#!/usr/bin/env node
/**
 * Generate a BloomBot axis pool using Sonnet.
 *
 * Mirrors the gen-mechbot-pool.js / gen-gothbot-pool.js infrastructure:
 * signature-based dedup, --target iterative gen+dedup loop, append-mode
 * preservation of existing entries. Pool recipes are BloomBot-bespoke.
 *
 * Usage:
 *   node scripts/gen-bloombot-pool.js --pool bloombot_landscape_landform --target 30
 *   node scripts/gen-bloombot-pool.js --pool bloombot_landscape_scale_prover --target 30
 *
 * Output: scripts/bots/pixelbot/seeds/<pool>.json
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
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '30'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// BloomBot-shared aesthetic vocabulary (used across all pool recipes)
// ─────────────────────────────────────────────────────────────
//
// BloomBot's identity: pure-scenery bot where FLOWERS are the hero. Every
// entry should imply flowers but NOT name specific species (species come
// from the per-render regional roster). Hyperreal CGI register — think
// "the turtle aesthetic" — saturated, jewel-toned, multi-tier depth,
// cinematic. NO PEOPLE in any entry, ever. Wildlife only as peripheral
// accent (hummingbird / bee / butterfly / small lizard).
//
// Cross-path bans (so each path stays in its lane):
//   - NO interiors/rooms/sunrooms (cozy's territory)
//   - NO archways/passages/tunnels (garden-walk's territory)
//   - NO surreal/gravity-defying/impossible (dreamscape's territory)
//   - NO glass-and-iron conservatory architecture (conservatory's territory)
//   - NO city streets/urban architecture (city-flowers' territory)
//   - NO ruins/abandoned structures (reclaim's territory)
//   - NO macro/closeup framing (closeup's territory)

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — BloomBot bespoke (landscape path, 2026-05-16)
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ─── jrpg-combat path (2026-05-20 axis-system migration) ───
  pixelbot_jrpg_combat_open_world_setting: {
    format: 'simple',
    theme: `OPEN-WORLD JRPG SETTING for the PixelBot jrpg-combat path. Each entry describes ONE specific outdoor / open-world setting where the party fights a monster — forest clearing / mountain pass / grassland / ruined temple / dungeon-with-skylight / lakeshore / snowy plain / desert oasis / cave-with-crystal-light / etc. Top-down or 3/4-iso framing implied. Each entry 25-50 words.

⚠️ THE BAR: every entry produces an OPEN-WORLD play-area — outdoor or dungeon-with-skylight setting that the party traverses. Tile floor / ground visible as the play-floor. NOT walled-arena (different from boss-arena).

⚠️ SETTING CATEGORIES — distribute the 25 entries:
  • ~4 FOREST — forest clearing / glade / forest-path / haunted-forest
  • ~3 MOUNTAIN — mountain pass / alpine meadow / cliff-edge / mountainside
  • ~3 GRASSLAND — open grassland / meadow / steppe / rolling hills
  • ~3 RUINED TEMPLE / RUINS — temple courtyard / ancient ruin / fallen-pillar plaza
  • ~3 DUNGEON-WITH-SKYLIGHT — cave-with-shaft / partially-collapsed-dungeon / open-roof crypt
  • ~2 LAKESHORE / RIVER — lakeshore / riverbank / pond clearing
  • ~2 SNOWY / FROZEN — snowy plain / frozen lake / tundra
  • ~2 DESERT / OASIS — desert oasis / desert plain / sand dunes
  • ~2 BEACH / COAST — beach with waves / coastal cliff
  • ~1 SWAMP — swamp clearing / bog
  • ~1 VOLCANIC OUTDOOR — lava-field / volcanic plain

⚠️ EVERY entry MUST include:
  - SPECIFIC SETTING TYPE
  - TILE FLOOR / GROUND detail (grass / stone / sand / forest-floor / etc.)
  - SETTING LANDMARKS at the periphery (trees / ruins / cliffs / etc.)
  - OPEN-WORLD feel (sky visible OR skylight if dungeon, NOT walled-arena)
  - SIGNATURE PALETTE / ATMOSPHERE

🚫 STRICT BANS:
  • NO party / monster / spell description (separate axes)
  • NO walled-arena framing (different path)
  • NO interior-throne-room framing
  • NO IP / UI / sexualized content`,
    touchpoints: [
      'FOREST CLEARING BATTLE-FIELD — top-down on a sunlit forest-clearing with grass-tile floor, surrounding ancient oak-trees at the perimeter, dappled-light from canopy above, dirt-path winding through, ferns and small flowers, open sky visible at the top',
      'HAUNTED FOREST GLADE — 3/4-iso angled-down on a moonlit haunted-forest glade with mossy-stone tile floor, twisted dead-trees ringing the space, fog drifting at floor-level, owl-silhouettes implied in the trees, eerie blue-grey palette',
      'OAK GROVE WITH RUNES — top-down on an oak-grove glade with grass-tile floor and ancient rune-stones in a circle, towering oaks at the perimeter, dappled-light through canopy, magical golden-green ambient',
      'ENCHANTED FOREST PATH — 3/4-iso on a dirt-path through an enchanted-forest with magical mushroom-clusters along the edges, glowing-firefly particles in the air, soft magical-green ambient',
      'MOUNTAIN PASS CLIFFSIDE — top-down on a rocky-stone cliff-side path with cliff-edge dropping off, snow-capped peaks visible at the parallax midground, golden-amber late-light, dust-particles drifting',
      'ALPINE MEADOW BATTLE — top-down on an alpine-meadow grass-tile floor with wildflower-bloom carpet, mountain peaks rising at the perimeter, distant glacier visible, crisp blue-white ambient',
      'CLIFFSIDE LEDGE ARENA — 3/4-iso on a stone-cliffside ledge play-area, mountain wall on one side, dramatic cliff-edge dropping off on the other, distant peaks in haze, warm-amber lighting',
      'OPEN GRASSLAND PLAIN — top-down on a vast grassland-tile floor with scattered wildflowers and rolling distant hills, sky visible in the far backdrop, gentle breeze implied through grass-motion-pixels',
      'STEPPE WITH DISTANT MOUNTAINS — 3/4-iso on a steppe grass-tile floor with distant mountain-silhouettes in the parallax, scattered nomad-yurts visible, warm-golden ambient, dust-particles drifting',
      'ROLLING HILLS MEADOW — top-down on rolling-hill grass-tile play-area with patchwork flower-clusters, distant farms in the parallax midground, blue-cyan sky above, warm summer-day ambient',
      'RUINED TEMPLE COURTYARD — 3/4-iso on a ruined-temple courtyard with cracked-stone tile floor, fallen-pillars scattered, broken-statues at the perimeter, vine-overgrown, open sky visible above through collapsed ceiling',
      'ANCIENT RUIN PLAZA — top-down on an ancient-ruin plaza with mossy-stone tile floor, toppled pillars and broken-arches at the perimeter, sun-shafts piercing through cracks, atmospheric haze',
      'TEMPLE GARDEN OVERGROWN — 3/4-iso on an overgrown-temple-garden with stone-path tile floor, broken-fountain at one corner, vines climbing the temple walls, open sky above, mystical golden-green ambient',
      'CAVE WITH SHAFT OF LIGHT — top-down on a cave-floor stone tile play-area with a SHAFT of sunlight piercing through a ceiling-crack, stalactite-stalagmites at the perimeter, glow-mushrooms on the walls',
      'OPEN-ROOF CRYPT — 3/4-iso on an open-roof crypt with cracked-flagstone tile floor, sarcophagi at the perimeter, sky visible through the collapsed-ceiling at the top, golden-amber lighting',
      'CRYSTAL CAVERN BATTLE — top-down on a crystal-cavern stone-floor play-area with glowing-crystals scattered at the perimeter, blue-magical ambient, soft glow from the crystals',
      'LAKESHORE GRASS-AND-SAND — top-down on a lakeshore play-area with grass-tile and sand-tile mixed, lake-edge at one side reflecting sky, distant mountain across the lake, warm afternoon ambient',
      'RIVERBANK WITH FORD — 3/4-iso on a riverbank with stone-ford crossing the pixel-river at the foreground, grass-banks on either side, distant forest, warm-golden ambient',
      'SNOWY PLAIN BATTLE — top-down on a snow-covered tile floor with sparse snow-covered trees at the perimeter, distant snow-capped mountains in parallax, cool-blue palette, snow-fall particles',
      'FROZEN LAKE SURFACE — top-down on a frozen-lake surface with ice-tile floor, snow-piles at the perimeter, distant mountains, snow-fall, cool-blue-white palette',
      'DESERT OASIS — top-down on a desert-oasis with sand-tile floor and central palm-trees and water-pool, distant dune-silhouettes in parallax, warm-amber ambient, dust-particles drifting',
      'DESERT PLAIN BATTLE — 3/4-iso on a vast sand-plain with sand-tile floor, scattered cacti and bones, distant mesa-silhouettes in parallax, warm-orange ambient',
      'BEACH WITH WAVES — top-down on a sandy beach play-area with sand-tile floor and gentle waves crashing on the foreground edge, distant cliff in parallax, blue-cyan ambient, gull-silhouettes in sky',
      'SWAMP CLEARING — top-down on a swamp-clearing with mossy-wet stone-tile floor, gnarled cypress-trees at the perimeter, glowing will-o-wisps drifting, fog at ground-level, sickly-green ambient',
      'VOLCANIC OUTDOOR PLAIN — 3/4-iso on a volcanic plain with black-volcanic-stone tile floor and glowing magma-cracks, distant erupting volcano in parallax, fire-red ambient, ember-fall particles',
    ],
    instructions: `Each entry is ONE specific OPEN-WORLD JRPG SETTING, 25-50 words. Format: "SETTING NAME CAPS — setting type + tile floor + landmarks + open-world cue + palette". MANDATORY — (a) setting type, (b) tile floor, (c) landmarks, (d) open-world feel (sky/skylight visible), (e) palette. NO party/monster/spell description. NO walled-arena framing. NO IP/UI/sexual. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_jrpg_combat_monster_enemy: {
    format: 'simple',
    theme: `MONSTER ENEMY mid-ATTACK for the PixelBot jrpg-combat path. Each entry describes ONE specific 16-bit monster-sprite mid-attack on the open-world play-area. Dragon mid-fire-breath / lich casting necro-spell / forest-spirit lunging / chimera roaring / wraith-cluster swooping / stone-golem stomping / giant-wolf snarling / etc. Each entry 25-50 words.

⚠️ THE BAR: every entry produces a monster-sprite mid-attack with VISIBLE IMPACT-CUES (fire-breath / spell-burst / claw-trail / shockwave / projectile / etc.). Monster is on the play-area, mid-action, NOT static.

⚠️ MONSTER CATEGORIES — distribute the 25 entries:
  • ~3 DRAGON / WYRM — dragon mid-fire-breath / wyvern mid-dive / serpent
  • ~3 UNDEAD — lich casting / wraith-swoop / skeleton-warrior
  • ~3 GIANT-MONSTER — minotaur / cyclops / ogre mid-weapon-swing
  • ~2 SPIDER / INSECT — spider-queen rearing / centipede / scorpion
  • ~2 PLANT / NATURE — treant / vine-lasher / forest-spirit
  • ~2 ELEMENTAL — fire / ice / lightning / earth elemental mid-cast
  • ~2 GOLEM — stone-golem / iron-golem / crystal-golem mid-attack
  • ~2 BEAST — giant-wolf / dire-bear / saber-tooth mid-pounce
  • ~2 CHIMERA / HYDRA — multi-headed beast
  • ~1 HARPY / FLYING — harpy diving / griffon mid-claw
  • ~1 DEMON — demon-knight / hell-spawn mid-attack
  • ~1 ICE-GIANT / FROST-MONSTER — ice-giant mid-smash

⚠️ EVERY entry MUST include:
  - SPECIFIC MONSTER TYPE
  - MID-ATTACK POSE
  - VISIBLE IMPACT-CUE mid-air (fire-breath / spell-burst / claw-trail / etc.)
  - ON THE PLAY-AREA (not towering silhouette)

🚫 NO gore / explicit violence. NO IP. NO sexualized monsters. NO player/party description (separate axis).`,
    touchpoints: [
      'RED DRAGON MID-FIRE-BREATH — sprite-scale red dragon mid-arena rearing with wings spread, mid-fire-breath erupting from open jaws in a wide cone of orange-flame, claws gripping the play-floor, glowing-orange ember-particles',
      'BLUE FROST DRAGON FROST-BREATH — sprite-scale blue ice-dragon mid-arena with wings half-spread, mid-frost-breath erupting in a wide cone of pale-blue ice-shards, frost-particles flying outward',
      'SHADOW WYRM COILING — serpentine shadow-wyrm mid-arena coiled with mouth open in a shadow-spell-burst, dark-purple smoke-tendrils trailing, glowing-purple eyes',
      'LICH CASTING NECRO-SPELL — robed lich with skull-staff held aloft mid-cast, glowing-purple magic-circle on the floor below it, dark-magic-cloud arcing outward toward the player position, skeletal-arms raised',
      'BANSHEE MID-SCREAM — translucent banshee mid-scream with mouth open and arms thrown back, screaming-particles radiating outward in pale-green shockwave, ghostly-green ambient bleeding',
      'WRAITH SWOOPING — translucent wraith mid-swoop across the play-area, claws extended forward with ghostly-blue trail behind, glowing-white eye-points, ghostly screech implied',
      'MINOTAUR DOUBLE-AXE-SWING — massive minotaur sprite mid-arena with double-bladed greataxe swinging in a wide horizontal arc, motion-blur-pixels on the axe, mid-roar pose',
      'CYCLOPS BOULDER-THROW — towering cyclops sprite mid-boulder-throw releasing a massive boulder mid-air toward the player position, single glowing-red eye, mid-attack motion',
      'OGRE CLUB-SLAM — massive ogre sprite mid-club-slam smashing down with iron-spiked club, shockwave-cracks radiating from the impact point on the floor, dust-cloud erupting',
      'SPIDER-QUEEN WEB-SHOT — giant spider-queen sprite mid-arena rearing with web-shot streaking through the air toward the player position, eight-legs spread, web-particles drifting',
      'CENTIPEDE LUNGING — massive centipede sprite mid-arena coiled and lunging forward with mandibles snapping, segmented-body motion-blur, attack-particles erupting',
      'TREANT VINE-SLAM — massive ancient treant sprite mid-arena with branch-arms slamming down, vines erupting from the floor in a wave toward the player position, glowing-green eyes',
      'FOREST-SPIRIT VINE-LASH — ethereal forest-spirit sprite mid-arena with vine-tendrils whip-lashing toward the player, glowing-green energy-trails, magical-green ambient',
      'FIRE-ELEMENTAL FIRE-BLAST — fire-elemental sprite in humanoid silhouette mid-arena with arms raised hurling a fire-blast toward the player, ember-particles erupting, fire-red ambient',
      'ICE-ELEMENTAL FROST-NOVA — ice-elemental sprite mid-arena with arms thrown outward releasing a frost-nova shockwave across the play-area, ice-shards flying, cool-blue ambient',
      'STONE-GOLEM FIST-SLAM — massive stone-golem sprite mid-arena with one rocky-fist raised mid-slam down toward the player position, glowing-yellow eye-crystals, shockwave-cracks',
      'IRON-GOLEM CHARGE — iron-golem sprite mid-charge across the play-area with arms swinging, glowing-blue energy-vents on its body, mechanical-detail visible, sparks flying',
      'GIANT-WOLF MID-POUNCE — massive dire-wolf sprite mid-pounce toward the player position with claws extended, jaws open, fur-bristled, motion-blur trail behind',
      'SABER-TOOTH LEAP — saber-tooth-tiger sprite mid-leap across the play-area with massive fangs bared, claws extended, motion-blur trail behind',
      'CHIMERA MULTI-BREATH — chimera sprite with three different heads (lion / goat / serpent) all mid-attack — lion mid-roar, goat mid-fire-breath, serpent mid-bite, multi-attack chaos',
      'HYDRA HEAD-STRIKES — five-headed hydra sprite mid-arena with all heads in different attack poses — biting / spitting-acid / fire-breathing / cocked-back / lunging, segmented bodies coiled',
      'HARPY DIVE-ATTACK — harpy sprite mid-dive from above with claws extended toward the player position, wings outstretched, motion-blur trail',
      'GRIFFON CLAW-STRIKE — griffon sprite mid-claw-strike with one massive talon raised mid-attack, wings spread, mid-roar pose, intimidating',
      'DEMON-KNIGHT CHARGE — demon-knight sprite in spiked-armor mid-charge with massive sword raised, glowing-red eyes through the visor, demonic-energy trailing behind',
      'ICE-GIANT MID-SMASH — massive ice-giant sprite mid-club-smash with an iron-spiked club coming down, ice-shards flying on impact, frozen-breath puffing, intimidating',
    ],
    instructions: `Each entry is ONE specific MONSTER ENEMY mid-attack, 25-50 words. Format: "MONSTER NAME + ATTACK CAPS — monster type + mid-attack pose + visible impact-cue + on play-area". MANDATORY — (a) monster type, (b) mid-attack pose, (c) visible impact-cue (projectile / shockwave / breath / claw-trail), (d) on the play-area. NO gore. NO IP. NO sexual. NO player description. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_jrpg_combat_party_engagement: {
    format: 'simple',
    theme: `HERO PARTY ENGAGEMENT for the PixelBot jrpg-combat path. Each entry describes a 2-4 hero party in classic JRPG formation mid-action with VISIBLE IMPACT-EFFECTS — multiple sprites in formation, varied classes, each in mid-attack/mid-cast/mid-defense. Each entry 30-55 words.

⚠️ THE BAR: every entry produces 2-4 hero-sprites in JRPG formation, each in mid-action with VISIBLE IMPACT-EFFECTS (magic-trails / sword-arcs / arrow-trails / etc.). Classic JRPG party combat — tank + dps + healer + ranged dynamic.

⚠️ PARTY COMPOSITION VARIETY — distribute across:
  • Knight + Mage + Princess (classic FF4 cecil-rosa-rydia trio)
  • Warrior + Ranger + Cleric
  • Paladin + Mage + Rogue
  • Samurai + Monk + Druid
  • Dragoon + Mage + Cleric
  • Knight + Ninja + Princess
  • Warrior + Mage + Healer + Ranger (4-party)
  • Paladin + Mage + Cleric + Ranger (4-party)

⚠️ HERO ARCHETYPE POOL:
  - Kid in green tunic with sword raised (LttP-style)
  - Mage in blue robe staff glowing
  - Princess in white gown casting healing
  - Warrior in heavy armor mid-axe-swing
  - Ninja with shuriken drawn
  - Monk with quarterstaff mid-spin
  - Paladin in golden armor
  - Ranger with bow drawn
  - Dragoon mid-spear-thrust
  - Samurai with katana raised
  - Druid with staff casting nature
  - Cleric with mace + holy-light

⚠️ MID-ACTION + VISIBLE EFFECT MANDATORY:
  - Magic-trail (fireball / lightning / ice / healing-glow)
  - Sword/weapon-arc (motion-blur)
  - Arrow-trail (mid-flight)
  - Shield-block with deflection-sparks
  - Heal-aura glowing on party-member

🚫 STRICT BANS:
  • NO sexualized characters
  • NO gore / dismemberment
  • NO modern weapons
  • NO IP characters
  • NO single-figure (2+ heroes mandatory)`,
    touchpoints: [
      'KNIGHT-MAGE-PRINCESS TRIO — armored knight mid-sword-swing at the monster + mage in blue robe casting glowing-blue fireball mid-air toward the enemy + princess in white gown casting healing-glow on the knight, classic JRPG trio formation',
      'WARRIOR-RANGER-CLERIC PARTY — heavy-armor warrior mid-axe-swing + hooded ranger drawing bow at the back with arrow nocked + cleric mid-prayer with holy-light radiating from upraised hand, three-class JRPG party',
      'PALADIN-MAGE-ROGUE TRIO — golden-armor paladin mid-charge with warhammer + robed mage casting lightning-arc mid-air + dual-dagger rogue flanking around the monster side mid-strike, dynamic three-angle attack',
      'SAMURAI-MONK-DRUID — samurai with katana mid-slash-arc + monk with quarterstaff mid-spinning-attack + druid casting nature-magic with vine-tendrils erupting from the floor, three-class JRPG party',
      'DRAGOON-MAGE-CLERIC — armored dragoon mid-spear-thrust mid-air leaping at the monster + mage mid-cast with magic-trail + cleric casting healing-aura on the dragoon, classic JRPG combo',
      'KNIGHT-NINJA-PRINCESS — armored knight mid-shield-block + ninja with shuriken mid-throw with motion-blur trail + princess casting healing-glow on the knight, three-class JRPG party',
      'FOUR-HERO CLASSIC PARTY — kid in green tunic mid-sword-swing + mage in blue robe casting fireball + princess in white gown casting healing + warrior in heavy armor mid-axe-swing, classic FFIV-style party of 4',
      'PALADIN-MAGE-CLERIC-RANGER — golden paladin in front mid-shield-raise + mage behind casting blue-magic-arc + cleric to the side casting holy-light + ranger at the back mid-arrow-flight, full 4-party tank-dps-healer-ranged formation',
      'WARRIOR-MAGE-PRINCESS — heavy-armor warrior mid-greatsword-swing in wide arc + mage in blue robe casting lightning-arc to the enemy + princess in white gown casting healing-glow, three-class trio',
      'ROGUE-RANGER-MAGE — dual-dagger rogue mid-leap-attack from one side + hooded ranger mid-arrow-shot from the other side + mage in center casting magic-shield protecting both, triangulated attack',
      'KNIGHT-SAMURAI-MAGE — armored knight mid-charge with sword + samurai mid-katana-slash + mage mid-cast with magic-trail, three-tank-dps trio engagement',
      'DRUID-CLERIC-RANGER — druid casting vine-magic at the enemy + cleric mid-prayer with healing-aura + ranger drawing bow at the back, support-heavy party formation',
      'KNIGHT-MAGE DUO — armored knight mid-sword-swing + mage casting fireball directly behind, two-hero focused-engagement classic JRPG duo',
      'PALADIN-CLERIC DUO — golden-armor paladin mid-charge with warhammer + cleric casting holy-light radiating outward, two-hero tank-healer duo',
      'RANGER-MAGE DUO — hooded ranger mid-arrow-shot + mage mid-cast with magic-bolt, dual-ranged duo attacking the monster from a distance',
      'SAMURAI-NINJA DUO — samurai with katana mid-slash-arc + ninja with shuriken mid-throw, two-hero asian-warrior duo coordinated attack',
      'BARBARIAN-CLERIC-MAGE — heavy two-handed barbarian mid-greatsword-swing + cleric casting holy-light support + mage casting offensive-magic, three-hero engagement',
      'PARTY-OF-4 PALADIN-WARRIOR-MAGE-CLERIC — paladin and warrior both mid-attack on the front-line + mage casting magic-bolt behind + cleric casting healing-aura, full 4-party engagement',
      'KNIGHT-MAGE-CLERIC TRIO — armored knight mid-sword-swing + mage mid-cast with blue-fireball + cleric mid-prayer with holy-light, classic tank-dps-healer trio',
      'PALADIN-RANGER-DRUID — paladin mid-charge with warhammer + ranger drawing bow at the back + druid casting nature-magic with glowing vines, three-class JRPG party',
      'NINJA-MAGE-PRINCESS — ninja with twin daggers mid-leap + mage casting lightning-bolt + princess casting healing-aura on the ninja, support-heavy ninja-focused party',
      'KNIGHT-DRAGOON-MAGE — armored knight mid-sword-swing + dragoon mid-spear-thrust jumping + mage casting magic-burst behind, classic JRPG party with vertical-attack-pose',
      'PARTY-OF-4 KNIGHT-NINJA-MAGE-CLERIC — knight mid-sword-swing + ninja mid-shuriken-throw + mage casting fireball + cleric casting healing-aura, classic 4-party JRPG formation',
      'WARRIOR-MAGE-RANGER-CLERIC FULL PARTY — full 4-party formation with warrior mid-attack + mage mid-cast + ranger mid-arrow + cleric mid-heal-cast, all four engaged simultaneously',
      'KID-MAGE-PRINCESS LTTP-TRIO — kid in green tunic with sword raised mid-swing + mage in blue robe casting magic + princess in white gown casting healing-glow, LttP/Final-Fantasy-style classic trio',
    ],
    instructions: `Each entry is ONE specific HERO PARTY ENGAGEMENT, 30-55 words. Format: "PARTY COMP CAPS — 2-4 hero classes in mid-action with visible impact-effects + JRPG formation feel". MANDATORY — (a) 2-4 hero classes of DIFFERENT silhouettes, (b) mid-action pose for EACH, (c) visible impact-effects (magic-trail / sword-arc / arrow-trail / heal-aura), (d) JRPG formation. NO sexualized. NO gore. NO modern weapons. NO IP. NO single-figure. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_jrpg_combat_spell_effect: {
    format: 'simple',
    theme: `40%-GATED SPELL / WEAPON EFFECT for the PixelBot jrpg-combat path. Each entry describes ONE specific visible spell or weapon effect mid-arc/mid-cast amplifying the JRPG-combat feel. Each entry 20-40 words.

🚫 STRICT BANS: NO IP / UI / sexualized content.

✓ EFFECT CATEGORIES:
  A. FIREBALL / FIRE-MAGIC — fireball-arc / fire-burst / fire-pillar
  B. LIGHTNING / ELECTRIC — lightning-bolt zigzag / chain-lightning / thunder-strike
  C. ICE / FROST — ice-shard volley / blizzard-cone / frost-nova
  D. HOLY-LIGHT / DIVINE — holy-pillar / radiant-aura / divine-strike
  E. DARK / NECRO — dark-magic-cloud / shadow-tendrils / necro-glow
  F. NATURE / EARTH — vine-erupt / stone-pillar / earthquake-cracks
  G. WIND / AIR — wind-blade vortex / tornado / cyclone
  H. WATER — water-jet / tidal-wave / bubble-burst
  I. SUMMON-AURA — summon-spirit aura / phoenix-form / golem-form
  J. WEAPON-EFFECT — sword-slash-arc / arrow-trail / hammer-shockwave`,
    touchpoints: [
      'FIREBALL-ARC TRAILING FLAME — fireball-arc streaking through the air with trailing flame-particles, ember-trail behind, fire-red ambient bleeding into the scene',
      'FIRE-PILLAR ERUPTING — massive fire-pillar erupting upward from the play-floor in a wide column of orange-flame, ember-particles drifting upward, intense red-orange glow',
      'FIRE-BURST EXPLOSION — explosive fire-burst at the monster position with flame-spikes radiating outward, debris-particles flying, intense ember-glow',
      'LIGHTNING-BOLT ZIGZAG — electric-lightning-bolt zigzagging through the air toward the monster, electric-blue particles, sparks at the impact-point',
      'CHAIN-LIGHTNING ARCING — chain-lightning arcing between multiple enemies on the play-area, electric-blue arcs connecting them, sparks at each impact-point',
      'THUNDER-STRIKE PILLAR — thunder-strike pillar of electric-blue energy coming down from above onto the monster position, sparks erupting outward',
      'ICE-SHARD VOLLEY — multiple ice-shards mid-flight in a volley arcing toward the monster, cool-blue ambient, frost-particles trailing behind each shard',
      'BLIZZARD-CONE — blizzard-cone of swirling snow-and-ice extending from the mage staff outward, cool-blue ambient, snow-particles dense in the cone',
      'FROST-NOVA SHOCKWAVE — frost-nova shockwave of ice expanding outward from the mage in a ring-pattern across the play-floor, ice-spikes growing where the wave hits',
      'HOLY-LIGHT PILLAR — holy-light pillar of warm-white-gold radiance descending from above onto the monster position, sparkle-particles drifting upward through the light',
      'DIVINE-AURA RADIATING — divine-aura of warm-gold light radiating outward from the cleric in a ring-pattern, blessing-particles drifting upward, healing party members',
      'DIVINE-STRIKE SWORD-FLASH — divine-strike sword-flash of brilliant-white-gold light from the paladin sword striking the monster, brilliant impact-burst',
      'DARK-MAGIC-CLOUD SWIRLING — dark-magic-cloud of purple-and-black smoke swirling around the enemy mage staff, dark-tendrils reaching toward the party',
      'SHADOW-TENDRILS REACHING — shadow-tendrils erupting from the floor reaching toward the player party, dark-mist particles, shadowy purple ambient',
      'NECRO-GLOW SPELL — sickly-green necro-glow spell hovering around the lich, skeletal-arms-of-darkness reaching outward, undead-energy particles drifting',
      'VINES ERUPTING FROM FLOOR — massive vines erupting from the play-floor wrapping around the monster, glowing-green nature-magic, leaf-particles drifting',
      'STONE-PILLAR ERUPT — massive stone-pillar erupting from the play-floor under the monster lifting it into the air, dust-cloud erupting at the base, earth-magic',
      'EARTHQUAKE-CRACKS SPREADING — earthquake-cracks spreading across the play-floor radiating outward from the druid impact-point, debris-pixels erupting from the cracks',
      'WIND-BLADE VORTEX — wind-blade vortex of swirling-air visible as wind-streak-particles arcing through the air toward the monster, cool-blue motion-blur',
      'TORNADO-CYCLONE — small tornado-cyclone of swirling-wind-particles forming over the monster, motion-blur cyclone-trails, debris caught up in the wind',
      'WATER-JET STREAM — water-jet stream of pixel-water arcing from the mage staff toward the monster, water-droplet-particles trailing, cool-blue ambient',
      'TIDAL-WAVE CRASHING — tidal-wave of pixel-water crashing across the play-floor toward the monster, foam-particles flying, blue-cyan ambient',
      'SUMMON-PHOENIX AURA — translucent phoenix-spirit-aura forming over the summoner mage, fire-particles drifting upward, golden-orange glow, dramatic summoning-pose',
      'SUMMON-GOLEM-FORM — translucent earth-golem-spirit-form behind the druid, stone-rock-particles drifting, brown-and-green glow, summoning-pose',
      'SWORD-SLASH-ARC — bright-white sword-slash-arc cutting through the air mid-strike with motion-blur trail, sparks at the impact-point on the monster',
    ],
    instructions: `Each entry is ONE specific SPELL / WEAPON EFFECT, 20-40 words. Format: "EFFECT NAME CAPS — visible spell/weapon effect + mid-arc/mid-cast pose + impact cue". Vary across the 10 categories. NO IP/UI/sexual. JRPG combat feel. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── boss-arena path (2026-05-20 axis-system migration) ───
  pixelbot_boss_arena_setting: {
    format: 'simple',
    theme: `BOSS ARENA SETTING for the PixelBot boss-arena path. Each entry describes ONE specific boss-fight arena — lava-bridge / frozen-cathedral / temple-of-doom / forest-grove / castle-throne / dungeon-pit / floating-platform / mystic-altar / void-arena / volcanic-caldera / ice-cavern / blood-ritual chamber / etc. Each entry 30-55 words.

⚠️ THE BAR: every entry produces a recognizable 16-bit boss-arena play-space — arena floor visible, walls/edges framing the play space, camera-angle implied (top-down OR 3/4-iso OR side-view).

⚠️ ARENA CATEGORIES — distribute the 25 entries across:
  • ~3 LAVA / VOLCANIC ARENA — lava-bridge / lava-pit / volcanic caldera floor
  • ~3 GOTHIC CASTLE — throne-room / cathedral / castle-courtyard
  • ~3 ICE / FROZEN — frozen cathedral / glacial chasm / ice-cavern
  • ~2 TEMPLE / RUIN — ancient temple-of-doom / jungle-temple / sandstone arena
  • ~2 FOREST / NATURE — forest-grove / ancient tree-circle / haunted-forest clearing
  • ~2 DUNGEON / CRYPT — bone-floor crypt / sarcophagus arena / dungeon-pit
  • ~2 FLOATING / SKY — floating-platform / sky-island / cloud-arena
  • ~2 VOID / COSMIC — void-arena / starlit chasm / dimensional-space
  • ~2 MAGIC / RITUAL — magic-circle altar / blood-ritual chamber / runic-platform
  • ~1 INDUSTRIAL / FACTORY — factory boss-room / steel arena
  • ~1 UNDERWATER / OCEAN — coral-arena / kraken-pit
  • ~1 DESERT / DUNES — desert-pit / sand-arena

⚠️ EVERY entry MUST include:
  - SPECIFIC ARENA TYPE
  - ARENA FLOOR detail (tile material + texture)
  - ARENA EDGES detail (pillars / cliffs / walls / etc.)
  - IMPLIED CAMERA ANGLE (top-down for floor-focused / iso for angled / side-view for horizontal)
  - SIGNATURE PALETTE / ATMOSPHERE

🚫 STRICT BANS:
  • NO boss / player description (separate axes)
  • NO IP / UI / sexualized content
  • NO vertical-portrait key-art framing`,
    touchpoints: [
      'LAVA-BRIDGE ARENA — top-down view of a wide stone-bridge spanning a lava-chasm, magma flowing on both sides of the bridge-floor, broken-stone pillars at each end, fire-red glow saturating, central platform big enough for boss + player combat',
      'VOLCANIC CALDERA ARENA — 3/4-iso angled-down on a circular volcanic-caldera floor, black-volcanic tiles with glowing magma-cracks between, cliff-walls rising around the perimeter, ember-fall in the air, lava-pools at the edges',
      'INFERNAL THRONE-ROOM — top-down on a vast stone throne-room with magma-cracked tile floor, demon-statues lining the walls, fire-red sconces casting glow, distant arched doorway at the back, fire-stained pillars',
      'GOTHIC CATHEDRAL ARENA — top-down on a cathedral nave-floor with intricate tile-pattern, gothic stone pillars on both sides, broken stained-glass windows, candlelight flickering, central altar visible at the far end',
      'CASTLE THRONE-ROOM ARENA — 3/4-iso angled-down on a vast stone throne-room with red-carpet down the center, twin rows of stone pillars, throne at the far end with crown-and-banner, torches lining the walls',
      'CASTLE COURTYARD ARENA — top-down on a square stone courtyard with cobblestone floor, castle-walls on all four sides with battlements, central fountain or well, banners hanging from the walls, gothic atmosphere',
      'FROZEN CATHEDRAL — top-down on a frozen-cathedral floor with ice-crystal pillars and frost-coated tile, hanging icicle-chandeliers, far-back altar with ice-throne, cold-blue ambient with snow-particles',
      'GLACIAL CHASM ARENA — 3/4-iso angled-down on a glacial-chasm floor with ice-bridge spanning a deep crevice, blue-ice walls on both sides, hanging icicles, central platform for combat, cool-blue palette',
      'ICE-CAVERN BOSS-ROOM — top-down on an ice-cavern circular chamber with frost-coated stone tile floor, ice-crystal walls reflecting blue light, frozen-spike-edges, central glowing magic-circle inscribed on the floor',
      'JUNGLE TEMPLE-OF-DOOM — top-down on an ancient stone-temple floor overgrown with vines, jungle-canopy visible through broken ceiling, stone-pillar columns, sunlight shafts piercing through, mystical green-and-gold palette',
      'DESERT TEMPLE ARENA — 3/4-iso angled-down on a sandstone-temple floor with hieroglyph-carved walls, golden-amber ambient, sand-particles drifting, central altar with glowing rune, distant sphinx-statue silhouette',
      'ANCIENT FOREST-GROVE — top-down on a circular forest-glade arena with mossy-stone tile-pattern at the center, towering ancient trees ringing the perimeter, dappled-light through canopy, magical green ambient',
      'HAUNTED-FOREST CLEARING — top-down on a moonlit forest-clearing arena with dirt-and-leaf floor, twisted dead-trees ringing the space, fog drifting at floor-level, eerie blue-grey palette, distant haunted-mansion',
      'BONE-FLOOR CRYPT — top-down on a bone-tile crypt floor with stacked-skull columns at the edges, hanging cobwebs, dim torch-light catching the bones, eerie green-grey palette, central sarcophagus visible',
      'SARCOPHAGUS ARENA — 3/4-iso angled-down on a stone-tile crypt floor with sarcophagi lining both side walls, central pedestal with glowing magic-circle, torch-sconces, deep gothic shadows',
      'DUNGEON-PIT ARENA — top-down on a sunken stone-pit floor surrounded by raised stone walkways, iron-bars on the perimeter, blood-stained tiles, single shaft of pale light from above, ominous palette',
      'FLOATING-SKY ARENA — top-down on a floating circular stone-platform suspended in cloud-sea, distant sky-castles visible in the parallax, no edges (drops off into clouds), magical golden ambient',
      'CLOUD-KINGDOM SKY-ARENA — 3/4-iso angled-down on a marble-platform floating in pale-pink dawn sky, white cloud-billows surrounding the arena, distant celestial-architecture in the parallax, ethereal palette',
      'VOID-ARENA STARLIT — top-down on a circular black-obsidian platform suspended in cosmic-void, stars visible below and around, drifting stardust particles, distant nebulae in the parallax, deep-violet palette',
      'DIMENSIONAL-RIFT ARENA — 3/4-iso angled-down on a fractured-tile arena floor with reality-cracks revealing void below, distortion-effects at the edges, otherworldly purple-and-violet palette',
      'MAGIC-CIRCLE ALTAR — top-down on a circular stone altar arena with massive glowing-rune-circle inscribed on the tile floor, magical pillars at four cardinal points, magic-violet ambient with rune-particles drifting',
      'BLOOD-RITUAL CHAMBER — top-down on a pentagonal blood-stained stone chamber with central ritual-altar, blood-pools soaking into cracked tiles, hanging chains, deep crimson ambient with candle-flicker',
      'FACTORY BOSS-ROOM — 3/4-iso angled-down on a steel-grate factory boss-room with industrial-machinery on the walls, glowing-furnace at the back, sparks raining from above, copper-and-steel palette',
      'KRAKEN-PIT UNDERWATER — top-down on an underwater coral-arena floor at the bottom of an ocean trench, coral-formations at the edges, bubble-streams rising, blue-cyan palette, fish-silhouettes drifting',
      'SAND-DUNE COLISEUM — top-down on a circular sand-floor arena ringed by raised stone-bleachers, golden-amber palette, sand-particles drifting, desert-sun ambient, distant pyramid silhouettes',
    ],
    instructions: `Each entry is ONE specific BOSS ARENA SETTING, 30-55 words. Format: "ARENA NAME CAPS — specific arena type + arena floor + arena edges + camera angle implied + signature palette". MANDATORY — (a) arena type, (b) floor detail, (c) edges detail, (d) implied camera angle, (e) palette/atmosphere. NO boss/player description. NO IP/UI/sexual. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_boss_arena_boss_creature: {
    format: 'simple',
    theme: `BOSS CREATURE SPRITE mid-ATTACK for the PixelBot boss-arena path. Each entry describes ONE specific 16-bit boss-creature sprite MID-ATTACK on the arena floor, with VISIBLE IMPACT-EFFECTS in the air (projectile / shockwave / fire-burst / magic-arc / claw-trail / etc.). The boss is NOT posed-and-static — it is actively attacking. Each entry 35-60 words.

⚠️ THE BAR: every entry produces a boss-sprite mid-ATTACK with EXPLICIT IMPACT-EFFECTS mid-air. Fire-burst / lightning-bolt / claw-trail / debris-cloud / magic-projectile / shockwave / etc. erupting from the boss toward the player position. The combat is HAPPENING right now.

⚠️ BOSS CATEGORIES — distribute the 25 entries:
  • ~3 UNDEAD ROYAL — skeleton-king on throne / lich casting / undead-knight champion
  • ~3 DRAGON / WYRM — small-medium dragon (NOT towering — sprite-scale) breathing fire / charging
  • ~2 GIANT-MONSTER — minotaur / ogre / cyclops with weapon mid-swing
  • ~2 DEMON / HELLSPAWN — horned demon mid-attack / fire-demon
  • ~2 SPIDER-QUEEN / INSECT — giant spider / centipede / scorpion-king
  • ~2 PLANT / NATURE-BOSS — treant / vine-monster / forest-spirit
  • ~2 KRAKEN / SEA-MONSTER — tentacled creature / sea-serpent
  • ~2 GOLEM — stone-golem / iron-golem mid-fist-swing
  • ~2 WRAITH / GHOST — translucent wraith / phantom / banshee
  • ~2 CULTIST / WITCH — dark-priest / witch / blood-cultist
  • ~2 ELEMENTAL — fire-elemental / ice-elemental / lightning-elemental
  • ~1 HYDRA / MULTI-HEADED — hydra with multiple heads

⚠️ EVERY entry MUST include:
  - SPECIFIC BOSS TYPE
  - MID-ACTION POSE (rearing / roaring / casting / charging / wings-spread / mid-swing)
  - BOSS SIGNATURE FEATURE (crown / staff / wings / horns / etc.)
  - ON THE ARENA FLOOR (not in the sky / not towering silhouette)
  - SPRITE-SCALE (large compared to player but still on the play-space)

🚫 STRICT BANS:
  • NO gore / dismemberment / explicit violence
  • NO sexualized boss
  • NO player description (separate axis)
  • NO arena description (separate axis)
  • NO IP / UI / specific franchise characters
  • NO towering-silhouette key-art framing`,
    touchpoints: [
      'SKELETON KING ON THRONE — skeletal king with bone-crown and rusty greatsword sitting on a stone throne mid-arena, mid-rising-from-throne pose, glowing-red eye-sockets, bone-cape draped from the throne back',
      'UNDEAD CHAMPION KNIGHT — undead-knight in dark plate-armor mid-greatsword-swing, glowing-red eyes through the visor, tattered banner-cape, mid-arena position on the play-floor',
      'LICH CASTING MAGIC — robed lich with skull-staff held aloft casting purple-magic mid-arena, runic glow swirling around it, hovering slightly above the floor, robes billowing',
      'DRAGON BREATHING FIRE — medium-sized dragon (sprite-scale) mid-arena rearing on hind-legs with wings half-spread, mid-fire-breath erupting from its open jaws, glowing-orange chest, tail-coiled',
      'BLUE-FROST DRAGON — small ice-dragon mid-arena with wings spread, mid-frost-breath erupting from open jaws, scales glittering with frost, claws gripping the floor',
      'SHADOW WYRM — serpentine shadow-dragon coiled mid-arena with mouth open in a roar, no wings, smoky-shadow particles wisping from its body, glowing-purple eyes',
      'MINOTAUR MID-AXE-SWING — massive minotaur with double-bladed greataxe held overhead mid-arena, bull-head roaring, hooves on the floor, leather-and-chain armor, action pose',
      'OGRE WITH CLUB — massive ogre mid-arena with iron-spiked club raised, tusks bared in a roar, weathered leather armor, one foot stamping on the floor, intimidating',
      'CYCLOPS BOULDER-THROW — towering cyclops mid-arena with a massive boulder raised overhead ready to throw, single glowing-red eye in its forehead, fur-and-leather loincloth',
      'HORNED DEMON CHARGING — horned demon (sprite-scale) mid-arena charging forward with claws extended, glowing-red eyes, bat-wings half-folded, demonic-mark glowing on its chest',
      'FIRE-DEMON HOVERING — fire-demon (small-medium sprite) hovering above the arena floor mid-fire-blast, body wreathed in flames, two horns curling, glowing-orange eyes',
      'SPIDER-QUEEN REARING — giant spider-queen mid-arena rearing on her back legs, pincers raised, multiple eyes glowing, web-strands at her feet, eight-legs spread across the floor',
      'CENTIPEDE COILED — massive centipede coiled mid-arena with multiple body-segments visible, head raised with mandibles snapping, segmented carapace glinting',
      'TREANT ANCIENT — massive ancient-treant mid-arena with branch-arms outstretched and roots gripping the floor, glowing-green eyes in the bark-face, vine-tendrils hanging from its limbs',
      'FOREST-SPIRIT WRAITHFORM — ethereal forest-spirit mid-arena, translucent body of leaves-and-vines, glowing-green core, mid-cast-spell pose with vine-tendrils erupting from the floor',
      'KRAKEN TENTACLES — kraken with multiple tentacles erupting from a water-pool in the arena floor, central beak-face visible, glowing-yellow eyes, tentacles arching upward',
      'SEA-SERPENT ARCING — sea-serpent mid-arena arcing out of a water-pool, scaled body, mid-bite pose with mouth open, glowing-blue scales',
      'STONE-GOLEM MID-FIST — massive stone-golem mid-arena with one rocky-fist raised overhead ready to crush, glowing-yellow eye-crystals in its rocky face, body cracking with magic-energy',
      'IRON-GOLEM MID-CHARGE — iron-golem mid-charge across the arena floor with arms swinging, glowing-blue energy-vents on its body, mechanical-detail visible, sparks flying',
      'TRANSLUCENT WRAITH — translucent wraith hovering above the arena floor, mid-cast spell with skeletal-arms extended, ghostly-blue body fading at the edges, glowing-white eye-points',
      'BANSHEE MID-SCREAM — banshee mid-scream with mouth wide open and arms thrown back, translucent body, ghostly-green ambient bleeding from her, screaming-particles radiating',
      'DARK PRIEST CASTING — dark-priest mid-arena standing on a magic-circle on the floor, arms raised casting purple-magic spell, hooded robes, glowing-red rune-markings on the floor',
      'WITCH-COVEN LEADER — witch mid-cast with broomstick at her side, raising a magical-bolt with one hand, pointed-hat, glowing-green spell-trails, mid-arena position',
      'FIRE-ELEMENTAL ERUPT — fire-elemental mid-arena, body of pure flame in humanoid silhouette, arms raised with fire-balls forming above the hands, ember-particles erupting from its body',
      'HYDRA MULTI-HEADED — five-headed hydra mid-arena with all heads in different poses (roaring / biting / cocked-back / breathing-fire / rearing), serpentine bodies coiled, glowing-green eyes on each head',
    ],
    instructions: `Each entry is ONE specific BOSS CREATURE SPRITE, 30-55 words. Format: "BOSS NAME CAPS — boss type + mid-action pose + signature features + position on arena floor". MANDATORY — (a) boss type, (b) mid-action pose, (c) signature feature, (d) on the arena floor, (e) sprite-scale. NO gore. NO sexual. NO player/arena description. NO IP. NO towering-silhouette framing. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_boss_arena_player_engagement: {
    format: 'simple',
    theme: `PLAYER ENGAGEMENT mid-COUNTER for the PixelBot boss-arena path. Each entry describes 1-3 hero sprites mid-counter-attack with VISIBLE IMPACT-EFFECTS — magic-projectile streaking toward boss / sword-slash with sparks / arrow-trail / shield-block with deflection-sparks / dodge-roll with motion-blur / etc. The combat is DYNAMIC — both sides attacking at once. Each entry 30-55 words.

⚠️ THE BAR: every entry produces 1-3 hero pixel-sprites mid-COUNTER-ACTION with VISIBLE IMPACT-EFFECTS (magic-trail / sparks / motion-blur / debris). Hero is NOT just standing — they are actively attacking, dodging, blocking. Combat in motion.

⚠️ HERO + PARTY VARIETY — distribute:
  • Single armored knight mid-charge / mid-swing
  • Single robed mage mid-cast
  • Single hooded ranger mid-bow-draw
  • Single dual-dagger rogue mid-leap
  • Plate-paladin with shield+hammer
  • Two-handed barbarian mid-greatsword-swing
  • Cleric mid-holy-light cast
  • PARTY OF 2 (knight + mage / paladin + ranger / etc.)
  • PARTY OF 3 (full classic RPG party)

⚠️ MID-ACTION POSES MANDATORY:
  - Charge toward boss
  - Mid-swing weapon
  - Mid-cast spell (with magic-trail to the boss)
  - Mid-arrow-flight (arrow streaking toward boss)
  - Mid-leap-attack
  - Defensive stance (shield raised)
  - Mid-dodge-roll

🚫 STRICT BANS:
  • NO sexualized characters
  • NO gore / dismemberment
  • NO modern weapons (sword / bow / staff / axe / whip / dagger ONLY)
  • NO IP characters
  • NO player alone without combat-engagement-toward-boss`,
    touchpoints: [
      'KNIGHT MID-CHARGE — armored knight pixel-sprite small on the arena floor mid-charge toward the boss with sword raised, cape flowing behind, mid-stride pose, single-hero combat',
      'KNIGHT MID-SWORD-SWING — armored knight small on the arena floor mid-sword-swing, shield raised in defense, mid-strike toward the boss, sparks implied between blade and boss',
      'MAGE MID-CAST — robed mage small on the arena floor mid-cast with staff raised, glowing-magic-projectile streaking toward the boss across the arena, magic-circle glowing under the mage feet',
      'MAGE LIGHTNING-ARC — robed mage on the arena floor casting lightning-arc that streaks across to strike the boss, mid-cast pose with staff held aloft, electric-particles crackling',
      'RANGER MID-ARROW — hooded ranger small on the arena floor mid-bow-draw with arrow nocked, second arrow streaking through the air toward the boss, mid-stride defensive pose',
      'RANGER MID-DODGE-ROLL — hooded ranger small on the arena floor mid-dodge-roll, bow in hand mid-rolling-pose, dodging an attack from the boss',
      'ROGUE MID-LEAP — dual-dagger rogue small on the arena floor mid-leap with twin-daggers extended, mid-air pose, leaping toward the boss side',
      'ROGUE MID-STEALTH-STRIKE — dual-dagger rogue small on the arena floor mid-stealth-strike from behind a stone-pillar, twin-daggers slashing at the boss back',
      'PALADIN SHIELD-RAISE — plate-paladin small on the arena floor with shield raised blocking a boss attack, warhammer in the other hand mid-swing, mid-defense pose',
      'PALADIN MID-CHARGE — plate-paladin small on the arena floor mid-charge with warhammer-raised, shield in front, charging across the arena toward the boss',
      'BARBARIAN MID-GREATSWORD — two-handed barbarian small on the arena floor mid-greatsword-swing in a wide horizontal arc, mid-roar pose, both hands gripping the hilt',
      'BARBARIAN MID-LEAP-ATTACK — two-handed barbarian small on the arena floor mid-leap-attack with greatsword raised overhead, mid-air pose, descending toward the boss',
      'CLERIC HOLY-LIGHT — cleric small on the arena floor with mace raised casting holy-light from upraised hand, light radiating toward the boss, mid-prayer pose',
      'KNIGHT + MAGE PARTY — armored knight mid-sword-swing at the boss + robed mage behind casting blue-fireball at the boss, two-hero coordinated attack on the arena floor',
      'PALADIN + CLERIC PARTY — plate-paladin mid-charge with warhammer + cleric behind casting holy-light radiating outward, two-hero defensive-offensive combo',
      'KNIGHT + RANGER PARTY — armored knight mid-charge in close combat + hooded ranger at the back of the arena mid-arrow-shot, ranged + melee combo',
      'MAGE + RANGER PARTY — robed mage mid-cast + hooded ranger mid-arrow-shot, both at different positions on the arena floor, dual-ranged attack on the boss',
      'PALADIN + ROGUE PARTY — plate-paladin tanking from front + dual-dagger rogue flanking around the boss back, tank + dps combo',
      'PARTY OF 3 — armored knight in front mid-strike + robed mage to the side mid-cast + hooded ranger at the back mid-arrow-shot, full RPG party engagement',
      'PARTY OF 3 PALADIN-MAGE-RANGER — plate-paladin mid-charge + robed mage casting magic-shield protecting the paladin + hooded ranger mid-arrow-shot, classic party combo',
      'PARTY OF 3 BARBARIAN-CLERIC-RANGER — two-handed barbarian mid-greatsword-swing + cleric casting healing-light on the barbarian + hooded ranger mid-arrow-shot, full party combo',
      'PARTY OF 3 KNIGHT-MAGE-CLERIC — armored knight mid-shield-block + robed mage casting offensive-magic + cleric casting holy-light support, tank+dps+healer combo',
      'KNIGHT MID-PARRY — armored knight small on the arena floor mid-parry against the boss attack, sparks of metal-on-metal flying, mid-defense pose',
      'BARBARIAN MID-WAR-CRY — two-handed barbarian small on the arena floor with greatsword raised mid-war-cry, mid-attack pose, mouth open in a roar',
      'PARTY OF 4 PARTY — full four-hero party (knight + mage + ranger + cleric) at different positions around the boss, four-angle attack formation, ultimate boss-fight engagement',
    ],
    instructions: `Each entry is ONE specific PLAYER ENGAGEMENT moment, 25-50 words. Format: "HERO + ACTION CAPS — hero class + mid-action pose + engagement with boss". MANDATORY — (a) hero class (or party), (b) mid-action pose, (c) directed at boss, (d) small-on-arena-floor scale. NO gore. NO sexualized. NO modern weapons. NO IP. NO player-alone-without-engagement. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_boss_arena_phenomenon: {
    format: 'simple',
    theme: `40%-GATED ARENA PHENOMENON / EFFECTS for the PixelBot boss-arena path. Each entry describes ONE specific particle/effect accent amplifying the boss-fight intensity. Each entry 20-40 words.

🚫 STRICT BANS: NO IP / UI / sexualized content.

✓ EFFECT CATEGORIES:
  A. FIRE / EMBERS — lava-erupt / fire-storm / ember-rain
  B. ICE / FROST — frost-crack / ice-shards / cold-mist
  C. LIGHTNING / ENERGY — electric-arc / energy-beam / thunder-flash
  D. MAGIC-CIRCLE — glowing rune-circle on the floor
  E. SMOKE / FOG — smoke-billow / fog-roll / dust-cloud
  F. BLOOD-MIST / GORE-LIGHT (light, atmospheric, not explicit)
  G. SHATTERED-FLOOR — broken-tile / crack-spreading
  H. SHAKING ARENA — debris falling from ceiling
  I. PORTAL / RIFT — dimensional portal swirling
  J. MAGIC-PARTICLES — drifting magic-mote effects`,
    touchpoints: [
      'LAVA ERUPTION — magma-pillar erupting from the arena floor between the player and boss, lava-droplets spraying outward, fire-particles drifting upward, fire-red ambient saturating',
      'EMBER-STORM — dense ember-particle storm filling the arena air, embers drifting upward through the frame, fire-red ambient bath, intense heat-glow',
      'FIRE-STORM RAINING — fire-balls raining down from the ceiling impacting the arena floor in multiple spots, fire-particles erupting on impact, intense flame-orange ambient',
      'FROST-CRACK ARENA — ice-cracks spreading across the arena floor radiating outward from the boss position, frost-particles erupting from the cracks, cold-blue ambient',
      'ICE-SHARDS FLYING — ice-shards mid-air flying outward in all directions from a frost-explosion in the arena center, cool-blue ambient, frost-particles drifting',
      'COLD MIST FLOOR — cold-mist rolling along the arena floor at ankle-height, hiding portions of the floor in pale-blue fog, atmospheric',
      'LIGHTNING ARC — electric-lightning-arc crackling between the player and boss across the arena, electric-blue particles, energy-zigzag visible',
      'ENERGY-BEAM CASTING — energy-beam streaming from the boss across the arena toward the player position, beam-particles trailing, electric ambient',
      'THUNDER FLASH — sudden lightning-flash illuminating the entire arena, silhouettes briefly lit, gothic-dramatic ambient with electric ozone',
      'GLOWING MAGIC-CIRCLE — large glowing rune-circle inscribed on the arena floor between the player and boss, magic-glyphs pulsing red-purple, magic-violet ambient',
      'RUNE-PATTERN PULSE — multiple smaller magic-circles glowing across the arena floor at various positions, magic-rune particles drifting upward, mystical ambient',
      'SMOKE BILLOW — dense smoke-billow filling the deep arena background, partly obscuring the boss silhouette, atmospheric warm ambient',
      'FOG ROLL FLOOR — pale fog rolling horizontally across the arena floor at ankle-height, hiding portions of the play-space, eerie atmospheric',
      'DUST CLOUD ERUPT — dust-cloud erupting from a recent impact (boss attack on the floor), dust-particles drifting outward, debris in the cloud',
      'BLOOD-MIST AMBIENT — light blood-mist particle haze around the boss-area indicating recent combat (atmospheric, no explicit gore), reddish ambient',
      'SHATTERED-FLOOR CRACKS — cracks spreading across the arena floor from a recent boss-impact, glowing-orange or magic-purple energy bleeding through the cracks, debris',
      'ARENA SHAKING DEBRIS — ceiling-debris (stone-chunks / dust / fragments) falling from above onto the arena floor, arena-shake implied, intense boss-presence',
      'PORTAL RIFT SWIRLING — dimensional rift swirling at the arena center, purple-and-pink energy spiraling, particles being drawn into the rift, dimensional ambient',
      'PURPLE PORTAL EMERGENCE — purple magic-portal at the arena edge with shadow-creatures emerging from it, mystical-purple ambient with rune-particles drifting',
      'MAGIC-MOTE DRIFT — glowing magic-mote particles drifting through the entire arena air, soft magical ambient, peaceful between attacks',
      'AURA-RADIANCE BOSS — golden-magic-aura emanating outward from the boss in pulse-rings, energy-particles drifting, intense boss-power moment',
      'FIRE-CRACKS SPREADING — fire-veins glowing red-orange spreading across the arena floor from beneath the boss, ember-particles drifting upward through the cracks',
      'ICE-CRYSTALS GROWING — ice-crystals rapidly growing across the arena floor outward from a frost-impact, jagged spikes forming, cool-blue ambient',
      'SHADOW-TENDRILS REACHING — shadow-tendrils erupting from the arena floor reaching toward the player, dark-mist particles, shadowy ambient',
      'CASCADING DIMENSIONAL PARTICLES — cascade of multi-color dimensional-particles drifting across the arena from a recent reality-distortion attack, multi-color ambient',
    ],
    instructions: `Each entry is ONE specific ARENA PHENOMENON / effect, 20-40 words. Format: "EFFECT NAME CAPS — particle/effect detail + position in arena + ambient quality". Vary across the 10 categories. NO IP/UI/sexual. Boss-fight intensity. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── side-scroller-world path (2026-05-20 axis-system migration) ───
  pixelbot_side_scroller_biome_setting: {
    format: 'simple',
    theme: `SIDE-SCROLLER BIOME / SETTING for the PixelBot side-scroller-world path. Each entry describes ONE specific parallax-layered biome — lava-castle / ice-cavern / floating-islands / forest-canopy / desert-temple / factory-conveyor / cosmic-void / sewer-depths / mushroom-grove / haunted-forest / etc. Each entry 30-55 words.

⚠️ THE BAR: every entry produces a render where the biome reads INSTANTLY as a recognizable Castlevania / Super Metroid / Donkey Kong Country / Owlboy / Hollow Knight / Dead Cells / Ori biome with THREE-TIER PARALLAX DEPTH (foreground platforms + midground silhouettes + far backdrop).

⚠️ BIOME CATEGORIES — distribute the 25 entries across:
  • ~3 GOTHIC CASTLE / FORTRESS — stone-castle interior with arches, banners, candelabras, parallax castle walls behind
  • ~3 LAVA / VOLCANIC — magma rivers, fire-stained stone, ember-fall, fire-glow backdrop
  • ~3 ICE / FROZEN CAVERN — ice-crystal walls, frost-coated platforms, cold-blue glow, glacier backdrop
  • ~3 FOREST / JUNGLE-CANOPY — towering trees with vine-bridges, forest-canopy platforms, dappled light
  • ~2 DESERT / TEMPLE-RUIN — sandstone-and-rubble platforms, distant mesa, ancient ruins parallax
  • ~2 FLOATING-ISLANDS / SKY-WORLD — floating-platform islands in cloud-sea, sky-backdrop, parallax clouds
  • ~2 FACTORY / INDUSTRIAL — metal-walkway, gears, smokestacks, industrial-machinery parallax
  • ~2 SEWER / DRAINAGE — slime-stained brick platforms, drainage pipes, green-tinted ambient
  • ~2 MUSHROOM-GROVE / FUNGAL — giant glowing mushroom-cap platforms, spore-particles, ambient glow
  • ~1 COSMIC-VOID / SPACE — starry void backdrop, floating-platform isles, asteroid-debris parallax
  • ~1 HAUNTED-FOREST / GRAVEYARD — twisted trees, gravestone-platforms, fog-mist, owl-silhouettes
  • ~1 UNDERWATER / OCEAN — coral-platforms, fish-silhouettes parallax, blue-water ambient

⚠️ EVERY entry MUST include:
  - SPECIFIC BIOME (lava-castle / ice-cavern / forest-canopy / etc.)
  - PARALLAX LAYERS hinted (three-tier depth — foreground platforms + midground biome features + far backdrop)
  - SIGNATURE COLOR PALETTE (fire-red / ice-blue / forest-green / desert-amber / cosmic-violet / etc.)
  - SIGNATURE PARTICLES (embers / snowflakes / pollen / dust / etc.)

🚫 STRICT BANS:
  • NO hero / enemy description (separate axis — hero_action)
  • NO platform geography detail (separate axis — platform_geography)
  • NO IP refs / UI / sexualized content
  • NO top-down / iso / first-person framing implications

✓ HORIZONTAL SIDE-VIEW PLATFORMER aesthetic implied throughout.`,
    touchpoints: [
      'GOTHIC CASTLE INTERIOR — stone-castle interior with gothic arches and pillars receding into the parallax midground, banners hanging from rafters, candelabra-light, distant cathedral-window backdrop with moonlight bleeding through, fire-red signature accents',
      'CASTLEVANIA-STYLE FORTRESS — gothic stone fortress with arched corridors at three parallax depths, hanging banners, broken statues lining the walls, far-backdrop of stained-glass windows with moonlight, eerie blue-violet ambient',
      'CASTLE BATTLEMENTS WALL — exterior castle wall with stone battlements as foreground platform, distant towers and parapets in midground silhouette, far-backdrop of stormy night sky with lightning, gothic palette',
      'LAVA-CASTLE INFERNAL HALL — fire-stained castle interior with magma-cracked stone platforms, embers drifting through the air at all three parallax depths, distant lava-flow visible in the backdrop, fire-red glow saturating everything',
      'VOLCANIC CAVERN WITH MAGMA — open-cavern with magma rivers cutting through the foreground floor, jagged volcanic platforms above, far-backdrop of glowing-orange volcanic vents, ember-fall throughout, intense red-orange palette',
      'INFERNAL CITADEL — towering infernal citadel with magma-cracked stone platforms, demon-statues lining the walls, far-backdrop of erupting volcano spewing lava-sparks, deep red ambient with ember-fall',
      'ICE CAVERN GLACIAL — ice-crystal cavern with frost-coated stone platforms, hanging icicle-stalactites from ceiling, far-backdrop of glacier-cliff with embedded crystal-formations, cold-blue glow with snow-fall particles',
      'FROZEN PALACE INTERIOR — frozen palace interior with ice-pillars and frost-coated tile platforms, icicle-chandeliers hanging, far-backdrop of frozen-cathedral window with aurora-borealis behind, pale-blue ambient with snowfall',
      'TUNDRA OUTDOOR PLATFORMS — frozen tundra with snow-covered cliff-platforms, distant ice-peaks in parallax midground, far-backdrop of pale-blue arctic sky with northern-lights, snow-fall throughout the scene',
      'FOREST CANOPY HEIGHTS — towering ancient trees with treetop-branch platforms at three parallax depths, vine-bridges connecting trees, far-backdrop of pale-green forest-haze with shafts of golden sunlight piercing the canopy',
      'ANCIENT FOREST RUINS — overgrown stone ruins among massive tree-trunks, broken pillar platforms, vine-covered statues in midground, far-backdrop of dense forest fading into green-haze, dappled light',
      'JUNGLE TREETOPS — tropical jungle treetop canopy with broad-leaf platforms, hanging vines and orchids, far-backdrop of pale jungle-haze with sun-rays piercing through, vibrant green palette with bird-silhouettes',
      'DESERT TEMPLE RUINS — sandstone temple ruins with cracked stone platforms at three parallax depths, distant pyramid-silhouette in midground, far-backdrop of golden-amber desert sky, sand-particles drifting',
      'EGYPTIAN-STYLE TEMPLE — pillared Egyptian temple interior with hieroglyph-carved walls receding into parallax, sandstone platforms, far-backdrop of distant sphinx-silhouette, warm-amber palette with dust-motes',
      'FLOATING SKY-ISLANDS — floating-platform islands suspended in cloud-sea at three parallax depths, ancient ruins on the islands, far-backdrop of pale-pink dawn sky, drifting cloud-particles',
      'CLOUD KINGDOM PLATFORMS — sky-kingdom with marble-platform islands floating in cloud-sea, distant celestial-castle in parallax, far-backdrop of pale-gold sky with rays bursting through clouds, ethereal palette',
      'FACTORY CONVEYOR HALL — industrial factory interior with metal-walkway platforms, gears and pipes in midground machinery, far-backdrop of smokestacks puffing dark smoke, steel-gray palette with sparks and steam',
      'STEAMPUNK MACHINERY HALL — vast steampunk factory with brass-and-steel platforms at three parallax depths, massive gears turning in midground, far-backdrop of glowing-furnace with steam-jets, warm copper palette',
      'SEWER DEPTHS — slime-stained brick sewer corridor with foreground platform along drainage-channel, sewer-pipes at midground depth, far-backdrop of dark drainage-tunnel receding, sickly-green ambient with drip-particles',
      'TOXIC SEWER LEVEL — sewer-level with green-toxic-water below the foreground platforms, glowing-mold patches on the walls, far-backdrop of receding sewer-passage, green ambient with drip-bubbles',
      'MUSHROOM-GROVE PLATFORMS — giant glowing mushroom-caps as foreground platforms, smaller mushroom-clusters in midground, far-backdrop of pale-purple fungal-forest with glowing spore-particles drifting, magical glow',
      'FUNGAL CAVERN BIOME — underground fungal-cavern with mushroom-platforms at three parallax depths, glowing spore-puffs, far-backdrop of bioluminescent mushroom-forest with soft glow, purple-and-green palette',
      'COSMIC-VOID FLOATING ASTEROIDS — floating-asteroid platforms in cosmic-void at three parallax depths, distant galaxies and nebulae in the backdrop, drifting stardust particles, deep-violet-and-blue palette with starlight',
      'HAUNTED FOREST GRAVEYARD — twisted dead-tree forest with gravestone-platforms scattered, distant haunted-mansion silhouette in midground, far-backdrop of fog-shrouded dead-trees with full moon, eerie blue-grey palette',
      'UNDERWATER CORAL REEF — underwater coral-reef level with coral-platform formations, fish-silhouettes drifting at midground depth, far-backdrop of blue-ocean depths with distant fish-school, blue-cyan palette with bubble-particles',
    ],
    instructions: `Each entry is ONE specific SIDE-SCROLLER BIOME / setting, 30-55 words. Format: "BIOME NAME CAPS — specific biome + three-tier parallax depth + signature color palette + signature particles". MANDATORY — (a) specific biome, (b) parallax layers, (c) color palette, (d) particles. NO hero/enemy description. NO platform geography. NO IP/UI/sexual. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_side_scroller_platform_geography: {
    format: 'simple',
    theme: `FOREGROUND PLATFORM GEOGRAPHY for the PixelBot side-scroller-world path. Each entry describes ONE specific platformable terrain — the surface the player stands on in the foreground. Stone-tile / cliff-ledge / floating-platform / treetop-branch / factory-walkway / cracked-magma / ice-bridge / mushroom-cap / sewer-pipe / etc. Each entry 25-45 words.

⚠️ THE BAR: every entry produces a recognizable foreground platformable surface running across the bottom-third of the frame — a clear horizontal play-corridor where the player CAN STAND AND TRAVERSE.

⚠️ PLATFORM TYPE CATEGORIES — distribute the 25 entries across:
  • ~3 STONE-TILE PLATFORMS — gray-stone tiles in clean rows, gothic-castle floor
  • ~3 CRACKED / WORN PLATFORMS — broken cracked stone with gaps, ancient ruin
  • ~3 CLIFF-LEDGE / NATURAL ROCK — natural rock-ledge with grass on top
  • ~2 FLOATING-PLATFORMS — small floating-platform stones suspended in mid-air, distant gaps between
  • ~2 TREETOP-BRANCH — massive horizontal tree-branches with leaves, vine-bridges
  • ~2 FACTORY-WALKWAY / METAL — steel-grate walkway with railings, industrial
  • ~2 ICE-BRIDGE / FROZEN-STONE — frozen-stone platform with ice patches
  • ~2 MAGMA-CRACKED — black-volcanic stone with glowing magma-cracks between tiles
  • ~2 MUSHROOM-CAP — giant mushroom-cap as platform, bouncy organic surface
  • ~2 SEWER-PIPE / BRICK-LEDGE — slime-stained sewer-pipe or brick-ledge
  • ~1 BONE-FLOOR — bone-tile platform constructed of stacked bones
  • ~1 CORAL-PLATFORM — underwater coral platforms

⚠️ EVERY entry MUST include:
  - SPECIFIC TILE / SURFACE material (gray-stone / cracked-flagstone / treetop-bark / steel-grate / etc.)
  - SURFACE TEXTURE detail (visible-pixel-tiles / mossy / cracked / smooth / etc.)
  - HORIZONTAL EXTENT — the platform runs left-to-right across the frame-bottom
  - EDGE DETAIL — ledge-edge / drop-off / stair-step where applicable

🚫 STRICT BANS:
  • NO biome / setting description (separate axis)
  • NO hero / enemy description (separate axis)
  • NO IP / UI / sexual content`,
    touchpoints: [
      'GOTHIC GRAY-STONE TILE PLATFORM — clean gray-stone tile floor in horizontal rows across the bottom-third of frame, visible pixel-tile grid, slightly worn edges, gothic-stone-mason quality, single torch on a wall-bracket',
      'CASTLE STONE-BLOCK WALKWAY — large stone-block platform with visible pixel-tile boundaries, gothic-castle interior floor, slight wear on the edges, two stone-pillars at the platform edges',
      'CATHEDRAL TILE FLOOR — polished cathedral floor with intricate stone-tile pattern, foreground-platform extending across the frame, slight worn-shine, distant pillar-bases',
      'CRACKED STONE WITH GAPS — broken cracked-stone platform with visible gap-fissures between tiles, weathered-cracked surface, ancient-ruin quality, vines creeping up the cracks',
      'WEATHERED RUIN PLATFORM — broken stone platform with overgrown moss and cracked-tile edges, fallen-stone rubble on the surface, ancient-temple atmosphere',
      'BROKEN-COLUMN PLATFORM — fallen stone column lying horizontally as a platform, mossy cracks, broken-end visible at right edge, ancient ruin context',
      'GRASS-TOPPED CLIFF LEDGE — natural rock cliff-ledge with green-grass tufts growing on top, dirt-and-stone foreground texture, sloping cliff-face dropping off below the ledge',
      'NATURAL ROCK-LEDGE — natural rock-ledge with weathered stone-texture, foreground extending across frame-bottom, grass-tufts and small stones scattered, slight slope',
      'MOSSY STONE-PATH — mossy-stone path winding across the foreground, green-moss creeping along the edges, dirt patches, atmospheric overgrown quality',
      'FLOATING-PLATFORM ISLES — small floating-platform stones suspended in mid-air at the bottom-third of the frame, two or three platforms with gaps between, distant void below',
      'CHAIN-LINKED PLATFORMS — small stone platforms connected by hanging chains, floating-platform style, distant void below, ancient mystic quality',
      'TREETOP-BRANCH WALKWAY — massive horizontal tree-branch as the foreground platform, thick bark-texture, vine-loops hanging, leaves-clusters at the edges, jungle-treetop atmosphere',
      'VINE-BRIDGE BETWEEN TREES — vine-and-plank bridge spanning between two massive tree-trunks at the foreground level, planks worn, hanging vines below the bridge',
      'STEEL-GRATE FACTORY WALKWAY — steel-grate walkway with railings, visible pixel-mesh-pattern, factory-industrial atmosphere, rivet-detail on the support-beams',
      'INDUSTRIAL CATWALK — metal-catwalk with handrails extending across the frame-bottom, rivets visible, slight rust patches, factory-industrial quality',
      'FROZEN-STONE PLATFORM — gray-stone platform partially coated in frost and ice, icicle-edges, slippery-shine on the surface, cold-blue palette',
      'ICE-BRIDGE OVER CHASM — solid-ice bridge spanning a chasm at the foreground level, crystalline ice-texture, blue-cold glow, snow-dust accumulated on the surface',
      'MAGMA-CRACKED VOLCANIC TILE — black-volcanic stone tile platform with glowing-orange magma-cracks between tiles, ember-particles drifting, fire-stained surface',
      'OBSIDIAN-AND-MAGMA PLATFORM — polished obsidian platform with magma-veins glowing red-orange between tiles, fire-red ambient bleeding up through the cracks',
      'GIANT MUSHROOM-CAP PLATFORM — giant mushroom-cap as the foreground platform, spotted surface with subtle glow, fungal organic texture, bounce-quality implied',
      'GLOWING MUSHROOM-CLUSTER — cluster of three glowing-mushroom-caps stacked horizontally as platforms, soft-blue-purple glow from within, spore-particles drifting',
      'SLIME-STAINED SEWER PIPE — slime-stained sewer-pipe running horizontally as the foreground platform, drip-pools at edges, mossy-green stain, sewer-quality',
      'BRICK-LEDGE OVER WATER — brick-ledge running across the foreground above sewer-water, slimy-green water reflecting below, drainage-pipe at the right edge',
      'BONE-TILE FLOOR — platform tiles made of stacked bone-fragments, skull-shapes in the tile-pattern, ossuary atmosphere, dim torch-light catching the bones',
      'CORAL-FORMATION PLATFORM — underwater coral-platform formation extending across the foreground, bright pink-orange coral-detail, fish-silhouettes hovering nearby',
    ],
    instructions: `Each entry is ONE specific FOREGROUND PLATFORM GEOGRAPHY, 25-45 words. Format: "PLATFORM NAME CAPS — specific surface + texture detail + horizontal extent + edge detail". MANDATORY — (a) surface material, (b) texture detail, (c) horizontal extent, (d) edge detail. NO biome description (separate axis). NO hero/enemy. NO IP/UI/sexual. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_side_scroller_hero_action: {
    format: 'simple',
    theme: `HERO + ENEMY ACTION for the PixelBot side-scroller-world path. Each entry describes ONE specific moment of gameplay action — hero pixel-sprite mid-stride / mid-jump / mid-attack on the platform, with 1-2 enemies engaging. Each entry 30-55 words.

⚠️ THE BAR: every entry produces a render where the hero pixel-sprite is on the platform mid-action AND 1-2 enemies are present (patrolling / charging / hovering / shooting), making the moment feel like ACTIVE gameplay, not a static vista.

⚠️ HERO ARCHETYPE VARIETY — distribute across:
  • Armored knight (sword + cape)
  • Robed mage (staff + spell)
  • Hooded ranger (bow + cloak)
  • Dual-dagger rogue
  • Plate-paladin (warhammer)
  • Plate-warrior (greatsword)
  • Cleric (mace + holy-light)
  • Pixel-druid (staff + nature-glow)
  • Pixel-assassin (poisoned-blade)
  • Whip-using vampire-hunter (Castlevania-style)

⚠️ MID-ACTION POSES MANDATORY:
  - Running mid-stride
  - Mid-jump / mid-air
  - Mid-attack swing
  - Casting magic
  - Drawing bow
  - Dodging
  - Wall-grab / ledge-hang

⚠️ ENEMY VARIETY — distribute:
  • Skeleton warrior / archer
  • Bat-cluster
  • Slime-blob
  • Spider
  • Demon-imp
  • Cultist
  • Zombie
  • Vampire / wraith
  • Living-armor
  • Goblin
  • Fire-elemental
  • Mecha-enemy (factory biome)

🚫 STRICT BANS:
  • NO sexualized armor / characters
  • NO gore / dismemberment
  • NO modern weapons (sword / bow / staff / axe / whip ONLY)
  • NO IP characters
  • NO hero-alone (1+ enemy mandatory)
  • NO static poses — MID-ACTION mandatory`,
    touchpoints: [
      'KNIGHT MID-JUMP VS SKELETON-WARRIORS — armored knight mid-jump arcing through the air with sword raised over two skeleton-warriors below on the foreground platform, cape flowing behind, sword catching torch-light, mid-attack',
      'KNIGHT RUNNING + CHARGING ZOMBIE — armored knight mid-stride running left-to-right across the platform with sword drawn, charging zombie ahead mid-lunge with arms outstretched, cape flowing, action moment',
      'MAGE CASTING + DEMON-IMP — robed mage mid-stride casting blue-fireball mid-air toward a flying demon-imp hovering above the platform, magic-circle glowing under mage feet, ember-particles drifting',
      'MAGE LIGHTNING + CULTIST — robed mage with staff raised casting lightning-arc at a robed cultist mid-incantation across the platform, both sprite-figures visible at the foreground level, electric-magic crackling',
      'RANGER BOW-DRAW + BAT-CLUSTER — hooded ranger mid-bow-draw with arrow nocked aimed at a cluster of pixel-bats swarming from the midground depth, ranger crouched on the foreground platform',
      'RANGER MID-ARROW + SKELETON-ARCHER — hooded ranger mid-arrow-shot with arrow streaking left-to-right toward a skeleton-archer at the platform far end also drawing its bow, dynamic action moment',
      'ROGUE DOUBLE-JUMP + SPIDER — dual-dagger rogue mid-double-jump apex with twin-daggers raised above a giant spider mid-leap from the platform-edge, sprite-figures in dynamic mid-air poses',
      'ROGUE WALL-DASH + GOBLIN — dual-dagger rogue mid-wall-dash off a stone-pillar with twin-daggers extending, charging goblin mid-stride approaching on the foreground platform below',
      'PALADIN CHARGE + ARMORED-FOE — plate-paladin mid-charge with warhammer raised running across the platform, armored-foe (skeleton-knight) mid-counter-charge approaching, sparks implied between the two',
      'PALADIN SHIELD-RAISE + MAGIC-BOLT — plate-paladin mid-shield-raise as a magic-bolt from off-frame demon-mage streaks toward him, sword in his other hand mid-swing at a charging zombie ahead',
      'WARRIOR GREATSWORD-SWING + OGRE — plate-warrior mid-greatsword-swing toward a massive ogre mid-club-swing on the platform, both sprite-figures locked in heavy combat poses, fragments flying',
      'WARRIOR LEAPING-CHARGE + SLIMES — plate-warrior mid-leap-attack with greatsword toward two large slime-blobs on the platform-foreground, slimes mid-jiggle, action moment',
      'CLERIC HOLY-LIGHT + WRAITH — cleric mid-stride with mace raised casting holy-light from upraised hand, a translucent wraith dispersing in the light, second-wraith approaching from the side',
      'CLERIC RAISED-MACE + ZOMBIE — cleric mid-stride with mace raised over an approaching zombie on the platform, holy-light radiating from the mace, second-zombie mid-stride approaching',
      'DRUID STAFF-CAST + VINES — pixel-druid mid-stride casting nature-magic — vines erupting from the platform-edge wrapping around a charging boar-creature mid-charge, druid robe and staff glowing green',
      'DRUID TRANSFORM + WOLVES — pixel-druid mid-transform-glow with staff held high as two dire-wolf enemies leap toward him from the platform-foreground edge, mid-transformation magic-glow',
      'ASSASSIN STEALTH-LEAP + GUARD — leather-clad assassin mid-stealth-leap with poisoned-blade extended toward an unaware guard mid-patrol on the platform, surprise-attack moment',
      'ASSASSIN DAGGER-THROW + CULTIST — leather-clad assassin mid-throw releasing a dagger mid-air at a cultist mid-incantation across the platform, second dagger ready in hand',
      'VAMPIRE-HUNTER WHIP + BAT-CLUSTER — whip-using vampire-hunter mid-whip-crack with whip arcing through a cluster of pixel-bats swarming from above the platform, Castlevania-style action',
      'VAMPIRE-HUNTER WHIP + ZOMBIE-LURCH — vampire-hunter mid-whip-strike at a lurching zombie ahead on the platform, second zombie approaching from behind, whip-tip catching torch-light',
      'KNIGHT WALL-JUMP + WRAITHS — armored knight mid-wall-jump pushing off a stone pillar with sword extended toward two wraiths floating above the platform-foreground, dynamic vertical action',
      'MAGE BARRIER + DEMON-FIRE — robed mage mid-stride casting protective-magic-barrier as fire-elemental enemy hurls fire-balls from the platform-foreground edge, mage shielding behind glowing magic',
      'RANGER MID-JUMP + SPIDER-WEB — hooded ranger mid-jump with bow drawn over a giant spider-web spanning the platform, spider hanging from above, arrow ready to release',
      'ROGUE BACKSTAB + GOLEM — dual-dagger rogue mid-backstab leap onto a stone-golem back, twin-daggers buried in golem stone-shoulder, golem mid-fist-swing missing the rogue, dynamic combat',
      'PARTY OF 2 VS ENEMY-CLUSTER — armored knight + robed mage running mid-stride along the platform side-by-side, knight mid-sword-swing at a charging skeleton, mage mid-cast at a flying demon-imp, multiple enemies engaged',
    ],
    instructions: `Each entry is ONE specific HERO + ENEMY ACTION moment, 30-55 words. Format: "HERO ACTION + ENEMIES CAPS — hero archetype + mid-action pose + 1-2 enemy types + mid-action engagement". MANDATORY — (a) hero archetype, (b) mid-action pose, (c) 1-2 enemies mid-action. NO sexualized. NO gore. NO modern weapons. NO IP. NO hero-alone. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_side_scroller_atmospheric_phenomenon: {
    format: 'simple',
    theme: `40%-GATED ATMOSPHERIC PHENOMENON for the PixelBot side-scroller-world path. Each entry describes ONE specific parallax-magic particle / weather / ambient detail amplifying the side-scroller atmosphere. Each entry 20-40 words.

🚫 STRICT BANS:
  • NO IP / UI / sexualized content
  • NO modern setting overrides

✓ ATMOSPHERIC CATEGORIES:
  A. PETAL-FALL — pink / white petals drifting horizontally
  B. EMBER-FALL — orange/red embers drifting upward
  C. SNOW-FALL — gentle snowflakes
  D. RAIN — pixel-rain slanting
  E. POLLEN / SPORE — glowing magic-pollen
  F. MIST / FOG — drifting horizontal fog
  G. AURORA / NORTHERN LIGHTS — sky-glow
  H. FIREFLIES — points of warm light
  I. SAND / DUST — desert dust drifting
  J. STARS / METEOR — cosmic-void backdrop`,
    touchpoints: [
      'CHERRY-BLOSSOM PETAL-FALL — soft pink cherry-blossom petals drifting horizontally across all three parallax depths of the side-scroller frame, gentle leftward motion implied',
      'EMBER-FALL DRIFTING UPWARD — orange-red embers drifting upward through all three parallax layers, intense fire-glow saturating the scene, ash-flakes mixed in',
      'GENTLE PIXEL-SNOWFALL — gentle pixel-snowflakes drifting downward through the three parallax layers, snow accumulating on the foreground platform, cool-blue ambient',
      'PIXEL-RAIN SLANTING — pixel-rain slanting diagonally across the frame at all three parallax depths, wet shimmer on the foreground platform, gloomy atmospheric',
      'GLOWING MAGIC-POLLEN — drifting glowing magic-pollen particles in soft-purple-and-pink throughout the three parallax layers, fairy-magic atmospheric quality',
      'FOREST-POLLEN DRIFT — golden-yellow forest-pollen motes drifting horizontally across the frame at all three depths, dappled forest-light catching the particles',
      'DRIFTING HORIZONTAL FOG — soft pixel-fog rolling horizontally through the midground parallax layer, half-obscuring distant structures, foreground stays clear, atmospheric',
      'DEEP-FOG MIDGROUND — dense low-fog rolling across the midground parallax depth, soft-blue mist-color, far backdrop visible above the fog-line, eerie atmosphere',
      'AURORA SKY-GLOW — aurora-borealis ribbons of green and purple in the far-backdrop sky, casting cool ambient over the snowy biome, ethereal atmosphere',
      'FIREFLY POINTS IN TWILIGHT — gentle firefly points of warm-yellow light scattered through the air at all three parallax depths, twilight-blue ambient ',
      'DESERT SAND-DUST DRIFT — golden-amber sand-dust drifting horizontally through the foreground and midground, warm-amber ambient bath, desert atmosphere',
      'COSMIC STARDUST — drifting stardust particles in the cosmic-void backdrop, distant nebulae faint in the far-depth, sparkle-twinkle particles',
      'METEOR STREAKING — single pixel-meteor streaking across the far-backdrop with trailing light, cosmic-void atmosphere, distant galaxies visible',
      'STORMY LIGHTNING-FLASH — sudden lightning-flash illuminating the entire parallax depth, silhouettes lit briefly, gothic-dramatic atmosphere',
      'GHOSTLY GREEN-MIST — sickly-green ghostly mist drifting through the midground parallax depth, ghost-silhouettes barely visible in the mist, haunted atmosphere',
      'GOLDEN-HOUR SUN-RAYS — golden-hour sun-rays slanting through gaps in the canopy at the midground depth, dust-motes catching the light, warm golden ambient',
      'MOONLIT NIGHT — moonlit night with bright pixel-moon in the far-backdrop, pale-blue ambient throughout, gentle moon-glow on the foreground platform',
      'SUNSET-GOLD BACKDROP — sunset-gold sky in the far-backdrop with silhouetted clouds catching warm light, foreground in twilight ambient',
      'EMBER-AND-SPARKS — combined embers and metallic sparks drifting through all three parallax depths, fire-glow with metallic-spark accents, industrial-fire atmosphere',
      'GLOWING SPORE-PUFFS — glowing-fungal-spore-puffs drifting from foreground mushroom-platforms upward through the parallax depth, soft purple-pink glow, magical-fungal',
      'WATER-BUBBLE STREAM — underwater bubble-stream rising vertically through the parallax depths, sub-aquatic atmosphere with blue ambient',
      'CASCADING WATERFALL — small waterfall cascading in the midground parallax depth, water-droplets at the foreground level, mist drifting',
      'DROPS OF MOLTEN MAGMA — small drops of molten magma falling from above at the midground depth, fire-red glow trailing, volcanic-intensity atmosphere',
      'DRIFTING TOXIC-GAS — sickly-green toxic-gas drifting horizontally through the midground parallax, hazard-warning atmospheric quality',
      'CRYSTAL-LIGHT REFLECTIONS — crystal-light reflections bouncing off ice-crystal-walls in the midground depth, prismatic shimmer scattered throughout, ice-cavern ambient',
    ],
    instructions: `Each entry is ONE specific ATMOSPHERIC PHENOMENON, 20-40 words. Format: "EFFECT NAME CAPS — primary particle/effect + parallax-depth where it appears + atmospheric quality". Vary across the 10 categories. NO IP/UI/sexual content. Just side-scroller parallax-magic. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── dungeon-depth path (2026-05-20 axis-system migration) ───
  pixelbot_dungeon_depth_chamber: {
    format: 'simple',
    theme: `DUNGEON CHAMBER for the PixelBot dungeon-depth path. Each entry is ONE specific top-down Diablo-style chamber type — treasure room / altar room / sarcophagus crypt / library / ambush corridor / boss antechamber / pit-trap room / prison cells / etc. Each entry 30-55 words.

⚠️ THE BAR: every entry produces a render where the chamber is INSTANTLY recognizable as a Diablo / Hades / Hyper Light Drifter / Children of Morta top-down dungeon-crawler chamber. Tile-floor + walls + chamber-function clear.

⚠️ CHAMBER CATEGORIES — distribute the 25 entries across:
  • ~3 TREASURE ROOM — central treasure chest, gold piles, gem-glow, runic loot
  • ~3 SARCOPHAGUS / CRYPT — stone sarcophagi lining walls, bone-piles, skeletons
  • ~3 ALTAR / RITUAL ROOM — central altar with rune-glow, candelabras, ritual circle
  • ~3 AMBUSH CORRIDOR — narrow stone corridor with arrow-slits / hidden traps
  • ~3 BOSS ANTECHAMBER — massive double-doors at far end, broken pillars, ominous atmosphere
  • ~2 LIBRARY / ARCHIVE — bookshelves along walls, candlelight, scattered tomes
  • ~2 PIT-TRAP ROOM — central pit with spikes / molten lava / void below
  • ~2 PRISON CELLS — iron-barred cells, chained skeletons, torture racks
  • ~2 OVERGROWN RUIN — moss-and-vine-grown ancient chamber, ivy on walls
  • ~2 BLOOD-SOAKED ARENA — circular arena with blood-stains, bone-piles at edges

⚠️ EVERY entry MUST include:
  - SPECIFIC chamber function (treasure / altar / crypt / corridor / etc.)
  - TILE-FLOOR detail (stone-tile / cracked-flagstone / bone-tile / blood-stained / mossy / runic)
  - WALL detail (carved stone / iron-bound / arched / broken / pillared)
  - CHAMBER-LANDMARK (the dominant feature — chest / altar / sarcophagi / etc.)
  - TOP-DOWN or 3/4-ISO framing implied (NEVER side-view)

🚫 STRICT BANS:
  • NO hero / monster description (separate axis — hero_encounter)
  • NO modern setting / sci-fi / cyberpunk
  • NO outdoor scenes (this is INDOOR dungeon)
  • NO UI / IP refs
  • NO sexualized content
  • NO side-view / first-person framing

✓ DIABLO-STYLE TOP-DOWN AESTHETIC — chamber reads as gameplay space the hero crawls through.`,
    touchpoints: [
      'CENTRAL TREASURE CHAMBER — square stone chamber with cracked-flagstone tile floor, massive iron-bound treasure chest at center overflowing with gold coins, four stone pillars at corners, torch-sconces lit along the walls, runic carvings glowing faintly',
      'GOLD-PILE TREASURE ROOM — vaulted stone chamber with multiple smaller treasure chests around the perimeter, central gold-pile mound with scattered coins spilling across cracked-flagstone tile floor, dripping candelabra hanging above',
      'GEM-GLOW VAULT — circular stone vault chamber with mosaic-tile floor inlaid with rune-patterns, central pedestal holding a glowing magic gem, four arched alcoves around the perimeter with smaller gem-shrines',
      'SARCOPHAGUS CRYPT — long stone crypt chamber with stone sarcophagi lining both walls, cracked-flagstone tile floor strewn with bone-piles, torch-sconces between sarcophagi, broken stone columns supporting ceiling',
      'BONE-LITTERED OSSUARY — broad stone ossuary with skull-piles stacked against walls, bone-tile floor in mosaic patterns, central stone bier with ornate sarcophagus, torch-light flickering across the bones',
      'SKELETAL THRONE ROOM — stone throne room with skeletal king seated on raised stone throne at far end, bone-tile floor leading to throne, columns of stacked skulls, blood-red banners hanging from walls',
      'RUNIC ALTAR CHAMBER — circular stone chamber with central stone altar carved with glowing magic runes, ritual-circle of glowing rune-stones surrounding the altar, candelabras at four cardinal points, dripping wax on the runic tile-floor',
      'BLOOD-RITUAL CHAMBER — pentagonal stone chamber with central blood-stained ritual altar, blood-pools soaking into cracked-flagstone tile floor, hanging chains, black-iron candelabras, runic carvings on the walls',
      'CANDLE-LIT ALTAR ROOM — small stone altar chamber with central altar covered in dripping candles, candle-wax pooled across the cracked-stone tile floor, alcoves with smaller candle-shrines, faint runic glow',
      'NARROW AMBUSH CORRIDOR — narrow stone corridor with arrow-slit walls on both sides, cracked-flagstone tile floor leading deeper into the dungeon, hidden pressure-plates marked by subtle tile-discoloration, torches in iron sconces',
      'TRAP-LADEN CORRIDOR — long stone corridor with cracked-flagstone tile floor scattered with dart-trap holes in the walls, spike-trap floor-grates, dripping ceiling-water, fading torch-light receding into darkness',
      'SECRET-PASSAGE CORRIDOR — narrow stone passage with mossy-stone tile floor, hidden door visible as a seam in the wall at the far end, cobwebs hanging from ceiling, single torch flickering halfway down',
      'BOSS ANTECHAMBER WITH DOORS — massive vaulted antechamber with cracked-flagstone tile floor leading to colossal double-doors carved with runes at the far end, broken pillars on both sides, scattered bones, ominous magic glow under the doors',
      'OMINOUS ANTECHAMBER — broad stone antechamber with cracked-flagstone tile floor, massive carved-stone doors at the far end pulsing with red-rune glow, four broken columns, blood-stains across the tiles',
      'COLUMNED BOSS PASSAGE — long columned chamber with cracked-flagstone tile floor, ten massive stone columns flanking the path to ominous arched doorway at the end, runic torches between columns',
      'LIBRARY ARCHIVE — vaulted stone library with floor-to-ceiling wooden bookshelves along walls, cracked-stone tile floor scattered with fallen tomes, central reading-desk with open spellbook, candelabras providing flickering light',
      'TOWER LIBRARY — circular tower-library with spiral-staircase ascending along the wall, wooden bookshelves wrapping the chamber, cracked-stone tile floor, central reading-pedestal, glowing magic-tome on the desk',
      'CENTRAL PIT-TRAP ROOM — square stone chamber with cracked-flagstone tile floor around a central pit-trap, spikes glinting at the bottom of the pit, chains hanging into the pit from above, four torch-sconces at corners',
      'LAVA-PIT ROOM — stone chamber with cracked-flagstone tile floor around a central lava-pit casting orange-red glow upward, columns of fire-stained stone, dripping iron-chains hanging into the lava',
      'PRISON CELL BLOCK — long stone corridor with iron-barred cell-doors lining both walls, cracked-flagstone tile floor stained with old blood, chained skeletons visible inside cells, single torch flickering halfway down',
      'TORTURE CHAMBER — dim stone torture chamber with cracked-flagstone tile floor, iron racks and chains hanging from walls, skeletons-in-chains slumped along the perimeter, single bloody candle on a stand',
      'OVERGROWN RUIN CHAMBER — once-grand stone chamber now overgrown with moss and ivy climbing the walls, mossy-stone tile floor with creeping plants, broken columns, beam of pale light from a ceiling-crack',
      'JUNGLE-OVERTAKEN VAULT — ancient stone vault with mossy-stone tile floor sprouting fern and creeper-vines, broken columns wrapped in vines, dripping water from cracked ceiling, single shaft of pale jungle light',
      'BLOOD-SOAKED ARENA PIT — circular stone arena with blood-stained tile floor, bone-piles at the perimeter, broken-weapon scatter across the tiles, raised gallery of stone bleachers around the perimeter',
      'GLADIATOR ARENA CHAMBER — circular stone arena with cracked-flagstone tile floor, weapon-rack against one wall, raised stone judge-throne, gates flanking the arena leading to monster-pens',
    ],
    instructions: `Each entry is ONE specific DUNGEON CHAMBER, 30-55 words. Format: "CHAMBER NAME CAPS — specific chamber function + tile-floor + wall + chamber-landmark detail". MANDATORY — (a) chamber function, (b) tile-floor, (c) wall detail, (d) chamber-landmark, (e) top-down framing implied. NO hero/monster description (separate axis). NO modern / outdoor / UI / IP / sexual. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_dungeon_depth_biome: {
    format: 'simple',
    theme: `DUNGEON BIOME / VISUAL REGISTER for the PixelBot dungeon-depth path. Each entry describes the visual register of the dungeon — tile material, wall texture, atmospheric quality. Stone-tile / lava-cracked / icy-crystal / bone-tile / blood-pool / mossy-overgrown / sewer / magic-runic / etc. Each entry 25-45 words.

⚠️ THE BAR: every entry produces a render where the dungeon biome reads instantly — specific tile material + wall character + atmospheric quality combining into a distinct dungeon "look."

⚠️ BIOME VARIETY MANDATE — distribute the 25 entries across:
  • ~4 STONE-TILE CLASSIC — gray-stone tiles, gothic-stone walls, torch-lit
  • ~3 LAVA-CRACKED / FIRE-DUNGEON — magma-cracked tile floor, fire-glow walls, ember-particles
  • ~3 ICY-CRYSTAL — frost-coated stone tiles, ice-crystal walls, cold-blue ambient
  • ~3 BONE-TILE / SKELETAL — tiles made of stacked bones, bone-walls, ossuary quality
  • ~2 BLOOD-SOAKED — blood-stained tile floor, blood-runnels in tiles, crimson ambient
  • ~3 MOSSY-OVERGROWN — moss-covered stone tiles, vine-overgrown walls, green-tinged light
  • ~2 SEWER / DRAINAGE — cracked sewer-tile floor, drainage-channels, sickly-green water
  • ~2 MAGIC-RUNIC — rune-inlaid tile floor, glowing-rune walls, magic-violet ambient
  • ~2 OBSIDIAN BLACK-STONE — polished black-obsidian tile, sleek black walls, void-dark
  • ~1 CRUMBLING ANCIENT — fallen-stone tile rubble, broken walls, dust-and-cobweb

⚠️ EVERY entry MUST include:
  - SPECIFIC TILE MATERIAL (stone / cracked-flagstone / magma-tile / bone-tile / mossy-stone / etc.)
  - SPECIFIC WALL CHARACTER (gothic-stone / fire-stained / ice-crystal / mossy / runic-glowing)
  - ATMOSPHERIC QUALITY (torch-lit / fire-glow / cold-mist / blood-mist / magic-glow / dust-shadow)
  - SATURATED DARK GOTHIC palette implied

🚫 STRICT BANS:
  • NO chamber description (separate axis)
  • NO hero / monster (separate axis)
  • NO outdoor / modern / sci-fi
  • NO UI / IP / sexual content`,
    touchpoints: [
      'CLASSIC GOTHIC STONE — cracked-flagstone tile floor in slate-gray, gothic-stone walls with carved relief, torch-sconces casting flickering warm-orange light, dust-motes drifting through torch-beams',
      'WEATHERED STONE-AND-TORCHLIGHT — weathered grey-stone tiles with mossy cracks, gothic-stone walls with rusted-iron sconces holding torches, flickering warm-orange ambient, dim atmospheric depth',
      'MEDIEVAL DUNGEON STONE — dark stone tiles in deep gray with iron-banded edges, gothic-stone walls with chains hanging from iron rings, torch-light flickering casting deep shadows, gothic atmosphere',
      'COLUMNED STONE HALL — polished gray-stone tile floor with carved decorative borders, gothic-stone walls with carved column-reliefs, torchlight catching the stone-carvings, dust-air',
      'LAVA-CRACKED MAGMA DUNGEON — magma-cracked tile floor with orange-glowing cracks between black tiles, fire-stained walls in deep red-brown, ember-particles drifting in the air, intense warm orange-red ambient',
      'FIRE-DUNGEON FORGE-LEVEL — black-volcanic tile floor with glowing magma-cracks, fire-stained walls with hanging chains, glowing-forge alcoves, ember-rain drifting, intense red-orange ambient',
      'OBSIDIAN-AND-FLAME — polished black-obsidian tile floor reflecting fire-light, fire-stained obsidian walls, fire-glow leaking through wall-cracks, ember-particles, intense red ambient',
      'ICY-CRYSTAL FROZEN VAULT — frost-coated stone tile floor with ice-crystal patterns, ice-crystal walls catching pale-blue light, cold-mist drifting at ankle-height, cool blue-white ambient',
      'GLACIAL TUNNEL — ice-encrusted stone tiles with frost-patterns, glacial-blue ice walls with embedded fossilized creatures, cold mist drifting, pale-blue cold ambient',
      'CRYSTAL-CAVE DUNGEON — clear-crystal tile floor with internal-glowing facets, crystal-formation walls, soft-blue magical glow from within the crystals, cool ambient with shimmer-particles',
      'BONE-TILE OSSUARY — tile floor made of interlocked bone-fragments and skulls, bone-wall constructions with stacked skulls in patterns, dim torch-light, bone-grey ambient with subtle warm flicker',
      'SKULL-MOSAIC FLOOR — skull-mosaic tile floor with carved skull-patterns, bone-and-stone walls with embedded skulls in niches, ghostly green-flame torches, eerie green-grey ambient',
      'SKELETAL CATACOMB — narrow bone-tile corridors with stacked skull-piles along walls, dim torch-light catching the bone-textures, bone-grey ambient with warm torch-flicker',
      'BLOOD-SOAKED CHAMBER — blood-stained cracked-stone tile floor with blood-runnels between tiles, blood-spatter on stone walls, dim torch-light casting reddish ambient, blood-mist hanging at ankle-height',
      'CRIMSON RITUAL DUNGEON — deep-red-stained stone tile floor, blood-streaked walls with iron-chain rings, hanging blood-soaked banners, deep crimson ambient with flickering candle-light',
      'MOSSY OVERGROWN STONE — moss-covered stone tile floor with creeping ivy crawling across tiles, mossy stone walls with ferns growing from cracks, green-tinged ambient with shafts of pale light from above',
      'JUNGLE-VINE OVERTAKEN — stone tile floor sprouting jungle-vines and ferns through tile-cracks, vine-covered stone walls with hanging-vines from ceiling, dappled green-light, humid jungle atmosphere',
      'ANCIENT MOSSY RUIN — broken stone tile floor with moss-creep and pooling rainwater, ivy-covered cracked walls, pale shafts of light from cracks in the ceiling, atmospheric haze',
      'SEWER DRAINAGE LEVEL — cracked sewer-tile floor with central drainage-channel running through, slime-stained brick walls, sickly-green ambient from glow-mold patches, dripping water sounds implied',
      'TOXIC-WATER SEWER — tile floor partly flooded with toxic-green water, slime-stained sewer walls with iron-grates, glowing-mold patches, sickly green ambient',
      'MAGIC-RUNIC SANCTUM — rune-inlaid stone tile floor with glowing-rune patterns radiating outward, runic-glowing stone walls, magic-violet ambient with rune-glow particles drifting, mystical atmosphere',
      'ARCANE-GLOWING DUNGEON — purple-and-blue runic tile floor with glowing magic-circles, rune-engraved walls pulsing with arcane glow, magic-violet ambient with sparkle-particles, eldritch atmosphere',
      'OBSIDIAN VOID-DUNGEON — polished black-obsidian tile floor reflecting deep darkness, sleek black-stone walls with faint metallic sheen, single shaft of pale light, void-dark ambient with deep blue-black shadows',
      'DEMON-FORGE OBSIDIAN — black-obsidian tile floor with red-magma-veins glowing between tiles, obsidian walls with embedded glowing-red runes, demonic forge ambient',
      'CRUMBLING DUST-RUIN — fallen-stone tile rubble scattered across the floor, broken-stone walls with dust-cobweb covering, dust-motes thick in air, single shaft of pale light from a ceiling-crack',
    ],
    instructions: `Each entry is ONE specific DUNGEON BIOME / visual register, 25-45 words. Format: "BIOME NAME CAPS — tile material + wall character + atmospheric quality". MANDATORY — (a) tile material, (b) wall character, (c) atmospheric quality, (d) saturated dark gothic palette implied. NO chamber description (separate axis). NO hero/monster. NO outdoor/modern/sci-fi/UI/IP. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_dungeon_depth_hero_encounter: {
    format: 'simple',
    theme: `HERO PARTY + MONSTER ENCOUNTER for the PixelBot dungeon-depth path. Each entry describes a PARTY of 2-3 heroes engaging 2-5 monsters in a chamber — multiple hero classes + multiple monsters + mid-action engagement. The chamber is ACTION-PACKED with multiple bodies on screen — Diablo / Hades / Children-of-Morta co-op level energy. Each entry 35-65 words.

⚠️ THE BAR: every entry produces a render where 2-3 HEROES + 2-5 MONSTERS are ALL clearly visible in the chamber, mid-action — party combat / swarm engagement / multi-hero combo / party-vs-boss. Top-down view, all pixel-sprites recognizable.

⚠️ PARTY-SIZE MANDATE — every entry has 2-3 HEROES of DIFFERENT CLASSES (e.g. knight + mage + ranger / paladin + cleric + rogue / barbarian + druid + assassin). Heroes are clearly differentiated by silhouette + weapon + armor.

⚠️ SWARM / MULTI-MONSTER MANDATE — every entry has 2-5 MONSTERS in the chamber — a skeleton patrol (3-4 skeletons) / a zombie horde (4-5 zombies) / a bat-cluster (multiple bats) / a lich + 2 summoned skeletons / a spider-queen + 2 spiderlings / etc.

⚠️ HERO CLASS VARIETY — distribute across hero archetypes:
  • Armored Knight (sword + shield)
  • Robed Mage (staff + spellcasting)
  • Hooded Ranger (bow + arrow)
  • Dual-Wielding Rogue (twin daggers)
  • Plate-Armored Paladin (warhammer + shield)
  • Leather-Clad Assassin (poisoned blade)
  • Two-Handed Barbarian (greatsword / battleaxe)
  • Cleric (mace + holy-light)
  • Druid (staff + nature-magic)
  • Necromancer (skull-staff + dark-magic — only as hero in occasional anti-hero variants)

⚠️ MONSTER VARIETY — distribute across:
  • Skeleton warrior / archer
  • Zombie horde
  • Bat-cluster
  • Lich casting
  • Demon-imp
  • Slime-pile
  • Undead knight
  • Spider-queen / giant spider
  • Mimic-chest
  • Cultist / dark-priest
  • Ogre / minotaur
  • Wraith / specter
  • Dragon-whelp (smaller mid-level dragon)
  • Stone golem / iron golem
  • Demon (larger threat)

⚠️ MID-ACTION POSES — every entry MUST describe specific combat moment:
  - Sword-swing / parry
  - Spell-casting (magic-circle / projectile / lightning)
  - Bow-draw / mid-arrow-flight
  - Sneak-attack (rogue behind monster)
  - Charge (paladin / barbarian closing distance)
  - Defensive stance (shield raised)
  - Battle-cry / war-shout

🚫 STRICT BANS:
  • NO gore / dismemberment / explicit violence (light combat only)
  • NO sexualized armor / characters
  • NO modern weapons (sword/bow/staff/axe ONLY)
  • NO IP characters
  • NO static portraits — MID-ACTION mandatory
  • NO single-figure (hero alone OR monster alone) — BOTH must be visible`,
    touchpoints: [
      'KNIGHT-MAGE-RANGER VS SKELETON PATROL — armored knight mid-sword-swing at one skeleton-warrior, robed mage behind casting blue-fireball at second skeleton, hooded ranger drawing bow at a third skeleton-archer, four skeletons total spread across the chamber, all mid-action',
      'PALADIN-CLERIC-ROGUE VS ZOMBIE HORDE — plate-armored paladin mid-warhammer-swing at three zombies, cleric behind casting holy-light radiating outward stunning two more zombies, dual-dagger rogue flanking from the side mid-strike, five zombies engaged total, blood-pools on tiles',
      'KNIGHT-BARBARIAN-MAGE VS UNDEAD KING — armored knight + two-handed barbarian + robed mage triple-team an undead-king on a stone-throne, knight mid-charge, barbarian mid-greatsword-swing, mage casting fireball mid-air, two skeleton-guards flanking the king',
      'PARTY OF 3 VS LICH AND SUMMONED SKELETONS — robed mage mid-fireball-cast at a lich, paladin mid-warhammer-swing at one summoned-skeleton, hooded ranger mid-arrow-shot at second summoned-skeleton, magic-trails arcing through the chamber',
      'KNIGHT-MAGE VS SPIDER-QUEEN AND SPIDERLINGS — armored knight mid-shield-block as a massive spider-queen lunges, robed mage behind casting magic-bolt at the spider-queen, two smaller spiderlings approaching from the sides',
      'BARBARIAN-ASSASSIN-CLERIC VS DEMON HORDE — two-handed barbarian mid-greatsword-swing at one demon-imp, leather-clad assassin mid-leap-attack on second demon, cleric casting holy-light banishing third demon, ember-particles everywhere',
      'PALADIN-DRUID-RANGER VS DRAGON-WHELP — plate-armored paladin mid-charge with shield-and-hammer, druid casting vines erupting from tile-floor wrapping the dragon, ranger mid-arrow-shot at the dragon eye, dragon mid-fire-breath',
      'KNIGHT-MAGE-ROGUE VS BAT-CLUSTER — armored knight swinging sword cleaving through a bat-cluster, mage casting wind-magic dispersing more bats, dual-dagger rogue mid-leap slashing at a fourth bat, dozens of bats swarming',
      'PARTY OF 3 VS CULTIST RITUAL — three heroes (knight + mage + ranger) bursting into a chamber where four robed cultists are mid-ritual around a glowing rune-circle, knight charging, mage casting, ranger drawing bow, ritual interrupted',
      'KNIGHT-CLERIC-RANGER VS STONE GOLEM AND IMPS — armored knight charging at a towering stone-golem, cleric casting holy-light at two small demon-imps, hooded ranger mid-arrow-shot at the golem head, multi-target engagement',
      'BARBARIAN-MAGE-ASSASSIN VS OGRE AND GOBLINS — two-handed barbarian mid-greatsword-cleave at a massive ogre, robed mage casting lightning-arc at three goblins, leather-clad assassin mid-strike behind another goblin, chaotic battle',
      'PALADIN-MAGE-RANGER VS WRAITH AND SHADOWS — plate-armored paladin holding aloft a glowing-holy-shield, robed mage casting purifying-magic at the wraith, hooded ranger drawing bow at a second shadowy figure emerging from corner',
      'KNIGHT-BARBARIAN VS UNDEAD KNIGHT AND HORDE — armored knight mid-parry against undead-knight strike, two-handed barbarian mid-greatsword-swing at three skeleton-warriors flanking, sparks and bone-fragments mid-air, mid-action engagement',
      'PARTY OF 4 VS SPIDER-QUEEN — full four-hero party (knight + mage + ranger + cleric) surrounding a massive spider-queen at chamber center, four attack-angles, web-strands and magic-trails crisscrossing, intense boss combat',
      'KNIGHT-MAGE-ROGUE VS LICH AND SUMMONED — armored knight blocking with shield, mage casting counter-magic, dual-dagger rogue flanking around to back-stab the lich, two summoned-skeletons attacking the knight, magic-duel feel',
      'PALADIN-DRUID VS MINOTAUR AND WOLVES — plate-armored paladin mid-warhammer-swing at minotaur mid-axe-swing, druid casting vine-magic on two summoned dire-wolves, multiple targets engaged at once, action-packed chamber',
      'KNIGHT-MAGE-CLERIC VS DEMON BOSS — armored knight charging at a massive demon-boss, robed mage hurling fireball, cleric casting holy-light, three angles of attack on the demon, two small demon-imps emerging from the sides',
      'BARBARIAN-RANGER-ROGUE VS HORDE OF GOBLINS — two-handed barbarian mid-cleave through three goblins, ranger drawing bow at fourth goblin retreating, dual-dagger rogue mid-strike on fifth goblin, six goblins in chamber, action chaos',
      'KNIGHT-CLERIC VS UNDEAD HORDE — armored knight mid-sword-swing cleaving through three skeleton-warriors, cleric behind casting holy-light banishing two more, fifth skeleton-archer drawing bow from the back, multi-target',
      'PARTY OF 3 VS MIMIC-CHEST AND TRAPS — three heroes navigating a trap-filled chamber, mage casting protection-magic, knight blocking a dart-trap with shield, rogue mid-leap as mimic-chest snaps open lunging with teeth',
      'PALADIN-MAGE-ROGUE VS WITCH-COVEN — plate-armored paladin charging at three robed witches mid-ritual, mage casting counter-magic against the witch lightning, rogue flanking to back-stab the lead witch, magic-bolts crisscrossing',
      'KNIGHT-MAGE VS DRAGON AND SKELETONS — armored knight mid-charge at a juvenile dragon, robed mage casting ice-magic at the dragon wing, two skeleton-archers drawing bows at the heroes from corners, dragon fire-breath mid-air',
      'BARBARIAN-CLERIC-RANGER VS DEMON AND HORDE — two-handed barbarian mid-cleave at a horned demon, cleric casting holy-light protecting against demon-fire, ranger drawing bow at three lesser-demon-imps swarming',
      'KNIGHT-ASSASSIN VS LICH AND BONE-GUARDIANS — armored knight mid-shield-block against lich purple-magic, leather-clad assassin sneaking behind to back-stab a bone-guardian, second bone-guardian mid-axe-swing at the knight, multi-target',
      'FULL PARTY VS DRAGON BOSS — full four-hero party (paladin + mage + ranger + barbarian) surrounding a massive dragon mid-fire-breath, four-angles of attack with shield-block + magic-cast + arrow-shot + greatsword-swing, ultimate boss-fight',
    ],
    instructions: `Each entry is ONE specific PARTY (2-3 heroes) + SWARM (2-5 monsters) encounter, 35-65 words. Format: "HERO-PARTY VS MONSTER-SWARM CAPS — multiple pixel-sprites visible in mid-action combat detail". MANDATORY — (a) 2-3 hero classes of DIFFERENT silhouettes, (b) 2-5 monsters in the chamber, (c) mid-action pose for ALL, (d) chamber-floor context. NO gore. NO sexualized characters. NO modern weapons. NO IP. NO single-figure. ACTION-PACKED multi-body chamber. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_dungeon_depth_loot_detail: {
    format: 'simple',
    theme: `40%-GATED DIABLO-STYLE LOOT / DUNGEON PROP detail for the PixelBot dungeon-depth path. Each entry describes ONE specific loot or prop accent amplifying the dungeon-crawler feel — treasure chest detail / scattered gold / glowing weapon / rune-altar / candelabra / blood-pool / etc. Each entry 20-40 words.

⚠️ MANDATORY — every entry adds dungeon-crawler texture without overwhelming the hero/monster focus.

🚫 STRICT BANS:
  • NO IP / specific game-loot
  • NO modern weapons / objects
  • NO UI / health-bars / item-tooltips
  • NO sexualized content

✓ LOOT CATEGORIES:
  A. TREASURE CHEST — overflowing, locked, gilded, etc.
  B. SCATTERED GOLD/COINS — pile, scatter, fountain
  C. GLOWING MAGIC WEAPON on the floor
  D. RUNIC ALTAR / RITUAL DETAIL
  E. CANDELABRA / DRIPPING CANDLES
  F. BLOOD-POOL / GORE-DETAIL (light, no explicit)
  G. SKELETAL REMAINS / BONE-PILE
  H. URNS / CLAY POTS / amphorae
  I. MAGIC RUNE-CIRCLE glowing on the tile floor
  J. SARCOPHAGUS detail
  K. WEAPON-RACK / armor-stand`,
    touchpoints: [
      'OVERFLOWING TREASURE CHEST — large iron-bound treasure chest at chamber corner overflowing with gold-coins spilling onto the cracked tile floor, gem-shimmer glinting from the pile, runes carved into the chest-lid',
      'GILDED CHEST WITH GEMS — small gilded chest open on the tile floor with green emeralds and red rubies spilling out, scattered gold-coins around it, magic-glow leaking from the chest',
      'PILE OF SCATTERED GOLD — pile of golden coins scattered across the cracked tile floor near the chamber center, individual coins catching torch-light, deeper-coin-pile in the back implying recent dragon-hoard',
      'GOLD-FOUNTAIN POOL — small stone fountain spilling gold-coins like liquid into a pool below, runic-circle on the floor around the fountain, magic-glow from within the pool',
      'GLOWING SWORD ON FLOOR — magic-glowing sword lying on the cracked-flagstone tile floor with blue-magic aura radiating outward, runes on the blade glowing, the weapon waiting to be picked up',
      'MAGIC STAFF GLOWING — gnarled wooden staff with a glowing crystal-orb at the top lying on the tile floor, purple-magic-glow radiating from the orb, runes on the staff-shaft',
      'GLOWING BOW WITH ARROWS — magical-elven bow with glowing-runic engravings and a quiver of glowing-arrows lying on the tile floor, soft green-magic-aura',
      'RUNIC ALTAR DETAIL — small stone altar in the chamber with carved-rune patterns glowing red on its surface, dripping candles at the corners, sacrificial dagger embedded in the altar-stone',
      'GLOWING RUNE-CIRCLE — circular runic pattern glowing red-purple on the tile floor, candles at the cardinal points, magic-particles drifting upward from the circle, summoning ritual in progress',
      'DRIPPING CANDELABRA — massive iron candelabra hanging from the ceiling with dozens of dripping candles, wax-pooled on the tile floor below, flickering warm light, gothic atmosphere',
      'TALL STANDING CANDLES — three tall standing candle-holders with dripping candles arranged in the chamber, casting flickering shadows on the walls, wax-pooled on the tile floor',
      'BLOOD-POOL ON TILES — fresh blood-pool spreading across the cracked tile floor from off-frame source, blood-spatter on nearby tiles, ominous reminder of previous combat',
      'BLOOD-SPATTER WALL — splatter of dried-blood across one wall and the floor below, scattered shattered weapons in the splatter-zone, evidence of past combat',
      'SKELETAL REMAINS PILE — pile of skeletal remains in one corner of the chamber, fragments of broken-armor among the bones, single sword still clutched in skeletal-hand, ominous',
      'BONE-PILE WITH SKULLS — small pile of bones and three skulls stacked in one corner of the chamber, cracked-tile around the pile, evidence of past adventurers who failed',
      'CLAY URNS WITH HERBS — three large clay-urns in alcove of the chamber, drying-herbs hanging above them, scattered pottery-shards on the tile floor, herbalist-shop remnants',
      'CRACKED AMPHORAE — broken amphorae scattered on the tile floor with red-wine-stain spreading, ceramic-shards everywhere, evidence of recent violence',
      'GLOWING RUNE-PATCH — a single tile in the floor glowing with magic-rune, indicating a hidden trap or magic-trigger, faint-violet-aura radiating',
      'SARCOPHAGUS OPENING — stone sarcophagus along the wall with its lid askew, skeletal-hand visible inside, runes glowing red around the sarcophagus-edge, undead about to rise',
      'WEAPON-RACK WITH SWORDS — wooden weapon-rack along one wall with multiple swords / axes / spears displayed, one weapon missing from its slot suggesting the hero just grabbed it',
      'IRON ARMOR-STAND — iron armor-stand displaying full plate-armor in the corner of the chamber, ancient and dust-covered, magic-glow leaking from the armor-helmet visor',
      'MAGIC-CRYSTAL CLUSTER — cluster of glowing-magic-crystals embedded in one wall, casting blue-magic-light across the chamber, dripping arcane-essence onto the floor',
      'PILE OF ANCIENT TOMES — pile of ancient leather-bound tomes on the tile floor with one open showing glowing-rune-text, scattered scrolls around the pile',
      'TREASURE-MOUND IN BACK — distant background showing a massive treasure-mound in the next chamber visible through an arched doorway, hint of greater riches deeper',
      'BLOODY GAUNTLETS DROPPED — pair of bloody armor-gauntlets dropped on the tile floor next to a broken-shield, evidence of recent combat-loss, ominous foreshadowing',
    ],
    instructions: `Each entry is ONE specific DIABLO-STYLE LOOT / DUNGEON PROP detail, 20-40 words. Format: "LOOT NAME CAPS — primary loot/prop + position on tile floor + magical/atmospheric quality". Vary across the 11 categories. NO IP. NO modern. NO UI. NO sexual content. Just dungeon-crawler texture. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cozy-rpg-town path (2026-05-20 axis-system reference migration) ───
  pixelbot_cozy_rpg_town_locale: {
    format: 'simple',
    theme: `COZY RPG TOWN LOCALE for the PixelBot cozy-rpg-town path. Each entry describes ONE specific cozy-pixel-RPG town space — tavern street / market square / cottage row / harbor / fountain plaza / castle gate / bridge / inn yard / temple steps / blacksmith corner / bakery shopfront / mill yard / chapel courtyard / well plaza. Each entry 30-55 words.

⚠️ THE BAR: every entry produces a render where the locale is INSTANTLY RECOGNIZABLE as a Stardew Valley / Octopath Traveler HD-2D / Sea of Stars / Eastward / Children of Morta town space. Specific architecture + town function + inhabited feel.

⚠️ TOWN LOCALE CATEGORIES — distribute the 25 entries roughly:
  • ~3 TAVERN STREET / INN STREET — half-timbered tavern with glowing window, lanterns, ale-sign, cobblestone path
  • ~3 MARKET SQUARE / MARKET STALL ROW — wooden stalls with goods, awnings, vendor signs, fountain or well at center
  • ~2 COTTAGE ROW / RESIDENTIAL STREET — cottages with thatched roofs, flower-boxes, laundry lines, smoke chimneys
  • ~2 HARBOR / DOCKS / FISHING WHARF — wooden piers, fishing boats, harbor lanterns, salt-weathered buildings
  • ~2 FOUNTAIN PLAZA / TOWN SQUARE — central fountain, surrounding shops, cobblestone radiating outward
  • ~2 CASTLE GATE / TOWN ENTRANCE — gatehouse, drawbridge or arched gate, guards' lookout
  • ~2 STONE BRIDGE / RIVER CROSSING — bridge over river/stream with town visible beyond
  • ~2 BLACKSMITH CORNER / FORGE — anvil + glowing forge + tool-rack + smith hammer
  • ~2 BAKERY / SHOPFRONT — bakery with bread in window, painted sign, awning
  • ~2 TEMPLE STEPS / CHAPEL — small chapel with stone steps, painted bell-tower
  • ~1 MILL / WINDMILL — water-mill or windmill in town setting
  • ~1 WELL PLAZA / VILLAGE WELL — central well with bucket and rope
  • ~1 BRIDGE-OVER-CANAL / CANAL TOWN — Venetian-style canal cutting through town

⚠️ EVERY entry MUST include:
  - SPECIFIC architectural detail (half-timbered / thatched / stone / wood-beam / dwarven-stone / etc.)
  - SPECIFIC functional landmark (tavern sign / forge anvil / fountain / market stall / bakery oven / etc.)
  - INHABITED CUE (lit windows / smoke from chimneys / open shutters / signs above doors / drying laundry / vendor goods)
  - SPATIAL FRAMING — wide cinematic-pixel-art composition, NOT macro closeup
  - COBBLESTONE / WOODEN BOARDWALK / DIRT PATH detail (the path connecting locale)

🚫 STRICT BANS:
  • NO NPC description (separate axis — npc_life)
  • NO biome / weather description (separate axis — town_biome)
  • NO modern setting (no cars, no electricity-poles, no neon-signs, no asphalt)
  • NO UI / HUD / health-bars / dialogue-boxes
  • NO IP references (no specific game characters / logos / franchises)
  • NO empty / abandoned / desolate
  • NO sexualized / inappropriate content

✓ INHABITED COZY-PIXEL-RPG FEEL — the locale reads ALIVE through signs of inhabitance (light, smoke, laundry, goods, signs, paths worn from use).`,
    touchpoints: [
      'TAVERN STREET WITH GLOWING SIGN — half-timbered tavern with painted ale-sign hanging from wrought-iron bracket, glowing window casting warm light onto cobblestone, lanterns flanking the entrance, smoke curling from chimney, wooden barrels stacked outside',
      'INN COURTYARD AT EVENING — two-story timber-and-stone inn surrounding a courtyard with stone well, lit windows on upper floors, hanging laundry between buildings, wooden stable doors with horses peeking, cobblestone yard',
      'COBBLESTONE TAVERN STREET — winding cobblestone street between half-timbered shops with painted signs hanging on iron brackets, tavern at the end with glowing window, lanterns mounted on building corners, smoke from chimneys',
      'MARKET SQUARE WITH STALLS — wooden market stalls with red-and-white striped awnings, baskets of bread / vegetables / cloth / pottery on display, painted signs above each stall, central fountain with stone basin, vendor sign-boards',
      'BUSY MARKET ROW — long row of wooden market stalls with awnings of varied colors, fishmonger / baker / cloth-seller / fruit stand visible, baskets and crates stacked, central path between with cobblestone underfoot',
      'BAKERY SHOPFRONT — half-timbered bakery with bay-window full of loaves and pastries, painted bread-loaf sign above door, warm light glowing from interior, flour-dusted wooden barrel outside, chimney smoking',
      'COTTAGE ROW WITH FLOWER-BOXES — row of half-timbered cottages with thatched roofs, flower-boxes under every window with red and yellow blooms, laundry drying on lines between houses, smoke from chimneys, cobblestone path',
      'THATCHED-ROOF COTTAGE STREET — winding street between thatched cottages with stone foundations and wooden beams, picket fences with garden patches visible, hanging lanterns, dirt path worn through cobblestone',
      'HARBOR WHARF WITH FISHING BOATS — wooden harbor pier with three fishing boats tied up, salt-weathered storage buildings with fishing nets drying on outdoor racks, harbor lanterns on tall posts, gulls implied, distant lighthouse',
      'FISHERMAN COASTAL DOCKS — coastal town docks with wooden piers extending into pixel-water, fishing boats with painted hulls, stack of crates and fishing nets at dock-edge, salt-bleached buildings with weathered shingles',
      'FOUNTAIN PLAZA AT TWILIGHT — central stone fountain with carved water-spout, surrounding shops with painted signs and lit windows, cobblestone radiating outward, benches with travelers seated implied, hanging-lanterns above',
      'TOWN SQUARE WITH WELL — wide town square paved in cobblestone with stone well at center, surrounding half-timbered shops, hanging market signs, fountain bench, hanging lanterns, town clock-tower visible behind',
      'CASTLE GATE ARCHWAY — massive stone gatehouse with portcullis and arched gateway, banners hanging from the walls, guard-tower with lit window above, cobblestone path leading through into the town beyond',
      'TOWN ENTRANCE WITH DRAWBRIDGE — wooden drawbridge over moat-stream leading to stone gatehouse with guard-tower, banners snapping in implied wind, dirt path approaching from foreground meadow',
      'STONE BRIDGE OVER RIVER — three-arched stone bridge crossing winding pixel-river, half-timbered buildings on the far side, water-mill visible downstream, dirt path leading onto the bridge from foreground',
      'CANAL CROSSING WITH GONDOLA — Venetian-style canal cutting through town with small wooden bridge, half-timbered buildings with shutters along the canal-edge, gondola tied to mooring post, lit windows reflected in water',
      'BLACKSMITH FORGE CORNER — open-front blacksmith workshop with massive stone forge glowing orange, anvil with hammer resting on it, tool-rack with hammers / tongs / horseshoes, wooden support-beams overhead, sparks implied',
      'BLACKSMITH SHOPFRONT — half-timbered blacksmith building with stone-arched forge visible inside glowing red, hanging horseshoe sign, water-trough outside, wagon-wheels stacked, dirt path approaching',
      'TEMPLE STEPS WITH BELL-TOWER — small chapel with stone steps leading up to wooden doors, painted bell-tower with bronze bell visible, stained-glass window above door, lanterns flanking entry, ivy climbing stones',
      'CHAPEL COURTYARD — small stone chapel with bell-tower at one end, courtyard garden with stone benches and flowering shrubs, cobblestone path between, ancient oak tree providing shade, lit lanterns',
      'WINDMILL HILLSIDE TOWN — windmill at the edge of town with four sail-blades catching wind, cottages clustered at the base of the hill, dirt path winding up to the windmill, fields visible beyond',
      'WATER-MILL BY RIVER — wooden water-mill with great paddle-wheel turning in pixel-river, miller cottage attached, sacks of flour stacked outside, dirt path approaching, half-timbered town visible across the bridge',
      'VILLAGE WELL AT CENTER — central stone well with wooden bucket-roof and rope-winch, surrounding cottages with thatched roofs, dirt path radiating outward, vegetable garden visible behind one cottage',
      'CASTLE COURTYARD INNER WARD — castle inner courtyard with stone keep at one side, soldiers barracks across, stone-paved yard with central well, banners hanging, surrounding curtain-walls visible',
      'DWARVEN MOUNTAIN-TOWN GATE — massive stone gate carved into mountain face with rune-stones flanking, cobblestone path approaching, mountain peaks visible above, smoke from underground forges rising from chimneys carved into rock',
    ],
    instructions: `Each entry is ONE specific COZY RPG TOWN LOCALE, 30-55 words. Format: "LOCALE NAME CAPS — specific architecture + functional landmark + inhabited cues + spatial framing". MANDATORY — (a) architectural detail, (b) functional landmark, (c) inhabited cue (light / smoke / signs / laundry / etc.), (d) cobblestone/wooden-boardwalk/dirt path detail. NO NPC description (separate axis). NO biome/weather (separate axis). NO modern setting. NO UI. NO IP refs. NO empty/abandoned. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_cozy_rpg_town_biome: {
    format: 'simple',
    theme: `COZY RPG TOWN BIOME / CHARACTER for the PixelBot cozy-rpg-town path. Each entry describes ONE specific village character — half-timbered European / coastal / mountain / desert oasis / forest village / snowy / canal town / dwarven mountainside / elven treetop / volcanic black-rock / Mediterranean stone-village / Japanese pixel-village / Norse pixel-village / etc. Each entry 25-50 words.

⚠️ THE BAR: every entry produces a render where the town BIOME is instantly recognizable — specific architectural style + climate + surrounding terrain + signature material palette.

⚠️ BIOME VARIETY MANDATE — distribute the 25 entries across:
  • ~3 HALF-TIMBERED EUROPEAN — Stardew/Octopath classic — wood-beam-and-plaster buildings, thatched roofs, cobblestone, cottage-garden flowers
  • ~3 COASTAL / SEASIDE — salt-bleached wooden buildings, fishing boats, gulls implied, weathered shingle, harbor lanterns
  • ~3 MOUNTAIN VILLAGE — stone-and-timber buildings clinging to slope, snow-capped peaks visible, alpine wildflowers, mountain stream
  • ~2 DESERT OASIS — sandstone-and-mud-brick buildings, palm trees, blue tile accents, watering-well at center
  • ~2 FOREST VILLAGE — wooden buildings nestled among ancient trees, moss-covered roofs, fern-lined paths, dappled light
  • ~2 SNOWY VILLAGE — snow-covered roofs, icicles, smoke from chimneys, snow-piles, log-cabin warmth
  • ~2 CANAL TOWN — Venetian-style canals through town, stone bridges, gondolas, lit windows reflected in water
  • ~2 DWARVEN MOUNTAINSIDE — stone-carved buildings into mountain face, glowing forges, rune-stones, mineshafts visible
  • ~2 ELVEN TREETOP / TREEHOUSE — buildings built INTO ancient trees, rope-bridges, leafy canopy, soft magical light
  • ~1 VOLCANIC BLACK-ROCK — obsidian-and-iron buildings, lava-stream nearby, dramatic black-rock landscape
  • ~1 MEDITERRANEAN STONE-VILLAGE — whitewashed stone buildings with terracotta roofs, blue-shuttered windows
  • ~1 JAPANESE PIXEL-VILLAGE — paper-and-wood buildings, cherry-blossom trees, stone lanterns, sliding shoji doors
  • ~1 NORSE PIXEL-VILLAGE — long-houses with curved roofs, dragon-prow carvings, fjord visible, hardy norse vegetation

⚠️ EVERY entry MUST include:
  - SPECIFIC architectural style (half-timbered / stone-and-timber / salt-bleached-wood / etc.)
  - CLIMATE / SEASONAL feel (warm / cool / sea-breeze / dry / damp / snowy)
  - SURROUNDING TERRAIN (rolling hills / mountains / coast / forest / desert / canal-network)
  - SIGNATURE MATERIAL palette (wood-beam-and-plaster / sandstone / obsidian / weathered-shingle)

🚫 STRICT BANS:
  • NO specific town locale details (separate axis)
  • NO NPCs (separate axis)
  • NO modern setting
  • NO UI / IP / sexualized content`,
    touchpoints: [
      'HALF-TIMBERED EUROPEAN VILLAGE — classic Stardew Valley style — wood-beam-and-plaster buildings with thatched roofs, cottage-garden flowers in window-boxes, cobblestone streets, rolling green countryside surrounding the village',
      'BAVARIAN ALPINE TOWN — half-timbered buildings with painted floral murals on plaster, snow-capped Alpine peaks rising in the deep distance, cobblestone village square, smoke from stone chimneys',
      'OCTOPATH HD-2D VILLAGE — Octopath-Traveler-style half-timbered European village with HD-2D depth tilt-shift effect, cobblestone winding streets, warm-glowing windows, cottages with thatched roofs',
      'COASTAL FISHING VILLAGE — salt-bleached wooden buildings with weathered shingles, fishing boats moored at wooden piers, harbor lanterns, gulls implied, ocean horizon visible beyond village, sea-breeze ambient',
      'MEDITERRANEAN COASTAL TOWN — whitewashed stone buildings with terracotta roofs and blue-shuttered windows, narrow cobbled streets descending to azure pixel-water, bougainvillea climbing walls, warm Mediterranean light',
      'NORSE FJORD VILLAGE — long-houses with curved sod roofs and dragon-prow carvings, fjord with cliffs visible, hardy norse pine trees, stone-and-timber construction, cool northern light',
      'MOUNTAIN VILLAGE WITH SNOW-PEAKS — stone-and-timber buildings clinging to alpine slope, snow-capped peaks rising behind, alpine wildflower meadows, mountain stream cutting through, crisp mountain air',
      'TIBETAN MOUNTAIN MONASTERY-VILLAGE — stone-block buildings with prayer-flags strung between, terraced fields cascading down the slope, distant 7000m peaks, monks robes catching breeze',
      'DOLOMITES ALPINE TOWN — wooden chalets with stone foundations clinging to dramatic dolomite-cliff backdrop, alpine wildflowers, mountain stream, crisp morning light',
      'DESERT OASIS VILLAGE — sandstone-and-mud-brick buildings clustered around a central palm-shaded oasis pool, blue-tile-accented doorways, date-palm groves at edges, warm desert light, surrounding sand dunes',
      'SANTORINI WHITE-DESERT — cycladic whitewashed stone buildings with blue domes on a clifftop above pixel-sea, narrow stepped streets, bougainvillea, warm Mediterranean-desert hybrid',
      'FOREST VILLAGE AMONG ANCIENT TREES — wooden buildings nestled among massive ancient trees, moss-covered roofs, fern-lined paths, dappled forest light filtering through canopy, mushroom rings in clearings',
      'ENCHANTED FOREST GLADE-VILLAGE — wood-and-vine-grown buildings tucked into a forest glade, glowing mushroom-lights, fireflies in twilight, ancient oak at center of village square, soft magical ambient',
      'SNOWY MOUNTAIN VILLAGE — log cabins with snow-covered roofs and icicles, smoke curling from stone chimneys, snow-piles along paths, frozen lake visible at edge, warm-window glow contrasting with cold blue snow',
      'WINTER SNOW VILLAGE WITH NORTHERN LIGHTS — log-and-stone buildings under deep-snow cover, faint aurora-borealis in night sky, smoke from chimneys, lanterns illuminating snow-covered paths',
      'VENETIAN CANAL TOWN — Venetian-style stone buildings rising directly from pixel-water canals, small wooden bridges crossing the canals, gondolas moored at every doorway, lit-window reflections in water, ornate balconies',
      'CANAL VILLAGE WITH BRIDGES — small canal town with stone-arched bridges crossing the waterways, half-timbered buildings on stone foundations along canal-edges, gondolas in the water, climbing-roses on walls',
      'DWARVEN MOUNTAIN-FORGE TOWN — stone-carved buildings sunk into mountain face with glowing forges visible in carved windows, massive rune-stones flanking gates, mineshafts cut into the rock-face above, smoke rising from chimneys carved into mountain',
      'DWARVEN UNDERGROUND HALL — vast underground hall of dwarven-carved stone columns with glowing forge-light at the base, terraced platforms descending, rune-carvings everywhere, dwarven banners hanging',
      'ELVEN TREETOP VILLAGE — wooden buildings built INTO the trunks of ancient massive trees, rope-bridges between treetops, leafy canopy with golden afternoon light filtering through, soft magical glowing lanterns',
      'ELVEN GLADE-VILLAGE — graceful curved-architecture buildings with bark-textured walls and leaf-roofs woven among the forest canopy, soft moonlit ambient, rope-bridges, ancient ironwoods supporting buildings',
      'VOLCANIC BLACK-ROCK TOWN — obsidian-and-iron buildings carved from black volcanic rock, lava-stream visible at the edge of town, dramatic ash-grey mountain peaks, glowing volcanic-vents, warm orange lighting',
      'JAPANESE PIXEL-VILLAGE — paper-and-wood buildings with curved tile roofs, cherry-blossom trees in bloom, stone lanterns lining paths, sliding shoji doors, traditional torii gate at edge, gentle pink-and-white palette',
      'KYOTO-STYLE VILLAGE EDGE — traditional Japanese village with wood-frame buildings and tile roofs, narrow cobbled lanes, koi pond at center, bamboo grove visible, cherry-blossom trees',
      'STEPPE NOMAD VILLAGE — yurts arranged in a circle on a vast grass-plain steppe, distant mountains in deep haze, herds of horses, smoke-curl from yurt smoke-holes, low warm light',
    ],
    instructions: `Each entry is ONE specific COZY RPG TOWN BIOME / character, 25-50 words. Format: "BIOME NAME CAPS — architectural style + climate + surrounding terrain + signature material palette". MANDATORY — (a) architectural style, (b) climate feel, (c) surrounding terrain, (d) signature materials. NO town locale details. NO NPCs. NO modern setting. NO UI/IP/sexualized. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_cozy_rpg_town_npc_life: {
    format: 'simple',
    theme: `COZY RPG TOWN NPC + DAILY-LIFE DETAIL for the PixelBot cozy-rpg-town path. Each entry describes ONE specific inhabited-life moment — NPCs going about their day, animals, market activity, daily-life signs. The town reads ALIVE through this detail. Each entry 25-50 words.

⚠️ THE BAR: every entry produces a render with INHABITED LIFE — NPCs in motion, market vendors, children playing, animals, smoke from chimneys, drying laundry, lit windows. The town BREATHES.

⚠️ NPC + LIFE CATEGORIES — distribute the 25 entries across:
  • ~4 MARKET VENDORS / SHOPKEEPERS — pixel-NPC vendor at stall, baker pulling bread from oven, fishmonger sorting catch, herbalist arranging dried herbs
  • ~3 CHILDREN PLAYING — pixel-NPC kids chasing a ball, drawing on cobblestone with chalk, climbing a tree, splashing in fountain
  • ~3 ANIMALS — cat sleeping on barrel, dog napping in shade, chickens pecking, horse tied to post
  • ~3 NPC TRAVELERS / VILLAGERS — pixel-NPC carrying basket of vegetables, woman hanging laundry on line, old man whittling on bench, traveler with pack
  • ~2 BLACKSMITH / CRAFTSMAN AT WORK — smith hammering at anvil, fletcher fletching arrows, weaver at loom, potter at wheel
  • ~2 BAKERS / COOKS — baker pulling bread from oven, cook stirring stew over fire
  • ~2 FOUNTAIN / WELL ACTIVITY — villagers drawing water, kids splashing, dogs lapping
  • ~2 LANTERN-LIGHTERS / STREET-LIFE — lantern-lighter on ladder, street-sweeper, town-crier with bell
  • ~1 MUSICIAN / BARD — bard playing lute in town square, fiddler at tavern door
  • ~1 SIGN-PAINTER / SHOPKEEPER — sign-painter on ladder painting tavern sign, shopkeeper sweeping front step
  • ~1 CARAVAN ARRIVING / MERCHANTS — wagon arriving in town with goods, merchant unloading

⚠️ EVERY entry MUST include:
  - SPECIFIC NPC or animal in motion (NEVER static portraits)
  - SPECIFIC ACTION they are doing (selling / playing / sweeping / hammering / etc.)
  - INHABITED CUE (smoke / laundry / lit windows / goods in stalls / signs)
  - PIXEL-ART style implicit — small chibi-NPCs / 16-bit detailed sprites

🚫 STRICT BANS:
  • NO sexualized / inappropriate NPCs
  • NO weapon-bearing / violence — cozy register only
  • NO modern dress or technology
  • NO closeup portraits — wide-scene NPCs only
  • NO specific IP characters (no Mario / Pokemon / Zelda etc.)
  • NO empty / desolate / single-figure focus
  • NO horror / dark / scary NPCs`,
    touchpoints: [
      'MARKET VENDOR AT STALL — pixel-NPC vendor in colorful clothes calling out wares at a wooden market stall stacked with baskets of fruit, customers browsing implied, awning shading the stall, hanging price-tags',
      'BAKER PULLING BREAD FROM OVEN — pixel-NPC baker with flour-dusted apron pulling fresh loaves from a stone oven with a wooden peel, smoke curling out of the open oven, bread-loaves stacked nearby',
      'FISHMONGER SORTING CATCH — pixel-NPC fishmonger in apron sorting fresh fish on a wooden table at a harbor stall, scales glinting, gulls implied above, baskets of catch stacked, customer approaching',
      'HERBALIST AT SHOPFRONT — pixel-NPC herbalist arranging bundles of dried herbs hanging from awning-poles, mortar-and-pestle on stall surface, customer pointing at jars on the shelf behind',
      'CHILDREN CHASING BALL — three pixel-NPC children chasing a leather ball across cobblestone, laughing-implied through motion, dog running alongside, market vendors smiling, sunlight catching their hair',
      'KIDS DRAWING ON COBBLESTONE — two pixel-NPC children kneeling on cobblestone drawing with chalk, hopscotch grid forming, basket of laundry nearby implying their mother is close, cat watching curiously',
      'CHILD CLIMBING TREE — pixel-NPC child climbing the lower branches of an ancient oak in town square, friend below with arms outstretched ready to catch, fallen leaves scattered, dappled light',
      'CAT SLEEPING ON BARREL — fat tabby cat sprawled asleep on top of a wooden barrel outside a tavern, paw hanging over the edge, sunlight warming its fur, lazy summer atmosphere',
      'DOG NAPPING IN SHADE — large hound asleep in the shade of a market awning, tongue lolling, ears twitching, basket of fresh bread nearby, owner napping on adjacent bench',
      'CHICKENS PECKING IN SQUARE — three brown chickens pecking at scattered grain on cobblestone in market square, motion-blur on their pecking heads, basket of grain nearby, market vendor smiling at them',
      'VILLAGER WITH VEGETABLE BASKET — pixel-NPC villager in linen tunic carrying a wicker basket overflowing with bright vegetables (carrots / cabbages / onions) walking down cobblestone path, returning from market',
      'WOMAN HANGING LAUNDRY — pixel-NPC woman in apron pinning damp laundry to a clothes-line strung between cottages, wooden basket of wet clothes at her feet, fresh-cut wildflowers in window-box nearby',
      'OLD MAN WHITTLING ON BENCH — pixel-NPC elderly villager in patched cloak sitting on a stone bench whittling a wooden carving with a small knife, shavings curling at his feet, pipe in his mouth, dog asleep beside him',
      'BLACKSMITH HAMMERING ANVIL — pixel-NPC blacksmith in leather apron raising hammer above glowing-red metal on the anvil, sparks flying, forge fire blazing behind, apprentice pumping bellows',
      'WEAVER AT LOOM — pixel-NPC weaver seated at a large wooden loom outside her cottage door, shuttle in motion, colorful threads of woven cloth visible, baskets of yarn at her feet',
      'POTTER AT WHEEL — pixel-NPC potter spinning a clay pot on a wooden wheel under an awning, hands shaping the clay, finished pots arranged on shelves behind, kiln smoking in the corner',
      'COOK STIRRING STEW — pixel-NPC cook stirring a large iron cauldron over an open cooking fire outside a tavern, ladle in hand, steam rising, baskets of vegetables ready to add nearby',
      'LANTERN-LIGHTER ON LADDER — pixel-NPC lantern-lighter on a small wooden ladder lighting a hanging street-lantern with a long taper, twilight settling in, other lanterns already glowing nearby',
      'STREET-SWEEPER AT DUSK — pixel-NPC street-sweeper in patched cloak pushing a broom along cobblestone path, dust-cloud rising, town-cat following him, lit windows glowing behind in twilight',
      'TOWN CRIER WITH BELL — pixel-NPC town crier in colorful tunic ringing a bronze hand-bell, villagers turning to listen, paper scroll in his other hand, raised on the town square steps',
      'FOUNTAIN VILLAGERS DRAWING WATER — two pixel-NPC villagers at a stone fountain filling clay water-jugs, basket nearby, children splashing in the basin behind them, sunlight catching the water-drops',
      'BARD PLAYING LUTE — pixel-NPC bard in colorful jerkin sitting on tavern steps playing a wooden lute, foot tapping, small crowd of villagers gathered listening, coins-cap on the cobblestone beside him',
      'SIGN-PAINTER ON LADDER — pixel-NPC sign-painter on a wooden ladder painting a fresh design on a hanging tavern sign, paint-pot and brush in hand, dripped paint on cobblestone below, shopkeeper watching from doorway',
      'CARAVAN ARRIVING WITH GOODS — wooden caravan-wagon drawn by ox arriving in market square with merchant on the bench, baskets and crates piled high, kids running to greet, dog excited, sunlight catching the canvas',
      'BREADBOY MAKING DELIVERY — pixel-NPC delivery-boy in cap carrying a basket of fresh loaves walking briskly down cobblestone, town-cat following hopefully, lit bakery shopfront visible behind him',
    ],
    instructions: `Each entry is ONE specific COZY RPG TOWN NPC + life detail, 25-50 words. Format: "NPC / LIFE NAME CAPS — specific NPC + action they are doing + inhabited cue + pixel-art register". MANDATORY — (a) specific NPC or animal in motion, (b) specific action, (c) inhabited cue, (d) cozy register (NEVER violence/horror/sexual). NO closeup portrait. NO modern setting. NO IP characters. NO empty/desolate. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_cozy_rpg_town_atmospheric_phenomenon: {
    format: 'simple',
    theme: `40%-GATED ATMOSPHERIC MAGIC for the PixelBot cozy-rpg-town path. Each entry describes ONE specific atmospheric detail amplifying the cozy-pixel-RPG-town magic — fireflies / petal-fall / lantern-glow / mist / rain on cobblestone / golden-hour rays / falling snow. Each entry 20-40 words.

⚠️ MANDATORY — every effect AMPLIFIES the cozy town atmosphere. Does NOT compete with the town itself.

🚫 STRICT BANS:
  • NO horror / dark / ominous
  • NO modern / sci-fi / cyberpunk
  • NO UI / dialogue boxes / health bars
  • NO sexualized content
  • NO IP refs

✓ ATMOSPHERIC CATEGORIES:
  A. FIREFLIES — pixel-firefly points of warm light scattered through air
  B. PETAL-FALL — soft cherry-blossom / leaf petals drifting through scene
  C. LANTERN-GLOW — warm lantern-light points scattered, signature cozy detail
  D. MIST / FOG — soft pixel-fog rolling through streets at dawn
  E. RAIN ON COBBLESTONE — wet cobblestone reflecting lights, rain-droplets visible
  F. GOLDEN-HOUR RAYS — pixel god-rays cutting across the scene at sunset
  G. FALLING SNOW — gentle pixel-snowfall drifting through scene
  H. SMOKE-COLUMNS — multiple chimney smoke columns rising from rooftops
  I. AUTUMN LEAVES — orange-and-red leaves drifting on the breeze
  J. STARLIGHT / MOONGLOW — twilight scene with star-points and moonlit ambient`,
    touchpoints: [
      'FIREFLY POINTS IN TWILIGHT — gentle pixel-firefly points of warm-yellow light scattered through the cooling twilight air around the town, soft magical-pixel sparkle',
      'CHERRY-BLOSSOM PETAL-FALL — soft pink cherry-blossom petals drifting horizontally through the town in gentle breeze, scattered across cobblestone and rooftops, magical-cozy spring detail',
      'WARM LANTERN-GLOW SCATTERED — multiple warm-yellow lantern-glow points scattered throughout the town at every shop entrance and street corner, signature cozy-RPG-town twilight detail',
      'DAWN MIST ROLLING THROUGH — soft pixel-fog rolling in low between buildings at dawn, half-obscuring the deep distance, town awakening in atmospheric morning haze',
      'RAIN ON COBBLESTONE REFLECTING — gentle pixel-rain falling on cobblestone with wet reflections of warm-glowing windows on the wet stones, droplet-pixels visible mid-air',
      'GOLDEN-HOUR PIXEL RAYS — pixel god-rays cutting across the scene at sunset, slanting through narrow streets and between buildings, dust-motes catching the light',
      'GENTLE PIXEL-SNOWFALL — soft falling pixel-snowflakes drifting through the town, snow accumulating on rooftops and along the cobblestone edges, warm windows contrasting with the cold blue',
      'CHIMNEY SMOKE COLUMNS — multiple gentle smoke columns rising from chimneys throughout the town, soft warm-grey columns curling against twilight sky, sign of inhabitance',
      'AUTUMN LEAVES DRIFTING — orange-and-red autumn leaves drifting on gentle breeze through the town, scattered across cobblestone, swirling in eddies, autumnal cozy register',
      'STARLIGHT AT TWILIGHT — early-twilight scene with first star-points appearing in pixel-sky above the town, warm windows already glowing, magical transition from day to night',
      'WET COBBLESTONE AFTER RAIN — fresh wet cobblestone after rain reflecting warm window-lights and lanterns, puddles catching scene-color, mild mist drifting',
      'GOLDEN-HOUR HAZE — soft warm-amber pixel-haze enveloping the entire town as the sun sets, the deep-distance buildings fading into the haze, golden cinematic-pixel atmosphere',
      'SCATTERED FIREFLIES + LANTERNS — combined fireflies AND warm lanterns scattered through twilight town, dense magical-cozy ambient, every visible light point a different warm hue',
      'WINTER SNOW + WARM WINDOWS — gentle snow falling with warm-yellow window-glow throughout the town contrasting against the cool blue snow-covered roofs, cozy-winter pixel-magic',
      'MOONGLOW THROUGH CLOUDS — soft moonlit ambient with pixel-moon partially visible through wispy cloud-pixels, blue-cool town silhouette with warm-yellow window-glow contrasting',
      'MORNING-SUNBEAM THROUGH ALLEY — single warm-yellow sunbeam cutting through a narrow alleyway as morning light angles between buildings, dust-motes catching the beam',
      'SOFT-FOCUS PIXEL-BOKEH — softly-blurred pixel-bokeh in the deep distance with the foreground locale sharp, HD-2D-style tilt-shift depth, atmospheric cinematic pixel-art',
      'SAKURA-PETAL-DRIFT — dense cherry-blossom petal-drift filling the entire scene with soft-pink falling petals, scattered across rooftops and cobblestone, magical spring atmosphere',
      'EVENING-SMOKE-AND-LANTERN — warm evening atmosphere with chimney-smoke and lantern-glow combining, twilight-blue sky above contrasting with warm-yellow town below',
      'RAINBOW AFTER RAIN — soft pastel rainbow arcing over the town after rain, wet cobblestone reflecting it, sunlight returning warm and golden through the clearing sky',
      'FIRST FROST MORNING — gentle morning frost dusting rooftops and cobblestone, breath-mist implied on NPCs, low golden morning light catching the crystalline frost detail',
      'TWILIGHT GLOW WITH LIT WINDOWS — every cottage window glowing warm-yellow against the deepening blue twilight sky, the town becoming a constellation of warm lights, very cozy',
      'PIXEL-DAPPLED CANOPY LIGHT — dappled warm light filtering through a leafy canopy at the village edge, sun-spots dancing across cobblestone as leaves shift in breeze',
      'AUTUMN LEAVES SETTLED CARPET — fallen autumn leaves carpeting the cobblestone and rooftops in orange/red/yellow, gentle breeze stirring some into the air, autumnal cozy register',
      'MORNING-MARKET FRESH-LIGHT — fresh morning light flooding into market square with sharp pixel-shadows, vendors setting up stalls, dew on awnings catching sunlight',
    ],
    instructions: `Each entry is ONE specific COZY RPG TOWN atmospheric magic-moment, 20-40 words. Format: "EFFECT NAME CAPS — primary detail + position in scene + cozy register cue". Vary across the 10 categories. NO horror / dark / sci-fi. NO UI / IP. NO sexual content. Cozy atmospheric only. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── pixel-horror path (2026-05-20 axis-system migration) ───
  pixelbot_pixel_horror_gothic_setting: {
    format: 'simple',
    theme: `GOTHIC SETTING for the PixelBot pixel-horror path. Each entry describes ONE specific Castlevania-style gothic-action setting — vampire castle hallway / graveyard at midnight / dragon-cave / cathedral with toppled pews / crypt corridor / demon-realm lava-pit / cursed forest / etc. Each entry 25-50 words.

⚠️ THE BAR: every entry reads as Castlevania / Ghosts n Goblins / Black Tiger / Demon Crest / Rondo of Blood / Bloodstained pixel — classic gothic-fantasy action game level. Stone walls + candelabras + sarcophagi + dragon-skull arches + cursed-rose vines.

⚠️ SETTING CATEGORIES — distribute the 25 entries:
  • ~4 VAMPIRE CASTLE — castle hallway / stained-glass chapel / blood-stained throne / clock-tower
  • ~3 GRAVEYARD / CRYPT — graveyard at midnight / sarcophagus crypt / mausoleum / catacombs
  • ~3 CATHEDRAL / CHAPEL — gothic cathedral / cursed chapel / toppled-pews nave / bell-tower
  • ~3 DRAGON / DEMON CAVE — dragon-cave treasure-room / demon-realm lava-pit / hellish cave
  • ~3 CURSED FOREST — twisted-tree cursed forest / witch hut clearing / haunted-grove
  • ~2 ABANDONED FORTRESS — ruined fortress ramparts / battlement-walk / collapsed tower
  • ~2 SWAMP / BOG — swamp-witch hut / cursed bog / fog-shrouded marsh
  • ~2 UNDEAD ARENA — bone-pile arena / skeleton-king court
  • ~2 DUNGEON / OUBLIETTE — torture-chamber / oubliette / iron-cage
  • ~1 ALCHEMY-LAB — alchemy-lab with hanging organs / spell-circle

⚠️ EVERY entry MUST include:
  - SPECIFIC SETTING TYPE
  - STONE / TILE FLOOR or terrain detail
  - SETTING LANDMARKS (sarcophagi / chandeliers / pillars / etc.)
  - GOTHIC ATMOSPHERIC CUE (cobwebs / dripping wax / iron-chains / etc.)
  - IMPLIED CAMERA (side-view / iso / top-down per setting)

🚫 STRICT BANS:
  • NO modern psychological-horror framing — Castlevania-style ONLY
  • NO enemy / hero description (separate axes)
  • NO IP / UI / sexualized content
  • NO photoreal-horror`,
    touchpoints: [
      'VAMPIRE CASTLE HALLWAY — side-view of a long stone-castle hallway with iron-chandelier flickering overhead, stained-glass windows on the right wall casting prismatic light, blood-red carpet running down the cracked-stone tile floor, gothic-stone pillars',
      'CASTLE STAINED-GLASS CHAPEL — 3/4-iso angled-down on a cathedral chapel with massive stained-glass rose-window at the back, toppled wooden pews, blood-stained altar at the center, dripping candelabras',
      'BLOOD-STAINED THRONE — top-down on a vampire-castle throne-room with red-carpet down the center, twin rows of stone pillars, blood-stained stone throne at the far end, candelabras flickering',
      'CLOCK-TOWER SUMMIT — side-view of a clock-tower summit interior with massive bronze-gears visible behind the wall, broken-stone floor, gothic-arched windows revealing stormy night sky',
      'GRAVEYARD AT MIDNIGHT — side-view of a moonlit graveyard with rows of gravestones receding into parallax depth, dirt-and-cobblestone path foreground, twisted dead-trees, distant cathedral silhouette',
      'SARCOPHAGUS CRYPT — top-down on a stone-crypt floor with sarcophagi lining both walls, cracked-flagstone tile, hanging-cobwebs from the ceiling, single torch flickering on a wall-bracket',
      'MAUSOLEUM INTERIOR — 3/4-iso angled-down on a mausoleum interior with stone-tomb at the center, cracked-stone tile floor, gothic-arched alcoves with smaller tombs, dripping candles',
      'GOTHIC CATHEDRAL NAVE — side-view of a cathedral nave with vaulted gothic-ceiling, broken stained-glass windows, toppled wooden pews scattered, cracked-flagstone tile floor, distant altar visible',
      'CURSED CHAPEL DESECRATED — 3/4-iso on a desecrated chapel with toppled altar, broken pews, blood-spatter across the cracked-stone tile floor, hanging cobwebs, dim candlelight',
      'CATHEDRAL BELL-TOWER — side-view of a bell-tower interior with massive bronze-bell hanging from the rafters, spiral-staircase ascending, gothic-arched windows, weathered stone floor',
      'DRAGON-CAVE TREASURE-ROOM — top-down on a dragon-cave cavern with stone-and-gold-pile floor, treasure-chests scattered, stalactites hanging from above, glowing-runic patterns on the cave walls',
      'DEMON-REALM LAVA-PIT — 3/4-iso angled-down on a demon-realm chamber with magma-cracked stone tile floor, lava-pools at the perimeter, demon-statues lining the walls, fire-red ambient saturating',
      'HELLISH-CAVE INFERNAL — side-view of a hellish-cave interior with magma-stained stone foreground, demon-statues silhouetted in midground, far-backdrop of erupting magma-vents, ember-fall',
      'CURSED FOREST TWISTED-TREES — side-view of a cursed-forest with twisted-dead-trees, dirt foreground path, distant ruined-cottage silhouette in midground, fog drifting, blue-grey palette',
      'WITCH HUT CLEARING — 3/4-iso angled-down on a swamp-witch hut clearing with cauldron at the center bubbling green-magic, hanging cursed-herbs from the eaves, mossy-stone tile patches',
      'HAUNTED-GROVE WITH GHOSTS — top-down on a moonlit haunted-grove with gravestone-and-tree clearing, ghostly-blue mist drifting at floor-level, distant haunted-mansion silhouette',
      'RUINED FORTRESS RAMPARTS — side-view of ruined fortress ramparts at midnight, crumbling stone battlements foreground, distant fortress towers silhouetted, stormy sky with lightning',
      'COLLAPSED TOWER RUIN — 3/4-iso on a collapsed-tower ruin with broken-stone tile floor, fallen-stone-rubble scattered, broken-pillar bases, dim torch-light, gothic atmosphere',
      'SWAMP-WITCH HUT INTERIOR — top-down on a swamp-witch hut interior with wooden floor and hanging cursed-herbs, central cauldron bubbling green-magic, alchemy-shelves with bottles, dim candle-light',
      'CURSED-BOG MARSHLAND — side-view of a cursed-bog with murky-water foreground, twisted dead-tree silhouettes in midground, fog drifting, sickly-green ambient, will-o-wisps drifting in the parallax',
      'BONE-PILE ARENA — top-down on a circular arena with bone-tile floor and stacked-skull walls at the perimeter, hanging chains, dim torch-light catching the bones, ominous atmosphere',
      'SKELETON-KING COURT — 3/4-iso angled-down on a stone court with skeletal-king-throne at the far end, bone-tile floor leading to the throne, columns of stacked skulls, blood-red banners hanging',
      'TORTURE CHAMBER OUBLIETTE — top-down on a stone torture-chamber with iron-rack and chains hanging from walls, blood-stained cracked-stone tile floor, skeletons-in-chains slumped along the walls',
      'IRON-CAGE DUNGEON — side-view of a dungeon-cell-block with iron-barred doors lining both walls, cracked-flagstone tile floor stained, chained-skeletons in the cells, single torch flickering',
      'ALCHEMY-LAB WITH ORGANS — top-down on an alchemy-lab with wooden-shelves of bottles, central operating-table with hanging organs, spell-circle inscribed on the floor, dim candle-light, cursed atmosphere',
    ],
    instructions: `Each entry is ONE specific GOTHIC SETTING, 25-50 words. Format: "SETTING NAME CAPS — specific setting + stone/tile detail + landmarks + gothic atmosphere + implied camera". MANDATORY — (a) setting type, (b) floor detail, (c) landmarks, (d) gothic cue, (e) implied camera. NO modern psychological-horror. NO enemy/hero. NO IP/UI/sexual. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_pixel_horror_classic_enemy: {
    format: 'simple',
    theme: `CLASSIC FANTASY ENEMY for the PixelBot pixel-horror path. Each entry describes ONE specific Castlevania-style fantasy enemy mid-action on the scene — skeleton / vampire / gargoyle / zombie / dragon / lich / werewolf / harpy / ogre / ghost / etc. Each entry 25-50 words.

⚠️ THE BAR: every entry produces a recognizable Castlevania-style enemy sprite mid-action — NOT psychological-horror monsters, NOT modern jump-scares. Classic gothic fantasy creatures.

⚠️ ENEMY CATEGORIES — distribute the 25 entries:
  • ~3 SKELETON-WARRIOR / SKELETON-ARCHER — Castlevania classic skeletons
  • ~3 VAMPIRE — vampire-lord / vampire-bat / lesser-vampire
  • ~3 ZOMBIE — shambling zombie / rising-zombie / decayed-zombie
  • ~2 GHOST / WRAITH — drifting ghost / wraith / banshee
  • ~2 GARGOYLE — gargoyle on parapet / stone-gargoyle awakening
  • ~2 DEMON-IMP / DEMON — demon-imp with pitchfork / lesser-demon
  • ~2 DRAGON / WYVERN — small-medium dragon (sprite-scale) coiled
  • ~2 LICH / NECROMANCER — lich casting / dark-priest
  • ~2 WEREWOLF — werewolf prowling / lycanthrope mid-transformation
  • ~2 HARPY — harpy in flight / banshee-bird
  • ~1 OGRE / TROLL — ogre with club / mountain-troll
  • ~1 MIMIC / CURSED-CHEST — mimic-chest snapping open

⚠️ EVERY entry MUST include:
  - SPECIFIC ENEMY TYPE
  - MID-ACTION POSE
  - SIGNATURE FEATURE (crown / wings / fangs / claws / etc.)
  - ON THE SCENE (in the play-area, not background)

🚫 STRICT BANS:
  • NO gore / explicit violence
  • NO psychological-horror monsters (no flesh-amalgams, no humanoid-distorted, no body-horror)
  • NO sexualized monsters
  • NO IP / specific franchise creatures
  • NO hero description (separate axis)`,
    touchpoints: [
      'SKELETON WARRIOR MID-CHARGE — armored-skeleton warrior with rusty greatsword mid-charge across the play-area, glowing-red eye-sockets, bone-cape draped, mid-stride pose, Castlevania-classic',
      'SKELETON ARCHER MID-DRAW — skeleton-archer mid-bow-draw on the play-area with arrow nocked, bone-spine-and-ribs visible, glowing-red eye-sockets, hooded',
      'RISING SKELETON FROM GRAVE — skeleton mid-emergence from a cracked-grave on the play-area, bone-hands gripping the dirt, skull rising from the earth, dramatic Castlevania moment',
      'VAMPIRE LORD CASTING — vampire-lord with crimson cape mid-cast with one hand raised, fangs bared, glowing-red eyes, hovering slightly above the play-area, dramatic pose',
      'VAMPIRE BAT-SWARM — cloud of pixel-bats swarming across the play-area, mid-flight in tight formation, glowing-red eye-points on each bat, Castlevania-classic enemy',
      'LESSER VAMPIRE LURCH — lesser-vampire mid-lurch across the play-area with claws extended, fangs bared, blood-stained cloak, glowing-red eyes',
      'SHAMBLING ZOMBIE — shambling zombie mid-stride across the play-area with arms outstretched, decayed-skin visible, hollow-eyes, mid-lurch pose, Castlevania-classic',
      'RISING ZOMBIE FROM EARTH — zombie mid-emergence from the dirt of the play-area, half-buried with arms reaching upward, dirt-and-decay falling away, Castlevania classic',
      'ROTTING ZOMBIE MID-ATTACK — rotting zombie mid-lunge with hands outstretched and mouth open in a snarl, decayed-flesh visible, mid-attack on the play-area',
      'DRIFTING GHOST WAILING — translucent ghost drifting through the play-area with mouth open in a wail, ghostly-blue body fading at the edges, glowing-white eye-points',
      'WRAITH MID-SWOOP — translucent wraith mid-swoop across the play-area with claws extended and ghostly-blue trail behind, hooded silhouette',
      'BANSHEE MID-SCREAM — banshee mid-scream with mouth open and arms thrown back, ghostly-green ambient bleeding from her, scream-particles radiating outward',
      'GARGOYLE ON PARAPET — stone-gargoyle perched on a stone parapet mid-rising-from-stone-pose, stone-wings unfurling, mid-awakening, glowing-yellow eyes',
      'STONE-GARGOYLE LEAPING — stone-gargoyle mid-leap from a parapet with wings spread, claws extended, mid-attack pose, gothic-stone wing-detail',
      'DEMON-IMP WITH PITCHFORK — demon-imp on the play-area with pitchfork raised mid-attack, red-skin and small-horns, mid-charge pose, classic Castlevania enemy',
      'LESSER DEMON CHARGING — horned lesser-demon mid-charge across the play-area with claws extended, glowing-red eyes, demonic-mark on chest, bat-wings folded',
      'DRAGON COILED — sprite-scale dragon coiled on the play-area with wings half-spread, mid-roar pose, mouth open with fire-glow forming inside, scales catching torch-light',
      'WYVERN SWOOPING — wyvern (small-sprite-scale) mid-swoop across the play-area with wings spread and tail-coiled, mid-attack pose, scaled-body',
      'LICH CASTING NECRO-SPELL — robed lich with skull-staff held aloft mid-cast, glowing-purple magic-circle on the floor below it, dark-magic-cloud arcing outward, skeletal-arms raised',
      'NECROMANCER SUMMONING — dark-priest necromancer mid-summon-ritual with arms raised, glowing-purple magic-circle on the play-area floor, skeleton emerging from the circle',
      'WEREWOLF PROWLING — werewolf prowling across the play-area on all-fours with fur-bristled, claws gripping the floor, glowing-yellow eyes, mid-stalk pose',
      'LYCANTHROPE MID-TRANSFORMATION — lycanthrope mid-transformation with half-human-half-wolf pose, claws extending, fur growing, dramatic transformation moment',
      'HARPY MID-FLIGHT — harpy mid-flight across the play-area with wings spread and talons extended downward, mid-screech pose, feathered-body',
      'OGRE WITH CLUB — massive ogre on the play-area with iron-spiked club raised mid-attack, tusks bared, leather-and-chain armor, intimidating mid-strike pose',
      'MIMIC-CHEST SNAPPING — mimic-chest on the play-area snapping open with teeth-lined mouth and tongue lashing, treasure spilling from the mouth, claws emerging',
    ],
    instructions: `Each entry is ONE specific CLASSIC FANTASY ENEMY, 25-50 words. Format: "ENEMY NAME + ACTION CAPS — enemy type + mid-action pose + signature feature + on play-area". MANDATORY — (a) enemy type, (b) mid-action pose, (c) signature feature, (d) on the scene. NO gore. NO psychological-horror. NO sexual. NO IP. NO hero description. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_pixel_horror_hero_action: {
    format: 'simple',
    theme: `HERO MONSTER-SLAYER ACTION for the PixelBot pixel-horror path. Each entry describes ONE specific Castlevania-style solo hero pixel-sprite mid-attack on the foreground — armored knight / cloaked vampire-hunter / barbarian / mage / etc. Tiny scale, mid-action. Each entry 25-50 words.

⚠️ THE BAR: every entry produces a solo hero pixel-sprite on the foreground mid-attack — single monster-slayer, NOT a party (Castlevania is genre-correct for solo).

⚠️ HERO ARCHETYPE VARIETY:
  • Armored knight (sword + shield)
  • Cloaked vampire-hunter (whip / stake)
  • Plate-armored barbarian (greatsword / battleaxe)
  • Robed mage with staff (spell-casting)
  • Hooded ranger / crossbow-wielder
  • Holy-paladin (warhammer + shield)
  • Templar (longsword + cross)
  • Witch-hunter (pistol-and-blade)
  • Ninja-monk (twin-daggers / shuriken)

⚠️ MID-ACTION POSES MANDATORY:
  - Sword raised / mid-strike-swing
  - Whip-crack (Castlevania classic)
  - Crossbow / pistol-draw
  - Spell-casting (magic-circle)
  - Mid-jump / leaping attack
  - Wall-jump
  - Shield-block

🚫 STRICT BANS:
  • NO sexualized armor
  • NO gore / dismemberment
  • NO modern weapons (sword / whip / crossbow / pistol-flintlock OK)
  • NO IP characters
  • NO enemy description (separate axis)
  • NO party-multi-hero (solo monster-slayer is genre-correct)`,
    touchpoints: [
      'ARMORED KNIGHT MID-SWORD-SWING — armored knight tiny on the foreground mid-sword-swing with cape flowing behind, shield raised in defense, mid-strike toward the enemy, sparks implied',
      'KNIGHT MID-CHARGE — armored knight tiny on the foreground mid-charge across the stone floor with sword raised, cape flowing, mid-stride pose, dramatic attack moment',
      'KNIGHT SHIELD-BLOCK — armored knight tiny on the foreground with shield raised blocking an enemy attack, sparks of metal-on-bone or metal-on-claw flying, defensive-but-readied pose',
      'VAMPIRE-HUNTER WHIP-CRACK — cloaked vampire-hunter mid-whip-crack with whip arcing through the air toward the enemy, leather-cloak flowing behind, mid-stride pose, Castlevania-classic',
      'VAMPIRE-HUNTER MID-STAKE-STRIKE — cloaked vampire-hunter mid-stake-thrust with wooden-stake held mid-strike, garlic-rope hanging at the belt, holy-light glowing from the cross-pendant',
      'VAMPIRE-HUNTER CROSSBOW — cloaked vampire-hunter mid-crossbow-draw with crossbow-bolt nocked, leather-armor and broad-hat silhouette, aiming at the enemy across the foreground',
      'BARBARIAN GREATSWORD SWING — plate-armored barbarian mid-greatsword-swing in a wide horizontal arc, mid-roar pose, both hands gripping the hilt, fur-cape draped',
      'BARBARIAN MID-LEAP-ATTACK — plate-armored barbarian mid-leap-attack with greatsword raised overhead, mid-air pose, descending toward the enemy',
      'BARBARIAN BATTLEAXE CHARGE — plate-armored barbarian mid-charge with massive battleaxe raised overhead, mid-roar pose, fur-cape flowing',
      'MAGE STAFF-CAST — robed mage tiny on the foreground mid-cast with staff raised, glowing-blue magic-projectile streaking toward the enemy, magic-circle glowing under mage feet',
      'MAGE LIGHTNING-ARC — robed mage on the foreground mid-cast with staff held aloft hurling lightning-arc toward the enemy, electric-magic crackling, mid-cast pose',
      'MAGE PROTECTIVE-BARRIER — robed mage on the foreground casting magic-barrier protecting himself from incoming enemy attack, glowing-magic shield in front, mid-cast',
      'RANGER CROSSBOW-DRAW — hooded ranger tiny on the foreground mid-crossbow-draw with crossbow-bolt nocked, cloaked-silhouette, aimed at the enemy',
      'RANGER MID-ARROW-FLIGHT — hooded ranger on the foreground mid-arrow-shot with arrow streaking through the air toward the enemy, ranger crouched in mid-stride',
      'PALADIN MID-CHARGE — holy-paladin tiny on the foreground mid-charge with warhammer raised, shield in front, golden-armor catching torch-light, holy-light radiating',
      'PALADIN HAMMER-SLAM — holy-paladin on the foreground mid-warhammer-slam down toward the enemy, holy-light glowing from the warhammer head, mid-attack',
      'TEMPLAR LONGSWORD STRIKE — templar mid-longsword-strike with cross-pendant glowing on his chest, mid-attack pose, white-and-gold tunic catching torch-light',
      'TEMPLAR HOLY-CROSS RAISED — templar mid-stride with holy-cross raised aloft repelling undead, holy-light radiating outward from the cross, undead recoiling',
      'WITCH-HUNTER PISTOL-DRAW — witch-hunter mid-pistol-draw with flintlock-pistol mid-raise, blade in the other hand, broad-hat silhouette, mid-stride pose',
      'WITCH-HUNTER PISTOL-FIRE — witch-hunter mid-pistol-fire with flintlock recoiling, smoke-puff erupting, blade ready in the other hand, dramatic action',
      'NINJA-MONK TWIN-DAGGERS — ninja-monk mid-leap with twin-daggers raised mid-attack, mid-air pose, mid-strike toward the enemy, dynamic combat',
      'NINJA SHURIKEN-THROW — ninja mid-shuriken-throw with shuriken streaking through the air toward the enemy, mid-stride defensive pose',
      'KNIGHT WALL-JUMP — armored knight mid-wall-jump pushing off a stone pillar with sword extended mid-air, dynamic vertical action moment',
      'VAMPIRE-HUNTER MID-DODGE-ROLL — cloaked vampire-hunter mid-dodge-roll on the foreground floor, whip extended in one hand, evading an enemy attack',
      'BARBARIAN BATTLE-CRY — plate-armored barbarian mid-battle-cry with greatsword raised mid-attack, mouth open in a war-shout, mid-stride pose, dramatic moment',
    ],
    instructions: `Each entry is ONE specific SOLO HERO action moment, 25-50 words. Format: "HERO + ACTION CAPS — solo hero class + mid-action pose + weapon detail + on foreground". MANDATORY — (a) solo hero class, (b) mid-action pose, (c) weapon detail, (d) on the foreground. NO sexualized. NO gore. NO modern weapons. NO IP. NO enemy description. NO party-multi-hero. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_pixel_horror_gothic_props: {
    format: 'simple',
    theme: `40%-GATED GOTHIC PROPS for the PixelBot pixel-horror path. Each entry describes ONE specific Castlevania-style gothic-flavor atmospheric prop accenting the scene. Each entry 20-40 words.

🚫 STRICT BANS: NO IP / UI / sexualized / explicit gore.

✓ PROP CATEGORIES:
  A. TORCHES / CANDELABRAS — wall-torches / hanging-chandeliers / dripping-candles
  B. STAINED-GLASS / WINDOWS — rose-window / gothic-arch-window / broken-stained-glass
  C. CHAINS / RAILINGS — iron-chains hanging / spiked-railings / portcullis
  D. CURSED PLANTS — cursed-roses / black-thorns / dead-vines
  E. SACRED OBJECTS — crucifixes / holy-runes / blessed-altars
  F. BONE-ELEMENTS — bone-piles / dragon-skull-arches / hanging-bones
  G. PILLARS / ARCHES — cobwebbed pillars / gothic-arches / fallen-columns
  H. WAX / DRIPPING — dripping-wax / molten-wax-pools / candle-stalagmites
  I. BANNERS / TAPESTRIES — torn-banners / blood-tapestries / cursed-flags
  J. ANIMATED PARTICLES — drifting-bats / falling-cobwebs / sparks / lightning-flash`,
    touchpoints: [
      'WALL-TORCHES WITH SPARKS — multiple wall-torches mounted along the stone walls flickering with sparks drifting upward from each, warm-orange glow casting shadows, gothic atmosphere',
      'IRON-CHANDELIER OVERHEAD — massive iron-chandelier hanging from the gothic-vaulted ceiling with dozens of dripping-candles, wax-pooled on the floor below, flickering shadows',
      'CANDELABRA TRIPTYCH — three tall standing iron-candelabras in the scene with dripping wax-pools at their bases, flickering warm-orange light, gothic atmosphere',
      'STAINED-GLASS ROSE-WINDOW — massive stained-glass rose-window in the gothic-cathedral wall casting prismatic blue-red-gold light across the floor, partially-broken with shards',
      'GOTHIC-ARCH WINDOW MOONLIT — narrow gothic-arch window with moonlight streaming through onto the stone floor below, single shaft of cool-blue light cutting through dim torch-warmth',
      'BROKEN STAINED-GLASS SHARDS — broken stained-glass shards scattered on the stone floor below a shattered window, prismatic-color glints catching torch-light',
      'IRON-CHAINS HANGING — iron-chains hanging from the gothic-stone ceiling with manacles at the ends, swaying slightly, ominous gothic atmosphere',
      'SPIKED RAILING WITH HANGED — spiked-iron railing along one side of the play-area with broken-stone edges, suggesting prior occupants, atmospheric',
      'IRON-PORTCULLIS LOWERED — iron-portcullis lowered at the back of the scene blocking a doorway, rusty-iron-bars, dim torch-light visible through the bars',
      'CURSED-ROSE THORN-VINES — black-thorned cursed-rose vines climbing the gothic-stone walls with dripping-blood-petals, dark-magic aura, ominous gothic',
      'DEAD-VINE OVERGROWTH — dead-and-withered vines overgrowing the stone walls and pillars, twisted and gnarled, atmospheric haunted feel',
      'BLACK-THORN OVERGROWN — black-thorn brambles overgrowing the foreground edge of the play-area, twisted-thorns reaching toward the player position',
      'CRUCIFIX ON ALTAR — large stone-crucifix mounted on a desecrated altar in the back of the scene, dim candlelight catching its outline, holy-or-cursed atmosphere',
      'HOLY-RUNES GLOWING — holy-runes carved into the stone walls glowing faintly white-gold, dispelling some of the gothic darkness, sacred-cursed contrast',
      'BLESSED ALTAR DESECRATED — blessed altar at the back of the scene with overturned candles and blood-stained marble, atmospheric tension',
      'BONE-PILE IN CORNER — pile of bones and three skulls stacked in one corner of the scene, evidence of past failures, ominous gothic atmosphere',
      'DRAGON-SKULL ARCH — massive dragon-skull mounted on the back wall as an arched-entrance, ominous gothic-fantasy atmosphere, dim torch-light through the eye-sockets',
      'HANGING-BONES MOBILE — bone-mobile hanging from the gothic-ceiling with rib-bones and small-skulls swaying gently, dim torch-light catching them',
      'COBWEBBED PILLARS — gothic-stone pillars heavily cobwebbed with massive spider-webs spanning between them, dust-motes drifting through the webs',
      'FALLEN STONE COLUMN — toppled-stone column lying horizontally across the foreground, cracked-stone with moss-and-cobweb covering, suggesting age',
      'DRIPPING WAX-STALACTITES — long wax-stalactites dripping from a hanging candle-mass above the scene, wax-puddles on the floor, warm-orange light catching the drips',
      'MOLTEN-WAX POOL — pool of molten-wax on the stone floor below a tall candle, slow-flowing wax with embers floating on the surface',
      'TORN BLOOD-TAPESTRY — torn red-and-gold tapestry hanging from the back wall with blood-stains and ragged edges, dim torch-light catching the fabric-detail',
      'DRIFTING BATS THROUGH AIR — small pixel-bats drifting through the air at multiple parallax depths, dim torch-light catching their silhouettes, atmospheric',
      'LIGHTNING-FLASH FROM ABOVE — sudden lightning-flash illuminating the entire scene through a high window, silhouettes briefly lit dramatic, gothic atmosphere',
    ],
    instructions: `Each entry is ONE specific GOTHIC FLAVOR PROP, 20-40 words. Format: "PROP NAME CAPS — primary prop + position in scene + atmospheric detail". Vary across the 10 categories. NO IP/UI/sexual/gore. Castlevania-style gothic atmosphere only. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── cozy-farming-life-sim path (2026-05-20 axis-system migration) ───
  pixelbot_cozy_farming_farm_locale: {
    format: 'simple',
    theme: `FARM / LIFE-SIM LOCALE for the PixelBot cozy-farming-life-sim path. Each entry describes ONE specific cozy Stardew-Valley / Harvest-Moon / Animal-Crossing / Spiritfarer-style farm or village locale. Each entry 25-50 words.

⚠️ THE BAR: every entry reads as a screenshot from a 16-bit cozy farming life-sim. Tiny farms / cottages / barns / orchards / villages — WARM, INHABITED, SAFE, INVITING. Never industrial / urban / dystopian.

⚠️ LOCALE CATEGORIES — distribute the 25 entries:
  • ~3 CROP-FIELD / GARDEN — neat rows of crops, garden plots, tilled rows
  • ~3 BARN / PASTURE — barn with cows, sheep pasture, horse-stable, goat-pen
  • ~3 HENHOUSE / COOP — chicken-coop, duck-pond, pen with poultry
  • ~3 ORCHARD — apple-orchard, cherry-orchard, peach-grove, walnut-trees
  • ~2 GREENHOUSE — glass greenhouse with sprouts, herb-greenhouse
  • ~2 COTTAGE / PORCH — wooden cottage exterior, porch with rocking chairs, cottage-kitchen
  • ~2 BEACH-SIDE FISH-SHACK — coastal fish-shack, dock with boat, beachfront cottage
  • ~2 VILLAGE-SQUARE — small village square with well, market-square at festival
  • ~2 BAKERY / SHOP — bakery storefront, general-store front, flower-shop
  • ~2 FOREST-EDGE / MEADOW — wildflower meadow, forest-edge with logs, mushroom-circle clearing
  • ~1 WINTER-CABIN — winter cabin exterior, snowy cottage with smoke

⚠️ EVERY entry MUST include:
  - SPECIFIC LOCALE TYPE
  - GROUND / TILE / TERRAIN detail
  - LOCALE LANDMARKS (barn / well / fence / lantern-post / etc.)
  - INHABITED CUE (smoke / chicken / cat / sign / lantern-glow / etc.)
  - IMPLIED CAMERA (3/4-iso / top-down / side-view per setting)

🚫 STRICT BANS:
  • NO industrial / urban / dystopian
  • NO empty / abandoned / ghost-farm
  • NO sci-fi / fantasy / horror
  • NO villager / farmer / animal description (separate axes)
  • NO IP / UI / sexualized content
  • NO modern equipment (no tractors / no electric tools — pastoral only)`,
    touchpoints: [
      'CROP-ROW WITH SCARECROW — 3/4-iso angled-down on a neat-rowed crop-field with green pumpkin-vines and corn-stalks in tilled-dirt rows, wooden scarecrow at the center, wooden picket-fence boundary, lantern-post at the corner',
      'TILLED GARDEN PLOTS — top-down on a tilled garden patch divided into 6-8 plots with sprouting greens in each, wooden plot-edges, watering-can resting at the corner, cobblestone path running between plots',
      'STRAWBERRY PATCH WITH BASKETS — 3/4-iso on a strawberry-patch with red berries dotting the green leaves, woven baskets half-full at the edges, lantern-post nearby, wooden fence behind',
      'BARN WITH RED-SIDING — 3/4-iso angled-down on a classic red-sided wooden barn with white-trim, open double-doors revealing hay-bales inside, cobblestone path leading up, wooden fence around a pasture beside',
      'SHEEP-PASTURE WITH FENCE — 3/4-iso on a green-grass sheep-pasture with white-painted wooden fence boundary, wooden barn-corner visible in the background, distant treeline, cozy pastoral cue',
      'HORSE-STABLE OPEN DOOR — 3/4-iso on a wooden horse-stable with split-door open, hay-pile in the foreground, lantern hanging from the rafter, cobblestone aisle running through',
      'CHICKEN-COOP WITH NESTING-BOXES — 3/4-iso angled-down on a wooden chicken-coop with nesting-boxes along one wall, hay-strewn floor, lantern hanging from the rafter, small ramp leading out',
      'DUCK-POND WITH WILLOW — 3/4-iso on a small duck-pond with willow-tree dipping branches, wooden boardwalk along one edge, lily-pads dotting the surface, cattails at the perimeter',
      'POULTRY-PEN WITH FEED-TROUGH — 3/4-iso on a wooden poultry-pen with wire-mesh fencing, feed-trough at one end, scattered seed on the ground, small wooden shelter at the back',
      'APPLE-ORCHARD ROWS — 3/4-iso angled-down on rows of apple-trees with red fruit clusters, dirt path running between rows, wooden basket of picked apples at the foreground edge, lantern-post at the corner',
      'CHERRY-ORCHARD IN BLOOM — 3/4-iso on a cherry-orchard with pink-blossom-laden trees in neat rows, drifting petals on the dirt path between, wooden bench at the edge, fence at the far side',
      'PEACH-GROVE WITH LADDERS — 3/4-iso on a peach-grove with orange fruit clusters and wooden picking-ladders leaning against several trees, woven baskets at the bases, golden afternoon light',
      'GLASS GREENHOUSE WITH SPROUTS — 3/4-iso angled-down on a wood-and-glass greenhouse with rows of sprouts on wooden tables inside visible through the glass, terracotta-pots stacked outside, watering-can at the door',
      'HERB-GREENHOUSE WITH HANGING-BUNDLES — top-down on a small herb-greenhouse with rows of potted herbs on wooden shelves, hanging-bundles of dried herbs from the rafters, cobblestone floor with a watering-can',
      'WOODEN COTTAGE PORCH — 3/4-iso angled-down on a small wooden cottage with porch and two rocking chairs, lantern hanging beside the door, flower-pots flanking the steps, cobblestone path leading up',
      'COTTAGE-KITCHEN INTERIOR — top-down on a cottage kitchen interior with wooden floor, central wooden table with bread-and-jam, cast-iron stove at one side, herb-bundles hanging from rafters, warm hearth-glow',
      'BEACHSIDE FISH-SHACK — 3/4-iso on a wooden fish-shack with peaked roof at the edge of a beach, sand-and-cobblestone path leading to it, fishing-nets hanging on the side, smoke curling from the chimney',
      'COASTAL DOCK WITH BOAT — 3/4-iso on a wooden coastal dock with a small-fishing-boat tied at the end, lantern at the dock-post, fishing-tackle stacked at the boat-edge, gentle waves below',
      'VILLAGE-SQUARE WITH STONE-WELL — 3/4-iso angled-down on a village-square with central cobblestone well, half-timbered shop-fronts surrounding, cobblestone paths radiating outward, lantern-posts at the corners',
      'FESTIVAL MARKET-SQUARE — 3/4-iso on a village-square at festival with hanging-lanterns strung between shop-fronts, market-stalls with awnings, cobblestone path with flower-petals scattered, generous celebratory mood',
      'BAKERY STOREFRONT — 3/4-iso angled-down on a wooden bakery storefront with painted sign overhead, display-window with breads visible, lantern beside the door, cobblestone path with a wooden bench outside',
      'GENERAL-STORE FRONT — 3/4-iso on a wooden general-store front with painted sign, barrels-and-crates flanking the door, lantern hanging overhead, cobblestone path with wooden bench',
      'WILDFLOWER MEADOW PATH — 3/4-iso on a wildflower-meadow with cobblestone path running through, scattered red-pink-yellow blooms across the grass, wooden bench at the edge, distant treeline backdrop',
      'FOREST-EDGE WITH LOGS — 3/4-iso angled-down on a forest-edge clearing with stacked logs and woodpile against a small wooden shed, axe leaning against the wall, dirt path leading into the trees',
      'WINTER CABIN WITH SMOKE — 3/4-iso on a small wooden winter-cabin exterior with snow on the roof, smoke curling from the stone chimney, lit-window-glow warm-yellow against the snow, wooden fence partially buried',
    ],
    instructions: `Each entry is ONE specific FARM / LIFE-SIM LOCALE, 25-50 words. Format: "LOCALE NAME CAPS — specific locale + ground detail + landmarks + inhabited cue + implied camera". MANDATORY — (a) locale type, (b) ground detail, (c) landmarks, (d) inhabited cue, (e) implied camera. NO industrial / urban / dystopian. NO empty / abandoned. NO sci-fi / fantasy / horror. NO villager / animal description. NO IP/UI/sexual/modern equipment. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_cozy_farming_farm_biome: {
    format: 'simple',
    theme: `FARM BIOME (season + time + atmosphere) for the PixelBot cozy-farming-life-sim path. Each entry describes ONE specific seasonal + time-of-day + atmospheric combination that envelops the farm scene. Each entry 25-50 words.

⚠️ THE BAR: every entry establishes a SEASON + TIME + WEATHER / MOOD that defines the scene's overall feel — spring morning rain / summer noon golden / autumn twilight orange / winter night fireplace / first-frost dawn / festival evening / etc. Cozy life-sim register.

⚠️ BIOME CATEGORIES — distribute the 25 entries across 4 seasons + festival:
  • ~6 SPRING — rainy spring morning, sprout-bright spring noon, gentle spring twilight, cherry-blossom spring, mud-and-puddles spring, mist-and-dew dawn
  • ~6 SUMMER — golden noon, lazy-afternoon haze, glowing sunset, firefly dusk, midsummer-festival evening, lush-green humid
  • ~6 AUTUMN — crisp morning, harvest-orange afternoon, twilight purple, foggy harvest dawn, falling-leaves breeze, harvest-festival sunset
  • ~6 WINTER — snowy dawn, snow-drift afternoon, cozy fireplace-night, first-frost dawn, gentle-flurries dusk, holiday-festival evening
  • ~1 FLEXIBLE festival / sunny-day / etc.

⚠️ EVERY entry MUST include:
  - SEASON
  - TIME OF DAY (dawn / morning / noon / afternoon / twilight / dusk / evening / night)
  - WEATHER / ATMOSPHERIC CUE (rain / sun / fog / snow / haze / clear / etc.)
  - PALETTE CUE (warm-golden / cool-blue / soft-pastel / etc.)

🚫 STRICT BANS:
  • NO catastrophic weather (no hurricanes / blizzards / floods)
  • NO horror / dystopian / dark
  • NO sci-fi / fantasy / supernatural
  • NO locale description (separate axis)
  • NO IP / UI / sexualized`,
    touchpoints: [
      'SPRING-RAIN MORNING — soft spring morning with light drizzle falling, cool-grey-and-green palette, wet cobblestone-and-grass reflective, distant sprouting-greens vibrant under the rain, gentle pastoral mood',
      'SPRING-SPROUT NOON — bright spring noon with golden sun and bright-green sprouting palette, warm sun-glow flooding the scene, dew-still-glistening on leaves, optimistic generative mood',
      'SPRING TWILIGHT GENTLE — gentle spring twilight with soft-purple-and-pink sky, warm-yellow lantern-glow beginning to register, cool-blue ambient settling, peaceful end-of-day register',
      'CHERRY-BLOSSOM SPRING — spring afternoon with cherry-blossoms in peak bloom, drifting pink-petals filling the scene, soft-pastel palette, generous magical-spring register',
      'MUD-AND-PUDDLES SPRING — after-rain spring morning with mud-and-puddles dotting the dirt-paths, soft reflective surfaces, cool-grey-and-green palette, fresh post-rain register',
      'MIST-AND-DEW DAWN — spring dawn with low mist drifting across the fields and dew still on the grass, soft-pastel cool-blue-and-pink sky, gentle peaceful register',
      'GOLDEN SUMMER NOON — bright summer noon with peak golden sun overhead, warm-yellow-and-green palette, sharp pixel-shadows, generous warm-cozy register',
      'LAZY-SUMMER HAZY-AFTERNOON — lazy summer afternoon with soft heat-haze in the distance, warm-yellow palette with hazy soft edges, slow languid pastoral register',
      'GLOWING SUMMER SUNSET — summer evening with sun setting low on the horizon, warm-orange-and-pink palette flooding the scene, long pixel-shadows, gorgeous magical-golden-hour register',
      'FIREFLY-DUSK SUMMER — summer dusk with cool-blue twilight settling and warm-yellow firefly-pixels drifting through the air, magical late-summer register',
      'MIDSUMMER FESTIVAL EVENING — summer festival evening with hanging-lanterns lit warm-yellow, cool-blue twilight sky above, celebratory generous mood, festival-music implied',
      'LUSH-GREEN HUMID — summer afternoon with peak lush-green palette, warm-humid air implied through soft-haze, golden-warm side-light, abundant pastoral register',
      'CRISP AUTUMN MORNING — autumn morning with crisp cool air implied, warm-orange-and-red leaves on trees, soft-yellow sun cutting through, peaceful seasonal register',
      'HARVEST-ORANGE AFTERNOON — autumn afternoon with peak harvest-orange palette across the scene, warm-yellow side-light, sharp pixel-shadows from the lower sun, generous harvest register',
      'AUTUMN TWILIGHT PURPLE — autumn twilight with soft-purple-and-orange sky transitioning, warm-yellow lantern-glow beginning to register, cool-blue shadows, peaceful end-of-day register',
      'FOGGY HARVEST DAWN — autumn dawn with low fog drifting across the harvested fields, soft-orange sun cutting through the fog, cool-blue-and-orange palette, atmospheric harvest register',
      'FALLING-LEAVES BREEZE — autumn afternoon with falling-leaves drifting through the air, warm-orange-and-red palette, gentle breeze implied, generous seasonal register',
      'HARVEST-FESTIVAL SUNSET — autumn harvest-festival sunset with hanging-lanterns and pumpkin-decorations, warm-orange-and-purple sky, celebratory generous mood',
      'SNOWY WINTER DAWN — winter dawn with fresh snow covering everything in soft-white, cool-blue-and-pink sky, soft pastel palette, peaceful magical winter register',
      'SNOW-DRIFT AFTERNOON — winter afternoon with snow-drifts piled against fences and walls, cool-blue palette with warm-yellow window-glow contrasting, gentle generous winter register',
      'COZY FIREPLACE-NIGHT — winter night with snow on the roof and warm-yellow fireplace-glow pouring from windows, cool-blue-and-warm-yellow contrast, deeply cozy register',
      'FIRST-FROST DAWN — early winter dawn with first-frost dusting the grass and crystalline-detail catching low golden morning light, cool-blue-and-warm-yellow palette, magical seasonal register',
      'GENTLE-FLURRIES DUSK — winter dusk with gentle snow-flurries drifting through cool-blue twilight, warm-yellow lantern-glow contrasting, peaceful magical register',
      'HOLIDAY-FESTIVAL EVENING — winter holiday-festival evening with strung-lights warm-yellow and snow on rooftops, cool-blue sky above, celebratory generous winter mood',
      'SUNNY MILD AFTERNOON — undefined-season mild afternoon with bright sun and warm-yellow palette, gentle breeze implied through animated crops, generally cozy register',
    ],
    instructions: `Each entry is ONE specific FARM BIOME (season + time + atmosphere), 25-50 words. Format: "BIOME NAME CAPS — season + time + weather/atmospheric cue + palette cue + mood register". MANDATORY — (a) season, (b) time of day, (c) weather/atmospheric cue, (d) palette cue. NO catastrophic weather. NO horror / dystopian. NO sci-fi / supernatural. NO locale description. NO IP/UI/sexual. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_cozy_farming_farmer_villager_life: {
    format: 'simple',
    theme: `SOLO FARMER + AMBIENT VILLAGER / ANIMAL LIFE for the PixelBot cozy-farming-life-sim path. Each entry describes ONE specific cozy-life-sim moment — solo farmer mid-cozy-task OR ambient villager / animal-life cluster on the scene. Each entry 25-50 words.

⚠️ THE BAR: every entry produces a recognizable Stardew-Valley / Harvest-Moon / Animal-Crossing-style cozy-life-sim moment. Solo farmer-protagonist mid-task AND/OR ambient villager / animal moment populating the scene. NOT party-combat.

⚠️ ACTIVITY CATEGORIES — distribute the 25 entries:
  • ~6 SOLO FARMER MID-TASK — watering crops, harvesting, chopping wood, fishing, milking, feeding chickens, planting
  • ~5 ANIMAL CLUSTER — chickens pecking, sheep grazing, cows munching, cats curled, ducks paddling
  • ~4 VILLAGER NPC AMBIENT — vendor at stall, baker pulling bread, blacksmith hammering, gardener tending, fisherman casting
  • ~3 SOCIAL / FRIEND moment — two friends chatting, child playing, couple sitting on bench
  • ~3 FESTIVAL ACTIVITY — vendor selling at festival, kids playing festival-games, villagers dancing
  • ~2 PET / COMPANION — pet dog/cat with farmer, pet rabbit, pet companion in scene
  • ~2 RESTING / IDLE — farmer sitting on porch, villager napping under tree

⚠️ EVERY entry MUST include:
  - SOLO HERO OR AMBIENT NPC AS FOCUS
  - SPECIFIC COZY-TASK / MOMENT
  - POSITION IN SCENE (foreground / midground / on the locale)
  - VISIBLE PROP / CONTEXT (tool / animal / item / etc.)

🚫 STRICT BANS:
  • NO combat / weapons / aggression — cozy ambient only
  • NO sexualized / inappropriate
  • NO IP characters
  • NO setting description (separate axis)
  • NO party-combat (life-sim ambient, not adventure-party)`,
    touchpoints: [
      'FARMER WATERING CROPS — solo farmer with straw-hat and overalls tiny on the foreground mid-watering a crop-row with watering-can tilted, gentle water-pixels falling, mid-stride pose toward the next row',
      'FARMER HARVESTING PUMPKINS — solo farmer mid-pumpkin-harvest crouched over an orange pumpkin in a crop-row, woven basket beside him with picked pumpkins, mid-task pose',
      'FARMER CHOPPING WOOD — solo farmer with axe raised mid-swing about to split a log on a chopping-block, woodpile stacked beside, mid-action pose, suspenders and rolled-sleeves',
      'FARMER FISHING AT DOCK — solo farmer tiny on a wooden dock mid-fishing with rod cast out over the water, bobber on the surface, fishing-tackle box beside, peaceful pose',
      'FARMER MILKING COW — solo farmer crouched on a stool beside a brown-and-white cow in a barn, milk-pail catching the milk, mid-task pose, cozy domestic register',
      'FARMER FEEDING CHICKENS — solo farmer mid-stride scattering seed-pixels from a sack to a cluster of pecking chickens at her feet, generous cozy register',
      'CHICKENS PECKING IN COOP — a cluster of 5-6 brown-and-white chickens pecking at scattered seed on hay-floor of a chicken-coop, no farmer needed, ambient pastoral life',
      'SHEEP GRAZING IN PASTURE — three-four white sheep grazing across a green pasture with heads lowered, ambient grazing register, peaceful pastoral life',
      'COWS MUNCHING IN BARN — two-three black-and-white cows in a barn munching hay from a feed-trough, heads lowered, ambient pastoral cozy register',
      'CATS CURLED ON PORCH — two pixel-cats curled on the wooden porch of a cottage, one orange-tabby and one calico, peacefully napping, generous cozy register',
      'DUCKS PADDLING ON POND — three-four white-and-brown ducks paddling across a small duck-pond with lily-pads, gentle ripples, peaceful ambient register',
      'VENDOR AT MARKET STALL — villager-vendor in apron standing behind a wooden market-stall with displayed produce (apples-and-bread), mid-customer-greeting pose, hanging-sign overhead',
      'BAKER PULLING BREAD — villager-baker in apron mid-task pulling a loaf from a wood-fired oven with a wooden peel, flour-dusted, warm hearth-glow behind, mid-stride',
      'BLACKSMITH AT FORGE — villager-blacksmith in leather-apron mid-hammer-strike at a glowing-anvil with sparks flying upward, warm forge-glow behind, mid-action',
      'GARDENER TENDING FLOWERS — villager-gardener crouched beside a flower-bed mid-task pruning with hand-shears, basket of cut blooms beside, mid-task pose',
      'FISHERMAN CASTING LINE — villager-fisherman in coat standing at the dock mid-casting a fishing-rod with line arcing through the air, mid-action pose',
      'TWO FRIENDS CHATTING — two villagers seated on a wooden bench mid-chat with smiles on their faces, hands gesturing, cozy social register, peaceful afternoon mood',
      'CHILD PLAYING WITH BALL — pixel-child tiny on the cobblestone mid-play-with-a-ball, mid-stride pose chasing it, generous cozy childhood register',
      'COUPLE SITTING ON BENCH — two villagers seated together on a wooden bench under a tree, peaceful resting register, gentle social moment',
      'VENDOR AT FESTIVAL — villager-vendor at a festival-stall with hanging-bunting and colorful-awning, presenting a fresh-baked-pie to a customer, generous celebratory register',
      'KIDS PLAYING FESTIVAL-GAMES — two-three pixel-kids mid-play at a festival ring-toss or apple-bobbing station, hanging-lanterns and bunting overhead, generous celebratory mood',
      'VILLAGERS DANCING AT FESTIVAL — three-four villagers mid-dance in a circle at a festival, hanging-lanterns and bunting overhead, generous celebratory cozy mood',
      'PET-DOG WITH FARMER — solo farmer mid-stride across the foreground with a pet-dog trotting alongside her, mid-walk pose, generous cozy companion register',
      'PET-RABBIT IN GARDEN — solo farmer crouched beside a pet-rabbit in a flower-garden, gently petting it, mid-action peaceful register',
      'FARMER RESTING ON PORCH — solo farmer seated in a rocking-chair on a cottage porch with a mug-of-tea in hand, peaceful resting register, generous cozy register',
    ],
    instructions: `Each entry is ONE specific COZY LIFE-SIM moment, 25-50 words. Format: "ENTITY + ACTION CAPS — focal entity + mid-task pose + position in scene + visible prop/context". MANDATORY — (a) solo hero or ambient NPC, (b) cozy-task / moment, (c) position in scene, (d) visible prop/context. NO combat / weapons. NO sexualized. NO IP. NO setting description. NO party-combat. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_cozy_farming_cozy_phenomenon: {
    format: 'simple',
    theme: `40%-GATED COZY ATMOSPHERIC PHENOMENON for the PixelBot cozy-farming-life-sim path. Each entry describes ONE specific magical cozy atmospheric moment accenting the scene — petals / fireflies / butterflies / rainbows / drifting smoke / falling leaves / first-snow / hanging-lanterns / etc. Each entry 20-40 words.

🚫 STRICT BANS: NO horror / dark / sci-fi / catastrophic weather / IP / UI / sexualized.

✓ PHENOMENON CATEGORIES:
  A. PETAL-DRIFT — cherry-blossom petals / wildflower petals / dandelion seeds drifting
  B. FIREFLY-SWARM — fireflies drifting at twilight, glowing-pixel-points
  C. BUTTERFLY-CLOUD — butterfly cloud drifting through the scene
  D. RAINBOW-AFTER-RAIN — soft pastel rainbow arcing over the scene
  E. CHIMNEY-SMOKE-CURL — chimney smoke curling and drifting through the air
  F. FALLING-LEAVES — autumn leaves drifting through the air
  G. FIRST-SNOWFALL — gentle first-snowflakes drifting through the air
  H. HANGING-LANTERN-GLOW — strung-lanterns glowing warm-yellow against twilight
  I. DRIFTING-DANDELION-FLUFF — drifting dandelion-seed-pixels
  J. SOFT-DAPPLED-SUNLIGHT — soft dappled sunlight through canopy / through window`,
    touchpoints: [
      'CHERRY-BLOSSOM PETAL-DRIFT — drifting cherry-blossom pink petals filling the air across the scene, gentle breeze implied, generous magical-spring register',
      'WILDFLOWER PETAL-DRIFT — drifting red-and-yellow wildflower petals across the meadow scene, gentle breeze implied, magical pastoral register',
      'DANDELION SEED-DRIFT — drifting dandelion-seed-pixels through the air across the scene, gentle breeze implied, peaceful summer register',
      'FIREFLY-SWARM AT TWILIGHT — cluster of warm-yellow firefly-pixels drifting through cool-blue twilight, magical-late-summer register, peaceful evening mood',
      'FIREFLY-LANTERN PAIR — fireflies drifting through twilight beside lit-lanterns warm-yellow, both glowing-pixel-points combining magically, evening register',
      'BUTTERFLY-CLOUD DRIFTING — cluster of orange-and-yellow butterflies drifting through the scene at multiple parallax depths, magical summer-spring register',
      'PASTEL RAINBOW ARCH — soft pastel rainbow arcing over the scene after rain, wet cobblestone-and-grass reflecting it slightly, warm-sunlight returning, peaceful post-rain register',
      'CHIMNEY-SMOKE-CURL — warm-grey chimney-smoke curling and drifting upward from a cottage / barn chimney, gentle breeze implied, peaceful cozy register',
      'MULTIPLE CHIMNEY-SMOKES — chimney-smoke curling from multiple cottages across the village, all gently drifting, generous cozy inhabited register',
      'AUTUMN LEAVES DRIFTING — orange-red-yellow autumn leaves drifting through the air across the scene, gentle breeze implied, magical seasonal register',
      'SETTLED LEAF-CARPET — settled carpet of fallen autumn leaves covering the cobblestone-and-grass in orange-red-yellow, gentle breeze stirring a few back into the air',
      'FIRST-SNOWFALL DRIFT — gentle first-snowflakes drifting through the air across the scene, fresh dusting on rooftops, magical winter register',
      'GENTLE SNOW-FLURRIES — gentle snow-flurries drifting through cool-blue twilight, warm-yellow lantern-glow contrasting, peaceful magical winter mood',
      'STRUNG-LANTERN GLOW — strung-lanterns glowing warm-yellow against cool-blue twilight sky, generous celebratory cozy register',
      'WINDOW-LANTERN-GLOW SET — every cottage / shop window glowing warm-yellow against deep-blue twilight, the village becoming a constellation of warm lights, deeply cozy register',
      'DAPPLED CANOPY-LIGHT — soft dappled warm-yellow sunlight filtering through a leafy canopy onto the scene below, sun-spots dancing across cobblestone, magical summer register',
      'DAPPLED WINDOW-LIGHT — soft dappled warm-yellow sunlight filtering through a window onto the cottage-interior wooden floor, magical cozy register',
      'MORNING DEW-GLINTS — soft morning dew-glints catching low golden sun across the grass and crops, crystalline magical register',
      'PIXEL-BOKEH SOFT-FOCUS — softly-blurred pixel-bokeh in the deep distance with the foreground locale sharp, HD-2D-style tilt-shift depth, atmospheric cinematic register',
      'WHISPS-OF-MORNING-MIST — soft whisps of morning mist drifting low across the meadow / fields, atmospheric magical morning register',
      'GENTLE-BREEZE WAVING — gentle breeze waving the crops / wildflowers in the scene with subtle motion implied, peaceful pastoral register',
      'GOLDEN-HOUR LIGHT-BEAM — single warm-yellow golden-hour light-beam cutting between trees / buildings onto the scene below, dust-motes catching the beam, magical register',
      'DUST-MOTES IN-LIGHT — dust-motes drifting through a beam of warm-yellow sunlight, atmospheric peaceful register, soft warm cozy mood',
      'STAR-FIELD ABOVE COZY — soft star-field above the cool-blue night sky over the cozy cottage / village, peaceful magical night register',
      'AURORA-PASTEL SUBTLE — soft pastel-aurora drifting across a cool-blue night sky above the snowy farm / cabin, gentle magical winter register',
    ],
    instructions: `Each entry is ONE specific COZY ATMOSPHERIC magic-moment, 20-40 words. Format: "EFFECT NAME CAPS — primary detail + position in scene + cozy register cue". Vary across the 10 categories. NO horror / dark / sci-fi / catastrophic / IP/UI/sexual. Cozy atmospheric only. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── pixel-sci-fi-action path (2026-05-20 axis-system migration) ───
  pixelbot_pixel_sci_fi_action_setting: {
    format: 'simple',
    theme: `SCI-FI SETTING for the PixelBot pixel-sci-fi-action path. Each entry describes ONE specific Contra / Mega Man / Metroid / Gradius / Blaster Master-style sci-fi-action setting — alien jungle / robot factory / space-station corridor / asteroid-field / mech-bay / post-apocalyptic ruins / etc. Each entry 25-50 words.

⚠️ THE BAR: every entry reads as a level from a 16-bit retro sci-fi action game. Saturated retro-arcade sci-fi. NOT cyberpunk-noir. NOT modern indie-illustrated.

⚠️ SETTING CATEGORIES — distribute the 25 entries:
  • ~3 ALIEN JUNGLE PLANET — Contra-style alien jungle platforms with vines and giant alien flora
  • ~3 ROBOT FACTORY / INDUSTRIAL — Mega-Man-style mechanized factory with conveyors and turret racks
  • ~3 SPACE-STATION CORRIDOR — Metroid-style hi-tech corridor with energy doors and shafts
  • ~3 ASTEROID-FIELD / SPACE — Gradius-style asteroid field or nebula seen from spaceship
  • ~2 MECH-BAY / HANGAR — Blaster-Master-style mech-bay with robots in maintenance racks
  • ~2 POST-APOCALYPTIC RUINS — Turrican-style ruined city with rusted-metal and broken consoles
  • ~2 LUNAR / HOSTILE-PLANET SURFACE — Star-Soldier-style barren planet surface with craters
  • ~2 STARFIGHTER DOGFIGHT — Star-Fox-style cockpit view OR side-shooter view of dogfight
  • ~2 ALIEN HIVE / CYBER-FORTRESS — Salamander-style biomechanical interior with pulsing organic-tech
  • ~2 VOLCANIC ALIEN PLANET / ORBITAL RING — Axelay-style volcanic surface or orbital structure
  • ~1 UNDERWATER ALIEN TEMPLE — Cybernator-style submerged alien complex

⚠️ EVERY entry MUST include:
  - SPECIFIC SETTING TYPE
  - FLOOR / TERRAIN / SHIP detail (platform / catwalk / cockpit / asteroid)
  - SCI-FI LANDMARKS (consoles / reactor / cables / energy-shields)
  - SCI-FI ATMOSPHERIC CUE (steam-vents / plasma-haze / sparks / etc.)
  - IMPLIED CAMERA (side-view / horizontal-shooter / top-down / 3/4-iso)

🚫 STRICT BANS:
  • NO cyberpunk-noir / NO modern-illustrated / NO concept-portrait
  • NO IP / UI / sexualized content
  • NO first-person / NO vertical-portrait-vista
  • NO hero / enemy description (separate axes)`,
    touchpoints: [
      'ALIEN JUNGLE PLATFORM — side-view of an alien-jungle platforming level with giant glowing-blue alien-fungi flanking the foreground platform, dense alien-vine canopy in the background parallax, mist drifting between layers, Contra-style level',
      'ALIEN-JUNGLE WATERFALL TIER — side-view of an alien-jungle level with multiple platform-tiers cascading down past a giant alien-waterfall on the right, glowing-pink alien-flora dotting the foreground, mid-level parallax depth',
      'ALIEN-FOREST CANOPY PLATFORMS — side-view of an alien-forest canopy with floating-platforms suspended between giant alien-trees, glowing-green alien-leaves casting prismatic light, dense parallax depth',
      'ROBOT-FACTORY CONVEYOR FLOOR — side-view of a Mega-Man-style robot factory level with conveyor-belts running along the foreground floor, suspended turret-racks on the back wall, industrial steel platforms, fluorescent overhead light',
      'MECHANIZED INDUSTRIAL CORRIDOR — side-view of a mechanized industrial corridor with steel-plate floor, hanging cables and pipe-mazes overhead, sparks falling from broken machinery, retro-arcade industrial register',
      'ROBOT-FACTORY GEARS-ROOM — side-view of a robot-factory gear-room with massive bronze-gear wheels turning in the background parallax, foreground steel-grate floor, hanging chains, classic Mega-Man-style level',
      'SPACE-STATION HI-TECH CORRIDOR — side-view of a Metroid-style hi-tech space-station corridor with metallic-blue walls, glowing-orange energy-door at the far end, hanging cables overhead, steel-plate floor',
      'SPACE-STATION VERTICAL SHAFT — top-down looking down a Metroid-style vertical shaft with steel-grate floor at the bottom, energy-tubes lining the walls, glowing-blue console lights, ladder running up the side',
      'SPACE-STATION CARGO BAY — 3/4-iso angled-down on a space-station cargo bay with stacked crates and floating cargo-cranes overhead, steel-plate floor, fluorescent overhead light, blaster-master interior feel',
      'ASTEROID-FIELD HORIZONTAL — horizontal-shooter view of an asteroid-field with massive rocks scrolling from the right, deep starfield backdrop with distant nebula, plasma-bolt trails crossing the foreground',
      'NEBULA HORIZONTAL-SHOOTER — horizontal-shooter view of a hot-pink nebula backdrop with cosmic-dust drifting, electric-blue plasma-bolts crossing the screen, distant alien-mothership silhouette in deep background',
      'ASTEROID-FIELD VERTICAL — top-down vertical-scroller view of an asteroid-field with massive rocks scrolling from the top, deep-space backdrop, enemy-ship silhouettes incoming, Star-Soldier-style level',
      'MECH-BAY MAINTENANCE-RACKS — 3/4-iso angled-down on a mech-bay with multiple mech-walkers in maintenance-racks lining the side walls, central catwalk floor, overhead fluorescent light, hanging power-cables',
      'MECH-BAY HANGAR-WIDE — 3/4-iso wide-angle on a mech-bay hangar with multiple mech-walker silhouettes in racks against the back wall, catwalk-floor running through the foreground, hanging cables, sparks from welding',
      'POST-APOCALYPTIC RUINED-CITY — side-view of a Turrican-style ruined city level with rusted-steel rubble in the foreground, broken concrete walls, distant collapsed skyscrapers silhouetted, atmospheric haze',
      'POST-APOCALYPTIC SUBWAY-TUNNEL — side-view of a Turrican-style post-apocalyptic subway-tunnel with cracked-concrete floor, broken-train-wreckage in the background, rusted-metal pipes overhead, dim atmosphere',
      'LUNAR SURFACE WITH CRATERS — top-down on a barren lunar surface with multiple craters dotting the dust-gray floor, distant alien-structure silhouette, deep-black starfield above with Earth visible',
      'HOSTILE-PLANET TOXIC-SURFACE — side-view of a hostile-planet surface with bubbling acid-green pools dotting the ash-gray floor, jagged-rock formations in midground, toxic-haze in the air, hostile alien register',
      'STARFIGHTER COCKPIT VIEW — first-person-style starfighter cockpit view (NOT FPS, render the cockpit-frame from outside as a side-shooter would) with hero spaceship banking through asteroid-field, dynamic action',
      'SIDE-SHOOTER DOGFIGHT — horizontal-shooter view of a dogfight with hero spaceship on the left in flight, enemy spaceships incoming from the right, plasma-bolts streaking, deep-space backdrop',
      'ALIEN HIVE BIOMECHANICAL — side-view of an alien-hive biomechanical interior with pulsing organic-tech walls (Salamander-style), hanging fleshy-tubes overhead, foreground tech-flesh platform',
      'CYBER-FORTRESS GUN-BATTERY — side-view of a cyber-fortress level with multiple gun-batteries mounted along the back wall, steel-plate foreground platform, glowing-red targeting-lasers, dim industrial atmosphere',
      'VOLCANIC ALIEN PLANET — side-view of a volcanic alien planet surface with magma-rivers flowing through the foreground, alien-rock pillars in midground, lava-spurts erupting in the parallax background',
      'ORBITAL RING-STATION — 3/4-iso angled-down on an orbital ring-station with curving steel-platform floor, energy-shields lining the perimeter, deep-space starfield visible through the perimeter, Axelay-style level',
      'UNDERWATER ALIEN-TEMPLE — side-view of an underwater alien-temple level with submerged hi-tech walls, glowing-blue alien-runes embedded in the stone, drifting water-particles, foreground temple-floor',
    ],
    instructions: `Each entry is ONE specific SCI-FI SETTING, 25-50 words. Format: "SETTING NAME CAPS — specific setting + floor/terrain + sci-fi landmarks + atmospheric cue + implied camera". MANDATORY — (a) setting type, (b) floor/terrain, (c) sci-fi landmarks, (d) atmospheric cue, (e) implied camera. NO cyberpunk-noir / modern-illustrated. NO IP/UI/sexual. NO hero/enemy. NO first-person / vertical-portrait. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_pixel_sci_fi_action_enemy: {
    format: 'simple',
    theme: `SCI-FI ENEMY for the PixelBot pixel-sci-fi-action path. Each entry describes ONE specific Contra / Mega Man / Metroid / Gradius-style sci-fi enemy mid-action on the scene — alien creature / robot-soldier / mech-walker / drone-swarm / plasma-turret / xenobeast / etc. Each entry 25-50 words.

⚠️ THE BAR: every entry produces a recognizable retro-arcade sci-fi enemy sprite mid-action — Contra alien / Mega Man robot-master / Metroid xenobeast / Gradius enemy-ship. NOT modern-realistic-horror.

⚠️ ENEMY CATEGORIES — distribute the 25 entries:
  • ~3 ALIEN CREATURE — alien with claws / xenomorph-style / alien-queen / alien-warrior
  • ~3 ROBOT-SOLDIER — robot-grunt / sentry-bot / armored-robot / pulse-rifle-trooper
  • ~3 MECH-WALKER — bipedal mech / tripod-mech / spider-mech / battle-mech
  • ~3 ALIEN-DRONE SWARM — drone-cluster / floating-mine / hovering-orb-drone
  • ~2 PLASMA-TURRET — wall-mounted turret / ceiling-turret / rotating cannon
  • ~2 ENEMY-SPACESHIP — enemy fighter / interceptor / bomber (for space-shooter contexts)
  • ~2 BIOMECHANICAL HORROR — fleshy-mech-fusion / organic-cannon / parasite-mech
  • ~2 ALIEN HIVE-QUEEN / BOSS-CREATURE — large alien boss / cybernetic-general
  • ~2 PARASITE / WORM — segmented alien-worm / acid-spitter / parasite-attacker
  • ~2 BATTLE-DRONE / WAR-MACHINE — heavy-walker / battle-tank / siege-mech
  • ~1 ALIEN PLANT-PREDATOR — carnivorous-plant / acid-flower

⚠️ EVERY entry MUST include:
  - SPECIFIC ENEMY TYPE
  - MID-ACTION POSE (firing / charging / lunging / patrolling / striking)
  - SIGNATURE FEATURE (claws / weapons / armor / wings / energy)
  - ON THE SCENE (in the play-area)

🚫 STRICT BANS:
  • NO gore / explicit violence
  • NO realistic-horror / NO modern-distressed
  • NO IP characters (no Xenomorph / no Sigma / no Mother-Brain — only generic)
  • NO hero description (separate axis)
  • NO sexualized monsters`,
    touchpoints: [
      'ALIEN-XENOBEAST LUNGING — alien-xenobeast with claws extended mid-lunge across the play-area, glowing-yellow eye-clusters, segmented-armor body, biomech-feel, mid-attack pose',
      'ALIEN-WARRIOR CHARGING — bipedal alien-warrior with claw-arms charging across the play-area mid-stride, alien-helmet, glowing-blue energy-shield, mid-attack pose',
      'ALIEN-QUEEN REARING — massive alien-queen rearing up on the back of the play-area with multiple arm-claws raised, glowing-purple bio-light from her core, mid-roar pose, dramatic boss-creature',
      'ROBOT-GRUNT FIRING — armored robot-grunt mid-pulse-rifle-fire on the play-area, muzzle-flash erupting from the rifle, optical-eye glowing red, mid-attack pose, retro-arcade enemy',
      'SENTRY-BOT PATROLLING — wheeled sentry-bot mid-patrol across the play-area with rotating-radar-dish on top and pulse-cannon mounted at the front, glowing-red targeting-laser',
      'ARMORED ROBOT-TROOPER CHARGING — armored robot-trooper mid-charge across the play-area with shield in one arm and plasma-blade in the other, mid-stride pose, classic Contra-style enemy',
      'BIPEDAL MECH-WALKER STOMPING — massive bipedal mech-walker mid-stomp across the play-area with arm-cannons mid-fire, mech-pilot silhouette visible in cockpit, dramatic boss-scale enemy',
      'TRIPOD-MECH WALKING — three-legged tripod-mech walking across the play-area with central plasma-cannon mid-rotating, glowing-orange energy-core in the body, mid-attack pose',
      'SPIDER-MECH SKITTERING — eight-legged spider-mech mid-skitter across the play-area with multiple weapon-mounts on the back, glowing-red targeting-eyes, mid-charge pose',
      'ALIEN-DRONE CLUSTER SWARMING — cluster of 5-8 floating alien-drones swarming through the play-area, each with single glowing-eye and small pulse-cannon, mid-attack swarm',
      'FLOATING MINE-DRONES — multiple spherical floating mine-drones positioned across the play-area with blinking-red lights, mid-deployment pose, hovering threat',
      'HOVERING ORB-DRONE — single hovering orb-drone mid-pulse-cannon-fire on the play-area, pulsing-blue energy-shield around it, mid-attack pose, glowing-red optical-eye',
      'WALL-MOUNTED PLASMA-TURRET — wall-mounted plasma-turret rotating with cannon-barrel tracking the hero, glowing-orange energy-core visible, mid-aim pose, classic Contra-style hazard',
      'CEILING-TURRET DESCENDING — ceiling-mounted turret descending from the ceiling on a hydraulic-arm with twin-barrels mid-fire, sparks flying, dramatic mid-deploy moment',
      'ENEMY FIGHTER INCOMING — sleek enemy fighter mid-strafe across the right side of the play-area, plasma-bolt streaks trailing from its wing-cannons, mid-attack run, side-shooter classic',
      'ENEMY BOMBER STRAFING — bulky enemy bomber mid-strafe across the play-area with bomb-bay open and bombs falling, plasma-cannon mid-fire from the nose, mid-attack pose',
      'BIOMECH PARASITE-MECH — biomechanical parasite-mech with fleshy organic-tech body wrapped around a humanoid frame, claws extended mid-attack, glowing-red bio-core, mid-charge pose',
      'ORGANIC-CANNON FLESHY — biomechanical organic-cannon (a wall-mounted fleshy-mech-fusion) mid-pulse-fire, pulsing organic-tech tubes, glowing-yellow energy-core, mid-attack pose',
      'CYBERNETIC GENERAL CHARGING — massive cybernetic general (a half-organic half-mech boss) mid-charge across the play-area with pulse-rifle in one cyber-arm and energy-shield in the other, dramatic boss-creature',
      'ALIEN HIVE-QUEEN BOSS — massive alien hive-queen boss filling the back of the play-area with multiple arm-claws and tail-cannon, glowing-purple bio-core, mid-roar pose, dramatic encounter',
      'SEGMENTED ALIEN-WORM — massive segmented alien-worm coiling across the play-area with multiple-segment body, glowing-red mouth-maw at the head mid-roar, dramatic boss-scale enemy',
      'ACID-SPITTER ALIEN — small acid-spitter alien on the play-area mid-spit with acid-droplets arcing toward the hero, glowing-green acid-sac on its back, mid-attack pose',
      'HEAVY-WALKER BATTLE-MECH — heavy walker battle-mech (treads instead of legs) mid-roll across the play-area with twin-plasma-cannons mid-fire, dramatic boss-scale war-machine',
      'BATTLE-TANK MID-FIRE — sci-fi battle-tank on the play-area mid-fire of its main-gun, muzzle-flash erupting, treads on the floor, mid-attack pose',
      'ALIEN CARNIVOROUS-PLANT — massive alien carnivorous-plant rooted to the play-area floor with vine-tentacles extended mid-attack, glowing-pink flytrap-maw at the head, mid-snap pose',
    ],
    instructions: `Each entry is ONE specific SCI-FI ENEMY, 25-50 words. Format: "ENEMY NAME + ACTION CAPS — enemy type + mid-action pose + signature feature + on play-area". MANDATORY — (a) enemy type, (b) mid-action pose, (c) signature feature, (d) on the scene. NO gore. NO realistic-horror. NO IP characters. NO hero. NO sexualized. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_pixel_sci_fi_action_hero_action: {
    format: 'simple',
    theme: `SOLO HERO RUN-AND-GUN ACTION for the PixelBot pixel-sci-fi-action path. Each entry describes ONE specific Contra / Mega Man / Metroid / Gradius-style solo hero pixel-sprite mid-action on the foreground — armored space-marine / mech-pilot / jetpack-soldier / starfighter-pilot / cybernetic-warrior / etc. Tiny scale, mid-action. Each entry 25-50 words.

⚠️ THE BAR: every entry produces a solo retro-arcade-action hero sprite on the foreground mid-attack — single run-and-gun protagonist (Contra-style). 1 sidekick acceptable but never party.

⚠️ HERO ARCHETYPE VARIETY:
  • Armored space-marine (pulse-rifle / plasma-rifle / energy-shield)
  • Jetpack-soldier (mid-flight / hover-pose)
  • Mech-pilot (mid-cockpit / mid-mech-step)
  • Starfighter-pilot (in cockpit silhouette mid-banking)
  • Cybernetic-warrior (cyber-arms / energy-blade)
  • Lone-wanderer (post-apoc / pulse-rifle / coat)
  • Heavy-trooper (rocket-launcher / heavy-armor)
  • Stealth-operative (cloaked / energy-knife / silenced-rifle)
  • Power-suit explorer (Metroid-style power-suit with arm-cannon)

⚠️ MID-ACTION POSES MANDATORY:
  - Mid-rifle-fire / mid-pulse-shot
  - Mid-jump / leaping-attack
  - Mid-strafe (Contra running while firing sideways)
  - Mid-roll (dodging incoming fire)
  - Mid-mech-step
  - Mid-spaceship-bank
  - Mid-jetpack-hover
  - Mid-grenade-throw

🚫 STRICT BANS:
  • NO modern-realistic / NO concept-art-portrait
  • NO sexualized armor
  • NO gore / dismemberment
  • NO IP characters (no Master Chief / no Samus / no Mega Man)
  • NO enemy description (separate axis)
  • NO party-multi-hero (solo run-and-gun is genre-correct)`,
    touchpoints: [
      'SPACE-MARINE MID-RIFLE-FIRE — armored space-marine tiny on the foreground platform mid-pulse-rifle-fire with muzzle-flash erupting, plasma-bolts streaking toward the enemy, mid-strafe pose, dynamic action',
      'SPACE-MARINE MID-LEAP-FIRE — armored space-marine tiny on the foreground mid-leap-attack with rifle blazing mid-air, plasma-bolts streaking, mid-air pose, dynamic Contra-style action',
      'SPACE-MARINE MID-ROLL-DODGE — armored space-marine tiny on the foreground mid-dodge-roll with rifle in one hand evading incoming enemy fire, plasma-bolts crossing overhead',
      'SPACE-MARINE GRENADE-THROW — armored space-marine tiny on the foreground mid-grenade-throw with grenade arcing through the air toward the enemy, mid-strafe pose, secondary action',
      'JETPACK-SOLDIER HOVERING — jetpack-soldier tiny on the foreground mid-jetpack-hover above the platform with jet-trail blue-flame erupting from the pack, rifle aimed mid-fire',
      'JETPACK-SOLDIER MID-FLIGHT — jetpack-soldier tiny mid-flight across the foreground with jet-trail trailing behind, rifle in one hand mid-fire, dynamic mid-air action',
      'MECH-PILOT MID-COCKPIT — mech-pilot silhouette visible in the cockpit of a mid-sized walker mech on the foreground with pilot mid-stride, mech-arm-cannon mid-fire',
      'MECH-PILOT MID-MECH-STEP — mech-pilot in a walker mech mid-step across the foreground with mech-leg in mid-stride, twin arm-cannons mid-pulse-fire, dramatic mech-pilot action',
      'STARFIGHTER-PILOT MID-BANK — starfighter spaceship mid-bank across the left of the frame with cockpit-silhouette of pilot visible, plasma-cannons mid-fire from wing-tips, side-shooter classic',
      'STARFIGHTER MID-LOOP — starfighter spaceship mid-loop across the frame with engine-trail arcing behind, cockpit-silhouette of pilot visible, plasma-bolts streaking forward, dynamic action',
      'CYBERNETIC-WARRIOR MID-BLADE-STRIKE — cybernetic-warrior tiny on the foreground mid-energy-blade-strike with glowing-cyan energy-blade arcing toward the enemy, mid-attack pose',
      'CYBERNETIC-WARRIOR MID-CHARGE — cybernetic-warrior tiny on the foreground mid-charge across the platform with cyber-arms extended and energy-blade glowing, mid-attack pose',
      'LONE-WANDERER MID-RIFLE-FIRE — lone-wanderer with coat tiny on the foreground mid-pulse-rifle-fire from a kneeling stance, muzzle-flash erupting, hood obscuring the face, mid-shoot pose',
      'LONE-WANDERER MID-DODGE — lone-wanderer with coat tiny on the foreground mid-dodge-roll evading incoming fire, rifle in one hand, mid-action pose, post-apoc register',
      'HEAVY-TROOPER MID-ROCKET-FIRE — heavy-trooper in bulk-armor tiny on the foreground mid-rocket-launcher-fire with rocket arcing toward the enemy with smoke-trail, mid-attack pose',
      'HEAVY-TROOPER MID-CHARGE — heavy-trooper in bulk-armor tiny on the foreground mid-charge with heavy-machine-gun mid-fire, muzzle-flash erupting, ammo-belt swaying, mid-attack pose',
      'STEALTH-OPERATIVE MID-CLOAK-DROP — stealth-operative tiny on the foreground mid-cloak-drop with energy-knife in one hand and silenced-rifle in the other, mid-reveal pose',
      'STEALTH-OPERATIVE MID-KNIFE-STRIKE — stealth-operative tiny on the foreground mid-energy-knife-strike with glowing-blue energy-knife arcing toward the enemy, mid-attack pose',
      'POWER-SUIT EXPLORER MID-CANNON-FIRE — power-suit explorer (Metroid-style with arm-cannon) tiny on the foreground mid-cannon-fire with plasma-bolt streaking toward the enemy, mid-shoot pose',
      'POWER-SUIT EXPLORER MID-MORPH-BALL — power-suit explorer mid-morph-ball-roll across the platform foreground as a small glowing-orb-form, classic Metroid-style mid-action',
      'SPACE-MARINE WITH SIDEKICK — armored space-marine + small floating-companion-drone tiny on the foreground mid-strafe-fire, both mid-action, drone-light glowing, dynamic moment',
      'MECH-PILOT WITH SIDEKICK — mech-pilot in walker mech + small support-drone hovering beside on the foreground both mid-action, mech-arm-cannon mid-fire, drone-light glowing',
      'JETPACK-SOLDIER MID-DOUBLE-JUMP — jetpack-soldier tiny mid-double-jump above the platform foreground with jet-trail behind, rifle mid-fire, dynamic vertical action',
      'STARFIGHTER MID-BARREL-ROLL — starfighter spaceship mid-barrel-roll across the frame with engine-trail spiraling, cockpit-silhouette mid-roll, dynamic Star-Fox-style action',
      'SPACE-MARINE MID-WALL-SLIDE — armored space-marine tiny on the foreground mid-wall-slide down a vertical surface with rifle braced, sparks flying from the wall, dynamic action',
    ],
    instructions: `Each entry is ONE specific SOLO HERO action moment, 25-50 words. Format: "HERO + ACTION CAPS — solo hero class + mid-action pose + weapon detail + on foreground". MANDATORY — (a) solo hero class, (b) mid-action pose, (c) weapon detail, (d) on the foreground. NO modern-realistic / concept-art-portrait. NO sexualized. NO gore. NO IP characters. NO enemy description. NO party-multi-hero. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_pixel_sci_fi_action_props: {
    format: 'simple',
    theme: `40%-GATED SCI-FI FLAVOR PROPS for the PixelBot pixel-sci-fi-action path. Each entry describes ONE specific Contra / Mega Man / Metroid / Gradius-style sci-fi-flavor atmospheric prop accenting the scene. Each entry 20-40 words.

🚫 STRICT BANS: NO IP / UI / sexualized / explicit gore / cyberpunk-noir.

✓ PROP CATEGORIES:
  A. PULSING CONSOLES / MONITORS — hi-tech console panels with glowing screens
  B. REACTOR CORES / ENERGY-PILLARS — glowing reactor cores / plasma-pillars
  C. HANGING CABLES / PIPES — overhead cables / pipe-mazes / coolant-pipes
  D. METALLIC CATWALKS / RAILINGS — steel catwalks / industrial railings
  E. ENERGY-SHIELD WALLS / DOORS — translucent energy-shields / glowing energy-doors
  F. FLICKERING MONITORS / SCREENS — broken-screens / glitching displays
  G. PLASMA-PILLAR WEAPONS / TURRETS-INACTIVE — ambient turrets not mid-fire
  H. NEON ENERGY-ARCS / RIBBON-TUBES — glowing energy-arcs / neon-tubes
  I. SLIDING BLAST-DOORS / AIRLOCKS — sci-fi blast-doors / airlocks
  J. BUBBLING CHEMICAL-TANKS / SPECIMEN-PODS — bubbling tanks / specimen-pods
  K. FLOATING DEBRIS / SHATTERED HULL — drifting debris / hull-plating
  L. GLOWING ALIEN RUNES — alien-runic markings on walls / floor`,
    touchpoints: [
      'PULSING CONSOLE PANELS — multiple pulsing console panels mounted along a back wall with glowing-blue screens displaying scrolling-data, mid-blink LED-indicators, retro hi-tech atmosphere',
      'GLOWING REACTOR-CORE — massive glowing-cyan reactor-core mounted at the center of a back wall with energy-arcs crackling around it, retro-arcade sci-fi power-source register',
      'PLASMA-PILLAR ENERGY — vertical plasma-pillar of glowing-magenta energy in the background mid-scene, pulsing rhythmically, retro arcade sci-fi register',
      'HANGING COOLANT-PIPES — overhead network of coolant-pipes with steam-vents hissing periodically, drips of coolant falling, atmospheric industrial register',
      'HANGING POWER-CABLES — overhead network of hanging power-cables with glowing-blue energy pulsing through them, atmospheric hi-tech register',
      'STEEL-CATWALK CROSSING — steel-catwalk crossing the scene at mid-height with industrial railings, perforated-steel floor visible, atmospheric industrial register',
      'INDUSTRIAL RAILINGS FOREGROUND — industrial railings along the foreground edge of the play-area with bolts visible and steel-plate underneath, retro arcade sci-fi register',
      'ENERGY-SHIELD WALL — translucent glowing-blue energy-shield wall blocking off part of the play-area, electric-arcs crackling along its surface, atmospheric hi-tech',
      'GLOWING ENERGY-DOOR — glowing-orange energy-door at the back of the scene closed and pulsing rhythmically, mounted in metallic steel-frame, atmospheric hi-tech',
      'FLICKERING MONITOR-WALL — wall of flickering monitors at the back of the scene with glitching-displays and broken-screens, occasional sparks erupting, atmospheric',
      'BROKEN HOLOGRAM-PROJECTOR — broken hologram-projector with glitching-blue holographic-imagery flickering above it, sparks erupting periodically, atmospheric',
      'INACTIVE PLASMA-TURRET — inactive plasma-turret mounted on the wall with cannon-barrel idle and glowing-orange energy-core visible, atmospheric threat-detail',
      'NEON ENERGY-ARC LIGHT-FIXTURE — large neon-energy-arc light-fixture mounted on the wall with electric-blue arcs crackling between the contact-points, glowing illumination',
      'RIBBON-TUBE LIGHTING — long neon ribbon-tubes lining the walls of the scene with glowing-cyan light, retro hi-tech atmospheric register',
      'SLIDING BLAST-DOOR — large sliding blast-door at the back of the scene closed and mid-opening with hydraulic-pistons visible, steel-plate door panels',
      'AIRLOCK-CHAMBER FOREGROUND — airlock-chamber in the foreground with two doors visible and pressure-gauges on the wall, atmospheric sci-fi-station detail',
      'BUBBLING CHEMICAL-TANK — large bubbling chemical-tank with glowing-green liquid and pipes connecting to it, atmospheric retro-arcade register',
      'SPECIMEN-POD WITH CREATURE — specimen-pod with glowing-blue liquid and an alien-creature silhouette floating inside, atmospheric retro arcade hi-tech',
      'FLOATING DEBRIS DRIFTING — multiple chunks of floating-debris drifting through the scene at parallax depths, hi-tech wreckage register, atmospheric',
      'SHATTERED HULL-PLATING — shattered hull-plating scattered across the foreground floor with twisted-metal edges, atmospheric post-apoc / disaster register',
      'GLOWING ALIEN-RUNES WALL — glowing-cyan alien-runic markings carved into the back wall pulsing rhythmically, ancient-alien register, atmospheric',
      'GLOWING ALIEN-RUNES FLOOR — glowing-magenta alien-runic markings carved into the foreground floor pulsing rhythmically, ancient-alien register, atmospheric',
      'BIOMECHANICAL VEIN-PIPES — biomechanical vein-pipes pulsing with glowing-red bio-fluid along the walls, organic-tech fusion, atmospheric Salamander-style',
      'SPARKS-AND-EMBERS PARTICLES — sparks and embers drifting through the scene at multiple parallax depths from broken machinery, atmospheric industrial-damage register',
      'STEAM-VENTS HISSING — multiple steam-vents in the foreground/midground hissing white-steam upward periodically, atmospheric industrial register',
    ],
    instructions: `Each entry is ONE specific SCI-FI FLAVOR PROP, 20-40 words. Format: "PROP NAME CAPS — primary prop + position in scene + atmospheric detail". Vary across the 12 categories. NO IP/UI/sexual/gore/cyberpunk-noir. Retro-arcade sci-fi atmosphere only. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── classic-jrpg path (2026-05-20 axis-system migration) ───
  pixelbot_classic_jrpg_locale: {
    format: 'simple',
    theme: `JRPG LOCALE for the PixelBot classic-jrpg path. Each entry describes ONE specific Zelda LttP / FF6 / Chrono Trigger / Secret of Mana-style 3/4 top-down tile-based JRPG locale. Each entry 25-50 words.

⚠️ THE BAR: every entry reads as a level / scene from a 16-bit classic SNES-era top-down JRPG. Tile-grid floor + characteristic biome / setting. Cinematic-pixel-art.

⚠️ LOCALE CATEGORIES — distribute the 25 entries:
  • ~3 OVERWORLD GRASS-PLAIN — open overworld with grass tiles, distant mountains, scattered trees
  • ~3 DENSE FOREST — forest tile-grid with canopy, dirt paths through trees
  • ~2 MOUNTAIN PASS — mountain pass with rocky tiles, cliffs, climbing path
  • ~3 TOWN HUB — village square with cobblestone tiles, shops, fountain
  • ~2 INN / TAVERN INTERIOR — inn-interior wooden floor, tables, fireplace, NPC bartender
  • ~3 CASTLE / THRONE-ROOM — castle interior with stone-tile floor, columns, throne, banners
  • ~3 DUNGEON / CRYPT — dungeon corridor with stone-tile floor, torches, broken pillars
  • ~2 SACRED GROVE / TEMPLE — sacred forest grove or stone-temple with altar and runes
  • ~2 VOLCANIC CAVE — volcanic cave with lava-tile floor, stalactites, glowing-orange
  • ~1 FROZEN TUNDRA — frozen-tile floor, snow-and-ice, igloo, frostbite atmosphere
  • ~1 COASTAL PIER / OCEAN — wooden-pier on the ocean, boats, lighthouse
  • ~1 SKY-TEMPLE / FLOATING ISLAND — sky-temple on floating island, cloud-tiles, columns

⚠️ EVERY entry MUST include:
  - SPECIFIC LOCALE TYPE
  - TILE-GRID FLOOR detail (grass tiles / stone tiles / cobble / wooden / cave-stone / etc.)
  - LOCALE LANDMARKS (trees / columns / throne / altar / fountain / etc.)
  - BIOME ATMOSPHERIC CUE (canopy / torchlight / sun-shafts / etc.)
  - 3/4 TOP-DOWN CAMERA implied

🚫 STRICT BANS:
  • NO modern / contemporary setting
  • NO sci-fi / horror / cozy-farming
  • NO IP / UI / sexualized content
  • NO empty / desolate
  • NO hero / NPC / enemy description (separate axes)
  • NO side-scrolling / first-person / straight-down god's-eye / 3D-iso-grid (3/4 top-down ONLY)`,
    touchpoints: [
      'OVERWORLD GRASS-PLAIN — 3/4 top-down view of an overworld grass-plain with bright-green grass tiles, scattered trees on the edges, distant mountain silhouette in the parallax background, dirt path winding through',
      'OVERWORLD WITH BRIDGE — 3/4 top-down view of an overworld grass-plain with a stone-bridge crossing a river, grass tiles around, distant town silhouette in the parallax background, classic Zelda-LttP register',
      'OVERWORLD AT CROSSROADS — 3/4 top-down view of an overworld grass-plain with crossroads-signpost at the intersection of two dirt-paths, grass tiles around, distant village silhouette',
      'DENSE FOREST WITH CANOPY — 3/4 top-down view of a dense forest with green-canopy filtering sun-shafts, dirt-path through tree-tiles, scattered mushrooms, atmospheric forest register',
      'FOREST CLEARING WITH RUINS — 3/4 top-down view of a forest clearing with ancient stone-ruins half-buried in grass-tiles, vines growing over them, atmospheric mystery register',
      'FOREST PATH WITH WATERFALL — 3/4 top-down view of a forest path leading past a small waterfall and pond, dirt-path tiles, lily-pads on the water, atmospheric peaceful register',
      'MOUNTAIN PASS WITH CLIFF — 3/4 top-down view of a mountain pass with rocky-tile floor, cliff-edge on one side, distant peaks in the parallax background, climbing-rope visible',
      'MOUNTAIN PASS WITH BRIDGE — 3/4 top-down view of a mountain pass with rope-and-plank bridge crossing a chasm, rocky-tile floor, distant peaks, atmospheric peril register',
      'TOWN-SQUARE WITH FOUNTAIN — 3/4 top-down view of a town-square with central stone-fountain on a cobblestone-tile floor, half-timbered shop-fronts surrounding, lantern-posts at the corners',
      'TOWN-SQUARE WITH MARKET — 3/4 top-down view of a town-square with market-stalls along the perimeter, cobblestone-tile floor, awnings overhead, signs above the stalls',
      'COTTAGE-ROW STREET — 3/4 top-down view of a cottage-row street with cobblestone-tile floor running between two rows of half-timbered cottages, lantern-posts and flower-pots',
      'INN-INTERIOR WITH TABLES — 3/4 top-down view of an inn-interior with wooden-tile floor, round-tables with chairs around the room, fireplace at the back wall, hanging signs',
      'TAVERN-INTERIOR WITH BAR — 3/4 top-down view of a tavern-interior with wooden-tile floor, bar counter at the back, barrels stacked beside, hanging-lanterns warm-yellow glow',
      'CASTLE-THRONE ROOM — 3/4 top-down view of a castle throne-room with red-carpet running down the center on stone-tile floor, twin rows of stone columns, throne on a raised dais at the back',
      'CASTLE-COURTYARD — 3/4 top-down view of a castle-courtyard with stone-tile floor, central fountain, castle walls surrounding, banners hanging from the towers, atmospheric royal register',
      'CASTLE-LIBRARY — 3/4 top-down view of a castle library with wooden-tile floor, bookshelves lining the walls, central reading-table with a glowing-magic-book, atmospheric arcane register',
      'DUNGEON-CRYPT CORRIDOR — 3/4 top-down view of a dungeon-crypt corridor with stone-tile floor, broken pillars on either side, hanging torches on the walls, atmospheric perilous register',
      'DUNGEON-CRYPT WITH SARCOPHAGUS — 3/4 top-down view of a dungeon-crypt with stone-tile floor and a central stone-sarcophagus, hanging cobwebs, dim torch-light, atmospheric tomb register',
      'DUNGEON-PRISON CELLS — 3/4 top-down view of a dungeon prison-cellblock with iron-barred doors lining both walls, stone-tile floor, single torch hanging, atmospheric perilous register',
      'SACRED GROVE WITH ALTAR — 3/4 top-down view of a sacred forest-grove with stone-altar at the center, ancient-tree behind, grass-tiles around, sun-shafts filtering through canopy, magical register',
      'STONE-TEMPLE WITH RUNES — 3/4 top-down view of a stone-temple with stone-tile floor inscribed with glowing-cyan runes, columns lining the walls, central altar with offering-bowl, magical atmosphere',
      'VOLCANIC CAVE INTERIOR — 3/4 top-down view of a volcanic cave with lava-pool tiles glowing-orange in some sections, stalactites hanging from above, ash-and-rock floor between lava-pools',
      'VOLCANIC CAVE WITH BRIDGE — 3/4 top-down view of a volcanic cave with stone-bridge crossing a lava-river, glowing-orange ambient, stalactites hanging, atmospheric perilous register',
      'FROZEN TUNDRA WITH IGLOO — 3/4 top-down view of a frozen-tundra with snow-and-ice tiles, scattered igloos, distant snow-mountain silhouette, atmospheric frosty register, breath-mist implied',
      'COASTAL PIER WITH BOATS — 3/4 top-down view of a coastal wooden-pier on the ocean with two small fishing-boats tied up, wooden-plank tile floor, distant lighthouse, atmospheric coastal register',
    ],
    instructions: `Each entry is ONE specific JRPG LOCALE, 25-50 words. Format: "LOCALE NAME CAPS — 3/4 top-down view + specific locale + tile-grid floor + landmarks + atmospheric cue". MANDATORY — (a) 3/4 top-down camera, (b) locale type, (c) tile-grid floor, (d) landmarks, (e) atmospheric cue. NO modern. NO sci-fi/horror/cozy-farming. NO IP/UI/sexual. NO empty/desolate. NO hero/NPC/enemy. NO side-scrolling/first-person/god's-eye/3D-iso-grid. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_classic_jrpg_party_action: {
    format: 'simple',
    theme: `HERO PARTY MID-MOMENT for the PixelBot classic-jrpg path. Each entry describes ONE specific Zelda LttP / FF6 / Chrono Trigger-style hero party-sprite mid-action on the tile-grid — single hero or 2-4 party members walking / examining / mid-cutscene / mid-action. Each entry 25-50 words.

⚠️ THE BAR: every entry produces tiny SNES-JRPG hero-sprite(s) mid-stride / mid-action on the tile-grid. Solo or party. Genre signatures: kid in green tunic with sword, mage in robe with staff, warrior in armor with shield, princess in gown, ninja in dark garb.

⚠️ PARTY-COMPOSITION VARIETY:
  • ~10 SOLO HERO — single hero mid-action
  • ~10 PARTY OF 2-3 — 2-3 party members walking together
  • ~5 PARTY OF 4 — full party of 4 in formation

⚠️ ACTION VARIETY:
  • Walking the tile-grid mid-stride
  • Examining a signpost / chest / altar
  • Mid-cutscene gesturing / talking
  • Mid-magic-spell cast
  • Mid-sword-swing (if combat-flavored)
  • Standing at the edge of a vista
  • Climbing a staircase
  • Crossing a bridge
  • Approaching an NPC
  • Discovering a treasure-chest

⚠️ EVERY entry MUST include:
  - PARTY SIZE (solo / 2 / 3 / 4)
  - HERO ARCHETYPES (specific SNES-era forms — green-tunic kid / robed mage / armored warrior / etc.)
  - MID-ACTION POSE (walking / examining / casting / etc.)
  - POSITION ON TILE-GRID
  - SMALL SCALE (tiny sprite, ~1/15 of frame)

🚫 STRICT BANS:
  • NO sexualized armor / character design
  • NO modern attire
  • NO IP characters (no Link / no Crono / no Cloud — generic SNES-era forms only)
  • NO setting description (separate axis)`,
    touchpoints: [
      'SOLO GREEN-TUNIC KID WALKING — solo kid in green-tunic with sword sheathed mid-stride across the tile-grid foreground, classic Zelda-LttP-style sprite, mid-walk pose',
      'SOLO ARMORED WARRIOR APPROACHING — solo armored warrior with shield mid-stride across the tile-grid approaching the back of the scene, classic SNES-JRPG-style sprite',
      'SOLO ROBED MAGE CASTING — solo robed mage with staff held aloft mid-magic-cast on the tile-grid, glowing-blue magic-circle below the mage feet, mid-cast pose',
      'SOLO PRINCESS RUNNING — solo princess in gown mid-stride across the tile-grid, hair flowing behind, mid-run pose, classic SNES-JRPG-style sprite',
      'SOLO NINJA MID-LEAP — solo ninja in dark garb mid-leap across the tile-grid foreground, twin-daggers in hand, dynamic mid-air pose, classic SNES-style sprite',
      'SOLO MONK MID-PUNCH — solo monk in saffron robe mid-punch-strike on the tile-grid, energy-fist mid-action, classic SNES-JRPG sprite',
      'SOLO HERO EXAMINING SIGNPOST — solo kid in green-tunic standing beside a wooden-signpost mid-examine pose on the tile-grid, classic moment of player exploration',
      'SOLO HERO AT TREASURE-CHEST — solo armored warrior crouched beside a wooden-treasure-chest mid-opening, glowing-yellow light spilling from the lid, classic loot-discovery moment',
      'SOLO HERO AT VISTA-EDGE — solo kid in green-tunic standing at the edge of a vista on the tile-grid, looking out toward distant mountains, contemplative mid-pose',
      'SOLO HERO CLIMBING STAIRS — solo warrior mid-stride climbing a wide-set of stone-stairs at the back of the scene, mid-step pose, classic exploration moment',
      'PARTY OF 2 WALKING TOGETHER — party of 2 (green-tunic kid + robed mage) mid-stride together across the tile-grid, side-by-side, mid-walk pose, classic JRPG party-mode',
      'PARTY OF 2 EXAMINING CHEST — party of 2 (armored warrior + princess) crouched together beside a wooden-treasure-chest, both mid-examine pose, atmospheric discovery moment',
      'PARTY OF 2 AT NPC — party of 2 (kid + mage) standing in front of a NPC-villager mid-dialogue-pose, both mid-conversation gesture, classic moment',
      'PARTY OF 2 MID-MAGIC — party of 2 (mage + warrior) on the tile-grid with mage mid-magic-cast, warrior mid-shield-raise defensively, classic combat-prep moment',
      'PARTY OF 2 CROSSING BRIDGE — party of 2 (warrior + ninja) mid-stride crossing a stone-bridge on the tile-grid, atmospheric exploration moment, parallel walking',
      'PARTY OF 3 WALKING IN FORMATION — party of 3 (warrior + mage + princess) walking together in formation across the tile-grid, mid-walk pose, classic JRPG party-mode',
      'PARTY OF 3 AROUND ALTAR — party of 3 (kid + mage + warrior) gathered around a stone-altar at the back of the scene, all mid-examine pose, atmospheric magical moment',
      'PARTY OF 3 ENTERING CASTLE — party of 3 (warrior + mage + ninja) mid-stride entering a castle through the gate, mid-walk pose, atmospheric exploration moment',
      'PARTY OF 3 MID-CUTSCENE — party of 3 (warrior + princess + mage) gathered together mid-cutscene gesturing toward each other, atmospheric story moment',
      'PARTY OF 3 AT INN-BAR — party of 3 (warrior + ninja + monk) standing at an inn-bar with mugs raised, mid-toast pose, atmospheric rest-and-recover moment',
      'PARTY OF 4 WALKING IN FORMATION — party of 4 (kid + mage + warrior + princess) walking together in formation across the tile-grid, classic complete-party arrangement',
      'PARTY OF 4 AT BOSS-DOOR — party of 4 (warrior + mage + ninja + monk) standing in formation in front of a massive boss-door at the back of the scene, atmospheric pre-battle moment',
      'PARTY OF 4 IN THRONE-ROOM — party of 4 standing in formation in front of a throne at the back of the scene, mid-respectful-bow pose, atmospheric royal-audience moment',
      'PARTY OF 4 ESCAPING DUNGEON — party of 4 (kid + warrior + mage + princess) mid-stride running across the tile-grid escaping a dungeon, all mid-run pose, dynamic moment',
      'PARTY OF 4 EXAMINING MAP — party of 4 gathered around a glowing-magic-map on a tile-grid floor, all mid-examine pose, atmospheric quest-planning moment',
    ],
    instructions: `Each entry is ONE specific PARTY MOMENT, 25-50 words. Format: "PARTY-SIZE + ACTION CAPS — party-size + hero-archetypes + mid-action pose + on tile-grid". MANDATORY — (a) party size, (b) hero archetypes, (c) mid-action pose, (d) on tile-grid, (e) small scale. NO sexualized. NO modern. NO IP. NO setting description. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_classic_jrpg_npc_or_enemy_life: {
    format: 'simple',
    theme: `NPC LIFE OR ENEMY CREATURE for the PixelBot classic-jrpg path. Each entry describes ONE specific Zelda LttP / FF6 / Chrono Trigger-style NPC villager mid-routine OR enemy creature patrolling the tile-grid. Each entry 25-50 words.

⚠️ THE BAR: every entry produces tiny SNES-era NPC-or-enemy sprites populating the world. NPCs going about routines OR enemy creatures patrolling. Classic genre-signatures.

⚠️ NPC / ENEMY CATEGORIES — distribute the 25 entries:
  • ~3 VENDOR / SHOPKEEPER — vendor at market-stall, weapon-merchant, potion-shop owner
  • ~3 VILLAGER ROUTINE — villager doing daily routine (sweeping, fishing, gardening)
  • ~2 PRIEST / RELIGIOUS NPC — priest at altar, monk meditating
  • ~2 SOLDIER / GUARD — soldier on patrol, castle-guard at post
  • ~2 ENTERTAINER / DANCER — dancer in inn, bard with lute, jester
  • ~3 ENEMY-SLIME — single or cluster of green-slime creatures patrolling
  • ~3 ENEMY-BAT / FLYING — bats / harpies in mid-flight across the scene
  • ~2 ENEMY-SKELETON — skeleton-warriors patrolling
  • ~2 ENEMY-ORC / GOBLIN — orc-warrior or goblin-scout patrolling
  • ~2 ENEMY-WOLF / BEAST — wolf-pack patrolling forest, bear / panther
  • ~1 BOSS-CREATURE — single mid-sized boss-creature (dragon / hydra / chimera) on the scene

⚠️ EVERY entry MUST include:
  - SPECIFIC NPC OR ENEMY TYPE
  - MID-ROUTINE / MID-PATROL POSE
  - SIGNATURE FEATURE (apron / weapons / armor / claws / etc.)
  - POSITION ON TILE-GRID
  - SMALL SCALE (tiny sprite)

🚫 STRICT BANS:
  • NO gore / explicit violence
  • NO sexualized NPCs / enemies
  • NO IP characters
  • NO hero description (separate axis)
  • NO modern setting`,
    touchpoints: [
      'VENDOR AT MARKET-STALL — NPC-vendor in apron standing behind a wooden market-stall with displayed produce, mid-customer-greeting gesture, on the tile-grid, classic JRPG-town NPC',
      'WEAPON-MERCHANT AT SHOP — NPC-weapon-merchant in leather-apron standing behind a counter with swords-and-shields on display, mid-greeting pose, on the tile-grid',
      'POTION-SHOP OWNER — NPC-alchemist in robe standing behind a counter with potion-bottles on shelves behind, mid-stir pose with cauldron beside, on the tile-grid',
      'VILLAGER SWEEPING PORCH — NPC-villager mid-stride sweeping a wooden-porch with broom, classic daily-life moment, on the tile-grid',
      'VILLAGER FISHING AT POND — NPC-villager seated at the edge of a pond with fishing-rod mid-cast, on the tile-grid, peaceful daily-life moment',
      'VILLAGER GARDENING — NPC-villager crouched in a garden-bed mid-pruning with shears, basket of cut blooms beside, on the tile-grid, classic daily-life',
      'PRIEST AT ALTAR — NPC-priest in robe standing at a stone-altar with hands raised mid-prayer-gesture, candles flickering, on the tile-grid',
      'MONK MEDITATING — NPC-monk in saffron-robe seated cross-legged in meditation on the tile-grid, eyes closed, atmospheric peaceful moment',
      'SOLDIER ON PATROL — NPC-soldier in armor mid-stride patrolling across the tile-grid with spear-and-shield, classic guard-routine pose',
      'CASTLE-GUARD AT POST — NPC-castle-guard in heavy-armor standing at-attention with halberd at a doorway, on the tile-grid, classic guard-post pose',
      'DANCER IN INN — NPC-dancer in colorful-garb mid-twirl on the wooden-floor of an inn, atmospheric entertainment moment, classic SNES-JRPG NPC',
      'BARD WITH LUTE — NPC-bard with lute mid-strum standing on an inn-floor, atmospheric music-moment, classic SNES-JRPG NPC',
      'GREEN-SLIME PATROLLING — single green-slime creature mid-bounce across the tile-grid, classic SNES-JRPG-style enemy sprite, mid-patrol pose',
      'CLUSTER OF SLIMES — cluster of 3-4 green-slime creatures patrolling the tile-grid together, all mid-bounce, classic JRPG mob encounter',
      'RED-SLIME ENCOUNTER — single red-slime creature mid-pulse on the tile-grid, slightly larger than green-slime, atmospheric mid-tier enemy register',
      'BATS IN MID-FLIGHT — cluster of 3-4 bats mid-flight across the scene at parallax depths, classic SNES-JRPG flying-enemy sprite, mid-attack swoop',
      'HARPY MID-FLIGHT — single harpy mid-flight across the scene with wings spread and talons extended, classic JRPG-style winged-enemy sprite',
      'BANSHEE-GHOST DRIFTING — single banshee-ghost drifting across the tile-grid mid-wail pose, translucent-blue body fading at edges, atmospheric undead enemy',
      'SKELETON-WARRIOR PATROLLING — single skeleton-warrior with rusty sword mid-stride patrolling the tile-grid, classic SNES-JRPG-style undead sprite',
      'CLUSTER OF SKELETONS — cluster of 2-3 skeleton-warriors patrolling the tile-grid together with rusty weapons, atmospheric dungeon-mob encounter',
      'ORC-WARRIOR PATROLLING — single orc-warrior with club mid-stride patrolling the tile-grid, green-skin and tusks, classic SNES-JRPG-style enemy sprite',
      'GOBLIN-SCOUT MID-CROUCH — single goblin-scout mid-crouch on the tile-grid with dagger drawn, atmospheric small-enemy register, classic JRPG sprite',
      'WOLF-PACK PATROLLING — pack of 2-3 wolves patrolling the tile-grid together with heads lowered, atmospheric forest-enemy register, classic JRPG-style beast-sprite',
      'BEAR MID-ROAR — single bear mid-roar on the tile-grid with claws extended, atmospheric large-beast-enemy register, classic JRPG-style sprite',
      'DRAGON BOSS-CREATURE — single mid-sized dragon coiled on the tile-grid with wings half-spread, mid-roar pose, glowing-red eyes, atmospheric mid-tier-boss moment',
    ],
    instructions: `Each entry is ONE specific NPC OR ENEMY moment, 25-50 words. Format: "ENTITY + ACTION CAPS — entity type + mid-routine/mid-patrol pose + signature feature + on tile-grid". MANDATORY — (a) entity type, (b) mid-routine/mid-patrol pose, (c) signature feature, (d) on tile-grid, (e) small scale. NO gore. NO sexualized. NO IP. NO hero. NO modern. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_classic_jrpg_props: {
    format: 'simple',
    theme: `40%-GATED CLASSIC JRPG PROPS for the PixelBot classic-jrpg path. Each entry describes ONE specific Zelda LttP / FF6 / Chrono Trigger-style classic-JRPG flavor prop accenting the scene. Each entry 20-40 words.

🚫 STRICT BANS: NO IP / UI / sexualized / explicit gore / modern.

✓ PROP CATEGORIES:
  A. TREASURE CHESTS — wooden / iron / silver / gold chest, open or closed
  B. SIGNPOSTS — wooden signpost with arrows, crossroads marker
  C. POTS / BARRELS / CRATES — clay-pots, wooden barrels, crates
  D. STATUES — stone statue (hero / monster / animal)
  E. FOUNTAINS — stone fountain with water
  F. TAVERN / SHOP SIGNS — hanging painted sign
  G. WEAPON-RACKS / ARMOR-STANDS — weapon-rack with swords
  H. BOOKSHELVES / SCROLLS — bookshelf or scroll-collection
  I. ALTARS WITH CANDLES — stone altar with candles / offerings
  J. MOSSY-RUNE-STONES — ancient stone with glowing runes
  K. BRIDGES — stone or wooden bridge
  L. WATERFALLS / PONDS — small waterfall or reflective pond
  M. CASTLE-BANNERS / TAPESTRIES — hanging banner / tapestry
  N. SCATTERED-WEAPONS / BATTLE-DEBRIS — scattered swords on the ground
  O. GLOWING-RUNE-FLOOR — magical glowing-rune carved into the floor`,
    touchpoints: [
      'WOODEN TREASURE-CHEST CLOSED — wooden treasure-chest closed on the tile-grid, iron-banded, atmospheric loot-discovery prop',
      'IRON TREASURE-CHEST OPEN — iron treasure-chest open on the tile-grid with glowing-yellow light spilling from the lid, gold-coins visible inside, atmospheric reward moment',
      'GOLD TREASURE-CHEST WITH GEMS — gold treasure-chest open on the tile-grid with gems spilling from the lid, atmospheric high-tier reward register',
      'WOODEN SIGNPOST WITH ARROWS — wooden signpost mounted on a stake with arrow-shaped signs pointing in two directions, classic JRPG-overworld marker',
      'CROSSROADS SIGNPOST — wooden crossroads signpost at the intersection of two dirt-paths with multiple-direction arrows, classic exploration marker',
      'CLAY-POTS CLUSTERED — cluster of 3-4 clay-pots clustered against a back wall, classic JRPG breakable-loot prop register',
      'WOODEN BARRELS STACKED — stack of wooden-barrels in a corner of the scene with iron-bands, classic JRPG breakable-loot register',
      'CRATES SCATTERED — scattered wooden-crates across the foreground floor with stamped markings, classic JRPG inventory-storage register',
      'STONE-HERO-STATUE — stone-statue of a hero with sword raised mounted on a pedestal in the scene, classic JRPG monument register',
      'STONE-MONSTER-STATUE — stone-statue of a dragon or chimera mounted on a pedestal in the scene, atmospheric mysterious-monument register',
      'STONE-ANIMAL-STATUE — stone-statue of an animal (wolf / lion / griffin) mounted on a pedestal in the scene, classic guardian-statue register',
      'CENTRAL STONE-FOUNTAIN — central stone-fountain with water spilling from the basin into the lower pool, classic town-square focal-point',
      'WALL-FOUNTAIN BASIN — small wall-fountain with water spilling from a lion-head spout into a basin, classic JRPG town-detail',
      'HANGING TAVERN-SIGN — hanging painted tavern-sign over a doorway with mug-and-foam illustration, classic JRPG town-detail',
      'HANGING SHOP-SIGN — hanging painted shop-sign over a doorway with sword-or-potion illustration, classic JRPG town-detail',
      'WEAPON-RACK WITH SWORDS — wooden weapon-rack with multiple swords mounted along it against a back wall, classic JRPG armory register',
      'ARMOR-STAND WITH ARMOR — wooden armor-stand displaying a full suit of armor against a back wall, classic JRPG armory register',
      'BOOKSHELF WITH BOOKS — wooden bookshelf filled with books mounted against a back wall, classic JRPG-library register',
      'SCROLL-COLLECTION ON TABLE — collection of scrolls spread on a wooden-table with one open mid-read, atmospheric JRPG-library register',
      'STONE-ALTAR WITH CANDLES — stone-altar at the back of the scene with multiple candles flickering, offering-bowl at the center, classic JRPG-temple register',
      'BLESSED-ALTAR WITH GLOW — stone-altar at the back of the scene with golden-glow halo above it, atmospheric blessed-place register',
      'MOSSY RUNE-STONE — mossy-stone with glowing-cyan runes carved into it standing in the scene, atmospheric ancient-magic register',
      'GLOWING RUNE-PILLAR — tall stone-pillar with glowing-magenta runes carved spiraling up it, atmospheric ancient-magic register',
      'STONE-BRIDGE WITH RAILINGS — stone-bridge crossing a river with stone-railings on both sides, classic JRPG-exploration detail',
      'WOODEN ROPE-BRIDGE — wooden rope-bridge crossing a chasm with rope-handrails on both sides, classic JRPG-exploration atmospheric detail',
    ],
    instructions: `Each entry is ONE specific CLASSIC JRPG flavor prop, 20-40 words. Format: "PROP NAME CAPS — primary prop + position in scene + atmospheric detail". Vary across the 15 categories. NO IP/UI/sexual/gore/modern. Classic SNES-JRPG atmospheric prop only. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── epic-vista path (2026-05-20 axis-system migration) ───
  pixelbot_epic_vista_subject: {
    format: 'simple',
    theme: `VISTA SUBJECT (focal landform) for the PixelBot epic-vista path. Each entry describes ONE specific focal landform for a 4-layer side-scrolling parallax-vista — rolling hills / fjord cliffs / desert mesa / volcanic ridge / arctic tundra / mountain ridge / sea-horizon / floating-island / canyon-rim / etc. Each entry 30-60 words.

⚠️ THE BAR: every entry reads as the focal landform of a 16-bit side-scrolling parallax vista (FF6 airship-flyover / Chrono Trigger world-map / Sonic 3 horizon background). Vista IS the hero — NO character, NO ship as focal subject. Just the LAND.

⚠️ LANDFORM CATEGORIES — distribute the 25 entries:
  • ~3 ROLLING HILLS / GRASSLANDS — emerald rolling hills with scattered trees, layered hill silhouettes
  • ~3 MOUNTAIN RIDGE / PEAKS — snow-capped peaks, mountain range, alpine ridge
  • ~3 DESERT MESA / CANYON — sandstone mesa, canyon rim, desert horizon
  • ~3 VOLCANIC RIDGE / LAVA — volcanic ridge with lava-rivers, caldera-rim, ash-fields
  • ~3 ARCTIC TUNDRA / ICE-SHELF — frozen tundra, ice-shelf edge, snow-mountain
  • ~3 COASTAL / SEA-HORIZON — sea-horizon at sunset, coastal cliffs, lighthouse-coast
  • ~3 FOREST / JUNGLE CANOPY — jungle canopy stretching to horizon, forest canopy, treetop layer
  • ~2 FLOATING-ISLAND / SKY-VISTA — floating islands in sky, cloud-sea below
  • ~1 ALIEN-PLANET HORIZON — alien-planet rim, multi-moon vista, cosmic horizon
  • ~1 ANCIENT-RUIN VISTA — distant ancient ruins along a ridge, fallen-city horizon

⚠️ EVERY entry MUST include:
  - SPECIFIC LANDFORM TYPE
  - FOREGROUND PARALLAX LAYER detail (closest tile-edge terrain)
  - MIDDLE LAYER detail (mid-distance hills / forest / village)
  - DISTANT LAYER detail (far peaks / horizon-mountains)
  - HARD pixel-edges between layers implied

🚫 STRICT BANS:
  • NO character / hero as focal subject
  • NO atmospheric-painting register
  • NO concept-art-wallpaper register
  • NO sky / backdrop description (separate axis)
  • NO lighting / atmospheric particle description (separate axis)
  • NO modern / contemporary setting
  • NO IP / UI / sexualized content`,
    touchpoints: [
      'EMERALD ROLLING HILLS — 4-layer parallax vista with chunky rocky-edge foreground tile, layered emerald-green rolling hills in midground at progressive depth, distant low-blue mountain ridge silhouette, vista of FF6-overworld-style endless rolling hills',
      'GRASSLAND WITH SCATTERED TREES — 4-layer parallax vista with grass-tile foreground bottom-edge, scattered tree-silhouettes in midground rolling-hills, distant blue-purple mountain ridge with snow-tile caps, expansive overworld feel',
      'SAVANNA RIDGE — 4-layer parallax vista with savanna-grass foreground, acacia-tree silhouettes scattered in midground rolling-hills, distant orange-rim mountains, expansive plains feel',
      'SNOW-CAPPED PEAKS — 4-layer parallax vista with chunky snow-tile foreground, rising snow-capped mountain ridge in midground, distant alpine peaks fading cool-blue in the far layer, classic alpine-vista',
      'ALPINE RIDGE WITH WATERFALL — 4-layer parallax vista with rocky cliff foreground, alpine ridge cascading down with chunky waterfall in midground, distant peaks behind, dramatic alpine feel',
      'MOUNTAIN-RANGE LAYERED — 4-layer parallax vista with chunky cliff-edge foreground, layered mountain-range silhouettes at progressive depth (sharp foreground / blue midground / purple-distant), classic side-scroller vista',
      'SANDSTONE MESA — 4-layer parallax vista with chunky sand-dune foreground, towering sandstone-mesa in midground, distant flat desert horizon behind, sandstone-orange palette, classic desert vista',
      'CANYON RIM VISTA — 4-layer parallax vista with chunky rocky-cliff foreground, canyon-rim dropping away in midground revealing canyon-walls, distant canyon-horizon, dramatic canyon depth',
      'DESERT HORIZON WITH DUNES — 4-layer parallax vista with chunky sand-dune foreground tile, layered sand-dune midground stretching to horizon, distant flat-desert-rim, sandstone-amber palette',
      'VOLCANIC RIDGE — 4-layer parallax vista with chunky lava-rock foreground, volcanic ridge with glowing-orange lava-rivers in midground, distant smoking volcano-peak in the far layer, dramatic volcanic feel',
      'CALDERA RIM — 4-layer parallax vista with chunky obsidian-rock foreground, caldera-rim dropping into glowing-orange lava-lake in midground, distant volcanic mountain ridge behind, hellish vista',
      'ASH-FIELD VOLCANIC — 4-layer parallax vista with chunky ash-and-rock foreground, ash-field stretching to a glowing-orange volcano in midground, distant ash-cloud rising in the far layer',
      'ARCTIC TUNDRA — 4-layer parallax vista with chunky snow-tile foreground, frozen tundra with scattered ice-rocks in midground, distant snow-mountain ridge behind, cool-blue palette',
      'ICE-SHELF EDGE — 4-layer parallax vista with chunky ice-shelf foreground (edge breaking off), frozen sea in midground stretching to horizon, distant ice-mountain ridge in the far layer, arctic vista',
      'SNOW-MOUNTAIN LAYERED — 4-layer parallax vista with chunky snow-tile foreground, layered snow-mountain ridge in midground at progressive depth, distant snow-mountain horizon, classic arctic vista',
      'SEA-HORIZON COASTAL — 4-layer parallax vista with chunky rocky-coast foreground, calm sea stretching to horizon in midground, distant island silhouettes in the far layer, coastal classic',
      'COASTAL CLIFFS — 4-layer parallax vista with chunky cliff-edge foreground (overlooking sea), sea waves crashing on rocks in midground, distant lighthouse-and-island silhouettes in the far layer',
      'LIGHTHOUSE COAST — 4-layer parallax vista with chunky coastal-grass foreground, lighthouse on rocky-outcrop in midground, distant sea-horizon and island silhouettes in the far layer',
      'JUNGLE CANOPY — 4-layer parallax vista with chunky jungle-canopy foreground (treetops at viewer-level), layered jungle-canopy midground stretching to horizon, distant jungle-mountain ridge behind',
      'FOREST CANOPY — 4-layer parallax vista with chunky forest-canopy foreground, layered forest treetops in midground at progressive depth, distant blue-purple mountain ridge in the far layer',
      'TREETOP LAYER VISTA — 4-layer parallax vista with chunky individual tree-silhouette foreground, layered treetop canopy in midground stretching to horizon, distant treetop-and-mountain rim behind',
      'FLOATING-ISLAND VISTA — 4-layer parallax vista with chunky floating-island-rock foreground (suspended over clouds), additional floating-islands at midground depth, distant floating-island cluster in the far layer, sky-realm feel',
      'CLOUD-SEA BELOW VISTA — 4-layer parallax vista with chunky mountain-peak foreground (jutting above clouds), cloud-sea stretching to horizon below in midground, distant mountain-peaks jutting above clouds in the far layer',
      'ALIEN-PLANET HORIZON — 4-layer parallax vista with chunky alien-rock foreground (purple-magenta tile), alien-rock formations in midground, distant alien-planet-rim with multi-moon silhouette in the far layer',
      'ANCIENT-RUIN RIDGE VISTA — 4-layer parallax vista with chunky stone-rubble foreground, ancient-ruins along a ridge in midground at progressive depth, distant fallen-city silhouette in the far layer, classic explorer-vista',
    ],
    instructions: `Each entry is ONE specific VISTA SUBJECT (focal landform), 30-60 words. Format: "LANDFORM NAME CAPS — 4-layer parallax vista + foreground detail + midground detail + distant detail". MANDATORY — (a) landform type, (b) foreground parallax layer, (c) middle layer, (d) distant layer, (e) HARD pixel-edges between layers implied. NO character / hero. NO sky / backdrop description. NO lighting / atmospheric description. NO modern. NO IP/UI/sexual. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_epic_vista_sky_or_backdrop: {
    format: 'simple',
    theme: `SKY / BACKDROP LAYER (far back) for the PixelBot epic-vista path. Each entry describes ONE specific sky or backdrop layer for a 4-layer side-scrolling parallax-vista — sunset / dawn / starfield / aurora / cloud-bank / planet-rising / nebula / etc. Each entry 25-50 words.

⚠️ THE BAR: every entry establishes the FAR BACKDROP layer of a 16-bit parallax-vista. Rendered as DITHERED COLOR BANDS (not smooth gradients). Chunky-pixel-edge clouds. Hard pixel-edge horizon. SNES-era saturated palette.

⚠️ BACKDROP CATEGORIES — distribute the 25 entries:
  • ~4 SUNSET — golden-amber sunset / pink-orange sunset / blood-red sunset / soft-pastel sunset
  • ~4 DAWN — soft-pink dawn / golden dawn / mist-and-pink dawn / cool-blue dawn
  • ~3 STARFIELD / NIGHT — starfield with milky-way-band / starfield with crescent-moon / starfield with full-moon
  • ~3 AURORA — green-aurora / pink-and-green aurora / multi-color aurora
  • ~3 CLOUD-BANK — towering cumulus / wispy stratus / chunky-pixel-edge cloud-bank
  • ~2 PLANET-RISING / MOON — single moon / multi-moon / planet rising on horizon
  • ~2 NEBULA / COSMIC — purple-pink nebula / blue-cosmic nebula
  • ~2 STORM / OVERCAST — chunky-edge storm clouds / overcast-grey sky
  • ~1 MIDDAY CLEAR — clear blue midday sky
  • ~1 ECLIPSE / RARE — eclipse-disc / sun-pillar / sun-dog

⚠️ EVERY entry MUST include:
  - SPECIFIC SKY / BACKDROP TYPE
  - DITHERED COLOR BANDS implied (not smooth gradients)
  - PALETTE detail
  - CHUNKY-PIXEL-EDGE cloud / horizon detail

🚫 STRICT BANS:
  • NO smooth gradient sky-fades (DITHERED color bands ONLY)
  • NO airbrushed cloud edges
  • NO atmospheric-painting register
  • NO landform / vista subject description (separate axis)
  • NO lighting / atmospheric particle description (separate axis)`,
    touchpoints: [
      'GOLDEN-AMBER SUNSET — far backdrop sky with DITHERED golden-amber color-bands transitioning from warm-yellow at the horizon to deep-orange and purple-violet above, hard pixel-edge horizon, SNES-era saturated palette',
      'PINK-ORANGE SUNSET — far backdrop sky with DITHERED pink-orange color-bands at the horizon transitioning to magenta and indigo above, hard pixel-edge horizon, soft-romantic register',
      'BLOOD-RED SUNSET — far backdrop sky with DITHERED blood-red color-bands at the horizon transitioning to dark-purple above, dramatic ominous register, hard pixel-edge horizon',
      'SOFT-PASTEL SUNSET — far backdrop sky with DITHERED soft-pastel color-bands (peach + lavender + cyan) at the horizon, gentle peaceful register, hard pixel-edge horizon',
      'SOFT-PINK DAWN — far backdrop sky with DITHERED soft-pink color-bands at the horizon transitioning to lavender above, gentle peaceful register, hard pixel-edge horizon, fresh-morning feel',
      'GOLDEN DAWN — far backdrop sky with DITHERED golden color-bands at the horizon transitioning to cool-blue above, hopeful generative register, hard pixel-edge horizon',
      'MIST-AND-PINK DAWN — far backdrop sky with DITHERED mist-pink color-bands at the horizon (low-mist band visible), transitioning to soft-grey above, peaceful misty register',
      'COOL-BLUE DAWN — far backdrop sky with DITHERED cool-blue color-bands at the horizon transitioning to deep-blue above, fresh-early-dawn register, hard pixel-edge horizon',
      'STARFIELD WITH MILKY-WAY — far backdrop deep-blue-black starfield with scattered pixel-stars across the field, MILKY-WAY-BAND visible as a soft-pixel-band of denser stars crossing the sky, magical night register',
      'STARFIELD WITH CRESCENT-MOON — far backdrop deep-blue-black starfield with scattered pixel-stars, glowing-yellow crescent-moon in the upper area, peaceful magical-night register',
      'STARFIELD WITH FULL-MOON — far backdrop deep-blue-black starfield with scattered pixel-stars, large glowing-white full-moon prominent in the upper area, atmospheric magical-night register',
      'GREEN-AURORA — far backdrop cool-blue-night sky with DITHERED green-aurora bands curtaining across the upper area, scattered pixel-stars behind, magical arctic-night register',
      'PINK-AND-GREEN AURORA — far backdrop cool-blue-night sky with DITHERED pink-and-green aurora bands curtaining across the upper area, magical aurora register',
      'MULTI-COLOR AURORA — far backdrop cool-blue-night sky with DITHERED multi-color aurora bands (green + pink + purple) curtaining across, magical magical-arctic register',
      'TOWERING CUMULUS — far backdrop clear-blue sky with chunky-pixel-edge towering cumulus clouds dominating the upper area, hard pixel-edge horizon, dramatic atmospheric register',
      'WISPY STRATUS — far backdrop pale-blue sky with chunky-pixel-edge wispy stratus clouds streaking horizontally, hard pixel-edge horizon, gentle peaceful register',
      'CHUNKY-CLOUD BANK — far backdrop sky with massive chunky-pixel-edge cloud-bank dominating the upper area, breaks of clear-blue between, dramatic atmospheric register',
      'SINGLE MOON RISING — far backdrop deep-blue-twilight sky with single glowing-yellow moon rising on the horizon, scattered pixel-stars in the upper area, atmospheric peaceful-night register',
      'MULTI-MOON VISTA — far backdrop deep-purple-twilight sky with two-or-three moons (varying sizes) in the upper area, scattered pixel-stars, magical alien-night register',
      'PLANET RISING ON HORIZON — far backdrop deep-purple-twilight sky with massive ringed-planet rising on the horizon (taking up significant upper-area), scattered pixel-stars, alien-vista register',
      'PURPLE-PINK NEBULA — far backdrop deep-blue-black space with DITHERED purple-pink nebula clouds in the upper area, scattered pixel-stars overlaying, cosmic register',
      'BLUE-COSMIC NEBULA — far backdrop deep-blue-black space with DITHERED blue-cosmic nebula clouds in the upper area, scattered pixel-stars, cosmic register',
      'CHUNKY STORM CLOUDS — far backdrop dark-grey sky with massive chunky-pixel-edge storm clouds dominating the upper area, occasional pixel-lightning-bolt, dramatic ominous register',
      'CLEAR BLUE MIDDAY — far backdrop clear-blue midday sky with scattered chunky-pixel-edge white-cloud-puffs, hard pixel-edge horizon, bright-cheerful register',
      'ECLIPSE-DISC — far backdrop dark-purple sky with eclipse-disc (black-circle with bright-corona-ring) prominent in the upper area, scattered pixel-stars revealed, dramatic rare register',
    ],
    instructions: `Each entry is ONE specific SKY / BACKDROP layer, 25-50 words. Format: "BACKDROP NAME CAPS — far backdrop type + DITHERED color bands + palette detail + chunky-pixel-edge implied". MANDATORY — (a) sky/backdrop type, (b) DITHERED color bands, (c) palette detail, (d) chunky-pixel-edge clouds/horizon. NO smooth gradients. NO airbrushed cloud edges. NO atmospheric-painting. NO landform description. NO lighting / atmospheric description. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_epic_vista_lighting_atmosphere: {
    format: 'simple',
    theme: `LIGHTING + ATMOSPHERIC PARTICLES for the PixelBot epic-vista path. Each entry describes ONE specific combination of time-of-day lighting + atmospheric particles drifting through the parallax vista. Each entry 25-50 words.

⚠️ THE BAR: every entry establishes the LIGHTING REGISTER (palette + time-of-day quality) + ATMOSPHERIC PARTICLES (drifting petals / pollen / snow / embers / mist / dust / leaves) for the parallax-vista. 16-bit pixel-art register only.

⚠️ LIGHTING CATEGORIES — distribute the 25 entries:
  • ~5 GOLDEN-HOUR — warm golden amber light, long pixel-shadows
  • ~4 BLUE-HOUR / TWILIGHT — cool-blue twilight, transitioning palette
  • ~3 STARLIT — cool-blue night ambient
  • ~3 MIDDAY — bright golden midday light
  • ~3 DAWN — soft cool-warm dawn light
  • ~3 STORM-LIT / DRAMATIC — pixel-lightning illumination
  • ~2 AURORA-LIT — multi-color aurora ambient
  • ~2 VOLCANIC-LIT — glowing-orange volcanic ambient

⚠️ ATMOSPHERIC PARTICLE CATEGORIES — distribute across the entries:
  • Drifting cherry-blossom petals
  • Drifting wildflower petals
  • Drifting dandelion-seed fluff
  • Drifting pollen-motes
  • Falling snow-flurries
  • Drifting embers / ash
  • Drifting mist-bands
  • Drifting dust-motes
  • Falling autumn-leaves
  • Drifting firefly-points
  • Drifting cloud-puffs
  • Drifting fog-bands

⚠️ EVERY entry MUST include:
  - SPECIFIC LIGHTING TIME-OF-DAY
  - SPECIFIC ATMOSPHERIC PARTICLES
  - PALETTE detail
  - PIXEL register implied (chunky pixel-shadows, dithered ambient)

🚫 STRICT BANS:
  • NO landform / vista subject description (separate axis)
  • NO sky / backdrop description (separate axis)
  • NO smooth gradients / airbrushed effects
  • NO IP / UI / sexualized content`,
    touchpoints: [
      'GOLDEN-HOUR WITH PETAL-DRIFT — warm-golden-amber lighting with long pixel-shadows on the vista, drifting cherry-blossom pink petals filling the foreground/midground parallax depth, magical golden-hour register',
      'GOLDEN-HOUR WITH POLLEN — warm-golden-amber lighting with long pixel-shadows on the vista, drifting pollen-motes glowing in the warm light filling the parallax depth, peaceful summer register',
      'GOLDEN-HOUR WITH DANDELION-FLUFF — warm-golden-amber lighting with long pixel-shadows on the vista, drifting dandelion-seed-fluff catching the warm light filling the parallax depth',
      'GOLDEN-HOUR WITH MIST-BANDS — warm-golden-amber lighting with long pixel-shadows on the vista, drifting mist-bands in the distant parallax layer, peaceful magical register',
      'GOLDEN-HOUR WITH LEAVES — warm-golden-amber lighting with long pixel-shadows on the vista, drifting autumn-leaves filling the foreground parallax, magical autumn register',
      'BLUE-HOUR WITH FIREFLY-POINTS — cool-blue twilight ambient with warm-yellow lit-window-pixels in the distant village layer, drifting warm-yellow firefly-points in the midground parallax, magical twilight register',
      'BLUE-HOUR WITH MIST — cool-blue twilight ambient transitioning to warm-yellow at the horizon, drifting mist-bands in the distant parallax layer, peaceful twilight register',
      'BLUE-HOUR WITH SNOW-FLURRIES — cool-blue twilight ambient with falling snow-flurries filling the parallax depth, magical winter-twilight register',
      'BLUE-HOUR WITH CLOUD-PUFFS — cool-blue twilight ambient with chunky-pixel-edge cloud-puffs drifting in the midground parallax, peaceful magical-twilight register',
      'STARLIT WITH FIREFLIES — cool-blue starlit night ambient with drifting warm-yellow firefly-points in the foreground/midground parallax, magical night register',
      'STARLIT WITH MIST — cool-blue starlit night ambient with drifting mist-bands in the distant parallax layer, peaceful magical-night register',
      'STARLIT WITH FALLING-SNOW — cool-blue starlit night ambient with falling snow-flurries filling the parallax depth, magical winter-night register',
      'MIDDAY WITH POLLEN — bright golden midday lighting on the vista with sharp pixel-shadows, drifting pollen-motes catching the bright light filling the parallax depth',
      'MIDDAY WITH CLOUD-PUFFS — bright golden midday lighting on the vista with sharp pixel-shadows, chunky-pixel-edge cloud-puffs drifting in the midground parallax, classic bright-day register',
      'MIDDAY WITH BIRD-SILHOUETTES — bright golden midday lighting on the vista with sharp pixel-shadows, scattered tiny bird-silhouettes drifting through the upper-midground parallax, classic vista register',
      'DAWN WITH MIST-BANDS — soft cool-warm dawn lighting with drifting mist-bands in the midground/distant parallax layer, magical fresh-morning register',
      'DAWN WITH DEW-GLINTS — soft cool-warm dawn lighting with drifting pollen-and-dew glints catching the morning light, magical fresh-dawn register',
      'DAWN WITH PETAL-DRIFT — soft cool-warm dawn lighting with drifting cherry-blossom pink petals filling the foreground parallax, magical fresh-spring-dawn register',
      'STORM-LIT WITH LIGHTNING — dramatic dark-grey-blue lighting with pixel-lightning-bolt illuminating the vista, drifting storm-clouds in the upper parallax, dramatic ominous register',
      'STORM-LIT WITH RAIN — dark-grey-blue lighting with falling rain-pixels filling the parallax depth, drifting storm-clouds in the upper parallax, dramatic atmospheric register',
      'STORM-LIT WITH MIST — dark-grey-blue lighting with drifting mist-and-fog-bands filling the parallax depth, atmospheric stormy register',
      'AURORA-LIT WITH SNOW — magical aurora ambient (pink-and-green-and-purple) illuminating the snowy vista, falling snow-flurries filling the parallax depth, magical arctic register',
      'AURORA-LIT WITH MIST — magical aurora ambient illuminating the vista, drifting mist-bands in the distant parallax layer, magical arctic-aurora register',
      'VOLCANIC-LIT WITH EMBERS — dramatic glowing-orange volcanic ambient illuminating the vista, drifting embers and ash filling the parallax depth, dramatic hellish register',
      'VOLCANIC-LIT WITH ASH-FALL — dramatic glowing-orange volcanic ambient illuminating the vista, falling ash-particles filling the parallax depth, dramatic ominous-volcanic register',
    ],
    instructions: `Each entry is ONE specific LIGHTING + ATMOSPHERIC PARTICLES combination, 25-50 words. Format: "LIGHTING + PARTICLES CAPS — time-of-day lighting + specific atmospheric particles + palette + pixel register". MANDATORY — (a) lighting time-of-day, (b) atmospheric particles, (c) palette, (d) pixel register implied. NO landform description. NO sky / backdrop description. NO smooth gradients. NO IP/UI/sexual. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  pixelbot_epic_vista_parallax_silhouette: {
    format: 'simple',
    theme: `40%-GATED PARALLAX SILHOUETTE for the PixelBot epic-vista path. Each entry describes ONE specific tiny optional silhouette woven into a parallax layer of the vista — bird / airship / caravan / traveler / dragon / boat / etc. NEVER the focal subject. Each entry 20-40 words.

⚠️ THE BAR: every entry is a TINY scale silhouette in one of the parallax layers (foreground edge / middle / distant) that adds story-flavor WITHOUT competing with the vista. Scale: small enough that you'd miss it on a casual scroll-past.

🚫 STRICT BANS: NO IP / UI / sexualized / focal-subject (the silhouette must be SMALL and woven into a parallax layer, never the hero).

✓ SILHOUETTE CATEGORIES:
  A. BIRDS — single bird / flock of birds / eagle / hawk
  B. AIRSHIPS — FF6-style airship / dirigible / hot-air balloon
  C. CARAVAN — caravan crossing the midground / travelers
  D. SOLO TRAVELER — lone-traveler silhouette / monk / pilgrim
  E. DRAGON — distant dragon in flight / sea-serpent
  F. SAILING BOAT — distant boat on sea / fishing vessel
  G. WAGON / CART — wagon crossing midground
  H. DISTANT VILLAGE — tiny village silhouette in midground
  I. ANIMAL — distant herd / wild beast
  J. WIZARD-TOWER / RUIN — tiny ruin silhouette in distant`,
    touchpoints: [
      'SINGLE BIRD SILHOUETTE — single tiny bird-silhouette flying through the midground parallax layer, wings mid-flap, classic SNES-vista silhouette',
      'FLOCK OF BIRDS — small flock of 5-8 tiny bird-silhouettes in V-formation flying through the upper-midground parallax layer, atmospheric vista detail',
      'EAGLE SOARING — single tiny eagle-silhouette soaring through the upper-midground parallax with wings spread, classic vista detail',
      'HAWK CIRCLING — single tiny hawk-silhouette circling in the upper-midground parallax above the vista, atmospheric detail',
      'FF6-STYLE AIRSHIP — tiny airship-silhouette (FF6-style with twin-propellers) cruising through the middle parallax layer, atmospheric story-flavor',
      'DIRIGIBLE PASSING — tiny dirigible-silhouette with gondola passing through the middle parallax layer, classic SNES-airship register',
      'HOT-AIR BALLOON — tiny hot-air-balloon-silhouette drifting through the middle parallax layer, atmospheric peaceful detail',
      'CARAVAN CROSSING — tiny caravan-of-3-4-wagons crossing through the middle parallax layer along a road, atmospheric travel-story register',
      'TRAVELERS ON PATH — tiny silhouettes of 2-3 travelers walking along a path in the middle parallax layer, atmospheric story-detail',
      'LONE TRAVELER WITH PACK — tiny lone-traveler-silhouette with backpack walking along the foreground parallax-edge path, atmospheric story-detail',
      'MONK ON PILGRIMAGE — tiny robed monk-silhouette walking along a path in the middle parallax layer, atmospheric pilgrim register',
      'PILGRIM AT VANTAGE — tiny pilgrim-silhouette standing at a vantage in the middle parallax layer looking out, atmospheric story moment',
      'DISTANT DRAGON IN FLIGHT — tiny dragon-silhouette in flight through the upper parallax layer with wings spread, atmospheric mythic register',
      'SEA-SERPENT — tiny sea-serpent-silhouette emerging from the sea in the middle parallax layer, atmospheric mythic register',
      'SAILING BOAT ON SEA — tiny sailing-boat-silhouette on the distant sea in the middle parallax layer, classic vista detail',
      'FISHING VESSEL — tiny fishing-vessel-silhouette with rigging on the sea in the middle parallax layer, atmospheric coastal register',
      'WAGON CROSSING BRIDGE — tiny wagon-silhouette crossing a bridge in the middle parallax layer, atmospheric travel-story register',
      'CART ON ROAD — tiny cart-silhouette with traveler on a road in the middle parallax layer, atmospheric travel-story detail',
      'DISTANT VILLAGE — tiny village-silhouette with rooftops and smoke-curling visible in the distant parallax layer, atmospheric world-detail',
      'DISTANT CASTLE — tiny castle-silhouette with spires visible in the distant parallax layer, atmospheric fantasy-world detail',
      'DISTANT HERD — tiny herd-of-creatures (deer / horse / etc.) in the middle parallax layer, atmospheric wildlife-detail',
      'WILD BEAST AT EDGE — tiny wild-beast-silhouette (wolf / lion / bear) at the foreground parallax-edge looking out, atmospheric wildlife-detail',
      'WIZARDS TOWER DISTANT — tiny wizards-tower-silhouette on a distant peak in the distant parallax layer, atmospheric fantasy register',
      'ANCIENT RUIN — tiny ancient-ruin-silhouette (crumbled tower / fallen-arch) in the distant parallax layer, atmospheric explorer register',
      'LIGHTHOUSE BLINKING — tiny lighthouse-silhouette with blinking-light on a distant coastal point in the middle parallax layer, atmospheric coastal detail',
    ],
    instructions: `Each entry is ONE specific TINY PARALLAX SILHOUETTE, 20-40 words. Format: "SILHOUETTE NAME CAPS — silhouette type + which parallax layer + size + atmospheric flavor". MANDATORY — (a) silhouette type, (b) parallax layer placement, (c) TINY scale, (d) atmospheric story-flavor. NO focal-subject. NO IP/UI/sexual. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // PixelBot recipes go here — one entry per bespoke pool.
  // Each entry: { format: 'simple', theme: '...', touchpoints: [...], instructions: '...' }
  // See BOT_SCENE_QUALITY_PLAYBOOK.md "How to seed pools" section.
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
  process.exit(1);
}

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
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseArray(text) {
  const body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) {
      if (current) entries.push(current);
      current = m[2].trim();
    } else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) =>
      e
        .replace(/^["']|["']$/g, '')
        .replace(/^[-•*]\s*/, '')
        .trim()
    )
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'with',
  'of',
  'in',
  'on',
  'at',
  'to',
  'for',
  'from',
  'by',
  'as',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'this',
  'that',
  'these',
  'those',
  'it',
  'its',
  'they',
  'them',
  'their',
  'her',
  'his',
  'into',
  'onto',
  'through',
  'across',
  'over',
  'under',
  'near',
  'around',
  'between',
  'one',
  'two',
  'three',
  'some',
  'any',
  'all',
  'no',
  'not',
  'than',
  'then',
  'also',
  'so',
  'very',
  'more',
  'most',
  'many',
  'much',
  'each',
  'every',
  'other',
  'another',
  'same',
  'such',
  'only',
  'own',
  'just',
  'still',
  'here',
  'there',
  'where',
  'when',
  'what',
  'who',
  'wide',
  'tall',
  'long',
  'high',
  'low',
  'large',
  'small',
  'massive',
  'huge',
  'vast',
  'above',
  'below',
  'beside',
  'behind',
  'toward',
  'within',
  'throughout',
]);

function signatureOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  const tokens = body
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOPWORDS.has(w))
    .slice(0, 20);
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map();
  const seenTitles = new Map();
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'title' });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'body' });
      continue;
    }
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
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  if (!Array.isArray(arr) || arr.length === 0) {
    console.warn('  ⚠ Sonnet returned no usable entries');
    return [];
  }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/pixelbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  if (TARGET !== null)
    console.log(
      `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
    );
  else
    console.log(
      `Pool "${POOL}" (pixelbot): gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`
    );
  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    const within = dedupe(fresh);
    if (within.dropped.length > 0)
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
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
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping');
      break;
    }
  }
  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );
  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
