-- 605: three new places for Romantic Escapes (Kevin 2026-09-30: "romantic escapes, and yes build those three ... make
-- them very pretty, lots of lush details, romantic, classy, cute"). Cherry Blossoms and Tuscan Villa reuse the empty
-- legacy card rows of those names (no spots, never in the picker); Lavender Fields is new.
-- Recipes from generate-full-location-card.js under descriptive names (merged or renamed here). Spots: real named
-- places authored per sub-region, strictly graded (S/A), then enriched by a set-dresser pass (one or two lush, romantic
-- details that belong there, 12 words max, no people / time / weather). Eligibility per the playbook: cast = non-wide,
-- scene-only = non-intimate. biome_config (cleared here) and WARDROBE come from the playbook scripts after this, steered
-- by the must_include lines. picker_category romantic_escapes (no released app lists it); admin_only until QA sign-off.

UPDATE public.location_cards w SET tags = t.tags, visual_palette = t.visual_palette, atmosphere = t.atmosphere,
  architecture = t.architecture, light_signature = t.light_signature, texture_details = t.texture_details,
  cinematic_phrases = t.cinematic_phrases, fusion_settings = t.fusion_settings, prompt_version = t.prompt_version,
  model_version = t.model_version
FROM public.location_cards t WHERE w.name = 'cherry blossoms' AND t.name ILIKE 'cherry blossoms, the world%';
DELETE FROM public.location_cards WHERE name ILIKE 'cherry blossoms, the world%' AND picker_category IS NULL;
UPDATE public.location_cards SET display_name = 'Cherry Blossoms', picker_category = 'romantic_escapes', picker_tile = 'romance',
  picker_sort_order = 20, biome = 'zen_garden', biome_config = NULL, is_approved = true, admin_only = true,
  content_kind = 'place', sub_regions = ARRAY['Kyoto (Philosopher''s Path, Maruyama Park, Heian Shrine, Shirakawa canal, Arashiyama)', 'Tokyo and Kanto (Chidorigafuchi, Meguro River, Shinjuku Gyoen, Chureito Pagoda)', 'Castles in bloom (Hirosaki, Himeji, Matsumoto, Osaka)', 'Beyond Japan (Washington DC Tidal Basin, Jinhae, Vancouver, Bonn)']::text[], must_include = ARRAY['cherry trees in full bloom arching over water, paths and footbridges', 'petals drifting on canals, moats and still ponds', 'stone lanterns, vermilion torii and wooden bridges among the blossoms', 'castles and pagodas framed by clouds of blossom', 'soft pink and white abundance: lush, romantic, classy, never sparse']::text[]
WHERE name = 'cherry blossoms';
INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible) VALUES
  ('cherry blossoms', 'Philosopher''s Path stone-edged canal, petals drifting beneath blossom tunnel', 'intimate', 'S', true, false, true),
  ('cherry blossoms', 'Maruyama Park weeping cherry, stone lantern beneath cascading boughs', 'medium', 'S', true, true, true),
  ('cherry blossoms', 'Heian Shrine vermilion torii, blossom garden with moss-edged gravel', 'medium', 'S', true, true, true),
  ('cherry blossoms', 'Shirakawa Canal stone lanterns, blossom petals drifting on still water', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Togetsukyo Bridge, Arashiyama blossom slopes reflected in the river', 'wide', 'S', true, true, false),
  ('cherry blossoms', 'Heian Shrine inner pond, arching blossom boughs over still water', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Philosopher''s Path mossy stone walls beneath a cherry canopy', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Arashiyama hillside panorama, honey-toned temple roofs among blossoms', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Maruyama Park lawns beneath cascading blossom canopy, stone lantern nearby', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Shirakawa Canal willow-and-cherry banks, petals drifting on water', 'medium', 'A', true, true, true),
  ('cherry blossoms', 'Tenryu-ji garden pond, blossoms framing Arashiyama peaks beyond', 'wide', 'S', true, true, false),
  ('cherry blossoms', 'Heian Shrine garden zigzag bridge, blossom boughs arching overhead', 'medium', 'A', true, true, true),
  ('cherry blossoms', 'Gion Shirakawa ochaya facade, climbing cherry blossom and stone lantern', 'medium', 'S', true, true, true),
  ('cherry blossoms', 'Philosopher''s Path ancient stone bridge beneath a blossom arch', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Nijo Castle honey-stone walls crowned with cherry blossom', 'medium', 'A', true, true, true),
  ('cherry blossoms', 'Arashiyama Hozu River gorge, blossom-draped slopes above still water', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Chidorigafuchi moat, blossom canopy trailing petals on the water', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Meguro River canal, cherry blossom boughs meeting overhead', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Shinjuku Gyoen sweeping blossom lawns with a wrought-iron bench', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Ueno Park great blossom avenue, stone lanterns lining the path', 'medium', 'A', true, true, true),
  ('cherry blossoms', 'Chureito Pagoda above Fujiyoshida, cherry blossoms and Mount Fuji beyond', 'wide', 'S', true, true, false),
  ('cherry blossoms', 'Chidorigafuchi overhanging blossom boughs, petals drifting on still water', 'medium', 'S', true, true, true),
  ('cherry blossoms', 'Meguro River blossom tunnel, Nakameguro, petals on the canal', 'intimate', 'S', true, false, true),
  ('cherry blossoms', 'Mount Fuji and Kawaguchiko lakeshore, cherry blossoms reflected in water', 'wide', 'S', true, true, false),
  ('cherry blossoms', 'Chureito Pagoda stone stairway, cherry blossoms lining every step', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Ueno Park Shinobazu Pond, blossom boughs reflected in still water', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Arakurayama Sengen Park blossom terraces, Mount Fuji rising beyond', 'wide', 'S', true, true, false),
  ('cherry blossoms', 'Koishikawa Korakuen garden stone bridge, blossom boughs arching over water', 'medium', 'A', true, true, true),
  ('cherry blossoms', 'Hirosaki Castle keep rising above a blossom-carpeted moat', 'wide', 'S', true, true, false),
  ('cherry blossoms', 'Hirosaki Castle west moat, fallen blossom petals on still water', 'wide', 'S', true, true, false),
  ('cherry blossoms', 'Hirosaki Castle stone bridge, cherry petals drifting on the moat', 'medium', 'A', true, true, true),
  ('cherry blossoms', 'Hirosaki Castle turret and cherry blossom reflected in the moat', 'medium', 'A', true, true, true),
  ('cherry blossoms', 'Hirosaki Castle inner gate, blossom boughs forming a soft tunnel', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Himeji Castle white tower rising above a sea of cherry blossom', 'wide', 'S', true, true, false),
  ('cherry blossoms', 'Himeji Castle great keep along a stone-lantern-lined blossom avenue', 'medium', 'S', true, true, true),
  ('cherry blossoms', 'Himeji Castle Nishinomaru garden, cherry blossom corridor with stone path', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Matsumoto Castle black keep and cherry blossom mirrored in the moat', 'medium', 'S', true, true, true),
  ('cherry blossoms', 'Matsumoto Castle ramparts, cherry blossom boughs edging honey-stone walls', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Matsumoto Castle bridge over a blossom-lined, petal-scattered moat', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Osaka Castle golden tower above a cherry blossom sea', 'wide', 'S', true, true, false),
  ('cherry blossoms', 'Osaka Castle Nishino-maru garden, drifting pale petals over the lawn', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Osaka Castle turret framed by arching cherry boughs in full bloom', 'medium', 'A', true, true, true),
  ('cherry blossoms', 'Jefferson Memorial rising above Tidal Basin, blossom-reflected waters', 'medium', 'S', true, true, true),
  ('cherry blossoms', 'Tidal Basin, petals drifting on mirror-still cherry-lined waters', 'wide', 'S', true, true, false),
  ('cherry blossoms', 'Jinhae Gyeongwha Station platform beneath a soft blossom canopy', 'intimate', 'S', true, false, true),
  ('cherry blossoms', 'Yeojwacheon Stream blossom tunnel, Jinhae, petals on quiet water', 'intimate', 'S', true, false, true),
  ('cherry blossoms', 'Jinhae harbour, pink blossom-laden boughs framing still water', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Gyeongwha Station clock tower wreathed in cherry blossoms, Jinhae', 'medium', 'A', true, true, true),
  ('cherry blossoms', 'Stanley Park seawall, cherry blossoms edging the stone path', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Bonn Heerstrasse, twin rows of blossoming cherry trees in avenue', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Heerstrasse blossom canopy tunnel, Bonn, petals on the path', 'intimate', 'S', true, false, true),
  ('cherry blossoms', 'Heerstrasse pink corridor converging to a soft vanishing point', 'medium', 'A', true, true, true),
  ('cherry blossoms', 'Washington DC National Mall, cherry groves framing the stone monuments', 'wide', 'A', true, true, false),
  ('cherry blossoms', 'Tidal Basin arched footbridge beneath overhanging cherry boughs', 'intimate', 'A', true, false, true),
  ('cherry blossoms', 'Jefferson Memorial colonnade, blossoming branches laced between columns', 'medium', 'S', true, true, true)
ON CONFLICT (location_key, spot_text) DO NOTHING;

UPDATE public.location_cards w SET tags = t.tags, visual_palette = t.visual_palette, atmosphere = t.atmosphere,
  architecture = t.architecture, light_signature = t.light_signature, texture_details = t.texture_details,
  cinematic_phrases = t.cinematic_phrases, fusion_settings = t.fusion_settings, prompt_version = t.prompt_version,
  model_version = t.model_version
FROM public.location_cards t WHERE w.name = 'tuscan villa' AND t.name ILIKE 'tuscan villa, romantic tuscany%';
DELETE FROM public.location_cards WHERE name ILIKE 'tuscan villa, romantic tuscany%' AND picker_category IS NULL;
UPDATE public.location_cards SET display_name = 'Tuscan Villa', picker_category = 'romantic_escapes', picker_tile = 'romance',
  picker_sort_order = 30, biome = 'mediterranean_coastal', biome_config = NULL, is_approved = true, admin_only = true,
  content_kind = 'place', sub_regions = ARRAY['Val d''Orcia (Vitaleta chapel, Poggio Covili cypress road, Podere Belvedere)', 'Hilltop towns (Montepulciano, San Gimignano, Pienza, Montalcino, Cortona)', 'Villas and gardens (Villa Medici Fiesole, Boboli, Villa Gamberaia)', 'Chianti wine country (Castello di Brolio, Greve, Radda)']::text[], must_include = ARRAY['honey-stone villas draped in climbing roses and wisteria', 'cypress-lined drives and avenues', 'vineyard terraces and silver olive groves', 'loggias, pergolas and linen-draped tables among the vines', 'potted lemon trees, fountains and clipped box gardens', 'warm, lush, classy Italian romance']::text[]
WHERE name = 'tuscan villa';
INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible) VALUES
  ('tuscan villa', 'Cappella della Madonna di Vitaleta, cypress-lined approach on honey stone', 'medium', 'S', true, true, true),
  ('tuscan villa', 'Val d''Orcia rolling wheat hills, lone cypress sentinel on the ridge', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Agriturismo Poggio Covili, stately double cypress avenue, gravel underfoot', 'intimate', 'A', true, false, true),
  ('tuscan villa', 'Val d''Orcia serpentine gravel road through golden fields and vineyards', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Cappella della Madonna di Vitaleta, honey-stone chapel facade with climbing roses', 'medium', 'S', true, true, true),
  ('tuscan villa', 'Pienza hilltop ramparts, potted lemon trees above the Val d''Orcia', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Val d''Orcia lone cypress sentinel on a bare golden hill', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Bagno Vignoni Piazza delle Sorgenti, steaming travertine thermal pool', 'intimate', 'S', true, false, true),
  ('tuscan villa', 'Val d''Orcia wheat field furrows converging toward cypress-crested hills', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Monticchiello medieval stone gate archway, climbing roses on honey stone', 'intimate', 'A', true, false, true),
  ('tuscan villa', 'San Quirico d''Orcia Horti Leonini, clipped boxwood parterres and stone paths', 'intimate', 'A', true, false, true),
  ('tuscan villa', 'Val d''Orcia crested cypress ridge above softly rolling harvest hills', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Bagno Vignoni, travertine-edged ancient thermal basin wreathed in mist', 'intimate', 'A', true, false, true),
  ('tuscan villa', 'San Gimignano medieval towers above vine-draped valley, linen-draped tables near', 'wide', 'S', true, true, false),
  ('tuscan villa', 'Piazza Grande Montepulciano, honey-stone facades and a wrought-iron bench', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Pienza cathedral facade, climbing roses framing the Renaissance portal', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Montalcino fortress ramparts above rolling vineyards, potted lemon trees edging stone', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Cortona Piazza della Repubblica, terraced honey-stone steps with potted geraniums', 'medium', 'A', true, true, true),
  ('tuscan villa', 'San Gimignano Piazza della Cisterna, ancient cobblestones and a stone well', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Cortona Santa Margherita basilica hilltop terrace, valley panorama beyond stone balustrade', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Sant''Antimo abbey, warm travertine nave with climbing roses on exterior walls', 'intimate', 'A', true, false, true),
  ('tuscan villa', 'Villa Gamberaia water parterre, Settignano, clipped hedges mirrored in still water', 'wide', 'S', true, true, false),
  ('tuscan villa', 'Boboli Gardens amphitheatre, Florence, stone tiers wreathed in climbing roses', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Villa Medici Fiesole, terraced garden with potted lemon trees above Florence', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Boboli Gardens Neptune fountain basin, rose petals drifting on still water', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Villa Gamberaia nymphaeum grotto arcade, moss-draped stone niches and climbing fern', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Villa Medici Fiesole stone balustrade terrace, potted lemon trees along honey-stone balustrade', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Boboli Gardens Viottolone cypress avenue, a wrought-iron bench beneath the towering cypresses', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Villa Gamberaia clipped box parterre, gravel paths edged with sculpted emerald hedges', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Boboli Gardens Isolotto island fountain, climbing roses reflected in the encircling moat', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Villa Medici Fiesole wisteria-draped loggia, cascading violet blossoms over honey-stone columns', 'intimate', 'A', true, false, true),
  ('tuscan villa', 'Castello di Brolio battlements, vine terraces descending between ancient stone parapets', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Greve in Chianti triangular piazza, stone arcades draped with climbing roses', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Radda in Chianti medieval stone gateway, climbing roses softening ancient honey-stone arch', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Brolio vineyard terraces descending to a cypress-lined valley floor', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Castello di Brolio rose garden courtyard, heirloom blooms against weathered stone walls', 'intimate', 'A', true, false, true),
  ('tuscan villa', 'Brolio estate chapel, ancient cypress sentinels and stone lanterns lining the path', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Panzano in Chianti stone piazza, potted lemon trees beside a valley panorama', 'medium', 'A', true, true, true),
  ('tuscan villa', 'Lamole terraced vineyards, dry-stone walls laced with wild roses above Chianti forest', 'wide', 'A', true, true, false),
  ('tuscan villa', 'Badia a Passignano abbey cloister, stone arches framing an enclosed lavender garden', 'intimate', 'A', true, false, true),
  ('tuscan villa', 'Vertine hilltop village stone lane, climbing roses between ancient vine-covered walls', 'intimate', 'A', true, false, true)
ON CONFLICT (location_key, spot_text) DO NOTHING;

UPDATE public.location_cards SET name = 'lavender fields' WHERE name ILIKE 'lavender fields, the world%'
  AND NOT EXISTS (SELECT 1 FROM public.location_cards WHERE name = 'lavender fields');
UPDATE public.location_cards SET display_name = 'Lavender Fields', picker_category = 'romantic_escapes', picker_tile = 'romance',
  picker_sort_order = 40, biome = 'mediterranean_coastal', biome_config = NULL, is_approved = true, admin_only = true,
  content_kind = 'place', sub_regions = ARRAY['Provence (Valensole, Senanque Abbey, Sault, Gordes, Luberon)', 'Hokkaido (Farm Tomita, Biei, Kamifurano)', 'England (Heacham, Snowshill, Mayfield)', 'Elsewhere (Brihuega, Hvar, Tasmania)']::text[], must_include = ARRAY['endless rows of lavender in full purple bloom', 'stone abbeys, bories and farmhouses among the lavender', 'lavender spilling over dry-stone walls and village lanes', 'sunflower and cosmos borders beside the rows', 'soft, dreamy, romantic abundance']::text[]
WHERE name = 'lavender fields';
INSERT INTO public.location_iconic_spots (location_key, spot_text, spot_kind, quality_tier, is_active, pure_scene_eligible, character_eligible) VALUES
  ('lavender fields', 'Valensole Plateau lavender stretching to distant Alpine foothills, a lone dry-stone borie', 'wide', 'S', true, true, false),
  ('lavender fields', 'Abbaye de Sénanque, Romanesque honey-stone walls embracing violet lavender rows', 'medium', 'S', true, true, true),
  ('lavender fields', 'Sénanque Abbey cloister lavender garden, stone arches enclosing sculpted violet rows', 'intimate', 'A', true, false, true),
  ('lavender fields', 'Sault valley lavender fields curving toward Mont Ventoux, a dry-stone wall border', 'wide', 'S', true, true, false),
  ('lavender fields', 'Gordes perched village above Luberon lavender terraces, golden limestone walls glowing', 'wide', 'S', true, true, false),
  ('lavender fields', 'Roussillon ochre cliffs edged with lavender borders, warm sienna stone paths below', 'medium', 'S', true, true, true),
  ('lavender fields', 'Borie dry-stone shepherd hut, Plateau de Claparèdes lavender flowing around ancient stone', 'medium', 'A', true, true, true),
  ('lavender fields', 'Ménerbes village lane, lavender spilling between weathered stone walls on both sides', 'intimate', 'A', true, false, true),
  ('lavender fields', 'Lacoste château ruins, crumbling stone arches overlooking a Luberon lavender expanse', 'wide', 'A', true, true, false),
  ('lavender fields', 'Lourmarin château courtyard, lavender beds enclosed by honey-stone Renaissance walls', 'intimate', 'A', true, false, true),
  ('lavender fields', 'Farm Tomita lavender fields, striped violet rows stretching toward distant Hokkaido peaks', 'wide', 'A', true, true, false),
  ('lavender fields', 'Biei Patchwork Road rolling across quilted lavender and wheat hillsides', 'wide', 'S', true, true, false),
  ('lavender fields', 'Biei Blue Pond, mineral-turquoise water mirrored amid lavender-bordered shores', 'medium', 'A', true, true, true),
  ('lavender fields', 'Biei Christmas Tree lone spruce, rising from a surrounding flowering lavender field', 'medium', 'S', true, true, true),
  ('lavender fields', 'Biei patchwork hills from Shikisai-no-Oka, lavender and cosmos terraces in quiet rows', 'wide', 'S', true, true, false),
  ('lavender fields', 'Norfolk Lavender fields, honey-stone barns edging the purple rows', 'wide', 'A', true, true, false),
  ('lavender fields', 'Snowshill Manor terraced gardens, climbing roses on stone walls', 'wide', 'S', true, true, false),
  ('lavender fields', 'Mayfield Lavender hillside, a wrought-iron bench among the purple rows', 'wide', 'S', true, true, false),
  ('lavender fields', 'Snowshill Manor dovecote, lavender rows and lichen-dusted stone', 'medium', 'A', true, true, true),
  ('lavender fields', 'Mayfield Lavender barn, weathered timber framed by purple fields', 'medium', 'A', true, true, true),
  ('lavender fields', 'Snowshill lavender-lined path, moss-edged steps to the manor door', 'intimate', 'A', true, false, true),
  ('lavender fields', 'Snowshill stone wall brimming with lavender and trailing roses', 'intimate', 'A', true, false, true),
  ('lavender fields', 'Mayfield lavender rows, a wooden pergola framing the Surrey Hills', 'wide', 'A', true, true, false),
  ('lavender fields', 'Brihuega lavender plateau, a honey-stone chapel amid the violet fields', 'wide', 'S', true, true, false),
  ('lavender fields', 'Hvar island lavender terraces, dry-stone walls above the Adriatic', 'wide', 'A', true, true, false),
  ('lavender fields', 'Hvar town fortress, lavender-covered slopes and ancient stone ramparts', 'medium', 'A', true, true, true),
  ('lavender fields', 'Bridestowe Estate purple rows, a white timber pavilion among them', 'wide', 'S', true, true, false),
  ('lavender fields', 'Bridestowe distillery barn, lavender bundles hanging from aged rafters', 'medium', 'A', true, true, true)
ON CONFLICT (location_key, spot_text) DO NOTHING;
