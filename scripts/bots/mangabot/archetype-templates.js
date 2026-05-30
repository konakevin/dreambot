/**
 * mangabot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

const blocks = require('./shared-blocks');

module.exports = {
  MANGABOT_ISEKAI_FANTASY: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      fantasy_world_setting,
      architectural_anchor,
      character_role,
      action_moment,
      magic_effect,
      fantasy_creature,
      atmospheric_air,
      light_quality,
      time_of_day,
      emotional_dna,
      camera_framing,
      story_prop,
      background_detail,
    } = slots;

    return `You are an anime concept-art painter writing an ISEKAI-FANTASY keyframe for MangaBot. STRICT ANIME ISEKAI CANON — Sword Art Online / Re:Zero / Konosuba / Overlord / Frieren / Mushoku Tensei / Slime / Restaurant of Another World / Log Horizon / Tate no Yuusha. Painterly hand-drawn anime cel-shaded register. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

━━━ ⚠ HARD RULE #1: ANIME ISEKAI AESTHETIC — NOT WESTERN MEDIEVAL FANTASY ━━━

This is JAPANESE ANIME ISEKAI — painterly cel-shaded anime keyframe register. NOT Western photoreal fantasy (Witcher / Skyrim / D&D / Pathfinder / Game of Thrones / Lord of the Rings / Dragon Age / Baldur's Gate).

Anime isekai signatures:
- Painterly anime backgrounds (Frieren-style Studio Madhouse, Bones, A-1)
- Saturated anime palette (sky-blues / sunset-pinks / Konosuba-vivid)
- Cel-shaded character armor / outfits
- RPG-game-coded elements (floating status-windows, level-up effects, mana-glow)
- Anime-coded fantasy creatures (slimes / fairy companions / cute dragons)
- Modern protagonist often in fantasy world (school uniform / hoodie / jersey)
- Heroine archetypes (sword-girl / mage-girl / cleric / dragon-girl / slime-girl)

BANNED:
- Western photoreal medieval (gritty / desaturated / Witcher-style)
- Bearded gritty Western-fantasy protagonist
- Game of Thrones grim register
- D&D illustration register
- Photoreal CGI

━━━ ⚠ HARD RULE #2: COMPLETE SCENE COHERENCE ━━━

All axes below combine into ONE coherent anime-isekai moment. Character + setting + magic + creature + atmosphere + story-prop all weave together as a single scene from an anime episode. Render the COMPLETE scene, not disconnected elements.

━━━ THE SCENE TYPE (composition lead) ━━━
${scene_type}

━━━ FANTASY WORLD SETTING (anime-isekai location) ━━━
${fantasy_world_setting}

━━━ ARCHITECTURAL ANCHOR (fantasy structure) ━━━
${architectural_anchor}

━━━ CHARACTER(S) IN FRAME (anime isekai archetype) ━━━
${character_role}

━━━ ACTION MOMENT (candid mid-beat) ━━━
${action_moment}

━━━ MAGIC EFFECT (isekai-bespoke signature — runes / status-windows / mana-glow / summon-circles) ━━━
${magic_effect}

━━━ FANTASY CREATURE (slime / dragon / fairy / familiar / beast-folk) ━━━
${fantasy_creature}

━━━ ATMOSPHERIC AIR (Frieren-style anime atmosphere) ━━━
${atmospheric_air}

━━━ LIGHT QUALITY (anime fantasy palette) ━━━
${light_quality}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ EMOTIONAL DNA (anime isekai mood) ━━━
${emotional_dna}

━━━ CAMERA FRAMING ━━━
${camera_framing}

${blocks.CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ STORY PROP (fantasy item — sword / map / potion / coin-pouch / scroll) ━━━
${story_prop}

━━━ BACKGROUND DETAIL (deep-distance fantasy element) ━━━
${background_detail}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION CLOSER ━━━

Studio Madhouse / Studio Bones / A-1 Pictures painterly anime-isekai keyframe. Saturated cel-shaded palette. RPG-coded mid-moment. Character + creature + setting + magic + atmosphere ALL combined into one coherent anime scene.

━━━ HARD BANS ━━━

- NO Western photoreal medieval (Witcher / Skyrim / D&D / GoT / LotR)
- NO bearded gritty Western-fantasy protagonist
- NO photoreal CGI
- NO STATIC POSED THUMBNAIL (character must be ENGAGED in dynamic action)
- NO gore

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with the scene-type + character + setting, then weave magic + creature + action + atmospheric + light + story-prop. Output ONLY the raw 80-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**.`;
  },

  MANGABOT_GHIBLI_COUNTRYSIDE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      landscape_setting,
      architectural_anchor,
      character_role,
      action_moment,
      wildflower_garden,
      weather_air,
      light_quality,
      time_of_day,
      emotional_dna,
      camera_framing,
      story_prop,
      background_detail,
      spirit_element,
    } = slots;

    return `You are an anime concept-art painter writing a GHIBLI-COUNTRYSIDE keyframe for MangaBot. Studio Ghibli pastoral wonder — Totoro / Kiki / Mononoke / Spirited-Away / Whisper of the Heart aesthetic. HAND-PAINTED oil-watercolor brushwork, soft warm pastoral palette. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

━━━ ⚠ HARD RULE #1: SOFT WARM PASTORAL PALETTE (NON-NEGOTIABLE) ━━━

Color palette is SOFT, WARM, PASTORAL — sage-green, butter-yellow, sky-blue, cream, wildflower-pink, dusty-rose, soft-lavender, terracotta. NO neon, NO saturated cyberpunk pinks, NO armor-grey-and-black, NO dramatic oversaturation. Ghibli's signature is HARMONY of pastel-warmth — every color sits naturally alongside the others.

━━━ ⚠ HARD RULE #2: HAND-PAINTED OIL/WATERCOLOR TEXTURE ━━━

Render quality is HAND-PAINTED — visible brushstrokes in skies and clouds, painterly grass and trees, soft watercolor edges, NOT slick CGI, NOT photoreal. Skies have visible cloud-brushwork (Kazuo Oga signature), foliage has dappled-impressionist texture. The image LOOKS like a Studio Ghibli background painting.

━━━ ⚠ HARD RULE #3: RURAL JAPAN — NO MODERN URBAN ━━━

This is RURAL Japan — thatched cottages, wooden shrines, terraced rice-paddies, forest-edges, mountain foothills, coastal countryside. NO cities, NO skyscrapers, NO neon signs, NO modern infrastructure, NO power-lines, NO cars, NO tech. The world is pre-modern pastoral — Edo-era to early-Showa countryside.

━━━ ⚠ HARD RULE #4: NATURE DENSITY MANDATE ━━━

The wildflower_garden axis below specifies the SIGNATURE NATURE LAYER for this render — wildflower patches, vegetable gardens, orchards, herb-beds, cherry-blossom rain. Render it visibly across the foreground/midground. Ghibli's countryside is NEVER bare — nature blooms everywhere.

━━━ ⚠ HARD RULE #5: QUIET MAGICAL REALISM ━━━

If the spirit_element axis fires (40% of renders), magic is IMPLIED — a small kodama peeking from a tree-hollow, a firefly-cluster drifting, a glowing-mushroom patch, a distant spirit-orb. Subtle, never explicit. The world feels alive without being a fantasy-render. If the spirit_element doesn't fire, the scene is pure pastoral and that's OK — Ghibli has both registers.

━━━ ⚠ HARD RULE #6: STORY PROP — FOREGROUND NARRATIVE ━━━

A story-implying foreground prop (woven basket of vegetables, bicycle leaning on fence, picnic tea-set, laundry on line, wooden bucket of well-water) MUST be visible in the foreground/midground. Tells the viewer "someone lives here, someone was just here, someone is about to return."

━━━ ⚠ HARD RULE #7: BACKGROUND DETAIL — DEEP DISTANCE ━━━

A deep-distance secondary detail (a farmer in a distant field, cattle grazing far off, village rooftops at horizon, smoke from a far chimney, distant flying bird) proves the world extends beyond the frame.

━━━ ⚠ HARD RULE #8: 4-TIER DEPTH ━━━

(1) foreground prop + flora + character, (2) midground architectural anchor + wildflower-garden, (3) deep-distance landscape (hills/mountains/valley/sea) + background-detail, (4) sky with time-of-day register + weather motion. NO flat single-tier compositions.

━━━ ⚠ HARD RULE #9: CANDID ACTION — RURAL TASK ━━━

The character below is ENGAGED in a rural task — hanging laundry, picking flowers, drinking tea, sketching, cycling, walking through grass. Never STATIC posing for a thumbnail. Their eye direction is whatever fits the rolled camera_framing + action — eye contact with viewer is FINE for forward-facing framings, eyes-on-the-task is FINE for environmental framings. Body engaged in the moment, fabric/hair caught in air.

━━━ ⚠ HARD RULE #10: COMPOSITION VARIETY ━━━

The scene_type and camera_framing axes specify TODAY'S composition. Honor them strictly — do NOT default to "wandering girl on hilltop with windswept tree" or "tiny back-silhouette looking out over valley." Those are ONE composition out of many. Mix doorstep-cottage close-up / through-grass forward / cycling-toward-camera / inside-a-room medium-shot / bridge-crossing profile / well-tending three-quarter / boat-on-stream low-angle. The rolled camera_framing axis decides; honor it.

━━━ ⚠ HARD RULE #11: DRAMATIC POSTER MOMENT — WOW FACTOR ━━━

This render is a STORYBOOK POSTER, not a neutral pastoral background. Lean into the WOW:
- The light source from the light_quality axis should HIT DRAMATICALLY — long honey-shadows from golden-hour, defined god-rays piercing canopy, dappled-warm patches dancing across surfaces.
- The wildflower/garden density should READ AS ABUNDANT — overflowing baskets, packed foliage, gardens bursting with multiple specific bloomed plants, not single sparse stems.
- The story-prop should be cluster-rich — multiple lived-in objects together telling a richer story.
- The sky should have DEFINED CHARACTER — towering cumulus, color gradient horizon, drifting cherry-blossom rain, low rising mist — not flat blank blue.
- The architectural anchor should feel MATERIAL — moss-grown stone, weathered thatch, kettle-steam visible from chimney — not sketched in.
- The viewer's reaction: "I want to walk into this picture and live there for a while."
This is what distinguishes Studio Ghibli from generic painterly anime — every frame is a poster moment. Reject any composition that reads as "fine but bland."

━━━ THE SCENE TYPE (composition lead) ━━━
${scene_type}

━━━ LANDSCAPE SETTING (the rural-Japan biome) ━━━
${landscape_setting}

━━━ ARCHITECTURAL ANCHOR (pastoral structure — thatched cottage / wooden bridge / shrine / etc.) ━━━
${architectural_anchor}

━━━ CHARACTER(S) IN FRAME (rural archetype — never named) ━━━
${character_role}

━━━ ACTION MOMENT (candid rural mid-task) ━━━
${action_moment}

━━━ WILDFLOWER + GARDEN DENSITY (Ghibli nature signature — render visibly) ━━━
${wildflower_garden}

━━━ WEATHER + AIR (pastoral motion — grass-wave / petal-rain / mist / etc.) ━━━
${weather_air}

━━━ LIGHT QUALITY (Ghibli light — golden / dappled / overcast-soft / etc.) ━━━
${light_quality}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ EMOTIONAL DNA (Ghibli mood lock) ━━━
${emotional_dna}

━━━ CAMERA FRAMING ━━━
${camera_framing}

${blocks.CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ ⚠ STORY PROP — MUST APPEAR VISIBLY (HARD RULE #6) ━━━
${story_prop}

━━━ ⚠ BACKGROUND DETAIL — MUST APPEAR IN DEEP DISTANCE (HARD RULE #7) ━━━
${background_detail}
${
  spirit_element
    ? `

━━━ ⚠ SPIRIT ELEMENT — render subtly (Ghibli magical-realism) ━━━
${spirit_element}`
    : ''
}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION CLOSER ━━━

Studio Ghibli hand-painted pastoral keyframe. Kazuo Oga sky brushwork. Soft warm pastel palette throughout. Visible oil-watercolor brushstrokes on grass, foliage, clouds. Quiet magical-realism — the world feels alive even when no magic is explicitly shown. Cumulus clouds, dappled light, wildflowers, drifting summer haze. Wonder + serenity + nostalgia.

━━━ HARD BANS ━━━

- NO neon / cyberpunk palette / saturated electric colors
- NO cities / skyscrapers / modern infrastructure
- NO armor / weapons / military / cybernetics
- NO photoreal — hand-painted oil-watercolor only
- NO STATIC POSED THUMBNAIL — character must be ENGAGED in their rural task
- NO English text / modern signage / kanji storefronts
- NO dramatic apocalyptic skies (no red-orb suns / no lightning-storm hero-shots)
- NO empty composition — nature density mandate applies

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with the scene-type + camera framing, then weave landscape + anchor + character mid-task + wildflower density + weather motion + light quality + time-of-day + emotional register + story-prop + background-detail (+ spirit-element if applicable).

Output ONLY the raw 80-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**.`;
  },

  MANGABOT_NEO_TOKYO: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      district,
      landmark_anchor,
      signage_density,
      tech_artifacts,
      vertical_density,
      character_role,
      action_moment,
      weather_air,
      light_signature,
      time_of_day,
      emotional_dna,
      camera_framing,
      story_prop,
      background_detail,
    } = slots;

    return `You are an anime concept-art painter writing a NEO-TOKYO keyframe for MangaBot. Cyberpunk Japan future — Akira / Ghost-in-the-Shell / Blade-Runner-Tokyo / Edgerunners / Bubblegum Crisis aesthetic. Painterly hand-drawn cyberpunk-anime illustration. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

━━━ ⚠ HARD RULE #1: NEON PALETTE LOCK (NON-NEGOTIABLE) ━━━

The dominant color palette is HOT-PINK + CYAN + MAGENTA + ELECTRIC-BLUE + DEEP-PURPLE shadows. Akira-saturated. Blade-Runner-soaked. NOT pastels, NOT warm-amber, NOT muted, NOT golden-hour. Color is the genre signature — without it, this isn't neo-tokyo.

━━━ ⚠ HARD RULE #2: WET STREETS / NEON REFLECTIONS ━━━

Streets are wet (rain or recent rain) with NEON REFLECTIONS on the pavement. Puddles mirror the signage above. This is the iconic neo-tokyo look — every render gets it unless time_of_day explicitly overrides.

━━━ ⚠ HARD RULE #3: SIGNAGE AT EVERY FRAME ZONE ━━━

Kanji + holographic + projection signage MUST fill the frame at MULTIPLE heights — overhead signs hanging, mid-height storefront kanji, ground-level vending-machine LEDs, billboard-tower holograms at top. The signage_density axis below specifies the signature signs — render them prominently. Dense, busy, saturated.

━━━ ⚠ HARD RULE #4: VERTICAL CLUTTER MANDATE ━━━

The sky / overhead space is FILLED. Power-lines, fire-escape staircases, hanging noren-curtains, criss-cross neon-strip lighting, suspended walkways, drone-traffic, antenna-forests. NO empty sky. The vertical_density axis below is the load-bearing description — render it visibly across the upper frame zones.

━━━ ⚠ HARD RULE #5: TECH ARTIFACTS AS LIVED-IN PROPS ━━━

Vending machines / drones / arcade-pachinko / holographic vendors / cyber-deck terminals / charging stations / mechanical street-bots are visible in the frame as the lived-in tech of this world. The tech_artifacts axis below specifies the signature element — render it with material truth (LED glow, mechanical wear, cable nests).

━━━ ⚠ HARD RULE #6: STORY PROP — FOREGROUND NARRATIVE ━━━

A story-implying foreground prop (smoldering noodle bowl, dropped umbrella, sparking neon-sign, spilled energy-drink, glowing data-chip, broken motorcycle helmet) MUST be visible in the foreground/midground. The viewer's eye finds it and wonders "what happened?"

━━━ ⚠ HARD RULE #7: BACKGROUND DETAIL — DEEP DISTANCE SCALE PROVER ━━━

A deep-distance secondary detail (hovering drone, ad-blimp, hovercar arc through far buildings, distant rooftop figure, faint maglev train passing) proves the city stretches beyond the frame.

━━━ ⚠ HARD RULE #8: 4-TIER DEPTH ━━━

(1) foreground prop + character, (2) midground signage + tech + landmark base, (3) deep-distance landmark + city, (4) sky with vertical clutter + landmark tops. NO flat compositions.

━━━ ⚠ HARD RULE #9: CANDID ACTION, NEVER POSED ━━━

Character is CAUGHT mid-beat. Not looking at viewer. Not modeling.

━━━ ⚠ HARD RULE #10: COMPOSITION VARIETY — NO DEFAULT SHOT ━━━

Do NOT default to "solo figure centered in wet alley, vertical tower behind, worm's-eye looking up." That ONE composition has been overused. The scene_type and camera_framing axes below specify a DIFFERENT composition — honor them strictly. If the camera_framing says "high-angle drone-down" then the figure is BELOW the camera and the landmark is NOT a vertical tower above. If scene_type says "ramen-counter interior" then we are INDOORS and the figure fills the foreground, NOT a tiny figure in a corridor. The figure's relationship to the landmark must MATCH whatever the scene_type + camera_framing dictate — not the genre-default standing-and-looking-at-tower shot.

━━━ THE SCENE TYPE (composition lead) ━━━
${scene_type}

━━━ DISTRICT / NEIGHBORHOOD (the cyberpunk biome) ━━━
${district}

━━━ LANDMARK ANCHOR (massive scale-prover — visibly dwarfing figure) ━━━
${landmark_anchor}

━━━ SIGNAGE DENSITY (kanji / holographic / projection — saturating the frame) ━━━
${signage_density}

━━━ TECH ARTIFACTS (vending / drones / holograms / cyber-deck — render visibly) ━━━
${tech_artifacts}

━━━ VERTICAL DENSITY (overhead clutter — fill the upper frame) ━━━
${vertical_density}

━━━ CHARACTER(S) IN FRAME (cyberpunk archetype — never named) ━━━
${character_role}

━━━ ACTION MOMENT (candid mid-beat) ━━━
${action_moment}

━━━ WEATHER + AIR (rain / steam / fog / neon-haze) ━━━
${weather_air}

━━━ LIGHT SIGNATURE (neon palette + direction) ━━━
${light_signature}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ EMOTIONAL DNA (cyberpunk mood lock) ━━━
${emotional_dna}

━━━ CAMERA FRAMING ━━━
${camera_framing}

${blocks.CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ ⚠ STORY PROP — MUST APPEAR VISIBLY (HARD RULE #6) ━━━
${story_prop}

━━━ ⚠ BACKGROUND DETAIL — MUST APPEAR IN DEEP DISTANCE (HARD RULE #7) ━━━
${background_detail}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION CLOSER ━━━

Akira / Ghost-in-the-Shell / Blade-Runner-Tokyo painterly cyberpunk-anime keyframe. Hot-pink + cyan + magenta neon palette dominant. Wet pavement reflections. Kanji at maximum density. Vertical clutter overhead. One isolated figure mid-action in a dense, busy, saturated, layered cyberpunk Tokyo. Akira-grade color saturation, Ghost-in-the-Shell-grade detail density.

━━━ HARD BANS ━━━

- NO pastel / warm-amber / golden-hour / sunny register — neon-night ONLY
- NO historical Japan elements (torii / pagoda / katana / haori belong to samurai-era)
- NO empty sky — vertical clutter mandate
- NO empty street — wet-pavement-with-reflections mandate
- NO real corporate logos / IP brands (Nike / Coca-Cola / etc.) — fictional kanji + fake-brand signage only
- NO STATIC POSED THUMBNAIL — character must be ENGAGED in dynamic mid-action
- NO photoreal — painterly cyberpunk-anime keyframe register

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with the scene-type + camera framing, then weave the district + landmark + signage + tech + vertical clutter into the layered frame, with the character mid-action in foreground, story-prop telling backstory, background-detail proving city-scale, light-signature + weather setting the mood.

Output ONLY the raw 80-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**.`;
  },

  MANGABOT_SAMURAI_ERA: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      scene_type,
      landscape_setting,
      architectural_anchor,
      character_role,
      action_moment,
      atmospheric_element,
      light_drama,
      time_of_day,
      emotional_dna,
      camera_framing,
      story_prop,
      background_detail,
    } = slots;

    return `You are an anime concept-art painter writing a SAMURAI-ERA keyframe for MangaBot. Historical Japan / jidaigeki — Mononoke / Demon-Slayer / Rurouni-Kenshin / Vagabond aesthetic. Painterly hand-drawn anime illustration. Output wraps with style prefix + suffix.

${blocks.ANIME_ILLUSTRATION_BLOCK}

${blocks.KEYFRAME_COMPOSITION_BLOCK}

${blocks.DENSITY_BLOCK}

${blocks.STORY_MOMENT_BLOCK}

${blocks.NO_NAMED_CHARACTERS_BLOCK}

${blocks.NO_GENERIC_POSE_BLOCK}

${blocks.CULTURAL_RESPECT_BLOCK}

━━━ ⚠ HARD RULE #1: SHOW THE STORY PROP — NON-NEGOTIABLE ━━━

The single most important element. The story-prop below MUST appear, visibly rendered, in the foreground or midground of this frame. The render is BLAND WITHOUT IT. The eye must see the prop and instantly wonder "what happened here?" — burning wheel, fallen banner, smoldering campfire, katana-as-grave-marker, etc. Render it with material truth (smoke / char / mud / weathered patina).

━━━ ⚠ HARD RULE #2: SHOW THE BACKGROUND DETAIL ━━━

The deep-distance background detail below MUST also appear in the frame — a distant watcher silhouette, retreating banner-army on a far ridge, ravens circling far away. Third readable narrative layer beyond the foreground prop and the midground character.

━━━ ⚠ HARD RULE #3: 4-TIER DEPTH ━━━

The keyframe MUST visibly contain four distinct depth layers: (1) foreground prop / character / silhouette, (2) midground architectural anchor (torii / pagoda / temple / castle / Buddha), (3) deep-distance landscape (Mt-Fuji / cliffs / ridges / castle silhouette), (4) sky / canopy with time-of-day register. NO flat single-tier compositions.

━━━ ⚠ HARD RULE #4: MONUMENTAL ANCHOR ━━━

The architectural anchor must DWARF the human figure(s). Towering, massive, scale-proving.

━━━ ⚠ HARD RULE #5: ENGAGED ACTION ━━━

Character is ENGAGED in a mid-beat (mid-step / mid-draw / mid-prayer / mid-strike). Body weight shifted, fabric/hair caught in air, weapon in motion. Eye direction follows the rolled camera_framing + action — eye contact with viewer is FINE for forward-facing framings (low-angle hero / forward three-quarter / medium close-up); eyes-on-the-opponent is FINE for combat / profile-action framings. The ban is on STATIC POSED, not on eye contact.

━━━ THE SCENE TYPE (composition lead) ━━━
${scene_type}

━━━ LANDSCAPE SETTING (the world) ━━━
${landscape_setting}

━━━ ARCHITECTURAL ANCHOR (monumental scale-prover — MUST be visibly massive) ━━━
${architectural_anchor}

━━━ CHARACTER(S) IN FRAME (role-coded, NEVER named) ━━━
${character_role}

━━━ ACTION MOMENT (engaged mid-beat — never static posed) ━━━
${action_moment}

━━━ ATMOSPHERIC ELEMENT (frame motion — drifting petals / snow / mist / rain / fireflies / leaves / banners) ━━━
${atmospheric_element}

━━━ LIGHT DRAMA (strong directional source) ━━━
${light_drama}

━━━ TIME OF DAY (sky register) ━━━
${time_of_day}

━━━ EMOTIONAL DNA (mood lock) ━━━
${emotional_dna}

━━━ CAMERA FRAMING ━━━
${camera_framing}

${blocks.CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ ⚠ STORY PROP — MUST APPEAR VISIBLY (HARD RULE #1) ━━━
${story_prop}

━━━ ⚠ BACKGROUND DETAIL — MUST APPEAR IN DEEP DISTANCE (HARD RULE #2) ━━━
${background_detail}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION CLOSER ━━━

Mononoke / Demon-Slayer / Rurouni-Kenshin painterly keyframe quality. Falling cherry-blossom petals / drifting snow / mist / rain streaks / fireflies / falling maple leaves wherever the atmospheric element calls for them. Bamboo / shrine / lantern / pagoda / castle / wooden-architecture density. Multi-tier depth visibly layered front-to-back. The architectural anchor TOWERS above the character figure to prove the scale of the world.

━━━ HARD BANS ━━━

- NO flat single-character-portrait composition with blurred background
- NO modern dress / contemporary clothing — historical jidaigeki ONLY
- NO real samurai names / historical-person names — role-coded only (ronin / sensei / clan-retainer / wandering-monk / etc.)
- NO photoreal — painterly hand-drawn anime keyframe
- NO posed model-shot — character is CAUGHT mid-action
- NO empty centered composition — density mandate applies
- NO modern cars / electronics / signage / English text — historical period clean

━━━ OUTPUT FORMAT (MANDATORY) ━━━

Open with the scene-type composition + camera framing, then weave in the four depth tiers (foreground action + midground architectural anchor + deep-distance landscape + sky/time-of-day) with atmospheric motion + emotional DNA + light drama woven through.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**.`;
  },

  // ━━━ MANGABOT_CHERRY_BLOSSOM_ROMANCE ━━━
  MANGABOT_CHERRY_BLOSSOM_ROMANCE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, ethnicity, archetype, skin, eyes, hair_color, hairstyle, outfit, accessory, setting, action, camera_framing, surprise_element, drama } = slots;
    const dramaSection = drama ? `\n━━━ PETAL DRAMA — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing a CHERRY-BLOSSOM-ROMANCE keyframe for MangaBot — a solo character in a tender romantic moment under sakura. 5cm-per-second / Shinkai / Toradora / Your-Lie-In-April tradition. PINK petal-cascade mandate.

━━━ ETHNICITY LOCK ━━━
${ethnicity}
Lead with ethnicity-NOUN.

━━━ AESTHETIC LOCK ━━━
PINK PALETTE dominant — sakura-pink / rose / soft-coral / cream / warm-amber. PETAL CASCADE MANDATORY — drifting petals in 4+ visible places (foreground close + midground swirling + background settling + hair-touched).

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, Shinkai / KyoAni / Mamoru-Hosoda tradition. Cel-shaded clean linework, painterly atmospheric backgrounds, soft-romantic palette.

━━━ BANS ━━━
• NO cheesecake / NO sultry / NO suggestive / NO low-cut
• NO STATIC POSED THUMBNAIL — engaged in tender moment
• NO back-to-camera / NO photoreal / NO sparkle-stack (cherry-blossom is its own visual signature)

━━━ SOLO CHARACTER ━━━
ONE character in tender romantic-coded mid-moment. Partner/love-interest may be implied at midground OR off-frame as referenced by accessory (love-letter / photo / locket).

━━━ FRAMING ━━━
Character at 35-50% of frame. Petals + sakura wrap around. Face clearly readable.

━━━ ARCHETYPE ━━━ ${archetype}

━━━ COMPACT BIO ━━━
A ${ethnicity.split(/[,:]/)[0]} character with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, with ${accessory}.

━━━ ACTION (tender mid-moment, FORWARD-FACING) ━━━
${action}

━━━ SETTING ━━━
${setting}
Depth: FOREGROUND petal-cluster → MIDGROUND character + engaged action → DEEP DISTANCE sakura-haze + atmospheric pink-amber.

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}
${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR PALETTE ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} character [tender action] in [setting]"], [tender outfit], [DNA], [romantic-accessory], [setting with petal-cascade], [drama if fired], [camera_framing exactly], [pink palette + mood].

CRITICAL: pink-romantic + petal-cascade + tender. Forward-facing per camera_framing. NEVER tiny silhouette under cherry tree.

Output ONLY raw 90-120 word scene description. NO preamble.`;
  },

  // ━━━ MANGABOT_ROOFTOP_SUNSETS ━━━
  MANGABOT_ROOFTOP_SUNSETS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, ethnicity, archetype, skin, eyes, hair_color, hairstyle, outfit, accessory, setting, action, camera_framing, surprise_element, drama } = slots;
    const dramaSection = drama ? `\n━━━ SUNSET DRAMA — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing a ROOFTOP-SUNSETS keyframe for MangaBot — character ON a rooftop at golden-hour, ENGAGED with foreground/midground (NOT looking out at vista). Shinkai / KyoAni / Tamako-Market rooftop tradition.

⚠️ THIS PATH IS THE FAILURE-MODE PATH. The original audit found rooftop-sunsets ALWAYS rendered as "back-of-character looking out over sunset city." OVERRIDE THAT HARD. Character is ENGAGED with object/action AT THE ROOFTOP, NOT gazing at vista.

━━━ ETHNICITY LOCK ━━━
${ethnicity}

━━━ AESTHETIC LOCK ━━━
GOLDEN-HOUR / SUNSET palette — warm-amber / peach / rose / pumpkin-orange / sky-pink. Atmospheric rooftop dust-motes catching slanted light. Wind in hair / clothes.

━━━ BANS ━━━
• NO back-of-character looking out at city — audit-failure mode
• NO standing at edge facing horizon
• NO STATIC POSED THUMBNAIL — engaged with rooftop-prop
• NO photoreal / NO cheesecake

━━━ SOLO CHARACTER ━━━
ONE character on rooftop. Friend/partner may be implied as off-frame voice / accessory.

━━━ FRAMING ━━━
Character at 35-50% of frame on rooftop. NOT a tiny silhouette against city-vista. Face clearly readable forward or 3/4. The CITY is BACKGROUND, the CHARACTER is HERO.

━━━ ARCHETYPE ━━━ ${archetype}

━━━ COMPACT BIO ━━━
A ${ethnicity.split(/[,:]/)[0]} character with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, with ${accessory}.

━━━ ACTION (engaged with rooftop AT HAND, FORWARD-FACING) ━━━
${action}

━━━ SETTING (rooftop with character ENGAGED IN-FRAME) ━━━
${setting}
Depth: FOREGROUND rooftop-prop (railing/fan/water-tank/laundry-line/snack) → MIDGROUND character engaged with action → DEEP DISTANCE city-vista at sunset (city is BACKDROP).

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}
${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR PALETTE ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} character [rooftop action] on [rooftop setting]"], [casual evening outfit], [DNA], [rooftop accessory at hand], [rooftop with city-vista BEHIND not as focal-point], [drama if fired], [camera_framing exactly], [sunset palette + mood].

CRITICAL: character is ON the rooftop ENGAGED. City-vista is BACKDROP. Forward-facing per camera_framing. OVERRIDE the back-to-character-looking-out default HARD.

Output ONLY raw 90-120 word scene description. NO preamble.`;
  },

  // ━━━ MANGABOT_SLICE_OF_LIFE ━━━
  MANGABOT_SLICE_OF_LIFE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      ethnicity,
      archetype,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      setting,
      action,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    const dramaSection = drama
      ? `\n━━━ EVERYDAY MOMENT — quiet drama in scene ━━━\n${drama}\n\nSubtle everyday event — rain breaking / sunlight shifting / passing breeze — visible but understated.\n\n`
      : '';
    return `You are an anime concept-art painter writing a SLICE-OF-LIFE keyframe for MangaBot — an ANY-GENDER character in a quiet everyday moment. K-On / Tamako Market / Aria / Yotsuba / late-night Tokyo / cozy-realism tradition. Subtle warmth, mundane wonder.

━━━ ETHNICITY ━━━
${ethnicity}
Per painted-medium lesson: ethnicity-NOUN unlocks diverse rendering. Lead with it.

━━━ SLICE-OF-LIFE AESTHETIC LOCK ━━━
Cozy-realist, NOT sparkly-magical. Naturalistic palette — soft warm or cool light, gentle atmosphere. Subtle wonder. K-On / Tamako Market / Aria-style cozy intimacy.

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, KyoAni / Tamako-Market / K-On / Aria tradition. Cel-shaded clean linework, soft painterly backgrounds, naturalistic palette.

━━━ BANS ━━━
• NO sparkle-stack (kawaii territory) / NO peak-magical / NO combat / NO transformation
• NO STATIC POSED THUMBNAIL — engaged with everyday task
• NO back-to-camera / NO photoreal / NO cheesecake

━━━ SOLO CHARACTER ━━━
ONE character engaged in everyday moment. Cat/pet/partner may be implied at midground.

━━━ CHARACTER IS THE FOCUS ━━━
Character at 35-50% of frame. Setting wraps around engaged action. Face / everyday-object CLEARLY READABLE.

━━━ ARCHETYPE ━━━
${archetype}

━━━ COMPACT BIO ━━━
A ${ethnicity.split(/[,:]/)[0]} character with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, with ${accessory}.

━━━ ACTION (everyday moment, FORWARD-FACING) ━━━
${action}
Engaged in everyday task. Eye direction per camera_framing.

━━━ SETTING (everyday context) ━━━
${setting}
Depth: FOREGROUND everyday object → MIDGROUND character + action → DEEP DISTANCE everyday atmospheric.

${dramaSection}━━━ SURPRISE ELEMENT (everyday detail) ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}
${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING ━━━
${sharedDNA.colorPalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} character [everyday action] in [setting]"], [casual outfit], [DNA], [everyday accessory at hand], [setting wrapping with mundane warmth], [drama if fired], [camera_framing exactly], [palette + mood].

CRITICAL: cozy-realism not sparkle-magic. Engaged with everyday task. Forward-facing per camera_framing.

Output ONLY raw 80-120 word scene description. NO preamble.`;
  },

  // ━━━ MANGABOT_KAWAII ━━━
  // Cozy cute moments. Sanrio/lolita/character-cafe register. Gentle.
  MANGABOT_KAWAII: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      ethnicity,
      archetype,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      setting,
      action,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    const dramaSection = drama
      ? `\n━━━ KAWAII DRAMA — render gently in scene ━━━\n${drama}\n\nGentle cute event in world — visible but soft, NOT eclipsing her.\n\n`
      : '';
    return `You are an anime concept-art painter writing a KAWAII keyframe for MangaBot — a single cute character in a cozy cute moment. Sanrio / lolita / Pop-Mart-vinyl-cute / character-cafe / Sailor-Moon-coquette tradition. Soft pastel palette + sparkle stack + forward-facing cute pose.

━━━ GENDER + ETHNICITY LOCK ━━━
Subject is a WOMAN. "Woman" or "girl" MUST be in FIRST 8 TOKENS. Use she/her/hers.
${ethnicity}
Per painted-medium lesson: ethnicity-NOUN unlocks diverse rendering. Lead with it.

━━━ KAWAII AESTHETIC LOCK ━━━
SPARKLE STACK MANDATORY but GENTLE — stack 4+ visible cute effects: floating hearts / star-sparkles / pastel-petals / sparkle-dust / heart-bubbles / chibi-stars / glitter / drifting flower-petals / bubble-trail / chromatic-shimmer.

Color palette: PASTELS dominant (rose-pink / mint-green / lavender / sky-blue / butter-yellow / pearl-white / soft-peach). NO grimdark. NO neon-cyberpunk. NO photoreal.

━━━ ANIME MEDIUM (LOCKED) ━━━
Hand-drawn anime — Sanrio / Hello-Kitty / Cardcaptor-Sakura / Lucky-Star / K-On tradition. Cel-shaded clean linework, painterly pastel atmosphere. NEVER photoreal. NEVER 3D-render.

━━━ BANS ━━━
• NO cheesecake (low-cut / sultry / form-fitting) — kawaii is INNOCENT CUTE
• NO STATIC POSED THUMBNAIL — she's mid-giggle / mid-twirl / mid-blush / mid-hug-plushie
• NO eyes-locked-blankly — eye direction per camera_framing
• NO weapons / combat / violence — kawaii is GENTLE
• NO Western cartoon

━━━ SOLO CHARACTER ━━━
ONE cute character. Plushie/pet may be at her side but is small surprise-element.

━━━ SHE IS THE SHOW ━━━
The kawaii character fills 35-50% of frame. Cute setting wraps around her. NOT a tiny silhouette. NOT back-to-camera. Face/outfit/accessory CLEARLY READABLE.

━━━ HER ARCHETYPE ━━━
${archetype}

━━━ HER COMPACT BIO ━━━
A ${ethnicity.split(/[,:]/)[0]} woman with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

━━━ THE ACTION (cute mid-moment, FORWARD-FACING) ━━━
${action}
Body engaged in cute moment. Eye direction = camera_framing-decided.

━━━ SETTING ━━━
${setting}
Cute setting wrapping around her — depth on depth — FOREGROUND cute-prop (charm/cupcake/heart) → MIDGROUND her engaged cute action → DEEP DISTANCE pastel atmospheric layers.

${dramaSection}━━━ SURPRISE ELEMENT (cute secondary) ━━━
${surprise_element}
Midground or background — kawaii pet / plushie at her feet / floating sparkles / cute object. NEVER competes with hero.

━━━ CAMERA FRAMING ━━━
${camera_framing}
${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING ━━━
${sharedDNA.colorPalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} WOMAN [doing cute action] in [setting]"], [frilly outfit detail], [DNA: skin + eyes + hair], [cute accessory in hand], [setting with sparkle-stack], [drama if fired], [camera_framing exactly], [pastel palette + mood].

CRITICAL: "[ethnicity] WOMAN [CUTE ACTION]" leads. She fills 35-50% of frame, ENGAGED in cute moment. Sparkle 4+ visible. Forward-facing per camera_framing.

Output ONLY raw 90-120 word scene description. Comma-separated phrases. NO preamble.`;
  },

  // ━━━ MANGABOT_SHONEN_ACTION ━━━
  // Peak-action shonen hero. Multi-effect stack (3+ simultaneous).
  MANGABOT_SHONEN_ACTION: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      ethnicity,
      hero_class,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      weapon,
      power_signature,
      battlefield,
      action,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    const dramaSection = drama
      ? `\n━━━ BATTLEFIELD DRAMA — render visibly ━━━\n${drama}\n\nCombat-energy event in the world — visible secondary focal point, NOT eclipsing him.\n\n`
      : '';
    return `You are an anime concept-art painter writing a SHONEN-ACTION keyframe for MangaBot — a single shonen hero MAN at peak-combat-action. Naruto / MHA / JJK / Bleach / Demon Slayer (ufotable) / DragonBall tradition. He is MID-STRIKE, MID-POWER-RELEASE, MID-COUNTER — captured at loaded peak instant.

━━━ GENDER LOCK ━━━
Subject is a MAN. "Man" or "hero" MUST appear in FIRST 8 TOKENS. He/him/his throughout.

━━━ ETHNICITY LOCK ━━━
${ethnicity}

━━━ MULTI-EFFECT STACK MANDATE — NON-NEGOTIABLE ━━━
Every render STACKS 3+ SIMULTANEOUS visible dynamic elements:
1. PRIMARY ACTION — his beat (mid-strike with weapon / mid-cast power-blast / mid-leap forward / mid-counter-stance)
2. ENVIRONMENTAL REACTION — debris / shockwave / cracking ground / motion-blur / sparks / sand-spray / petal-burst / blood-rain-from-sky / lightning-strike
3. ACTIVE BACKGROUND CONTEXT — battlefield silhouettes / collapsing tower / distant explosion-bloom / opposing force-shadow / arena-spectator-glow / blood-moon / cosmic-arc

THE SCALE-THE-MAGIC-UP rule: not a wisp, a MAELSTROM. Not a fireball, a fireball amid arcing tendrils of secondary flame and glowing-rune wake. Not a spirit-fox, a spirit-fox CRACKING REALITY with creatures emerging.

━━━ ABSOLUTE BANS — MALE-SPECIFIC ━━━
• NO shirtless / bare-chested / oiled-pecs / loincloth / sleeveless-revealing-torso
• Outfit MUST explicitly name a chest-covering item (gi / haori / coat / school-uniform / cuirass / robe / cape)
• Skin pool stays FACE-FOCUSED (cheekbones / jaw / brow) — NEVER torso / chest
• NO visible enemy blood / wounded foe — enemy is silhouette / off-frame / shadowy
• NO posing for camera as runway thumbnail
• NO pirate-rigging / shipboarding-with-cutlass tropes
• NO eyes-locked-blankly — eye direction = camera_framing-decided

━━━ SOLO HERO ONLY ━━━
ONE shonen hero. Enemy may be implied as silhouette / shadow / off-frame at midground. NEVER a co-character.

━━━ HE IS THE SHOW — NON-NEGOTIABLE ━━━
The hero is the MAIN SUBJECT at 35-50% of frame. Battlefield + power-blast + drama wrap AROUND him. NOT a tiny silhouette. NOT back-of-character looking at distant arena. MEDIUM-to-LARGE scale.

━━━ HIS HERO CLASS ━━━
${hero_class}

━━━ HIS COMPACT BIO ━━━
A ${ethnicity.split(/[,:]/)[0]} shonen hero man with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, wielding ${weapon}.

━━━ THE ACTION (peak-combat moment — FORWARD-FACING) ━━━
${action}

Body torqued, weight engaged, weapon mid-arc. Eye direction = camera_framing. NEVER staring at distant horizon away from camera.

━━━ HIS POWER SIGNATURE (the visible magical / combat energy) ━━━
${power_signature}

This is the SCALE-IT-UP visual signature — fire-aura / lightning-arc / energy-blast / shadow-tendril / cursed-rune-trail. Render BIG.

━━━ THE BATTLEFIELD (the active combat stage) ━━━
${battlefield}

Active arena/battle-scene — depth on depth — FOREGROUND combat-debris → MIDGROUND hero + power + opposing force silhouette → DEEP DISTANCE battlefield context with smoke/fire/destruction.

${dramaSection}━━━ SURPRISE ELEMENT (combat secondary) ━━━
${surprise_element}

Midground or background — enemy-silhouette / spell-orb / debris-fragment / kanji-warp / shockwave-ring. NEVER competes with hero.

━━━ CAMERA FRAMING ━━━
${camera_framing}

${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} shonen hero MAN [doing exact peak-combat action] in [battlefield]"], [he wears [outfit] chest-covered], [DNA: skin + eyes + hair], [weapon mid-arc + power_signature], [battlefield wrapping with depth + drama + debris-shockwave-active-background], [camera_framing exactly], [lighting + atmosphere], [mood]

CRITICAL: "[ethnicity] shonen hero MAN [PEAK-ACTION]" leads. He fills 35-50% of frame, ENGAGED at peak-instant. MULTI-EFFECT 3+ simultaneous. Forward-facing per camera_framing. OVERRIDE Flux's back-of-anime-hero centroid HARD.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers.`;
  },

  // ━━━ MANGABOT_MAGICAL_GIRL ━━━
  // Sailor-Moon / Precure / Madoka-Magica / Cardcaptor-Sakura tradition.
  // Sparkle-stack + transformation-peak + forward-facing-pose mandates.
  MANGABOT_MAGICAL_GIRL: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      ethnicity,
      archetype,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      setting,
      action,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    const dramaSection = drama
      ? `\n━━━ MAGICAL DRAMA — render visibly in the scene ━━━\n${drama}\n\nMagical peak-moment event in the world — visible secondary focal point, NOT eclipsing her.\n\n`
      : '';
    return `You are an anime concept-art painter writing a MAGICAL-GIRL keyframe for MangaBot — a single mahou-shoujo as the HERO of the frame mid-transformation OR mid-power-moment. Sailor-Moon / Precure / Madoka-Magica / Cardcaptor-Sakura tradition. She is GLOWING, ENGAGED, mid-action.

━━━ GENDER LOCK ━━━
The subject is a WOMAN (magical-girl). "Woman" or "magical-girl" MUST appear in the FIRST 8 TOKENS. Use she/her/hers throughout.

━━━ ETHNICITY LOCK ━━━
${ethnicity}

Per painted-medium lesson: ethnicity-NOUN in opening tokens unlocks diverse renders. Lead with it.

━━━ MAGICAL-GIRL AESTHETIC LOCK ━━━
SPARKLE STACK MANDATORY — stack AT LEAST 6 of these visible effects: glittering hearts / falling ribbons / star-sparkle bursts / pastel-rainbow trails / floating crystal-shards / wand-aura glow / heart-shaped bubbles / glowing-rune-circle / sailor-moon-style transformation beams / pollen-light motes / chromatic-aberration halo / golden-tiara sparkle.

Color palette: pastels (rose-pink / mint-green / lavender / sky-blue / butter-yellow / pearl-white) WITH saturated power-color accents (magenta blast / cyan beam / gold rays).

NO grimdark. NO horror (unless Madoka-Magica register, where it's tonally controlled). NO cyberpunk neon palette. NO Western-cartoon. NO photoreal.

━━━ ANIME ILLUSTRATION MEDIUM (LOCKED) ━━━
Hand-drawn anime — Studio Ghibli / Toei (Sailor Moon) / Madhouse (Cardcaptor Sakura) / Shaft (Madoka Magica) tradition. Cel-shaded clean linework, painterly sparkle-stack, vibrant saturated pastel palette.

━━━ ABSOLUTE BANS ━━━
• NO cheesecake (minimal coverage / form-fitting / sultry / etc.) — magical-girl outfits are FRILLY-CUTE, not sexualized
• NO STATIC POSED THUMBNAIL — she's mid-transformation, mid-cast, mid-spin, mid-leap
• NO eyes-locked-blankly — eye direction follows the rolled camera_framing + action
• NO combat-with-blood — magical attacks are CLEAN sparkly-energy

━━━ SOLO CHARACTER ONLY ━━━
ONE magical-girl. Familiar/wand may be at her side but is a small surprise-element, not co-character.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
The magical-girl is the MAIN SUBJECT at 35-50% of frame. Sparkle/transformation/setting wrap around her. NOT a tiny silhouette. NOT back-of-character. Face / outfit / wand all CLEARLY READABLE.

━━━ HER ARCHETYPE (magical-girl role) ━━━
${archetype}

━━━ HER COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${ethnicity.split(/[,:]/)[0]} magical-girl woman with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, wielding ${accessory}.

━━━ THE ACTION (mid-transformation OR mid-power-moment, FORWARD-FACING) ━━━
${action}

Body ENGAGED at loaded magical instant. Eye direction = camera_framing-decided. Sparkle/ribbon trails caught in motion. NEVER staring at horizon away from camera.

━━━ THE SETTING (magical or earthly-with-magic stage) ━━━
${setting}

Magical realm OR earthly setting illuminated BY her magic. Depth on depth — FOREGROUND tactile detail (cobblestone / cloud-tendril / spell-circle glyph) → MIDGROUND her engaged action with sparkle-stack → DEEP DISTANCE atmospheric layers.

${dramaSection}━━━ SURPRISE ELEMENT (magical secondary subject) ━━━
${surprise_element}

Midground or background — talking-cat-familiar / floating sparkle-orbs / pastel-bird / mascot-spirit. NEVER competes with hero magical-girl.

━━━ CAMERA FRAMING ━━━
${camera_framing}

${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} magical-girl WOMAN [doing exact action] in [setting]"], [her outfit with frilly magical detail], [DNA: skin + eyes + hair], [wand/accessory wielded], [magical setting wrapping with sparkle-stack], [drama if fired], [camera_framing exactly], [pastel palette + sparkle effects + mood].

CRITICAL: "[ethnicity] magical-girl WOMAN [DOING ACTION]" leads. She fills 35-50% of frame, ENGAGED in magical peak. SPARKLE STACK 6+ visible. Forward-facing per camera_framing — OVERRIDE Flux's back-of-anime-girl centroid HARD.

Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO headers, NO ━━━ markers.`;
  },

  // ━━━ MANGABOT_ANIME_CHARACTER_MALE ━━━
  //
  // Clone-with-divergence from MANGABOT_ANIME_CHARACTER_FEMALE. Male-coded
  // gender lock + anti-shirtless + anti-pretty-boy mandates per DragonBot
  // male-adventurer lessons (cheesecake failure mode is DIFFERENT for males
  // — Flux's "anime man" centroid is shirtless / oiled-pecs / loincloth,
  // not low-cut-dress; mitigate via explicit chest-covering + rugged-jawline
  // language). Same axis structure as female; reuses female setting +
  // camera_framing + surprise_element + drama pools (gender-neutral).
  MANGABOT_ANIME_CHARACTER_MALE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      ethnicity,
      archetype,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      setting,
      action,
      camera_framing,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ANIME ATMOSPHERIC DRAMA — render visibly in the scene ━━━
${drama}

A magical / atmospheric event in the world around him — visible secondary focal point, NOT eclipsing him.

`
      : '';

    return `You are an anime concept-art painter writing a CHARACTER-LED keyframe for MangaBot — a single anime MAN as the HERO of the frame in a rich anime setting. Studio Ghibli / Makoto Shinkai / Kyoto Animation / Demon Slayer / Studio Madhouse tradition. He is ALIVE, ENGAGED, mid-action — the eye lands on him first.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a MAN. The word "man" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "boy", "guy", "hero", "warrior", "samurai", "swordsman", "mage" or any other gender-ambiguous noun for "man" in the opening. Opening MUST read: "a [ethnicity] MAN [doing action] in [setting]..." — "man" comes BEFORE any archetype noun. Use he/him/his throughout.

━━━ ETHNICITY LOCK ━━━
${ethnicity}

Per the painted-medium ethnicity-noun lesson: the ethnicity-NOUN ("a Japanese man" / "a Filipino man" / "a Nigerian man") in the opening is what gets Flux to render diverse anime men. Pure visual skin descriptors get steamrolled by the Ghibli/Shinkai pale-anime-default. Lead with the noun.

━━━ ANIME ILLUSTRATION MEDIUM (LOCKED) ━━━
Hand-drawn anime illustration. Studio Ghibli / Makoto Shinkai / Kyoto Animation / Demon Slayer / Akira / Madhouse tradition. Cel-shaded clean linework with painterly atmospheric backgrounds. Vibrant saturated palette. NEVER photoreal. NEVER 3D-render. NEVER Disney-Pixar.

━━━ ABSOLUTE BANS — MALE-SPECIFIC NSFW-CLEAN + COMBAT-CLEAN ━━━
• NO shirtless / NO bare-chested / NO oiled-pecs / NO loincloth / NO sleeveless-with-bare-arms-and-implied-bare-torso
• NO leather shorts / NO single-piece-only outfits / NO "open vest revealing chest" / NO "strategically torn" / NO "tunic torn from action"
• NO "rugged hero pose" alone (pose itself fine, but never with "gleaming like polished stone" / "sweat-gleaming" / "oiled" / "sculpted" / "chiseled" / "muscular neck" — these in the skin pool trigger bare-chest rendering even with covered outfits)
• Outfit MUST explicitly name a chest-covering item (tunic / cuirass / breastplate / gambeson / scale-armor / robe / coat / surcoat / mail hauberk / brigandine / chest-plate / jacket / haori / kimono / hakama-top / school blazer / uniform top)
• Skin pool stays FACE-FOCUSED — cheekbones / forehead / jaw / temples / brow. NEVER torso / chest / shoulders / arms / muscular-body
• NO pirate-trope action (swinging from rigging / boarding-skyship-with-cutlass — Flux trains "dynamic male action" as shirtless pirate)
• NO combat with visible enemies and blood / wounded character
• NO pretty-boy register (avoid bishounen-only) — mix rugged jawlines / weathered character / dignified-handsome alongside softer registers; male variety MUST include lined faces, scars, beards (where culturally appropriate), age-marked features

━━━ SOLO CHARACTER ONLY ━━━
ONE man. No companions, no crowds. He is ALONE in his moment.

━━━ HE IS THE SHOW — NON-NEGOTIABLE ━━━
The anime man is the MAIN SUBJECT. His face, outfit, ethnicity, action, pose are the DRAW. Occupies 35-50% of frame. NOT a tiny silhouette in distant landscape. NOT a back-of-character looking out. MEDIUM-to-LARGE scale where outfit / accessory / face all CLEARLY READABLE.

━━━ HIS ARCHETYPE ━━━
${archetype}

━━━ HIS COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${ethnicity.split(/[,:]/)[0]} man with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All eight DNA elements should be discernible. Face fully visible — anime keyframes show the character's face.

━━━ THE ACTION — FORWARD-FACING ENGAGED ━━━
${action}

He is ENGAGED in the action, body torqued + caught at a loaded instant. Eye direction follows the rolled camera_framing — toward viewer for forward framings, toward action target for combat / cast framings, sideways for profile framings. Body language drives composition.

━━━ THE SETTING (the immediate anime stage where he's engaged) ━━━
${setting}

The anime world wraps AROUND him, not a distant vista he's looking out at. Depth on depth — FOREGROUND tactile detail → MIDGROUND setting body + his engaged action → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop.

${dramaSection}━━━ SURPRISE ELEMENT — anime secondary subject adding story ━━━
${surprise_element}

Place at midground or background — small anime detail implying the wider world. NEVER foreground or competing with him for attention.

━━━ CAMERA FRAMING ━━━
${camera_framing}

${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Rolled camera_framing axis DECIDES the shot. He fills 35-50% of frame; setting wraps at 50-65%. FOREGROUND: tactile detail near his action. MIDGROUND: HIM mid-action. BACKGROUND: setting + surprise + drama hints.

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} MAN [doing exact action] in [setting]"], [he wears [outfit] with chest-covering item visible], [skin + eyes + hair locked], [signature accessory], [anime setting wrapping with depth], [surprise + drama if fired], [camera_framing exactly], [lighting + atmosphere], [color + mood]

CRITICAL: "[ethnicity] MAN [DOING ACTION]" leads. He fills 35-50% of frame, ENGAGED. Camera_framing dictates orientation — OVERRIDE Flux's back-of-anime-man centroid HARD. Outfit MUST visibly cover his chest. Face register MUST mix beyond pretty-boy bishounen — include rugged / weathered / aged options.

Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  // ━━━ MANGABOT_ANIME_CHARACTER_FEMALE ━━━
  //
  // Mirror of DragonBot's FEMALE_ADVENTURER canonical character template,
  // anime-canon-coded throughout + the Phase 2.0 anti-back-to-camera
  // architecture baked in. Character at 35-50% of frame (bigger than the
  // scene-paths' 25-30% — the character IS the show here).
  MANGABOT_ANIME_CHARACTER_FEMALE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      ethnicity,
      archetype,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      setting,
      action,
      camera_framing,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ANIME ATMOSPHERIC DRAMA — render this visibly in the scene ━━━
${drama}

A magical / atmospheric event happening in the world around her — render as a visible secondary focal point (NOT eclipsing her). Adds anime wonder / story to the frame. NEVER combat enemies attacking her.

`
      : '';

    return `You are an anime concept-art painter writing a CHARACTER-LED keyframe for MangaBot — a single anime WOMAN as the HERO of the frame in a rich anime setting. Studio Ghibli / Makoto Shinkai / Kyoto Animation / Demon Slayer / Studio Madhouse tradition. She is ALIVE, ENGAGED, mid-action — the eye lands on her first.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN. The word "woman" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "girl", "heroine", "magical-girl", "shrine maiden", "samurai", "schoolgirl", "mage" or any other gender-ambiguous-or-diminutive noun for "woman" in the opening. Opening MUST read: "a [ethnicity] WOMAN [doing action] in [setting]..." — "woman" comes BEFORE any archetype noun. Use she/her/hers throughout. The archetype slot describes her ROLE, append it AFTER "woman" appears.

━━━ ETHNICITY LOCK (the ethnicity-noun is load-bearing for diverse rendering) ━━━
${ethnicity}

Per the painted-medium memory: ethnicity-NOUN ("a Japanese woman" / "a Filipina woman" / "a mixed Brazilian-Japanese woman") in the OPENING is what gets Flux to render diverse anime characters. Pure visual skin descriptors get steamrolled by the Ghibli/Shinkai anime-painted-pale-girl centroid. Lead with the ethnicity noun.

━━━ ANIME ILLUSTRATION MEDIUM (LOCKED) ━━━
Render as HAND-DRAWN ANIME ILLUSTRATION. Studio Ghibli / Makoto Shinkai / Kyoto Animation / Demon Slayer (ufotable) / Akira (Otomo) / Mononoke (Studio Ghibli) tradition. Cel-shaded clean linework with painterly atmospheric backgrounds. Vibrant saturated palette. Visible brushwork in skies and atmosphere; crisp ink linework on subjects. NEVER photoreal. NEVER 3D-render. NEVER Disney-Pixar CGI. NEVER Western cartoon.

━━━ ABSOLUTE BANS — NSFW-CLEAN, COMBAT-CLEAN ━━━
• NO combat with visible enemies, NO mid-strike-against-foe with blood, NO wounded character, NO fallen body
• Weapons may be drawn / mid-cast / mid-swing — but in stance / training / display / training-spar, NOT in active blood-combat
• NO cheesecake: NO "minimal coverage" / "bare midriff" / "exposed cleavage" / "form-fitting" / "skin-tight" / "harness across torso" / "sultry" / "sensual" / "alluring" / "seductive"
• Her outfit reads FUNCTIONAL + COVERED — sleek anime gear, never sexualized
• NO posing for the camera as a runway thumbnail — she is INSIDE the action

━━━ SOLO CHARACTER ONLY (this path) ━━━
ONE character. No companions, no crowds, no enemies. She is ALONE in her moment. Surprise elements are tiny background details, not co-characters.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
The anime woman is the MAIN SUBJECT. Her face, outfit, ethnicity, action, and pose are the DRAW. She occupies 35-50% of the frame vertically — FULL BODY head-to-toe visible OR tight medium-shot waist-up depending on the rolled camera_framing. Head no larger than 15% of frame for full-body / 30% for medium-shot. NOT a tiny silhouette in distant landscape. NOT a back-of-character looking out at scenery. MEDIUM-to-LARGE scale where outfit / accessory / face all CLEARLY READABLE.

━━━ HER ARCHETYPE (anime role — informs how she carries herself) ━━━
${archetype}

━━━ HER COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${ethnicity.split(/[,:]/)[0]} woman with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All eight DNA elements (ethnicity / archetype / skin / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Face fully visible — anime keyframes show the character's face.

━━━ THE ACTION — what she is doing RIGHT NOW (FORWARD-FACING ENGAGED) ━━━
${action}

She is ENGAGED in the action, body torqued + caught at a loaded instant. Eye direction follows the rolled camera_framing — toward the viewer for forward-facing framings, toward the action target for combat / cast framings, sideways for profile framings. NEVER staring blankly off-frame at distant scenery. Body language drives the composition.

━━━ THE SETTING (the immediate anime stage where she's engaged) ━━━
${setting}

This is the anime world wrapping AROUND her, not a distant vista she's looking out at. Depth on depth — FOREGROUND tactile detail (shrine paper / vending machine / mecha cockpit / desk / cherry petal cluster / spell-circle on ground) → MIDGROUND setting body + her engaged action → DEEP DISTANCE atmospheric layers stacked (cityscape thinning / mountain ridge / sky color shift). Never flat backdrop.

${dramaSection}━━━ SURPRISE ELEMENT — anime secondary subject adding story ━━━
${surprise_element}

Place at midground or background — a small anime detail implying the wider world (drifting talisman / floating petal cluster / paper lantern reflection / yokai familiar peeking / status-window flicker). NEVER foreground or competing with her for attention.

━━━ CAMERA FRAMING ━━━
${camera_framing}

${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
The rolled camera_framing axis DECIDES the shot. Three-quarter forward, low-angle hero, profile dynamic action, tight medium-shot — whatever was rolled. She fills 35-50% of frame; setting wraps around her at 50-65%; surprise element + atmospheric drama at deep midground or background. FOREGROUND: tactile detail near her action (shrine paper / mecha cable / vending-machine glow / desk surface / spell-circle stones). MIDGROUND: HER, engaged in mid-action. BACKGROUND: setting receding into atmospheric haze with surprise-element + drama hints.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} WOMAN [doing exact action] in [setting]" — ethnicity-noun + "woman" lead], [she wears [outfit] with full material detail], [her skin + eyes + hair locked from DNA slots], [signature accessory visible], [the anime setting wrapping around her with depth + atmospheric layers], [surprise-element + drama if fired], [camera_framing exactly as rolled], [lighting + atmosphere particles], [color palette + mood]

CRITICAL — the OPENING tokens are "[ethnicity] WOMAN [DOING ACTION]" — ethnicity-noun + woman come BEFORE archetype. She fills 35-50% of frame, ENGAGED, at the loaded mid-action instant. The camera_framing axis MUST dictate her orientation — Flux's "anime + character + scenery" default is back-of-character looking out; OVERRIDE THAT HARD.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Ethnicity comes FIRST visually. Every other slot is locked.

Output ONLY the raw 90-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  // ━━━ WAVE 2 — character-led genre templates (2026-05-29) ━━━

  // ━━━ MANGABOT_OCCULT_TOKYO ━━━
  MANGABOT_OCCULT_TOKYO: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, ethnicity, archetype, skin, eyes, hair_color, hairstyle, outfit, accessory, setting, action, camera_framing, surprise_element, drama } = slots;
    const dramaSection = drama ? `\n━━━ OCCULT DRAMA — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing an OCCULT-TOKYO keyframe for MangaBot — a solo character engaging with supernatural energy in modern urban Japan. Tokyo Ghoul / Jujutsu Kaisen / Mob Psycho / Bleach register.

━━━ ETHNICITY LOCK ━━━
${ethnicity}
Lead with ethnicity-NOUN.

━━━ AESTHETIC LOCK ━━━
URBAN-NIGHT + SUPERNATURAL palette — neon-pink / cyan / deep purple / blood-amber / sigil-glow. Ofuda, paper charms, glowing kanji, cursed-energy aura. Wet-pavement reflections. Tokyo alleys, shrines, subway tunnels, rooftop overlooks.

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, Bones / Mappa / Studio Pierrot tradition. Cel-shaded clean linework, dramatic painterly atmospheric backgrounds with high-contrast cursed-aura glow.

━━━ BANS ━━━
• NO cheesecake / NO suggestive / NO low-cut
• NO STATIC POSED THUMBNAIL — engaged with occult moment
• NO back-to-camera / NO photoreal / NO western-occult (pentagrams / robes — this is JAPANESE occult)

━━━ SOLO CHARACTER ━━━
ONE character interacting with supernatural energy. Spirits / shikigami / curses / wards may swirl around.

━━━ FRAMING ━━━
Character at 35-50% of frame. Cursed-aura wraps around. Face clearly readable.

━━━ ARCHETYPE ━━━ ${archetype}

━━━ COMPACT BIO ━━━
A ${ethnicity.split(/[,:]/)[0]} character with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, with ${accessory}.

━━━ ACTION (occult mid-engagement, FORWARD-FACING) ━━━
${action}

━━━ SETTING (urban Tokyo + supernatural) ━━━
${setting}
Depth: FOREGROUND ofuda/sigil/cursed-prop → MIDGROUND character engaged → DEEP DISTANCE Tokyo neon-haze with spirit-glow.

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}
${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR PALETTE ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} character [occult action] in [Tokyo setting]"], [modern urban outfit], [DNA], [occult prop], [setting with supernatural energy], [drama if fired], [camera_framing exactly], [neon-occult palette + mood].

CRITICAL: urban-Japan + supernatural-engagement. Forward-facing per camera_framing. Japanese occult vocabulary (ofuda / shimenawa / shikigami / kuji / domain) NOT western.

Output ONLY raw 90-120 word scene description. NO preamble.`;
  },

  // ━━━ MANGABOT_POST_APOCALYPTIC ━━━
  MANGABOT_POST_APOCALYPTIC: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, ethnicity, archetype, skin, eyes, hair_color, hairstyle, outfit, accessory, setting, action, camera_framing, surprise_element, drama } = slots;
    const dramaSection = drama ? `\n━━━ POST-APOCALYPTIC DRAMA — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing a POST-APOCALYPTIC keyframe for MangaBot — a solo wanderer engaged with the ruined world. Trigun / Made-in-Abyss / Girls-Last-Tour / Yokohama-Kaidashi register. Quiet decay + nature reclaiming.

━━━ ETHNICITY LOCK ━━━
${ethnicity}
Lead with ethnicity-NOUN.

━━━ AESTHETIC LOCK ━━━
RUST + MOSS + DUSK palette — rust-orange / sage-moss / faded-teal / amber / dust-grey. Overgrown civilization, vines through girders, shattered glass catching light. Quiet melancholy not bleak grimdark.

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, Ghibli-late-period / Wit-Studio / Madhouse tradition. Cel-shaded clean linework, painterly atmospheric backgrounds with hazy-distance.

━━━ BANS ━━━
• NO cheesecake / NO grimdark-horror / NO bleak-zombie
• NO STATIC POSED THUMBNAIL — engaged with scavenge / shelter / navigate moment
• NO back-to-camera silhouette-on-horizon (the FAILURE-MODE for this genre)

━━━ SOLO CHARACTER ━━━
ONE lone wanderer in ruined world. Pet/companion-bot may be implied at midground.

━━━ FRAMING ━━━
Character at 35-50% of frame. Ruined-structure wraps around. Face clearly readable.

━━━ ARCHETYPE ━━━ ${archetype}

━━━ COMPACT BIO ━━━
A ${ethnicity.split(/[,:]/)[0]} character with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, with ${accessory}.

━━━ ACTION (post-apoc engaged moment, FORWARD-FACING) ━━━
${action}

━━━ SETTING (overgrown ruined world) ━━━
${setting}
Depth: FOREGROUND debris / artifact → MIDGROUND character engaged → DEEP DISTANCE ruin-vista hazed with dust-light.

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}
${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR PALETTE ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} wanderer [post-apoc action] in [ruin setting]"], [scavenged outfit], [DNA], [survival accessory], [ruined setting with nature reclaiming], [drama if fired], [camera_framing exactly], [rust-moss-dusk palette + mood].

CRITICAL: ENGAGED in ruin, NOT silhouette on horizon. Forward-facing per camera_framing. Quiet decay, not grimdark.

Output ONLY raw 90-120 word scene description. NO preamble.`;
  },

  // ━━━ MANGABOT_BEACH_EPISODE ━━━
  MANGABOT_BEACH_EPISODE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, ethnicity, archetype, skin, eyes, hair_color, hairstyle, outfit, accessory, setting, action, camera_framing, surprise_element, drama } = slots;
    const dramaSection = drama ? `\n━━━ BEACH DRAMA — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing a BEACH-EPISODE keyframe for MangaBot — anime summer-arc vacation paradise. K-On / Free / Lucky-Star / Nichijou beach-arc register. Bright joy, warm sand, ocean shimmer.

━━━ ETHNICITY LOCK ━━━
${ethnicity}
Lead with ethnicity-NOUN.

━━━ AESTHETIC LOCK ━━━
SUMMER-PARADISE palette — sky-cyan / sun-yellow / sand-cream / ocean-teal / coral-pink. Sparkling water, palm fronds, shaved-ice colors. Bright joyful warmth.

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, KyoAni / P.A. Works summer-arc tradition. Cel-shaded clean linework, painterly bright-blue ocean backgrounds, vivid warm saturation.

━━━ BANS ━━━
• NO cheesecake / NO bikini-thong / NO oiled-skin closeup / NO suggestive pose
• Swimwear must be MODEST (rashguard / one-piece / surf-shorts + tee / sundress over swim) — never gratuitous
• NO STATIC POSED THUMBNAIL — engaged in beach activity
• NO back-to-camera / NO photoreal

━━━ SOLO CHARACTER ━━━
ONE character mid-beach activity. Beach-friends/family may be implied at midground (umbrella, picnic, distant swimmers).

━━━ FRAMING ━━━
Character at 35-50% of frame. Beach + ocean wrap around. Face clearly readable forward or 3/4.

━━━ ARCHETYPE ━━━ ${archetype}

━━━ COMPACT BIO ━━━
A ${ethnicity.split(/[,:]/)[0]} character with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, with ${accessory}.

━━━ ACTION (beach mid-activity, FORWARD-FACING) ━━━
${action}

━━━ SETTING (tropical/Japanese seaside) ━━━
${setting}
Depth: FOREGROUND beach-prop (shell / boogie-board / shaved-ice) → MIDGROUND character engaged → DEEP DISTANCE ocean-horizon with sparkling water.

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}
${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR PALETTE ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} character [beach action] at [beach setting]"], [modest beachwear], [DNA], [beach-prop accessory], [seaside with ocean horizon], [drama if fired], [camera_framing exactly], [summer palette + mood].

CRITICAL: bright joyful summer + modest swimwear + engaged activity. Forward-facing per camera_framing. Anti-cheesecake explicit.

Output ONLY raw 90-120 word scene description. NO preamble.`;
  },

  // ━━━ MANGABOT_FESTIVAL_NIGHTS ━━━
  MANGABOT_FESTIVAL_NIGHTS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, ethnicity, archetype, skin, eyes, hair_color, hairstyle, outfit, accessory, setting, action, camera_framing, surprise_element, drama } = slots;
    const dramaSection = drama ? `\n━━━ FIREWORK / LANTERN DRAMA — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing a FESTIVAL-NIGHTS keyframe for MangaBot — solo character at a Japanese summer matsuri. Yukata / lanterns / fireworks / food-stalls. Shinkai / KyoAni / Mamoru-Hosoda festival-scene register.

━━━ ETHNICITY LOCK ━━━
${ethnicity}
Lead with ethnicity-NOUN.

━━━ AESTHETIC LOCK ━━━
MATSURI-NIGHT palette — lantern-orange / sky-violet / firework-pink / cyan / ember-gold. Paper lanterns strung overhead, stall-light pooling on cobblestone, smoke from yakisoba grill.

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, Shinkai / KyoAni / Mamoru-Hosoda tradition. Cel-shaded clean linework, painterly nighttime backgrounds with lantern-bloom glow.

━━━ BANS ━━━
• NO cheesecake / NO yukata-slip / NO suggestive
• NO STATIC POSED THUMBNAIL — engaged with festival
• NO back-to-camera silhouette-watching-fireworks (it's the EXACT failure mode the audit named)
• NO photoreal

━━━ SOLO CHARACTER ━━━
ONE character engaged at matsuri. Festival-crowd may be implied at midground (paper lanterns, blurred figures, stall-light).

━━━ FRAMING ━━━
Character at 35-50% of frame. Stalls / lanterns wrap around. Face clearly readable.

━━━ ARCHETYPE ━━━ ${archetype}

━━━ COMPACT BIO ━━━
A ${ethnicity.split(/[,:]/)[0]} character with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, with ${accessory}.

━━━ ACTION (matsuri mid-engagement, FORWARD-FACING) ━━━
${action}

━━━ SETTING (matsuri / hanabi / yatai) ━━━
${setting}
Depth: FOREGROUND food / festival-prop → MIDGROUND character engaged → DEEP DISTANCE lantern-strings + firework-bloom or stall-glow.

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}
${require('./shared-blocks').CAMERA_FRAMING_MANDATORY_BLOCK}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR PALETTE ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "a ${ethnicity.split(/[,:]/)[0]} character [festival action] at [matsuri setting]"], [yukata or jinbei outfit], [DNA], [festival prop / food at hand], [matsuri with lanterns and stalls], [drama if fired], [camera_framing exactly], [lantern palette + mood].

CRITICAL: yukata + engaged with festival + lantern-glow. Forward-facing per camera_framing. NEVER back-of-character watching fireworks.

Output ONLY raw 90-120 word scene description. NO preamble.`;
  },

  // ━━━ MANGABOT_GHIBLI_PAINTERLY — SCENE-LED architecture-as-hero (2026-05-30) ━━━
  // R1 retune 2026-05-30: locked to SDXL via bot.modelByPath. Dropped the
  // maximalist "lush+cascade+multi-tier MANDATORY" stack (was overcrowding the
  // hand-painted feel). Explicit RANGE mandate — span muted-storybook AND
  // saturated-vibrant per Kevin's 37-heart spread. Loose brushwork over tight
  // illustration.
  MANGABOT_GHIBLI_PAINTERLY: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, monumental_anchor, setting_type, scale_provers, tiny_figure_optional, lush_foreground, atmospheric_light, color_palette, cascade_motion, weather_air, camera_framing, surprise_element, drama } = slots;
    const figureSection = (tiny_figure_optional && !/^no figure|^none|^absent|^architecture only/i.test(tiny_figure_optional))
      ? `\n━━━ TINY FIGURE (scale prover, 5-10% of frame) ━━━\n${tiny_figure_optional}\n`
      : `\n━━━ NO FIGURE ━━━\nArchitecture alone fills the frame. No human or creature.\n`;
    const dramaSection = drama ? `\n━━━ EVENT / DRAMA — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing a GHIBLI-PAINTERLY keyframe for MangaBot — SCENE-LED, monumental architecture as the HERO. Studio Ghibli / Mononoke / Castle-in-the-Sky / Spirited-Away / Howl's Moving Castle register. LOOSE HAND-PAINTED BRUSHWORK — Miyazaki storybook feel, NOT tight digital illustration.

━━━ AESTHETIC LOCK ━━━
LOOSE HAND-PAINTED GHIBLI — Miyazaki storybook brushwork, painterly atmospheric backgrounds, visible brush-stroke texture, watercolor-cel hybrid feel. NOT tight digital concept-art. NOT hyper-detailed CGI illustration. Soft architectural edges, painterly atmospheric depth.

━━━ RANGE — span both registers across batch ━━━
This path produces TWO equally valid aesthetic registers. Per render, lean into ONE of:
1. MUTED STORYBOOK — sage / copper / cream / soft pastel, hand-painted Whisper-of-the-Heart / Mononoke softness, dreamy hand-touched quality
2. SATURATED VIBRANT — emerald + amber / sky-cyan + copper / pink-magenta-emerald-burst, Castle-in-the-Sky / Demon-Slayer / Spirited-Away-exterior dramatic saturation
The rolled color_palette axis below tells you which register to lean into. Honor it.

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, Ghibli / Shinkai / Mononoke painterly tradition. Cel-shaded soft architectural linework, painterly atmospheric backgrounds with brush-stroke texture, Ghibli storybook quality. NOT photoreal. NOT CGI. NOT hyper-detailed concept-art.

━━━ BANS ━━━
• NO hero-character portrait — architecture is HERO, figure is tiny scale-prover or absent
• NO Mt-Fuji-postcard with tiny anchor — anchor fills 50-70% of frame
• NO photoreal / NO western-CGI / NO Pixar 3D-render
• NO modern western architecture — Ghibli-coded sky-island / shrine / cathedral / pagoda / mossy-ruin register only
• NO overcrowded maximalist concept-art — let the architecture breathe
• NO tight digital illustration — embrace LOOSE HAND-PAINTED brushwork

━━━ ARCHITECTURE IS HERO ━━━
The monumental anchor fills 50-70% of the frame. Scale-provers (stairs / bridges / archways) prove the scale. Optional tiny figure (5-10%) makes scale visceral. Depth flows naturally from foreground through architectural mass to atmospheric distance — NOT forced multi-tier maximalism.

━━━ FRAMING MANDATE ━━━
LOW-ANGLE HERO looking UP at architecture, OR vanishing-point ascent through arch, OR cathedral reveal through foliage, OR over-foreground reveal. NEVER tiny-architecture-in-distance. NEVER hero-character close-up.

━━━ MONUMENTAL ANCHOR (the dominant architecture) ━━━
${monumental_anchor}

━━━ SETTING TYPE (the broader environment) ━━━
${setting_type}

━━━ SCALE PROVERS (stairs / bridges / archways making the architecture LOOK massive) ━━━
${scale_provers}

${figureSection}━━━ FOREGROUND TREATMENT ━━━
${lush_foreground}
(NOTE: foreground can be sparse-and-clean OR lush-and-layered — let the rolled entry dictate. Some Ghibli frames are MINIMAL foreground; some are wall-to-wall foliage. Both valid.)

━━━ ATMOSPHERIC LIGHT (the light signature) ━━━
${atmospheric_light}

━━━ COLOR PALETTE — DETERMINES THE BATCH REGISTER ━━━
${color_palette}
(If this entry names MUTED / SAGE / COPPER / PASTEL — lean soft storybook.
If this entry names SATURATED / VIBRANT / SCARLET / EMERALD-BURST — lean bold vibrant.
Honor the rolled register.)

━━━ MOTION (drift element — optional) ━━━
${cascade_motion}
(NOTE: motion can be subtle or absent. Some Ghibli storybook frames are still + quiet. Don't force movement if the scene wants stillness.)

━━━ WEATHER + AIR (atmospheric depth) ━━━
${weather_air}

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR SECONDARY ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "[monumental_anchor] in [setting_type] with [scale_provers]"], [foreground per axis], [tiny figure for scale OR absent], [atmospheric light], [color palette — match its register], [optional motion if it fits], [weather + air], [drama if fired], [camera_framing], [hand-painted Ghibli mood].

CRITICAL: architecture is HERO 50-70%. LOOSE hand-painted brushwork over tight digital. MATCH the color_palette register (muted vs saturated). Let the scene BREATHE — not every frame is maximalist. NEVER hero-character. NEVER photoreal.

Output ONLY raw 80-120 word scene description. NO preamble.`;
  },

  // ━━━ WAVE 3 — genre templates (2026-05-29) ━━━

  // ━━━ MANGABOT_MYTHOLOGICAL_CREATURE — yokai is hero, human-witness for scale ━━━
  MANGABOT_MYTHOLOGICAL_CREATURE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, creature_type, creature_pose, creature_detail, shrine_or_setting, human_witness, aura_or_magic, foreground_element, camera_framing, surprise_element, drama } = slots;
    const dramaSection = drama ? `\n━━━ SUPERNATURAL DRAMA — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing a MYTHOLOGICAL-CREATURE keyframe for MangaBot — a YOKAI / Japanese mythological being as HERO. Mononoke / Spirited-Away / Kakuriyo / Mushishi / Hozuki-no-Reitetsu register. Kitsune / tengu / ryujin / yuki-onna / nekomata / oni / kappa.

━━━ AESTHETIC LOCK ━━━
Mystical-spirit palette. Painterly atmospheric aura. Shimenawa rope, ofuda, fox-fire, spirit-glow.

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, Ghibli / Studio-Bones / Madhouse yokai tradition. Cel-shaded crisp creature linework, painterly atmospheric backgrounds.

━━━ BANS ━━━
• NO western dragon / NO European fairy / NO Cthulhu
• NO STATIC PORTRAIT — creature is at LOADED instant
• NO hero-human-character — human is OPTIONAL tiny witness for scale only

━━━ YOKAI IS HERO ━━━
Creature fills 40-70% of frame. Optional human witness tiny (5-15%) for scale.

━━━ CREATURE TYPE (Japanese mythological lineage) ━━━
${creature_type}

━━━ CREATURE POSE (loaded instant) ━━━
${creature_pose}

━━━ CREATURE SURFACE DETAIL ━━━
${creature_detail}

━━━ SHRINE / SETTING ━━━
${shrine_or_setting}

━━━ HUMAN WITNESS (tiny for scale, optional) ━━━
${human_witness}

━━━ AURA / MAGIC SIGNATURE ━━━
${aura_or_magic}

━━━ FOREGROUND ELEMENT ━━━
${foreground_element}

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR PALETTE ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "[creature_type] [creature_pose] at [shrine/setting]"], [creature surface detail], [aura/magic], [human witness tiny for scale], [foreground], [drama if fired], [camera_framing exactly], [spirit palette + mood].

CRITICAL: yokai is HERO 40-70%, Japanese mythology vocabulary (NOT western), human is OPTIONAL tiny witness, aura/magic visible. Multi-tier depth.

Output ONLY raw 90-120 word scene description. NO preamble.`;
  },

  // ━━━ MANGABOT_SPACE_OPERA — starship / cosmic is hero ━━━
  MANGABOT_SPACE_OPERA: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, ship_class, cosmic_setting, scale_provers, engine_or_signal, foreground_artifact, stellar_phenomenon, lighting_signature, camera_framing, surprise_element, drama } = slots;
    const dramaSection = drama ? `\n━━━ COSMIC DRAMA — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing a SPACE-OPERA keyframe for MangaBot — STARSHIP or COSMIC station as hero. Cowboy-Bebop / Outlaw-Star / Macross / Galactic-Heroes / Yamato / GitS-SAC register.

━━━ AESTHETIC LOCK ━━━
Saturated space-opera palette — deep blue void / nebula magenta-teal / engine-glow orange / starlight blue-white. Realistic-anime industrial detailing on ships.

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, Sunrise / Production-IG / Studio-Bones space-opera tradition. Cel-shaded crisp ship linework, painterly nebula atmospherics, dramatic light contrast.

━━━ BANS ━━━
• NO Star-Wars-licensed / NO Star-Trek / NO western-CGI
• NO STATIC POSTCARD — must have engine-glow / signal / passing-ship / motion
• NO hero-human-portrait — pilot/crew tiny for scale only

━━━ SHIP IS HERO ━━━
Ship/station fills 40-70% of frame. Cosmic backdrop wraps. Optional crew tiny for scale.

━━━ SHIP CLASS ━━━
${ship_class}

━━━ COSMIC SETTING ━━━
${cosmic_setting}

━━━ SCALE PROVERS ━━━
${scale_provers}

━━━ ENGINE / SIGNAL ━━━
${engine_or_signal}

━━━ FOREGROUND ARTIFACT ━━━
${foreground_artifact}

━━━ STELLAR PHENOMENON ━━━
${stellar_phenomenon}

━━━ LIGHTING SIGNATURE ━━━
${lighting_signature}

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR PALETTE ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "[ship_class] [engine_or_signal] in [cosmic_setting]"], [scale provers], [foreground artifact], [stellar phenomenon], [lighting signature], [drama if fired], [camera_framing exactly], [space-opera palette + mood].

CRITICAL: ship is HERO 40-70%, cosmic backdrop saturated, scale-provers visible. Multi-tier depth (foreground debris/cable → ship mass → nebula/stars → deep void).

Output ONLY raw 90-120 word scene description. NO preamble.`;
  },

  // ━━━ MANGABOT_MECHA_HANGARS — SCENE-LED, mech is hero, second-attempt ━━━
  // Architecture explicitly built to defeat the two 2026-05-22 failure modes:
  //   1. T-pose-arms-out default → mech_posture pool seeded forward-loaded only
  //   2. Mt-Fuji-no-mech postcard → scale_provers + 50-80%-of-frame mandate
  MANGABOT_MECHA_HANGARS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, mech_class, mech_posture, hangar_setting, scale_provers, mech_detail, mech_weaponry_or_tool, steam_or_spark, light_signature, camera_framing, surprise_element, drama } = slots;
    const dramaSection = drama ? `\n━━━ HANGAR EVENT — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing a MECHA-HANGAR keyframe for MangaBot — a SCENE-LED giant-mecha frame where the MECH is the HERO. Gundam-RX78 / Eva / Patlabor / Macross / Code-Geass / Big-O / GitS register. Industrial-scale + dramatic light + dwarf-the-pilot proportions.

⚠️ TWO FAILURE-MODES THIS PATH FIGHTS:
1. STATIC T-POSE — Flux's default "anime mech standing arms-out at the camera" is BANNED. The mech_posture axis above is the LAW. Render the EXACT loaded posture (kneeling / mid-stride / squatting at maintenance / cockpit-opening / arm-extended-mid-action). NEVER arms-out-T-pose.
2. MT-FUJI-WITHOUT-MECH DRIFT — landscape eating the mech is BANNED. The mech FILLS 50-80% of the frame. The hangar/setting is BACKGROUND/CONTAINER for the mech, never the postcard hero.

━━━ AESTHETIC LOCK ━━━
Industrial-mechanical scale + dramatic chiaroscuro lighting + crew-scale-provers in frame. Sodium-vapor / arc-weld blue / overhead-spotlight / engine-glow. Heavy machinery feel.

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, Sunrise / Khara / Production-IG mecha-keyframe tradition. Cel-shaded hard linework on mechanical surfaces, painterly atmospheric depth on the hangar interior, saturated industrial palette.

━━━ BANS ━━━
• NO STATIC T-POSE — posture must be LOADED mid-action per the mech_posture axis
• NO Mt-Fuji-postcard / NO iconic-landscape-eating-mech — mech is 50-80% of frame
• NO tiny mech in distance / NO mech as backdrop
• NO photoreal / NO western CGI / NO Real-Steel
• NO close-up of pilot face — pilot is SCALE PROVER tiny in frame
• NO hero-character portrait — the MECH is the character

━━━ SCALE MANDATE ━━━
Scale provers (catwalks / crew / vehicles / scaffolding) MUST be visible at the mech's feet, shoulders, or hands. The mech is BIG and the human-scale elements PROVE it. NEVER a mech with no scale reference.

━━━ FRAMING MANDATE ━━━
LOW-ANGLE HERO looking UP at the mech, OR 3/4 view at hangar-floor level, OR over-crew-shoulder reveal, OR through-cockpit-canopy reveal, OR between-mech-legs perspective. NEVER a top-down or wide-establishing distant mech.

━━━ MECH CLASS ━━━
${mech_class}

━━━ MECH POSTURE (the LOADED instant — NEVER T-POSE) ━━━
${mech_posture}

━━━ HANGAR / SETTING (CONTAINER for the mech, not hero) ━━━
${hangar_setting}

━━━ SCALE PROVERS (visible at mech's feet / shoulders / hands) ━━━
${scale_provers}

━━━ MECH SURFACE DETAIL ━━━
${mech_detail}

━━━ WEAPONRY OR TOOL ━━━
${mech_weaponry_or_tool}

━━━ STEAM / SPARKS / VAPOR ━━━
${steam_or_spark}

━━━ LIGHT SIGNATURE ━━━
${light_signature}

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR PALETTE ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "[mech_class] [mech_posture] in [hangar_setting], [scale_provers visible]"], [mech surface detail], [weaponry/tool at hand or holstered], [steam/spark atmospheric], [light signature], [drama if fired], [camera_framing exactly], [industrial palette + mood].

CRITICAL: the mech is HERO, fills 50-80% of frame, NEVER T-pose, scale-provers MANDATORY in frame, hangar is CONTAINER not postcard. Multi-tier depth: foreground crew/catwalk → mech mass → hangar interior depth.

Output ONLY raw 100-130 word scene description. NO preamble.`;
  },

  // ━━━ MANGABOT_ANIME_VILLAGE — SCENE-LED (no character DNA) ━━━
  MANGABOT_ANIME_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, village_anchor, architecture, streetscape_detail, foreground_element, inhabitant, wildlife_or_object, weather_air, camera_framing, surprise_element, drama } = slots;
    const dramaSection = drama ? `\n━━━ VILLAGE DRAMA — render in scene ━━━\n${drama}\n\n` : '';
    return `You are an anime concept-art painter writing an ANIME-VILLAGE keyframe for MangaBot — a SCENE-LED village / streetscape / mountain-edge neighborhood as the HERO. Mushishi / Spice-and-Wolf / Mononoke pastoral OR Akihabara / Asakusa modern alleyways. Inhabitant figure for human scale, NOT a hero portrait.

━━━ AESTHETIC LOCK ━━━
PAINTERLY-ANIME VILLAGE palette — soft warm or cool earthy tones (wood / clay / moss / dawn-pink / dusk-amber). Architectural detail leads. Atmospheric depth haze.

━━━ ANIME MEDIUM ━━━
Hand-drawn anime, Ghibli / Kabaneri / Mushishi / Aria tradition. Cel-shaded crisp architecture, painterly atmospheric backgrounds, deep multi-tier depth.

━━━ BANS ━━━
• NO hero portrait / NO close-up face / NO cheesecake
• NO STATIC POSTCARD — pick a LOADED instant (vendor mid-pour / lantern lighter / cat mid-leap)
• NO photoreal / NO CGI

━━━ SCENE-LED COMPOSITION ━━━
Village / streetscape is HERO. Tiny inhabitant figure (5-15% of frame) provides scale — never close-up. Architecture and atmosphere drive the frame.

━━━ FRAMING ━━━
WIDE establishing shot or 3/4 architectural angle. Inhabitant small, not close-up.

━━━ VILLAGE ANCHOR ━━━
${village_anchor}

━━━ ARCHITECTURE ━━━
${architecture}

━━━ STREETSCAPE DETAIL (midground) ━━━
${streetscape_detail}

━━━ FOREGROUND ELEMENT ━━━
${foreground_element}

━━━ INHABITANT (scale figure, small) ━━━
${inhabitant}

━━━ WILDLIFE / OBJECT ━━━
${wildlife_or_object}

━━━ WEATHER + AIR ━━━
${weather_air}

${dramaSection}━━━ SURPRISE ELEMENT ━━━
${surprise_element}

━━━ CAMERA FRAMING ━━━
${camera_framing}

━━━ LIGHTING ━━━ ${lighting}
━━━ ATMOSPHERIC DETAIL ━━━ ${atmosphere}
━━━ COLOR PALETTE ━━━ ${sharedDNA.scenePalette}
━━━ SECONDARY LIGHTING ━━━ ${sharedDNA.colorPalette}
━━━ MOOD ━━━ ${vibeDirective.slice(0, 200)}

━━━ STRUCTURE ━━━
[OPENING: "[village_anchor] with [architecture] under [light_quality]"], [foreground detail with depth], [midground streetscape activity], [tiny inhabitant for scale], [wildlife/object], [weather + atmospheric haze], [drama if fired], [camera_framing exactly], [village palette + mood].

CRITICAL: VILLAGE is HERO. Inhabitant tiny for scale. Deep multi-tier depth (foreground → midground activity → architectural mass → atmospheric distance). NEVER a hero-portrait. NEVER a static postcard.

Output ONLY raw 90-120 word scene description. NO preamble.`;
  },
};
