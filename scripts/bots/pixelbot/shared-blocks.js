/**
 * PixelBot — shared prose blocks.
 *
 * PIXEL ART MEDIUM SPECIALIST. Every render is pixel art — 16-bit SNES-era
 * saturation / 32-bit polished / modern-indie-pixel (Celeste / Stardew /
 * Hades-lite / Hyper-Light-Drifter energy). Universal + generic subjects,
 * NO IP references. The bot's identity IS the medium.
 */

const PROMPT_PREFIX =
  'pixel art, 16-bit SNES-era aesthetic, 32-bit polished indie-game quality, Celeste-Stardew-Hyper-Light-Drifter pixel style, limited-palette dithering, visible pixels, gallery-wall-poster indie-pixel art';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const PIXEL_ART_ONLY_BLOCK = `━━━ PIXEL ART ONLY — NON-NEGOTIABLE ━━━

16-bit / 32-bit / modern-indie-pixel aesthetic ONLY. Visible pixels at sub-pixel scale. Limited palettes with careful dithering. NEVER photorealistic, NEVER 3D-render, NEVER vector-smooth. Think Celeste / Stardew Valley / Hyper Light Drifter / Owlboy / Dead Cells production-art.`;

const NO_IP_REFERENCES_BLOCK = `━━━ NO IP REFERENCES ━━━

Generic subjects only. NEVER named franchises or characters — no "Mario", no "Link", no "Cloud Strife", no "Chun-Li", no "Celeste (the character)", no "Pokemon". Evoke style, never IP. Our own pixel universe.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — PIXEL ART EDITION ━━━

Gallery-wall-poster indie-pixel quality. The kind of pixel art that belongs on a wall. Masterful composition + saturation + atmospheric density within pixel-art constraint.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — PIXEL AMPLIFICATION ━━━

Pixel art is the canvas, not the ceiling. Stack: atmospheric particle density + dramatic lighting + layered background depth + animated-feel detail + saturated palette + careful dithering + sub-pixel shading. Every render is the kind of pixel art that goes viral on Twitter.`;

const PIXEL_PRETTY_BLOCK = `━━━ PIXEL PRETTY (pixel-pretty path only) ━━━

NO genre, NO characters, NO action. Pure serene nature + light + atmosphere as gallery-quality pixel art. The kind of pretty pixel-art that becomes a phone wallpaper. Focus entirely on beauty + scene composition + pixel craft.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  PIXEL_ART_ONLY_BLOCK,
  NO_IP_REFERENCES_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  PIXEL_PRETTY_BLOCK,
};
