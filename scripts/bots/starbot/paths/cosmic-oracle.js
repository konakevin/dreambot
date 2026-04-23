/**
 * StarBot cosmic-oracle path — SCI-FI ORACLE / SPACE PRIESTESS / COSMIC SEER IN SCENE.
 *
 * Art-show-quality painted-space-art character illustration. Sci-fi woman caught
 * mid-action in a richly-detailed cosmic scene. Dune / Foundation / Arrival /
 * Blade-Runner-2049 / Moebius-Jodorowsky / Chesley-Bonestell atmosphere.
 *
 * Axis pools layer variety on top of a fixed quality-template brief:
 *   COSMIC_ORACLE_CHARACTERS — archetype + ethnicity + hair + eyes + sci-fi wardrobe
 *   COSMIC_ORACLE_ACTIONS — body-shaping pose-first (what she's doing)
 *   COSMIC_ORACLE_LOCATIONS — combined setting + time-of-cosmic-day + star-light + atmosphere
 *
 * Sci-fi adaptation of gothbot's scene-girls. Master template anchors quality.
 * Pool picks fill the slots. Sonnet weaves into coherent prose with variance.
 */

const pools = require('../pools');

module.exports = ({ vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.COSMIC_ORACLE_CHARACTERS, 'cosmic_oracle_character');
  const action = picker.pickWithRecency(pools.COSMIC_ORACLE_ACTIONS, 'cosmic_oracle_action');
  const location = picker.pickWithRecency(pools.COSMIC_ORACLE_LOCATIONS, 'cosmic_oracle_location');

  return `You are a painted-space-art concept-art illustrator writing ONE art-show-quality scene description for StarBot's cosmic-oracle path. ONE beautiful sci-fi woman caught candidly in a richly-detailed cosmic scene. Dune / Foundation / Arrival / Blade-Runner-2049 / Moebius-Jodorowsky / Chesley-Bonestell / Syd-Mead / John-Harris atmosphere. Masterpiece gallery-grade painted-paperback-cover quality.

TASK: write ONE vivid scene description (80-110 words, comma-separated phrases). Output wraps with style prefix + suffix — you produce ONLY the middle scene section.

═══════════════════════════════════════════════════════════════════
THREE AUTHORITATIVE AXES — USE THESE SPECIFIC PICKS, DO NOT INVENT
═══════════════════════════════════════════════════════════════════

▌ THE CHARACTER (archetype + ethnicity + hair + eyes + sci-fi wardrobe — use verbatim, DO NOT contradict):
${character}

▌ SHE IS CAUGHT MID-ACTION (use this specific pose + activity):
${action}

▌ LOCATION + COSMIC LIGHTING + ATMOSPHERE (use this specific setting — cosmic time-of-day + star-light + nebula-glow / aurora / solar-flare / moon-light are all baked in):
${location}

═══════════════════════════════════════════════════════════════════

━━━ MASTER TEMPLATE (weave the 3 axes into this quality framework) ━━━
"painted sci-fi-paperback-cover oil illustration of [CHARACTER FROM POOL], cinematic candid moment, NOT posing for the camera, caught mid-action in a natural scene — [ACTION FROM POOL], expression contemplative and far-seeing, Dune / Foundation / Arrival / Blade-Runner-2049 / Moebius-Jodorowsky / Chesley-Bonestell atmosphere, painted-space-art mood, richly detailed cosmic environment — [LOCATION FROM POOL], arcane cosmic symbols faintly glowing, stellar particles drifting, nebula mist, stardust haze, volumetric starlight, palette of deep cosmic indigo / nebula violet / aurora green / quasar gold / pulsar blue highlights / star-white accents, atmospheric perspective, intricate fabric and material textures, painterly detail, masterpiece painted-space-art illustration, ArtStation-quality, gallery-grade, highly detailed, ultra beautiful composition"

━━━ WEAVING GUIDANCE ━━━
Rephrase the template into natural flowing prose — don't robotically slot-fill. Keep ALL quality anchors preserved (Dune / Blade-Runner-2049 / Chesley-Bonestell / Moebius / Syd-Mead / ArtStation-quality / gallery-grade / volumetric starlight / painterly / masterpiece).

━━━ MOOD CONTEXT (subtle — don't override character archetype) ━━━
${vibeDirective.slice(0, 250)}

━━━ HARD BANS ━━━
- NO "pose" / "posing" / "modeling" / "editorial" / "photo shoot"
- NO gore / explicit blood / visible wound
- NO second figure in frame — SOLO woman
- NO laser-gun combat / weapon-drawn action-hero imagery
- NO named IP (Paul Atreides / Chani / Rey / Princess Leia / Ellen Ripley / Sarah Connor / Furiosa / Dr. Ryan Stone / Alita)
- NO full-body "heroic stance" trading-card-art pose
- NO modern-day Earth clothes (jeans, t-shirt, sneakers, hoodie)
- NO devil-horns / pentagrams / Earth-religious iconography
- NO Star-Wars / Star-Trek uniform specifics (Jedi robes described as "Jedi", Starfleet uniform specifics)

━━━ STRUCTURE — LOCATION + COSMIC LIGHTING LEADS, character enters the scene (MANDATORY ORDER) ━━━

The FIRST 25 WORDS of the output MUST describe the location from the pool — cosmic setting + time-of-cosmic-day + nebula/aurora/solar-flare/moon-lighting + atmosphere. The character enters the scene SECOND, as a figure WITHIN the already-established cosmos. Action comes LAST.

Example opening (weave the pool picks like this): "Violet nebula-lit observation deck at the edge of a dying binary-star system with swirling magenta-and-cyan gas clouds through the curved viewport, volumetric cosmic-dust drifting, starfield pinpricks behind, a [Pan-African cosmic-oracle with warm-umber skin, silver-braided locs, glowing amber eyes, deep-indigo ceremonial flight-robes trimmed in gold sigils] stands at the railing [cradling a glowing quantum-orb in both palms], painted-space-art Chesley-Bonestell masterwork, heavy impasto brushwork, gallery-grade."

Structure order (strictly):
1. [LOCATION FROM POOL — full 25-40 words verbatim-ish: cosmic setting + time-of-cosmic-day + nebula/aurora/solar/moon lighting + atmospheric detail all baked in]
2. [CHARACTER FROM POOL — archetype + ethnicity + hair + eyes + sci-fi wardrobe, embedded as "a [archetype] with [features] stands/kneels/floats/reaches in/among/through..."]
3. [ACTION FROM POOL — what she's doing in the scene, body-shaping pose first]
4. [Painted-space-art anchors — impasto brushwork, heavy canvas texture, painterly chiaroscuro, gallery-grade masterwork, Chesley-Bonestell / Syd-Mead / Moebius / Donato-Giancola / John-Harris tradition]
5. [SUBTLE COSMIC-ORACLE CUES — faint iridescent glow in her iris, geometric arcane sigils faintly glowing on her skin or robes, starlight catching her cheekbone — understated not loud]

━━━ VISIBLE COSMIC LIGHT SOURCE IN FRAME (MANDATORY — NON-NEGOTIABLE) ━━━
Every render MUST show a VISIBLE cosmic light source glowing IN the composition — not just implied, actually seen. Choose whichever cosmic-time-of-day matches the location pool pick:
- A visible nebula cloud (any color) dominating the background
- A visible star / binary-stars / supernova / pulsar in the sky
- A visible alien moon (any phase or color) hanging in the sky
- A visible aurora / solar-wind / plasma-discharge streaming through atmosphere
- A visible dawn / dusk on an alien horizon glowing behind the scene
- A visible sun-dog / ring-system / planet-disk looming in the sky

The cosmic-source ILLUMINATES the scene — metal catches the glow, dust catches the rays, flora / sand / stone / water catches the colored light. NEVER flat-lit. NEVER light-source cropped out of frame.

Do NOT invent specific cosmic-objects not in the pool pick — work only from the location pool's own details. Just ensure the cosmic-light-source is visibly IN frame.

━━━ FACE VISIBILITY (MANDATORY) ━━━
Her face MUST be partially visible — 3/4 profile, looking-over-her-shoulder, side-profile against nebula-light, or turning-just-so that one cheekbone + one eye + lips catch the cosmic-glow. NEVER fully helmeted. NEVER fully turned away. NEVER fully face-obscured. The camera sees at least half her face.

If the character pool says "helmet" — render the helmet with its visor UP or transparent so face is visible, OR as a crown / circlet / hood instead.

━━━ ARCHETYPE OVERRIDE — SHE IS A STARLIGHT PRIESTESS / COSMIC SEER / NEBULA WITCH / VOID ORACLE (MANDATORY) ━━━

Regardless of what archetype the character pool says, RENDER HER AS ONE OF THESE FOUR — pick ONE per entry:

**STARLIGHT PRIESTESS** — ceremonial cosmic-religious practitioner, light-bearer. Features: a small GLOWING QUANTUM-ORB cupped in her palm or floating at her fingertips / arcane CELESTIAL SIGILS traced in glowing starlight-ink on her forehead / cheek / collarbone / a flowing CEREMONIAL ROBE trimmed in metallic gold-or-silver SIGIL-EMBROIDERY / a small PLASMA-CENSER or CRYSTAL-RELIQUARY hanging from a chain at her waist / delicate STARMETAL crown or circlet set with a single luminous gem / faint GOLDEN glow in her iris / a hovering PRISMATIC ORB-FAMILIAR drifting at her shoulder.

**COSMIC SEER** — future-sighted astro-diviner, constellation-reader. Features: glowing constellation-TATTOOS shimmering across her skin in faint starlight-ink / an open STAR-CHART BOOK held in her hands / a CRYSTALLINE DIVINATION-LENS held to her eye / a NAVIGATOR SEXTANT of bronze-and-crystal in her hand / a ring of small ORB-FAMILIARS orbiting her head / faint TRAILING-STAR PATH following her fingertip / a bronze-and-violet THIRD-EYE PENDANT at her throat / a VIOLET glow in her iris.

**NEBULA WITCH** — alien-magic practitioner, plasma-bender. Features: a small swirling NEBULA-ORB cupped in her palm / a tall CRYSTAL-TIPPED STAFF planted beside her / a small COSMIC-FAMILIAR (glowing reptilian / plasma-owl / crystal-serpent) perched on shoulder / PLASMA-VEINS pulsing faintly visible beneath her skin / a HOVERING SPELL-DIAGRAM of geometric light in front of her / ALIEN BONE-BEADS woven into her hair / a coil of PLASMA-SMOKE rising from her fingertip / a LIME or MAGENTA glow in her iris / runic ARCANE CIRCUITRY tattooed on her palms.

**VOID ORACLE** — emptiness-between-stars speaker, silence-wielder. Features: BLACK SCLERAS around a single glowing iris / LIQUID-NIGHT-BLACK lips / faint BLACK TENDRILS of vacuum-shadow curling from her fingertips / a SINGLE SHARP CRYSTAL-FANG at her lower lip / inky VOID-VEINS tracing across her collarbone / a long BLACK-SILK OR MATTE-BLACK ceremonial cloak with high-popped collar / a single COLD-WHITE star-pinprick in the depth of each iris / a levitating OBSIDIAN-MASK held at her hip.

ALL FOUR archetypes should also present UNNATURALLY LUMINOUS or moon-pale skin + faint glow in the iris (gold / violet / lime / star-white) — but supernaturally, not photo-standard.

Write 2-3 SPECIFIC ARCHETYPE ARTIFACTS from the chosen archetype's list — name them concretely in the character description. These are visual objects Flux can't ignore.

NO devil horns. NO pentagrams. NO Earth-religious iconography. NO gore/wounds.

━━━ HAUNTING / UNSETTLING COSMIC MOOD (MANDATORY — one detail per render) ━━━
The scene must feel HAUNTING and COSMICALLY VAST. Something subtly WRONG-in-a-beautiful-way. Pick ONE per entry and name it explicitly:
- An unnatural stillness — nebula mist that isn't moving
- A single orbiting satellite watching from the far distance
- A console-light that has faded to black beside her, glow just dying
- A corridor that ends abruptly in impenetrable void-shadow
- Starlight that falls at the wrong angle for the visible star
- A trail of floating scroll-glyphs drifting out of frame toward something unseen
- A single airlock in the distance standing slightly open to the void
- A mirror / reflecting-pool that doesn't reflect her
- A statue / monument that looks slightly turned from where it should be facing
- A light-source with no visible origin casting colored glow across her
- A distant figure-silhouette on the horizon that wasn't there a moment ago
- A crystalline hum almost visible as a shimmer in the air

The viewer should feel a gentle cosmic unease — beautiful first, then "something is off here" second.

━━━ COMPOSITION — OFF-CENTER FIGURE, NOT CENTERED PORTRAIT (MANDATORY) ━━━
She is placed OFF-CENTER in the frame — at the 1/3 rule-of-thirds position on the left or right, walking along a cosmic catwalk, seated at the edge of an observation-rim, kneeling at a ritual-console, leaning against a viewport, standing at the prow of a landing-shuttle. The COSMOS fills the frame, she lives WITHIN it as an off-center figure, NOT a centered hero-pose character-portrait.

NEVER place her centered-in-frame facing the camera. The camera is looking AT the cosmic scene, not AT her. She is part of the composition, not the subject of a portrait.

Output ONLY the 80-110 word scene description, comma-separated phrases. No preamble, no titles, no headers, no ━━━ or ═══ markers, no **bold**, no "render as" suffix.`;
};
