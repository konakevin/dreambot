/**
 * OceanBot sensory meta — 2 contexts (mermaid / scene) × 7 channels.
 * mermaid is HYBRID: half-human female upper body + scaled fish lower body.
 * Uses "her" pronouns AND scale/tail/cold-blooded anatomy.
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry
- ONE concrete sensory image per entry
- NO direct color naming (lightcolor exception)
- NO duplicate verb+noun pairs
- Aesthetic register: oceanic / coastal / Aivazovsky / Turner / NatGeo-marine
- Vocabulary: kelp, coral, reef, anemone, atoll, lagoon, cliff-face, basalt-shore, sea-stack,
  bioluminescent-algae, jellyfish-bloom, manta-ray, krill, abyssal-trench, hydrothermal-vent,
  iceberg, fjord, sea-cave, sea-arch, foam, swell, breakwater, lighthouse, mooring-buoy`;

const mermaid = {
  smell: (n) => `${n} SMELL anchors for OceanBot's MERMAID context. HYBRID: half-human upper / scaled fish lower. Anchors can reference both her bare upper body AND her scaled tail.

EXAMPLES (DO NOT REUSE):
- "kelp and salt-spray clinging to her wet hair"
- "tide-pool brine on her sun-warmed scales"
- "the cold-deep mineral scent of the open ocean around her"
- "phytoplankton phosphorescence in the water at her tail"
- "ambergris and old wood drifting from a distant ship"

${SHARED_RULES}
━━━ DEDUP — share SCENT and BODY/LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `${n} SOUND anchors for OceanBot's MERMAID context.

EXAMPLES (DO NOT REUSE):
- "her tail slapping the surface as she submerges"
- "the soft slap of wave against her bare collarbone"
- "her low whale-song echoing off the cliff"
- "scales clicking as she resettles on the rocks"
- "wind rattling the wet kelp at her elbow"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `${n} TOUCH anchors for OceanBot's MERMAID context. Half-human (bare shoulder, wet hair) + scale/tail anatomy.

EXAMPLES (DO NOT REUSE):
- "salt-water beading along her scaled tail"
- "warm tide-pool stone smooth under her fingers"
- "kelp-strand dragging across her bare shoulder"
- "barnacle-crusted rock cool under her palm"
- "her wet hair clinging to her bare back"

${SHARED_RULES}
━━━ DEDUP — share BODY PART and SENSATION VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `${n} TEMPERATURE anchors for OceanBot's MERMAID context.

EXAMPLES (DO NOT REUSE):
- "ocean-cold leaching up her tail from the deep"
- "morning sun warming her exposed scales"
- "warm tropical lagoon water lapping at her ribs"
- "polar chill numbing the skin where her tail meets her hip"
- "her cold-blooded hand resting on warm stone"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and BODY PART = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `${n} WEIGHT anchors for OceanBot's MERMAID context. Tail mass + held objects + wet hair.

EXAMPLES (DO NOT REUSE):
- "her tail's full mass curling around the rock"
- "wet hair pulling at her temples"
- "a glass float wrapped in twine looped over her arm"
- "an ancient sailor's brass compass cradled in her two hands"
- "barnacle-crusted chain dragged from a wreck wrapped in her grip"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and BODY PART = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `${n} AIR anchors for OceanBot's MERMAID context.

EXAMPLES (DO NOT REUSE):
- "sea spray drifting around her in the wave-spray"
- "morning fog haloing her on the rocks"
- "spray-mist clinging to her exposed shoulders"
- "her breath cloud trailing in the polar morning"
- "phosphorescent particles glowing where her tail moves"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and MOTION VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `${n} LIGHTCOLOR anchors for OceanBot's MERMAID context. Lighting on her hybrid body — face, scales, wet hair, tail.

EXAMPLES (DO NOT REUSE):
- "Aivazovsky-amber lantern key flooding her face from the distant ship"
- "moonlit-cyan rim sculpting her tail in the night water"
- "bioluminescent-violet underlight rising from the water at her body"
- "Turner-orange sunset wash across her wet hair"
- "polar-aurora green flickering over her bare shoulder"

━━━ COLOR FAMILIES ━━━
AIVAZOVSKY-AMBER (10-12), TURNER-ORANGE-SUNSET (10-12), MOONLIT-CYAN (10-12), BIOLUMINESCENT-VIOLET (8-10), POLAR-AURORA-GREEN-MAGENTA (6-8), TROPICAL-TURQUOISE (8-10), GHOST-GREEN-PHOSPHOR (4-6), LIGHTHOUSE-AMBER (4-6).

━━━ DIRECTION SPREAD ━━━ key (10-12), rim (12-14), underlight (10-12), shaft (8-10), wash (6-8).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (her face / scales / tail / wet hair / silhouette).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const scene = {
  smell: (n) => `${n} SMELL anchors for OceanBot's PURE-SCENE context. NO HUMANS.

EXAMPLES (DO NOT REUSE):
- "salt-spray and seaweed at the high-tide line"
- "deep-ocean brine and ozone in the storm air"
- "tropical hibiscus drifting from the atoll"
- "old wood and tar from the abandoned wreck"
- "polar-air iciness mixed with whale exhale-mist"

${SHARED_RULES}
━━━ DEDUP — share SCENT and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `${n} SOUND anchors for OceanBot's PURE-SCENE context.

EXAMPLES (DO NOT REUSE):
- "wave thundering on the basalt sea-cliff"
- "humpback song echoing in the open ocean"
- "rigging creaking on the abandoned schooner"
- "deep-sea sub-sonic groan rising from the abyss"
- "wind howling through the lighthouse stones"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `${n} TOUCH anchors for OceanBot's PURE-SCENE context.

EXAMPLES (DO NOT REUSE):
- "salt crusting on the lighthouse iron"
- "kelp wrapping the wreck's broken mast"
- "barnacle texture along the harbor stones"
- "tide receding from the tide-pool"
- "frost-rime cementing the polar buoy"

${SHARED_RULES}
━━━ DEDUP — share TEXTURE and SURFACE = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `${n} TEMPERATURE anchors for OceanBot's PURE-SCENE context.

EXAMPLES (DO NOT REUSE):
- "tropical-noon heat shimmering off the lagoon"
- "polar-cold seeping out of the iceberg"
- "geothermal warmth rising in the deep-sea vent"
- "morning-fog cool drifting from the bay"
- "abyssal-cold radiating up from the trench"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `${n} WEIGHT anchors for OceanBot's PURE-SCENE context.

EXAMPLES (DO NOT REUSE):
- "century-old galleon settling deeper into the seabed"
- "iceberg shifting with a thunderous groan"
- "kraken's coil pulling the schooner to one side"
- "stone lighthouse anchored against the storm"
- "ancient brass anchor half-buried in coral"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and WEIGHT VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `${n} AIR anchors for OceanBot's PURE-SCENE context.

EXAMPLES (DO NOT REUSE):
- "sea-spray haloing the lighthouse on the cliff"
- "spray-mist drifting across the storm-deck"
- "phosphorescent plankton swirling in the boat's wake"
- "polar-snow drifting across the iceberg face"
- "morning-fog rolling in across the harbor"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `${n} LIGHTCOLOR anchors for OceanBot's PURE-SCENE context.

EXAMPLES (DO NOT REUSE):
- "Aivazovsky-amber lantern glow on the storm-tossed deck"
- "Turner-orange sunset wash across the open ocean"
- "moonlit-cyan rim along the wave crest"
- "bioluminescent-violet underlight rising from the kelp forest"
- "polar-aurora green-and-magenta flickering above the iceberg"

━━━ COLOR FAMILIES ━━━ Same as mermaid: AIVAZOVSKY-AMBER (10-12), TURNER-ORANGE-SUNSET (10-12), MOONLIT-CYAN (10-12), BIOLUMINESCENT-VIOLET (8-10), POLAR-AURORA-GREEN-MAGENTA (6-8), TROPICAL-TURQUOISE (8-10), GHOST-GREEN-PHOSPHOR (4-6), LIGHTHOUSE-AMBER (8-10).

━━━ DIRECTION SPREAD ━━━ key (10-12), rim (10-12), shaft (10-12), wash (10-12), underlight (8-10).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (oceanic environmental feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

module.exports = { metaPrompts: { mermaid, scene } };
