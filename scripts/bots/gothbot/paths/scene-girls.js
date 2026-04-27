/**
 * GothBot scene-girls path — GOTH WITCH / OCCULT WOMAN / VAMPIRE HUNTRESS IN SCENE.
 *
 * Art-show-quality high-fantasy gothic character illustration. Dark-fantasy
 * woman caught mid-action in a richly-detailed gothic scene. Castlevania /
 * Van-Helsing / Devil-May-Cry / Crimson-Peak / Underworld atmosphere.
 *
 * Axis pools layer variety on top of a fixed quality-template brief:
 *   SCENE_GIRLS_CHARACTERS (200) — archetype + ethnicity + hair + eyes + period-gothic clothing
 *   SCENE_GIRLS_ACTIONS (50) — what she's doing in the scene (mid-action verb)
 *   SCENE_GIRLS_LOCATIONS (50) — where she is (gothic environment)
 *   SCENE_GIRLS_LIGHTING (30) — key + fill + shadow + atmospheric hue composition
 *
 * Kevin's art-show master prompt = the template. Pool picks fill the slots.
 * Sonnet weaves into coherent prose with variance.
 */

const pools = require('../pools');

module.exports = ({ vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.SCENE_GIRLS_CHARACTERS, 'scene_girls_character');
  const action = picker.pickWithRecency(pools.SCENE_GIRLS_ACTIONS, 'scene_girls_action');
  // Location pool (200 entries) now contains combined setting + lighting +
  // atmospheric detail deduped together — no separate lighting pool needed.
  const location = picker.pickWithRecency(pools.SCENE_GIRLS_LOCATIONS, 'scene_girls_location');

  return `You are a high-fantasy gothic concept-art illustrator writing ONE art-show-quality scene description for GothBot's scene-girls path. ONE beautiful dark-fantasy woman caught candidly in a richly-detailed gothic scene. Castlevania / Van-Helsing / Devil-May-Cry / Crimson-Peak / Bloodborne / Underworld atmosphere. Masterpiece gallery-grade concept-art quality.

TASK: write ONE vivid scene description (80-110 words, comma-separated phrases). Output wraps with style prefix + suffix — you produce ONLY the middle scene section.

═══════════════════════════════════════════════════════════════════
FOUR AUTHORITATIVE AXES — USE THESE SPECIFIC PICKS, DO NOT INVENT
═══════════════════════════════════════════════════════════════════

▌ THE CHARACTER (archetype + ethnicity + hair + eyes + period-gothic clothing — use verbatim, DO NOT contradict):
${character}

▌ SHE IS CAUGHT MID-ACTION (use this specific action):
${action}

▌ LOCATION + LIGHTING + ATMOSPHERE (use this specific setting — time-of-day + eerie-hue lighting + mist/fog/lanterns/candles are all baked in):
${location}

═══════════════════════════════════════════════════════════════════

━━━ WEAVING GUIDANCE ━━━
Weave the 4 axes into vivid flowing prose. DO NOT include style/quality terms like "ArtStation", "gallery-grade", "masterpiece", "painterly", "impasto", "Pre-Raphaelite" — those are handled by the medium wrapper. Your output should be PURE SCENE — what we SEE. Every word should paint the image, not describe the art style.

━━━ MOOD CONTEXT (subtle — don't override character archetype) ━━━
${vibeDirective.slice(0, 250)}

━━━ HARD BANS ━━━
- NO "pose" / "posing" / "modeling" / "editorial" / "photo shoot"
- NO gore / explicit blood / visible wound
- NO second figure in frame — SOLO woman
- NO devil horns, NO pentagrams, NO 666-iconography
- NO cute-anime-girl / YA-fantasy-prom-queen read
- NO named IP (Dracula / Lestat / Carmilla / Vampirella / Lady Dimitrescu / Van-Helsing-the-character / Selene / Buffy)
- NO full-body "heroic stance" trading-card-art pose
- NO modern clothes (jeans, t-shirt, sneakers, hoodie)

━━━ STRUCTURE — LOCATION + LIGHTING LEADS, character enters the scene (MANDATORY ORDER) ━━━

The FIRST 25 WORDS of the output MUST describe the location from the pool — setting + time-of-day + eerie-hue lighting + fog/lantern/candle atmospheric detail. The character enters the scene SECOND, as a figure WITHIN the already-established environment. Action comes LAST.

Example opening (weave the pool picks like this): "Moonlit black-rose maze at midnight with pale silver moonlight silvering wet flagstones, cold-teal mist pooling between thorn-hedges, amber-candle glow from iron lanterns casting warm pools, a [Moroccan vampiric noblewoman with warm-olive skin, platinum-white updo, glowing amber eyes, deep-wine velvet gown] stands among the blooms [sniffing a black rose held up to her face], oil-painted Pre-Raphaelite masterwork, heavy impasto brushwork, gallery-grade."

Structure order (strictly):
1. [LOCATION FROM POOL — full 25-40 words verbatim-ish, setting + time-of-day + eerie-lighting hues + mist/fog/lanterns/candles all baked in]
2. [CHARACTER FROM POOL — archetype + ethnicity + hair + eyes + period-gothic wardrobe, embedded as "a [archetype] with [features] stands/kneels/walks in/among/through..."]
3. [ACTION FROM POOL — what she's doing in the scene]
4. [Pre-Raphaelite dark oil-painting anchors — impasto brushwork, heavy canvas texture, painterly chiaroscuro, gallery-grade masterwork, Waterhouse / Rossetti / Godward tradition]
5. [SUBTLE VAMPIRIC CUES — pale corpse-tinged skin, faint glow in her iris, a single small fang-tip visible if the pose allows — understated not loud]

━━━ VISIBLE LIGHT SOURCE IN FRAME (MANDATORY — NON-NEGOTIABLE) ━━━
Every render MUST show a VISIBLE light source glowing IN the composition — not just implied, actually seen. Choose whichever time-of-day matches the location pool pick:
- A visible moon (any phase or color) in the sky
- A visible setting sun at the horizon
- A visible twilight / dusk sky glowing behind the scene
- Visible rays of moonlight or dusk-light streaming through architectural elements

The sky-source ILLUMINATES the scene — stone catches the glow, mist catches the rays, flora catches the colored light. NEVER flat-lit. NEVER light-source cropped out of frame.

Do NOT use specific object examples in your output (no inventing which structure silhouettes or which flora catches light) — only work from the location pool's own details. Just ensure the sky/light-source is visibly IN frame.

━━━ FACE VISIBILITY (MANDATORY) ━━━
Her face MUST be partially visible — 3/4 profile, looking-over-her-shoulder, side-profile against moonlight, or turning-just-so that one cheekbone + one eye + lips catch the light. NEVER fully hooded. NEVER fully turned away. NEVER fully face-obscured. The camera sees at least half her face.

━━━ ARCHETYPE OVERRIDE — SHE IS A SUCCUBUS / NECROMANCER / WITCH / VAMPIRE (MANDATORY) ━━━

Regardless of what archetype the character pool says, RENDER HER AS ONE OF THESE FOUR — pick ONE per entry:

**SUCCUBUS (no horns — Kevin's durable feedback)** — demonically-alluring, unsettling-beautiful, supernatural magnetism. Features: faint inky vein-tracery at her temple & collarbone / black scleras around glowing iris / obsidian-black claws-for-nails / a single ink-black tear trailing down her cheek / lips unnaturally dark (obsidian or oxblood) / a whisper of fang between parted lips / dark veined translucent skin / jewelry of black-onyx or jet or bone / silk or velvet in red/black/violet. POSE cue — subtle predator stillness.

**NECROMANCER** — death-magic practitioner, grave-speaker. Features: glowing SIGIL painted in dark ink on the back of her hand or her throat or her forehead / a GRIMOIRE held open in her hands / BONE-CARVED accessory (bone crown / bone pendant / bone-handled athame) / a small raven / crow / SKULL-bird perched on her shoulder or nearby / a wisp of SPIRIT-SMOKE or GHOST-MIST curling from her fingertips / a silver RITUAL DAGGER at her hip / chalk-sigil on her skin or robe / a cold-GREEN or VIOLET glow seeping from her palm / tattered RUNE-INSCRIBED trim on her cloak.

**WITCH (occult / coven / herbalist witch)** — practical arcane power, woods-wise. Features: small GLOWING ORB cupped in her palm / HERB-BUNDLE in her hand or tucked at her belt / a BLACK-CAT / RAVEN / OWL familiar nearby / a small CAULDRON or POTION-BOTTLE beside her / a RITUAL-CHAIN TRIPLE-CHOKER at her throat / BLACKWORK SIGIL-TATTOOS visible on her hand or neck / CRYSTAL pendants or TALISMAN JEWELRY / a SMOKING CENSER or INCENSE-BOWL beside her / a curved ATHAME-KNIFE at her hip / MOSS-BRAIDS or FERN-LEAVES woven into her hair.

**VAMPIRE** — classic old-world aristocratic undead, elegant-dangerous. Features: TWO SHARP UPPER FANGS visible between parted lips / a SINGLE CRIMSON BEAD at the corner of her mouth or trailing from her chin / WET-GLOSS OXBLOOD or OBSIDIAN-BLACK lacquered lips / an ornate SILVER-CROSS pendant (possibly inverted) or RUBY-DROP BLOOD-AMULET at her throat / a BLACK-VELVET CAPE with high-popped collar / LONG BLACK SATIN GLOVES reaching above the elbow / a JEWELED FAMILY-CREST RING on her hand / a silver GOBLET of dark wine in her grip / a BAT or RAVEN on a stone nearby / a SEALED WAX-LETTER in her hand / SILVER-CLAW-TIPPED RINGS / an ANTIQUE LOCKET / BLOOD-RED rose she holds.

ALL FOUR archetypes should also present UNNATURALLY PALE corpse-drained or moonstone-pallid skin + faint glow in the iris (crimson / amber / violet / fel-green) — but supernaturally, not healthy.

Write 2-3 SPECIFIC ARCHETYPE ARTIFACTS from the chosen archetype's list — name them concretely in the character description. These are visual objects Flux can't ignore.

NO devil horns. NO pentagrams. NO 666. NO gore/blood-splatter/wounds.

━━━ HAUNTING / UNSETTLING MOOD (MANDATORY — one detail per render) ━━━
The scene must feel HAUNTING. Something subtly WRONG-in-a-beautiful-way. Pick ONE per entry and name it explicitly:
- An unnatural stillness — no wind in the mist, her cloak not moving
- A single raven watching from a statue / cypress branch / iron gate / fountain edge
- A candle that has burned itself out beside her, wick still smoking
- A path that ends abruptly in impenetrable shadow
- Mist that rises from the ground but shouldn't — no water source
- A fallen rose-petal trail leading out of frame toward something unseen
- A single door in the distance standing slightly open
- A mirror / reflecting-pool that doesn't reflect her
- A statue that looks slightly turned from where it should be facing
- A light-source with no visible origin casting colored glow across her

The viewer should feel a gentle unease — beautiful first, then "something is off here" second.

━━━ COMPOSITION — OFF-CENTER FIGURE, NOT CENTERED PORTRAIT (MANDATORY) ━━━
She is placed OFF-CENTER in the frame — at the 1/3 rule-of-thirds position on the left or right, walking along a path, seated at the edge of a stone bench, kneeling among flowers, leaning against a column, standing beside a fountain. The GARDEN fills the frame, she lives WITHIN it as an off-center figure, NOT a centered hero-pose character-portrait.

NEVER place her centered-in-frame facing the camera. The camera is looking AT the scene, not AT her. She is part of the composition, not the subject of a portrait.

Output ONLY the 80-110 word scene description, comma-separated phrases. No preamble, no titles, no headers, no ━━━ or ═══ markers, no **bold**, no "render as" suffix.`;
};
