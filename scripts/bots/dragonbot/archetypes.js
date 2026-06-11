/**
 * dragonbot archetypes — path-bespoke archetype definitions.
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
  FEMALE_ADVENTURER: {
    description:
      'PATH-BESPOKE — DragonBot female-adventurer path (2026-05-14 rebuild from female-warrior). Gender-locked WOMAN of any D&D × LOTR fantasy race, any class (rogue / ranger / sorceress / warlock / mage / paladin / warrior / monk / druid / bard / cleric / barbarian / artificer / etc.), in the wild doing her adventurer thing. SLEEK adventuring gear — no bulky/massive armor, no cheesecake, no artist-name lineage callouts. NSFW-clean rebuild. Character at 25-40% frame in a candid mid-action moment. Painterly fantasy concept art aesthetic. Full character DNA stack (8 axes incl. class) + 4 path-bespoke (action / landscape / drama 40%-gated / surprise_element).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'race',
        'class',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['landscape', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // 2026-05-23 — carbon copy of FEMALE_ADVENTURER's cool-armor state. Same
  // 11-axis split. female-adventurer was reverted to its 2026-05-14 baseline;
  // FEMALE_EXPLORER carries the perfected cool-armor + adventurous-scene look.
  DRAGON_FEMALE_EXPLORER: {
    description:
      'PATH-BESPOKE — DragonBot female-explorer path (2026-05-23 carbon copy of the cool-armor female-adventurer state). Gender-locked WOMAN of any attractive fantasy race, any class. COOL FITTED ORNATE ARMOR (plate / cuirass / scale / chitin / battle-leather — Witcher/Elden/Dragon-Age caliber), NSFW-clean (no cheesecake / no frumpy drapes), no artist-name callouts. Candid traveling-adventurer scenes (climbing / bridges / paths / drawn-blade stealth / creek-rest / campfire / map). Character at 25-40% frame. Skin axis encoded in race. 11 axes (race / class / eyes / hair_color / hairstyle / outfit / accessory / landscape / action / surprise_element / drama-40%-gate).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: ['race', 'class', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['landscape', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FEMALE_ACTION_SCENES: {
    description:
      'PATH-BESPOKE — DragonBot female-action-scenes path (2026-05-14 clone of FEMALE_ADVENTURER, massaged for pure action energy). Same gender-locked, NSFW-clean, sleek-gear, strict-high-fantasy WOMAN. Same 12-axis split. The DIFFERENCE: action pool is rewritten for peak-action mid-moment cinematic beats — mages mid-spell with explosions, ranger mid-loose with arrow streaking, rogue sneaking through busy night market, paladin mid-strike with divine light, sorceress at summon apex, druid mid-shape-shift, warlock eldritch blast. Alive, motion-blurred, effect-rich. Character at 25-40% frame.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'race',
        'class',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['landscape', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MALE_ADVENTURER: {
    description:
      'PATH-BESPOKE — DragonBot male-adventurer path (2026-05-14 mirror of FEMALE_ADVENTURER, completely bespoke male pools). Gender-locked MAN of any D&D × LOTR fantasy race, any class. SLEEK adventuring gear — no bulky/massive armor, no shirtless/cheesecake, no artist-name lineage callouts. NSFW-clean. Strict Western high fantasy. Beards allowed for races where canon-appropriate (dwarves / humans / half-orcs / etc.). Character at 25-40% frame in candid mid-action moment. Painterly fantasy concept art. Full character DNA stack (8 axes incl. class) + 4 path-bespoke (action / landscape / drama 40%-gated / surprise_element).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'race',
        'class',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['landscape', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MALE_ACTION_SCENES: {
    description:
      'PATH-BESPOKE — DragonBot male-action-scenes path (2026-05-14 clone of MALE_ADVENTURER, massaged for pure action energy). Same gender-locked MAN, NSFW-clean, sleek-gear, strict-high-fantasy. Same 12-axis split. The DIFFERENCE: action pool is rewritten for peak-action mid-moment cinematic beats with multi-effect stacking. Mirror of FEMALE_ACTION_SCENES for male protagonists. Character at 25-40% frame.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'race',
        'class',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['landscape', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  // 2026-05-23 — male counterpart of DRAGON_FEMALE_EXPLORER. Mirrors
  // MALE_ADVENTURER's 12-axis split (keeps the face-focused skin axis for
  // male bare-chest safety); cool-gritty-armor + adventurous look via the
  // outfit/action pools + DRAGON_MALE_EXPLORER template.
  DRAGON_MALE_EXPLORER: {
    description:
      'PATH-BESPOKE — DragonBot male-explorer path (2026-05-23 male counterpart of DRAGON_FEMALE_EXPLORER). Gender-locked MAN of any fantasy race, any class. COOL GRITTY MASCULINE ARMOR (fitted plate / cuirass / scale / chitin / battle-leather — Witcher/Elden/Dragon-Age caliber, weathered + battle-worn), NSFW-clean MALE (chest ALWAYS covered, no shirtless/oiled, face-focused skin), no artist callouts. Candid traveling-adventurer scenes (climbing / bridges / paths / drawn-blade stealth / creek-rest / campfire / map). Character at 25-40% frame. 12 axes incl. face-focused skin + drama-40%-gate.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: [
        'race',
        'class',
        'skin',
        'eyes',
        'hair_color',
        'hairstyle',
        'outfit',
        'accessory',
      ],
      path: ['landscape', 'action', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGONBOT_DARK_REALM: {
    description:
      'PATH-BESPOKE — DragonBot dark-realm path (2026-05-14 migration). Corrupted wastelands / necromancer kingdoms / fallen empires / cursed lands. Mordor / Shadowfell / Dark Souls / Bloodborne / Diablo energy. Beautiful but MENACING. The land itself feels hostile, wrong, corrupted. Optional tiny figures (hooded wanderers / cursed knights / pilgrims) permitted as scale-provers. 5 path-bespoke axes (scene / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['scene', 'architecture', 'surprise_element', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGONBOT_DRAGON_LORE: {
    description:
      'PATH-BESPOKE — DragonBot dragon-lore path (2026-05-14 migration from legacy function-based form). Ancient archaeological-fantasy evidence of dragons — massive skeletal remains, weathered murals depicting dragon wars, abandoned lairs with scattered hoards, fossilized eggs, ruined dragon-temples, crumbling dragon-rider outposts. The dragons are GONE but their presence echoes everywhere. Mood: WONDER + MELANCHOLY + REVERENCE + LOST GRANDEUR. Optional tiny figures (scholars / explorers / archaeologists) as scale-provers and mood-setters. 5 path-bespoke axes (scene / architecture / phenomenon 80%-gated / surprise_element / sky_layer) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['scene', 'architecture', 'surprise_element', 'sky_layer'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  ARCANE_SPACES: {
    description:
      'PATH-BESPOKE — DragonBot arcane-spaces path (2026-05-15). Sister path to arcane-halls. Grand magical INTERIOR SPACES — vast architectural marvels with obsessive magic-density saturating the room. NO CHARACTERS — pure environment. Cathedral halls / throne rooms / floating-platform libraries / gateway arch chambers / ritual conclaves / observatories / vault corridors / etc. Architecture is the subject; magic phenomena fill every quadrant. Reuses ARCANE_HALL (200) + ARCANE_HALL_PHENOMENA (100, pickN:3) pools.',
    slots: { universal: ['lighting', 'atmosphere'], bot: [], path: ['hall', 'magic_phenomena'] },
    pickN: { magic_phenomena: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  ARCANE_HALLS: {
    description:
      'PATH-BESPOKE — DragonBot arcane-halls path (2026-05-15 pivot — was no-character magic-overload, NOW character-mid-magic-moment). A single spellcaster (mage / cleric / sorceress / druid / warlock / archmage / etc.) caught at the apex of their magical moment INSIDE a grand magical interior (cathedral hall / throne room / courtyard / stairwell / vault / banquet hall / observatory / etc.). The character is the focal point — MAGIC IS PARAMOUNT, visibly pouring from them and saturating the space. Path-bespoke axes (hall / caster / spell_moment / magic_phenomena pickN:2) + universal lighting + atmosphere.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['hall', 'caster', 'spell_moment', 'magic_phenomena'],
    },
    pickN: { magic_phenomena: 2 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  ICONIC_LANDSCAPE: {
    description: `PATH-BESPOKE — DragonBot iconic-landscape path (2026-06-01 PREMIUM-TIER enrichment 3 → 8 bespoke).

Merger of wow-landscape + lotr-landscape into a single stylized-fantasy-biome path. Stylized/saturated/iconic fantasy biomes drawing from BOTH the Tolkien-mythic-grandeur tradition AND the Blizzard-hand-painted-stylized tradition. NO CHARACTERS — pure landscape. Saturated stylized aesthetic distinct from the realistic-coded main 'landscape' path.

8 path-bespoke axes:
  Always-on identity:
    • biome              — iconic archetypal fantasy biome (ICONIC_BIOME — existing pool)
    • sky_layer          — saturated theatrical sky (ICONIC_LANDSCAPE_SKY — existing pool)
    • mythic_tradition   — painter lineage (Tolkien-John-Howe / Tolkien-Alan-Lee / Blizzard-stylized / Boris Vallejo / Frank Frazetta / Larry Elmore D&D / Brom / Whelan / Wayne-Reynolds / etc.) — sets the painted register
  Gated 50% accent layers:
    • legendary_landmark — iconic mythic feature (ruined-arch / sword-in-stone / sacred-grove / hovering-island / petrified-dragon-skull / massive-statue-fragment / world-tree / lost-throne)
    • mood_atmosphere    — overall scene mood (epic-dawn / silent-noon / golden-dusk / blood-twilight / fog-shrouded / aurora-night / storm-prelude / saga-dusk)
    • heraldic_color     — specific palette signature (pine-and-mist / blood-and-bronze / silver-and-moonstone / ochre-and-flame / jade-and-gold / etc.)
    • signature_creature — distant/tiny iconic creature woven in (giant eagles overhead / aurora-spirits drifting / falling-stars / floating-cherry-blossoms / dragon-shadow on horizon / unicorn-herd / pegasus-flight)
  Conditional (60% gate): phenomenon — magical/atmospheric event (ICONIC_LANDSCAPE_PHENOMENON — existing pool)`,
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'biome',
        'sky_layer',
        'mythic_tradition',
        'legendary_landmark',
        'mood_atmosphere',
        'heraldic_color',
        'signature_creature',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.6 },
    framingModes: null,
    anchorScaleRange: null,
  },

  EPIC_MOMENT: {
    description: `PATH-BESPOKE — DragonBot epic-moment path = EPIC CASTLE SCENES (2026-05-31 PREMIUM-TIER enrichment 2 → 8 bespoke).

The CASTLE is the hero — massive, sweeping, awe-inducing fantasy castle filling the frame. A huge cinematic event is happening at/in/around it. Wide cinematic establishing shots. People/armies/crowds at scale-prover size.

8 path-bespoke axes (4 always-on + 4 gated):
  Always-on identity (sets WHEN + WHAT-MOMENT):
    • castle                   — the architectural subject (EPIC_CASTLE — existing pool)
    • event                    — the peak event happening (EPIC_CASTLE_EVENT — existing pool)
    • epoch_signature          — historical era / culture (Medieval / Norman / Crusader / Byzantine / Romanesque / High-Gothic / Dwarven / Elvish-Tolkienesque / etc.) — sets visual style
    • peak_event_choreography  — the cinematic moment-within-the-moment framing (mid-strafe / siege-ladders-just-touching-wall / coronation-banner-unfurling / cavalry-cresting-the-hill)
  Gated 50% accent layers:
    • skyline_drama            — sky/weather mood (storm formation / aurora / comet / blood-moon / dawn-burst / cathedral-cloud light-shafts)
    • heraldic_identity        — banners / flags / sigils painted on walls — castle's FACTION coding
    • witness_chorus           — TINY townsfolk / cavalry / pilgrims at scale-prover scale (the multitude that proves castle scale)
    • architectural_signature  — one weird memorable castle detail (flying buttress / barbican / crystal-roof / bone-archway / etc.) — readable-focus`,
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'castle',
        'event',
        'epoch_signature',
        'peak_event_choreography',
        'skyline_drama',
        'heraldic_identity',
        'witness_chorus',
        'architectural_signature',
      ],
    },
    pickN: {},
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },

  FANTASY_SCENE: {
    description:
      'PATH-BESPOKE — DragonBot fantasy-scene path (2026-05-14 migration from legacy + cranked to movie-poster intensity). A single fantasy character integrated into an epic magical landscape, engaged with the magic / setting. Movie-poster mandate: every render stacks 3+ visually-striking elements (character + epic landscape + atmospheric phenomenon + scale-prover or magic-effect). Reuses 200-entry FANTASY_CHARACTERS + 280-entry FANTASY_LANDSCAPES + bespoke 50-entry action + 30-entry drama (80%-gated almost-always-fires).',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['character', 'landscape', 'action'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGONBOT_LANDSCAPE: {
    description: `PATH-BESPOKE — DragonBot landscape path ⭐ FLAGSHIP (2026-06-01 PREMIUM-TIER enrichment 5 → 10 bespoke).

Pure scenery — NO CHARACTERS, NO FIGURES. The landscape is the hero. "Land is alive" + "MOVIE POSTER" mandate.

10 path-bespoke axes:
  Always-on identity:
    • biome              — primary biome (FANTASY_BIOMES — existing)
    • architecture       — ruined-architecture / megaliths / monuments (existing)
    • sky_layer          — dramatic sky (FANTASY_SKY — existing)
    • surprise_element   — secondary scale-prover (existing)
    • aesthetic_register — painter lineage (Roger Dean / Bob Eggleton / Larry Elmore / John Howe / Larry Elmore / Hildebrandt Brothers / Justin Sweet / Frank Frazetta / Jeff Easley) — sets the painted register
  Gated 50% accent layers:
    • light_quality      — specific light effect (god-rays / chiaroscuro / sun-pillar / moonbeam / aurora / dappled-canopy / cathedral-cloud-shaft)
    • signature_flora    — specific named flora (luminescent-orchid forest / giant-fern canopy / glass-bamboo grove / petrified-tree forest / flower-meadow / kelp-canopy underwater)
    • signature_fauna    — TINY scale-prover fauna (distant herd / pegasus flight / phoenix soaring / dragon-shadow / wolf-pack on ridge)
    • magical_element    — visible magic detail (floating ruins / sigils in the air / ley-line glow / mana-stream / fey-light cluster)
  Conditional (80% gate): phenomenon — dramatic atmospheric event (existing)`,
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: [
        'biome',
        'architecture',
        'surprise_element',
        'sky_layer',
        'aesthetic_register',
        'light_quality',
        'signature_flora',
        'signature_fauna',
        'magical_element',
      ],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.8 },
    framingModes: null,
    anchorScaleRange: null,
  },

  ARTSY_GIRL: {
    description:
      'PATH-BESPOKE — DragonBot artsy-girl path. Frozen 2026-05-13 clone of FEMALE_WARRIOR producing Frazetta / Brom / Vallejo painted-fantasy-novel-cover heroines in cinematic peaceful adventuring moments. Cheesecake-friendly painterly aesthetic. Locked separately from female-warrior so race-lock / armor-coverage tuning on female-warrior never touches this path.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: ['race', 'skin', 'eyes', 'hair_color', 'hairstyle', 'outfit', 'accessory'],
      path: ['landscape', 'action', 'warrior_archetype', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGONBOT_CASTLE: {
    description:
      'PATH-BESPOKE — DragonBot castle path (2026-05-17 NEW). Majestic epic beautiful castle views — castles are 100% the focal subject, set amongst gorgeous fantasy backdrops with massive sense of scale. Distinct from epic-moment (50/50 castle + event) — this is pure castle-as-hero, movie-poster establishing shot energy. 5 path-bespoke pools: castle (architectural subject) + biome (gorgeous fantasy backdrop) + sky_layer (dramatic sky) + scale_prover (tiny element proving scale) + phenomenon (40%-gated atmospheric flourish). Lineage: Helms-Deep / Minas-Tirith / Edoras / Erebor / Anor-Londo establishing-shot.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['castle', 'biome', 'sky_layer', 'scale_prover'],
    },
    pickN: {},
    conditionalLayer: { slot: 'phenomenon', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  SKY_CASTLE: {
    description:
      'PATH-BESPOKE — DragonBot sky-castle path (2026-06-10, Tier 3). A floating castle / sky-kingdom among the clouds — airborne fortresses, sky-isles, waterfalls into the void. Path-bespoke: sky_structure + structure_detail + sky_setting + scale_prover + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['sky_structure', 'structure_detail', 'sky_setting', 'scale_prover'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  ELVEN_CITY: {
    description:
      'PATH-BESPOKE — DragonBot elven-city path (2026-06-10, Tier 3). A graceful elven city — treetop / crystalline / waterfall haven, ethereal architecture. Path-bespoke: elven_city + elven_detail + city_setting + occupant + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['elven_city', 'elven_detail', 'city_setting', 'occupant'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DWARVEN_HOLD: {
    description:
      'PATH-BESPOKE — DragonBot dwarven-hold path (2026-06-10, Tier 3). A vast dwarven forge-hold / underground kingdom — colossal carved halls, forges, gold. Path-bespoke: hold + dwarven_detail + forge_activity + occupant + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['hold', 'dwarven_detail', 'forge_activity', 'occupant'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  WIZARD_TOWER: {
    description:
      'PATH-BESPOKE — DragonBot wizard-tower path (2026-06-10, Tier 3). A wizard\'s tower dense with arcana — interior or exterior, magical wonder. Path-bespoke: tower + arcane_detail + tower_setting + occupant + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['tower', 'arcane_detail', 'tower_setting', 'occupant'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  NECROMANCER: {
    description:
      'PATH-BESPOKE — DragonBot necromancer path (2026-06-10, Tier 2). Dark high-fantasy necromancy — a lich/death-knight/undead horde, soul-flame, raising the dead. Path-bespoke: undead_subject + dark_setting + necro_magic + undead_detail + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['undead_subject', 'dark_setting', 'necro_magic', 'undead_detail'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DUNGEON_DELVE: {
    description:
      'PATH-BESPOKE — DragonBot dungeon-delve path (2026-06-10, Tier 2). Adventurers exploring torch-lit fantasy depths — treasure, bones, lurking monsters, D&D dungeon-crawl. Path-bespoke: dungeon + party + dungeon_detail + lurking_threat + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['dungeon', 'party', 'dungeon_detail', 'lurking_threat'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  FAE_COURT: {
    description:
      'PATH-BESPOKE — DragonBot fae-court path (2026-06-10, Tier 2). Ethereal high-fae / elven-court / enchanted-glade scene — gossamer beauty, moonlight, magic. Path-bespoke: fae_subject + enchanted_setting + ethereal_detail + surprise + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['fae_subject', 'enchanted_setting', 'ethereal_detail', 'surprise'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MYTHIC_BESTIARY: {
    description:
      'PATH-BESPOKE — DragonBot mythic-bestiary path (2026-06-10, Tier 2). A hero portrait of ONE great NON-DRAGON mythic creature (griffon, kraken, phoenix, hydra, treant, etc.) — the creature is the star. Path-bespoke: creature + creature_action + habitat + encounter + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['creature', 'creature_action', 'habitat', 'encounter'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  MAGIC_UNLEASHED: {
    description:
      'PATH-BESPOKE — DragonBot magic-unleashed path (2026-06-10, Tier 2). A COLOSSAL spell event — a wizard/sorcerer unleashing world-shaking magic (summoning, portal-tear, wizard duel, forbidden ritual, meteor-call). Arcane spectacle the star. Path-bespoke: spell_event + caster + magic_effect + setting + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['spell_event', 'caster', 'magic_effect', 'setting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  CLASH_OF_ARMIES: {
    description:
      'PATH-BESPOKE — DragonBot clash-of-armies path (2026-06-10, Tier 2). A vast epic fantasy BATTLE — two massed armies clashing, siege + war-magic + banners, cinematic scale. Path-bespoke: armies (the factions) + battle_action (the clash moment) + battlefield (the stage) + war_spectacle (magic/arrows/siege) + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['armies', 'battle_action', 'battlefield', 'war_spectacle'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGON_BREEDS: {
    description:
      'PATH-BESPOKE — DragonBot dragon-breeds path (2026-06-10). A BESTIARY portrait of ONE magnificent dragon of a distinct BREED/species — the breeds signature features are the star (a monster-manual hero shot). All Western anatomy (4 legs + 2 wings), varied by element/biome/color/feature. Path-bespoke: breed + habitat + breed_pose + element_effect + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['breed', 'habitat', 'breed_pose', 'element_effect'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGON_BROOD: {
    description:
      'PATH-BESPOKE — DragonBot dragon-brood path (2026-06-10). MANY Western dragons together — a wheeling flock, a cliff roost, a brood with its mother, a migration. The spectacle of NUMEROUS dragons (not one). Path-bespoke: brood_subject (the group) + setting + dominant_dragon (the leader/largest) + brood_activity + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['brood_subject', 'setting', 'dominant_dragon', 'brood_activity'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGON_FLIGHT: {
    description:
      'PATH-BESPOKE — DragonBot dragon-flight path (2026-06-10). A majestic Western dragon in dynamic FLIGHT (soaring / banking / diving) over an epic fantasy vista seen from on high, wings spread, full of MOTION. NO rider/characters. Distinct from dragon-scene (grounded/perched subject). Path-bespoke: dragon + flight_pose + vista_below + sky + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['dragon', 'flight_pose', 'vista_below', 'sky'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGON_BATTLE: {
    description:
      'PATH-BESPOKE — DragonBot dragon-battle path (2026-06-10). A colossal Western dragon mid-combat — breathing fire on a castle/army, or clashing with a rival dragon or knights. Action spectacle. Path-bespoke: dragon + combat_action (fire/clash/strafe) + target (castle/army/knights/rival) + battle_setting + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['dragon', 'combat_action', 'target', 'battle_setting'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGON_HOARD: {
    description:
      'PATH-BESPOKE — DragonBot dragon-hoard path (2026-06-10). A colossal Western dragon coiled atop a mountain of treasure in its lair (Smaug archetype). Path-bespoke: dragon + hoard (treasure) + lair (cavern) + dragon_pose (sleeping/roused/guarding) + intruder (40% gated tiny thief/knight). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['dragon', 'hoard', 'lair', 'dragon_pose'],
    },
    pickN: {},
    conditionalLayer: { slot: 'intruder', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGON_RIDER: {
    description:
      'PATH-BESPOKE — DragonBot dragon-rider path (2026-06-10). The ICONIC fantasy image: a rider mounted on a colossal Western dragon (4 legs + 2 wings + horned skull) in flight or battle. Dragon + rider are co-heroes. Eragon / HTTYD / GoT / Temeraire energy. Path-bespoke: dragon + rider + action + setting + mount_detail + drama (40% gated). Universal lighting + atmosphere reused.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['dragon', 'rider', 'action', 'setting', 'mount_detail'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  DRAGON_SCENE: {
    description:
      'PATH-BESPOKE — DragonBot dragon-scene path. Traditional Western dragon (4 legs + 2 wings + horned reptilian skull) is the SUBJECT in a jaw-dropping fantasy landscape. NO characters/riders/humans. Path-bespoke pools for dragon (anatomy) + action (mid-action moment) + landscape (epic biome) + drama (40% gated environmental event) + surprise_element (tiny secondary subject). Canonical-LITE — DragonBot uses minimal wrapper layer so Sonnet body leads.',
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      path: ['dragon', 'action', 'landscape', 'surprise_element'],
    },
    pickN: {},
    conditionalLayer: { slot: 'drama', gate: 0.4 },
    framingModes: null,
    anchorScaleRange: null,
  },

  COZY_ARCANE: {
    description: `PATH-BESPOKE — DragonBot cozy-arcane path (2026-05-31 migration from inline-function form to declarative axis system).

Cozy intimate fantasy sanctum — a single fantasy character at home in their magical-cluttered space, caught in a candid moment. WARMTH + CLUTTER + LIVED-IN-MAGIC. Same universe as dragons and vast landscapes, zoomed into the WARM PRIVATE SPACES where wizards rest, where hearths crackle, where candlelight pools on worn wood.

PREMIUM-TIER axis stack (4 always-on identity + 1 always-on multi-pick + 4 gated accents = 9 path-bespoke pools):
  Always-on identity (sets WHO + WHERE + WHAT-NOW):
    • inhabitant_archetype — character class (wizard / alchemist / scholar / hedgewitch / dragon-lorekeeper / arcane-mage / sage / apothecary / sorcerer / cartomancer / occultist / etc.)
    • inhabitant_age       — apprentice / scholar / sage stage (10 entries expanded from inline)
    • candid_moment        — what they are doing right now (caught on a hidden camera — never posing)
    • setting              — the room itself (COZY_ARCANE_SETTINGS — 200-entry fat seed)
  Always-on multi-pick (preserves the "stack 6 clutter categories" mandate from inline form):
    • clutter_focus pickN:3 — specific spotlighted clutter (alchemy column / dragon-glass beaker rack / leather-bound tome / glowing-rune compass)
  Gated 50% accent layers (premium-tier richness):
    • hearth_warmth_source — specific named warmth (multi-arm candelabra / brass oil-lantern / fireplace embers / floating wisp-orbs / lit pipe smoldering)
    • signature_familiar   — pet / familiar / companion creature (raven on desk / pseudo-dragon-cat / smoke-fox / book-imp / glowing wisp-pet)
    • magical_signature    — specific visible magic detail (glowing-rune mid-air / floating-quill writing / wisp-orbs orbiting bookshelf / spell-circle in chalk / levitating ingredient)
  Plus character DNA: race (FANTASY_RACE shared) + inline gender ('woman' / 'man' rolled in template body)

NOTE: a former \`aesthetic_tradition\` axis (illustrator-lineage descriptor) was
deleted 2026-06-05 — Kevin caught it as render-style smuggled into a
scene-content axis. The pool had drifted to children's-book illustrators
(Hyman / Froud / Vess / DiTerlizzi / Rackham / Sendak), and the template's
"Anchor the entire render in this illustrator's aesthetic" mandate locked
every 50%-gated render away from high-fantasy painted register. Render
style belongs to the medium + bot wrapper; scene axes carry scene content
only.`,
    slots: {
      universal: ['lighting', 'atmosphere'],
      bot: [],
      characterDnaAxes: ['race'],
      path: [
        'inhabitant_archetype',
        'inhabitant_age',
        'candid_moment',
        'setting',
        'clutter_focus',
        'hearth_warmth_source',
        'signature_familiar',
        'magical_signature',
      ],
    },
    pickN: { clutter_focus: 3 },
    conditionalLayer: null,
    framingModes: null,
    anchorScaleRange: null,
  },
};
