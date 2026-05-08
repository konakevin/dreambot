/**
 * MangaBot — shared prose blocks (rebuilt 2026-05-08).
 *
 * Quality floor enforced as shared blocks: every path inherits the
 * keyframe mandate, the density mandate, the story-moment mandate.
 * Tear-down rule: if a render isn't poster-worthy, the failure is in
 * the path's specific pools, not the shared framework — these blocks
 * guarantee composition, lighting, atmosphere, micro-detail count,
 * and story-presence on every single render.
 */

// PROMPT_PREFIX bakes in the three non-negotiable phrases that every
// MangaBot render must include. Front-loaded for Flux's early-token
// weight bias.
const PROMPT_PREFIX =
  'poster-quality anime keyframe, cinematic composition with strong foreground framing, dense layered background detail with no empty space, hand-drawn anime illustration in the Ghibli / Shinkai / Kyoto Animation tradition, cel-shaded clean linework with painterly atmospheric backgrounds, vibrant saturated color palette';

// PROMPT_SUFFIX layers in the style-language vocabulary plus negatives.
const PROMPT_SUFFIX =
  'soft bloom highlights, atmospheric depth haze, filmic color grading, beautiful bokeh and lens flare accents, ultra-detailed environment rendering, dramatic perspective, emotional cinematic still, frame-worthy anime poster art, no text no words no watermarks no logos no frame borders';

// ━━━ THE KEYFRAME COMPOSITION MANDATE ━━━
//
// Every render is a frozen instant from the most beautiful frame of an
// anime opening / movie cutscene / poster art. Mandatory composition
// rules baked in.
const KEYFRAME_COMPOSITION_BLOCK = `━━━ KEYFRAME COMPOSITION (NON-NEGOTIABLE) ━━━

This frame is a POSTER-QUALITY ANIME KEYFRAME — the single most beautiful frame from an anime opening, movie cutscene, or finished poster artwork. Frame-worthy. Wallpaper-worthy. The reaction goal is "I want to live in this world" + "instant save."

Composition rules:
- STRONG FOREGROUND FRAMING — there is ALWAYS a foreground element framing the shot (silhouetted branches / lantern in foreground / chain-link fence / banister railing / character's shoulder cut by the edge / steam from a bowl / rain-streaked window / hand reaching into frame). The foreground anchors depth — never a flat single-plane composition.
- DRAMATIC PERSPECTIVE — choose ONE: low-angle hero-shot looking up / high-angle looking down on the scene / over-the-shoulder anchored / dutch tilt / shallow-DOF dolly-in. NEVER head-on flat coverage.
- DEPTH ON DEPTH — three planes minimum: foreground (tactile detail near camera), midground (subject + immediate scene), background (vista / horizon / atmospheric thinning).
- CINEMATIC ANGLE — the camera is intentional and storytelling. NEVER looks like an iPhone snapshot. NEVER a centered hero pose at viewer eye-level.

The composition is the SHOW.`;

// ━━━ THE DENSITY MANDATE ━━━
//
// Quality-floor count rules. Every prompt must hit these counts or
// the render reads as flat / empty / generic.
const DENSITY_BLOCK = `━━━ DENSITY MANDATE — NO EMPTY SPACE (NON-NEGOTIABLE) ━━━

Every render must include AT MINIMUM:

1) **2+ ATMOSPHERE EFFECTS** weaving through the frame (rain / fog / drifting cherry petals / falling snow / dust motes / volumetric god rays / steam / smoke haze / fireworks sparks / glowing embers / fireflies / leaves drifting / mist rolling / starlit haze). Atmospheric particles MUST be present and visible.

2) **2+ LIGHTING DESCRIPTORS** sculpting the scene (golden-hour glow / neon reflections / lantern light / moonlight rim light / soft bloom highlights / volumetric god rays / dramatic high-contrast chiaroscuro / firelight glow / late-afternoon amber / cool-blue blue-hour / harsh stadium lighting / signage glow on wet pavement). Light is the EMOTIONAL DRIVER.

3) **8+ ENVIRONMENTAL MICRO-DETAILS** populating the frame (signage / lanterns / torii gates / shrine charms / power lines / vending machines / wet pavement reflections / train tracks / paper talismans / market stalls / rooftop fences / sakura trees / stone steps / stained glass / castle spires / floating islands / mech scaffolding / magical runes / banners / posters / bicycles / hanging laundry / kerosene heaters / kotatsu / shoji screens / bell-charms / neon signs / coffee cups / record sleeves / hanging plants / wires / ramen bowls / chopsticks / hand-painted signs / etc.). Pull from this bank or invent kindred details. EVERY surface and corner has SOMETHING specific.

DENSE LAYERED BACKGROUND DETAIL — NO EMPTY SPACE. The background is as carefully composed as the foreground.`;

// ━━━ STORY MOMENT — ENVIRONMENTAL STORYTELLING ━━━
//
// The frame implies a moment with weight — someone just left, something
// is about to happen, the world has a history.
const STORY_MOMENT_BLOCK = `━━━ STORY MOMENT — ENVIRONMENTAL STORYTELLING ━━━

This is a STORY MOMENT, not a posed shot. The frame implies a moment with weight:
- Someone just left (a half-empty cup / an open door / a fading footprint / a still-swaying lantern)
- Something is about to happen (gathering storm / lit fuse / approaching figure in distance / first petal falling)
- The world has a history (worn-stone steps / patina on metal / faded posters / cracked screens / trodden paths)

If a CHARACTER is present:
- They are DOING something — mid-step / mid-sip / mid-laugh / mid-reach / mid-turn / mid-breath. CANDID, never posed.
- Their eyes are NEVER locked at the camera. Always looking off-frame, downward, sideways, into the world.
- They occupy a fraction of the frame (the world is the costar).
- They are NOT modeling, NOT posing for a runway, NOT centered head-on.

If NO character — the environment itself tells the story.`;

// Slimmer rewrite of the old ANIME_AESTHETIC_BLOCK — locks the rendering
// medium. Hand-drawn anime illustration only.
const ANIME_ILLUSTRATION_BLOCK = `━━━ ANIME ILLUSTRATION MEDIUM (LOCKED) ━━━

Render as HAND-DRAWN ANIME ILLUSTRATION. Studio Ghibli / Makoto Shinkai / Kyoto Animation / Demon Slayer (ufotable) / Akira (Otomo) / Mononoke (Studio Ghibli) tradition. Cel-shaded clean linework with painterly atmospheric backgrounds. Vibrant saturated palette. Visible brushwork in skies and atmosphere; crisp ink linework on subjects.

NEVER photoreal. NEVER 3D-render. NEVER Disney-Pixar CGI. NEVER Western cartoon. NEVER manga-pure-black-and-white (this is COLOR keyframe art).`;

// ━━━ NO NAMED CHARACTERS ━━━
const NO_NAMED_CHARACTERS_BLOCK = `━━━ CHARACTERS BY ROLE ONLY — NEVER NAMED ━━━

Describe characters by role / archetype: "young warrior", "schoolgirl at window", "robed priestess", "ronin wanderer", "cyberpunk street-kid", "kitsune in fox form", "off-duty barista", "shrine maiden", "magical-girl mid-transformation". NEVER name specific anime characters or franchises — no Naruto / Goku / Chihiro / Akira-Tetsuo / Nezuko / Saber / Asuna. Generic archetypes only.`;

// ━━━ NO GENERIC POSE — STORY-PRESENT MANDATORY ━━━
const NO_GENERIC_POSE_BLOCK = `━━━ NO GENERIC POSE (CRITICAL) ━━━

ABSOLUTELY NO "beautiful anime girl standing." NO "anime guy posing." NO centered runway pose. NO eyes-at-camera modeling shots. NO arms-crossed swagger pose.

Every character is in a STORY MOMENT — doing something, going somewhere, reacting to something off-frame. Body weight shifted. A limb in motion. Hair / clothing caught in air. The character is INSIDE the world, not posing for a thumbnail.`;

// ━━━ CULTURAL RESPECT (Japan-coded paths only) ━━━
const CULTURAL_RESPECT_BLOCK = `━━━ CULTURAL RESPECT ━━━

Japanese culture, mythology, and setting are rendered with respect and accuracy. Traditional details correct (torii gate orientation / tatami direction / kimono-wrap / katana tsuba / shrine architecture). Mythological beings drawn in authentic spirit (kitsune = fox-spirit with multiple tails, yokai = specific named type, oni = horned demon with iron club, tengu = mountain-spirit with long nose and wings). No caricature. No Orientalism. The reverence of a Studio Ghibli animator.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  KEYFRAME_COMPOSITION_BLOCK,
  DENSITY_BLOCK,
  STORY_MOMENT_BLOCK,
  ANIME_ILLUSTRATION_BLOCK,
  NO_NAMED_CHARACTERS_BLOCK,
  NO_GENERIC_POSE_BLOCK,
  CULTURAL_RESPECT_BLOCK,
  // Backwards-compat aliases — existing path files still reference the
  // old names. Aliases will be removed after path-file rewrites complete.
  ANIME_AESTHETIC_BLOCK: ANIME_ILLUSTRATION_BLOCK,
  BLOW_IT_UP_BLOCK: KEYFRAME_COMPOSITION_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK: KEYFRAME_COMPOSITION_BLOCK,
};
