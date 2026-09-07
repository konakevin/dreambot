/**
 * AlphaBot candidate — pixel-trickortreat-street (Halloween, destination: PixelBot).
 *
 * CONCEPT: a 16-bit pixel-art night street scene — decorated houses with
 * jack-o-lanterns, small trick-or-treater silhouettes making their rounds,
 * warm porch lights against a purple-to-orange dusk sky. The cozy seasonal
 * sibling to PixelBot's cozy-rpg-town (inhabited hub) and the friendly
 * counter-weight to pixel-horror (gothic monster-slaying) — same medium,
 * opposite mood: this path is PLAYFUL, warm, kid-friendly Halloween, never
 * genuine horror.
 *
 * DESTINATION IDENTITY CLONED FROM scripts/bots/pixelbot/index.js +
 * shared-blocks.js (read in full before writing this path):
 *   - promptPrefix: '16-bit retro pixel art game screenshot, SNES-era sprite
 *     craft, chunky visible pixel grid, dithered limited palette, every
 *     surface clearly pixelated'
 *   - promptSuffix: 'no text, no UI, no HUD, no menus, no health bars, no
 *     watermarks, chunky pixel grid throughout, sharp dithered pixel edges'
 *   - Hard bot-wide mandates: pixel-art register ONLY (never smooth/3D/
 *     photoreal/HD-2D/32-bit-polished), NO IP references, NO UI/HUD/menus,
 *     the "screenshot from a game I desperately wish existed" north star,
 *     always something animated/in-motion.
 *   - allowedModels: ALL_ENABLED_AI_MODELS (multi-provider, per bot rule).
 *   - twoPassPolish target: 65-90 words (this brief targets the same).
 * These are restated as LOCAL consts below (not required from pixelbot's
 * shared-blocks.js) so this file is fully self-contained per the portability
 * contract in ALPHABOT.md — it renders identically whether required from
 * scripts/bots/alphabot/paths/ (prototyping) or, after promotion, from
 * scripts/bots/pixelbot/paths/ (same relative seed-require shape either way,
 * since seeds move alongside the path file).
 *
 * AXES (7 bespoke, none shared with any other path):
 *   1. pixel_trickortreat_street_scene  (pool, 25) — the street/block itself
 *      (SCENE axis, always present): craftsman bungalow row, Victorian
 *      corner block, farmhouse lane, brownstone stoop row, etc.
 *   2. pixel_trickortreat_street_porch  (pool, 25) — MONEY-SHOT axis, always
 *      present: ONE specific hero jack-o-lantern porch/doorway display (the
 *      iconic warm-glow centerpiece the whole path is named for).
 *   3. pixel_trickortreat_street_treater (pool, 25) — small sprite-scale
 *      trick-or-treater silhouette(s) mid-action, GATED 70% (+30% nested
 *      chance of a second) so the street isn't a carbon-copy every render —
 *      per the "never make the signature feature mandatory on every entry"
 *      lesson. These are small, distant, mid-action sprites — never a
 *      close-up portrait (PixelBot's own npc_life axis already casts human
 *      NPCs freely; no non-human-cast constraint applies here).
 *   4. pixel_trickortreat_street_sky    (pool, 25) — the purple-to-orange
 *      dusk/night sky + phenomena, always present (the scene's named light).
 *   5. pixel_trickortreat_street_detail (pool, 25) — secondary yard/street
 *      decor away from the hero porch, GATED 50% (adds texture without
 *      cluttering every shot).
 *   6. weatherPhenomenon (inline array, short fixed list — no pool needed)
 *      GATED 35%.
 *   7. cameraFraming (inline array, short fixed list — no pool needed)
 *      always picked; every option keeps the WHOLE street/block readable
 *      (never a macro/body-part zoom that would dissolve the hero scene).
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE (this path's one hard rule):
 *   PLAYFUL, WARM Halloween register. Every jack-o-lantern grins. Every
 *   costume/silhouette reads cute-spooky, never menacing. This is the
 *   friendly trick-or-treat street, not the pixel-horror dungeon — no
 *   genuine dread, no gore, no real scares. (Stated positively per the
 *   codebase's negation-leak lesson — see HALLOWEEN_REGISTER_MANDATE below.)
 *
 * Requires its own seed pools DIRECTLY as JSON (no pools.js / archetype
 * registry edits) — self-contained per the CANDIDATE-path scope rule.
 */

const SCENES = require('../seeds/pixel_trickortreat_street_scene.json');
const PORCHES = require('../seeds/pixel_trickortreat_street_porch.json');
const TREATERS = require('../seeds/pixel_trickortreat_street_treater.json');
const SKIES = require('../seeds/pixel_trickortreat_street_sky.json');
const STREET_DETAILS = require('../seeds/pixel_trickortreat_street_detail.json');

// Short fixed lists — no generated pool needed (per task guidance: axes that
// are just a handful of options are inlined as plain arrays).
const CAMERA_FRAMING = [
  'street-level 3/4 view looking down the block, sidewalk and porches receding into soft distance',
  'slightly elevated eye-line drifting down the sidewalk toward the row of glowing porches',
  'low, straight-on side-scroller view along the street, houses lined up left to right like a level',
  'gentle low-angle from the front walk looking up toward the hero porch, the rest of the street receding behind it',
];

const WEATHER_PHENOMENA = [
  'a crisp autumn breeze scattering a few fallen leaves across the pavement',
  'thin ground-mist curling low along the curb and gutter line',
  'a soft haze softening the glow of the distant streetlamps',
  'a stray handful of leaves spiraling past on a gust of wind',
  'still, calm night air with a thread of woodsmoke drifting lazily from a chimney',
];

// Cloned bot-wide identity mandates (verbatim in spirit) from
// scripts/bots/pixelbot/shared-blocks.js + archetype-templates.js, restated
// as local consts so this file needs no cross-bot require (see file header).
const PIXEL_ART_REGISTER_MANDATE =
  'PIXEL-ART REGISTER — genuine 16-bit / SNES-era game-sprite pixel art: blocky, countable pixel squares on every surface, hard dithered shading in a limited palette, flat hard-edged color fills with crisp jagged stair-step edges on every curve and diagonal. Lineage: Chrono Trigger + Secret of Mana + Final Fantasy VI + Earthbound + Link to the Past — the actual cartridge-era sprite grid.';
const NO_IP_MANDATE =
  'NO IP REFERENCES — no specific game characters, logos, or recognizable franchises (no "Mario", no pumpkin-headed named villains, no branded costumes). Generic Halloween imagery only, our own pixel universe.';
const NO_UI_MANDATE =
  'NO UI ELEMENTS — no health bars, dialogue boxes, menus, HUDs, mini-maps, button prompts, text overlays, score counters. Pure scene only — what the camera sees with the player UI removed.';
const NORTH_STAR_MANDATE =
  'NORTH STAR — this must feel like "a screenshot from a game I desperately wish existed": a warm seasonal side-quest level, crisp intentional composition, animated-feel detail (a lit window flickering, a treater mid-stride, a curtain of leaves in motion) — never a static postcard.';
const HALLOWEEN_REGISTER_MANDATE =
  'PLAYFUL, WARM HALLOWEEN REGISTER (this path\'s one non-negotiable) — every jack-o-lantern grins warmly, every costume or silhouette reads cute-spooky and friendly. This is the cozy trick-or-treat street, the kind-hearted seasonal cousin of the cozy-rpg-town hub — NOT the pixel-horror dungeon. The mood is candlelit and inviting, a place you would want to walk down at dusk.';

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'pixel_trickortreat_street_scene');
  const porch = picker.pickWithRecency(PORCHES, 'pixel_trickortreat_street_porch');
  const sky = picker.pickWithRecency(SKIES, 'pixel_trickortreat_street_sky');
  const camera = picker.pickWithRecency(CAMERA_FRAMING, 'pixel_trickortreat_street_camera');

  // Trick-or-treater silhouettes — gated 70%, optional second at 30% nested
  // (mirrors the tiny-winter-village cast-gating pattern). Never mandatory
  // on every render so the street isn't a carbon-copy of itself.
  let treaterSection = '';
  if (Math.random() < 0.7) {
    const treaters = [picker.pickWithRecency(TREATERS, 'pixel_trickortreat_street_treater')];
    if (Math.random() < 0.3) {
      const second = picker.pickWithRecency(TREATERS, 'pixel_trickortreat_street_treater');
      if (second !== treaters[0]) treaters.push(second);
    }
    treaterSection = `\n\n━━━ TRICK-OR-TREATERS — small sprite-scale silhouettes, mid-action, part of the street's life (never a closeup, never the sole focus) ━━━\n${treaters.join('\n')}`;
  }

  // Secondary street/yard decor, away from the hero porch — gated 50%.
  let detailSection = '';
  if (Math.random() < 0.5) {
    const detail = picker.pickWithRecency(STREET_DETAILS, 'pixel_trickortreat_street_detail');
    detailSection = `\n\n━━━ STREET DETAIL ━━━\n${detail}`;
  }

  // Light seasonal weather touch — gated 35%.
  let weatherSection = '';
  if (Math.random() < 0.35) {
    const weather = picker.pickWithRecency(WEATHER_PHENOMENA, 'pixel_trickortreat_street_weather');
    weatherSection = `\n\n━━━ WEATHER TOUCH ━━━\n${weather}`;
  }

  return `You are a pixel-art game-art director writing a HALLOWEEN TRICK-OR-TREAT STREET scene for PixelBot. Genre feel: the warm seasonal side-quest level between the cozy-RPG-town hub and the pixel-horror dungeon, but PLAYFUL, never scary — a residential block dressed for the holiday, jack-o-lantern-lit porches, small trick-or-treaters making their rounds, warm window-glow spilling onto the street against a purple-to-orange dusk sky.

━━━ THE STREET / BLOCK ━━━
${scene}

━━━ THE HERO PORCH — the money-shot jack-o-lantern display, the single most eye-catching thing in frame ━━━
${porch}
${treaterSection}

━━━ THE DUSK-TO-NIGHT SKY ━━━
${sky}
${detailSection}
${weatherSection}

This street is ALIVE with warm seasonal spirit: porch lights glowing, jack-o-lanterns flickering, decorations swaying, the whole block caught mid-evening on the best night of the year.

━━━ HARD MANDATES (every render) ━━━

1. ${PIXEL_ART_REGISTER_MANDATE}
2. ${NO_IP_MANDATE}
3. ${NO_UI_MANDATE}
4. ${NORTH_STAR_MANDATE}
5. ${HALLOWEEN_REGISTER_MANDATE}

🚫 ABSOLUTE BANS:
  • Genuine 16-bit pixel-art render — countable pixel blocks and hard dithered shading on every surface
  • NO IP references, no named characters or logos
  • NO UI / HUD / dialogue boxes / health bars / menus
  • NO genuine horror, NO gore, NO real skulls or bones, NO menacing expressions — cute-spooky and warm only
  • NO close-up single-figure portrait — this is a wide street/block scene
  • NO readable text, signage, or price-tags
  • NO camera-brand or photographer names
  • NO sexualized or inappropriate content

━━━ SCENE-WIDE PIXEL PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CAMERA PERSPECTIVE ━━━
${camera}

━━━ COMPOSITION CRAFT — A LIVED-IN TRICK-OR-TREAT BLOCK ━━━

  • FOREGROUND: sidewalk, curb, or front-walk detail leading the eye toward the hero porch
  • MIDGROUND: the hero jack-o-lantern porch and the houses flanking it, each lit and decorated
  • BACKGROUND: the block receding into the purple-orange dusk, more porch-glows fading into distance
  • DEPTH: layered pixel-art depth — sharp foreground, sharp midground, atmospheric distance
  • LIGHTING: warm jack-o-lantern amber-orange glow as the dominant light against the cool dusk sky
  • LIFE: flickering candle-glow, swaying decorations, a treater mid-stride — something always in motion

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write in this exact order ━━━
[the specific street/block type framed in cinematic pixel-art composition], [the hero jack-o-lantern porch display as the clear focal point]${treaterSection ? ', [the trick-or-treater silhouette(s) mid-action, small and sprite-scale]' : ''}, [the purple-to-orange dusk-to-night sky with its phenomena]${detailSection ? ', [the secondary street/yard decor detail]' : ''}${weatherSection ? ', [the light seasonal weather touch]' : ''}, [layered pixel-art depth with the porch glow as the dominant warm light], [16-bit pixel-art register with crunchy visible pixels and dithered shading]

CRITICAL — every surface rendered in countable 16-bit pixel blocks with hard dithered shading. PLAYFUL warm Halloween, never genuine horror. The hero porch's jack-o-lantern glow is the single most eye-catching element in the frame.

Output ONLY 65-90 words. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO bullets. Just the prose.`;
};
