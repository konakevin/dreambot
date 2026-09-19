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

// Clean-render medium for gpt-image-2 + nano-banana (routed via
// cleanMediumByModel in index.js) — keeps these models rendering crisp readable
// pixel art instead of drifting off-style. Light genre tag, positive-only.
const GPT_CLEAN =
  'Clean crisp pixel-art illustration, readable pixel-art game scene with clear sprites and environment, vibrant limited palette, sharp pixel grid, retro-game register';

module.exports = {
  GPT_CLEAN,
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  PIXEL_ART_ONLY_BLOCK,
  NO_IP_REFERENCES_BLOCK,
  NORTH_STAR_BLOCK,
  NO_UI_BLOCK,
  ANIMATED_FEEL_BLOCK,
  BLOW_IT_UP_BLOCK,
};

// ─────────────────────────────────────────────────────────────────────────────
// PIXEL PAINTING register (scene paths, 2026-09-19, PIXELBOT_SCENES_PLAN.md).
// A second bot-local medium: pixel PAINTINGS of places, not game screenshots.
// Everything here is POSITIVE-ONLY. Identity + quality live in the prefix; the
// rolled LOOK (pixelbot_look_register) owns dither / palette count / outline /
// shading technique; the medium fragment owns content + composition.
// ─────────────────────────────────────────────────────────────────────────────
// Kevin 2026-09-19 (mid-build steer): "whimsical, somewhat magical looking pixelart that
// evokes that old school feel and charm", never realistic geography (EarthBot's lane), and
// the medium must be unmistakably pixels / near-pixel / voxel, never a digital painting.
// Kevin 2026-09-19 (recalibration): "how video games have historically rendered pixel
// scenes: how Final Fantasy would have pretty pixel art for its splash or loading screens,
// or old school Ultima scenes." The register IS a classic game's title / splash / loading
// scene: era-authentic limited palette, dithered gradient sky, chunky pixels or tiles.
// Kevin: "they should still be pretty and not dummed down, but the medium and vibe need to
// feel old school, while still pulling off a beautiful/cool render." Beauty + detail stay
// high; era lives in the pixel medium and the whimsical vibe.
const PAINTING_PREFIX =
  'beautiful classic video-game splash-screen pixel art, the lush pretty scene an old RPG shows on its title screen, richly detailed pixels on a visible pixel grid, dithered gradient sky, limited era palette, old-school storybook charm';
const PAINTING_MEDIUM =
  'a beautiful old-school game scene with a little magic in it: every surface built from richly detailed pixels, layered depth to the horizon, glowing light, one clear subject with room to breathe';
const PAINTING_SUFFIX = 'no text, no watermarks, every surface pixelated, crisp dithered pixel edges';

// The rolled pixel sub-style. Plain cooperative wording (never "override" /
// "authority" / "non-negotiable": those trip Sonnet's own refusal patterns and
// the refusal text gets rendered). Returns '' when no look rolled.
const PIXEL_LOOK_OVERRIDE = (sharedDNA) =>
  sharedDNA && sharedDNA.lookRegister
    ? `Please write the Flux prompt using this pixel-art style throughout: ${sharedDNA.lookRegister}
Keep every scene element, the composition, and the light exactly as described below; just describe everything with this style's pixel technique. Start the prompt with these style words.

`
    : '';

// Scene-path blocks: short on purpose (stacked verbose mandates push Flux to its
// generic centroid). Each is one idea.
const SCENE_REGISTER_BLOCK = `This is the pretty pixel-art SCENE a classic video game shows on its title, splash, or loading screen (the way 16-bit Final Fantasy painted its vistas, or an old-school Ultima tile world), not a gameplay screen with sprites and menus, and not a realistic landscape: a whimsical storybook place with a little magic in it (glowing light, an oversized moon, candy-coloured dithered sky bands, a tiny cottage or windmill, rounded exaggerated shapes), one clear subject, layered depth, an era-authentic limited palette. It is still BEAUTIFUL and richly detailed: the composition, depth, and light of a great painting, delivered in an old-school pixel medium with an old-school whimsical vibe. Every surface is unmistakably built from pixels. Describe only what is present.`;

const ONE_HERO_BLOCK = `One hero, one place, one quiet moment. The hero owns 30 to 60 percent of the frame with breathing room around it. Depth in layers: near, middle, far, sky. Never a collage of equal elements.`;

const TINY_LIFE_BLOCK = `If life is present it is small: an animal, a bird, or a single figure turned away or at distance, never a portrait, never a crowd.`;

const PICTORIAL_BLOCK = `Every sign, hull, poster, banner, and window is blank or carries a simple pictorial symbol.`;

const SCENE_STRUCTURE = (order) => `Write the prompt in this order: ${order}.
LENGTH IS THE #1 RULE: 70 to 95 words, count them. Name the hero and stop.
Output ONLY the prose prompt, comma-separated phrases. No preamble, no headers, no ━━━ markers, no bold labels, no bullets.`;

module.exports.PAINTING_PREFIX = PAINTING_PREFIX;
module.exports.PAINTING_MEDIUM = PAINTING_MEDIUM;
module.exports.PAINTING_SUFFIX = PAINTING_SUFFIX;
module.exports.PIXEL_LOOK_OVERRIDE = PIXEL_LOOK_OVERRIDE;
module.exports.SCENE_REGISTER_BLOCK = SCENE_REGISTER_BLOCK;
module.exports.ONE_HERO_BLOCK = ONE_HERO_BLOCK;
module.exports.TINY_LIFE_BLOCK = TINY_LIFE_BLOCK;
module.exports.PICTORIAL_BLOCK = PICTORIAL_BLOCK;
module.exports.SCENE_STRUCTURE = SCENE_STRUCTURE;
