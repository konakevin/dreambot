const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.CLASSIC_JRPG_SCENES, 'classic_jrpg_scene');
  const lighting = picker.pickWithRecency(pools.CLASSIC_JRPG_LIGHTING, 'classic_jrpg_lighting');
  const atmosphere = picker.pickWithRecency(pools.CLASSIC_JRPG_ATMOSPHERE, 'classic_jrpg_atmosphere');

  return `You are writing a 16-bit RETRO PIXEL ART CLASSIC JRPG GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as a moment from a SNES-era top-down RPG — overworld exploration, town hub, dungeon crawl, castle visit, sacred-grove cutscene. Hero party walking through a tile-based world.

Reference inspiration (use as feel-anchors, NEVER name literally in scene): Zelda: A Link to the Past + Link's Awakening + Final Fantasy IV / V / VI + Chrono Trigger + Secret of Mana + Seiken Densetsu 3 + Terranigma + Earthbound / Mother 2 + Illusion of Gaia + Soul Blazer + Lufia II + Dragon Quest VI + Breath of Fire I/II + Suikoden + Lunar: Silver Star Story + Y's series + Tales of Phantasia + Live A Live.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NO_UI_BLOCK}

━━━ THE NORTH STAR ━━━

The viewer should think: "this is a screenshot from a SNES-era top-down JRPG I'd play right now." Tile-based world rendered from a 3-quarter top-down camera, hero party walking through, NPCs at named locations, characteristic biome (forest / desert / castle / town / dungeon / cave). The frame breathes classic 1990s JRPG energy.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

**3-QUARTER TOP-DOWN CAMERA** (looking down at the world from a slight angle, classic SNES-RPG perspective). The viewer sees:
- The tile-based GROUND clearly (grass, stone, sand, water tiles)
- Hero player-sprite + optional party companions FROM ABOVE-AND-BEHIND
- Buildings / trees / structures in front-facing isometric-ish projection
- Layered depth: foreground tiles + middle structures/NPCs + far backdrop biome

Reference angle: Zelda LttP / Chrono Trigger / FF6 / Secret of Mana / Earthbound — NOT pure top-down (no straight-down God's-eye), NOT pure side-view, NOT 3D-isometric-grid. The classic SNES-JRPG 3-quarter camera.

NEVER side-scrolling (that's a different path). NEVER first-person. NEVER straight-down god's-eye. NEVER cinematic-3D-camera.

━━━ MANDATORY ELEMENTS (every render must include all 5) ━━━

1. **TILE-BASED WORLD VISIBLE** — clear tile-grid floor (grass / stone-path / cobble / sand / wooden-floor / cave-stone / water). The terrain reads as a JRPG-overworld or town-hub or dungeon-floor with discrete tiles.
2. **HERO PARTY-SPRITE on the world** — single hero or 2-4 party members walking the tile-map. Small sprites with simple SNES-era forms — kid in green tunic with sword, mage in robe with staff, warrior in armor with shield, princess in gown, ninja in dark garb. Tiny scale, mid-stride.
3. **CHARACTERISTIC BIOME / SETTING** — overworld grass-plain / dense forest / mountain pass / desert / town hub with cobblestone / inn-interior / castle throne-room / dungeon-crypt / sacred grove / volcanic cave / frozen tundra / coastal pier / pirate ship / sky-temple / dwarven mine / elven village / haunted village / wizard's tower / temple ruins / ocean-floor with treasure / lakeside shrine.
4. **NPC LIFE in the scene** — villager NPCs going about routines (vendor at market stall, farmer with hoe, child running, priest at altar, soldier on patrol, dancer in inn) OR enemy creatures patrolling (slime / bat / skeleton / orc / goblin / harpy / wolf — chunky SNES-era enemy sprite forms).
5. **CLASSIC JRPG ENVIRONMENT PROPS** — treasure chest / signpost / pot / statue / fountain / tavern sign / weapon-rack / bookshelf / altar with candles / mossy-rune-stone / bridge / waterfall / castle-banner / hanging tapestry / scattered weapons / glowing-rune-floor.

━━━ THE CLASSIC-JRPG SCENE ━━━
${scene}

━━━ PIXEL LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 16-BIT RETRO REINFORCEMENT ━━━

Visible chunky pixel grid on every surface. Hero + NPCs are sprite-art forms with classic SNES-era silhouettes. Tile-grid floor clearly tiled. Dithered shading for volume. NEVER smooth gradients, NEVER painterly hybrid. Saturated SNES-era palette — emerald greens / royal blues / desert ambers / castle-grays / dungeon-violets / golden-glow accents.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION CHECKLIST ━━━
- 3-quarter top-down camera (NEVER side-scrolling / first-person / straight-down / 3D-iso-grid)
- Tile-based world clearly visible
- Hero party-sprite small mid-stride on the world
- Characteristic JRPG biome / setting
- NPC life or enemy creatures in the scene
- Classic JRPG props (treasure chest / signpost / altar / fountain / etc.)
- Animated particles (drifting petals / dust motes / firefly-glow / dripping water / falling leaves / sparkles)
- Chunky 16-bit pixel grid throughout

The viewer should think: "this is a screenshot from a SNES-era classic top-down JRPG I'd play right now."

Output ONLY the raw 70-95 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
