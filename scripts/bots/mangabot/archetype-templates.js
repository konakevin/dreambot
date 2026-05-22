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

The character below is CAUGHT mid-rural-task — hanging laundry, picking flowers, drinking tea, sketching, cycling, walking through grass. Never posing. Never eye-contact with viewer. The eye finds them inside their pastoral moment.

━━━ ⚠ HARD RULE #10: COMPOSITION VARIETY ━━━

The scene_type and camera_framing axes specify TODAY'S composition. Honor them — do NOT default to "wandering girl on hilltop with windswept tree." That's ONE composition out of many. Mix doorstep-cottage / through-grass / over-shoulder / inside-a-room / bridge-crossing / well-tending / boat-on-stream.

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

━━━ ⚠ STORY PROP — MUST APPEAR VISIBLY (HARD RULE #6) ━━━
${story_prop}

━━━ ⚠ BACKGROUND DETAIL — MUST APPEAR IN DEEP DISTANCE (HARD RULE #7) ━━━
${background_detail}
${spirit_element ? `

━━━ ⚠ SPIRIT ELEMENT — render subtly (Ghibli magical-realism) ━━━
${spirit_element}` : ''}

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
- NO posed model character — caught mid-task
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
- NO posed model character — caught mid-action
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

━━━ ⚠ HARD RULE #5: CANDID ACTION ━━━

Character is CAUGHT mid-beat (mid-step / mid-draw / mid-prayer). Not posing. Not eye-contact with viewer.

━━━ THE SCENE TYPE (composition lead) ━━━
${scene_type}

━━━ LANDSCAPE SETTING (the world) ━━━
${landscape_setting}

━━━ ARCHITECTURAL ANCHOR (monumental scale-prover — MUST be visibly massive) ━━━
${architectural_anchor}

━━━ CHARACTER(S) IN FRAME (role-coded, NEVER named) ━━━
${character_role}

━━━ ACTION MOMENT (candid mid-beat — never posed) ━━━
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
};
