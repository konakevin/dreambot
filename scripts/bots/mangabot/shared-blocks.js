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

This frame is a POSTER-QUALITY ANIME KEYFRAME — frame-worthy, wallpaper-worthy. The reaction goal is "I want to live in this world" + "instant save."

The CAMERA FRAMING axis (rolled per render — see below) DRIVES the composition. Apply it exactly. The framing may be a low-angle hero shot, a tight medium-shot of the character mid-action, a profile dynamic-action shot, a forward three-quarter, an over-the-shoulder, a Dutch tilt, a high-angle, an aerial sweep — whatever was rolled, honor it.

DEPTH ON DEPTH — three planes minimum: foreground (tactile detail near camera), midground (subject + immediate scene), background (vista / horizon / atmospheric thinning). This is non-negotiable; composition variety is non-negotiable too.

NEVER an iPhone-snapshot deadpan. The camera is intentional and storytelling.`;

// ━━━ THE DENSITY MANDATE ━━━
//
// Quality-floor count rules. Every prompt must hit these counts or
// the render reads as flat / empty / generic. (Unchanged 2026-05-29.)
const DENSITY_BLOCK = `━━━ DENSITY MANDATE — NO EMPTY SPACE (NON-NEGOTIABLE) ━━━

Every render must include AT MINIMUM:

1) **2+ ATMOSPHERE EFFECTS** weaving through the frame (rain / fog / drifting cherry petals / falling snow / dust motes / volumetric god rays / steam / smoke haze / fireworks sparks / glowing embers / fireflies / leaves drifting / mist rolling / starlit haze). Atmospheric particles MUST be present and visible.

2) **2+ LIGHTING DESCRIPTORS** sculpting the scene (golden-hour glow / neon reflections / lantern light / moonlight rim light / soft bloom highlights / volumetric god rays / dramatic high-contrast chiaroscuro / firelight glow / late-afternoon amber / cool-blue blue-hour / harsh stadium lighting / signage glow on wet pavement). Light is the EMOTIONAL DRIVER.

3) **8+ ENVIRONMENTAL MICRO-DETAILS** populating the frame (signage / lanterns / torii gates / shrine charms / power lines / vending machines / wet pavement reflections / train tracks / paper talismans / market stalls / rooftop fences / sakura trees / stone steps / stained glass / castle spires / floating islands / mech scaffolding / magical runes / banners / posters / bicycles / hanging laundry / kerosene heaters / kotatsu / shoji screens / bell-charms / neon signs / coffee cups / record sleeves / hanging plants / wires / ramen bowls / chopsticks / hand-painted signs / etc.). Pull from this bank or invent kindred details. EVERY surface and corner has SOMETHING specific.

DENSE LAYERED BACKGROUND DETAIL — NO EMPTY SPACE. The background is as carefully composed as the foreground.`;

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

This is a STORY MOMENT, not a posed product-shot. The frame implies a moment with weight:
- Someone just left (a half-empty cup / an open door / a fading footprint / a still-swaying lantern)
- Something is about to happen (gathering storm / lit fuse / approaching figure in distance / first petal falling)
- The world has a history (worn-stone steps / patina on metal / faded posters / cracked screens / trodden paths)

If a CHARACTER is present:
- They are ENGAGED — mid-step / mid-strike / mid-laugh / mid-cast / mid-turn / mid-reach. Body weight shifted. A limb in motion. Hair / clothing caught in air.
- Their eyes are WHERE THE ACTION IS — toward the viewer if the camera frames them forward, into the scene if they're focused on an event, sideways if mid-turn. Eye direction is dictated by the rolled camera_framing + the action_moment, not by a default "looking off-frame" rule.
- They occupy 30-60% of the frame depending on the rolled framing — a low-angle hero shot may fill 50-60%; a wide establishing may show them at 25-30%; a tight medium-shot may put them at 45-55%. The rolled camera_framing decides.
- They are INSIDE the action, not a posed model. CANDID inside their world.

If NO character — the environment itself tells the story.`;

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

ABSOLUTELY NO "beautiful anime girl standing." NO "anime guy in arms-crossed swagger pose." NO runway stance. NO neutral standing portrait. NO product-shot framing where the character is centered like a video game character-select screen.

Every character is DOING something — mid-step / mid-strike / mid-laugh / mid-cast / mid-reach / mid-turn. Body weight shifted, a limb in motion, fabric or hair caught in air. Eye direction is whatever fits the rolled camera + action — eye contact is FINE for forward-facing framings, eyes-into-scene is FINE for environmental framings. The ban is on STATIC POSED, not on eye contact.`;

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

⚠️ NON-NEGOTIABLE — the rolled camera_framing axis above DRIVES the composition. Apply the exact camera position + character orientation it describes. Flux's "anime keyframe + cinematic + atmospheric" training prior wants to default to "back-of-character silhouette looking out at lush scenery" — OVERRIDE THAT BIAS HARD.

⚠️ CHARACTER ORIENTATION VARIETY MANDATE — match the rolled camera_framing:
  • LOW-ANGLE HERO / UP-SHOT — character is ABOVE the camera, three-quarter forward or full-front, face visible and engaged
  • OVER-THE-SHOULDER — over the character's shoulder TOWARD what they're seeing (not the character's back as the subject)
  • FORWARD THREE-QUARTER — character angled toward viewer at 3/4, face readable, eyes engaged with action
  • TIGHT MEDIUM-SHOT — waist-up or shoulders-up, face dominant, dynamic expression
  • PROFILE DYNAMIC-ACTION — side-on full silhouette caught mid-action (strike / leap / cast), face visible in profile
  • DUTCH TILT / CANTED — character mid-action with frame rotated; face still readable
  • HIGH-ANGLE / BIRD'S-EYE — character below camera, face turned upward toward something, still engaged
  • WIDE ESTABLISHING — only ONE composition out of MANY — character may be smaller in frame but must still be ENGAGED (mid-action, dynamic pose, NOT a tiny back-silhouette)

The DEFAULT failure mode is "tiny dark figure from behind looking out at lush scenery." Reject that composition unless the rolled camera_framing explicitly calls for it.`;

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

module.exports = {
  GPT_CLEAN,
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
