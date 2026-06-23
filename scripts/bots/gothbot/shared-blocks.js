/**
 * GothBot — shared prose blocks.
 *
 * HAUNTINGLY BEAUTIFUL dark fantasy. Castlevania / Bloodborne / Van-Helsing /
 * Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Tim-Burton / gothic-fairy-tale /
 * WoW-undead-warlock-aesthetic (art only, never IP).
 *
 * Elegant darkness on STEROIDS — haunting + alluring + vibrant + creative.
 * Twilight color, moonlit ruins, gothic flower gardens, gothic dungeons, gothic
 * castles, corrupted women, succubi, demons, blood-hunters, dark witches.
 */

// 2026-06-02 cruft-audit strip — was 282ch with TWO enumeration locks
// hitting EVERY GothBot path × 4/day = 68 daily renders:
//   • franchise list `Castlevania + Bloodborne + Devil-May-Cry + Van-Helsing`
//     (Flux locks Castlevania, drops the rest — first-named-noun trap)
//   • palette list `deep purples + midnight blues + velvet blacks + poison
//     greens + candle-amber + moonlit silver` (Flux locks deep purples,
//     drops the other 5 — the phrase "rich varied palette" is self-defeating
//     once 6 colors are enumerated)
//
// Bot-wide is now a single short anchor. The hearted Castlevania DNA for
// monster-prowl (which renders via medium='anime') is preserved by an
// `anime` entry in promptPrefixByMedium that holds the FULL original
// prefix verbatim — so monster-prowl renders are unchanged, but the
// other 16 paths get a clean non-enumerated prefix that lets per-medium
// promptPrefixByMedium overrides + mediumStyles + TWILIGHT_COLOR_BLOCK
// do the palette/franchise work where they belong.
const PROMPT_PREFIX =
  'Dark gothic fantasy, hauntingly beautiful, operatic dark romance with vampire-hunter danger';

// 2026-06-02 cruft-audit micro-strip — dropped `hyper-detailed` tech-spec.
const PROMPT_SUFFIX = 'no text no words no watermarks, frame-worthy dark-fantasy art';

// gpt-image-2 medium directive (routed via mediumByModel in index.js).
// GPT-Image-2 reads the bot's normal mediums + painterly anchors as "go
// full abstract / ornamental plate" and drops the gothic-horror subject.
// This clean directive — positive-only, no name-drops, no negation
// cascade — renders recognizable gothic-fantasy scenes instead. Mirrors
// the 2026-06-05 OceanBot mystical-mermaid cleanup (commit b0776fb9).
const GPT_CLEAN =
  'Cinematic gothic fantasy illustration, clean editorial-poster render with clearly readable figures and recognizable gothic architecture, deep moody jewel-tone palette with atmospheric depth, dark fantasy register';

// The single canonical dark-palette block (consolidated 2026-06-12 cruft-audit
// — was previously stated twice, in ELEGANT_DARKNESS_BLOCK and a separate
// TWILIGHT_COLOR_BLOCK). Multi-hue accents, never single-hue monochrome,
// never red-dominant. ELEGANT_DARKNESS now references this instead of
// re-stating the palette.
const TWILIGHT_COLOR_BLOCK = `━━━ TWILIGHT COLOR — WEAVE MULTIPLE HUES ━━━

The night is NOT gray-monochrome and NOT red-monochrome — every scene weaves MULTIPLE accent hues. A typical render has ONE dominant atmosphere hue (violet twilight, sapphire moonlight, or emerald ritual-glow) + ONE warm secondary accent (amber candle, orange torch, gold alchemist-gleam) + ONE cool accent. Pull from the Nightshade spectrum: violet, midnight-blue, velvet-black, poison/witch-fire green, fel-violet, moonlit silver, twilight lavender — plus warm candle-amber, torch-orange, forge-ember, alchemist-gold. Stained glass throws colored light, candles throw amber, witch-fire throws poison green, moonlight paints silver-violet. Darkness with VARIED COLOR. Red/crimson is accent ONLY — never coloring whole windows/buildings/moons/fog.`;

const ELEGANT_DARKNESS_BLOCK = `━━━ NIGHTSHADE — BEAUTIFUL, DANGEROUS, ALIVE ━━━

Dark fantasy at its most stylish — the aesthetic world of vampire hunters, gothic action cinema, supernatural adventure. Moonlit baroque architecture, candlelit crypts, foggy graveyards, cathedral ruins with broken stained glass, moss-covered gargoyles, velvet-lined interiors, Victorian finery. Use the dark palette (see TWILIGHT COLOR) — multi-hue accents woven into each scene, never single-hue monochrome. Supernatural tension hangs in the air — something ancient stirs in shadows, candles flicker at unseen currents, fog curls low across flagstones. Dramatic Victorian-era styling — ornate fabric, silver jewelry, baroque weapons. Heavy-ink sharp-angular lines, high-contrast baroque detail. Operatic dark romance with a hint of danger. BEAUTIFUL, DANGEROUS, ALIVE.`;

const ALLURING_BEAUTY_BLOCK = `━━━ EVIL + CORRUPTED + ALLURING + HAUNTINGLY BEAUTIFUL ━━━

Female characters are HAUNTINGLY BEAUTIFUL supernatural horrors — gorgeous and terrifying inseparable (vampire queens, succubi, corrupted priestesses, occult seductresses, witch-queens). NOT "moody-pretty-goth-girl" — UNSETTLED first, magnetized second, every frame GORGEOUS.

MANDATORY character details per female render:
- GLOWING EYES — luminous crimson / fel-green / void-violet / necrotic-white / ember-gold / ice-blue irises or pupils
- BOLD MAKEUP — heavy winged smokey-eye, blood-red or oxblood or obsidian lips, sharp contour, pallid porcelain or ash-grey or blue-tinted skin
- CORRUPTION MARKINGS — ink-black veins, a ritual-sigil scar, faint spell-tattoos glowing beneath skin, stone-like crack-lines
- WARDROBE of danger — corseted-gown with crimson accents, sheer-black-lace, torn-silk + chains, leather pauldrons + thigh-holsters, obsidian-scale armor-bodice
- POSTURE of menace — mid-hunt / mid-cast / mid-summon / mid-drain / mid-lunge, never a static pretty-pose

Sex appeal is through DANGER + CORRUPTION + INHUMAN-BEAUTY, never nudity or fanservice. Terrifying and gorgeous, not cute-moody.`;

const DYNAMIC_POSE_BLOCK = `━━━ DYNAMIC POSE — NO STANDING-STILL ━━━

Every figure is MID-ACTION, never standing still posing for a portrait — e.g. mid-stalk through graveyard mist, mid-cast with spell-sigil igniting, mid-turn with cloak flaring. Every figure has a VERB in the scene — the picture captures a MOMENT, not a portrait-pose. Mid-action, not static.`;

const EXTERIOR_PREFERRED_BLOCK = `━━━ EXTERIOR PREFERRED (for character-scene paths) ━━━

Lean HARD toward outdoor gothic settings. Moonlit courtyards, cliff-top battlements, gothic flower gardens (black roses, belladonna, nightshade, moonflowers, weeping willows), graveyards with stone angels, misty moors, cursed villages, haunted forests, fogged bridges, storm-lashed balconies, coastal ruins, cathedral exteriors at twilight, moat-bridges under blood-moon, gothic streets in gaslight fog. Interiors OK but should be rarer — when interior, lean toward gothic dungeons (crypt-catacombs, torture-chambers-atmospheric, oubliettes, skull-corridors, witch-trial basements) rather than generic-cathedral-hall. Push OUT of the cathedral-interior default.`;

const NO_JACK_SKELLINGTON_BLOCK = `━━━ NO JACK SKELLINGTON / NIGHTMARE BEFORE CHRISTMAS ━━━

These phrases are banned at the engine level — and never render anything resembling them. No skeletal-ringleader imagery, no Halloween-town aesthetic, no pumpkin-king references. Our gothic is darker + more elegant + more mature + more occult.`;

const NO_CHEAP_GORE_BLOCK = `━━━ IMPLIED DREAD, NOT CHEAP GORE ━━━

Never cheap-horror, never slasher-splatter, never clown-horror. Implied blood OK for drama (crimson on lips, single-drop on lace collar, pooling-shadow on flagstones, blood-moon reflecting in puddle) — but never splattered, never visceral, never ugly. Dread comes from ATMOSPHERE: fog, shadow, chiaroscuro, unsettling composition, candle-flicker, distant howl, curling smoke, decaying elegance. Beauty-over-shock always.`;

// Rewritten POSITIVE 2026-06-12 — the old version enumerated 12 banned
// religious symbols (pentagrams / inverted crosses / 666 / baphomet…),
// which only seeds them in a stateless Sonnet/Flux prompt. Corruption now
// reads entirely through character + atmosphere; no symbol is named.
const NO_SATANIC_BLOCK = `━━━ CORRUPTION THROUGH CHARACTER + ATMOSPHERE ━━━

Our gothic is stylish vampire-hunter dark-fantasy. Corruption and dark magic read through CHARACTER design (fangs, horns, glowing eyes, corrupted skin, corseted silhouette), WEAPON (silver crossbow, thin blade, ornate scythe), and ATMOSPHERE (moonlit graveyard, fog, cathedral, candle-flicker) — never through explicit religious or occult-worship imagery.

Keep the dark palette (see TWILIGHT COLOR): red/crimson is a rare accent (a single lipstick, a single vial, a sole petal), never a dominant hue and never coloring whole windows, buildings, moons, or fog.`;

const STYLIZED_MANGA_BLOCK = `━━━ STYLIZED DARK-MANGA ILLUSTRATION ━━━

Heavy-ink shadow, sharp-angular line-art, high-contrast baroque detail. Inked dark-manga-horror illustration — stylized, not painterly, not photoreal. Chiaroscuro-driven with TWILIGHT COLOR saturation. Occult-glow, runic detail, dramatic undead/warlock silhouettes welcome.`;

const NO_NAMED_CHARACTERS_BLOCK = `━━━ CHARACTERS BY ROLE ONLY ━━━

Describe by archetype: "vampire queen", "blood-huntress", "corrupted priestess", "hooded warlock", "succubus-familiar", "banshee-bride", "cursed paladin", "death-knight-archetype". NEVER named IP — no "Dracula", "Belmont", "Alucard", "Lady Dimitrescu", "Sylvanas", "Arthas", "Illidan", "Van Helsing" as names. Use the archetypes only.`;

const CINEMATIC_COMPOSITION_BLOCK = `━━━ CINEMATIC GOTHIC COMPOSITION ━━━

Dramatic angle choices — low-angle heroics, high-angle dread, over-shoulder menace, through-archway reveal, from-the-shadows stalk. Shadowed foreground, lit mid-ground, atmospheric background. Single-light-source key lighting (moon, candle, stained-glass shaft, witch-fire, fel-green rune). Mist / fog / candle-glow anchors. Concept-art poster quality — frame-worthy.`;

const SOLO_COMPOSITION_BLOCK = `━━━ SOLO COMPOSITION (character paths) ━━━

When rendering a character: she/he is the SOLO hero of the frame. No second figure, no couple-pose, no duo. Dynamic SOLO action — mid-stalk, mid-cast, mid-turn, mid-pose-with-weapon — like a Castlevania character poster or a Van-Helsing movie one-sheet. Viewer faces the subject. A creature-opponent distantly implied in background shadow is OK; a second-in-frame human figure is NOT.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ HAUNTINGLY BEAUTIFUL — WALL-POSTER TIER ━━━

Every render is HAUNTINGLY BEAUTIFUL — gorgeous in its darkness, gorgeous in its terror, gorgeous in its corruption. Dark-manga-horror-game-cover quality. The kind of illustration that would sell a PS2-era Castlevania game, a Devil-May-Cry manga volume, or a WoW-undead-warlock class-art-poster. Stylized, inked, high-contrast, dramatic. Wall-poster worthy. Every render reads "hauntingly beautiful — I need this on my wall." Beauty + dread + allure are inseparable. Never just-dark, never just-pretty — always HAUNTINGLY BEAUTIFUL.`;

const NO_FLOATING_BLOCK = `━━━ FEET ON THE GROUND — NO FLOATING / NO LEVITATING ━━━

The character is PLANTED in the world. Both feet (or one foot if mid-step) are firmly on a solid surface — cobblestones, gravestones, flagstones, dirt path, balcony rail, cathedral roof, courtyard tiles, fortress wall, cliff edge — with VISIBLE GROUND CONTACT and body weight transferred into the surface. Stance reads grounded: heel-toe pressure, slight knee-bend, leather boot pressed into the earth, dust or fog disturbed at the heel.

ABSOLUTELY BANNED: weightless-levitation pose, character drifting an inch off the ground for no reason, ghost-legs trailing into mist with no feet visible, character hovering with no clear ground contact, dangling-feet, magic-carpet-stance, no-ground-anchor, feet cut-off-by-fog-that-erases-the-floor, weightless-T-pose-mid-air.

UNLESS the action EXPLICITLY calls for mid-air (mid-leap from a roof, mid-pounce from a balcony, mid-flight on visible wings, mid-aerial-strike) — and even then, render a CLEAR PHYSICAL CAUSE: the gravestone they pushed off, the wall they kicked off from, the open wings carrying them, the edge they just leapt from — so the viewer sees the takeoff point and reads it as motion, not levitation.

Cast a VISIBLE SHADOW on the ground beneath the character's feet. Show ground-debris (dust, ash, fog-mist, snow, ember-sparks) reacting to body weight. The character has MASS and gravity in this world.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — GO TO 11 ━━━

This bot is Castlevania + Devil-May-Cry + Berserk + vampire-goth-manga-horror + WoW-undead-warlock art on STEROIDS. 11/10 stylized dark-manga-horror scenes. Stack hard: dynamic pose + twilight color + moonlight or occult-glow + heavy-ink shadow + sharp-angular baroque detail + mist-or-fog-or-smoke + crimson or fel-green or violet accents + velvet-leather-lace-iron textures + architectural grandeur or blood-moon landscape. The stylized-manga-horror aesthetic is the CANVAS, not the ceiling. Amp every element to 11. Make the viewer stop scrolling.`;

// FaeBot-pattern unified medium for scene/landscape paths (and creature
// scenes). Pinned via mediumByPath in index.js. Mirrors FaeBot's recipe:
// empty prefix (subject leads, no early-token style hijack) + tiny medium
// tag + suffix-only painterly DNA.
const PROMPT_PREFIX_PAINTED_GOTHIC_FANTASY = '';

const PAINTED_GOTHIC_FANTASY_MEDIUM = 'gothic dark-fantasy concept art, painterly';

const PROMPT_SUFFIX_PAINTED_GOTHIC_FANTASY =
  'painted dark-fantasy concept art, atmospheric gothic illustration, dramatic chiaroscuro, oil-painted brushwork, deep saturated jewel-tones with painted shadow, dark-fantasy painted-cover craft, no text, no watermarks';

// ── Looks system (2026-06-22) ──────────────────────────────────────────────
// Neutral medium for look-enabled paths: locks the GOTHIC dark-fantasy IDENTITY
// but defers the render style / medium / finish / palette to the rolled LOOK.
const GOTHBOT_NEUTRAL =
  'gothic dark-fantasy horror — hauntingly beautiful, dramatic, operatic, dark and atmospheric. The render style, medium, finish and palette are set by the LOOK tokens that lead the prompt — render the whole scene in THAT look.';

// STYLE-AUTHORITY override header, prepended to look-enabled briefs. Strong
// wording (per the MangaBot lesson) so the rolled look beats any baked style
// language in the path template; content/composition/hard-rules stay intact.
const GOTHBOT_LOOK_OVERRIDE = (sharedDNA) =>
  sharedDNA && sharedDNA.lookRegister
    ? `━━━ LOOK — RENDER STYLE AUTHORITY (NON-NEGOTIABLE — open your Flux prompt with this) ━━━
${sharedDNA.lookRegister}

This is the AUTHORITY on rendering STYLE for THIS render. It OVERRIDES any other art-style / medium / finish / linework wording anywhere below (e.g. "oil painting", "inked", "cel-shaded", "hyperreal", "Weta", "3D render", "concept art"). Keep the SCENE content, the subject, the composition, and EVERY hard rule below exactly as written — but render ALL of it in THIS look. Open your Flux prompt with these look tokens.

`
    : '';

module.exports = {
  GOTHBOT_NEUTRAL,
  GOTHBOT_LOOK_OVERRIDE,
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  GPT_CLEAN,
  ELEGANT_DARKNESS_BLOCK,
  TWILIGHT_COLOR_BLOCK,
  ALLURING_BEAUTY_BLOCK,
  DYNAMIC_POSE_BLOCK,
  EXTERIOR_PREFERRED_BLOCK,
  NO_JACK_SKELLINGTON_BLOCK,
  NO_CHEAP_GORE_BLOCK,
  NO_SATANIC_BLOCK,
  STYLIZED_MANGA_BLOCK,
  NO_NAMED_CHARACTERS_BLOCK,
  CINEMATIC_COMPOSITION_BLOCK,
  SOLO_COMPOSITION_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  NO_FLOATING_BLOCK,
  BLOW_IT_UP_BLOCK,
  PROMPT_PREFIX_PAINTED_GOTHIC_FANTASY,
  PAINTED_GOTHIC_FANTASY_MEDIUM,
  PROMPT_SUFFIX_PAINTED_GOTHIC_FANTASY,
  // Aliases for backwards-compat with existing path imports:
  PAINTERLY_ILLUSTRATION_BLOCK: STYLIZED_MANGA_BLOCK,
  NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK: NO_CHEAP_GORE_BLOCK,
};
