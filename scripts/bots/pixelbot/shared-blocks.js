/**
 * PixelBot — shared prose blocks.
 *
 * GAMING SCENES SPECIALIST. Every render is pixel art that looks like
 * "a screenshot from a game I desperately wish existed." 8 genre paths:
 * Cozy RPG Towns, Dungeon Depths, Side-Scroller Worlds, Pixel Cyberpunk,
 * Boss Arenas, JRPG Dreamscapes, Pixel Horror, Cozy Farming/Life Sim.
 * Universal subjects, NO IP references.
 */

// 2026-06-02 cruft-audit strip — was 372ch with 5 stacked `NO X` negations
// (smooth gradients / vector smoothing / 32-bit polished pixel-illustration
// / HD-2D / modern indie-pixel painterly hybrid). Per [[feedback_negative_
// prompt_leak]] Flux's CLIP tokenizer ignores `NO` and attends to the
// banned noun — so these negations were actively LEAKING exactly the
// drift they were trying to ban. Also held 6 redundant pixel-style
// anchors (16-bit + SNES-era + chunky grid + low sprite res + dithered
// palette + 2D-RPG sprite forms) competing for first-token weight.
//
// New prefix: short single anchor + the ONE non-redundant style fact
// (chunky pixel grid + dithered palette) stated positively. Other anchors
// live in the PIXEL_ART_ONLY_BLOCK which Sonnet reads but Flux doesn't
// see directly as first tokens.
const PROMPT_PREFIX =
  '16-bit retro pixel art game screenshot, SNES-era sprite craft, chunky visible pixel grid, dithered limited palette, every surface clearly pixelated';

// 2026-06-02 — same negation-leak strip on the suffix. "no text / no UI /
// no HUD / no menus / no health bars / no watermarks" stays (these are
// the standard text/overlay suppressors every bot uses + they target
// stamp-like overlays Flux treats differently from scene content). The
// `no smooth gradients / no anti-aliasing` pair was injecting smooth
// gradient drift exactly like the prefix negations were — stripped.
const PROMPT_SUFFIX =
  'no text, no UI, no HUD, no menus, no health bars, no watermarks, chunky pixel grid throughout, sharp dithered pixel edges';

const PIXEL_ART_ONLY_BLOCK = `━━━ 16-BIT RETRO PIXEL ART ONLY — NON-NEGOTIABLE ━━━

CLASSIC 16-BIT SNES-ERA pixel art only. CHUNKY visible pixel grid on every surface. Low effective sprite resolution. DITHERED gradients (NEVER smooth color blends). Limited intentional palettes. Classic 2D-RPG sprite character forms. NEVER photorealistic, NEVER 3D-render, NEVER vector-smooth, NEVER 32-bit polished pixel-illustration, NEVER HD-2D, NEVER modern painterly-pixel hybrid. Lineage: Chrono Trigger + Secret of Mana + Final Fantasy VI + Earthbound + Link to the Past + Terranigma — true SNES-era 16-bit retro craft.`;

const NO_IP_REFERENCES_BLOCK = `━━━ NO IP REFERENCES ━━━

Generic subjects only. NEVER named franchises, characters, or locations — no "Mario", no "Link", no "Cloud Strife", no "Stardew Pelican Town", no "Mirror Knight", no "Hollow Knight", no "Final Fantasy". Evoke the genre and feel, never the IP. Our own pixel universe.`;

const NORTH_STAR_BLOCK = `━━━ THE NORTH STAR — "a screenshot from a game I desperately wish existed" ━━━

Every render must feel like a real game screenshot from a game that does NOT exist but SHOULD. The viewer's reaction should be: "what game IS this? I want to play it." Crisp framing, intentional composition, animated-feel detail (NPCs/creatures/effects mid-action). NEVER static concept-art — always feels in-motion, like a paused game moment.`;

const NO_UI_BLOCK = `━━━ NO UI / HUD / MENUS / TEXT ━━━

NO health bars. NO mini-maps. NO inventory icons. NO dialogue boxes. NO menus. NO text overlays. NO score counters. NO button-prompt icons. The frame is pure scene — what the camera sees if you removed the player UI. Just the world.`;

const ANIMATED_FEEL_BLOCK = `━━━ ANIMATED-FEEL DETAIL ━━━

Every scene has SOMETHING in motion: animated water (pixel-shimmer), flickering torches, drifting particles, swaying flora, falling rain/snow, glow-pulse on magical objects, NPCs mid-stride, creatures mid-pose, dust motes in light shafts, sprite-trail blur on fast objects. NEVER frozen still life — always paused-game feel.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — PIXEL AMPLIFICATION ━━━

Pixel art is the canvas, not the ceiling. Stack: atmospheric particle density + dramatic lighting + layered parallax background depth + animated-feel detail + saturated palette + careful dithering + sub-pixel shading. Every render is the kind of pixel art that goes viral on Twitter — gallery-wall key-art, the kind people screenshot and post going "look at this game I found."`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  PIXEL_ART_ONLY_BLOCK,
  NO_IP_REFERENCES_BLOCK,
  NORTH_STAR_BLOCK,
  NO_UI_BLOCK,
  ANIMATED_FEEL_BLOCK,
  BLOW_IT_UP_BLOCK,
};
