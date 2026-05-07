const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.JRPG_COMBAT_SCENES, 'jrpg_combat_scene');
  const lighting = picker.pickWithRecency(pools.JRPG_COMBAT_LIGHTING, 'jrpg_combat_lighting');
  const atmosphere = picker.pickWithRecency(pools.JRPG_COMBAT_ATMOSPHERE, 'jrpg_combat_atmosphere');

  return `You are writing a 16-bit RETRO PIXEL ART JRPG-COMBAT GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as a screenshot from a classic 16-bit JRPG mid-combat — top-down OR 3/4 isometric view, hero party fighting monsters in an open-world setting, spell effects flying across the screen, monster creatures mid-attack, party mid-cast or mid-strike.

Reference inspiration (use as feel-anchors, NEVER name literally in scene): Final Fantasy IV / V / VI battle scenes + Chrono Trigger active-time combat + Secret of Mana real-time combat + Seiken Densetsu 3 boss fights + Star Ocean combat + Tales of Phantasia combat + Lufia II battles + Y's series action combat.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NO_UI_BLOCK}

━━━ THE NORTH STAR ━━━

The viewer should think: "this is a 16-bit JRPG combat screenshot — a party adventuring in an open world, fighting monsters mid-battle." Top-down or 3/4 isometric camera over an OUTDOOR / DUNGEON OPEN-WORLD setting with a hero party, monster enemies, spell effects flying.

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

**TOP-DOWN OR 3/4 ISOMETRIC** — the camera looks DOWN at the play area from above. The viewer sees:
- The TILE FLOOR / GROUND clearly (grass / stone / sand / forest-floor / cave-floor / ice / lava-rock / ruined-tile)
- HERO PARTY pixel-sprites from ABOVE-AND-BEHIND — 2-4 chunky 16-bit RPG sprites in formation, mid-action
- MONSTER ENEMIES on the tile floor mid-attack
- SPELL EFFECTS / WEAPON EFFECTS visible (fireball-arc, lightning-bolt, ice-shards, healing-glow, sword-slash-arc, arrow-trail, summon-aura)
- OPEN-WORLD framing — outdoor biomes, dungeons WITH light, ruins with sky visible, forest clearings, mountain passes

NEVER side-scrolling. NEVER first-person. NEVER vertical-portrait dramatic cutscene. NEVER cosmic-void abstract setting (different path).

━━━ MANDATORY ELEMENTS (every render must include all 5) ━━━

1. **TOP-DOWN OR 3/4-ISO CAMERA** — looking down at the play area
2. **HERO PARTY of 2-4 chunky 16-bit pixel-sprites** in formation — kid in green tunic with sword raised, mage in blue robe staff glowing, princess in white gown casting healing, warrior in heavy armor mid-axe-swing, ninja with shuriken drawn, monk with quarterstaff mid-spin, paladin in golden armor, ranger with bow drawn, dragoon mid-spear-thrust, samurai with katana raised
3. **MONSTER ENEMY mid-attack** — dragon mid-fire-breath, lich casting necro-spell, forest-spirit lunging, chimera roaring, wraith-cluster swooping, stone-golem stomping, giant-wolf snarling, spider-queen rearing, ice-giant smashing, harpy diving, hydra with multiple heads, demon-knight charging
4. **VISIBLE SPELL / WEAPON EFFECT** — fireball-arc trailing flame, lightning-bolt zigzagging, ice-shard volley, healing-glow aura, sword-slash-arc, arrow-trail, summon-spirit aura, dark-magic-cloud, wind-blade vortex, holy-light-pillar
5. **OPEN-WORLD JRPG SETTING** — forest clearing, mountain pass, grassland, ruined temple, dungeon-room with skylight, lakeshore, snowy plain, desert oasis, cave with crystal-light, ancient ruin courtyard, beach with waves, swamp clearing, frozen lake

━━━ THE COMBAT SCENE ━━━
${scene}

━━━ PIXEL LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 16-BIT RETRO REINFORCEMENT ━━━

Visible chunky pixel grid on every surface. Hero party + enemies are sprite-art forms with hard 16-bit silhouettes. Tile floor clearly tiled. Dithered shading for terrain volume. NEVER smooth gradients, NEVER painterly hybrid. Saturated SNES-era 16-bit palette — emerald-greens / royal-blues / desert-amber / sunset-orange / cave-violet / golden-glow / ruby-red / electric-cyan — RICH chunky color blocks.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION CHECKLIST ━━━
- TOP-DOWN OR 3/4-ISO camera (NEVER side-view / first-person / vertical-portrait / cosmic-void)
- Tile floor visible as the play area
- Hero party of 2-4 mid-action sprites in formation
- Monster enemy mid-attack
- Visible spell or weapon effect
- OPEN-WORLD JRPG setting (forest / mountain / grassland / ruins / dungeon-with-light / etc.)
- Animated particles (drifting petals / dust / firefly-glow / snow / sparkles / spell-residue)
- Chunky 16-bit pixel grid throughout

The viewer should think: "this is a 16-bit JRPG party fighting a monster in the open world."

Output ONLY the raw 70-95 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
