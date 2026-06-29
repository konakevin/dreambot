/**
 * gothbot archetypes — path-bespoke archetype definitions.
 *
 * Each archetype declares which axis slots the path requires + how many
 * to pick per slot. The composer reads this and assembles a brief per
 * the corresponding archetype template in ./archetype-templates.js.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new archetype: add an entry here + the matching template
 * function in ./archetype-templates.js + reference it from one of the
 * bot's path files via { archetype: 'YOUR_NAME', pools: {...} }.
 */

module.exports = {
  GOTHBOT_GOTH_MALE_CLOSEUP: {
    description:
      'PATH-BESPOKE — GothBot goth-male-closeup path (2026-05-15 migration). MYSTERIOUS, OMINOUS, DEADLY dark-aristocrat closeups — male-locked. Vampire-lord / dark-prince / shadow-assassin / dark-warlock / death-god / dark-hunter closeups in tight frame (face + throat + one shoulder). Castlevania / Bloodborne / Crimson-Peak / Witcher dark-male-aristocrat lineage. Gender-locked MALE (he/his/man). Solo only. Character at LARGE anchor (face fills upper half of frame). Candid-moment energy, not posed. NSFW-clean. 10 path-bespoke axes (archetype / skin / eyes / hair_color / hairstyle / face_detail / wardrobe / accessory / candid_moment / camera_perspective) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'archetype',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'face_detail',
        'wardrobe',
        'accessory',
      ],
      path: ['candid_moment', 'camera_perspective'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: ['LARGE'],
  },

  GOTHBOT_VAMPIRE_GIRLS_2: {
    description:
      'PATH-BESPOKE — GothBot vampire-girls-2 path (2026-05-15 migration). STRICT VAMPIRE bust portraits — DEAD-PALE corpse-skin, HEAVY DARK GOTH MAKEUP, GLOWING eyes radiating inhuman light, DEMONIC tell (fang / clawed fingertip / slit pupil). Stylized dark-fantasy splash painting / gothic horror character art aesthetic. NOT old-master oil, NOT museum patina, NOT smooth-digital, NOT pretty-girl-in-dress. Gender-locked FEMALE. Solo only. Character at LARGE anchor (bust 40-50% of frame). Reuses 9 existing production-scale vampire pools (compositions / menace_features / settings / killer_details / hair / wardrobe / archetypes / ethnicities / lighting — already at 100 entries each). Unique TEMPLATE: weaves ethnicity + makeup + glow + hair + wardrobe + posture into ONE UNIFIED vampire description (no separate fields for Sonnet to summarize away).',
    slots: {
      universal: ['atmosphere'],
      bot: [],
      characterDnaAxes: ['archetype', 'ethnicity', 'hair', 'wardrobe', 'menace_feature'],
      path: ['composition', 'scene', 'hero_element', 'lighting'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: ['LARGE'],
  },

  GOTHBOT_THE_DARK_PRINCE: {
    description:
      'PATH-BESPOKE — GothBot the-dark-prince path (2026-06-10 NEW). The MALE counterpart to vampire-girls-2: STRICT MALE dark-aristocrat bust portraits — vampire-lord / cursed-prince / dark-sorcerer. Opulent, aristocratic, beautiful-but-EVIL, ancient menace. GLOWING inhuman eyes + a DEMONIC tell (fangs / clawed fingertip / slit pupil) + undead pallor. Distinct from the male HUNTER paths (goth-male-full-body / vampire-hunter-in-action) — this is the refined VILLAIN, not the hunter. Gender-locked MALE. Solo only. LARGE bust (40-50% of frame). 8 bespoke male pools + reused VAMPIRE_LIGHTING + universal atmosphere. Unique TEMPLATE: weaves ethnicity + hair + wardrobe + menace + glow into ONE UNIFIED dark-prince description (clone of vampire-girls-2 template, male-coded). 🚫 NEVER androgynous-pretty-boy, NEVER a hunter, NEVER bare-chested.',
    slots: {
      universal: ['atmosphere'],
      bot: [],
      characterDnaAxes: ['archetype', 'ethnicity', 'hair', 'wardrobe', 'menace_feature'],
      path: ['composition', 'scene', 'hero_element', 'lighting'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: ['LARGE'],
  },

  GOTHBOT_THE_HAUNTING: {
    description:
      'PATH-BESPOKE — GothBot the-haunting path (2026-06-10 NEW). A SOLO TRANSLUCENT GHOST / spectre (lady in white / weeping bride / drowned maiden / veiled mourner / spectral nun / phantom lord / ghostly knight) drifting an empty gothic place. Fills the "no ghosts" gap — sorrowful, beautiful, eerie (Crimson-Peak / The-Woman-in-Black / gothic-ghost-story). The TRANSLUCENCY (see-through, semi-transparent, edges-to-mist, feet faded) is the signature money-shot + the hard part. NOT a vampire, NOT a monster, NOT gore. 6 path-bespoke axes (spectre / visage / translucency / setting / light / composition) + 50%-gated manifestation. The VISAGE axis (hair colour/style + complexion + features) makes each ghost a DISTINCT woman, and her FACE always stays clear/defined (never blurred-out). universal:[] — the path self-lights via the cold ghost-light pool.',
    slots: {
      universal: [],
      bot: [],
      path: ['spectre', 'visage', 'translucency', 'setting', 'light', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'manifestation', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_THE_COVEN: {
    description:
      'PATH-BESPOKE — GothBot the-coven path (2026-06-10 NEW). A SOLO FEMALE WITCH / sorceress MID-SPELL — magic visibly erupting (glowing sigils / witchfire / conjured beasts / runes in the air). Every existing female path is a vampire/goth-beauty; none is a WITCH doing magic. The SPELL is the signature money-shot — magic ACTIVELY happening, never a static pose. Hocus-Pocus / The-Witch / Suspiria / dark-fairy-tale lineage. NOT a vampire, NOT a goth pin-up, NOT a cartoon-green hag. Solo. 5 path-bespoke axes (witch / spell / action / lair / composition) + 50%-gated familiar (a small animal companion). universal:[] — the path self-lights via her spell-glow.',
    slots: {
      universal: [],
      bot: [],
      path: ['witch', 'spell', 'action', 'lair', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'familiar', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_MOONLIT_MAIDEN: {
    description:
      'PATH-BESPOKE — GothBot moonlit-maiden path (2026-06-11 NEW). Preserves the SOFTER "R0" ghost look Kevin hearted: a LONE ETHEREAL BEAUTIFUL WOMAN in a GORGEOUS, atmospheric, moonlit gothic scene — dreamy, romantic-melancholic, cinematic, cold-blue. The grand haunting SCENE and the graceful woman are CO-EQUAL. NOT the strict see-through ghost-mechanics or caught-on-camera uncanny poses of the-haunting — this is sublime gothic beauty + melancholy. Anime/painterly medium. 5 path-bespoke axes (maiden / visage / scene / moonlight / composition) + 50%-gated accent (a soft atmospheric detail). The VISAGE axis keeps each woman distinct + her face always clear. universal:[] — the scene is self-lit by the moon.',
    slots: {
      universal: [],
      bot: [],
      path: ['maiden', 'visage', 'scene', 'moonlight', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'accent', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_GOTH_CLOSEUP: {
    description:
      'PATH-BESPOKE — GothBot goth-closeup path (2026-05-15 migration). HAUNTINGLY BEAUTIFUL dark-seductress closeups — SEXY + SULTRY + EVIL + FEISTY gothic women in tight frame (face + throat + one shoulder). Castlevania / Crimson Peak / Bloodborne / Devil-May-Cry dark-beauty lineage. Gender-locked FEMALE. Solo only. Character at LARGE anchor (face fills upper half of frame). Candid-moment energy, not posed. NSFW-clean (no nipple/cleavage emphasis). 10 path-bespoke axes (archetype / skin / eyes / hair_color / hairstyle / makeup / wardrobe / accessory / candid_moment / camera_perspective) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'archetype',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'makeup',
        'wardrobe',
        'accessory',
      ],
      path: ['candid_moment', 'camera_perspective'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: ['LARGE'],
  },

  GOTHBOT_COZY_GOTH: {
    description:
      "PATH-BESPOKE — GothBot cozy-goth path (2026-05-15 migration, R3 figure-accent added). LAYERED WITCH'S-LAIR / WIZARD'S-WORKROOM / OCCULT-APOTHECARY interiors — warm-dark gothic spaces with a TWIST OF MAGIC, ALWAYS inhabited by a small mysterious-feminine figure (gypsy fortune-teller / vampire-noblewoman / mysterious-witch / cloaked-mystic / dark-baroness) at deep midground 8-15% of frame as SCALE-PROVER ONLY. Interior stays the hero at 80%+ visual weight. GOTH + TWIST OF MAGIC + small mysterious witness. 5 path-bespoke axes (interior_space / magical_glow_item pickN:3 / occult_artifact pickN:3 / figure_accent / ambient_atmosphere) + universal lighting + atmosphere.",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'interior_space',
        'magical_glow_item',
        'occult_artifact',
        'figure_accent',
        'ambient_atmosphere',
      ],
    },
    pickN: { magical_glow_item: 3, occult_artifact: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_CASTLEVANIA_SCENE: {
    description:
      "PATH-BESPOKE — GothBot castlevania-scene path (2026-05-15 migration). STRICT KONAMI CASTLEVANIA aesthetic — Dracula's-castle / Symphony-of-the-Night / Bloodlines / Lords-of-Shadow / Order-of-Ecclesia visual canon. Ayami-Kojima painted concept-art lineage. STRUCTURE IS THE HERO — the Castlevania building dominates the frame with art-nouveau ornate gothic detail. BOLD + LUSH + FULL-COLOR-SATURATED palette (royal violet / deep crimson / sapphire / gold-leaf / emerald / amber). 6 path-bespoke axes (structure / architectural_detail pickN:3 / inner_light / accent_creature 80%-gated / spice_decoration / sky_layer) + universal lighting + atmosphere. Differentiator vs gothic-architecture: STRICTLY Castlevania-game-coded — Wallachian / Vlad-Tepes-coded / Bram-Stoker-Dracula-coded — NOT Bloodborne, NOT generic-gothic, NOT Hammer-horror.",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['structure', 'architectural_detail', 'inner_light', 'spice_decoration', 'sky_layer'],
    },
    pickN: { architectural_detail: 3 },
    conditionalLayer: { slot: 'accent_creature', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // castle-moonscape (2026-06-29, new) — TWO co-equal heroes: a crazy-beautiful
  // gothic castle / grand haunted house AND a bright full moon dominating the sky.
  // Bonus bats/crows (gated). Mirrors the castlevania-scene scene shape but
  // ELEVATES the moon to its own hero axis (moonscape), drops spice_decoration.
  // AXIS-CLEAN: structure=building, moonscape=the moon, sky_layer=rest of the night
  // sky, accent_creature=bats/crows. Look-enabled (rolls the gothbot look register).
  GOTHBOT_CASTLE_MOONSCAPE: {
    description:
      'PATH-BESPOKE — GothBot castle-moonscape path (2026-06-29, R1). TWO co-equal heroes: a crazy-beautiful COOL SPRAWLING gothic CASTLE / grand HAUNTED HOUSE and a bright FULL MOON (cool-biased color) dominating the night sky. Bonus bats/crows. R1 added a COMPOSITION axis to break the boring central-single-tower lock + cool-biased the moon/sky. 6 path axes (composition / structure / architectural_detail pickN:3 / inner_light / moonscape / sky_layer) + accent_creature 65%-gated (bats/crows) + universal lighting + atmosphere. AXIS-CLEAN: composition owns FRAMING, structure owns the BUILDING, moonscape owns the MOON, sky_layer owns the rest of the night sky. Look-enabled (rolls the gothbot look register).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['composition', 'structure', 'architectural_detail', 'inner_light', 'moonscape', 'sky_layer'],
    },
    pickN: { architectural_detail: 3 },
    // bats/crows show ~85% of the time (Kevin wants strong ambience).
    conditionalLayer: { slot: 'accent_creature', gate: 0.85 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_GOTHIC_ARCHITECTURE: {
    description:
      'PATH-BESPOKE — GothBot gothic-architecture path (2026-05-15 bespoke migration). STRUCTURE IS THE HERO with MASSIVE VERTICAL EPIC SCALE — towering, clawing upward, dwarfing everything. Inner dark-magic light glows from within. Ornate architectural detail porn. Two accent layers: accent_creature (80%-gated dark-wildlife) + spice_decoration (100% small atmospheric flourish — vivid moons, lanterns, wisps, sigils). Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls lineage. Exterior-only. 6 path-bespoke axes (structure / architectural_detail pickN:3 / inner_light / accent_creature 80%-gated / spice_decoration / sky_layer) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['structure', 'architectural_detail', 'inner_light', 'spice_decoration', 'sky_layer'],
    },
    pickN: { architectural_detail: 3 },
    conditionalLayer: { slot: 'accent_creature', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_THE_SANCTUM: {
    description:
      'PATH-BESPOKE — GothBot the-sanctum path (2026-06-10 NEW). gothic-architecture turned INWARD: the GRAND COLD gothic INTERIOR is the hero (80%+ of frame) — cathedral nave / crypt of kings / catacomb ossuary / cursed library / throne hall / grand stairwell / mausoleum rotunda / flooded undercroft. The camera is INSIDE looking down the length / up the vault / across the chamber. Distinct from cozy-goth (WARM/cluttered/intimate) — this is VAST / COLD / REVERENT / awe-and-dread. The LIGHT WITHIN is the signature money-shot. Castlevania / Bloodborne / Crimson-Peak / Dark-Souls lineage. 5 path-bespoke axes (interior / detail pickN:3 / inner_light / focal_feature / atmosphere) + 70%-gated accent (tiny scale-prover figure or dark interior wildlife). universal:[] — the bot LIGHTING/ATMOSPHERES pools are exterior-weather-coded and would fight a sealed interior; the path supplies its own light + air.',
    slots: {
      universal: [],
      bot: [],
      path: ['interior', 'detail', 'inner_light', 'focal_feature', 'atmosphere'],
    },
    pickN: { detail: 3 },
    conditionalLayer: { slot: 'accent', gate: 0.7 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_THE_FROST_GARDEN: {
    description:
      'PATH-BESPOKE — GothBot the-frost-garden path (2026-06-10 NEW). A CURSED FROZEN gothic GARDEN / CONSERVATORY is the hero — black-rose courts, frozen fountains, weeping statuary, derelict glass greenhouses, dead orchards, frost-glazed arbors, hedge mazes. Softer painterly scene register (anime medium). FROST/ICE is the signature money-shot. Mournful, beautiful, still. Crimson-Peak / Sleepy-Hollow / Pan\'s-Labyrinth / gothic-fairy-tale lineage. NO CHARACTERS as subject (tiny scale-prover accent only). 5 path-bespoke axes (garden / flora pickN:2 / frost_feature / statuary / light_sky) + 60%-gated accent (dark garden wildlife or tiny distant figure). universal:[] — the path self-lights via light_sky (the bot LIGHTING/ATMOSPHERES are castle-weather-coded).',
    slots: {
      universal: [],
      bot: [],
      path: ['garden', 'flora', 'frost_feature', 'statuary', 'light_sky'],
    },
    pickN: { flora: 2 },
    conditionalLayer: { slot: 'accent', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_TWILIGHT_GOTHIC: {
    description:
      'PATH-BESPOKE — GothBot twilight-gothic path (2026-06-10 NEW). A gothic SCENE at the MAGIC HOUR — dawn / dusk / golden-hour / blue-hour / foggy-morning. Fills the "all-night" gap: the soft warm-cool transitional LIGHT is the hero quality (the signature money-shot). Castle ridges, hill-top cemeteries, foggy abbey ruins, moorland churches, cliff monasteries, misty villages, lone bridges, standing stones. Melancholy-beautiful, Caspar-David-Friedrich + Sleepy-Hollow + Crimson-Peak lineage. NOT deep night / NOT moonlit-dark (those are dark-landscape / gothic-vista). NO CHARACTERS as subject (tiny accent only). 5 path-bespoke axes (scene / twilight_light / sky / atmosphere / foreground) + 50%-gated accent. universal:[] — the path self-lights via twilight_light (the bot LIGHTING/ATMOSPHERES are night/castle-coded).',
    slots: {
      universal: [],
      bot: [],
      path: ['scene', 'twilight_light', 'sky', 'atmosphere', 'foreground'],
    },
    pickN: {},
    conditionalLayer: { slot: 'accent', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_GOTHIC_VISTA: {
    description:
      'PATH-BESPOKE — GothBot gothic-vista path (2026-05-15 migration). Sister to dark-landscape but with "LAND IS ALIVE" mandate: every render saturated with dark-wildlife (crows / bats / wolves / fireflies), bioluminescent dark-flora (nightshade / moonflowers / glowing-fungi), structures glowing-from-within (witch-fire windows / candle-towers), and SUPERNATURAL-PRESENCE (fog-moving-wrong / shadow-pools / will-o-wisps). Haunted gorgeous awe-and-dread. NO CHARACTERS. 5 path-bespoke axes (biome / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'architecture', 'surprise_element', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_MONSTER_PROWL: {
    description:
      'PATH-BESPOKE — GothBot monster-prowl (2026-05-25 R2 monster-as-HERO redesign). A SOLO epic gothic MONSTER is the unmistakable HERO of the frame (50-65%) — vampire-lord / werewolf / gargoyle / horned-demon / hellhound / harpy / shade (defined living-darkness figure) — NO lich, NO skeletal-undead, NO dragon, NO succubus — rendered in lavish, terrifying, fully-readable detail, mid-action, dramatically lit, in a gothic setting. Castlevania-boss / Bloodborne-beast / Devil-May-Cry-demon / Van-Helsing-monster lineage. The monster DOMINATES; the gothic stage is a dramatic backdrop, NOT a dwarfing vista (the R1/legacy version made the creature a tiny lost silhouette swallowed by an epic backdrop). Solo only — NO hunter (assassin paths), NO combat (combat path), NO second figure, NO gore / NO mid-bite-on-victim. Reuses CREATURE_ARCHETYPE + CREATURE_WILD_ACTION + ASSASSIN_STAGE (DROPPED the dwarfing ASSASSIN_EPIC_BACKDROP axis — its "dominating / swallowing the frame" pool DNA is what shrank the monster). 3 path axes + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['creature', 'action', 'stage'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },
  GOTHBOT_MONSTER_PROWL_VICTORIAN: {
    description:
      'PATH-BESPOKE — GothBot monster-prowl (2026-05-25 R2 monster-as-HERO redesign). A SOLO epic gothic MONSTER is the unmistakable HERO of the frame (50-65%) — vampire-lord / werewolf / gargoyle / horned-demon / hellhound / harpy / shade (defined living-darkness figure) — NO lich, NO skeletal-undead, NO dragon, NO succubus — rendered in lavish, terrifying, fully-readable detail, mid-action, dramatically lit, in a gothic setting. Castlevania-boss / Bloodborne-beast / Devil-May-Cry-demon / Van-Helsing-monster lineage. The monster DOMINATES; the gothic stage is a dramatic backdrop, NOT a dwarfing vista (the R1/legacy version made the creature a tiny lost silhouette swallowed by an epic backdrop). Solo only — NO hunter (assassin paths), NO combat (combat path), NO second figure, NO gore / NO mid-bite-on-victim. Reuses CREATURE_ARCHETYPE + CREATURE_WILD_ACTION + ASSASSIN_STAGE (DROPPED the dwarfing ASSASSIN_EPIC_BACKDROP axis — its "dominating / swallowing the frame" pool DNA is what shrank the monster). 3 path axes + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['creature', 'action', 'stage'],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_MONSTER_PROWL_INKED: {
    description:
      'PATH-BESPOKE — GothBot monster-prowl-inked (2026-05-25). Clone of GOTHBOT_MONSTER_PROWL but in a CLEAN DETAILED INKED dark-fantasy illustration medium (NO Berserk/Miura — that token fused monsters into gnarled trees) with a COLOR-MOOD SPECTRUM axis that rolls from BLAZING-VIVID-SATURATED to deeply-MUTED across renders (Kevin hearted both ends + wants the spectrum between). Same monster-as-hero + lush-stage + 60%-gated drama. Mandate: the monster is a SOLID distinct creature, NOT fused into the trees/rocks/background. Path axes: creature / action / stage / color_mood + drama (60%-gated) + universal lighting/atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['creature', 'action', 'stage'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_GARGOYLES: {
    description:
      'PATH-BESPOKE — GothBot gargoyles path = GARGOYLES ONLY (2026-05-25 pivot). Super high-def Weta-Workshop + Unreal Engine 5 realistic RENDER of the most GNARLY, MEAN, ferocious yet ORNATELY-CARVED gargoyles, dialed to 11 + scroll-stopping, in action (flying / perched / attacking / scouting / lurking). Bespoke gargoyle axes: creature (gnarly+ornate stone gargoyle) / action (gargoyle in motion) / eye_glow (glowing eyes) / feature (signature gnarly+ornate detail) / stage (lush gothic) + drama (60%-gated) + universal lighting/atmosphere. Full-spectrum saturated color held against deep ominous shadow.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['creature', 'action', 'eye_glow', 'feature', 'scene_color', 'stage'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_GOTH_MALE_FULL_BODY_AXIS: {
    description:
      "PATH-BESPOKE — GothBot goth-male-full-body-axis (2026-05-22 R2 RESET — uprooted emo-vampire-aristocrat aesthetic). Elite VAMPIRE HUNTER full-body cinematic poster moment — John Wick of vampire hunters. Classic-lore hunters only (Belmont / Witcher of the School of Wolf / Van Helsing / Blade / Hellsing / Underworld Death-Dealer / Castlevania Trevor / Constantine / Tridentine inquisitor-hunter / Wallachian boyar turned vampire-killer / etc.) — NEVER vampires/warlocks/mages/liches/demonologists. STRAPPED with multiple visible weapons (crossbow + pistols + sword + dagger + stakes). Cool, mysterious, forboding, badass. Differentiator from vampire-hunter-in-action: this is POSTER MOMENT (standing/leaning/mid-load/loaded readiness) vs vhia's ACTION MID-MOTION mid-stalk.",
    slots: {
      universal: [],
      bot: [],
      path: [
        'character_archetype',
        'body_pose',
        'scene_context',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'face_detail',
        'outfit_silhouette',
        'weapon_or_signature_object',
        'atmospheric_backdrop',
        'composition_framing',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'foreground_anchor', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_VAMPIRE_HUNTER_IN_ACTION: {
    description:
      'PATH-BESPOKE — GothBot vampire-hunter-in-action (2026-05-22 R4 RESTART — solo on-the-prowl pre-encounter). SOLO hunter mid-stalk through specific gothic scene (city street / cathedral / courtyard / crypt-yard / rooftop). Quarry is IMPLIED OFF-CAMERA — never visible in frame. Hunter is in active motion (aiming crossbow forward / drawing pistols mid-stride / sword drawn approaching off-frame target / sneaking through alley / leaning around corner). Like a stealth-game screenshot / film-still mid-hunt. Medium-close composition (hunter 50-65% of vertical frame). 11 axes (10 always-on + 1 gated spoor): prowl_action / setting_location / hunter_archetype / weapon_signature / outfit_silhouette / environmental_detail / lighting / atmospheric_depth / composition_framing / foreground_anchor + spoor (40%-gated, subtle hint of past quarry presence).',
    slots: {
      universal: [],
      bot: [],
      path: [
        'prowl_action',
        'setting_location',
        'hunter_archetype',
        'weapon_signature',
        'outfit_silhouette',
        'environmental_detail',
        'lighting',
        'atmospheric_depth',
        'composition_framing',
        'foreground_anchor',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'spoor', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  GOTHBOT_DARK_LANDSCAPE: {
    description:
      'PATH-BESPOKE — GothBot dark-landscape path (2026-05-15 migration from legacy function-based form). Pure gothic landscape — NO CHARACTERS. Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton visual lineage (NEVER LOTR / Skyrim / Witcher). Movie-poster wide-vista compositions: vampire castles / cemeteries / abbey ruins / coastal cliffs / haunted forests / cursed villages. 5 path-bespoke axes (biome / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['biome', 'architecture', 'surprise_element', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },
};
