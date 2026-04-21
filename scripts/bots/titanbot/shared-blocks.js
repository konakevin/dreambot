/**
 * TitanBot — shared prose blocks.
 *
 * Mythology across ALL world pantheons at epic scale. Gods, titans, deities,
 * mythic battles, legendary landscapes, gnarly creatures, sexy mythic women,
 * cozy mythic places. Renaissance-painting × concept-art production quality.
 */

const PROMPT_PREFIX =
  'mythological concept-art painting, Renaissance-painterly grandeur, cosmic-scale mythology, divine atmospheric lighting, classical-oil-painting production quality, mythic-sublime beauty';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const MYTHIC_SCALE_BLOCK = `━━━ MYTHIC SCALE (NON-NEGOTIABLE) ━━━

Cosmic scale in every render. Gods are 100+ feet tall. Battles rip skies open. Artifacts shake universes. Landscapes span impossible dimensions. Scale is mythic, not human. A mortal in frame should look like an ant beside the gods — their presence dominates geography.`;

const PANTHEON_DIVERSITY_BLOCK = `━━━ PANTHEON DIVERSITY — NON-NEGOTIABLE ━━━

Rotate across ALL world mythologies. Do not cluster Greek/Norse. Draw from:
- Greek/Roman (Olympus, Titans, Muses, Fates)
- Norse (Aesir, Vanir, Valkyries, Jötnar)
- Egyptian (Ra, Anubis, Bastet archetypes)
- Hindu (Shiva, Vishnu, Kali archetypes — by role)
- Buddhist (Bodhisattvas, temple deities)
- Japanese (Amaterasu, Susanoo archetypes, kami, oni)
- Chinese (Jade Emperor, dragons, immortals)
- Aztec/Maya (Quetzalcoatl, Huitzilopochtli archetypes)
- Celtic (Dagda, Morrigan, Tuatha Dé archetypes)
- African (Yoruba Orishas, Egyptian afterlife)
- Slavic (Perun, Veles archetypes)
- Polynesian (Maui, Pele archetypes)
- Mesopotamian (Marduk, Inanna archetypes)
- Native American (Great-Spirit archetypes, thunderbird)
- Inuit, Aboriginal, and more

Every render should feel pantheon-specific (not generic-fantasy).`;

const NO_NAMED_DEITIES_BLOCK = `━━━ NO NAMED DEITIES ━━━

Describe by role + pantheon + domain. NEVER "Zeus" / "Odin" / "Anubis" / "Shiva" / "Thor". Use: "Greek thunder-god mid-thunderbolt", "Norse all-father on throne with ravens", "Egyptian jackal-headed death-judge weighing soul", "Hindu dance-god in destruction-pose", "Aztec feathered-serpent-god descending". Archetypes, not IP names.`;

const RENAISSANCE_CONCEPT_ART_BLOCK = `━━━ RENAISSANCE CONCEPT-ART ━━━

Painterly grandeur. Caravaggio chiaroscuro + Michelangelo anatomy + Frazetta musculature + modern concept-art polish. NEVER generic-RPG-art, NEVER cartoon, NEVER photoreal-documentary. Brushwork-feeling, classical-oil-painting composition, academy-draftsmanship body-and-drapery.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — MYTHIC SUBLIME ━━━

Book-cover / Metropolitan-Museum oil-painting / best-concept-art-ever quality. The kind of frame that belongs in a Renaissance gallery next to Michelangelo. Cosmic + divine + sublime.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — MYTHIC AMPLIFICATION ━━━

Mythology is the canvas, not the ceiling. Stack: cosmic scale + multiple deities + atmospheric drama + divine phenomena + architectural wonder + cultural detail + painterly technique. Book-cover × classical-oil × concept-art × 10. Every render frame-worthy mythological art.`;

const MYTHIC_WOMAN_CANDID_BLOCK = `━━━ MYTHIC WOMAN CANDID (mythic-women path only) ━━━

Any mythic female — goddess, heroine, monster-woman, sorceress, spirit, cursed-being (Medusa, Lamia, Valkyrie, Kitsune-woman). She is in a candid unsuspecting moment — NOT posed for viewer. REALLY FUCKING SEXY + cool-looking but doing something specific: resting, preparing, bathing, gazing, brushing hair, adjusting armor, examining artifact. Voyeuristic "caught-her-in-the-moment" angle. SOLO — no men, no second figure. Any-pantheon, any mythology.`;

const WARM_MYTHIC_BLOCK = `━━━ WARM MYTHIC (cozy-mythic path only) ━━━

Warm quiet mythic pockets. Inhabited cultural spaces: Greek symposium, Norse longhouse, Japanese tea-house, Aztec stone-bath, Celtic druid-cottage, Hindu temple-kitchen, African communal-hearth, Egyptian scribe-study, Chinese immortal-garden. Natural mythic-nature: sacred grove, kami-meadow, fox-spirit-oak, sleeping-dragon-cave, nymph-pool. Pantheon diversity. Peripheral mythic creatures at REST welcome. Never dramatic action — always quiet intimate warmth.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  MYTHIC_SCALE_BLOCK,
  PANTHEON_DIVERSITY_BLOCK,
  NO_NAMED_DEITIES_BLOCK,
  RENAISSANCE_CONCEPT_ART_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
  MYTHIC_WOMAN_CANDID_BLOCK,
  WARM_MYTHIC_BLOCK,
};
