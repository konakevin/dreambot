/**
 * MangaBot — shared prose blocks.
 *
 * Japanese culture + anime aesthetic. Full spectrum: Ghibli / Shinkai /
 * Demon Slayer / Mononoke / Akira / Ghost in the Shell + traditional Edo /
 * samurai / shrines + mythology (kitsune / yokai / oni / tengu) + Neo-Tokyo
 * cyberpunk. Hand-drawn anime illustration quality. Characters by role only.
 */

const PROMPT_PREFIX =
  'stunning anime illustration, hand-drawn Japanese animation quality, Ghibli-Shinkai-Demon-Slayer aesthetic, cel-shaded depth, cinematic anime composition, gorgeously illustrated';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const ANIME_AESTHETIC_BLOCK = `━━━ ANIME ILLUSTRATION AESTHETIC (NON-NEGOTIABLE) ━━━

Every render is HAND-DRAWN ANIME ILLUSTRATION quality. Ghibli / Shinkai / Kyoto Animation / Demon Slayer / Mononoke / Akira / Ghost in the Shell style. Cel-shaded layering, clean linework, painterly backgrounds. NEVER photoreal, NEVER 3D-render, NEVER Western cartoon, NEVER Disney-Pixar CGI. Specific anime studio inflection invited (name-drop style like "Studio Ghibli" or "Shinkai cloud-vista").`;

const NO_NAMED_CHARACTERS_BLOCK = `━━━ CHARACTERS BY ROLE ONLY — NEVER NAMED ━━━

Describe characters by role or archetype: "young warrior", "robed priestess", "spirit-girl", "ronin wanderer", "schoolgirl at window", "cyberpunk street-kid", "kitsune in fox form". NEVER name specific anime characters — no "Naruto", no "Ghibli's Chihiro", no "Akira Tetsuo", no "Nezuko", no IP-protected names. Generic archetypes only, so the render stays our own.`;

const CULTURAL_RESPECT_BLOCK = `━━━ CULTURAL RESPECT ━━━

Japanese culture, mythology, and setting are rendered with respect and accuracy. Traditional details are correct (torii gate orientation, tatami direction, kimono-wrap, katana tsuba, shrine architecture). Mythological beings drawn in authentic spirit (kitsune = fox-spirit with tails, yokai = specific type, oni = horned demon with club, tengu = mountain-spirit with long nose and wings). No caricature. No Orientalism. Drawn with the reverence of a Studio Ghibli animator.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — ANIME AMPLIFICATION ━━━

Anime-illustration is the canvas, not the ceiling. Stack: epic composition + cinematic lighting + saturated colors + atmospheric density + cultural detail + hand-drawn expressiveness + specific anime-studio polish. Every frame should look like a poster-worthy moment from the best anime ever made. Dial scale, drama, cultural richness, and composition to max within the anime-illustration constraint.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — ANIME EDITION ━━━

Wall-poster / anime-movie-cover quality. The kind of frame you pause in the Blu-ray menu. Beautifully composed, emotionally resonant, visually stunning. Not merely pretty — FRAME-WORTHY.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  ANIME_AESTHETIC_BLOCK,
  NO_NAMED_CHARACTERS_BLOCK,
  CULTURAL_RESPECT_BLOCK,
  BLOW_IT_UP_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
};
