/**
 * OutlawBot — archetype templates (scanned by lib/archetypeRegistry.js, matched
 * to archetypes.js by key). Each fn interpolates the composer-resolved slots into
 * a Sonnet brief. The per-render WESTERN-ART LOOK is prepended by index.js
 * buildBrief (OUTLAWBOT_LOOK_OVERRIDE) for look-enabled paths, so these templates
 * stay LOOK-NEUTRAL on render style (say "cinematic / vivid / luminous", never a
 * specific medium like "oil painting" or "photograph" — the rolled look owns that).
 */

// Shared gunslinger character-path builder. `who` is the gendered subject phrase.
function gunslingerBrief({ slots, sharedDNA, vibeDirective, who, pronoun }) {
  const { look, archetype, hair, wardrobe, weapon, action, setting, atmosphere, composition } = slots;
  const colorPalette = (sharedDNA && sharedDNA.colorPalette) || '';
  const appearance = look || hair; // female paths roll `look` (heritage+age+face+hair); male rolls `hair`
  return `You are a Western concept-art painter illustrating a VIVID, EXCITING single ${who} for OutlawBot. Red Dead Redemption / Tombstone / Sergio Leone / Frederic Remington / N.C. Wyeth picture-book lineage. A frame from an unmade Western epic — cinematic, characterful, a little dangerous. A movie-poster-worthy character moment.

━━━ THE HERO — A SINGLE ${who.toUpperCase()} (SOLO, FULL-BODY, MID-MOMENT) ━━━
ONE ${who} is the solo hero of the frame — full-body or three-quarter, planted in the world, captured MID-ACTION (never a stiff posed portrait). No second main figure. ${pronoun} is the unmistakable subject; the western setting frames ${pronoun.toLowerCase()}.

━━━ ${pronoun.toUpperCase()}R LOOK — LEAD WITH THIS, IT IS THE #1 RULE (vary it HARD every render) ━━━
${appearance}
This is the AUTHORITY on ${pronoun.toLowerCase()}r appearance — age, skin, exact facial features, and hair. Render EXACTLY this person, overriding any look implied elsewhere (this BEATS the art-look register for the FACE). OPEN the Flux prompt by describing THIS face. Make ${pronoun.toLowerCase()} a DISTINCT, specific individual — NEVER a generic flawless young fashion-model face, NEVER the same person twice. Render the stated AGE honestly (a real share are in their 30s and 40s, with faint lines and sun-weathering — not all youthful). ${pronoun === 'She' ? 'Her face is BARE and NATURAL — NO lipstick, NO eyeliner, NO eyeshadow, NO modern makeup of any kind (frontier women wore none); no glamour, no pin-up styling. ' : ''}Real, plain-to-striking, characterful frontier faces with genuinely different bone structure.

━━━ WHO ${pronoun.toUpperCase()} IS (role + bearing) ━━━
${archetype}

━━━ WARDROBE (period-true Old-West dress + hat) ━━━
${wardrobe}
Authentic, weathered, lived-in frontier clothing — dusty and real, grounded, never a clean or theatrical costume.

━━━ WEAPON / GEAR ━━━
${weapon}

━━━ THE ACTION (something is happening — a candid moment) ━━━
${action}

━━━ THE SETTING (the western world around ${pronoun.toLowerCase()}) ━━━
${setting}
Build real depth — the figure in the foreground/midground, the western environment receding behind into the distance.

━━━ ATMOSPHERE + LIGHT ━━━
${atmosphere}

━━━ COMPOSITION / FRAMING ━━━
${composition}
${colorPalette ? `\n━━━ COLOR ━━━\n${colorPalette}\n` : ''}
━━━ PERIOD ACCURACY + TASTE (HARD RULES) ━━━
1800s American Old-West frontier ONLY — no modern objects whatsoever (no cars, asphalt, plastic, neon, modern clothing or signage, no wristwatches — a pocket watch is fine; period telegraph poles are fine). NO sci-fi / steampunk / fantasy gear of any kind: all gear, weapons, armor and rigs are period leather, iron, brass, steel, cloth and wood ONLY — never mechanical arm-gauntlets, gadgetry, or futuristic devices. NO legible text / letters / words / numbers anywhere. ${who.charAt(0).toUpperCase() + who.slice(1)} is CAPABLE, weathered and real — strength and grit, NEVER sexualized, never fanservice, never a pin-up; clothing stays practical and fully covered (buttoned shirts, no plunging necklines). Authentic dignity for every kind of frontier person (vaquero, native rider, drifter), never caricature. Feet planted with visible ground contact and a cast shadow. If mounted, render exactly ONE anatomically-correct horse (never a second or doubled horse head).

━━━ MOOD ━━━
${(vibeDirective || '').slice(0, 150)}

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: the framing + the single ${who}, LEADING WITH ${pronoun.toUpperCase()}R DISTINCT FACE — heritage, age, exact facial features and hair], [${pronoun.toLowerCase()}r role/bearing], [the wardrobe + hat], [weapon/gear], [the action moment], [the western setting receding behind], [atmosphere + light]. The ${who} leads; the setting and light make it cinematic.

Output ONLY the raw 85-115 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO legible text in the image. Just the scene content.`;
}

module.exports = {
  // ── gunslinger paths (gender-split) ─────────────────────────────────────────
  OUTLAWBOT_GUNSLINGER_MALE: ({ slots, sharedDNA, vibeDirective }) =>
    gunslingerBrief({ slots, sharedDNA, vibeDirective, who: 'cowboy gunslinger', pronoun: 'He' }),

  OUTLAWBOT_GUNSLINGER_FEMALE: ({ slots, sharedDNA, vibeDirective }) =>
    gunslingerBrief({ slots, sharedDNA, vibeDirective, who: 'frontier gunslinger woman', pronoun: 'She' }),

  // ── frontier-town ─────────────────────────────────────────────────────────
  OUTLAWBOT_FRONTIER_TOWN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      town,
      structures = [],
      street_life,
      surround,
      atmosphere,
      sky,
      composition,
    } = slots;
    const colorPalette = (sharedDNA && sharedDNA.colorPalette) || '';

    return `You are a Western concept-art painter illustrating VIVID, EXCITING Old-West frontier-town scenes for OutlawBot. Red Dead Redemption / Tombstone / Sergio Leone / Frederic Remington / N.C. Wyeth picture-book lineage. A frame from an unmade Western epic — cinematic, romantic, alive, a little dangerous. Never a dull documentary snapshot.

━━━ THE HERO — A VIVID FRONTIER TOWN ━━━
The TOWN is the hero of the frame: a characterful Old-West frontier town / main street, rendered rich and believable with real depth and life. Make the viewer want to step into it.
${town}

━━━ COMPOSITION / FRAMING (follow this exactly — it sets the whole shot) ━━━
${composition}
ANTI-MONOTONY: never the same shot twice. Vary the camera per the framing above — wide establishing down the street, a low boardwalk angle, a view from the hills, a foreground-framed shot. Build REAL DEPTH: foreground detail, the midground town, the land and sky beyond.

━━━ THE BUILDINGS (render these three false-front structures lining the street) ━━━
  • ${structures[0] || ''}
  • ${structures[1] || ''}
  • ${structures[2] || ''}
Weathered timber, sun-bleached false fronts, hand-painted signage shapes (no legible text), boardwalks, hitching rails, lamplit or shuttered windows. Materially TRUE — grain, dust, wear, weight.

━━━ STREET LIFE (the candid narrative beat — something is HAPPENING) ━━━
${street_life}
People and horses bring the street alive — cowboys, townsfolk, riders, a wagon team — captured mid-moment, not posed. They are part of the LIVING SCENE and act as scale-provers, not portrait subjects (faces need not be detailed). Read the moment in 2 seconds.

━━━ THE LAND BEYOND ━━━
${surround}
The frontier landscape frames the town and proves the isolation and scale of the West.

━━━ ATMOSPHERE (dust, weather, light-quality) ━━━
${atmosphere}

━━━ THE BIG WESTERN SKY ━━━
${sky}
${colorPalette ? `\n━━━ COLOR ━━━\n${colorPalette}\n` : ''}
━━━ PERIOD ACCURACY (HARD RULE) ━━━
1800s American Old-West frontier ONLY. NO modern objects of any kind: no cars / trucks / automobiles, no paved or asphalt roads, no plastic, no neon, no modern signage or clothing, no contemporary anything. (Period telegraph poles and wires are fine; dirt/mud streets only.) Any hand-painted sign-board is BLANK or shows only illegible weathered marks — NEVER real readable letters, words, or numbers anywhere in the frame.

━━━ MOOD ━━━
${(vibeDirective || '').slice(0, 150)}

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: the FRAMING + the vivid frontier town as the hero], [the three false-front buildings lining the street], [the candid street life — people, horses, wagons, mid-moment], [the land beyond], [dust / weather / light atmosphere], [the big western sky]. The town is the hero; the people and horses make it ALIVE; the light and dust make it CINEMATIC.

Output ONLY the raw 85-115 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO legible text / letters / words / signs in the image. Just the scene content.`;
  },
};
