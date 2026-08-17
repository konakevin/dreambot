/**
 * DinoBot dino-nights — the nocturnal Mesozoic (Stage D1, SHADOW). Moonlit
 * watering holes, hunts by starlight, pre-dawn mist, Milky Way over sauropod
 * silhouettes. First NIGHT register on the bot. The dinosaur doing a candid
 * nocturnal behavior is the HERO, REVEALED by moonlight (land stays visibly lit).
 * night_light REPLACES the universal lighting slot; universal 'atmosphere' only.
 * Eyes catch real light, never glow-fantasy. 0.8-gated night_phenomenon.
 */

module.exports = {
  archetype: 'DINOBOT_DINO_NIGHTS',
  pools: {
    night_scene: 'DINOBOT_DINO_NIGHTS_NIGHT_SCENE',
    night_light: 'DINOBOT_DINO_NIGHTS_NIGHT_LIGHT',
    night_biome: 'DINOBOT_DINO_NIGHTS_NIGHT_BIOME',
    surprise_element: 'DINOBOT_DINO_NIGHTS_SURPRISE_ELEMENT',
    night_phenomenon: 'DINOBOT_DINO_NIGHTS_NIGHT_PHENOMENON',
  },
};
