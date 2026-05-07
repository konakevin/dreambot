const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.DUNGEON_DEPTH_SCENES, 'dungeon_depth_scene');
  const lighting = picker.pickWithRecency(pools.DUNGEON_DEPTH_LIGHTING, 'dungeon_depth_lighting');
  const atmosphere = picker.pickWithRecency(pools.DUNGEON_DEPTH_ATMOSPHERE, 'dungeon_depth_atmosphere');

  return `You are writing a 16-bit RETRO PIXEL ART DIABLO-STYLE TOP-DOWN DUNGEON-CRAWLER GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as a level from a classic Diablo-style top-down dungeon-crawler — looking DOWN at the dungeon floor from above, hero adventurer pixel-sprite small in the center, treasure chambers, ambush corridors, monster encounters, loot piles. NOT side-scroller (that's a different path). NOT cinematic concept art.

Genre lineage: Diablo (and Diablo II) pixel-style + Hades chamber-reveals (top-down) + Hyper Light Drifter (top-down ruins) + Children of Morta (top-down) + Death's Gambit + Moonlighter (top-down dungeon) + Eitr + Heroes of Hammerwatch (top-down dungeon).

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NO_UI_BLOCK}

${blocks.ANIMATED_FEEL_BLOCK}

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

**TOP-DOWN OR NEAR-TOP-DOWN 3/4 ISOMETRIC** — the camera looks DOWN at the dungeon floor. The viewer sees:
- The TILE FLOOR clearly (stone tiles, cracked-flagstone, mossy-stone, bone-tile, magma-cracked, blood-stained tiles)
- HERO ADVENTURER pixel-sprite from ABOVE-AND-BEHIND — small armored figure with sword/staff/bow, walking the dungeon floor
- WALLS / COLUMNS / CORRIDOR EDGES framing the play space
- DUNGEON PROPS scattered on the floor: skeletal remains, treasure chests, scattered coins, broken weapons, sarcophagi, blood-pools, runic-circles, dripping candles, urns, magic-glow puddles

NEVER side-scrolling (foreground-platform horizontal layout). NEVER first-person. NEVER vertical-portrait dramatic key-art. NEVER cinematic close-up of single boss (that's a different path).

━━━ MANDATORY ELEMENTS (every render must include all 4) ━━━

1. **TOP-DOWN OR 3/4-ISO TILE FLOOR clearly visible** — the play-floor is the dominant element, taking up most of the frame
2. **HERO ADVENTURER pixel-sprite small on the floor** — armored knight, robed mage, hooded ranger, dual-wielding rogue, plate-armored paladin, leather-clad assassin — mid-stride or mid-action
3. **MONSTER ENCOUNTER OR DUNGEON THREAT in the chamber** — patrolling skeleton, charging zombie, bat-cluster, lich casting, demon-imp, slime-pile, undead-knight, spider-queen, mimic-chest. Mid-action.
4. **DIABLO-STYLE LOOT / DUNGEON PROPS** — treasure chest with overflowing gold, scattered coins / gems, glowing weapon on the floor, runic-altar, dripping candelabra, blood-pool, skeletal remains, bone-piles, urns, magic-rune glow on tiles

━━━ THE DUNGEON SCENE ━━━
${scene}

━━━ PIXEL LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 16-BIT RETRO REINFORCEMENT ━━━

Visible chunky pixel grid on every surface. Hero + enemies are sprite-art forms with hard 16-bit silhouettes. Floor tiles clearly tiled. Dithered shading for stone-volume. NEVER smooth gradients, NEVER painterly hybrid. Saturated dark gothic palette — deep stone-grays / blood-reds / candle-orange / sickly-green poison / magic-violet / blue-black shadow.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION CHECKLIST ━━━
- TOP-DOWN OR 3/4-ISO camera (NEVER side-view / first-person / dramatic-portrait)
- Tile floor visible as the play-space
- Hero adventurer pixel-sprite small on the floor
- Monster encounter mid-action
- Diablo-style loot / dungeon props on the floor
- Animated particles (drifting dust motes / dripping water / drifting smoke / glow-spore / firefly-glow / breath-mist)
- Chunky 16-bit pixel grid throughout

The viewer should think: "this is a screenshot from a 16-bit Diablo-style top-down dungeon-crawler I'd play right now."

Output ONLY the raw 65-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
