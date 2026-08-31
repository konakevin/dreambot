# Backfill Seeds — production-depth scaling of QA location pools

> AUTONOMOUS RESUMABLE GRIND (Kevin AFK, started 1970-01-01).
> **To resume after compaction / a killed run:** just run
> `node scripts/backfill-seeds.mjs --n 4` repeatedly until it prints ALL DONE,
> then `node scripts/backfill-seeds.mjs --phase-b` for the final global QA polish.
> Source of truth = this file + live DB spot counts; re-running never double-processes.

## Method (locked)
- Target depth ~100 (match live prod pools). Chunk of 3, headroom-gated.
- Chain per card: scale-pools (gen100→classify→grade→pure-scene→eligibility) → refusal scan → verify → ONE dual (couple) validation render to Kevin's Dreams album.
- Auto fleet-dedup REMOVED (over-flags legit place-themes → gutted proof pools; playbook-confirmed).
- Phase B (once, at end): qa-character-pool + reaudit-pure-scene (global Sonnet polish).
- Everything stays admin_only=dark. cast>=15 / scene>=8 / active>=60 or FLAG.
- SHIP GATE: every pool scaled + its dual validation render OK (review in the album).

## Progress — 64 processed, 0 remaining, phaseB=false

| card | category | active | cast | scene | dual | status |
|---|---|---|---|---|---|---|
| 30a | beach_towns | 90 | 62 | 48 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788077343897.png) | ✅ |
| alpine chalet | high_life | 93 | 22 | 86 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788081735775.png) | ✅ |
| amalfi coast | coastal_escapes | 87 | 56 | 64 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788078319005.png) | ✅ |
| brazil | countries_cultures | 107 | 54 | 92 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788079203044.png) | ✅ |
| cancun | tropical | 54 | 36 | 36 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788083003291.png) | ✅ |
| cape cod | beach_towns | 72 | 42 | 59 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788077628027.png) | ✅ |
| carmel-by-the-sea | beach_towns | 90 | 64 | 73 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788077698800.png) | ✅ |
| cascais portugal | coastal_escapes | 77 | 43 | 58 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788078397414.png) | ✅ |
| catacombs | gothic_haunted | 36 | 29 | 14 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788080938265.png) | ✅ |
| collioure france | coastal_escapes | 58 | 39 | 48 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788078366204.png) | ✅ |
| coney island | beach_towns | 36 | 25 | 29 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788077944026.png) | ✅ |
| egypt | countries_cultures | 93 | 56 | 70 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788079898324.png) | ✅ |
| fiji | tropical | 94 | 36 | 66 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788083040299.png) | ✅ |
| foggy graveyard | gothic_haunted | 93 | 84 | 29 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788080326547.png) | ✅ |
| france | countries_cultures | 120 | 71 | 107 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788079617642.png) | ✅ |
| germany | countries_cultures | 117 | 73 | 99 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788079550904.png) | ✅ |
| ghost town | gothic_haunted | 64 | 31 | 33 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788080653346.png) | ✅ |
| gold rush camp | wild_west | 150 | 97 | 63 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788147218718.jpg) | ✅ |
| gothic cathedral | gothic_haunted | 122 | 110 | 83 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788080975743.png) | ✅ |
| grand estate | high_life | 53 | 41 | 35 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788081439823.png) | ✅ |
| greece | countries_cultures | 110 | 77 | 80 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788079990189.png) | ✅ |
| haleiwa | beach_towns | 60 | 48 | 49 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788076508149.png) | ✅ |
| hanalei | beach_towns | 82 | 35 | 65 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788075796333.png) | ✅ |
| haunted mansion | gothic_haunted | 80 | 65 | 27 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788081184968.png) | ✅ |
| ireland | countries_cultures | 108 | 36 | 97 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788078699451.png) | ✅ |
| italy | countries_cultures | 145 | 104 | 127 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788079942831.png) | ✅ |
| japan | countries_cultures | 120 | 76 | 92 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788079506456.png) | ✅ |
| jungle temple expedition | heroes_adventure | 164 | 132 | 96 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788147154887.png) | ✅ |
| key west | beach_towns | 66 | 54 | 39 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788076784146.png) | ✅ |
| laguna beach | beach_towns | 77 | 49 | 54 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788077662655.png) | ✅ |
| lahaina | beach_towns | 83 | 63 | 70 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788077310455.png) | ✅ |
| malibu | beach_towns | 85 | 52 | 54 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788078038772.png) | ✅ |
| marthas vineyard | beach_towns | 63 | 48 | 43 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788075755869.png) | ✅ |
| monte carlo | high_life | 90 | 61 | 54 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788081976212.png) | ✅ |
| moon base | scifi_space | 94 | 38 | 48 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788082463410.png) | ✅ |
| mount everest | epic_nature | 106 | 42 | 88 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788080257605.png) | ✅ |
| myrtle beach | beach_towns | 76 | 62 | 50 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788076430195.png) | ✅ |
| nantucket | beach_towns | 77 | 40 | 58 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788076462839.png) | ✅ |
| newport rhode island | beach_towns | 99 | 66 | 76 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788076190863.png) | ✅ |
| outer banks | beach_towns | 47 | 36 | 35 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788078000740.png) | ✅ |
| outlaw hideout | wild_west | 86 | 29 | 51 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788083286521.png) | ✅ |
| palm beach florida | beach_towns | 47 | 38 | 38 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788076744772.png) | ✅ |
| prehistoric | through_time | 108 | 83 | 32 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788082723871.png) | ✅ |
| private jet | high_life | 23 | 23 | 19 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788081694643.png) | ✅ |
| railroad town | wild_west | 86 | 35 | 59 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788083247080.png) | ✅ |
| red carpet | high_life | 101 | 85 | 52 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788081937689.png) | ✅ |
| sahara dunes | epic_nature | 131 | 43 | 106 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788147112320.png) | ✅ |
| saloon | wild_west | 94 | 81 | 33 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788083426762.png) | ✅ |
| santa cruz california | beach_towns | 69 | 45 | 58 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788076142533.png) | ✅ |
| santa monica | beach_towns | 88 | 49 | 56 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788077392920.png) | ✅ |
| scotland | countries_cultures | 114 | 59 | 109 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788078767547.png) | ✅ |
| sky penthouse | high_life | 79 | 36 | 18 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788082214667.png) | ✅ |
| south beach miami | beach_towns | 100 | 72 | 70 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788076832801.png) | ✅ |
| spain | countries_cultures | 133 | 74 | 118 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788079156932.png) | ✅ |
| st ives cornwall | coastal_escapes | 82 | 45 | 55 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788078662268.png) | ✅ |
| starship bridge | scifi_space | 68 | 53 | 27 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788083653354.png) | ✅ |
| superyacht | high_life | 115 | 73 | 102 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788081250377.png) | ✅ |
| sydney | iconic_cities | 91 | 67 | 75 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788082254512.png) | ✅ |
| tahiti | tropical | 126 | 60 | 94 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788082764206.png) | ✅ |
| the hamptons | beach_towns | 62 | 33 | 53 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788076082739.png) | ✅ |
| vampire castle | gothic_haunted | 85 | 43 | 68 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788080362288.png) | ✅ |
| vietnam | countries_cultures | 111 | 49 | 87 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788079112166.png) | ✅ |
| vineyard estate | high_life | 88 | 46 | 67 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788081475786.png) | ✅ |
| witch's cottage | gothic_haunted | 105 | 91 | 22 | [view](https://jimftynwrinwenonjrlj.supabase.co/storage/v1/object/public/uploads/eab700d8-f11a-4f47-a3a1-addda6fb67ec/1788080618929.png) | ✅ |

## ✅ All cards scaled — run `--phase-b` for the final global QA polish.
