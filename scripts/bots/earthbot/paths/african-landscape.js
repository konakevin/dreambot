/**
 * EarthBot african-landscape — African raw nature (2026-06-01 v2).
 *
 * Resurrected after the v1 scrap, this time applying the lessons from
 * iceland-raw + andes-patagonia in one shot (no churn). Covers the full
 * breadth of African biomes: savanna grasslands (Serengeti / Maasai
 * Mara / Etosha / Makgadikgadi / Tarangire / Tsavo), Congo Basin
 * rainforest (canopy from above / river floor / understory), Okavango
 * Delta (water channels / papyrus / lily pads), Sahara dunes + Namib
 * coastal red dunes + Deadvlei, Madagascar baobab forest + spiny
 * forest, Cape fynbos coastal scrub, riverine flats (Zambezi / Nile /
 * Lake Turkana), pan-African wildlife at scale-prover scale.
 *
 * NO humans, NO vehicles, NO buildings, NO Maasai village huts,
 * NO acacia-with-jeep, NO safari-tourism vibes.
 *
 * 7 axes — 6 always-on + 1 conditional 25%-gated phenomenon:
 * - subject (African-toponym-anchored hero composition — bespoke pool)
 * - foreground_anchor (close-edge detail: termite mound / baobab root /
 *   delta papyrus / clay-pan crack / fynbos protea bloom / red laterite)
 * - light_condition (African light register: dust-haze sunset / golden-
 *   hour rake / blue-hour twilight / midday overhead / dappled canopy /
 *   star-crowded night / storm light)
 * - atmosphere (savanna dust drift / delta humid mist / rainforest
 *   leaf-and-mud / desert heat-shimmer / fynbos sea-spray)
 * - sky_layer (sky cover: anvil thunderhead / banner cumulus / hot
 *   cobalt midday / mare-tail cirrus / Milky Way arch — African,
 *   biome-appropriate)
 * - scale_prover (postage-stamp element: lone elephant / zebra herd
 *   thread / giraffe pair / wildebeest column / lion silhouette /
 *   chimp in canopy / lemur on baobab / hippo / flamingo flock —
 *   biome-appropriate to subject)
 * - phenomenon (25%-gated: dust storm / virga curtain / distant
 *   thunderstorm / mirage shimmer / grass-burn smoke column)
 *
 * Lessons applied from [[feedback_regional_path_buildout_lessons]]:
 *   1. Subject pool entries LEAD with the African toponym in first 5-8
 *      words (Serengeti / Maasai Mara / Okavango / Sahara / Madagascar /
 *      Cape fynbos / Nile / Zambezi / Congo / Etosha / Makgadikgadi).
 *   2. BIOME-AGNOSTIC prefix per the Andes/Iceland fix — just
 *      "African raw nature" + quality terms. NO biome enumeration in
 *      the prefix (Lesson #11). The SCENE content carries the biome.
 *   3. Added to twoPassPolish.skipPaths so Serengeti / Maasai Mara /
 *      Okavango / Nile / Sahara survive into the Flux prompt verbatim.
 *   4. NO photographer names anywhere (Frans Lanting / Nick Brandt /
 *      Beverly Joubert / Salgado / Art Wolfe — Art Wolfe especially
 *      leaked mountain content into v1 R0).
 *   5. NO negation language ("no mountains" → renders mountains, per
 *      [[feedback_negative_prompt_leak]]).
 *   6. Template explicitly tells Sonnet NO meta-headers at the open
 *      (v1 had Sonnet writing "EarthBot::render_african —" preambles).
 *   7. Per-biome scale-prover quotas in the recipe so Sahara prompts
 *      don't get elephant-on-savanna scale-provers injected (v1 R5
 *      Sahara-with-elephant mismatch).
 *   8. Subject recipe enforces per-biome distribution targets so a
 *      25-entry pool actually spans the 8 biomes (v1 R0 was 5/5 savanna
 *      because no quota).
 *
 * v1 was scrapped 2026-06-01 after R6 finally produced clean African
 * scenes but the journey was too painful. This v2 ships the
 * iceland/andes recipe directly without R0→R6 churn.
 */

module.exports = {
  archetype: 'EARTHBOT_AFRICAN_LANDSCAPE',
  pools: {
    subject: 'AFRICAN_LANDSCAPE_SUBJECT',
    foreground_anchor: 'AFRICAN_LANDSCAPE_FOREGROUND_ANCHOR',
    light_condition: 'AFRICAN_LANDSCAPE_LIGHT_CONDITION',
    atmosphere: 'AFRICAN_LANDSCAPE_ATMOSPHERE',
    sky_layer: 'AFRICAN_LANDSCAPE_SKY_LAYER',
    scale_prover: 'AFRICAN_LANDSCAPE_SCALE_PROVER',
    phenomenon: 'AFRICAN_LANDSCAPE_PHENOMENON',
  },
};
