/**
 * Guards the shadow-path contract for the whole fleet.
 *
 * A bot path listed in `shadowPaths[]` is DARK: invisible to the hourly
 * dispatcher, renderable only on demand via `iter-bot --mode <path> --post
 * --shadow`, and posted with `is_public=false` / `is_posted=false`. Going live is
 * meant to be a one-string move into `paths[]` and nothing else — the "faithful
 * xerox" rule.
 *
 * That makes two mistakes cheap to commit and expensive to notice, which is why
 * they are locked here rather than checked by hand:
 *
 *   1. A path in BOTH `shadowPaths[]` and `paths[]`. It is then in live rotation
 *      while every note about it still says "shadow", so unreviewed content
 *      reaches real users and the tracker lies about it. At the time of writing
 *      15 paths built in one push were sitting in shadow awaiting a grade, each
 *      one string away from live.
 *   2. A path in `shadowPaths[]` with no working builder. It looks registered,
 *      but the first render attempt fails — usually a rename, or a merge that
 *      added the config lines without the require. `pathBuilders` is a
 *      module-local const and not exported, so the only way to check the wiring
 *      from outside is to actually call `buildBrief`, which is what this does.
 *
 * This asserts the invariant for EVERY bot, so a new shadow path is covered the
 * moment it is added, with no list here to maintain.
 */

import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const BOTS_DIR = join(__dirname, '../../scripts/bots');

const botNames = readdirSync(BOTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(BOTS_DIR, d.name, 'index.js')))
  .map((d) => d.name);

/** A picker stub shaped like the real one — first entry of every pool, no recency state. */
function stubPicker() {
  const first = <T>(a: T[]): T => a[0];
  return {
    pickWithRecency: first,
    pick: first,
    pickN: (a: unknown[], n: number) => a.slice(0, n),
    getWarnings: () => [] as string[],
  };
}

describe('shadow paths — dark means dark, and registered means renderable', () => {
  it('finds the bot modules', () => {
    expect(botNames.length).toBeGreaterThan(10);
  });

  describe.each(botNames)('%s', (botName) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bot = require(join(BOTS_DIR, botName, 'index.js'));
    const shadow: string[] = bot.shadowPaths || [];

    it('never lists the same path as both shadow and live', () => {
      const live: string[] = bot.paths || [];
      const both = shadow.filter((p) => live.includes(p));
      // A path in both is in live rotation while everything still calls it shadow.
      expect(both).toEqual([]);
    });

    if (shadow.length > 0) {
      it.each(shadow)('shadow path %s resolves to a working builder', (pathKey: string) => {
        // buildBrief is the only external probe of pathBuilders wiring.
        const result = bot.buildBrief({
          path: pathKey,
          sharedDNA: {},
          vibeDirective: 'test mood',
          vibeKey: 'test',
          picker: stubPicker(),
        });

        // botEngine accepts THREE documented return shapes (see the comment at
        // `isDirectPrompt` in scripts/lib/botEngine.js), so this guard must accept
        // all three or it fails a perfectly valid path:
        //   string                                  — the brief (legacy)
        //   { brief, briefMeta }                    — brief + recipe enrichment
        //   { direct: true, prompt, briefMeta? }    — Sonnet bypassed
        // BrickBot `balloon-festival` uses the second form to supply its camera
        // for DLT replay, and asserting a bare string rejected it.
        const text =
          typeof result === 'string' ? result : result && (result.brief || result.prompt);

        expect(typeof text).toBe('string');
        expect((text as string).length).toBeGreaterThan(300);
      });
    }
  });
});
