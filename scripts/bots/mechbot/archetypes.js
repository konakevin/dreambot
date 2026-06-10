/**
 * mechbot archetypes — path-bespoke archetype definitions.
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
  MECHBOT_TITAN_WAR: {
    description:
      "PATH-BESPOKE — MechBot titan-war-machines path (2026-05-15 migration to declarative composer). Kilometer-scale combat machines in mid-engagement, biblical scale, Pacific Rim / 40K Imperator / AT-AT / Attack on Titan colossus lineage. REUSES legacy 200-entry subject/action/setting pools. Adds 3 path-bespoke pools: lighting (ground-based combat, overrides cosmic bot default), composition (vertigo-inducing camera angles — worm's-eye / fly-between-legs / kaiju-step-on-camera / aerial-orbit / dwarfed-skyline), and 40%-gated drama (orbital-strike / EMP-burst / artillery flashes / sonic-boom shockwaves / kaiju-footfall pressure-waves). VERTIGO + BIBLICAL SCALE are mandatory.",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_SKYSHIPS: {
    description: `PATH-BESPOKE — MechBot mech-skyships path (2026-05-15 migration; 2026-05-16 simplified after Kevin's heart-calibration revealed the path should produce SOLO BEAUTIFUL SHIPS in dramatic atmospheric skies, not multi-actor combat scenes). Flying sci-fi mech-vessels with predatory blade silhouettes, fang prows, glowing power conduits. NOT modern military. Reuses legacy 200-entry subject/action/setting pools + 3 path-bespoke pools: composition (SKY vertigo angles), lighting (aerial flight overrides cosmic bot default), drama (40%-gated sky-combat phenomena). VERTIGO COMPOSITION + simplified movie-poster mandate (every-quadrant-striking, multi-tier depth, saturated theatrical sky) + "TURNED UP TO 11" multi-layer atmospheric stack. NO forced multi-actor / engagement / named-call-signs / peak-DNA mandates — let the SHIP be the show.`,
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_MECHA_PILOTS: {
    description:
      'PATH-BESPOKE — MechBot mecha-pilots path (2026-05-16 migration; third MechBot path). Pilot + giant mech with scale-relationship as the punchline (Gundam / Evangelion / Pacific Rim / Iron Giant / Titanfall). Pilot tiny, mech enormous, mid-action moment of boarding / climbing / repairing / deploying — NOT active battlefield. Pilot biology = anything goes. Reuses legacy 200-entry subject/action/setting pools + 3 path-bespoke pools: composition (30 full-body-mech vertigo angles across 15+ environments), lighting (hangar/silo/dawn-deployment overrides cosmic bot default), drama (40%-gated deployment phenomena). MECH FILLS 50-100% OF FRAME BODY (no fragments — head-to-foot silhouette mandatory).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_POWER_ARMOR_INFANTRY: {
    description:
      'PATH-BESPOKE — MechBot power-armor-infantry path (2026-05-16 migration; fourth MechBot path). MEAN KILL-TEAM squads of 8-12 marines + 2-4 allied combat-bots/drones/walkers in heavy power armor. FULL MAN+MACHINE vs MACHINE combat at maximum-density commotion (per Kevin 2026-05-16). Helldivers 2 + Guard-Dog rovers / WH40K Tactical Squad + Dreadnought + Servitor / Aliens Colonial Marines + Power-Loader + APC / Mass Effect squad + LOKI mechs / Starcraft Marines + Goliath / Avatar Marines + AMP-suits lineage (Star Wars + Halo IP names BANNED — see gen recipe banlist). Hard pivot from legacy "professional military procedural" framing — these must read as MEAN, aggressive, scarred, predator-killers fighting WITH multiple friendly machines amid multiple simultaneous explosions/fires/smoke. 6 path-bespoke pools: composition (squad-combat vertigo angles), lighting (battlefield combat overrides cosmic bot default), engagement (ALWAYS-ON multi-actor combat narrative — per mech-skyships engagement-pool lesson), allied_tech (ALWAYS-ON x2 friendly combat-bots/drones/walkers — added 2026-05-16 for man+machine DNA, pickN:2 for multiple machine-types per render), drama (ALWAYS-ON battlefield phenomena — gate raised 0.4→1.0 for max-density). Reuses legacy 200-entry POWER_ARMOR_SETTINGS.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'landscape', 'composition', 'engagement', 'allied_tech'],
    },
    pickN: { allied_tech: 2 },
    conditionalLayer: { slot: 'drama', gate: 1 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_POST_APOC_RUST_TECH: {
    description:
      "PATH-BESPOKE — MechBot post-apoc-rust-tech path (2026-05-16 migration; sixth MechBot path). FAR-FUTURE sci-fi BUSH-FIX scavenger rigs + crews running across post-apoc wasteland. Mad Max Fury Road (sci-fi-tilted) / Borderlands Pandora / WH40K Ork-Looted / Dune Sardaukar-thopter / Cyberpunk 2077 Nomad-clan / Horizon Zero Dawn rebel-tech / Death Stranding off-Earth lineage. Subject/action/setting pools FULLY REGENERATED 2026-05-16 with sci-fi-tilt + bush-fix mandate baked in (legacy 200-entry pools had present-day-truck / modern-refinery / 21st-century-Earth DNA that surgical word-replace patches couldn't fix at the concept level). New 30-entry MVP pools — fusion-cell engines, plasma-drives, alien-tech salvage, hover-skirts, glowing energy-conduits, scavenged orbital-debris. 3 path-bespoke pools added: composition (Mad Max chase angles), lighting (Fury Road wasteland), drama (40%-gated wasteland phenomena).",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_HUMANOID_ROBOTS: {
    description:
      "PATH-BESPOKE — MechBot humanoid-robots path (2026-05-17 NEW PATH, not a migration). Sister to legacy robot-moment (kept untouched) for SPECIFICALLY HUMAN-SCALE BIPEDAL HUMANOID ROBOTS only. Calibrated to Kevin's 10 reference images 2026-05-17: polished chrome/titanium/brushed-metal chassis (NOT scrap-weld), multi-iris compound-optic head-arrays (kaleidoscope rainbow eye-lenses), multi-color glowing joint-seams + chest-cores + shoulder-orbs (cyan/amber/magenta/emerald blend), atmospheric cinematic outdoor settings (waterfall/snow-mountain/canyon/overgrown ruin/fire-glow wasteland) over urban-corporate. Allows feminine + masculine + androgynous + alien-form chassis. Both contemplative-still AND mid-action poses welcome. MOVIE POSTER MANDATE baked into template — every render a flagship concept-art frame. 6 path-bespoke pools.",
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_CYBORG_WOMAN: {
    description:
      'PATH-BESPOKE — MechBot cyborg-woman path (2026-05-17 migration; eighth MechBot path; 2026-05-17 evening update — added cyborg_material axis + alien-hybrid framing). Half-human half-machine being. Ex Machina / Alita / Ghost in the Shell / Blade Runner 2049 / Westworld lineage. Beautiful + terrifying. Character DNA (characterBase / skin / bodyType / eyes / hair / internal / glowColor) continues from bot.rollSharedDNA(cyborg-woman). 5 path-bespoke pools (cyborg_feature / cyborg_material / action / landscape / composition) + 1 conditional drama (40%-gated). Composition pool mixes 60% closeup detail-shots + 40% full-body framings. Material pool dedicated axis for finish variety (chrome / brass / pearl-ivory / xenomaterial / dichroic / etc.) — alien-hybrid skin tones welcome. Template preserves legacy identity guards: face MUST show cyborg, multi-cyborg-reveal mandate (3-4 distinct reveals), full-body cyborg-detail mandate (5-7 body parts) to prevent the "bikini" failure mode, solo composition, banned imagery.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['cyborg_feature', 'cyborg_material', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_SCIFI_CYBORG_FEMALE: {
    description:
      'PATH-BESPOKE — MechBot scifi-cyborg-female (2026-06-09, NEW from scratch). "Truly out there" exotic alien-cyborg females — built with NO baggage from the legacy cyborg-woman beauty-portrait. The xeno_being HERO axis rolls a genuinely DIFFERENT alien race per render (insectoid / crystalline / cephalopod / fungal / cosmic-void / porcelain / coral / etc.); signature_wow layers ONE showstopper feature; the look axis varies the rendering register so nothing homogenizes; biome sets an exotic alien stage; composition varies framing/pose. 5 path-bespoke pools + 1 conditional drama (40%-gated exotic phenomenon). Tasteful-sexy via exotic elegance, never pinup. No look-lock in the template — the look axis leads.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['xeno_being', 'organic', 'eyes', 'signature_wow', 'biome', 'look', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_KILLER_CYBORGS: {
    description:
      'PATH-BESPOKE — MechBot killer-cyborgs (2026-06-09, NEW). Verbatim config clone of scifi-cyborg-female as an equal baseline, to fan out toward more MENACING / "evil robot" + killer-cyborg looks. Pools start as copies of the scifi pools; they will be regen\'d as the path tilts evil. Same 5 path slots + organic + eyes + 40%-gated drama. Flux-locked.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['xeno_being', 'organic', 'eyes', 'signature_wow', 'biome', 'look', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_MECH_INSECT_HYBRIDS: {
    description:
      'PATH-BESPOKE — MechBot mech-insect-hybrids (2026-06-09, NEW). Mechanical/live hybrid insects: an insectoid race where machine + insect fuse into wild sci-fi hybrids. Insect + mechanical aesthetic OVERRULES (insectoid-humanoids allowed but insect/mech dominates). being(HERO) + fusion_material + eyes + signature_wow + biome + look(register, anti-homogenize) + composition + 40%-gated drama. Flux-locked, wrapper-strip.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['being', 'material', 'eyes', 'signature_wow', 'biome', 'look', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_VOID_LANCERS: {
    description:
      'PATH-BESPOKE — MechBot void-lancers (2026-06-10, NEW; 2026-06-10 made DYNAMIC + multi-mech per Kevin). ZERO-G orbital mech-KNIGHT combat — EVA combat-mechs FIGHTING / charging / dueling in vacuum, lances + thrusters, often TWO mechs ENGAGED, a planet curve below. MECH-FOCUSED (not StarBot cosmic vistas, not mech-skyships atmospheric flight). FIGURE (lancer HERO + maneuver money-shot) + ENVIRONMENT (void + look) + composition(dynamic zero-G action) + 85%-gated engagement (multi-mech orbital combat). universal:[] (ALWAYS weightless in vacuum + planet/station for orbital scale). Flux-locked, wrapper-strip.',
    slots: {
      universal: [],
      bot: [],
      path: ['lancer', 'maneuver', 'void', 'look', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.85 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_ARENA_TITANS: {
    description:
      'PATH-BESPOKE — MechBot arena-titans (2026-06-10, NEW; 2026-06-10 made DYNAMIC + multi-mech per Kevin). Mech-GLADIATOR spectacle — combat-mechs FIGHTING / posturing / clashing in a colossal roaring arena, often TWO mechs in frame. Distinct from titan-war (battlefield) + power-armor (squad). FIGURE (gladiator HERO + arsenal money-shot) + ENVIRONMENT (arena + look) + composition(dynamic action) + 85%-gated engagement (multi-mech action / posturing). universal:[]. Flux-locked, wrapper-strip.',
    slots: {
      universal: [],
      bot: [],
      path: ['gladiator', 'arsenal', 'arena', 'look', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.85 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_CHROME_SHOGUN: {
    description:
      'PATH-BESPOKE — MechBot chrome-shogun (2026-06-09, NEW). Feudal-future SAMURAI WAR-MECHS — machine-samurai in ornate kabuto/do/menpo armor, plasma-katana, honor + ceremony + menace. Fills the eastern-mecha/honor register. Ghost of Tsushima / Gundam samurai / Sekiro / Afro Samurai. Distinct from killer-cyborgs-male (street cyber-ninja). FIGURE (shogun HERO + blade money-shot) + ENVIRONMENT (domain + look) + composition + 40%-gated honor-duel drama. universal:[] (bot space-lighting fights a cherry-blossom scene; domain/look carry the light). Flux-locked, wrapper-strip.',
    slots: {
      universal: [],
      bot: [],
      path: ['shogun', 'blade', 'domain', 'look', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_SENTINELS: {
    description:
      'PATH-BESPOKE — MechBot sentinels (2026-06-09, NEW). COLOSSAL ancient dormant guardian-mechs, half-asleep + overgrown + weathered after ages, in sacred awe-landscapes. Fills MechBot quiet/awe register. Shadow of the Colossus / Horizon tallneck / Ghibli-Mononoke / Castle in the Sky. FIGURE (sentinel HERO) + signature money-shot (awakening = ancient optics kindling to life) + ENVIRONMENT (realm + look) + composition(always a scale-prover) + 40%-gated stirring drama. universal:[] (bot space-lighting fights a misty-valley/temple scene; realm/look carry the light). Awe + ancient majesty, NOT action. Flux-locked, wrapper-strip.',
    slots: {
      universal: [],
      bot: [],
      path: ['sentinel', 'awakening', 'realm', 'look', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_ABYSS_MECHS: {
    description:
      'PATH-BESPOKE — MechBot abyss-mechs (2026-06-09, NEW). Deep-sea MACHINES in the crushing abyssal dark — dive-mechs / submersible war-rigs / leviathan-constructs / hadal sentinels (NOT sea-animals). Fills the missing aquatic biome. Subnautica / The Abyss / BioShock Big-Daddy. FIGURE (mech HERO) + signature money-shot (lumens = lights cutting the black) + ENVIRONMENT (abyss + look) + composition(crushing scale) + 40%-gated deep-sea drama. universal:[] (bot space-lighting fights underwater; abyss/lumens/look carry the light). ALWAYS fully submerged. Flux-locked, wrapper-strip.',
    slots: {
      universal: [],
      bot: [],
      path: ['mech', 'lumens', 'abyss', 'look', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_HUNTER_KILLERS: {
    description:
      'PATH-BESPOKE — MechBot hunter-killers (2026-06-09, NEW). PURE-MACHINE autonomous hunter-killer drones/units ON THE HUNT (no pilot, no organic) sweeping dead cities + wastelands. Terminator HK / ED-209 / Boston-Dynamics-gone-rogue / Oblivion drone. Split FIGURE (unit HERO + armament + sensor money-shot) from ENVIRONMENT (hunting_ground + look). unit + armament + sensor + hunting_ground + look(register) + composition(hunting the viewer) + 40%-gated contact/kill drama. universal:[] (bot space-lighting would fight the grounded scene — hunting_ground/look carry the light). Flux-locked, wrapper-strip.',
    slots: {
      universal: [],
      bot: [],
      path: ['unit', 'armament', 'sensor', 'hunting_ground', 'look', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_KILLER_CYBORGS_MALE: {
    description:
      'PATH-BESPOKE — MechBot killer-cyborgs-male (2026-06-09). MALE mirror of killer-cyborgs: handsome/rugged lethal MALE cyborg assassin-thieves — agile, sleek, dangerous. Same architecture; only the gendered subject + face pools are male-specific (weapon / biome / look / composition / eyes / drama are SHARED with the female killer path). Flux-locked.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['xeno_being', 'organic', 'eyes', 'signature_wow', 'biome', 'look', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_OG_CYBORG_FEMALE: {
    description:
      'PATH-BESPOKE — MechBot og-cyborg-female (2026-06-09, NEW). Replicates Kevin\'s "OG" reference aesthetic: beautiful SEXY human-proportioned female cyborgs — glossy sculpted chassis + exposed mechanical joints + glowing accents, real hair OR chrome cranium, glowing eyes, a signature cyber head/neck feature. Sorayama-chrome meets Ghost-in-the-Shell beauty, PHOTOREAL. Grounded, NOT the wild alien-creature register of scifi-cyborg-female. 6 path-bespoke pools (subject HERO / hair / cyber_feature / eyes / setting / composition) + 1 conditional drama (40%-gated soft atmosphere). Uses the photoreal render medium; no look-axis (the consistent photoreal glossy look IS the aesthetic). Tasteful-sexy — glossy chassis covers her, never bare skin.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['subject', 'hair', 'cyber_feature', 'eyes', 'setting', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_CYBORG_MAN: {
    description:
      'PATH-BESPOKE — MechBot cyborg-man path (2026-05-17 axis migration; mirror of MECHBOT_CYBORG_WOMAN with male badass recoding per Kevin: rugged / handsome / capable / mysterious / NOT sexy). Solid Snake / Adam Jensen / Geralt-as-cyborg / Marcus Fenix / Cyberpunk 2077 male V lineage. Half-human half-machine MALE being. Character DNA from bot.rollSharedDNA(cyborg-man) — existing male pools (CYBORG_MALE_FEATURES / CYBORG_MALE_CHARACTERS / CYBORG_MALE_ACTIONS / etc.). 5 path-bespoke pools (cyborg_feature / cyborg_material / action / landscape / composition) + 1 conditional drama (40%-gated). Composition pool bespoke 50/50 closeup-badass + full-body-action (CYBORG_MAN_COMPOSITION). Material + drama reuse the gender-neutral CYBORG_WOMAN_* pools. Template recodes masculinity hard — mandatory opening anchor tag ("Adult male cyborg (NOT female), strong jawline, broad shoulders, narrow hips, adult masculine build"), banned feminine words list (pretty / beautiful / delicate / sexy / etc.), badass replacement words (rugged / weathered / capable / lethal / mysterious). Preserves all cyborg safety rails (face human-visible + part-cyborg, multi-reveal mandate, full-body cyborg-detail mandate to prevent glamour failure, solo composition, banned imagery, NO full body armor since combat-droid territory).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['cyborg_feature', 'cyborg_material', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_DROID_ASSASSIN: {
    description:
      'PATH-BESPOKE — MechBot droid-assassin path (2026-05-17 NEW). Sister of MECHBOT_CYBORG_WOMAN with a HARD slant toward killer-cyborg / assassin / rogue / mysterious / capable / violent. Same DNA pipeline + same pools, but the template register pulls her into predatory / lethal / shadowed / tactical territory instead of contemplative-beauty. Preserves all safety rails (chest coverage, no mech nipples, exposed inner workings, alien-bend variants).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['cyborg_feature', 'cyborg_material', 'action', 'landscape', 'composition'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MECHBOT_ANDROID_MAN: {
    description:
      'PATH-BESPOKE — MechBot cyborg-man REBUILD to the "android-man" register (2026-05-26, Kevin). Replaces the disabled face-obsessed MECHBOT_CYBORG_MAN axis path AND the active cyborg-male-legacy function-form, both of which produced bust-portraits of a handsome organic head pasted onto a chrome body. New register: a MOSTLY-MACHINE male android-BEING — synthetic chassis dominates the silhouette, organic shows ONLY at eyes / a partial face-panel — a human ghost inside an engineered body (Alita / Ghost in the Shell Major / Nier Automata / battle-android / Cyberpunk full-borg). RUGGED, weathered, lethal — never pretty-boy. FULL-FIGURE in a sci-fi scene, never a bust. Fully composer-driven (does NOT read the pretty-boy cyborg-man sharedDNA character fields — only sharedDNA.glowColor / scenePalette / colorPalette). 8 path-bespoke axes (chassis / material / head / augment / action / setting / composition / surprise) + 1 conditional drama (40%-gated) + 2 universal (lighting / atmosphere). Composition pool is ~85% full-figure to kill the bust-shot failure mode.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'identity',
        'chassis',
        'material',
        'head',
        'eye',
        'augment',
        'action',
        'setting',
        'composition',
        'surprise',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },
};
