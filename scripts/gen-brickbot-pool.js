#!/usr/bin/env node
/**
 * Generate a BrickBot axis pool using Sonnet.
 *
 * Bespoke pirate recipes for the 2026-05-22 axis-system migration of the
 * pirates path. Anchored on Pirates of the Caribbean LEGO sets, Bricklink
 * AFOL pirate dioramas, vintage LEGO Pirates (Black Seas Barracuda etc.),
 * and Treasure Island / Master & Commander narrative beats. Per the
 * `feedback_each_path_bespoke_not_cloned.md` rule: every recipe here is
 * pirate-bespoke, not cloned from any other bot's gen script.
 *
 * Infrastructure (signatureOf / dedupe / target-loop) mirrors
 * gen-mechbot-pool.js + gen-dragonbot-pool.js.
 *
 * Usage:
 *   node scripts/gen-brickbot-pool.js --pool brickbot_pirates_scene_type --target 50
 *   node scripts/gen-brickbot-pool.js --pool brickbot_pirates_ship_class --count 25
 *
 * Output: scripts/bots/brickbot/seeds/<pool>.json
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
const flag = (n, fb) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : fb; };
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '25'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — BrickBot pirates path (2026-05-22)
// Bespoke per-path; NOT cloned from other bots' recipes.
// Canon: POTC LEGO sets + Bricklink AFOL pirate dioramas + vintage LEGO
// Pirates (Black Seas Barracuda / Skull's Eye Schooner / Brickbeard's
// Bounty) + Treasure Island + Master & Commander.
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {

  // ════════════════════════════════════════════════════════
  // FANTASY PATH (2026-05-22 — third BrickBot axis migration)
  // ════════════════════════════════════════════════════════

  brickbot_fantasy_scene_type: {
    format: 'simple',
    theme: `LEGO MOC FANTASY DIORAMA SCENE STAGES — narrative-stage descriptions for the BrickBot fantasy axis system. Each entry is ONE narrative stage (the WHAT — what category of medieval-fantasy moment is this diorama?). Each entry 30-55 words.

⚠️ STAGE / SETTING / NARRATIVE CATEGORY only. NO camera framing language. NO minifig action verbs. NO build technique vocab. NO magical phenomena. Stage + tension only.

VARIETY MANDATE — distribute across these categories (~5-8% each):
  • CASTLE SIEGE — defenders on battlements / trebuchet bombardment / battering ram at gate / scaling-ladder assault / wall-breach moment
  • DRAGON ATTACK — dragon-besieging-castle / dragon-fire raining down on village / village evacuation / refugee column fleeing
  • DRAGON LAIR — sleeping dragon on hoard of gold (Smaug-coded) / dragon hatchling in nest / lair-entrance confrontation / dragon-rider mounting
  • MOUNTED COMBAT — jousting tournament lists / cavalry charge across battlefield / mounted-knight melee / wargs-vs-horses skirmish
  • TOURNAMENT / FESTIVAL — joust pavilion + crowd / archery contest / sword-tournament / royal feast / harvest festival in medieval village
  • CORONATION / ROYAL CEREMONY — throne-room coronation / royal wedding in cathedral / knighting ceremony at altar / sword-in-stone moment / royal-procession through woods
  • WIZARD TOWER — alchemist laboratory / wizard's library / mage-tower observatory / scrying-chamber / arcane-experiment-in-progress
  • MAGE DUEL — two mages mid-spell-collision / wizards' council in war-room / necromancer summoning / cleric-vs-undead exorcism
  • ELVEN TREETOP — elven city in canopy / Rivendell-coded sanctuary / Mirkwood feast / forest-shrine encounter
  • DWARVEN MINE — Khazad-dûm / Erebor underground hall / dwarf-forge / mining-cart procession / dragon-flooded ruins
  • RANGER / ADVENTURER PARTY — D&D 4-figure party at campsite / forest-glade druid encounter / hidden-shrine discovery / bandit ambush on path
  • TAVERN INTERIOR — bard performing / drunken-brawl / quest-hire meeting / hooded-stranger in corner / wedding-night-cheer
  • DUNGEON / CRYPT — torture-chamber / treasure-vault discovery / cursed-tomb opening / prisoner-rescue / lich-throne approach
  • SKELETON UPRISING — graveyard skeletons emerging / necromancer raising dead / skeleton army marching / lich tower siege
  • COASTAL / BRIDGE DEFENSE — coastal watchtower beacon / hold-the-bridge against horde / cliff-castle attack / lighthouse warning
  • WITCH HUT / SWAMP — witch's hut on chicken-legs in poisoned marsh / coven gathered around bonfire / cauldron-brewing
  • MOUNTAIN PASS AMBUSH — orc/goblin ambush on travelers / troll-bridge confrontation / cave-troll emerging / mountain-pass skirmish
  • THRONE ROOM — kingly audience / hooded-emissary delivers ill news / coronation / banquet-feast / war-council
  • TOWN MARKET — medieval market-square / harvest festival / royal proclamation in plaza / pickpocket-vs-guard chase
  • NORTHERN-REALM / VOLCANIC — Skyrim-coded frozen realm with northern-warriors / Mordor-coded volcanic-wastes / Helm's Deep walled fortress / Minas Tirith white-city
  • STONE-CIRCLE / SUMMONING — Stonehenge-coded ritual circle / faerie-circle gathering / fey-court / underworld-portal opening
  • RUINS / SUNKEN — sunken temple in jungle / ancient-elven ruins / lost-city of dwarves / overgrown abbey
  • REFUGEE COLUMN — village evacuating dragon-attack / peasants fleeing battle / wagon-train mid-flight / camping-with-dragon-on-horizon
  • LIBRARY / SCRIPTORIUM — monastery library / scribe at parchment / wizard archivist / hidden-codex discovery

Each entry must:
• Name the narrative category in first 6-10 words
• Establish the diorama STAGE (architecture / biome / interior)
• Suggest TENSION or STAKES of the moment (without prescribing the action verb)
• NEVER name a specific minifig action ("knight swinging sword" — that's minifig_action axis)
• NEVER name a magical phenomenon ("fire raining down" if isolated — that's magical_phenomenon axis)`,
    touchpoints: [
      'CASTLE SIEGE WALL-BREACH — multi-tier brick-built stone castle wall taking direct trebuchet impact, splintered crenellations and dust-plates erupting outward, defenders in heraldic-tabard surcoats scrambling along the battlement rim, attackers swarming the breach from below, the moment-of-collapse',
      'DRAGON BESIEGING CASTLE — colossal brick-built dragon mid-attack on a tall castle keep, knights firing crossbows from battlements as dragon-claw grips a tower turret and wing-section dominates the upper-frame, banners torn, the dragon-vs-castle iconic moment',
      "SLEEPING DRAGON ON GOLD HOARD — vast underground lair with massive brick-built dragon coiled on a mountain of 1×1 gold round-plates and trans-purple/trans-red jewel pieces, scattered crown + chalice + weapon props across the hoard, lone hooded thief approaching the edge, Smaug-coded scene",
      "JOUSTING TOURNAMENT LISTS — wooden tournament-lists with painted heraldic banners, two armored knights on caparisoned warhorses bearing lances at full gallop down opposite sides, central tilt-rail of brick-built timber, royal pavilion with crowd in colored tunics, the moment-before-impact",
      "ELVEN TREETOP CITY — multi-level brick-built city built across three interconnected giant trees, leaf-element canopy in olive-green and dark-green, rope-bridges with rail-pieces connecting platforms, lantern-lit pavilions, elven minifigs in long-hair variants on multiple levels, Rivendell-coded sanctuary feel",
      "DWARVEN FORGE HALL — vast underground hall built from dark-bley pillars with mithril-blue accent veins, massive brick-built forge at center with trans-orange flame elements and stacked weapon-racks, dwarven minifigs in plate-armor with bearded heads working anvils, dragon-flooded-Erebor-coded heritage",
      "WIZARD'S TOWER LIBRARY — interior of a wizard's tower with brick-built bookshelves walls floor-to-ceiling, scattered scrolls + alchemical-glassware + crystal-orbs on tables, wizard minifig at a central lectern with grimoire open, trans-purple magical-residue elements drifting around the room",
      "THRONE ROOM CORONATION — vaulted throne-hall with stained-glass-pattern tile windows, central throne on raised dais with crown-bearer at the base, court attendants in heraldic livery flanking the central aisle, archbishop minifig with mitre lifting the crown, the moment-of-coronation",
      'D&D ADVENTURER PARTY CAMPSITE — forest-glade clearing with brick-built campfire (trans-orange flame cluster), four-minifig adventuring party in distinct archetypes (plate-armor fighter / hooded rogue / robed wizard with staff / cleric with mace), surrounding ancient oak trees in canopy, the night-before-the-quest beat',
      "CRYPT TREASURE VAULT — underground crypt with stone-block walls + sarcophagus-tiles around the perimeter, central altar bearing a glowing trans-purple artifact, hooded thief minifig approaching the altar from foreground, skeleton-warriors emerging from sarcophagi at frame-edges, the trap-springs moment",
      "TAVERN BARD PERFORMANCE — interior medieval tavern with timber-beam ceiling and brick-built fireplace, central bard minifig with lute on tabletop performing for crowd, drinking patrons at scattered tables with chalice + tankard props, hooded stranger in shadowy corner watching, lively festival-night feel",
      "FROZEN NORTHERN REALM HOLD — snow-covered stone hold of a Skyrim-coded northern-realm, mead-hall structure with wolf-banner heraldry, Viking-coded warrior minifigs in fur-cloaks gathered outside, brick-built standing stones at hold-perimeter, the moment-of-jarl-return-from-raid",
      'MORDOR VOLCANIC WASTES — black + dark-red volcanic landscape with brick-built basalt formations and trans-orange lava-rivers, Barad-dûr-coded tower silhouette in the deep distance with trans-red eye-of-Sauron summit, uruk-hai minifig column marching toward camera in receding perspective, LotR-Mordor-coded heritage scene',
      "HELM'S DEEP WALL DEFENSE — fortified curtain-wall of stone-fortress (Helm's Deep-coded) with parapeted battlement, defending Rohirrim minifigs along the wall with bows + spears, brick-built siege-ladders pushing up at multiple points, dramatic-fortress-defense moment, LotR heritage",
      'ROYAL WEDDING IN CATHEDRAL — vaulted gothic-cathedral interior with stained-glass-window tile-panels casting cool-blue + trans-red light onto the central aisle, royal couple at altar with archbishop officiating, court attendants flanking the aisle in heraldic livery, the vow-exchange moment',
      "MOUNTAIN PASS GOBLIN AMBUSH — narrow rocky pass between two steep cliff-walls in light-bley slope-bricks, traveler-minifigs (D&D party-coded) caught mid-stride as goblin-minifig ambushers emerge from boulder-cover with curved-blades, the moment-of-discovery",
      "WITCH'S HUT ON CHICKEN-LEGS — Baba-Yaga-coded witch's hut perched on giant brick-built chicken-legs in a poisoned-purple marsh baseplate, skull-fence perimeter around the hut, witch minifig with broom at the doorway, bubbling trans-green cauldron outside, cursed-marshland feel",
      "STONE CIRCLE RITUAL — Stonehenge-coded ring of vertical light-bley stone-monoliths on a moonlit moor baseplate, druid-coded minifigs in dark-green robes gathered around a central altar-stone, trans-magenta magical-light emerging from the altar, ritual-summoning moment",
      "FOREST GLADE DRUID ENCOUNTER — sun-dappled glade between giant oaks with brick-built moss-covered shrine-stone at center, druid-minifig in dark-green robes with antler-headdress at the shrine, deer-minifig and forest-creatures approaching peacefully, sacred-nature moment",
      "RANGERS' WATCHTOWER — wooden Forestmen-coded watchtower built into the canopy of a giant oak with leaf-element foliage, Forestmen-green-hood ranger minifigs at the platform with bows drawn, the lookout-spotting-orcs-on-horizon moment",
      "REFUGEE COLUMN FLEEING DRAGON — narrow road through hillside with wagons + peasants + livestock mid-flight, lookout-pointing-back at a brick-built dragon silhouette appearing over the deep-distance mountain ridge with smoke-column from a burning village behind, the moment-of-realization",
      "DUNGEON PRISONER RESCUE — torch-lit stone-dungeon corridor with iron-bar cell at frame-edge, prisoner-minifig inside reaching out as rogue-minifig at the cell-door works the lock with thieves-tools, guard-minifig slumped unconscious at the corridor end, the rescue-moment",
      'NECROMANCER SUMMONING — interior of a black-stone necromancer-tower with central pentagram-floor in trans-purple tiles, necromancer-minifig with skull-staff at the pentagram, skeletons rising from the floor pattern, dark-arts ritual moment',
      "FAERIE COURT — LEGO Elves-coded enchanted glade with brick-built mushroom-pavilions in bright-pinks + trans-purple + trans-green, faerie-minifigs (Elves-line-coded) gathered around a crystal-throne, the welcoming-quest-givers moment in pastels",
      'COASTAL CLIFF WATCHTOWER — coastal-cliff fortress on edge of high cliff-face, crashing trans-blue wave-elements against rocks below, beacon-fire trans-orange flame at watchtower peak, garrison minifigs in heraldic-livery on the walls, the warning-signal moment',
      "HORSEMEN COURIER PURSUIT — riders on caparisoned warhorses mid-gallop across an open field, courier-minifig in front with scroll-tube clutched in C-hand, two pursuing knight-minifigs behind in heavy plate-armor with lances couched, the chase-mid-pursuit moment",
      "BANDIT AMBUSH ON CARRIAGE — wooded roadside with brick-built royal-carriage caught mid-stop, bandit-minifigs leaping from the foliage with raised weapons, driver-minifig mid-reach for crossbow, the highway-robbery moment",
      "GOLEM AWAKENING — brick-built stone-golem on an altar-platform in an ancient ruin, alchemist-minifig at the activation-runes side-panel, faint trans-cyan magical-light emerging from the golem's chest-cavity, the awakening-moment",
      "MEDIEVAL MARKET SQUARE — bustling town-square with brick-built stalls + vendors in heraldic livery, royal-proclamation tile being read aloud at a central pillar, pickpocket-minifig mid-grab on a noble's coin-purse, guard-minifig mid-turn toward the disturbance, daily-life-with-crime moment",
      "ROYAL HUNT IN FOREST — forest-floor with royal-hunting-party on caparisoned warhorses, lead horseman with bugle-horn raised, hunting-hounds mid-bound after a deer-minifig fleeing into the deep-distance trees, the hunt-mid-chase moment",
    ],
    instructions: `Each entry is ONE fantasy narrative stage, 30-55 words. Format: "STAGE NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines. STRICT BANS: never include camera framing language; never include minifig action verbs ("knight swinging sword" — that's the minifig_action axis); never include isolated magical phenomena ("fire raining down by itself" — that belongs to magical_phenomenon axis); never include lighting descriptors. Stage + tension only. NEVER LEGO Star Wars references. NEVER LEGO Harry Potter references (out of scope for BrickBot fantasy).`,
  },

  brickbot_fantasy_minifig_action: {
    format: 'simple',
    theme: `LEGO MINIFIG ACTION BEATS — verb-led story moments for the BrickBot fantasy path. Each entry is a freeze-frame of minifigs IN MID-ACTION. Each entry 25-45 words.

⚠️ STORY BEAT MANDATE per the playbook. Every entry MUST start with an ACTIVE VERB and describe a moment with CAUSE + EFFECT in the same frame. Fantasy-specific verbs: mid-charge, mid-cast, mid-archery-loose, mid-lance-impact, mid-shield-bash, mid-spell-blast, mid-coronation-bow, mid-banquet-toast, mid-skeleton-rise, mid-rescue-of-prisoner, mid-dragon-strike, mid-leap-from-saddle, mid-fall-from-battlement, mid-dive-into-treasure-pile, mid-ritual-incantation, mid-bow-from-elven-platform, mid-hammer-strike-at-forge.

⚠️ HARD BANS:
  • NEVER "knights standing around"
  • NEVER "wizard posing in tower"
  • NEVER "characters watching / gazing at"
  • NEVER passive states

Body-position variety:
  • Mid-charge / mid-lance / mid-melee (~20%)
  • Mid-cast / mid-spell-blast (~15%)
  • Mid-archery / mid-crossbow-fire (~10%)
  • Mid-mount-leap / mid-fall-from-horse (~10%)
  • Multi-figure interaction (rescue, duel, party-gathering, brawl) (~20%)
  • Mid-discovery / mid-treasure-grab (~10%)
  • Mid-ceremony (coronation / wedding / knighting / vow) (~10%)
  • Mid-skeleton-rise / mid-undead-emergence (~5%)

Each entry:
• Start with an ACTIVE VERB
• Name 1-3 specific minifigs (knight, wizard, ranger, dragon-rider, princess, bard, dwarf, elf, orc, skeleton, etc.) with brief identifier (heraldic surcoat / robed / hooded / armored)
• Describe SHARED OBJECT or EVENT (lance / spell-vortex / treasure-chest / dragon-claw / spell-bolt / portcullis-falling / etc.)
• Imply moment-before and moment-after
• PLASTIC SCALE — minifig anatomy (C-shaped hands / two-stud arms / printed visor)`,
    touchpoints: [
      "Mid-lance-impact between two armored knights on caparisoned warhorses at tournament lists, leading knight's lance shattering trans-clear bar-element splinters spraying outward, opponent rocking back in saddle, the freeze-moment of impact",
      "Mid-cast of a fireball spell by a robed wizard minifig with C-grip on twisted-staff, trans-orange + trans-red flame elements erupting from staff-tip, foreground orc-minifig mid-recoil with raised shield, the moment-of-impact",
      "Mid-archery-loose of an arrow by a Forestmen-green-hood ranger minifig with bow drawn from cover behind a tree-trunk, target orc-minifig on path ahead mid-step, arrow trans-clear bar-element trailing mid-flight",
      "Mid-charge of armored cavalry across a battlefield, lead knight on caparisoned warhorse with banner-bearer beside, lances couched forward, second-rank riders behind with raised swords, the moment-of-impact-on-enemy-line",
      "Mid-leap from rampart of an armored knight onto an attacker's siege-ladder, sword raised overhead in C-grip, attackers below mid-recoil, the dramatic-counter-attack moment",
      "Mid-skeleton-rise from a moonlit graveyard, lead skeleton-minifig with bone-torso and skull-head emerging from broken-tombstone, second skeleton behind clawing up from earth, gravedigger-minifig at frame-edge mid-flee-in-terror",
      "Mid-coronation-bow as the kingly minifig kneels at the altar dais with crown-bearer mid-lift of golden crown overhead, archbishop-minifig in mitre with C-hands held out in blessing, court attendants flanking in heraldic-livery mid-bow",
      "Mid-rescue of a chained prisoner-minifig by a rogue-minifig in hooded cloak working the cell-lock with thieves-tool, prisoner reaching out through bars in C-grip, unconscious guard-minifig slumped at corridor end",
      "Mid-spell-blast collision between two mages mid-duel, robes flying as one mage's trans-purple spell-bolt meets the other's trans-cyan counter-spell with sparks of trans-yellow at the collision-point, both mages mid-recoil",
      "Mid-dragon-strike as colossal brick-built dragon's claw grips a tower turret crumbling brick-fragments mid-fall, defending knight minifig at the window mid-lance-thrust into the dragon's wrist, the iconic knight-vs-dragon moment",
      "Mid-hammer-strike at the dwarven forge by a bearded dwarf-minifig in plate-armor, hammer mid-arc descending toward glowing trans-orange weapon on the anvil, sparks (trans-yellow 1×1 round-plates) bursting at impact",
      "Mid-dive-into-treasure-pile by hooded thief-minifig with arms outstretched onto a hoard of 1×1 gold round-plates and trans-purple jewel-pieces, sleeping dragon's eye opening in the deep-distance behind the pile, the moment-before-discovery",
      "Mid-bow-from-elven-platform as an elven-archer minifig with long-hair-piece releases an arrow from a high treetop platform, target orc-minifig on the forest-floor below mid-fall, second elf at frame-edge mid-nock of another arrow",
      "Mid-banquet-toast in a royal hall, kingly minifig at the head of long-table mid-raise of chalice C-grip, court attendants at the table mid-cheer, bard-minifig with lute mid-strum in the background, festive-feast moment",
      "Mid-ritual-incantation at a Stonehenge-coded stone-circle, druid-minifigs in dark-green-robes with antler-headdress C-grips raised overhead, central altar-stone mid-glow trans-magenta, fey-mist elements drifting from the stones",
      "Mid-charge of orc-horde across a battlefield with brandished weapons, lead orc-minifig with curved-blade overhead mid-roar, surrounding orcs in fur-and-leather attire mid-stride, distant brick-built siege-tower in receding perspective behind",
      "Mid-shield-bash by a paladin-minifig in gold-trim-armor against a hellhound-creature, shield mid-impact against the beast's snout, sword in other C-hand mid-thrust forward, the divine-combat moment",
      "Mid-portcullis-fall as the iron-gate descends from the brick-built castle gatehouse cutting off two attacker-minifigs from the inner courtyard, gate-keeper-minifig at the chain-mechanism mid-pull, the moment-of-cutoff",
      "Mid-leap-from-saddle by a knight-minifig dismounting at full gallop, warhorse continuing past as the knight lands mid-stride sword raised, target enemy-knight in armored opponent mid-react-to-incoming-attack",
      "Mid-coin-throw by a bard-minifig finishing a tavern performance, tossed 1×1 gold round-plates arcing through the air toward an outstretched hat at the foot of the tabletop-stage, drunken patrons mid-applaud around tables",
      "Mid-portal-step by a wizard-minifig stepping through a trans-cyan + trans-violet magical-portal disc, one C-hand still on this side gripping a staff, the other C-hand emerging on the other side reaching forward, half-vanished mid-traversal",
      "Mid-staff-block as a hooded druid-minifig parries an attacking orc's blade with a quarterstaff held cross-grip, second druid behind mid-charge of a healing-spell trans-green hands-glow overhead, defending-the-shrine moment",
      "Mid-throw of a torch by a fleeing peasant-minifig into a haystack-pile to set warning-fire as dragon-shadow looms over the village in deep-distance, trans-orange flames bursting from the strike-point, the village-warning moment",
      "Mid-falling-from-battlement of an arrow-struck attacker-minifig from the top of a brick-built castle wall, body mid-arc downward, trans-clear bar-arrow still protruding from chest-print, defender at the battlement mid-nock of next arrow",
      "Mid-hostage-rescue as a paladin-minifig sweeps a captured-princess-minifig into one C-hand mid-stride away from a collapsing dungeon corridor, pursuing skeleton-minifigs mid-fall behind from the collapse, the dramatic-rescue moment",
      "Mid-troll-uppercut by a giant brick-built cave-troll's massive C-hand sending a knight-minifig mid-air arcing back, knight's shield mid-spin away from grip, distressed companion knight on the ground mid-shout warning",
      "Mid-dragon-mount-takeoff as a dragon-rider minifig in saddled brick-built dragon at the cliff-edge, dragon's wings mid-down-beat trans-orange wing-tip embers, ground falling away in deep-distance, the moment-of-launch",
      "Mid-sword-pull-from-stone by a young squire-minifig with both C-hands on the hilt of a sword embedded in a moss-covered altar-stone, surrounding court mid-gasp as the blade mid-emerge, the King-Arthur-coded moment",
      'Mid-mage-summoning of a winged-creature in the central pentagram of a wizard\'s tower, mage-minifig C-hands held wide in incantation gesture, trans-purple magical-bird emerging from the pentagram center, the calling-the-familiar moment',
      "Mid-toss of a trans-purple magical-orb between two D&D-party-minifigs mid-combat, fighter-minifig in front mid-receive of the orb with both C-hands raised, wizard-minifig behind mid-launch with sleeves-trailing, party-coordination beat",
    ],
    instructions: `Each entry is ONE fantasy minifig action beat, 25-45 words. Format: free-form prose STARTING WITH AN ACTIVE VERB. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO "knights standing", NO "wizard posing", NO "watching / looking at", NO passive states. Story beat + verb + cause/effect always. NEVER Star Wars / Harry Potter references.`,
  },

  brickbot_fantasy_build_technique: {
    format: 'simple',
    theme: `LEGO FANTASY MOC BUILD TECHNIQUE — AFOL-distinguishing brick-construction technique notes for the BrickBot fantasy path. Each entry is ONE specific MOC technique that makes a fantasy diorama read as "Bricklink AFOL champion build" instead of "official LEGO Castle set photo." Each entry 25-45 words.

VARIETY MANDATE — distribute across:
  • SNOT castle-wall curvature (cylindrical-tower curves / arched-gate spans / vaulted-ceiling SNOT)
  • Brick-built dragon construction (articulated wings via Technic / scaled-hull with cheese-slope detailing / poseable neck via ball-joints)
  • Tree-canopy + foliage techniques (Bricklink Forestmen tree / leaf-element saturation / brick-built bark texture)
  • Trans-piece magical effects (trans-purple spell-vortex stacked plates / trans-cyan magic-portal disc / trans-orange dragon-fire cluster)
  • Technic articulation (drawbridge mechanism / portcullis chain / siege-engine arm / dragon-wing fold)
  • Illegal techniques (brick-bending for organic curves / clutch-power-on-tile / 1×2 mod for irregular stone)
  • Microscale tricks (minifig-accessory repurposed as macro-detail: lightsaber-hilt as banner-pole, croissant as decorative-flourish, dragon-wing piece as cathedral-corbel)
  • Printed-tile signature pieces (heraldic banner-tiles / printed map-tile / stained-glass window-tile)
  • Studded-vs-tile texture contrast (studded wood-floor / tiled smooth-stone)
  • Cathedral / arch construction (Gothic vault-bricks / flying-buttress brackets / stained-glass window-tiles)
  • Brick-built creatures (cave-troll / giant-spider / griffin / unicorn / direwolf / goblin-army)
  • Forest-floor texture (moss-element coverage / fallen-log brick-pieces / mushroom-element clusters)
  • Stone-circle / ruin texture (worn-monolith stack-and-shift / collapsed-pillar at angle)

Each entry must:
• Name the technique TYPE in first 5-8 words
• Specify WHICH FANTASY BUILD ELEMENT it applies to (castle wall / dragon body / tree canopy / spell-effect / etc.)
• Specify SPECIFIC BRICK PARTS used (named: 1×2 cheese slope / Technic axle-pin / trans-orange flame element / leaf-element-piece)
• Imply the visual IMPACT`,
    touchpoints: [
      'SNOT-curved castle tower wall — cylindrical castle-tower built with sideways-stud bracket-plates turning 2×4 curved-slope bricks in concentric horizontal rings, mortar-line tile-offset every third ring for masonry-realism, the AFOL Bricklink-MOC cylindrical-tower signature',
      "Brick-built articulated dragon wings — dragon wings constructed from Technic axle-pin spine + clip-and-bar membrane supports, large trans-clear or trans-blue 1×4 wing-panel pieces fanned outward, ball-joint at shoulder allowing pose-variation, AFOL-dragon canon",
      "Bricklink Forestmen tree canopy — giant-oak tree-canopy built from clip-and-bar branches with dense leaf-element-piece coverage in olive-green + dark-green + autumn-orange leaf-clusters, exposed trunk built from brown round-bricks with brick-edge cracks for bark-texture",
      "Trans-purple spell-vortex stack — magical-spell-vortex built from trans-purple + trans-magenta + trans-clear 1×2 + 1×4 plate-strips stacked at progressive angles in spiral pattern, with 1×1 round-plate trans-violet spark-elements drifting at the edges, the AFOL spell-fx signature",
      "Trans-orange dragon-fire cluster — dragon-fire breath built from clustered trans-orange + trans-red + trans-yellow 1×1 flame-elements at dragon-muzzle with progressively-spaced cluster cone trailing outward into the air, trans-clear smoke-shimmer at outer edge",
      "Technic-articulated drawbridge — castle gatehouse drawbridge mounted on Technic axle-pin pivot at the inner-wall hinge, brick-built chain mechanism extending up to a winch-housing built into the gatehouse, allowing real-articulation up-and-down motion",
      'Illegal brick-bending stone — organic-curving stone-wall section built using illegal brick-bending technique (1×2 plates pressure-stacked into a gentle arc) for natural worn-stone irregularity, AFOL-purist illegal MOC pride',
      "Microscale lightsaber banner-pole — repurposed minifig lightsaber-blade pieces (technically Star Wars accessory, used as generic LEGO part here) inserted as flagpoles holding printed heraldic-banner tiles overhead castle ramparts",
      "Studded floor + tiled stone contrast — castle great-hall floor built with exposed-stud studded wooden-plank palette (brown 2×2 plates) for the central hearth-zone and tiled smooth-grey 2×2 tiles for the marble-flagstone walking-zones, visual contrast separating ceremonial vs daily-use",
      "Gothic vault-rib construction — cathedral or grand-hall vaulted ceiling built using SNOT bracket-plates turning curved-slope bricks downward to form intersecting vault-ribs, stained-glass-pattern tile-windows mounted in the upper-clerestory level",
      "Brick-built cave-troll body — colossal cave-troll figure built from large dark-bley + dark-tan slope-bricks for a hunched-bipedal form, Technic ball-joints at shoulders + elbows for poseable arms, single 2×2 round-eye element in trans-yellow on the head",
      "Brick-built giant-spider — giant arachnid built from a central dark-bley dome-body with eight Technic-articulated legs in 1×1 hinge-plates with claw-tip dark-brown 1×1 cones, trans-red 1×1 round-plate eyes clustered at the head",
      "Heraldic banner-tile signature — printed heraldic-banner tile (Crusaders red+white / Forestmen green+brown / Black Knights black / Dragon Knights red-with-dragon / Royal Knights gold+blue) mounted on antenna-pole flagstaff above the castle ramparts, faction-identity anchor",
      "Stained-glass window-tile cathedral — Gothic cathedral interior with floor-to-ceiling stained-glass window built from 1×2 + 1×4 trans-clear + trans-red + trans-yellow + trans-violet + trans-cyan plate-strips arranged in geometric rosette pattern, cool-tinted light streaming inward",
      "Mushroom-element forest-floor cluster — woodland-floor scene built with scattered red-and-white mushroom-element pieces, brown 1×1 round-plates as fallen-leaves, scattered olive-green moss-coverage and 1×1 cone-bricks as pebbles, AFOL forest-detail signature",
      "Brick-built portcullis chain mechanism — castle-gate portcullis built from vertical Technic-rod bars in dark-bley with horizontal supports, two-link chain pieces running from the top of the gate up through the gatehouse to a winch-mechanism, AFOL functional-gate signature",
      "Bricklink-AFOL siege-engine — trebuchet built from Technic-beam frame with a counterweight-arm balanced on a Technic-axle pivot, leather-cup at the end built from clip-and-bar with hide-element pouch, AFOL siege-engine canon",
      'SNOT-curved arched gateway — castle gatehouse arch built with SNOT bracket-plates turning curved-slope bricks at the apex, sandstone-coded tan slope-brick mosaic in the arch-stones, masonry-realism technique',
      "Brick-built unicorn — bone-white pearl-finish unicorn figure built from large white slope-bricks for the body, trans-pearl-white horn element on the head, articulated Technic-joints in the legs, LEGO Elves-coded mount",
      "Stone-circle worn-monolith stack — Stonehenge-style monolith built from stack-and-shifted light-bley + dark-bley slope-bricks for worn-weathered texture, irregular shape achieved by 1×2 jumper-plate offsets, AFOL ruins-canon",
    ],
    instructions: `Each entry is ONE MOC fantasy-build technique, 25-45 words. Format: "TECHNIQUE NAME CAPS — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no real-world construction language (no "3D-print / paint / glue"); LEGO bricks only. Name SPECIFIC part types.`,
  },

  brickbot_fantasy_camera_framing: {
    format: 'simple',
    theme: `FANTASY-SPECIFIC CAMERA FRAMING — LEGO MOC photography angles for the fantasy path. Each entry is ONE camera position + framing rule specific to medieval-fantasy diorama subject matter. Each entry 15-30 words.

VARIETY MANDATE — distribute across:
  • Battlement-down (looking down from castle wall at attackers below)
  • Throne-room-establishing (down the central aisle toward the throne)
  • Dragon-POV (looking from dragon's eye toward defending knights)
  • Forest-glade-through-trees (camera among tree-trunks looking into clearing)
  • Cliff-castle-aerial (high-angle overlooking castle complex)
  • Under-archway-discovery (camera at gateway looking inward at scene)
  • Portcullis-low (camera ground-level looking up at gate / drawbridge)
  • Chapel-altar-down-aisle (cathedral aisle toward altar with stained-glass behind)
  • Dragon-lair-vertigo (camera looking down into vast cavern from height)
  • Jousting-lists-broadside (camera between two charging knights at impact-point)
  • Forest-canopy-down (camera looking down from treetop city to forest floor)
  • Mountain-pass-narrows (camera in narrow pass looking outward at framed party)
  • Crypt-passage-receding (camera in crypt corridor looking down receding passage)
  • Tavern-corner-establishing (camera in tavern corner looking across the room)
  • Stone-circle-aerial (overhead aerial at the ring of stones from above)
  • Witch-hut-low-skewed (camera tilted to match chicken-legs-leaning hut)

Each entry must:
• Specify camera POSITION (height / location / orientation)
• Specify the framing's PURPOSE — what story-element this angle DRAMATIZES
• Reference fantasy-specific scenery elements (battlement / throne / dragon / archway / forest-canopy / etc.)`,
    touchpoints: [
      'BATTLEMENT-DOWN OVERLOOK — camera at the top of a castle wall looking straight down at attackers swarming the base, attackers in receding perspective, defenders mid-action at the parapet rim foreground, the wall-dominates-attackers viewpoint',
      "THRONE-ROOM ESTABLISHING DOWN-AISLE — camera at the far end of the throne-hall looking down the central aisle toward the throne at the deep-distance, court attendants flanking in heraldic-livery, throne-bearer mid-action at the dais",
      "DRAGON'S-EYE POV — camera positioned at the dragon's head-level looking outward at defending knights, knight-minifigs small in mid-distance with raised weapons, the predator-perspective viewpoint",
      "FOREST-GLADE THROUGH-TREES — camera positioned among foreground tree-trunks looking into a sun-dappled forest-glade where a druid encounter or party-camp is centered, trunk-frames the action on left and right",
      "CLIFF-CASTLE AERIAL ESTABLISHING — high-angle aerial looking down at a castle complex perched on cliff-edge, the castle-walls and courtyard visible from above, ocean or valley dropping away in deep-distance",
      "UNDER-ARCHWAY DISCOVERY — camera positioned at a gateway-arch looking inward at a courtyard or great-hall scene, the arch frames the interior like a vignette, depth into the courtyard receding",
      "PORTCULLIS-LOW UP-GATE — camera at ground-level just outside the castle gate looking up at the iron portcullis and gatehouse arch overhead, the gate dominating the upper-frame, looming-castle viewpoint",
      "CHAPEL-ALTAR DOWN-AISLE — cathedral interior with camera at the back of the nave looking down the long aisle toward the altar, stained-glass-window panels casting cool-tinted light, ceremony in foreground silhouettes",
      "DRAGON-LAIR VERTIGO DOWN-INTO-CAVERN — camera at a high cavern-ledge looking down into a vast underground lair below, sleeping dragon and treasure-hoard visible at the cavern-floor center, vertigo-inducing scale",
      "JOUSTING-LISTS BROADSIDE — camera in the open space between two charging knights at the moment-before-impact, both knights visible in profile silhouette left and right with lances couched, tournament-tilt-rail in deep-distance",
      "FOREST-CANOPY DOWN-TO-FLOOR — camera at a high treetop platform looking straight down through the canopy to the forest-floor below, scattered figures and shrine-stone visible far below through the leaf-element gaps",
      "MOUNTAIN-PASS NARROWS — camera in a narrow rocky pass between two steep cliff-walls looking outward, the pass framing a small party of travelers in the mid-distance approaching, claustrophobic-pass viewpoint",
      "CRYPT-PASSAGE RECEDING — camera at the entrance of a torch-lit crypt corridor looking down its receding length, sarcophagi flanking the corridor at intervals, action at the far end in deep-distance",
      "TAVERN-CORNER ESTABLISHING — camera positioned in one corner of a tavern looking diagonally across the room, foreground table with patrons, central bard-performance space, far-corner shadowy hooded-stranger",
      "STONE-CIRCLE AERIAL OVERHEAD — high overhead aerial looking straight down at a ring of standing stones on a moonlit moor, druid-circle inside the ring, the ring-pattern visible from above, ritual-overhead viewpoint",
      "WITCH-HUT LOW-SKEWED DUTCH-TILT — camera tilted to match the chicken-legs lean of a Baba-Yaga witch-hut, the canted-hut silhouette dominates the upper-frame, swamp-foreground at low-camera, off-kilter unsettled feel",
      "GREAT-HALL FEAST-LONG-TABLE — camera at one end of a long banquet-table looking down its length, kingly-minifig at the far-end head-of-table, court attendants flanking the table in heraldic-livery, the feast-extending viewpoint",
      "DUNGEON-CELL FROM-INSIDE — camera positioned inside a cell looking out through iron-bars at the corridor, rescuing rogue-minifig at the cell-door with prisoner-minifig in foreground silhouette",
      "WIZARD-TOWER-STAIRWELL SPIRAL-UP — camera at the bottom of a spiraling-stairwell looking up the inside of a wizard's tower, stairs spiraling up through multiple levels, the height-of-the-tower viewpoint",
      "MOUNTED-CAVALRY-CHARGE LOW-FRONTAL — camera ground-level in the path of a charging cavalry unit, lead horseman with lance couched bearing down on camera, second-rank riders behind in receding perspective, the impact-imminent viewpoint",
      "DWARVEN-FORGE-HALL CENTRAL-FIRE-PIT — camera at the great forge-fire center of a dwarven hall looking outward at the surrounding columns and anvil-stations, dwarven-minifigs at multiple anvils, the heart-of-the-hall viewpoint",
      "BRIDGE-DEFENSE LOW-ANGLE — camera at one end of a narrow bridge looking down its length toward defenders holding the far-end against a horde of attackers approaching, the choke-point viewpoint",
      "REFUGEE-COLUMN OVERHEAD-FROM-RIDGE — camera on a high ridge looking down at a refugee-column on the road below, wagons + livestock + peasants visible in receding perspective, the dragon-shadow looming on the horizon viewpoint",
      "ELVEN-TREETOP-PLATFORM EDGE — camera at the edge of an elven treetop platform looking outward over the forest canopy, elven-archer minifig in foreground looking out into deep-distance forest below, the sentinel viewpoint",
      "NECROMANCER-PENTAGRAM OVERHEAD-DOWN — camera directly overhead a trans-purple pentagram-floor with skeletons rising from the pattern, necromancer-minifig at the pentagram center, the ritual-overhead viewpoint",
    ],
    instructions: `Each entry is ONE fantasy-specific camera framing, 15-30 words. Format: "FRAMING NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no generic camera terms without fantasy-specific anchoring — every entry must reference fantasy scenery (battlement / throne / dragon / archway / canopy / portcullis / etc.).`,
  },

  brickbot_fantasy_subject_focus: {
    format: 'simple',
    theme: `FANTASY SUBJECT-FOCUS — silhouette anchor for the fantasy path. Each entry is ONE specific subject category: MOUNT (with rider) OR STRUCTURE (castle/tower/lair) OR NO-VEHICLE INTERIOR (throne-room/tavern/dungeon) OR NO-VEHICLE LANDSCAPE (forest/mountain/wasteland). Each entry 12-30 words.

⚠️ STORY-TENSION MANDATE — every entry MUST embed action-tension in the bracketed phrase or body (mid-charge / mid-discovery / mid-confrontation / mid-arrival / mid-coronation etc.). No bare scene-establishing.

VARIETY MANDATE — distribute as:
  • ~30% MOUNTS — warhorse + rider / dragon-rider on dragon / griffin-rider / unicorn / pegasus / wolf-rider (Forestmen) / direwolf-mount / war-elephant / mammoth / hippogriff
  • ~25% STRUCTURES — castle keep / wizard-tower / dragon-lair / cathedral / dwarven-hold / elven-treetop-city / coastal-fortress / Helm's-Deep-coded fortress / Minas-Tirith-coded white-city / Mordor-coded Barad-dûr tower / witch's hut
  • ~25% NO-VEHICLE INTERIORS — throne-room / tavern / wizard-library / dungeon / cathedral nave / dwarven-forge-hall / treasury / crypt / chapel / royal-court
  • ~20% NO-VEHICLE LANDSCAPES — forest-glade / mountain-pass / cursed-marsh / snowy-northern-realm / volcanic-wastes / Stonehenge-circle / coastal-cliff / desert-mesa

Each entry must:
• Begin with either "mount (...)" / "structure (...)" / "no-vehicle interior (...)" / "no-vehicle landscape (...)"
• Embed action-tension descriptor in the bracketed phrase
• Specify what fills the foreground / midground / deep-distance`,
    touchpoints: [
      'mount (warhorse mid-cavalry-charge) — caparisoned brick-built warhorse with armored knight-minifig in saddle, lance couched mid-charge across battlefield, banner-bearer warhorse pacing alongside, distant siege-fortress in deep-distance',
      'mount (dragon-rider mid-takeoff) — dragon-rider minifig in saddle on a colossal brick-built articulated-wing dragon at the cliff-edge, dragon-wings mid-down-beat trans-orange wing-embers, ground falling away in deep-distance',
      'mount (griffin-rider mid-dive) — griffin (fused eagle-front + lion-back brick-built) with elven-archer minifig in saddle mid-dive over a deep-valley, target far below in mid-distance, the bird-of-prey-mid-attack moment',
      'mount (wolf-rider mid-ambush) — Forestmen wolf-rider (green-hood ranger minifig on direwolf-mount) mid-leap from forest-undergrowth onto a road-traveler, second wolf-rider mid-charge behind, the ambush-springs moment',
      'mount (unicorn mid-wood-encounter) — LEGO Elves-coded bone-white unicorn with elven-rider minifig in pastel-robes pausing at a forest-shrine, faerie-creatures clustered at the unicorn-hooves, the welcome-the-questgivers moment',
      'mount (war-elephant mid-siege-arrival) — armored war-elephant (Indian-elephant-coded with howdah-tower on back) mid-stride toward enemy lines, elephant-driver minifig at the neck, archer-minifigs in the howdah-tower mid-fire, the siege-machine arrival',
      'mount (mammoth mid-northern-realm-charge) — fur-clad mammoth (Skyrim/LotR-coded) with northern-warrior-minifig in saddle mid-charge across snowy expanse, trampling snow-particle white-round-plates, the Frostmaul-coded arrival',
      'mount (skeleton-warhorse mid-undead-ride) — skeleton-warhorse (white-bone construction) with skeleton-knight-minifig in tattered cloak mid-gallop across a moonlit moor, second skeleton-rider behind, the unholy-procession moment',
      'mount (hippogriff mid-rescue) — hippogriff (eagle-front + horse-back brick-built) with ranger-minifig in saddle mid-swoop to grab a falling traveler-minifig from a cliff-edge mid-air, dramatic rescue moment',
      "structure (castle keep mid-siege) — multi-tier brick-built stone castle keep dominating 60% of frame, defenders in heraldic-tabard at battlements, trebuchet-bombardment trans-orange impact erupting from one section, mid-engagement",
      "structure (wizard-tower mid-thunderstorm) — tall narrow brick-built wizard's tower dominating frame, conical roof + crow-step gables + crystal-orb finial, lightning trans-white striking the tower-top, lone wizard at the highest window casting back, dramatic-night",
      "structure (dragon-lair mid-discovery) — vast underground cavern lair with massive brick-built dragon coiled on a hoard of gold-piles dominating frame, lone hooded-thief minifig approaching from foreground, the moment-before-the-dragon-wakes",
      "structure (cathedral mid-coronation) — vaulted Gothic cathedral exterior with stained-glass windows dominating frame, sun-shafts streaming through, royal-procession arriving at the great doors, banner-bearers and trumpeters mid-arrival, the coronation-day moment",
      "structure (dwarven-hold mid-feast) — colossal brick-built dwarven-hold facade carved into a mountain-face dominating frame, great-doors thrown open with trans-orange forge-glow spilling outward, dwarven-minifigs at the gates mid-welcome, Erebor-coded heritage",
      "structure (elven-treetop-city mid-festival) — interconnected elven treetop city across three giant oaks dominating frame, leaf-canopy + rope-bridges + lantern-lit pavilions, elven-minifigs gathered on platforms mid-festival, Rivendell-coded sanctuary mid-celebration",
      "structure (coastal-fortress mid-beacon-light) — coastal cliff-fortress dominating frame with crashing trans-blue wave-elements against rocks below, trans-orange beacon-fire at watchtower peak mid-burn, warning-signal mid-relay",
      "structure (witch's hut mid-cauldron-brew) — Baba-Yaga witch's hut on giant brick-built chicken-legs dominating frame in a poisoned-purple marsh, skull-fence perimeter, witch-minifig at doorway mid-stir of bubbling trans-green cauldron",
      "structure (Mordor-Barad-dûr mid-rise) — colossal black volcanic-stone tower dominating frame with trans-red eye-of-Sauron at the summit, dark mountain ridge framing left and right, the LotR-Mordor mid-tower-active moment",
      'no-vehicle interior (throne-room mid-coronation) — vaulted throne-hall interior with central throne on raised dais, court attendants flanking the aisle in heraldic-livery, archbishop-minifig in mitre mid-lifting of golden crown, the coronation-moment',
      'no-vehicle interior (tavern mid-bardic-performance) — medieval tavern interior with timber-beam ceiling + brick-fireplace, central bard-minifig with lute on tabletop performing for crowd, drunken patrons at scattered tables, lively-night-mid-song moment',
      'no-vehicle interior (dungeon mid-rescue) — torch-lit stone-dungeon corridor with iron-bar cells flanking the path, prisoner-minifig inside one cell reaching out, rogue-minifig at the cell-door working the lock, unconscious guard slumped at corridor end, mid-escape',
      'no-vehicle interior (wizard-library mid-discovery) — wizard tower library with floor-to-ceiling brick-built bookshelves, wizard-minifig at a central lectern with grimoire open, trans-purple magical-residue elements drifting, the moment-of-arcane-revelation',
      'no-vehicle interior (dwarven-forge-hall mid-hammer-strike) — massive underground dwarven forge-hall with central anvil-stations + trans-orange flame elements, lead dwarf-minifig mid-hammer-strike on glowing weapon, sparks bursting outward, working-forge mid-strike',
      'no-vehicle interior (royal-treasury mid-thievery) — torch-lit treasury vault filled with stacks of 1×1 gold round-plates + trans-purple/trans-red jewel-pieces, hooded thief-minifig mid-treasure-grab, alarm-trigger trans-yellow lights mid-flash, the heist-mid-discovery',
      "no-vehicle interior (crypt mid-skeleton-rise) — stone crypt with sarcophagus-tiles around the perimeter, central altar with glowing trans-purple artifact, skeleton-warriors mid-rise from sarcophagi, hooded thief-minifig at the altar mid-recoil, the trap-springs moment",
      'no-vehicle landscape (forest-glade mid-druid-encounter) — sun-dappled forest-glade between giant oaks with moss-covered shrine-stone at center, druid-minifig in dark-green-robes at the shrine, deer-minifig approaching, sacred-nature moment',
      'no-vehicle landscape (mountain-pass mid-goblin-ambush) — narrow rocky pass between steep cliff-walls in light-bley slope-bricks, traveler-minifigs caught mid-stride as goblin-minifig ambushers emerge from boulder-cover, mid-discovery moment',
      'no-vehicle landscape (cursed-marsh mid-witch-cackle) — poisoned-purple marsh baseplate with bone-fence-posts dotting the foreground, witch-minifig with broom mid-cackle at the foreground, trans-green will-o-the-wisp elements drifting, swamp-bog moment',
      'no-vehicle landscape (snowy-northern-realm mid-Viking-return) — snow-covered hills with brick-built standing stones on the ridge, Viking-coded warrior-minifigs in fur-cloaks mid-stride along the road toward a distant mead-hall, the jarl-returning-from-raid moment',
      'no-vehicle landscape (volcanic-wastes mid-uruk-march) — Mordor-coded volcanic landscape with black + dark-red basalt formations and trans-orange lava-rivers, uruk-hai-minifig column marching toward camera in receding perspective, distant Barad-dûr tower silhouette, LotR-Mordor heritage',
      'no-vehicle landscape (Stonehenge-circle mid-ritual) — ring of vertical light-bley stone-monoliths on a moonlit moor baseplate, druid-coded minifigs in dark-green-robes gathered around a central altar-stone, trans-magenta magical-light at the altar-center, ritual-mid-incantation',
    ],
    instructions: `Each entry is ONE fantasy subject-focus anchor, 12-30 words. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. WEIGHTED OUTPUT: ~30% mounts / ~25% structures / ~25% no-vehicle interiors / ~20% no-vehicle landscapes. STRICT BANS: never mix subject-types within an entry; never include camera-framing language; always embed action-tension. NEVER LEGO Star Wars / Harry Potter references.`,
  },

  brickbot_fantasy_register: {
    format: 'simple',
    theme: `FANTASY REGISTER — high-fantasy archetype lock for each render. Each entry is ONE high-fantasy faction/aesthetic described by VISUAL SIGNATURE (colors / emblems / attire / weapons), NOT by movie/book/video-game/LEGO-set name. Each entry 20-40 words.

⚠️ HIGH-FANTASY STORYTELLING ARCHETYPES — described by VISUAL SIGNATURE, NEVER by movie/book/video-game/LEGO-set name. Distribute across iconic high-fantasy factions/aesthetics:

  • ~12% RED-CROSS WHITE-TABARD knights — chivalric crusader-style order with white surcoats over chain mail, red-cross emblem on chest and shields, gold-trim helmets, lance + sword cavalry
  • ~12% GREEN-HOOD FOREST OUTLAWS — Robin-Hood-coded archers with green hooded cloaks, brown leather tunics, longbow + quiver, oak-leaf or bow-and-arrow heraldry, fugitive-rebel feel
  • ~10% BLACK-ARMOR KNIGHTS WITH FALCON SHIELDS — antagonist knights in black plate-armor, dark-grey tabards, black + grey + dim-iron palette, falcon or skull-and-crossbones heraldry, mercenary-coded
  • ~10% GOLD-TRIM PURPLE-VELVET ROYAL KNIGHTS — high-chivalric king's knights in royal-purple velvet surcoats with gold-braid trim, gold-eagle or crown heraldry, ceremonial bearings, palace-guard feel
  • ~10% RED-AND-GOLD DRAGON-AFFILIATED KNIGHTS — knights of a dragon-house in red surcoats with gold dragon-emblem heraldry, dragon-themed shield prints, dragon-crest helmet ornaments, fire-aspect order
  • ~8% BLUE-AND-GOLD LION-EMBLEM KNIGHTS — royal-blue tabard knights with gold lion-rampant heraldry, gold-trim plate-armor, justice-order feel
  • ~8% DARK-RED + BLACK DRAGON-ARMY — antagonist knights in dark-red + black with dragon-banner heraldry, bronze trim, raiding-faction feel
  • ~6% SKELETON UNDEAD ARMY — skeleton-torso minifig variants in tattered cloaks, red-and-black palette, undead-warhorses, grim/macabre necromantic faction
  • ~6% LONG-HAIR ELVEN ARCHERS of a forest realm — long-hair-piece elven minifigs in silver-and-leaf-cream attire, longbow + curved-blade, treetop city or forest sanctuary, ethereal feel
  • ~6% BRIGHT-PASTEL FAERIE-COURT elves — sky-blue + sea-blue + peach-pink + fire-red + earth-green long-hair minifigs in pastel robes, faerie-creatures + unicorns + dragon-friends, whimsical feel
  • ~5% BEARDED DWARVEN SMITHS of a mountain hold — bearded-head minifigs in plate-armor with bronze-and-steel + mithril-blue palette, hammer + battleaxe weapons, forge-hall + mountain-hold heritage
  • ~5% ADVENTURER PARTY — four-figure ensemble of fighter (plate-armor + sword) + rogue (hooded-cloak + daggers) + wizard (robed + twisted staff) + cleric (mace + holy-symbol), questing-coded
  • ~5% ROBED WIZARDS' CIRCLE — robed-figure minifigs with pointed-hats + twisted-staffs + crystal-orbs, wizard-tower or arcane-academy, purple + black + gold-trim
  • ~5% FROZEN-NORTH WARRIOR clan — fur-cloaked Viking-coded warriors in northern realm, horned-or-antlered helmets, axe + round-shield, snowy mead-hall heritage
  • ~3% CURSED-MARSH WITCH coven — dark-cloaked witch-minifigs with broomsticks + cauldrons + cursed-amulets, poisoned-marsh feel, sickly-green + bone-white + dark-purple palette
  • ~3% CUSTOM AFOL FANTASY MOC — original Bricklink-AFOL-community custom fantasy register with creative-liberty heraldry/colors

STRICT BAN — NEVER include any of these in entries: specific movie/book/TV/video-game titles or character names (LotR / Hobbit / Tolkien / Smaug / Mordor / Helm's Deep / Rivendell / Witcher / Skyrim / Elder Scrolls / Game of Thrones / Harry Potter / Hogwarts / Warhammer / Frazetta / Vallejo / Brom / Star Wars / Dungeons & Dragons / specific D&D names like Forgotten Realms / Faerûn / Eberron); specific LEGO faction NAMES (Crusaders / Forestmen / Black Knights / Royal Knights / Dragon Knights / Lion Kingdom / Dragon Kingdom / Skeleton King / LEGO Elves); specific LEGO set numbers. Describe by VISUAL SIGNATURE only.

Each entry must:
• Name the register in first 4-8 words
• Specify CHARACTER ATTIRE (faction colors / heraldic symbol / armor-type / hairstyle)
• Specify BUILD MOTIFS (signature elements / faction-banner / weapons-type)
• Specify any cross-axis restrictions (when register fires, subject_focus / palette auto-aligns)`,
    touchpoints: [
      "RED-CROSS WHITE-TABARD CHIVALRIC ORDER — knights in white surcoats over chain-mail with bold red-cross emblem on chest and round shields, gold-trim helmets with nasal-guard, lance + cross-hilt sword, lion-or-eagle pommel accents, the heroic crusading order",
      "GREEN-HOOD FOREST OUTLAWS — Robin-Hood-coded archers in deep-green hooded cloaks and dim-olive tunics with brown-leather belts and quivers, longbow + arrow accessories, oak-leaf or bow-and-arrow heraldry, fugitive-rebel-of-the-greenwood feel",
      "BLACK-ARMOR FALCON-SHIELD KNIGHTS — antagonist knights in obsidian-black plate-armor and dark-grey tabards, falcon emblem on shields, helmet visors down, mace and longsword weapons, mercenary-coded grim-house",
      "GOLD-TRIM PURPLE-VELVET ROYAL CHIVALRY — high-ceremonial king's-knights in royal-purple velvet surcoats over gold-trim plate-armor, gold-eagle or crown heraldry shields, palace-guard ceremonial spears, the royal-throne-defenders",
      "RED-AND-GOLD DRAGON HOUSE KNIGHTS — order of knights affiliated with a fire-aspect dragon-house, red surcoats with gold dragon-emblem heraldry, dragon-crest helmet ornaments, dragon-themed shield prints, fire-aspect order feel",
      "BLUE-AND-GOLD LION-EMBLEM CHIVALRY — royal-blue tabard knights with gold lion-rampant heraldry, gold-trim plate-armor + matching ceremonial banner-poles, lion-pommel sword and lion-mantle cape, justice-order feel",
      "DARK-RED BLACK DRAGON-BANNER RAIDERS — antagonist knights in dark-red + obsidian-black tabards with dragon-banner heraldry, bronze-trim plate, mounted-on-warhorses, raiding-faction feel",
      "SKELETON UNDEAD WARRIOR ARMY — skeleton-torso minifig variants in tattered black-and-red capes, bone-white-and-grey palette, hollow-eye-socket helmets, two-handed swords + rusted shields, skeleton-warhorse mounts, necromantic faction",
      "SILVER-AND-LEAF FOREST ELVEN ARCHERS — long-hair-piece elven minifigs in silver-and-leaf-cream attire with curved-blade and longbow accessories, intricate-leaf-pattern tile heraldry, ethereal forest-realm feel, treetop-city or sanctuary-grove",
      "BRIGHT-PASTEL FAERIE-COURT ELVES — sky-blue + sea-blue + peach-pink + fire-red long-hair minifigs in pastel robes with curved-saber + crystal-staff accessories, faerie-creatures + unicorns + dragon-friends companions, whimsical feel",
      "BEARDED DWARVEN MOUNTAIN-HOLD SMITHS — bearded-head dwarf minifigs in plate-armor with bronze-and-steel + mithril-blue palette, hammer + battleaxe + crossbow weapons, anvil + forge accessories, mountain-hold heritage",
      "FIGHTER-ROGUE-WIZARD-CLERIC ADVENTURER PARTY — four-figure ensemble: plate-armored fighter with longsword + kite-shield / hooded rogue with daggers + lockpicks / robed wizard with twisted staff + spell-effect / cleric with mace + holy-symbol, questing-quartet",
      "ROBED WIZARD'S COUNCIL — robed wizards in purple + midnight-blue + gold-trim ceremonial robes with twisted-staffs + crystal-orbs + spellbooks, pointed-hat or cowled-hood variants, council-of-mages convened",
      "FROZEN-NORTH BARBARIAN CLAN — fur-cloaked Viking-coded warriors in northern realm, horned-or-antlered helmets, two-handed-axe + round-shield-with-runic-emblem, ice-blue + grey-wool + iron-trim palette, mead-hall warriors",
      "CURSED-MARSH WITCH COVEN — dark-cloaked witch minifigs with broomsticks + cauldrons + skull-staffs + cursed-amulets, sickly-green + bone-white + dark-purple palette, poisoned-marsh-with-hut-on-chicken-legs feel",
      "ORC RAIDER HORDE — green-skin orc minifig variants in fur-and-leather tattered attire, jagged curved-blade weapons + bone-shields, scarred-face print, raider-band feel, cursed-banner of skull-on-stake",
      "GOBLIN AMBUSH BAND — small green-skin goblin minifigs in patchwork armor, curved-daggers and crude crossbows, sneaky-ambusher feel, cave-or-pass-dweller register",
      "SILVER-PEARL ELVEN HIGH KING'S COURT — ceremonial silver-pearl + cool-blue + intricate-pattern attire for high-elven minifig court, curved-saber royal-elven blade, ornamental high-king regalia",
      "WHITE-STONE CITY SILVER KNIGHTS — knights of a white-stone realm in silver-armor and white-stone tabards with sun-and-star or white-tree silver heraldry, ceremonial-defender feel",
      "CURSED-TOWER NECROMANCER — solo necromancer-minifig in dark robes with skull-staff and bone-jewelry, dark-purple + abyss-black palette, summoning-pentagram surrounding, dark-arts-coded",
      "PALADIN HOLY ORDER — gold-trim plate-armored paladin minifigs with sun-emblem heraldry and shining-sword + warhammer, divine-light + holy-symbol motif, righteous-crusader feel",
      "SWAMP-FOLK FROG-PEOPLE — green-skin frog-or-lizard-people minifig variants in algae-and-moss attire with bone-spears and shell-shields, marsh-dweller feel, mysterious-marsh-realm register",
      "DARK-WOODS BANDITS — dim-cloaked highway-bandits in dark-grey + black + faded-red attire with short-swords and crossbows, wolf-pack heraldry, lurking-roadside feel",
      "DESERT-SULTAN NOBILITY — desert-realm minifigs in flowing robes and turbans with curved scimitars + jeweled-trim, sand-tone + gold + jewel-blue palette, oasis-and-mosque architectural register",
      "CUSTOM AFOL FANTASY HERALDRY — Bricklink AFOL community original custom-faction heraldry with creative-liberty colors and emblems, not from any specific known register, AFOL competition-build feel",
    ],
    instructions: `Each entry is ONE high-fantasy register lock described by VISUAL SIGNATURE, 20-40 words. Format: "REGISTER NAME CAPS — attire + motif + restrictions". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NEVER include movie/book/TV/video-game titles or character names (Tolkien / LotR / Hobbit / Smaug / Mordor / Helm's Deep / Rivendell / Witcher / Skyrim / Elder Scrolls / Game of Thrones / Harry Potter / Hogwarts / Warhammer / Frazetta / Vallejo / Brom / Game of Thrones / specific D&D campaign names like Forgotten Realms); NEVER specific LEGO faction NAMES (Crusaders / Forestmen / Black Knights / Royal Knights / Dragon Knights / Lion Kingdom / Dragon Kingdom / Skeleton King / LEGO Elves); NEVER LEGO set numbers; NEVER LEGO Star Wars. Describe by VISUAL SIGNATURE only (color + emblem + attire + weapon-type + heraldry).`,
  },

  brickbot_fantasy_scene_props: {
    format: 'simple',
    theme: `FANTASY DIORAMA STORYTELLING PROPS — small brick-built details that fill the corners of a fantasy scene. Each entry is ONE specific prop with a story implied. Each entry 12-30 words.

⚠️ Picked TWO PER RENDER (pickN:2), so each entry must be SMALL.

VARIETY MANDATE — distribute across:
  • HERALDIC (banner / heraldic-shield / falcon-perch / battle-standard / herald-trumpet)
  • TREASURE (chest of gold / jeweled-goblet / crown-on-stand / artifact-on-pedestal / map-tile)
  • WEAPONS-LITTER (dropped sword / arrow-quiver / spear-rack / shield-stack / crossbow-on-rack)
  • MAGIC (wizard-staff / spell-book / crystal-orb / potion-bottle / pentagram-tile / scroll-rolled)
  • CHURCH / RELIGIOUS (altar-cross / chalice / candle-stand / prayer-book / icon-tile)
  • DRAGON / CREATURE (dragon-egg / skull-on-pike / dragon-scale-pile / claw-trophy)
  • PEASANT / LIFE (loaf-of-bread / cabbage / barrel-of-ale / hay-bale / sack-of-grain / wheel-and-axle)
  • TAVERN / FEAST (tankard / chalice / roasted-bird / bread-basket / lute / dice-on-table)
  • LIVING COMPANIONS (raven on shoulder / cat by hearth / dog asleep / falcon on perch / monkey)
  • PERSONAL (dagger-in-belt / signet-ring / locket / mission-scroll / family-crest)
  • SKELETON / UNDEAD (bone-pile / skull / chained-skeleton / cursed-amulet)
  • WIZARD-LIBRARY (open-grimoire / quill + ink / candle / star-chart / hourglass)
  • SIEGE EQUIPMENT (cannonball-stack / catapult-stone / siege-ladder / battering-ram)

Each entry must:
• Name the prop type in first 3-6 words
• Specify SPECIFIC LEGO BRICK PARTS or accessories where applicable
• Imply STORYTELLING CONTEXT`,
    touchpoints: [
      "Heraldic banner-tile on staff — printed flag-element (Crusader red-cross / Lion-Kingdom gold-lion / Dragon-Kingdom red-dragon / Black-Falcons falcon) mounted on antenna-staff piece overhead castle ramparts, faction-identity anchor",
      "Treasure chest open with gold spill — 2×3 brown chest-element open on stone-floor with 1×1 gold round-plates spilling onto the floor and trans-purple + trans-red jewel-elements scattered, the recent-plunder-evidence",
      "Wizard staff leaning on wall — minifig wizard-staff accessory with twisted-grip leaning against a brick-built bookshelf, blue crystal-orb tile-element at the staff-tip, the wizard's-quarters detail",
      "Dragon egg on pedestal — 1×1 trans-orange round-stud dragon-egg balanced on a brass round-plate cradle pedestal, faint trans-red glow-emission implied, the lair-newborn evidence",
      "Spell-book open on lectern — printed grimoire-tile open on a brick-built wood-lectern with minifig-quill accessory beside, 1×1 trans-purple jewel-element marking a critical page, the arcane-research detail",
      "Crystal-orb on stand — 1×1 trans-clear round-stud crystal-orb on a gold-trim cradle pedestal, faint trans-cyan magical-light emerging from the orb, the wizard's-scrying-tool detail",
      "Crown on velvet stand — minifig gold crown-piece on a brick-built dark-red velvet-tile cushion, the royal-regalia ceremonial detail",
      "Dropped sword in foreground — minifig sword-piece lying on the deck-tile flat, blade pointed away from a fallen knight-minifig at frame-edge, suggesting a recent combat",
      "Loaded crossbow on barrel — minifig crossbow-piece propped on a brown barrel-element, cocked and ready, set down between shots in a duel-pause",
      "Tankard of ale on table — 1×1 trans-amber round-stud filled tankard-element on a brick-built tavern-tabletop, ale-foam-tile detail at the top, the abandoned-mid-drink moment",
      "Loaf of bread + cabbage on table — brown 1×2 loaf-tile and green 1×1 round-cabbage-element on a tavern-table, the peasant-meal detail",
      "Roasted bird on platter — brown 1×2 brick-bird-element on a 2×3 gold-trim platter-tile, the festive-feast centerpiece detail",
      "Lute leaning on tavern-stool — minifig lute-accessory leaning against a brick-built tavern-stool, the bard's-pause-between-songs detail",
      "Dice + coin pile on table — 1×1 round-plates (1 white as dice, 3 gold as coins) on a tavern-tabletop, the game-of-chance detail",
      "Raven on the throne-back — minifig black-raven-piece perched on the carved-stone back of a throne with one black-claw gripping, the dark-omen detail",
      "Falcon on the gauntlet-perch — minifig brown-falcon-piece perched on a brick-built brass-trim falconry-perch, the noble-hunter's prized-bird detail",
      "Cat by the hearth — minifig orange-tabby cat-accessory curled on a brick-built fireplace-hearth-stone, the cozy-tavern-life detail",
      "Loyal-dog at master's feet — minifig brown-dog-piece asleep at the foot of a minifig's throne or hearth, the loyalty-of-the-pack detail",
      "Open grimoire on table — printed spell-book tile open on a brick-built study-table with a 1×1 jewel-element bookmark, trans-purple residue at the page-margin, the active-research detail",
      "Quill + inkpot on parchment — minifig quill-accessory standing in a 1×1 black-round-tile inkpot beside a printed-parchment-tile, the scriptorium-scribe detail",
      "Candle on holder — minifig brass candle-stand piece with 1×1 trans-yellow round-tile flame at the top, the moody-interior detail",
      "Skull on pike — minifig white-skull piece mounted on a black antenna-pole staked into the ground, the grim-warning trophy",
      "Cursed-amulet on chain — 1×1 trans-purple round-stud amulet hanging from a minifig-chain piece, the dark-artifact detail",
      "Bone pile in corner — scattered minifig-bone pieces (femurs / skull / ribs) clustered in a dungeon-corner, the macabre detail",
      "Chained skeleton at wall — skeleton-minifig with chain-link pieces locking wrists to a dungeon-wall, the long-imprisoned warning",
      "Cannonball stack at siege — pile of brown 1×1 round-plate cannonballs stacked pyramid-form beside a siege-weapon, the artillery-supply detail",
      "Siege-ladder propped — wooden brick-built siege-ladder propped against a castle-wall, the assault-equipment detail",
      "Hourglass on study-table — brick-built hourglass with sand-detail in clear-yellow 1×1 round-plates running through, the time-pressure detail",
      "Star-chart on wall — printed celestial-map tile mounted on a brick-built wood-frame, the astrologer's-tool detail",
      "Brick-built parrot on pirate's shoulder — minifig parrot in red-blue-yellow on a minifig shoulder-stud (used in fantasy contexts too — bard's-companion or wizard's-familiar)",
    ],
    instructions: `Each entry is ONE fantasy diorama prop, 12-30 words. Format: "PROP NAME — brick-parts + story-context". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO real-world materials without naming brick parts; NO centerpiece-sized props; small storytelling-detail props only.`,
  },

  brickbot_fantasy_lighting: {
    format: 'simple',
    theme: `LEGO MOC FANTASY LIGHTING — axis-clean light SOURCE + DIRECTION + COLOR-QUALITY entries for the fantasy path. Each entry is ONE specific lighting setup. Each entry 15-30 words.

⚠️ AXIS-CLEAN MANDATE. Lighting owns ONE lane: light source + direction + color.

⚠️ HARD BANS:
  • NO magical phenomena (spell-vortex / portal / blizzard-conjured — those belong to magical_phenomenon axis)
  • NO scene elements (castle / throne / forest / dungeon — those belong to scene_type / camera_framing axes)
  • NO minifig action

VARIETY MANDATE — distribute across:
  • TORCH / FIRE (single torch warm-amber from below / torch-procession warm-orange / fireplace warm-uplight / forge-trans-orange uplit)
  • CANDLE (single-candle warm-amber pool / candelabra warm-cluster / chapel-altar warm-row)
  • SUNLIGHT (sun-through-arrowslit shaft / cathedral-stained-glass jewel-tones / forest-canopy-dapple cool-green / sunset-orange-warm-side)
  • MOONLIGHT (full-moon cool-silver-blue / crescent-moon side / moonlit-fog soft-diffuse / blood-moon cursed-red)
  • LIGHTNING (instant-flash white-violet / storm-distant pulsing / mage-bolt trans-yellow strobe)
  • DRAGON-FIRE (trans-orange + trans-red glowing scene / dragon-breath warm-side / lair-glow ember-warm)
  • OVERCAST / DIFFUSE (cool-grey overcast / misty-dawn diffuse / cathedral-dim cool / fog-bounce blue-grey)
  • CHIAROSCURO (Caravaggio single-source dramatic / single-source-dark-surround / spotlight-pool)
  • UNHOLY / CURSED GLOW (sickly green-glow / phosphorescent-purple uplight / aurora-violet cool)
  • NIGHT WITH SINGLE SOURCE (lone-candle in pure-black / single-torch in dungeon / brazier-flicker)`,
    touchpoints: [
      'SINGLE-TORCH WARM-AMBER UPLIT — single torch held overhead as the only light source, warm-amber orange-glow falling off rapidly to darkness within 2-brick-lengths, deep-amber color quality at the source fading to pitch-black at edges',
      "CATHEDRAL STAINED-GLASS JEWEL-TONES — sunlight streaming through stained-glass windows casting jewel-tone color patches (trans-red + trans-blue + trans-yellow + trans-violet) on the interior floor and surrounding figures, cool ambient between the colored shafts",
      "FULL-MOON COOL SILVER-BLUE — directly overhead full moon casting cool silver-blue color quality on all upward surfaces, deep-blue undersides, vertical shadows underfoot, the moonlit-realm register",
      "CANDLELIT CHAPEL ROW WARM-AMBER — row of candelabra along chapel altar casting warm-amber pools of light up onto the wall above each, cool deep-shadow between the pools, the sacred-ceremony register",
      "DRAGON-FIRE GLOWING WARM-SIDE — trans-orange + trans-red dragon-breath glow casting hot warm-amber color quality on the side of the scene facing the dragon, deep purple-shadow on the off-side, the dragon-attack register",
      "STORM-LIGHTNING WHITE-VIOLET FLASH — instant lightning flash freezing the entire scene in white-violet color quality, hard-edged shadows from the directional flash, the dramatic-storm register",
      "FORGE GLOWING TRANS-ORANGE UPLIT — dwarven-forge fire as light source from below, hot trans-orange color quality on the upper-surfaces of the forge-chamber, deep-cool shadow on the far side of the chamber",
      "FOREST-CANOPY DAPPLE COOL-GREEN — sun filtering through dense leaf-element canopy casting dappled cool-green color quality on the forest-floor, sun-shaft beams visible through gaps, the woodland register",
      "BLOOD-MOON CURSED-RED — full moon directly overhead in trans-red color quality, sickly-red color cast on all upward surfaces, deep-burgundy shadows, the supernatural-event register",
      "TAVERN FIREPLACE WARM-AMBER UPLIT — central tavern fireplace as the only light source, warm-amber orange-glow flickering on the gathered tables and patrons closest to the hearth, cool-deep-shadow in the far corners",
      "AURORA-VIOLET COOL OVERHEAD — magical aurora-belt overhead casting trans-violet + trans-cyan cool color quality on all upward surfaces, the otherworldly-realm register",
      "TWILIGHT-PURPLE DUSK BLUE-COOL — post-blue-hour deep-twilight, rich purple-and-indigo overhead, no direct light source, very low ambient, the world-ending-day register",
      "SUNSET ORANGE-WARM SIDELIT — late-afternoon sun low on horizon raking horizontally, warm amber color quality on lit surfaces, long deep-violet shadows opposite, the iconic golden-hour register",
      "MOONLIT FOG SOFT-DIFFUSE — diffused moonlight through fog casting pale-blue soft-diffuse color quality, no hard shadows, lanterns blooming as soft halos, the mysterious-night register",
      "CARAVAGGIO DEEP-SHADOW SINGLE-SOURCE — chiaroscuro interior from one off-frame source (could be window / lantern), warm color quality on the lit edge of subject, deep-black void on 80% of frame, dramatic high-contrast",
      "BRAZIER-FLICKER WARM-OLIVE-UPLIT — large brazier as light source from below, warm-olive-orange flickering color quality on undersides of objects above, cool-darkness above the brazier, the dungeon-cell register",
      "ICE-CRYSTAL CAVE TRANS-CYAN UPLIT — bioluminescent fungi + ice-crystal accents lighting an underground cave from below, cool trans-cyan + trans-green color quality, eerie ethereal feel",
      "UNHOLY-GLOW SICKLY-GREEN UPLIT — necromantic ritual circle or summoning altar emitting sickly trans-green glow from below, sickly-green color quality on underside-of-objects above, cool-darkness above, the dark-arts register",
      "ARROWSLIT-SHAFT BRIGHT-YELLOW VERTICAL — single sun-shaft piercing through an arrowslit window casting a bright-yellow vertical light-beam down into a dim castle-chamber, surrounding darkness on the unlit areas, the lone-light-shaft register",
      "TORCH-PROCESSION WARM-ORANGE — line of torches carried in procession casting warm-orange flickering color quality down a corridor or path, the ceremonial-arrival register",
      "DAWN-PINK COOL-COOL-HORIZON — pre-sunrise pink-and-cool-blue gradient lighting, soft-diffuse color quality, barely-defined shadows, the gentle-awakening register",
      "FIRELIGHT FLICKERING WARM-SIDELIT — fire-pit or bonfire from one side casting warm flickering orange-yellow on the lit side, deep purple-black on the off-side, dramatic warm-cool split lighting, the campsite register",
      "WIZARD-ORB COOL-CYAN-UPLIT — wizard's crystal-orb on a stand as the only light source, cool trans-cyan glow uplighting the wizard's face from below, dramatic chiaroscuro, the arcane-study register",
      "MAGE-BOLT TRANS-YELLOW STROBE — instant magical spell-bolt as the dominant light source, trans-yellow color quality bleaching the strike-side, hard-edged shadows on the off-side, the spell-impact register",
      "WITCH-CAULDRON TRANS-GREEN UPLIT — bubbling green-glow cauldron as the only light source, trans-green uplit color quality on the witch's face from below, cool darkness above, the swamp-hut register",
      "OVERCAST GREY-COOL DIFFUSE — heavily overcast sky bouncing flat cool-grey light, no directional shadows, even illumination across the frame, the bleak-day register",
      "ICE-PLANET-BLUE COOL-OVERHEAD — frozen-realm twilight with cool-blue overhead sky, soft-diffuse color quality on snow surfaces, the polar register",
      "NEEDLE-OF-LIGHT THROUGH-CEILING SUN-SHAFT — vertical shaft of warm sunlight piercing downward through a hole or opening overhead, sharp-edged light-shaft, surrounding darkness on the unlit areas, the revelation register",
      "STAR-FIELD MOONLESS COOL-NEAR-BLACK — no moon, only faint silver-blue starlight, very dim cool-blue color quality, barely-readable shadow definition, near-pitch-black darkness with only highlights catching, the wild-realm register",
      "MULTIPLE-CANDELABRA ROOM-WARM — several candelabra positioned around a chamber casting warm-amber pools that overlap into a complete warm-warmth illumination, the cozy-hall register",
    ],
    instructions: `Each entry is ONE fantasy-scene lighting setup, 15-30 words. Format: "SOURCE+DIRECTION CAPS — color quality + signature". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO magical phenomena (spell-vortex / portal — that's magical_phenomenon); NO scene elements (castle / throne / forest — that's scene_type / camera_framing); NO minifig action. SOURCE + DIRECTION + COLOR only.`,
  },

  brickbot_fantasy_palette: {
    format: 'simple',
    theme: `LEGO MOC FANTASY PALETTE — axis-clean color-combination entries for the fantasy path. Each entry is ONE specific multi-color palette for a fantasy diorama. Each entry 12-25 words.

✓ VARIETY MANDATE — distribute across fantasy-coded palettes:
  • CRUSADERS WHITE+RED (white-tabard + red-cross + gold + steel-grey)
  • FORESTMEN GREEN+BROWN (forest-green hood + leather-brown + bone-white + bow-string-tan)
  • BLACK KNIGHTS DARK (black-armor + grey-tabard + falcon-grey + dragon-red trim)
  • ROYAL KNIGHTS PURPLE+GOLD (royal-purple velvet + gold-braid + cream-ivory + crimson)
  • DRAGON KNIGHTS RED+BLACK (dragon-red + dragon-black + gold + bronze)
  • LION KINGDOM BLUE+GOLD (royal-blue + gold + cream-white + lion-emblem)
  • DRAGON KINGDOM DARK-RED (dark-red + black + dragon-banner + bronze)
  • SKELETON-KING RED+BLACK+BONE (skeleton-red + black + bone-white + dim-grey)
  • CASTLE 2013 CHROME+CROWN (chrome-silver + king's-blue + crown-gold + ivory)
  • LEGO ELVES PASTEL (sky-blue + sea-blue + peach-pink + fire-red + earth-green + faerie-cream)
  • LOTR ROHAN (Rohan-green + leather-tan + horse-banner-cream + bronze-trim)
  • LOTR GONDOR/MINAS TIRITH (white-stone + silver + white-tree-emblem + cool-grey)
  • LOTR MORDOR (black + dark-red + ember-orange + ash-grey + tarred-black)
  • LOTR RIVENDELL (silver-pearl + leaf-cream + cool-blue + intricate-design-trim)
  • LOTR SHIRE (earth-green + tan + cream-white + sunset-orange + warm-brown)
  • HOBBIT EREBOR DWARVEN (bronze + steel + dark-bley + mithril-blue + gold-trim)
  • D&D ADVENTURER PARTY (mixed-leather + steel + spell-purple + holy-yellow)
  • SUNSET TWILIGHT FANTASY (saffron + crimson + deep-purple + ember-orange + amber-glow)
  • CURSED DARK FANTASY (sickly-green + abyss-black + bone-white + verdigris + necromancer-purple)
  • TAVERN FIRESIDE WARM (warm-amber + tobacco-brown + cream + aged-oak + brass)
  • CATHEDRAL STAINED-GLASS JEWEL-TONES (cool-stone + trans-red + trans-blue + trans-yellow + trans-violet)
  • SNOWY-REALM ICE-WHITE (snow-white + ice-cyan + dim-blue + bone-grey + dim-silver)
  • VOLCANIC-WASTES EMBER (ember-orange + ash-grey + soot-black + dying-coal-red + brimstone)

Each entry must:
• Name 3-5 specific colors with anchor-nouns
• Use specific color-modifier vocabulary (weathered / tarnished / bleached / saturated / cool / warm / molten)
• End with a brief register tag
• NEVER drift into lighting language — describe colors as MATERIAL colors`,
    touchpoints: [
      "White-tabard + red-cross + gold-trim + steel-grey-armor, Crusaders",
      "Forest-green-hood + leather-brown + bone-white + bow-string-tan + dim-olive, Forestmen",
      "Black-armor + grey-tabard + falcon-emblem + bone-white + dim-iron, Black-Falcons",
      "Black-armor + grey + dragon-red-trim + dim-steel + bone, Black-Knights",
      "Royal-purple-velvet + gold-braid + cream-ivory + crimson-sash + ebony, Royal-Knights",
      "Dragon-red + dragon-black + tarnished-gold + bronze + dim-brown, Dragon-Knights",
      "Royal-blue + lion-gold + cream-white + bronze-trim + sky-banner, Lion-Kingdom",
      "Dark-red + obsidian-black + bronze + dragon-banner + scorched-brown, Dragon-Kingdom",
      "Skeleton-red + tar-black + bone-white + dim-grey + decay-green, Skeleton-King",
      "Chrome-silver + king's-blue + crown-gold + cream-ivory + heritage-steel, Castle-2013",
      "Sky-blue + sea-blue + peach-pink + fire-red + earth-green, LEGO-Elves",
      "Rohan-green + leather-tan + horse-banner-cream + bronze-trim + dim-iron, LotR-Rohan",
      "White-stone + silver + white-tree-emblem + cool-grey + ebony, LotR-Gondor",
      "Black + dark-red + ember-orange + ash-grey + tarred-black, LotR-Mordor",
      "Silver-pearl + leaf-cream + cool-blue + intricate-design + jade-trim, LotR-Rivendell",
      "Earth-green + tan + cream-white + sunset-orange + warm-brown, LotR-Shire",
      "Bronze + steel + dark-bley + mithril-blue + gold-trim, Hobbit-Erebor",
      "Plate-steel + leather + spell-purple + holy-yellow + cleric-cream, D&D-adventurer",
      "Saffron-sunset + crimson + deep-purple + ember-orange + amber-glow, Sunset-twilight",
      "Sickly-green + abyss-black + bone-white + verdigris + necromancer-purple, Cursed-dark",
      "Warm-amber + tobacco-brown + cream + aged-oak + brass, Tavern-fireside",
      "Cool-stone + trans-red + trans-blue + trans-yellow + trans-violet, Cathedral-stained-glass",
      "Snow-white + ice-cyan + dim-blue + bone-grey + dim-silver, Snowy-realm",
      "Ember-orange + ash-grey + soot-black + dying-coal-red + brimstone, Volcanic-wastes",
      "Spell-violet + trans-cyan + arcane-gold + parchment-cream + grimoire-black, Wizard-tower",
      "Hay-cream + cabbage-green + bread-brown + pewter-grey + barrel-tan, Peasant-village",
      "Battle-red + ash-grey + scorched-black + war-banner-gold + iron-dim, Battlefield-aftermath",
      "Cathedral-cool-stone + altar-gold + chalice-silver + crimson-velvet + ivory, Royal-chapel",
      "Dragon-egg-pearl + nest-tan + cave-grey + spark-red + amber-light, Dragon-lair-newborn",
      "Moss-green + mushroom-red + log-brown + forest-shadow + olive-glow, Forest-glade",
      "Northern-fur-brown + Viking-iron + war-banner-red + ash-snow + mead-amber, Northern-realm",
    ],
    instructions: `Each entry is ONE fantasy palette, 12-25 words. Format: comma-separated colors then comma + register-tag. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO lighting language; NO scene elements; NO magical phenomena. Material colors with anchors + register-tag. NEVER Star Wars / Harry Potter references.`,
  },

  brickbot_fantasy_magical_phenomenon: {
    format: 'simple',
    theme: `FANTASY MAGICAL PHENOMENON — atmospheric/supernatural event that AMPLIFIES the scene. Each entry is ONE specific magical event (50%-gated conditional). Each entry 20-40 words.

⚠️ DECOUPLED FROM scene_type AND lighting — bending axis. Lets us roll "castle siege + dragon-fire-rain + LotR Mordor register" or "tavern interior + faerie-mist + LEGO Elves register."

VARIETY MANDATE — distribute across:
  • DRAGON / FIRE (dragon-fire-rain on village / dragon-breath blast / lair-fire-pit erupting)
  • SPELL / VORTEX (mage-spell-vortex collision / portal-disc opening / lightning-bolt-cast / fireball-explosion)
  • UNDEAD / NECROMANTIC (skeleton-rising-from-ground / lich-aura unholy-pulse / curse-mist-drift / wight-emergence)
  • FAERIE / NATURE (fey-mist drifting through glade / forest-spirits illuminating trees / bioluminescent-flora bloom / aurora-blessing)
  • WEATHER / ELEMENTAL (blizzard-conjured ice-storm / unnatural-thunderstorm / earthquake-ground-crack / fire-rain from sky)
  • PORTAL / SUMMONING (magical-portal disc opening / summoning-pentagram glowing / arcane-circle activating / banishment-vortex)
  • SHADOW / CURSE (shadow-curse spreading / unholy-pulse-from-altar / dark-energy-tendrils / cursed-fog with faces)
  • DIVINE / HOLY (divine-light from above / healing-aura golden glow / paladin-blessing radiance / saint's-halo manifestation)
  • CREATURE EMERGENCE (giant-spider-from-hole / cave-troll-rising / hydra-emerging-from-swamp / golem-awakening)
  • CELESTIAL (falling-stars across sky / blood-moon eclipse / comet-trail / nebula-overhead-fantastical)

Each entry must:
• Name the event in first 4-8 words
• Specify WHICH BRICK PARTS render it (trans-pieces / flex-tubes / specific elements)
• Specify the VISUAL IMPACT (focal point shift, color cast, motion)
• NEVER override lighting axis directly`,
    touchpoints: [
      'DRAGON-FIRE RAIN ON VILLAGE — colossal brick-built dragon overhead with trans-orange + trans-red flame elements raining down on the village below, scattered fire-impact-craters as trans-yellow round-plates on rooftops, the iconic dragon-attack signature',
      "MAGE SPELL-VORTEX COLLISION — two trans-color spell-vortexes (one trans-purple + trans-magenta, one trans-cyan + trans-yellow) meeting at frame-center with sparks of trans-yellow at the collision-point, dueling-mages signature",
      'SKELETON-RISING FROM GROUND — multiple skeleton-minifigs mid-emergence from cracked-earth tiles in a moonlit graveyard, trans-purple unholy-glow seeping up from each emergence-point, the necromantic-uprising signature',
      "FEY-MIST IN FOREST GLADE — drifting trans-magenta + trans-cyan + trans-green mist-particles (1×1 round-plates) hovering at varying heights through a forest glade, glowing faintly, the otherworldly-fey-presence signature",
      'BLIZZARD-CONJURED ICE-STORM — vertical trans-white + trans-cyan icicle-element streamers cascading from the upper-frame at an angle across the scene, blanketing surfaces in white-foam-crests, the elemental-spell signature',
      'MAGICAL-PORTAL DISC OPENING — vertical trans-cyan + trans-magenta + trans-violet disc at frame-center with jagged-edge-cone, faint mist swirling at the rim, the dimensional-portal opening signature',
      'PENTAGRAM-FLOOR GLOWING — necromantic pentagram built from trans-purple + trans-magenta tiles glowing on a stone-floor in a wizard\'s tower or crypt, the trans-elements rising as smoke-streamers, the summoning signature',
      'SHADOW-CURSE TENDRILS — black + dark-bley trans-clear-shadow tendrils emerging from a cursed-altar and spreading along the floor toward foreground figures, the dark-magic-spreading signature',
      'DIVINE-LIGHT FROM ABOVE — vertical trans-yellow + trans-clear light-shaft descending from above onto a focal-figure (paladin / chosen-one), surrounding darkness on the unlit areas, the divine-intervention signature',
      'BLOOD-MOON ECLIPSE — large dark-bley round-tile lunar-disc eclipsing a bright trans-red moon, with thin trans-orange + trans-red diffraction-ring around the eclipse-edge, sickly-red color cast across the scene, the supernatural-event signature',
      "FALLING-STARS ACROSS SKY — multiple trans-yellow + trans-white bar-elements arcing diagonally across the brick-built sky-baseplate, each streak with a 1×1 round-plate impact-head trailing trans-amber sparks, the celestial-event signature",
      'AURORA-BLESSING OVERHEAD — horizontal trans-green + trans-cyan + trans-magenta plate strips arranged in undulating curtains overhead, casting unearthly-green glow on the scene, the elven-magic signature',
      'CAVE-TROLL EMERGING — massive brick-built cave-troll figure mid-emergence from a cavern-floor with rubble and debris (1×1 round-plates) erupting at its rise-point, the giant-creature reveal signature',
      'GIANT-SPIDER FROM HOLE — colossal black-and-dark-bley spider-figure with eight Technic-articulated legs emerging from a hole in the cave-wall, trans-red eye-cluster, the arachnid-ambush signature',
      'HYDRA EMERGING FROM SWAMP — multi-headed hydra-figure with brick-built necks rising from a swamp-baseplate (multiple heads at different elevations), trans-green poison-particles dripping from each maw, the iconic-hydra signature',
      'GOLEM AWAKENING — brick-built stone-golem mid-activation on an altar-platform, faint trans-cyan magical-light emerging from chest-cavity, the construct-coming-to-life signature',
      'UNHOLY-PULSE-FROM-ALTAR — bursts of trans-violet + trans-purple light pulsing outward from a black-altar in concentric expanding rings, the dark-power-activating signature',
      "FIRE-RAIN FROM SKY — multiple small trans-orange + trans-red flame elements falling from the upper-frame at various positions, impact-craters trans-yellow at the strike-points, the apocalyptic-fall signature",
      'CURSED-FOG WITH FACES — drifting white-grey cotton-batting fog elements with faint trans-clear face-shapes embedded in the curls, ghostly-presence signature',
      "PALADIN-BLESSING RADIANCE — paladin-minifig with C-hands held up generating trans-yellow + trans-clear divine-radiance plate-elements emanating outward, the holy-magic signature",
      'FOREST-SPIRITS BLOOM — multiple trans-green + trans-cyan + trans-white 1×1 round-plate spirit-orbs hovering at varying heights through a forest, glowing faintly, the woodland-magic signature',
      'EARTHQUAKE GROUND-CRACK — dark-tan cracked-earth tiles spreading across the foreground floor with deep-cracks (1×2 dark-bley tile-strips), trans-orange lava-glow at the crack-edges, the elemental-disturbance signature',
      "WIGHT EMERGENCE FROM CRYPT — multiple wight-minifig variants (skeleton-torso with tattered-cape) emerging from a torch-lit crypt corridor with cold trans-cyan undead-mist drifting around their feet, the undead-procession signature",
      "BANISHMENT-VORTEX SPIRAL — trans-purple + trans-magenta spell-spiral mid-formation drawing a captured-demon-figure into the vortex-center, the moment-of-exorcism signature",
      'COMET-TRAIL OVERHEAD — single bright comet-element with elongated trans-white + trans-yellow tail trailing across the upper-frame, the celestial-omen signature',
    ],
    instructions: `Each entry is ONE fantasy magical phenomenon, 20-40 words. Format: "EVENT NAME CAPS — brick-parts + visual-impact". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NEVER specify lighting color cast directly; NEVER lock minifig reaction language; magical EVENT only. NEVER Star Wars / Harry Potter references.`,
  },

  // ════════════════════════════════════════════════════════
  // SPACE PATH (2026-05-22 — second BrickBot axis migration)
  // ════════════════════════════════════════════════════════

  // ─── scene_type — narrative stage ───
  brickbot_space_scene_type: {
    format: 'simple',
    theme: `LEGO MOC SPACE DIORAMA SCENE STAGES — narrative-stage descriptions for the BrickBot space axis system. Each entry is ONE narrative stage (the WHAT — what category of space moment is this diorama?). Each entry 30-55 words.

⚠️ CRITICAL — entries describe the STAGE / SETTING / NARRATIVE CATEGORY only. NO camera framing language. NO minifig action verbs (those belong to a separate axis). NO build technique vocab. NO cosmic phenomena. Just: where are we, what kind of moment.

VARIETY MANDATE — distribute across these categories (~5-10% each):
  • SHIP-TO-SHIP COMBAT — dogfight in nebula / capital-ship broadside / fighter intercept / boarding action
  • DOCKING / LAUNCH — shuttle approach / hangar departure / orbital ring berth / Mars-lander touchdown
  • EVA / SPACEWALK — hull repair / rescue tether / debris-field nav / between-ships transfer
  • ASTEROID / RESOURCE MINING — ore extraction rig / claim dispute / cargo loading / hauler launch
  • FIRST CONTACT / ALIEN ENCOUNTER — diplomatic landing / monolith approach / artifact reveal / hostile drone encounter
  • CRASH / SURVIVAL — crashed-lander reef / hull-breach drama / lost-in-asteroid-belt / emergency-airlock
  • COMMAND BRIDGE / MISSION CONTROL — captain on the bridge / Apollo-era control room / war-room briefing / scope-readout moment
  • HABITAT / COLONY LIFE — Mars greenhouse / lunar dorm-cluster / station mess hall / hydroponics bay
  • EXPLORATION / DISCOVERY — derelict-ship investigation / cave-entry on alien world / ruined-station boarding / probe-recovery
  • REFIT / REPAIR — engine swap mid-deck / hull-plating retrofit / drydock overhaul / hardpoint upgrade
  • LANDING ON PLANET — first-foot ceremony / dust-cloud touchdown / atmospheric re-entry burn / crater settlement
  • CARGO / FREIGHT — hauler convoy / smuggler hold transfer / customs inspection / black-market exchange
  • SPACE CITY LIFE — Coruscant-coded planet-city streetscape / orbital megacolony concourse / Citadel-coded multi-species market / O'Neill cylinder daily life / asteroid mining city tram-station / lunar capital plaza / Mos-Eisley spaceport cantina / Babylon-5 diplomatic concourse
  • SPACE CITY SCALE — wide aerial vistas of layered ecumenopolis / orbital-ring metropolis / asteroid-hollowed city / glass-dome capital cluster — the city itself is the subject, scale-prover crowds + flying-vehicle traffic
  • INTERIOR DAILY LIFE — mess hall meal / observation deck quiet moment / corridor commute / cargo bay manifest-check / med bay routine exam / engineering shift change / laboratory routine analysis / briefing room everyday

⚠️ NEW MANDATE — at LEAST 20% of generated entries must center on SPACE CITY or NON-COMBAT INTERIOR DAILY LIFE (Kevin's R1 feedback — too ship-heavy in R0). Lead these entries with the city/interior as the dominant subject — NOT "ship at city" / "ship at interior."

Each entry must:
• Name the narrative category in first 6-10 words
• Establish the diorama STAGE (bridge / hangar / surface / open vacuum / station-interior / cargo-hold / docking-ring)
• Suggest the TENSION or STAKES of the moment (without prescribing the action verb)
• NEVER name a specific minifig action ("captain pulling lever" — that's the action axis)
• NEVER name a specific phenomenon ("supernova breaks the sky" — that's the cosmic_phenomenon axis)`,
    touchpoints: [
      'ASTEROID MINING RIG EXTRACTION SITE — massive brick-built drill-platform anchored to a heavy dark-bley asteroid surface, cargo-hauler shuttle nearby with bay doors open, scattered ore-chunks (1×1 round-plates in trans-purple and trans-amber) drifting around the rig, the open vacuum behind dotted with asteroid silhouettes, tense ownership-dispute pre-launch beat',
      'CAPITAL-SHIP BROADSIDE COMBAT — two fleet capital-ships positioned at close-range across an open-vacuum gap, hull-plating scarred from prior salvos, multiple gun-batteries glowing trans-orange mid-discharge, the larger ship in receding perspective, debris-field of hull-fragments hanging between them, the moment before the next volley lands',
      "EVA HULL-REPAIR EMERGENCY — exterior hull surface of a damaged frigate spanning the diorama base, breach-point exposed to vacuum with venting trans-cyan atmospheric-element streamers, a tethered EVA-suited crew member working at the breach, secondary minifig at a portable repair-pod with brick-built tool-rack, the moment of damage-control under time-pressure",
      "FIRST-CONTACT MONOLITH APPROACH — alien planet surface of dark-red and tan slope bricks, a colossal brick-built monolith of black tiles rising from the terrain, three EVA-suited explorers approaching cautiously, a parked lander nearby, scale-prover micro-figure in deep distance, the awe-and-tension reveal beat",
      "COMMAND BRIDGE BATTLE-STATIONS — interior cutaway of a frigate's command bridge with brick-built console banks in concentric arcs, captain's chair on a raised platform, brick-built viewscreen showing the open-vacuum threat, multiple bridge officers at stations, klaxon-red trans-red 1×1 round-plate alert-lights along the bulkheads, mid-engagement coordination beat",
      "MARS COLONY GREENHOUSE INTERIOR — pressurized dome built from trans-clear panels and white-frame Technic-beam supports, rows of brick-built hydroponic planters with trans-green plant-elements, colonist minifigs in light EVA-undersuits tending the rows, the rust-tan Mars surface visible through the dome panels, daily-life pre-crisis beat",
      "DERELICT-SHIP INVESTIGATION — exterior or interior of a long-abandoned frigate, hull plating warped and patinaed, drifting debris-field around the cargo bay entry, three EVA-suited investigators with brick-built flashlight-elements, traces of forgotten cargo (1×1 round-plate stacks) on the deck, the eerie cold-storage discovery beat",
      "HANGAR-BAY LAUNCH PREP — interior of a fleet hangar with multiple fighter-craft on cradles in two receding rows, deck crew swarming around the lead fighter with refuel-hoses and ordnance-trolleys, pilot minifig approaching the cockpit ladder, the imminent-sortie scramble beat",
      "ORBITAL RING DOCKING APPROACH — exterior view of a vast brick-built orbital station ring, a docking shuttle on final approach to a berth-port, the planet below visible as a curved blue-and-tan baseplate horizon, station running-lights in trans-blue and trans-yellow strips along the rim, the precision-maneuver beat",
      "CRASHED LANDER REEF — alien-planet surface with a half-buried lander wreckage canted at 30 degrees in the rocky terrain, hull-breach exposed, three survivor minifigs working salvage from the wreck-base, scattered emergency-supplies (trans-orange 1×1 round-plate signal-flares) marking a perimeter, the survival-improvise beat",
      "SMUGGLER CARGO TRANSFER — interior of a low-deck cargo hold with shipping containers stacked in a back-channel arrangement, two crews exchanging crates between an inner ship and an outer dock, lookout at the gantry door, a bribed customs officer at a desk with a datapad, the illicit-transaction tension beat",
      "MISSION CONTROL APOLLO-ERA ROOM — wall-sized brick-built mission-board with grid of lit trans-element status indicators, rows of brick-built console banks with minifig flight-controllers, viewing gallery above with executive observers, vintage-bley palette with USA-coded flag tile, the historic-launch coordination beat",
      "DEEP-SPACE PROBE RECOVERY — open vacuum diorama with a derelict-probe (brick-built 1970s-style probe with dish-antenna) drifting at scene-center, a recovery-cradle on a recovery-shuttle reaching toward it, EVA-tethered crew member guiding it home, scattered solar-panel fragments around the probe, the careful-grasp beat",
      'ALIEN ARTIFACT REVEAL ON CAVE FLOOR — interior of an underground cave on an alien world with bioluminescent trans-cyan growth on the cavern walls, the artifact (brick-built crystalline shape on a plinth) at the cavern center, three explorers with EVA helmets cautiously approaching, scale-prover micro-figure at the cavern mouth in deep distance',
      "PIRATE / SCAVENGER ENCOUNTER — frontier-station dock between a respectable trading vessel and an off-the-books raider-craft with hull-plating cobbled from scavenged parts, two crews facing off on a narrow dock-walkway, lookouts at each end, brick-built lantern-lights in trans-orange overhead, the tense-standoff beat",
      "FUEL-DEPOT REFUELING — exterior of a fleet ship at a fuel-depot platform, brick-built fuel-arm extended from depot to ship, deck-crew at the connection-point, depot supervisor at a control-station, distant stars in 1×1 white round-plates scattered across the dark-bley sky-baseplate, the routine-procedure-with-tension beat",
      "ESCAPE-POD JETTISON MOMENT — exterior of a damaged ship at the moment an escape-pod cluster jettisons from the side, pods (brick-built tear-drop shapes) trailing trans-orange flame elements, the parent-ship leaning at an angle implying severe damage, the abandonment-of-ship climax",
      "LUNAR-BASE CONSTRUCTION SITE — surface of the moon (light-bley slope bricks with crater-tile insets) with a half-assembled base structure, Technic-articulated brick-built crane lifting a habitat-module into position, EVA-suited construction crew at multiple work-points, the building-the-future beat",
      "MEDICAL BAY EMERGENCY — interior of a ship's medical bay with brick-built medical-bunk and instrument-arrays, a casualty minifig on the bunk under examination by a doctor minifig, secondary medical-tech at a diagnostic console, trans-red 1×1 alert-light overhead, the urgent-treatment beat",
      "DOOMED-MISSION FAREWELL — interior of a small interior space (cockpit / airlock / shuttle-cabin) with one minifig in EVA-suit at the airlock ready to depart, another minifig in undersuit at the bulkhead, brick-built personal-effects (datapad / photo-tile / wedding-ring on a plate) between them, the sacrifice-moment quiet beat",
    ],
    instructions: `Each entry is ONE space narrative stage, 30-55 words. Format: "STAGE NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines. STRICT BANS: never include camera framing language ("WIDE / MEDIUM / CLOSE / aerial"), never include minifig action verbs ("astronaut leaping / crew firing"), never include phenomenon names ("supernova / aurora / black hole"), never include lighting descriptors ("golden hour / nebula-glow"). Those belong to other axes. Stage + tension only.`,
  },

  // ─── minifig_action — verb-led story beats ───
  brickbot_space_minifig_action: {
    format: 'simple',
    theme: `LEGO MINIFIG ACTION BEATS — verb-led story moments for the BrickBot space path. Each entry is a freeze-frame of minifigs IN MID-ACTION (the story beat), NOT minifigs posing in a setting. Each entry 25-45 words.

⚠️ HARD MANDATE — STORY BEAT MANDATE per the playbook. Every entry MUST start with an ACTIVE VERB and describe a moment with CAUSE + EFFECT in the same frame. Space-specific verbs: mid-tether-arrest, mid-airlock-cycle, mid-blast-deflect, mid-canopy-eject, mid-drill-bite, mid-spacewalk-tether-snap, mid-lever-pull, mid-pad-launch, mid-deflector-up, mid-airlock-pressurize, mid-vacuum-suction, mid-grasp-of-artifact.

⚠️ HARD BANS:
  • NEVER "minifigs standing around"
  • NEVER "astronaut posing on landing pad"
  • NEVER "crew watching / looking at / gazing at / wide-eyed at"
  • NEVER "characters arranged in semicircle"
  • NEVER passive states (sitting, resting, waiting, observing)

✓ Body-position variety:
  • Mid-spacewalk / mid-tether (~20%)
  • Mid-fire / mid-blast / mid-fire-blaster (~15%)
  • Mid-lever-pull / mid-console-stab / mid-system-emergency (~15%)
  • Mid-airlock-cycle / mid-hatch-vault (~10%)
  • Multi-figure interaction (rescue, hand-off, repair-team, defense-line) (~20%)
  • Mid-leap / mid-fall in low-gravity (~10%)
  • Mid-pilot in cockpit (~10%)

Each entry must:
• Start with an ACTIVE VERB
• Name 1-3 specific minifigs (commander, pilot, engineer, scientist, marine, alien, etc.) with brief identifier (EVA-helmet visor / blaster-rifle / engineer-overall)
• Describe the SHARED OBJECT or EVENT they're interacting with (alien artifact / tether-line / breach-panel / control-console / drifting debris / blast-impact)
• Imply the moment-before and moment-after
• PLASTIC SCALE — minifig anatomy (C-shaped hands / two-stud arms / printed visor)`,
    touchpoints: [
      'Mid-tether-arrest of a drifting EVA-suited engineer (orange-stripe visor) caught by a second EVA-tethered crew member at the airlock with C-grip clamped on the engineer\'s wrist, the tether line trailing back into open vacuum, hull-breach venting trans-cyan atmosphere visible',
      'Mid-blast of a heavy plasma cannon on a Blacktron fighter, trans-orange + trans-yellow cone of flame elements bursting from the muzzle, pilot minifig at the controls in helmeted-visor with one C-hand on a control-stick, target enemy fighter in the deep distance already breaking formation',
      'Mid-lever-pull of an emergency-jettison handle by a commander minifig (red-trim EVA-suit) on the bridge, a second officer mid-shout-warning behind them, the brick-built viewscreen showing escape-pods already separating from the parent-ship',
      'Mid-airlock-cycle with three EVA-suited explorers stacked in the airlock chamber, the first minifig\'s C-grip on the outer-hatch lever pulled forward, the chamber atmosphere visualized by trans-cyan plate elements receding, the alien-world surface visible through the open outer port',
      'Mid-canopy-eject of a Galaxy Squad pilot minifig (orange-cyan flightsuit) firing upward from a stricken fighter, ejection-seat trailing trans-yellow thrust elements, the doomed fighter mid-spiral below, a wingman fighter banking in the distance to circle the eject-site',
      "Mid-grasp of an alien artifact (trans-purple crystalline brick-element on a stand) by an EVA-suited science officer, the artifact starting to glow trans-magenta around the contact-point, second crew member behind the lead reaching to pull them back, the moment-before-the-power-surge",
      "Mid-drill-bite of an asteroid-mining rig by the engineer-operator at the drill-station, drill-head (gear + cone parts) sinking into the asteroid surface with debris-1×1-round-plates flying outward, second crew at the ore-collector mid-catch of the falling chunks",
      "Mid-leap in lunar-gravity by a Classic LEGO Space astronaut (yellow torso) over a low crater rim, both feet off the surface, lunar-rover in the deep distance, scale-prover micro-figure at the rover, the iconic-low-gravity-bound moment",
      'Mid-system-failure as a chief engineer minifig (greasy-overall print) yanks an exposed power-cell free from a panel while sparks (trans-yellow 1×1 round-plates) burst from the bay, second engineer behind mid-shout with C-grip on a fire-extinguisher accessory',
      "Mid-blaster-fire-exchange in a station corridor with three security minifigs (Space Police white-blue) in cover positions firing at two raider minifigs at the corridor's other end, trans-red bolt-elements crossing the gap mid-flight",
      "Mid-spacewalk-tether-snap as an EVA crew member's tether parts mid-frame (severed end whipping back toward camera), the spacewalker mid-recoil reaching for a hull-handhold, fellow crewmate at the airlock mid-throw of a second backup-tether",
      "Mid-deflector-up as the bridge officer minifig at the defensive-systems console slams a C-hand down on an activator-stud, the brick-built deflector-array on a viewscreen tile lighting trans-cyan, a second officer at navigation mid-evasive-spin of the helm",
      "Mid-hatch-vault of a marine minifig (Galaxy Squad orange-cyan) through a sliced-open bulkhead into the next compartment, smoke (cotton-batting 1×1 white plates) curling from the breach, second marine behind mid-charge to follow through the gap",
      "Mid-pad-launch as a Tintin-retro 1960s lander ignites engines (trans-orange + trans-yellow cone), bystander minifigs at the launch-pad fence mid-recoil from the heat, the lander beginning to lift off the brick-built launch-cradle",
      "Mid-rescue-pull of a casualty (limp minifig with damage-marks-print) from the rubble of a collapsed habitat-module, two rescue-crew with C-grips on the casualty's shoulders, third rescue minifig mid-stabilizing-pole at the ceiling-beam",
      "Mid-reactor-emergency-cycle by a Mass-Effect-coded engineer (gunmetal hardsuit) at a primary reactor console, trans-cyan coolant elements venting from a side-pipe, secondary engineer mid-call on a comm-piece warning the bridge",
      "Mid-cargo-transfer of a stolen contraband-crate between a Blacktron smuggler at a ship's cargo door and a shore-side fence at a dock-platform, the crate suspended mid-pass between them, lookout at a corner mid-warning-wave",
      "Mid-hostile-drone-defense as two scout minifigs in EVA-suits with mining tools-as-improvised-weapons swing at an incoming drone (brick-built 1×1 round-plate fuselage with antenna-wings) hovering over the dig-site",
      "Mid-zero-G-recoil of a marine after firing a heavy blaster braced against a corridor bulkhead, the recoil-force pushing them backwards-in-vacuum into a teammate behind, trans-red bolt-element trailing from the muzzle",
      "Mid-distress-flare launch as a stranded survivor minifig on an alien-world peak fires a flare-pistol skyward, trans-orange flame element arcing up, a second survivor at the camp mid-wave to draw the rescue-shuttle visible in deep distance",
    ],
    instructions: `Each entry is ONE space minifig action beat, 25-45 words. Format: free-form prose STARTING WITH AN ACTIVE VERB. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO "minifigs standing", NO "astronaut posing", NO "watching" / "looking at" / "gazing", NO passive states. Story beat + verb + cause/effect always.`,
  },

  // ─── build_technique — space-MOC distinguisher ───
  brickbot_space_build_technique: {
    format: 'simple',
    theme: `LEGO SPACE MOC BUILD TECHNIQUE — AFOL-distinguishing brick-construction technique notes for the BrickBot space path. Each entry is ONE specific MOC technique that makes a space diorama read as "Bricklink AFOL convention build" instead of "official LEGO Space set photo." Each entry 25-45 words.

VARIETY MANDATE — distribute across:
  • SNOT construction for rounded sci-fi hulls (Classic Space dome curves / Blacktron wedge curves / M-Tron magnet-coupling curves)
  • Trans-piece engine flares (trans-orange + trans-red flame elements stacked at thruster cones, trans-yellow ion-blast cores)
  • Trans-piece nebula construction (trans-magenta + trans-cyan + trans-purple layered plates as cosmic dust clouds)
  • Technic articulation (landing gear unfolding / robotic arms / cargo-loader cranes / blast-doors)
  • Hard-SF panel-line detail (greebles / hull-plating staggered tile-offset / texture from 1×1 cheese slopes)
  • Illegal techniques (bent flex-tubes / clip-and-bar non-canon joints / brick-bending / clutch-on-tile)
  • Microscale tricks (minifig-accessory repurposed: lightsaber as engine-glow rod, croissant as alien-tail, dragon-wing as solar-sail)
  • Studded-vs-tile texture contrast (studded deck-plating for interior decks / tiled smooth panels for exterior hull-plating)
  • Glow / accent lighting techniques (trans-pieces as backlit panels, illegal LED-brick alternatives, fiber-optic-style stacks)
  • Cross-section / cutaway construction (revealing interior detail through brick-by-brick framing)

Each entry must:
• Name the technique TYPE in first 5-8 words
• Specify WHICH SPACE BUILD ELEMENT it applies to (hull / engine / nebula / landing-gear / station-interior / etc.)
• Specify the SPECIFIC BRICK PARTS used (named: 2×2 round-dish / Technic axle-pin / trans-orange flame element / 1×1 cheese slope)
• Imply the visual IMPACT`,
    touchpoints: [
      'SNOT-built Classic-Space dome curvature — vintage Classic Space cockpit dome built with SNOT bracket-plates turning curved-slope bricks sideways for a continuous hemispheric profile, using 4×4 inverted-dome elements with bley-frame border tiles for the iconic 6970-Beta-1 Command Base silhouette',
      'Trans-piece engine-flare stack — thruster cone built from trans-orange 1×1 round-plates clustered at the throat, transitioning to trans-yellow flame elements at mid-cone, with a trans-clear bar-element extending the heat-shimmer plume aft of the nozzle, suggesting active burn',
      'SNOT-curved Classic LEGO Space hull — Cosmic Fleet Voyager-style hull built with sideways-stud bracket plates turning curved-slope bricks parallel to the keel-axis, yellow + light-bley tile cladding offset half-stud for panel-line texture, trans-blue cockpit canopy at the bow',
      'Trans-magenta + trans-cyan nebula stack — distant nebula built as a layered cloud of trans-magenta plates underneath trans-cyan tiles offset half-stud, scattered trans-purple 1×1 round-plates as denser cores, with cotton-batting white 1×1 round-plates for nebular haze across the field',
      'Technic-articulated landing gear — three-strut landing gear built with Technic axle-pin joints at the hip and knee, allowing real deploy-retract motion, hydraulic-cylinder detail via stacked 1×1 round-bricks, foot-pad built from inverted slope-bricks for proper ground-contact',
      "Greebled hard-SF hull plating — exterior surface of a frigate built with 1×1 cheese slopes, 1×2 jumper plates, brackets, and exposed-rod technic-pin details staggered in pseudo-random pattern, creating maximum panel-line + venting + access-hatch visual density",
      "Illegal flex-tube cabling — Blacktron-style power-conduit cabling built from black flex-tube pieces (technically illegal in pure-LEGO purist build) routed across an exposed bulkhead between brick-built junction-boxes, suggesting realistic ship-engineering",
      "Microscale lightsaber engine-glow — repurposed minifig lightsaber-blade pieces in trans-blue + trans-green inserted into thruster-cones as the visible plasma-stream, the hilt portion hidden inside the nozzle structure, suggesting a coherent plasma-jet beam",
      "Microscale solar-sail dragon-wing — repurposed minifig dragon-wing pieces in trans-clear or trans-white attached via clip-and-bar connection to a solar-sail mast on a deep-space probe, fanned out to suggest light-pressure sails, creative non-canon part-usage",
      "Tile-vs-stud texture split on station-deck — interior corridor of a space station with tiled smooth-grey floor panels for the central walking-path and exposed-stud deck-grating panels along the bulkhead-edges, the visual contrast separating the spaces",
      "Trans-clear cockpit canopy with internal greeble — cockpit canopy built from trans-clear curved-slope pieces over an internal greebled instrument-panel of 1×1 round-tiles in alert-colors (red/amber/green), with pilot minifig visible inside, the canopy reflecting hangar lights",
      "Cross-section frigate cutaway — frigate hull built as a half-cutaway with the starboard hull-plating intact and the port-side completely exposed showing brick-built rib-frames + decks + corridors + engine-rooms layered across multiple levels, the AFOL-cutaway display piece",
      'Trans-piece ion-engine core — main engine nozzle built around a trans-cyan 4×4 round-dome at the core surrounded by exposed Technic-axle structure with brick-built coolant-piping, the trans-cyan visible through gaps suggesting cold-plasma drive',
      "Studded-stud Classic-Space launch-pad — launch pad built from solid studded yellow plates with surface-detail in light-bley tile insets, the studded surface celebrating the iconic Classic-Space yellow-grey identity rather than tile-smoothing it for realism",
      "Macrocanon Blacktron-II wedge silhouette — Blacktron II Aerial Intruder distinctive wedge built using SNOT bracket-plates running diagonally from the bow vertex, black + neon-yellow + trans-yellow wedge-plates layered with greeble-tile underbelly, instantly clocking as Blacktron canon",
      "M-Tron magnet-cruiser red-and-black palette discipline — vehicle built strictly with M-Tron heritage palette (M-Tron-red + black + lime-green + trans-fluorescent accents), magnet-elements deliberately exposed at coupling-points, the 1990-1991 M-Tron set 6989-Mega-Core lineage",
      "Blacktron stealth-fighter wedge — Blacktron-I or II palette discipline (black + neon-yellow + trans-yellow + Blacktron-orange), wedge-silhouette with hidden gun-port reveals at deploy, the iconic 1987-1993 Blacktron antagonist canon, every brick black except neon-trim",
      "Insectoids organic-hive curvature — alien-hive structure built using illegal flex-tube spines + bend-bricks for organic curvature, trans-purple + trans-green for translucent dome-sections, scattered 1×1 round-plates in trans-violet as bioluminescent residue, the 1998-1999 Insectoids canon",
      "Ice-Planet 2002 white-orange palette — ice-themed vehicle in pure-white + neon-orange trim with trans-clear ice-crystal accents, ice-saw-blade-elements as signature, the 1993 Ice Planet 2002 set 6973-Deep-Freeze-Defender lineage motif",
      "Galaxy Squad split-ship modular — fighter built as two detachable halves connected by a Technic-axle-pin trigger-coupling so the ship visibly splits-apart in-build, orange-cyan palette discipline with bug-alien-encounter motifs, the 2013 Galaxy Squad set 70705 lineage",
    ],
    instructions: `Each entry is ONE MOC space-build technique, 25-45 words. Format: "TECHNIQUE NAME CAPS — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no real-world construction language (no "3D-print / paint / glue"); LEGO bricks only. Name SPECIFIC part types (1×2 slope / trans-orange flame / Technic axle pin).`,
  },

  // ─── camera_framing — space-specific framings ───
  brickbot_space_camera_framing: {
    format: 'simple',
    theme: `SPACE-SPECIFIC CAMERA FRAMING — LEGO MOC photography angles for the space path. Each entry is ONE camera position + framing rule specific to SPACE diorama subject matter. Each entry 15-30 words.

⚠️ Bespoke — leverage space-specific scenery (hangar-vault / cockpit-canopy / EVA-tether / nebula-vista / planet-horizon / airlock-corridor / docking-bay) rather than generic photography terms.

VARIETY MANDATE — distribute across:
  • Vertigo angles (worm's-eye up a thruster / under a docking ring / from EVA looking up at hull)
  • Cockpit POV (from-pilot-seat through canopy / over-shoulder of captain on bridge)
  • EVA POV (tether's-eye view back at hull / drifting-debris perspective)
  • Wide planet-horizon establishing (ship over curved planet / station on lunar horizon / Mars expanse)
  • Hangar-vault perspectives (camera at deck-end looking down vault of receding fighter-cradles)
  • Nebula / cosmic vista (ship silhouetted against vast nebula cloud)
  • Cross-section cutaway POV (camera at the cutaway face of a half-built ship)
  • Mission-control wide (camera at back of room looking past consoles toward wall-board)
  • Asteroid-belt POV (camera embedded in asteroid debris / under-asteroid up at ship)
  • Cargo-bay loading (camera at the gantry overhead looking down at loading)
  • Air-lock POV (camera inside the airlock as outer door opens)

Each entry must:
• Specify camera POSITION (height / location / orientation)
• Specify the framing's PURPOSE — what story-element this angle DRAMATIZES
• Reference space-specific scenery elements`,
    touchpoints: [
      "HANGAR-BAY VAULT WIDE — camera at the deck-end of a fleet hangar looking down the receding rows of fighter-cradles, the hero-fighter in the foreground filling the lower-third, the vault arches receding toward a vanishing-point, hangar lighting in trans-amber strips along the bulkheads",
      "EVA-TETHER POV — camera looking BACK from the perspective of an EVA-suited crew member at the end of a tether, the parent-ship hull receding in the upper frame, the tether-line connecting back to the airlock, scale-prover hand visible in foreground",
      "COCKPIT-CANOPY OUT — camera from the pilot-seat looking out through the curved trans-clear canopy at the open-vacuum starfield, instrument-greeble visible in the lower-frame around the canopy-edge, pilot's helmeted reflection partially in the canopy glass",
      "NEBULA-VISTA-FROM-BRIDGE — camera positioned on the bridge looking out the brick-built viewscreen at a vast nebula filling the deep distance, the bridge consoles + officer minifigs framing the lower-third silhouetted against the bright nebula light",
      "PLANETSIDE WIDE-ESTABLISHING — camera at low-angle on an alien-planet surface looking toward the deep distance where a lander rests against a vast curved planet-horizon, scattered terrain features receding into perspective, the SKY-baseplate dominating the upper-half",
      "UNDER-THE-THRUSTER VERTIGO — camera flat on the launch-pad surface looking STRAIGHT UP at the underside of a launching ship's thruster array, four engine-bells receding in perspective overhead, trans-orange flame elements bursting from the nozzles toward the camera",
      "AIRLOCK-INTERIOR POV — camera positioned inside an airlock chamber looking at the outer-door as it cycles open, the door retracting upward into the bulkhead-frame, the alien-world or open-vacuum visible through the widening gap, atmospheric-element streamers venting",
      "DOCKING-RING ORBITAL APPROACH — camera positioned on the side of a vast orbital ring station looking back along the rim, a shuttle on final-approach to a docking berth in the foreground, the curved station-horizon disappearing into deep distance with running-lights",
      "CROSS-SECTION CUTAWAY WIDE — camera at the cutaway face of a half-built frigate looking INTO the cutaway revealing rib-frames + decks + corridors layered through the ship, AFOL display-cutaway angle showing the build's interior complexity",
      "BRIDGE-OVER-SHOULDER — camera positioned just behind the right shoulder of the bridge captain in their command-chair, looking past their shoulder toward the viewscreen mounted on the bridge-front wall, secondary officers at consoles in the mid-frame",
      "ASTEROID-DEBRIS POV — camera embedded in an asteroid debris-field looking out at a ship navigating through the field, asteroid-fragments framing the foreground as silhouetted obstacles, the ship visible through gaps in the debris-cloud",
      "MISSION-CONTROL VAULT — camera at the back of a Tintin-retro 1960s mission-control room looking past rows of console-banks toward a wall-sized mission-board in the deep-distance, executive observers in the viewing-gallery above, vintage palette throughout",
      "WORM'S-EYE UP DOCKING-PYLON — camera at deck-level looking up the side of a vertical docking-pylon mast, the docking-clamps and observation-deck visible higher up the mast, a docked ship's hull partially visible at the top edge, severe upward perspective",
      "OVER-THE-RIM CRATER — camera positioned on the rim of a lunar crater looking down into the crater interior where a lander rests against the crater-floor, scattered terrain features at the crater-floor, lunar-rover and scale-prover minifig visible mid-frame",
      "EVA-DRIFTING-DEBRIS POV — camera at the perspective of debris drifting past an EVA-repair scene, the crew member tethered to the hull-breach in the mid-frame, scattered hull-fragments framing the foreground as silhouettes, the parent-ship as background",
      "CARGO-BAY-GANTRY DOWNSHOT — camera at the top of a cargo-bay gantry looking straight down at the loading-floor below, crew swarming around stacked cargo-containers, brick-built cranes and lifting-arms framing the upper portion of the frame",
      "LANDING-SHUTTLE THROUGH-WINDOW — camera positioned at a passenger-cabin window of a descending landing-shuttle looking out at the planet-surface approaching, the cabin window-frame framing the view, brick-built shuttle-interior elements at the cabin edge",
      "ALIEN-CAVE BIOLUMINESCENT WIDE — camera positioned at the mouth of an alien cave looking deep into the cavern interior where bioluminescent trans-cyan growth illuminates the cave walls, explorers in the mid-distance approaching an artifact at the cavern center",
      "ESCAPE-POD JETTISON SIDE-VIEW — camera positioned alongside the parent-ship as a cluster of escape-pods jettisons from the side, pods trailing trans-orange flame, the parent-ship leaning at a damaged angle, the moment captured side-on",
      "REFIT DRYDOCK OVERHEAD — camera positioned at the overhead crane-rail looking down at a ship in drydock, drydock supports framing the ship below, refit-crew swarming on multiple decks of the ship, the AFOL-display dock with maximum visible detail",
    ],
    instructions: `Each entry is ONE space-specific camera framing, 15-30 words. Format: "FRAMING NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no generic camera terms ("medium shot / wide shot") without space-specific anchoring — every entry must reference space scenery (hangar / cockpit / EVA / nebula / planet / docking / airlock).`,
  },

  // ─── vehicle_class — silhouette anchor (REWEIGHTED R1 — 50% no-vehicle variants) ───
  brickbot_space_vehicle_class: {
    format: 'simple',
    theme: `SPACE SUBJECT-CLASS ANCHOR — for the space path. This pool controls whether the diorama centers on a SHIP, an INTERIOR scene, a LANDSCAPE-with-character, or a SPACE-CITY. Each entry 12-30 words.

⚠️ WEIGHTED DISTRIBUTION — critical for path variety. Generate the output as:
  • ~40-45% NO-VEHICLE variants (the diorama is an INTERIOR scene, a LANDSCAPE-with-character, or a SPACE-CITY — ZERO ship rendering in frame)
  • ~55-60% SHIP / VEHICLE variants (the diorama centers on a specific ship/vehicle silhouette)
  Ships should be the slight majority — the brand-center of the path is space-vehicles, but interior/city/landscape variety is the bending advantage.

⚠️ HARD RULE FOR NO-VEHICLE ENTRIES — when ANY entry begins with "no-vehicle (...)" the cross-axis template clause enforces ZERO ships in the rendered frame. The bracketed descriptor specifies what IS the subject.

⚠️ STORY-TENSION MANDATE FOR NO-VEHICLE ENTRIES — every no-vehicle entry MUST embed an action-tension descriptor in the bracketed phrase or the body. Examples:
  ❌ Weak: "no-vehicle (bridge interior) — console-banks, captain's chair, viewscreen"
  ✓ Strong: "no-vehicle (bridge mid-engagement) — alert-klaxon trans-red strobing overhead, multiple officers MID-ACTION at stations, captain leaning forward shouting orders, viewscreen showing the enemy fleet"
  ❌ Weak: "no-vehicle (mess hall) — crew dining, tables, port-window"
  ✓ Strong: "no-vehicle (mess hall mid-evacuation) — half-finished meals abandoned, crew mid-rush toward the corridor, klaxon overhead, the port-window showing the threat outside"
  ❌ Weak: "no-vehicle (Coruscant-coded planet-city) — sky-towers, mass-transit, urban density"
  ✓ Strong: "no-vehicle (Coruscant-coded planet-city mid-chase) — sky-towers receding in deep distance, transit-lanes streaking with traffic, two minifig pedestrians on a ledge mid-pursuit, scale-prover crowd below"

The TENSION DESCRIPTOR can be: mid-engagement / mid-emergency / mid-evacuation / mid-cycle / mid-launch / mid-arrival / mid-discovery / mid-rescue / mid-system-failure / mid-pursuit / mid-arrest / mid-investigation / mid-trade-dispute / mid-celebration / mid-rush / pre-launch tension / aftermath-of-fight / quiet-before-storm / discovery-moment.

VARIETY MANDATE — distribute across these subject categories:

═══ NO-VEHICLE INTERIORS (~25% of pool) ═══
  • no-vehicle (bridge interior, command stations, viewscreen) — generic-LEGO-Space command bridge
  • no-vehicle (hangar bay, fighters on cradles, deck crew, gantries) — busy fleet hangar
  • no-vehicle (airlock chamber, mid-cycle, EVA prep) — pressure-cycle moment
  • no-vehicle (cargo bay, stacked containers, loading-crane) — freight-hold scene
  • no-vehicle (mess hall, crew dining, port-window) — daily-life space
  • no-vehicle (med bay, casualty on bunk, medical-tech) — emergency-treatment
  • no-vehicle (engine room, reactor-core, engineer at console) — system-failure moment
  • no-vehicle (corridor, ship's spine, crew commuting) — between-stations transition
  • no-vehicle (observation deck, viewing window, planet beyond) — contemplative moment
  • no-vehicle (briefing room, holo-table, officers gathered) — pre-mission planning
  • no-vehicle (laboratory, alien-artifact under analysis, science crew) — discovery
  • no-vehicle (escape pod interior, crammed crew, ejection-sequence) — emergency
  • no-vehicle (mission control room, console operators, wall-board) — ground-side Apollo-era

═══ NO-VEHICLE LANDSCAPES + CHARACTERS (~12% of pool) ═══
  • no-vehicle (alien planet vista, character party exploring, deep-distance terrain features) — exploration
  • no-vehicle (lunar landscape, astronaut walking, planet-rise on horizon) — Apollo-coded moment
  • no-vehicle (Mars colony surface, colonist tending equipment, base in distance) — daily-frontier-life
  • no-vehicle (asteroid surface, mining crew at work, deep-vacuum overhead) — extraction-site
  • no-vehicle (alien jungle / cave / ice-shelf, EVA scientists, biome-coded terrain) — biome-exploration

═══ NO-VEHICLE SPACE CITIES (~13% of pool) ═══
  • no-vehicle (Coruscant-coded planet-city, layered urban density, sky-tower forest, mass-transit) — ecumenopolis
  • no-vehicle (orbital megacolony, vast ring structure interior, populated levels) — O'Neill-cylinder canon
  • no-vehicle (asteroid mining city, hollowed asteroid interior, layered habitat-decks) — LEGO mining-city iconic-LEGO heritage
  • no-vehicle (Citadel-coded station-city, multi-arm habitat, hub-and-spoke megastructure) — Mass-Effect Citadel
  • no-vehicle (lunar capital, glass-dome cluster, brick-built spires, lunar-surface visible beyond) — colony-city
  • no-vehicle (spaceport hub, multi-ship docking, customs, traders, multi-species crowds) — Mos-Eisley-coded
  • no-vehicle (Babylon-5-coded torus station, multi-level concourse, multi-species shoppers) — diplomatic-station

═══ SHIPS / VEHICLES (~50% of pool) ═══
  • Classic LEGO Space silhouettes (lunar-rover / Classic Space cruiser / Cosmic Fleet Voyager / Beta-1)
  • Blacktron wedge silhouettes (Blacktron-I Mission Commander / Blacktron-II Aerial Intruder)
  • M-Tron cruiser silhouettes (Mega Core Magnetizer)
  • Space Police cruiser / Ice Planet defender / Unitron / Mars Mission / Insectoids variants
  • Galaxy Squad split-ships (modular dual-half fighter)
  • Additional LEGO Space variants (Space Police III pursuit cruiser / Insectoids hive-ship / Mars Mission lander / Galaxy Squad bug-fighter)
  • Additional iconic LEGO Space ships (Galaxy Explorer 497 / Space Police peace-keeper 6886 / Insectoids Hive Crawler 6907 / Mars Mission MX-91 walker 5969 / M-Tron Stardefender 6932 / Classic Space modular rover)
  • Retro-future (Tintin Destination Moon lander / 2001 ASO Discovery One / Apollo CSM / Soyuz)
  • Asteroid-mining hauler / refueling tanker / smuggler-runner
  • EVA suit silhouettes (Classic Space yellow / Blacktron black / M-Tron red / Ice Planet white-orange / Mars Mission orange / Apollo NASA white / Tintin bubble-helmet)

⚠️ "FRIGATE / CRUISER / CORVETTE / DREADNOUGHT" DRIFT GUARD — when an entry names a class that has a naval-surface counterpart (frigate / cruiser / corvette / dreadnought), ALWAYS include the explicit qualifier "STARSHIP frigate" / "interstellar cruiser" / "STARSHIP corvette" — never just "frigate" alone. Lesson: R0b #1 rendered as a naval surface frigate when the word "frigate" wasn't sci-fi-anchored.

Each entry must:
• Begin with either "no-vehicle (...)" or the explicit ship-class name
• For SHIP entries: name the class + hull-profile + thruster arrangement + crew capacity
• For NO-VEHICLE entries: specify what IS the dominant subject (interior type / landscape / city) + key environmental detail
• ZERO mixing — a no-vehicle entry NEVER mentions any ship/vehicle silhouette`,
    touchpoints: [
      'no-vehicle (bridge mid-engagement) — Mass-Effect-coded command bridge with klaxon trans-red strobing overhead, console-banks in concentric arcs, captain leaning forward MID-SHOUT of orders, three officers MID-ACTION at stations, viewscreen showing the enemy fleet bearing down, alert-pattern chaos',
      'no-vehicle (hangar bay mid-launch-scramble) — fleet hangar with multiple fighters on cradles, lead fighter mid-engine-test with trans-orange flame elements bursting, pilot mid-sprint toward the cockpit ladder, deck-crew mid-evac of the launch-pad, ordnance-trolleys mid-roll',
      'no-vehicle (airlock mid-cycle) — pressure-cycle chamber mid-decompression with trans-cyan venting streamers receding, three EVA-suited crew tense at the outer hatch, lead crew member mid-grip on the cycle-lever, the alien-world or open-vacuum visible through the widening door-gap',
      'no-vehicle (cargo bay mid-loading-emergency) — interior cargo hold with stacked containers mid-shift, brick-built loading-crane gantry overhead with a crate mid-swing, deck-crew mid-dive away from the falling cargo, trans-yellow alert-strips strobing',
      'no-vehicle (mess hall mid-evacuation) — crew dining commons with half-finished meals abandoned, ration-trays mid-spill across tables, four crew mid-rush toward the corridor exit, klaxon trans-red overhead, the port-window showing the threat-event outside',
      'no-vehicle (med bay mid-trauma) — interior medical bay with casualty minifig on the bunk bloodied (red-print torso), doctor MID-ACTION over the patient with instrument, medical-tech mid-shout into a comm-piece, trans-red alert-light overhead pulsing',
      'no-vehicle (engine room mid-system-failure) — reactor-core chamber with the central reactor stack venting trans-cyan coolant streamers, engineer MID-LEVER-PULL on emergency-shutdown, second engineer mid-shield with arm raised, sparks (trans-yellow round-plates) bursting from a side-pipe',
      'no-vehicle (corridor mid-pursuit) — ship\'s spine-corridor with receding bulkhead frames, lead minifig MID-SPRINT toward the camera, pursuer minifig mid-charge behind with weapon drawn, trans-amber strip-lighting strobing alert-pattern, the chase compressed into the long perspective',
      'no-vehicle (observation deck mid-realization) — large brick-built viewing-window dominating one wall, two crew minifigs at the window MID-RECOIL as they realize what they\'re seeing outside, the threat (alien fleet / supernova / black hole) visible through the glass',
      'no-vehicle (briefing room mid-revelation) — brick-built holo-table at center projecting a trans-blue tactical layout, officers gathered around in tense planning posture, lead officer MID-POINT at a critical detail on the holo, the mood shifting from routine to alarm',
      'no-vehicle (laboratory mid-discovery) — science-bay interior with alien-artifact (trans-purple crystalline element) suddenly GLOWING under analysis, lead scientist MID-RECOIL with hands raised, secondary scientist mid-shout warning into a comm, instruments mid-overload (sparks)',
      'no-vehicle (escape pod interior mid-ejection) — cramped pod with three minifigs strapped into bench seats mid-launch-G with bodies pressed back into seats, trans-yellow alert overhead, the parent-ship debris visible through the porthole behind receding, the moment of separation',
      'no-vehicle (mission control room mid-crisis) — Apollo-era ground-control room with wall-board flashing red status, console-operators MID-ACTION at their stations, flight-director MID-SHOUT of orders, executive-gallery above watching in tense silence, mid-anomaly-response moment',
      'no-vehicle (alien planet vista mid-discovery) — wide alien-planet surface with three EVA explorers cresting a ridge to suddenly see what\'s in the valley below, lead explorer MID-FREEZE pointing toward the discovery, vast curved planet-horizon receding behind',
      'no-vehicle (lunar landscape mid-rescue) — light-bley lunar surface with one Classic Space astronaut MID-SPRINT toward a fallen second astronaut, lunar-rover damaged in mid-distance, Earth-rise on the horizon, mid-emergency moment',
      'no-vehicle (Mars colony surface mid-dust-storm) — rust-red Mars surface with colonists MID-RUSH for shelter, equipment-modules being abandoned mid-procedure, dust-particle trans-orange elements obscuring the deep-distance, mid-storm-arrival',
      'no-vehicle (asteroid surface mid-claim-dispute) — dark-bley asteroid surface with two mining-crews MID-CONFRONTATION at a shared extraction-site, drills mid-stop, lead figures from each crew mid-shout-distance with weapons holstered, deep-vacuum overhead',
      'no-vehicle (alien jungle mid-encounter) — biome-coded alien jungle with trans-green + trans-purple alien-flora, EVA scientists MID-FREEZE as they see something move in the foliage, bioluminescent trans-cyan accents pulsing in alarm-pattern, hidden-threat tension',
      'no-vehicle (Coruscant-coded planet-city mid-chase) — vast ecumenopolis with sky-towers receding, two minifig pedestrians MID-SPRINT across a sky-bridge with pursuer minifig mid-leap behind, transit-lanes streaking trans-yellow below, urban-chase scale',
      'no-vehicle (orbital megacolony O\'Neill cylinder mid-festival) — vast cylindrical habitat interior with curved-floor cities on the opposite-arc, plaza filled with celebrating minifigs MID-DANCE, trans-color confetti elements drifting, mid-celebration packed-crowd energy',
      'no-vehicle (asteroid mining city mid-shift-change) — hollowed-asteroid interior with multi-deck habitats, tram-station packed with miner-minifigs MID-COMMUTE between shifts, lead miner MID-WAVE to a coworker, working-class daily-life-with-energy moment',
      'no-vehicle (Citadel-coded station-city mid-diplomatic-tension) — multi-arm hub interior with multi-species crowds on the concourse, two opposing diplomats MID-CONFRONTATION at the atrium center, surrounding crowd MID-RECOIL, the political-incident-moment',
      'no-vehicle (lunar capital mid-arrival-parade) — glass-dome capital with welcome-celebration in the plaza, minifig crowds MID-WAVE up at an arrived-shuttle landing-trail still visible overhead, banners + confetti elements, Earth-rise behind',
      'no-vehicle (spaceport hub mid-arrest) — multi-species spaceport concourse with security-officers MID-PURSUIT of a fleeing smuggler-minifig, customs-agent at a desk mid-call for backup, multi-species crowds MID-SCATTER, Mos-Eisley criminal-incident',
      'no-vehicle (Babylon-5-coded torus mid-trade-dispute) — toroidal station-interior with multi-level concourse, two trader-minifigs MID-SHOUT at each other across a brick-built trade-table, surrounding multi-species shoppers MID-STARE, the public-dispute moment',
      "Classic LEGO Space lunar-rover (1978-1987 lineage, 6970 Beta-1) — open-cockpit yellow-and-grey rover, six fat trans-blue wheels, single rear-mounted antenna, 1-2 crew capacity, the iconic LEGO Space surface-vehicle profile",
      "Classic LEGO Space Cosmic Fleet Voyager (6985 lineage) — long cigar-shaped main hull with two engine-pods, trans-blue cockpit canopy at the bow, vintage Classic-Space yellow-grey palette, 4-6 crew capacity",
      "Blacktron I Mission Commander (6986 lineage) — angular wedge-shaped fighter in black with neon-yellow trim, twin trans-yellow cockpit canopies, deltawing-style profile, 2 crew capacity",
      "M-Tron Mega Core Magnetizer (6989 lineage) — red-and-black hauler with prominent dorsal magnet-coupling, exposed magnet-elements on the hull-sides, lime-green trim, 3-4 crew capacity",
      "Ice Planet 2002 Deep Freeze Defender (6973 lineage) — white-orange Ice-Planet vehicle with twin trans-orange cockpit canopies, ice-saw-blade-element on the bow, 2 crew capacity",
      "Galaxy Squad split-ship Vermin Vaporizer (70704 lineage) — modular fighter that physically splits into two halves at a Technic-pin coupling, orange-cyan palette, 2 crew capacity",
      "Insectoids hive-ship (1998 lineage) — organic curved hull-form in purple-and-lime-green with trans-purple wing-panels, alien-bug aesthetic, 4-6 crew capacity",
      "Mars Mission lander (2007 lineage) — white-orange Earth-astronaut craft with quad-thruster lander legs, trans-orange engine glow, 3 crew capacity",
      'Space Police III pursuit cruiser (5974 lineage) — sleek white-and-blue pursuit cruiser with twin pursuit-engines and trans-blue forward shield, 2 crew capacity',
      "Classic LEGO Space Galaxy Explorer (497 lineage) — long cigar-shaped trans-blue cockpit hull with twin rear-engine pods and folding solar-panel arms, the original 1979 LEGO Space flagship, 4 crew",
      "Space Police I Galactic Peace Keeper (6886 lineage) — blue-and-white pursuit cruiser with twin trans-blue cockpit canopies and bow-mounted comm-dish, 1989 LEGO law-enforcement heritage, 2-3 crew",
      "Tintin Destination Moon lander — red-and-white checkered classic 1950s tintin space-rocket silhouette, tail-fins stabilizing the base, retro-future fictional space-craft canon",
      "2001 ASO Discovery One — central pod-shaped command sphere + long spinal truss + spherical fuel-tanks at the tail, no-wings hard-SF spacecraft, 5 crew capacity",
      "Asteroid-mining hauler STARSHIP — boxy industrial interstellar cargo-vessel with prominent claw-arms + ore-bay aft, multiple fuel-tanks externally mounted, working-class space-craft profile",
      "Apollo CSM-style command module — bell-shaped capsule + cylindrical service-module + nozzle, 3 crew capacity, the iconic 1960s NASA Apollo Command-Service Module silhouette",
    ],
    instructions: `Each entry is ONE subject-class anchor, 12-30 words. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. WEIGHTED OUTPUT: ~50% no-vehicle variants (interiors + landscapes + space-cities) + ~50% ship/vehicle variants. STRICT BANS: never mention BOTH a ship AND an interior in the same entry; never use bare "frigate / cruiser / corvette" without "STARSHIP" or "interstellar" qualifier. NO-VEHICLE entries must specify what IS the dominant subject.`,
  },

  // ─── register — era+faction bender ───
  brickbot_space_register: {
    format: 'simple',
    theme: `SPACE REGISTER — era + faction lock for each render. Each entry is ONE specific LEGO-Space-canon or sci-fi-canon register that controls the crew attire + build motifs + props. Each entry 20-40 words.

⚠️ WEIGHTED DISTRIBUTION — Kevin's 10-heart calibration 2026-05-22 showed iconic LEGO Space heritage > hard-SF realism. Pool weights:
  • ~80% ICONIC LEGO SPACE HERITAGE — Classic Space 1978-87 / Blacktron I+II / M-Tron / Space Police I-III / Ice Planet 2002 / Galaxy Squad / Insectoids / Mars Mission / Unitron
  • ~15% RETRO-FANTASY NON-LICENSED — Tintin Destination Moon / Foundation Genetic Dynasty (Asimov-Apple) / Apollo-era NASA historical / 2001 ASO
  • ~5% SPECIALTY — Foundation imperial palace + Classic LEGO Space rare variants

NEVER LEGO Star Wars (X-wings / TIEs / Falcon / Star Destroyer / stormtroopers / Mandalorian / Beskar / Imperial / Rebels / Jedi) — that IP is OUT of scope for BrickBot.

NEVER hard-SF realism registers (Mass Effect / Normandy / N7 / Expanse / Rocinante / Martian Marine / cyberpunk-space / solarpunk-space) — they photoreal-drift away from the LEGO MOC signal.

REGISTER CATEGORIES — distribute as:
  • ~12% CLASSIC LEGO SPACE (1978-1987) — yellow-and-grey astronaut suits, trans-blue cockpit-canopies, fictional friendly-explorer Earth-fleet
  • ~7% SPACE POLICE (I-III) — white-and-blue sci-fi cop force, the 1989+ LEGO law-enforcement-in-space variant
  • ~7% ICE PLANET 2002 — white-and-orange ice-themed explorer faction with ice-saw equipment, the 1993 LEGO arctic-space theme
  • ~5% UNITRON (1994) — blue-and-white friendly explorer variant of Classic Space
  • ~5% MARS MISSION (2007) — astronauts vs aliens, white-orange-grey palette
  • ~5% INSECTOIDS (1998) — purple-and-green organic alien faction
  • ~10% BLACKTRON I + II — black-and-neon-yellow antagonist faction, the iconic 1987-1993 LEGO Space rivals
  • ~7% M-TRON (1990-1991) — red-and-black magnet-themed faction
  • ~5% GALAXY SQUAD (2013) — orange-and-cyan bug-fighters with split-ship motif
  • ~7% APOLLO-ERA NASA HISTORICAL — pure-white Apollo-era spacesuits, gold-foil heat-shielding, Saturn-V launch-team gear
  • ~5% FOUNDATION IMPERIAL GENETIC DYNASTY — Empire-purple imperial officer + ornate-galactic uniform / Cleon dynasty / Asimov-Foundation canon
  • ~5% STAR CITIZEN MERCENARY CREW — mercenary multi-faction-coded crew in earth-tones with hacked-tech accessories, multi-species crew composition
  • ~3% CLASSIC LEGO SPACE LUNAR BASE (1979-83) — yellow-and-grey moonbase variants with trans-blue dome cluster
  • ~3% CLASSIC LEGO SPACE SPACE-STATION — additional Classic Space space-station crew variant
  • ~3% TINTIN DESTINATION MOON RETRO — red-and-white checkered tintin-rocket aesthetic, 1950s comic canon
  • ~2% 2001 A SPACE ODYSSEY — minimalist all-white spacesuits, Discovery-One aesthetic, Kubrick canon
  • ~2% FOUNDATION (Apple/Asimov) — Empire-purple imperial aesthetic, Foundation-cream rebellious aesthetic
  • ~2% CLASSIC LEGO SPACE DEEP-PATROL — additional Classic Space variant with deep-space patrol motif
  • ~2% TINTIN DESTINATION MOON VARIANT — additional retro Tintin-coded variant
  • ~2% APOLLO 1960s NASA REAL-HISTORICAL — historically-accurate Apollo astronauts + Saturn-V launch teams

Each entry must:
• Name the register in first 4-8 words
• Specify CREW ATTIRE characteristics (suit color / helmet style / weapon-type)
• Specify BUILD MOTIFS (signature elements / faction marker)
• Specify any restrictions (when register fires, vehicle_class auto-aligns)`,
    touchpoints: [
      "CLASSIC LEGO SPACE (1978-1987) — yellow-torso astronaut suits with white air-tank backpacks, trans-blue cockpit canopies, fictional friendly-explorer Earth-fleet, the path's brand-center register",
      "SPACE POLICE I (1989-1991) — white-and-blue sci-fi cop force with trans-blue visors, anti-grav cruiser variants, prisoner-transport equipment, the LEGO law-enforcement-in-space heritage",
      "SPACE POLICE III (2009-2010) — refresh of Space Police with chrome-blue + neon highlights, more aggressive antagonist-pursuit hardware, the LEGO 2009 reboot canon",
      "ICE PLANET 2002 (1993) — white-and-neon-orange ice-themed explorer faction with ice-saw-blade equipment + ice-crystal trans-pieces, the iconic 1993 LEGO arctic-space theme",
      "UNITRON (1994) — blue-and-white friendly explorer faction with mecha-and-cruiser variants, the lesser-known but heritage-coded Classic-Space cousin",
      "MARS MISSION (2007) — Earth-astronaut white-orange-grey suits vs Martian-alien grey-with-glowing-trans-orange-orbs, dueling-faction motif, the 2007 LEGO theme",
      "INSECTOIDS (1998) — purple-and-green organic-alien faction with bug-themed vehicles, trans-purple wings, alien-flora props, the LEGO 1998 alien-faction canon",
      "BLACKTRON I (1987-1990) — black-with-neon-yellow antagonist faction, wedge-shape ship silhouettes, the iconic 1987 LEGO Space rival force; vehicle_class becomes Blacktron variant",
      "BLACKTRON II (1991-1993) — refresh of Blacktron with more aggressive wedge profile + extending wing motif, the 1991 LEGO Blacktron successor canon; vehicle_class becomes Blacktron II variant",
      "M-TRON (1990-1991) — red-and-black faction with magnet-coupling motif on every vehicle, lime-green accent trim, the iconic magnet-themed 1990 LEGO Space variant; vehicle_class becomes M-Tron magnet-cruiser variant",
      "GALAXY SQUAD (2013) — orange-and-cyan modular-fighter faction with bug-alien rivals, ship-split-in-half mechanic, the 2013 LEGO theme; vehicle_class becomes Galaxy Squad split-ship variant",
      "APOLLO-ERA NASA HISTORICAL — pure-white Apollo-era spacesuits with gold-foil reflective heat-shielding, Saturn-V launch-team in flight-overall white shirts + skinny ties, the 1960s NASA program heritage",
      "FOUNDATION IMPERIAL GENETIC DYNASTY — Empire-purple imperial-officer attire, ornate-galactic-imperial uniforms with gold trim, the Asimov-Foundation Cleon dynasty canon",
      "CLASSIC LEGO SPACE SPACE-STATION — yellow-and-grey crew at an iconic Classic LEGO Space space-station with trans-blue dome cluster and rotating habitat-arms, 1980s heritage motif",
      'CLASSIC LEGO SPACE LUNAR BASE COMMAND — yellow-torso astronaut crew at a Classic-Space-era moonbase command post, trans-blue dome cluster, light-bley lunar terrain, the 1979-1983 LEGO Space moonbase heritage',
      "CLASSIC LEGO SPACE DEEP PATROL — yellow-torso patrol crew variants with deep-space patrol motif, longer-mission gear, exploration-style equipment, the 1980s LEGO Space exploration heritage",
      "TINTIN DESTINATION MOON — red-and-white checkered classic 1950s tintin-rocket astronauts with retro-bubble-helmets, the 1953 Hergé comic canon; vehicle_class becomes Tintin retro-lander",
      "2001 A SPACE ODYSSEY — minimalist all-white spacesuits with mirror-visor helmets, Discovery-One aesthetic, sterile Kubrick-canon palette; vehicle_class aligns to Discovery One",
      "FOUNDATION (Apple/Asimov) GENETIC DYNASTY — Empire-purple imperial-officer attire, ornate-galactic-imperial uniforms; vehicle_class becomes Imperial Foundation-cruiser variant",
      "TINTIN DESTINATION MOON HERGÉ — red-and-white checkered retro-rocket astronauts in bubble-helmet bone-white spacesuits, 1953 Hergé comic-canon, vehicle_class aligns to Tintin retro-lander",
    ],
    instructions: `Each entry is ONE space register lock, 20-40 words. Format: "REGISTER NAME CAPS — attire + motif + restrictions". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. WEIGHTED OUTPUT (per Kevin's 10-heart calibration 2026-05-22): ~80% iconic LEGO Space heritage (Classic Space variants / Blacktron I+II / M-Tron / Space Police I-III / Ice Planet 2002 / Galaxy Squad / Insectoids / Mars Mission / Unitron) + ~15% retro-fantasy non-licensed (Tintin Destination Moon / Foundation Genetic Dynasty / Apollo NASA / 2001 ASO) + ~5% specialty. STRICT BANS: (1) NEVER include LEGO Star Wars references (no X-wings / TIEs / Falcon / Star Destroyers / stormtroopers / Mandalorian / Beskar / Jedi / Rebels / Imperial — that IP is OUT of scope for BrickBot); (2) NEVER hard-SF realism (no Mass Effect / Normandy / Expanse / Rocinante / Star Citizen / cyberpunk / solarpunk — they photoreal-drift); (3) no register-mixing within a single entry.`,
  },

  // ─── scene_props — diorama fill (pickN:2) ───
  brickbot_space_scene_props: {
    format: 'simple',
    theme: `SPACE DIORAMA STORYTELLING PROPS — small brick-built details that fill the corners of a space scene and add narrative depth. Each entry is ONE specific prop with a story implied. Each entry 12-30 words.

⚠️ Picked TWO PER RENDER (pickN:2), so each entry must be SMALL enough to coexist with another.

VARIETY MANDATE — distribute across:
  • EQUIPMENT (astronaut helmet on rack / EVA tool-belt / datapad / repair-drone / scanner / portable-airlock)
  • CARGO / SUPPLIES (ration packs / oxygen tank / fuel-cell / water-container / med-kit / crate-with-warning-label)
  • ALIEN ARTIFACTS (crystalline object in trans-piece / glowing orb / monolith fragment / alien-script tile)
  • DEBRIS / WRECKAGE (drifting hull-fragment / shattered solar-panel / spent fuel-rod / damaged escape-pod / floating glove)
  • PERSONAL / EMOTIONAL (photo-tile / wedding-ring on plate / mission-patch tile / dog-tag / pet-cat-in-canister)
  • TROPHIES / FLAGS (planted flag-element / mission-banner / first-foot plaque / mounted artifact)
  • LIVING COMPANIONS (alien-pet-creature / ship's-cat in zero-G / micro-robot / lab-rat-in-cage)
  • COMMUNICATION (comm-console / radio-receiver / hologram-emitter with trans-pieces / message-tile)
  • NAVIGATION (sextant / compass-tile / star-chart on table / orbital-map display)
  • WEAPONS-LITTER (dropped blaster / spent ammo-clip / charge-pack / disabled-drone fragment)
  • SCALE-PROVER MICRO-FIGS (lone explorer at edge of frame / scientist with notebook / engineer with cable-reel)
  • STATION / SHIP DETAIL (port-window with view / hand-rail / hatch / vent-grating / fire-extinguisher in red)

Each entry must:
• Name the prop in first 3-6 words
• Specify the SPECIFIC LEGO BRICK PARTS where applicable
• Imply a STORYTELLING CONTEXT`,
    touchpoints: [
      "Astronaut helmet on a brass-hook — minifig spacesuit-helmet accessory hanging on a clip-and-bar bracket-mounted to a bulkhead, the crew-member's-quarters detail, recently removed after shift",
      "Datapad on the console — printed 2×2 datapad-tile lying on a flat brick-built console surface, a minifig stylus accessory beside, mid-shift recordings paused",
      "Open ration-pack on a tray — 1×2 trans-clear tray with 1×1 round tile food-pieces scattered, a half-empty rations-pack-tile, the crew-mess-hall detail",
      "Spent fuel-cell on the deck — dark-bley cylinder-element with trans-orange spark-emission residue at the top, lying on its side on the deck-plating, post-emergency-jettison evidence",
      "Pet cat in zero-G canister — a brick-built micro-pet-cat suspended in mid-air inside a trans-clear cylinder-canister with a clip-on lid, the ship's mascot detail",
      "First-foot mission patch tile — printed mission-patch-tile mounted on a 1×2 plate as a bulkhead-wall trophy, the crew's-pride-of-mission marker",
      'Planted flag-element on lunar surface — minifig flag-accessory in a 1×1 round-plate base on a light-bley slope brick lunar-surface, the iconic Apollo-era first-foot moment',
      "Trans-purple alien crystal on a stand — 1×1 trans-purple round-stud jewel-piece on a gold round-plate cradle, glowing-faint-emission implied, the recently-discovered artifact",
      "Drifting EVA glove — single minifig spacesuit-glove accessory drifting in mid-air slightly off-vertical, evidence of a recent EVA accident or theft",
      "Hologram-emitter with trans-blue projection — brick-built emitter-pedestal with a trans-blue 1×2 plate angled upward representing a projected-message, a captain mid-recording-playback prop",
      "Repair-drone on standby — brick-built micro-drone (1×1 round body + 2 antenna-piece arms + light-up trans-element eye) hovering or perched on a service-rack, the ship's-maintenance helper",
      "Med-kit case open on the floor — 2×3 case-element open with 1×1 trans-red round-plate medical-marker visible inside, scattered medical-supplies, a recent-injury evidence detail",
      "Dog-tags on a chain — minifig chain-piece with 1×1 round-tile dog-tags hanging off a bunk-bedrail, the absent-crew-member memorial detail",
      "Spent blaster bolt-element on the deck — single trans-red 1×1 bar element lying on the deck where the bolt-strike landed, smoking-faint-emission detail, the post-combat aftermath",
      "Disabled drone fragment — broken brick-built drone-segment lying on the deck with sparking trans-yellow elements at the breakage-point, the recent-defense-engagement evidence",
      "Ration-pack stash in a wall-niche — 1×2 niche built into a bulkhead with stacked ration-pack-tiles, hidden-emergency-supplies the crew's-private-cache detail",
      "Hand-painted mission patch on a flightsuit — printed minifig-torso with custom mission-patch detail visible, the personalized-veteran-pilot detail visible up-close",
      "Trans-yellow warning-light strip overhead — 1×4 trans-yellow round-tile strip mounted on a ceiling-beam glowing alert-pattern, the system-emergency ambient detail",
      "Personal photo-tile on a bunk — printed family-photo-tile mounted on a 1×2 plate above a crew-bunk, the homesick-crew-member detail",
      "Cup-of-coffee-in-zero-G — 1×1 trans-clear cylinder with trans-brown 1×1 round-plate liquid floating in a globule above the cup-rim, zero-G physics joke detail",
    ],
    instructions: `Each entry is ONE space diorama prop, 12-30 words. Format: "PROP NAME — brick-parts + story-context". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO real-world materials without naming brick parts; NO centerpiece-sized props; small storytelling-detail props only.`,
  },

  // ─── lighting — axis-clean ───
  brickbot_space_lighting: {
    format: 'simple',
    theme: `LEGO MOC SPACE LIGHTING — axis-clean light SOURCE + DIRECTION + COLOR-QUALITY entries for the space path. Each entry is ONE specific lighting setup. Each entry 15-30 words.

⚠️ AXIS-CLEAN MANDATE. Lighting pool owns ONE conceptual lane: light source + direction + color quality.

⚠️ HARD BANS:
  • NO cosmic phenomena: nebula clouds / supernova flash / aurora-belt / black-hole-event (those belong to cosmic_phenomenon axis)
  • NO scene elements: hangar / bridge / hull / cockpit / cargo-bay (those belong to scene_type / camera_framing axes)
  • NO minifig action language ("light catching astronaut's face")
  • NO color-cast OVERRIDE language

✓ VARIETY MANDATE — distribute across (with COOL/VIOLET weighting to counter Flux's warm bias):
  • DEEP SPACE COOL (binary-star backlight blue-and-amber / distant-sun raking cool-white / starlight-only blueblack)
  • PRACTICAL SHIP LIGHTS (cockpit instrument trans-amber underlit / corridor cool-fluorescent overhead / bridge trans-cyan console-glow)
  • PLANETSIDE NATURAL (alien-sun cool-violet overhead / red-dwarf rust-orange raking / ice-planet diffuse cool-blue)
  • ENGINE / THRUSTER FLARE (trans-orange thruster glow up-back / trans-blue ion-engine pulse / trans-yellow burn-flash)
  • EMERGENCY / ALERT (klaxon trans-red strobe / amber-alert pulsing / dim-emergency-only cool-blue)
  • EVA / SUIT-LIGHT (helmet-mounted spotlight tight cone / suit-shoulder-light wide cool-white)
  • CHIAROSCURO DEEP-SHADOW (single-source dramatic chiaroscuro in interior / cool-source-against-deep-shadow)
  • CONSOLE / SCREEN LIGHT (trans-blue console-uplight on operator-face / trans-green radar-screen tint)
  • PLANET-REFLECTED (cool-blue Earth-glow lighting one side / warm Mars-rust reflected onto craft hull)
  • DRYDOCK / FLOOD-LIGHTS (harsh cool-white refit-pad floods / warm-yellow gantry-light pools)`,
    touchpoints: [
      "BINARY-STAR BACKLIGHT COOL-AMBER — two distant suns from opposite sides of the deep distance casting overlapping cool-blue + warm-amber shadows, the warm-cool split lighting creating dramatic dual-tone illumination, sharp-edged shadows",
      "DEEP-SPACE STARLIGHT-ONLY BLUEBLACK — no proximate light source, only faint blue-black starfield ambient, very dim cool-blue color quality, surfaces barely defined, the lonely-vacuum register",
      "COCKPIT TRANS-AMBER UNDERLIT — interior light from cockpit instrument panels glowing warm-amber upward onto the pilot's helmeted-face, dramatic underlit chiaroscuro, deep-shadow on the upper half of the canopy",
      "ENGINE THRUSTER GLOW UP-BACK — bright trans-orange + trans-yellow thruster-flare from behind the subject ship, warm hot color quality on the ship's stern, cool-deep-shadow on the bow, dramatic backlit silhouette",
      "ALIEN-SUN COOL-VIOLET OVERHEAD — distant cool-violet sun directly overhead casting cool-violet color quality on all upward surfaces, sharp short shadows, the iconic-alien-world signature lighting",
      "KLAXON TRANS-RED STROBE — red emergency-alert light from overhead trans-red elements pulsing across the scene, harsh saturated-red color cast on all lit surfaces, deep-black shadows, the system-emergency register",
      "EVA HELMET SPOTLIGHT CONE — tight cool-white spotlight cone from a helmet-mounted lamp directed forward, hard-edged light-shaft, surrounding darkness on the unlit portions, deep-vacuum register",
      "RED-DWARF SUN RAKING RUST — small red-dwarf sun low-angle from one side casting rust-orange + saturated-amber color quality on the lit side, long deep-purple shadows opposite, the alien-cool-star register",
      "ICE-PLANET DIFFUSE COOL-BLUE — overhead overcast bright-but-diffuse cool-blue color quality on all surfaces, soft shadows, the ice-planet bouncing-light register, slightly desaturated",
      "MARS-RUST REFLECTED HULL — close to Mars-surface with the planet's rust-orange-and-tan glow reflected upward onto a hovering craft's underside, warm-rust color quality on the underside, cool-deep-shadow on the upper",
      "EARTH-GLOW BLUE FROM-BELOW — close to Earth-orbit with the planet's cool-blue glow filling the underside of a craft from below, soft-blue color quality on undersides, the iconic-orbit register",
      "CHIAROSCURO INTERIOR SINGLE-SOURCE — interior scene with a single window or porthole as the only light source, warm color quality on the lit edge of the subject, deep-black void on the other 80% of frame",
      "DRYDOCK FLOOD-LIGHTS COOL-WHITE — harsh cool-white industrial flood-lighting from multiple gantry-mounted lamps, hard-edged shadows from each light direction, the refit-pad register",
      "MISSION-CONTROL FLUORESCENT FLAT — overhead fluorescent-strip lighting casting cool-fluorescent-blue flat illumination across the room, no directional shadows, the 1960s-NASA mission-control register",
      "BLUE-CONSOLE UPLIT OPERATOR — trans-blue console-glow lighting the operator's face from below, cool-cyan color quality, the bridge-screen-uplight register, dramatic underlit chiaroscuro",
      "AMBER-ALERT PULSE LOW — soft pulsing amber-alert lighting from waist-height alert-strips, warm color quality on the lower-half of objects, cool darker shadow on the upper-half, the secondary-alert register",
      "WARP-DRIVE TRANS-BLUE PULSE — trans-blue saturated pulse light from a warp-drive event near the subject ship, cool electric-blue color cast across the entire scene, the FTL-jump register",
      "LANDING-PAD FLOOD-LIGHTS WARM — yellow-amber landing-pad flood-lights from multiple bases at the pad corners, warm color quality on the descending craft underside, the pad-arrival register",
      "TWILIGHT-PLANET BLUE-PURPLE COOL — alien-planet twilight transitioning from cool-blue to cool-purple gradient, no direct light source, very low ambient, the world-ending-day register",
      "EVA-SUIT SHOULDER LIGHT WIDE — cool-white wide-beam light from a suit-shoulder-mounted lamp, less harsh than helmet-spotlight, wider falloff, the working-EVA register",
    ],
    instructions: `Each entry is ONE space-scene lighting setup, 15-30 words. Format: "SOURCE+DIRECTION CAPS — color quality + signature". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO cosmic phenomena (nebula / supernova / aurora — those belong to cosmic_phenomenon); NO scene elements (hangar / bridge / hull / cockpit). SOURCE + DIRECTION + COLOR only.`,
  },

  // ─── palette — axis-clean color combos ───
  brickbot_space_palette: {
    format: 'simple',
    theme: `LEGO MOC SPACE PALETTE — axis-clean color-combination entries for the space path. Each entry is ONE specific multi-color palette for a space diorama. Each entry 12-25 words.

✓ VARIETY MANDATE — distribute across space-coded palettes:
  • CLASSIC LEGO SPACE (yellow + medium-grey + trans-blue + white)
  • SPACE POLICE (white + sky-blue + chrome + trans-blue)
  • BLACKTRON I+II (black + neon-yellow + trans-yellow)
  • M-TRON (black + red + lime-green + brushed-steel)
  • ICE PLANET 2002 (white + neon-orange + trans-clear-blue + black)
  • UNITRON (blue + white + chrome + trans-clear)
  • MARS MISSION (white + orange + grey + trans-orange + tan)
  • INSECTOIDS (purple + lime-green + trans-purple + black)
  • GALAXY SQUAD (orange + cyan + black + trans-orange)
  • HARD-SF GUNMETAL (gunmetal + Alliance-blue + chrome + warning-stripe + matte-black)
  • FOUNDATION IMPERIAL (royal-purple + ornate-gold + cream-marble + dark-violet)
  • APOLLO-ERA NASA (pure-white + American-red + American-blue + chrome + gold-foil)
  • CLASSIC LEGO SPACE DEEP-PATROL (deep-grey + Classic-yellow + trans-blue + chrome-silver)
  • TINTIN RED-AND-WHITE (red + white + checker + chrome + tan)
  • 2001 ASO STERILE (clean-white + chrome + black + trans-clear)
  • FOUNDATION IMPERIAL PURPLE (royal-purple + gold + cream + dark-violet)
  • CLASSIC LEGO SPACE LUNAR (yellow + light-bley + trans-blue + cream-white + grey)
  • TINTIN DESTINATION MOON (red + cream-white + checker-pattern + chrome + tan)
  • APOLLO ERA NASA (pure-white + American-red + American-blue + chrome + gold-foil)
  • NEBULA COSMIC (deep-magenta + cosmic-cyan + violet + indigo + starfield-black)
  • DEEP-SPACE BLACK (matte-black + chrome + occasional-trans-blue + cool-grey)
  • EMERGENCY ALERT (klaxon-red + warning-yellow + matte-black + chrome-steel)
  • BIOLUMINESCENT ALIEN-CAVE (trans-cyan + trans-green + black + dark-purple)

Each entry must:
• Name 3-5 specific colors with anchor-nouns
• Use specific color-modifier vocabulary (chrome / matte / weathered / saturated / cool / brushed)
• End with a brief register tag (Classic-Space / Blacktron / Mars-Mission / Mass-Effect)
• NEVER drift into lighting language (no "thruster-glow orange") — describe colors as MATERIAL colors`,
    touchpoints: [
      "Yellow + medium-grey + trans-blue + white, Classic-LEGO-Space",
      "White + sky-blue + chrome + trans-blue + LED-cyan, Space-Police-I",
      "Black + neon-yellow + trans-yellow + matte-grey, Blacktron-I",
      "Black + red + lime-green + brushed-steel + magnet-coupling-yellow, M-Tron",
      "White + neon-orange + trans-clear-blue + black + ice-crystal-cyan, Ice-Planet-2002",
      "Blue + white + chrome + trans-clear-blue + medium-grey, Unitron",
      "White + Mars-orange + grey + trans-orange + tan, Mars-Mission",
      "Purple + lime-green + trans-purple + black + alien-bone-white, Insectoids",
      "Orange + cyan + black + trans-orange + bug-alien-green, Galaxy-Squad",
      "Orange + cream-white + brown + tan + olive-drab + rebel-red-trim, LEGO-Star-Wars-Rebels",
      "Black + dark-grey + cream-white + chrome + Imperial-red-trim, LEGO-Star-Wars-Imperial",
      "Royal-purple + ornate-gold + cream-marble + dark-violet + Imperial-trim-gold, Foundation-Imperial-palace",
      "Gunmetal + Alliance-blue + chrome + warning-yellow-stripe + matte-black, Mass-Effect",
      "White + neon-orange + trans-clear-cyan + bone-cream + ice-crystal-blue, Ice-Planet-2002-additional",
      "Bright-red + cream-white + checker-pattern + chrome + tan, Tintin-Destination-Moon",
      "Clean-white + chrome + matte-black + trans-clear-blue, 2001-ASO-Discovery",
      "Royal-purple + ornate-gold + cream + dark-violet + Empire-trim-gold, Foundation-Imperial",
      "Neon-magenta + cyber-yellow + matte-black + chrome + acid-green, Cyberpunk-space",
      "Warm-amber + leaf-green + cream + sky-blue + terracotta-clay, Solarpunk-space",
      "Pure-white + American-red + American-blue + chrome-silver + gold-foil, Apollo-NASA",
      "Deep-magenta + cosmic-cyan + violet + indigo + starfield-black, Nebula-cosmic",
      "Matte-black + chrome + cool-grey + occasional-trans-blue, Deep-space-void",
      "Klaxon-red + warning-yellow + matte-black + chrome-steel, Emergency-alert",
      "Trans-cyan-glow + trans-green-fungus + matte-black + dark-purple + cave-stone-grey, Bioluminescent-alien-cave",
      "Worn-chrome + dirty-yellow + grease-black + rust-orange, Working-class-hauler",
      "Sterile-white + chrome + medical-blue + trans-clear, Med-bay-clinical",
      "Tan-canvas + brown-leather + brass-rivets + faded-blue, Mars-colony-rustic",
      "Hot-red + amber + heat-blackened-steel + smoke-grey, Reactor-overheating",
      "Lavender + pink + powder-blue + cream + chrome, Pastel-utopian-station",
      "Polished-marble + gold-trim + cream-white + obsidian-black, Foundation-imperial-palace",
    ],
    instructions: `Each entry is ONE space palette, 12-25 words. Format: comma-separated colors then comma + register-tag. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO lighting language ("thruster-glow"); NO scene elements; NO weather/phenomenon words. Material colors with anchors + register-tag.`,
  },

  // ─── cosmic_phenomenon — environmental drama (50%-gated) ───
  brickbot_space_cosmic_phenomenon: {
    format: 'simple',
    theme: `SPACE COSMIC PHENOMENON — atmospheric/cosmic event that AMPLIFIES the scene. Each entry is ONE specific cosmic event that can fire on a space diorama (50%-gated conditional). Each entry 20-40 words.

⚠️ DECOUPLED FROM scene_type AND lighting — bending axis. Lets us roll "asteroid mining + supernova flash" or "EVA + black-hole event-horizon-pull" — combinations unreachable in legacy.

VARIETY MANDATE — distribute across:
  • NEBULA EVENTS (towering nebula cloud / nebula-bloom expansion / nebula-eddy-current)
  • SUPERNOVA / STELLAR DEATH (supernova flash on horizon / dying-star coronal-event / pulsar-pulse-strobe)
  • BLACK HOLE / GRAVITY (event-horizon pull / gravity-wave distortion / accretion-disc visible / time-dilation lensing)
  • METEOR / DEBRIS (meteor shower streaks / asteroid-belt density-spike / hull-impact debris-cloud)
  • AURORA / ATMOSPHERIC (planetary aurora-belt / ionosphere-glow / magnetic-storm visualizer)
  • PLANET SHADOW (eclipse / planet-shadow falling across the scene / dual-eclipse on alien sun)
  • SOLAR EVENT (coronal mass ejection / solar-flare-glow / sunspot grouping)
  • ICE / CRYSTAL FIELDS (ice-crystal cloud / crystal-debris field / shattering-ice-shelf in low-G)
  • BIOLUMINESCENT (alien-bioluminescent surface bloom / phosphorescent-fog drift)
  • COSMIC DUST (interstellar dust cloud / scattered-dust haze / particle-stream nebula)
  • PLANETARY RING (Saturnine ring slice / ring-shadow crossing scene / ring-fragment cloud)
  • RIFT / PORTAL (visible space-time rift / dimensional-tear in vacuum / wormhole-entry distortion)
  • ALIEN FLEET APPROACH (silhouettes of incoming alien fleet on horizon / massive shape approaching from below)

Each entry must:
• Name the event in first 4-8 words
• Specify WHICH BRICK PARTS render it
• Specify the VISUAL IMPACT (focal point shift, color cast, motion)
• NEVER override lighting axis directly`,
    touchpoints: [
      "NEBULA TOWERING CLOUD — vast trans-magenta + trans-cyan + trans-purple layered plate-stack nebula cloud filling the entire upper-half of the frame as the deep-distance background, scattered 1×1 white round-plates as nebular haze, the cosmic-scale signature event",
      "SUPERNOVA FLASH ON HORIZON — blinding-white 4×4 round-tile flash with trans-yellow + trans-orange shockwave ring expanding outward across the deep-distance background, the moment-of-stellar-death captured mid-expansion",
      "BLACK HOLE EVENT-HORIZON PULL — circular trans-black + dark-bley disc at scene-center with trans-blue accretion-ring of plates wrapping outward, distorted starfield around the edges using lens-bending implied by tile-stretch, the gravitational-pull signature",
      "METEOR SHOWER STREAKS — multiple trans-orange + trans-yellow bar-elements + trans-red elements streaking diagonally across the brick-built sky-baseplate, each streak with a 1×1 round-plate impact-head, the cosmic-rain signature event",
      "PLANETARY AURORA-BELT — horizontal trans-green + trans-cyan + trans-magenta plate strips arranged in undulating curtains across the upper-frame above the planet horizon, the iconic-magnetic-pole signature",
      "PLANET-SHADOW ECLIPSE — large dark-bley 4×4 round-tile planet silhouette eclipsing a bright trans-yellow sun-disc in the deep-distance, with a thin trans-orange + trans-red diffraction-ring around the eclipse-edge, the iconic-orbital signature",
      "ASTEROID-BELT DENSITY-SPIKE — dense field of dark-bley round-bricks + crater-tile fragments + trans-grey 1×1 round-plates scattered across the foreground and mid-frame as a thick asteroid-belt, the navigation-hazard signature",
      "PULSAR-PULSE STROBE — cylindrical trans-yellow + trans-cyan beam-element emerging from a small distant pulsar-star at the rim of the frame, pulse-frequency visualized by repeating beam-segments, the navigation-beacon-of-doom signature",
      "RING-FRAGMENT CROSS — horizontal ring-of-fragments (1×2 + 1×4 dark-bley tile-fragments) crossing the frame at a steep angle, the planet-source visible in the deep-distance, the orbital-debris signature",
      "DIMENSIONAL RIFT TEAR — vertical trans-cyan + trans-magenta jagged-edge cone in the deep-distance representing a space-time rift with starfield bending toward the rift-mouth, the wormhole-tear signature",
      "ALIEN FLEET SILHOUETTE APPROACH — massive dark-bley silhouettes of multiple alien-ships looming on the deep-distance horizon, each silhouette built from black + dark-bley bricks against the bright cosmic background, the impending-doom signature",
      "ICE-CRYSTAL FIELD — field of trans-clear + trans-cyan 1×1 round + 1×2 tile pieces suspended at varying heights drifting through the vacuum around a ship, refracting the surrounding light, the cold-debris signature",
      "BIOLUMINESCENT ALIEN-SURFACE BLOOM — alien-planet surface glowing with scattered trans-cyan + trans-green 1×1 round-plates representing bioluminescent growth, the entire surface-bloom signature, the alien-world-life signature",
      "INTERSTELLAR DUST CLOUD — sparse field of 1×1 round-plates and 1×2 tile-fragments scattered across the entire scene as cosmic dust haze, trans-amber and trans-clear elements suggesting particles, navigation-hazard signature",
      "WARP-DRIVE ENTRY DISTORTION — trans-blue + trans-cyan light-cone exit from a hyperspace-jump in the mid-distance, stretched-light implied by elongated tile-strips, the FTL-arrival signature",
      "DUAL-SUN ECLIPSE — both suns of a binary-star system aligned with one eclipsing the other, the trans-yellow + trans-orange corona-ring visible around the eclipse-edge, dramatic dual-shadows on the foreground subjects, the binary-system signature",
      "SUNSPOT GROUPING — visible cluster of trans-black sunspots on the surface of a distant sun-disc in the deep-distance, the sun rendered as a 4×4 trans-yellow round-tile with dark-bley spot-clusters, the solar-activity signature",
      "ACCRETION DISC GLOW — wide trans-orange + trans-red glowing disc visible around a central black-hole or neutron-star, the disc rendered as flat plate-stack with bright trans-pieces toward the center, the cosmic-power-source signature",
      "METEOR IMPACT ON HULL — single large trans-orange flame-element + 1×1 white round-plate debris-cloud at the impact-site on a ship's hull, the moment-of-collision captured, the unexpected-strike signature",
      "PHOSPHORESCENT FOG DRIFT — drifting cloud of trans-green + trans-cyan 1×1 round-plates suspended at varying heights across the mid-frame, glowing-supernatural haze, the alien-atmosphere-anomaly signature",
    ],
    instructions: `Each entry is ONE space cosmic phenomenon, 20-40 words. Format: "EVENT NAME CAPS — brick-parts + visual-impact". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NEVER specify lighting color cast directly; NEVER lock crew/scene reaction language; environmental EVENT only.`,
  },

  // ════════════════════════════════════════════════════════
  // PIRATES PATH (2026-05-22 — first BrickBot axis migration)
  // ════════════════════════════════════════════════════════

  // ─── scene_type — narrative stage (the WHAT) ───
  brickbot_pirates_scene_type: {
    format: 'simple',
    theme: `LEGO MOC PIRATE DIORAMA SCENE STAGES — narrative-stage descriptions for the BrickBot pirates axis system. Each entry is ONE narrative stage (the WHAT — what category of pirate moment is this diorama?). Each entry 30-55 words.

⚠️ CRITICAL — entries describe the STAGE / SETTING / NARRATIVE CATEGORY only. NO camera framing language. NO minifig action verbs (those belong to a separate axis). NO build technique vocab. NO weather. Just: where are we, what kind of moment.

VARIETY MANDATE — distribute the entries across these narrative categories (target ~5-10% per category):
  • SHIP-ON-SHIP COMBAT — broadside cannonade / boarding-action / chase / fireship attack
  • TREASURE DISCOVERY — cave reveal / shipwreck salvage / x-marks-spot dig / hidden vault / cursed-chest opening
  • HARBOR / PORT LIFE — dockside loading / tavern stand-off / smuggler's cove / market chaos / black-market deal
  • CREW LIFE ABOARD — galley meal / belowdecks gambling / sail-mending / navigator working charts / capstan-hauling
  • CURSED / SUPERNATURAL — Davy Jones' Locker / ghost-ship encounter / cursed-crew transformation / Kraken summoning
  • SEA-MONSTER ATTACK — Kraken-arms wrapping hull / megalodon-leap / sea-serpent rising / phantom-fleet breach
  • NAVY / IMPERIAL CONFRONTATION — Royal Navy chase / flagship-vs-pirate stand-off / governor's-fleet blockade / court-martial deck
  • ISLAND HIDEOUT / EXPLORATION — jungle base reveal / lagoon-grotto entry / treasure-island landing / native encounter
  • MUTINY / CREW POLITICS — captain-overthrow mid-deck / pistol-duel-at-dawn / blackballed-into-rowboat-set-adrift / new-captain coronation
  • SHIPWRECK / SURVIVAL — beached-on-reef rescue / castaway raft / iceberg-impact / storm-survival lash-down
  • PARLEY / DIPLOMACY — pirate-council neutral-ground / flag-of-truce exchange / hostage-negotiation aboard / wedding-of-rival-captains
  • CHASE — predator-chase storm-pursuit / running-from-frigate-through-shoals / outsmart-via-reef / lure-into-trap

Each entry must:
• Name the narrative category in first 6-10 words
• Establish the diorama STAGE (deck / cave / dock / island / open sea / belowdecks / harbor / shipwreck / locker)
• Suggest the TENSION or STAKES of the moment (without prescribing the action verb)
• NEVER name a specific minifig action (no "captain swinging cutlass"; that's the minifig_action axis)
• NEVER name a specific weather event (no "storm-tossed waves"; that's the weather_drama axis)`,
    touchpoints: [
      'SHIP-ON-SHIP BROADSIDE COMBAT — two galleons locked in close-range cannonade, hulls less than a brick-length apart, gunports both decks alight with trans-orange flame elements, splintered hull-fragments mid-flight between vessels, the moment before the boarding lines launch',
      'TREASURE CAVE DISCOVERY — vast brick-built grotto interior with shafts of light from collapsed ceiling, mounded gold doubloons + jeweled chests + ceremonial weapons stacked waist-high, ancient skeletons in rotted finery propped against treasure-piles, a rope ladder descending from the ceiling-gap',
      'HARBOR DOCKSIDE TAVERN STAND-OFF — narrow brick-built dock between warehouse and a moored sloop, hanging tavern-sign creaking, lantern-lit windows, crates and barrels stacked tight, a pirate crew and a Royal Navy patrol facing off in the wedge between buildings',
      "DAVY JONES' LOCKER — ethereal underwater shipwreck graveyard, half-rotted galleon hulls leaning at impossible angles on the seafloor, drifting kelp + skeletal fish, trans-clear water-haze layered overhead, anchored hulls coral-encrusted, a faint phosphorescent glow",
      'KRAKEN ATTACK — colossal brick-built tentacles in trans-dark-green emerging from the brick-water around a three-masted galleon, suckers visible, tentacles wrapping the mainmast and the bowsprit, crew scattering across the deck, masthead-lanterns swinging wildly',
      "ROYAL NAVY FLAGSHIP STAND-OFF — a Royal Navy frigate in formal-white-with-red-trim hull-paint with all gun-ports open, broadside-on across two brick-length of open sea from a black-hulled pirate galleon flying the Jolly Roger, the moment of pre-engagement parley",
      'JUNGLE HIDEOUT REVEAL — pirate base hidden in dense brick-built jungle on a steep island slope, waterfall in trans-blue layered plates cascading past, ramshackle huts and a careened sloop being scraped of barnacles, jungle-canopy rigged with rope-walks',
      "MUTINY ON THE QUARTERDECK — pirate crew arrayed across the quarterdeck in a tense semicircle, captain alone at the rail flanked by two loyal officers, the moment-before-violence freeze with hands moving toward weapons, dawn-fog rolling across the deck",
      'SHIPWRECK SALVAGE — half-buried hull of an old wreck broken-back on a reef-island, sea-eroded ribs exposed, crew lowering barrels and chests from the canted deck to a longboat below, surf foaming around the wreck-base, gulls perched on the stern',
      'PIRATE-COUNCIL PARLEY — three pirate captains standing on a neutral-ground sandbar at low tide, each flanked by their crew, ships-at-anchor visible in the deeper water beyond, brick-built parley-flag pole between them with white pennant',
      'BURIED-TREASURE DIG — six crew members around a half-excavated pit on a beach with the chest just beginning to emerge from sand, palm trees fringing, parrot perched on a shovel-handle, dawn-light raking sideways across the dig-site',
      'SMUGGLER COVE NIGHT-RUN — small sloop pulling into a hidden cove between cliffs at deep-night, lanterns muffled, crates being passed dock-to-deck in chain-of-hands, the moment when a Royal Navy lantern appears at the cove-mouth',
      'CURSED CREW TRANSFORMATION — pirate crew mid-transition between human and skeleton forms in moonlit water beneath their ship, half-skeleton half-human variants visible, the cursed-chest open on the deck above',
      'CASTAWAY RAFT DRIFT — a single pirate on a brick-built raft of lashed-timbers in glassy open ocean, supplies tied down with rope, sail of tattered shirt, the vast empty horizon dominant',
      'BLACK-MARKET DEAL — narrow dockside alley between warehouse and harbor wall, two crews exchanging chests for crates, a lookout at each end of the alley, lantern-lit and tense, ledger-keeper at a barrel-side desk',
      'SEA-BATTLE BOARDING ACTION — two ships locked together with boarding planks deployed across the gap, crews mid-charge across the planks, smoke from both decks, the moment of impact between the wave of pirates and the defenders on the navy-ship deck',
      'GOVERNOR\'S FLEET BLOCKADE — three Royal Navy ships strung across a harbor mouth in blockade-line, a pirate vessel trapped inside the bay, the moment of decision before the run, harbor town visible behind on a hillside',
      'PIRATE WEDDING ABOARD SHIP — quarterdeck arrayed for a wedding between two pirate captains with their crews gathered, a brick-built arch of crossed-cutlasses and palm-leaves, the moment of vows, ship-flagged in celebratory pennants',
      'CHASE THROUGH SHOALS — pirate sloop running between barely-submerged reef-tops in a tight maze of brick-built shoal-water, a Royal Navy frigate in pursuit beyond the reef-line unable to follow due to draft, the cunning escape mid-frame',
      'CAPTAIN\'S CABIN PLOTTING — interior cutaway of a galleon\'s captain\'s cabin with brick-built oak-paneled walls, charts spread across the table, the captain and first mate poring over a treasure-map, lantern-glow, stern-window showing open ocean',
    ],
    instructions: `Each entry is ONE pirate narrative stage, 30-55 words. Format: "STAGE NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines. STRICT BANS: never include camera framing language ("WIDE / MEDIUM / CLOSE / wide-shot / aerial"), never include minifig action verbs ("captain swinging cutlass / crew hauling"), never include weather events ("storm-tossed / lightning-flash / dense fog"), never include lighting descriptors ("golden hour / candlelit / moonlit"). Those belong to other axes. Stage + tension only.`,
  },

  // ─── minifig_action — verb-led story beats ───
  brickbot_pirates_minifig_action: {
    format: 'simple',
    theme: `LEGO MINIFIG ACTION BEATS — verb-led story moments for the BrickBot pirates path. Each entry is a freeze-frame of minifigs IN MID-ACTION (the story beat), NOT minifigs posing in a setting. Each entry 25-45 words.

⚠️ HARD MANDATE — STORY BEAT MANDATE per the playbook. Every entry MUST start with an ACTIVE VERB and describe a moment with CAUSE + EFFECT in the same frame. Verbs like: leaping, slashing, hauling, lunging, parrying, brandishing, heaving, mid-toss, hurling, swinging, climbing, dragging, lifting, smashing, firing, dodging, falling, catching, rescuing, pinning, escaping, signaling.

⚠️ HARD BANS:
  • NEVER "minifigs standing around"
  • NEVER "captain posing on deck"
  • NEVER "crew watching" / "looking at" / "gazing at" / "wide-eyed at"
  • NEVER "characters arranged in semicircle"
  • NEVER passive states (sitting, resting, waiting, observing)

✓ Body-position variety — distribute across:
  • Mid-leap / mid-fall / airborne (~15%)
  • Mid-swing / mid-strike / mid-parry (sword/axe/club) (~20%)
  • Hauling / lifting / pulling (capstan, rope, rigging, dragging body, raising flag) (~15%)
  • Mid-fire / mid-reload (musket, pistol, cannon, bomb-fuse) (~10%)
  • Climbing / vaulting / running (rigging, rope-ladder, ship-side, rooftop) (~15%)
  • Diving / rescuing / catching (overboard, mid-air, falling-object) (~10%)
  • Multi-figure interaction (duel, brawl, formation-charge, rescue, hand-off) (~15%)

Each entry must:
• Start with an ACTIVE VERB
• Name 1-3 specific minifigs involved (captain, first mate, gunner, lookout, navy officer, cabin boy, etc.) with brief identifier (eye-patch / red-coat / yellow-hat / etc.)
• Describe the SHARED OBJECT or EVENT they're interacting with (cutlass, treasure chest, falling rigging, exploding barrel, kraken tentacle, etc.)
• Imply the moment-before and moment-after (this is a freeze-frame, not a pose)
• PLASTIC SCALE — these are minifigs, so describe their action AS minifig poses (C-shaped hand gripping cutlass, two-stud arms bent at parry-angle, etc.) — never anatomical detail`,
    touchpoints: [
      'Captain mid-leap from rigging to enemy deck, cutlass extended forward in C-grip, hat caught mid-air behind, defender minifig already raising shield in reaction, rope-end whipping back behind the captain',
      'Two crew members hauling on the capstan-bars mid-stride, third crew at the chain feeding it through the hawse-hole, fourth at the rail watching the heavy iron anchor breaking the brick-water surface',
      'First mate parrying a Royal Navy cutlass-strike with their own cutlass, both blades crossed at the brick-built guard, the sailor behind them already swinging a marlin-spike at the second navy attacker',
      'Gunner ramming the cannon-charge home with the rammer, second crew hauling on the gun-tackle to position, third crew with the lit match-cord ready at the touch-hole, all three mid-motion in coordinated reload',
      'Cabin boy mid-toss of a powder-keg with lit fuse trans-orange spark element rising, target enemy crew at the rail in mid-recoil-recognition, falling-arc trajectory implied by their crouch and the boy\'s follow-through',
      'Cursed-skeleton crew member mid-rise from the deck planks, ribcage-torso emerging through fog elements, the human crew member nearby already mid-stumble-backwards with cutlass dropping from their grip',
      'Captain hurling a grappling-hook trans-clear-fishing-line trailing from a C-grip arm, target enemy rail visible across the brick-water gap, second crew member behind already mid-pull on the line ready to haul',
      'Two minifigs in a sword duel mid-parry at the top of the quarterdeck stairs, the loser already mid-backstep with cutlass guard buckling, the winner pressing forward, third character below the stairs frozen mid-watch with hand-on-pistol',
      'Lookout minifig falling from the crow\'s-nest mid-air, mouth-printed in alarm-shout, rope-end whipping past as they pass the mainsail, deck crew below mid-rush toward the impact-point',
      'Crew member at the wheel mid-spin of the helm, body braced against the wheel, captain beside them mid-shout-into-storm with pointing-hand gesturing toward a course-line, navigator behind mid-stride toward the helm with chart in hand',
      'Pirate at the bow mid-leap onto a longboat below, cutlass mid-stab toward a defender mid-fall from the longboat into the brick-water, second longboat-defender mid-draw of a pistol turning toward the leaper',
      'Captain mid-rescue of a falling crew member, leaning over the rail with one C-grip on the rail and the other clenched on the falling sailor\'s wrist, the saved sailor mid-swing of free arm reaching upward, the brick-water below visible',
      'Two minifigs hoisting the Jolly Roger up the main mast, one at the deck pulling the halyard hand-over-hand, the other at the top of the mast guiding the flag into position, the flag mid-unfurl catching the wind',
      'Royal Navy officer mid-fire of a flintlock pistol toward a pirate mid-dodge at the rail, the pistol-flash trans-yellow flame element, the pirate mid-tumble over the side already in motion to roll behind the rail-cover',
      'Crew member mid-vault of the ship\'s rail onto a boarding plank, second crew mid-charge behind them with cutlass overhead, third crew at the rear of the line mid-loose-of-an-arrow toward the defenders',
      'Cook mid-throw of a heavy cooking-pot from the galley-door at a pirate-on-pirate-mutineer at the foot of the stairs, the mutineer mid-duck with arm raised in defense, broth-elements (trans-brown 1×1 round bricks) arcing through the air',
      'Mid-haul on the topsail-halyard by a row of four crew at the mast-base, the sail mid-rise up the mast, sail-trim crew at the yard mid-pull on the sheet-line to set the sail-angle',
      'Captain mid-stab of a cutlass through a chart pinned to the table, mid-shout at the gathered officers around him with finger-pointing at a marked location, navigator mid-recoil with hands up',
      'Two crew members mid-drag of a chest across the sand from the surf-line toward the longboat, third crew at the longboat mid-arms-out to receive the chest, fourth crew at the surf-line mid-scan toward the tree-line for threats',
      "Pirate mid-swing on a rope from the foretop down across the deck, cutlass trailing behind, target navy-officer at the helm mid-turn with sword half-drawn, the rope's anchor-point visible at the foretop with a crew member who released it",
    ],
    instructions: `Each entry is ONE pirate minifig action beat, 25-45 words. Format: free-form prose STARTING WITH AN ACTIVE VERB (Mid-leap / Hauling / Parrying / Hurling / Mid-toss / Climbing / Diving / etc.). Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO "minifigs standing", NO "captain posing", NO "watching" / "looking at" / "gazing", NO passive states. Story beat + verb + cause/effect always.`,
  },

  // ─── build_technique — MOC distinguisher ───
  brickbot_pirates_build_technique: {
    format: 'simple',
    theme: `LEGO MOC BUILD TECHNIQUE — AFOL-distinguishing brick-construction technique notes for the BrickBot pirates path. Each entry is ONE specific MOC technique that makes a pirate diorama read as "Bricklink AFOL convention build" instead of "official LEGO set photo." Each entry 25-45 words.

⚠️ THE BAR — these are the techniques AFOL builders use that win Brickworld + Brickfair Best-of-Show. The viewer who is a LEGO fan should INSTANTLY clock the cleverness.

VARIETY MANDATE — distribute across these technique categories:
  • SNOT (Studs Not On Top) construction — sideways-stud techniques for curves, hull-planking, organic shapes
  • Trans-piece use — trans-blue layered waves, trans-orange flame elements, trans-clear ice, trans-green poison, trans-yellow lantern-glow
  • Slope-brick + plate-curving — for rocky cliffs, hull-curves, sail-billowing, waves
  • Technic articulation — for cannon mounts, ship's wheel, hidden hinges, crane mechanisms, drawbridges
  • Illegal techniques — clutch-power-on-tile, brick-bending, unofficial connections AFOLs use anyway
  • Microscale tricks — minifig-accessory repurposed as macro detail (lightsaber-hilt as railing-post, croissant as decorative-scroll, banana as palm-leaf)
  • Printed-tile signature pieces — using specific rare printed tiles (treasure-map / compass-rose / skull-and-crossbones) as build-anchors
  • Studded-vs-tile texture contrast — deliberate studded areas for wood-plank texture, tiled areas for stone or polished surfaces
  • Brick-built rigging — antenna pieces as ratlines, string-and-bar as shrouds, flex-tube as cordage
  • Hidden cutaways — interior detail revealed by partial-wall builds (cross-section galleys, half-decks)

Each entry must:
• Name the technique TYPE in first 5-8 words
• Specify WHICH PIRATE BUILD ELEMENT it applies to (hull / mast / waves / cliff / treasure-pile / cannon / etc.)
• Specify the SPECIFIC BRICK PARTS used (e.g. "1×2 cheese slope" / "2×2 round dish" / "Technic axle pin" / "trans-orange 1×1 flame")
• Imply the visual IMPACT (curvature / texture / glow / motion / scale)`,
    touchpoints: [
      'SNOT-built galleon hull curvature using sideways-stud bracket sections turning the hull-planks parallel to the keel — 1×2 plate-with-side-stud bricks create the inward hull-curve from aft to bow, with overlapping curved-slopes for the wave-cut bow',
      'Trans-blue ocean built in layered plate-and-tile stacking — 2×4 trans-light-blue plates on the lowest layer, 1×2 trans-dark-blue tiles offset above for wave-crest depth, sprinkled 1×1 white round-plates as foam crests',
      'Trans-orange + trans-red + trans-yellow flame elements as cannon-fire muzzle-flash, clustered at the gun-port mouth with motion-blur implied by staggered stud-heights, the flame-stack mounted on a hidden 1×1 round-plate connection',
      'Technic-axle articulation in the cannon mount allowing the gun-barrel to tilt up/down on a hidden pivot, with 1×1 plate trunnions disguised as wood-block gun-carriage detail, the carriage rolling on 1×1 round-plates as wheels',
      'Crow\'s-nest built using a stack of inverted round-bricks with macaroni-arc tiling for the rim, lookout minifig connected via a single stud at the center, the platform mounted on the mast via a Technic-pin clutch-connection',
      'Brick-built sail-billow using overlapping 2×4 white tile-on-plate panels at progressive angles, secured at the yard-arm via clip-and-bar connection, the billow-curve achieved by intentional half-stud-offset stagger',
      'Sloped-brick rocky cliff face using a mixed light-bley + dark-bley + tan slope-brick palette in random sequence, with cracks built as gap-techniques between brick edges, tufts of tan-1×1 round-plates as scrubby foliage',
      'Treasure-pile constructed from gold-plated minifig-coins, ingots (1×1 round tiles in gold), and gold-stud-on-plate as scattered loose doubloons, mixed with trans-clear jewel elements (1×1 round trans-purple / trans-red / trans-green) as gems',
      'Microscale rigging using minifig fishing-rod antenna pieces as ratlines, black string-with-end-studs as shrouds running yard-to-deck, flex-tube black rubber pieces as the standing rigging fore-and-aft',
      'Printed treasure-map tile (the iconic LEGO Pirates printed-tile from set 6285) used as the build-anchor on the captain\'s table, surrounded by 1×1 round-tile compass-rose detail and a minifig dagger as a chart-pinning prop',
      'Studs-up wood-plank deck contrasting with tiled smooth quarterdeck — main-deck shows visible studs as wood-plank texture, quarterdeck tiled smooth-grey as polished officer\'s walking-surface, the texture contrast separates the social zones',
      'SNOT-built ship\'s figurehead using 1×1 headlight bricks and curved slopes attached sideways to the bow, the figurehead represented in profile with hair flowing rearward built from layered curved-slope plates',
      'Trans-clear baseplate-mounted ice slab as the diorama-floor for an iceberg scene, with 2×2 trans-clear plates lifting the wreck-fragments above the brick-water surface to create the half-submerged effect',
      'Macro-scale cannonball built from a stack of brown 1×1 round-plates connecting to a 2×2 round-dome — the cannonball mid-air represents the moment after the cannon-fire, positioned via clear-stud connector',
      'Tavern-sign built as a hanging assembly using two 1×1 round-plate hinges as the swinging-mount, a printed 2×3 sign-tile as the face, the assembly suspended from a Technic-pin in the building-eave',
      'Kraken tentacle built using a chain of curved-slope and ball-joint sections in trans-dark-green, with suction-cup elements (1×1 round-plate inverted) along the underside, the tentacle articulated via internal flex-tube spine',
      'Skull-and-crossbones Jolly Roger built as a printed flag tile (Imperial Officer\'s tile from the Pirates line) mounted on a black antenna piece serving as the flagpole, the flag mid-unfurl angled by a hidden 1×1 plate brace',
      'Belowdecks cross-section revealed by partial-wall build technique — the hull is built with one side cut away to show the rib-frames + cargo + crew quarters, the structural-integrity preserved by hidden brick-bracing inside the build',
      'Brick-built parrot on the captain\'s shoulder using 1×1 round-plate in red-yellow-blue color blocks for the body, a 1×1 headlight as the head-and-beak, a tile-with-clip as the tail, mounted to the minifig shoulder via a connection-stud',
      'Custom mast-step built using a 2×2 round-dome inverted as the base for the mast, the mast itself a stack of 1×1 round-bricks in tan with brown crossbeams, the entire mast-assembly removable via a single Technic-pin for transport',
    ],
    instructions: `Each entry is ONE MOC build-technique note for a pirate diorama, 25-45 words. Format: "TECHNIQUE NAME CAPS — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no real-world construction language (no "plywood / glue / paint / 3D-print"); LEGO bricks only. No vague references ("uses some bricks") — name SPECIFIC part types (1×2 slope / trans-blue plate / Technic axle pin / minifig accessory).`,
  },

  // ─── camera_framing — pirate-specific framings ───
  brickbot_pirates_camera_framing: {
    format: 'simple',
    theme: `PIRATE-SPECIFIC CAMERA FRAMING — LEGO MOC photography angles for the pirates path. Each entry is ONE camera position + framing rule specific to PIRATE diorama subject matter (NOT a generic camera angle list). Each entry 15-30 words.

⚠️ This is bespoke — entries should leverage pirate-specific scenery (rigging, hold-cutaway, deck-perspective, crow's-nest, longboat-low, kraken-POV) rather than generic photography terms.

VARIETY MANDATE — distribute across:
  • Vertigo angles up (worm's-eye up a mast / under a yardarm / from longboat looking up at galleon)
  • Vertigo angles down (crow's-nest down-shot / yardarm down-shot / aerial over the deck)
  • Lateral broadside (cannon-deck mid-firing / ship-vs-ship broadside-on between vessels)
  • Through-rigging shot (camera between yardarm + sail to deck below)
  • Below-the-deck cutaway (cross-section interior — gunroom, gally, captain's cabin)
  • Discovery POV (camera at chest-level approaching treasure / a corpse / a clue)
  • Over-shoulder duel (camera behind one combatant looking past their shoulder at the opponent)
  • Kraken's-POV up (camera in the water looking up at the ship-bottom + tentacles)
  • Shipwreck dutch-tilt (camera tilted to match the wreck's broken-back angle)
  • Cliff-edge / aerial over a cove or harbor
  • Lantern-glow close-shot (intimate light, single fig + glowing element)
  • Approach down-the-dock (camera at dock-end, action receding into ship perspective)

Each entry must:
• Specify camera POSITION (height / location / orientation)
• Specify the framing's PURPOSE — what story-element does this angle DRAMATIZE
• Reference pirate-specific scenery elements`,
    touchpoints: [
      "CROW'S-NEST DOWN-SHOT — camera at the masthead looking straight down at the deck below, the mast itself receding into the foreground, crew on deck small and overhead-perspective, sail-tops and yardarms framing the corners",
      "LONGBOAT-LOW LOOKING UP AT GALLEON — camera at water-level from a longboat alongside a galleon, the hull dominating the frame as a wall of planking, gun-ports overhead, rigging visible at the top edge of frame, the dwarfing scale-shot",
      "CANNON-DECK BROADSIDE — camera inside the gun-deck mid-firing, three cannons in receding perspective down the deck, gun-crews mid-action, smoke + muzzle-flash trans-elements punching through the open gun-ports",
      "KRAKEN'S POV — camera submerged in the brick-water looking UP at the ship-keel with tentacles wrapping around the hull, crew silhouetted on the deck above, the water-surface refracted by trans-blue layered plates",
      "SHIPWRECK DUTCH-TILT — camera tilted 30 degrees to match the broken-backed wreck on a reef-island, the canted angle making the wreck dominate the diagonal, surf foaming around the wreck-base, gulls perched on the stern at the high side",
      'THROUGH-RIGGING TO DECK — camera positioned between the mainmast yardarm and the topsail looking down through the rigging to deck-action below, the rigging framing the action like a diagonal lattice across the frame',
      "OVER-SHOULDER DUEL — camera positioned just behind the right shoulder of one combatant in a sword-duel, looking past their cutlass-arm at the opponent in mid-parry, the opponent's face/expression visible, the duel-stage receding behind",
      "CHEST-LEVEL DISCOVERY — camera at minifig chest-height, three-quarter behind a pirate approaching an open treasure-chest, the chest contents (jewels + gold + map) dominating the foreground, the pirate's reaching C-grip visible",
      "CAPTAIN'S CABIN CUTAWAY — camera positioned at the cabin's missing fourth wall, looking into the interior — table + charts + lantern centered, stern-window showing brick-water beyond, captain + officers in mid-conference",
      "WORM'S-EYE UP THE MAST — camera at deck-level looking straight up the mainmast, mast receding into perspective, yard-arms crossing overhead, rigging-lines converging toward the masthead, sails billowing at the top edge of frame",
      "DOCK-END APPROACH — camera at the far end of a dock looking down its length toward a moored ship at the seaward end, crew + crates + lanterns in receding perspective along the dock, the ship dominating the frame's far end",
      'KRAKEN-TENTACLE TIGHT-CROP — camera close on a single tentacle wrapping a mast, the suckers + skin-texture filling the foreground, the crew on the mast above in the upper-frame mid-reaction, the rest of the scene cropped out',
      "BURIED-CHEST DIG WIDE — high-angle overhead from a palm-tree perch looking down at a beach dig-site, six crew members radiating around the half-excavated chest, palm-shadows raking across the sand from the angled light",
      'BROADSIDE BETWEEN TWO SHIPS — camera in the open-water gap BETWEEN two engaged galleons, both hulls visible left and right of frame, broadside fire arcing across the gap, the camera at wave-top height inside the engagement',
      "OVER-THE-RAIL BOARDING — camera at the rail of one ship looking across at the enemy ship's rail, boarders mid-leap across the gap, the rail's edge providing the foreground frame-bar",
      "QUARTERDECK MUTINY WIDE — high-angle from the mainmast looking down at the quarterdeck mutiny scene, captain isolated at the rail flanked by loyalists, the crew arrayed in a tense semicircle, the angle making the captain look cornered",
      'LANTERN-INTIMATE CLOSE — tight-crop on a single minifig holding a lit lantern in the dark, the lantern\'s trans-yellow glow lighting their face from below, the surroundings dropped into shadow, a moment of conspiratorial intimacy',
      "AERIAL OVER COVE — overhead aerial shot of a hidden cove between cliffs, a sloop pulling into the cove, the cliff-walls framing the cove like parentheses, the brick-water inside the cove a different color than the open ocean",
      "BELOW-DECKS POV — camera at a minifig walking down the belowdecks corridor of a ship, hammocks slung overhead, cargo + crew in receding perspective, the corridor framing the action like a tunnel",
      "STORM-SURVIVAL TIGHT — camera at deck-level mid-storm with rain-rods (trans-clear bar pieces) streaking diagonally across the frame, crew lashed-to-rigging in the background, the chaos cropped to the immediate deck",
    ],
    instructions: `Each entry is ONE pirate-specific camera framing, 15-30 words. Format: "FRAMING NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no generic camera terms ("medium shot / wide shot / close-up") without pirate-specific anchoring — every entry must reference pirate scenery (rigging / yardarm / mast / longboat / kraken / cannon / quarterdeck / etc.).`,
  },

  // ─── ship_class — silhouette bender ───
  brickbot_pirates_ship_class: {
    format: 'simple',
    theme: `PIRATE SHIP/VESSEL CLASS — silhouette anchor for the pirates path. Each entry is ONE specific ship/vessel class with rigging + hull-curvature + proportion characteristics. Each entry 12-25 words.

⚠️ These are silhouette anchors — they tell Flux what TYPE of ship is in the frame. Aerospace-accurate; if it says "galleon" expect three masts + square-rigged + high stern-castle; if "sloop" expect one mast + fore-and-aft rigged.

VARIETY MANDATE — distribute across:
  • CARIBBEAN/GOLDEN-AGE classics (galleon / brig / sloop / frigate / man-o-war / schooner / barque) — most of the pool
  • NORSE longships (single mast, square sail, dragon-prow, oar-banked)
  • ASIAN junks (multiple battened sails, square-stern, lugsail rigging)
  • MIDDLE-EASTERN dhows (lateen-rigged, single or two masts, raked sails)
  • SMALL CRAFT (longboat, jolly-boat, cutter, gig, periagua)
  • FANTASY/HYBRID (skyship-galleon, submarine-pirate / pirate-of-the-skies dirigible, ghost-ship)
  • SPACE-PIRATE — Treasure Planet style galleon-in-space, asteroid-mining sloop
  • STEAMPUNK — gear-driven hybrid sail-and-steam vessel
  • SPECIALTY (whaler / smuggler-runner / fireship / careened-careening-vessel)

Each entry must:
• Name the class in first 4-8 words
• Specify mast count + rig type
• Specify hull-curvature characteristic (high stern / low waist / sharp bow / wide beam / etc.)
• Specify the typical SCALE (size relative to crew — 50-crew / 20-crew / 5-crew)`,
    touchpoints: [
      'Three-masted Caribbean galleon — square-rigged on fore and main, lateen on mizzen, high stern-castle, raked bow, 50-80 crew capacity, the classic pirate flagship',
      "Single-masted Caribbean sloop — fore-and-aft rigged mainsail with jib, sharp bow for speed, low waist, 10-20 crew capacity, the smuggler's runner",
      "Two-masted brig — square-rigged on both masts, mid-size with balanced silhouette, broad beam, 20-30 crew, the workhorse of Atlantic piracy",
      "Royal Navy fourth-rate frigate — three-masted square-rigged, 40-50 guns, distinctive red-and-white pattern, the imperial enforcer",
      'Norse longship — single mast with square red-and-white sail, low slung clinker-built hull, dragon-headed prow, 30-oar bench, raid-vessel',
      "Chinese junk — three battened lugsail masts, square-stern, raked transom, distinctive crab-claw sail-shape, ocean-going trade",
      "Arabian dhow — lateen-rigged single mast on a swept-back rake, sharp prow, wooden-pegged hull, monsoon trader",
      "Pirate captain's longboat — single mast with lugsail, open-decked, 6-12 crew, the standard ship-to-shore craft",
      "Ghost-ship galleon — half-translucent trans-clear hull, tattered sails, ragged-rigging, phantom-fleet variant of the Caribbean galleon silhouette",
      "Treasure Planet space-galleon — three-masted classic galleon silhouette but with solar-sail rigging and propeller-engines amidships, nebula-faring",
      "Pirate dirigible / skyship — airship hull suspended below a lozenge-shaped envelope, propeller-engines port and starboard, swing-anchor at the bow",
      'Steampunk hybrid — three-masted galleon with paddlewheels amidships and visible steam-stack at the stern, gear-mechanism deck details',
      "Smuggler's schooner — two-masted fore-and-aft rigged, sharp-bowed for speed, narrow beam, 15-crew capacity, designed for run-the-blockade work",
      "Man-o-war first-rate — three-masted square-rigged, 100-guns across three decks, hulking high-sided silhouette, the imperial flagship",
      'Whaler barque — three-masted hybrid square-and-fore-aft rigging, wide beam for hold-capacity, davit-mounted whaleboats, sturdy hull',
      'Fireship-converted brig — two-masted brig stripped of cargo and packed with combustibles, deliberately rigged to burn — sent against enemy fleets',
      "Caribbean periagua — long shallow-draft single-sail boat with paddle-stations, indigenous-built design, 8-12 crew, coastal raid-vessel",
      "Asteroid-mining sloop (space-pirate) — single-masted Caribbean-sloop silhouette with vacuum-sealed cabin and ion-drive instead of sails, asteroid-belt operating",
      "Cursed Dutchman-style galleon — barnacle-encrusted three-masted galleon with tattered sails and skeletal-figurehead, the iconic supernatural pirate vessel",
      "Careened-careening vessel — any class undergoing maintenance, beached at low-tide on its side with crew scraping the hull, broadside view of the keel",
    ],
    instructions: `Each entry is ONE ship/vessel class anchor, 12-25 words. Format: "CLASS NAME CAPS — rigging + hull + scale". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no anachronisms (no "diesel-engine galleon"); no modern-military terms (no "battleship / aircraft carrier / destroyer"); no vague descriptors ("big pirate ship"). Specific rig + class name + scale always.`,
  },

  // ─── register — era+faction bender (weighted ~60/40) ───
  brickbot_pirates_register: {
    format: 'simple',
    theme: `PIRATE REGISTER — era + faction lock for each render. Each entry is ONE specific historical/genre register that controls the crew attire + build motifs + props for this render. Each entry 20-40 words.

⚠️ WEIGHTED DISTRIBUTION — the pool should weight ~55-65% toward GOLDEN-AGE CARIBBEAN (the path's brand center) and ~35-45% toward NON-DEFAULT REGISTERS (the bending advantage). Generate accordingly.

REGISTER CATEGORIES — distribute as:
  • ~30% GOLDEN-AGE CARIBBEAN (1650-1730) — tricorn hats / cutlasses / flintlock pistols / silk sashes / Pirates of the Caribbean / Treasure Island / Captain Kidd / Blackbeard / Henry Morgan
  • ~10% GOLDEN-AGE CARIBBEAN SUB-VARIANTS — privateer (legal commission), Buccaneer (Spanish Main raider), Quaker-coast pirate (gentleman pirate)
  • ~10% NORSE RAID (8th-11th century) — Viking longships / shield-walls / horned-or-helmet (NOT both — historians! :) / chain-mail / axes / runic banners / Hägar lineage
  • ~5% GREEK MYTH / ARGONAUTS — bronze helmets / hoplite armor / amphora-stacks / Jason and Argonauts / Cyclops + sea-monsters / classical-trireme
  • ~5% ASIAN JUNK PIRATES — Ching Shih + South China Sea / Wokou / Vietnamese-thuyền pirates / queue-braid + conical-hat + curved-saber + jade + lacquered-armor
  • ~5% MIDDLE-EASTERN / BARBARY COAST — turbans + scimitars + dhow-rigging + Salee / Algiers raiders / silk-and-leather attire
  • ~5% CURSED / GHOST CREW — skeleton-torso variants + tattered-cape + phosphorescent-eyes + green-glow + Davy Jones lineage
  • ~5% FANTASY (One Piece / Sea of Thieves / Sea Beast) — exaggerated-anime style / fantasy-creature crews / impossibly-shaped ships / treasure-hunt fantasy
  • ~5% SPACE-PIRATE (Treasure Planet / Outlaw Star / Cowboy Bebop) — Caribbean attire + retro-futurist mods / plasma-cutlasses / solar-sails / nebula-backdrops
  • ~5% ROYAL NAVY / IMPERIAL FORCE — red-coat marines + tricorn officers + Union-Jack / Spanish-galleon Imperial / French-corsair / Dutch East-India-Company
  • ~5% STEAMPUNK PIRATE — Victorian-era + brass-gear + dirigible-skyship + steam-mechanical-prosthesis / monocle / pith-helmet
  • ~5% MODERN-SOMALI / RIVER-RAIDER — small fast skiffs + AK-coded weapons (LEGO-stylized) + improvised crew kit (rare register — use sparingly)

Each entry must:
• Name the register category in first 4-8 words
• Specify CREW ATTIRE characteristics (hat style / coat / sash / weapon-type)
• Specify BUILD MOTIFS (figurehead style / flag / rigging-flavor)
• Specify any restrictions ("ship_class becomes [X] regardless")`,
    touchpoints: [
      "GOLDEN-AGE CARIBBEAN — tricorn hats, leather cross-belts, silk sashes, cutlasses + flintlock pistols, Jolly Roger flag, 1650-1730 era, the path's brand-center register",
      "GOLDEN-AGE CARIBBEAN PRIVATEER — same Caribbean attire but officer's-uniform-coat in burgundy or navy, letter-of-marque scroll prop, more disciplined crew posture, legal-commission flag instead of Jolly Roger",
      "BUCCANEER (Spanish Main raider) — leather-jerkin attire, broad-brim hat instead of tricorn, single boucan-knife + musket, Caribbean-isle base motifs, Tortuga / Hispaniola lineage",
      "BLACKBEARD CREW VARIANT — Caribbean Golden-Age base but heightened theatricality, slow-burning fuses tied into the captain's beard (trans-orange spark elements), pistol-bandoliers, terror-shock motif",
      'NORSE RAID — Viking longship attire, horned OR antlered helmets (not both — historians take note), chain-mail tunics, two-handed axes, round wood-and-iron shields, runic banners; ship_class becomes Norse-longship-variant regardless',
      'NORSE RAID JOMSVIKING — elite Norse raider variant — black leather-and-mail, bear-pelt cloak, single-handed axes + seax, austere unmarked banner, ship_class still longship',
      'GREEK MYTH / ARGONAUTS — bronze hoplite helmets, leather-and-bronze armor, xiphos sword + dory spear, classical-trireme rig, amphora-stacks as scene props; ship_class becomes Greek-trireme; sea-monsters become classical (Scylla / Charybdis / Cyclops)',
      'CHING SHIH SOUTH-CHINA-SEA PIRATE — conical bamboo hats, silk tunics with embroidered sashes, queue-braid hair, curved sabers + matchlocks, junk-rigged battened sails; ship_class becomes Chinese-junk',
      "WOKOU JAPANESE-COAST RAIDER — pirate variant blending samurai-derived gear with Asian-pirate elements — half-armor with sashimono banner, katana + wakizashi, longbow, captured-Chinese-junk-variant ship_class",
      'BARBARY CORSAIR — Salee / Algiers pirate, turban + sashed-tunic + leather-vest, scimitar + flintlock, dhow-rigging visible; ship_class becomes Arabian-dhow or Mediterranean-galley',
      "CURSED GHOST CREW — skeleton-torso minifig variants with tattered-cape elements, half-translucent armor, phosphorescent-eye prints, ship is half-translucent with trans-clear hull highlights, ghost-ship galleon",
      "DAVY JONES CURSED CREW — barnacle-and-coral-encrusted crew variants, kraken-tentacle-arm prosthetics on certain figures, octopus-headed captain, ship is the cursed Dutchman-style galleon",
      "ONE-PIECE FANTASY CREW — exaggerated anime-stylized attire (oversized hats, mismatched colors, signature accessories), each crew-member with a unique fantasy element (devil-fruit reference, exaggerated weapon, fantasy-creature companion), fantasy-shaped ship",
      "SEA OF THIEVES FANTASY — fantasy-pirate exaggerated-color attire, parrot-companions and cosmetic flair, treasure-vault-hunting register, megalodon and skeleton-fleet motifs",
      "SPACE-PIRATE (Treasure Planet) — Caribbean-pirate attire updated with solar-cell visors, plasma-cutlasses replacing iron blades, robotic prosthesis on at least one crew-member, ship is space-galleon with solar sails; weather becomes nebula / asteroid-drift / ion-storm",
      "STAR-WARS PIRATE — Hondo Ohnaka / Cad Bane lineage — mixed-species crew, jetpacks + blaster-rifles + holstered-pistols + helmet/visor accessories, ship_class becomes star-pirate-galleon (corvette / patrol-ship)",
      'ROYAL NAVY RED-COAT — Royal Navy marine attire, red coats with white cross-belts, tricorn officer hats, muskets-with-bayonets + officer-cutlasses, Union-Jack pennants; ship_class becomes British man-o-war or frigate',
      "SPANISH GALLEON IMPERIAL — Spanish-Empire era crew, conquistador-derived officer attire, gold-trim coats, ornate cross-bearing-banners, ship_class becomes Spanish-galleon (treasure-fleet variant)",
      "STEAMPUNK PIRATE — Victorian-era pirate, brass-gear-decorated coats, pith helmet OR top-hat, mechanical-prosthesis on at least one figure, gear-festooned weapons (steam-pistol / clockwork-cutlass), ship is steampunk hybrid",
      'MODERN SOMALI RAIDER (rare register) — present-day attire — keffiyeh + denim + military-surplus + tactical-vest, small fast skiffs as ship_class regardless, AK-coded long-arms (LEGO-stylized), modern-port backdrop',
    ],
    instructions: `Each entry is ONE pirate register lock, 20-40 words. Format: "REGISTER NAME CAPS — attire + motif + restrictions". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. WEIGHTED OUTPUT: ~55-65% Golden-Age Caribbean variants, ~35-45% non-default registers. STRICT BANS: no register-mixing within a single entry (no "Norse raider with Caribbean tricorn hat" — that's the cross-axis compatibility clauses' job).`,
  },

  // ─── scene_props — diorama fill details (pickN:2) ───
  brickbot_pirates_scene_props: {
    format: 'simple',
    theme: `PIRATE DIORAMA STORYTELLING PROPS — small brick-built details that fill the corners of a pirate scene and add narrative depth. Each entry is ONE specific prop or detail with a story implied. Each entry 12-30 words.

⚠️ These are picked TWO PER RENDER (pickN:2), so each entry must be SMALL enough to coexist with another. Not centerpieces — diorama-fill.

VARIETY MANDATE — distribute across:
  • LIVING COMPANIONS (parrot on shoulder, monkey climbing rigging, ship's cat watching, parrot in a brass cage, rats fleeing)
  • TREASURE-ELEMENTS (overflowing chest, scattered doubloons, jewel-encrusted goblet, silver-candlestick, gilded skull)
  • WEAPONS-LITTER (dropped cutlass on deck, cocked-flintlock on barrel, powder-keg with lit fuse, cannonball stack)
  • RIGGING / SHIP-PARTS (coiled rope on deck, broken yardarm, torn sail, lashed-cargo netting)
  • NAVIGATION / CAPTAIN GEAR (spyglass on rail, sextant on chart-table, compass-rose, ship's-log open)
  • FOOD / CREW LIFE (rum-keg open with cup beside, salt-pork hanging in galley, hardtack-tin, fishing-line over rail)
  • TROPHIES / FLAGS (Jolly Roger flag in close-up, captured enemy-pennant, severed-figurehead, ship-bell)
  • CURSED / SUPERNATURAL ELEMENTS (skull on a pike, cursed-amulet, glowing-jewel in a stand, voodoo-doll, kraken-ink-cloud)
  • PERSONAL ITEMS (peg-leg leaning against barrel, eyepatch on a hook, captain's hat on a stand, locket-on-a-chain)
  • MAP / DOCUMENT ELEMENTS (rolled chart, treasure-map fragment, ship's-log open, wax-sealed letter, navigation-rules-tile)
  • TAVERN / DOCK DETAIL (lit lantern hanging, wanted-poster nailed to a post, ale-tankard on a barrel, dock-rope-coil)

Each entry must:
• Name the prop type in first 3-6 words
• Specify the SPECIFIC LEGO BRICK PARTS where applicable (e.g., "minifig parrot accessory", "1×1 round trans-purple jewel element")
• Imply a STORYTELLING CONTEXT (this prop suggests... a backstory)`,
    touchpoints: [
      'Parrot on the captain\'s shoulder — minifig parrot accessory in red-blue-yellow, beak-painted-tile, perched via the shoulder-stud connection, ruffled mid-render as if it just landed',
      "Monkey climbing in the rigging — minifig monkey accessory in brown, gripping a rope with one paw, hanging mid-swing from a ratline antenna-piece, mid-mischief",
      "Overflowing treasure chest open on deck — 2×3 chest element open with gold-1×1-round-plates spilling out, trans-red + trans-green + trans-purple jewel-bricks scattered across the spill, gold-stud-on-plate doubloons",
      "Dropped cutlass on the deck planks — minifig cutlass piece lying flat on the studded wood-plank deck, the blade pointed away from a fallen minifig partially visible at frame-edge, suggesting a recent fight",
      "Powder-keg with lit fuse trans-orange — 2×2 cylinder-brick keg with a 1×1 round-plate fuse-piece in trans-orange spark element rising above, the moment-before-the-explosion freeze",
      "Coiled rope on the deck — brown flex-tube piece coiled neatly beside the foot of the mainmast, ready-for-use, a sailor's prepared-line for the next maneuver",
      "Spyglass on the quarterdeck rail — minifig telescope/spyglass accessory propped on the rail-edge, lens-end pointing toward the horizon, abandoned by a watchman who was just called away",
      "Open rum-keg with brass cup beside — 2×2 cylinder-brick keg with the lid off, a 1×1 round-plate brass tile beside as the cup, faint trans-brown 1×1 round-plate as the rum-spill suggesting a recent draw",
      "Severed enemy-ship figurehead — a brick-built ship's-figurehead piece propped against the rail like a trophy, splintered at the base, the prize-of-the-day from yesterday's engagement",
      "Skull-on-a-pike — minifig skull piece mounted on top of a black antenna-piece staked into the deck, warning to the crew or the prisoner, the morbid trophy-marker",
      "Captain's hat on a brass-hook — minifig tricorn hat hanging on a hook-piece bracket-mounted to the wall of the captain's cabin, the captain's-quarters detail",
      "Spilled chart on the navigator's table — 2×3 printed map-tile lying askew across a table, a minifig dagger pinning one corner, dividers (technic-pin tool) abandoned beside it, mid-plotting",
      "Lit hanging lantern — minifig lantern accessory hanging from a chain-piece (2-link chain) attached to a deck-beam overhead, trans-orange glow element inside, illuminating a small zone of the scene",
      "Wanted poster nailed to a tavern post — a printed 2×3 wanted-poster tile attached to a post with a 1×1 round-plate as the nail-head, the captain's face on the poster, a reward in doubloons listed",
      "Ship's bell mounted on the quarterdeck — a 1×1 round-brass-bell piece mounted on a Technic-axle bracket, the bell-pull rope hanging beside, the watch-change signal-piece",
      "Cocked flintlock on a barrel — minifig flintlock-pistol accessory propped on a barrel with the cock pulled back, ready-to-fire, set down between shots in a duel-pause",
      "Broken yardarm on the deck — a brown round-brick segment with attached rigging-strings lying broken across the deck, a sail-fragment trailing, evidence of recent battle-damage",
      "Open ship's log on the captain's table — a printed 2×2 ship's-log tile open with quill (minifig quill-accessory) beside, ink-pot 1×1 round-tile in black, the captain's-record-of-yesterday",
      "Severed mooring-line on the dock — a frayed-rope-end (flex-tube cut at angle) hanging from a dock-bollard, the ship that should be there gone, the moment-of-discovery",
      "Voodoo-doll on a barrel — a small custom-built minifig-effigy with pins (1×1 round-plates in pin colors) stuck in it, lying on a barrel-top, the cursed-trinket left as a warning",
    ],
    instructions: `Each entry is ONE pirate diorama prop, 12-30 words. Format: "PROP NAME — brick-parts + story-context". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO real-world materials (no "wooden carved figurehead" without naming brick parts); NO centerpiece-sized props (entries must be SMALL — coexist with other props in the same render); NO oversized treasure piles (those belong to scene_type entries).`,
  },

  // ─── lighting — axis-clean light source + direction + color quality ───
  brickbot_pirates_lighting: {
    format: 'simple',
    theme: `LEGO MOC PIRATE LIGHTING — axis-clean light SOURCE + DIRECTION + COLOR-QUALITY entries for the pirates path. Each entry is ONE specific lighting setup. Each entry 15-30 words.

⚠️ AXIS-CLEAN MANDATE (per playbook lesson 4 — EarthBot epic-vista 2026-05-20). Lighting pool owns ONE conceptual lane: light source + direction + color. Strictly OFF other lanes.

⚠️ HARD BANS — strip these from EVERY entry:
  • NO weather words: fog / mist / haze / rain / storm / lightning / squall / wind / blizzard / hurricane / aurora (those belong to weather_drama axis)
  • NO scene elements: sails / rigging / deck / cabin / cave / beach / harbor / treasure / barrels / lanterns-as-PROPS (those belong to scene_type / scene_props axes)
  • NO minifig action: "lighting carving shadows on faces" / "crew silhouetted" (those belong to minifig_action axis)
  • NO color-cast OVERRIDE language: don't say "warm golden light overrides the scene" — describe the light SOURCE + DIRECTION + COLOR neutrally

✓ VARIETY MANDATE — distribute across:
  • NATURAL DAYLIGHT (high-noon overhead / golden-hour-raking / blue-hour-dusk / dawn-cool-pink / midday-tropical-glare)
  • NATURAL NIGHT (full-moon overhead / crescent-moon side / starlight-only / moonless / moonrise-low-on-horizon)
  • COLORED SKY (sunset-orange-red / blood-red-dawn / sickly-yellow-pre-light / cobalt-tropical-overhead / charcoal-overcast)
  • PRACTICAL LIGHT SOURCES (single-candle / oil-lantern / torch / multiple-torches / firelight / muzzle-flash / explosion-flash)
  • DIRECTIONAL CHARACTER (raking-sidelight / backlight-silhouette / overhead-vertical / underlit-from-below / three-quarter-frontlight / rim-light)
  • SCENE-NEUTRAL DIFFUSE (overcast-soft / cloud-bright-flat / shaded-cool / open-shade)
  • CHIAROSCURO / HIGH-CONTRAST (Caravaggio-deep-shadow / single-source-dark-surround / spotlight-pool-of-light)

Each entry must:
• Specify the LIGHT SOURCE (sun / moon / candle / lantern / torch / explosion / etc.) in first 4-8 words
• Specify the DIRECTION (raking / overhead / backlit / sidelit / underlit / etc.)
• Specify the COLOR QUALITY (amber / silver-blue / harsh-white / saturated-orange / cool-grey / etc.)
• OPTIONALLY note a single visual signature (e.g., "long shadows" / "sharp edge-glow" / "soft halo" / "color-cast on light side")`,
    touchpoints: [
      'GOLDEN-HOUR RAKING SIDELIGHT — late-afternoon sun low on the horizon raking horizontally from one side, warm amber color quality on lit surfaces, long deep-violet shadow opposite, sharp shadow-edges',
      "FULL-MOON OVERHEAD COOL — directly overhead full moon, cool silver-blue color quality on all upward surfaces, deep blue-black undersides, vertical shadows underfoot",
      'SINGLE-CANDLE WARM POOL — one small candle as the only light source, warm orange glow falling off rapidly to darkness within 2 brick-lengths, deep-amber color quality at the source fading to pitch-black',
      'HARSH-NOON TROPICAL OVERHEAD — sun directly overhead, harsh-white color quality, sharp short shadows directly below objects, no atmospheric softening, high-contrast everywhere',
      'BLOOD-RED DAWN HORIZON BACKLIGHT — sun just below the horizon-line, blood-red + crimson color cast on the underside of any objects in frame, everything silhouetted against the red sky, deep-purple foreground',
      'COBALT TROPICAL MIDDAY OVERHEAD — high tropical sun with cobalt-blue sky, bleached-white lit surfaces, sharp-edged shadows, the saturated-blue overhead bouncing soft secondary-blue into shadows',
      'OIL-LANTERN WARM POOL UNDERLIT — handheld oil lantern at minifig waist-height, warm amber color quality lighting faces from below, dramatic underlit chiaroscuro, falloff to deep shadow at the edges',
      "MUZZLE-FLASH WHITE STROBE — instant cannon or pistol discharge as the dominant light source, magnesium-white color quality bleaching the lit side, hard-edged shadows on the off-side, momentary freeze-frame",
      "MOONRISE LOW-HORIZON RAKING — full moon just above the horizon raking horizontally, cool silver-blue color quality on lit surfaces, long deep-indigo shadows opposite, more dramatic than overhead moon",
      "TORCHLIGHT CIRCLE FROM ABOVE — torch held overhead by a minifig as light source, warm orange falloff in concentric circle below, sharp warm-cool boundary at the edge, flickering-implied color shift",
      "STARLIGHT-ONLY MOONLESS NIGHT — no moon, only faint silver-blue starlight, all surfaces very dim cool-blue, barely-readable shadow definition, near-pitch-black darkness with only highlights catching",
      "SUNSET-DISK BURNING ORANGE BACKLIGHT — sun-disk visible on the horizon as a saturated orange-red glow, everything silhouetted dark against the burning sky, lit surfaces tinged warm-amber",
      "FIRE-PIT UPLIGHT WARM — large bonfire as light source from below, hot orange-red color quality on undersides of objects above, sparks-implied warm-yellow particulate, cool-blue darkness above",
      "EXPLOSION-FLASH FLAT WHITEOUT — instant powder-magazine or grenade detonation, flat magnesium-white color quality washing out all surfaces evenly, momentary blowout, dust-debris implied",
      "BLUE-HOUR DUSK COOL DIFFUSE — post-sunset twilight, no direct light source, cool-blue-violet color quality on all surfaces, very soft diffuse shadows, the romantic-darkening transitional light",
      "DAWN-PINK COOL HORIZON GLOW — pre-sunrise pink-and-cool-blue gradient lighting, soft-diffuse color quality, barely-defined shadows, the gentle wash-of-color awakening light",
      "CARAVAGGIO DEEP-SHADOW SINGLE-SOURCE — chiaroscuro lighting from one off-frame source (could be window / lantern), warm color quality on lit edge, deep-black void on the other 80% of frame, dramatic high-contrast",
      "OVERCAST FLAT DIFFUSE COOL — heavily overcast sky bouncing flat cool-grey light, no directional shadows, even illumination, slightly desaturated color quality across the frame, neutral mood",
      "SUNLIGHT THROUGH SHAFT FROM ABOVE — single shaft of warm sunlight piercing downward from a hole / window / opening overhead, sharp-edged light-shaft, surrounding darkness on the unlit areas",
      "MULTIPLE-TORCH RING WARM — several torches arrayed in a ring around the scene, warm orange color quality from all sides, soft-overlapping shadows, the central subject lit evenly warm",
      "CRESCENT-MOON SIDELIT COOL — crescent moon low-angle from one side, soft silver-blue color quality on the lit side, deep-blue shadows on the other side, half the scene definition",
      "FIREPLACE / GALLEY-STOVE UNDERLIT — interior light source from a low fireplace or stove, warm flickering orange uplighting faces and lower bodies, cool darkness on upper surfaces above",
      "SHIP-LANTERN HANGING WARM SPOT — single hanging lantern as fixed light, warm circular pool of orange light directly below, falloff to cool darkness beyond the pool's edge",
      "MIDDAY OPEN-SHADE COOL — subject in deep shade of a structure on a bright day, cool indirect-bounced light filling, the bright daylit area visible on one edge of frame creating a value contrast",
      "FIRELIGHT FLICKERING WARM SIDELIT — fire-pit or bonfire from one side, warm flickering orange-yellow on the lit side, deep purple-black on the off-side, dramatic warm-cool split lighting",
      "STORM-BREAK SUN-SHAFTS THROUGH GAP — sun-shafts piercing through a break in dark clouds, sharp-edged warm-yellow light-shafts cutting through cool-grey ambient, dramatic god-rays",
      "BLOOD-MOON RED OVERHEAD — full moon directly overhead in trans-red color quality, sickly-red color cast on all upward surfaces, deep-burgundy shadows, supernatural-event lighting",
      "WAXING-MOON HALF-LIT — half-moon at three-quarter angle, soft silver-blue color quality on the lit side, gentle gradient to deep-blue darkness on the off-side, balanced cool lighting",
      "BACKLIT-FROM-HORIZON SILHOUETTE — light source on the deep-distance horizon backlighting the foreground subject as a pure dark silhouette against the lit sky, edge-glow rim-light on subject's contour",
      "NOON SHADOWLESS DIFFUSE — bright cloudless midday with sun directly overhead AND high-altitude haze diffusing slightly, near-shadowless even illumination, slightly warm color quality",
      "SHIP'S-LANTERN ARC SWEEP — hanging lantern caught mid-swing in motion, warm orange light-arc swept across the lit surfaces in a curve, momentary directional implied by the swing-blur",
      "DAWN-COOL-PINK BACKLIT — early pre-sunrise with pink-and-cool-blue gradient sky backlighting the foreground, soft-warm light catching upper edges only, cool-blue shadows below",
      "TWILIGHT-PURPLE OVERHEAD DEEP — post-blue-hour deep-twilight, rich purple-and-indigo overhead, no direct light source, very low ambient, the world dropping into night",
      "ICE-WHITE LIGHTHOUSE BEAM SWEEP — distant lighthouse rotating beam as the light source, cool-white narrow shaft of light raking horizontally across the frame, momentary directional lighting, falloff to darkness",
      "SAFFRON SUNSET LOW-HORIZON RAKING — late-stage sunset with saffron-yellow + saturated-orange + deep-pink horizontal gradient, raking light from one side warming the lit edges, long shadows opposite",
      "CYAN-GREEN PHOSPHORESCENT UPLIGHT — supernatural / cursed light source from below (phosphorescent water / will-o-wisp), cool-cyan-green color quality on the underside of objects above, eerie soft uplight",
      "SHOOTING-STAR STREAK ABOVE — momentary white-hot streak across the sky, brief illumination on the upper surfaces from above, mostly atmospheric / sky-only signature",
      "MOON-PATH ON WATER ONLY — moonlight bright ENOUGH only to define a silver-white path along the water surface, the surrounding scene dark, the path the dominant light-feature in frame",
      "LATE-AFTERNOON WARM BACKLIT — sun low in the sky behind the subject, warm-amber rim-light on the contours of the subject, cool-blue shadowed front, the iconic-warm-backlight setup",
      "POWDER-MAGAZINE RED-LANTERN SHIELDED — interior magazine with a shielded red-glass lantern as the only light, dim crimson glow on all surfaces, deep-shadow dominant, ominous safety-lit register",
    ],
    instructions: `Each entry is ONE pirate-scene lighting setup, 15-30 words. Format: "SOURCE+DIRECTION CAPS — color quality + signature". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO weather words (fog / storm / rain / lightning / aurora — those belong to weather_drama); NO scene elements (sails / rigging / deck / cabin / treasure / barrels); NO minifig action; NO mood/narrative. SOURCE + DIRECTION + COLOR only.`,
  },

  // ─── palette — axis-clean color combinations ───
  brickbot_pirates_palette: {
    format: 'simple',
    theme: `LEGO MOC PIRATE PALETTE — axis-clean color-combination entries for the pirates path. Each entry is ONE specific multi-color palette for a pirate diorama. Each entry 12-25 words.

⚠️ AXIS-CLEAN — palette pool owns ONE conceptual lane: color combinations. The entry can carry a brief register-tag at the end (e.g., "captain's-quarters") for flavor, but the bulk is colors.

✓ VARIETY MANDATE — distribute across pirate-coded palettes:
  • CARIBBEAN GOLDEN-AGE (weathered-oak + sail-white + brass + pirate-red)
  • STORM / NIGHT (storm-navy + ghost-cyan + tarnished-gold + bleached-bone)
  • TROPICAL (turquoise + coral-pink + sand + driftwood + palm-green)
  • TREASURE-COLOR (gold + emerald + ruby + bronze + amber)
  • SUNSET / WARM (saffron + crimson + amber + burnt-sienna + deep-purple)
  • COOL / MOONLIT (silver-blue + indigo + cool-charcoal + ivory + steel)
  • BATTLE / SMOKE (cannon-gray + powder-black + fire-orange + steel-blue + blood-red)
  • CURSED / GHOST (phosphorescent-green + abyss-black + bone-white + verdigris)
  • NORSE / VIKING (iron-grey + bone-white + leather-brown + raven-black + axe-steel)
  • ASIAN-JUNK (jade + lacquer-red + silk-gold + bamboo-tan + ink-black)
  • SPACE-PIRATE (nebula-purple + plasma-cyan + stellar-gold + void-black + asteroid-grey)
  • STEAMPUNK (brass-gold + leather-brown + glass-cyan + iron-black + copper-patina)
  • ROYAL NAVY (red-coat + white-cross-belt + navy-blue + brass + black-bicorn)
  • BLOOD / VIOLENCE (crimson + black-iron + spatter + ash)

Each entry must:
• Name 3-5 specific colors with a noun-anchor (e.g., "weathered-oak brown" not just "brown")
• Use specific color-modifier vocabulary (weathered / tarnished / bleached / saturated / cool / molten)
• End with a brief register tag (lagoon-hideout / cursed-treasure / battle-scarred / captain-quarters)
• NEVER drift into lighting language (no "golden-hour orange") — describe colors as MATERIAL colors`,
    touchpoints: [
      "Weathered-oak brown + sail-canvas white + brass-doubloon gold + pirate-red, sun-bleached-deck",
      "Storm-dark navy + ghost-ship cyan + tarnished gold + bleached-bone, phantom-vessel",
      "Tropical turquoise + coral-pink + bone-sand + driftwood-grey + palm-green, lagoon-hideout",
      "Treasure amber + emerald-jewel + ruby + antique-bronze + dark-mahogany, plundered-hoard",
      "Saffron sunset + crimson + burnt-sienna + deep-purple + ember-orange, fire-sky",
      "Silver-blue + indigo + cool-charcoal + ivory + steel-grey, moonlit-night",
      "Cannon-grey + powder-black + fire-orange + steel-blue + blood-red, broadside-battle",
      "Phosphorescent-green + abyss-black + bone-white + verdigris-copper, cursed-depths",
      "Iron-grey + raven-black + bone-white + leather-brown + birch-pale, Norse-raid",
      "Jade + lacquer-red + silk-gold + bamboo-tan + ink-black, Asian-junk",
      "Nebula-purple + plasma-cyan + stellar-gold + void-black + asteroid-grey, space-pirate",
      "Brass-gold + tan-leather + glass-cyan + iron-black + copper-patina, steampunk",
      "Red-coat + white-cross-belt + navy + brass + black-bicorn + ivory, Royal-Navy",
      "Crimson-blood + black-iron + ash-grey + bone-white + rust-orange, mutineer-violence",
      "Burgundy velvet + gold-braid + crimson-sash + ivory-lace + ebony, commodore-finery",
      "Spiced-rum amber + tobacco-brown + cream + aged-oak + brass, tavern-grog",
      "Map-parchment + ink-brown + wax-seal-red + aged-vellum + leather, treasure-chart",
      "Cobalt-ocean + foam-white + hemp-rope + anchor-iron + cloud-white, open-sea",
      "Powder-blue sky + gull-white + driftwood-tan + horizon-navy, endless-voyage",
      "Kraken-ink black + tentacle-purple + drowned-blue + pearl-shimmer + abyss-teal, deep-terror",
      "Galleon-gold + ocean-spray white + hull-tar black + sail-shadow grey, flagship-pride",
      "Sea-glass green + driftwood grey + copper-penny + bone-white, shipwreck-ruins",
      "Hurricane-grey + lightning-white + tempest-blue + blackened-mast + cold-rain-silver, storm-tossed",
      "Limestone-cave cream + torch-flame orange + moss-green + shadow-charcoal + wet-stone, smuggler-grotto",
      "Bandana-scarlet + sun-faded denim + leather-brown + brass-buckle + tan-trousers, pirate-garb",
      "Cutlass-steel + blood-spatter + gunmetal + leather-grip-brown + iron-black, blade-duel",
      "Spyglass-brass + horizon-teal + cloud-white + telescope-black + cool-grey, crow-nest",
      "Port-wine red + harbor-fog-grey + dock-timber + lantern-yellow + brick-red, shore-leave",
      "Outlaw-silver + wanted-poster-tan + bounty-red + gallows-black + parchment-cream, notorious",
      "Reef-coral + lagoon-shimmer + shell-pink + volcanic-rock + palm-green, cove-secret",
      "Sea-brine green + jellyfish-glow + reef-coral + undertow-blue + kelp-amber, submerged-wreck",
      "Cinder-black + ember-orange + ash-grey + soot + dying-coal-red, smoldering-aftermath",
      "Whaler-tan + scrimshaw-ivory + iron-pike + harpoon-steel + oil-amber, whaler-deck",
      "Cursed-pearl + bone-grey + green-corruption + verdigris + skull-white, Davy-Jones",
      "Spanish-galleon-gold + conquistador-red + obsidian + ivory-bone + ornate-bronze, Spanish-empire",
      "Argonaut-bronze + Aegean-blue + olive-green + amphora-clay + ivory-marble, Greek-myth",
      "Barbary-corsair turban-white + scimitar-steel + tan-silk + sun-bronze, Mediterranean-raid",
      "Wokou black-lacquer + samurai-red + steel-katana + silk-saffron + bamboo, Japan-coast",
      "Mango-orange + parrot-emerald + pineapple-yellow + macaw-blue + sand, tropical-plumage",
      "Iceberg-white + glacier-cyan + arctic-ivory + frozen-silver + polar-grey, polar-pirate",
    ],
    instructions: `Each entry is ONE pirate palette, 12-25 words. Format: comma-separated colors then comma + register-tag. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO lighting language ("golden-hour orange" — describe as material color); NO scene elements (no "captain's-coat-red sash" — just "captain-red"); NO weather words. Material colors with anchors + register-tag.`,
  },

  // ─── weather_drama — environmental drama (50%-gated conditional) ───
  brickbot_pirates_weather_drama: {
    format: 'simple',
    theme: `PIRATE WEATHER / ENVIRONMENTAL DRAMA — atmospheric/oceanic event that AMPLIFIES the scene. Each entry is ONE specific weather or environmental drama event that can fire on a pirate diorama (50%-gated conditional). Each entry 20-40 words.

⚠️ This axis is decoupled from scene_type and lighting — it's the BENDING AXIS that lets us roll "kraken-attack + glass-calm-sea" (eerie tranquil) or "harbor-port + thunderhead-break" (dramatic departure). The drama event AMPLIFIES the moment without prescribing the lighting time-of-day.

VARIETY MANDATE — distribute across:
  • STORM EVENTS (thunderhead-break / squall-mid-deck / lightning-strike-mast / driving-rain / wind-whipped-sails)
  • CALM EVENTS (glass-mirror-calm-sea / dead-calm-becalmed / mist-still-water / glass-water-reflection)
  • FOG / VISIBILITY (dense-fog rolling in / thick-haze obscuring / mid-fog-bank-emergence)
  • OCEAN CREATURES (kraken-tentacles emerging / megalodon-fin / whale-breaching / dolphin-pod / sea-serpent rising)
  • SKY / NIGHT EVENTS (full-moon / blood-moon / shooting-star / aurora over polar-pirate / lunar-eclipse mid-scene)
  • COASTAL HAZARDS (waterspout / hurricane-eye / iceberg-emerging-from-fog / reef-rocks-revealed-at-low-tide)
  • SUPERNATURAL ENVIRONMENTAL (phosphorescent-water / ghost-ship-emerging-from-mist / cursed-fog-with-faces / will-o'-the-wisp-lanterns)
  • BIRDS (storm-petrels-fleeing / albatross-overhead / gulls-mobbing-deck / parrot-flock-screaming)
  • DAY/NIGHT TRANSITION (dawn-line-on-horizon / sunset-fire-on-water / twilight-purple / pre-storm-yellow-light)
  • DEBRIS / WRECKAGE (floating-cargo-from-recent-wreck / drifting-corpse / shark-feeding-frenzy-on-flotsam / lifeless-message-bottle)

Each entry must:
• Name the drama event in first 4-8 words
• Specify WHICH BRICK PARTS render it (trans-pieces / flex-tubes / specific elements)
• Specify the VISUAL IMPACT (what changes in the frame — color cast / motion / focal point)
• NEVER override the lighting axis directly (don't say "golden hour" — say "sun-disk pierces the storm-clouds" instead)`,
    touchpoints: [
      "THUNDERHEAD BREAK — towering brick-built thundercloud-bank to one side built from layered white + light-bley plates with darker-bley underbellies, a brilliant trans-yellow lightning-bolt element striking a distant mast, rain-rods (trans-clear bar pieces) angling across the cloud-edge",
      'GLASS-MIRROR CALM SEA — completely still brick-water using flat trans-blue tiles edge-to-edge with zero foam-crests, the ship\'s reflection visible in the surface (built as inverted mirror-image below), eerie tranquil contrast to any combat-action above',
      'DENSE FOG ROLLING IN — cotton-batting white-and-light-bley plate-stack fog elements layered along the brick-water surface and creeping inward, the distant ship-silhouettes half-obscured by the fog-bank, only mast-tops visible',
      "KRAKEN-TENTACLES EMERGING — multiple trans-dark-green tentacle-builds rising from around the hull on both sides, suction-cups visible (1×1 round-plate inverted), the brick-water around the tentacles disturbed with foam-1×1-round-plates",
      "MEGALODON FIN BREACHING — colossal trans-dark-grey shark-fin element rising above the brick-water beside the ship, the silhouette of the body visible beneath the trans-blue surface, the scale-of-the-shark dwarfing the ship",
      "FULL MOON OVER OCEAN — a 4×4 round-tile in trans-white as the full moon hanging in the brick-sky background, casting a moonlit-path of pale-blue trans-light-blue tile-strip across the brick-water surface to the foreground",
      "BLOOD MOON CURSED-EVENT — same moon-disc but in trans-red, casting a sickly red moonlit-path across the water and tinting the entire scene with red-glow trans-red 1×1 round-plates scattered as atmospheric particulate",
      'WATERSPOUT FUNNEL — a brick-built funnel-cloud reaching from a thunderhead to the brick-water surface using stacked round-bricks tapering to a point, the funnel-base whipping up a debris-cloud of small white 1×1 round-plates',
      "SHARK FEEDING FRENZY — multiple grey dark-bley shark-elements circling beneath the brick-water surface, churning the water with white 1×1 round-plate foam-bursts, the silhouettes barely visible through the trans-blue plates",
      "HURRICANE EYE — circular calm zone of glass-still brick-water in the foreground, with a dramatic brick-built wall-of-storm encircling the edges of the frame, the moment-of-eye-passing before the back-half of the hurricane hits",
      "ICEBERG EMERGING FROM FOG — a massive trans-white + light-blue mountainous iceberg-build looming out of the brick-fog directly in the ship's path, the ship's bow pointing toward the bergy-base, the moment-of-recognition freeze",
      "PHOSPHORESCENT WATER — the brick-water glowing with trans-light-green + trans-cyan 1×1 round-plates scattered across the surface, every wake and disturbance lit up like neon, the cursed-water bioluminescent supernatural-event",
      "STORM-PETRELS FLEEING — a swarm of small dark-bley 1×1 round-plates and small-bird-accessory pieces clustered in the air just above the brick-water surface, all flying in the same direction, the omen-of-bad-weather-approaching",
      "DAWN-LINE ON HORIZON — a horizontal trans-orange + trans-yellow + trans-red brick-stripe along the seam between brick-water and brick-sky in the distance, the sun-disc not yet risen but the light-bleeding-up effect rendered in tile-strip",
      "DRIFTING WRECKAGE — splintered ship-fragments (broken brown brick-pieces + a torn sail-fragment + a floating barrel + a fragment of figurehead) drifting on the brick-water surface beside the ship, evidence of an earlier disaster",
      "AURORA OVER POLAR-PIRATE — vertical trans-green + trans-cyan brick-strip aurora-curtains in the brick-sky background, only fires when scene is set in arctic / polar register, casting an unearthly green glow on the scene",
      "GHOST-SHIP EMERGING FROM MIST — a half-translucent (trans-clear brick-highlighted) ship-silhouette materializing out of a fog-bank in the deep background, only barely-visible, the supernatural omen-of-the-Flying-Dutchman",
      "PRE-STORM YELLOW LIGHT — the brick-sky rendered in sickly trans-yellow + tan plate-stack as the pre-storm jaundice-light, the brick-water glassy and ominous, the calm-before-the-storm freeze-frame",
      "SUNSET FIRE ON WATER — the brick-water lit by a fiery trans-orange + trans-red glow-strip leading from the horizon to the foreground, the ship silhouetted against the burning-sea, dramatic-departure framing",
      "WILL-O'-THE-WISP LANTERNS — small floating trans-green 1×1 round-plate orbs hovering above the brick-water in the foreground, the swamp-cove-supernatural-event, lures-to-doom drifting between the ship and the shore",
    ],
    instructions: `Each entry is ONE pirate weather/environmental drama event, 20-40 words. Format: "DRAMA NAME CAPS — brick-parts + visual-impact". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NEVER specify time-of-day or lighting color cast (no "golden-hour storm" — that's the lighting axis); NEVER lock crew/scene reaction language (no "crew screaming in panic" — that's minifig_action); environmental EVENT only.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES. Available: ${Object.keys(POOL_RECIPES).join(', ')}`);
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
  const entries = [];
  let current = null;
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
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
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
  const outPath = path.resolve(`scripts/bots/brickbot/seeds/${POOL}.json`);
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
    if (fresh.length === 0) { console.warn('  ⚠ empty Sonnet response — stopping iteration'); break; }
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
    if (toAdd.length === 0 && newUnique.length === 0) { console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping'); break; }
  }
  console.log(`\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`);
  if (DRY) { console.log('\nDry-run — not writing to disk.'); return; }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) { fs.copyFileSync(outPath, bakPath); console.log(`Backed up existing pool → ${bakPath}`); }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
