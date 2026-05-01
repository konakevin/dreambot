/**
 * DinoBot sensory meta — 2 contexts (dinosaur / scene) × 7 channels.
 * NO HUMANS — hard ban (per design doc).
 */

const SHARED_RULES = `━━━ HARD RULES ━━━
- 8-16 words per entry
- ONE concrete sensory image per entry
- NO direct color naming (lightcolor exception)
- NO duplicate verb+noun pairs
- NO HUMANS — never her/his/she/he. Use "the dinosaur" / "the herd" / "the prehistoric world"
- Aesthetic register: Jurassic / Cretaceous / Triassic / Mesozoic / paleo-art / NatGeo-prehistoric
- Vocabulary: scaled hide, pebbled skin, feathered crest, herd, raptor pack, sauropod neck,
  T-Rex jaw, Triceratops frill, Pterosaur wings, ankylosaur club, crested helmet, tar pit,
  cycad, ginkgo, fern grove, primeval swamp, volcanic plain, prehistoric beach, La Brea`;

const dinosaur = {
  smell: (n) => `${n} SMELL anchors for DinoBot's DINOSAUR context. NO HUMANS. Smells around / on the dinosaur.

EXAMPLES (DO NOT REUSE):
- "musky pebbled hide of the sauropod in the cycad grove"
- "sulfur from a distant volcanic vent drifting past the herd"
- "primeval swamp-rot rising around the wading hadrosaur"
- "blood-iron from a fresh kill clinging to the raptor's snout"
- "fern-and-cycad damp clinging to the brontosaur's neck-crest"

${SHARED_RULES}
━━━ DEDUP — share SCENT and DINO BODY/LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `${n} SOUND anchors for DinoBot's DINOSAUR context.

EXAMPLES (DO NOT REUSE):
- "sauropod footstep rumbling through the fern grove"
- "T-Rex roar echoing across the volcanic plain"
- "raptor claw clicking on tar-pit stone"
- "Pteranodon wing-snap above the ginkgo canopy"
- "Triceratops horn-clack as it lowers its head to drink"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `${n} TOUCH anchors for DinoBot's DINOSAUR context.

EXAMPLES (DO NOT REUSE):
- "ankylosaur club-tail dragging across the basalt floor"
- "raptor talon punching into the soft cycad bark"
- "Triceratops frill catching the morning sun across its scarred edge"
- "swamp water beading on the brontosaur's scaled flank"
- "amber resin clinging to the velociraptor's claw"

${SHARED_RULES}
━━━ DEDUP — share DINO PART and SENSATION VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `${n} TEMPERATURE anchors for DinoBot's DINOSAUR context.

EXAMPLES (DO NOT REUSE):
- "cretaceous-noon heat shimmering on the sauropod's broad back"
- "tar-pit warmth pulsing against the trapped raptor"
- "geothermal-vent heat drifting past the wading hadrosaur"
- "morning-jungle cool dripping from the brontosaur's underside"
- "volcanic ash-warmth radiating across the herd"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and DINO LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `${n} WEIGHT anchors for DinoBot's DINOSAUR context.

EXAMPLES (DO NOT REUSE):
- "sauropod foot pressing the prehistoric ground into a deep print"
- "T-Rex tail dragging through the muddy fern grove"
- "Triceratops frill weighing the head down as it grazes"
- "Pteranodon wingspan casting a shadow over the herd"
- "the entire herd moving together, ground trembling beneath them"

${SHARED_RULES}
━━━ DEDUP — share DINO PART and SURFACE/MOTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `${n} AIR anchors for DinoBot's DINOSAUR context.

EXAMPLES (DO NOT REUSE):
- "ash-cloud drifting around the herd from the distant eruption"
- "swamp-mist curling around the brontosaur's submerged feet"
- "raptor breath-cloud trailing in the cool dawn"
- "Pteranodon downdraft scattering ferns below"
- "spore-drift swirling around the grazing hadrosaur"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and DINO LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `${n} LIGHTCOLOR anchors for DinoBot's DINOSAUR context.

EXAMPLES (DO NOT REUSE):
- "volcanic-orange backlight silhouetting the T-Rex against the eruption"
- "cretaceous-amber sunbeam lighting the sauropod's neck arc"
- "moonlit-blue rim sculpting the raptor pack stalking through the cycad grove"
- "ash-grey twilight wash across the herd"
- "sulphur-yellow glow rising from the tar-pit beneath the trapped dinosaur"

━━━ COLOR FAMILIES ━━━
VOLCANIC-ORANGE (12-14), CRETACEOUS-AMBER (10-12), MOONLIT-BLUE (8-10), ASH-GREY-TWILIGHT (8-10), SULPHUR-YELLOW (6-8), JURASSIC-EMERALD (6-8), TAR-PIT-RUST (6-8), DAWN-CORAL (6-8), STORM-VIOLET (4-6), HUMID-JUNGLE-CYAN (4-6).

━━━ DIRECTION SPREAD ━━━ key (10-12), rim (12-14), backlight (10-12), shaft (8-10), wash (8-10), underlight (6-8).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (dino body — back, neck, jaw, tail, frill, silhouette).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

const scene = {
  smell: (n) => `${n} SMELL anchors for DinoBot's PURE-SCENE prehistoric environment. NO HUMANS, NO LIVE DINOSAURS — just empty Mesozoic landscape.

EXAMPLES (DO NOT REUSE):
- "sulfur drifting from the volcanic vent across the ash plain"
- "fern-grove damp settling over the primeval swamp"
- "tar-pit black-ooze rising under the cycad shadow"
- "ginkgo-leaf decay along the prehistoric riverbank"
- "amber-resin curing on the petrified log"

${SHARED_RULES}
━━━ DEDUP — share SCENT and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  sound: (n) => `${n} SOUND anchors for DinoBot's PURE-SCENE prehistoric environment.

EXAMPLES (DO NOT REUSE):
- "wind howling across the volcanic plain"
- "drip of magma cooling in the lava tunnel"
- "primeval cicada drone across the cretaceous afternoon"
- "tar-pit bubbles popping in the still afternoon"
- "ginkgo leaves falling in the still primeval forest"

${SHARED_RULES}
━━━ DEDUP — share SOURCE and QUALITY = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  touch: (n) => `${n} TOUCH anchors for DinoBot's PURE-SCENE prehistoric environment.

EXAMPLES (DO NOT REUSE):
- "ash settling on the basalt riverbank stones"
- "cycad fronds rough at the swamp edge"
- "amber resin slowly capturing a fallen leaf"
- "volcanic glass crusting the cooling lava flow"
- "fern moss creeping over the petrified log"

${SHARED_RULES}
━━━ DEDUP — share TEXTURE and SURFACE = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  temperature: (n) => `${n} TEMPERATURE anchors for DinoBot's PURE-SCENE.

EXAMPLES (DO NOT REUSE):
- "volcanic heat radiating from the lava plain"
- "tar-pit warmth pulsing across the cycad floor"
- "primeval-jungle humidity sticking the air"
- "morning-mist cool blanketing the swamp"
- "ash-warm haze hanging over the mesozoic ridge"

${SHARED_RULES}
━━━ DEDUP — share THERMAL SOURCE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  weight: (n) => `${n} WEIGHT anchors for DinoBot's PURE-SCENE.

EXAMPLES (DO NOT REUSE):
- "great cycad sagging into the swamp under its own weight"
- "petrified log half-buried in primeval mud"
- "ash-laden ginkgo bowed beneath volcanic fall"
- "amber-pit pressing the prehistoric forest floor"
- "lava-flow stone cooling thick across the basalt valley"

${SHARED_RULES}
━━━ DEDUP — share OBJECT and WEIGHT VERB = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  air: (n) => `${n} AIR anchors for DinoBot's PURE-SCENE.

EXAMPLES (DO NOT REUSE):
- "ash drifting across the volcanic plain"
- "spore-cloud rising from the cycad grove"
- "swamp-mist hanging over the primeval water"
- "ginkgo leaves spinning in the still afternoon"
- "tar-pit bubbles drifting in the syrupy black"

${SHARED_RULES}
━━━ DEDUP — share PARTICLE and LOCATION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,

  lightcolor: (n) => `${n} LIGHTCOLOR anchors for DinoBot's PURE-SCENE prehistoric environment.

EXAMPLES (DO NOT REUSE):
- "volcanic-orange beam falling across the cooling lava plain"
- "cretaceous-amber sunshaft cutting through the cycad grove"
- "moonlit-blue pooling on the prehistoric river-stones"
- "sulphur-yellow glow rising from the tar pit"
- "jurassic-emerald canopy diffusing through the fern grove"

━━━ COLOR FAMILIES ━━━ Same as dinosaur: VOLCANIC-ORANGE (12-14), CRETACEOUS-AMBER (10-12), MOONLIT-BLUE (8-10), ASH-GREY-TWILIGHT (8-10), SULPHUR-YELLOW (6-8), JURASSIC-EMERALD (6-8), TAR-PIT-RUST (6-8), DAWN-CORAL (6-8), STORM-VIOLET (4-6), HUMID-JUNGLE-CYAN (4-6).

━━━ DIRECTION SPREAD ━━━ shaft (12-14), key (10-12), wash (10-12), rim (8-10), backlight (4-6).

━━━ HARD RULES ━━━ 8-16 words; COLOR + DIRECTION + IMPACT POINT (prehistoric environmental feature).
━━━ DEDUP — share COLOR FAMILY and DIRECTION = too similar.
━━━ OUTPUT ━━━ JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
};

module.exports = { metaPrompts: { dinosaur, scene } };
