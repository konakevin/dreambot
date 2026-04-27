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

const PROMPT_PREFIX =
  'Dark gothic fantasy, hauntingly beautiful, operatic dark romance with vampire-hunter danger, Castlevania + Bloodborne + Devil-May-Cry + Van-Helsing energy, rich varied palette with deep purples + midnight blues + velvet blacks + poison greens + candle-amber + moonlit silver accents';

const PROMPT_SUFFIX = 'no text no words no watermarks, hyper-detailed, frame-worthy dark-fantasy art';

const ELEGANT_DARKNESS_BLOCK = `━━━ NIGHTSHADE — BEAUTIFUL, DANGEROUS, ALIVE ━━━

Dark fantasy at its most stylish — the aesthetic world of vampire hunters, gothic action cinema, supernatural adventure. Moonlit baroque architecture, candlelit crypts, foggy graveyards, cathedral ruins with broken stained glass, moss-covered gargoyles, velvet-lined interiors, Victorian finery. Rich varied palette — DEEP PURPLES + MIDNIGHT BLUES + VELVET BLACKS + POISON GREENS + WITCH-FIRE GREEN + FEL-VIOLET + BLACKLIGHT + MOONLIT SILVER + TWILIGHT LAVENDER + CANDLE-AMBER + TORCH-ORANGE + FORGE-EMBER + ALCHEMIST-GOLD. WEAVE MULTIPLE ACCENT COLORS INTO EACH SCENE — a scene might have a violet twilight sky + witch-fire green glow in a window + warm amber candle in the foreground + crimson accents on a banner. Avoid single-hue monochrome clustering. Red/crimson stays as accent only — never coloring whole windows/buildings/moons. Supernatural tension hangs in the air — something ancient stirs in shadows, candles flicker at unseen currents, fog curls low across flagstones. Dramatic Victorian-era styling — ornate fabric, silver jewelry, baroque weapons.

Reference DNA: Castlevania, Van Helsing, Devil May Cry, Hellboy, Bloodborne, Bram Stoker's Dracula. Ayami-Kojima-dark-manga stylization, heavy-ink sharp-angular lines, high-contrast baroque detail. NOT whimsical-gothic, NOT quiet-dread-dark, NOT fantasy-book-cover, NOT YA-fantasy, NOT Artgerm-smooth-digital-art. Operatic dark romance with a hint of danger. BEAUTIFUL, DANGEROUS, ALIVE. The kind of art that belongs on a Castlevania-game cover, a Hellboy-Mignola comic panel, or a Van-Helsing movie poster.`;

const TWILIGHT_COLOR_BLOCK = `━━━ TWILIGHT COLOR — WEAVE MULTIPLE HUES ━━━

The night is NOT gray-monochrome, and NOT red-monochrome. Every scene weaves MULTIPLE accent hues. Pull from the full Nightshade spectrum: violet-twilight skies, emerald-occult witch-fire, sapphire-nocturne deep-blues, rose-dusk horizons, fel-green warlock glow, necro-pale-blue, nightshade-indigo, witch-green, plus warm accents — candle-amber, torch-orange, forge-ember, alchemist-gold. Stained glass saturates the scene in colored light. Candles throw amber, forges throw orange. Moonlight paints silver-violet. Witch-fire throws poison green. A typical render has ONE dominant atmosphere hue (violet twilight, sapphire moonlight, or emerald ritual-glow) + ONE warm secondary accent (amber candle, orange torch, gold alchemist-gleam) + ONE cool accent. Darkness with VARIED COLOR. No red-red-red.`;

const ALLURING_BEAUTY_BLOCK = `━━━ EVIL + CORRUPTED + ALLURING + HAUNTINGLY BEAUTIFUL ━━━

Female characters are HAUNTINGLY BEAUTIFUL supernatural horrors — gorgeous and terrifying inseparable. Vampire queens mid-prey, succubi with slitted pupils, corrupted priestesses dripping dark magic, occult seductresses, fel-warlock sorceresses, corrupted-noble countesses, witch-queens with inhuman auras. NOT "moody-pretty-goth-girl" — the viewer should feel UNSETTLED first, magnetized second, but every frame is GORGEOUS.

MANDATORY character details per female render:
- GLOWING EYES — crimson / fel-green / void-violet / necrotic-white / ember-gold / ice-blue pupils or fully-luminous irises
- BOLD MAKEUP — heavy smokey-eye with dramatic wing, blood-red or oxblood or obsidian-black lips, sharp contour, pallid porcelain or ash-grey or blue-tinted skin
- CORRUPTION MARKINGS — ink-black veins tracing neck/arms, ritual-sigil scar on throat or brow, faint spell-tattoos glowing beneath skin, crack-lines as if stone
- WARDROBE of danger — bustier + leather pauldrons + thigh-holsters (Van-Helsing-huntress), corseted-gown with blood-crimson accents, sheer-black-lace with ritual-sigils exposed, torn-silk + chains, obsidian-scale armor-bodice
- POSTURE of menace — mid-hunt, mid-cast, mid-summon, mid-drain, mid-lunge — never static pretty-pose

Sex appeal is through DANGER + CORRUPTION + UNHUMAN-BEAUTY, never through nudity or fanservice. These women are terrifying and gorgeous, not cute-moody.`;

const DYNAMIC_POSE_BLOCK = `━━━ DYNAMIC POSE — NO STANDING-STILL ━━━

Characters are MID-ACTION, never just-standing-there posing for a portrait. Mid-stalk through graveyard mist, mid-cast with spell-sigil igniting, mid-turn with cloak flaring, mid-drawing-blade over shoulder, mid-pounce from rafter, mid-levitation above ritual circle, mid-howl at blood-moon, mid-whisper to familiar, mid-step onto gothic balcony, mid-raise-goblet at throne, mid-crouch on cathedral spire. Creatures are mid-leap, mid-lunge, mid-unfurl-wings, mid-shriek, mid-transform. Every figure has a VERB in the scene — the picture captures a MOMENT, not a portrait-pose.`;

const EXTERIOR_PREFERRED_BLOCK = `━━━ EXTERIOR PREFERRED (for character-scene paths) ━━━

Lean HARD toward outdoor gothic settings. Moonlit courtyards, cliff-top battlements, gothic flower gardens (black roses, belladonna, nightshade, moonflowers, weeping willows), graveyards with stone angels, misty moors, cursed villages, haunted forests, fogged bridges, storm-lashed balconies, coastal ruins, cathedral exteriors at twilight, moat-bridges under blood-moon, gothic streets in gaslight fog. Interiors OK but should be rarer — when interior, lean toward gothic dungeons (crypt-catacombs, torture-chambers-atmospheric, oubliettes, skull-corridors, witch-trial basements) rather than generic-cathedral-hall. Push OUT of the cathedral-interior default.`;

const NO_JACK_SKELLINGTON_BLOCK = `━━━ NO JACK SKELLINGTON / NIGHTMARE BEFORE CHRISTMAS ━━━

These phrases are banned at the engine level — and never render anything resembling them. No skeletal-ringleader imagery, no Halloween-town aesthetic, no pumpkin-king references. Our gothic is darker + more elegant + more mature + more occult.`;

const NO_CHEAP_GORE_BLOCK = `━━━ IMPLIED DREAD, NOT CHEAP GORE ━━━

Never cheap-horror, never slasher-splatter, never clown-horror. Implied blood OK for drama (crimson on lips, single-drop on lace collar, pooling-shadow on flagstones, blood-moon reflecting in puddle) — but never splattered, never visceral, never ugly. Dread comes from ATMOSPHERE: fog, shadow, chiaroscuro, unsettling composition, candle-flicker, distant howl, curling smoke, decaying elegance. Beauty-over-shock always.`;

const NO_SATANIC_BLOCK = `━━━ NO SATANIC ICONOGRAPHY — NO RED-RED-RED ━━━

ABSOLUTELY BANNED: pentagrams (5-pointed stars inside circles), inverted crosses, 666 imagery, baphomet, satanic sigils carved or drawn on floors/walls/skin, devil-horn hand gestures, explicit demonic-worship iconography. Our bot is GOTHIC-VAMPIRE-HUNTER stylish dark-fantasy — NOT satanic-metal-album-cover cheese. Corruption and dark magic read through CHARACTER design (fangs, horns, glowing eyes, corseted silhouette), WEAPON (silver crossbow, thin blade, ornate scythe), and ATMOSPHERE (moonlit graveyard, fog, cathedral) — NEVER through on-the-nose satanic symbols.

ALSO BANNED: red/crimson windows or doorways glowing from inside buildings, blood-moon dominating the sky, red-stained-glass casting the whole scene crimson, red-fog or red-mist. The palette is DEEP PURPLES + MIDNIGHT BLUES + VELVET BLACKS + POISON GREENS + WITCH-FIRE GREEN + FEL-VIOLET + BLACKLIGHT + MOONLIT SILVER + TWILIGHT LAVENDER. Red is rare — a single lipstick, a single vial, a sole petal — never a dominant hue, never coloring windows/buildings/moons/fog.`;

const STYLIZED_MANGA_BLOCK = `━━━ STYLIZED DARK-MANGA ILLUSTRATION ━━━

Heavy-ink shadow, sharp-angular line-art, high-contrast baroque detail. Ayami-Kojima-Castlevania / Kentaro-Miura-Berserk / Devil-May-Cry character-art / WoW-undead-warlock concept-art stylization. NOT painterly, NOT smooth-digital-art, NOT Artgerm, NOT fantasy-book-cover, NOT photoreal, NOT 3D-render. Stylized dark-manga-horror illustration — the kind of art that belongs on a PS2-era dark-fantasy-game cover or a Devil-May-Cry manga-adaptation volume. Chiaroscuro-driven with TWILIGHT COLOR saturation. WoW-undead/warlock art DNA welcome (silhouettes, occult glow, runic detail) — aesthetic only, never IP.`;

const NO_NAMED_CHARACTERS_BLOCK = `━━━ CHARACTERS BY ROLE ONLY ━━━

Describe by archetype: "vampire queen", "blood-huntress", "corrupted priestess", "hooded warlock", "succubus-familiar", "banshee-bride", "cursed paladin", "death-knight-archetype". NEVER named IP — no "Dracula", "Belmont", "Alucard", "Lady Dimitrescu", "Sylvanas", "Arthas", "Illidan", "Van Helsing" as names. Use the archetypes only.`;

const CINEMATIC_COMPOSITION_BLOCK = `━━━ CINEMATIC GOTHIC COMPOSITION ━━━

Dramatic angle choices — low-angle heroics, high-angle dread, over-shoulder menace, through-archway reveal, from-the-shadows stalk. Shadowed foreground, lit mid-ground, atmospheric background. Single-light-source key lighting (moon, candle, stained-glass shaft, witch-fire, fel-green rune). Mist / fog / candle-glow anchors. Concept-art poster quality — frame-worthy.`;

const SOLO_COMPOSITION_BLOCK = `━━━ SOLO COMPOSITION (character paths) ━━━

When rendering a character: she/he is the SOLO hero of the frame. No second figure, no couple-pose, no duo. Dynamic SOLO action — mid-stalk, mid-cast, mid-turn, mid-pose-with-weapon — like a Castlevania character poster or a Van-Helsing movie one-sheet. Viewer faces the subject. A creature-opponent distantly implied in background shadow is OK; a second-in-frame human figure is NOT.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ HAUNTINGLY BEAUTIFUL — WALL-POSTER TIER ━━━

Every render is HAUNTINGLY BEAUTIFUL — gorgeous in its darkness, gorgeous in its terror, gorgeous in its corruption. Dark-manga-horror-game-cover quality. The kind of illustration that would sell a PS2-era Castlevania game, a Devil-May-Cry manga volume, or a WoW-undead-warlock class-art-poster. Stylized, inked, high-contrast, dramatic. Wall-poster worthy. Every render reads "hauntingly beautiful — I need this on my wall." Beauty + dread + allure are inseparable. Never just-dark, never just-pretty — always HAUNTINGLY BEAUTIFUL.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — GO TO 11 ━━━

This bot is Castlevania + Devil-May-Cry + Berserk + vampire-goth-manga-horror + WoW-undead-warlock art on STEROIDS. 11/10 stylized dark-manga-horror scenes. Stack hard: dynamic pose + twilight color + moonlight or occult-glow + heavy-ink shadow + sharp-angular baroque detail + mist-or-fog-or-smoke + crimson or fel-green or violet accents + velvet-leather-lace-iron textures + architectural grandeur or blood-moon landscape. The stylized-manga-horror aesthetic is the CANVAS, not the ceiling. Amp every element to 11. Make the viewer stop scrolling.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
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
  BLOW_IT_UP_BLOCK,
  // Aliases for backwards-compat with existing path imports:
  PAINTERLY_ILLUSTRATION_BLOCK: STYLIZED_MANGA_BLOCK,
  NO_BLOOD_NO_GORE_NO_CLOWNS_BLOCK: NO_CHEAP_GORE_BLOCK,
};
