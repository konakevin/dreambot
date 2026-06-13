/**
 * MangaBot — shared prose blocks.
 *
 * Quality floor enforced as shared blocks: every path inherits the
 * keyframe mandate, the density mandate, the story-moment mandate.
 *
 * ── 2026-05-29 OVERHAUL ──
 * Original 2026-05-08 rebuild over-corrected into a "world is the show,
 * character is a fraction, no eye contact" architecture that produced
 * a homogenous "back-of-character looking out at scenery" composition
 * across 13 of 14 hearted renders (audit on 2026-05-29). The rewrite:
 *   • Wrapper (PROMPT_PREFIX/SUFFIX) — composition language stripped;
 *     anime medium + style lineage only. Composition comes from the
 *     per-path camera_framing axis.
 *   • Keyframe composition block — no longer mandates "STRONG FOREGROUND
 *     FRAMING / NEVER head-on / character's shoulder cut by the edge";
 *     defers composition to the rolled camera_framing axis.
 *   • Story-moment block — no longer says "eyes NEVER locked at camera /
 *     world is the costar / character a fraction of the frame". Positive
 *     mandate: dynamic engagement, eyes WHERE THE ACTION IS (toward
 *     viewer / into scene / sideways per the rolled camera angle),
 *     character occupies 30-60% of frame depending on framing.
 *   • No-generic-pose block — replaces blanket "no eyes-at-camera" with
 *     "no static posed thumbnail"; eye contact is fine if camera_framing
 *     supports it.
 *   • NEW: CAMERA_FRAMING_MANDATORY_BLOCK — BrickBot R3 pattern; flags
 *     camera_framing as MANDATORY DRIVING AXIS + ties pose/orientation
 *     variety to camera keywords so Flux can't default back to the
 *     back-of-character centroid.
 */

// PROMPT_PREFIX bakes the bot's render-medium (anime illustration + style
// lineage) ONLY. NO composition language — composition is rolled per-path
// via the camera_framing axis (per playbook lesson:
// "stuffed wrappers GRIDLOCK diversity"). Stripped 2026-05-29:
//   "cinematic composition with strong foreground framing,"
//   "dense layered background detail with no empty space,"
//   "poster-quality anime keyframe,"
const PROMPT_PREFIX =
  'hand-drawn anime illustration in the Ghibli / Shinkai / Kyoto Animation tradition, cel-shaded clean linework with painterly atmospheric backgrounds, vibrant saturated color palette';

// PROMPT_SUFFIX — style + finish + no-text only. Composition removed.
// Stripped 2026-05-29:
//   "dramatic perspective,"
//   "emotional cinematic still,"
//   "frame-worthy anime poster art,"
//   "beautiful bokeh and lens flare accents," (lens-defining composition)
// 2026-06-02 cruft-audit micro-strip — dropped `ultra-detailed` tech-spec.
const PROMPT_SUFFIX =
  'soft bloom highlights, atmospheric depth haze, filmic color grading, detailed environment rendering, no text no words no watermarks no logos no frame borders';

// ━━━ KEYFRAME COMPOSITION — defer to rolled camera_framing axis ━━━
//
// 2026-05-29 rewrite: original block hard-mandated "STRONG FOREGROUND
// FRAMING / NEVER head-on / NEVER centered hero pose" which compounded
// with the wrapper and the per-template anti-eyes language to produce
// back-of-character drift. New block defers composition entirely to
// the rolled camera_framing axis + preserves the depth-on-depth mandate.
const KEYFRAME_COMPOSITION_BLOCK = `━━━ KEYFRAME COMPOSITION ━━━

A poster-quality anime keyframe driven by the rolled camera_framing axis, with three depth planes minimum — foreground tactile detail, midground subject, background vista thinning into atmosphere.`;

// ━━━ THE DENSITY MANDATE ━━━
//
// Quality-floor count rules. Every prompt must hit these counts or
// the render reads as flat / empty / generic. (Unchanged 2026-05-29.)
const DENSITY_BLOCK = `━━━ DENSITY MANDATE — NO EMPTY SPACE ━━━

Layer the frame densely: 2+ atmosphere effects weaving through (rain / petals / snow / dust motes / god rays / steam / embers / fireflies / mist), 2+ lighting descriptors sculpting the scene as emotional driver, and 8+ specific environmental micro-details populating every surface and corner. The background is composed as carefully as the foreground — no empty space.`;

// ━━━ STORY MOMENT — dynamic engagement (REWRITTEN 2026-05-29) ━━━
//
// Original block said "eyes NEVER locked at the camera / world is the
// costar / character occupies a fraction of the frame". Those three
// mandates compounded into "tiny dark silhouette from behind looking at
// scenery" across nearly every render. New block keeps the story-moment
// framing (someone-just-left / something-about-to-happen / world-has-history
// environmental beats) and replaces the anti-character mandates with
// positive dynamic-engagement language.
const STORY_MOMENT_BLOCK = `━━━ STORY MOMENT — ENVIRONMENTAL STORYTELLING ━━━

This is a story moment with weight, not a posed product-shot — someone just left, something is about to happen, or the world carries its history. Any character is ENGAGED (mid-step / strike / laugh / cast / turn), body weight shifted and a limb in motion, eyes wherever the rolled camera_framing + action point them, occupying 30-60% of the frame per the framing — candid inside their world, not a posed model. If no character, the environment tells the story.`;

// ━━━ ANIME ILLUSTRATION MEDIUM (LOCKED) ━━━ — unchanged
const ANIME_ILLUSTRATION_BLOCK = `━━━ ANIME ILLUSTRATION MEDIUM (LOCKED) ━━━

Render as HAND-DRAWN ANIME ILLUSTRATION. Studio Ghibli / Makoto Shinkai / Kyoto Animation / Demon Slayer (ufotable) / Akira (Otomo) / Mononoke (Studio Ghibli) tradition. Cel-shaded clean linework with painterly atmospheric backgrounds. Vibrant saturated palette. Visible brushwork in skies and atmosphere; crisp ink linework on subjects.

NEVER photoreal. NEVER 3D-render. NEVER Disney-Pixar CGI. NEVER Western cartoon. NEVER manga-pure-black-and-white (this is COLOR keyframe art).`;

// ━━━ NO NAMED CHARACTERS ━━━ — unchanged
const NO_NAMED_CHARACTERS_BLOCK = `━━━ CHARACTERS BY ROLE ONLY — NEVER NAMED ━━━

Describe characters by role / archetype: "young warrior", "schoolgirl at window", "robed priestess", "ronin wanderer", "cyberpunk street-kid", "kitsune in fox form", "off-duty barista", "shrine maiden", "magical-girl mid-transformation". NEVER name specific anime characters or franchises — no Naruto / Goku / Chihiro / Akira-Tetsuo / Nezuko / Saber / Asuna. Generic archetypes only.`;

// ━━━ NO STATIC POSED THUMBNAIL (REWRITTEN 2026-05-29) ━━━
//
// Original block said "NO eyes-at-camera modeling shots" as a blanket
// rule — that compounded with STORY_MOMENT's "eyes NEVER at camera" to
// force back-of-character drift. New block bans STATIC POSED thumbnails
// (the actual failure mode) without prohibiting eye contact.
const NO_GENERIC_POSE_BLOCK = `━━━ NO STATIC POSED THUMBNAIL (CRITICAL) ━━━

No neutral standing portrait or centered character-select pose. Every character is DOING something — mid-step / strike / laugh / cast / reach / turn — body weight shifted, a limb in motion, fabric or hair caught in air. Eye direction is whatever fits the rolled camera + action; the ban is on STATIC POSED, not on eye contact.`;

// ━━━ CAMERA FRAMING — MANDATORY DRIVING AXIS (NEW 2026-05-29) ━━━
//
// Mirror of BrickBot's R3 lesson (BOT_SCENE_QUALITY_PLAYBOOK.md):
// "Camera_framing pool entries get IGNORED by Flux unless the template
// flags the axis as MANDATORY." Plus pose-orientation variety mandates
// tied to camera keywords so Flux can't default back to its trained
// "anime keyframe = back-of-character looking at scene" centroid.
//
// Per-path archetype templates should include this block (or paste it
// inline) right where their camera_framing axis is interpolated. Bot-
// wide so every path benefits.
const CAMERA_FRAMING_MANDATORY_BLOCK = `━━━ CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━

⚠️ NON-NEGOTIABLE — the rolled camera_framing axis above DRIVES the composition. Apply the exact camera position + character orientation it describes, and match the character's facing/engagement to it (low-angle hero = face visible above camera, over-the-shoulder = toward what they see, profile = side-on mid-action, etc.). Flux's "anime keyframe + cinematic + atmospheric" training prior wants to default to "back-of-character silhouette looking out at lush scenery" — OVERRIDE THAT BIAS HARD. Reject that tiny-back-silhouette default unless the rolled camera_framing explicitly calls for it.`;

// ━━━ CULTURAL RESPECT ━━━ — unchanged
const CULTURAL_RESPECT_BLOCK = `━━━ CULTURAL RESPECT ━━━

Japanese culture, mythology, and setting are rendered with respect and accuracy. Traditional details correct (torii gate orientation / tatami direction / kimono-wrap / katana tsuba / shrine architecture). Mythological beings drawn in authentic spirit (kitsune = fox-spirit with multiple tails, yokai = specific named type, oni = horned demon with iron club, tengu = mountain-spirit with long nose and wings). No caricature. No Orientalism. The reverence of a Studio Ghibli animator.`;

// Clean-render medium for nano-banana (routed via cleanMediumByModel in
// index.js). gpt-image-2 was banned bot-wide because the bot's anime medium
// drove it into a weird drift state — if/when gpt-2 is re-enabled, this clean
// medium is the intended fix and should be wired in alongside banana.
// Light genre tag, positive-only.
const GPT_CLEAN =
  'Clean cel-shaded anime illustration, crisp render with clearly readable characters and recognizable anime environments, vibrant saturated palette, atmospheric depth, hand-drawn anime register';

// ANIME_NEUTRAL — the "looks" medium (2026-06-07). Locks the anime-illustration
// IDENTITY (it's 2D hand-drawn anime, not photoreal/3D/Western-cartoon) but
// DROPS the fixed Ghibli/Shinkai/KyoAni style lock that PROMPT_PREFIX bakes in.
// The specific art-style era / linework / shading / palette is set by the rolled
// sharedDNA.lookRegister tokens that lead the Sonnet prompt — so each render gets
// a different anime look while staying unmistakably anime. Used only by the
// look-enabled paths (mediumByPath in index.js); the 4 style-locked paths
// (ghibli-countryside / ghibli-painterly / slice-of-life / samurai-era) keep the
// original 'anime' medium + PROMPT_PREFIX. Pattern mirrors YumBot's
// YUMBOT_FOOD_NEUTRAL (playbook: "Medium Looks" architecture).
const ANIME_NEUTRAL =
  'The entire scene is rendered as 2D hand-drawn Japanese anime/manga art — characters, creatures, and environments all in authentic anime illustration with drawn linework and painted backgrounds, never photoreal, never 3D CGI, never Western cartoon. The specific art-style era, linework weight, shading method, and color treatment are set by the look-register tokens that lead the prompt.';

module.exports = {
  GPT_CLEAN,
  ANIME_NEUTRAL,
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  KEYFRAME_COMPOSITION_BLOCK,
  DENSITY_BLOCK,
  STORY_MOMENT_BLOCK,
  ANIME_ILLUSTRATION_BLOCK,
  NO_NAMED_CHARACTERS_BLOCK,
  NO_GENERIC_POSE_BLOCK,
  CAMERA_FRAMING_MANDATORY_BLOCK,
  CULTURAL_RESPECT_BLOCK,
  // Backwards-compat aliases — existing path files still reference the
  // old names. Aliases will be removed after path-file rewrites complete.
  ANIME_AESTHETIC_BLOCK: ANIME_ILLUSTRATION_BLOCK,
  BLOW_IT_UP_BLOCK: KEYFRAME_COMPOSITION_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK: KEYFRAME_COMPOSITION_BLOCK,
};
