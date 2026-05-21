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

  FAEBOT_FAIRY_COURT: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      court_subject,
      ceremonial_moment,
      composition,
      regalia,
      forest_backdrop,
      lighting,
      weather,
      magical_flavor,
      chamber_life,
      foreground_anchor,
      sacred_companion,
    } = slots;

    const candidates = Array.isArray(court_subject) ? court_subject : [court_subject];
    const _r = Math.random();
    const figureCount = _r < 0.20 ? 1 : _r < 0.50 ? 2 : _r < 0.80 ? 3 : 4;
    const chosen = candidates.slice(0, Math.min(figureCount, candidates.length));
    const queenStack = chosen[0];
    const attendantStacks = chosen.slice(1);

    let positionLabels;
    if (chosen.length === 2) positionLabels = ['CENTER', 'RIGHT-OF-QUEEN'];
    else if (chosen.length === 3) positionLabels = ['CENTER', 'LEFT-OF-QUEEN', 'RIGHT-OF-QUEEN'];
    else if (chosen.length === 4) positionLabels = ['CENTER', 'LEFT-OF-QUEEN', 'RIGHT-OF-QUEEN', 'OUTER-LEFT'];
    else positionLabels = ['CENTER'];

    const courtSection = chosen.length === 1
      ? `THE QUEEN — SOLITARY (body fills 40-65% of frame):\n${queenStack}\n\nSolo regal queen. She is the ONLY figure in the scene.`
      : `THE COURT — ${chosen.length} VISIBLE FAE FIGURES (MULTI-FIGURE composition — EVERY figure listed MUST be rendered visibly in the final image; do NOT collapse to fewer):\n\nFigures arranged horizontally across the chamber, each at full body-scale, each clearly distinct, all ${chosen.length} present and recognizable in the frame:\n\n${chosen.map((stack, i) => `${positionLabels[i]} — ${i === 0 ? 'THE QUEEN (largest, most elaborate, on the throne / central dais)' : `ATTENDANT (slightly smaller than queen, less elaborate adornment, ${positionLabels[i].toLowerCase().replace(/-/g, ' ')})`}: ${stack}`).join('\n\n')}\n\nMANDATORY: render EXACTLY ${chosen.length} distinct fae women visible in the frame — ${positionLabels.slice(0, chosen.length).join(' + ')}. Each at full body-scale. Each VISUALLY DISTINCT (different species lineage / palette / crown). Do NOT drop attendants. The court arrangement IS the subject.`;

    const companionSection = sacred_companion
      ? `\n\n━━━ SACRED COMPANION (a single sacred animal attending the court) ━━━\n${sacred_companion}\n\nA sacred forest creature (white stag / raven / owl / fox / hare) attending the court — knelt before the queen, perched on her shoulder, sitting at her feet. Woven into the scene at NORMAL scale (the queen is adult-sized, the animal is its natural size — NOT a tiny-fae scale companion).`
      : '';

    return `You are writing ONE Flux prompt for a FORMAL FAIRY COURT painting in FaeBot's painted-fantasy register (Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Frank Frazetta painted-fantasy lineage). Output ONLY the prompt — comma-separated phrases, 80-110 words, no preamble, no headers, no markers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt.

1. VISIBLE FORMAL COURT-INFRASTRUCTURE — this is a FORMAL FAE COURT CHAMBER shaped from living forest. The render MUST visibly show at least ONE explicit court-infrastructure element from the rolled forest_backdrop axis: MOSS-AND-ROOT THRONE (sometimes with carved root-arms + woven-branch back) / FALLEN-LOG BENCHES / RAISED MOSS-DAIS / HANGING POLLEN-ORB CHANDELIERS / MOSS-STAIR STONE-PATH APPROACH / ROOT-ARCHWAY ENTRANCE / TWIN TREE-PILLAR CHAMBER WALLS / WISTERIA-CASCADE CEILING / GIANT-MUSHROOM CANOPY (architectural landmark — queen stands UNDER it at human scale, NEVER on top) / BREATHTAKING HERO-TREE (chamber cathedral with root-alcove). The chamber must read as a formal fae court, not "queen in a generic forest."

2. ${chosen.length === 1 ? 'A SOLITARY REGAL QUEEN (body fills 40-65% of frame).' : `${chosen.length} FAE FIGURES total — queen at center plus ${attendantStacks.length} attendant${attendantStacks.length > 1 ? 's' : ''} flanking. Court arrangement: queen larger and more elaborate at center, attendants smaller, fanning in a half-circle behind or beside her.`} NEVER a tight close-up portrait (that's dryad-portrait). NEVER tiny-fairy scale (that's tiny-fae). NEVER a wide landscape with tiny figure.

3. The queen wears EVERY feature listed in HER stack (species + skin + hair + gown + crown + magical signature). 5+ stacked features must visibly land on her.

4. THE THRONE + ALL COURT FURNISHINGS ARE GROWN, NEVER BUILT. Moss-and-root throne, fallen-log benches, hanging lantern-orbs. NO carved stone thrones, NO castle masonry, NO mushroom-AS-THRONE (mushroom-canopy is architecture/landmark only — queen never sits on top), NO mushroom-spire chamber-pillars.

5. CEREMONIAL STILLNESS — solemn, dignified, blessing, processional. NEVER posing for camera, NEVER eye-contact-with-viewer.

6. SOFT ETHEREAL ENCHANTED-FOREST REGISTER — pretty, forestry, enchanted, painted-fantasy oil-brushwork.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. THE ${chosen.length === 1 ? 'QUEEN (solo)' : `${chosen.length} FIGURES (queen + ${attendantStacks.length} attendant${attendantStacks.length > 1 ? 's' : ''})`} ━━━
${courtSection}

━━━ 2. CEREMONIAL MOMENT (what's happening) ━━━
${ceremonial_moment}

The captured moment — blessing, slow procession, extending hand to a sacred creature, receiving an offering, silent watching. Solemn, dignified, ceremonial register.

━━━ 3. COMPOSITION (3/4 to full-body framing) ━━━
${composition}

The court occupies 40-65% of the frame at body-scale. The chamber wraps around them as the formal fae-court setting.

━━━ 4. REGALIA (crown / accessories / staff carried by the queen) ━━━
${regalia}

A specific regal accessory or held object — antler-crown / gold-leaf circlet / diadem / orb-of-light / staff / cup. Painted with mythic detail.

━━━ 5. FORMAL COURT CHAMBER (the backdrop IS court infrastructure — lead with this in your Flux prompt) ━━━
${forest_backdrop}

This is the MANDATORY court-infrastructure for this render. The throne / benches / mushroom-ring tiers / lantern-orbs / standing-stone boundary / ceremonial approach must be visible as the load-bearing backdrop element. The court infrastructure leads in the Flux prompt; the biome wraps it.

━━━ 6. LIGHTING (court-light register) ━━━
${lighting}

━━━ 7. WEATHER (air condition + drifting accents) ━━━
${weather}

━━━ 8. MAGICAL FLAVOR (royal magic signature — the queen's aura) ━━━
${magical_flavor}

Royal magic visible: butterflies orbiting the crown, soft amber halo at her shoulders, drifting petals, glowing pollen, will-o-wisps trailing the procession.

━━━ 9. CHAMBER LIFE (ambient set-dressing — small critters / wildflowers / butterflies / fireflies / lush forest texture populating the chamber) ━━━
${chamber_life}

Weave these ambient elements naturally into the scene — they make the chamber feel inhabited and alive WITHOUT crowding the queen. Floor-detail, mid-tier accents, air-motion drift.

━━━ 10. FOREGROUND ANCHOR (closest depth element) ━━━
${foreground_anchor}

A specific tactile element near the camera bringing 3-tier depth — hanging vine, fern-cluster, hanging-moss curtain, drifting petals close to camera.
${companionSection}

━━━ AMBIENT MOOD (vibe-driven secondary lighting cue) ━━━
${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 150)}

━━━ STYLE REGISTER (painted-fantasy lineage) ━━━
Visible oil-brushwork, painted edges, romantic painted atmosphere. Greg Manchess + Donato Giancola + Paul Bonner + Brian Froud + Frank Frazetta painted-fantasy concept-art lineage. NOT photoreal, NOT ink-outlined, NOT animation, NOT CGI, NOT digital-polished. Painted gallery-tier illustration.

━━━ HARD BANS ━━━
- NO castle / built architecture / stone-masonry / carved-stone throne (all court furnishings are GROWN)
- NO mushroom-AS-THRONE (queen sitting on a mushroom-cap), NO mushroom-spire chamber-pillars, NO bioluminescent-glen register
- NO model-poses / NO posing-for-camera / NO eye-contact-with-viewer
- NO sexualized framing — focus is regal-otherworldly beauty
- NO bare chest, NO nipples, NO topless
- NO modern objects, NO realistic non-magical humans
- NO violence / NO threatening / NO weapons
- NO crowds beyond ${chosen.length} figures
- NO tight head-and-shoulders portrait (this path is body-scale)
- NO tiny-fairy scale (that's tiny-fae)
- NO cartoon / chibi / mascot rendering
- NO storm / lightning / dark-grey-blue (peaceful enchanted register only)

━━━ OUTPUT ━━━
Write 80-110 words, comma-separated phrases. ${chosen.length === 1 ? 'OPEN WITH THE COURT-INFRASTRUCTURE element (throne / chandeliers / dais / approach / mushroom-canopy / hero-tree) from the backdrop axis — load-bearing first 25-35 words. Then describe the queen with stacked features unmistakable.' : `OPEN WITH AN EXPLICIT FIGURE COUNT: "${chosen.length} fae figures arranged across the chamber: ${positionLabels.slice(0, chosen.length).join(', ')}" — name the count in your first 10 words to bias Flux toward rendering all ${chosen.length}. Then describe each figure in turn with her position label + stacked features (give roughly equal word-weight to each). Then the court-infrastructure backdrop wrapping them.`} Then ceremonial moment + composition + regalia + lighting + weather + magical flavor + chamber-life ambient detail + foreground anchor.${sacred_companion ? ' Then sacred companion woven in naturally.' : ''} Painted-fantasy oil-brushwork register throughout. NO preamble, NO headers, NO ━━━ markers, NO bullets, NO bold-labels.`;
  },
};
