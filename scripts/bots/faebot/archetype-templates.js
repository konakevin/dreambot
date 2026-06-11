/**
 * faebot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

module.exports = {
  FAEBOT_FOREST_FAIRY_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      forest_biome,
      lighting,
      weather,
      foreground_anchor,
      botanical_accent,
      candid_action,
      magical_flavor,
      scale_prover,
      companion,
    } = slots;

    const companionSection = companion
      ? `\n\n━━━ COMPANION (a single small woodland presence sharing the moment with her) ━━━\n${companion}\n\nWoven naturally into the scene at her scale or smaller — NEVER a competing focal subject. The eye still lands on the creature first; the companion adds story-warmth and scale-prover.`
      : '';

    return `You are writing ONE Flux prompt for an enchanted-forest creature painting in FaeBot's painted-fantasy register (Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Frank Frazetta painted-fantasy lineage). Output ONLY the prompt — comma-separated phrases, 80-110 words, no preamble, no headers, no markers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt, BEFORE setting / lighting / anything else.

1. THE CREATURE IS THE SUBJECT. Not the landscape. The creature fills 40-55% of the frame and is the eye's first landing place. NEVER write a "wide landscape with tiny figure". NEVER write "small figure in distance".

2. The creature description below is THE creature — render her with EVERY stacked exotic feature listed (skin-treatment, plant-merged hair, plant-merged garment, anatomical extras like antlers/wings/glowing marks, the magical signature, the candid posture). 5+ stacked exotic features must visibly land in the painting.

3. NEVER posing for camera. NEVER looking at viewer. NEVER human-model beauty — she is mythic-creature beauty, otherworldly, at-home-in-her-wildness.

Open your prompt with the creature description. The creature opens; everything else is HER FRAME.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. THE CREATURE (the subject — render her exactly as described) ━━━
${creature}

Preserve every exotic feature unmistakably. She is otherworldly-beautiful — mythic-creature beauty, NOT human-model beauty. Confident at-home-in-her-wildness. NEVER posing, NEVER looking at the viewer.

━━━ 2. THE FOREST BIOME (her natural home — wraps around her) ━━━
${forest_biome}

This biome is HER FRAME, not the subject. Atmospheric depth: foreground tactile detail / midground holding her / background fading into painted mist or canopy.

━━━ 3. CANDID ACTION + COMPOSITION (the captured moment — frames her in the scene) ━━━
${candid_action}

This is the captured-on-camera moment. Caught-in-the-act candid, off-center via rule-of-thirds, the forest wrapping around her like a frame. NEVER a centered hero portrait, NEVER a pose-for-camera shot.

━━━ 4. LIGHTING (time-of-day + light drama) ━━━
${lighting}

━━━ 5. WEATHER (air condition + particle motion) ━━━
${weather}

━━━ 6. FOREGROUND ANCHOR (closest depth element — bringing 3-tier depth) ━━━
${foreground_anchor}

Tactile foreground detail bringing true depth between camera and creature. The painting reads in three tiers: this foreground close + her in midground + the deep wild forest fading behind.

━━━ 7. BOTANICAL ACCENT (signature bloom cluster near her) ━━━
${botanical_accent}

Specific bloom cluster painted with species-specific detail — painted-storybook chromatic pop. Not generic "wildflowers" — this exact named species cluster.

━━━ 8. MAGICAL FLAVOR (supernatural atmospheric accent) ━━━
${magical_flavor}

The magical signature visible in the scene. Painted as luminous detail, never crude particle-effect.

━━━ 9. SCALE PROVER (environmental element establishing her scale) ━━━
${scale_prover}

A specific environmental feature that establishes her scale and the soaring or intimate quality of the space — playbook component for poster-worthy depth.
${companionSection}

━━━ AMBIENT MOOD (vibe-driven secondary lighting cue) ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ STYLE REGISTER (painted-fantasy lineage) ━━━
Visible oil-brushwork, painted edges, romantic painted atmosphere. Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Frank Frazetta painted-fantasy concept-art lineage. NOT photoreal, NOT ink-outlined, NOT animation, NOT CGI, NOT digital-polished. Painted gallery-tier illustration.

━━━ HARD BANS ━━━
- NO landscape with tiny figure (the creature MUST fill 40-55% of frame)
- NO model-poses / NO posing-for-camera / NO eye-contact-with-viewer
- NO sexualized framing — focus is mythic-creature beauty
- NO bare chest, NO nipples, NO topless
- NO modern objects (phones, glasses, electronics)
- NO realistic non-magical humans
- NO violence / NO scared expressions / NO edgy moods
- NO photographic / digital / 3D / CGI descriptors at the technique level
- NO additional figures beyond the focal creature${companion ? ' + the small companion' : ''}
- NO smooth illustration / NO airbrushed / NO modern-anime / NO Pixar-3D

━━━ OUTPUT ━━━
Write 80-110 words, comma-separated phrases. LEAD WITH THE CREATURE — preserve her stacked exotic features unmistakably. Then composition framing. Then forest biome wrapping around her. Then lighting + weather. Then foreground anchor + botanical accent. Then magical flavor. Then scale prover.${companion ? ' Then companion woven in naturally.' : ''} Painted-fantasy oil-brushwork register throughout. NO preamble, NO headers, NO ━━━ markers, NO bullets, NO bold-labels.`;
  },

  FAEBOT_FLOWER_FAIRY: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      flower_biome,
      lighting,
      weather,
      foreground_anchor,
      botanical_accent,
      candid_action,
      magical_flavor,
      scale_prover,
      companion,
    } = slots;

    const companionSection = companion
      ? `\n\n━━━ COMPANION (a single small flower-garden presence sharing the moment with her) ━━━\n${companion}\n\nWoven naturally into the scene at her scale or smaller — NEVER a competing focal subject. The eye still lands on the fairy first; the companion adds story-warmth and scale-prover.`
      : '';

    return `You are writing ONE Flux prompt for an enchanted-flower-garden fairy painting in FaeBot's painted-fantasy register (Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Frank Frazetta painted-fantasy lineage). Output ONLY the prompt — comma-separated phrases, 80-110 words, no preamble, no headers, no markers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt, BEFORE setting / lighting / anything else.

1. THE FAIRY IS THE SUBJECT. Not the landscape. The fairy fills 40-55% of the frame and is the eye's first landing place. NEVER write a "wide landscape with tiny figure". NEVER write "small figure in distance".

2. The fairy description below is THE creature — render her with EVERY stacked exotic flower-merged feature listed (petal-skin, blossom-hair, petal-garment, petal-wings, pollen-glow signature, the candid posture). 5+ stacked exotic features must visibly land in the painting. SHE HAS WINGS — butterfly / gossamer / sakura-petal / luna-moth (one type per creature).

3. SCALE — she is SMALLER than human-scale. Flowers can be her HOME. A peony can be her bedroom, a tulip-bell her room, a sunflower-disk her balcony, a lotus-pad her raft. This sub-human scale must read in the composition.

4. NEVER posing for camera. NEVER looking at viewer. NEVER human-model beauty — she is mythic-creature beauty, otherworldly, at-home-in-her-flower-garden.

Open your prompt with the fairy description. The fairy opens; everything else is HER FRAME.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. THE FAIRY (the subject — render her exactly as described) ━━━
${creature}

Preserve every exotic flower-merged feature unmistakably. She HAS WINGS. She is otherworldly-beautiful — mythic-fairy beauty, NOT human-model beauty. Confident at-home-in-her-flower-garden. NEVER posing, NEVER looking at the viewer.

━━━ 2. THE FLOWER BIOME (her natural home — wraps around her) ━━━
${flower_biome}

This biome is HER FRAME, not the subject. Atmospheric depth: foreground tactile detail / midground holding her / background fading into painted bloom-mist.

━━━ 3. CANDID ACTION + COMPOSITION (the captured moment — frames her in the scene) ━━━
${candid_action}

This is the captured-on-camera moment. Caught-in-the-act candid, off-center via rule-of-thirds, the flower-garden wrapping around her like a frame. NEVER a centered hero portrait, NEVER a pose-for-camera shot.

━━━ 4. LIGHTING (time-of-day + light drama) ━━━
${lighting}

━━━ 5. WEATHER (air condition + drifting accents) ━━━
${weather}

━━━ 6. FOREGROUND ANCHOR (closest depth element — bringing 3-tier depth) ━━━
${foreground_anchor}

Tactile foreground detail bringing true depth between camera and fairy. The painting reads in three tiers: this foreground close + her in midground + the deep bloom-mist fading behind.

━━━ 7. BOTANICAL ACCENT (secondary signature bloom cluster near her) ━━━
${botanical_accent}

Specific secondary bloom cluster painted with species-specific detail — painted-storybook chromatic pop alongside the primary flower biome. Not generic "wildflowers" — this exact named species cluster.

━━━ 8. MAGICAL FLAVOR (pollen-glow / supernatural atmospheric accent) ━━━
${magical_flavor}

Pollen-glow is the dominant magical signature. Painted as luminous detail, never crude particle-effect. Drifting pollen-motes, fairy-dust spirals, glowing wing-trail.

━━━ 9. SCALE PROVER (giant-flower-as-home element establishing her sub-human scale) ━━━
${scale_prover}

A specific giant-flower-as-home or scale-contrast element that establishes she is smaller than human-scale. Critical for this path's identity — without it, she just looks like a human in flowers.
${companionSection}

━━━ AMBIENT MOOD (vibe-driven secondary lighting cue) ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ STYLE REGISTER (painted-fantasy lineage) ━━━
Visible oil-brushwork, painted edges, romantic painted atmosphere. Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Frank Frazetta painted-fantasy concept-art lineage. NOT photoreal, NOT ink-outlined, NOT animation, NOT CGI, NOT digital-polished. Painted gallery-tier illustration.

━━━ HARD BANS ━━━
- NO landscape with tiny figure (the fairy MUST fill 40-55% of frame)
- NO model-poses / NO posing-for-camera / NO eye-contact-with-viewer
- NO sexualized framing — focus is mythic-fairy beauty
- NO bare chest, NO nipples, NO topless
- NO modern objects (phones, glasses, electronics)
- NO realistic non-magical humans / NO human-scale fairy (she's smaller)
- NO violence / NO scared expressions / NO edgy moods
- NO photographic / digital / 3D / CGI descriptors at the technique level
- NO additional figures beyond the focal fairy${companion ? ' + the small companion' : ''}
- NO smooth illustration / NO airbrushed / NO modern-anime / NO Pixar-3D
- NO wings missing — she MUST have wings (butterfly / gossamer / petal)
- NO storm / lightning / dark-grey-blue (peaceful enchanted register only)

━━━ OUTPUT ━━━
Write 80-110 words, comma-separated phrases. LEAD WITH THE FAIRY — preserve her stacked exotic flower-merged features unmistakably (including wings). Then composition framing. Then flower biome wrapping around her. Then lighting + weather. Then foreground anchor + botanical accent. Then pollen-magical flavor. Then giant-flower scale prover.${companion ? ' Then companion woven in naturally.' : ''} Painted-fantasy oil-brushwork register throughout. NO preamble, NO headers, NO ━━━ markers, NO bullets, NO bold-labels.`;
  },

  FAEBOT_TINY_FAE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      scale_anchor_companion,
      macro_perch,
      forest_micro_biome,
      lighting,
      weather,
      fae_action,
      magical_flavor,
      foreground_anchor,
      botanical_accent,
    } = slots;

    const botanicalSection = botanical_accent
      ? `\n\n━━━ BOTANICAL ACCENT (secondary bloom species at her scale) ━━━\n${botanical_accent}\n\nA specific bloom cluster painted with species-specific detail — at her scale (a single foxglove-bell is HER doorway, a bluebell is HER bell).`
      : '';

    return `You are writing ONE Flux prompt for a TINY WINGED FAE painting in the FaeBot painterly enchanted-forest universe (Brian Froud + Charles Vess + Greg Manchess + Paul Bonner + painted-fantasy-novel-cover lineage). Output ONLY the prompt — comma-separated phrases, 80-110 words, no preamble, no headers, no markers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATES — these MUST be the FIRST visual elements described in your prompt.

1. THE FAE IS PALM-SIZED — 3 to 8 inches tall. NOT a regular-sized fairy. NOT a child-fairy. PALM-SIZED.

2. THE SCALE-ANCHOR COMPANION IS MANDATORY — every render INCLUDES a normal-sized forest creature IN THE SAME FRAME that DWARFS her. This is the SCALE-PROOF. Without it, Flux renders a regular-sized fairy by default. The scale-anchor creature MUST be visibly LARGER than the fae.

3. PAINTERLY-REAL rendering. NEVER chibi, NEVER anime, NEVER Disney, NEVER Tinkerbell, NEVER mascot. Brian Froud + Charles Vess + painted-fantasy-novel-cover lineage. Slender beautiful elegant proportions, painterly oil-brushwork register.

4. The fae fills 30-50% of the frame and the scale-anchor creature establishes her tininess unambiguously.

5. NEVER posing for camera. NEVER looking at viewer. NEVER human-model beauty.

Open your prompt with the fae description. The fae opens; everything else is HER WORLD-AT-HER-SCALE.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. THE FAE (the subject — render her exactly as described) ━━━
${creature}

Preserve every exotic feature unmistakably. She HAS WINGS. Painterly-real beauty at FAIRY-SCALE — 3 to 8 inches tall. NEVER posing, NEVER cartoon, NEVER mascot.

━━━ 2. SCALE-ANCHOR COMPANION (mandatory — proves her tininess) ━━━
${scale_anchor_companion}

This companion creature is THE SCALE PROOF — render it BIG IN THE FRAME and the fae SMALL. The fae must be PERCHED ON / DWARFED BY / UNDER THE LOOMING FACE of the companion — NEVER "beside it" or "holding it in her arms" or "at her shoulder". The companion's body / face / ear / paw / nose / wing must dominate a significant portion of the frame; the fae fits inside or perches on a single feature. Without dramatic dwarfing, the render reads as "regular-sized fairy" — Flux defaults that way. The size-contrast MUST be visually unmistakable.

━━━ 3. MACRO PERCH (what she's on / in / riding) ━━━
${macro_perch}

She is captured AT her scale on this perch. The perch is normal-sized for its kind but ENORMOUS relative to her.

━━━ 4. FAE ACTION + COMPOSITION (the captured moment at her scale) ━━━
${fae_action}

This is the captured-on-camera moment AT FAIRY-SCALE. Caught-in-the-act candid. NEVER posed-for-camera. The camera is at HER level looking at HER world.

━━━ 5. FOREST MICRO BIOME (her natural world at fairy-scale) ━━━
${forest_micro_biome}

A patch of the enchanted forest rendered FROM her perspective — giant ferns / towering moss-tuft / fallen-acorn-boulders / mushroom-grove / moss-canyon. The forest is rendered at HER scale.

━━━ 6. LIGHTING (time + light drama) ━━━
${lighting}

━━━ 7. WEATHER (air condition + drifting accents) ━━━
${weather}

━━━ 8. MAGICAL FLAVOR (supernatural accent at her scale) ━━━
${magical_flavor}

Magic at her scale: pollen-trail, fireflies-at-her-size, glowing-seed cupped in her palm, sparkle-wing-trail.

━━━ 9. FOREGROUND ANCHOR (closest macro depth element) ━━━
${foreground_anchor}

Tactile macro foreground bringing 3-tier depth — a giant petal-edge / dewdrop-cluster / moss-tuft / fern-frond / spider-silk-thread at HER scale, bringing the camera close.
${botanicalSection}

━━━ AMBIENT MOOD (vibe-driven secondary lighting cue) ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ STYLE REGISTER (painterly-real fantasy lineage) ━━━
Visible oil-brushwork, painted edges, romantic painted atmosphere. Brian Froud + Charles Vess + Greg Manchess + Donato Giancola + Paul Bonner + Frank Frazetta painted-fantasy concept-art lineage. NOT photoreal, NOT chibi, NOT anime, NOT Disney, NOT Tinkerbell, NOT CGI, NOT mascot, NOT cartoon. Painted gallery-tier illustration.

━━━ HARD BANS ━━━
- NO cartoon / chibi / anime / Disney / Tinkerbell / mascot rendering
- NO oversized-head proportions (painterly-real anatomy only)
- NO regular-sized fairy (PALM-SIZED MANDATORY)
- NO posing-for-camera / NO eye-contact-with-viewer
- NO sexualized framing — focus is mythic-creature beauty
- NO bare chest, NO nipples, NO topless
- NO modern objects, NO realistic non-magical humans
- NO violence / NO scared expressions / NO edgy moods
- NO storm / lightning / dark-grey-blue (peaceful enchanted register only)
- NO additional fae beyond the focal one + the scale-anchor companion (no extra fae figures)

━━━ OUTPUT ━━━
Write 80-110 words, comma-separated phrases. LEAD WITH THE PALM-SIZED FAE — preserve her stacked features unmistakably (including wings + 3-to-8-inch scale). Then the scale-anchor companion that DWARFS her. Then her macro perch. Then the captured action. Then forest at her scale. Then lighting + weather. Then magical flavor + foreground anchor.${botanical_accent ? ' Then botanical accent at her scale.' : ''} Painterly-real oil-brushwork register throughout. NO preamble, NO headers, NO ━━━ markers, NO bullets, NO bold-labels.`;
  },

  FAEBOT_DRYAD_PORTRAIT: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      expression_moment,
      gesture_pose,
      portrait_composition,
      adornment,
      forest_backdrop,
      lighting,
      weather,
      magical_flavor,
      foreground_anchor,
    } = slots;

    const foregroundSection = foreground_anchor
      ? `\n\n━━━ FOREGROUND ANCHOR (closest depth element bringing 3-tier portrait depth) ━━━\n${foreground_anchor}\n\nA tactile element close to the camera that brings true depth — hanging vine, fern-frond, drifting petal-cluster — softly out-of-focus, framing her without blocking.`
      : '';

    return `You are writing ONE Flux prompt for a TIGHT CLOSE-UP DRYAD PORTRAIT in FaeBot's painted-fantasy register (Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Frank Frazetta painted-fantasy lineage). Output ONLY the prompt — comma-separated phrases, 80-110 words, no preamble, no headers, no markers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt.

1. THIS IS A TIGHT PORTRAIT. Head and shoulders / bust framing only. The CREATURE'S FACE AND UPPER BODY fill 50-80% of the frame. NEVER write full-body, NEVER write wide-shot, NEVER write a "figure in landscape". This is portrait scale — close enough to read eyelashes, lichen-detail on cheekbones, individual vine-strands in hair.

2. The dryad description below is THE creature — render her with EVERY exotic feature listed (the moss-tinted skin, the vine-hair, the leaf-garment, the antlers/wings/glowing-marks, the magical signature). 5+ stacked exotic features must visibly land in the painting.

3. INTIMATE STILLNESS — face turned 3/4 or in soft profile, eyes lowered or looking away, NEVER eye-contact with viewer, NEVER posing-for-camera. Caught in a quiet candid moment.

4. Adult-scale dryad — NOT palm-sized, NOT child-fairy.

Open your prompt with the dryad description. The dryad opens; everything else is HER FRAME.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. THE DRYAD (the subject — render her exactly as described) ━━━
${creature}

Preserve every exotic feature unmistakably. She is mythic-creature beauty, NOT human-model beauty. Confident at-home-in-her-wildness. NEVER posing, NEVER looking at the viewer.

━━━ 2. EXPRESSION MOMENT (face + eyes — the intimate stillness) ━━━
${expression_moment}

This is the captured intimate moment of her face. Caught-on-camera, eyes lowered or looking away, NEVER toward viewer. Soft contemplation, listening, blessing, communion.

━━━ 3. GESTURE / POSE (hand and shoulder posture) ━━━
${gesture_pose}

A specific hand/shoulder/posture moment that anchors her stillness — never tense, never posed, always candid intimate.

━━━ 4. PORTRAIT COMPOSITION (tight framing spec) ━━━
${portrait_composition}

The frame is intimate close. Face / shoulders / bust dominate. The forest is softly out-of-focus depth behind.

━━━ 5. ADORNMENT (what's woven into her hair / face / shoulders) ━━━
${adornment}

A specific natural adornment painted into her hair, antlers, or shoulders — flower-crown, berry-cluster, leaf-veil, dewdrops on temple. Painted with species-specific detail.

━━━ 6. FOREST BACKDROP (her natural frame — softly out-of-focus behind her) ━━━
${forest_backdrop}

A specific enchanted-forest setting softly behind her — atmospheric haze sells the depth. Never let the backdrop compete with her presence. Tactile foreground / midground holds her / background fades into soft painted mist.

━━━ 7. LIGHTING (close-portrait light drama) ━━━
${lighting}

━━━ 8. WEATHER (air condition close to her — drifting accents) ━━━
${weather}

━━━ 9. MAGICAL FLAVOR (visible magic at her face / shoulders) ━━━
${magical_flavor}

A specific magical signature visible near her face or shoulders — glowing veins, pollen-shimmer at her temples, fireflies near her cheek, soft halo.
${foregroundSection}

━━━ AMBIENT MOOD (vibe-driven secondary lighting cue) ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ STYLE REGISTER (painted-fantasy lineage) ━━━
Visible oil-brushwork, painted edges, romantic painted atmosphere. Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Frank Frazetta painted-fantasy concept-art lineage. NOT photoreal, NOT ink-outlined, NOT animation, NOT CGI, NOT digital-polished. Painted gallery-tier portrait illustration.

━━━ HARD BANS ━━━
- NO full-body framing / NO wide-shot / NO landscape-with-figure (this is a TIGHT PORTRAIT — head/bust scale only)
- NO model-poses / NO posing-for-camera / NO eye-contact-with-viewer (face turned away, eyes lowered, gaze elsewhere)
- NO sexualized framing — focus is mythic-creature beauty
- NO bare chest, NO nipples, NO topless
- NO modern objects, NO realistic non-magical humans
- NO violence / NO scared expressions / NO edgy moods
- NO additional figures
- NO palm-sized fairy / NO tiny-pixie scale (this path is adult-scale only)
- NO smooth illustration / NO airbrushed / NO modern-anime / NO Pixar-3D
- NO storm / lightning / dark-grey-blue (peaceful enchanted register only)

━━━ OUTPUT ━━━
Write 80-110 words, comma-separated phrases. LEAD WITH THE DRYAD — preserve her stacked exotic features unmistakably. Then expression. Then gesture. Then composition framing. Then adornment. Then forest backdrop softly behind. Then lighting + weather. Then magical flavor close to her face.${foreground_anchor ? ' Then foreground anchor.' : ''} Painted-fantasy oil-brushwork register throughout. NO preamble, NO headers, NO ━━━ markers, NO bullets, NO bold-labels.`;
  },

  FAEBOT_FAE_VILLAGE_AXIS: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      dwelling_type,
      village_layout,
      lived_in_signs,
      approach_pathway,
      dwelling_garden,
      forest_setting,
      lighting,
      atmospheric_depth,
      wildlife_lived_in,
      floral_carpet,
      foreground_anchor,
      water_or_feature,
    } = slots;

    const waterSection = water_or_feature
      ? `\n\n━━━ 12. WATER OR SPECIAL FEATURE (40%-gated extra layer) ━━━\n${water_or_feature}\n\nWoven into the scene as an additional life-element — water glints, well draws the eye, mushroom-circle dots the foreground. NOT a competing focal subject — the dwelling stays the show.`
      : '';

    return `You are writing ONE Flux prompt for an enchanted FAE VILLAGE painting in FaeBot's painted-fantasy register (Greg Manchess + Donato Giancola + Paul Bonner + NC Wyeth + Brian Froud + Eyvind Earle painted-fantasy lineage). Output ONLY the prompt — comma-separated phrases, 100-130 words, no preamble, no headers, no markers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt.

1. THE DWELLING (AND ITS LAYOUT) IS THE SUBJECT. The fae dwelling(s) fill 40-55% of the frame as the eye's first landing place. NEVER a "wide landscape with tiny structure". NEVER "small house in distance". The architecture and layout are RENDERED EXACTLY as described in axes 1 and 2 below — do NOT substitute a different dwelling type or layout.

2. WEAVE DWELLING_TYPE + VILLAGE_LAYOUT NATURALLY — the dwelling_type axis below gives the architecture (acorn / eggshell / mushroom / treehouse / etc.); the village_layout axis gives the arrangement (single / pair / cluster / canopy-network / over-water / cliff-ledge / fairy-ring / etc.). Reconcile them into one coherent composition. For example: spider-silk-hammock + pair = "pavilion stretched between two trees"; acorn-cottage + cluster = "5 acorn cottages scattered across clearing"; treehouse + canopy-network = "6 treehouses connected by vine-bridges across oaks"; stone-cottage + fairy-ring = "stone-cottages arranged in perfect ring around courtyard". If the rolled combination is awkward (e.g., spider-silk-hammock + cluster), bias toward the dwelling_type and adapt the layout naturally.

3. AMBER-WINDOW GLOW BAKED IN — every render MUST show amber-glowing windows (warm-honey light pouring from carved windows of every dwelling). This is the consistent "lived-in" signature across legacy renders.

4. BUZZING WITH LIFE — every render includes 3-5 specific critters from the wildlife axis (squirrels / rabbits / songbirds / butterflies / chipmunks / frogs / hummingbirds / a small fawn / drifting fireflies). The village must FEEL inhabited — Studio Ghibli forest density, Cinderella's woodland helpers, Snow White's animal companions.

5. GROWN FROM NATURE — every dwelling is GROWN from forest materials (bark walls / mossy thatch / vine-bound timber / woven willow / hewn-wood / carved-shell / petal-walls). NEVER modern construction. NO concrete / steel / brick / glass-pane / shingle (use bark-shingle instead).

6. SOFT OPALESCENT REGISTER (baked-in atmospheric bedrock) — every render suffused with pearl-warm golden glow + opalescent painted softness + rainbow-flecked dewdrop-shimmer. Painterly soft-haze pervading.

7. EMOTIONAL MOOD BEDROCK (mandatory closing register) — every render carries one of these emotional moods baked in via Sonnet's prose: "fondly remembered" / "softer and warmer than memory" / "absolute dawn stillness and quiet reverence" / "gauzy-warm storybook softness" / "painted memory of a sacred morning" / "everything gauzy-warm and fondly remembered". This soft nostalgic emotional bedrock is what makes the village feel SACRED and BELOVED, not just rendered.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. DWELLING TYPE (the architecture/material — LOAD-BEARING) ━━━
${dwelling_type}

This is the specific dwelling architecture for this render. Preserve every architectural feature, every material, every natural-feature integration. Render exactly as described — do NOT substitute.

━━━ 2. VILLAGE LAYOUT (how the dwellings are arranged — LOAD-BEARING) ━━━
${village_layout}

This is the layout/arrangement. Reconcile with dwelling_type above naturally (see mandate #2 for guidance). If single dwelling, layout = solo composition. If multiple, the layout describes how they're spatially arranged.

━━━ 3. LIVED-IN SIGNS (amber windows + smoke + lanterns + chairs + tools — load-bearing) ━━━
${lived_in_signs}

The signs that fae live here — amber-glowing windows, chimney smoke curling, hanging lanterns, small chairs by the door, cooking-fire embers, tools propped against walls, laundry on a line. NON-NEGOTIABLE — every element MUST appear visibly in the render. The village is INHABITED.

━━━ 4. APPROACH PATHWAY (path/stair/bridge leading to dwelling) ━━━
${approach_pathway}

The specific approach element — mossy stone-path / wooden-plank bridge / spiral-moss-stair / pebble-path / vine-rope-bridge / knotted-ladder / fallen-log walkway. Visible in the foreground or mid-tier, leading the eye to the dwelling.

━━━ 5. DWELLING GARDEN (climbing vines + flowers + moss ON the dwelling) ━━━
${dwelling_garden}

Climbing wisteria + foxglove-spires beside the door + climbing-roses + herb-garden + moss-blanket roof + fern-cluster on porch + ivy-engulfing-walls. The dwelling is OVERGROWN with painted lushness.

━━━ 6. FOREST SETTING (surrounding biome) ━━━
${forest_setting}

The painted atmospheric forest wrapping the scene. Multi-tier depth.

━━━ 7. LIGHTING (time-of-day + register) ━━━
${lighting}

━━━ 8. ATMOSPHERIC DEPTH (god-rays / mist / dust-motes) ━━━
${atmospheric_depth}

━━━ 9. WILDLIFE LIVED-IN (3-5 critters bringing the village to life — load-bearing) ━━━
${wildlife_lived_in}

NON-NEGOTIABLE. Every critter listed MUST appear visibly. Do NOT compress or drop critters. Preserve specific species + actions exactly. Studio Ghibli forest density, Cinderella's woodland helpers.

━━━ 10. FLORAL CARPET (lush wildflower carpet at foreground/borders) ━━━
${floral_carpet}

BLANKET-DENSITY wildflowers at the foreground and borders — bluebells / foxglove-spires / lily-of-the-valley / forget-me-nots / primroses / violets / wild-roses overlapping in dense carpet.

━━━ 11. FOREGROUND ANCHOR (closest tactile element) ━━━
${foreground_anchor}

A specific tactile element near the camera bringing 3-tier depth — overhanging branch / fern-cluster / blossom-cluster / hanging-moss curtain / drifting petals close to camera. Softly out-of-focus.
${waterSection}

━━━ AMBIENT MOOD (vibe-driven secondary lighting cue) ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ STYLE REGISTER (painted-fantasy lineage) ━━━
Visible thick oil-brushwork on every surface — bark, foliage, rocks, water, dwelling walls, thatched roofs. Painted edges (one color stops, another begins, with a soft painted seam). Greg Manchess + Donato Giancola + Paul Bonner + NC Wyeth + Brian Froud + Eyvind Earle painted-fantasy lineage. Saturated deep forest greens + warm umber bark-tones + mossy roof greens + glowing amber window-light + muted blue-grey atmospheric distance. NEVER black ink outlines, NEVER vector borders, NEVER animation-cel, NEVER 3D-CGI plastic, NEVER photoreal.

━━━ HARD BANS ━━━
- NO modern construction (no concrete / steel / brick / glass-pane / asphalt-shingle — bark-shingle/moss-thatch only)
- NO "standing stones" / "stone circles" / "tomb" / "gravestone" / "cemetery" — banned grave-trigger vocabulary (standing-stones context only OK when explicitly described as fairy-ring courtyard architecture)
- NO close-up or focal figures (small distant fae figure as ambient accent is OK — small in frame, never close-up)
- NO sexualized framing
- NO bare chest, NO nipples, NO topless
- NO violence / NO scared / NO edgy moods
- NO cartoon / chibi / mascot rendering
- NO photographic / digital / 3D / CGI descriptors

━━━ OUTPUT ━━━
Write 100-130 words, comma-separated phrases. OPEN WITH THE DWELLING + LAYOUT WOVEN TOGETHER — load-bearing first 30-45 words establishing the dwelling architecture AND its arrangement. Then lived-in signs (amber windows + smoke + lanterns). Then approach pathway + dwelling garden + forest setting. Then lighting + atmospheric depth. Then wildlife (the 3-5 specific critters listed). Then floral carpet + foreground anchor.${water_or_feature ? ' Then water/special feature woven in naturally.' : ''} Painted-fantasy thick-brushwork register throughout. NEVER modern construction. NEVER grave-trigger words. NO preamble, NO headers, NO ━━━ markers, NO bullets, NO bold-labels.`;
  },

  FAEBOT_WILDS_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const { landscape_feature, village_built, connectors, inhabitants, fae_lighting, drama } = slots;

    const dramaSection = drama
      ? `
━━━ DRAMA — render this visibly in the scene ━━━
${drama}

`
      : '';

    return `You are a fantasy concept-art painter writing an ETHEREAL FAE VILLAGE BUILT INTO WILD NATURE in FaeBot's SOFT painted-fairy register (Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Edmund Dulac painted-fantasy lineage) — a charming little village of white elven-castle cottages built around and into a dramatic natural landscape. Rivendell-style elven architecture at cozy village scale, fused with wild nature, soft and warm and storybook. The scene should make the viewer marvel at how the fae built into the land.

━━━ THE VILLAGE IS BUILT AROUND A WILD NATURE FEATURE — ABSOLUTE FIRST RULE ━━━
A dramatic NATURAL LANDSCAPE FEATURE (a stream, canyon, waterfall, giant rocks, cliffs, ancient trees) is the ORGANIZING ELEMENT — the little white elven castle-cottages CLING TO, SPAN, NESTLE INTO and grow around it. The terrain leads; the village adapts to it. Because of the dramatic terrain, different parts of the village are joined by CREATIVE CONNECTORS — arched bridges, stone archways, rope bridges, rope-and-plank walkways, swinging vines, ladders, ziplines, hanging lift-baskets, stepping stones, carved rock-stairs. Soften everything with FaeBot's fairy vibe: warm dappled fairy-light, flowering wisteria and blossom, glowing windows and fairy-lanterns, drifting motes and pixies, lush mossy nature. Tender, warm, whimsical, super pretty — NOT cold, NOT epic, NOT one monumental castle.

━━━ THE NATURE FEATURE (the landscape the village is built around) ━━━
${landscape_feature}

Render this dramatic natural feature prominently — it is the stage the whole village is built around.

━━━ HOW THE VILLAGE IS BUILT INTO IT ━━━
${village_built}

Render the little white elven castle-cottages clinging to / spanning / nestled into the feature — many small charming dwellings adapting to the terrain.

━━━ THE CREATIVE CONNECTORS (how the village parts join) ━━━
${connectors}

Render the creative ways the village parts connect across the terrain — bridges, arches, ropes, swings, ladders, walkways, lifts — a key charming feature.

━━━ THE INHABITANTS (tiny elves + fae + critters, village life) ━━━
${inhabitants}

Small graceful elves, tiny fae creatures and cute critters give warmth, life and scale.

━━━ LIGHT + ATMOSPHERE + FAE GLOW ━━━
${fae_lighting}

Render the warm soft dappled fairy-light plus drifting glowing motes and pixies filling the air.
${dramaSection}
━━━ COLOR + MOOD ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Soft, painterly, luminous, tender, storybook. A charming little white elven castle-village built around a dramatic wild nature feature (stream/canyon/waterfall/rocks/cliffs/trees), the parts joined by creative bridges/arches/ropes/swings/walkways, warm dappled light and drifting fae-motes, flowering vines and blossom, lush mossy nature, tiny elves + fae + a cute critter for life and scale. Warm, whimsical, super pretty. NEVER one monumental castle; NEVER cold/grim/epic; NEVER modern/sci-fi.

Write ONE Flux prompt — comma-separated phrases, 90-120 words, no preamble, no headers, no markers. Start immediately with the scene content. Order: [a charming little white elven castle-village built around a dramatic wild nature feature (the feature + village lead together)], [the dramatic nature feature — stream/canyon/waterfall/rocks/cliffs/trees], [the little white spired cottages clinging to / spanning / nestled into it], [creative connectors — arched bridges, stone arches, rope bridges, swinging vines, ladders, walkways, lift-baskets], [tiny elves + fae + a cute critter in village life], [warm soft dappled fairy-light + drifting glowing motes + pixies + flowering vines], [warm storybook palette + tender whimsical fae mood].`;
  },

  FAEBOT_CASTLE_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const { village_layout, village_detail, setting, inhabitants, fae_lighting, drama } = slots;

    const dramaSection = drama
      ? `
━━━ DRAMA — render this visibly in the scene ━━━
${drama}

`
      : '';

    return `You are a fantasy concept-art painter writing an ETHEREAL CASTLE-LIKE FAE VILLAGE scene in FaeBot's SOFT painted-fairy register (Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Edmund Dulac painted-fantasy lineage) — a charming little village of white elven-castle cottages nestled in a lush enchanted forest. Rivendell-style elven architecture at COZY VILLAGE scale, soft and warm and storybook. The scene should feel like a hidden fairy village you'd love to live in.

━━━ A CASTLE-LIKE FAE VILLAGE — ABSOLUTE FIRST RULE ━━━
This is a VILLAGE, not one grand city — a cluster of MANY little white elven-style dwellings (charming small spired cottages, turreted houses, towers) with the same beautiful Rivendell architecture as an elven city but at INTIMATE, cozy, lived-in scale, linked by little stone ARCHWAYS and arched BRIDGES, winding paths, with a gentle stream optional. Soften it with FaeBot's fairy vibe: warm dappled fairy-light, flowering wisteria and blossom draping the eaves, glowing windows and fairy-lanterns, drifting motes and pixies, mossy living nature woven through, lush forest all around. Tender, warm, whimsical, super pretty — NOT cold, NOT one monumental castle, NOT epic.

━━━ THE VILLAGE LAYOUT (the castle-cottage cluster) ━━━
${village_layout}

Render a charming cluster of MANY little white elven-castle dwellings at cozy village scale, linked by archways and arched bridges — the layout is the hero.

━━━ VILLAGE DETAIL (the elven craft + fae magic) ━━━
${village_detail}

Render the little archways, arched bridges, glowing windows, balconies, flowering vines, fairy-lanterns and mushroom-tucked corners — charming and cozy.

━━━ THE ENCHANTED SETTING ━━━
${setting}

Render the lush enchanted fairy-forest cradling the village with warm intimate depth.

━━━ THE INHABITANTS (tiny elves + fae + critters, village life) ━━━
${inhabitants}

Small graceful elves, tiny fae creatures and cute critters going about village life give warmth, life and scale.

━━━ LIGHT + ATMOSPHERE + FAE GLOW ━━━
${fae_lighting}

Render the warm soft dappled fairy-light plus drifting glowing motes and pixies filling the air.
${dramaSection}
━━━ COLOR + MOOD ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Soft, painterly, luminous, tender, storybook. A charming cluster of little white elven-castle cottages linked by archways and arched bridges, nestled cozily in a lush enchanted fairy-forest, warm dappled light and drifting fae-motes, flowering vines and blossom, tiny elves + fae + a cute critter for life and scale, gentle intimate depth. Warm, whimsical, super pretty — a hidden fairy village. NEVER one monumental castle; NEVER cold/grim/epic; NEVER modern/sci-fi.

Write ONE Flux prompt — comma-separated phrases, 90-120 words, no preamble, no headers, no markers. Start immediately with the scene content. Order: [a charming little fae village of many small white elven-castle cottages linked by archways + arched bridges, nestled in a lush enchanted forest — the cozy castle-village leads], [the cluster of little white spired dwellings + glowing windows, draped in wisteria + blossom], [little archways, arched bridges, fairy-lanterns, balconies, flowering vines], [the lush enchanted forest cradling it, warm + intimate, optional gentle stream], [tiny elves + fae + a cute critter in village life], [warm soft dappled fairy-light + drifting glowing motes + pixies], [warm storybook palette + tender whimsical fae mood].`;
  },

  FAEBOT_ELVEN_CITY: ({ slots, sharedDNA, vibeDirective }) => {
    const { elven_city, elven_detail, city_setting, fae_inhabitants, fae_lighting, drama } = slots;

    const dramaSection = drama
      ? `
━━━ DRAMA — render this visibly in the scene ━━━
${drama}

`
      : '';

    return `You are a fantasy concept-art painter writing an ETHEREAL ELVEN CITY scene in FaeBot's SOFT painted-fairy register (Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Edmund Dulac painted-fantasy lineage) — a graceful white Rivendell-style elven city, but rendered with FaeBot's tender, warm, dreamy fairy-tale softness. The scene should feel like a hidden fairy realm you've stumbled upon, not a grand epic fortress.

━━━ KEEP THE RIVENDELL ELVEN CITY — BUT SOFTEN IT INTO A FAIRY REALM — ABSOLUTE FIRST RULE ━━━
The white elven city of slender spires + arched bridges + glowing windows IS the hero — keep that Rivendell beauty. BUT soften it with FaeBot's fairy vibe: bathe it in WARM, soft, dappled fairy-light (not cold epic blue); WEAVE living nature THROUGH the architecture — flowering wisteria and glowing vines draping the towers, mossy stone, blossoming trees nestled among the spires; fill the air with drifting fairy-motes, glowing pixies and soft pollen-light; make the scale INTIMATE and tender rather than vast and monumental. A gentle, storybook, enchanted fairy-tale feeling — NOT a grim epic stone fortress, NOT cold, NOT a DragonBot-style epic vista. Tender, warm, whimsical, luminous.

━━━ THE ELVEN CITY ━━━
${elven_city}

Render the white elven city — soaring slender spires, arched bridges, glowing windows — as the graceful hero, BUT softened: draped in flowering vines and blossom, nestled tenderly into the enchanted forest, warm and storybook rather than cold and monumental.

━━━ ELVEN + FAE DETAIL (the craft and magic of the place) ━━━
${elven_detail}

Render the delicate elven craftsmanship AND fae magic — graceful arches, slender bridges, glowing windows, living trees grown into the stone, fairy-lanterns and glowing vines.

━━━ THE ENCHANTED SETTING ━━━
${city_setting}

Render the magical fairy-forest setting cradling the city with atmospheric depth — the enchanted land the elves and fae share.

━━━ THE INHABITANTS (tiny elves + fae creatures for life + scale) ━━━
${fae_inhabitants}

Small graceful elf figures and tiny fae creatures give life and scale, dwarfed by the city and its beauty.

━━━ LIGHT + ATMOSPHERE + FAE GLOW ━━━
${fae_lighting}

Render the soft enchanted light plus drifting fairy-motes and magical glow filling the air.
${dramaSection}
━━━ COLOR + MOOD ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Soft, painterly, luminous, tender, storybook. The graceful white Rivendell-style elven city as the hero, but nestled warmly into a lush enchanted fairy-forest — flowering wisteria and blossom draping the spires, warm dappled fairy-light, drifting glowing motes and pixies, mossy living nature woven through the stone, tiny elves and fae creatures for scale, gentle atmospheric depth. Intimate, warm, and whimsical — a hidden fairy realm. NEVER cold/grim/epic-monumental; NEVER modern/sci-fi; NEVER a DragonBot-style epic vista.

Write ONE Flux prompt — comma-separated phrases, 90-120 words, no preamble, no headers, no markers. Start immediately with the scene content. Order: [a graceful white Rivendell-style elven city of soaring spires + arched bridges nestled in a lush enchanted fairy-forest — the elven city leads], [the city's white spires + glowing windows, SOFTENED by draping wisteria + blossom + mossy living nature], [elven + fae detail — arches + bridges + fairy-lanterns + glowing flowering vines], [the lush enchanted fairy-forest cradling it, warm and intimate], [tiny elves + fae creatures + a cute critter for scale], [warm soft dappled fairy-light + drifting glowing motes + pixies], [warm storybook color palette + tender whimsical fae mood].`;
  },

  FAEBOT_FAE_COURT: ({ slots, sharedDNA, vibeDirective }) => {
    const { fae_subject, enchanted_setting, ethereal_detail, surprise, fae_lighting, drama } = slots;

    const dramaSection = drama
      ? `
━━━ DRAMA — render this visibly in the scene ━━━
${drama}

`
      : '';

    return `You are a fantasy concept-art painter writing an ETHEREAL FAE scene in FaeBot's painted-fantasy register (Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Edmund Dulac painted-fantasy lineage) — a vision of the high-fae / elven court / enchanted glade, gossamer and luminous and magical. Dreamlike, beautiful, otherworldly. The scene should make the viewer feel they have glimpsed a hidden magical world.

━━━ ETHEREAL FAE BEAUTY — ABSOLUTE FIRST RULE ━━━
This is a luminous, dreamlike high-fantasy fae scene — graceful elven/fae beings and enchanted nature bathed in magical light. Gossamer, delicate, otherworldly, NOT dark or grim, NOT sci-fi. A sense of hidden wonder and quiet magic.

━━━ THE FAE SUBJECT (the being(s) of the court) ━━━
${fae_subject}

Render the fae/elven subject with ethereal grace — beauty, fine raiment, an otherworldly presence.

━━━ THE ENCHANTED SETTING ━━━
${enchanted_setting}

Render the magical natural setting with depth and atmosphere — the heart of the fae world.

━━━ ETHEREAL DETAIL (the magic in the air) ━━━
${ethereal_detail}

Render this delicate magical detail across the scene — it carries the enchantment.

━━━ A SURPRISE (a small enchanting touch) ━━━
${surprise}

A small magical surprise tucked in the scene, rewarding a closer look.
${dramaSection}
━━━ LIGHT + ATMOSPHERE ━━━
${fae_lighting}

━━━ COLOR + MOOD ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
Cinematic, painterly, luminous, dreamlike. The fae subject set within the enchanted glade, magical light and ethereal detail filling the air, multi-layer depth into a glowing otherworld. Graceful and beautiful. NEVER grim/dark; NEVER mundane; NEVER sci-fi.

Write ONE Flux prompt — comma-separated phrases, 80-110 words, no preamble, no headers, no markers. Start immediately with the scene content. Order: [an ethereal fae/elven subject in an enchanted glade — the luminous fae vision leads], [the fae subject — grace + raiment + presence], [the enchanted magical setting with depth], [ethereal detail in the air — motes, glow, gossamer], [a small magical surprise], [light + atmosphere], [color palette + dreamlike magical mood].`;
  },

  FAEBOT_ENCHANTED_VISTA: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      biome,
      hero_feature,
      floor_carpet,
      water_element,
      magical_ambient,
      composition,
      lighting,
      atmospheric_depth,
      weather,
      foreground_anchor,
      wildlife_distant,
    } = slots;

    const wildlifeSection = wildlife_distant
      ? `\n\n━━━ 11. DISTANT WILDLIFE HINT (a far ambient creature woven into the deep grove) ━━━\n${wildlife_distant}\n\nA far-off, ambient hint of life — a distant silhouette glimpsed through the trunks, NOT a focal subject. The forest stays the subject. The creature is a STORY-WHISPER, not the show.`
      : '';

    return `You are writing ONE Flux prompt for a LUSH ENCHANTED FOREST VISTA painting in FaeBot's painted-fantasy register (Greg Manchess + Donato Giancola + Edmund Dulac + Brian Froud + Greg Rutkowski painted-fantasy lineage). Output ONLY the prompt — comma-separated phrases, 90-120 words, no preamble, no headers, no markers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt.

1. NATURE-FIRST PANNED-OUT VISTA — the lush enchanted FOREST itself is the primary subject filling 85-95% of frame. Small distant figures (a small fae / a tiny far figure standing at a clearing edge / a small distant creature) OR small ambient creatures are PERMITTED as soft story-whisper accents — small in frame, panned-out, NEVER close-up, NEVER focal, NEVER dominant. The pretty details (wildflowers, moss, water, magical particles, painterly depth) lead and dominate. A figure or creature is a quiet grace-note, not the show.

2. MAX LAYERED LUSHNESS — every render is a STOP-AND-STARE painted masterpiece with MULTIPLE visible layers: a HERO landmark (woven INTO the scene as a graceful unexpected gift, not a dominant centerpiece), a BLANKET-DENSITY floor of 5-7 overlapping wildflower species, a WATER element, RICH STACKED magical ambient (5-7 elements: fireflies + glowing pollen + phosphorescent mushrooms + will-o-wisps + foxfire + sparkle-trails + luminous butterflies), MULTI-TIER DEPTH, SPECIFIC LIGHTING + ATMOSPHERIC depth.

2b. SOFT OPALESCENT REGISTER (MANDATORY) — every render is suffused with PEARL-WHITE MORNING MIST and OPALESCENT PAINTED SOFTNESS and RAINBOW-FLECKED DEWDROP-SHIMMER and DREAMING LUMINOSITY. Soft glow on every shadow. Painterly soft-haze pervading. This is the bedrock soft-painted register — never absent, always present.

3. PAINTERLY-LUSH register — Greg Manchess / Edmund Dulac / Brian Froud / Greg Rutkowski fantasy concept-art at its peak. NOT photoreal. NOT CGI. NOT cartoon. Visible oil-brushwork, painted edges, romantic painted atmosphere.

4. SUBTLE FAIRY-MAGIC WOVEN THROUGH — magic is AMBIENT and SUBTLE (drifting particles, distant will-o-wisps, glowing wildflower accents, foxfire on bark), NEVER a focal effect that dominates.

5. BANNED VOCABULARY — NEVER write "standing stones / stone circle / weathered stones / sacred stones / tomb / gravestone / cemetery". Flux trains these as grave imagery and renders headstones. AVOID ALL grave-trigger words.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. BIOME (overall flavor + canopy character) ━━━
${biome}

The macro-biome wrapping the scene — ancient oak / pale birch / wisteria-cascade / fern-grotto / autumn-grove / cherry-blossom canopy / etc. Painted atmospheric foundation.

━━━ 2. HERO FEATURE (the central WOW landmark — load-bearing) ━━━
${hero_feature}

The central wow-element of the painting — a colossal hero-tree / cascading waterfall / forest-arch of arching branches / glowing tree-hollow alcove / mossy-boulder cathedral / sun-shaft pillar / etc. This is the EYE-ANCHOR. Render it large and central.

━━━ 3. FLOOR CARPET (floor texture + wildflower density) ━━━
${floor_carpet}

The forest floor as a lush, painterly textile — moss carpet with bluebells / fern-bed with foxglove-spires / clover-and-daisy meadow / petal-strewn moss / leaf-and-pinecone carpet. Specific plant density, painted with detail.

━━━ 4. WATER ELEMENT (water somewhere in the scene) ━━━
${water_element}

A water feature woven into the scene — clear forest stream / lily-covered pond / small waterfall / mist-pool / dew-pool / cascade. Visible water adds life and depth.

━━━ 5. MAGICAL AMBIENT (fairy magic particles + small magical accents) ━━━
${magical_ambient}

Subtle fairy magic woven through the scene — drifting fireflies / glowing pollen-orbs / phosphorescent mushroom-clusters / will-o-wisps in the distance / foxfire on bark / sparkle-trails / luminous wildflower accents / hovering moonflower-bells. AMBIENT, never dominant.

━━━ 6. COMPOSITION (framing technique) ━━━
${composition}

━━━ 7. LIGHTING (time-of-day + palette) ━━━
${lighting}

━━━ 8. ATMOSPHERIC DEPTH (depth technique — god-rays / mist-layers / dappled patches) ━━━
${atmospheric_depth}

━━━ 9. WEATHER (air condition + drifting accents) ━━━
${weather}

━━━ 10. FOREGROUND ANCHOR (closest tactile element bringing 3-tier depth) ━━━
${foreground_anchor}

A specific tactile element near the camera — hanging vine / fern-cluster / mushroom-circle / moss-covered branch / drifting pollen close. Softly out-of-focus, frames the scene without blocking.
${wildlifeSection}

━━━ AMBIENT MOOD (vibe-driven secondary lighting cue) ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ STYLE REGISTER (painted-fantasy lineage) ━━━
Visible oil-brushwork, painted edges, romantic painted atmosphere. Greg Manchess + Donato Giancola + Edmund Dulac + Brian Froud + Greg Rutkowski painted-fantasy concept-art lineage. NOT photoreal, NOT ink-outlined, NOT animation, NOT CGI, NOT digital-polished. Painted gallery-tier illustration.

━━━ HARD BANS ━━━
- NO close-up or focal figures (a small distant figure or creature as ambient accent is OK — small in frame, panned-out, never close-up, never dominant)
- NO "standing stones" / "stone circles" / "tomb" / "gravestone" / "cemetery" / "weathered stones" — banned grave-trigger vocabulary, ALL grave-words forbidden
- NO modern objects (no fences, signs, lamps, buildings, masonry, architecture, bridges-of-architecture)
- NO violence / NO scared / NO edgy moods
- NO bare chest, NO nipples, NO topless (irrelevant — no figures)
- NO overwhelming magic effects (magic is SUBTLE — particles + accents, never dominant)
- NO cartoon / chibi / mascot rendering
- NO photographic / digital / 3D / CGI descriptors
- NO generic vague forest — every render must be VISUALLY SPECIFIC and LUSH

━━━ OUTPUT ━━━
Write 90-120 words, comma-separated phrases. OPEN WITH THE BIOME + HERO FEATURE woven together — load-bearing first 30-40 words establishing the painting's macro-anchor. Then floor carpet + water element + magical ambient (the multi-layer richness). Then composition + lighting + atmospheric depth + weather. Then foreground anchor.${wildlife_distant ? ' Then distant wildlife hint woven in naturally.' : ''} Painted-fantasy oil-brushwork register throughout. The nature scene is the show — any small distant figure or creature is a quiet ambient grace-note, never close-up or dominant. NEVER write grave-trigger words. NO preamble, NO headers, NO ━━━ markers, NO bullets, NO bold-labels.`;
  },

  FAEBOT_QUEEN_OF_THE_FOREST: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      queen_features,
      posed_setting,
      forest_biome,
      regalia,
      forest_critters,
      lighting,
      weather,
      magical_flavor,
      ambient_detail,
      foreground_anchor,
      lesser_fae,
    } = slots;

    const lesserFaeSection = lesser_fae
      ? `\n\n━━━ LESSER FAE PAYING RESPECTS (1-3 smaller fae gathered near the queen) ━━━\n${lesser_fae}\n\nWoven into the scene as 1-3 smaller, less-ornate fae paying respects to the queen — kneeling at her feet, offering a flower, bowing nearby, gathered at her hem. Visibly smaller and simpler than the queen. They do NOT compete with her as the focal subject.`
      : '';

    return `You are writing ONE Flux prompt for a QUEEN OF THE FOREST painting in FaeBot's painted-fantasy register (Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Frank Frazetta painted-fantasy lineage). Output ONLY the prompt — comma-separated phrases, 80-110 words, no preamble, no headers, no markers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt.

1. ONE SOLO ORNATE MAGIC FAE QUEEN, POSED BEAUTIFULLY in a STUNNING NATURAL FOREST SETTING (body fills 35-55% of frame). She is undeniably a QUEEN — ornate regalia, magical aura, pretty-fairy-nature register. She is POSED for the viewer like an editorial portrait shoot but the LOCATION is a real wild forest spot, NOT a constructed court chamber. Eye-contact and model-pose are OK and encouraged.

2. THE SETTING — a SPECIFIC BEAUTIFUL NATURAL FOREST SPOT (gnarled-root throne in a sunny clearing / posed on a tree-branch over a stream / standing in a wildflower meadow / sitting on a mossy boulder by a waterfall / framed in a natural tree-archway / wading in a forest stream / leaning against an ancient hero-tree / seated on a fallen moss-log). The setting is WILD, not constructed by attendants. OPEN your Flux prompt with the setting + her pose embedded within it.

3. WOODLAND CRITTERS FLOCK TO HER and PAY RESPECTS — every render MUST show 3-8 specific small forest creatures gathered around her, paying respects, looking up at her, perched on her, at her feet, approaching reverently. She is the QUEEN OF THE FOREST and the wild things obey her. This is a LOAD-BEARING visual element — don't hide it in the background.

4. ORNATE FAE QUEEN — 5+ stacked exotic features from her stack (species + skin + hair + gown + crown + magical signature) all visibly landing on her. Mythic regal beauty, very fairy / very pretty / very nature, NOT human-model beauty.

5. PAINTED-FANTASY REGISTER — visible oil-brushwork, painted-fantasy concept-art lineage. NOT photoreal, NOT CGI, NOT cartoon.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. POSED SETTING (load-bearing — open the Flux prompt with this) ━━━
${posed_setting}

This is the LOAD-BEARING backdrop element. The specific natural forest spot + her pose embedded within it must be the first thing rendered in the prompt. The wild forest IS the setting; she is posed within it.

━━━ 2. THE QUEEN (solo, ornate, magic fae queen — 5+ stacked features) ━━━
${queen_features}

Preserve every feature unmistakably. Mythic regal fae beauty. She IS undeniably a QUEEN — ornate, magical, pretty / nature / fairy register.

━━━ 3. WOODLAND CRITTERS PAYING RESPECTS (always-on — load-bearing) ━━━
${forest_critters}

3-8 specific small forest creatures gathered around her, paying respects, looking up at her, perched on her, at her feet, approaching reverently. She is QUEEN OF THE FOREST — the wild things flock to her. VISIBLE in the render, not hidden.

━━━ 4. FOREST BIOME (the type of forest around her) ━━━
${forest_biome}

The specific forest type wrapping the scene — ancient oak grove / pale birch glade / wisteria-cascade arbor / waterfall-glade / wildflower meadow / autumn-grove / fern-grotto / mossy stream-clearing. Painted atmospheric depth.

━━━ 5. REGALIA (crown / scepter / staff / orb carried by the queen) ━━━
${regalia}

A specific regal accessory or held object. Painted with mythic detail.

━━━ 6. LIGHTING (warm, ethereal register) ━━━
${lighting}

━━━ 7. WEATHER (air condition + drifting accents) ━━━
${weather}

━━━ 8. MAGICAL FLAVOR (the queen's aura) ━━━
${magical_flavor}

Her magical signature visible: butterflies orbiting the crown, soft amber halo at her shoulders, drifting petals, glowing pollen, will-o-wisps trailing.

━━━ 9. AMBIENT DETAIL (lush wild texture — wildflowers / butterflies / dewdrops / hanging moss / forest texture) ━━━
${ambient_detail}

Weave these ambient elements naturally into the scene — they make the setting feel ALIVE without crowding the queen. Floor-detail, mid-tier accents, air-motion drift.

━━━ 10. FOREGROUND ANCHOR (closest depth element) ━━━
${foreground_anchor}

A specific tactile element near the camera bringing 3-tier depth — hanging vine, fern-cluster, hanging-moss curtain, drifting petals close to camera.
${lesserFaeSection}

━━━ AMBIENT MOOD (vibe-driven secondary lighting cue) ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ STYLE REGISTER (painted-fantasy lineage) ━━━
Visible oil-brushwork, painted edges, romantic painted atmosphere. Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Frank Frazetta painted-fantasy concept-art lineage. NOT photoreal, NOT ink-outlined, NOT animation, NOT CGI, NOT digital-polished. Painted gallery-tier illustration.

━━━ HARD BANS ━━━
- NO castle / built architecture / stone-masonry / human-built furniture (the setting is WILD natural forest)
- NO formal court chamber / no constructed throne by attendants / no hanging chandeliers-of-orbs strung up (this is a NATURAL forest spot, not a court chamber)
- NO mushroom-AS-THRONE (queen never sits on top of a mushroom-cap), NO mushroom-spire chamber-pillars
- NO multi-queen-court composition (this is SOLO queen + lesser fae paying respects when gated, NOT a multi-queen court)
- NO sexualized framing
- NO bare chest, NO nipples, NO topless
- NO modern objects, NO realistic non-magical humans
- NO violence / NO threatening / NO weapons
- NO tight head-and-shoulders portrait (this is body-scale within a setting, that's dryad-portrait)
- NO tiny-fairy scale (that's tiny-fae)
- NO cartoon / chibi / mascot rendering
- NO storm / lightning / dark-grey-blue (peaceful enchanted register only)

━━━ OUTPUT ━━━
Write 80-110 words, comma-separated phrases. OPEN WITH THE POSED SETTING (the specific wild forest spot + her pose embedded) — load-bearing first 25-35 words. Then describe the queen with stacked features unmistakable. Then the woodland critters paying respects around her. Then forest biome wrapping + regalia + lighting + weather + magical flavor + ambient detail + foreground anchor.${lesser_fae ? ' Then lesser fae paying respects woven in naturally.' : ''} Painted-fantasy oil-brushwork register throughout. NO preamble, NO headers, NO ━━━ markers, NO bullets, NO bold-labels.`;
  },
};
