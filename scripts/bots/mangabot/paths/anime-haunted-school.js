/**
 * AlphaBot candidate — anime-haunted-school (destination: MangaBot).
 *
 * Cloned onto MangaBot's identity per ALPHABOT.md ("a path proven under the
 * wrong config proves nothing") but written FULLY SELF-CONTAINED (function-
 * form, no shared-registry edits, seed pools required directly as JSON) so it
 * never touches alphabot/index.js, alphabot/pools.js, or alphabot/
 * shared-blocks.js while another candidate is being built in parallel.
 * MangaBot's own hard identity — hand-drawn anime illustration (Ghibli /
 * Shinkai / Kyoto Animation register, cel-shaded linework, painterly
 * backgrounds, NEVER photoreal / 3D-CGI / Western cartoon / B&W manga panel),
 * characters described by role only (NEVER a named specific anime character),
 * and cultural accuracy for Japanese folklore/setting details — is re-stated
 * inline below rather than imported (matches the pattern set by the sibling
 * anime-halloween-cozy candidate).
 *
 * CONCEPT: the classic anime "gakkou no kaidan" (school ghost-story) trope —
 * an empty, moonlit Japanese school building after dark: flickering lights,
 * long silent hallways, a lone student exploring room to room. Delighted-
 * nervous adventure-thrill energy, PLAYFUL-SPOOKY, never genuine horror.
 *
 * AXES (7 total):
 *   1. location       (always)         — the specific after-hours school spot
 *                                        (hallway / pool / library / art room
 *                                        / rooftop door / courtyard shrine /
 *                                        etc.), a full staged scene with
 *                                        foreground/midground/background depth.
 *   2. student (cast) (always)         — inline fixed roster (8 school
 *                                        archetypes + uniforms), not a
 *                                        generated pool — short fixed list per
 *                                        the "no pool needed for a short fixed
 *                                        list" rule. Ordinary human age/gender
 *                                        words are CORRECT here (a human
 *                                        student cast, matching MangaBot's own
 *                                        `slice-of-life`/`anime-character-*`
 *                                        convention) — the usual non-human-
 *                                        language ban does not apply.
 *   3. action         (always)         — the student's cautious-but-curious
 *                                        exploring action (flashlight raised,
 *                                        peering around a corner, tiptoeing
 *                                        past doors...).
 *   4. camera_framing (always) MANDATORY — inline fixed list (6-8 concrete
 *                                        camera positions), each keeping the
 *                                        WHOLE student + scene readable (never
 *                                        a body-part/prop macro that would
 *                                        dissolve the hero scene). Explicitly
 *                                        flagged mandatory in-prompt because
 *                                        this exact concept — a lone figure in
 *                                        an empty moonlit hallway — is Flux's
 *                                        own trained "anime keyframe" default
 *                                        (a tiny back-of-character silhouette
 *                                        looking down an empty corridor); left
 *                                        unforced, every render would converge
 *                                        on that one shot.
 *   5. eerie_light    (~60%) MONEY SHOT — the ONE iconic light source that
 *                                        makes an anime-haunted-school render
 *                                        instantly recognizable (a flickering
 *                                        fluorescent tube, a stark moonbeam, a
 *                                        lone glowing EXIT sign...). Optional,
 *                                        never mandatory on every seed entry —
 *                                        a signature present on every render
 *                                        homogenizes the whole path into "the
 *                                        same one shot" (known failure mode).
 *   6. presence       (~45%)           — an optional playful Japanese-folklore
 *                                        hint (a kitsune's tails vanishing
 *                                        around a corner, a talisman peeling
 *                                        itself off a door, a statue turned
 *                                        slightly from before). Culturally
 *                                        specific and respectfully drawn (real
 *                                        yokai/kitsune/ofuda vocabulary, never
 *                                        caricature), always mischievous/
 *                                        curious in register, never a genuine
 *                                        jump-scare threat. Optional so the
 *                                        folklore beat doesn't appear on every
 *                                        single render.
 *   7. detail         (always)         — a small culture-festival/Halloween
 *                                        decor micro-detail (a forgotten
 *                                        jack-o-lantern on a windowsill, paper
 *                                        bats left over from the school
 *                                        festival) that keeps the register
 *                                        anchored PLAYFUL even in an empty
 *                                        building at night.
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE: this is a PLAYFUL SCHOOL GHOST STORY — the
 * delighted-nervous "dare you to walk the halls after dark" energy of a fun
 * campfire tale swapped at a sleepover, NEVER genuine horror, gore, or a real
 * scare. Every eerie beat (a flickering light, a folklore hint, a creak) reads
 * as mischievous/curious, not threatening. Stated as a positive register
 * ("delighted, wide-eyed, thrilled-not-afraid") alongside the necessary
 * negative guardrails, never negation alone.
 *
 * Known failure modes deliberately designed around:
 *   - camera_framing is explicitly flagged MANDATORY in-prompt (mirrors
 *     MangaBot's own CAMERA_FRAMING_MANDATORY_BLOCK lesson) — this concept is
 *     exactly the shot Flux already wants to default to, so leaving framing
 *     unforced would converge every render on one tiny back-of-character
 *     silhouette; every camera_framing option keeps the whole student AND the
 *     hallway/room readable — none zooms into a prop/body-part macro.
 *   - human age/gender words are INTENTIONALLY used for the student (human
 *     slice-of-life cast, not fantasy/creature/toy) — the age/gender-noun ban
 *     does not apply here.
 *   - no real-world ethnic/national labels used on the cast (school-role +
 *     uniform + hair/appearance only, matching MangaBot's own archetype-only
 *     convention).
 *   - eerie_light (the money shot) and presence (the folklore hint) are BOTH
 *     optional/independent rolls, never mandatory together — avoids every
 *     render homogenizing into "the same one flickering-light-plus-ghost"
 *     shot.
 *   - positive register stated first ("delighted, thrilled, mischievous"),
 *     with the necessary "never genuine horror/gore" boundary stated
 *     alongside it, never as the only guardrail.
 *   - NEVER a named specific anime character AND NEVER a named real
 *     horror-franchise ghost (no Sadako/Ring/Ju-on references) — both banned
 *     explicitly in-prompt and in the presence pool's own generation rules.
 *
 * Medium note (for whoever wires this into mangabot/index.js at promotion —
 * NOT decided here): MangaBot routes most look-enabled paths to the
 * mangabot_anime_neutral "looks" medium via mediumByPath so the rolled
 * sharedDNA.lookRegister leads CLIP; this path's identity (ordinary anime
 * illustration, no fixed art-style lock) fits that rotation like any other
 * look-enabled path.
 */

const LOCATION = require('../seeds/anime_haunted_school_location.json');
const ACTION = require('../seeds/anime_haunted_school_action.json');
const EERIE_LIGHT = require('../seeds/anime_haunted_school_eerie_light.json');
const PRESENCE = require('../seeds/anime_haunted_school_presence.json');
const DETAIL = require('../seeds/anime_haunted_school_detail.json');

// Inline fixed roster (short list — no pool needed). One student archetype +
// uniform per render, always anchored to a school role so the figure reads
// unmistakably as a STUDENT, never a random pedestrian.
const CAST = [
  'a schoolgirl in a navy sailor-collar seifuku uniform, dark hair pulled into a loose braid',
  'a schoolboy in a black gakuran uniform with brass buttons, short tousled hair',
  'an art-club schoolgirl in a paint-smudged smock worn over her uniform, hair pinned up with a paintbrush',
  'a kendo-club schoolboy still in his indoor training jacket, a bokuto slung over one shoulder',
  'the class representative, a schoolgirl in a pressed uniform with a prefect armband and round glasses',
  'a transfer schoolboy new to the building, uniform still stiff and unworn-in, backpack clutched tight',
  'a library-committee schoolgirl hugging a stack of books to her chest, a cardigan layered over her uniform',
  'a confident upperclassman schoolboy, uniform tie loosened, jacket slung over one shoulder',
];

// Inline fixed camera list (short list — no pool needed). MANDATORY axis:
// every option keeps the WHOLE student + the hallway/room readable — none is
// a body-part or prop macro that would dissolve the hero scene.
const CAMERA_FRAMING = [
  'a low angle from near the floor looking down the corridor as the student glances back toward camera mid-stride, their startled-thrilled expression caught clearly in profile even as the hallway recedes into the light ahead, both floor and ceiling lines drawing the eye down the frame',
  'a three-quarter angle catching the student\'s face half-lit as they peer around a doorframe, their whole upper body and the room beyond both clearly visible',
  'an over-the-shoulder view from just behind the student toward the dark hallway ahead, enough of their profile visible to read their wide-eyed expression',
  'a wide establishing view down the full length of the corridor with the student mid-frame, small against the architecture but unmistakably the focal point, turned enough toward the camera that their face and expression stay clearly readable even at this distance, both ends of the hall reaching into the depth — never a back-turned silhouette receding away from camera',
  'a profile shot as the student leans into a doorway, backlit by the room\'s glow, their full silhouette and the glowing room beyond both readable',
  'a slightly high angle looking down a stairwell as the student climbs toward the camera and glances upward with a bright, eager grin, their face clearly lit and their whole body plus several stair flights below both visible in one frame — never shown climbing away with their back to camera',
  'a front three-quarter angle with the student turning toward the camera mid-step, their startled-but-thrilled expression clearly lit, the corridor stretching open behind them',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const location = picker.pickWithRecency(LOCATION, 'anime_haunted_school_location');
  const action = picker.pickWithRecency(ACTION, 'anime_haunted_school_action');
  const detail = picker.pickWithRecency(DETAIL, 'anime_haunted_school_detail');
  const cast = CAST[Math.floor(Math.random() * CAST.length)];
  const camera = CAMERA_FRAMING[Math.floor(Math.random() * CAMERA_FRAMING.length)];

  // MONEY SHOT — optional (~60%), never mandatory (avoids homogenizing).
  const moneyShot =
    Math.random() < 0.6
      ? `\n\n━━━ THE MONEY SHOT — the eerie light that makes this render instantly ICONIC (honor it exactly) ━━━\n${picker.pickWithRecency(EERIE_LIGHT, 'anime_haunted_school_eerie_light')}`
      : '';

  // Playful folklore hint — optional (~45%), independent of the money shot.
  const presence =
    Math.random() < 0.45
      ? `\n\n━━━ A PLAYFUL FOLKLORE HINT (optional — mischievous and curious, never a genuine scare) ━━━\n${picker.pickWithRecency(PRESENCE, 'anime_haunted_school_presence')}`
      : '';

  return `You are a key animator storyboarding ONE frame of a PLAYFUL anime school-ghost-story episode ("gakkou no kaidan") for an anime illustration bot. An empty, moonlit Japanese school building after dark is the hero — a lived-in, richly detailed world, not an empty box. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — READ FIRST ━━━
The entire scene renders as HAND-DRAWN ANIME ILLUSTRATION — Studio Ghibli / Makoto Shinkai / Kyoto Animation register, cel-shaded clean linework with painterly atmospheric backgrounds, vibrant color even at night (never a flat black-and-white manga panel). NEVER photoreal, NEVER 3D-render, NEVER Disney-Pixar CGI, NEVER Western cartoon. The student is described by role/archetype only — NEVER a named specific anime character or franchise, and any folklore presence is NEVER a named real horror-movie ghost (no Sadako, no Ring, no Ju-on). This is a PLAYFUL SCHOOL GHOST STORY — the delighted, wide-eyed, thrilled-not-afraid energy of a fun campfire tale swapped at a sleepover, NOT a slasher film. Every eerie beat (a flickering light, a folklore hint, a creak) reads as MISCHIEVOUS and CURIOUS. NO blood, NO gore, NO genuine terror, NO stalking threat, NO real violence.

━━━ THE SCHOOL AT NIGHT (stage the scene here — foreground / midground / background depth, no empty space) ━━━
${location}

━━━ THE STUDENT ━━━
${cast}, ${action}.

━━━ CAMERA FRAMING — MANDATORY, apply exactly ━━━
${camera}. Flux's "anime keyframe" training prior wants to default to a tiny back-of-character silhouette looking down an empty hallway — reject that default unless the framing above explicitly calls for a from-behind view; the student's engagement (their face, their motion, their nerve) must read clearly, not just a dark outline.${moneyShot}${presence}

━━━ A SMALL SEASONAL DETAIL ━━━
${detail}

━━━ DENSITY — NO EMPTY SPACE ━━━
Layer the frame densely: 2+ atmosphere effects (drifting dust motes, moonbeam haze, curling paper-streamer shadows, faint breath-fog, floating chalk dust) and 8+ specific environmental micro-details INVENTED FRESH FOR THIS EXACT ROOM — build outward from the objects already named in THE SCHOOL AT NIGHT above (its own furniture, tools, equipment, and clutter, worn and slightly disturbed), never a stock hallway kit. A swimming pool's mess is diving blocks, kickboards, a coiled starting-rope, a chemical-drum stack — NOT a locker, an umbrella, or an abandoned shoe; a music room's mess is loose reeds, a metronome, a cracked stand light — NOT a classroom poster. Reuse "dented lockers / an abandoned indoor shoe / a forgotten umbrella / a tipped-over chair / a cracked windowpane" ONLY when the room above is an actual hallway or genkan that would plausibly hold them. The background is composed as carefully as the foreground.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

Output ONLY the raw 100-130 word Flux prompt. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Start immediately with the scene content.`;
};
