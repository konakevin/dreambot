const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BOSS_ARENA_SCENES, 'boss_arena_scene');
  const lighting = picker.pickWithRecency(pools.BOSS_ARENA_LIGHTING, 'boss_arena_lighting');
  const atmosphere = picker.pickWithRecency(pools.BOSS_ARENA_ATMOSPHERE, 'boss_arena_atmosphere');

  return `You are writing a 16-bit RETRO PIXEL ART BOSS-BATTLE GAMEPLAY SCREENSHOT for PixelBot. The frame must read INSTANTLY as an in-game boss-battle moment — not concept art, not a key-art poster, not a movie still. A screenshot you'd capture mid-fight in a SNES-era pixel RPG.

${blocks.PIXEL_ART_ONLY_BLOCK}

${blocks.NO_IP_REFERENCES_BLOCK}

${blocks.NO_UI_BLOCK}

━━━ ABSOLUTE CAMERA + COMPOSITION LOCK (NON-NEGOTIABLE) ━━━

The frame uses a CLASSIC 16-BIT BOSS-BATTLE CAMERA — pick ONE per render:
- **TOP-DOWN gameplay view** (Hyper Light Drifter / Diablo / Bastion / Children of Morta) — looking straight down or near-straight-down at the arena floor. Player-sprite tiny on the floor, boss creature on the floor, walls/edges of the arena framing the playable space.
- **3/4 ISOMETRIC view** (Hades / Octopath / Disco Elysium / Salt and Sanctuary / Bastion) — angled-down 30-45° on the arena floor. Tile-floor visible, boss-sprite mid-arena, player-sprite small, arena edges/columns/walls bordering the play space.
- **SIDE-VIEW arena** (Castlevania / Hollow Knight pixel / Salt and Sanctuary platforms) — flat side perspective on a horizontal arena, boss-sprite in middle, player-sprite small to the side, ground visible.

NEVER vertical-portrait dramatic-key-art with a towering silhouette. NEVER concept-art looking-up-at-massive-boss compositions. NEVER cinematic close-up. The player CAN see the entire fightable space.

━━━ MANDATORY ELEMENTS (every render must include all 4) ━━━

1. **ARENA FLOOR clearly visible** — tiled stone, mossy ground, magic-circle inscribed floor, sand-pit, lava-bridge platform, ice-floor, etc. The fightable space is EXPLICIT.
2. **BOSS CREATURE/FIGURE as a SPRITE on the arena** — not a towering background silhouette. The boss is an enemy-sprite IN the play-space (skeleton-king / dragon / minotaur / wraith / treant / golem / kraken / chimera etc.), mid-action (rearing, roaring, swinging weapon, charging energy, wings spread).
3. **PLAYER-SPRITE small on the arena floor** — a single hero pixel-sprite somewhere in the frame, scaled tiny relative to the boss, positioned where the player would actually fight from. Optional 2nd companion sprite.
4. **ARENA EDGES/WALLS framing the play space** — pillars, broken-stones, cliff-edges, mossy walls, magma-cracks, frozen-spike-walls — visible boundaries that define the arena.

━━━ THE BOSS SCENE ━━━
${scene}

━━━ PIXEL LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 16-BIT RETRO REINFORCEMENT ━━━

Lineage: Chrono Trigger / Final Fantasy VI / Secret of Mana / Earthbound / Link to the Past / Diablo II / Hyper Light Drifter / Hades / Octopath Traveler — but rendered as 16-bit chunky pixel-grid retro, NOT as modern HD-2D smooth-illustration.

Visible chunky pixel grid on every surface. NPC + boss are sprite-art forms with limited frames. Floor tiles are clearly tiled. Dithered shading for volume. NEVER smooth gradients, NEVER painterly hybrid.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION CHECKLIST ━━━
- Camera angle: top-down OR 3/4 iso OR side-view (NOT vertical-portrait-key-art)
- Arena floor clearly visible as the playable space
- Boss creature is a SPRITE on the arena (not a silhouette in the sky)
- Player-sprite tiny on the floor
- Arena walls/edges frame the space
- Chunky 16-bit pixel grid throughout
- Mid-fight action (boss roaring/charging/swinging, particles flying, energy arcs)

The viewer should think: "this is a screenshot from a 16-bit boss-battle I'd play."

Output ONLY the raw 70-95 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**.`;
};
