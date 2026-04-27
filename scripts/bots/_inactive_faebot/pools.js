/**
 * FaeBot — axis pools.
 *
 * Regenerate any pool:
 *     node scripts/gen-seeds/faebot/gen-<name>.js
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
  FOREST_SEASON: load('forest_season'),
  FOREST_LIGHT: load('forest_light'),
  SCENE_PALETTES: load('scene_palettes'),

  // ── Nymph shared character axes ──
  NYMPH_HAIR: load('nymph_hair'),
  NYMPH_SKIN: load('nymph_skin'),

  // ── Nymph path (lifted from SirenBot) ──
  NYMPH_SETTINGS: load('nymph_settings'),
  NYMPH_ACTIONS: load('nymph_actions'),

  // ── Dryad path ──
  DRYAD_SETTINGS: load('dryad_settings'),
  DRYAD_ACTIONS: load('dryad_actions'),

  // ── Fairy path ──
  FAIRY_SETTINGS: load('fairy_settings'),
  FAIRY_ACTIONS: load('fairy_actions'),

  // ── Fae Queen path ──
  FAE_QUEEN_SETTINGS: load('fae_queen_settings'),
  FAE_QUEEN_ACTIONS: load('fae_queen_actions'),

  // ── Naiad path ──
  NAIAD_SETTINGS: load('naiad_settings'),
  NAIAD_ACTIONS: load('naiad_actions'),

  // ── Druid path ──
  DRUID_SETTINGS: load('druid_settings'),
  DRUID_ACTIONS: load('druid_actions'),

  // ── Green Witch path ──
  GREEN_WITCH_SETTINGS: load('green_witch_settings'),
  GREEN_WITCH_ACTIONS: load('green_witch_actions'),

  // ── Mushroom Spirit path ──
  MUSHROOM_SETTINGS: load('mushroom_settings'),
  MUSHROOM_ACTIONS: load('mushroom_actions'),

  // ── Moth Fairy path (cut) ──
  MOTH_FAIRY_SETTINGS: load('moth_fairy_settings'),
  MOTH_FAIRY_ACTIONS: load('moth_fairy_actions'),

  // ── Siren Nymph path ──
  SIREN_NYMPH_SETTINGS: load('siren_nymph_settings'),
  SIREN_NYMPH_ACTIONS: load('siren_nymph_actions'),
  SIREN_NYMPH_SKIN: load('siren_nymph_skin'),

  // ── Hedge Witch path ──
  HEDGE_WITCH_SETTINGS: load('hedge_witch_settings'),
  HEDGE_WITCH_ACTIONS: load('hedge_witch_actions'),

  // ── Bee Keeper path ──
  BEE_KEEPER_SETTINGS: load('bee_keeper_settings'),
  BEE_KEEPER_ACTIONS: load('bee_keeper_actions'),

  // ── Spore Light path (pure scenery) ──
  SPORE_LIGHT_SETTINGS: load('spore_light_settings'),
  SPORE_LIGHT_ATMOSPHERES: load('spore_light_atmospheres'),

  // ── Moonwell Keeper path ──
  MOONWELL_SETTINGS: load('moonwell_settings'),
  MOONWELL_ACTIONS: load('moonwell_actions'),

  // ── Willow Wisp path ──
  WILLOW_WISP_SETTINGS: load('willow_wisp_settings'),
  WILLOW_WISP_ACTIONS: load('willow_wisp_actions'),

  // ── Changeling path ──
  CHANGELING_SETTINGS: load('changeling_settings'),
  CHANGELING_ACTIONS: load('changeling_actions'),
};
