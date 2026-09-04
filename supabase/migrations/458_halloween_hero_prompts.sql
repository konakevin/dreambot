-- 458: Halloween day-of HERO recipes (mig 457 table) — 6 rows: couple/male/female × cozy/eerie.
--
-- v2 (2026-09-04, after the first QA + a 500-user diversity simulation): the v1 recipes had ONE
-- fixed setting + outfit per row, so only ~20% of each prompt varied and 500 users collapsed onto
-- ~100 prompts. v2 makes the two biggest visual levers AXES too — `{setting}` (6 distinct places
-- per row, each leading with its Halloween-specific noun so CLIP locks onto it) and `{attire}`
-- (4 outfits) — on top of `{palette}` (DECOR colour, not light — coloured light on faces was the
-- prime suspect in the couple identity failures), `{flourish}`, `{time}` and `{role}`.
-- 6·4·4·6·3·3 = 5184 combos per row → 500 users ≈ 477 distinct heroes.
--
-- Face-swap rules (HOLIDAY_DREAMS_PLAN.md §6): attire = clothing only, nothing at the jawline
-- (no high collars, hoods, veils — hats only "tilted back off the face"), couples side by side
-- with a clear gap between their heads, scene = pure environment. Mediums = the ones that PASSED
-- the Aug-19 archetype QA + this QA round (painted_gothic_fantasy for eerie, photography for cozy;
-- gothic_painted dropped: it rendered a torn-edge watercolor and lost the wardrobe).
-- v4: the COUPLE eerie hero is PHOTOGRAPHY, not painterly. Under the identity gate (mig 455 floor
-- 0.25, newer than the Aug-19 archetype QA) painterly dual swaps fail the +1 side ~85% of the time and
-- degrade to a solo; the same scenes on photography passed every A/B seed. Solos keep the painterly
-- medium (no identity gate on solos; cinematic gothic photography is arguably the bigger wow anyway).
-- v3: scenes are PURE ENVIRONMENT (HOLIDAY_DREAMS_PLAN.md §6 — no people / "the couple" / role clauses;
-- the v2 people clause made 8/9 couple heroes fail identity: Flux added figures the dual detector
-- latched onto). The `role` axis was dropped with it. Prompt-craft: no negations — they leak.
-- Re-runnable: ON CONFLICT updates in place (tune → `apply-migration.mjs 458 --force`).

INSERT INTO public.holiday_hero_prompts
  (holiday, surface, register, attire, scene, medium_key, pose_pool, axes, notes)
VALUES
-- ══ EERIE ═════════════════════════════════════════════════════════════════════════════════
('halloween', 'couple', 'eerie',
 $a${attire}, faces fully lit$a$,
 $s${setting} {time}, {palette}, {flourish}$s$,
 'photography', NULL,
 $j${
  "setting": [
    "A grand candlelit gothic ballroom with dripping crystal chandeliers, a sweeping marble staircase, black roses and carved jack-o-lanterns in silver urns",
    "A moonlit castle courtyard with ivy-choked stone arches, torches in iron sconces, carved jack-o-lanterns lining the steps",
    "A haunted manor library with towering shelves, a roaring fireplace, candelabras on every table, jack-o-lanterns glowing on the hearth",
    "An overgrown gothic conservatory with black roses climbing the glass, hanging lanterns, fog curling along the floor",
    "A candlelit gothic chapel with stained-glass moonlight, rows of pillar candles, black-rose garlands over the pews",
    "The rooftop terrace of a gothic cathedral under a huge moon, stone gargoyles, bats streaming across the sky, lanterns on the parapet"
  ],
  "attire": [
    "Opulent gothic formalwear: she in a floor-length velvet gown with a jeweled choker, he in a sharp velvet tailcoat over a brocade waistcoat with a silk cravat",
    "Gothic evening wear: she in a black lace gown with sheer sleeves and a ruby pendant, he in a long black frock coat over a crimson silk vest",
    "Dark romance formalwear: she in an off-shoulder satin gown with a dramatic sweep of fabric, he in a midnight-blue military-style coat with silver buttons",
    "Victorian gothic dress: she in a corseted brocade gown with a sheer cape at the shoulders, he in a dark three-piece suit with a black cravat and a silver-topped cane"
  ],
  "palette": ["crimson-and-black velvet drapes and roses", "emerald-and-antique-gold banners and tablecloths", "violet-and-silver garlands and ribbons", "amber lanterns and deep-orange pumpkins everywhere"],
  "flourish": ["a raven perched on the balustrade", "a sleek black cat at their feet", "a towering wrought-iron candelabra dripping wax", "an ornate jeweled goblet in hand", "a cluster of glowing jack-o-lanterns at the edge of frame", "drifting paper lanterns overhead"],
  "time": ["at the stroke of midnight", "under a huge blood-orange full moon", "as fog rolls in through the open doors"]
 }$j$::jsonb,
 'Gothic Halloween gala (couple) — v2 setting+attire axes'),

('halloween', 'male', 'eerie',
 $a${attire}, hair swept back, face fully lit$a$,
 $s${setting} {time}, {palette}, {flourish}$s$,
 'photography', 'glamour',
 $j${
  "setting": [
    "A candlelit gothic castle hall with a long feast table of black grapes and carved jack-o-lanterns, iron candelabras, tall arched windows spilling moonlight",
    "A moonlit castle courtyard with ivy-choked stone arches, torches in iron sconces, carved jack-o-lanterns lining the steps",
    "A haunted manor library with towering shelves, a roaring fireplace, candelabras on every table, jack-o-lanterns glowing on the hearth",
    "A fog-drowned cobblestone village square at midnight, guttering lanterns, a crooked apothecary, carved jack-o-lanterns on every doorstep",
    "A candlelit gothic chapel with stained-glass moonlight, rows of pillar candles, black-rose garlands over the pews",
    "The rooftop terrace of a gothic cathedral under a huge moon, stone gargoyles, bats streaming across the sky, lanterns on the parapet"
  ],
  "attire": [
    "A floor-length black opera cape with crimson silk lining over sharp Victorian formalwear, an onyx brooch at the throat",
    "A long black frock coat over a crimson silk vest, a black cravat, leather gloves",
    "A midnight-blue military-style coat with silver buttons and braided epaulettes over a white shirt",
    "A dark three-piece suit with a brocade waistcoat, a black cravat and a silver-topped cane"
  ],
  "palette": ["crimson-and-black velvet drapes and roses", "emerald-and-antique-gold banners and tablecloths", "violet-and-silver garlands and ribbons", "amber lanterns and deep-orange pumpkins everywhere"],
  "flourish": ["a raven perched on the chair back", "a sleek black cat at his feet", "a towering wrought-iron candelabra dripping wax", "an ornate jeweled goblet in hand", "a cluster of glowing jack-o-lanterns at the edge of frame", "bats wheeling past the window"],
  "time": ["at the stroke of midnight", "under a huge blood-orange full moon", "as fog rolls in through the open doors"]
 }$j$::jsonb,
 'Gothic Halloween gala (male solo) — v2'),

('halloween', 'female', 'eerie',
 $a${attire}, face fully lit$a$,
 $s${setting} {time}, {palette}, {flourish}$s$,
 'painted_gothic_fantasy', 'glamour',
 $j${
  "setting": [
    "A ring of floating candles around a glowing green cauldron in a moonlit forest clearing, carved jack-o-lanterns ringing the circle, gnarled trees",
    "A grand candlelit gothic ballroom staircase with dripping crystal chandeliers, black roses and carved jack-o-lanterns in silver urns",
    "A haunted rose garden under the moon with black roses, a cracked marble fountain, glowing fireflies and carved jack-o-lanterns on the path",
    "A candlelit witch's cottage with a bubbling cauldron, shelves of glowing potions, floating candles, a black cat on a spellbook",
    "An overgrown gothic conservatory with black roses climbing the glass, hanging lanterns, fog curling along the floor",
    "The rooftop terrace of a gothic cathedral under a huge moon, stone gargoyles, bats streaming across the sky, lanterns on the parapet"
  ],
  "attire": [
    "A flowing off-shoulder midnight-velvet gown with trailing chiffon sleeves, a wide-brim pointed witch hat tilted back off the face, silver star jewelry",
    "A black lace gown with sheer sleeves and a ruby pendant, long gloves",
    "A gown of deep-plum and black petals with gossamer dark wings, a delicate thorn-and-berry crown resting back off the brow",
    "A corseted crimson brocade gown with a sheer black cape at the shoulders, a jeweled choker"
  ],
  "palette": ["crimson-and-black velvet drapes and roses", "emerald witch-light lanterns and gold", "violet-and-silver garlands and ribbons", "amber lanterns and deep-orange pumpkins everywhere"],
  "flourish": ["a sleek black cat at her feet", "a raven perched nearby", "a broomstick leaning close by", "an ornate jeweled goblet in hand", "a cluster of glowing jack-o-lanterns at the edge of frame", "drifting will-o-wisps in the mist"],
  "time": ["at the stroke of midnight", "under a huge blood-orange full moon", "as fog rolls in around her"]
 }$j$::jsonb,
 'Gothic Halloween (female solo) — v2'),

-- ══ COZY ══════════════════════════════════════════════════════════════════════════════════
('halloween', 'couple', 'cozy',
 $a${attire}, faces fully lit$a$,
 $s${setting} {time}, {palette}, {flourish}$s$,
 'photography', NULL,
 $j${
  "setting": [
    "A glowing front porch decked out for Halloween, dozens of carved jack-o-lanterns down the steps, an autumn wreath on the door",
    "A cozy living room decked for Halloween with a crackling fireplace, a mantel of carved jack-o-lanterns, cobweb garlands, a big bowl of candy",
    "A pumpkin patch at dusk with hay bales, a red wagon piled with pumpkins, glowing jack-o-lanterns on the fence posts",
    "A small-town Main Street on Halloween night, shop windows glowing, paper bats and string lights, hay bales and pumpkins on every corner",
    "A barn Halloween party with string lights across the rafters, hay-bale seating, a cider table and carved pumpkins everywhere",
    "A lantern-lit hay wagon on a misty farm lane at night, pumpkins and blankets piled in the back, jack-o-lanterns on the fence"
  ],
  "attire": [
    "Festive Halloween-night outfits: she in a rust-orange knit sweater with a witch-hat headband tipped back off her face, he in a plaid flannel with a tiny felt bat pin, both in warm scarves",
    "Cozy autumn layers: she in a cream cable-knit sweater with a small felt bat pin, he in a rust corduroy jacket over a plaid shirt",
    "Playful Halloween-night looks: she in a black turtleneck with an orange knit beanie, he in a denim jacket with a pumpkin pin",
    "Matching orange-and-black striped scarves over cozy sweaters, she in a plaid flannel dress with tall boots, he in a shawl-collar cardigan"
  ],
  "palette": ["warm amber string-lights", "orange-and-purple fairy lights", "golden candle-glow", "soft pumpkin-orange lanterns"],
  "flourish": ["a big bowl of candy on the top step", "a black cat curled up on a pumpkin", "two steaming mugs of cider", "a giant carved jack-o-lantern grinning beside them", "a friendly skeleton propped in a rocking chair", "a string of paper bats overhead"],
  "time": ["at dusk on Halloween night", "just after sunset with the lights on", "under a big harvest moon"]
 }$j$::jsonb,
 'Cozy Halloween night (couple) — v2 setting+attire axes'),

('halloween', 'male', 'cozy',
 $a${attire}, face fully lit$a$,
 $s${setting} {time}, {palette}, {flourish}$s$,
 'photography', 'glamour',
 $j${
  "setting": [
    "A cozy front porch decked out for Halloween, a pile of carved jack-o-lanterns on the steps, a candy cauldron by the door",
    "A cozy living room decked for Halloween with a crackling fireplace, a mantel of carved jack-o-lanterns, cobweb garlands, a big bowl of candy",
    "A pumpkin patch at dusk with hay bales, a red wagon piled with pumpkins, glowing jack-o-lanterns on the fence posts",
    "A small-town Main Street on Halloween night, shop windows glowing, paper bats and string lights, hay bales and pumpkins on every corner",
    "A barn Halloween party with string lights across the rafters, hay-bale seating, a cider table and carved pumpkins everywhere",
    "A lantern-lit hay wagon on a misty farm lane at night, pumpkins and blankets piled in the back, jack-o-lanterns on the fence"
  ],
  "attire": [
    "A chunky cable-knit sweater with a small felt bat pin, dark jeans and boots, a soft plaid scarf",
    "A rust corduroy jacket over a plaid flannel shirt, dark jeans, leather boots",
    "A denim jacket with a pumpkin pin over a black henley, an orange knit beanie",
    "A shawl-collar cardigan over a white tee, an orange-and-black striped scarf"
  ],
  "palette": ["warm amber string-lights", "orange-and-purple fairy lights", "golden candle-glow", "soft pumpkin-orange lanterns"],
  "flourish": ["a big bowl of candy on the top step", "a black cat curled up on a pumpkin", "a steaming mug of cider in hand", "a giant carved jack-o-lantern grinning beside him", "a friendly skeleton propped in a rocking chair", "a string of paper bats overhead"],
  "time": ["at dusk on Halloween night", "just after sunset with the lights on", "under a big harvest moon"]
 }$j$::jsonb,
 'Cozy Halloween night (male solo) — v2'),

('halloween', 'female', 'cozy',
 $a${attire}, face fully lit$a$,
 $s${setting} {time}, {palette}, {flourish}$s$,
 'photography', 'glamour',
 $j${
  "setting": [
    "A cozy front porch decked out for Halloween, a pile of carved jack-o-lanterns on the steps, a candy cauldron by the door",
    "A cozy living room decked for Halloween with a crackling fireplace, a mantel of carved jack-o-lanterns, cobweb garlands, a big bowl of candy",
    "A pumpkin patch at dusk with hay bales, a red wagon piled with pumpkins, glowing jack-o-lanterns on the fence posts",
    "A small-town Main Street on Halloween night, shop windows glowing, paper bats and string lights, hay bales and pumpkins on every corner",
    "A barn Halloween party with string lights across the rafters, hay-bale seating, a cider table and carved pumpkins everywhere",
    "A lantern-lit hay wagon on a misty farm lane at night, pumpkins and blankets piled in the back, jack-o-lanterns on the fence"
  ],
  "attire": [
    "A rust-orange knit sweater dress with a plaid scarf, a witch-hat headband tipped back off her face, tall boots",
    "A cream cable-knit sweater with a small felt bat pin, dark jeans, ankle boots",
    "A black turtleneck with an orange knit beanie, a plaid wool coat",
    "A plaid flannel dress with tights and tall boots, an orange-and-black striped scarf"
  ],
  "palette": ["warm amber string-lights", "orange-and-purple fairy lights", "golden candle-glow", "soft pumpkin-orange lanterns"],
  "flourish": ["a big bowl of candy on the top step", "a black cat curled up on a pumpkin", "a steaming mug of cider in hand", "a giant carved jack-o-lantern grinning beside her", "a friendly skeleton propped in a rocking chair", "a string of paper bats overhead"],
  "time": ["at dusk on Halloween night", "just after sunset with the lights on", "under a big harvest moon"]
 }$j$::jsonb,
 'Cozy Halloween night (female solo) — v2')
ON CONFLICT (holiday, surface, register) DO UPDATE SET
  attire = EXCLUDED.attire, scene = EXCLUDED.scene, medium_key = EXCLUDED.medium_key,
  pose_pool = EXCLUDED.pose_pool, axes = EXCLUDED.axes, notes = EXCLUDED.notes, disabled = false;

SELECT surface, register, medium_key,
       (SELECT string_agg(k || '=' || jsonb_array_length(axes->k), ' ' ORDER BY k) FROM jsonb_object_keys(axes) k) AS axis_sizes
FROM public.holiday_hero_prompts WHERE holiday = 'halloween' ORDER BY 1, 2;
