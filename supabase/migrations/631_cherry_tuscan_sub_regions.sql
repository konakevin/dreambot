-- 631: Cherry Blossoms' and Tuscan Villa's sub-regions catch up with their own pools (Kevin 2026-09-30: "yes, fix those
-- two too"), the same lag as Lavender Fields (mig 630): the romance top-up (mig 614) added places in regions these
-- cards never listed (Nara and Yoshino, regional Japan, Korea, Amsterdam and New York; Florence, Siena and Lucca), so
-- the pool cleanup's on-card check could read them as off-card. Every place named in each active pool is now covered.
-- Data only: no edge function reads sub_regions (the generators and QA tools do). Re-runnable.

UPDATE public.location_cards
SET sub_regions = ARRAY[
  'Kyoto (Philosopher''s Path, Maruyama Park, Heian Shrine, Shirakawa canal, Arashiyama, Tenryu-ji, Gion, Nijo Castle, Daigo-ji, Hirano Shrine, Okazaki Canal, Keage Incline)',
  'Tokyo and Kanto (Chidorigafuchi, Meguro River, Shinjuku Gyoen, Ueno Park, Koishikawa Korakuen)',
  'Mount Fuji (Chureito Pagoda, Arakurayama Sengen Park, Lake Kawaguchiko)',
  'Nara and Yoshino (Kofuku-ji, Nara Park, Ukimido, Kinpusen-ji, Yoshimizu Shrine)',
  'Castles in bloom (Hirosaki, Himeji, Matsumoto, Osaka, Takato)',
  'Regional Japan (Kakunodate, Miharu Takizakura, Kenroku-en, Shiroishi River, Kema Sakuranomiya)',
  'Korea (Jinhae, Gyeongju, Seoul Yeouido)',
  'Beyond Asia (Washington DC Tidal Basin, Vancouver, Bonn, Amsterdam Bloesempark, Brooklyn Botanic Garden, Branch Brook Park)'
]::text[]
WHERE name = 'cherry blossoms';

UPDATE public.location_cards
SET sub_regions = ARRAY[
  'Val d''Orcia (Vitaleta chapel, Poggio Covili cypress road, Podere Belvedere, Bagno Vignoni, Monticchiello, San Quirico d''Orcia, La Foce, Sant''Antimo)',
  'Hilltop towns (Montepulciano, San Gimignano, Pienza, Montalcino, Cortona, Monteriggioni)',
  'Villas and gardens (Villa Medici Fiesole, Boboli, Villa Gamberaia, Bardini Garden, Villa Vignamaggio)',
  'Florence (Piazzale Michelangelo, San Miniato al Monte)',
  'Siena (Piazza del Campo, Torre del Mangia, Duomo, the contrade)',
  'Lucca (Renaissance ramparts, Piazza dell''Anfiteatro, Piazza San Michele)',
  'Chianti wine country (Castello di Brolio, Greve, Radda, Panzano, Lamole, Badia a Passignano, Vertine)'
]::text[]
WHERE name = 'tuscan villa';
