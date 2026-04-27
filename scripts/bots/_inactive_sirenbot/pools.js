/**
 * SirenBot — axis pools.
 *
 * Regenerate any pool:
 *     node scripts/gen-seeds/sirenbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8')
  );
}

module.exports = {
  // ── Shared DNA ──
  SCENE_PALETTES: load('scene_palettes'),
  MAGICAL_ATMOSPHERES: load('magical_atmospheres'),

  // ── Mermaid path ──
  MERMAID_FEATURES: load('mermaid_features'),
  WATER_CONDITIONS: load('water_conditions'),
  MERMAID_SETTINGS: load('mermaid_settings'),
  MERMAID_ACTIONS: load('mermaid_actions'),

  // ── Dark Elf path ──
  DARK_ELF_SETTINGS: load('dark_elf_settings'),
  DARK_ELF_ACTIONS: load('dark_elf_actions'),

  // ── Forest Nymph path ──
  NYMPH_SETTINGS: load('nymph_settings'),
  NYMPH_ACTIONS: load('nymph_actions'),

  // ── Vampire Queen path ──
  VAMPIRE_SETTINGS: load('vampire_settings'),
  VAMPIRE_MOMENTS: load('vampire_moments'),

  // ── Dragon Woman path ──
  DRAGON_WOMAN_SETTINGS: load('dragon_woman_settings'),
  DRAGON_WOMAN_ACTIONS: load('dragon_woman_actions'),

  // ── Sorceress path ──
  SORCERESS_SETTINGS: load('sorceress_settings'),
  SORCERESS_ACTIONS: load('sorceress_actions'),

  // ── Succubus path ──
  SUCCUBUS_SETTINGS: load('succubus_settings'),
  SUCCUBUS_ACTIONS: load('succubus_actions'),

  // ── Archangel path ──
  ARCHANGEL_SETTINGS: load('archangel_settings'),
  ARCHANGEL_ACTIONS: load('archangel_actions'),
};
